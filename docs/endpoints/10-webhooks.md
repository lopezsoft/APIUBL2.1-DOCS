---
sidebar_position: 10
sidebar_label: 🪝 Webhooks
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 🔔 Webhooks {#webhooks}

:::info 🆕 Nuevo en v3.0.0 · ✅ Autenticación requerida
Recibe notificaciones HTTP en tiempo real cuando ocurren eventos importantes (documentos creados/emitidos, emails enviados, pagos procesados). **26 eventos disponibles.**
:::

:::info ¿Dónde obtener el `client_uuid`? — Multi-Tenant para Casas de Software
Si operas como **Casa de Software** o **Cuenta Principal**, puedes listar, registrar y administrar los webhooks de cada una de tus empresas cliente agregando el parámetro `?client_uuid={{client_uuid}}` en la query string:
- **URL con Query Param:** `{{url}}/ubl2.1/webhooks?client_uuid={{client_uuid}}`
- **Header:** `Authorization: Bearer {token_cuenta_principal}`
- **Comportamiento:** La configuración del webhook quedará vinculada específicamente a la empresa cliente indicada por su UUID.

**¿Dónde encontrar el `client_uuid` de tus clientes?**
```http
GET {{url}}/company/customers
Authorization: Bearer {token}
Content-Type: application/json
```
:::

**Características principales:**

- 🔔 **26 tipos de eventos:** Documentos, emails, pagos, membresías
- 🔐 **Firma HMAC-SHA256:** Verificación de autenticidad
- 🔄 **Reintentos automáticos:** Hasta 6 intentos con backoff exponencial
- 🎨 **Headers personalizados:** Agrega tus propios headers
- 🧪 **Testing integrado:** Prueba webhooks antes de producción
- 📊 **Historial completo:** Rastreo de entregas exitosas y fallidas

---

## 📋 Eventos Disponibles {#eventos-disponibles}

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/ubl2.1/webhooks/events</b> — Listar Todos los Eventos</summary>

```http
GET {{url}}/ubl2.1/webhooks/events
Authorization: Bearer {token}
```

</details>

### Catálogo de Eventos

| Categoría | Evento | Descripción |
|-----------|--------|-------------|
| **📄 Documentos** | `document.created` | Documento Creado |
| | `document.emitted` | Documento Emitido |
| | `document.accepted` | Documento Aceptado por DIAN |
| | `document.rejected` | Documento Rechazado por DIAN |
| | `document.voided` | Documento Anulado |
| **📧 Emails** | `email.sent` | Email Enviado |
| | `email.delivered` | Email Entregado |
| | `email.bounced` | Email Rebotado |
| | `email.complaint` | Queja de Email |
| | `email.opened` | Email Abierto |
| | `email.clicked` | Link Clickeado |
| **💳 Pagos** | `payment.approved` | Pago Aprobado |
| | `payment.declined` | Pago Rechazado |
| | `payment.pending` | Pago Pendiente |
| | `payment.error` | Error en Pago |
| **🏷️ Membresías** | `membership.activated` | Membresía Activada |
| | `membership.limit_reached` | Límite Alcanzado |
| | `membership.expiring_soon` | Próxima a Vencer |
| | `membership.expired` | Membresía Vencida |

---

## 🔧 Gestión de Webhooks {#gestion-webhooks}

<details open>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/ubl2.1/webhooks</b> — Listar Webhooks</summary>

```http
GET {{url}}/ubl2.1/webhooks?client_uuid={{client_uuid}}
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
        "created_at": "2026-02-01T10:00:00Z",
        "stats": {
          "total_deliveries": 150,
          "successful": 145,
          "failed": 5
        }
      }
    ]
  }
}
```

</details>

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/ubl2.1/webhooks</b> — Crear Webhook</summary>

```http
POST {{url}}/ubl2.1/webhooks?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros del Body:**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `name` | `string` | ✅ Sí | Nombre descriptivo del webhook |
| `url` | `string` | ✅ Sí | URL HTTPS donde recibirás las notificaciones |
| `events` | `array` | ✅ Sí | Array de eventos a los que te suscribes (mínimo 1) |
| `headers` | `object` | No | Headers personalizados para incluir en cada request |
| `is_active` | `boolean` | No | Si el webhook está activo (default: `true`) |

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "{{url}}/ubl2.1/webhooks" \
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
const response = await axios.post(`${url}/ubl2.1/webhooks`, {
  name: 'Webhook Producción',
  url: 'https://tu-servidor.com/webhook/matias',
  events: ['document.created', 'document.emitted', 'email.sent'],
  headers: { 'X-Custom-Header': 'valor-personalizado' },
  is_active: true
}, {
  headers: { Authorization: `Bearer ${token}` }
});
// ⚠️ Guardar secret: response.data.data.secret (solo se muestra una vez)
const secret = response.data.data.secret;
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$response = $client->post("{$url}/ubl2.1/webhooks", [
    'headers' => ['Authorization' => "Bearer {$token}"],
    'json'    => [
        'name'      => 'Webhook Producción',
        'url'       => 'https://tu-servidor.com/webhook/matias',
        'events'    => ['document.created', 'document.emitted'],
        'is_active' => true,
    ],
]);
$secret = json_decode($response->getBody())->data->secret;
```

</TabItem>
</Tabs>

<details>
<summary>✅ Respuesta Exitosa (HTTP 201)</summary>

```json
{
  "success": true,
  "message": "Webhook creado exitosamente",
  "data": {
    "id": 1,
    "name": "Webhook Producción",
    "url": "https://tu-servidor.com/webhook/matias",
    "secret": "whsec_kJ8x3nQ9mP2vR5tY7wA1bC4dE6fG8hI0jK",
    "events": ["document.created", "document.emitted"],
    "is_active": true
  }
}
```

:::warning El `secret` solo se muestra una vez
Guárdalo inmediatamente para verificar la firma HMAC de los webhooks que recibas.
:::

</details>

</details>

<details>
<summary><span className="badge badge--warning margin-right--sm">PUT</span> <b>/ubl2.1/webhooks/&#123;webhook_id&#125;</b> — Actualizar Webhook</summary>

```http
PUT {{url}}/ubl2.1/webhooks/{webhook_id}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `webhook_id` | path | ✅ Sí | ID del webhook a actualizar. |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

**Body (mismo esquema que POST):**

```json
{
  "name": "Webhook Actualizado",
  "url": "https://nuevo-servidor.com/webhook",
  "events": ["document.created", "document.accepted"],
  "is_active": true
}
```

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "success": true,
  "message": "Webhook actualizado exitosamente",
  "data": {
    "id": 21,
    "name": "Webhook Actualizado",
    "url": "https://nuevo-servidor.com/webhook",
    "events": ["document.created", "document.accepted"],
    "is_active": true
  }
}
```

</details>

</details>

<details>
<summary><span className="badge badge--danger margin-right--sm">DELETE</span> <b>/ubl2.1/webhooks/&#123;webhook_id&#125;</b> — Eliminar Webhook</summary>

```http
DELETE {{url}}/ubl2.1/webhooks/{webhook_id}?client_uuid={{client_uuid}}
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
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/ubl2.1/webhooks/&#123;webhook_id&#125;/test</b> — Probar Webhook</summary>

```http
POST {{url}}/ubl2.1/webhooks/{webhook_id}/test?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Envía un webhook de prueba para verificar tu configuración.

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `webhook_id` | path | ✅ Sí | ID del webhook a probar. |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "success": true,
  "message": "Webhook enviado exitosamente",
  "data": {
    "status_code": 200,
    "response_time_ms": 245,
    "delivered_at": "2026-02-06T16:45:00Z"
  }
}
```

</details>

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/ubl2.1/webhooks/&#123;webhook_id&#125;/deliveries</b> — Historial de Entregas</summary>

```http
GET {{url}}/ubl2.1/webhooks/{webhook_id}/deliveries?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Retorna el historial paginado de entregas del webhook: intentos exitosos, fallidos y tiempos de respuesta.

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
    "current_page": 1,
    "data": [
      {
        "id": 2746,
        "webhook_id": 21,
        "event_type": "document.created",
        "status_code": 200,
        "response_time_ms": 245,
        "attempts": 1,
        "delivered_at": "2026-02-06T16:45:00Z"
      }
    ],
    "total": 1
  }
}
```

</details>

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/ubl2.1/webhooks/&#123;webhook_id&#125;/regenerate-secret</b> — Regenerar Secret HMAC</summary>

```http
POST {{url}}/ubl2.1/webhooks/{webhook_id}/regenerate-secret?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Genera un nuevo secret para verificar la firma HMAC. El secret anterior queda **inmediatamente inválido**.

