---
sidebar_position: 18
sidebar_label: Payments - Wompi
---

# 💳 Payments - Wompi

> ✅ **Autenticación REQUERIDA**
> Incluir en todos los endpoints de esta sección el header: `Authorization: Bearer {token}`

## Obtener llave pública de Wompi

### Obtener llave pública de Wompi - 🔵 GET
```http
GET {{url}}/payments/public-key
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Retorna la llave pública y el entorno configurado para el widget de pagos de Wompi.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Respuesta Exitosa (HTTP 200):**
```json
{
  "public_key": "pub_test_xxx",
  "environment": "sandbox",
  "success": true
}
```

---

## Listar planes disponibles para mejora

### Listar planes disponibles para mejora - 🔵 GET
```http
GET {{url}}/payments/plans/available
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Retorna el plan actual de la empresa y los planes disponibles a los que puede realizar upgrade.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Respuesta Exitosa (HTTP 200):**
```json
{
  "current_plan": {
    "id": 1,
    "name": "Plan Básico",
    "price": 0
  },
  "available_upgrades": [
    {
      "id": 2,
      "name": "Plan Profesional",
      "price": 500000
    }
  ],
  "success": true
}
```

---

## Vista previa de cambio de plan

### Vista previa de cambio de plan - 🔵 GET
```http
GET {{url}}/payments/preview
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Calcula el prorrateo, descuentos y monto final para un cambio de plan. Permite previsualizar antes de confirmar el pago.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `plan_id` | query | Sí | ID del plan al que se desea cambiar |
| `coupon_code` | query | No | Código de cupón de descuento (opcional) |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Respuesta Exitosa (HTTP 200):**
```json
{
  "change_type": "upgrade",
  "current_plan": {
    "id": 1,
    "name": "Plan Básico",
    "annual_price": 500000
  },
  "new_plan": {
    "id": 2,
    "name": "Plan Profesional",
    "annual_price": 750000
  },
  "proration": {
    "days_remaining": 180,
    "total_days": 365,
    "unused_credit": 246575.34,
    "original_amount": 750000,
    "prorated_amount": 503424.66
  },
  "discount": {},
  "final_amount": 503424.66,
  "breakdown": [
    {
      "label": "Costo del plan anual",
      "amount": 750000
    }
  ],
  "success": true
}
```

---

## Validar cupón de descuento

### Validar cupón de descuento - 🟘 POST
```http
POST {{url}}/payments/coupons/validate
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Valida un código de cupón de descuento para un plan específico y retorna los detalles del descuento aplicable.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Body (JSON):**
```json
{
  "plan_id": 2,
  "coupon_code": "DESC20"
}
```

**Respuesta Exitosa (HTTP 200):**
```json
{
  "valid": true,
  "coupon_code": "DESC20",
  "discount_type": "percentage",
  "discount_value": 20,
  "applicable_to": "all",
  "description": "Descuento del 20%",
  "success": true
}
```

---

## Crear pago de upgrade de plan

### Crear pago de upgrade de plan - 🟘 POST
```http
POST {{url}}/payments/upgrade
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Prepara un checkout de Wompi para realizar el upgrade de plan. Retorna los datos necesarios para inicializar el widget de pago.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Body (JSON):**
```json
{
  "plan_id": 2,
  "customer_email": "cliente@ejemplo.com",
  "terms_accepted": true,
  "privacy_accepted": true,
  "coupon_code": "DESC20"
}
```

**Respuesta Exitosa (HTTP 200):**
```json
{
  "payment_id": 1,
  "amount": 750000,
  "currency": "COP",
  "plan_name": "Plan Profesional",
  "status": "PENDING",
  "legal_accepted": true,
  "widget_data": {
    "public_key": "pub_test_xxx",
    "currency": "COP",
    "amount_in_cents": 75000000,
    "reference": "APP1-UPGRADE_765_...",
    "signature": "sha256hash",
    "redirect_url": "https://app.example.com/payments/result",
    "expiration_time": "2026-06-11T16:33:00.000Z"
  },
  "success": true
}
```

---

## Listar pagos de la empresa

### Listar pagos de la empresa - 🔵 GET
```http
GET {{url}}/payments
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Retorna la lista paginada de pagos realizados por la empresa. Se puede filtrar por estado y tipo.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `status` | query | No | Filtrar por estado del pago (ej: APPROVED, PENDING, DECLINED) |
| `type` | query | No | Filtrar por tipo de pago |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Respuesta Exitosa (HTTP 200):**
```json
{
  "dataRecords": {
    "data": [
      {
        "id": 1,
        "status": "APPROVED",
        "status_label": "Aprobado",
        "amount": 750000,
        "currency": "COP",
        "payment_method": "NEQUI",
        "payment_reference": "APP1-UPGRADE_765_...",
        "plan_name": "Plan Profesional",
        "paid_at": "2026-06-11T10:00:00.000Z",
        "created_at": "2026-06-11T09:00:00.000Z",
        "can_retry": false,
        "is_recurring": false,
        "recurring_type": null
      }
    ]
  },
  "success": true
}
```

