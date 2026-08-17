---
sidebar_position: 10
sidebar_label: 🪝 Webhooks
---

# 🔔 Webhooks {#webhooks}

<div style={{backgroundColor: '#e7f3ff', padding: '1.5rem', borderRadius: '8px', border: '2px solid #0066cc', margin: '1.5rem 0'}}>
  <strong>🆕 Nuevo en v3.0.0 • ✅ Autenticación requerida</strong><br/>
  Recibe notificaciones HTTP en tiempo real cuando ocurren eventos importantes (documentos creados/emitidos, emails enviados, pagos procesados). 26 eventos disponibles.
</div>

:::info ¿Dónde obtener el `client_uuid`? — Parámetro Multi-Tenant para Casas de Software
Si operas como **Casa de Software** o **Cuenta Principal**, puedes listar, registrar y administrar los webhooks de cada una de tus empresas cliente agregando el parámetro `?client_uuid={{client_uuid}}` en la query string de la URL:
- **URL con Query Param:** `{{url}}/ubl2.1/webhooks?client_uuid={{client_uuid}}`
- **Header:** `Authorization: Bearer {token_cuenta_principal}`
- **Comportamiento:** La configuración del webhook (y sus disparadores de eventos) quedará vinculada específicamente a la empresa cliente indicada por su UUID.

**¿Dónde encontrar el `client_uuid` de tus clientes?**  
Puedes consultar el listado completo de tus empresas cliente y sus respectivos `client_uuid` mediante el endpoint:
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

### Eventos Disponibles - 🟢 GET

```http
{{url}}/ubl2.1/webhooks/events
```

**Respuesta exitosa (200):**

```json
{
  "dataRecords": {
    "data": {
      "documents": [
        { "value": "document.created", "label": "Documento Creado" },
        { "value": "document.emitted", "label": "Documento Emitido" },
        { "value": "document.accepted", "label": "Documento Aceptado" },
        { "value": "document.rejected", "label": "Documento Rechazado" },
        { "value": "document.voided", "label": "Documento Anulado" }
      ],
      "emails": [
        { "value": "email.sent", "label": "Email Enviado" },
        { "value": "email.delivered", "label": "Email Entregado" },
        { "value": "email.bounced", "label": "Email Rebotado" },
        { "value": "email.opened", "label": "Email Abierto" },
        { "value": "email.clicked", "label": "Link Clickeado" }
      ],
      "payments": [
        { "value": "payment.approved", "label": "Pago Aprobado" },
        { "value": "payment.declined", "label": "Pago Rechazado" },
        { "value": "payment.error", "label": "Error en Pago" }
      ],
      "memberships": [
        { "value": "membership.activated", "label": "Membresía Activada" },
        { "value": "membership.expiring_soon", "label": "Próxima a Vencer" },
        { "value": "membership.expired", "label": "Membresía Vencida" }
      ]
    }
  }
}
```

### Listar Webhooks - 🟢 GET