:::warning Acción crítica
Actualiza tu sistema inmediatamente con el nuevo secret. Las entregas en tránsito con el secret anterior fallarán la validación HMAC.
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
  "success": true,
  "data": {
    "secret": "whsec_nuevo_secret_aqui"
  }
}
```

</details>

</details>

---

## 🔐 Seguridad HMAC {#seguridad-hmac}

### Payload Recibido

Cuando ocurre un evento, recibirás un POST en tu URL con este formato:

```json
{
  "id": "whe_1234567890",
  "event": "document.created",
  "created_at": "2026-02-06T16:45:00Z",
  "data": {
    "document_id": 12345,
    "track_id": "CUDE123456789",
    "document_type": "invoice",
    "customer_name": "Cliente SA",
    "total": 1000000,
    "status": "pending"
  }
}
```

**Headers que recibes:**

```
X-Webhook-Signature: sha256=abc123...
X-Webhook-ID:        whe_1234567890
X-Event-Type:        document.created
Content-Type:        application/json
```

### Verificar Firma HMAC {#verificar-firma}

Para garantizar que el webhook viene de Matias API, valida la firma `X-Webhook-Signature` con tu `secret`:

<Tabs>
<TabItem value="js" label="Node.js">

```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');

  return `sha256=${hash}` === signature;
}

