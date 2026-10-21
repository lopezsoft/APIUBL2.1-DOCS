---
sidebar_position: 10
sidebar_label: 🪝 Webhooks
description: "Webhooks salientes: alta y gestión, catálogo de eventos, formato del evento, firma HMAC, reintentos e historial de entregas."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 🔔 Webhooks {#webhooks}

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

## 📋 Eventos Disponibles {#eventos-disponibles}

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/webhooks/events</b> — Listar Todos los Eventos</summary>

```http
GET {{url}}/webhooks/events
Authorization: Bearer {token}
```

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

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

</details>

</details>

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

## 🔧 Gestión de Webhooks {#gestion-webhooks}

<details open>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/webhooks</b> — Listar Webhooks</summary>

```http
GET {{url}}/webhooks?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

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

</details>

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/webhooks/&#123;webhook_id&#125;</b> — Detalle de un Webhook</summary>

```http
GET {{url}}/webhooks/{webhook_id}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `webhook_id` | path | ✅ Sí | ID del webhook. |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

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

</details>

<details>
<summary>❌ Webhook no encontrado (HTTP 404)</summary>

Un webhook inexistente o de otra empresa responde igual en todos los endpoints de esta sección:

```json
{
  "success": false,
  "message": "Webhook no encontrado."
}
```

</details>

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/webhooks</b> — Crear Webhook</summary>

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
| `events` | `array` | ✅ Sí | Eventos a los que te suscribes (mínimo 1), cada uno un `string` del [catálogo](#eventos-disponibles) |
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

<Tabs>
<TabItem value="curl" label="cURL">

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

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

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

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

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

</TabItem>
</Tabs>

<details>
<summary>✅ Respuesta Exitosa (HTTP 201)</summary>

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

</details>

</details>

<details>
<summary><span className="badge badge--warning margin-right--sm">PUT</span> <b>/webhooks/&#123;webhook_id&#125;</b> — Actualizar Webhook</summary>

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

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

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

</details>

</details>

<details>
<summary><span className="badge badge--danger margin-right--sm">DELETE</span> <b>/webhooks/&#123;webhook_id&#125;</b> — Eliminar Webhook</summary>

```http
DELETE {{url}}/webhooks/{webhook_id}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `webhook_id` | path | ✅ Sí | ID del webhook a eliminar. |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "success": true,
  "message": "Webhook eliminado exitosamente"
}
```

</details>

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/webhooks/&#123;webhook_id&#125;/test</b> — Probar Webhook</summary>

```http
POST {{url}}/webhooks/{webhook_id}/test?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Envía de inmediato un evento de prueba (`type: "webhook.test"`) a la URL del webhook y espera la respuesta de tu servidor. Funciona aunque el webhook esté inactivo. La entrega queda registrada en el historial y, si falla, entra en la política de [reintentos automáticos](#reintentos).

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

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

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

</details>

<details>
<summary>❌ Entrega fallida (HTTP 424)</summary>

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

</details>

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/webhooks/&#123;webhook_id&#125;/deliveries</b> — Historial de Entregas</summary>

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

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

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
| `payload` | Sobre completo que se envió (ver [Payload recibido](#payload-recibido)). |
| `signature` | Firma HMAC enviada en el último intento. |
| `status` | `pending` (esperando reintento), `retrying` (reintento en curso), `delivered` o `failed` (reintentos agotados). |
| `http_status` | Código HTTP que respondió tu servidor (`null` si no hubo respuesta). |
| `response_body` | Cuerpo de la respuesta de tu servidor, o el mensaje del error de conexión. |
| `retry_count` | Reintentos realizados (0 a 6). |
| `next_retry_at` | Fecha del próximo reintento automático, si lo hay. |

El paginador incluye además los campos estándar (`from`, `to`, `links`, `next_page_url`, `prev_page_url`, `path`, `last_page_url`).

</details>

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/webhooks/&#123;webhook_id&#125;/deliveries/&#123;delivery_id&#125;/retry</b> — 🆕 Reintentar una Entrega</summary>

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

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

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

</details>

<details>
<summary>❌ Reintento fallido (HTTP 424)</summary>

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

</details>

<details>
<summary>❌ No encontrado (HTTP 404)</summary>

```json
{
  "success": false,
  "message": "Entrega de webhook no encontrada."
}
```

Si el que no existe es el webhook, el mensaje es `Webhook no encontrado.`

</details>

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/webhooks/&#123;webhook_id&#125;/regenerate-secret</b> — Regenerar Secret HMAC</summary>

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

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

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

</details>

</details>

---

## 🔐 Seguridad HMAC {#seguridad-hmac}

### Payload Recibido {#payload-recibido}

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
| `type` | Tipo de evento (ver [catálogo](#eventos-disponibles)). |
| `created_at` | Fecha del evento en ISO-8601. |
| `api_version` | Versión del formato del sobre (`3.0`). |
| `data` | Datos del evento; su forma depende del prefijo de `type`. |

**Forma de `data` según el evento:**

<details>
<summary><code>document.&#42;</code> — Documentos electrónicos</summary>

Campos: `object` (`shipping_history`), `id`, `uuid`, `type_document` (`id`, `code`, `name`), `operation_type` (`id`, `code`, `name`), `document_number`, `order_number`, `resolution` (`prefix`, `resolution_number`), `company` (`name`, `dni`, `email`), `customer` (`name`, `dni`, `email`; `name` es `Unknown` si falta), `legal_monetary_totals`, `invoice_date`, `status`, `is_valid`, `cufe`, `xml_file_name`, `qr_url`, `paths` (`pdf`, `xml`, `zip`, `qr`), `created_at`, `updated_at`.

- `qr_url` es la URL de consulta en la DIAN del CUFE/CUDE vigente (`cufe`), nunca la de otro intento con el mismo número. Es `null` si el documento no tiene datos JSON.

**🆕 Cuándo se emite `document.accepted`:**

- Cuando la emisión queda validada por la DIAN.
- Cuando la API devuelve un documento que la DIAN ya había autorizado (advertencia `ALREADY_AUTHORIZED_RECOVERED`; ver [Regla 90](./03-invoices-pos.md#regla-90)).
- Puede llegar más tarde para un documento antiguo que se concilia con la DIAN.

**No se emite** cuando el documento queda validado después, con `POST /status/document/{trackId}` o con la revalidación automática. Si dependes de ese estado, consúltalo con esos endpoints.

Si el documento ya no existe al construir el evento:

```json
{ "object": "shipping_history", "id": 12345, "error": "Document not found" }
```

</details>

<details>
<summary><code>email.&#42;</code> — Correos</summary>

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

</details>

<details>
<summary><code>bulk.batch.completed</code> — Lotes masivos</summary>

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

</details>

<details>
<summary><code>quota.&#42;</code>, <code>token.&#42;</code> y <code>payment.&#42;</code> — Reservados</summary>

Estos eventos aún no se emiten. La forma de su `data` se documentará cuando se activen; mientras tanto, no dependas de ellos en tu integración.

</details>

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

### Verificar Firma HMAC {#verificar-firma}

La firma es `HMAC-SHA256(cuerpo, secret)` en hexadecimal, donde `cuerpo` son **exactamente los bytes** del `POST` que recibes. Para validarla:

1. Lee el cuerpo **crudo** de la petición. No lo parsees y vuelvas a serializar: `JSON.stringify` o `json_encode` no reproducen los mismos bytes (escapes de `/` y de caracteres Unicode, espacios) y la firma no coincidirá.
2. Calcula el HMAC-SHA256 en hexadecimal con tu `secret`.
3. Compáralo con `X-Webhook-Signature` en **tiempo constante**.

<Tabs>
<TabItem value="js" label="Node.js">

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

</TabItem>
<TabItem value="php" label="PHP">

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

</TabItem>
</Tabs>

:::warning Protección contra repetición
La firma no incluye `X-Webhook-Timestamp`. La protección contra repeticiones corre por tu cuenta: guarda el `id` del evento (`X-Webhook-Id`) y descarta los que ya procesaste.
:::

---

## 🔄 Reintentos Automáticos {#reintentos}

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
- Puedes reintentar una entrega en cualquier momento con [`POST /webhooks/{webhook_id}/deliveries/{delivery_id}/retry`](#gestion-webhooks), incluso si ya agotó los reintentos.

---

## 💡 Mejores Prácticas {#mejores-practicas}

| Práctica | Descripción |
|----------|-------------|
| ⚡ **Responde rápido** | Responde `2xx` en menos de 5 segundos (el límite real es de 30 segundos; pasado ese tiempo la entrega cuenta como fallida) |
| 🔄 **Procesa async** | Usa colas (Redis, SQS) para procesar el webhook después de responder |
| 🔐 **Verifica firma** | Siempre valida el HMAC sobre el cuerpo crudo antes de procesar cualquier evento |
| 🆔 **Idempotencia** | Guarda el `id` del sobre (igual a `X-Webhook-Id`); en un reintento llega el mismo `id` |
| 📊 **Monitorea** | Revisa el historial de entregas y reintenta las fallidas con el endpoint de reintento |
