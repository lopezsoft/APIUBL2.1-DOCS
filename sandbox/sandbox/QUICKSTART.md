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

## 4. Enviar primera factura

```bash
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/invoice \
  -H "Authorization: Bearer sk_test_..." \
  -H "Content-Type: application/json" \
  -d @tu-factura.json
```

Sin header `X-Sandbox-Force-Status`, recibirás `ACCEPTED` automáticamente.

## 5. Probar errores

Simula diferentes respuestas de la DIAN con el header `X-Sandbox-Force-Status`:

```bash
# Documento rechazado
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/invoice \
  -H "Authorization: Bearer sk_test_..." \
  -H "X-Sandbox-Force-Status: ERROR_REJECTED" \
  -d @tu-factura.json

# Timeout de DIAN
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/invoice \
  -H "Authorization: Bearer sk_test_..." \
  -H "X-Sandbox-Force-Status: ERROR_TIMEOUT" \
  -d @tu-factura.json
```

Ver la lista completa de magic values en [MAGIC-VALUES.md](./MAGIC-VALUES.md).

## 6. Verificar entorno

Todas las respuestas del sandbox incluyen el header:

```
X-MATIAS-Environment: sandbox
```

## Diferencias con producción

| Aspecto | Producción | Sandbox |
|---|---|---|
| Dominio | `api-v2.matias-api.com` | `sandbox-api.matias-api.com` |
| DIAN | Envío real SOAP | Respuestas simuladas |
| Certificado | Emitido por CA real (ONAC) | Test Cert auto-asignado |
| Datos | Persistentes | Persistentes (Stripe-like) |
| PAT prefijo | `sk_live_*` | `sk_test_*` |
| Endpoints | Idénticos | **Idénticos** |

## Soporte

- [Magic Values](./MAGIC-VALUES.md) — lista completa de escenarios simulables
- [Test Certificate](./TEST-CERT.md) — detalles del certificado de prueba