// En tu handler:
const signature = request.headers['x-webhook-signature'];
const isValid = verifyWebhook(request.body, signature, 'whsec_tu_secret');

if (!isValid) {
  return response.status(401).json({ error: 'Invalid signature' });
}
// ✅ Procesar el evento
```

</TabItem>
<TabItem value="php" label="PHP">

```php
function verifyWebhook($payload, $signature, $secret) {
    $hash = hash_hmac('sha256', json_encode($payload), $secret);
    return "sha256={$hash}" === $signature;
}

// En tu handler:
$signature = $_SERVER['HTTP_X_WEBHOOK_SIGNATURE'];
$payload   = json_decode(file_get_contents('php://input'), true);

if (!verifyWebhook($payload, $signature, 'whsec_tu_secret')) {
    http_response_code(401);
    exit('Invalid signature');
}
// ✅ Procesar el evento
```

</TabItem>
</Tabs>

---

## 🔄 Reintentos Automáticos {#reintentos}

:::tip Política de reintentos con backoff exponencial
Si tu servidor responde con un error (`status > 299`), reintentamos automáticamente:
:::

| Intento | Espera |
|---------|--------|
| 1 | 1 minuto |
| 2 | 5 minutos |
| 3 | 15 minutos |
| 4 | 1 hora |
| 5 | 6 horas |
| 6 | 24 horas |

Después de 6 intentos fallidos, el webhook se marca como fallido y debes reintentar manualmente desde el historial de entregas.

---

## 💡 Mejores Prácticas {#mejores-practicas}

| Práctica | Descripción |
|----------|-------------|
| ⚡ **Responde rápido** | Tu endpoint debe responder `200 OK` en menos de 5 segundos |
| 🔄 **Procesa async** | Usa colas (Redis, SQS) para procesar el webhook después de responder |
| 🔐 **Verifica firma** | Siempre valida el HMAC antes de procesar cualquier evento |
| 🆔 **Idempotencia** | Guarda el `id` del webhook para evitar procesamiento duplicado |
| 📊 **Monitorea** | Revisa el historial de entregas regularmente en el panel |
