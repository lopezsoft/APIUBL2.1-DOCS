# Quickstart — MATIAS API Sandbox

Guía rápida para integrar con el sandbox de MATIAS API.

## 1. Crear cuenta

Registra tu cuenta en **producción**. Se replicará automáticamente al sandbox.

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

Usa las **mismas credenciales** que en producción:

```bash
curl -X POST https://sandbox-api.matias-api.com/auth/login \
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
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/auth/token \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json" \
  -d '{"name": "Mi Token de Prueba"}'
```

> Tu PAT tendrá prefijo `sk_test_*` en sandbox (vs `sk_live_*` en producción).

## 4. Enviar documentos electrónicos

El sandbox soporta **todos los tipos de documento** de la API. A continuación los endpoints disponibles:

### 4.1 Factura electrónica

```bash
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/invoice \
  -H "Authorization: Bearer sk_test_..." \
  -H "Content-Type: application/json" \
  -d @tu-factura.json
```

### 4.2 Notas crédito y débito

```bash
# Nota Crédito
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/notes/credit \
  -H "Authorization: Bearer sk_test_..." \
  -H "Content-Type: application/json" \
  -d @nota-credito.json

# Nota Débito
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/notes/debit \
  -H "Authorization: Bearer sk_test_..." \
  -H "Content-Type: application/json" \
  -d @nota-debito.json
```

### 4.3 Documento soporte y nota de ajuste

```bash
# Documento Soporte
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/ds/document \
  -H "Authorization: Bearer sk_test_..." \
  -H "Content-Type: application/json" \
  -d @documento-soporte.json

# Nota de Ajuste al Documento Soporte
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/ds/adjustment-note \
  -H "Authorization: Bearer sk_test_..." \
  -H "Content-Type: application/json" \
  -d @nota-ajuste-ds.json
```

### 4.4 Nómina electrónica

```bash
# Nómina individual
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/ep/payroll \
  -H "Authorization: Bearer sk_test_..." \
  -H "Content-Type: application/json" \
  -d @nomina.json

# Reemplazo de nómina
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/ep/payroll/replace \
  -H "Authorization: Bearer sk_test_..." \
  -H "Content-Type: application/json" \
  -d @nomina-replace.json

# Eliminación de nómina
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/ep/payroll/delete \
  -H "Authorization: Bearer sk_test_..." \
  -H "Content-Type: application/json" \
  -d @nomina-delete.json
```

### 4.5 Documentos con consecutivo automático (auto-increment)

Todos los endpoints de auto-incremento también funcionan en el sandbox:

```bash
# Factura con consecutivo automático
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/auto-increment/invoices \
  -H "Authorization: Bearer sk_test_..." \
  -H "Content-Type: application/json" \
  -d @factura-auto.json

# Nota Crédito con consecutivo automático
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/auto-increment/credit-notes \
  -H "Authorization: Bearer sk_test_..." \
  -d @nc-auto.json

# Nota Débito con consecutivo automático
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/auto-increment/debit-notes \
  -H "Authorization: Bearer sk_test_..." \
  -d @nd-auto.json

# Documento Soporte con consecutivo automático
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/auto-increment/support-documents \
  -H "Authorization: Bearer sk_test_..." \
  -d @ds-auto.json

# Nota de Ajuste con consecutivo automático
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/auto-increment/adjustment-notes \
  -H "Authorization: Bearer sk_test_..." \
  -d @ajuste-auto.json

# Documento POS con consecutivo automático
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/auto-increment/pos-documents \
  -H "Authorization: Bearer sk_test_..." \
  -d @pos-auto.json
```

> Todos los endpoints de auto-incremento también soportan `PATCH /{uuid}` para reenvío.

Sin header `X-Sandbox-Force-Status`, todos devuelven `ACCEPTED` automáticamente.

## 5. Probar errores

Simula diferentes respuestas de la DIAN con el header `X-Sandbox-Force-Status`. Funciona en **cualquier** endpoint de documentos (factura, notas, DS, nómina, auto-increment):

```bash
# Documento rechazado (funciona en /invoice, /notes/credit, /ep/payroll, etc.)
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/invoice \
  -H "Authorization: Bearer sk_test_..." \
  -H "X-Sandbox-Force-Status: ERROR_REJECTED" \
  -d @tu-factura.json

# Timeout de DIAN (funciona en cualquier endpoint de documentos)
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/ep/payroll \
  -H "Authorization: Bearer sk_test_..." \
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

### Documentos electrónicos (todos con respuesta DIAN simulada)

| Endpoint | Método | Tipo de Documento |
|---|---|---|
| `/invoice` | POST | Factura electrónica |
| `/notes/credit` | POST | Nota crédito |
| `/notes/debit` | POST | Nota débito |
| `/ds/document` | POST | Documento soporte |
| `/ds/adjustment-note` | POST | Nota de ajuste DS |
| `/ep/payroll` | POST | Nómina electrónica individual |
| `/ep/payroll/replace` | POST | Reemplazo de nómina |
| `/ep/payroll/delete` | POST | Eliminación de nómina |
| `/auto-increment/invoices` | POST | Factura auto-incremento |
| `/auto-increment/credit-notes` | POST | NC auto-incremento |
| `/auto-increment/debit-notes` | POST | ND auto-incremento |
| `/auto-increment/support-documents` | POST | DS auto-incremento |
| `/auto-increment/adjustment-notes` | POST | Nota ajuste auto-incremento |
| `/auto-increment/pos-documents` | POST | POS auto-incremento |

### CRUD y configuración (misma lógica que producción)

| Endpoint | Descripción |
|---|---|
| `/certificate/*` | Gestión de certificados digitales |
| `/resolutions/*` | Gestión de resoluciones DIAN |
| `/software/*` | Configuración de software DIAN |
| `/company/*` | Datos de la empresa |
| `/documents/*` | Consulta de documentos enviados, PDF, XML |
| `/tokens/*` | Personal Access Tokens |
| `/currency/*` | Monedas y TRM (con fallback simulado) |

## Diferencias con producción

| Aspecto | Producción | Sandbox |
|---|---|---|
| Dominio | `api-v2.matias-api.com` | `sandbox-api.matias-api.com` |
| DIAN | Envío real SOAP | Respuestas simuladas |
| Certificado | Emitido por CA real (ONAC) | Test Cert auto-asignado |
| Datos | Persistentes | Persistentes (Stripe-like) |
| PAT prefijo | `sk_live_*` | `sk_test_*` |
| Endpoints | Idénticos | **Idénticos** |
| TRM (tasa cambio) | API externa real | Valores hardcoded de fallback |

## Soporte

- [Magic Values](./MAGIC-VALUES.md) — lista completa de escenarios simulables
- [Test Certificate](./TEST-CERT.md) — detalles del certificado de prueba
