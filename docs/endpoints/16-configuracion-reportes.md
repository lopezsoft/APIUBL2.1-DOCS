---
sidebar_position: 16
sidebar_label: Configuración de Reportes
---

# 📊 Configuración de Reportes

> ✅ **Autenticación REQUERIDA**
> Incluir en todos los endpoints de esta sección el header: `Authorization: Bearer {token}`

## Obtener configuración de reportes

### Obtener configuración de reportes - 🔵 GET
```http
GET {{url}}/settings/reports
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
  "success": true,
  "data": {}
}
```

---

## Actualizar configuración de reportes

### Actualizar configuración de reportes - 🟠 PUT
```http
PUT {{url}}/settings/reports/{id}
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
  "header_text": "string",
  "footer_text": "string",
  "logo_url": "string"
}
```

**Respuesta Exitosa (HTTP 200):**
```json
{}
```

---