```http
{{url}}/ubl2.1/webhooks?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Respuesta exitosa (200):**

```json
{
  "dataRecords": {
    "data": [
      {
        "id": 1,
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

### Crear Webhook - 🔵 POST

```http
{{url}}/ubl2.1/webhooks?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Body (JSON):**

```json
{
  "url": "https://tu-servidor.com/webhook/matias",
  "events": ["document.created", "document.emitted", "email.sent"],
  "headers": {
    "Authorization": "Bearer tu-token-secreto",
    "X-Custom-Header": "valor-personalizado"
  },
  "is_active": true
}
```

| Campo       | Tipo    | Requerido | Descripción                                         |
| ----------- | ------- | --------- | --------------------------------------------------- |
| `url`       | string  | ✅        | URL HTTPS donde recibirás las notificaciones        |
| `events`    | array   | ✅        | Array de eventos a los que te suscribes (mínimo 1)  |
| `headers`   | object  | ❌        | Headers personalizados para incluir en cada request |
| `is_active` | boolean | ❌        | Si el webhook está activo (default: true)           |

**Respuesta exitosa (201):**

```json
{
  "success": true,
  "message": "Webhook creado exitosamente",
  "data": {
    "id": 1,
    "url": "https://tu-servidor.com/webhook/matias",
    "secret": "whsec_kJ8x3nQ9mP2vR5tY7wA1bC4dE6fG8hI0jK",
    "events": ["document.created", "document.emitted"],
    "is_active": true
  }
}
```

:::warning Importante - Secret
El `secret` se muestra **solo una vez**. Guárdalo para verificar la firma HMAC de los webhooks que recibas.
:::

### Actualizar Webhook - 🟡 PUT

```http
{{url}}/ubl2.1/webhooks/{webhook_id}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `webhook_id` | path | ✅ Sí | ID del webhook a actualizar. |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Body:**

```json
{
  "url": "https://nuevo-servidor.com/webhook",
  "events": ["document.created"],
  "is_active": true
}
```

### Eliminar Webhook - 🔴 DELETE

```http
{{url}}/ubl2.1/webhooks/{webhook_id}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `webhook_id` | path | ✅ Sí | ID del webhook a eliminar. |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

### Probar Webhook - 🔵 POST

```http
{{url}}/ubl2.1/webhooks/{webhook_id}/test?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `webhook_id` | path | ✅ Sí | ID del webhook a probar. |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

Envía un webhook de prueba para verificar tu configuración.

**Respuesta exitosa (200):**

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

### Formato del Payload Recibido

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

**Headers importantes:**

```
X-Webhook-Signature: sha256=abc123...
X-Webhook-ID: whe_1234567890
X-Event-Type: document.created
Content-Type: application/json
```

### Verificar Firma HMAC

Para garantizar que el webhook viene de Matias API:

```javascript
// Node.js
const crypto = require("crypto");

function verifyWebhook(payload, signature, secret) {
  const hash = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(payload))
    .digest("hex");

  return `sha256=${hash}` === signature;
}

// Uso
const signature = request.headers["x-webhook-signature"];
const isValid = verifyWebhook(request.body, signature, "whsec_tu_secret");

if (!isValid) {
  return response.status(401).json({ error: "Invalid signature" });
}
```

```php
// PHP
function verifyWebhook($payload, $signature, $secret) {
    $hash = hash_hmac('sha256', json_encode($payload), $secret);
    return "sha256={$hash}" === $signature;
}

// Uso
$signature = $_SERVER['HTTP_X_WEBHOOK_SIGNATURE'];
$payload = json_decode(file_get_contents('php://input'), true);

if (!verifyWebhook($payload, $signature, 'whsec_tu_secret')) {
    http_response_code(401);
    exit('Invalid signature');
}
```

### Reintentos Automáticos

Si tu servidor responde con error (status &gt; 299), reintentamos automáticamente con backoff exponencial:

| Intento | Espera     |
| ------- | ---------- |
| 1       | 1 minuto   |
| 2       | 5 minutos  |
| 3       | 15 minutos |
| 4       | 1 hora     |
| 5       | 6 horas    |
| 6       | 24 horas   |

Después de 6 intentos fallidos, el webhook se marca como fallido y debes reintentar manualmente.

### Mejores Prácticas

✅ **Responde rápido:** Tu endpoint debe responder 200 OK en &lt;5 segundos  
✅ **Procesa async:** Usa colas para procesar el webhook después de responder  
✅ **Verifica firma:** Siempre valida el HMAC antes de procesar  
✅ **Idempotencia:** Guarda el `id` del webhook para evitar procesamiento duplicado  
✅ **Monitorea:** Revisa el historial de entregas regularmente

---

### Historial de Entregas - 🔵 GET

```http
GET {{url}}/ubl2.1/webhooks/{webhook_id}/deliveries?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Retorna el historial paginado de entregas del webhook: intentos exitosos, fallidos y tiempos de respuesta.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `webhook_id` | path | ✅ Sí | ID del webhook. |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Respuesta exitosa (200):**
```json
{
  "dataRecords": {
    "current_page": 1,
    "data": [
      {
        "id": 2746,
        "webhook_id": 21,
        "event_type": "document.created",
        "payload": {},
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

---

### Regenerar Secret HMAC - 🟘 POST

```http
POST {{url}}/ubl2.1/webhooks/{webhook_id}/regenerate-secret?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Genera un nuevo secret para verificar la firma HMAC. El secret anterior queda **inmediatamente inválido**.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `webhook_id` | path | ✅ Sí | ID del webhook. |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

:::warning Importante
Actualiza tu sistema inmediatamente con el nuevo secret. Las entregas en tránsito con el secret anterior fallarán la validación HMAC.
:::

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "secret": "whsec_nuevo_secret_aqui"
  }
}
```


