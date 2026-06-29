---
sidebar_position: 15
sidebar_label: Company Templates
---

# 🎨 Company Templates

> ✅ **Autenticación REQUERIDA**
> Incluir en todos los endpoints de esta sección el header: `Authorization: Bearer {token}`

## Lista templates asignados a la empresa

### Lista templates asignados a la empresa - 🔵 GET
```http
GET {{url}}/company/templates
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** GET /api/company/templates
Lista templates asignados a la empresa

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Respuesta Exitosa (HTTP 200):**
```json
{
  "success": true,
  "dataRecords": {}
}
```

---

## Templates disponibles para asignar

### Templates disponibles para asignar - 🔵 GET
```http
GET {{url}}/company/templates/available
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** GET /api/company/templates/available
Lista templates del sistema disponibles para asignar

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Respuesta Exitosa (HTTP 200):**
```json
{
  "success": true,
  "dataRecords": {}
}
```

---

## Asigna template a empresa

### Asigna template a empresa - 🟘 POST
```http
POST {{url}}/company/templates/assign
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** POST /api/company/templates/assign
Asigna template del sistema a empresa

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Body (JSON):**
```json
{
  "template_uuid": "uuid-del-template",
  "is_default": true,
  "custom_config": {}
}
```

**Respuesta Exitosa (HTTP 201):**
```json
{
  "success": true,
  "message": "string"
}
```

---

## Actualiza configuración de asignación

### Actualiza configuración de asignación - 🟠 PUT
```http
PUT {{url}}/company/templates/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** PUT /api/company/templates/\{id\}
Actualiza configuración de asignación

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `id` | path | Sí |  |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Body (JSON):**
```json
{
  "is_default": true,
  "custom_config": {},
  "is_active": true
}
```

**Respuesta Exitosa (HTTP 200):**
```json
{}
```

---

## Desasigna template de empresa

### Desasigna template de empresa - 🔴 DELETE
```http
DELETE {{url}}/company/templates/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** DELETE /api/company/templates/\{id\}
Desasigna template de la empresa

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

## Personaliza template

### Personaliza template - 🟘 POST
```http
POST {{url}}/company/templates/{id}/customize
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** POST /api/company/templates/\{id\}/customize
Guarda contenido custom en disco

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `id` | path | Sí |  |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Body (JSON):**
```json
{
  "blade_content": "string",
  "css_content": "string"
}
```

**Respuesta Exitosa (HTTP 200):**
```json
{}
```

---

## Clona template para edición

### Clona template para edición - 🟘 POST
```http
POST {{url}}/company/templates/{id}/clone-for-edit
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** POST /api/company/templates/\{id\}/clone-for-edit
Clona template para edición

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `id` | path | Sí |  |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Respuesta Exitosa (HTTP 200):**
```json
{
  "blade_content": "string",
  "css_content": "string",
  "template_name": "string"
}
```

---

## Elimina personalización

### Elimina personalización - 🔴 DELETE
```http
DELETE {{url}}/company/templates/{id}/custom
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** DELETE /api/company/templates/\{id\}/custom
Elimina customización (vuelve a base)

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

## Vista previa del template

### Vista previa del template - 🔵 GET
```http
GET {{url}}/company/templates/{id}/preview
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** GET /api/company/templates/\{id\}/preview
Genera vista previa del template

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `id` | path | Sí |  |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Respuesta Exitosa (HTTP 200):**
```json
{
  "html": "string",
  "css_path": "string",
  "template_name": "string",
  "is_custom": true
}
```

---

