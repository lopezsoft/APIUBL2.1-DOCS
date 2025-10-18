# 🔧 Guía de Configuración de Ambiente (.env)

## 📋 Archivos de Configuración

Tu proyecto contiene **3 archivos de configuración de ambiente**:

| Archivo | Propósito | Uso |
|---------|-----------|-----|
| `.env.local` | Variables locales (desarrollo) | `npm run dev` |
| `.env.production` | Variables de producción | `npm run build && npm start` |
| `.env.example` | Plantilla de referencia | Documentación |

---

## ⚙️ Configuración por Ambiente

### 🛠️ Desarrollo (.env.local)

```bash
REACT_APP_API_BACKEND=http://localhost:3001
PORT=3001
NODE_ENV=development
```

**Uso:**
```bash
npm run dev
# Se conecta localmente a http://localhost:3001
```

---

### 🚀 Producción (.env.production)

```bash
REACT_APP_API_BACKEND=https://docs.matias-api.com
PORT=443
NODE_ENV=production
SSL_ENABLED=true
```

**Dominio:** `docs.matias-api.com`  
**Protocolo:** HTTPS  
**Puerto:** 443 (SSL/TLS)

**Uso:**
```bash
npm run build
NODE_ENV=production node server.js
```

---

## 🔐 Claves de API (MUY IMPORTANTE)

### ⚠️ Valores que DEBES cambiar

En `.env.production`, estos valores DEBEN ser reemplazados con valores reales:

```bash
# OpenAI
OPENAI_API_KEY=sk-proj-YOUR_PRODUCTION_KEY_HERE

# JWT
JWT_SECRET=YOUR_SECURE_JWT_SECRET_HERE_CHANGE_THIS

# AWS (si aplica)
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

# Database (si aplica)
DB_PASSWORD=YOUR_SECURE_PASSWORD_HERE

# Sentry (si aplica)
SENTRY_DSN=https://YOUR_SENTRY_KEY@sentry.io/YOUR_PROJECT_ID
```

### ✅ Valores Configurados

Estos ya están correctamente configurados para `docs.matias-api.com`:

```bash
REACT_APP_API_BACKEND=https://docs.matias-api.com
APP_URL=https://docs.matias-api.com
CORS_ORIGIN=https://docs.matias-api.com
DOCUSAURUS_URL=https://docs.matias-api.com
SSL_ENABLED=true
SSL_CERT_PATH=/etc/ssl/certs/docs.matias-api.com.crt
SSL_KEY_PATH=/etc/ssl/private/docs.matias-api.com.key
```

---

## 📝 Endpoints Configurados

### APIs Documentadas

```bash
# Base
https://docs.matias-api.com/api

# Endpoints específicos
REACT_APP_API_CHAT_ENDPOINT=/api/ai/chat
REACT_APP_API_SEARCH_ENDPOINT=/api/ai/search
REACT_APP_API_DOCS_ENDPOINT=/api/ai/docs
REACT_APP_API_HEALTH_CHECK=/api/health
```

### URLs Completas

| Endpoint | URL | Propósito |
|----------|-----|----------|
| Health Check | `https://docs.matias-api.com/api/health` | Verificar estado |
| Search | `https://docs.matias-api.com/api/ai/search` | Búsqueda en docs |
| Chat | `https://docs.matias-api.com/api/ai/chat` | Chat con IA |
| Docs | `https://docs.matias-api.com/api/ai/docs/{path}` | Obtener documento |

---

## 🔗 Configuración CORS

**Origen permitido:**
```bash
CORS_ORIGIN=https://docs.matias-api.com
CORS_CREDENTIALS=true
CORS_MAX_AGE=86400
```

Esto significa que solo requests desde `https://docs.matias-api.com` serán permitidos.

---

## 🛡️ SSL/TLS en Producción

### Configuración Actual

```bash
SSL_ENABLED=true
SSL_CERT_PATH=/etc/ssl/certs/docs.matias-api.com.crt
SSL_KEY_PATH=/etc/ssl/private/docs.matias-api.com.key
SSL_PROTOCOL=TLSv1.2
PORT=443
```

### ¿Cómo obtener certificado SSL?

**Opción 1: Let's Encrypt (RECOMENDADO - Gratis)**
```bash
# En Plesk (automático)
# Panel Plesk → Hosting & Subscriptions → docs.matias-api.com
# → SSL/TLS Certificates → Add SSL/TLS Certificate

# O manual con Certbot
sudo certbot certonly --standalone -d docs.matias-api.com
```

**Opción 2: Certificado pagado**
- Comprar de proveedor (GoDaddy, DigiCert, etc.)
- Instalar en `/etc/ssl/certs/docs.matias-api.com.crt`
- Instalar clave privada en `/etc/ssl/private/docs.matias-api.com.key`

---

## 🔐 Seguridad

### Rate Limiting (Protección de fuerza bruta)

```bash
SECURITY_RATE_LIMIT_ENABLED=true
SECURITY_RATE_LIMIT_WINDOW=15m
SECURITY_RATE_LIMIT_MAX_REQUESTS=100
```

Máximo 100 requests por IP cada 15 minutos.

### Helmet (Headers de seguridad)

```bash
SECURITY_HELMET_ENABLED=true
```

Protege contra:
- XSS (Cross-Site Scripting)
- Clickjacking
- MIME-type sniffing
- etc.

### JWT (Autenticación)

```bash
JWT_SECRET=YOUR_SECURE_JWT_SECRET_HERE_CHANGE_THIS
JWT_EXPIRY=24h
```

⚠️ **IMPORTANTE:** Cambiar `JWT_SECRET` con un valor seguro aleatorio:

