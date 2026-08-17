---
sidebar_position: 8
sidebar_label: 🔢 Numeración Automática
---

# 🚀 API de Autoincremento

> ✅ **Autenticación REQUERIDA**
> Incluir en todos: `Authorization: Bearer {token}`

:::info ¿Dónde obtener el `client_uuid`? — Parámetro Multi-Tenant para Casas de Software
Si operas como **Casa de Software** o **Cuenta Principal**, puedes emitir y reenviar documentos con numeración automática en nombre de tus empresas cliente agregando el parámetro `client_uuid` en la query string de la URL:
- **URL con Query Param:** `?client_uuid={{client_uuid}}` (ej. `POST {{url}}/auto-increment/invoices?client_uuid={{client_uuid}}`)
- **Header:** `Authorization: Bearer {token_cuenta_principal}`
- **Comportamiento:** El consecutivo se resolverá y asignará automáticamente sobre la resolución DIAN de la empresa cliente especificada por su UUID.

**¿Dónde encontrar el `client_uuid` de tus clientes?**  
Puedes consultar el listado completo de tus empresas cliente y sus respectivos `client_uuid` mediante el endpoint:
```http
GET {{url}}/company/customers
Authorization: Bearer {token}
Content-Type: application/json
```
:::

Esta sección expone una nueva API de autoincremento para emitir documentos delegando a la plataforma el manejo consecutivo (conteo autoincremental de la resolución de facturación) y prefijo de los números de documento, evitando posibles colisiones en envíos concurrentes.

**Formato General:**
El body de estos endpoints es el mismo que el de la API de emisión estándar (por ejemplo: `POST /invoice`), con la diferencia de que el prefijo y número se resuelven automáticamente en base a la numeración configurada en la DIAN.

### Factura Autoincremental - 🟘 POST
```http
POST {{url}}/auto-increment/invoices?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

Emite una factura tomando automáticamente el siguiente número consecutivo disponible.

**Respuesta Exitosa (DIAN 200 OK):**
```json
{
  "uuid": "0b96bb6e-7dd0-11f0-ba9f-f02f74cac485",
  "message": "Solicitud procesada por la DIAN.",
  "send_to_queue": 0,
  "XmlDocumentKey": "6142be764d365c08872933a58c67177b000764e24e4108b67e5aa0872d709ad52a23c7543ffcad42bdec5e9e726d7644",
  "response": {
    "ErrorMessage": {},
    "IsValid": "true",
    "StatusCode": "00",
    "StatusDescription": "Procesado Correctamente.",
    "StatusMessage": "La Factura Electrónica F1001, ha sido autorizada."
  }
}
```

---

### Reenvío de Factura Autoincremental - 🟘 PATCH
```http
PATCH {{url}}/auto-increment/invoices/{uuid}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `uuid` | path | ✅ Sí | UUID interno del documento a reenviar. |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

Reintenta el proceso de emisión para una factura electrónica autoincremental que haya fallado o requerido ajuste, utilizando su UUID interno.

---

### Reenvío de Documento Soporte Autoincremental - 🟘 PATCH
```http
PATCH {{url}}/auto-increment/support-documents/{uuid}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `uuid` | path | ✅ Sí | UUID interno del documento soporte a reenviar. |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

Reintenta el proceso de emisión para un documento soporte autoincremental, utilizando su UUID interno.

---

### Reenvío de Documento POS Autoincremental - 🟘 PATCH
```http
PATCH {{url}}/auto-increment/pos-documents/{uuid}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `uuid` | path | ✅ Sí | UUID interno del documento POS a reenviar. |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

Reintenta el proceso de emisión para un documento POS autoincremental, utilizando su UUID interno.

---

### Notas de Crédito y Débito Autoincrementales - 🟘 POST
```http
POST {{url}}/auto-increment/credit-notes?client_uuid={{client_uuid}}
POST {{url}}/auto-increment/debit-notes?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

---

### Documento Soporte Autoincremental - 🟘 POST
```http
POST {{url}}/auto-increment/support-documents?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

Cubre tanto residentes como no residentes (se define en el payload).

---

### Documento POS (y Notas POS) Autoincremental - 🟘 POST
```http
POST {{url}}/auto-increment/pos-documents?client_uuid={{client_uuid}}
POST {{url}}/auto-increment/debit-notes?client_uuid={{client_uuid}}
POST {{url}}/auto-increment/credit-notes?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

(Para Notas POS se usa la misma ruta general, enviando el `type_document_id` adecuado en el JSON).

---

### Nota de Ajuste a Documento Soporte Autoincremental - 🟘 POST
```http
POST {{url}}/auto-increment/adjustment-notes?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

---

### Reenviar Documentos en Lote - 🟘 POST
```http
POST {{url}}/documents/{uuid}/resend?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `uuid` | path | ✅ Sí | UUID interno del documento a reenviar. |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

Reenvía un documento específico procesado en modo asíncrono o que falló temporalmente.

