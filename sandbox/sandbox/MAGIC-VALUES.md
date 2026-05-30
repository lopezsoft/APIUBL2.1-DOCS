# Magic Values — MATIAS API Sandbox

El sandbox soporta **8 magic values** que permiten simular diferentes respuestas de la DIAN sin necesidad de endpoints especiales.

## Uso

Envía el header `X-Sandbox-Force-Status` en **cualquier** request de generación de documentos:

- `POST /invoice` — Factura electrónica
- `POST /notes/credit` — Nota crédito
- `POST /notes/debit` — Nota débito
- `POST /ds/document` — Documento soporte
- `POST /ds/adjustment-note` — Nota de ajuste DS
- `POST /ep/payroll` — Nómina electrónica individual
- `POST /ep/payroll/replace` — Reemplazo de nómina
- `POST /ep/payroll/delete` — Eliminación de nómina
- `POST /auto-increment/invoices` — Factura auto-incremento
- `POST /auto-increment/credit-notes` — NC auto-incremento
- `POST /auto-increment/debit-notes` — ND auto-incremento
- `POST /auto-increment/support-documents` — DS auto-incremento
- `POST /auto-increment/adjustment-notes` — Nota ajuste auto-incremento
- `POST /auto-increment/pos-documents` — POS auto-incremento

```bash
# Ejemplo: forzar rechazo en una factura
curl -X POST {{SANDBOX_URL}}/api/ubl2.1/invoice \
  -H "Authorization: Bearer {token}" \
  -H "X-Sandbox-Force-Status: ERROR_REJECTED" \
  -H "Content-Type: application/json" \
  -d @invoice.json

# Ejemplo: forzar timeout en nómina electrónica
curl -X POST {{SANDBOX_URL}}/api/ubl2.1/ep/payroll \
  -H "Authorization: Bearer {token}" \
  -H "X-Sandbox-Force-Status: ERROR_TIMEOUT" \
  -H "Content-Type: application/json" \
  -d @payroll.json

# Ejemplo: forzar duplicado en nota crédito
curl -X POST {{SANDBOX_URL}}/api/ubl2.1/notes/credit \
  -H "Authorization: Bearer {token}" \
  -H "X-Sandbox-Force-Status: ERROR_DUPLICATE" \
  -H "Content-Type: application/json" \
  -d @credit-note.json

# Ejemplo: forzar error de esquema en documento soporte auto-increment
curl -X POST {{SANDBOX_URL}}/api/ubl2.1/auto-increment/support-documents \
  -H "Authorization: Bearer {token}" \
  -H "X-Sandbox-Force-Status: ERROR_SCHEMA" \
  -H "Content-Type: application/json" \
  -d @ds-auto.json
```

> **Nota:** Si no se envía el header, el sandbox devuelve `ACCEPTED` (happy path) para todos los tipos de documento.

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

## Compatibilidad con Tipos de Documento

Todos los magic values funcionan con **todos** los tipos de documento:

| Tipo de Documento | Endpoint | Magic Values |
|---|---|---|
| Factura electrónica | `POST /invoice` | ✅ Los 8 |
| Nota crédito | `POST /notes/credit` | ✅ Los 8 |
| Nota débito | `POST /notes/debit` | ✅ Los 8 |
| Documento soporte | `POST /ds/document` | ✅ Los 8 |
| Nota de ajuste DS | `POST /ds/adjustment-note` | ✅ Los 8 |
| Nómina individual | `POST /ep/payroll` | ✅ Los 8 |
| Reemplazo nómina | `POST /ep/payroll/replace` | ✅ Los 8 |
| Eliminación nómina | `POST /ep/payroll/delete` | ✅ Los 8 |
| Factura auto-increment | `POST /auto-increment/invoices` | ✅ Los 8 |
| NC auto-increment | `POST /auto-increment/credit-notes` | ✅ Los 8 |
| ND auto-increment | `POST /auto-increment/debit-notes` | ✅ Los 8 |
| DS auto-increment | `POST /auto-increment/support-documents` | ✅ Los 8 |
| Ajuste auto-increment | `POST /auto-increment/adjustment-notes` | ✅ Los 8 |
| POS auto-increment | `POST /auto-increment/pos-documents` | ✅ Los 8 |

## Respuesta de Ejemplo — ACCEPTED (sin magic value)

Aplica para cualquier tipo de documento:

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
- El mismo magic value produce la **misma estructura de respuesta** independientemente del tipo de documento (factura, nómina, DS, etc.).
