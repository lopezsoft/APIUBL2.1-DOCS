# Quickstart — MATIAS API Sandbox

Guia rapida para integrar con el sandbox de MATIAS API.

## 1. Crear cuenta

Registra tu cuenta en **produccion**. Se replicara automaticamente al sandbox.

```bash
curl -X POST https://api-v2.matias-api.com/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Tu Nombre",
    "last_name": "Tu Apellido",
    "company_name": "Mi Empresa SAS",
    "email": "tu@email.com",
    "password": "tu-password-seguro",
    "password_confirmation": "tu-password-seguro",
    "dni": "900123456"
  }'
```

## 2. Login en sandbox

Usa las **mismas credenciales** que en produccion:

```bash
curl -X POST {{SANDBOX_URL}}/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tu@email.com",
    "password": "tu-password-seguro"
  }'
```

Respuesta:
```json
{
  "access_token": "eyJ...",
  "token_type": "Bearer"
}
```

## 3. Generar un PAT (Personal Access Token)

```bash
curl -X POST {{SANDBOX_URL}}/api/ubl2.1/auth/token \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json" \
  -d '{"name": "Mi Token de Prueba"}'
```

> El token que recibes es un JWT estandar de Laravel Passport. Guardalo de forma segura, ya que no podras verlo de nuevo.

## 4. Enviar documentos electronicos

El sandbox soporta **todos los tipos de documento** de la API. A continuacion los endpoints disponibles:

### 4.1 Factura electronica

```bash
curl -X POST {{SANDBOX_URL}}/api/ubl2.1/invoice \
  -H "Authorization: Bearer {tu_token}" \
  -H "Content-Type: application/json" \
  -d @tu-factura.json
```

### 4.2 Notas credito y debito

```bash
# Nota Credito
curl -X POST {{SANDBOX_URL}}/api/ubl2.1/notes/credit \
  -H "Authorization: Bearer {tu_token}" \
  -H "Content-Type: application/json" \
  -d @nota-credito.json

# Nota Debito
curl -X POST {{SANDBOX_URL}}/api/ubl2.1/notes/debit \
  -H "Authorization: Bearer {tu_token}" \
  -H "Content-Type: application/json" \
  -d @nota-debito.json
```

### 4.3 Documento soporte y nota de ajuste

```bash
# Documento Soporte
curl -X POST {{SANDBOX_URL}}/api/ubl2.1/ds/document \
  -H "Authorization: Bearer {tu_token}" \
  -H "Content-Type: application/json" \
  -d @documento-soporte.json

# Nota de Ajuste al Documento Soporte
curl -X POST {{SANDBOX_URL}}/api/ubl2.1/ds/adjustment-note \
  -H "Authorization: Bearer {tu_token}" \
  -H "Content-Type: application/json" \
  -d @nota-ajuste-ds.json
```

### 4.4 Nomina electronica

```bash
# Nomina individual
curl -X POST {{SANDBOX_URL}}/api/ubl2.1/ep/payroll \
  -H "Authorization: Bearer {tu_token}" \
  -H "Content-Type: application/json" \
  -d @nomina.json

# Reemplazo de nomina
curl -X POST {{SANDBOX_URL}}/api/ubl2.1/ep/payroll/replace \
  -H "Authorization: Bearer {tu_token}" \
  -H "Content-Type: application/json" \
  -d @nomina-replace.json

# Eliminacion de nomina
curl -X POST {{SANDBOX_URL}}/api/ubl2.1/ep/payroll/delete \
  -H "Authorization: Bearer {tu_token}" \
  -H "Content-Type: application/json" \
  -d @nomina-delete.json
```

### 4.5 Documentos con consecutivo automatico (auto-increment)

Todos los endpoints de auto-incremento tambien funcionan en el sandbox:

```bash
# Factura con consecutivo automatico
curl -X POST {{SANDBOX_URL}}/api/ubl2.1/auto-increment/invoices \
  -H "Authorization: Bearer {tu_token}" \
  -H "Content-Type: application/json" \
  -d @factura-auto.json

# Nota Credito con consecutivo automatico
curl -X POST {{SANDBOX_URL}}/api/ubl2.1/auto-increment/credit-notes \
  -H "Authorization: Bearer {tu_token}" \
  -d @nc-auto.json

# Nota Debito con consecutivo automatico
curl -X POST {{SANDBOX_URL}}/api/ubl2.1/auto-increment/debit-notes \
  -H "Authorization: Bearer {tu_token}" \
  -d @nd-auto.json

# Documento Soporte con consecutivo automatico
curl -X POST {{SANDBOX_URL}}/api/ubl2.1/auto-increment/support-documents \
  -H "Authorization: Bearer {tu_token}" \
  -d @ds-auto.json

# Nota de Ajuste con consecutivo automatico
curl -X POST {{SANDBOX_URL}}/api/ubl2.1/auto-increment/adjustment-notes \
  -H "Authorization: Bearer {tu_token}" \
  -d @ajuste-auto.json

# Documento POS con consecutivo automatico
curl -X POST {{SANDBOX_URL}}/api/ubl2.1/auto-increment/pos-documents \
  -H "Authorization: Bearer {tu_token}" \
  -d @pos-auto.json
```

