---
sidebar_position: 11
sidebar_label: Empresa
---

# 🏢 Empresa

> ✅ **Autenticación REQUERIDA**
> Incluir en todos los endpoints de esta sección el header: `Authorization: Bearer {token}`

## Obtener configuración de la empresa

### Obtener configuración de la empresa - 🔵 GET
```http
GET {{url}}/company/settings
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Respuesta Exitosa (HTTP 200):**
```json
{
  "settings": {}
}
```

---

## Actualizar configuración de la empresa

### Actualizar configuración de la empresa - 🟠 PUT
```http
PUT {{url}}/company/settings
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
  "setting_key": "invoice_prefix",
  "setting_value": "FV"
}
```

**Respuesta Exitosa (HTTP 200):**
```json
{}
```

---

## Eliminar un cliente

### Eliminar un cliente - 🔴 DELETE
```http
DELETE {{url}}/company/customer/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `id` | path | Sí |  |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Respuesta Exitosa (HTTP 200):**
```json
{}
```

---

## Habilitar un cliente

### Habilitar un cliente - 🟘 POST
```http
POST {{url}}/company/customer/{id}/enable
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `id` | path | Sí |  |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Respuesta Exitosa (HTTP 200):**
```json
{}
```

---

## Listar clientes de la empresa

### Listar clientes de la empresa - 🔵 GET
```http
GET {{url}}/company/customers
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Respuesta Exitosa (HTTP 200):**
```json
{
  "data": [
    {}
  ]
}
```

---

## Obtener información de la empresa

### Obtener información de la empresa - 🔵 GET
```http
GET {{url}}/company
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Respuesta Exitosa (HTTP 200):**
```json
{}
```

---

## Actualizar información de la empresa

### Actualizar información de la empresa - 🟠 PUT
```http
PUT {{url}}/company/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `id` | path | Sí |  |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Body (JSON):**
```json
{
  "name": "string",
  "nit": "string",
  "email": "string"
}
```

**Respuesta Exitosa (HTTP 200):**
```json
{}
```

---

## Obtener estadísticas de un cliente específico de la Casa de Software

### Obtener estadísticas de un cliente específico de la Casa de Software - 🔵 GET
```http
GET {{url}}/company/customers/{uuid}/stats
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `uuid` | path | Sí | UUID del cliente a consultar |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Respuesta Exitosa (HTTP 200):**
```json
{
  "customer": {},
  "stats": {},
  "subscription": {}
}
```

---

## Crear un nuevo cliente (sub-cuenta) para una empresa desarrolladora

### Crear un nuevo cliente (sub-cuenta) para una empresa desarrolladora - 🟘 POST
```http
POST {{url}}/company/{uuid}/customer
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `uuid` | path | Sí | UUID de la empresa padre (desarrolladora) |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Body (JSON):**
```json
{
  "first_name": "Juan",
  "last_name": "Pérez",
  "company_name": "Cliente SAS",
  "email": "cliente@empresa.com",
  "password": "string",
  "password_confirmation": "string",
  "dni": "900123456",
  "country_id": 45,
  "city_id": 149,
  "address": "Calle 123",
  "mobile": "+573001234567",
  "phone": "+5712345678"
}
```

**Respuesta Exitosa (HTTP 200):**
```json
{
  "message": "Cliente creado con éxito, ya puede iniciar sesión. No es necesario verificar el correo electrónico."
}
```

---

