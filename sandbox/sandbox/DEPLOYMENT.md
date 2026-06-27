# Guia de Despliegue y Configuracion del Sandbox

Guia completa para desplegar y configurar el sandbox de MATIAS API. El sandbox es un **mirror deployment** del mismo codebase con diferentes variables de entorno.

---

## 1. Arquitectura del Sandbox

```
                    ┌──────────────────┐     ┌──────────────────┐
                    │   PRODUCCION     │     │     SANDBOX      │
                    │ api-v2.matias-   │     │ sandbox-api.     │
                    │ api.com          │     │ matias-api.com   │
                    └────────┬─────────┘     └────────┬─────────┘
                             │                         │
                    ┌────────┴─────────┐     ┌────────┴─────────┐
                    │  SANDBOX_MODE=   │     │  SANDBOX_MODE=   │
                    │     false        │     │     true         │
                    └────────┬─────────┘     └────────┬─────────┘
                             │                         │
              ┌──────────────┼──────────────┐          │
              │              │              │          │
         ┌────┴────┐   ┌────┴────┐   ┌────┴────┐  ┌──┴──────────┐
         │ RDS Prod│   │ S3 Prod │   │ SES Prod│  │ RDS Sandbox │
         │ matias_ │   │ matias- │   │ @matias │  │ matias_     │
         │ prod    │   │ invoices│   │ api.com │  │ sandbox     │
         └─────────┘   └─────────┘   └─────────┘  └─────────────┘
```

**Principio fundamental:** El sandbox usa el **mismo codigo** que produccion. La unica diferencia es la configuracion de entorno (`.env`).

### Diferencias funcionales

| Componente | Produccion | Sandbox |
|---|---|---|
| DIAN Transmitter | `DianRealTransmitter` (SOAP real) | `FakeDianTransmitter` (simulado) |
| RADIAN Events SOAP | `SendEvent`, `GetStatusEvents`, `GetXmlByDocumentKey` reales | `SandboxResponseFactory` (simulado) |
| Certificados | Emitidos por CA real (ONAC) | Auto-generados por Sandbox Test CA |
| Magic Values | Header `X-Sandbox-Force-Status` ignorado | 32 magic values disponibles |
| Wompi (Pagos) | Claves de produccion | Claves de test (`pub_test_*`) |
| TRM (Tasa cambio) | API externa real | Valores de fallback |
| Sync usuarios | Envia al sandbox (si configurado) | Recibe de produccion |
| BD | `matias_prod` | `matias_sandbox` (misma estructura) |
| S3 | `matias-invoices` | `matias-sandbox-invoices` (lifecycle 7 dias) |
| Respuesta header | No incluye header de ambiente | `X-MATIAS-Environment: sandbox` |

---

## 2. Pre-requisitos

### Infraestructura AWS necesaria

- **EC2 o ECS:** Instancia separada para el sandbox (puede ser mas pequena que produccion)
- **RDS MySQL 8.0:** Instancia separada con BD `matias_sandbox`
- **Redis (ElastiCache):** Instancia o cluster separado (para colas, cache, nonces HMAC)
- **S3 Buckets:** 3 buckets separados:
  - `matias-sandbox-invoices` (XMLs y PDFs)
  - `matias-sandbox-attachments` (adjuntos de usuario)
  - `matias-sandbox-custody` (custodia de documentos)
- **SES:** Identidad de email verificada: `sandbox@matias-api.com`
- **Route53 / ALB:** Subdominio `sandbox-api.matias-api.com`
- **Certificado SSL:** ACM certificate para `sandbox-api.matias-api.com`

### Software requerido

- PHP >= 8.1.6 con extensiones: `dom`, `openssl`, `simplexml`, `zip`, `gd`
- Composer 2.x
- Node.js / npm (solo para Puppeteer/Chrome PDF)
- Google Chrome / Chromium (para generacion de PDFs)

---

## 3. Configuracion del Entorno

### 3.1 Variables de entorno del Sandbox (.env)

Copia `.env.sandbox.example` como base y ajusta los valores:

