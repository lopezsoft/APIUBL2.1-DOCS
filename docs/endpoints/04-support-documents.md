---
sidebar_position: 4
sidebar_label: 📑 Documento Soporte
---

# 📦 Documento Soporte

> ✅ **Autenticación REQUERIDA**
> Incluir en todos: `Authorization: Bearer {token}`

:::info ¿Dónde obtener el `client_uuid`? — Parámetro Multi-Tenant para Casas de Software
Si operas como **Casa de Software** o **Cuenta Principal**, puedes emitir documentos soporte y notas de ajuste en nombre de tus empresas cliente agregando el parámetro `client_uuid` en la query string de la URL:
- **URL con Query Param:** `POST {{url}}/ds/document?client_uuid={{client_uuid}}`
- **Header:** `Authorization: Bearer {token_cuenta_principal}`
- **Comportamiento:** El documento soporte se emitirá y registrará en la DIAN en nombre de la empresa cliente indicada.

**¿Dónde encontrar el `client_uuid` de tus clientes?**  
Puedes consultar el listado completo de tus empresas cliente y sus respectivos `client_uuid` mediante el endpoint:
```http
GET {{url}}/company/customers
Authorization: Bearer {token}
Content-Type: application/json
```
:::

Los documentos soporte son utilizados para certificar las adquisiciones efectuadas a sujetos **no obligados a expedir factura de venta** o documento equivalente.

## Enviar Documento Soporte - 🟘 POST
```http
POST {{url}}/ds/document?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Variantes disponibles:**
- Documento Soporte Residente.
- Documento Soporte No Residente.
- Casos especiales: IVA + RTE IVA, con decimales.

**Respuesta Exitosa (DIAN 200 OK):**
```json
{
  "message": "El documento ha sido procesado por la DIAN.",
  "send_to_queue": 0,
  "XmlDocumentKey": "9fa2bd902a5b498c79a844ba5e70f3c67009fc5a0fea1cb0cd4aeac38a10a7425f0e08ad71b83c821372adb1771e07dd",
  "response": {
    "ErrorMessage": {},
    "IsValid": "true",
    "StatusCode": "00",
    "StatusDescription": "Procesado Correctamente.",
    "StatusMessage": "El Documento Soporte DSE12, ha sido autorizado."
  }
}
```

---

## Enviar Nota de Ajuste (Documento Soporte) - 🟘 POST
```http
POST {{url}}/ds/adjustment-note?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Variantes disponibles:**
- Nota de ajuste a Documento Soporte Residente y No Residente.
- Nota de ajuste con IVA + RTE IVA.

**Uso:** Para ajustar valores de un documento soporte previamente emitido (notas crédito/débito en el entorno de documento soporte).

**Respuesta Exitosa (DIAN 200 OK):**
```json
{
  "message": "El documento ha sido procesado por la DIAN.",
  "send_to_queue": 0,
  "XmlDocumentKey": "9fa2bd902a5b498c79a844ba5e70f3c67009fc5a0fea1cb0cd4aeac38a10a7425f0e08ad71b83c821372adb1771e07dd",
  "response": {
    "ErrorMessage": {},
    "IsValid": "true",
    "StatusCode": "00",
    "StatusDescription": "Procesado Correctamente.",
    "StatusMessage": "El Documento Soporte DSE12, ha sido autorizado."
  }
}
```

