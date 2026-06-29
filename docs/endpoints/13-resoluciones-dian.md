---
sidebar_position: 13
sidebar_label: Resoluciones DIAN
---

# 📄 Resoluciones DIAN

> ✅ **Autenticación REQUERIDA**
> Incluir en todos los endpoints de esta sección el header: `Authorization: Bearer {token}`

## Listar resoluciones DIAN

### Listar resoluciones DIAN - 🔵 GET
```http
GET {{url}}/resolutions
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

## Crear resolución DIAN

### Crear resolución DIAN - 🟘 POST
```http
POST {{url}}/resolutions
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
  "type_document_id": 1,
  "resolution_number": "18760000001",
  "prefix": "FV",
  "invoice_name": "FACTURA DE VENTA",
  "range_from": 1,
  "range_up": 5000,
  "date_from": "2024-01-01",
  "date_up": "2026-12-31",
  "initial_number": 1,
  "technical_key": "fc8eac422eba16e22ffd8c6f94b3f40a6e38162c",
  "headerline1": "FACTURA DE VENTA",
  "headerline2": "Resolución DIAN 18760000001",
  "footline1": "Gracias por su compra",
  "footline2": "string",
  "footline3": "string",
  "footline4": "string",
  "active": 1
}
```

**Respuesta Exitosa (HTTP 201):**
```json
{
  "success": true,
  "message": "Registro guardado exitosamente",
  "data": {
    "id": 1,
    "resolution_number": "18760000001",
    "prefix": "FV"
  }
}
```

---

## Actualizar resolución DIAN

### Actualizar resolución DIAN - 🟠 PUT
```http
PUT {{url}}/resolutions/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `id` | path | Sí | ID de la resolución a actualizar |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Body (JSON):**
```json
{
  "type_document_id": 1,
  "resolution_number": "18760000001",
  "prefix": "FV",
  "invoice_name": "FACTURA DE VENTA",
  "range_from": 1,
  "range_up": 5000,
  "date_from": "2024-01-01",
  "date_up": "2026-12-31",
  "initial_number": 1,
  "technical_key": "fc8eac422eba16e22ffd8c6f94b3f40a6e38162c",
  "headerline1": "FACTURA DE VENTA",
  "headerline2": "Resolución DIAN 18760000001",
  "footline1": "Gracias por su compra",
  "footline2": "string",
  "footline3": "string",
  "footline4": "string",
  "active": 1
}
```

**Respuesta Exitosa (HTTP 200):**
```json
{
  "success": true,
  "message": "Registro actualizado exitosamente",
  "data": {
    "id": 1,
    "resolution_number": "18760000001",
    "prefix": "FV"
  }
}
```

---

## Eliminar resolución DIAN

### Eliminar resolución DIAN - 🔴 DELETE
```http
DELETE {{url}}/resolutions/{id}
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

