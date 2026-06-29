---
sidebar_position: 17
sidebar_label: Funciones Auxiliares
---

# 🛠️ Funciones Auxiliares

> ✅ **Autenticación REQUERIDA**
> Incluir en todos los endpoints de esta sección el header: `Authorization: Bearer {token}`

## Convertir números a letras

### Convertir números a letras - 🔵 GET
```http
GET {{url}}/numbers-to-letters
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `number` | query | Sí | Número a convertir |
| `money` | query | No | Nombre de la moneda principal |
| `money2` | query | No | Nombre de la moneda secundaria (centavos) |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Respuesta Exitosa (HTTP 200):**
```json
{}
```

---

## Calcular dígito de verificación

### Calcular dígito de verificación - 🔵 GET
```http
GET {{url}}/digit-verification
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `Number` | query | Sí | Número de identificación (NIT) |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Respuesta Exitosa (HTTP 200):**
```json
{
  "digit": 7,
  "nit": "900123456-7"
}
```

---

