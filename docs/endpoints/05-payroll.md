---
sidebar_position: 5
sidebar_label: 💼 Nómina Electrónica
---

# 💼 Nómina Electrónica

> ✅ **Autenticación REQUERIDA**
> Incluir en todos: `Authorization: Bearer {token}`

:::info ¿Dónde obtener el `client_uuid`? — Parámetro Multi-Tenant para Casas de Software
Si operas como **Casa de Software** o **Cuenta Principal**, puedes transmitir documentos de nómina electrónica y notas de ajuste en nombre de tus empresas cliente agregando el parámetro `client_uuid` en la query string de la URL:
- **URL con Query Param:** `POST {{url}}/ep/payroll?client_uuid={{client_uuid}}`
- **Header:** `Authorization: Bearer {token_cuenta_principal}`
- **Comportamiento:** La nómina se procesará y reportará a la DIAN bajo el NIT y configuración de la empresa cliente especificada por su UUID.

**¿Dónde encontrar el `client_uuid` de tus clientes?**  
Puedes consultar el listado completo de tus empresas cliente y sus respectivos `client_uuid` mediante el endpoint:
```http
GET {{url}}/company/customers
Authorization: Bearer {token}
Content-Type: application/json
```
:::

El Documento Soporte de Pago de Nómina Electrónica es el soporte de los costos y deducciones en el impuesto sobre la renta derivado de los pagos relacionados con la nómina.

### Enviar Nómina - 🟘 POST
```http
POST {{url}}/ep/payroll?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

Transmite el documento soporte de pago de nómina electrónica a la DIAN.

**Respuesta Exitosa (DIAN 200 OK):**
```json
{
  "message": "El documento ha sido procesado por la DIAN.",
  "send_to_queue": 0,
  "XmlDocumentKey": "860ff75995712a3bf5e9d14233e70bf2aca76b8ab5afdf41040e40331fe597c1bbb659a3af87e295a767a39921202e2e",
  "response": {
    "ErrorMessage": {},
    "IsValid": "true",
    "StatusCode": "00",
    "StatusDescription": "Procesado Correctamente.",
    "StatusMessage": "El Documento Soporte de Pago de Nómina Electrónica NIE10, ha sido autorizado."
  }
}
```

---

### Enviar Nota de Ajuste - Reemplazo - 🟘 POST
```http
POST {{url}}/ep/payroll/replace?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Uso:** Corregir un documento de nómina previamente enviado. La DIAN asume este nuevo documento como el reemplazo legal (corrección de valores).

---

### Enviar Nota de Ajuste - Eliminación - 🟘 POST
```http
POST {{url}}/ep/payroll/delete?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Uso:** Eliminar un documento de nómina de forma legal ante la DIAN si este fue generado por error y no se reemplazará por otro en el periodo actual.