```bash
# Generar JWT_SECRET seguro
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Salida: a1b2c3d4e5f6... (copiar en JWT_SECRET)
```

---

## 📊 Logging y Monitoreo

### Logging en Producción

```bash
LOG_LEVEL=info
LOG_FORMAT=json
LOG_OUTPUT_FILE=/var/log/matias-api/app.log
LOG_MAX_SIZE=10m
LOG_MAX_FILES=10
```

Logs guardados en `/var/log/matias-api/app.log`

**Ver logs en tiempo real:**
```bash
tail -f /var/log/matias-api/app.log
```

### Error Tracking (Sentry)

```bash
ENABLE_ERROR_TRACKING=true
SENTRY_DSN=https://YOUR_SENTRY_KEY@sentry.io/YOUR_PROJECT_ID
```

**Para habilitar:**
1. Crear cuenta en https://sentry.io
2. Crear proyecto
3. Obtener DSN
4. Actualizar en `.env.production`

---

## 💾 Caching

### Redis (Recomendado para producción)

```bash
CACHE_ENABLED=true
CACHE_TTL=3600
CACHE_REDIS_URL=redis://localhost:6379/0
```

**Instalar Redis en Plesk:**
```bash
sudo yum install redis
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

### En Memoria (Si no hay Redis)

```bash
CACHE_ENABLED=true
CACHE_TYPE=memory
```

Menos eficiente pero funciona sin dependencias adicionales.

---

## 🎯 Feature Flags

Características que pueden habilitarse/deshabilitarse:

```bash
FEATURE_AI_SEARCH=true           # Búsqueda con IA
FEATURE_AI_CHAT=true             # Chat con IA
FEATURE_DOCUMENTATION_EXPORT=true # Descargar documentación
FEATURE_ANALYTICS=true           # Google Analytics
FEATURE_ADVANCED_FILTERING=true  # Filtros avanzados
```

---

## 📱 Configuración de Docusaurus

```bash
DOCUSAURUS_BASEURL=/
DOCUSAURUS_URL=https://docs.matias-api.com
DOCUSAURUS_LOCALE=es
DOCUSAURUS_DEFAULT_LOCALE=es
```

Configuración específica para la plataforma de documentación.

---

## ✅ Checklist de Deployment

Antes de publicar en producción:

- [ ] Copiar `.env.production` a servidor
- [ ] Cambiar `OPENAI_API_KEY` con clave real
- [ ] Cambiar `JWT_SECRET` con valor aleatorio seguro
- [ ] Instalar certificado SSL
- [ ] Verificar `CORS_ORIGIN=https://docs.matias-api.com`
- [ ] Configurar logging
- [ ] Instalar Redis (si se usa)
- [ ] Configurar backups automáticos
- [ ] Prueba de carga: `npm run build && NODE_ENV=production node server.js`
- [ ] Verificar health check: `curl https://docs.matias-api.com/api/health`
- [ ] Prueba de APIs: Ejecutar request a `/api/ai/search`

---

## 🚀 Desplegar en Producción

### 1. Copiar .env.production al servidor

```bash
# En tu máquina local
scp .env.production usuario@docs.matias-api.com:/home/usuario/app/

# O via Plesk
# Panel → Files → .env.production
```

### 2. Cargar variables en el servidor

```bash
# En el servidor
cd /var/www/vhosts/docs.matias-api.com/httpdocs
cp /home/usuario/app/.env.production .env

# Verificar
cat .env | head -20
```

### 3. Compilar y iniciar

```bash
# Compilar
npm run build

# Iniciar con PM2
pm2 start "NODE_ENV=production node server.js" --name "matias-docs"
pm2 save
```

### 4. Verificar funcionamiento

```bash
# Health check
curl https://docs.matias-api.com/api/health

# Ver logs
pm2 logs matias-docs

# Ver procesos
pm2 status
```

---

## 🐛 Troubleshooting

### Error: "OPENAI_API_KEY no definida"

```bash
# Solución
grep OPENAI_API_KEY .env.production
# Si no aparece o dice "YOUR_PRODUCTION_KEY_HERE", reemplazar
```

### Error: "SSL_CERT_PATH no encontrado"

```bash
# Solución
ls -la /etc/ssl/certs/docs.matias-api.com.crt
# Si no existe, generar certificado Let's Encrypt
```

### Error: "CORS error" en cliente

```bash
# Solución
# Verificar que CORS_ORIGIN coincida con dominio
grep CORS_ORIGIN .env.production
# Debe ser: CORS_ORIGIN=https://docs.matias-api.com
```

### Error: "Redis connection refused"

```bash
# Solución
redis-cli ping
# Si falla, instalar: sudo yum install redis && sudo systemctl start redis-server
# O cambiar a: CACHE_TYPE=memory
```

---

## 📞 Archivos Relacionados

- `.env.production` - Configuración de producción
- `.env.example` - Plantilla de referencia
- `.env.local` - Configuración local
- `server.js` - Servidor Node.js
- `docusaurus.config.ts` - Configuración Docusaurus

---

## ✨ Resumen Rápido

| Acción | Comando |
|--------|---------|
| **Desarrollo** | `npm run dev` (usa `.env.local`) |
| **Compilar** | `npm run build` |
| **Producción** | `NODE_ENV=production node server.js` |
| **Ver logs** | `pm2 logs` |
| **Health check** | `curl https://docs.matias-api.com/api/health` |
| **Generar JWT_SECRET** | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |

---

**Versión:** 1.0  
**Fecha:** Octubre 17, 2025  
**Dominio:** docs.matias-api.com
