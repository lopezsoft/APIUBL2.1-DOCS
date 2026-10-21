---
sidebar_position: 19
sidebar_label: 📧 Registros de Email
description: "Registros de los correos enviados a los adquirentes: estado de entrega, rebotes, aperturas y avisos de correos no entregados."
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

Los tres endpoints devuelven solo los correos de la empresa del token (o la indicada con `client_uuid`).

<details>
<summary>📑 Campos de un registro de email</summary>

| Campo | Descripción |
|---|---|
| `id` | ID del registro de email. |
| `company_id`, `company_name` | Empresa emisora. |
| `customer_id`, `person_name` | Adquirente al que se envió el correo. |
| `document_id` | ID interno del documento electrónico. |
| `type_document_id`, `voucher_name` | Tipo de documento (ID y nombre). |
| `message_id` | Identificador del mensaje en el proveedor de correo. |
| `email` | Dirección de destino. |
| `status` | `sent`, `delivered`, `bounced` o `complained`. Otros valores se devuelven tal cual. |
| `status_translated` | `Enviado`, `Entregado`, `Rebotado` o `Reclamado`. |
| `opens`, `clicks` | Número de aperturas y de clics. |
| `last_opened_at`, `last_clicked_at` | Última apertura y último clic. |
| `delivered_at`, `bounced_at`, `complained_at` | Fecha de entrega, de rebote y de queja. |
| `bounce_type`, `bounce_subtype` | Tipo y subtipo de rebote, si lo hubo. |
| `created_at`, `updated_at` | Fecha de creación y de última actualización del registro. |

Las fechas sin sufijo vienen formateadas como `dd/mm/YYYY hh:mm:ss AM/PM`. Cada una tiene una variante `*_original` (por ejemplo `delivered_at_original`) con el valor sin formato (`YYYY-MM-DD HH:MM:SS`), útil para ordenar o comparar.

</details>

<details open>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/email-logs</b> — Listar Registros de Email</summary>

```http
GET {{url}}/email-logs?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

Lista paginada de 20 registros por página, sin un orden garantizado. Usa `?page=` para navegar.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `page` | query | No | Número de página (default: `1`). |
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

:::note
El tamaño de página es fijo (20). Un parámetro `limit` en este endpoint se ignora.
:::

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "dataRecords": {
    "current_page": 1,
    "data": [
      {
        "id": 104,
        "company_id": 120,
        "company_name": "EMPRESA DE EJEMPLO SAS",
        "customer_id": 55,
        "person_name": "CLIENTE DE EJEMPLO SAS",
        "document_id": 836,
        "type_document_id": 7,
        "voucher_name": "Factura electrónica de venta",
        "message_id": "0100018d-ejemplo-000000",
        "email": "cliente@ejemplo.com",
        "status": "delivered",
        "status_translated": "Entregado",
        "opens": 1,
        "last_opened_at": "20/08/2026 11:02:10 AM",
        "last_opened_at_original": "2026-08-20 11:02:10",
        "clicks": 0,
        "last_clicked_at": null,
        "last_clicked_at_original": null,
        "delivered_at": "20/08/2026 10:15:35 AM",
        "delivered_at_original": "2026-08-20 10:15:35",
        "bounced_at": null,
        "bounced_at_original": null,
        "complained_at": null,
        "complained_at_original": null,
        "bounce_type": null,
        "bounce_subtype": null,
        "created_at": "20/08/2026 10:15:30 AM",
        "created_at_original": "2026-08-20 10:15:30",
        "updated_at": "20/08/2026 11:02:10 AM",
        "updated_at_original": "2026-08-20 11:02:10"
      }
    ],
    "per_page": 20,
    "total": 1
  },
  "success": true
}
```

El paginador incluye además los campos estándar (`from`, `to`, `last_page`, `links`, `next_page_url`, etc.).

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

:::danger No disponible temporalmente
Hoy este endpoint responde HTTP 500 en todos los casos. Mientras se corrige, consulta los registros con `GET /email-logs` o con `GET /email-logs/document/{document_id}`.
:::

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/email-logs/document/&#123;document_id&#125;</b> — Buscar por ID de Documento</summary>

```http
GET {{url}}/email-logs/document/{document_id}?type_document_id={type_document_id}&client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

Devuelve los correos enviados para un documento, del más reciente al más antiguo.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `document_id` | path | ✅ Sí | ID interno del documento electrónico emitido (el `id` del documento, no su número). |
| `type_document_id` | query | ✅ Sí | ID del tipo de documento. Sin él, la consulta no devuelve los correos del documento. |
| `limit` | query | No | Registros por página (default: `15`). |
| `page` | query | No | Número de página (default: `1`). |
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
        "type_document_id": 7,
        "voucher_name": "Factura electrónica de venta",
        "email": "cliente@ejemplo.com",
        "status": "delivered",
        "status_translated": "Entregado",
        "opens": 1,
        "clicks": 0,
        "delivered_at": "20/08/2026 10:15:35 AM",
        "delivered_at_original": "2026-08-20 10:15:35",
        "created_at": "20/08/2026 10:15:30 AM",
        "created_at_original": "2026-08-20 10:15:30"
      }
    ],
    "per_page": 15,
    "total": 1
  },
  "success": true
}
```

El ejemplo está recortado: cada elemento trae todos los [campos de un registro de email](#consulta-logs).

</details>

</details>

---

## 🔔 Avisos de Correos No Entregados {#avisos-no-entregados}

Cuando un correo no se puede entregar, la plataforma avisa **solo a la cuenta maestra**, nunca al adquirente ni a la sub-cuenta:

- **Sub-cuenta** de una Casa de Software: los avisos llegan a la **Casa de Software**.
- **Casa de Software o cuenta directa:** recibe sus propios avisos.

Los avisos cubren el documento no enviado, el envío fallido, el destinatario suprimido, el rebote o la queja del destinatario y el evento de recepción rechazado por la DIAN.

**Destino:** la configuración `NOTIFICATIONEMAIL` de la cuenta maestra (ver `GET /company/settings`). Admite varias direcciones separadas por `;` o `,`. Si está vacía o no es válida, se usa el email de la empresa.

**Resumen diario:** los rebotes, las quejas y los envíos bloqueados no generan un aviso por cada incidente. Se consolidan en **un único correo diario a las 07:00 (hora de Colombia)** por cuenta maestra, agrupado por emisor, dirección y motivo, con un archivo CSV de detalle. El resumen diario no se envía desde el ambiente sandbox.

:::tip Cómo detectarlo en tu integración
No dependas del correo de aviso. Cuando el envío del correo falla al emitir un documento, la respuesta de la emisión trae el warning `EMAIL_NOT_SENT` (ver [Facturas y POS](./03-invoices-pos.md)). Para seguir la entrega después, consulta estos registros o suscríbete a los eventos `email.*` de [Webhooks](./10-webhooks.md).
:::