```env
# ===========================================
# Identidad del entorno
# ===========================================
APP_NAME="MATIAS API Sandbox"
APP_ENV=sandbox
APP_DEBUG=false               # false en produccion
APP_URL=https://sandbox-api.matias-api.com

# ===========================================
# SANDBOX MODE - CRITICO
# ===========================================
SANDBOX_MODE=true

# Sync: secreto HMAC compartido con produccion
SANDBOX_SYNC_SECRET=<hex-64-caracteres-generado-con-openssl-rand-hex-32>
# IPs de la instancia de produccion (las que pueden enviar sync)
SANDBOX_SYNC_ALLOWED_IPS=10.0.1.50,10.0.1.51

# ===========================================
# Base de datos
# ===========================================
DB_HOST=<sandbox-rds-endpoint>.rds.amazonaws.com
DB_PORT=3306
DB_DATABASE=matias_sandbox
DB_USERNAME=matias_sandbox_user
DB_PASSWORD=<password-seguro>

# ===========================================
# Redis
# ===========================================
REDIS_HOST=<sandbox-redis-endpoint>.cache.amazonaws.com
REDIS_PASSWORD=null
REDIS_PORT=6379
REDIS_DB=0

# ===========================================
# AWS S3
# ===========================================
AWS_ACCESS_KEY_ID=<sandbox-iam-access-key>
AWS_SECRET_ACCESS_KEY=<sandbox-iam-secret-key>
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=matias-sandbox-invoices
AWS_BUCKET_ATTACHMENTS=matias-sandbox-attachments
AWS_BUCKET_CUSTODY=matias-sandbox-custody

# ===========================================
# Email (SES)
# ===========================================
MAIL_MAILER=ses
MAIL_FROM_ADDRESS=sandbox@matias-api.com
MAIL_FROM_NAME="MATIAS API Sandbox"

# ===========================================
# Cache / Queue
# ===========================================
CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis

# ===========================================
# Wompi (Pagos - Claves de TEST)
# ===========================================
WOMPI_ENVIRONMENT=sandbox
WOMPI_PUBLIC_KEY=pub_test_<tu-clave-publica-test>
WOMPI_PRIVATE_KEY=prv_test_<tu-clave-privada-test>

# ===========================================
# Rate Limiting
# ===========================================
API_RATE_LIMIT_PER_MINUTE=90
TOKEN_RATE_LIMIT_PER_DAY=10

# ===========================================
# PDF Generation
# ===========================================
CHROME_EXECUTABLE_PATH=/usr/bin/chromium
CHROME_POOL_ENABLED=false

# ===========================================
# Membresias - DESHABILITADAS en sandbox
# ===========================================
# Decision de diseno: el sandbox NO valida membresias, planes ni limites
# diarios. Esto sigue el estandar de la industria (Stripe, Twilio, PayPal)
# donde el sandbox es una herramienta de onboarding sin friccion comercial.
# Ver seccion 8 "Decisiones de Diseno" de este documento.
USE_LEGACY_MEMBERSHIP=true
```

### 3.2 Variables de entorno en Produccion (.env)

En produccion, agrega SOLO estas variables relacionadas al sandbox:

```env
# Sincronizacion de usuarios hacia el sandbox
SANDBOX_SYNC_URL=https://sandbox-api.matias-api.com/internal/sync/users
SANDBOX_SYNC_SECRET=<mismo-hex64-que-en-sandbox>

# IMPORTANTE: Esto DEBE ser false en produccion
SANDBOX_MODE=false
```

---

## 4. Despliegue Paso a Paso

### Paso 1: Preparar la Base de Datos

```bash
# Crear la BD en el RDS de sandbox
mysql -h <sandbox-rds-endpoint> -u root -p
> CREATE DATABASE matias_sandbox CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
> CREATE USER 'matias_sandbox_user'@'%' IDENTIFIED BY '<password-seguro>';
> GRANT ALL PRIVILEGES ON matias_sandbox.* TO 'matias_sandbox_user'@'%';
> FLUSH PRIVILEGES;
```

### Paso 2: Clonar y Configurar

```bash
# En la instancia del sandbox
cd /var/www
git clone <repo-url> matias-sandbox
cd matias-sandbox

# Instalar dependencias
composer install --no-dev --optimize-autoloader

# Copiar y editar configuracion
cp .env.sandbox.example .env
# Editar .env con los valores correctos (ver seccion 3.1)
nano .env

# Generar key de aplicacion
php artisan key:generate

# Ejecutar migraciones
php artisan migrate --force

# Ejecutar seeders (tablas parametricas DIAN)
php artisan db:seed --force
```

