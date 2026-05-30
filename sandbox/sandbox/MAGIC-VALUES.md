# Magic Values — MATIAS API Sandbox

El sandbox soporta **8 magic values** que permiten simular diferentes respuestas de la DIAN sin necesidad de endpoints especiales.

## Uso

Envía el header `X-Sandbox-Force-Status` en cualquier request de generación de documentos (`POST /invoice`, `POST /ep/payroll`, etc.).

```bash
# Ejemplo: forzar rechazo DIAN
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/invoice \
  -H "Authorization: Bearer {token}" \
  -H "X-Sandbox-Force-Status: ERROR_REJECTED" \
  -H "Content-Type: application/json" \
  -d @invoice.json
```

> **Nota:** Si no se envía el header, el sandbox devuelve `ACCEPTED` (happy path).

## Magic Values Disponibles

### Errores DIAN (6)

| Header Value | Comportamiento | Código DIAN | Caso de Uso |
|---|---|---|---|
| `ERROR_REJECTED` | Documento rechazado por validación de negocio | B7B01 | Probar manejo de rechazos |
| `ERROR_DUPLICATE` | Documento ya reportado previamente | 89 | Probar idempotencia |
| `ERROR_AUTH` | Error de autenticación del certificado | IFE043 | Probar manejo de errores de auth |
| `ERROR_SCHEMA` | Error de validación XSD del documento | FAD06 | Probar manejo de errores de esquema |
| `ERROR_500` | Error interno del servicio DIAN (HTTP 500) | — | Probar resiliencia ante caídas |
| `ERROR_TIMEOUT` | Timeout de conexión con DIAN | — | Probar manejo de timeouts |

### Certificados (2)

| Header Value | Comportamiento | Caso de Uso |
|---|---|---|
| `CERT_EXPIRED` | Fuerza un certificado expirado al firmar | Probar la rama de "certificado expirado" |
| `CERT_NEAR_EXPIRY` | Certificado con validez de +5 días | Probar alertas de pre-vencimiento |

## Respuesta de Ejemplo — ACCEPTED (sin magic value)

```json
{
  "success": true,
  "message": "Solicitud procesada por la DIAN.",
  "data": {
    "XmlDocumentKey": "a1b2c3d4-...",
    "StatusCode": "00",
    "StatusDescription": "Procesado Correctamente.",
    "IsValid": "true"
  }
}
```

## Respuesta de Ejemplo — ERROR_REJECTED

```json
{
  "success": false,
  "message": "Regla: B7B01, Rechazo: El documento ha sido rechazado por validaciones de negocio.",
  "errors": [
    "Regla: B7B01, Rechazo: La fecha del documento no corresponde con la fecha de envío."
  ]
}
```

## Notas

- Los magic values **solo funcionan** en el entorno sandbox (`sandbox-api.matias-api.com`).
- En producción, el header `X-Sandbox-Force-Status` es **ignorado completamente**.
- Los magic values **no contaminan el payload** de la solicitud — son un mecanismo de control lateral vía headers HTTP.
