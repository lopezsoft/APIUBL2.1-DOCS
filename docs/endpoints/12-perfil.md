---
sidebar_position: 12
sidebar_label: Perfil
---

# 👤 Perfil

> ✅ **Autenticación REQUERIDA**
> Incluir en todos los endpoints de esta sección el header: `Authorization: Bearer {token}`

## Actualizar perfil de usuario

### Actualizar perfil de usuario - 🟠 PUT
```http
PUT {{url}}/profile/{id}
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
  "first_name": "string",
  "last_name": "string",
  "email": "string",
  "imgdata": "string"
}
```

**Respuesta Exitosa (HTTP 200):**
```json
{}
```

---

## Actualizar correo electrónico del usuario

### Actualizar correo electrónico del usuario - 🟠 PUT
```http
PUT {{url}}/profile/update-email
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Permite al usuario actualizar su correo electrónico. Requiere que el nuevo correo no esté en uso por otro usuario. El email_verified_at se establece en null y se envía automáticamente un correo de verificación al nuevo email.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Body (JSON):**
```json
{
  "email": "nuevo@ejemplo.com"
}
```

**Respuesta Exitosa (HTTP 200):**
```json
{
  "success": true,
  "message": "Correo electrónico actualizado exitosamente. Se ha enviado un correo de verificación a tu nuevo email.",
  "data": {
    "email": "nuevo@ejemplo.com",
    "email_verified_at": null,
    "previous_email": "anterior@ejemplo.com",
    "verification_sent": true
  }
}
```

---

