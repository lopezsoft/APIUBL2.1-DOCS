---
sidebar_position: 20
sidebar_label: 📦 Envío Masivo (Bulk)
---

# 📦 Envío Masivo (Bulk)

> ✅ **Autenticación REQUERIDA**
> Incluir en todos los endpoints de esta sección el header: `Authorization: Bearer {token}`

## Listar lotes de la compañía

### Listar lotes de la compañía - 🔵 GET
```http
GET {{url}}/bulk/documents
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Lista paginada de todos los lotes de envío masivo de la compañía actual, ordenados del más reciente al más antiguo.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `status` | query | No | Filtrar por estado del lote |
| `per_page` | query | No | Lotes por página |
| `page` | query | No | Número de página |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Respuesta Exitosa (HTTP 200):**
```json
{
  "data": [
    [
      {
        "filename": "soporte_pago.pdf",
        "content": "JVBERi0xLjQKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZw...",
        "content_type": "application/pdf"
      }
    ]
  ],
  "meta": {
    "current_page": 0,
    "per_page": 0,
    "total": 0,
    "last_page": 0
  }
}
```

---

## Crear lote de documentos para procesamiento asíncrono

### Crear lote de documentos para procesamiento asíncrono - 🟘 POST
```http
POST {{url}}/bulk/documents
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Acepta un lote de documentos electrónicos para procesamiento en cola. Retorna 202 Accepted inmediatamente con batch_id para polling posterior. Soporta idempotencia mediante header Idempotency-Key.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `Idempotency-Key` | header | No | UUID v4 para idempotencia. Si se reenvía el mismo key con el mismo payload, retorna el lote original sin reprocesar. Válido por 24 horas. |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Body (JSON):**
```json
{
  "mode": "auto-increment",
  "stop_on_error": false,
  "default_resolution_number": "18764002566734",
  "default_prefix": "SETT",
  "documents": [
    [
      {
        "filename": "soporte_pago.pdf",
        "content": "JVBERi0xLjQKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZw...",
        "content_type": "application/pdf"
      }
    ]
  ]
}
```

---

## Consultar estado completo de un lote

### Consultar estado completo de un lote - 🔵 GET
```http
GET {{url}}/bulk/documents/{batchId}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Retorna el estado detallado del lote con resumen de cada item. Incluye contadores de éxito/fallo y timestamps.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `batchId` | path | Sí | UUID del lote (retornado en el POST) |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Respuesta Exitosa (HTTP 200):**
```json
[
  {
    "filename": "soporte_pago.pdf",
    "content": "JVBERi0xLjQKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZw...",
    "content_type": "application/pdf"
  }
]
```

---

## Listar items de un lote con filtros

### Listar items de un lote con filtros - 🔵 GET
```http
GET {{url}}/bulk/documents/{batchId}/items
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Lista paginada de los items de un lote, con filtros opcionales por estado y tipo de documento.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `batchId` | path | Sí | UUID del lote |
| `status` | query | No | Filtrar por estado del item |
| `kind` | query | No | Filtrar por tipo de documento |
| `per_page` | query | No | Items por página |
| `page` | query | No | Número de página |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Respuesta Exitosa (HTTP 200):**
```json
{
  "batch_id": "string",
  "status": "string",
  "items": [
    [
      {
        "filename": "soporte_pago.pdf",
        "content": "JVBERi0xLjQKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZw...",
        "content_type": "application/pdf"
      }
    ]
  ],
  "meta": {
    "current_page": 0,
    "per_page": 0,
    "total": 0,
    "last_page": 0
  }
}
```
