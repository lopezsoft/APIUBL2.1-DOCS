---
sidebar_position: 3
sidebar_label: 🧾 Facturación y POS
---

# 📄 Facturación y Documentos Equivalentes (POS)

> ✅ **Autenticación REQUERIDA**
> Incluir en todos los endpoints de esta sección el header: `Authorization: Bearer {token}`

:::info ¿Dónde obtener el `client_uuid`? — Parámetro Multi-Tenant para Casas de Software
Si operas como **Casa de Software** o **Cuenta Principal**, puedes emitir facturas, notas y documentos equivalentes en nombre de tus empresas cliente agregando el parámetro `client_uuid` en la query string de la URL:
- **URL con Query Param:** `POST {{url}}/invoice?client_uuid={{client_uuid}}`
- **Header:** `Authorization: Bearer {token_cuenta_principal}`
- **Comportamiento:** La factura se procesará y firmará electrónicamente en nombre de la empresa cliente especificada por su UUID.

**¿Dónde encontrar el `client_uuid` de tus clientes?**  
Puedes consultar el listado completo de tus empresas cliente y sus respectivos `client_uuid` mediante el endpoint:
```http
GET {{url}}/company/customers
Authorization: Bearer {token}
Content-Type: application/json
```
:::

## 1. Emisión de Facturas (Invoices)

### Enviar Factura - 🟘 POST
```http
POST {{url}}/invoice?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Tipos soportados principales:**
- Factura nacional (01)
- Factura de exportación (02)
- Factura contingencia (03, 04)

**Ejemplos de Casos Soportados (Según Colección Postman):**
*   Factura Básica, Decimales, Ajustes.
*   Factura Sector Salud, Mandatos, Compra y Venta de Divisas.
*   Factura con Propina, Obsequio (Regalos), Descuentos, Retenciones y Cargos.
*   Facturas en Moneda Extranjera (Euro, USD) y Exportación.
*   Factura con Impuestos (Licores AD VALOREM / ICL, ICUI, Bolsas, Varios impuestos).

**Body:** JSON con estructura completa. Ver [Campos de Documentos](/docs/billing-fields) para todos los detalles técnicos.

**Respuesta Exitosa (DIAN 200 OK):**
```json
{
  "message": "El documento ha sido procesado por la DIAN.",
  "send_to_queue": 0,
  "XmlDocumentKey": "ad20e8c21f359c96389fb254104fe2282b0c9d0a1be8e651d09b73b927f267dfe0a07fc03b10b6f068e7d7ab1b15bcbc",
  "response": {
    "ErrorMessage": {},
    "IsValid": "true",
    "StatusCode": "00",
    "StatusDescription": "Procesado Correctamente.",
    "StatusMessage": "La Factura Electrónica SETT50, ha sido autorizada.",
    "XmlBase64Bytes": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4..."
  }
}
```

---

## 2. Notas de Crédito y Débito

### Enviar Nota Crédito - 🟘 POST
```http
POST {{url}}/notes/credit?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Casos:** Devoluciones, Descuentos globales, Correcciones hacia abajo.  
**Campo Clave:** `type_document_id: 5`

**Respuesta Exitosa (DIAN 200 OK):**
```json
{
  "message": "El documento ha sido procesado por la DIAN.",
  "send_to_queue": 0,
  "XmlDocumentKey": "ad20e8c21f359c96389fb254104fe2282b0c9d0a1be8e651d09b73b927f267dfe0a07fc03b10b6f068e7d7ab1b15bcbc",
  "response": {
    "ErrorMessage": {},
    "IsValid": "true",
    "StatusCode": "00",
    "StatusDescription": "Procesado Correctamente.",
    "StatusMessage": "La Factura Electrónica SETT50, ha sido autorizada.",
    "XmlBase64Bytes": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4..."
  }
}
```

---

### Enviar Nota Débito - 🟘 POST
```http
POST {{url}}/notes/debit?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Casos:** Intereses, Cargos adicionales, Correcciones hacia arriba.  
**Campo Clave:** `type_document_id: 4`

---

## 3. Documentos Equivalentes (POS y Otros)

### POS Electrónico (Documento 20) - 🟘 POST
```http
POST {{url}}/invoice?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Casos:**
*   POS con cliente (consumidor final u otros).
*   POS sin envío de email.
**Campo Clave:** `type_document_id: 20` (P.O.S)

---

### Notas para POS - 🟘 POST
```http
POST {{url}}/notes/credit?client_uuid={{client_uuid}}
POST {{url}}/notes/debit?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

Notas de crédito o débito asociadas a un documento P.O.S.

---

### Boleta de Ingreso a Cine - 🟘 POST
```http
POST {{url}}/invoice?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

Documento equivalente para ingreso a cine (Documento 25).

---

### 60 SPD (Servicios Públicos Domiciliarios) - 🟘 POST
```http
POST {{url}}/invoice?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

Factura o documento equivalente por servicios públicos domiciliarios.

