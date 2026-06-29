---
sidebar_position: 14
sidebar_label: Software DIAN
---

# 💻 Software DIAN

> ✅ **Autenticación REQUERIDA**
> Incluir en todos los endpoints de esta sección el header: `Authorization: Bearer {token}`

## Listar software DIAN

### Listar software DIAN - 🔵 GET
```http
GET {{url}}/software
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

## Crear software DIAN

### Crear software DIAN - 🟘 POST
```http
POST {{url}}/software
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
  "records": "string",
  "companyId": 1,
  "identification": "96ab0f7c-2ab0-4de4-8c30-1268e6c8c6c3",
  "pin": "12345",
  "url": "https://vpfe-hab.dian.gov.co/WcfDianCustomerServices.svc",
  "environment_id": 2,
  "type_id": 1,
  "integration_type": 1,
  "testsetid": "string",
  "technical_key": "fc8eac422eba16e22ffd8c6f94b3f40a6e38162c",
  "account_id": "string",
  "auth_token": "string",
  "initial_number": 1
}
```

**Respuesta Exitosa (HTTP 201):**
```json
{
  "success": true,
  "message": "Software registrado exitosamente",
  "data": {
    "id": 1,
    "identification": "string",
    "pin": "string",
    "environment_id": 0
  }
}
```

---

## Obtener software de producción

### Obtener software de producción - 🔵 GET
```http
GET {{url}}/software/process/{id}
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

## Obtener software de pruebas

### Obtener software de pruebas - 🔵 GET
```http
GET {{url}}/software/test/{id}
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

## Actualizar software DIAN

### Actualizar software DIAN - 🟠 PUT
```http
PUT {{url}}/software/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `id` | path | Sí | ID del software a actualizar |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Body (JSON):**
```json
{
  "records": "string",
  "identification": "string",
  "pin": "string",
  "url": "string",
  "environment_id": 0,
  "type_id": 0,
  "integration_type": 0,
  "testsetid": "string",
  "technical_key": "string",
  "account_id": "string",
  "auth_token": "string",
  "initial_number": 0
}
```

**Respuesta Exitosa (HTTP 200):**
```json
{
  "success": true,
  "message": "Software actualizado correctamente",
  "data": {}
}
```

---

## Eliminar software DIAN

### Eliminar software DIAN - 🔴 DELETE
```http
DELETE {{url}}/software/{id}
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

