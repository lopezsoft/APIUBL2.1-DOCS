---
sidebar_position: 16
sidebar_label: 🎨 Company Templates
---

# 🎨 Company Templates

> ✅ **Autenticación REQUERIDA**
> Incluir en todos los endpoints de esta sección el header: `Authorization: Bearer {token}`

:::info ¿Dónde obtener el `client_uuid`? — Parámetro Multi-Tenant para Casas de Software
Si operas como **Casa de Software** o **Cuenta Principal**, puedes listar, asignar y personalizar los templates de factura de tus empresas cliente agregando el parámetro `client_uuid` en la query string de la URL:
- **URL con Query Param:** `{{url}}/company/templates?client_uuid={{client_uuid}}`
- **Header:** `Authorization: Bearer {token_cuenta_principal}`
- **Comportamiento:** La gestión de plantillas se ejecutará en el contexto de la empresa cliente especificada por su UUID.

**¿Dónde encontrar el `client_uuid` de tus clientes?**  
Puedes consultar el listado completo de tus empresas cliente y sus respectivos `client_uuid` mediante el endpoint:
```http
GET {{url}}/company/customers
Authorization: Bearer {token}
Content-Type: application/json
```
:::

---

## Listar Templates Asignados a la Empresa

### Listar Templates Asignados a la Empresa - 🔵 GET
```http
GET {{url}}/company/templates?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Lista las plantillas gráficas asignadas y activas para la empresa.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). |

**Respuesta Exitosa (HTTP 200):**
```json
{
  "dataRecords": {
    "data": [
      {
        "id": 6,
        "name": "Template Moderno",
        "template_uuid": "30f00f0a-0e92-4dfa-897f-6b6ce9fbfb98",
        "is_default": true
      }
    ]
  }
}
```

---

## Listar Templates Disponibles para Asignar

### Listar Templates Disponibles para Asignar - 🔵 GET
```http
GET {{url}}/company/templates/available?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Lista el catálogo de templates del sistema disponibles para asignar a la empresa.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). |

**Respuesta Exitosa (HTTP 200):**
```json
{
  "dataRecords": {
    "data": [
      {
        "template_uuid": "30f00f0a-0e92-4dfa-897f-6b6ce9fbfb98",
        "name": "Factura Estándar 3 Columnas",
        "preview_url": "https://api.ejemplo.com/previews/standard.png"
      }
    ]
  }
}
```

---

## Asignar Template a la Empresa

### Asignar Template a la Empresa - 🟘 POST
```http
POST {{url}}/company/templates/assign?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Asigna una plantilla gráfica del catálogo a la empresa.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). |

**Body (JSON):**
```json
{
  "template_uuid": "30f00f0a-0e92-4dfa-897f-6b6ce9fbfb98"
}
```

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `template_uuid` | string | ✅ Sí | UUID único del template a asignar obtenido de `GET /company/templates/available`. |

**Respuesta Exitosa (HTTP 200 / 201):**
```json
{
  "success": true,
  "message": "Template asignado exitosamente a la empresa"
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
  "dataRecords": {
    "data": {
      "html": "<html>...</html>",
      "css_path": "css/templates/standard.css",
      "template_name": "Factura Estándar",
      "is_custom": true
    }
  }
}
```