> Todos los endpoints de auto-incremento tambien soportan `PATCH /{uuid}` para reenvio.

Sin header `X-Sandbox-Force-Status`, todos devuelven `ACCEPTED` automaticamente.

## 5. Probar errores

Simula diferentes respuestas de la DIAN con el header `X-Sandbox-Force-Status`. Funciona en **cualquier** endpoint de documentos (factura, notas, DS, nomina, auto-increment):

```bash
# Documento rechazado (funciona en /invoice, /notes/credit, /ep/payroll, etc.)
curl -X POST {{SANDBOX_URL}}/api/ubl2.1/invoice \
  -H "Authorization: Bearer {tu_token}" \
  -H "X-Sandbox-Force-Status: ERROR_REJECTED" \
  -d @tu-factura.json

# Timeout de DIAN (funciona en cualquier endpoint de documentos)
curl -X POST {{SANDBOX_URL}}/api/ubl2.1/ep/payroll \
  -H "Authorization: Bearer {tu_token}" \
  -H "X-Sandbox-Force-Status: ERROR_TIMEOUT" \
  -d @nomina.json
```

Ver la lista completa de magic values en [MAGIC-VALUES.md](./MAGIC-VALUES.md).

## 6. Verificar entorno

Todas las respuestas del sandbox incluyen el header:

```
X-MATIAS-Environment: sandbox
```

## Endpoints soportados en sandbox

### Documentos electronicos (todos con respuesta DIAN simulada)

| Endpoint | Metodo | Tipo de Documento |
|---|---|---|
| `/invoice` | POST | Factura electronica |
| `/notes/credit` | POST | Nota credito |
| `/notes/debit` | POST | Nota debito |
| `/ds/document` | POST | Documento soporte |
| `/ds/adjustment-note` | POST | Nota de ajuste DS |
| `/ep/payroll` | POST | Nomina electronica individual |
| `/ep/payroll/replace` | POST | Reemplazo de nomina |
| `/ep/payroll/delete` | POST | Eliminacion de nomina |
| `/auto-increment/invoices` | POST | Factura auto-incremento |
| `/auto-increment/credit-notes` | POST | NC auto-incremento |
| `/auto-increment/debit-notes` | POST | ND auto-incremento |
| `/auto-increment/support-documents` | POST | DS auto-incremento |
| `/auto-increment/adjustment-notes` | POST | Nota ajuste auto-incremento |
| `/auto-increment/pos-documents` | POST | POS auto-incremento |

### CRUD y configuracion (misma logica que produccion)

| Endpoint | Descripcion |
|---|---|
| `/certificate/*` | Gestion de certificados digitales |
| `/resolutions/*` | Gestion de resoluciones DIAN |
| `/software/*` | Configuracion de software DIAN |
| `/company/*` | Datos de la empresa |
| `/documents/*` | Consulta de documentos enviados, PDF, XML |
| `/tokens/*` | Personal Access Tokens |
| `/currency/*` | Monedas y TRM (con fallback simulado) |

## Diferencias con produccion

| Aspecto | Produccion | Sandbox |
|---|---|---|
| Dominio | `api-v2.matias-api.com` | `sandbox-api.matias-api.com` |
| DIAN | Envio real SOAP | Respuestas simuladas |
| Certificado | Emitido por CA real (ONAC) | Test Cert auto-asignado |
| Datos | Persistentes | Persistentes (Stripe-like) |
| PAT | JWT estandar (Passport) | JWT estandar (Passport) |
| Endpoints | Identicos | **Identicos** |
| TRM (tasa cambio) | API externa real | Valores hardcoded de fallback |

## Soporte

- [Magic Values](./MAGIC-VALUES.md) -- lista completa de escenarios simulables
- [Test Certificate](./TEST-CERT.md) -- detalles del certificado de prueba