### Paso 3: Generar Certificado de Prueba (CA del Sandbox)

```bash
# IMPORTANTE: Solo funciona si APP_ENV=sandbox y SANDBOX_MODE=true
php artisan sandbox:generate-test-ca

# Asignar certs a companies existentes (si las hay)
php artisan sandbox:provision-certs
```

### Paso 4: Configurar Passport (Tokens)

```bash
# Generar llaves de encriptacion para JWT
php artisan passport:keys --force

# Crear el Personal Access Client
php artisan passport:client --personal --no-interaction
```

### Paso 5: Permisos y Almacenamiento

```bash
# Crear directorios necesarios
mkdir -p storage/app/certificates
mkdir -p storage/app/sandbox/pki
mkdir -p storage/framework/{sessions,views,cache}
mkdir -p bootstrap/cache

# Permisos
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# Crear symlink de storage
php artisan storage:link
```

### Paso 6: Cache de Configuracion

```bash
# Optimizar para produccion
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
```

### Paso 7: Configurar Supervisor (Queue Worker)

```ini
# /etc/supervisor/conf.d/matias-sandbox-worker.conf
[program:matias-sandbox-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/matias-sandbox/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasap=true
numprocs=2
user=www-data
redirect_stderr=true
stdout_logfile=/var/log/matias-sandbox-worker.log
```

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start matias-sandbox-worker:*
```

### Paso 8: Configurar Nginx

```nginx
server {
    listen 443 ssl http2;
    server_name sandbox-api.matias-api.com;

    ssl_certificate     /etc/letsencrypt/live/sandbox-api.matias-api.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/sandbox-api.matias-api.com/privkey.pem;

    root /var/www/matias-sandbox/public;
    index index.php;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

---

## 5. Configuracion de Produccion (Sync de Usuarios)

Para que los usuarios registrados en produccion se repliquen automaticamente al sandbox:

### 5.1 Generar secreto compartido

```bash
# Generar un secreto HMAC de 64 caracteres hex
openssl rand -hex 32
# Ejemplo: a1b2c3d4e5f6...64 caracteres
```

### 5.2 Configurar en produccion (.env)

```env
SANDBOX_SYNC_URL=https://sandbox-api.matias-api.com/internal/sync/users
SANDBOX_SYNC_SECRET=<hex64-generado>
```

### 5.3 Configurar en sandbox (.env)

```env
SANDBOX_SYNC_SECRET=<mismo-hex64>
SANDBOX_SYNC_ALLOWED_IPS=<IP-de-produccion>
```

### 5.4 Verificar el sync

```bash
# Desde el servidor de produccion, probar la conectividad
curl -s -o /dev/null -w "%{http_code}" \
  https://sandbox-api.matias-api.com/internal/sync/users
# Debe retornar 403 (falta HMAC) - esto confirma que la ruta esta activa
```

---

## 6. Verificacion Post-Despliegue

### Checklist obligatorio

```bash
# 1. Verificar que SANDBOX_MODE=true esta activo
php artisan tinker --execute="echo config('sandbox.enabled') ? 'SANDBOX ON' : 'SANDBOX OFF';"
# Debe imprimir: SANDBOX ON

# 2. Verificar que la CA del sandbox existe
php artisan tinker --execute="echo App\Services\Sandbox\DummyCertificateProvider::caExists() ? 'CA OK' : 'CA MISSING';"
# Debe imprimir: CA OK

# 3. Verificar binding del transmitter
php artisan tinker --execute="echo get_class(app(App\Interfaces\DianTransmitterInterface::class));"
# Debe imprimir: App\Services\Dian\FakeDianTransmitter

# 4. Probar health endpoint
curl -s https://sandbox-api.matias-api.com/api/ubl2.1/health
# Debe retornar 200

# 5. Verificar header de ambiente
curl -sI https://sandbox-api.matias-api.com/api/ubl2.1/health | grep X-MATIAS
# Debe mostrar: X-MATIAS-Environment: sandbox
```

### Test funcional rapido

```bash
# Login
TOKEN=$(curl -s -X POST https://sandbox-api.matias-api.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"tu@email.com","password":"tu-password"}' | jq -r '.access_token')

# Enviar factura de prueba (happy path)
curl -s -X POST https://sandbox-api.matias-api.com/api/ubl2.1/invoice \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d @docs/sandbox/jsons/jsons-billing/invoice.json
# Debe retornar StatusCode "00" (ACCEPTED)

# Probar magic value
curl -s -X POST https://sandbox-api.matias-api.com/api/ubl2.1/invoice \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Sandbox-Force-Status: ERROR_REJECTED" \
  -H "Content-Type: application/json" \
  -d @docs/sandbox/jsons/jsons-billing/invoice.json
# Debe retornar StatusCode "99" (REJECTED)
```

---

## 7. Seguridad

### Aislamiento garantizado (4 capas)

1. **Config Guard:** Todo el codigo sandbox esta detras de `config('sandbox.enabled')` que por defecto es `false`
2. **DI Container:** `FakeDianTransmitter` nunca se instancia si `SANDBOX_MODE=false`
3. **SandboxResponseFactory:** Las llamadas SOAP de eventos RADIAN (`SendEvent`, `GetStatusEvents`, `GetXmlByDocumentKey`) se interceptan con `config('sandbox.enabled')` en `EventDeliveryService`, `DocumentReceptionService` y `XmlExtractDataService`
4. **CertificateFingerprintGuard:** Impide usar certs de sandbox en produccion (lanza `RuntimeException`)
5. **Environment Guards:** Artisan commands de sandbox requieren `APP_ENV=sandbox` + `SANDBOX_MODE=true`

### Buenas practicas

- **NUNCA** configurar `SANDBOX_MODE=true` en la instancia de produccion
- **NUNCA** compartir la BD entre produccion y sandbox
- **NUNCA** usar certificados de sandbox en produccion (el guard lo bloquearia)
- Mantener el secreto HMAC (`SANDBOX_SYNC_SECRET`) en AWS Secrets Manager
- Rotar el secreto HMAC cada 90 dias
- Revisar periodicamente `SANDBOX_SYNC_ALLOWED_IPS`

---

## 8. Decisiones de Diseno

### 8.1 Membresias y planes comerciales: DESHABILITADOS en sandbox

**Decision:** El sandbox NO valida membresias, planes, limites diarios ni features premium.

**Implementacion:** `USE_LEGACY_MEMBERSHIP=true` en el `.env` del sandbox, lo cual hace bypass de los tres middleware de control comercial:

| Middleware | Funcion en produccion | Comportamiento en sandbox |
|---|---|---|
| `check.membership` | Verifica plan activo | **Bypass** (no valida) |
| `check.daily.limit` | Limita docs/dia en plan FREE | **Bypass** (sin limite) |
| `check.free.features` | Restringe XML download, templates | **Bypass** (todo habilitado) |

**Justificacion — Estandar de la industria:**

| Proveedor | Cobra en sandbox? | Estrategia |
|---|---|---|
| Stripe | NO | Test mode gratis, sin limites de plan |
| Twilio | NO | Sandbox gratis, solo creditos trial |
| PayPal | NO | Sandbox completamente gratis |
| Conekta | NO | Modo test sin validacion de suscripcion |
| MercadoPago | NO | Sandbox libre |
| DIAN (Habilitacion) | NO | SetPruebas gratuito |

**Razon tecnica:** El proposito del sandbox es reducir la friccion de integracion. Si un integrador debe contratar un plan para poder probar la API, el sandbox pierde su razon de existir. El integrador debe poder probar **todas** las funcionalidades (incluidas las premium) para tomar una decision de compra informada.

### 8.2 Controles que SI se aplican en sandbox

| Control | Aplica? | Justificacion |
|---|---|---|
| **Rate limiting** (90 req/min) | SI | Proteccion de infraestructura contra abuso |
| **Autenticacion** (Bearer token) | SI | Seguridad basica, trazabilidad |
| **Validacion de payload** | SI | El integrador necesita saber si su JSON es correcto |
| **CORS** | SI | Seguridad del navegador |
| **Token rate limit** (10/dia) | SI | Evitar generacion masiva de tokens |
| **Membresia/Plan comercial** | NO | Friccion innecesaria (ver 8.1) |
| **Limite diario de docs** | NO | Contraproducente para pruebas |
| **Features premium bloqueadas** | NO | El integrador debe probar TODO |

### 8.3 Configuracion critica

En el `.env` del sandbox, estas dos variables **deben** estar configuradas asi:

```env
# Deshabilita validacion de membresias (estandar de la industria)
USE_LEGACY_MEMBERSHIP=true

# Habilita modo sandbox (activa FakeDianTransmitter + magic values)
SANDBOX_MODE=true
```

En produccion, la configuracion es la opuesta:

```env
# Produccion: control de membresias ACTIVO
USE_LEGACY_MEMBERSHIP=false

# Produccion: sandbox DESACTIVADO
SANDBOX_MODE=false
```

---

## 9. Mantenimiento

### Actualizaciones de codigo

El sandbox usa el mismo codebase que produccion. Para actualizar:

```bash
cd /var/www/matias-sandbox
git pull origin main
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
sudo supervisorctl restart matias-sandbox-worker:*
```

### Limpieza periodica

Los buckets S3 del sandbox deben tener lifecycle policy de 7 dias:

```json
{
  "Rules": [{
    "ID": "sandbox-cleanup",
    "Status": "Enabled",
    "Expiration": { "Days": 7 }
  }]
}
```

### Rotacion de la CA del sandbox

```bash
# Regenerar CA + reasignar certs a todas las companies existentes
php artisan sandbox:generate-test-ca --rotate
```

### Monitoreo

- Verificar logs en `storage/logs/laravel.log`
- Monitorear cola de Redis: `php artisan queue:monitor redis`
- Dashboard de Laravel Telescope (si habilitado): `/telescope`

---

## 10. Troubleshooting

| Problema | Causa | Solucion |
|---|---|---|
| `FakeDianTransmitter` en produccion | `SANDBOX_MODE=true` en prod | Verificar `.env`: `SANDBOX_MODE=false` |
| Sync de usuarios falla 403 | IP no autorizada | Verificar `SANDBOX_SYNC_ALLOWED_IPS` |
| Sync de usuarios falla 401 | HMAC secret diferente | Verificar que el secret es identico en ambos entornos |
| `sandbox:generate-test-ca` falla | `APP_ENV` no es `sandbox` | Verificar `.env`: `APP_ENV=sandbox` |
| Cert de sandbox en produccion | RuntimeException | `CertificateFingerprintGuard` funciona correctamente |
| Magic values no funcionan | Sandbox deshabilitado | Verificar `SANDBOX_MODE=true` en el sandbox |
| Header `X-MATIAS-Environment` falta | Middleware no activo | Verificar `SandboxEnvironmentHeaderMiddleware` en Kernel |

---

## 11. Coleccion Postman

Importa la coleccion de Postman para pruebas rapidas:

```
tests/postman/sandbox-quickstart.postman_collection.json
```

Configura las variables de entorno en Postman:
- `sandbox_url`: `https://sandbox-api.matias-api.com/api/ubl2.1`
- `prod_url`: `https://api-v2.matias-api.com/api/ubl2.1`
- `token`: Tu PAT de sandbox
- `trackId`: Se llena automaticamente tras enviar un documento

### Carpetas de la coleccion (41 requests)

| # | Carpeta | Requests |
|---|---|---|
| 1 | Produccion | 1 (Register) |
| 2 | Auth | 2 (Login, Generate PAT) |
| 3 | Facturacion (errores) | 22 (happy path + 14 error scenarios) |
| 4 | PDF & Status | 3 |
| 5 | Notas Credito/Debito | 2 |
| 6 | Documento Soporte | 2 |
| 7 | Nomina Electronica | 3 |
| 8 | Auto-Increment | 2 |
| 9 | POS Electronico | 5 |
| 10 | DS No Residente | 2 |

---

## 12. Documentacion Relacionada

- [QUICKSTART.md](./QUICKSTART.md) - Guia rapida para integradores
- [MAGIC-VALUES.md](./MAGIC-VALUES.md) - Lista completa de 32 magic values
- [TEST-CERT.md](./TEST-CERT.md) - Detalles del certificado de prueba
- `docs/sandbox/jsons/` - Payloads de ejemplo para cada tipo de documento
