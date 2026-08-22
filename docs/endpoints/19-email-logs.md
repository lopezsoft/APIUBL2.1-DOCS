---
sidebar_position: 19
sidebar_label: 📧 Registros de Email
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 📧 Registros de Email {#registros-email}

:::warning Autenticación Requerida
Incluir en todos los endpoints de esta sección el header: `Authorization: Bearer {token}`
:::

:::info Parámetro Multi-Tenant: `client_uuid`
Si operas como **Casa de Software**, puedes auditar y consultar los registros de correos de tus empresas cliente agregando `?client_uuid={{client_uuid}}`.
```http
GET {{url}}/company/customers
Authorization: Bearer {token}
```
:::

Permite auditar el estado de entrega, rebotes y aperturas de los correos electrónicos enviados a los adquirentes con las representaciones gráficas (PDF) y archivos XML adjuntos.

---

## 📋 Consulta de Logs de Envío {#consulta-logs}

<details open>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/email-logs</b> — Listar Registros de Email</summary>

```http
GET {{url}}/email-logs?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "dataRecords": {
    "current_page": 1,
    "data": [
      {
        "id": 104,
        "document_id": 836,
        "recipient_email": "cliente@correo.com",
        "subject": "Factura Electrónica FVL-836",
        "status": "delivered",
        "sent_at": "2026-08-20T10:15:30Z",
        "delivered_at": "2026-08-20T10:15:35Z",
        "opened_at": "2026-08-20T11:02:10Z"
      }
    ],
    "total": 1
  },
  "success": true
}
```

</details>

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/email-logs/&#123;id&#125;</b> — Obtener Registro por ID</summary>

```http
GET {{url}}/email-logs/{id}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `id` | path | ✅ Sí | ID numérico del registro de email. |
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "dataRecords": {
    "data": {
      "id": 104,
      "document_id": 836,
      "recipient_email": "cliente@correo.com",
      "subject": "Factura Electrónica FVL-836",
      "status": "delivered",
      "smtp_response": "250 2.0.0 OK Message accepted for delivery",
      "sent_at": "2026-08-20T10:15:30Z",
      "delivered_at": "2026-08-20T10:15:35Z"
    }
  },
  "success": true
}
```

</details>

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/email-logs/document/&#123;document_id&#125;</b> — Buscar por ID de Documento</summary>

```http
GET {{url}}/email-logs/document/{document_id}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `document_id` | path | ✅ Sí | ID interno del documento electrónico emitido. |
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "dataRecords": {
    "data": [
      {
        "id": 104,
        "document_id": 836,
        "recipient_email": "cliente@correo.com",
        "subject": "Factura Electrónica FVL-836",
        "status": "delivered",
        "sent_at": "2026-08-20T10:15:30Z"
      }
    ]
  },
  "success": true
}
```

</details>

</details>