---

## Obtener estado de un pago

### Obtener estado de un pago - 🔵 GET
```http
GET {{url}}/payments/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Retorna el detalle y estado actual de un pago específico de la empresa.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `id` | path | Sí | ID del pago a consultar |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Respuesta Exitosa (HTTP 200):**
```json
{
  "payment_id": 1,
  "status": "APPROVED",
  "status_label": "Aprobado",
  "amount": 750000,
  "currency": "COP",
  "payment_method": "NEQUI",
  "plan_name": "Plan Profesional",
  "paid_at": "2026-06-11T10:00:00.000Z",
  "decline_reason": null,
  "can_retry": false,
  "is_recurring": false,
  "recurring_type": null,
  "legal_accepted": true,
  "success": true
}
```

---

## Eliminar un pago

### Eliminar un pago - 🔴 DELETE
```http
DELETE {{url}}/payments/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Elimina un registro de pago de la empresa. Solo se pueden eliminar pagos en ciertos estados.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `id` | path | Sí | ID del pago a eliminar |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Respuesta Exitosa (HTTP 200):**
```json
{
  "message": "Pago eliminado exitosamente",
  "success": true
}
```

---

## Reintentar un pago fallido

### Reintentar un pago fallido - 🟘 POST
```http
POST {{url}}/payments/{id}/retry
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Crea un nuevo intento de pago para un pago previamente fallido o rechazado. Retorna los datos del widget de Wompi para procesar el nuevo intento.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `id` | path | Sí | ID del pago original a reintentar |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Respuesta Exitosa (HTTP 200):**
```json
{
  "message": "Nuevo intento de pago preparado exitosamente",
  "payment_id": 2,
  "amount": 750000,
  "widget_data": {
    "public_key": "pub_test_xxx",
    "currency": "COP",
    "amount_in_cents": 75000000,
    "reference": "APP1-RETRY_766_...",
    "signature": "sha256hash",
    "redirect_url": "https://app.example.com/payments/result",
    "expiration_time": "2026-06-11T16:33:00.000Z"
  },
  "success": true
}
```

---

## Listar tarjetas guardadas

### Listar tarjetas guardadas - 🔵 GET
```http
GET {{url}}/payments/cards
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Retorna la lista de tarjetas (fuentes de pago) guardadas para la empresa en Wompi.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Respuesta Exitosa (HTTP 200):**
```json
{
  "data": [
    {
      "id": 335584,
      "type": "CARD",
      "status": "AVAILABLE",
      "last_four": "4242",
      "brand": "VISA",
      "bin": "424242",
      "created_at": "2026-06-11T10:00:00.000Z"
    }
  ],
  "success": true
}
```

---

## Guardar tarjeta de pago

### Guardar tarjeta de pago - 🟘 POST
```http
POST {{url}}/payments/cards
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Tokeniza y guarda una tarjeta de crédito/débito como fuente de pago recurrente en Wompi.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Body (JSON):**
```json
{
  "card_token": "tok_test_xxx",
  "customer_email": "cliente@ejemplo.com",
  "terms_accepted": true
}
```

**Respuesta Exitosa (HTTP 201):**
```json
{
  "message": "Tarjeta guardada exitosamente",
  "payment_source_id": 335584,
  "type": "CARD",
  "last_four": "4242",
  "brand": "VISA",
  "bin": "424242",
  "status": "AVAILABLE",
  "success": true
}
```

---

## Eliminar tarjeta guardada

### Eliminar tarjeta guardada - 🔴 DELETE
```http
DELETE {{url}}/payments/cards/{paymentSourceId}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Elimina una tarjeta (fuente de pago) previamente guardada de la empresa.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `paymentSourceId` | path | Sí | ID de la fuente de pago en Wompi a eliminar |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Respuesta Exitosa (HTTP 200):**
```json
{
  "message": "Tarjeta eliminada exitosamente",
  "success": true
}
```

---

## Cobrar con tarjeta guardada

### Cobrar con tarjeta guardada - 🟘 POST
```http
POST {{url}}/payments/cards/{paymentSourceId}/charge
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Procesa un cobro de upgrade de plan utilizando una tarjeta previamente guardada como fuente de pago recurrente.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `paymentSourceId` | path | Sí | ID de la fuente de pago (tarjeta) en Wompi |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Body (JSON):**
```json
{
  "plan_id": 2,
  "coupon_code": "DESC20"
}
```

**Respuesta Exitosa (HTTP 200):**
```json
{
  "payment_id": 1,
  "status": "APPROVED",
  "status_label": "Aprobado",
  "amount": 750000,
  "currency": "COP",
  "plan_name": "Plan Profesional",
  "is_recurring": true,
  "success": true
}
```

---

