---
sidebar_position: 20
sidebar_label: 📦 Envío Masivo (Bulk)
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 📦 Envío Masivo de Documentos (Bulk) {#bulk-documents}

:::warning Autenticación Requerida
Incluir en todos los endpoints de esta sección el header: `Authorization: Bearer {token}`
:::

:::danger ⚠️ Retención de datos de solo 2 días
Los registros temporales de los lotes masivos y su detalle de items se **eliminan automáticamente a los 2 días** de haber sido procesados. Asegúrate de consultar el lote y almacenar el `document_uuid` retornado para cada documento.
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
Idempotency-Key: 9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d
```

**Descripción:** Acepta un lote de documentos electrónicos para procesamiento en cola. Retorna `202 Accepted` inmediatamente con `batch_id` para consultar su progreso.

**Headers y Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `Idempotency-Key` | header | No | UUID v4 para idempotencia (evita procesar dos veces el mismo lote). Válido por 24h. |
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

**Body (JSON):**
```json
{
  "mode": "auto-increment",
  "stop_on_error": false,
  "default_resolution_number": "18764002566734",
  "default_prefix": "SETT",
  "documents": [
    {
      "type_document_id": 1,
      "customer": {
        "company_name": "Cliente A SAS",
        "dni": "900123456",
        "email": "facturacion@clientea.com"
      },
      "lines": [
        {
          "description": "Servicio de Consultoría",
          "invoiced_quantity": "1",
          "price_amount": "500000.00",
          "line_extension_amount": "500000.00"
        }
      ],
      "legal_monetary_totals": {
        "line_extension_amount": "500000.00",
        "tax_exclusive_amount": "500000.00",
        "tax_inclusive_amount": "595000.00",
        "payable_amount": "595000.00"
      }
    }
  ]
}
```

<details>
<summary>✅ Respuesta Exitosa (HTTP 202 Accepted)</summary>

```json
{
  "success": true,
  "message": "Lote encolado para procesamiento",
  "batch_id": "b8f4155a-7ca2-11f0-be83-d843ae899220",
  "total_documents": 1,
  "status": "pending",
  "created_at": "2026-08-20T14:30:00Z"
}
```

</details>

</details>

---

## 📊 Consulta de Estado del Lote {#consulta-estado}

<details open>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/bulk/documents/&#123;batchId&#125;</b> — Consultar Estado del Lote</summary>

```http
GET {{url}}/bulk/documents/{batchId}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `batchId` | path | ✅ Sí | UUID del lote obtenido al crearlo. |
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "batch_id": "b8f4155a-7ca2-11f0-be83-d843ae899220",
  "status": "completed",
  "total_documents": 1,
  "processed_documents": 1,
  "successful_documents": 1,
  "failed_documents": 0,
  "created_at": "2026-08-20T14:30:00Z",
  "finished_at": "2026-08-20T14:30:12Z"
}
```

</details>

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/bulk/documents/&#123;batchId&#125;/items</b> — Listar Items del Lote</summary>

```http
GET {{url}}/bulk/documents/{batchId}/items?page=1&per_page=20&status=success&client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `batchId` | path | ✅ Sí | UUID del lote. |
| `status` | query | No | Filtrar por estado (`success`, `failed`, `pending`). |
| `per_page` | query | No | Registros por página. |
| `page` | query | No | Número de página. |
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "batch_id": "b8f4155a-7ca2-11f0-be83-d843ae899220",
  "items": [
    {
      "index": 0,
      "status": "success",
      "document_uuid": "dde72910-eb42-11ef-9b27-f02f74cac485",
      "document_number": "SETT101",
      "cufe": "cf9864294501e8a9578235dd2ab3c4fd...",
      "dian_status": "00"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total": 1,
    "last_page": 1
  }
}
```

</details>

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/bulk/documents</b> — Listar Todos los Lotes</summary>

```http
GET {{url}}/bulk/documents?page=1&per_page=15&client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "data": [
    {
      "batch_id": "b8f4155a-7ca2-11f0-be83-d843ae899220",
      "status": "completed",
      "total_documents": 1,
      "created_at": "2026-08-20T14:30:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 1,
    "last_page": 1
  }
}
```

</details>

</details>
