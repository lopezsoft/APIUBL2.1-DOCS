# MATIAS API UBL 2.1 — Paquete de Contexto IA: Eventos RADIAN, API Bulk y Webhooks

> Acuse de recibo, recibo del bien, aceptación expresa/tácita, rechazo, envío masivo asíncrono (API Bulk), Webhooks HMAC y consultas DIAN.

- **Versión API:** v3.10.0
- **URL del paquete:** https://docs.matias-api.com/ai/packs/radian-bulk-webhooks.md
- **Índice general IA:** https://docs.matias-api.com/llms.txt
- **Especificación OpenAPI 3:** https://docs.matias-api.com/openapi.json

## Páginas incluidas en este paquete

- [Envío Masivo (Bulk) — Referencia de Endpoints](https://docs.matias-api.com/docs/endpoints/bulk-documents.md)
- [Búsqueda y Estados de Documentos](https://docs.matias-api.com/docs/endpoints/queries-status.md)
- [API de Eventos RADIAN](https://docs.matias-api.com/docs/endpoints/events-radian.md)
- [Webhooks](https://docs.matias-api.com/docs/endpoints/webhooks.md)
- [Endpoints Públicos, Tablas DIAN y Funciones Auxiliares](https://docs.matias-api.com/docs/endpoints/public-dian.md)
- [Envío Masivo de Documentos (Bulk)](https://docs.matias-api.com/docs/bulk-documents.md)

---

<!-- Fuente: https://docs.matias-api.com/docs/endpoints/bulk-documents -->

# 📦 Envío Masivo (Bulk) — Referencia de Endpoints

:::warning Autenticación Requerida
Incluir en todos los endpoints de esta sección el header: `Authorization: Bearer {token}`. Envía también `Accept: application/json` para recibir todos los errores en JSON.
:::

:::tip Guía completa
Esta página es la referencia rápida de endpoints. Estados, catálogo de errores, idempotencia, modos de envío, webhook y retención se explican en la guía [Envío Masivo de Documentos (Bulk)](https://docs.matias-api.com/docs/bulk-documents.md). Si ya integrabas el envío masivo, revisa [Cambios y compatibilidad](https://docs.matias-api.com/docs/bulk-documents#cambios-y-compatibilidad) 🆕.
:::

:::danger ⚠️ El lote se elimina a los 7 días
Un lote terminado y sus items se **eliminan por completo a los 7 días de la creación del lote**. Guarda el `document_uuid` de cada item mientras el lote se procesa o apenas termine. Ver [Retención de datos](https://docs.matias-api.com/docs/bulk-documents#retencion).
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

## 🚀 Emisión y Procesamiento de Lotes

**POST /bulk/documents — Crear Lote de Documentos (Asíncrono)**

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

**✅ Respuesta Exitosa (HTTP 201 Created)**

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

**❌ Errores (HTTP 402 / 409 / 413 / 422 / 429)**

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

Orden de los controles: lotes por minuto (`429`) → membresía (`402`) → `documents` vacío (`422`), tope del plan (`413`) y cuota (`402`) → esquema (`422`) → `Idempotency-Key` (`422`) → lote en admisión (`429`) → replay o `409` → documentos en proceso (`429`) → cuota revalidada (`402`). Un reintento con el mismo `Idempotency-Key` también pasa por todos los controles previos al replay. Ver [Orden de los controles](https://docs.matias-api.com/docs/bulk-documents#orden-controles).

```json
{
  "message": "Cada documento debe especificar su tipo (kind). (and 1 more error)",
  "errors": {
    "documents.0.kind": ["Cada documento debe especificar su tipo (kind)."],
    "documents.0.payload": ["Cada documento debe incluir su payload."]
  }
}
```

Ejemplos y mensajes exactos de cada caso: [Códigos de Error HTTP](https://docs.matias-api.com/docs/bulk-documents#errores).

---

## 📊 Consulta de Estado del Lote

**GET /bulk/documents/{batchId} — Consultar Estado del Lote**

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

**✅ Respuesta Exitosa (HTTP 200)**

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

Guarda el `document_uuid` de cada item: es el UUID del envío del documento (el que usas en `GET /documents/{uuid}`) y, en general, no coincide con el `documents[].uuid` que enviaste. Los campos de cada item cambian según su estado (`error` en `FAILED` y `REJECTED_BY_DIAN`; `error` y `next_action: "CHECK_STATUS"` en `POSSIBLY_SENT`). Ver [Campos de cada item](https://docs.matias-api.com/docs/bulk-documents#campos-item).

**❌ Lote no encontrado (HTTP 404)**

Si el lote no existe, ya se purgó o pertenece a otra empresa, la respuesta trae un único campo `message` (sin `success`). Sin `Accept: application/json` puede llegar como página HTML.

**GET /bulk/documents/{batchId}/items — Listar Items del Lote**

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

**✅ Respuesta Exitosa (HTTP 200)**

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

**GET /bulk/documents — Listar Todos los Lotes**

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

**✅ Respuesta Exitosa (HTTP 200)**

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

---

<!-- Fuente: https://docs.matias-api.com/docs/endpoints/queries-status -->

# 🔍 Búsqueda y Estados de Documentos

:::info Autenticación Requerida
Incluir en todos: `Authorization: Bearer {token}`
:::

:::info ¿Dónde obtener el `client_uuid`? — Multi-Tenant para Casas de Software
Si operas como **Casa de Software** o **Cuenta Principal**, puedes consultar documentos, estados, XMLs, PDFs y rangos de numeración de tus empresas cliente agregando el parámetro `client_uuid` en la URL:
- **URL con Query Param:** `?client_uuid={{client_uuid}}`
- **Header:** `Authorization: Bearer {token_cuenta_principal}`
- **Comportamiento:** La consulta o descarga se ejecutará en el contexto de la empresa cliente especificada por su UUID.

**¿Dónde encontrar el `client_uuid` de tus clientes?**

```http
GET {{url}}/company/customers
Authorization: Bearer {token}
Content-Type: application/json
```

:::

:::tip GET para búsquedas · POST para descargas y acciones
- 🟢 **GET** → Búsquedas, listados, consultas de datos
- 🟠 **POST** → Descarga de archivos, envío de correos, actualización de estados
:::

---

## 📋 Búsqueda y Listado

**GET /documents — Buscar Documentos**

```http
GET {{url}}/documents?order_number=251956&query=&limit=1&resolution=&number=&prefix=&client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `order_number` | query | No | Número de orden interno. |
| `number` | query | No | Número consecutivo del documento. |
| `prefix` | query | No | Prefijo de la resolución. |
| `resolution` | query | No | Número de resolución DIAN. |
| `query` | query | No | Búsqueda por texto libre. |
| `limit` | query | No | Registros por página (por defecto `20`, máximo `50`). |
| `start_date` | query | No | Fecha inicial de emisión (`YYYY-MM-DD`). |
| `end_date` | query | No | Fecha final de emisión (`YYYY-MM-DD`). |
| `document_key` | query | No | CUFE o CUDE del documento. |
| `document_type` | query | No | Tipo de documento (`type_document_id`, p. ej. `7` = Factura electrónica). |
| `document_status` | query | No | Estado: `-1` = todos (por defecto), `0` = no validados por la DIAN (`validation_state` `NOT_VALIDATED`, `PENDING_REVALIDATION`, `NOT_FOUND_OR_REJECTED`, `CERTIFICATE_EXPIRED` o `PENDING`), `1` = solo validados. Los documentos en `PENDING_RESEND` (reenvío pendiente) no aparecen con `0`, solo con `-1`. |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

**cURL**

```bash
curl -X GET "{{url}}/documents?limit=20&start_date=2026-08-01&end_date=2026-08-31" \
  -H "Authorization: Bearer {token}"
```

**JavaScript (Axios)**

```js
const response = await axios.get(`${url}/documents`, {
  params: { limit: 20, start_date: '2026-08-01', end_date: '2026-08-31' },
  headers: { Authorization: `Bearer ${token}` }
});
const docs = response.data.dataRecords.data;
```

**PHP (Guzzle)**

```php
$response = $client->get("{$url}/documents", [
    'headers' => ['Authorization' => "Bearer {$token}"],
    'query'   => ['limit' => 20, 'start_date' => '2026-08-01', 'end_date' => '2026-08-31'],
]);
```

**✅ Respuesta Exitosa (HTTP 200)**

```json
{
  "dataRecords": {
    "current_page": 1,
    "data": [
      {
        "id": 1024,
        "uuid": "dde72910-eb42-11ef-9b27-f02f74cac485",
        "document_number": "LZT836",
        "XmlDocumentKey": "cf9864294501e8a9578235dd2ab3c4fd...",
        "is_valid": 1,
        "invoice_date": "01-08-2026"
      }
    ],
    "total": 142
  },
  "success": true
}
```

**GET /documents/last — Último Documento Generado**

```http
GET {{url}}/documents/last?resolution=18764074347312&prefix=LZT&client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Trae el último documento válido emitido para una resolución específica.

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `resolution` | query | ✅ Sí | Número de resolución DIAN. |
| `prefix` | query | No | Prefijo de la resolución. |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

**✅ Respuesta Exitosa (HTTP 200)**

```json
{
  "dataRecords": {
    "data": {
      "uuid": "dde72910-eb42-11ef-9b27-f02f74cac485",
      "document_number": "LZT836",
      "is_valid": true,
      "invoice_date": "2026-08-20T05:00:00.000000Z"
    }
  },
  "success": true
}
```

**GET /documents/consume — Consumo de Documentos**

```http
GET {{url}}/documents/consume?p_year=2026&p_type=1&client_uuid={{client_uuid}}
GET {{url}}/documents/consume?p_year=2026&p_type=6&_dni=900123456&client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Devuelve el reporte de documentos del año, agrupados según `p_type`.

:::note Documentos válidos, no consumo cobrado
En las agrupaciones `1` a `4`, `total` cuenta solo los documentos validados por la DIAN. Estas cifras no son el consumo cobrado de la membresía y pueden superar el `consumed` de [`GET /memberships/summary`](https://docs.matias-api.com/docs/endpoints/memberships-health#que-consume-del-plan): un documento que la API recupera porque la DIAN ya lo tenía autorizado, o que queda validado más tarde al consultar su estado, cuenta aquí pero no se cobra. Ver [Documento recuperado: sin cobro de consumo](https://docs.matias-api.com/docs/endpoints/invoices-pos#recuperado-sin-consumo).
:::

**Parámetros:**

Los parámetros se validan antes de consultar.

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `p_type` | query | No | 🆕 Agrupación (entero, por defecto `1`). Solo se aceptan estos valores: `1` = por mes y tipo de documento (la empresa y sus clientes); `2` = por año (la empresa y sus clientes); `3` = por cliente y mes (solo clientes); `4` = por cliente y año (solo clientes); `6` = un cliente (`_dni`) por mes y tipo de documento. El valor `5` ya no se acepta. |
| `p_year` | query | No | 🆕 Año del reporte (entero entre `2000` y el año siguiente al actual). Por defecto, el año actual. |
| `_dni` | query | Solo con `p_type=6` | 🆕 NIT del cliente sin dígito de verificación: solo dígitos, máximo 15 caracteres. También se acepta como `p_dni`. Las agrupaciones `1` a `4` no lo usan, pero si se envía debe tener un formato válido. |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

**cURL**

```bash
curl -X GET "{{url}}/documents/consume?p_year=2026&p_type=6&_dni=900123456" \
  -H "Authorization: Bearer {token}" \
  -H "Accept: application/json"
```

**JavaScript (Axios)**

```js
const response = await axios.get(`${url}/documents/consume`, {
  params: { p_year: 2026, p_type: 6, _dni: '900123456' },
  headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
});
const rows = response.data.dataRecords.data;
```

**PHP (Guzzle)**

```php
$response = $client->get("{$url}/documents/consume", [
    'headers' => ['Authorization' => "Bearer {$token}", 'Accept' => 'application/json'],
    'query'   => ['p_year' => 2026, 'p_type' => 6, '_dni' => '900123456'],
]);
```

**✅ Respuesta Exitosa (HTTP 200)**

Ejemplo con `p_type=6`:

```json
{
  "dataRecords": {
    "data": [
      {
        "nyear": 2026,
        "nmonth": "08",
        "total": 42,
        "payment": "12500000.00",
        "voucher_name": "Factura electrónica de venta",
        "company_name": "CLIENTE EJEMPLO S.A.S",
        "company_dni": "900123456",
        "parent_company": "CASA DE SOFTWARE EJEMPLO S.A.S",
        "parent_dni": "900654321"
      }
    ]
  },
  "success": true
}
```

Las columnas de cada fila dependen de `p_type`:

| `p_type` | Columnas | Filas |
|---|---|---|
| `1` | `nyear`, `nmonth` (texto de 2 dígitos), `total`, `payment`, `parent_dni`, `parent_company`, `document_code`, `voucher_name` | Las de los clientes y las propias de la empresa, por separado, ordenadas por año, mes y código de documento. |
| `2` | `nyear`, `total`, `payment`, `parent_dni`, `parent_company` | Una fila para los clientes y otra para la empresa. |
| `3` | `nyear`, `nmonth` (texto de 2 dígitos), `total`, `payment`, `company_name`, `company_dni`, `parent_dni`, `parent_company` | Solo clientes, por cliente y mes. |
| `4` | `nyear`, `total`, `payment`, `company_name`, `company_dni`, `parent_dni`, `parent_company` | Solo clientes, por cliente y año. |
| `6` | `nyear`, `nmonth` (texto de 2 dígitos), `total`, `payment`, `voucher_name`, `company_name`, `company_dni`, `parent_company`, `parent_dni` | El cliente `_dni` de la empresa autenticada, por mes y tipo de documento. |

**❌ Parámetros inválidos (HTTP 422)**

Un `p_type` que no sea `1`, `2`, `3`, `4` o `6` (incluido el `5`), un `p_year` fuera de rango, un `_dni` no numérico o de más de 15 caracteres, o `p_type=6` sin `_dni`, responden **HTTP 422**. La clave del error es `_dni` aunque se haya enviado `p_dni`.

```json
{
  "success": false,
  "message": "Error de validación de datos.",
  "errors": {
    "_dni": ["El campo  dni es obligatorio cuando el campo p type es 6."]
  }
}
```

Antes, un `p_type` fuera de rango respondía HTTP 500.

**GET /documents/{uuid} — Consultar Documento por UUID 🆕**

```http
GET {{url}}/documents/{uuid}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Devuelve un documento de la empresa a partir de un UUID. Acepta cualquiera de estos dos identificadores:

- El **uuid del envío**: el `uuid` que devuelve la respuesta de emisión (o el `document_uuid` de un item de envío masivo).
- El **uuid anti-duplicados** que tú enviaste en el campo `uuid` del documento (o en `documents[].uuid` del envío masivo).

:::tip Endpoint recomendado tras un `DOCUMENT_POSSIBLY_SENT`
Si una emisión respondió con el código `DOCUMENT_POSSIBLY_SENT` (o un item masivo quedó en `POSSIBLY_SENT`), consulta este endpoint con `data.uuid` antes de cualquier reintento: así sabes si el documento quedó registrado y validado sin transmitirlo de nuevo.
:::

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `uuid` | path | ✅ Sí | UUID del envío o UUID anti-duplicados enviado por el integrador. Debe tener formato UUID. |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

**cURL**

```bash
curl -X GET "{{url}}/documents/dde72910-eb42-11ef-9b27-f02f74cac485" \
  -H "Authorization: Bearer {token}" \
  -H "Accept: application/json"
```

**JavaScript (Axios)**

```js
const response = await axios.get(`${url}/documents/${uuid}`, {
  headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
});
const record = response.data.dataRecord; // null si no existe
```

**PHP (Guzzle)**

```php
$response = $client->get("{$url}/documents/{$uuid}", [
    'headers' => ['Authorization' => "Bearer {$token}", 'Accept' => 'application/json'],
]);
```

**✅ Respuesta Exitosa con el uuid del envío (HTTP 200)**

Se muestran los campos principales del envío. El `id` es el identificador numérico que usa `DELETE /documents/{id}`.

```json
{
  "dataRecord": {
    "id": 1024,
    "uuid": "dde72910-eb42-11ef-9b27-f02f74cac485",
    "document_number": "LZT836",
    "type_document_id": 7,
    "XmlDocumentKey": "cf9864294501e8a9578235dd2ab3c4fd...",
    "XmlDocumentName": "fv09010914030002500000095",
    "order_number": "251956",
    "is_valid": 1,
    "invoice_date": "14-02-2025",
    "jsonData": {},
    "createdAt": "14-02-2025 10:15:00 am",
    "updatedAt": "14-02-2025 10:15:04 am"
  },
  "success": true
}
```

**✅ Respuesta Exitosa con el uuid anti-duplicados (HTTP 200)**

Con el uuid que envió el integrador, `dataRecord` es el vínculo entre ese uuid y el envío; el envío viene en `shipping_history`. Se muestran los campos principales.

```json
{
  "dataRecord": {
    "shipping_history_uuid": "dde72910-eb42-11ef-9b27-f02f74cac485",
    "document_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "shipping_history": {
      "uuid": "dde72910-eb42-11ef-9b27-f02f74cac485",
      "document_number": "LZT836",
      "is_valid": 1
    }
  },
  "success": true
}
```

**ℹ️ Documento inexistente (HTTP 200)**

Si ningún documento de la empresa tiene ese uuid, la respuesta es **HTTP 200** con `dataRecord: null` (no 404):

```json
{
  "dataRecord": null,
  "success": true
}
```

**❌ UUID con formato inválido (HTTP 400)**

```json
{
  "success": false,
  "message": "El UUID proporcionado no es válido."
}
```

**DELETE /documents/{id} — Eliminar Documento No Validado 🆕**

```http
DELETE {{url}}/documents/{id}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Elimina el registro de un documento de la empresa **solo si la DIAN no lo tiene**. El `id` es el identificador numérico del envío (campo `id` de `GET /documents` o de `GET /documents/{uuid}`).

**Se puede eliminar** cuando su `validation_state` (ver `GET /status`) es `NOT_VALIDATED` o `NOT_FOUND_OR_REJECTED`, y además:

- nunca se transmitió (no tiene CUFE/CUDE), o
- la DIAN devolvió un rechazo definitivo para ese mismo CUFE/CUDE.

**No se puede eliminar** un documento validado, uno en cualquier otro estado intermedio (`PENDING_REVALIDATION` tras un `StatusCode 98`, `CERTIFICATE_EXPIRED`, `PENDING_RESEND`, `PENDING`), uno rechazado por la regla 90 ("documento procesado anteriormente") ni uno cuyo envío no obtuvo una respuesta definitiva de la DIAN.

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `id` | path | ✅ Sí | Id numérico del envío. |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

**cURL**

```bash
curl -X DELETE "{{url}}/documents/1024" \
  -H "Authorization: Bearer {token}" \
  -H "Accept: application/json"
```

**JavaScript (Axios)**

```js
const response = await axios.delete(`${url}/documents/${id}`, {
  headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
});
```

**PHP (Guzzle)**

```php
$response = $client->delete("{$url}/documents/{$id}", [
    'headers' => ['Authorization' => "Bearer {$token}", 'Accept' => 'application/json'],
]);
```

**✅ Respuesta Exitosa (HTTP 200)**

```json
{
  "message": "Documento eliminado correctamente.",
  "success": true
}
```

**❌ Respuestas de Error**

| HTTP | `code` | `message` |
|---|---|---|
| 404 | — | `No se encontró el documento.` |
| 400 | — | `No se puede eliminar un documento validado por la DIAN.` |
| 400 | — | `No se puede eliminar un documento que la DIAN podría tener o cuya validación está pendiente.` |
| 409 | `DOCUMENT_IN_TRANSMISSION` | El número se está transmitiendo a la DIAN en otra solicitud. |
| 409 | — | `El documento cambió mientras se eliminaba; consulte su estado.` |

```json
{
  "code": "DOCUMENT_IN_TRANSMISSION",
  "message": "El documento LZT836 ya se está transmitiendo a la DIAN en otra solicitud; consulte su estado antes de enviarlo de nuevo.",
  "success": false
}
```

---

## 📥 Descarga de Archivos

Para descargar los adjuntos y representaciones gráficas del documento usando el **CUFE/CUDE** (`trackId`).

**POST /documents/pdf/{trackId} — Descargar PDF**

```http
POST {{url}}/documents/pdf/{trackId}?regenerate=0&client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `trackId` | path | ✅ Sí | CUFE/CUDE del documento. |
| `regenerate` | query | No | `1` fuerza regenerar el PDF, `0` descarga el existente. |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

:::tip QR del PDF regenerado
El QR de un PDF generado corresponde siempre al CUFE/CUDE consultado (`trackId`). Si un documento se transmitió más de una vez y su PDF quedó con el QR de otro intento, `regenerate=1` genera el PDF de nuevo con el QR correcto. Con `regenerate=0` se entrega el PDF existente tal cual.
:::

**cURL**

```bash
curl -X POST "{{url}}/documents/pdf/{{trackId}}?regenerate=0" \
  -H "Authorization: Bearer {token}"
```

**JavaScript (Axios)**

```js
const response = await axios.post(
  `${url}/documents/pdf/${trackId}?regenerate=0`,
  {},
  { headers: { Authorization: `Bearer ${token}` } }
);
const pdfUrl = response.data.pdf.url;
```

**PHP (Guzzle)**

```php
$response = $client->post("{$url}/documents/pdf/{$trackId}", [
    'headers' => ['Authorization' => "Bearer {$token}"],
    'query'   => ['regenerate' => 0],
]);
```

**✅ Respuesta Exitosa (HTTP 200)**

```json
{
  "message": "PDF generado correctamente.",
  "pdf": {
    "path": "1/b46e15b0-69db-11f1-984a-345a60fd780b.pdf",
    "url": "https://api.ejemplo.com/pdf/1/b46e15b0-69db-11f1-984a-345a60fd780b.pdf",
    "data": "JVBERi0xLjQKJeLjz9MKMyAwIG9iago..."
  }
}
```

**❌ trackId no encontrado (HTTP 404)**

```json
{
  "success": false,
  "message": "No se puede generar el PDF. No se encontró un documento asociado al trackId: cf9864294501e8a9578235dd2ab3c4fd..."
}
```

**GET /documents/xml/{trackId} — Descargar XML**

```http
GET {{url}}/documents/xml/{trackId}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

También acepta `POST` en la misma ruta.

:::note Solo planes de pago
La descarga del XML no está disponible en el plan FREE: responde **HTTP 403** con `Esta funcionalidad no está disponible en el plan FREE. Actualice su plan para acceder.`
:::

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `trackId` | path | ✅ Sí | CUFE/CUDE del documento. |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

El XML entregado corresponde siempre al CUFE/CUDE solicitado: si el documento no está validado y el XML guardado pertenece a otro intento del mismo número (otra clave), se obtiene de la DIAN el XML de la clave pedida.

**❌ trackId no encontrado (HTTP 404)**

Un `trackId` que no pertenece a la empresa autenticada responde:

```json
{
  "success": false,
  "message": "No se encontró un documento asociado al trackId: cf9864294501e8a9578235dd2ab3c4fd..."
}
```

**POST /documents/attached/{trackId} — Descargar Adjunto (Attached Document)**

```http
POST {{url}}/documents/attached/{trackId}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Descarga el `.zip` con el ApplicationResponse completo.

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `trackId` | path | ✅ Sí | CUFE/CUDE del documento. |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

**GET /documents/{uuid}/files — Obtener Archivos del Documento**

```http
GET {{url}}/documents/{uuid}/files?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Retorna los archivos asociados a un documento (PDF, XML, ApplicationResponse) identificado por su UUID interno.

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `uuid` | path | ✅ Sí | UUID interno del documento. |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

**✅ Respuesta Exitosa (HTTP 200)**

```json
{
  "dataRecords": {
    "current_page": 1,
    "data": [
      {
        "document_uuid": "1868f3c9-98fb-11f1-b521-345a60fd780b",
        "uuid": "102035600026107941",
        "file_path": "xml/1/fv/fv636afa85-c756-463e-b28c-0c0fa8adf3c3.xml",
        "file_name": "fv636afa85-c756-463e-b28c-0c0fa8adf3c3.xml",
        "type": "xml"
      }
    ],
    "total": 3
  }
}
```

---

## 📊 Consulta de Estados

**POST /status/document/{trackId} — Estado en Producción**

```http
POST {{url}}/status/document/{trackId}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Verifica el estado del documento directamente con la DIAN en producción.

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `trackId` | path | ✅ Sí | CUFE/CUDE del documento emitido. |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

**cURL**

```bash
curl -X POST "{{url}}/status/document/{{trackId}}" \
  -H "Authorization: Bearer {token}"
```

**JavaScript (Axios)**

```js
const response = await axios.post(
  `${url}/status/document/${trackId}`,
  {},
  { headers: { Authorization: `Bearer ${token}` } }
);
const isValid = response.data.is_valid === 1;
const dian = response.data.response; // IsValid, StatusCode, StatusDescription...
```

**PHP (Guzzle)**

```php
$response = $client->post("{$url}/status/document/{$trackId}", [
    'headers' => ['Authorization' => "Bearer {$token}"],
]);
```

**✅ Respuesta Exitosa (HTTP 200)**

La respuesta de la DIAN llega en `response`, ya extraída del sobre SOAP (sin `Envelope` ni `Body`).

```json
{
  "message": "Consulta generada con éxito",
  "response": {
    "ErrorMessage": {
      "string": []
    },
    "IsValid": "true",
    "StatusCode": "00",
    "StatusDescription": "Procesado Correctamente.",
    "StatusMessage": "La Factura electrónica LZT836, ha sido autorizada.",
    "XmlDocumentKey": "cf9864294501e8a9578235dd2ab3c4fd...",
    "XmlFileName": "fv09010914030002500000095"
  },
  "is_valid": 1,
  "success": true
}
```

**📌 Reglas de `is_valid`**

- `is_valid` es `1` solo si la DIAN responde `IsValid: "true"` con `StatusCode: "00"`, el CUFE/CUDE de la respuesta coincide con el `trackId` consultado (o la DIAN no lo devuelve) y el documento conserva ese CUFE/CUDE.
- Si la DIAN responde la regla 90 ("documento procesado anteriormente"), `is_valid` es `0`.
- Un documento ya validado **nunca se degrada**: si la DIAN no lo confirma en esta consulta, la respuesta trae `is_valid: 0` pero el documento sigue registrado como validado.

**❌ Respuestas de Error**

| HTTP | `code` | `message` |
|---|---|---|
| 404 | — | `No se encontró el documento con el trackId: {trackId}` (el `trackId` no pertenece a la empresa). |
| 409 | `DOCUMENT_IN_TRANSMISSION` | Ese número se está transmitiendo a la DIAN en otra solicitud; consulte de nuevo en unos instantes. |

```json
{
  "message": "No se encontró el documento con el trackId: cf9864294501e8a9578235dd2ab3c4fd...",
  "success": false
}
```

**POST /status/zip/{trackId} — Estado en Pruebas (ZIP)**

```http
POST {{url}}/status/zip/{trackId}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `trackId` | path | ✅ Sí | Track ID del envío en pruebas. |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

:::note
A diferencia de `POST /status/document/{trackId}`, este endpoint y `POST /status/document/test/{trackId}` conservan la clave `ResponseDian` en la respuesta.
:::

**✅ Respuesta Exitosa (HTTP 200)**

```json
{
  "message": "Consulta generada con éxito",
  "ResponseDian": {
    "IsValid": "true",
    "StatusCode": "00",
    "StatusDescription": "Procesado Correctamente.",
    "StatusMessage": "Documento verificado y validado por la DIAN."
  },
  "success": true
}
```

**POST /status/document/test/{trackId} — Estado en Pruebas (Test)**

```http
POST {{url}}/status/document/test/{trackId}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Verifica el estado de un documento en el ambiente de **pruebas** (habilitación) directamente con la DIAN. A diferencia del ZIP, usa el trackId del documento de prueba.

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `trackId` | path | ✅ Sí | CUFE/CUDE del documento de prueba. |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

**✅ Respuesta Exitosa (HTTP 200)**

```json
{
  "message": "Consulta generada con éxito",
  "ResponseDian": {
    "IsValid": "true",
    "StatusCode": "00",
    "StatusDescription": "Procesado Correctamente.",
    "StatusMessage": "Documento verificado y validado por la DIAN."
  },
  "success": true
}
```

**GET /status — Estado Interno de la API**

```http
GET {{url}}/status?order_number=251956&resolution=&number=LZT836&prefix=&client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Obtiene información del documento registrado en el API, su estado de validación y los datos del Código QR.

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `order_number` | query | No | Número de orden interno. |
| `number` | query | No | Número de documento. |
| `prefix` | query | No | Prefijo de la resolución. |
| `resolution` | query | No | Número de resolución. |
| `type_document_id` | query | No | 🆕 Tipo de documento (entero mayor que 0). También se acepta como `document_type`. Un valor no numérico se ignora. Útil cuando dos tipos de documento comparten numeración. |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

**¿Qué documento se devuelve?** Si la búsqueda incluye `number` y hay varios registros que coinciden, se prefiere el validado por la DIAN y, después, el más reciente. Sin `number`, se devuelve el más reciente.

**✅ Respuesta Exitosa (HTTP 200)**

```json
{
  "document": {
    "uuid": "dde72910-eb42-11ef-9b27-f02f74cac485",
    "document_number": "LZT836",
    "order_number": "251956",
    "document_key": "cf9864294501e8a9578235dd2ab3c4fd1d9085fe5d3b345d191fbb8c9afa6ff8acec7a97a177393b2d32735d225a9f1d",
    "document_name": "fv09010914030002500000095",
    "is_valid": true,
    "validation_state": "VALID",
    "type_document_id": 7,
    "invoice_date": "2025-02-14T05:00:00.000000Z",
    "qr": {
      "qrDian": "https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=cf9864...",
      "data": "TnVtRmFjOiBMWlQ4MzYK...",
      "path": null,
      "url": null
    }
  },
  "status": "Validado por la DIAN",
  "message": "Consulta exitosa",
  "success": true
}
```

- `is_valid` es `true` **solo** si la DIAN validó el documento. Los estados intermedios (pendiente de consulta, reenvío pendiente, etc.) responden `false`; consulta `validation_state` para saber en qué punto está.
- `qr.qrDian` y `qr.data` corresponden a `document_key`, el CUFE/CUDE vigente del documento. `qr.path` y `qr.url` llegan en `null`.
- `qr.qrDian` es la URL de consulta de la DIAN con `document_key`. Conserva el ambiente (producción o habilitación) con el que se emitió el documento; si no hay una URL guardada, se arma con el ambiente del software configurado para ese tipo de documento. Llega en `null` si no hay una URL guardada y el documento no tiene CUFE/CUDE o no hay software configurado.
- `qr.data` es el texto del QR original en base64 (NumFac, FecFac, ..., CUFE) **solo** si contiene `document_key`. Si no lo contiene (por ejemplo, en un documento recuperado con `ALREADY_AUTHORIZED_RECOVERED` o con un QR guardado de otro intento), es la URL de `qr.qrDian` codificada en base64. Si no hay un QR original válido y `qr.qrDian` es `null`, también llega en `null`.

**📌 Valores de `validation_state` y `status`**

| `validation_state` | `status` | Significado |
|---|---|---|
| `VALID` | `Validado por la DIAN` | La DIAN validó el documento. |
| `NOT_VALIDATED` | `Sin validación por la DIAN` | Sin validación (rechazo o sin respuesta válida). |
| `PENDING_REVALIDATION` | `Sin validación por la DIAN: pendiente de consultar su estado` | Pendiente de consultar su estado en la DIAN (por ejemplo, tras un `StatusCode 98`). |
| `NOT_FOUND_OR_REJECTED` | `Sin validación por la DIAN: la DIAN no tiene el documento o lo rechazó` | La consulta a la DIAN no lo encontró o lo rechazó. |
| `CERTIFICATE_EXPIRED` | `Sin validación por la DIAN: certificado vencido` | No se pudo consultar su estado porque el certificado está vencido. |
| `PENDING_RESEND` | `Sin validación por la DIAN: reenvío pendiente` | Marcado para reenvío a la DIAN. |
| `PENDING` | `Sin validación por la DIAN: pendiente de envío` | Pendiente de envío a la DIAN. |
| `UNKNOWN` | `Sin validación por la DIAN` | Estado no reconocido. |

**❌ Documento no encontrado (HTTP 404)**

```json
{
  "success": false,
  "message": "No se encontró el documento."
}
```

---

## 📧 Correos y Adquirentes

**POST /documents/sendmail/to · /documents/sendmail/{trackId} — Envío y Reenvío de Correos**

```http
POST {{url}}/documents/sendmail/to?client_uuid={{client_uuid}}
POST {{url}}/documents/sendmail/{trackId}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Permite enviar un correo libre con archivos en base64 (`/sendmail/to`) o reenviar por CUFE/CUDE un documento ya validado (`/sendmail/{trackId}`) al adquirente u otros destinatarios.

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `trackId` | path | Solo en `/sendmail/{trackId}` | CUFE/CUDE (`XmlDocumentKey`) de un documento de la empresa. |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

**Body:**

| Campo | Endpoint | Requerido | Descripción |
|---|---|---|---|
| `email_to` | Ambos | ✅ Sí | Una o varias direcciones separadas por `,` o `;` (más de 10 caracteres en total). En `/sendmail/{trackId}` no puede contener espacios; en `/sendmail/to` los espacios se eliminan. |
| `subject` | `/sendmail/to` | No | Asunto del correo. |
| `title` | `/sendmail/to` | No | Título del cuerpo del correo. |
| `message` | `/sendmail/to` | No | Texto del cuerpo del correo. |
| `documents` | `/sendmail/to` | No | Archivos a adjuntar: arreglo de objetos con `name`, `content` (base64) y `mime`. |
| `attachments` | `/sendmail/to` | No | Adjuntos adicionales del usuario, con la misma estructura del campo [`attachments`](https://docs.matias-api.com/docs/billing-fields#attachments-new) de la emisión. |

**cURL**

```bash
curl -X POST "{{url}}/documents/sendmail/{{trackId}}" \
  -H "Authorization: Bearer {token}" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"email_to": "compras@cliente-ejemplo.com;contabilidad@cliente-ejemplo.com"}'
```

**JavaScript (Axios)**

```js
const response = await axios.post(
  `${url}/documents/sendmail/to`,
  {
    email_to: 'compras@cliente-ejemplo.com',
    subject: 'Factura LZT836',
    title: 'Factura electrónica',
    message: 'Adjuntamos su factura.',
    documents: [{ name: 'factura.pdf', content: pdfBase64, mime: 'application/pdf' }]
  },
  { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }
);
```

**PHP (Guzzle)**

```php
$response = $client->post("{$url}/documents/sendmail/{$trackId}", [
    'headers' => ['Authorization' => "Bearer {$token}", 'Accept' => 'application/json'],
    'json'    => ['email_to' => 'compras@cliente-ejemplo.com'],
]);
```

**✅ Respuesta Exitosa (HTTP 200)**

El envío es asíncrono: la respuesta confirma que el proceso inició y no devuelve la lista de destinatarios.

```json
{
  "message": "Se ha iniciado el proceso de envío del correo electrónico.",
  "success": true
}
```

En `/sendmail/{trackId}` el correo de una factura adjunta el ZIP (PDF + AttachedDocument) más los adjuntos que haya cargado el usuario; el PDF no se adjunta suelto.

**🛡️ Validación de destinatarios (HTTP 400)**

Antes de encolar el correo, en los dos endpoints se valida **cada** destinatario: el formato de la dirección y que su dominio pueda recibir correo. Si **una sola** dirección no puede recibir correo, se bloquea el envío completo:

```json
{
  "success": false,
  "message": "El envío fue bloqueado automáticamente porque la(s) siguiente(s) dirección(es) no puede(n) recibir correo. Verifique que estén bien escritas: compras@dominio-inexistente.com (el dominio dominio-inexistente.com no existe o no recibe correo), ventas@ (formato inválido)"
}
```

Si algún destinatario figura en la lista de supresión (por rebotes permanentes o quejas de spam anteriores), también se bloquea con HTTP 400: `El envío fue bloqueado automáticamente porque la(s) siguiente(s) dirección(es) de destinatario(s) se encuentra(n) en nuestra lista de supresión (...)`.

Esta validación ocurre antes de buscar el documento: un correo inválido responde 400 aunque el `trackId` no exista.

**❌ Otros errores de `/sendmail/{trackId}`**

| HTTP | `message` |
|---|---|
| 400 | `Debe indicar, al menos un correo, a donde desea enviar el documento.` |
| 404 | `El trackId del documento no existe en la base de datos.` |
| 409 | `El documento no está validado por la DIAN y no puede enviarse por correo.` |
| 404 | `No se encontró el documento para el envío de correo.` |
| 400 | `No se puede enviar un correo electrónico a consumidor final.` |
| 400 | `El documento nómina electrónica no está soportado para el envío de email.` |
| 409 | `El documento {id} ya tiene N trabajo(s) de envío en proceso. Intente más tarde.` |
| 400 | `Límite de destinatarios excedido. Máximo permitido: X, solicitados: Y` |
| 400 | `No se pudo enviar el email a ningún destinatario. Errores: ...` |
| 500 | `Error interno del servidor. Hay espacios en blanco en la lista de correos electrónicos.` (incluye `reference`) |

En `/sendmail/to` aplica el mismo error 400 cuando falta `email_to` o es demasiado corto.

**GET /acquirer — Consulta de Adquirente**

```http
GET {{url}}/acquirer?identificationType=13&identificationNumber=1063279303&client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Retorna información asociada (como correos) de un Adquirente registrado previamente en las facturas.

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `identificationType` | query | ✅ Sí | Tipo de identificación (`13`=CC, `31`=NIT, etc.). |
| `identificationNumber` | query | ✅ Sí | Número de documento del adquirente. |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

**✅ Respuesta Exitosa (HTTP 200)**

```json
{
  "message": "Consulta generada con éxito",
  "content": {
    "ReceiverEmail": "correo@cliente.com",
    "ReceiverName": "CLIENTE EJEMPLO S.A.S",
    "StatusCode": "200"
  },
  "customer": {
    "id": 748,
    "country_id": 45,
    "city_id": 149,
    "identity_document_id": 3,
    "company_name": "CLIENTE EJEMPLO S.A.S",
    "dni": "901091403",
    "email": "correo@cliente.com"
  }
}
```

**GET /exchange-emails — Intercambio de Correos**

```http
GET {{url}}/exchange-emails?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Obtiene la lista de correos registrados para recepción en la plataforma.

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

---

## 🔢 Numeración

**GET /numbering-range — Rango de Numeración**

```http
GET {{url}}/numbering-range?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Obtiene las resoluciones y rangos de numeración activos de facturación.

:::tip Sincronización con la DIAN
Agrega `?sync=1` para forzar la sincronización del rango de numeración con los servicios SOAP de la DIAN (`GetNumberingRange`).
:::

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `type_id` | query | No | Tipo de documento: `1`=Factura, `3`=Doc Soporte, `4`=POS. |
| `sync` | query | No | `1` fuerza sincronización con la DIAN. |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

**✅ Respuesta Exitosa (HTTP 200)**

```json
{
  "dataRecords": {
    "data": [
      {
        "id": 1,
        "resolution_number": "18764074347312",
        "prefix": "LZT",
        "from_number": 1,
        "to_number": 5000000,
        "current_number": 836,
        "date_from": "2024-01-01",
        "date_to": "2027-12-31",
        "is_active": true
      }
    ]
  },
  "success": true
}
```

---

<!-- Fuente: https://docs.matias-api.com/docs/endpoints/events-radian -->

# 🔄 API de Eventos RADIAN

:::info Base URL, Autenticación & Multi-Tenant (`client_uuid`)
- **Base URL:** `/api/ubl2.1/events`
- **Autenticación:** Requiere header `Authorization: Bearer {token}` en todos los endpoints.
- **Plan requerido:** Todo el módulo de recepción (eventos, importación, buzón y personas de recepción) exige un **plan de pago vigente**. Ver [Requisito de plan](https://docs.matias-api.com/docs/endpoints/events-radian#requisito-de-plan).
- **Casas de Software (Multi-Tenant):** Puedes gestionar, consultar y transmitir eventos RADIAN en nombre de tus empresas cliente agregando el parámetro `?client_uuid={{client_uuid}}` a cualquiera de las URLs de esta sección.

**¿Dónde encontrar el `client_uuid` de tus clientes?**  
Puedes consultar el listado completo de tus empresas cliente y sus respectivos `client_uuid` mediante el endpoint:

```http
GET {{url}}/company/customers
Authorization: Bearer {token}
Content-Type: application/json
```

:::

**RADIAN** es la plataforma de la DIAN que permite la circulación electrónica de la Factura Electrónica de Venta (FEV) como título valor negociable. A través de esta API puedes registrar y transmitir los eventos del ciclo de vida de una factura desde la perspectiva del adquiriente, recibir facturas de tus proveedores en un buzón de correo y administrar las personas que firman los eventos.

### Requisito de plan

Todos los endpoints de `/api/ubl2.1/events/*` (recepciones, estado, archivos, importación, envío individual y en bloque, reenvío de correo, cancelación, eliminación, buzón y personas de recepción) exigen que la empresa tenga un **plan de pago vigente**: suscripción activa, no vencida y de un plan distinto de FREE.

* Un plan **FREE**, un plan de pago **vencido** o una empresa **sin suscripción** reciben `403` con `error_code: RECEPTION_NOT_IN_PLAN`. Esta respuesta se emite **antes** de validar el body, así que tiene prioridad sobre cualquier `422`.
* Quedarse **sin saldo** de documentos **no** quita el módulo: el plan ilimitado y los contratos mensuales o pospago tienen acceso mientras estén vigentes.
* Para una **sub-cuenta**, cuenta el plan de su Casa de Software.
* La empresa se determina con `client_uuid` (query o body) o, sin él, con la empresa del token. Si el `client_uuid` no es tuyo, la API responde el `403` habitual de acceso, que **no** trae `error_code`: así puedes distinguir un problema de plan de uno de permisos.
* Un cambio de plan puede tardar hasta **60 segundos** en reflejarse en la API.
* En el **Sandbox** el módulo siempre está incluido: este `403` no se emite.

```json
{
    "success": false,
    "message": "El plan FREE no incluye la recepción de facturas ni los eventos RADIAN. Actualice su plan para usarlos.",
    "error_code": "RECEPTION_NOT_IN_PLAN"
}
```

El mensaje es el mismo para plan FREE, plan vencido o empresa sin suscripción. Usa `error_code` para mostrar un aviso de actualización de plan sin cerrar la sesión del usuario.

:::caution 🆕 Migración: `MAILBOX_NOT_IN_PLAN` ya no se emite
El buzón (`GET /mailbox`, `GET /mailbox/{id}`, `GET /mailbox/address` y el resto de sus endpoints) es parte del módulo de recepción y responde este mismo `403` con `error_code` `RECEPTION_NOT_IN_PLAN`. Ya no devuelve `error_code` `MAILBOX_NOT_IN_PLAN` ni el mensaje «El plan FREE no incluye el buzón de recepción…». Si tu integración comparaba `error_code === "MAILBOX_NOT_IN_PLAN"`, compárala con `RECEPTION_NOT_IN_PLAN`.
:::

### Ciclo de vida de una factura en RADIAN

El flujo estándar de eventos es secuencial. **Importar el documento es opcional:** si envías un evento con `POST /send/{trackId}` sobre un CUFE/CUDE que la empresa aún no tiene registrado, la API descarga el documento de la DIAN y lo registra en ese momento.

```
[Importar CUFE (opcional)] → [030 Acuse de Recibo] → [032 Recibo del Bien] → [033 Aceptación Expresa]
                                                    ↘ [031 Reclamo]
```

:::caution Solo facturas de venta a crédito
La DIAN solo admite eventos RADIAN sobre **facturas electrónicas de venta a crédito**. Las facturas de **contado**, las facturas **sin medio de pago** (se asumen de contado) y las **notas crédito/débito** no generan ni admiten eventos: quedan registradas y visibles, con el motivo en el campo `status_reason`.
:::

### Eventos automáticos vs. manuales

El **modo de eventos** es una configuración de la **empresa** (`send_events`), que se cambia con [`PUT /reception-people/mode`](https://docs.matias-api.com/docs/endpoints/events-radian#modo-eventos):

| Modo | `send_events` | Qué ocurre al registrar una factura a crédito (buzón o importación por Excel/CUFE) |
|------|:---:|------|
| **Automático** | `true` | Se crean los eventos `030`, `032` y `033` y se envían a la DIAN sin intervención del usuario. El `033` automático quita la posibilidad de reclamar con el `031`. El `031` nunca es automático. |
| **Manual** | `false` | No se crea **ningún** evento, **tampoco el `030`**. El usuario los envía con `POST /send/{trackId}` o `POST /send-bulk`. |

Reglas:

* **Una empresa nueva arranca en modo manual.**
* Si la empresa pasa a manual, los eventos que quedaron pendientes de envío automático **no** salen a la DIAN.
* Lo que pide el usuario (`POST /send/{trackId}` y `POST /send-bulk`) **siempre se envía**, también en modo manual.
* Sin persona de recepción, el buzón se trata como manual y la importación por Excel/CUFE responde `400` `No tiene una persona de recepción asignada` (salvo que envíes `reception_person` en la misma solicitud).
* El envío automático solo toma eventos pendientes creados en los **últimos 3 días** y de empresas con plan de pago vigente. Si la empresa pierde el plan, sus pendientes no se envían; al volver a un plan vigente, salen los de los últimos 3 días.
* Nunca se duplica un evento del mismo tipo para el mismo documento, aunque la empresa cambie de numeración.
* Un evento **aceptado** por la DIAN consume un documento del plan **una sola vez**.

### Tipos de Evento Soportados

| Código | Nombre Oficial DIAN | Requiere `claim_code` |
|--------|---------------------|-----------------------|
| `030` | Acuse de Recibo de Factura Electrónica | No |
| `031` | Reclamo de la Factura Electrónica de Venta | **Sí** |
| `032` | Recibo del Bien y/o Prestación del Servicio | No |
| `033` | Aceptación Expresa | No |

---

## 📥 1. Importación y Encolamiento

:::info Prerrequisitos de la importación
Antes de importar, la empresa necesita, en este orden:
1. Una **numeración activa para eventos de recepción**. Sin ella: `400` `No tiene una numeración activa para los eventos de recepción`.
2. Una **persona de recepción** (ver [Personas de recepción](https://docs.matias-api.com/docs/endpoints/events-radian#personas-recepcion)), salvo que envíes sus datos en `reception_person`. Sin ella: `400` `No tiene una persona de recepción asignada`. Si envías un `reception_person_uuid` que no es de la empresa: `404`.

El procesamiento es **asíncrono**: el resultado de cada documento se consulta en [`GET /document-receptions`](https://docs.matias-api.com/docs/endpoints/events-radian#consultas) (campos `import_status` y `status_reason`). Los eventos automáticos solo se crean si la empresa está en [modo automático](https://docs.matias-api.com/docs/endpoints/events-radian#eventos-automaticos).
:::

:::note Persona elegida al importar
La persona que indicas al importar (`reception_person_uuid` o `reception_person`) se guarda con la recepción y **solo firma los eventos automáticos** (`030`, `032` y `033` en modo automático) que transmite el envío programado.

* En **modo manual** la importación no crea eventos, así que esa persona no firma nada.
* Los envíos que pides tú ([`POST /send/{trackId}`](https://docs.matias-api.com/docs/endpoints/events-radian#envio-eventos) y [`POST /send-bulk`](https://docs.matias-api.com/docs/endpoints/events-radian#envio-en-bloque)) firman con el `reception_person_uuid` de **esa** solicitud o, sin él, con la persona por defecto de la empresa. No usan la persona elegida al importar.

Si trabajas en modo manual y quieres que firme una persona distinta de la por defecto, envía `reception_person_uuid` en cada envío.
:::

**POST /import-excel — Importar desde Excel**

Permite importar múltiples documentos a RADIAN desde el archivo Excel `.xlsx`/`.xls` que exporta la DIAN. El archivo debe enviarse codificado en **base64**. Máximo **500 filas** por archivo.

**Body (JSON):**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `document_base64` | `string` | **Sí** | Archivo Excel (`.xlsx`/`.xls`) codificado en base64. Máximo **5 MB** decodificado. |
| `reception_person_uuid` | `string` (uuid) | No | Persona de recepción que firma los eventos **automáticos** de todo el lote. Sin él, se usa la persona por defecto. Ver [Persona elegida al importar](https://docs.matias-api.com/docs/endpoints/events-radian#persona-importacion). |
| `reception_person` | `object` | No | Datos de quien firma, enviados en la misma solicitud (ver tabla abajo). Si se envía, se ignora `reception_person_uuid`. Se aplica a todo el lote. |

**Objeto `reception_person` (opcional):**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `identity_document_id` | `integer` | **Sí** | Tipo de documento de identidad (catálogo `GET {{url}}/identity-documents`) |
| `dni` | `string` (máx. 20) | **Sí** | Número de identificación |
| `dv` | `string` (máx. 2) | No | Dígito de verificación |
| `first_name` | `string` (máx. 60) | **Sí** | Nombres |
| `last_name` | `string` (máx. 60) | **Sí** | Apellidos |
| `job_title` | `string` (máx. 100) | No | Cargo |
| `department` | `string` (máx. 100) | No | Área o departamento |

> [!WARNING]
> El envío de archivos binarios (`multipart/form-data`) ya no es soportado: la API responde `422` con un mensaje que explica cómo enviar el archivo en base64 dentro de un JSON.

**cURL**

```bash
curl -X POST "{{url}}/events/import-excel" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "document_base64": "UEsDBBQABgAIAAAAIQBi7p..."
  }'
```

**JavaScript (Axios)**

```js
const fs = require('fs');

const fileBase64 = fs.readFileSync('facturas.xlsx').toString('base64');

const response = await axios.post(`${url}/events/import-excel`, {
  document_base64: fileBase64
}, {
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

**PHP (Guzzle)**

```php
$fileBase64 = base64_encode(file_get_contents('facturas.xlsx'));

$response = $client->post("{$url}/events/import-excel", [
    'headers' => [
        'Authorization' => "Bearer {$token}",
        'Content-Type'  => 'application/json',
    ],
    'json' => [
        'document_base64' => $fileBase64,
    ],
]);
```

**💻 Ver Respuesta Exitosa (200)**

```json
{
    "message": "Importación procesada.",
    "total_rows": 18,
    "queued": 6,
    "skipped": 10,
    "cash": 2,
    "skipped_details": [
        {
            "row": 5,
            "cufe": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
            "reason_code": "DOCUMENT_TYPE_NOT_ALLOWED",
            "message": "Tipo de documento 'Nota de crédito electrónica' no admite eventos RADIAN: solo se procesan facturas electrónicas de venta."
        }
    ],
    "errors": [
        "Fila 9: CUFE/CUDE vacío."
    ],
    "success": true
}
```

**Explicación de la respuesta:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `total_rows` | `int` | Total de filas leídas del Excel |
| `queued` | `int` | Documentos encolados para procesamiento (incluye los CUFE ya registrados que se reprocesan: los que fallaron antes o los que eliminó el sistema) |
| `skipped` | `int` | Filas omitidas (las de `skipped_details` y las de `errors`) |
| `cash` | `int` | Facturas de **contado** según la columna `Forma de Pago` = `1`: se registran completas y visibles sin consultar la DIAN y **sin eventos**. No cuentan en `queued` ni en `skipped`. |
| `skipped_details` | `array` | Detalle de cada fila omitida: `row`, `cufe`, `reason_code` y `message` |
| `errors` | `array` | Errores por fila, como texto (p. ej. `Fila N: NIT receptor (x) no coincide con la empresa (y).` o `Fila N: CUFE/CUDE vacío.`) |

**Valores de `reason_code` en `skipped_details`:**

| `reason_code` | Motivo |
|---|---|
| `GROUP_NOT_RECEIVED` | La fila no pertenece al grupo `Recibido` |
| `DUPLICATED_IN_FILE` | El CUFE/CUDE está repetido en el archivo |
| `DOCUMENT_TYPE_NOT_ALLOWED` | Notas y otros tipos: solo se procesan facturas electrónicas de venta |
| `ALREADY_IMPORTED` | El CUFE/CUDE ya está registrado; `message` trae el motivo (ya importado, de contado, omitido o `El cufe/cude ya está en proceso de importación.`) |
| `USER_DELETED` | El usuario eliminó esa recepción: `El documento fue eliminado de la recepción; para recuperarlo impórtelo de nuevo por su CUFE.` La importación por Excel **no** restaura lo que el usuario eliminó. |

**❌ Ver Respuestas de Error**

| HTTP | Mensaje | Causa |
|:---:|---|---|
| `400` | `El archivo excede el límite de 500 filas. Filas encontradas: N.` | Más de 500 filas en el archivo |
| `400` | `No tiene una numeración activa para los eventos de recepción` | La empresa no tiene numeración activa de eventos |
| `400` | `No tiene una persona de recepción asignada` | Sin persona de recepción y sin `reception_person` |
| `403` | `RECEPTION_NOT_IN_PLAN` | Ver [Requisito de plan](https://docs.matias-api.com/docs/endpoints/events-radian#requisito-de-plan) |
| `404` | `La persona de recepción indicada (reception_person_uuid) no existe para esta empresa` | `reception_person_uuid` ajeno o eliminado |
| `422` | `El archivo decodificado no puede superar los 5MB.` | Archivo de más de 5 MB |
| `422` | `El archivo debe ser de tipo Excel (.xlsx o .xls).` | El contenido no es un Excel |
| `422` | `El campo document base64 no contiene un string base64 válido.` | `document_base64` no es base64 válido |

Los `422` de validación siguen el formato `{"message": "...", "errors": {"campo": ["..."]}}`.

**POST /import-track-id — Importar por Track ID**

Importa un documento individual a RADIAN usando su CUFE o CUDE.

**Body (JSON):**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `trackId` | `string` | **Sí** | CUFE o CUDE del documento a importar (entre 10 y 255 caracteres) |
| `reception_person_uuid` | `string` (uuid) | No | Persona de recepción que firma los eventos **automáticos** de este documento. Sin él, se usa la persona por defecto. Ver [Persona elegida al importar](https://docs.matias-api.com/docs/endpoints/events-radian#persona-importacion). |
| `reception_person` | `object` | No | Datos de quien firma, con los mismos campos que en [`/import-excel`](https://docs.matias-api.com/docs/endpoints/events-radian#importacion). Si se envía, se ignora `reception_person_uuid`. |

:::tip Ruta alternativa
También existe `POST /{trackId}/import`, pero esa ruta **también exige** el campo `trackId` en el body (sin él responde `422` `No ha enviado un trackId.`); cuando el body lo trae, se usa el de la URL. Recomendamos usar `POST /import-track-id`.
:::

**cURL**

```bash
curl -X POST "{{url}}/events/import-track-id" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "trackId": "{{trackId}}"
  }'
```

**JavaScript (Axios)**

```js
const response = await axios.post(`${url}/events/import-track-id`, {
  trackId: trackId
}, {
  headers: { Authorization: `Bearer ${token}` }
});
```

**PHP (Guzzle)**

```php
$response = $client->post("{$url}/events/import-track-id", [
    'headers' => ['Authorization' => "Bearer {$token}"],
    'json'    => ['trackId' => $trackId],
]);
```

**💻 Ver Respuesta Exitosa (200)**

Documento nuevo:

```json
{
    "message": "Documento encolado para procesamiento.",
    "id": 42,
    "success": true
}
```

**Reimportación** de un CUFE ya registrado que fue eliminado (por el usuario o por el sistema) o cuya importación falló: se restaura y se vuelve a encolar.

```json
{
    "message": "Documento encolado nuevamente para procesamiento.",
    "id": 42,
    "success": true
}
```

**❌ Ver Respuestas de Error**

| HTTP | Mensaje | Causa |
|:---:|---|---|
| `400` | `El cufe/cude ya ha sido importado.` (más el motivo, si lo hay; p. ej. contado) | El documento ya está registrado y completo |
| `400` | `No tiene una numeración activa para los eventos de recepción` | La empresa no tiene numeración activa de eventos |
| `400` | `No tiene una persona de recepción asignada` | Sin persona de recepción y sin `reception_person` |
| `403` | `RECEPTION_NOT_IN_PLAN` | Ver [Requisito de plan](https://docs.matias-api.com/docs/endpoints/events-radian#requisito-de-plan) |
| `404` | `La persona de recepción indicada (reception_person_uuid) no existe para esta empresa` | `reception_person_uuid` ajeno o eliminado |
| `409` | `El cufe/cude ya está en proceso de importación.` | El documento se está importando |
| `409` | `El cufe/cude ya ha sido importado.` seguido del motivo | El documento fue omitido (p. ej. una nota crédito/débito) |
| `422` | `No ha enviado un trackId.` / `El trackId debe tener al menos 10 caracteres.` / `El trackId no puede superar los 255 caracteres.` / `reception_person_uuid debe ser un UUID válido.` | Validación del body |

Si al procesarlo el plan ya no incluye el módulo, el documento queda con `import_status` `FAILED` y el motivo del plan en `status_reason`. Una nota crédito/débito o un tipo no soportado queda `SKIPPED` con su motivo (no se borra).

---

## 🔍 2. Consultas y Detalles

:::tip Flujo recomendado
`import-track-id` → `document-receptions` (espera `import_status` = `COMPLETED` y `status_reason` = `null`) → `send/{trackId}`  
Un documento con `status_reason` distinto de `null` no admite eventos o aún se está importando.
:::

**GET /document-receptions — Listar Recepciones**

**Query Params:**

| Parámetro | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `trackId` | `string` | — | Buscar por CUFE/CUDE exacto. Si se envía, se ignoran `query`, `startDate` y `endDate`. |
| `query` | `string` | — | Buscar por folio, razón social o NIT del emisor |
| `startDate` | `string` | — | Fecha inicio (`YYYY-MM-DD`) de **registro en la plataforma** (no de emisión) |
| `endDate` | `string` | — | Fecha fin (`YYYY-MM-DD`) de registro. Se compara a medianoche: no incluye los registros de ese mismo día. |
| `limit` | `int` | 20 | Registros por página (máx. 50) |
| `client_uuid` | `string` | — | UUID del cliente (Multi-Tenant) |

El resultado se ordena por fecha de emisión, de la más reciente a la más antigua.

**cURL**

```bash
curl -X GET "{{url}}/events/document-receptions?startDate=2026-08-01&endDate=2026-08-31&limit=20" \
  -H "Authorization: Bearer {token}"
```

**JavaScript (Axios)**

```js
const response = await axios.get(`${url}/events/document-receptions`, {
  params: { startDate: '2026-08-01', endDate: '2026-08-31', limit: 20 },
  headers: { Authorization: `Bearer ${token}` }
});
```

**PHP (Guzzle)**

```php
$response = $client->get("{$url}/events/document-receptions", [
    'headers' => ['Authorization' => "Bearer {$token}"],
    'query'   => ['startDate' => '2026-08-01', 'endDate' => '2026-08-31', 'limit' => 20],
]);
```

**💻 Ver Respuesta Exitosa (200)**

Se muestran los campos principales de cada recepción.

```json
{
    "dataRecords": {
        "current_page": 1,
        "data": [
            {
                "id": 42,
                "cufe_cude": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
                "folio": "FE1001",
                "issue_date": "15-08-2026",
                "total": "1190000.00",
                "document_origin": "RECEIVED",
                "import_status": "COMPLETED",
                "status_reason": null,
                "people": {
                    "id": 7,
                    "dni": "900123456",
                    "company_name": "PROVEEDOR DE EJEMPLO S.A.S.",
                    "email": "facturacion@proveedor-ejemplo.com",
                    "address": "Calle 1 # 2-3",
                    "phone": "3000000000"
                }
            }
        ],
        "per_page": 20,
        "total": 18
    },
    "success": true
}
```

**Campos de estado de cada recepción:**

| Campo | Descripción |
|-------|-------------|
| `import_status` | `PENDING`, `PROCESSING`, `COMPLETED`, `SKIPPED` (omitido, p. ej. una nota) o `FAILED` |
| `document_origin` | `IMPORTED` (Excel, CUFE o envío de evento) o `RECEIVED` (llegó por el buzón) |
| `status_reason` | `null` si el documento admite eventos. Si no, el motivo legible (tabla abajo). |

**Valores de `status_reason`:**

| Situación | Texto |
|---|---|
| Factura de contado | `Factura de contado: la DIAN no admite eventos RADIAN (acuse, recibo, aceptación o reclamo) para facturas de contado.` |
| Nota omitida (`SKIPPED`) | `Nota crédito/débito: la DIAN no admite eventos RADIAN sobre notas; solo se procesan facturas electrónicas de venta.` |
| Tipo no soportado (`SKIPPED`) | `Tipo de documento 'X' no soportado para eventos RADIAN: solo se procesan facturas electrónicas de venta (01).` |
| Importación fallida (`FAILED`) | `No fue posible obtener el documento desde la DIAN. Puede volver a importar el CUFE.` |
| Documento ilegible (`FAILED`) | `El documento que devolvió la DIAN para este CUFE no es una factura electrónica legible. Verifique el CUFE o contacte a soporte.` |
| Sin plan al procesar (`FAILED`) | `El plan FREE no incluye la recepción de facturas ni los eventos RADIAN. Actualice su plan para usarlos.` |
| En proceso (`PENDING` / `PROCESSING`) | `El documento se está importando; el resultado aparecerá en el listado en unos segundos.` |

**GET /document-receptions/{documentId} — Detalle de Recepción con Eventos**

Devuelve la recepción con su arreglo `events`. Ahí está el **`id` numérico de cada evento**, que necesitas para [cancelarlo](https://docs.matias-api.com/docs/endpoints/events-radian#cancelar-evento) o [reenviar su correo](https://docs.matias-api.com/docs/endpoints/events-radian#reenvio-correo), y su `document_status` (`PENDING`, `PROCESSING`, `ACCEPTED`, `REJECTED`, `CANCELLED` o `UNKNOWN`), que muestra el resultado final de un [envío en bloque](https://docs.matias-api.com/docs/endpoints/events-radian#envio-en-bloque).

**Path Params:**

| Parámetro | Tipo | Descripción |
|-------|------|-------------|
| `documentId` | `int` | ID de la recepción (campo `id` del listado) |

Si el `documentId` no existe o es de otra empresa, la respuesta es `200` con `data` vacío (no `404`).

**💻 Ver Respuesta Exitosa (200)**

Se muestran los campos principales.

```json
{
    "dataRecords": {
        "current_page": 1,
        "data": [
            {
                "id": 42,
                "cufe_cude": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
                "folio": "FE1001",
                "issue_date": "15-08-2026",
                "total": "1190000.00",
                "document_origin": "IMPORTED",
                "import_status": "COMPLETED",
                "status_reason": null,
                "people": {
                    "id": 7,
                    "dni": "900123456",
                    "company_name": "PROVEEDOR DE EJEMPLO S.A.S.",
                    "email": "facturacion@proveedor-ejemplo.com",
                    "address": "Calle 1 # 2-3",
                    "phone": "3000000000"
                },
                "events": [
                    {
                        "id": 128,
                        "type_event_id": 1,
                        "event_number": "EV1",
                        "date_event": "16-08-2026 09:30:00 am",
                        "description": "Acuso recibido de factura.",
                        "document_status": "ACCEPTED",
                        "send_mail": 1
                    }
                ]
            }
        ],
        "total": 1
    },
    "success": true
}
```

**GET /document-receptions/{documentId}/files — Archivos de una Recepción**

Lista los archivos custodiados de una recepción que llegó por el [buzón de recepción](https://docs.matias-api.com/docs/endpoints/events-radian#buzon-recepcion). Las recepciones importadas por Excel o CUFE no tienen archivos y devuelven una lista vacía.

**Path Params:**

| Parámetro | Tipo | Descripción |
|-------|------|-------------|
| `documentId` | `int` | ID de la recepción |

**cURL**

```bash
curl -X GET "{{url}}/events/document-receptions/42/files" \
  -H "Authorization: Bearer {token}"
```

**JavaScript (Axios)**

```js
const response = await axios.get(`${url}/events/document-receptions/${documentId}/files`, {
  headers: { Authorization: `Bearer ${token}` }
});
```

**PHP (Guzzle)**

```php
$response = $client->get("{$url}/events/document-receptions/{$documentId}/files", [
    'headers' => ['Authorization' => "Bearer {$token}"],
]);
```

**💻 Ver Respuesta Exitosa (200)**

```json
{
    "dataRecords": {
        "data": [
            {
                "id": 9001,
                "type_document": "XML",
                "file_name": "document.xml",
                "mime_type": "application/xml",
                "file_size": 18432,
                "created_at": "2026-08-15T14:20:00.000000Z"
            },
            {
                "id": 9002,
                "type_document": "ZIP",
                "file_name": "fe1001.zip",
                "mime_type": "application/zip",
                "file_size": 9216,
                "created_at": "2026-08-15T14:20:00.000000Z"
            }
        ]
    },
    "success": true
}
```

| Campo | Descripción |
|-------|-------------|
| `id` | ID del archivo, para la descarga |
| `type_document` | `INBOUND_EMAIL_RAW` (correo original, `original.eml`), `XML` (el documento electrónico, `document.xml`), `ZIP` (el adjunto, con el nombre que traía en el correo) o `ATTACHED_DOC` (cuando el documento llegó como AttachedDocument XML suelto en lugar de ZIP) |
| `file_size` | Tamaño en bytes (puede ser `null`) |

**❌ Recepción no encontrada (HTTP 404)**

```json
{
    "success": false,
    "message": "Recepción de documento no encontrada."
}
```

**GET /document-receptions/{documentId}/files/{fileManagerId}/download — Descargar Archivo**

Devuelve el **binario** del archivo con su `Content-Type` y el encabezado `Content-Disposition: attachment; filename="..."`.

**Path Params:**

| Parámetro | Tipo | Descripción |
|-------|------|-------------|
| `documentId` | `int` | ID de la recepción |
| `fileManagerId` | `int` | `id` del archivo (de `/files` o de `files` en `GET /mailbox/{id}`) |

**cURL**

```bash
curl -X GET "{{url}}/events/document-receptions/42/files/9001/download" \
  -H "Authorization: Bearer {token}" \
  -o fe1001.xml
```

**JavaScript (Axios)**

```js
const response = await axios.get(
  `${url}/events/document-receptions/${documentId}/files/${fileId}/download`,
  {
    headers: { Authorization: `Bearer ${token}` },
    responseType: 'arraybuffer'
  }
);
```

**PHP (Guzzle)**

```php
$response = $client->get("{$url}/events/document-receptions/{$documentId}/files/{$fileId}/download", [
    'headers' => ['Authorization' => "Bearer {$token}"],
    'sink'    => 'fe1001.xml',
]);
```

**❌ Ver Respuestas de Error (HTTP 404)**

| Mensaje | Causa |
|---|---|
| `Recepción de documento no encontrada.` | La recepción no existe o es de otra empresa |
| `Archivo no encontrado para esta recepción de documento.` | El archivo no pertenece a esa recepción |
| `El archivo no está disponible en el almacenamiento.` | El archivo ya no está almacenado |

:::caution 🆕 El 403 de plan llega en JSON
Sin plan de pago vigente, la descarga responde `403` en **JSON**, aunque hayas pedido un binario ([Requisito de plan](https://docs.matias-api.com/docs/endpoints/events-radian#requisito-de-plan)):

```json
{
    "success": false,
    "message": "El plan FREE no incluye la recepción de facturas ni los eventos RADIAN. Actualice su plan para usarlos.",
    "error_code": "RECEPTION_NOT_IN_PLAN"
}
```

Si pides la descarga como `blob` o `arraybuffer`, lee el cuerpo del error como texto JSON para obtener el `error_code`. Por ejemplo, con Axios: `JSON.parse(new TextDecoder().decode(error.response.data))` con `arraybuffer`, o `JSON.parse(await error.response.data.text())` con `blob`.
:::

**GET /status/{trackId} — Consultar Estado de Evento**

**Path Params:**

| Parámetro | Tipo | Descripción |
|-------|------|-------------|
| `trackId` | `string` | CUFE o CUDE del documento |

**cURL**

```bash
curl -X GET "{{url}}/events/status/{{trackId}}" \
  -H "Authorization: Bearer {token}"
```

**JavaScript (Axios)**

```js
const response = await axios.get(`${url}/events/status/${trackId}`, {
  headers: { Authorization: `Bearer ${token}` }
});
```

**PHP (Guzzle)**

```php
$response = $client->get("{$url}/events/status/{$trackId}", [
    'headers' => ['Authorization' => "Bearer {$token}"],
]);
```

**💻 Ver Respuesta Exitosa (200)**

`ResponseDian` trae la respuesta de la consulta a la DIAN.

```json
{
    "message": "Consulta generada con éxito",
    "ResponseDian": {},
    "success": true
}
```

---

## 📤 3. Envío de Eventos a la DIAN

Todos los eventos se envían al mismo endpoint. El tipo de evento se determina por el campo `code` en el body.

**Endpoint:** `POST {{url}}/events/send/{{trackId}}`

| Parámetro | Ubicación | Tipo | Requerido | Descripción |
|-----------|-----------|------|:---:|-------------|
| `trackId` | Path | `string` | **Sí** | CUFE o CUDE del documento recibido |
| `code` | Body | `string` | **Sí** | Código del evento RADIAN (`030`–`033`) |
| `notes` | Body | `string` | No | Descripción o nota del evento (máx. 200 caracteres) |
| `claim_code` | Body | `string` | Solo `031` | ⚠️ **Solo evento `031`** — Código del motivo del reclamo |
| `reception_person_uuid` | Body | `string` (uuid) | No | Persona de recepción que firma el evento. Sin él, firma la persona por defecto. |

:::info Reglas del envío individual
* **Síncrono:** la respuesta llega después de transmitir a la DIAN. Es `200` también cuando la DIAN **rechaza** el evento: queda en `REJECTED` y `data` trae la respuesta de la DIAN. Cuando la DIAN lo acepta, `data` es `{"IsValid": "true"}`.
* **Sin importación previa:** si la empresa no tiene recepción para ese CUFE/CUDE, la API descarga el documento de la DIAN y lo registra (`document_origin` = `IMPORTED`). Solo admite facturas y notas (tipos `01`, `91`, `92`); luego aplica la regla de crédito: contado o nota responden `400` con el motivo. Sin medio de pago en el XML se asume contado.
* **Sin duplicados:** si el documento ya tiene un evento de ese tipo (en cualquier numeración), se reutiliza. Se reenvía un evento `PENDING`, `REJECTED`, `CANCELLED` o `UNKNOWN`; nunca uno `ACCEPTED`. 🆕 Si el evento reutilizado se creó con una numeración distinta de la vigente, al reenviarlo (aquí o con [`/send-bulk`](https://docs.matias-api.com/docs/endpoints/events-radian#envio-en-bloque)) pasa a la numeración activa de eventos y toma su siguiente número, así que cambia el número del evento en el detalle de la recepción. Si ya está en la numeración vigente, conserva su número.
* **Sale también en modo manual.**
* Si otro proceso (envío automático, envío en bloque u otra petición) está transmitiendo el mismo evento, responde `409`: no se envía en paralelo ni se cobra dos veces. Si ese envío falla, puedes reintentar.
:::

**❌ Respuestas de error comunes a los eventos 030, 031, 032 y 033**

Cuerpo: `{"success": false, "message": "..."}`, salvo el `422` de validación (formato `{"message": "...", "errors": {...}}`) y el `403` de plan.

| HTTP | Mensaje | Causa |
|:---:|---|---|
| `400` | `El tipo de evento no existe` | `code` inválido |
| `400` | `El código de reclamación es obligatorio.` | Evento `031` sin `claim_code` |
| `400` | `El código de reclamación no existe.` | `claim_code` inválido |
| `400` | `No tiene una persona de recepción asignada` | La empresa no tiene persona de recepción |
| `400` | `Factura de contado: la DIAN no admite eventos RADIAN (acuse, recibo, aceptación o reclamo) para facturas de contado.` | Documento de contado (o sin medio de pago) |
| `400` | `Nota crédito/débito: la DIAN no admite eventos RADIAN sobre notas; solo se procesan facturas electrónicas de venta.` | El documento es una nota (o el `status_reason` de un documento omitido) |
| `400` | `El tipo de documento no es permitido` | El CUFE/CUDE descargado de la DIAN no es factura ni nota |
| `400` | `No tiene una numeración activa para los eventos de recepción` | La empresa no tiene numeración activa de eventos |
| `400` | `El evento ya fue validado y aceptado.` | El evento ya está `ACCEPTED` |
| `403` | `RECEPTION_NOT_IN_PLAN` | Ver [Requisito de plan](https://docs.matias-api.com/docs/endpoints/events-radian#requisito-de-plan) |
| `404` | `La persona de recepción indicada (reception_person_uuid) no existe para esta empresa` | `reception_person_uuid` ajeno o eliminado (sin efectos) |
| `409` | `El evento ya se está enviando.` | Otro proceso lo está transmitiendo |
| `422` | `reception_person_uuid debe ser un UUID válido.` | `reception_person_uuid` mal formado |

---

### Evento 030 — Acuse de Recibo

**POST /send/{trackId} — `030` Acuse de Recibo de Factura Electrónica**

El adquiriente confirma que recibió la factura electrónica. **Es el primer evento obligatorio** antes de poder enviar cualquier otro.

**Body (JSON):**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `code` | `string` | **Sí** | Fijo: `"030"` |
| `notes` | `string` | No | Nota o descripción del acuse |
| `reception_person_uuid` | `string` (uuid) | No | Persona que firma; sin él, la persona por defecto |

**cURL**

```bash
curl -X POST "{{url}}/events/send/{{trackId}}" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "030",
    "notes": "Acuso recibido de factura."
  }'
```

**JavaScript (Axios)**

```js
const response = await axios.post(`${url}/events/send/${trackId}`, {
  code: '030',
  notes: 'Acuso recibido de factura.'
}, {
  headers: { Authorization: `Bearer ${token}` }
});
```

**PHP (Guzzle)**

```php
$response = $client->post("{$url}/events/send/{$trackId}", [
    'headers' => ['Authorization' => "Bearer {$token}"],
    'json'    => [
        'code'  => '030',
        'notes' => 'Acuso recibido de factura.',
    ],
]);
```

**💻 Ver Respuesta Exitosa (200)**

`message` es `Evento creado con éxito` cuando el evento es nuevo y `Evento enviado con éxito` cuando se reenvía uno existente.

```json
{
    "message": "Evento creado con éxito",
    "data": {
        "IsValid": "true"
    },
    "success": true
}
```

---

### Evento 031 — Reclamo de la FEV

**POST /send/{trackId} — `031` Reclamo de la Factura Electrónica de Venta**

El adquiriente registra un reclamo sobre la factura. Requiere el campo adicional `claim_code` con el motivo del reclamo.

:::caution Prerrequisito
Solo puede enviarse después de haber enviado el evento **030** (Acuse de Recibo). Si la empresa está en [modo automático](https://docs.matias-api.com/docs/endpoints/events-radian#eventos-automaticos), el `033` automático quita la posibilidad de reclamar.
:::

**Body (JSON):**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `code` | `string` | **Sí** | Fijo: `"031"` |
| `notes` | `string` | No | Descripción del reclamo |
| `claim_code` | `string` | **Sí** | Motivo del reclamo (ver tabla abajo) |
| `reception_person_uuid` | `string` (uuid) | No | Persona que firma; sin él, la persona por defecto |

**Valores válidos para `claim_code`:**

| `claim_code` | Descripción |
|---|---|
| `01` | Documento con inconsistencias |
| `02` | Mercancía no entregada |
| `03` | Mercancía entregada parcialmente |
| `04` | Servicio no prestado |

:::tip Endpoint de consulta
Puedes obtener siempre la lista actualizada de conceptos de reclamo desde:

```http
GET {{url}}/claim-concepts
```

:::

**cURL**

```bash
curl -X POST "{{url}}/events/send/{{trackId}}" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "031",
    "notes": "Reclamo de la Factura Electrónica de Venta.",
    "claim_code": "01"
  }'
```

**JavaScript (Axios)**

```js
const response = await axios.post(`${url}/events/send/${trackId}`, {
  code: '031',
  notes: 'Reclamo de la Factura Electrónica de Venta.',
  claim_code: '01'
}, {
  headers: { Authorization: `Bearer ${token}` }
});
```

**PHP (Guzzle)**

```php
$response = $client->post("{$url}/events/send/{$trackId}", [
    'headers' => ['Authorization' => "Bearer {$token}"],
    'json'    => [
        'code'       => '031',
        'notes'      => 'Reclamo de la Factura Electrónica de Venta.',
        'claim_code' => '01',
    ],
]);
```

**💻 Ver Respuesta Exitosa (200)**

```json
{
    "message": "Evento creado con éxito",
    "data": {
        "IsValid": "true"
    },
    "success": true
}
```

---

### Evento 032 — Recibo del Bien y/o Servicio

**POST /send/{trackId} — `032` Recibo del Bien y/o Prestación del Servicio**

El adquiriente confirma que recibió el bien o que el servicio fue prestado conforme a lo acordado.

:::caution Prerrequisito
Solo puede enviarse después de haber enviado el evento **030** (Acuse de Recibo).
:::

**Body (JSON):**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `code` | `string` | **Sí** | Fijo: `"032"` |
| `notes` | `string` | No | Nota del recibo del bien/servicio |
| `reception_person_uuid` | `string` (uuid) | No | Persona que firma; sin él, la persona por defecto |

**cURL**

```bash
curl -X POST "{{url}}/events/send/{{trackId}}" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "032",
    "notes": "Recibo del bien y/o prestación del servicio."
  }'
```

**JavaScript (Axios)**

```js
const response = await axios.post(`${url}/events/send/${trackId}`, {
  code: '032',
  notes: 'Recibo del bien y/o prestación del servicio.'
}, {
  headers: { Authorization: `Bearer ${token}` }
});
```

**PHP (Guzzle)**

```php
$response = $client->post("{$url}/events/send/{$trackId}", [
    'headers' => ['Authorization' => "Bearer {$token}"],
    'json'    => [
        'code'  => '032',
        'notes' => 'Recibo del bien y/o prestación del servicio.',
    ],
]);
```

**💻 Ver Respuesta Exitosa (200)**

```json
{
    "message": "Evento creado con éxito",
    "data": {
        "IsValid": "true"
    },
    "success": true
}
```

---

### Evento 033 — Aceptación Expresa

**POST /send/{trackId} — `033` Aceptación Expresa**

El adquiriente acepta expresamente la factura como título valor, habilitándola para su circulación y negociación en el mercado de valores.

:::caution Prerrequisito
Solo puede enviarse después de haber enviado los eventos **030** y **032** en ese orden.
:::

**Body (JSON):**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `code` | `string` | **Sí** | Fijo: `"033"` |
| `notes` | `string` | No | Nota de la aceptación expresa |
| `reception_person_uuid` | `string` (uuid) | No | Persona que firma; sin él, la persona por defecto |

**cURL**

```bash
curl -X POST "{{url}}/events/send/{{trackId}}" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "033",
    "notes": "Aceptación expresa."
  }'
```

**JavaScript (Axios)**

```js
const response = await axios.post(`${url}/events/send/${trackId}`, {
  code: '033',
  notes: 'Aceptación expresa.'
}, {
  headers: { Authorization: `Bearer ${token}` }
});
```

**PHP (Guzzle)**

```php
$response = $client->post("{$url}/events/send/{$trackId}", [
    'headers' => ['Authorization' => "Bearer {$token}"],
    'json'    => [
        'code'  => '033',
        'notes' => 'Aceptación expresa.',
    ],
]);
```

**💻 Ver Respuesta Exitosa (200)**

```json
{
    "message": "Evento creado con éxito",
    "data": {
        "IsValid": "true"
    },
    "success": true
}
```

---

### Envío en bloque del acuse 030

**POST /send-bulk — Enviar el acuse `030` a varias recepciones 🆕**

Envía el acuse de recibo (`030`) a varias recepciones de la empresa en una sola solicitud. Es la forma práctica de acusar en [modo manual](https://docs.matias-api.com/docs/endpoints/events-radian#eventos-automaticos).

**Body (JSON):**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `document_ids` | `array` de `int` | **Sí** | IDs de las recepciones (campo `id` de `GET /document-receptions`). Mínimo 1, máximo **50** por solicitud. Los repetidos se envían una sola vez. |
| `code` | `string` | **Sí** | Solo se admite `"030"` |
| `reception_person_uuid` | `string` (uuid) | No | Persona que firma; sin él, la persona por defecto |
| `client_uuid` | `string` | No | UUID de la empresa cliente (Casa de Software). También puede ir en el query. |

:::info Reglas del envío en bloque
* **Asíncrono:** `queued` significa **encolado**, no aceptado. El resultado final de cada documento se consulta en [`GET /document-receptions/{documentId}`](https://docs.matias-api.com/docs/endpoints/events-radian#consultas) (`document_status` del evento).
* **Siempre se envía**, también si la empresa está en modo manual.
* **Idempotente:** nunca crea un segundo `030` para el mismo documento. Un `030` `ACCEPTED` o en envío no se reenvía; uno `PENDING`, `REJECTED`, `CANCELLED` o `UNKNOWN` sí se envía.
* Un evento encolado por esta vía pasa de inmediato a envío (`PROCESSING`) y **no se puede cancelar** con `/{id}/cancel`.
* 🆕 **Plan perdido con el envío en cola:** si al momento de transmitir el `030` la empresa ya no tiene plan de pago vigente (bajó a FREE o venció), no se envía ni se cobra. El evento queda `REJECTED` y se notifica con el motivo del plan. Con un plan de pago vigente puedes volver a enviarlo (`/send/{trackId}` o `/send-bulk`). En cambio, un evento **automático** que ya estaba en cola vuelve a `PENDING` y sale solo si la empresa recupera el plan dentro de la ventana de 3 días.
:::

**cURL**

```bash
curl -X POST "{{url}}/events/send-bulk" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "document_ids": [42, 43, 44],
    "code": "030"
  }'
```

**JavaScript (Axios)**

```js
const response = await axios.post(`${url}/events/send-bulk`, {
  document_ids: [42, 43, 44],
  code: '030'
}, {
  headers: { Authorization: `Bearer ${token}` }
});
```

**PHP (Guzzle)**

```php
$response = $client->post("{$url}/events/send-bulk", [
    'headers' => ['Authorization' => "Bearer {$token}"],
    'json'    => [
        'document_ids' => [42, 43, 44],
        'code'         => '030',
    ],
]);
```

**💻 Ver Respuesta Exitosa (200)**

```json
{
    "message": "Envío en bloque procesado.",
    "summary": {
        "requested": 3,
        "queued": 1,
        "already_exists": 1,
        "not_applicable": 1,
        "not_found": 0,
        "error": 0
    },
    "results": [
        {
            "document_id": 42,
            "folio": "FE1001",
            "status": "queued",
            "message": "Acuse encolado para envío a la DIAN.",
            "event_id": 128,
            "document_status": "PROCESSING"
        },
        {
            "document_id": 43,
            "folio": "FE1002",
            "status": "already_exists",
            "message": "El acuse ya fue aceptado por la DIAN.",
            "event_id": 129,
            "document_status": "ACCEPTED"
        },
        {
            "document_id": 44,
            "folio": "FE1003",
            "status": "not_applicable",
            "message": "Factura de contado: la DIAN no admite eventos RADIAN (acuse, recibo, aceptación o reclamo) para facturas de contado.",
            "event_id": null,
            "document_status": null
        }
    ],
    "success": true
}
```

**Valores de `status` en `results`:**

| `status` | `message` |
|---|---|
| `queued` | `Acuse encolado para envío a la DIAN.` |
| `already_exists` | `El acuse ya fue aceptado por la DIAN.` o `El acuse ya se está enviando a la DIAN.` |
| `not_applicable` | Motivo legible: contado, nota crédito/débito, documento omitido, importación en proceso o fallida, o sin plan |
| `not_found` | `La recepción no existe para esta empresa.` |
| `error` | `No fue posible encolar el acuse. Intente de nuevo.` |

`event_id` es el `id` numérico del evento (sirve para `/send/mail/{id}`); `folio`, `event_id` y `document_status` pueden ser `null`.

**❌ Ver Respuestas de Error**

| HTTP | Mensaje | Causa |
|:---:|---|---|
| `400` | `No tiene una persona de recepción asignada` | Sin `reception_person_uuid` y sin persona de recepción |
| `400` | `No tiene una numeración activa para los eventos de recepción` | Solo si hay algo que enviar; no se crea nada |
| `403` | `RECEPTION_NOT_IN_PLAN` | Ver [Requisito de plan](https://docs.matias-api.com/docs/endpoints/events-radian#requisito-de-plan) |
| `404` | `La persona de recepción indicada (reception_person_uuid) no existe para esta empresa` | `reception_person_uuid` ajeno o eliminado (sin efectos) |
| `404` | `Ninguna de las recepciones indicadas existe para esta empresa.` | Ningún `document_id` es de la empresa |
| `422` | `Debe indicar las recepciones (document_ids).` | Falta `document_ids` |
| `422` | `Puede enviar como máximo 50 recepciones por solicitud.` | Demasiados elementos |
| `422` | `Cada document_id debe ser un número entero.` | Elemento no entero |
| `422` | `En bloque solo se admite el acuse de recibo (030).` | `code` distinto de `030` |
| `422` | `reception_person_uuid debe ser un UUID válido.` | UUID mal formado |

Los `422` siguen el formato `{"message": "...", "errors": {"campo": ["..."]}}`; los demás, `{"success": false, "message": "..."}`.

---

## 📧 4. Reenvío de Correo

**POST /send/mail/{trackId} — Reenviar Correo de Evento**

Reenvía el correo de notificación asociado a un evento ya procesado. El envío del correo se encola. Máximo **4 correos por evento**.

**Path Params:**

| Parámetro | Tipo | Descripción |
|-------|------|-------------|
| `trackId` | `int` | **ID numérico del evento** (el `id` de `events` en `GET /document-receptions/{documentId}` o el `event_id` de `send-bulk`). **No** es el CUFE/CUDE. |

**cURL**

```bash
curl -X POST "{{url}}/events/send/mail/128" \
  -H "Authorization: Bearer {token}"
```

**JavaScript (Axios)**

```js
const eventId = 128;

const response = await axios.post(`${url}/events/send/mail/${eventId}`, {}, {
  headers: { Authorization: `Bearer ${token}` }
});
```

**PHP (Guzzle)**

```php
$eventId = 128;

$response = $client->post("{$url}/events/send/mail/{$eventId}", [
    'headers' => ['Authorization' => "Bearer {$token}"],
]);
```

**💻 Ver Respuesta Exitosa (200)**

```json
{
    "message": "Correo enviado correctamente",
    "success": true
}
```

**❌ Ver Respuestas de Error**

| HTTP | Mensaje | Causa |
|:---:|---|---|
| `400` | `Se ha alcanzado el límite de envío de correos. No puede enviar más de 4 correos por evento.` | Ya se enviaron 4 correos de ese evento |
| `403` | `RECEPTION_NOT_IN_PLAN` | Ver [Requisito de plan](https://docs.matias-api.com/docs/endpoints/events-radian#requisito-de-plan) |
| `404` | `El evento no existe.` | El evento no existe o es de otra empresa (misma respuesta) |

---

## 🚫 5. Cancelación de Eventos Encolados

**POST /{id}/cancel — Cancelar Evento en Estado PENDING**

```http
POST {{url}}/events/{id}/cancel?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Permite cancelar un evento RADIAN mientras se encuentre en estado `PENDING`, antes de que el proceso automático de envío lo transmita a la DIAN.

:::info Reglas de Transición
* **Transición Exclusiva:** Únicamente permite transicionar de `PENDING` → `CANCELLED`.
* **Sin conflictos con el envío automático:** la cancelación y el envío automático nunca actúan a la vez sobre el mismo evento.
* **Estados no Cancelables:** Cualquier estado distinto de `PENDING` (`PROCESSING`, `ACCEPTED`, `REJECTED`, `CANCELLED`, `UNKNOWN`) se rechaza con HTTP 400.
* Los eventos encolados por [`/send-bulk`](https://docs.matias-api.com/docs/endpoints/events-radian#envio-en-bloque) pasan de inmediato a envío (`PROCESSING`) y no son cancelables.
* Un evento cancelado puede volver a enviarse con `POST /send/{trackId}` o `POST /send-bulk`.
* En [modo manual](https://docs.matias-api.com/docs/endpoints/events-radian#eventos-automaticos) los eventos `PENDING` no se envían automáticamente.
:::

**Parámetros:**

| Parámetro | Ubicación | Tipo | Requerido | Descripción |
|-----------|-----------|------|:---------:|-------------|
| `id` | Path | `integer` | ✅ Sí | ID numérico del evento (el `id` de `events` en `GET /document-receptions/{documentId}`; **no** el CUFE/trackId). |
| `client_uuid` | Query | `string` | No | UUID de la empresa cliente para operaciones multi-tenant (Casa de Software). |

**cURL**

```bash
curl -X POST "{{url}}/events/128/cancel" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json"
```

**JavaScript (Axios)**

```js
const eventId = 128;

const response = await axios.post(`${url}/events/${eventId}/cancel`, {}, {
  headers: { 
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

**PHP (Guzzle)**

```php
$eventId = 128;

$response = $client->post("{$url}/events/{$eventId}/cancel", [
    'headers' => [
        'Authorization' => "Bearer {$token}",
        'Content-Type'  => 'application/json',
    ],
]);
```

**✅ Respuesta Exitosa (HTTP 200 OK)**

`data` trae el evento con su nuevo estado (se muestran los campos principales).

```json
{
  "message": "Evento cancelado con éxito",
  "data": {
    "id": 128,
    "document_reception_id": 42,
    "type_event_id": 1,
    "document_status": "CANCELLED"
  },
  "success": true
}
```

**❌ Evento en un estado distinto de PENDING (HTTP 400 Bad Request)**

```json
{
  "success": false,
  "message": "Solo se pueden cancelar eventos en estado PENDING."
}
```

**❌ Evento no encontrado o no pertenece a la empresa (HTTP 404 Not Found)**

```json
{
  "success": false,
  "message": "El evento no existe."
}
```

**❌ Plan sin módulo de recepción (HTTP 403 Forbidden)**

```json
{
  "success": false,
  "message": "El plan FREE no incluye la recepción de facturas ni los eventos RADIAN. Actualice su plan para usarlos.",
  "error_code": "RECEPTION_NOT_IN_PLAN"
}
```

---

## 🗑️ 6. Eliminación de Recepción

**DELETE /document-receptions/{id} — Eliminar Recepción**

**Path Params:**

| Parámetro | Tipo | Descripción |
|-------|------|-------------|
| `id` | `int` | ID de la recepción |

:::caution Restricción de Eliminación
No se puede eliminar una recepción si ya tiene eventos con estado `ACCEPTED` o `PROCESSING`. Al eliminarla se borran también sus demás eventos (pendientes, rechazados o cancelados).
:::

:::tip Recuperar una recepción eliminada
Si vuelves a importar ese CUFE con `POST /import-track-id`, la recepción se restaura y se reprocesa (`Documento encolado nuevamente para procesamiento.`). La importación por Excel **no** la restaura: la reporta en `skipped_details` con `reason_code` `USER_DELETED`.
:::

**cURL**

```bash
curl -X DELETE "{{url}}/events/document-receptions/42" \
  -H "Authorization: Bearer {token}"
```

**JavaScript (Axios)**

```js
const response = await axios.delete(`${url}/events/document-receptions/${documentId}`, {
  headers: { Authorization: `Bearer ${token}` }
});
```

**PHP (Guzzle)**

```php
$response = $client->delete("{$url}/events/document-receptions/{$documentId}", [
    'headers' => ['Authorization' => "Bearer {$token}"],
]);
```

**💻 Ver Respuesta Exitosa (200)**

```json
{
    "message": "Recepción de documento eliminada exitosamente.",
    "success": true
}
```

**❌ Ver Respuestas de Error**

| HTTP | Mensaje | Causa |
|:---:|---|---|
| `400` | `No se puede eliminar una recepción con eventos válidos o en procesamiento.` | Tiene eventos `ACCEPTED` o `PROCESSING` |
| `403` | `RECEPTION_NOT_IN_PLAN` | Ver [Requisito de plan](https://docs.matias-api.com/docs/endpoints/events-radian#requisito-de-plan) |
| `404` | `Recepción de documento no encontrada.` | No existe o es de otra empresa |

---

## 📬 7. Buzón de Recepción

:::info 🆕 Nuevo · Buzón de correo para recibir facturas
Cada empresa tiene **una** dirección de correo, con la forma `{identificador}@{dominio}`, a la que sus proveedores envían las facturas electrónicas. La API lee los adjuntos de cada correo, registra los documentos como recepciones (`document_origin` = `RECEIVED`) y, según el [modo de eventos](https://docs.matias-api.com/docs/endpoints/events-radian#eventos-automaticos), crea o no sus eventos.

* La dirección se asigna al registrar la **primera persona de recepción** ([`POST /reception-people`](https://docs.matias-api.com/docs/endpoints/events-radian#personas-recepcion)) y **no cambia**, aunque cambies la persona por defecto.
* La bandeja ([`GET /mailbox`](https://docs.matias-api.com/docs/endpoints/events-radian#buzon-recepcion)) muestra los **correos**, incluidos los que no generaron documento, con el motivo.
* El consumo del buzón usa un **cupo de recepción** aparte del de emisión ([`GET /mailbox/quota`](https://docs.matias-api.com/docs/endpoints/events-radian#buzon-recepcion)).
:::

### Cómo se procesa cada correo

* Se leen los **ZIP** y los **XML sueltos** del correo, hasta **10 documentos por correo**. Cada **ZIP** aporta un solo documento.
* 🆕 **Destinatarios:** el proveedor puede poner el buzón en **Para** o en **CC**, junto con la dirección del cliente. Si un mismo correo trae **varias direcciones de buzón** de la plataforma, solo se entrega a la **primera**; los demás buzones no lo reciben ni lo ven en su bandeja. El proveedor debe enviar **un correo por empresa**.
* 🆕 **Cupo solo para documentos nuevos:** consume cupo de recepción solo un documento cuyo CUFE la empresa **no tenía** registrado. Si el CUFE ya existe (llegó antes por el buzón, el proveedor lo reenvió o se importó por Excel o por CUFE), se reutiliza ese documento: **no consume cupo**, no queda `FAILED` por falta de cupo y solo se crean los eventos automáticos que aún no tenga, según el [modo de la empresa](https://docs.matias-api.com/docs/endpoints/events-radian#eventos-automaticos). Si el documento importado no tenía archivos, se le agregan los del correo (el XML y el ZIP, o el AttachedDocument si llegó suelto). El correo queda `PROCESSED` y vinculado a ese documento.
* Es **idempotente por CUFE**: un correo repetido o un reintento no duplica documentos, ni cobra cupo otra vez, ni duplica eventos.
* 🆕 **Numeración de eventos solo si hay eventos que crear:** el buzón exige una numeración activa de eventos de recepción solo para una **factura de venta a crédito** en **modo automático** (`send_events` = `true`) a la que le faltan eventos `030`, `032` o `033`. Las facturas de contado (o sin medio de pago), las notas crédito/débito y cualquier factura en modo manual quedan `PROCESSED` aunque la empresa no tenga numeración (ver la fila `FAILED` correspondiente abajo).
* Los correos se conservan **30 días** desde su llegada para poder reintentarlos.

**🆕 Adjuntos que se reconocen:**

* Nombres de adjunto codificados (RFC 2047 y RFC 2231). Un adjunto **sin nombre** o con la **extensión equivocada** se reconoce por su contenido: el ZIP por su firma y el XML por su contenido, con o sin BOM.
* El `.xml` adjunto directo, el ZIP con **subcarpetas** y un **ZIP dentro del ZIP** (un solo nivel de anidamiento). Dentro del ZIP se ignoran `__MACOSX`, los archivos ocultos y los PDF.
* De un **AttachedDocument** se extrae la factura o nota embebida, venga en CDATA o escapada.
* Un XML que no es factura, nota ni AttachedDocument (por ejemplo, un ApplicationResponse) **no cuenta** como documento.
* Un correo reenviado **como adjunto** (`.eml`) no se abre: el proveedor debe adjuntar el ZIP o el XML directamente.
* Por seguridad hay topes de tamaño y de número de entradas, también para el ZIP interno. Se descartan las rutas con `..` y los XML con DOCTYPE o entidades.

Motivos de descarte de un documento del correo:

| Motivo (`error_message`) |
|---|
| `Documento descartado: el XML declara DOCTYPE o entidades, que la DIAN no usa` |
| `Documento descartado: el XML adjunto no está bien formado` |
| `Documento descartado: el AttachedDocument adjunto no trae la factura o nota embebida` |
| `El .zip adjunto no contiene ningún XML` |
| `Tipo de documento 'X' aún no soportado por el buzón` (el buzón recibe facturas `01` y notas `91` y `92`) |

**🆕 Correos con varios documentos:**

* Cada documento se procesa con las mismas reglas (adquiriente, cupo, eventos) y uno inválido **no bloquea** a los demás.
* `document_reception` de la bandeja enlaza solo el **primer documento procesado**; los demás se consultan en [`GET /document-receptions`](https://docs.matias-api.com/docs/endpoints/events-radian#consultas).
* Si algún documento quedó **sin cupo** o **con error**, el correo queda `FAILED` aunque otros se hayan procesado. Su reintento no duplica ni vuelve a cobrar los ya creados.
* Los documentos que pasan del tope de **10** se **omiten**. Ningún reintento los recupera (el reintento vuelve a leer los mismos 10 primeros): hay que enviarlos en otro correo.
* Si todos los documentos se descartan, el correo queda `IGNORED`.
* `error_message` trae un resumen cuando algún documento quedó pendiente, se omitió o se descartó, también si el estado es `PROCESSED` (máximo 250 caracteres): `N de M documentos del correo procesados`, seguido, según el caso, de `; X pendiente(s) de reintento: motivo`, `; X omitido(s): el máximo es 10 documentos por correo` y `; X descartado(s): motivo`. Si todos se procesaron, es `null`.

**Estados del correo (`status`) y motivos (`error_message`):**

| `status` | Motivo | ¿Se puede reintentar? |
|---|---|---|
| `PROCESSED` | Generó su documento (`document_reception`) | No hace falta |
| `PENDING` | En cola o procesándose | No (ya está en proceso) |
| `IGNORED` | Correo descartado por **virus** | No |
| `IGNORED` | `El plan no incluye buzón de recepción` (plan FREE, o ni la empresa ni su Casa de Software tienen un plan de pago vencido o reemplazado: por ejemplo, nunca pagaron o su suscripción de pago fue **cancelada**) | No |
| `IGNORED` + `reason_code` `PLAN_EXPIRED` (**retenido**, `is_held` = `true`) | `Retenido: el plan de pago venció. Se procesará automáticamente al renovar el plan, si no han pasado más de 30 días desde su llegada`. No consume cupo. Ver [Correos retenidos](https://docs.matias-api.com/docs/endpoints/events-radian#correos-retenidos). | Sí: se procesa solo al renovar el plan, o con `POST /mailbox/{id}/retry` |
| `IGNORED` | `El correo no trae ningún adjunto .zip` (no trae ZIP ni XML de factura) | No |
| `IGNORED` | `Documento descartado: el adquiriente (NIT X) no es esta empresa (NIT Y)` o `Documento descartado: el XML no trae el NIT del adquiriente y no se puede verificar que sea para esta empresa`. Se avisa por correo a la cuenta principal o a la Casa de Software. 🆕 El NIT se compara solo por sus dígitos: se descarta el DV si viene tras un guion y se quitan puntos, espacios y ceros a la izquierda; también coincide si el NIT de la empresa está guardado con el DV pegado al final. Una diferencia de formato no descarta el documento. | No |
| `IGNORED` | Correo o ZIP demasiado grande (el motivo indica el límite) | No |
| `FAILED` | `Sin cupo disponible en el plan del buzón de recepción` (solo para un documento nuevo) | Sí, al ampliar el cupo |
| `FAILED` | 🆕 `No tiene una numeración activa para los eventos de recepción`: modo automático y factura a crédito sin numeración activa de eventos. El documento **sí** queda registrado (aparece en `document_reception`). | Sí, tras crear la numeración: el reintento encuentra el documento por CUFE, no lo duplica ni cobra cupo otra vez, y crea los eventos |
| `FAILED` | Error al procesar el documento | Sí |
| `FAILED` + `reason_code` `S3_OBJECT_MISSING` | El correo ya no está almacenado | No |

**🆕 Correos retenidos por plan vencido:**

* Un correo se retiene solo si la empresa o su Casa de Software **tuvo** un plan de pago que venció o que se reemplazó por un cambio de plan. Una suscripción de pago **cancelada** no cuenta: el correo queda `IGNORED` con `El plan no incluye buzón de recepción` y no se retiene.
* Mientras haya retenidos, la Casa de Software (o la cuenta principal, si la empresa no es sub-cuenta) recibe como máximo **un correo al día por empresa**: «Tienes N facturas retenidas en el buzón porque tu plan venció. Renueva para procesarlas.». La sub-cuenta nunca recibe ese aviso.
* Al activarse un plan de pago (compra, renovación, upgrade o asignación manual), los retenidos de los **últimos 30 días** se procesan solos y vuelven a validar el cupo: si no hay cupo, quedan `FAILED` con `Sin cupo disponible en el plan del buzón de recepción`.

**GET /mailbox — Bandeja del Buzón**

Lista los **correos** que llegaron al buzón de la empresa, del más reciente al más antiguo.

**Query Params:**

| Parámetro | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `status` | `string` | — | `PENDING`, `PROCESSED`, `FAILED` o `IGNORED` |
| `query` | `string` | — | Busca en el asunto y en el remitente (`%` y `_` se buscan como texto literal) |
| `startDate` | `string` | — | Fecha inicio (`YYYY-MM-DD`) de recepción del correo |
| `endDate` | `string` | — | Fecha fin (`YYYY-MM-DD`) de recepción; incluye todo el día |
| `archived` | `boolean` | `false` | `1` muestra solo los archivados; por defecto, solo los no archivados. Hoy ningún endpoint archiva correos, así que `archived=1` devuelve una lista vacía. |
| `limit` | `int` | 20 | Registros por página (máx. 50) |
| `client_uuid` | `string` | — | UUID del cliente (Multi-Tenant) |

**cURL**

```bash
curl -X GET "{{url}}/events/mailbox?status=FAILED&limit=20" \
  -H "Authorization: Bearer {token}"
```

**JavaScript (Axios)**

```js
const response = await axios.get(`${url}/events/mailbox`, {
  params: { status: 'FAILED', limit: 20 },
  headers: { Authorization: `Bearer ${token}` }
});
```

**PHP (Guzzle)**

```php
$response = $client->get("{$url}/events/mailbox", [
    'headers' => ['Authorization' => "Bearer {$token}"],
    'query'   => ['status' => 'FAILED', 'limit' => 20],
]);
```

**💻 Ver Respuesta Exitosa (200)**

`dataRecords` es un paginador (`current_page`, `data`, `per_page`, `total`, etc.).

```json
{
    "dataRecords": {
        "current_page": 1,
        "data": [
            {
                "id": 3105,
                "from_email": "facturacion@proveedor-ejemplo.com",
                "subject": "Factura electrónica FE1001",
                "status": "PROCESSED",
                "received_at": "2026-08-15T14:18:00.000000Z",
                "has_attachments": true,
                "read_at": null,
                "archived_at": null,
                "starred": false,
                "error_message": null,
                "reason_code": null,
                "is_held": false,
                "can_retry": false,
                "document_reception": {
                    "id": 42,
                    "folio": "FE1001",
                    "total": "1190000.00",
                    "issue_date": "2026-08-15T00:00:00.000000Z"
                }
            },
            {
                "id": 3106,
                "from_email": "facturacion@proveedor-ejemplo.com",
                "subject": "Factura electrónica FE1002",
                "status": "FAILED",
                "received_at": "2026-08-16T10:02:00.000000Z",
                "has_attachments": true,
                "read_at": null,
                "archived_at": null,
                "starred": false,
                "error_message": "Sin cupo disponible en el plan del buzón de recepción",
                "reason_code": null,
                "is_held": false,
                "can_retry": true,
                "document_reception": null
            }
        ],
        "per_page": 20,
        "total": 2
    },
    "success": true
}
```

| Campo | Descripción |
|-------|-------------|
| `received_at` | Fecha de la cabecera del correo o, si falta, la del procesamiento. El listado se ordena por ella. |
| `read_at`, `archived_at`, `starred` | 🆕 De **solo lectura**: ningún endpoint del API marca un correo como leído, archivado o destacado |
| `error_message` | Motivo legible por el que el correo no generó documento, o el resumen de un correo con varios documentos (`null` si no aplica) |
| `reason_code` | `PLAN_EXPIRED` (retenido por plan vencido), `S3_OBJECT_MISSING` (el correo ya no está almacenado) o `null` |
| `is_held` | `true` si el correo está retenido por plan vencido |
| `can_retry` | `true` si `POST /mailbox/{id}/retry` lo aceptaría |
| `document_reception` | Documento generado (`id`, `folio`, `total`, `issue_date`) o `null`. Con varios documentos, el primero procesado. |

**GET /mailbox/address — Dirección del Buzón**

Devuelve la dirección a la que los proveedores deben enviar las facturas. Es de **solo lectura**.

**cURL**

```bash
curl -X GET "{{url}}/events/mailbox/address" \
  -H "Authorization: Bearer {token}"
```

**JavaScript (Axios)**

```js
const response = await axios.get(`${url}/events/mailbox/address`, {
  headers: { Authorization: `Bearer ${token}` }
});
```

**PHP (Guzzle)**

```php
$response = $client->get("{$url}/events/mailbox/address", [
    'headers' => ['Authorization' => "Bearer {$token}"],
]);
```

**💻 Ver Respuesta Exitosa (200)**

El dominio del ejemplo es ilustrativo.

```json
{
    "dataRecord": {
        "address": "abc123xyz@buzon.ejemplo.com",
        "local_part": "abc123xyz",
        "domain": "buzon.ejemplo.com",
        "provisioned": true,
        "reception_person_uuid": "9b1d2c3e-4f50-4a6b-8c7d-0e1f2a3b4c5d",
        "message": null
    },
    "success": true
}
```

* El identificador es de la **empresa** (uno solo) y no cambia al cambiar la persona por defecto.
* Si la empresa eliminó su última persona de recepción, la dirección se conserva (sigue recibiendo correo) y `reception_person_uuid` es `null`.

Si la empresa **aún no tiene buzón**, la respuesta también es `200`:

```json
{
    "dataRecord": {
        "address": null,
        "local_part": null,
        "domain": "buzon.ejemplo.com",
        "provisioned": false,
        "reception_person_uuid": null,
        "message": "La empresa aún no tiene buzón de recepción: registre la persona de recepción en la configuración de eventos para obtener la dirección."
    },
    "success": true
}
```

**GET /mailbox/quota — Cupo de Recepción**

Consumo del **cupo de recepción** de la suscripción vigente (contador aparte del de emisión). Si la empresa es sub-cuenta, el cupo es la bolsa de su Casa de Software.

**cURL**

```bash
curl -X GET "{{url}}/events/mailbox/quota" \
  -H "Authorization: Bearer {token}"
```

**JavaScript (Axios)**

```js
const response = await axios.get(`${url}/events/mailbox/quota`, {
  headers: { Authorization: `Bearer ${token}` }
});
```

**PHP (Guzzle)**

```php
$response = $client->get("{$url}/events/mailbox/quota", [
    'headers' => ['Authorization' => "Bearer {$token}"],
]);
```

**💻 Ver Respuesta Exitosa (200)**

```json
{
    "dataRecord": {
        "unlimited": false,
        "used": 850,
        "limit": 1000,
        "remaining": 150,
        "percent": 85,
        "exhausted": false,
        "level": "WARNING",
        "shared_pool": false,
        "period_start": "2026-01-01",
        "period_end": "2026-12-31",
        "message": "Ya usaste más del 80 % de tu cupo de recepción.",
        "upgrade_route": "/membership/subscription"
    },
    "success": true
}
```

| Campo | Descripción |
|-------|-------------|
| `unlimited` | `true` en planes ilimitados (`used`, `limit`, `remaining` y `percent` pueden venir en `null`) |
| `percent` | `used × 100 / limit`, con 2 decimales y sin tope (puede pasar de 100). `100` si `limit` es `0`; `null` si es ilimitado. |
| `exhausted` | `true` si `used` ≥ `limit` |
| `level` | `OK`, `WARNING` (más de 80 %), `CRITICAL` (más de 95 %), `EXHAUSTED` o `UNLIMITED` |
| `shared_pool` | `true` si es una sub-cuenta que consume la bolsa de su Casa de Software |
| `message` | Aviso según el nivel (`null` en `OK` y `UNLIMITED`) |
| `upgrade_route` | Ruta de la pantalla para ampliar o renovar el plan |

**Mensajes por nivel:**

| `level` | `message` |
|---|---|
| `WARNING` | `Ya usaste más del 80 % de tu cupo de recepción.` |
| `CRITICAL` | `Tu cupo de recepción está por agotarse: cuando se acabe, los correos nuevos quedarán sin procesar.` |
| `EXHAUSTED` | `Tu cupo de recepción se agotó: los correos nuevos quedarán sin procesar hasta que amplíes tu plan.` |

:::note Cupo compartido
Con `shared_pool` = `true`, cuando consulta la **propia sub-cuenta** (con o sin su `client_uuid`), `used`, `limit` y `remaining` vienen en `null`: solo ve el porcentaje y el nivel. La Casa de Software que consulta con `client_uuid` ve todas las cifras. Sin cupo, los correos nuevos quedan `FAILED` con `Sin cupo disponible en el plan del buzón de recepción`.
:::

**GET /mailbox/{id} — Detalle de un Correo**

**Path Params:**

| Parámetro | Tipo | Descripción |
|-------|------|-------------|
| `id` | `int` | ID del correo (campo `id` de `GET /mailbox`) |

Devuelve los mismos campos del listado más `to_email`, `message_id`, `body_preview`, `processed_at` y `files`. Para descargar un archivo usa [`GET /document-receptions/{documentId}/files/{fileManagerId}/download`](https://docs.matias-api.com/docs/endpoints/events-radian#consultas) con `document_reception.id` y `files[].id`.

**cURL**

```bash
curl -X GET "{{url}}/events/mailbox/3105" \
  -H "Authorization: Bearer {token}"
```

**JavaScript (Axios)**

```js
const response = await axios.get(`${url}/events/mailbox/${emailId}`, {
  headers: { Authorization: `Bearer ${token}` }
});
```

**PHP (Guzzle)**

```php
$response = $client->get("{$url}/events/mailbox/{$emailId}", [
    'headers' => ['Authorization' => "Bearer {$token}"],
]);
```

**💻 Ver Respuesta Exitosa (200)**

```json
{
    "dataRecord": {
        "id": 3105,
        "from_email": "facturacion@proveedor-ejemplo.com",
        "subject": "Factura electrónica FE1001",
        "status": "PROCESSED",
        "received_at": "2026-08-15T14:18:00.000000Z",
        "has_attachments": true,
        "read_at": null,
        "archived_at": null,
        "starred": false,
        "error_message": null,
        "reason_code": null,
        "is_held": false,
        "can_retry": false,
        "document_reception": {
            "id": 42,
            "folio": "FE1001",
            "total": "1190000.00",
            "issue_date": "2026-08-15T00:00:00.000000Z"
        },
        "to_email": "abc123xyz@buzon.ejemplo.com",
        "message_id": "0100018f-ejemplo-mensaje",
        "body_preview": "Adjuntamos la factura electrónica FE1001.",
        "processed_at": "2026-08-15T14:20:00.000000Z",
        "files": [
            {
                "id": 9001,
                "type_document": "XML",
                "file_name": "document.xml",
                "mime_type": "application/xml",
                "file_size": 18432
            }
        ]
    },
    "success": true
}
```

`files[].type_document` puede ser `INBOUND_EMAIL_RAW`, `XML`, `ZIP` o `ATTACHED_DOC`. `files` está vacío si el correo no generó documento.

**❌ Correo no encontrado (HTTP 404)**

Si el correo no existe o es de otra empresa:

```json
{
    "success": false,
    "message": "Correo no encontrado en el buzón."
}
```

**POST /mailbox/{id}/retry — Reintentar un Correo**

Vuelve a poner en cola un correo `FAILED` o **retenido** (`IGNORED` con `reason_code` `PLAN_EXPIRED`). El reproceso revalida todo (plan, cupo, NIT del adquiriente) y el resultado se ve en la bandeja. El campo `can_retry` de `GET /mailbox` indica de antemano si se acepta.

**Path Params:**

| Parámetro | Tipo | Descripción |
|-------|------|-------------|
| `id` | `int` | ID del correo |

**cURL**

```bash
curl -X POST "{{url}}/events/mailbox/3106/retry" \
  -H "Authorization: Bearer {token}"
```

**JavaScript (Axios)**

```js
const response = await axios.post(`${url}/events/mailbox/${emailId}/retry`, {}, {
  headers: { Authorization: `Bearer ${token}` }
});
```

**PHP (Guzzle)**

```php
$response = $client->post("{$url}/events/mailbox/{$emailId}/retry", [
    'headers' => ['Authorization' => "Bearer {$token}"],
]);
```

**💻 Ver Respuesta Exitosa (202)**

```json
{
    "success": true,
    "message": "El correo se volvió a poner en cola para procesarlo.",
    "dataRecord": {
        "id": 3106,
        "status": "PENDING"
    }
}
```

**❌ Ver Respuestas de Error**

Cuerpo: `{"success": false, "message": "...", "error_code": "..."}` (el `404` no trae `error_code`).

| HTTP | `error_code` | Mensaje |
|:---:|---|---|
| `404` | — | `Correo no encontrado en el buzón.` (no existe, es de otra empresa o no correspondía a ningún buzón) |
| `409` | `MAILBOX_ALREADY_PROCESSED` | `El correo ya se procesó y generó su documento.` |
| `409` | `MAILBOX_RETRY_IN_PROGRESS` | `El correo ya se está procesando.` (está `PENDING`) o `El correo ya se está reprocesando.` (otro reintento lo tomó; no se encola otra vez) |
| `409` | `MAILBOX_RETRY_NO_LOCATION` | `Este correo llegó antes de que se guardara su ubicación: no se puede reintentar. Pida al proveedor que lo envíe de nuevo.` o `La ubicación guardada del correo ya no corresponde al buzón de entrada configurado: no se puede reintentar.` |
| `409` | `MAILBOX_RETRY_EXPIRED` | `El correo superó los 30 días de retención: ya no se puede reintentar. Pida al proveedor que lo envíe de nuevo.` o `El correo ya no está disponible en el almacenamiento: pida al proveedor que lo envíe de nuevo.` |
| `409` | `MAILBOX_RETRY_UNAVAILABLE` | `El reintento aún no está habilitado: el servidor no guarda la ubicación de los correos.` |
| `422` | `MAILBOX_RETRY_NOT_RETRYABLE` | `Los correos ignorados (virus, factura de otro NIT, sin XML o demasiado grandes) no se reintentan: pida al proveedor que lo envíe de nuevo.` |
| `403` | `RECEPTION_NOT_IN_PLAN` | Ver [Requisito de plan](https://docs.matias-api.com/docs/endpoints/events-radian#requisito-de-plan) |

---

## 👤 8. Personas de Recepción

:::info 🆕 Nuevo · Quién firma los eventos
Las **personas de recepción** son quienes firman (acusan, reciben, aceptan o reclaman) los eventos RADIAN de la empresa. Una empresa puede tener **varias**, con **una por defecto**: la que firma los eventos automáticos y la que se usa cuando no envías `reception_person_uuid`.

* La **primera** persona nace por defecto y recibe el [buzón de recepción](https://docs.matias-api.com/docs/endpoints/events-radian#buzon-recepcion).
* El [modo de eventos](https://docs.matias-api.com/docs/endpoints/events-radian#eventos-automaticos) (`send_events`) es de la **empresa**, no de una persona: se cambia con [`PUT /reception-people/mode`](https://docs.matias-api.com/docs/endpoints/events-radian#modo-eventos).
* Todos estos endpoints aceptan `client_uuid` para Casas de Software.
:::

:::warning El CRUD genérico ya no escribe personas de recepción
Las personas de recepción (`tbPrefix=T005`) son ahora de **solo lectura** por el CRUD genérico (`{{url}}/crud?tbPrefix=T005`): crear, editar o eliminar por esa vía responde `403` indicando que se gestionan con `/api/ubl2.1/events/reception-people`. La lectura excluye las personas eliminadas y, sin plan de pago vigente, cualquier operación (también la lectura) responde `403` con `error_code` `RECEPTION_NOT_IN_PLAN`. Si registrabas la persona de recepción por el CRUD, migra a los endpoints de esta sección.
:::

**Objeto `ReceptionPerson`:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `uuid` | `string` | Identificador de la persona (se usa en las rutas y en `reception_person_uuid`) |
| `identity_document_id` | `int` \| `null` | Tipo de documento de identidad |
| `identity_document` | `object` \| `null` | `id`, `code` y `name` del tipo de documento |
| `dni` | `string` | Número de identificación |
| `dv` | `string` \| `null` | Dígito de verificación |
| `first_name` | `string` | Nombres |
| `last_name` | `string` | Apellidos |
| `email` | `string` \| `null` | Correo de la persona |
| `job_title` | `string` \| `null` | Cargo |
| `department` | `string` \| `null` | Área o departamento |
| `is_default` | `boolean` | `true` si es la persona por defecto |
| `created_at` / `updated_at` | `string` | Fechas en ISO 8601 |

La dirección del buzón no se incluye: se consulta con [`GET /mailbox/address`](https://docs.matias-api.com/docs/endpoints/events-radian#buzon-recepcion).

**Estado de la empresa** (lo devuelven `GET /reception-people`, `DELETE`, `POST .../default` y `PUT /mode` en `dataRecord`):

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `send_events` | `boolean` | Modo de la empresa: `true` automático, `false` manual (`false` si no hay personas) |
| `default_person_uuid` | `string` \| `null` | `uuid` de la persona por defecto |
| `people` | `array` | Lista de `ReceptionPerson`, con la persona por defecto primero |

**GET /reception-people — Listar Personas y Modo**

**cURL**

```bash
curl -X GET "{{url}}/events/reception-people" \
  -H "Authorization: Bearer {token}"
```

**JavaScript (Axios)**

```js
const response = await axios.get(`${url}/events/reception-people`, {
  headers: { Authorization: `Bearer ${token}` }
});
```

**PHP (Guzzle)**

```php
$response = $client->get("{$url}/events/reception-people", [
    'headers' => ['Authorization' => "Bearer {$token}"],
]);
```

**💻 Ver Respuesta Exitosa (200)**

`people` es una lista vacía si la empresa no tiene personas.

```json
{
    "dataRecord": {
        "send_events": false,
        "default_person_uuid": "9b1d2c3e-4f50-4a6b-8c7d-0e1f2a3b4c5d",
        "people": [
            {
                "uuid": "9b1d2c3e-4f50-4a6b-8c7d-0e1f2a3b4c5d",
                "identity_document_id": 1,
                "identity_document": {
                    "id": 1,
                    "code": "13",
                    "name": "Cédula de ciudadanía"
                },
                "dni": "1234567890",
                "dv": null,
                "first_name": "Ana",
                "last_name": "Pérez",
                "email": "recepcion@empresa-ejemplo.com",
                "job_title": "Analista de cuentas por pagar",
                "department": "Contabilidad",
                "is_default": true,
                "created_at": "2026-10-01T15:00:00+00:00",
                "updated_at": "2026-10-01T15:00:00+00:00"
            }
        ]
    },
    "success": true
}
```

**POST /reception-people — Registrar Persona**

**Body (JSON):**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `identity_document_id` | `integer` | **Sí** | Tipo de documento de identidad; debe existir en `GET {{url}}/identity-documents` |
| `dni` | `string` (máx. 20) | **Sí** | Número de identificación |
| `dv` | `string` (máx. 2) | No | Dígito de verificación |
| `first_name` | `string` (máx. 60) | **Sí** | Nombres |
| `last_name` | `string` (máx. 60) | **Sí** | Apellidos |
| `email` | `string` (email, máx. 100) | No | Correo de la persona |
| `job_title` | `string` (máx. 100) | No | Cargo |
| `department` | `string` (máx. 100) | No | Área o departamento |

:::caution Campos que no se envían
Estos campos responden `422` con el endpoint correcto en el mensaje: `is_default` (usa `POST /reception-people/{uuid}/default`), `send_events` (usa `PUT /reception-people/mode`), `email_reception` (la dirección del buzón la asigna el servidor) y `company_id` (la empresa sale del token o de `client_uuid`). `uuid` e `id` se ignoran.
:::

**Reglas:**

* La **primera** persona de la empresa nace por defecto (`is_default` = `true`) y recibe el buzón: la misma dirección si la empresa ya tuvo una, o una nueva.
* Una empresa nueva arranca en **modo manual** (`send_events` = `false`). Si la empresa ya había tenido personas y las eliminó, la nueva primera persona recupera el modo anterior.
* Las siguientes personas no son por defecto, no generan buzón y heredan el modo de la empresa.

**cURL**

```bash
curl -X POST "{{url}}/events/reception-people" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "identity_document_id": 1,
    "dni": "1234567890",
    "first_name": "Ana",
    "last_name": "Pérez",
    "email": "recepcion@empresa-ejemplo.com",
    "job_title": "Analista de cuentas por pagar",
    "department": "Contabilidad"
  }'
```

**JavaScript (Axios)**

```js
const response = await axios.post(`${url}/events/reception-people`, {
  identity_document_id: 1,
  dni: '1234567890',
  first_name: 'Ana',
  last_name: 'Pérez',
  email: 'recepcion@empresa-ejemplo.com',
  job_title: 'Analista de cuentas por pagar',
  department: 'Contabilidad'
}, {
  headers: { Authorization: `Bearer ${token}` }
});
```

**PHP (Guzzle)**

```php
$response = $client->post("{$url}/events/reception-people", [
    'headers' => ['Authorization' => "Bearer {$token}"],
    'json'    => [
        'identity_document_id' => 1,
        'dni'                  => '1234567890',
        'first_name'           => 'Ana',
        'last_name'            => 'Pérez',
        'email'                => 'recepcion@empresa-ejemplo.com',
        'job_title'            => 'Analista de cuentas por pagar',
        'department'           => 'Contabilidad',
    ],
]);
```

**💻 Ver Respuesta Exitosa (201)**

```json
{
    "message": "Persona de recepción registrada.",
    "dataRecord": {
        "uuid": "9b1d2c3e-4f50-4a6b-8c7d-0e1f2a3b4c5d",
        "identity_document_id": 1,
        "identity_document": {
            "id": 1,
            "code": "13",
            "name": "Cédula de ciudadanía"
        },
        "dni": "1234567890",
        "dv": null,
        "first_name": "Ana",
        "last_name": "Pérez",
        "email": "recepcion@empresa-ejemplo.com",
        "job_title": "Analista de cuentas por pagar",
        "department": "Contabilidad",
        "is_default": true,
        "created_at": "2026-10-01T15:00:00+00:00",
        "updated_at": "2026-10-01T15:00:00+00:00"
    },
    "success": true
}
```

**❌ Ver Respuestas de Error**

| HTTP | Mensaje | Causa |
|:---:|---|---|
| `403` | `RECEPTION_NOT_IN_PLAN` | Ver [Requisito de plan](https://docs.matias-api.com/docs/endpoints/events-radian#requisito-de-plan) |
| `422` | `El tipo de documento de identidad no existe.` | `identity_document_id` fuera del catálogo |
| `422` | `is_default no se envía: use POST /events/reception-people/{uuid}/default.` | Se envió `is_default` |
| `422` | `send_events es de la empresa: use PUT /events/reception-people/mode.` | Se envió `send_events` |
| `422` | `email_reception lo asigna el servidor: es la dirección del buzón de la empresa y no cambia.` | Se envió `email_reception` |
| `422` | `company_id no se envía: la empresa sale del token o de client_uuid.` | Se envió `company_id` |

Los `422` siguen el formato `{"message": "...", "errors": {"campo": ["..."]}}`.

**PUT /reception-people/{uuid} — Editar Persona**

Edición **parcial**: cada campo es opcional, pero si se envía debe ser válido (mismas reglas y mismos campos prohibidos que el registro). No cambia la persona por defecto, el buzón ni el modo. Los eventos ya emitidos no cambian.

**Path Params:**

| Parámetro | Tipo | Descripción |
|-------|------|-------------|
| `uuid` | `string` (uuid) | `uuid` de la persona |

**cURL**

```bash
curl -X PUT "{{url}}/events/reception-people/9b1d2c3e-4f50-4a6b-8c7d-0e1f2a3b4c5d" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "job_title": "Jefe de cuentas por pagar"
  }'
```

**JavaScript (Axios)**

```js
const response = await axios.put(`${url}/events/reception-people/${personUuid}`, {
  job_title: 'Jefe de cuentas por pagar'
}, {
  headers: { Authorization: `Bearer ${token}` }
});
```

**PHP (Guzzle)**

```php
$response = $client->put("{$url}/events/reception-people/{$personUuid}", [
    'headers' => ['Authorization' => "Bearer {$token}"],
    'json'    => ['job_title' => 'Jefe de cuentas por pagar'],
]);
```

**💻 Ver Respuesta Exitosa (200)**

`dataRecord` es el objeto `ReceptionPerson` actualizado.

```json
{
    "message": "Persona de recepción actualizada.",
    "dataRecord": {
        "uuid": "9b1d2c3e-4f50-4a6b-8c7d-0e1f2a3b4c5d",
        "identity_document_id": 1,
        "identity_document": {
            "id": 1,
            "code": "13",
            "name": "Cédula de ciudadanía"
        },
        "dni": "1234567890",
        "dv": null,
        "first_name": "Ana",
        "last_name": "Pérez",
        "email": "recepcion@empresa-ejemplo.com",
        "job_title": "Jefe de cuentas por pagar",
        "department": "Contabilidad",
        "is_default": true,
        "created_at": "2026-10-01T15:00:00+00:00",
        "updated_at": "2026-10-05T10:00:00+00:00"
    },
    "success": true
}
```

**❌ Persona no encontrada (HTTP 404)**

Si no existe, fue eliminada o es de otra empresa (misma respuesta):

```json
{
    "success": false,
    "message": "La persona de recepción no existe para esta empresa."
}
```

**DELETE /reception-people/{uuid} — Eliminar Persona**

**Path Params:**

| Parámetro | Tipo | Descripción |
|-------|------|-------------|
| `uuid` | `string` (uuid) | `uuid` de la persona |

:::caution Reglas de eliminación
* No se puede eliminar la persona **por defecto** mientras haya otras registradas (`409`): primero marca otra como por defecto.
* La **última** persona sí se puede eliminar. La dirección del buzón se conserva y sigue recibiendo correo (en `GET /mailbox/address`, `reception_person_uuid` pasa a `null`). Sin persona, el buzón se comporta como modo manual y la importación por Excel/CUFE y el envío de eventos responden `400` `No tiene una persona de recepción asignada`.
* Al registrar la siguiente persona, la empresa recupera el mismo buzón y el modo anterior.
:::

**cURL**

```bash
curl -X DELETE "{{url}}/events/reception-people/9b1d2c3e-4f50-4a6b-8c7d-0e1f2a3b4c5d" \
  -H "Authorization: Bearer {token}"
```

**JavaScript (Axios)**

```js
const response = await axios.delete(`${url}/events/reception-people/${personUuid}`, {
  headers: { Authorization: `Bearer ${token}` }
});
```

**PHP (Guzzle)**

```php
$response = $client->delete("{$url}/events/reception-people/{$personUuid}", [
    'headers' => ['Authorization' => "Bearer {$token}"],
]);
```

**💻 Ver Respuesta Exitosa (200)**

`dataRecord` es el estado resultante de la empresa.

```json
{
    "message": "Persona de recepción eliminada.",
    "dataRecord": {
        "send_events": false,
        "default_person_uuid": null,
        "people": []
    },
    "success": true
}
```

**❌ Ver Respuestas de Error**

| HTTP | Mensaje |
|:---:|---|
| `404` | `La persona de recepción no existe para esta empresa.` |
| `409` | `No se puede eliminar la persona de recepción por defecto mientras haya otras registradas. Marque otra como persona por defecto y vuelva a intentarlo.` |
| `403` | `RECEPTION_NOT_IN_PLAN` (ver [Requisito de plan](https://docs.matias-api.com/docs/endpoints/events-radian#requisito-de-plan)) |

**POST /reception-people/{uuid}/default — Marcar Persona por Defecto**

Marca la persona por defecto, sin body. El buzón (misma dirección) y el modo automático/manual se trasladan de la anterior y **no cambian**; si la empresa aún no tenía buzón, se le asigna uno a la nueva persona por defecto. Es **idempotente**: si ya es la persona por defecto, no cambia nada.

**Path Params:**

| Parámetro | Tipo | Descripción |
|-------|------|-------------|
| `uuid` | `string` (uuid) | `uuid` de la persona |

**cURL**

```bash
curl -X POST "{{url}}/events/reception-people/9b1d2c3e-4f50-4a6b-8c7d-0e1f2a3b4c5d/default" \
  -H "Authorization: Bearer {token}"
```

**JavaScript (Axios)**

```js
const response = await axios.post(`${url}/events/reception-people/${personUuid}/default`, {}, {
  headers: { Authorization: `Bearer ${token}` }
});
```

**PHP (Guzzle)**

```php
$response = $client->post("{$url}/events/reception-people/{$personUuid}/default", [
    'headers' => ['Authorization' => "Bearer {$token}"],
]);
```

**💻 Ver Respuesta Exitosa (200)**

`dataRecord` es el estado resultante de la empresa (`people` con el mismo formato que en `GET /reception-people`).

```json
{
    "message": "Persona de recepción por defecto actualizada.",
    "dataRecord": {
        "send_events": true,
        "default_person_uuid": "9b1d2c3e-4f50-4a6b-8c7d-0e1f2a3b4c5d",
        "people": []
    },
    "success": true
}
```

**❌ Persona no encontrada (HTTP 404)**

```json
{
    "success": false,
    "message": "La persona de recepción no existe para esta empresa."
}
```

**PUT /reception-people/mode — Modo de Eventos (Automático / Manual)**

Cambia el [modo de eventos](https://docs.matias-api.com/docs/endpoints/events-radian#eventos-automaticos) de la **empresa** (se aplica a todas sus personas).

**Body (JSON):**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `send_events` | `boolean` | **Sí** | `true`: automático (se crean y envían `030`, `032` y `033` para facturas a crédito). `false`: manual (no se crea ningún evento automático, tampoco el `030`). |
| `client_uuid` | `string` | No | UUID de la empresa cliente (Casa de Software) |

:::warning El 033 automático
En modo automático, la aceptación expresa (`033`) se envía sin intervención del usuario y quita la posibilidad de reclamar la factura con el `031`. Actívalo a conciencia.
:::

**cURL**

```bash
curl -X PUT "{{url}}/events/reception-people/mode" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "send_events": false
  }'
```

**JavaScript (Axios)**

```js
const response = await axios.put(`${url}/events/reception-people/mode`, {
  send_events: false
}, {
  headers: { Authorization: `Bearer ${token}` }
});
```

**PHP (Guzzle)**

```php
$response = $client->put("{$url}/events/reception-people/mode", [
    'headers' => ['Authorization' => "Bearer {$token}"],
    'json'    => ['send_events' => false],
]);
```

**💻 Ver Respuesta Exitosa (200)**

`dataRecord` es el estado resultante de la empresa (`people` con el mismo formato que en `GET /reception-people`).

```json
{
    "message": "Modo de eventos actualizado.",
    "dataRecord": {
        "send_events": false,
        "default_person_uuid": "9b1d2c3e-4f50-4a6b-8c7d-0e1f2a3b4c5d",
        "people": []
    },
    "success": true
}
```

**❌ Ver Respuestas de Error**

| HTTP | Mensaje | Causa |
|:---:|---|---|
| `409` | `Registre primero una persona de recepción: el modo de los eventos se guarda con la persona por defecto.` | La empresa no tiene personas de recepción |
| `422` | `Indique send_events: true (eventos automáticos) o false (manuales).` | Falta `send_events` |
| `422` | `send_events debe ser true o false.` | Valor no booleano |
| `403` | `RECEPTION_NOT_IN_PLAN` | Ver [Requisito de plan](https://docs.matias-api.com/docs/endpoints/events-radian#requisito-de-plan) |

---

<!-- Fuente: https://docs.matias-api.com/docs/endpoints/webhooks -->

# 🔔 Webhooks

:::info 🆕 Nuevo en v3.0.0 · ✅ Autenticación requerida
Recibe notificaciones HTTP en tiempo real cuando ocurren eventos importantes (documentos creados, emitidos o validados por la DIAN, correos enviados y entregados, lotes masivos terminados). **18 eventos suscribibles.**
:::

:::info ¿Dónde obtener el `client_uuid`? — Multi-Tenant para Casas de Software
Si operas como **Casa de Software** o **Cuenta Principal**, puedes listar, registrar y administrar los webhooks de cada una de tus empresas cliente agregando el parámetro `?client_uuid={{client_uuid}}` en la query string de **cualquier** endpoint de esta sección:
- **URL con Query Param:** `{{url}}/webhooks?client_uuid={{client_uuid}}`
- **Header:** `Authorization: Bearer {token_cuenta_principal}`
- **Comportamiento:** La configuración del webhook quedará vinculada específicamente a la empresa cliente indicada por su UUID.

**¿Dónde encontrar el `client_uuid` de tus clientes?**

```http
GET {{url}}/company/customers
Authorization: Bearer {token}
Content-Type: application/json
```

:::

:::note URL base
En esta página, `{{url}}` es la URL base del API **incluyendo** `/api/ubl2.1` (por ejemplo, en sandbox: `https://sandbox-api.matias-api.com/api/ubl2.1`). Las rutas de webhooks cuelgan directamente de ese prefijo: `{{url}}/webhooks`. No repitas `/ubl2.1` en la ruta; `{{url}}/ubl2.1/webhooks` responde 404.
:::

**Características principales:**

- 🔔 **18 tipos de eventos:** Documentos, correos, lotes masivos (y eventos reservados de pagos y cuotas)
- 🔐 **Firma HMAC-SHA256:** Verificación de autenticidad sobre el cuerpo exacto recibido
- 🔄 **Reintentos automáticos:** Hasta 6 reintentos con espera creciente
- 🎨 **Headers personalizados:** Agrega tus propios headers
- 🧪 **Testing integrado:** Prueba webhooks antes de producción
- 📊 **Historial completo:** Rastreo de entregas exitosas y fallidas, con reintento manual

---

## 📋 Eventos Disponibles

**GET /webhooks/events — Listar Todos los Eventos**

```http
GET {{url}}/webhooks/events
Authorization: Bearer {token}
```

**✅ Respuesta Exitosa (HTTP 200)**

```json
{
  "dataRecords": {
    "data": {
      "documents": [
        { "value": "document.created", "label": "Documento creado en el sistema" },
        { "value": "document.emitted", "label": "Documento enviado a DIAN" }
      ],
      "emails": [
        { "value": "email.sent", "label": "Email enviado al destinatario" }
      ],
      "payments": [
        { "value": "payment.approved", "label": "Pago procesado exitosamente" }
      ],
      "memberships": [
        { "value": "quota.limit_reached", "label": "80% de cuota mensual alcanzada" }
      ]
    }
  },
  "success": true
}
```

El ejemplo está recortado: cada categoría trae todos sus eventos. El listado **no incluye** la categoría de lotes masivos, pero `bulk.batch.completed` sí se puede suscribir.

### Catálogo de Eventos

| Categoría | Evento | Descripción |
|-----------|--------|-------------|
| **📄 Documentos** | `document.created` | Documento creado en el sistema |
| | `document.emitted` | Documento enviado a DIAN |
| | `document.accepted` | Documento aceptado por DIAN |
| | `document.rejected` | Documento rechazado por DIAN |
| | `document.voided` | Documento anulado |
| **📧 Emails** | `email.sent` | Email enviado al destinatario |
| | `email.delivered` | Email entregado al destinatario |
| | `email.bounced` | Email rebotado |
| | `email.complaint` | Email marcado como spam |
| | `email.opened` | Email abierto por el destinatario |
| | `email.clicked` | Link clickeado en el email |
| **📦 Lotes masivos** | `bulk.batch.completed` | Lote de documentos masivos completado |
| **💳 Pagos** *(reservado)* | `payment.approved` | Pago procesado exitosamente |
| | `payment.declined` | Pago rechazado |
| | `payment.pending` | Pago en proceso |
| **🏷️ Membresías y cuotas** *(reservado)* | `quota.limit_reached` | 80% de cuota mensual alcanzada |
| | `quota.limit_exceeded` | Cuota mensual excedida |
| | `token.expiring_soon` | Token expira en 7 días |

:::caution Eventos reservados
Los eventos `payment.*`, `quota.*` y `token.*` se aceptan al suscribirse, pero **aún no se emiten**: hoy solo se disparan los eventos de documentos, de correos y `bulk.batch.completed`.

Cualquier evento fuera de este catálogo (por ejemplo `payment.error` o `membership.activated`, que no existen) se rechaza al crear o actualizar el webhook con HTTP 422:

```json
{
  "success": false,
  "message": "Evento inválido: membership.activated"
}
```

:::

---

## 🔧 Gestión de Webhooks

**GET /webhooks — Listar Webhooks**

```http
GET {{url}}/webhooks?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

**✅ Respuesta Exitosa (HTTP 200)**

```json
{
  "dataRecords": {
    "data": [
      {
        "id": 1,
        "name": "Webhook Producción",
        "url": "https://tu-servidor.com/webhook/matias",
        "events": ["document.created", "document.emitted"],
        "is_active": true,
        "last_triggered_at": "2026-02-06T16:45:00-05:00",
        "created_at": "2026-02-01T10:00:00-05:00",
        "stats": {
          "total": 150,
          "delivered": 144,
          "failed": 3,
          "pending": 2,
          "retrying": 1
        },
        "recent_deliveries": [
          {
            "id": 2746,
            "event_type": "document.created",
            "status": "delivered",
            "delivered_at": "2026-02-06T16:45:00-05:00"
          }
        ]
      }
    ],
    "total": 1
  },
  "success": true
}
```

- `stats.total` es la suma de los cuatro estados (`delivered` + `failed` + `pending` + `retrying`).
- `recent_deliveries` trae como máximo las **5** entregas más recientes, la última primero.
- `last_triggered_at` es `null` si el webhook nunca ha tenido una entrega exitosa.
- El listado **no** devuelve el `secret` ni los `headers`; consúltalos en el detalle.

**GET /webhooks/{webhook_id} — Detalle de un Webhook**

```http
GET {{url}}/webhooks/{webhook_id}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `webhook_id` | path | ✅ Sí | ID del webhook. |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

**✅ Respuesta Exitosa (HTTP 200)**

```json
{
  "dataRecords": {
    "data": {
      "id": 1,
      "name": "Webhook Producción",
      "url": "https://tu-servidor.com/webhook/matias",
      "events": ["document.created", "document.emitted"],
      "is_active": true,
      "last_triggered_at": "2026-02-06T16:45:00-05:00",
      "created_at": "2026-02-01T10:00:00-05:00",
      "secret": "whsec_EJEMPLOxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "headers": { "X-Custom-Header": "valor-personalizado" },
      "stats": {
        "total": 150,
        "delivered": 144,
        "failed": 3,
        "pending": 2,
        "retrying": 1
      }
    }
  },
  "success": true
}
```

El detalle devuelve el `secret` vigente, así que puedes consultarlo en cualquier momento. Para invalidarlo y cambiarlo, usa `POST /webhooks/{webhook_id}/regenerate-secret`.

**❌ Webhook no encontrado (HTTP 404)**

Un webhook inexistente o de otra empresa responde igual en todos los endpoints de esta sección:

```json
{
  "success": false,
  "message": "Webhook no encontrado."
}
```

**POST /webhooks — Crear Webhook**

```http
POST {{url}}/webhooks?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros del Body:**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `name` | `string` | ✅ Sí | Nombre descriptivo del webhook (máx. 100 caracteres) |
| `url` | `string` | ✅ Sí | URL donde recibirás las notificaciones (máx. 500 caracteres). En producción debe ser HTTPS y pública |
| `events` | `array` | ✅ Sí | Eventos a los que te suscribes (mínimo 1), cada uno un `string` del [catálogo](https://docs.matias-api.com/docs/endpoints/webhooks#eventos-disponibles) |
| `headers` | `object` | No | Headers personalizados (clave → valor `string`) que se incluyen en cada entrega |
| `is_active` | `boolean` | No | Si el webhook está activo (default: `true`) |

**Reglas de validación** (HTTP 422):

| Mensaje | Causa |
|---|---|
| `URL inválida` | La URL no tiene un formato válido. |
| `Solo se permiten URLs HTTPS en producción` | *(Solo en producción)* La URL no empieza por `https://`. |
| `No se permiten URLs locales o privadas en producción` | *(Solo en producción)* `localhost`, `127.0.0.1`, `::1`, `0.0.0.0` o IP de rangos privados o reservados. |
| `Dominio bloqueado: webhook.site` | *(Solo en producción)* Dominios de captura públicos (`webhook.site`, `requestbin.com`, `hookbin.com`). |
| `Debe seleccionar al menos un evento` | `events` vacío. |
| `Evento inválido: <evento>` | El evento no está en el catálogo. |
| `No se puede sobrescribir el header del sistema: <header>` | Un header personalizado usa un nombre reservado: `Content-Type`, `X-Webhook-Signature`, `X-Webhook-Id`, `X-Webhook-Event`, `X-Webhook-Timestamp` o `User-Agent`. |
| `El valor del header debe ser una cadena` | Un valor de `headers` no es `string`. |

Estos errores responden `{"success": false, "message": "..."}`. Los errores de formato del body (campo faltante, tipo incorrecto, longitud) responden en el formato estándar de validación: HTTP 422 con `message` y `errors` por campo.

**cURL**

```bash
curl -X POST "{{url}}/webhooks" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Webhook Producción",
    "url": "https://tu-servidor.com/webhook/matias",
    "events": ["document.created", "document.emitted", "email.sent"],
    "headers": { "X-Custom-Header": "valor-personalizado" },
    "is_active": true
  }'
```

**JavaScript (Axios)**

```js
const response = await axios.post(`${url}/webhooks`, {
  name: 'Webhook Producción',
  url: 'https://tu-servidor.com/webhook/matias',
  events: ['document.created', 'document.emitted', 'email.sent'],
  headers: { 'X-Custom-Header': 'valor-personalizado' },
  is_active: true
}, {
  headers: { Authorization: `Bearer ${token}` }
});
// Guarda el secret para verificar la firma HMAC
const secret = response.data.dataRecords.data.secret;
```

**PHP (Guzzle)**

```php
$response = $client->post("{$url}/webhooks", [
    'headers' => ['Authorization' => "Bearer {$token}"],
    'json'    => [
        'name'      => 'Webhook Producción',
        'url'       => 'https://tu-servidor.com/webhook/matias',
        'events'    => ['document.created', 'document.emitted'],
        'is_active' => true,
    ],
]);
$secret = json_decode($response->getBody())->dataRecords->data->secret;
```

**✅ Respuesta Exitosa (HTTP 201)**

```json
{
  "dataRecords": {
    "data": {
      "id": 1,
      "name": "Webhook Producción",
      "url": "https://tu-servidor.com/webhook/matias",
      "secret": "whsec_EJEMPLOxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "events": ["document.created", "document.emitted"],
      "is_active": true,
      "created_at": "2026-02-01T10:00:00-05:00"
    }
  },
  "message": "Webhook creado exitosamente",
  "success": true
}
```

:::tip Guarda el `secret`
El servidor genera el `secret` con el formato `whsec_` seguido de 40 caracteres. Lo necesitas para verificar la firma HMAC. Si lo pierdes, puedes consultarlo de nuevo en `GET /webhooks/{webhook_id}`.
:::

**PUT /webhooks/{webhook_id} — Actualizar Webhook**

```http
PUT {{url}}/webhooks/{webhook_id}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `webhook_id` | path | ✅ Sí | ID del webhook a actualizar. |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

**Body:** mismos campos que en `POST`, todos opcionales. La actualización es parcial para `name`, `url`, `events` e `is_active`: solo cambia lo que envías. Se aplican las mismas reglas de validación.

:::warning Los `headers` no son parciales
Si el `PUT` no incluye `headers`, los headers personalizados del webhook **se borran**. Para conservarlos, reenvíalos siempre en cada actualización.
:::

```json
{
  "name": "Webhook Actualizado",
  "url": "https://nuevo-servidor.com/webhook",
  "events": ["document.created", "document.accepted"],
  "headers": { "X-Custom-Header": "valor-personalizado" },
  "is_active": true
}
```

**✅ Respuesta Exitosa (HTTP 200)**

```json
{
  "dataRecords": {
    "data": {
      "id": 21,
      "name": "Webhook Actualizado",
      "url": "https://nuevo-servidor.com/webhook",
      "events": ["document.created", "document.accepted"],
      "is_active": true
    }
  },
  "message": "Webhook actualizado exitosamente",
  "success": true
}
```

**DELETE /webhooks/{webhook_id} — Eliminar Webhook**

```http
DELETE {{url}}/webhooks/{webhook_id}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `webhook_id` | path | ✅ Sí | ID del webhook a eliminar. |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

**✅ Respuesta Exitosa (HTTP 200)**

```json
{
  "success": true,
  "message": "Webhook eliminado exitosamente"
}
```

**POST /webhooks/{webhook_id}/test — Probar Webhook**

```http
POST {{url}}/webhooks/{webhook_id}/test?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Envía de inmediato un evento de prueba (`type: "webhook.test"`) a la URL del webhook y espera la respuesta de tu servidor. Funciona aunque el webhook esté inactivo. La entrega queda registrada en el historial y, si falla, entra en la política de [reintentos automáticos](https://docs.matias-api.com/docs/endpoints/webhooks#reintentos).

El evento de prueba llega con este `data`:

```json
{
  "message": "Este es un webhook de prueba desde APIDIAN",
  "webhook_id": 21,
  "timestamp": "2026-02-06T16:45:00-05:00"
}
```

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `webhook_id` | path | ✅ Sí | ID del webhook a probar. |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

**✅ Respuesta Exitosa (HTTP 200)**

Tu servidor respondió con un código 2xx:

```json
{
  "success": true,
  "message": "Webhook de prueba enviado exitosamente",
  "dataRecords": {
    "data": {
      "delivery_id": 2747,
      "status_code": 200,
      "response": "{\"received\":true}",
      "delivered_at": "2026-02-06T16:45:00-05:00"
    }
  }
}
```

**❌ Entrega fallida (HTTP 424)**

Tu servidor respondió con un código distinto de 2xx, o hubo un error de conexión o timeout. En el caso de error de conexión, `status_code` es `null` y `response` trae el mensaje del error:

```json
{
  "success": false,
  "message": "Webhook de prueba falló. Se reintentará automáticamente.",
  "dataRecords": {
    "data": {
      "delivery_id": 2748,
      "status_code": 500,
      "response": "Internal Server Error",
      "delivered_at": "2026-02-06T16:46:00-05:00"
    }
  }
}
```

**GET /webhooks/{webhook_id}/deliveries — Historial de Entregas**

```http
GET {{url}}/webhooks/{webhook_id}/deliveries?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Retorna el historial paginado (15 por página) de entregas del webhook, la más reciente primero. Usa `?page=` para navegar.

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `webhook_id` | path | ✅ Sí | ID del webhook. |
| `page` | query | No | Número de página (default: `1`). |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

**✅ Respuesta Exitosa (HTTP 200)**

```json
{
  "dataRecords": {
    "current_page": 1,
    "data": [
      {
        "id": 2746,
        "webhook_id": 21,
        "event_type": "document.created",
        "payload": {
          "id": "evt_EJEMPLOxxxxxxxxxxxxxxxxx",
          "type": "document.created",
          "created_at": "2026-02-06T16:45:00-05:00",
          "api_version": "3.0",
          "data": { "object": "shipping_history", "id": 12345 }
        },
        "signature": "5f2b9c...e81a",
        "status": "delivered",
        "http_status": 200,
        "response_body": "{\"received\":true}",
        "retry_count": 0,
        "delivered_at": "2026-02-06T16:45:00.000000Z",
        "next_retry_at": null
      }
    ],
    "first_page_url": "{{url}}/webhooks/21/deliveries?page=1",
    "last_page": 1,
    "per_page": 15,
    "total": 1
  },
  "success": true
}
```

| Campo | Descripción |
|---|---|
| `payload` | Sobre completo que se envió (ver [Payload recibido](https://docs.matias-api.com/docs/endpoints/webhooks#payload-recibido)). |
| `signature` | Firma HMAC enviada en el último intento. |
| `status` | `pending` (esperando reintento), `retrying` (reintento en curso), `delivered` o `failed` (reintentos agotados). |
| `http_status` | Código HTTP que respondió tu servidor (`null` si no hubo respuesta). |
| `response_body` | Cuerpo de la respuesta de tu servidor, o el mensaje del error de conexión. |
| `retry_count` | Reintentos realizados (0 a 6). |
| `next_retry_at` | Fecha del próximo reintento automático, si lo hay. |

El paginador incluye además los campos estándar (`from`, `to`, `links`, `next_page_url`, `prev_page_url`, `path`, `last_page_url`).

**POST /webhooks/{webhook_id}/deliveries/{delivery_id}/retry — 🆕 Reintentar una Entrega**

```http
POST {{url}}/webhooks/{webhook_id}/deliveries/{delivery_id}/retry?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Reenvía al instante el payload original de una entrega, sin esperar al próximo reintento programado. La firma y los headers se recalculan con el `secret` vigente, y se añade `X-Webhook-Retry-Count`. Si la entrega ya había agotado los 6 reintentos, el contador vuelve a 0 antes de reenviar. No lleva body.

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `webhook_id` | path | ✅ Sí | ID del webhook de la empresa. |
| `delivery_id` | path | ✅ Sí | ID de una entrega de ese webhook (del historial de entregas). |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

**✅ Respuesta Exitosa (HTTP 200)**

```json
{
  "success": true,
  "message": "Entrega reintentada y confirmada exitosamente",
  "dataRecords": {
    "data": {
      "delivery_id": 2746,
      "status_code": 200,
      "response": "{\"received\":true}",
      "retry_count": 1,
      "delivered_at": "2026-02-06T17:10:00-05:00"
    }
  }
}
```

**❌ Reintento fallido (HTTP 424)**

Tu servidor volvió a responder con un código distinto de 2xx, hubo un error de conexión, o el webhook está **inactivo** (en ese caso no se envía nada):

```json
{
  "success": false,
  "message": "El reintento falló nuevamente. Revise la respuesta del endpoint receptor.",
  "dataRecords": {
    "data": {
      "delivery_id": 2746,
      "status_code": 500,
      "response": "Internal Server Error",
      "retry_count": 2,
      "delivered_at": "2026-02-06T17:10:00-05:00"
    }
  }
}
```

**❌ No encontrado (HTTP 404)**

```json
{
  "success": false,
  "message": "Entrega de webhook no encontrada."
}
```

Si el que no existe es el webhook, el mensaje es `Webhook no encontrado.`

**POST /webhooks/{webhook_id}/regenerate-secret — Regenerar Secret HMAC**

```http
POST {{url}}/webhooks/{webhook_id}/regenerate-secret?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Genera un nuevo secret (`whsec_` seguido de 40 caracteres) para verificar la firma HMAC. El secret anterior queda **inmediatamente inválido**.

:::warning Acción crítica
Actualiza tu sistema inmediatamente con el nuevo secret. Las entregas que se envíen o reintenten desde ese momento se firman con el secret nuevo.
:::

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `webhook_id` | path | ✅ Sí | ID del webhook. |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

**✅ Respuesta Exitosa (HTTP 200)**

```json
{
  "dataRecords": {
    "data": {
      "secret": "whsec_NUEVOxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    }
  },
  "message": "Secret regenerado exitosamente",
  "success": true
}
```

---

## 🔐 Seguridad HMAC

### Payload Recibido

Cuando ocurre un evento, recibirás un `POST` en tu URL con este sobre:

```json
{
  "id": "evt_EJEMPLOxxxxxxxxxxxxxxxxx",
  "type": "document.created",
  "created_at": "2026-02-06T16:45:00-05:00",
  "api_version": "3.0",
  "data": {
    "object": "shipping_history",
    "id": 12345,
    "uuid": "8f14e45f-ceea-467a-9b2d-0a1b2c3d4e5f",
    "type_document": { "id": 7, "code": "01", "name": "Factura electrónica de venta" },
    "operation_type": { "id": 1, "code": "10", "name": "Estándar" },
    "document_number": "SETP990000001",
    "order_number": "PED-1001",
    "resolution": { "prefix": "SETP", "resolution_number": "18760000001" },
    "company": { "name": "EMPRESA DE EJEMPLO SAS", "dni": "900000000", "email": "facturacion@ejemplo.com" },
    "customer": { "name": "CLIENTE DE EJEMPLO SAS", "dni": "800000000", "email": "cliente@ejemplo.com" },
    "legal_monetary_totals": { "payable_amount": "1190000.00" },
    "invoice_date": "2026-02-06T00:00:00.000000Z",
    "status": 1,
    "is_valid": 1,
    "cufe": "cufe-de-ejemplo",
    "xml_file_name": "fv09000000000002600000001.xml",
    "qr_url": "https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=cufe-de-ejemplo",
    "paths": { "pdf": "...", "xml": "...", "zip": "...", "qr": "..." },
    "created_at": "06-02-2026 04:45:00 pm",
    "updated_at": "06-02-2026 04:45:05 pm"
  }
}
```

| Campo | Descripción |
|---|---|
| `id` | Identificador único del evento: `evt_` seguido de 24 caracteres. Es el mismo valor del header `X-Webhook-Id` y **se conserva en los reintentos**. |
| `type` | Tipo de evento (ver [catálogo](https://docs.matias-api.com/docs/endpoints/webhooks#eventos-disponibles)). |
| `created_at` | Fecha del evento en ISO-8601. |
| `api_version` | Versión del formato del sobre (`3.0`). |
| `data` | Datos del evento; su forma depende del prefijo de `type`. |

**Forma de `data` según el evento:**

**`document.*` — Documentos electrónicos**

Campos: `object` (`shipping_history`), `id`, `uuid`, `type_document` (`id`, `code`, `name`), `operation_type` (`id`, `code`, `name`), `document_number`, `order_number`, `resolution` (`prefix`, `resolution_number`), `company` (`name`, `dni`, `email`), `customer` (`name`, `dni`, `email`; `name` es `Unknown` si falta), `legal_monetary_totals`, `invoice_date`, `status`, `is_valid`, `cufe`, `xml_file_name`, `qr_url`, `paths` (`pdf`, `xml`, `zip`, `qr`), `created_at`, `updated_at`.

- `qr_url` es la URL de consulta en la DIAN del CUFE/CUDE vigente (`cufe`), nunca la de otro intento con el mismo número. Es `null` si el documento no tiene datos JSON.

**🆕 Cuándo se emite `document.accepted`:**

- Cuando la emisión queda validada por la DIAN.
- Cuando la API devuelve un documento que la DIAN ya había autorizado (advertencia `ALREADY_AUTHORIZED_RECOVERED`; ver [Regla 90](https://docs.matias-api.com/docs/endpoints/invoices-pos#regla-90)).
- Puede llegar más tarde para un documento antiguo que se concilia con la DIAN.

**No se emite** cuando el documento queda validado después, con `POST /status/document/{trackId}` o con la revalidación automática. Si dependes de ese estado, consúltalo con esos endpoints.

Si el documento ya no existe al construir el evento:

```json
{ "object": "shipping_history", "id": 12345, "error": "Document not found" }
```

**`email.*` — Correos**

```json
{
  "object": "email_log",
  "id": 9876,
  "message_id": "0100018d-ejemplo-000000",
  "document": { "id": 12345, "type": "Factura electrónica de venta", "number": "SETP990000001", "uuid": "8f14e45f-ceea-467a-9b2d-0a1b2c3d4e5f" },
  "recipient": "cliente@ejemplo.com",
  "status": "delivered",
  "delivered_at": "2026-02-06T16:46:00-05:00",
  "bounced_at": null,
  "opened_at": null,
  "clicked_at": null,
  "bounce_type": null,
  "opens_count": 0,
  "clicks_count": 0
}
```

Si el registro del correo no existe: `{"object": "email_log", "id": null, "error": "Email log not found"}`.

**`bulk.batch.completed` — Lotes masivos**

```json
{
  "object": "document_batch",
  "batch_id": "b5e2c1d0-0000-4000-8000-000000000000",
  "status": "completed",
  "total_items": 100,
  "succeeded": 98,
  "failed": 2,
  "finished_at": "2026-02-06T17:00:00-05:00"
}
```

**`quota.*`, `token.*` y `payment.*` — Reservados**

Estos eventos aún no se emiten. La forma de su `data` se documentará cuando se activen; mientras tanto, no dependas de ellos en tu integración.

**Headers que recibes:**

```
Content-Type:          application/json
X-Webhook-Signature:   5f2b9c0d...e81a   (HMAC-SHA256 en hexadecimal, sin prefijo)
X-Webhook-Id:          evt_EJEMPLOxxxxxxxxxxxxxxxxx
X-Webhook-Event:       document.created
X-Webhook-Timestamp:   1770414300        (epoch Unix en segundos)
User-Agent:            APIDIAN-Webhooks/3.0
X-Webhook-Retry-Count: 1                 (solo en reintentos, de 1 a 6)
```

- Tus headers personalizados se añaden a estos.
- `X-Webhook-Timestamp` y la firma se recalculan en cada reintento; `X-Webhook-Id` se mantiene.
- Los nombres de header no distinguen mayúsculas (en Node.js llegan en minúsculas: `x-webhook-signature`).

### Verificar Firma HMAC

La firma es `HMAC-SHA256(cuerpo, secret)` en hexadecimal, donde `cuerpo` son **exactamente los bytes** del `POST` que recibes. Para validarla:

1. Lee el cuerpo **crudo** de la petición. No lo parsees y vuelvas a serializar: `JSON.stringify` o `json_encode` no reproducen los mismos bytes (escapes de `/` y de caracteres Unicode, espacios) y la firma no coincidirá.
2. Calcula el HMAC-SHA256 en hexadecimal con tu `secret`.
3. Compáralo con `X-Webhook-Signature` en **tiempo constante**.

**Node.js**

```javascript
const crypto = require('crypto');
const express = require('express');

const app = express();
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET; // whsec_...

function verifyWebhook(rawBody, signature, secret) {
  if (typeof signature !== 'string') return false;

  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody) // Buffer con el cuerpo crudo
    .digest('hex');

  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(signature, 'utf8');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// express.raw() entrega el cuerpo sin parsear (Buffer)
app.post('/webhook/matias', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-webhook-signature'];

  if (!verifyWebhook(req.body, signature, WEBHOOK_SECRET)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const event = JSON.parse(req.body.toString('utf8'));
  // ✅ Responde rápido y procesa el evento en segundo plano (event.id, event.type, event.data)
  res.status(200).json({ received: true });
});
```

**PHP**

```php
$secret    = getenv('WEBHOOK_SECRET'); // whsec_...
$raw       = file_get_contents('php://input');           // cuerpo crudo
$signature = $_SERVER['HTTP_X_WEBHOOK_SIGNATURE'] ?? '';

$expected = hash_hmac('sha256', $raw, $secret);

if (!hash_equals($expected, $signature)) {
    http_response_code(401);
    exit('Invalid signature');
}

$event = json_decode($raw, true);
// ✅ Procesar el evento ($event['id'], $event['type'], $event['data'])
http_response_code(200);
echo json_encode(['received' => true]);
```

:::warning Protección contra repetición
La firma no incluye `X-Webhook-Timestamp`. La protección contra repeticiones corre por tu cuenta: guarda el `id` del evento (`X-Webhook-Id`) y descarta los que ya procesaste.
:::

---

## 🔄 Reintentos Automáticos

:::tip Política de reintentos
Una entrega falla si tu servidor responde con un código distinto de 2xx, o si hay un error de conexión o un timeout. El timeout es de **30 segundos** por intento. Las entregas fallidas se reintentan automáticamente:
:::

| Reintento | Espera desde el intento anterior |
|---------|--------|
| 1 | 1 minuto |
| 2 | 5 minutos |
| 3 | 30 minutos |
| 4 | 2 horas |
| 5 | 4 horas |
| 6 | Sin espera adicional (en la siguiente pasada, cerca de 1 minuto) |

- Mientras espera, la entrega está en `pending` con `next_retry_at`; durante el intento pasa a `retrying`.
- Hay como máximo **6 reintentos**. Si se agotan, la entrega queda en `failed`.
- Los webhooks **inactivos** no se reintentan.
- Cada reintento conserva el `id` del evento y envía `X-Webhook-Retry-Count`.
- Puedes reintentar una entrega en cualquier momento con [`POST /webhooks/{webhook_id}/deliveries/{delivery_id}/retry`](https://docs.matias-api.com/docs/endpoints/webhooks#gestion-webhooks), incluso si ya agotó los reintentos.

---

## 💡 Mejores Prácticas

| Práctica | Descripción |
|----------|-------------|
| ⚡ **Responde rápido** | Responde `2xx` en menos de 5 segundos (el límite real es de 30 segundos; pasado ese tiempo la entrega cuenta como fallida) |
| 🔄 **Procesa async** | Usa colas (Redis, SQS) para procesar el webhook después de responder |
| 🔐 **Verifica firma** | Siempre valida el HMAC sobre el cuerpo crudo antes de procesar cualquier evento |
| 🆔 **Idempotencia** | Guarda el `id` del sobre (igual a `X-Webhook-Id`); en un reintento llega el mismo `id` |
| 📊 **Monitorea** | Revisa el historial de entregas y reintenta las fallidas con el endpoint de reintento |

---

<!-- Fuente: https://docs.matias-api.com/docs/endpoints/public-dian -->

# 🟢 Endpoints Públicos, Tablas DIAN y Funciones Auxiliares

:::tip Sin autenticación — Acceso libre
Estos endpoints obtienen tablas paramétricas DIAN, catálogos del sistema y funciones auxiliares de cálculo. **No requieren token** ni parámetro `client_uuid`.
:::

### Respuesta Estándar de Catálogos

Todas las respuestas de consulta de catálogos siguen este patrón:

```json
{
  "dataRecords": {
    "data": [
      { "id": 1, "code": "01", "name": "Factura de Venta" }
    ]
  },
  "success": true
}
```

---

## 📋 Tablas Referenciadas DIAN

**¿Cuándo usar?** Para obtener códigos válidos antes de construir y enviar un documento electrónico.

**📄 Documentos Electrónicos**

| Endpoint | Uso | Ejemplo de Respuesta |
|----------|-----|---------------------|
| `GET /destination-environment` | Ambiente de Destino | Producción, Pruebas |
| `GET /document-type` | Tipos de Documentos | `01`=Factura, `02`=Exportación, etc. |
| `GET /payment-methods` | Métodos de Pago | Formas de pago válidas |
| `GET /payment-means` | Medios de Pago | Efectivo, Tarjeta, etc. |
| `GET /identity-documents` | Identidades | CC, NIT, Pasaporte, etc. |
| `GET /organization-type` | Tipo de Organización | `1`=Persona Jurídica, `2`=Natural |
| `GET /fiscal-regime` | Régimen Fiscal | Responsabilidades fiscales |
| `GET /accounting-regime` | Régimen Contable | Códigos contables |
| `GET /delivery-conditions` | INCOTERMS | Términos de entrega |
| `GET /correction-notes` | Motivos de corrección | Notas crédito/débito |
| `GET /discount-codes` | Códigos de descuento | Tipos de descuento |
| `GET /operation-type` | Tipo de operación | Nacional, Exportación |
| `GET /taxes` | Tributos e impuestos | IVA, ICA, INC, etc. |
| `GET /quantity-units` | Unidades de cantidad | Kg, Lt, Pz, etc. |
| `GET /type-item-identifications` | Identificación de Ítem | Estándar del contribuyente |
| `GET /reference-price` | Unidad de referencia | Precios referenciales |
| `GET /cities` | Ciudades | Parámetro opcional: `?code=` |
| `GET /departments` | Departamentos | Departamentos de Colombia |
| `GET /countries` | Países | Países |
| `GET /currencies` | Monedas | Monedas |

**🏥 Sector Salud**

| Endpoint | Uso |
|----------|-----|
| `GET /health/user-type` | Tipo de usuario |
| `GET /health/contracting` | Modalidad de contratación |
| `GET /health/coverage` | Cobertura o plan de beneficios |

**💼 Nómina Electrónica**

| Endpoint | Uso |
|----------|-----|
| `GET /ep/adjustment-note-type` | Tipo de ajuste a la nota de ajuste |
| `GET /ep/contract-type` | Tipo de contrato |
| `GET /ep/disability-type` | Tipo de discapacidad |
| `GET /ep/extra-hours` | Horas extras |
| `GET /ep/payroll-period` | Periodicidad de la nómina |
| `GET /ep/worker-type` | Tipo de trabajo |
| `GET /ep/worker-subtype` | Subtipo de trabajo |

---

## 🛠️ Funciones Auxiliares Públicas

**GET /numbers-to-letters — Convertir Números a Letras**

```http
GET {{url}}/numbers-to-letters?number={number}&money={money}&money2={money2}
GET {{url}}/numbersToLetters/{numero}
```

**Descripción:** Convierte una cifra numérica a su representación textual en letras (útil para la leyenda monetaria en representaciones gráficas de facturas).

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `number` / `numero` | query / path | ✅ Sí | Número o importe a convertir (ej. `58547125`). |
| `money` | query | No | Denominación en singular (ej. `PESO`, `DÓLAR`). |
| `money2` | query | No | Denominación de fracción (ej. `CENTAVO`). |

**cURL**

```bash
curl "{{url}}/numbers-to-letters?number=58547125&money=PESO&money2=CENTAVO"
```

**JavaScript (Axios)**

```js
const response = await axios.get(`${url}/numbers-to-letters`, {
  params: { number: 58547125, money: 'PESO', money2: 'CENTAVO' }
});
const text = response.data.letters;
```

**PHP (Guzzle)**

```php
$response = $client->get("{$url}/numbers-to-letters", [
    'query' => ['number' => 58547125, 'money' => 'PESO', 'money2' => 'CENTAVO'],
]);
```

**✅ Respuesta Exitosa (HTTP 200)**

```json
{
  "letters": "CINCUENTA Y OCHO MILLONES QUINIENTOS CUARENTA Y SIETE MIL CIENTO VEINTICINCO PESOS M/CTE",
  "success": true
}
```

**GET /digit-verification — Calcular Dígito de Verificación (DV)**

```http
GET {{url}}/digit-verification?Number={Number}
GET {{url}}/dv/{nit}
```

**Descripción:** Calcula el dígito de verificación oficial según el algoritmo módulo 11 de la DIAN.

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `Number` / `nit` | query / path | ✅ Sí | NIT sin dígito de verificación ni guiones (ej. `900123456`). |

**cURL**

```bash
curl "{{url}}/digit-verification?Number=900123456"
```

**JavaScript (Axios)**

```js
const response = await axios.get(`${url}/digit-verification`, {
  params: { Number: '900123456' }
});
const dv = response.data.digit; // 7
```

**PHP (Guzzle)**

```php
$response = $client->get("{$url}/digit-verification", [
    'query' => ['Number' => '900123456'],
]);
```

**✅ Respuesta Exitosa (HTTP 200)**

```json
{
  "digit": 7,
  "nit": "900123456-7"
}
```

---

<!-- Fuente: https://docs.matias-api.com/docs/bulk-documents -->

# Envío Masivo de Documentos (Bulk)

:::info Versión
Disponible desde **v2.10.0** · Base path: `/api/ubl2.1/bulk/documents` · Referencia rápida de endpoints: [📦 Envío Masivo (Bulk)](https://docs.matias-api.com/docs/endpoints/bulk-documents.md)

¿Ya integrabas el envío masivo? Revisa [Cambios y compatibilidad](https://docs.matias-api.com/docs/bulk-documents#cambios-y-compatibilidad) 🆕.
:::

:::warning 🚧 Endpoint en Fase BETA
El envío masivo de documentos (Bulk) se encuentra actualmente en **Fase BETA**. Aunque es completamente funcional, esto conlleva que los límites de rate limit, las estructuras de respuesta asíncrona, políticas de retención o las ventanas temporales de procesamiento podrían recibir ajustes técnicos orientados a estabilizar la infraestructura.

Te sugerimos implementar primero tu flujo de integración apoyándote en el ambiente [Sandbox](https://docs.matias-api.com/docs/sandbox/quickstart.md) antes de liberar a usuarios finales en producción.
:::

:::danger ⚠️ IMPORTANTE: el lote se elimina a los 7 días
Los lotes y sus items son **temporales**. Un lote terminado (`COMPLETED`, `PARTIAL` o `FAILED`) se **elimina por completo a los 7 días de su creación**, sin posibilidad de recuperación. Ver [Retención de datos](https://docs.matias-api.com/docs/bulk-documents#retencion).

Cada item que llegó a emitirse retorna un **`document_uuid`**. **Extrae y guarda este UUID en tu sistema** mientras el lote se procesa o apenas termine. Si el lote ya se purgó y no guardaste el UUID, **aún puedes consultar el documento con el [endpoint de búsqueda](https://docs.matias-api.com/docs/endpoints/queries-status#busqueda-listado) usando el número y el prefijo**.
:::

El endpoint de envío masivo permite procesar **múltiples documentos electrónicos** en un solo request HTTP. Los documentos se encolan para procesamiento asíncrono y puedes consultar el estado de cada uno individualmente.

---

## Flujo General

1. 🖥️ Tu sistema envía `POST /bulk/documents` con N documentos.
2. ⚡ La API valida el request y la cuota, registra el lote y sus items y responde `201 Created` con el `batch_id`.
3. 📦 Cada documento se procesa por separado: se envía a la 🏛️ DIAN en UBL 2.1 y su item se actualiza con la respuesta.
4. Cuando todos los items terminan, el lote se cierra y se dispara el webhook `bulk.batch.completed`.
5. Consultas `GET /bulk/documents/{batch_id}` para ver el estado completo del lote.

---

## Autenticación

Todos los endpoints requieren autenticación vía **Bearer Token** (Personal Access Token):

```
Authorization: Bearer {tu-token}
Accept: application/json
```

- **Casas de Software:** agrega `?client_uuid={{client_uuid}}` para crear y consultar lotes en nombre de una empresa cliente. El lote queda asociado a esa empresa y solo se consulta con el mismo `client_uuid`.
- **`Accept: application/json`:** envíalo siempre. Sin este header, algunos errores (validación, límites) pueden llegar como redirección `302` o como página HTML en lugar de JSON.

:::warning Membresía requerida también para consultar
Todo el grupo `/bulk` exige una membresía con cupo, no solo el `POST`. Si la empresa agotó su cuota o su membresía está inactiva, **también** `GET /bulk/documents`, `GET /bulk/documents/{batch_id}` y `GET /bulk/documents/{batch_id}/items` responden `402`:

```json
{
  "success": false,
  "message": "Límite de documentos de la membresía alcanzado o membresía inactiva."
}
```

Si el `client_uuid` no corresponde a una empresa cliente activa vinculada a tu cuenta, la petición se rechaza antes de llegar al lote (hoy con un `500` y `{"success": false, "message": "Error interno al verificar la membresía."}`). Revisa el `client_uuid` antes de reintentar.

Por eso conviene **guardar el `document_uuid` de cada item mientras el lote se procesa**. Si te quedas sin cupo, consulta tus documentos por `GET /documents` o `GET /status` ([Consultas y Estados](https://docs.matias-api.com/docs/endpoints/queries-status.md)).
:::

---

## Límites por Plan

| Plan | Docs por lote | Lotes por minuto | Descripción |
|------|:------------:|:----------:|-------------|
| **FREE** | 5 | 1 | Plan gratuito con límite diario |
| **Pago** | 50 | 10 | Suscripción con cuota finita |
| **Ilimitado** | 200 | 60 | Plan Servidor / Enterprise |

- **Tope técnico:** ningún lote puede superar **200 documentos**, sea cual sea el plan.
- **Docs por lote:** si el lote supera el tope de tu plan, la API responde `413` antes de validar el resto del body.
- **Lotes por minuto:** el límite se cuenta **por usuario y por empresa**: varios usuarios de la misma empresa comparten el cupo.
- **Cuota:** el lote completo debe caber en la cuota disponible de la suscripción, descontando los documentos que aún estén pendientes de lotes anteriores. Si no cabe, responde `402` y no se encola ningún documento.
- **Documentos en proceso:** una empresa puede tener como máximo **1000 documentos en proceso** (en cola o procesándose) a la vez. Por encima responde `429` con `Retry-After`.

Ver [Códigos de Error HTTP](https://docs.matias-api.com/docs/bulk-documents#errores) para el formato de cada respuesta.

---

## Tipos de Documento Soportados

| Valor (`kind`) | Descripción | Endpoint unitario equivalente (`auto-increment`) | Endpoint unitario equivalente (`manual`) |
|:--------------:|-------------|-------------------------------|-------------------------------|
| `invoice` | Factura electrónica | `POST /auto-increment/invoices` | `POST /invoice` |
| `credit_note` | Nota crédito | `POST /auto-increment/credit-notes` | `POST /notes/credit` |
| `debit_note` | Nota débito | `POST /auto-increment/debit-notes` | `POST /notes/debit` |
| `support_document` | Documento soporte | `POST /auto-increment/support-documents` | `POST /ds/document` |
| `adjustment_note` | Nota de ajuste | `POST /auto-increment/adjustment-notes` | `POST /ds/adjustment-note` |
| `pos_document` | Documento POS | `POST /auto-increment/pos-documents` | `POST /invoice` |

### Compatibilidad de payload

El `payload` de cada documento usa el **mismo formato JSON** que el body del endpoint unitario equivalente. Si ya tienes integración con el endpoint unitario, puedes reutilizar el mismo JSON. Hay diferencias importantes:

- **El payload no pasa por las validaciones del endpoint unitario.** Al admitir el lote solo se verifica que `payload` sea un objeto JSON. Un dato inválido **no** produce un `422` con `errors`: el lote se acepta y ese item termina `FAILED` con el error que devuelva el procesamiento (ver [Catálogo de `error_code`](https://docs.matias-api.com/docs/bulk-documents#error-code)). Los errores internos (`5xx`) se reintentan antes de quedar `FAILED`.
- **Valida tu JSON antes de enviarlo masivamente**, por ejemplo probándolo una vez en el endpoint unitario o en el [Sandbox](https://docs.matias-api.com/docs/sandbox/quickstart.md).
- **La empresa emisora es siempre la del lote** (la del token y el `client_uuid` del `POST /bulk/documents`). Un `client_uuid` o `companyId` dentro del `payload` se descarta.
- **`payload.uuid` se reemplaza** por el UUID anti-duplicados del item (ver [`documents[].uuid`](https://docs.matias-api.com/docs/bulk-documents#uuid-anti-duplicados)).

---

## Endpoints

### 1. Crear Lote

```
POST /api/ubl2.1/bulk/documents
```

Acepta un lote de documentos para procesamiento asíncrono. Retorna inmediatamente con **`201 Created`**.

#### Headers

| Header | Tipo | Requerido | Descripción |
|--------|------|:---------:|-------------|
| `Authorization` | string | ✅ | `Bearer {token}` |
| `Content-Type` | string | ✅ | `application/json` |
| `Accept` | string | Recomendado | `application/json`, para recibir todos los errores en JSON. |
| `Idempotency-Key` | UUID v4 | ❌ | Clave de idempotencia (máx. 36 caracteres, válida 24 h). Ver [Idempotencia](https://docs.matias-api.com/docs/bulk-documents#idempotencia). |

#### Query Parameters

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|:---------:|-------------|
| `client_uuid` | UUID | ❌ | Empresa cliente en cuyo nombre se emite el lote (Casas de Software). |

#### Request Body

| Campo | Tipo | Requerido | Descripción |
|-------|------|:---------:|-------------|
| `mode` | string | ✅ | `auto-increment` o `manual`. Ver [Modos de envío](https://docs.matias-api.com/docs/bulk-documents#modos-de-envio). |
| `stop_on_error` | boolean | ❌ | Si `true`, el primer documento que no termine en `SUCCESS` cancela los items que siguen en cola. Default: `false`. |
| `default_resolution_number` | string | ❌ | Número de resolución por defecto (máx. 50). Se copia en `payload.resolution_number` de los documentos que no lo traigan. |
| `default_prefix` | string | ❌ | Prefijo por defecto (máx. 10). Se copia en `payload.prefix` de los documentos que no lo traigan. |
| `documents` | array | ✅ | Documentos del lote. Mínimo 1; máximo el tope de tu plan y nunca más de 200. |
| `documents[].kind` | string | ✅ | Tipo de documento. Ver [tipos soportados](https://docs.matias-api.com/docs/bulk-documents#tipos-de-documento-soportados). |
| `documents[].payload` | object | ✅ | Body del endpoint unitario equivalente. Ver [Compatibilidad de payload](https://docs.matias-api.com/docs/bulk-documents#compatibilidad-payload). |
| `documents[].uuid` | UUID | ❌ | UUID anti-duplicados del documento. Debe ser válido y distinto dentro del lote. Ver [UUID anti-duplicados](https://docs.matias-api.com/docs/bulk-documents#uuid-anti-duplicados). |
| `documents[].client_reference` | string | ❌ | Tu referencia interna para rastrear el documento (máx. 64 caracteres). |
| `documents[].attachments` | array | ❌ | Adjuntos del documento (máx. 4). Se copian en `payload.attachments` solo si el `payload` no trae adjuntos propios: si `payload.attachments` existe y no está vacío, estos se ignoran. Ver [Adjuntos](https://docs.matias-api.com/docs/bulk-documents#adjuntos). |
| `documents[].attachments[].filename` | string | ✅ (por adjunto) | Nombre del archivo (máx. 255). |
| `documents[].attachments[].content` | string | ✅ (por adjunto) | Contenido del archivo en base64. |
| `documents[].attachments[].content_type` | string | ❌ | Tipo MIME (máx. 100). |

#### Adjuntos

- Los adjuntos de `documents[].attachments` viajan dentro del `payload` (`payload.attachments`) y se guardan y vinculan al documento igual que en el endpoint unitario, con la empresa del lote.
- Si el `payload` ya trae `attachments` con contenido, **manda el del `payload`** y `documents[].attachments` se ignora. Envía los adjuntos en uno solo de los dos lugares.
- Si el documento se emite pero sus adjuntos no quedan vinculados, el item lleva el warning `ATTACHMENTS_NOT_LINKED` (ver [El campo `response`](https://docs.matias-api.com/docs/bulk-documents#campo-response)).

:::warning Cada documento va envuelto en `kind` + `payload`
Los campos del documento (`type_document_id`, `customer`, `lines`…) van **dentro de `payload`**, nunca directamente en `documents[]`. Un documento sin `kind` o sin `payload` hace que todo el lote se rechace con `422` (`Cada documento debe especificar su tipo (kind).` / `Cada documento debe incluir su payload.`).
:::

#### UUID anti-duplicados

Cada item se emite con un UUID que impide emitir dos veces el mismo documento:

1. `documents[].uuid`, si lo envías.
2. Si no, `payload.uuid`, solo si es un UUID válido (si no lo es, se ignora).
3. Si tampoco, el `item_id` del propio item.

- `documents[].uuid` debe ser un UUID válido y no repetirse dentro del lote (sin distinguir mayúsculas). Si no se cumple, **todo el lote** se rechaza con `422` (`El UUID del documento debe ser un UUID v4 válido.` / `El UUID del documento está repetido dentro del lote.`).
- El UUID se registra antes de transmitir. Si la empresa ya tiene otro documento con ese UUID, el item **no se emite** y termina `FAILED` con `error_code` `DUPLICATE_DOCUMENT_UUID` y el mensaje `El uuid … ya se usó en el documento …. No se emitió de nuevo.`. Su `document_uuid` apunta al documento existente.
- Si el item falla antes de transmitirse, el UUID queda libre y puedes reenviar el documento con el mismo UUID.

#### Ejemplos de Request

Los payloads de estos ejemplos están **abreviados**: usa el JSON completo del endpoint unitario (ver, por ejemplo, [Factura con varios impuestos](https://docs.matias-api.com/docs/jsons-billing/invoice-with-taxes.md)).

**Auto-increment**

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
        "send_email": 0,
        "payments": [
          {
            "payment_method_id": 1,
            "means_payment_id": 10,
            "value_paid": "1190.00"
          }
        ],
        "customer": {
          "dni": "1234567890",
          "company_name": "CLIENTE DE PRUEBA",
          "email": "facturacion@ejemplo.com"
        },
        "lines": [
          {
            "invoiced_quantity": "1",
            "quantity_units_id": "70",
            "line_extension_amount": "1000.00",
            "free_of_charge_indicator": false,
            "description": "Servicio de consultoría",
            "code": "SRV-001",
            "price_amount": "1000.00",
            "base_quantity": "1",
            "tax_totals": [
              {
                "tax_id": "1",
                "tax_amount": 190.00,
                "taxable_amount": 1000.00,
                "percent": 19
              }
            ]
          }
        ],
        "legal_monetary_totals": {
          "line_extension_amount": "1000.00",
          "tax_exclusive_amount": "1000.00",
          "tax_inclusive_amount": "1190.00",
          "payable_amount": "1190.00"
        }
      }
    },
    {
      "kind": "invoice",
      "client_reference": "FACT-002",
      "payload": {
        "type_document_id": 7,
        "...": "resto del payload, igual que en el endpoint unitario"
      }
    }
  ]
}
```

**Tipos mixtos**

```json
{
  "mode": "auto-increment",
  "stop_on_error": true,
  "documents": [
    {
      "kind": "invoice",
      "client_reference": "FACT-100",
      "payload": {
        "type_document_id": 7,
        "resolution_number": "18764002566734",
        "prefix": "SETT",
        "customer": { "...": "payload completo de factura" },
        "lines": ["..."]
      }
    },
    {
      "kind": "credit_note",
      "client_reference": "NC-100",
      "payload": {
        "type_document_id": 5,
        "resolution_number": "18764002566735",
        "prefix": "NC",
        "billing_reference": {
          "number": "SETT990000001",
          "date": "2026-06-01",
          "uuid": "CUFE-de-la-factura-referenciada"
        },
        "customer": { "...": "payload completo de nota crédito" },
        "lines": ["..."]
      }
    },
    {
      "kind": "support_document",
      "client_reference": "DS-100",
      "payload": {
        "type_document_id": 11,
        "resolution_number": "18764002566999",
        "prefix": "SEDS",
        "customer": { "...": "payload completo de documento soporte" },
        "lines": ["..."]
      }
    }
  ]
}
```

#### Response `201 Created`

```json
{
  "message": "Lote aceptado para procesamiento asíncrono.",
  "batch_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "status": "PENDING",
  "status_url": "/api/ubl2.1/bulk/documents/f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "received": 2,
  "accepted": 2,
  "rejected": 0,
  "estimated_completion_seconds": 12,
  "items": [
    {
      "index": 0,
      "client_reference": "FACT-001",
      "item_id": "c1d2e3f4-a1b2-c3d4-e5f6-a7b8c9d0e1f2",
      "status": "QUEUED"
    },
    {
      "index": 1,
      "client_reference": "FACT-002",
      "item_id": "d4e5f6a7-b8c9-d0e1-f2a3-b4c5d6e7f8a9",
      "status": "QUEUED"
    }
  ],
  "success": true
}
```

| Campo | Descripción |
|-------|-------------|
| `batch_id` | UUID del lote. Úsalo para consultar su estado. |
| `status` | Estado del lote (`PENDING` al crearlo). En un replay idempotente, el estado actual del lote original. |
| `status_url` | Ruta relativa para consultar el lote. |
| `received` / `accepted` / `rejected` | Documentos recibidos y aceptados. El lote se acepta completo o se rechaza completo, así que `rejected` siempre es `0`. |
| `estimated_completion_seconds` | Estimación de segundos hasta que termine el lote, según la cola actual. `0` si el lote ya terminó (replay). |
| `items[]` | Un registro por documento con su `index` (posición en `documents[]`, desde 0), `client_reference`, `item_id` y `status`. |

---

### 2. Consultar Lote

```
GET /api/ubl2.1/bulk/documents/{batch_id}
```

Retorna el estado completo del lote con todos sus items, ordenados por `index`.

#### Parámetros de ruta

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `batch_id` | UUID | Identificador del lote (retornado en el POST) |

#### Response `200 OK`

```json
{
  "uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "company_id": 1,
  "user_id": 5,
  "mode": "auto-increment",
  "stop_on_error": false,
  "total_items": 2,
  "succeeded": 1,
  "failed": 1,
  "status": "PARTIAL",
  "idempotency_key": "550e8400-e29b-41d4-a716-446655440000",
  "finished_at": "2026-06-01T19:31:00.000000Z",
  "created_at": "2026-06-01T19:30:00.000000Z",
  "updated_at": "2026-06-01T19:31:00.000000Z",
  "batch_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "status_description": "Completado parcialmente",
  "received": 2,
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
      "created_at": "2026-06-01T19:30:00.000000Z",
      "updated_at": "2026-06-01T19:30:05.000000Z",
      "processed_at": "2026-06-01T19:30:05.000000Z",
      "response": "{\"uuid\":\"3e7a9c51-8b2d-4f6e-a1c4-9d0b2e5f7a38\",\"document_number\":\"SETT990000001\",\"XmlDocumentKey\":\"cf9864294501e8a9578235dd2ab3c4fd\",\"cufe\":\"cf9864294501e8a9578235dd2ab3c4fd\",\"track_id\":null,\"is_valid\":true,\"status_code\":200,\"dian_status_code\":\"00\",\"dian_status\":\"ACCEPTED\",\"errors\":[],\"notifications\":[],\"warnings\":[],\"http_status\":200}",
      "item_id": "c1d2e3f4-a1b2-c3d4-e5f6-a7b8c9d0e1f2",
      "kind_description": "Factura electrónica",
      "status_description": "Exitoso",
      "document_number": "SETT990000001",
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
    },
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
      "created_at": "2026-06-01T19:30:00.000000Z",
      "updated_at": "2026-06-01T19:30:08.000000Z",
      "processed_at": "2026-06-01T19:30:08.000000Z",
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
  "success": true
}
```

Ver [Campos de cada item](https://docs.matias-api.com/docs/bulk-documents#campos-item) para el significado de cada campo según el estado.

:::note Lote inexistente
Si el `batch_id` no existe, ya se purgó o pertenece a otra empresa, la API responde `404` con un único campo `message` (sin `success`). Sin el header `Accept: application/json` la respuesta puede ser una página HTML.
:::

---

### 3. Listar Items del Lote

```
GET /api/ubl2.1/bulk/documents/{batch_id}/items
```

Lista los items de un lote, ordenados por `index`, con filtros opcionales y paginación estándar (`current_page`, `data`, `per_page`, `total`, `links`…). Cada elemento de `data` tiene los mismos campos que `items[]` en [Consultar Lote](https://docs.matias-api.com/docs/bulk-documents#get-batch-status).

#### Query Parameters

| Parámetro | Tipo | Default | Descripción |
|-----------|------|:-------:|-------------|
| `status` | string | — | Filtrar: `QUEUED`, `PROCESSING`, `SUCCESS`, `FAILED`, `REJECTED_BY_DIAN`, `POSSIBLY_SENT`, `CANCELLED` |
| `kind` | string | — | Filtrar: `invoice`, `credit_note`, `debit_note`, `support_document`, `adjustment_note`, `pos_document` |
| `per_page` | integer | `50` | Items por página (de 1 a 200) |
| `page` | integer | `1` | Número de página |

#### Response `200 OK`

```json
{
  "current_page": 1,
  "data": [
    {
      "uuid": "e5f6a7b8-c9d0-e1f2-a3b4-c5d6e7f8a9b0",
      "index": 2,
      "kind": "invoice",
      "client_reference": "FACT-003",
      "document_uuid": "8a7b6c5d-4e3f-4a2b-9c1d-0e9f8a7b6c5d",
      "shipping_history_id": 4200029,
      "status": "POSSIBLY_SENT",
      "attempts": 1,
      "error_code": "DOCUMENT_POSSIBLY_SENT",
      "error_message": "La respuesta no trae un resultado DIAN reconocible. Consulte el estado del envío antes de reenviar.",
      "created_at": "2026-06-01T19:30:00.000000Z",
      "updated_at": "2026-06-01T19:30:40.000000Z",
      "processed_at": "2026-06-01T19:30:40.000000Z",
      "response": "{\"uuid\":\"8a7b6c5d-4e3f-4a2b-9c1d-0e9f8a7b6c5d\",\"document_number\":\"SETT990000003\",\"XmlDocumentKey\":null,\"cufe\":null,\"track_id\":null,\"is_valid\":null,\"status_code\":200,\"dian_status_code\":null,\"dian_status\":\"POSSIBLY_SENT\",\"errors\":[],\"notifications\":[],\"warnings\":[],\"http_status\":200}",
      "item_id": "e5f6a7b8-c9d0-e1f2-a3b4-c5d6e7f8a9b0",
      "kind_description": "Factura electrónica",
      "status_description": "Sin respuesta definitiva de la DIAN",
      "document_number": "SETT990000003",
      "cufe": null,
      "track_id": null,
      "dian_response": {
        "is_valid": null,
        "status_code": null,
        "status": "POSSIBLY_SENT",
        "errors": [],
        "notifications": []
      },
      "warnings": [],
      "error": {
        "code": "DOCUMENT_POSSIBLY_SENT",
        "message": "El documento pudo llegar a la DIAN sin respuesta definitiva. Consulte su estado con el document_uuid antes de cualquier acción; no lo reenvíe."
      },
      "next_action": "CHECK_STATUS"
    }
  ],
  "first_page_url": "https://sandbox-api.matias-api.com/api/ubl2.1/bulk/documents/f47ac10b-58cc-4372-a567-0e02b2c3d479/items?page=1",
  "from": 1,
  "last_page": 1,
  "last_page_url": "https://sandbox-api.matias-api.com/api/ubl2.1/bulk/documents/f47ac10b-58cc-4372-a567-0e02b2c3d479/items?page=1",
  "links": [
    { "url": null, "label": "&laquo; Previous", "active": false },
    { "url": "https://sandbox-api.matias-api.com/api/ubl2.1/bulk/documents/f47ac10b-58cc-4372-a567-0e02b2c3d479/items?page=1", "label": "1", "active": true },
    { "url": null, "label": "Next &raquo;", "active": false }
  ],
  "next_page_url": null,
  "path": "https://sandbox-api.matias-api.com/api/ubl2.1/bulk/documents/f47ac10b-58cc-4372-a567-0e02b2c3d479/items",
  "per_page": 50,
  "prev_page_url": null,
  "to": 1,
  "total": 1
}
```

---

### 4. Listar Lotes

```
GET /api/ubl2.1/bulk/documents
```

Lista los lotes de la compañía, ordenados del más reciente al más antiguo, con paginación estándar. Cada elemento de `data` trae los datos del lote **sin** `batch_id`, `status_description` ni `items` (el identificador del lote es `uuid`).

#### Query Parameters

| Parámetro | Tipo | Default | Descripción |
|-----------|------|:-------:|-------------|
| `status` | string | — | Filtrar: `PENDING`, `PROCESSING`, `COMPLETED`, `PARTIAL`, `FAILED` |
| `per_page` | integer | `15` | Lotes por página (de 1 a 100) |
| `page` | integer | `1` | Número de página |

#### Response `200 OK`

```json
{
  "current_page": 1,
  "data": [
    {
      "uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "company_id": 1,
      "user_id": 5,
      "mode": "auto-increment",
      "stop_on_error": false,
      "total_items": 10,
      "succeeded": 10,
      "failed": 0,
      "status": "COMPLETED",
      "idempotency_key": null,
      "finished_at": "2026-06-01T19:31:00.000000Z",
      "created_at": "2026-06-01T19:30:00.000000Z",
      "updated_at": "2026-06-01T19:31:00.000000Z"
    },
    {
      "uuid": "44115613-e378-45e1-a6ea-b93f0319de2a",
      "company_id": 1,
      "user_id": 5,
      "mode": "manual",
      "stop_on_error": false,
      "total_items": 2,
      "succeeded": 0,
      "failed": 2,
      "status": "FAILED",
      "idempotency_key": null,
      "finished_at": "2026-06-01T21:04:45.000000Z",
      "created_at": "2026-06-01T21:03:38.000000Z",
      "updated_at": "2026-06-01T21:04:45.000000Z"
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
  "to": 2,
  "total": 2
}
```

---

## Campos de cada item

Campos presentes en todos los items:

| Campo | Descripción |
|-------|-------------|
| `uuid` / `item_id` | Identificador del item (mismo valor). |
| `index` | Posición del documento en `documents[]` (desde 0). |
| `kind` / `kind_description` | Tipo de documento y su descripción legible. |
| `client_reference` | Tu referencia interna. |
| `document_uuid` | **UUID del envío del documento: guárdalo.** Es el que usas para consultarlo (`GET /documents/{uuid}`) y, en general, no coincide con el `documents[].uuid` que enviaste. En un item que no llegó a emitirse es el `documents[].uuid` que enviaste, o `null`; en `DUPLICATE_DOCUMENT_UUID`, el del documento que ya existía. |
| `shipping_history_id` | Identificador numérico interno del envío. Para consultar el documento usa `document_uuid`. |
| `status` / `status_description` | Estado del item y su descripción legible. Ver [Estados del Item](https://docs.matias-api.com/docs/bulk-documents#estados-item). |
| `attempts` | Intentos registrados (1 normalmente; hasta 3 con fallos transitorios). |
| `error_code` / `error_message` | Código y mensaje del error (mensaje truncado a 500 caracteres). Ver [Catálogo de `error_code`](https://docs.matias-api.com/docs/bulk-documents#error-code). |
| `processed_at`, `created_at`, `updated_at` | Fechas en ISO 8601 (UTC). |
| `response` | **String** con un JSON de resumen del resultado, o `null` (ver abajo). |

Campos adicionales según el estado:

| Estado | Campos adicionales |
|--------|--------------------|
| `SUCCESS`, `REJECTED_BY_DIAN`, `POSSIBLY_SENT` | `document_number`, `cufe` (CUFE/CUDE), `track_id`, `dian_response` (`is_valid`, `status_code`, `status`, `errors`, `notifications`, o `null`) y `warnings`. |
| `FAILED`, `REJECTED_BY_DIAN` | `error`: `{ "code": …, "message": … }` con los mismos valores de `error_code` y `error_message`. |
| `POSSIBLY_SENT` | `error` con `code` (el `error_code`, o `POSSIBLY_SENT`) y un mensaje fijo que indica no reenviar, y `next_action: "CHECK_STATUS"`. |

### El campo `response`

`response` ya **no** trae el contenido crudo del documento (XML, AttachedDocument, QR o PDF en base64). Es un string JSON con este resumen:

| Clave | Descripción |
|-------|-------------|
| `uuid` | UUID del envío del documento (el mismo `document_uuid` del item). |
| `document_number` | Número del documento (prefijo + consecutivo). |
| `XmlDocumentKey` / `cufe` | CUFE/CUDE del documento. |
| `track_id` | Identificador de seguimiento de la DIAN (en habilitación, el ZipKey). |
| `is_valid` | `true` si la DIAN lo aceptó, `false` si lo rechazó, `null` si no hay resultado definitivo (también en habilitación, donde solo se confirma la recepción). |
| `status_code` / `http_status` | Código HTTP entero de la emisión (por ejemplo, `200`). |
| `dian_status_code` | StatusCode de la DIAN (por ejemplo, `"00"` o `"99"`). |
| `dian_status` | `ACCEPTED`, `RECEIVED`, `REJECTED` o `POSSIBLY_SENT`. |
| `errors` / `notifications` | Rechazos y notificaciones de la DIAN, por separado: un mensaje de la DIAN que contiene «Notificaci» va a `notifications`; los demás, a `errors`. En un `FAILED` por error HTTP, `errors` trae el mensaje del error. |
| `warnings` | Avisos del procesamiento (lista de `{ "code", "message" }`). |

Si el item termina `FAILED` por un error `4xx` de la emisión (salvo `408` y `429`), `response` **no** es `null`: trae el resumen con `errors: ["<mensaje del error>"]`, `status_code` y `http_status` iguales a ese código HTTP y `dian_status: null`.

```json
"{\"uuid\":null,\"document_number\":null,\"XmlDocumentKey\":null,\"cufe\":null,\"track_id\":null,\"is_valid\":null,\"status_code\":422,\"dian_status_code\":null,\"dian_status\":null,\"errors\":[\"Mensaje del error devuelto por la emisión.\"],\"notifications\":[],\"warnings\":[],\"http_status\":422}"
```

`response` es `null` si el item no se procesó, si el fallo ocurrió fuera de la emisión (por ejemplo, una resolución inexistente, `JOB_FAILED` o `STUCK`), si un error transitorio (`408`, `429`, `5xx`) agotó los 3 intentos, o si es un registro antiguo de gran tamaño. En esos casos el detalle está en `error_code` / `error_message`. El `payload` que enviaste nunca se devuelve. Para descargar XML o PDF usa los endpoints del documento con su `document_uuid` o CUFE ([Descarga de Archivos](https://docs.matias-api.com/docs/endpoints/queries-status#descarga-archivos)).

Códigos posibles en `warnings`:

| Código | Significado |
|--------|-------------|
| `RECONCILED` | El item se concilió con un envío ya existente de ese mismo documento (no se volvió a emitir). |
| `ATTACHMENTS_NOT_LINKED` | El documento se emitió pero los adjuntos no quedaron vinculados. |
| `PDF_NOT_GENERATED` | El documento se emitió pero no se generó el PDF. |
| `EMAIL_NOT_SENT` | El documento se emitió pero no se envió el correo. |
| `ATTACHED_DOCUMENT_NOT_GENERATED` | El documento se emitió pero no se generó el AttachedDocument. |
| `ALREADY_AUTHORIZED_RECOVERED` / `ALREADY_AUTHORIZED_OTHER_CONTENT` | La DIAN ya tenía autorizado ese número; el documento se recuperó o la DIAN tiene autorizado un contenido distinto. |

---

## Referencia de Estados

### Estados del Lote (`status`)

| Estado | Emoji | Descripción |
|--------|:-----:|-------------|
| `PENDING` | ⏳ | Aceptado; ningún item ha terminado todavía. |
| `PROCESSING` | ⚙️ | Al menos un item terminó y quedan items pendientes. |
| `COMPLETED` | ✅ | Todos los items terminaron en `SUCCESS`. |
| `PARTIAL` | ⚠️ | Todos terminaron; al menos uno `SUCCESS` y al menos uno `FAILED`, `REJECTED_BY_DIAN`, `POSSIBLY_SENT` o `CANCELLED`. |
| `FAILED` | ❌ | Todos terminaron y ninguno quedó en `SUCCESS`. |

- Un lote **nunca queda en `CANCELLED`**: con `stop_on_error` termina en `PARTIAL` o `FAILED`, y son sus items en cola los que quedan `CANCELLED`.
- Contadores: `succeeded` = items `SUCCESS`; `failed` = items `FAILED` + `REJECTED_BY_DIAN` + `POSSIBLY_SENT`. Los `CANCELLED` no suman en ninguno.
- Un lote `FAILED` o `PARTIAL` puede tener documentos que sí llegaron a la DIAN (`REJECTED_BY_DIAN`, `POSSIBLY_SENT`): revisa cada item.

### Estados del Item (`items[].status`)

| Estado | Emoji | Descripción |
|--------|:-----:|-------------|
| `QUEUED` | 📋 | En cola. También mientras espera un reintento (`attempts` mayor que 0, con el error del último intento). |
| `PROCESSING` | ⚙️ | Siendo procesado. |
| `SUCCESS` | ✅ | La DIAN lo aceptó (en habilitación: lo recibió). |
| `FAILED` | ❌ | Falló antes de transmitirse a la DIAN. |
| `REJECTED_BY_DIAN` | 🏛️❌ | Transmitido y rechazado por la DIAN. |
| `POSSIBLY_SENT` 🆕 | ❓ | La transmisión empezó y no hubo respuesta definitiva de la DIAN. **No lo reenvíes:** consulta su estado. |
| `CANCELLED` | 🚫 | Cancelado por `stop_on_error` antes de procesarse. |

:::warning `POSSIBLY_SENT`: consultar, nunca reenviar
El documento pudo quedar autorizado en la DIAN. Reenviarlo con otro número o con otro contenido puede generar un duplicado. Consulta su estado con el `document_uuid` (`GET /documents/{document_uuid}` o `GET /status`, ver [Consultas y Estados](https://docs.matias-api.com/docs/endpoints/queries-status#consulta-estados)) y decide según el resultado. `POSSIBLY_SENT` cuenta en `failed` del lote y del webhook y dispara `stop_on_error`.

- Si el item trae `cufe` (`XmlDocumentKey`), consulta el estado directamente en la DIAN con [`POST /status/document/{CUFE}`](https://docs.matias-api.com/docs/endpoints/queries-status#consulta-estados). Si ese número se está transmitiendo en otra solicitud, el endpoint responde `409` con `code` `DOCUMENT_IN_TRANSMISSION`: consulta de nuevo en unos instantes.
- Si `document_uuid` llega `null`, consulta con el UUID anti-duplicados del item (ver [Consultar el documento cuando `document_uuid` es `null`](https://docs.matias-api.com/docs/bulk-documents#document-uuid-null)).
:::

### Cómo se decide el resultado

El resultado lo decide **la respuesta de la DIAN, no el código HTTP**: un rechazo de la DIAN llega con HTTP 200.

| Respuesta | Estado del item | `dian_response.status` |
|-----------|-----------------|------------------------|
| `IsValid` = `true` y `StatusCode` = `00` | `SUCCESS` | `ACCEPTED` |
| Habilitación: sin `IsValid`, con ZipKey | `SUCCESS` | `RECEIVED` (solo recibido; la validación es asíncrona: consulta `POST /status/zip/{track_id}`) |
| `IsValid` presente y no válido | `REJECTED_BY_DIAN` | `REJECTED` (`error_code` = StatusCode DIAN) |
| Respuesta sin resultado DIAN reconocible, o error después de iniciar la transmisión | `POSSIBLY_SENT` | `POSSIBLY_SENT` |
| Error antes de transmitir | `FAILED` (o reintento si es transitorio) | — |

En habilitación la respuesta no trae el número ni el UUID del envío: el item `SUCCESS` llega con `document_number` en `null` y su `document_uuid` es el `documents[].uuid` que enviaste (o `null` si no lo enviaste). Aun así el documento se puede ubicar con su UUID anti-duplicados (ver abajo).

#### Consultar el documento cuando `document_uuid` es `null`

Todo item se emite con un [UUID anti-duplicados](https://docs.matias-api.com/docs/bulk-documents#uuid-anti-duplicados), que se registra y se vincula al envío **antes** de transmitir. Por eso, aunque `document_uuid` llegue `null` (en habilitación, o en un `POSSIBLY_SENT` cuya respuesta no trajo el UUID), puedes consultar el documento con [`GET /documents/{uuid}`](https://docs.matias-api.com/docs/endpoints/queries-status#busqueda-listado) usando, en este orden:

1. El `documents[].uuid` que enviaste.
2. Si no lo enviaste, el `payload.uuid` (solo si es un UUID válido).
3. Si no enviaste ninguno, el `item_id` del item.

`GET /documents/{uuid}` acepta tanto el UUID del envío como el anti-duplicados:

| UUID consultado | `dataRecord` |
|-----------------|--------------|
| UUID del envío (`document_uuid`) | El envío del documento (con `is_valid` y `XmlDocumentKey`). |
| UUID anti-duplicados | El vínculo anti-duplicados; el envío viene en `dataRecord.shipping_history`. |
| Ninguno de los dos existe | `200` con `dataRecord: null`. |

Enviar siempre `documents[].uuid` simplifica esta búsqueda: es un valor que ya tienes en tu sistema.

### Catálogo de `error_code`

| Estado | `error_code` | Significado | Qué hacer |
|--------|--------------|-------------|-----------|
| `FAILED` | Código HTTP como string: `"400"`, `"404"`, `"409"`, `"422"`… | Error del documento o de los datos (por ejemplo, `"404"` cuando no hay resolución activa). | Corregir y reenviar. El UUID anti-duplicados queda libre. |
| `FAILED` | `"408"`, `"429"`, `"5xx"` | Error transitorio que persistió tras agotar los 3 intentos. | Reenviar. |
| `FAILED` | `DUPLICATE_DOCUMENT_UUID` | El UUID ya se usó en otro documento de la empresa; no se emitió de nuevo. | Consultar el documento al que apunta `document_uuid`. Si es otro documento, enviar el tuyo con un UUID nuevo. |
| `FAILED` | `JOB_FAILED` | El procesamiento del item no terminó y no hay envío del documento. | Reenviar sin riesgo: no existe el vínculo anti-duplicados, así que el documento no se transmitió. |
| `FAILED` | `STUCK` | El item quedó detenido sin transmisión y se cerró en la conciliación (ver [Items detenidos](https://docs.matias-api.com/docs/bulk-documents#items-detenidos)). | Reenviar sin riesgo, por la misma razón que `JOB_FAILED`. |
| `FAILED` | Otro identificador técnico (código o tipo de la excepción) | Error interno sin código HTTP asociado. | Reenviar; si se repite, reportarlo a soporte con el `item_id`. |
| `REJECTED_BY_DIAN` | StatusCode de la DIAN (por ejemplo, `"99"`) o `DIAN` | Rechazo de la DIAN. `DIAN` aparece cuando la respuesta no trae StatusCode o cuando el item se concilió con un envío rechazado. | Corregir según `dian_response.errors`. |
| `POSSIBLY_SENT` | `DOCUMENT_POSSIBLY_SENT` | La transmisión empezó y no hubo respuesta definitiva. | **No reenviar.** Consultar el estado. |
| `POSSIBLY_SENT` | `DOCUMENT_IN_TRANSMISSION` | Otro proceso estaba transmitiendo ese mismo número. | **No reenviar.** Consultar el estado. |
| `POSSIBLY_SENT` | `DOCUMENT_IN_VALIDATION` | La DIAN aún valida un envío anterior del mismo número (StatusCode 98). | **No reenviar.** Consultar el estado. |

:::note Cambio reciente
Los casos `DOCUMENT_IN_TRANSMISSION` y `DOCUMENT_IN_VALIDATION` (un `409` del pipeline unitario) antes terminaban `FAILED`. Ahora terminan `POSSIBLY_SENT`, porque ese número puede quedar autorizado en la DIAN.
:::

### Reintentos automáticos

- Solo se reintentan los resultados transitorios **`408`, `429` y `5xx`**: hasta **3 intentos**, con 30 segundos de espera entre intentos. Mientras espera, el item vuelve a `QUEUED` con `attempts` mayor que 0 y el `error_code` / `error_message` del último intento.
- Los demás errores `4xx` no se reintentan: el item queda `FAILED` de inmediato.
- Un documento cuya transmisión ya empezó nunca se reemite. Si la API no pudo confirmar en la DIAN el estado de un envío anterior (`503`), en el siguiente intento el item se concilia con ese envío: normalmente termina `POSSIBLY_SENT` (`DOCUMENT_POSSIBLY_SENT`, warning `RECONCILED`); termina `SUCCESS` si el envío ya quedó válido, o `REJECTED_BY_DIAN` (`error_code` `DIAN`) si consta como rechazado.

### Items detenidos y conciliación automática

Si el procesamiento de un item muere (por ejemplo, se detiene el proceso que lo atendía), la API lo resuelve sola. La revisión corre **cada 10 minutos**:

- Un item que lleva **más de 30 minutos** en `PROCESSING` sin cambios se concilia con lo que conste de su envío. Termina `SUCCESS`, `REJECTED_BY_DIAN` (`error_code` `DIAN`) o `POSSIBLY_SENT`, con el warning `RECONCILED`, o `FAILED` con `STUCK` si nunca llegó a transmitirse.
- Un item que sigue en `QUEUED` **más de 6 horas** se vuelve a despachar. No se emite dos veces: el item se reclama de forma atómica.
- Nunca se reemite un documento que ya se transmitió.

En la práctica, cuando falla el procesamiento, un lote puede quedarse en `PROCESSING` **unos 40 minutos** antes de cerrarse. Si haces polling, no lo des por perdido antes de ese tiempo.

---

## Idempotencia

El endpoint `POST` soporta idempotencia mediante el header **`Idempotency-Key`** (un UUID v4, máximo 36 caracteres).

| Escenario | Resultado |
|-----------|-----------|
| Primera vez con `Idempotency-Key` | Se crea el lote normalmente (`201`). |
| Mismo key + mismo body | Se retorna el lote original con su estado actual, sin reprocesar (`201`; `estimated_completion_seconds` es `0` si ya terminó). |
| Mismo key + body distinto | Error `409 Conflict`. |
| Key de más de 36 caracteres | Error `422`. |
| Sin header | Cada request crea un lote nuevo. |

- La comparación se hace sobre el **body exacto** (huella SHA-256 de los bytes recibidos): cualquier cambio, incluso de espacios u orden de claves, cuenta como body distinto. Reenvía exactamente los mismos bytes.
- Ante un `429` o un error de red, reintenta con el **mismo** `Idempotency-Key` y el mismo body: si el lote ya se había creado, recibes el original en lugar de un duplicado.

:::warning Vigencia
El `Idempotency-Key` tiene una validez de **24 horas** desde la creación del lote. Después de ese período, la key se libera y el mismo valor crea un lote nuevo.
:::

---

## Modos de Envío

### `auto-increment`

El sistema asigna automáticamente el número de documento a partir de la resolución.

- La resolución se busca por `resolution_number` + `prefix` (del `payload`, o de `default_resolution_number` / `default_prefix` del lote) y debe estar **activa**. Verifica además que esté vigente: en bulk no se valida su rango de fechas.
- Si no existe una resolución activa con esos datos, el item termina `FAILED` con `error_code` `"404"` y el mensaje `No se encontró una resolución de facturación activa (resolution_number: …, prefix: …).`.
- Un `document_number` enviado en el `payload` **se sobrescribe** con el consecutivo asignado.
- **Consecutivos en fallos:**
  - Si el item falla **antes de transmitirse**, la reserva de su número se libera. El siguiente número se calcula como el mayor reservado + 1, así que el número liberado solo se reutiliza si seguía siendo el último de la resolución; si ya se reservaron números posteriores, queda un hueco en la numeración.
  - Si la transmisión ya empezó (`REJECTED_BY_DIAN`, `POSSIBLY_SENT`), el número queda asociado a ese documento.

### `manual`

Cada documento debe traer su propio `document_number` en el `payload`. El sistema **no** asigna consecutivos.

---

## `stop_on_error`

| Valor | Comportamiento |
|:-----:|----------------|
| `false` | Todos los documentos se procesan independientemente. Los fallos no afectan a los demás. |
| `true` | El primer documento que termine en un estado distinto de `SUCCESS` (`FAILED`, `REJECTED_BY_DIAN` o `POSSIBLY_SENT`) cancela los items que siguen en cola (`CANCELLED`). Los items que ya se estaban procesando terminan normalmente. El lote termina en `PARTIAL` o `FAILED`. |

---

## Códigos de Error HTTP

| HTTP | Causa | Descripción |
|:----:|-------|-------------|
| `201` | ✅ Éxito | Lote aceptado (también en un replay idempotente). |
| `402` | Membresía o cuota | Membresía sin cupo o inactiva, o cuota insuficiente para el lote completo. |
| `404` | Lote no encontrado | En las consultas: el lote no existe, ya se purgó o pertenece a otra empresa. |
| `409` | Conflicto idempotencia | `Idempotency-Key` reutilizado con un body distinto. |
| `413` | Lote muy grande | El número de documentos excede el máximo de tu plan. Se valida antes que el esquema. |
| `422` | Validación | El request no cumple el esquema, el `Idempotency-Key` supera 36 caracteres, o `documents` llega vacío. |
| `429` | Límite de frecuencia o de carga | Lotes por minuto excedidos, demasiados documentos en proceso u otro lote de la empresa en admisión. |

### Orden de los controles en `POST /bulk/documents`

La API aplica los controles en este orden y responde con el primero que falla:

1. `429`: lotes por minuto (por usuario y por empresa). El intento **se cuenta aunque la petición falle después**.
2. `402`: membresía sin cupo o inactiva.
3. `422` `Compañía o lote inválido.` si `documents` está vacío o no es un array; luego `413` por el tope del plan y `402` por cuota insuficiente (con `requested`).
4. `422`: esquema del request.
5. `422`: `Idempotency-Key` de más de 36 caracteres.
6. `429`: otro lote de la empresa en admisión (la API espera hasta 5 segundos antes de responder).
7. Replay idempotente: `201` con el lote original, o `409` si el body difiere.
8. `429`: demasiados documentos en proceso.
9. `402`: cuota revalidada (solo `message`).

:::warning Un reintento idempotente también pasa por los controles
Reintentar con el mismo `Idempotency-Key` consume cupo de lotes por minuto y pasa por membresía, tope del plan, cuota y esquema **antes** de devolver el lote original. Por ejemplo, si la cuota se agotó entretanto, recibes `402` aunque el lote ya exista. Además, la cuota disponible descuenta los documentos aún pendientes de lotes en curso, incluido el propio lote original: mientras ese lote se procesa, el replay puede recibir `402` si lo que queda de cuota no alcanza para volver a cubrir el lote completo. Guarda el `batch_id` del primer `201` para no depender del replay.
:::

**Error 413**

```json
{
  "success": false,
  "message": "El lote excede el máximo permitido para tu suscripción.",
  "max_items": 50,
  "received": 75,
  "upgrade_url": "https://sandbox-api.matias-api.com/upgrade"
}
```

Topes por plan: FREE 5, Pago 50, Ilimitado 200.

**Error 402**

La API responde `402` en tres formas:

```json
{
  "success": false,
  "message": "Límite de documentos de la membresía alcanzado o membresía inactiva."
}
```

```json
{
  "success": false,
  "message": "Cuota insuficiente para procesar el lote completo.",
  "requested": 25
}
```

Al revalidar la cuota justo antes de crear el lote (descontando los documentos pendientes de lotes anteriores), la respuesta trae solo `message`:

```json
{
  "message": "Cuota insuficiente para procesar el lote completo."
}
```

**Error 422**

Errores de esquema, con el formato estándar de validación (`message` con el primer error y `errors` por campo; sin `success`):

```json
{
  "message": "El campo mode es obligatorio (auto-increment o manual). (and 1 more error)",
  "errors": {
    "mode": ["El campo mode es obligatorio (auto-increment o manual)."],
    "documents.0.kind": [
      "Tipo de documento no válido. Tipos permitidos: invoice, credit_note, debit_note, support_document, adjustment_note, pos_document"
    ]
  }
}
```

Otros mensajes de esquema:

| Regla | Mensaje |
|-------|---------|
| `mode` con un valor distinto de `auto-increment` o `manual` | `El campo mode debe ser auto-increment o manual.` (el de «obligatorio» solo sale cuando falta) |
| `payload` que no es un objeto JSON | `El payload de cada documento debe ser un objeto JSON.` |
| `uuid` no válido / repetido en el lote | `El UUID del documento debe ser un UUID v4 válido.` / `El UUID del documento está repetido dentro del lote.` |
| Más de 4 adjuntos | `Cada documento admite máximo 4 adjuntos.` |
| Adjunto sin `filename` / sin `content` | `Cada adjunto debe incluir filename.` / `Cada adjunto debe incluir content (base64).` |
| `client_reference` de más de 64 caracteres | `La referencia del cliente no puede exceder 64 caracteres.` |
| Más de 200 documentos | `El lote no puede contener más de 200 documentos.` (solo cuando el tope del plan no lo frena antes con `413`) |
| `content_type` de más de 100, `filename` de más de 255, `default_resolution_number` de más de 50, `default_prefix` de más de 10, o `stop_on_error` no booleano | Mensaje estándar de validación (longitud máxima o tipo). |

`Idempotency-Key` de más de 36 caracteres (solo `message`):

```json
{
  "message": "Idempotency-Key no puede superar 36 caracteres (use un UUID v4)."
}
```

`documents` vacío o ausente (se valida antes que el esquema):

```json
{
  "success": false,
  "message": "Compañía o lote inválido."
}
```

Según el entorno, un `documents` vacío también puede llegar como error de esquema (`Debe incluir al menos un documento en el lote.`).

**Error 409**

```json
{
  "message": "Idempotency-Key reutilizado con payload distinto."
}
```

**Error 429**

**Lotes por minuto.** En el plan FREE la respuesta **no trae `Retry-After`** ni `X-RateLimit-Reset`: espera **60 segundos** (la ventana es de 1 minuto). Los `X-RateLimit-Limit` / `X-RateLimit-Remaining` que acompañen este `429` corresponden al límite general de la API, no al de lotes por minuto.

```json
{
  "success": false,
  "message": "Plan FREE: máximo 1 lote bulk por minuto. Actualice su plan.",
  "upgrade_url": "https://sandbox-api.matias-api.com/upgrade"
}
```

En los planes de pago e ilimitado, la respuesta estándar de límite de frecuencia, con los headers `Retry-After`, `X-RateLimit-Limit`, `X-RateLimit-Remaining` y `X-RateLimit-Reset`. Las respuestas correctas también traen `X-RateLimit-Limit` y `X-RateLimit-Remaining`, útiles para dosificar los envíos.

```json
{
  "message": "Too Many Attempts."
}
```

**Demasiados documentos en proceso.** `Retry-After` estima en segundos cuánto tarda la cola en drenar los documentos que sobran (excedente × ~6 s ÷ procesos que atienden la cola, mínimo 1).

```json
{
  "message": "La empresa ya tiene 980 documentos en proceso y el máximo simultáneo es 1000. Reintente más tarde."
}
```

**Otro lote de la misma empresa en admisión.** La API espera hasta 5 segundos a que termine la admisión del otro lote y, si no termina, responde con `Retry-After: 5`.

```json
{
  "message": "Hay otro lote de esta empresa en admisión. Reintente en unos segundos."
}
```

Espera los segundos de `Retry-After` (60 en el plan FREE) y reintenta con el mismo `Idempotency-Key`.

---

## Webhook

Cuando un lote finaliza (todos sus items en estado terminal), se dispara **una sola vez** el evento **`bulk.batch.completed`**. Llega con el sobre estándar de los webhooks:

```json
{
  "id": "evt_aB3dE5fG7hJ9kL1mN3pQ5rS7",
  "type": "bulk.batch.completed",
  "created_at": "2026-06-01T19:31:01+00:00",
  "api_version": "3.0",
  "data": {
    "object": "document_batch",
    "batch_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "status": "PARTIAL",
    "total_items": 10,
    "succeeded": 9,
    "failed": 1,
    "finished_at": "2026-06-01T19:31:00+00:00"
  }
}
```

- La clave del evento es `type` (no `event`).
- `failed` incluye los items `REJECTED_BY_DIAN` y `POSSIBLY_SENT`.
- No trae datos de los documentos: consulta el lote (`GET /bulk/documents/{batch_id}`) para el detalle de cada item.
- Para recibirlo, suscribe un webhook al evento `bulk.batch.completed`. Es un evento válido aunque `GET /webhooks/events` no lo liste.
- Se firma y se reintenta igual que el resto de eventos: ver [Seguridad HMAC](https://docs.matias-api.com/docs/endpoints/webhooks#seguridad-hmac) y [Reintentos automáticos](https://docs.matias-api.com/docs/endpoints/webhooks#reintentos).

---

## Guía Rápida de Integración

### Paso 1: Enviar el lote

```bash
curl -X POST "{{url}}/bulk/documents?client_uuid={{client_uuid}}" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000" \
  -d '{
    "mode": "auto-increment",
    "default_resolution_number": "18764002566734",
    "default_prefix": "SETT",
    "documents": [
      {
        "kind": "invoice",
        "uuid": "6f1c2b9e-3d4a-4e8b-9c71-2a5d8e0f4b13",
        "client_reference": "MI-REF-001",
        "payload": { "type_document_id": 7, "...": "payload completo de factura" }
      },
      {
        "kind": "invoice",
        "uuid": "0d9e8f7a-6b5c-4d3e-8f2a-1b0c9d8e7f6a",
        "client_reference": "MI-REF-002",
        "payload": { "type_document_id": 7, "...": "payload completo de factura" }
      }
    ]
  }'
```

> **Respuesta:** `201 Created` con `batch_id`. Omite `?client_uuid=` si emites para tu propia empresa.

### Paso 2: Polling del estado

Espera unos segundos (el `estimated_completion_seconds` te da una estimación) y luego consulta:

```bash
curl -X GET "{{url}}/bulk/documents/{batch_id}?client_uuid={{client_uuid}}" \
  -H "Authorization: Bearer {token}" \
  -H "Accept: application/json"
```

> Repite hasta que `status` sea `COMPLETED`, `PARTIAL` o `FAILED`, o suscríbete al [webhook](https://docs.matias-api.com/docs/bulk-documents#webhook) `bulk.batch.completed`.

### Paso 3: Guardar los `document_uuid`

Guarda el `document_uuid` de **cada item que lo tenga**, no solo de los `SUCCESS`: los `REJECTED_BY_DIAN` y `POSSIBLY_SENT` también corresponden a documentos que llegaron a la DIAN. Este UUID es la referencia permanente del documento.

```javascript
// Ejemplo: extraer UUIDs del response
const batch = await response.json();
const documents = batch.items
  .filter(item => item.document_uuid)
  .map(item => ({
    document_uuid: item.document_uuid,       // ← GUARDAR en su BD
    client_reference: item.client_reference, // ← Su referencia interna
    status: item.status,
    document_number: item.document_number ?? null,
    cufe: item.cufe ?? null
  }));

// Persistir en su sistema para consultas futuras
await saveToDatabase(documents);

// Documentos sin respuesta definitiva: consultar su estado, nunca reenviar
const toCheck = batch.items.filter(item => item.next_action === 'CHECK_STATUS');
```

### Paso 4: Revisar los que no terminaron en `SUCCESS`

```bash
curl -X GET "{{url}}/bulk/documents/{batch_id}/items?status=FAILED&client_uuid={{client_uuid}}" \
  -H "Authorization: Bearer {token}" \
  -H "Accept: application/json"
```

Repite con `status=REJECTED_BY_DIAN` y `status=POSSIBLY_SENT`:

- **`FAILED`:** corrige el documento según `error_code` / `error_message` y reenvíalo en un lote nuevo. Si no llegó a transmitirse, puedes usar el mismo `uuid`.
- **`REJECTED_BY_DIAN`:** revisa `dian_response.errors` y corrige el documento.
- **`POSSIBLY_SENT`:** consulta el estado con el `document_uuid` antes de cualquier acción; **no lo reenvíes**.

---

## Retención de Datos

El lote es solo un mecanismo de carga masiva: cada documento se emite y se conserva individualmente, igual que en el endpoint unitario. Por eso los datos del lote se limpian pronto.

| Qué | Cuándo | Efecto |
|-----|:------:|--------|
| `payload` de items `SUCCESS` | **1 día** después de procesado | Se vacía. El resumen del item (`document_uuid`, `document_number`, `cufe`, `dian_response`, `error`…) se conserva. |
| `payload` de items `FAILED`, `REJECTED_BY_DIAN` y `CANCELLED` | **2 días** después de procesado | Se vacía. El resumen del item se conserva. |
| Items `POSSIBLY_SENT` | — | No se limpian antes de la purga del lote. |
| Lote completo (lote + items) | **7 días** desde la creación del lote | Se elimina, solo si el lote terminó (`COMPLETED`, `PARTIAL` o `FAILED`). |

- El `payload` nunca se expone por la API; su limpieza no cambia lo que ves en las consultas.
- Hasta la purga del lote, sus items siguen disponibles en `GET /bulk/documents/{batch_id}` y en `/items`. Después, el endpoint responde `404`: consulta los documentos por su `document_uuid`, o por número y prefijo con [Búsqueda y Listado](https://docs.matias-api.com/docs/endpoints/queries-status#busqueda-listado).

---

## Notas Técnicas

:::info Para desarrolladores
- Cada documento se procesa de forma independiente, con hasta **3 intentos** (30 segundos entre intentos) solo para fallos transitorios (`408`, `429`, `5xx`).
- `estimated_completion_seconds` se calcula con la cola actual, a razón de **~6 segundos por documento** (varía según la latencia con la DIAN).
- El webhook `bulk.batch.completed` se dispara una sola vez, cuando **todos** los items alcanzaron un estado terminal.
- El lote completo se elimina a los **7 días** de su creación: guarda los `document_uuid` antes.
- Si el procesamiento de un item muere, la API lo concilia sola en unos 40 minutos y nunca reemite un documento ya transmitido. Ver [Items detenidos y conciliación automática](https://docs.matias-api.com/docs/bulk-documents#items-detenidos).
:::

:::danger Límite de tamaño
Mantén el body del request por debajo de **5 MB**. Ese límite lo aplica el servidor web, no la validación de la API: un body mayor puede rechazarse sin el formato JSON de esta página. Para lotes grandes, divide en múltiples requests.
:::

---

## Cambios y compatibilidad 🆕

Si ya consumías el envío masivo, revisa estos cambios de la versión actual.

### Cambios incompatibles

| Cambio | Antes | Ahora | Qué debes hacer |
|--------|-------|-------|-----------------|
| `items[].response` | JSON con la clave `raw` (XML, AttachedDocument, QR y PDF en base64). | String JSON con el resumen: `uuid`, `document_number`, `XmlDocumentKey`/`cufe`, `track_id`, `is_valid`, `status_code`, `dian_status_code`, `dian_status`, `errors`, `notifications`, `warnings`, `http_status`. La clave `raw` ya no existe: los registros antiguos se normalizan al resumen y `raw` nunca se vuelve a exponer. | No leas `response.raw`. Descarga XML y PDF con el `document_uuid` ([Descarga de Archivos](https://docs.matias-api.com/docs/endpoints/queries-status#descarga-archivos)). Ver [El campo `response`](https://docs.matias-api.com/docs/bulk-documents#campo-response). |
| `response.status_code` y `response.dian_response` | `status_code` era el código HTTP de la emisión; el detalle de la DIAN venía en `response.dian_response` y en `raw`. | `status_code` sigue siendo el **código HTTP** entero (igual a `http_status`). `response` ya no trae `dian_response`: el StatusCode de la DIAN va en `dian_status_code` y, a nivel de item, en `dian_response.status_code`. | No busques el código de la DIAN en `status_code`: usa `dian_status_code` o `items[].dian_response`. |
| `SUCCESS` frente a `REJECTED_BY_DIAN` | Lo decidía el código HTTP. | Lo decide la respuesta de la DIAN (`IsValid` = `true` y `StatusCode` = `00`). En habilitación, `SUCCESS` significa recibido (ZipKey). | Usa `dian_response` para el detalle. En habilitación, consulta el resultado con el `track_id`. Ver [Cómo se decide el resultado](https://docs.matias-api.com/docs/bulk-documents#decision-resultado). |
| Estado `POSSIBLY_SENT` | No existía. | Estado nuevo: cuenta en `failed`, dispara `stop_on_error` y el documento pudo llegar a la DIAN. | **No lo reenvíes:** consulta su estado. Ver [Estados del Item](https://docs.matias-api.com/docs/bulk-documents#estados-item). |
| `documents[].uuid` | Opcional, sin efecto anti-duplicados. | UUID anti-duplicados: debe ser un UUID válido y distinto dentro del lote. Si ya se usó en otro documento, el item termina `FAILED` con `DUPLICATE_DOCUMENT_UUID`. | No reutilices el UUID de otro documento. Ver [UUID anti-duplicados](https://docs.matias-api.com/docs/bulk-documents#uuid-anti-duplicados). |
| `items[].document_uuid` | UUID del envío solo en los `SUCCESS`; en los demás, el `documents[].uuid` que enviaste (o `null`). | El UUID del **envío** en todo item que tenga envío (también `REJECTED_BY_DIAN` y `POSSIBLY_SENT`); en `DUPLICATE_DOCUMENT_UUID`, el del documento existente; si no hay envío, el `documents[].uuid` enviado o `null`. | Guarda el `document_uuid` que devuelve la API. Ver [Campos de cada item](https://docs.matias-api.com/docs/bulk-documents#campos-item). |
| Nuevos `429` con `Retry-After` | Solo el de lotes por minuto. | Además, demasiados documentos en proceso y otro lote de la empresa en admisión. El límite de lotes por minuto se comparte por empresa. | Respeta `Retry-After` y reintenta con el mismo `Idempotency-Key`. |
| Nuevos `422` | — | Tope técnico de 200 documentos, UUID repetido en el lote, reglas de adjuntos e `Idempotency-Key` de más de 36 caracteres. | Ajusta el armado del lote. Ver [Códigos de Error HTTP](https://docs.matias-api.com/docs/bulk-documents#errores). |
| `error_code` | Códigos sin catálogo. | Catálogo documentado: código HTTP como string, `DUPLICATE_DOCUMENT_UUID`, `JOB_FAILED`, `STUCK`, códigos de la DIAN, los de `POSSIBLY_SENT` y, para errores internos, un identificador técnico. | Actualiza tu mapeo de errores. Ver [Catálogo de `error_code`](https://docs.matias-api.com/docs/bulk-documents#error-code). |

### Cambios compatibles

- Ahora documentado: el `413` incluye `upgrade_url`.
- Los items exponen `item_id`, `kind_description`, `status_description`, `document_number`, `cufe`, `track_id`, `dian_response`, `warnings`, `error` y `next_action`.
- El resumen de `response` se conserva hasta la purga del lote.
- `per_page` se limita a 200 en items y a 100 en lotes.
