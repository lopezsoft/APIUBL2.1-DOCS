---
sidebar_position: 20
sidebar_label: 📦 Envío Masivo (Bulk)
description: "Referencia de endpoints del envío masivo asíncrono: crear lote, consultar lote e items y listar lotes."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 📦 Envío Masivo (Bulk) — Referencia de Endpoints {#bulk-documents}

:::warning Autenticación Requerida
Incluir en todos los endpoints de esta sección el header: `Authorization: Bearer {token}`. Envía también `Accept: application/json` para recibir todos los errores en JSON.
:::

:::tip Guía completa
Esta página es la referencia rápida de endpoints. Estados, catálogo de errores, idempotencia, modos de envío, webhook y retención se explican en la guía [Envío Masivo de Documentos (Bulk)](../bulk-documents.mdx). Si ya integrabas el envío masivo, revisa [Cambios y compatibilidad](../bulk-documents.mdx#cambios-y-compatibilidad) 🆕.
:::

:::danger ⚠️ El lote se elimina a los 7 días
Un lote terminado y sus items se **eliminan por completo a los 7 días de la creación del lote**. Guarda el `document_uuid` de cada item mientras el lote se procesa o apenas termine. Ver [Retención de datos](../bulk-documents.mdx#retencion).
:::

:::warning Membresía requerida también para consultar
Todo el grupo `/bulk` exige una membresía con cupo: si la empresa agotó su cuota o su membresía está inactiva, también los `GET` responden `402` (`Límite de documentos de la membresía alcanzado o membresía inactiva.`).
:::

:::info Parámetro Multi-Tenant: `client_uuid`
Si operas como **Casa de Software**, puedes emitir y consultar lotes en nombre de una empresa cliente agregando `?client_uuid={{client_uuid}}`.
```http
GET {{url}}/company/customers
Authorization: Bearer {token}
```
:::

---

## 🚀 Emisión y Procesamiento de Lotes {#emision-lotes}

<details open>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/bulk/documents</b> — Crear Lote de Documentos (Asíncrono)</summary>

```http
POST {{url}}/bulk/documents?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
Idempotency-Key: 9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d
```

**Descripción:** Acepta un lote de documentos electrónicos para procesamiento en cola. Retorna `201 Created` inmediatamente con `batch_id` para consultar su progreso.

**Headers y Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `Idempotency-Key` | header | No | UUID v4 (máx. 36 caracteres) para no crear dos veces el mismo lote. Válido por 24 h. Mismo key + mismo body: `201` con el lote original; body distinto: `409`. |
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

**Body (JSON):**
| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `mode` | string | ✅ Sí | `auto-increment` o `manual`. |
| `stop_on_error` | boolean | No | Si `true`, el primer documento que no termine en `SUCCESS` cancela los items en cola. Default `false`. |
| `default_resolution_number` | string | No | Máx. 50. Se copia en `payload.resolution_number` si el payload no lo trae. |
| `default_prefix` | string | No | Máx. 10. Se copia en `payload.prefix` si el payload no lo trae. |
| `documents` | array | ✅ Sí | Mínimo 1. Máximo según plan (FREE 5, Pago 50, Ilimitado 200); nunca más de 200. |
| `documents[].kind` | string | ✅ Sí | `invoice`, `credit_note`, `debit_note`, `support_document`, `adjustment_note` o `pos_document`. |
| `documents[].payload` | object | ✅ Sí | Body del endpoint unitario equivalente. |
| `documents[].uuid` | UUID | No | UUID anti-duplicados, distinto dentro del lote. |
| `documents[].client_reference` | string | No | Tu referencia interna (máx. 64). |
| `documents[].attachments` | array | No | Máx. 4 adjuntos: `filename` (requerido, máx. 255), `content` (requerido, base64), `content_type` (opcional, máx. 100). Se ignoran si `payload.attachments` ya trae adjuntos. |

Cada documento va envuelto en `kind` + `payload`: los campos del documento (`type_document_id`, `customer`, `lines`…) van **dentro** de `payload`. El ejemplo usa un payload abreviado; envía el JSON completo del endpoint unitario.

```json
{
  "mode": "auto-increment",
  "stop_on_error": false,
  "default_resolution_number": "18764002566734",
  "default_prefix": "SETT",
  "documents": [
    {
      "kind": "invoice",
      "uuid": "6f1c2b9e-3d4a-4e8b-9c71-2a5d8e0f4b13",
      "client_reference": "FACT-001",
      "payload": {
        "type_document_id": 7,
        "operation_type_id": 1,
        "payments": [
          {
            "payment_method_id": 1,
            "means_payment_id": 10,
            "value_paid": "595000.00"
          }
        ],
        "customer": {
          "dni": "900123456",
          "company_name": "CLIENTE A SAS",
          "email": "facturacion@ejemplo.com"
        },
        "lines": [
          {
            "invoiced_quantity": "1",
            "quantity_units_id": "70",
            "line_extension_amount": "500000.00",
            "free_of_charge_indicator": false,
            "description": "Servicio de Consultoría",
            "code": "SRV-001",
            "price_amount": "500000.00",
            "base_quantity": "1"
          }
        ],
        "legal_monetary_totals": {
          "line_extension_amount": "500000.00",
          "tax_exclusive_amount": "500000.00",
          "tax_inclusive_amount": "595000.00",
          "payable_amount": "595000.00"
        }
      }
    }
  ]
}
```

<details>
<summary>✅ Respuesta Exitosa (HTTP 201 Created)</summary>

```json
{
  "message": "Lote aceptado para procesamiento asíncrono.",
  "batch_id": "b8f4155a-7ca2-11f0-be83-d843ae899220",
  "status": "PENDING",
  "status_url": "/api/ubl2.1/bulk/documents/b8f4155a-7ca2-11f0-be83-d843ae899220",
  "received": 1,
  "accepted": 1,
  "rejected": 0,
  "estimated_completion_seconds": 6,
  "items": [
    {
      "index": 0,
      "client_reference": "FACT-001",
      "item_id": "c1d2e3f4-a1b2-c3d4-e5f6-a7b8c9d0e1f2",
      "status": "QUEUED"
    }
  ],
  "success": true
}
```

</details>

<details>
<summary>❌ Errores (HTTP 402 / 409 / 413 / 422 / 429)</summary>

| HTTP | Causa | Cuerpo |
|---|---|---|
| `402` | Membresía sin cupo o inactiva | `success: false` + `message` |
| `402` | Cuota insuficiente para el lote completo | `success: false` + `message` + `requested` (o solo `message` al revalidar antes de crear el lote) |
| `409` | `Idempotency-Key` reutilizado con un body distinto | Solo `message` |
| `413` | El lote supera el tope de tu plan (se valida antes que el esquema) | `success: false` + `message` + `max_items` + `received` + `upgrade_url` |
| `422` | Esquema inválido | Formato estándar de validación: `message` + `errors` (sin `success`) |
| `422` | `documents` vacío o ausente (se valida antes que el esquema) | `success: false` + `message` (`Compañía o lote inválido.`) |
| `422` | `Idempotency-Key` de más de 36 caracteres | Solo `message` |
| `429` | Lotes por minuto excedidos (por usuario y por empresa), demasiados documentos en proceso (máx. 1000) u otro lote de la empresa en admisión | `message` y header `Retry-After` (en el plan FREE: `success: false` + `message` + `upgrade_url`, sin `Retry-After`: espera 60 segundos) |

Orden de los controles: lotes por minuto (`429`) → membresía (`402`) → `documents` vacío (`422`), tope del plan (`413`) y cuota (`402`) → esquema (`422`) → `Idempotency-Key` (`422`) → lote en admisión (`429`) → replay o `409` → documentos en proceso (`429`) → cuota revalidada (`402`). Un reintento con el mismo `Idempotency-Key` también pasa por todos los controles previos al replay. Ver [Orden de los controles](../bulk-documents.mdx#orden-controles).

```json
{
  "message": "Cada documento debe especificar su tipo (kind). (and 1 more error)",
  "errors": {
    "documents.0.kind": ["Cada documento debe especificar su tipo (kind)."],
    "documents.0.payload": ["Cada documento debe incluir su payload."]
  }
}
```

Ejemplos y mensajes exactos de cada caso: [Códigos de Error HTTP](../bulk-documents.mdx#errores).

</details>

</details>

---

## 📊 Consulta de Estado del Lote {#consulta-estado}

<details open>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/bulk/documents/&#123;batchId&#125;</b> — Consultar Estado del Lote</summary>

```http
GET {{url}}/bulk/documents/{batchId}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Accept: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `batchId` | path | ✅ Sí | UUID del lote obtenido al crearlo. |
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

Retorna el lote con todos sus items ordenados por `index`. Estados del lote: `PENDING`, `PROCESSING`, `COMPLETED`, `PARTIAL`, `FAILED`. Contadores: `succeeded` (items `SUCCESS`) y `failed` (items `FAILED`, `REJECTED_BY_DIAN` y `POSSIBLY_SENT`).

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "uuid": "b8f4155a-7ca2-11f0-be83-d843ae899220",
  "company_id": 1,
  "user_id": 5,
  "mode": "auto-increment",
  "stop_on_error": false,
  "total_items": 1,
  "succeeded": 1,
  "failed": 0,
  "status": "COMPLETED",
  "idempotency_key": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "finished_at": "2026-08-20T14:30:12.000000Z",
  "created_at": "2026-08-20T14:30:00.000000Z",
  "updated_at": "2026-08-20T14:30:12.000000Z",
  "batch_id": "b8f4155a-7ca2-11f0-be83-d843ae899220",
  "status_description": "Completado",
  "received": 1,
  "items": [
    {
      "uuid": "c1d2e3f4-a1b2-c3d4-e5f6-a7b8c9d0e1f2",
      "index": 0,
      "kind": "invoice",
      "client_reference": "FACT-001",
      "document_uuid": "3e7a9c51-8b2d-4f6e-a1c4-9d0b2e5f7a38",
      "shipping_history_id": 4200027,
      "status": "SUCCESS",
      "attempts": 1,
      "error_code": null,
      "error_message": null,
      "created_at": "2026-08-20T14:30:00.000000Z",
      "updated_at": "2026-08-20T14:30:12.000000Z",
      "processed_at": "2026-08-20T14:30:12.000000Z",
      "response": "{\"uuid\":\"3e7a9c51-8b2d-4f6e-a1c4-9d0b2e5f7a38\",\"document_number\":\"SETT101\",\"XmlDocumentKey\":\"cf9864294501e8a9578235dd2ab3c4fd\",\"cufe\":\"cf9864294501e8a9578235dd2ab3c4fd\",\"track_id\":null,\"is_valid\":true,\"status_code\":200,\"dian_status_code\":\"00\",\"dian_status\":\"ACCEPTED\",\"errors\":[],\"notifications\":[],\"warnings\":[],\"http_status\":200}",
      "item_id": "c1d2e3f4-a1b2-c3d4-e5f6-a7b8c9d0e1f2",
      "kind_description": "Factura electrónica",
      "status_description": "Exitoso",
      "document_number": "SETT101",
      "cufe": "cf9864294501e8a9578235dd2ab3c4fd",
      "track_id": null,
      "dian_response": {
        "is_valid": true,
        "status_code": "00",
        "status": "ACCEPTED",
        "errors": [],
        "notifications": []
      },
      "warnings": []
    }
  ],
  "success": true
}
```

Guarda el `document_uuid` de cada item: es el UUID del envío del documento (el que usas en `GET /documents/{uuid}`) y, en general, no coincide con el `documents[].uuid` que enviaste. Los campos de cada item cambian según su estado (`error` en `FAILED` y `REJECTED_BY_DIAN`; `error` y `next_action: "CHECK_STATUS"` en `POSSIBLY_SENT`). Ver [Campos de cada item](../bulk-documents.mdx#campos-item).

</details>

<details>
<summary>❌ Lote no encontrado (HTTP 404)</summary>

Si el lote no existe, ya se purgó o pertenece a otra empresa, la respuesta trae un único campo `message` (sin `success`). Sin `Accept: application/json` puede llegar como página HTML.

</details>

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/bulk/documents/&#123;batchId&#125;/items</b> — Listar Items del Lote</summary>

```http
GET {{url}}/bulk/documents/{batchId}/items?page=1&per_page=50&status=FAILED&client_uuid={{client_uuid}}
Authorization: Bearer {token}
Accept: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `batchId` | path | ✅ Sí | UUID del lote. |
| `status` | query | No | Filtrar por estado: `QUEUED`, `PROCESSING`, `SUCCESS`, `FAILED`, `REJECTED_BY_DIAN`, `POSSIBLY_SENT`, `CANCELLED`. |
| `kind` | query | No | Filtrar por tipo: `invoice`, `credit_note`, `debit_note`, `support_document`, `adjustment_note`, `pos_document`. |
| `per_page` | query | No | Registros por página (default `50`, de 1 a 200). |
| `page` | query | No | Número de página. |
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

Paginación estándar; cada elemento de `data` tiene los mismos campos que `items[]` del lote.

```json
{
  "current_page": 1,
  "data": [
    {
      "uuid": "d4e5f6a7-b8c9-d0e1-f2a3-b4c5d6e7f8a9",
      "index": 1,
      "kind": "invoice",
      "client_reference": "FACT-002",
      "document_uuid": null,
      "shipping_history_id": null,
      "status": "FAILED",
      "attempts": 1,
      "error_code": "404",
      "error_message": "No se encontró una resolución de facturación activa (resolution_number: 18764002566734, prefix: SETX).",
      "created_at": "2026-08-20T14:30:00.000000Z",
      "updated_at": "2026-08-20T14:30:08.000000Z",
      "processed_at": "2026-08-20T14:30:08.000000Z",
      "response": null,
      "item_id": "d4e5f6a7-b8c9-d0e1-f2a3-b4c5d6e7f8a9",
      "kind_description": "Factura electrónica",
      "status_description": "Fallido",
      "error": {
        "code": "404",
        "message": "No se encontró una resolución de facturación activa (resolution_number: 18764002566734, prefix: SETX)."
      }
    }
  ],
  "first_page_url": "https://sandbox-api.matias-api.com/api/ubl2.1/bulk/documents/b8f4155a-7ca2-11f0-be83-d843ae899220/items?page=1",
  "from": 1,
  "last_page": 1,
  "last_page_url": "https://sandbox-api.matias-api.com/api/ubl2.1/bulk/documents/b8f4155a-7ca2-11f0-be83-d843ae899220/items?page=1",
  "links": [
    { "url": null, "label": "&laquo; Previous", "active": false },
    { "url": "https://sandbox-api.matias-api.com/api/ubl2.1/bulk/documents/b8f4155a-7ca2-11f0-be83-d843ae899220/items?page=1", "label": "1", "active": true },
    { "url": null, "label": "Next &raquo;", "active": false }
  ],
  "next_page_url": null,
  "path": "https://sandbox-api.matias-api.com/api/ubl2.1/bulk/documents/b8f4155a-7ca2-11f0-be83-d843ae899220/items",
  "per_page": 50,
  "prev_page_url": null,
  "to": 1,
  "total": 1
}
```

</details>

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/bulk/documents</b> — Listar Todos los Lotes</summary>

```http
GET {{url}}/bulk/documents?page=1&per_page=15&status=PARTIAL&client_uuid={{client_uuid}}
Authorization: Bearer {token}
Accept: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `status` | query | No | Filtrar por estado: `PENDING`, `PROCESSING`, `COMPLETED`, `PARTIAL`, `FAILED`. |
| `per_page` | query | No | Lotes por página (default `15`, de 1 a 100). |
| `page` | query | No | Número de página. |
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

Ordenados del más reciente al más antiguo. Cada lote trae sus datos sin `batch_id` ni `items` (el identificador es `uuid`).

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "current_page": 1,
  "data": [
    {
      "uuid": "b8f4155a-7ca2-11f0-be83-d843ae899220",
      "company_id": 1,
      "user_id": 5,
      "mode": "auto-increment",
      "stop_on_error": false,
      "total_items": 1,
      "succeeded": 1,
      "failed": 0,
      "status": "COMPLETED",
      "idempotency_key": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      "finished_at": "2026-08-20T14:30:12.000000Z",
      "created_at": "2026-08-20T14:30:00.000000Z",
      "updated_at": "2026-08-20T14:30:12.000000Z"
    }
  ],
  "first_page_url": "https://sandbox-api.matias-api.com/api/ubl2.1/bulk/documents?page=1",
  "from": 1,
  "last_page": 1,
  "last_page_url": "https://sandbox-api.matias-api.com/api/ubl2.1/bulk/documents?page=1",
  "links": [
    { "url": null, "label": "&laquo; Previous", "active": false },
    { "url": "https://sandbox-api.matias-api.com/api/ubl2.1/bulk/documents?page=1", "label": "1", "active": true },
    { "url": null, "label": "Next &raquo;", "active": false }
  ],
  "next_page_url": null,
  "path": "https://sandbox-api.matias-api.com/api/ubl2.1/bulk/documents",
  "per_page": 15,
  "prev_page_url": null,
  "to": 1,
  "total": 1
}
```

</details>

</details>
