# MATIAS API UBL 2.1 — Paquete de Contexto IA: Nómina Electrónica y Documento Soporte

> Nómina individual, notas de ajuste (reemplazo y eliminación), Documento Soporte en adquisiciones a no obligados (residentes y no residentes).

- **Versión API:** v3.10.0
- **URL del paquete:** https://docs.matias-api.com/ai/packs/payroll-support-doc.md
- **Índice general IA:** https://docs.matias-api.com/llms.txt
- **Especificación OpenAPI 3:** https://docs.matias-api.com/openapi.json

## Páginas incluidas en este paquete

- [Documento Soporte](https://docs.matias-api.com/docs/endpoints/support-documents.md)
- [Nómina Electrónica](https://docs.matias-api.com/docs/endpoints/payroll.md)
- [Documento soporte residente](https://docs.matias-api.com/docs/jsons-support-document/support-document.md)
- [Documento soporte no residente](https://docs.matias-api.com/docs/jsons-support-document/support-document-non-residents.md)
- [Notas de ajuste documento soporte residente](https://docs.matias-api.com/docs/jsons-support-document/adjustment-note.md)
- [Notas de ajuste documento soporte no residente](https://docs.matias-api.com/docs/jsons-support-document/adjustment-note-non-residents.md)
- [Campos de la nómina](https://docs.matias-api.com/docs/payroll/payroll-fields.md)
- [Campos de la nómina de reemplazo](https://docs.matias-api.com/docs/payroll/payroll-replace.md)
- [Nómina de eliminación](https://docs.matias-api.com/docs/payroll/payroll-delete.md)

---

<!-- Fuente: https://docs.matias-api.com/docs/endpoints/support-documents -->

# 📦 Documento Soporte

:::warning Autenticación Requerida
Incluir en todos los endpoints: `Authorization: Bearer {token}`
:::

:::info Parámetro Multi-Tenant: `client_uuid`
Todos los endpoints aceptan el parámetro opcional `?client_uuid={{client_uuid}}`. Permite emitir documentos en nombre de empresas cliente cuando operas como **Casa de Software**.

```http
GET {{url}}/company/customers
Authorization: Bearer {token}
```

:::

Los documentos soporte certifican adquisiciones efectuadas a sujetos **no obligados a expedir factura de venta** o documento equivalente.

:::tip Orden de configuración recomendado
Antes de emitir documentos soporte, asegúrate de tener configurados: **Resolución DIAN** → **Software DIAN** → **Certificado Digital**.
:::

## 📋 Diferencias clave: Documento Soporte vs Factura

| Característica | Factura Electrónica | Documento Soporte |
|---|---|---|
| Endpoint | `POST /invoice` | `POST /ds/document` |
| `type_document_id` | `1` (FEV) | No aplica (definido en payload) |
| Proveedor | Obligado a facturar | **No obligado** a facturar |
| Nota de ajuste | Nota Crédito/Débito | `POST /ds/adjustment-note` |
| Referenciado en | `billing_reference` | `billing_reference` |

📦 Ver ejemplos en [/docs/jsons-support-document](https://docs.matias-api.com/docs/jsons-support-document/support-document.md)

---

## 1. Emisión

**POST /ds/document — Enviar Documento Soporte**

```http
POST {{url}}/ds/document?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Variantes disponibles:**
- Documento Soporte **Residente**.
- Documento Soporte **No Residente**.
- Casos especiales: IVA + RTE IVA, con decimales.

**cURL**

```bash
curl -X POST "{{url}}/ds/document" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{ ... }'
```

**JavaScript (Axios)**

```js
const response = await axios.post(`${url}/ds/document`, payload, {
  headers: { Authorization: `Bearer ${token}` }
});
const cude = response.data.XmlDocumentKey;
```

**PHP (Guzzle)**

```php
$response = $client->post("{$url}/ds/document", [
    'headers' => ['Authorization' => "Bearer {$token}"],
    'json'    => $payload,
]);
```

**✅ Respuesta Exitosa — Producción (HTTP 200)**

```json
{
  "uuid": "7e3a91c4-7dd2-11f0-ba9f-f02f74cac485",
  "message": "Solicitud procesada por la DIAN.",
  "send_to_queue": 0,
  "XmlDocumentKey": "9fa2bd902a5b498c79a844ba5e70f3c67009fc5a0fea1cb0cd4aeac38a10a7425f0e08ad71b83c821372adb1771e07dd",
  "response": {
    "ErrorMessage": {},
    "IsValid": "true",
    "StatusCode": "00",
    "StatusDescription": "Procesado Correctamente.",
    "StatusMessage": "El Documento Soporte DSE12, ha sido autorizado."
  },
  "XmlBase64Bytes": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4...",
  "AttachedDocument": {
    "pathZip": null,
    "path": "1/ad/ad09010914030002500000012.xml",
    "url": "https://sandbox-api.matias-api.com/attachments/1/ad/ad09010914030002500000012.xml",
    "data": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4..."
  },
  "qr": {
    "qrDian": "https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=9fa2bd90...",
    "url": "https://sandbox-api.matias-api.com/qr/1/QR-7e3a91c4-7dd2-11f0-ba9f-f02f74cac485.png",
    "path": "1/QR-7e3a91c4-7dd2-11f0-ba9f-f02f74cac485.png",
    "data": "iVBORw0KGgoAAAANSUhEUgAA..."
  },
  "pdf": null,
  "warnings": [],
  "success": true
}
```

`uuid` identifica el envío en la plataforma y `warnings` informa los pasos posteriores a la aceptación que hayan fallado (un warning nunca significa reenviar). Ver [Advertencias](https://docs.matias-api.com/docs/endpoints/invoices-pos#warnings-emision).

**⚠️ Rechazo DIAN — Producción (HTTP 200, `IsValid: "false"`)**

Un rechazo de la DIAN **no** es un error HTTP: llega con HTTP `200` y `success: true`, y el resultado fiscal está en `response.IsValid`, `response.StatusCode` y `response.ErrorMessage`. El HTTP `422` se reserva para errores de validación del JSON.

```json
{
  "uuid": "7e3a91c4-7dd2-11f0-ba9f-f02f74cac485",
  "message": "Solicitud procesada por la DIAN.",
  "send_to_queue": 0,
  "XmlDocumentKey": "9fa2bd902a5b498c79a844ba5e70f3c67009fc5a0fea1cb0cd4aeac38a10a7425f0e08ad71b83c821372adb1771e07dd",
  "response": {
    "IsValid": "false",
    "StatusCode": "99",
    "ErrorMessage": {
      "string": ["Error en campos obligatorios del documento soporte."]
    }
  },
  "XmlBase64Bytes": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4...",
  "AttachedDocument": null,
  "qr": null,
  "pdf": null,
  "warnings": [],
  "success": true
}
```

:::info Mismas reglas que la factura
El documento soporte usa el mismo flujo de emisión que `POST /invoice`: la respuesta de habilitación, los warnings de la regla 90 (`ALREADY_AUTHORIZED_*`), el `409` por `uuid` ya usado y los errores `409 DOCUMENT_IN_TRANSMISSION`, `409 DOCUMENT_IN_VALIDATION`, `503 DIAN_STATUS_UNAVAILABLE` y `DOCUMENT_POSSIBLY_SENT` aplican igual. Ver [Respuestas, advertencias y errores de emisión](https://docs.matias-api.com/docs/endpoints/invoices-pos#respuestas-emision).
:::

---

## 2. Nota de Ajuste

**POST /ds/adjustment-note — Enviar Nota de Ajuste**

```http
POST {{url}}/ds/adjustment-note?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Uso:** Para ajustar valores de un documento soporte previamente emitido.

**Variantes disponibles:**
- Nota de ajuste a Documento Soporte **Residente** y **No Residente**.
- Nota de ajuste con IVA + RTE IVA.

**✅ Respuesta Exitosa — DIAN 200 OK**

```json
{
  "uuid": "a41d07b8-7dd2-11f0-ba9f-f02f74cac485",
  "message": "Solicitud procesada por la DIAN.",
  "send_to_queue": 0,
  "XmlDocumentKey": "4c7e19d02b8a5f63e1d9a0b7c4f2e8a1d6b3c9f0e7a2d5b8c1f4e9a6d3b0c7e2f5a8d1b4c7e0f3a6d9b2c5e8f1a4d7b0",
  "response": {
    "ErrorMessage": {},
    "IsValid": "true",
    "StatusCode": "00",
    "StatusDescription": "Procesado Correctamente.",
    "StatusMessage": "La Nota de Ajuste al Documento Soporte NAS3, ha sido autorizada."
  },
  "XmlBase64Bytes": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4...",
  "AttachedDocument": {
    "pathZip": null,
    "path": "1/ad/ad09010914030002500000013.xml",
    "url": "https://sandbox-api.matias-api.com/attachments/1/ad/ad09010914030002500000013.xml",
    "data": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4..."
  },
  "qr": {
    "qrDian": "https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=4c7e19d0...",
    "url": "https://sandbox-api.matias-api.com/qr/1/QR-a41d07b8-7dd2-11f0-ba9f-f02f74cac485.png",
    "path": "1/QR-a41d07b8-7dd2-11f0-ba9f-f02f74cac485.png",
    "data": "iVBORw0KGgoAAAANSUhEUgAA..."
  },
  "pdf": null,
  "warnings": [],
  "success": true
}
```

La nota de ajuste sigue las mismas reglas de respuesta, rechazo DIAN (HTTP `200` con `IsValid: "false"`) y errores que el documento soporte. Ver [Respuestas, advertencias y errores de emisión](https://docs.matias-api.com/docs/endpoints/invoices-pos#respuestas-emision).

---

<!-- Fuente: https://docs.matias-api.com/docs/endpoints/payroll -->

# 💼 Nómina Electrónica

:::warning Autenticación Requerida
Incluir en todos los endpoints: `Authorization: Bearer {token}`
:::

:::info Parámetro Multi-Tenant: `client_uuid`
Todos los endpoints aceptan `?client_uuid={{client_uuid}}` para operar en nombre de empresas cliente.

```http
GET {{url}}/company/customers
Authorization: Bearer {token}
```

:::

El Documento Soporte de Pago de Nómina Electrónica es el soporte de los costos y deducciones en el impuesto sobre la renta derivado de los pagos relacionados con la nómina.

## 📋 Tipos de Documentos de Nómina

| Tipo | Endpoint | Uso |
|------|----------|-----|
| Nómina individual | `POST /ep/payroll` | Transmisión del período de pago |
| Nota de reemplazo | `POST /ep/payroll/replace` | Corrección de una nómina enviada |
| Nota de eliminación | `POST /ep/payroll/delete` | Eliminación legal de nómina errónea |

📦 Ver campos completos en [Campos de Nómina](https://docs.matias-api.com/docs/payroll/payroll-fields.md)

---

## 1. Emisión

**POST /ep/payroll — Enviar Nómina**

```http
POST {{url}}/ep/payroll?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

Transmite el documento soporte de pago de nómina electrónica a la DIAN.

**cURL**

```bash
curl -X POST "{{url}}/ep/payroll" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{ ... }'
```

**JavaScript (Axios)**

```js
const response = await axios.post(`${url}/ep/payroll`, payload, {
  headers: { Authorization: `Bearer ${token}` }
});
const cuneKey = response.data.XmlDocumentKey;
```

**PHP (Guzzle)**

```php
$response = $client->post("{$url}/ep/payroll", [
    'headers' => ['Authorization' => "Bearer {$token}"],
    'json'    => $payload,
]);
```

**✅ Respuesta Exitosa — DIAN 200 OK**

```json
{
  "uuid": "c83f5e10-7dd3-11f0-ba9f-f02f74cac485",
  "message": "El documento ha sido procesado por la DIAN.",
  "send_to_queue": 0,
  "XmlDocumentKey": "860ff75995712a3bf5e9d14233e70bf2aca76b8ab5afdf41040e40331fe597c1bbb659a3af87e295a767a39921202e2e",
  "response": {
    "ErrorMessage": {},
    "IsValid": "true",
    "StatusCode": "00",
    "StatusDescription": "Procesado Correctamente.",
    "StatusMessage": "El Documento Soporte de Pago de Nómina Electrónica NIE10, ha sido autorizado."
  },
  "XmlBase64Bytes": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4...",
  "AttachedDocument": null,
  "qr": {
    "qrDian": "https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=860ff759..."
  },
  "pdf": null,
  "warnings": [],
  "success": true
}
```

| Campo | Descripción |
|---|---|
| `uuid` | Identificador del envío en la plataforma. |
| `response` | Respuesta de la DIAN. El documento es válido solo con `IsValid: "true"` y `StatusCode: "00"`; un rechazo de la DIAN también llega con HTTP `200`. |
| `AttachedDocument`, `pdf` | Siempre `null` en nómina: no se genera AttachedDocument, PDF ni correo. |
| `warnings` | Normalmente `[]`. Si la DIAN validó el documento pero falla un paso posterior, trae `ATTACHED_DOCUMENT_NOT_GENERATED` y la respuesta **sigue siendo exitosa**: no reenvíes el documento, ya es válido ante la DIAN. |

:::info Habilitación y errores
- **Habilitación:** tanto en nómina individual (`/ep/payroll`) como en nota de eliminación (`/ep/payroll/delete`), la respuesta en ambiente de habilitación (pruebas) tiene **exactamente la misma estructura que en producción** (incluye `uuid`, `message`, `send_to_queue`, `XmlDocumentKey`, `response`, `XmlBase64Bytes`, `AttachedDocument`, `qr`, `pdf`, `warnings` y `success`).
- **Documento ya validado:** si el número ya está validado ante la DIAN se responde HTTP `400` con el mensaje `El documento (...) con numero ... ya se encuentra validado.` y el registro del envío en `data`.
- **Errores `5xx`:** incluyen un campo `reference` para que soporte ubique el caso.

Estas reglas aplican también a `/ep/payroll/replace` y `/ep/payroll/delete`.
:::

---

## 2. Nota de Reemplazo

**POST /ep/payroll/replace — Nota de Ajuste — Reemplazo**

```http
POST {{url}}/ep/payroll/replace?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Uso:** Corregir un documento de nómina previamente enviado. La DIAN asume este nuevo documento como el reemplazo legal (corrección de valores).

**✅ Respuesta Exitosa — DIAN 200 OK**

```json
{
  "uuid": "d1a4b7e2-7dd3-11f0-ba9f-f02f74cac485",
  "message": "El documento ha sido procesado por la DIAN.",
  "send_to_queue": 0,
  "XmlDocumentKey": "...",
  "response": {
    "IsValid": "true",
    "StatusCode": "00",
    "StatusDescription": "Procesado Correctamente.",
    "StatusMessage": "La Nota de Nómina Electrónica ha sido autorizada."
  },
  "XmlBase64Bytes": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4...",
  "AttachedDocument": null,
  "qr": {
    "qrDian": "https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=..."
  },
  "pdf": null,
  "warnings": [],
  "success": true
}
```

---

## 3. Nota de Eliminación

**POST /ep/payroll/delete — Nota de Ajuste — Eliminación**

```http
POST {{url}}/ep/payroll/delete?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Uso:** Eliminar un documento de nómina de forma legal ante la DIAN si fue generado por error y no se reemplazará por otro en el período actual.

:::warning Consecuencias legales
La nota de eliminación es una acción irreversible ante la DIAN. Úsala únicamente cuando el documento fue emitido por error y **no** va a ser reemplazado por una nueva nómina en el mismo período.
:::

**✅ Respuesta Exitosa — DIAN 200 OK**

```json
{
  "uuid": "e6b2c9f4-7dd3-11f0-ba9f-f02f74cac485",
  "message": "El documento ha sido procesado por la DIAN.",
  "send_to_queue": 0,
  "XmlDocumentKey": "...",
  "response": {
    "IsValid": "true",
    "StatusCode": "00",
    "StatusDescription": "Procesado Correctamente.",
    "StatusMessage": "La Nota de Eliminación de Nómina ha sido autorizada."
  },
  "XmlBase64Bytes": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4...",
  "AttachedDocument": null,
  "qr": {
    "qrDian": "https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=..."
  },
  "pdf": null,
  "warnings": [],
  "success": true
}
```

---

<!-- Fuente: https://docs.matias-api.com/docs/jsons-support-document/support-document -->

# Documento soporte residente

A continuación se muestra un ejemplo de un JSON que representa un documento soporte. Este JSON se puede utilizar para pruebas o para simular un documento soporte real.

## Residente

```json title="support-document-resident.json"
{
  "resolution_number": "18764090837763",
  "notes": "Nota del documento",
  "document_number": "100",
  "operation_type_id": 9,
  "type_document_id": 11,
  "graphic_representation": 0,
  "currency_id": 272,
  "send_email": 1,
  "payments": [{
    "payment_method_id": 1,
    "means_payment_id": 10,
    "value_paid": "230525.00"
  }],
  "customer": {
    "country_id": "45",
    "city_id": "149",
    "identity_document_id": "3",
    "type_organization_id": 2,
    "tax_regime_id": 2,
    "tax_level_id": 5,
    "company_name": "LOPEZ GOMEZ LEWIS OSWALDO",
    "dni": "1063279307",
    "mobile": "3108435431",
    "email": "cliente4@ejemplo.com",
    "address": "Direccion residencial",
    "postal_code": "661002"
  },
  "lines": [
    {
      "invoiced_quantity": "3",
      "quantity_units_id": "1093",
      "line_extension_amount": "81600",
      "free_of_charge_indicator": false,
      "description": "Hunters Mini Tumaco 82%",
      "code": "HMT82",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "price_amount": "27200",
      "base_quantity": "3",
      "invoice_period": {
        "start_date": "2022-08-30",
        "description_code": 1
      }
    },
    {
      "invoiced_quantity": "2",
      "quantity_units_id": "1093",
      "line_extension_amount": "100000",
      "free_of_charge_indicator": false,
      "description": "TIJERA NECROPSIA AVES 2",
      "code": "HMT84",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "price_amount": "50000",
      "base_quantity": "2",
      "invoice_period": {
        "start_date": "2022-08-30",
        "description_code": 1
      },
      "tax_totals": [
        {
          "tax_id": "1",
          "tax_amount": 19000,
          "taxable_amount": 100000,
          "percent": 19
        }
      ]
    },
    {
      "invoiced_quantity": "1",
      "quantity_units_id": "1093",
      "line_extension_amount": "28500",
      "free_of_charge_indicator": false,
      "description": "TIJERA NECROPSIA AVES",
      "code": "HMT81",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "price_amount": "28500",
      "base_quantity": "1",
      "invoice_period": {
        "start_date": "2022-08-30",
        "description_code": 1
      },
      "tax_totals": [
        {
          "tax_id": "1",
          "tax_amount":  1425,
          "taxable_amount": 28500,
          "percent": 5
        }
      ]
    }
  ],
  "legal_monetary_totals": {
    "line_extension_amount": "210100",
    "tax_exclusive_amount": "128500",
    "tax_inclusive_amount": "230525",
    "payable_amount": "230525"
  },
  "tax_totals": [
    {
      "tax_id": "1",
      "tax_amount":  1425,
      "taxable_amount": 28500,
      "percent": 5
    },
    {
      "tax_id": "1",
      "tax_amount": 19000,
      "taxable_amount": 100000,
      "percent": 19
    }
  ]
}
```

---

<!-- Fuente: https://docs.matias-api.com/docs/jsons-support-document/support-document-non-residents -->

# Documento soporte no residente

A continuación se muestra un ejemplo de un JSON que representa un documento soporte. Este JSON se puede utilizar para pruebas o para simular un documento soporte real.

## No residente

```json title="support-document-non-residents.json"
{
  "resolution_number": "18764090837763",
  "document_number": "106",
  "operation_type_id": 10,
  "type_document_id": 11,
  "graphic_representation": 1,
  "currency_id": 272,
  "payments": [
    {
      "payment_method_id": "1",
      "means_payment_id": "10",
      "value_paid": "790329.00"
    }
  ],
  "lines": [
    {
      "invoiced_quantity": "1.00",
      "quantity_units_id": "1093",
      "um": "UND",
      "line_extension_amount": "790329.00",
      "free_of_charge_indicator": false,
      "description": "COMPRA KRYTOX POR CHEMOURS GPL 205 GRASA, PFPE PURO",
      "code": "999-001",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "price_amount": 790329.00,
      "base_quantity": 1.00,
      "invoice_period": {
        "start_date": "2025-03-01",
        "description_code": "1"
      }
    }
  ],
  "customer": {
    "country_id": "239",
    "identity_document_id": "10",
    "company_name": "AMAZON",
    "dni": "444444055",
    "address": "NORTE DE VIRGINIA H10",
    "city_name": "VIRGINIA",
    "postal_code": "110121"
  },
  "legal_monetary_totals": {
    "line_extension_amount": "790329.00",
    "tax_exclusive_amount": "0.00",
    "tax_inclusive_amount": "790329.00",
    "payable_amount": "790329.00"
  }
}
```

---

<!-- Fuente: https://docs.matias-api.com/docs/jsons-support-document/adjustment-note -->

# Notas de ajuste documento soporte residente

A continuación se muestra un ejemplo de un JSON que representa un documento soporte de nota de ajuste. Este JSON se puede utilizar para pruebas o para simular un documento soporte real.

## Residente

```json title="adjustment-note.json"
{
  "resolution_number": "18760000001",
  "date": "2024-01-12",
  "time": "22:46:53",
  "notes": "Nota del documento",
  "document_number": "3",
  "operation_type_id": 1,
  "type_document_id": 15,
  "graphic_representation": 1,
  "send_email": 1,
  "currency_id": 272,
	"payments": [{
    "payment_method_id": 1,
    "means_payment_id": 10,
    "value_paid": "230525.00"
	}],
    "discrepancy_response": {
        "reference_id": "DS10",
        "response_id": "11",
        "description": "Anulación porque el documento se generó a vendedor incorecto"
    },
    "billing_reference": {
        "number": "DS10",
        "date": "2024-01-11",
        "uuid": "4d3aa5a3d69e674adb0b29b8b7c091682e5ce5d47a35c7b7a24442e8c93eaeb8a7e84c4b012ce76f04fb9dd692ef7168",
        "scheme_name": "CUDS-SHA384"
    },
	"customer": {
		"country_id": "45",
		"city_id": "836",
		"identity_document_id": "3",
		"type_organization_id": 2,
		"tax_regime_id": 2,
		"tax_level_id": 5,
		"company_name": "Santiago Arango",
		"dni": "1152440359",
    "mobile": "3108435423",
		"email": "cliente4@ejemplo.com",
    "address": "Direccion residencial",
    "postal_code": "661002"
	},
	"lines": [
        {
			"invoiced_quantity": "3",
			"quantity_units_id": "1093",
			"line_extension_amount": "81600", 
			"free_of_charge_indicator": false,
			"description": "Hunters Mini Tumaco 82%",
			"code": "HMT82",
			"type_item_identifications_id": "4",
			"reference_price_id": "1",
			"price_amount": "27200",
			"base_quantity": "3",
      "invoice_period": {
          "start_date": "2022-08-30",
          "description_code": 1
      }
		},
		{
			"invoiced_quantity": "2",
			"quantity_units_id": "1093",
			"line_extension_amount": "100000", 
			"free_of_charge_indicator": false,
			"description": "TIJERA NECROPSIA AVES 2",
			"code": "HMT84",
			"type_item_identifications_id": "4",
			"reference_price_id": "1",
			"price_amount": "50000",
			"base_quantity": "2",
      "invoice_period": {
          "start_date": "2022-08-30",
          "description_code": 1
      },
			"tax_totals": [
				{
					"tax_id": "1",
					"tax_amount": 19000,
					"taxable_amount": 100000,
					"percent": 19
				}
			]
		},
        {
			"invoiced_quantity": "1",
			"quantity_units_id": "1093",
			"line_extension_amount": "28500", 
			"free_of_charge_indicator": false,
			"description": "TIJERA NECROPSIA AVES",
			"code": "HMT81",
			"type_item_identifications_id": "4",
			"reference_price_id": "1",
			"price_amount": "28500",
			"base_quantity": "1",
      "invoice_period": {
          "start_date": "2022-08-30",
          "description_code": 1
      },
			"tax_totals": [
				{
					"tax_id": "1",
					"tax_amount":  1425,
					"taxable_amount": 28500,
					"percent": 5
				}
			]
		}
	],
    "legal_monetary_totals": {
		"line_extension_amount": "210100",
		"tax_exclusive_amount": "128500",
		"tax_inclusive_amount": "230525",
		"payable_amount": "230525"
	},
	"tax_totals": [
        {
          "tax_id": "1",
          "tax_amount":  1425,
          "taxable_amount": 28500,
          "percent": 5
        },
        {
          "tax_id": "1",
          "tax_amount": 19000,
          "taxable_amount": 100000,
          "percent": 19
        }
	]
}
```

---

<!-- Fuente: https://docs.matias-api.com/docs/jsons-support-document/adjustment-note-non-residents -->

# Notas de ajuste documento soporte no residente

A continuación se muestra un ejemplo de un JSON que representa un documento soporte de nota de ajuste. Este JSON se puede utilizar para pruebas o para simular un documento soporte real.

## No residente

```json title="adjustment-note.json"
{
  "resolution_number": "18760000001",
  "notes": "Nota del documento",
  "document_number": "71",
  "operation_type_id": 10,
  "type_document_id": 15,
  "graphic_representation": 1,
  "send_email": 1,
  "currency_id": 272,
  "discrepancy_response": {
    "reference_id": "DS106",
    "response_id": "11",
    "description": "Anulación porque el documento se generó a vendedor incorecto"
  },
  "billing_reference": {
    "number": "DS106",
    "date": "2025-04-13",
    "uuid": "7afa7f2dcf133ca8be44853dc5506b48b9860e86d585dc56ac0692fb65281f2d6a51dc7fd6d1fa44d78e9f5ed2dc714e",
    "scheme_name": "CUDS-SHA384"
  },
  "payments": [
    {
      "payment_method_id": "1",
      "means_payment_id": "10",
      "value_paid": "790329.00"
    }
  ],
  "lines": [
    {
      "invoiced_quantity": "1.00",
      "quantity_units_id": "1093",
      "um": "UND",
      "line_extension_amount": "790329.00",
      "free_of_charge_indicator": false,
      "description": "COMPRA KRYTOX POR CHEMOURS GPL 205 GRASA, PFPE PURO",
      "code": "999-001",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "price_amount": 790329.00,
      "base_quantity": 1.00,
      "invoice_period": {
        "start_date": "2025-03-01",
        "description_code": "1"
      }
    }
  ],
  "customer": {
    "country_id": "239",
    "identity_document_id": "10",
    "company_name": "AMAZON",
    "dni": "444444055",
    "address": "NORTE DE VIRGINIA H10",
    "city_name": "VIRGINIA",
    "postal_code": "110121"
  },
  "legal_monetary_totals": {
    "line_extension_amount": "790329.00",
    "tax_exclusive_amount": "0.00",
    "tax_inclusive_amount": "790329.00",
    "payable_amount": "790329.00"
  }
}
```

---

<!-- Fuente: https://docs.matias-api.com/docs/payroll/payroll-fields -->

# Campos de la nómina

La nómina electrónica es un documento que contiene información detallada de los pagos y deducciones que se le realizan
a un trabajador. En este documento se incluyen datos como el nombre del trabajador, el periodo de pago, el salario, las deducciones, entre otros.

A continuación se describen los campos que componen la nómina electrónica.

## JSON de ejemplo

```json title="payroll.json"
{
    "resolution_number": "18760000001",
    "document_number": "27",
    "generation_city_id" : "836",
    "worker_code": "1063279307",
	"novelty": false,
    "pay_day": "2023-09-30",
	"period": {
		"date_entry": "2017-01-01",
		"departure_date": null,
		"settlement_start_date": "2023-09-01",
		"settlement_end_date": "2023-09-30",
		"time_worked": "30",
		"generation_date": "2023-09-24"
	},
	"general_information": {
		"generation_date": "2023-09-24",
		"generation_time": "10:00:00",
		"period_id": "5",
		"currency_id": "272",
		"trm": "0"
	},
	"notes": "",
	"employee": {
		"worker_type_id": 1,
		"worker_subtype_id": 1,
		"high_risk_pension": "false",
		"identity_document_id": "1",
		"document_number": "1063279307",
		"first_surname": "LOPEZ",
		"second_surname": "GOMES",
		"first_name": "LEWIS",
		"other_names": "OSWALDO",
		"working_country_id": 45,
		"work_city_id": 149,
		"work_address": "Calle 64 #1631 La  Capilla Dosquebradas",
		"integral_salary": "false",
		"contract_type_id": 1,
		"salary": "1200000",
		"worker_code": "1063279307"
	},
	"payment": {
		"payment_method_id": "1",
		"means_payment_id": "31",
		"bank": "BANCOLOMBIA",
		"account_type": "AHORROS",
		"account_number": "96645544844"
	},
	"earn": {
		"basic": {
			"worked_days": "30",
			"salary_worked": "1200000"
		},
		"transport": {
			"transportation_assistance": "106454",
			"viatic_maintenance": "0.0",
			"viatic_non_salary_maintenance": "0.0"
		},
        "HEDs": [
            {
                "start_time": null,
                "final_hour": null,
                "amount": "20",
                "percentage": "25.00",
                "payment": "125000"
            }
        ],
        "HENs": [
            {
                "start_time": "2021-12-31T00:00:00",
                "final_hour": "2021-12-31T00:00:00",
                "amount": "0",
                "percentage": "0.00",
                "payment": "0.00"
            }
        ],
        "HRNs": [
            {
                "start_time": "2021-12-31T00:00:00",
                "final_hour": "2021-12-31T00:00:00",
                "amount": "0",
                "percentage": "0.00",
                "payment": "0.00"
            }
        ],
        "HEDDFs": [
            {
                "start_time": "2021-12-31T00:00:00",
                "final_hour": "2021-12-31T00:00:00",
                "amount": "0",
                "percentage": "0.00",
                "payment": "0.00"
            }
        ],
        "HRDDFs": [
            {
                "start_time": "2021-12-31T00:00:00",
                "final_hour": "2021-12-31T00:00:00",
                "amount": "0",
                "percentage": "0.00",
                "payment": "0.00"
            }
        ],
        "HENDFs": [
            {
                "start_time": "2021-12-31T00:00:00",
                "final_hour": "2021-12-31T00:00:00",
                "amount": "0",
                "percentage": "0.00",
                "payment": "0.00"
            }
        ],
        "HRNDFs": [
            {
                "start_time": "2021-12-31T00:00:00",
                "final_hour": "2021-12-31T00:00:00",
                "amount": "0",
                "percentage": "0.00",
                "payment": "0.00"
            }
        ],
		"vacations": {
			"common": {
				"start_date": "2021-12-31",
				"final_date": "2021-12-31",
				"amount": "0",
				"payment": "0.00"
			},
			"paid": {
				"amount": "0",
				"payment": "0.00"
			}
		},
		"bonus": {
			"amount": "0",
			"payment": "0.00",
			"non_salary_payment": "0.00"
		},
		"cesantias": {
			"payment": "0",
			"percentage": "0.00",
			"interest_payment": "0.00"
		},
		"incapacity": [
			{
				"start_date": "2021-12-31",
				"final_date": "2021-12-31",
				"amount": "0",
				"type_id": 1,
				"payment": "0.00"
			}
		],
		"licenses":
        {
            "licenseMP": {
                "start_date": "2021-12-31",
                "final_date": "2021-12-31",
                "amount": "0",
                "payment": "0.00"
            },
            "licenseR": {
                "start_date": "2021-12-31",
                "final_date": "2021-12-31",
                "amount": "0",
                "payment": "0.00"
            },
            "licenseNR": {
                "start_date": "2021-12-31",
                "final_date": "2021-12-31",
                "amount": "0"
            }
        },
		"bonuses": [
			{
				"bonusS": "0.00",
				"bonusNS": "0.00"
			}
		],
		"assistances": [
			{
				"assistanceS": "0.00",
				"assistanceNS": "0.00"
			}
		],
		"legal_strikes": [
			{
				"start_date": "2021-12-31",
				"final_date": "2021-12-31",
				"amount": "0"
			}
		],
		"other_concepts": [
			{
				"description": "Otros conceptos",
				"conceptS": "0.00",
				"conceptNS": "4000.00"
			}
		],
		"compensations": [
			{
				"compensationO": "0.00",
				"compensationE": "0.00"
			}
		],
		"bondEPCTVs": [
			{
				"paymentS": "0.00",
				"paymentNS": "0.00",
				"payment_foodS": "0.00",
				"payment_foodNS": "0.00"
			}
		],
		"commissions": [
			{
				"commission": "0.00"
			}
		],
		"payments_third_party": [
			{
				"payment_third_party": "0.00"
			}
		],
		"advances": [
			{
				"advance": "0.00"
			}
		],
		"endowment": "0.00",
		"sustaining_support": "0.00",
		"teleworking": "0.00",
		"withdrawal_bonus": "0.00",
		"indemnification": "0.00",
		"refund": "0.00"
	},
	"deductions": {
		"health": {
			"percentage": "4",
			"deduction": "43700"
		},
		"pension_fund": {
			"percentage": "4",
			"deduction": "43700"
		},
		"fundSP": {
			"percentage": "0.00",
			"deduction": "0.00",
			"percentageSub": "0.00",
			"deductionSub": "0.00"
		},
		"trade_union": [
			{
				"percentage": "0.00",
				"deduction": "0.00"
			}
		],
		"sanctions": [
			{
				"sanctionPublic": "0.00",
				"sanctionPriv": "0.00"
			}
		],
		"libranzas": [
			{
				"description": "",
				"deduction": "0.00"
			}
		],
		"third_party_payment": [
			{
				"third_party_pay": "90000.00"
			}
		],
		"advances": [
			{
				"advance": "0.00"
			}
		],
		"other_deductions": [
			{
				"other_deduction": "0.00"
			}
		],
		"voluntary_pension": "0.00",
		"retefuente": "0.00",
		"afc": "0.00",
		"cooperative": "0.00",
		"tax_embargo": "0.00",
		"complementary_plan": "0.00",
		"education": "0.00",
		"refund": "0.00",
		"debt": "0.00"
	},
	"rounding": "46",
	"total_earned": "1325000",
	"deductions_total": "97400",
	"total_voucher": "1334054"
}
```

# Diccionario de Datos

## Campos Principales

- `resolution_number`: STRING. Número de la resolución.
- `document_number`: STRING. Número de documento asociado.
- `generation_city_id`: STRING. ID de la ciudad donde se genera el documento.
- `worker_code`: STRING. Código único del trabajador.
- `novelty`: BOOLEAN. Indica si hay novedades.
- `pay_day`: DATE. Fecha de pago.
- `notes`: STRING. Notas adicionales.
- `rounding`: STRING. Redondeo aplicado.
- `total_earned`: STRING. Total ganado.
- `deductions_total`: STRING. Total deducción.
- `total_voucher`: STRING. Total del comprobante.

## Periodo

- `date_entry`: DATE. Fecha de entrada.
- `departure_date`: DATE. Fecha de salida, puede ser nula.
- `settlement_start_date`: DATE. Inicio del período de liquidación.
- `settlement_end_date`: DATE. Fin del período de liquidación.
- `time_worked`: STRING / INTEGER. Tiempo laborado por el trabajador en la empresa (en días). Validación: mínimo `1` (`min:1`), **sin tope máximo**.
- `generation_date`: DATE. Fecha de generación del documento.

## Información General

- `generation_date`: DATE. Fecha de generación del documento.
- `generation_time`: TIME. Hora de generación del documento.
- `period_id`: STRING. ID del período.
- `currency_id`: STRING. ID de la moneda.
- `trm`: STRING. Tasa representativa del mercado.

## Empleado

- `worker_type_id`: INTEGER. Tipo de trabajador.
- `worker_subtype_id`: INTEGER. Subtipo de trabajador.
- `high_risk_pension`: BOOLEAN. Indica si es pensión de alto riesgo.
- `identity_document_id`: STRING. ID del documento de identidad.
- `document_number`: STRING. Número de documento del trabajador.
- `first_surname`: STRING. Primer apellido.
- `second_surname`: STRING. Segundo apellido.
- `first_name`: STRING. Primer nombre.
- `other_names`: STRING. Otros nombres.
- `working_country_id`: INTEGER. ID del país de trabajo.
- `work_city_id`: INTEGER. ID de la ciudad de trabajo.
- `work_address`: STRING. Dirección de trabajo.
- `integral_salary`: BOOLEAN. Indica si el salario es integral.
- `contract_type_id`: INTEGER. Tipo de contrato.
- `salary`: STRING. Salario.

## Pago

- `payment_method_id`: STRING. ID del método de pago.
- `means_payment_id`: STRING. ID del medio de pago.
- `bank`: STRING. Banco.
- `account_type`: STRING. Tipo de cuenta.
- `account_number`: STRING. Número de cuenta.

## Devengado (`earn`)

### Básico (`basic`)

- `worked_days`: STRING. Días trabajados en el período.
- `salary_worked`: STRING. Salario correspondiente a los días trabajados.

### Transporte (`transport`)

- `transportation_assistance`: STRING. Asistencia de transporte.
- `viatic_maintenance`: STRING. Viáticos de mantenimiento.
- `viatic_non_salary_maintenance`: STRING. Viáticos de mantenimiento no salariales.

### Horas Extras Diurnas (`HEDs`)

- `start_time`: TIME (nullable). Hora de inicio de las horas extras diurnas, puede ser nulo.
- `final_hour`: TIME (nullable). Hora final de las horas extras diurnas, puede ser nulo.
- `amount`: STRING. Cantidad de horas extras diurnas trabajadas.
- `percentage`: STRING. Porcentaje aplicado a las horas extras diurnas.
- `payment`: STRING. Pago correspondiente a las horas extras diurnas.

### Horas Extras Nocturnas (`HENs`), Horas de Recargo Nocturno (`HRNs`), Horas Extras Diurnas en Día Festivo (`HEDDFs`), etc.

- Cada tipo de hora extra o recargo tiene campos para `start_time`, `final_hour`, `amount`, `percentage`, y `payment`, adaptándose según el tipo específico.

### Vacaciones (`vacations`)

  - `common`: OBJETO. Vacaciones comunes con `start_date`, `final_date`, `amount`, y `payment`.
    - Descripción los campos
      - `start_date`: Fecha de inicio de las vacaciones.
      - `final_date`: Fecha final de las vacaciones.
      - `amount`: Cantidad de días de vacaciones.
      - `payment`: Pago correspondiente a las vacaciones.
    - `paid`: OBJETO. Vacaciones pagadas con `amount` y `payment`.
      - Descripción los campos
        - `amount`: Cantidad de días de vacaciones pagadas.
        - `payment`: Pago correspondiente a las vacaciones pagadas.
  - `paid`: OBJETO. Vacaciones pagadas con `amount` y `payment`.
- ### Ejemplo de vacaciones:

```json
"vacations": {
  "common": {
    "start_date": "2023-01-01",
    "final_date": "2023-01-10",
    "amount": "10",
    "payment": "1000"
  },
  "paid": {
    "amount": "2000",
    "payment": "2000"
  }
}
```

### Primas (`bonus`)

- `amount`: STRING. Cantidad de la prima.
- `payment`: STRING. Pago de la prima.
- `non_salary_payment`: STRING. Pago de la prima no salarial.

### Cesantías (`cesantias`)

- `payment`: STRING. Pago de las cesantías.
- `percentage`: STRING. Porcentaje aplicado a las cesantías.
- `interest_payment`: STRING. Pago de intereses sobre las cesantías.

### Incapacidades (`incapacity`)

- Lista de incapacidades, cada una con `start_date`, `final_date`, `amount`, `type_id`, y `payment`.

### Licencias (`licenses`)

- Incluye licencias por maternidad (`licenseMP`), recreativas (`licenseR`), y no remuneradas (`licenseNR`), cada una con `start_date`, `final_date`, `amount`, y `payment` (cuando aplique).

### Otros Conceptos de Ganancias

- Detalles de bonificaciones especiales (`bonuses`), asistencias (`assistances`),
huelgas legales (`legal_strikes`), otros conceptos (`other_concepts`), compensaciones (`compensations`),
bonificaciones por EPCTV (`bondEPCTVs`), comisiones (`commissions`), pagos a terceros (`payments_third_party`),
anticipos (`advances`), dotación (`endowment`), apoyo sostenimiento (`sustaining_support`),
teletrabajo (`teleworking`), bonificación por retiro (`withdrawal_bonus`), indemnizaciones
(`indemnification`), reembolsos (`refund`), especificando los campos relevantes para cada uno.

## Deducciones (`deductions`)

### Salud (`health`)

- `percentage`: STRING. Porcentaje de deducción por concepto de salud.
- `deduction`: STRING. Monto deducido por salud.

### Fondo de Pensiones (`pension_fund`)

- `percentage`: STRING. Porcentaje de deducción por fondo de pensiones.
- `deduction`: STRING. Monto deducido por fondo de pensiones.

### Fondo de Solidaridad Pensional (`fundSP`)

- `percentage`: STRING. Porcentaje de contribución al fondo de solidaridad pensional.
- `deduction`: STRING. Monto deducido por fondo de solidaridad pensional.
- `percentageSub`: STRING. Porcentaje de contribución subsidiada al fondo de solidaridad pensional.
- `deductionSub`: STRING. Monto deducido por contribución subsidiada.

### Sindicato (`trade_union`)

- `percentage`: STRING. Porcentaje de deducción por sindicato.
- `deduction`: STRING. Monto deducido por sindicato.

### Sanciones (`sanctions`)

- `sanctionPublic`: STRING. Sanciones públicas.
- `sanctionPriv`: STRING. Sanciones privadas.

### Libranzas (`libranzas`)

- `description`: STRING. Descripción de la libranza.
- `deduction`: STRING. Monto deducido por libranza.

### Pago a Terceros (`third_party_payment`)

- `third_party_pay`: STRING. Pago realizado a terceros.

### Anticipos (`advances`)

- `advance`: STRING. Monto de los anticipos proporcionados.

### Otras Deducciones (`other_deductions`)

- `other_deduction`: STRING. Monto de otras deducciones no especificadas anteriormente.

### Pension Voluntaria (`voluntary_pension`)

- `voluntary_pension`: STRING. Monto deducido por concepto de pensión voluntaria.

### Retención en la Fuente (`retefuente`)

- `retefuente`: STRING. Monto deducido por retención en la fuente.

### AFC (`afc`)

- `afc`: STRING. Monto deducido por cuentas de ahorro para el fomento de la construcción (AFC).

### Cooperativa (`cooperative`)

- `cooperative`: STRING. Monto deducido por aportes a cooperativas.

### Embargo Fiscal (`tax_embargo`)

- `tax_embargo`: STRING. Monto deducido por embargos fiscales.

### Plan Complementario (`complementary_plan`)

- `complementary_plan`: STRING. Monto deducido por plan complementario de salud.

### Educación (`education`)

- `education`: STRING. Monto deducido por concepto de educación.

### Reembolso (`refund`)

- `refund`: STRING. Monto de reembolsos realizados al empleado.

### Deuda (`debt`)

- `debt`: STRING. Monto deducido por deudas con la empresa.

## Totales del Documento

- `total_earned`: STRING. Total de ingresos ganados por el empleado durante el período.
- `deductions_total`: STRING. Total de deducciones aplicadas al pago del empleado.
- `total_voucher`: STRING. Monto final después de aplicar ingresos y deducciones.

---

<!-- Fuente: https://docs.matias-api.com/docs/payroll/payroll-replace -->

# Campos de la nómina de reemplazo

La nota de ajuste de nómina de tipo **reemplazo** (`POST /ep/payroll/replace`) permite corregir o sustituir un Documento Soporte de Pago de Nómina Electrónica previamente emitido y validado ante la DIAN, referenciando el documento original mediante el objeto `replacing_predecessor` (`number`, `cune` y `generation_date`).

A continuación se describen los campos que componen la nómina de reemplazo.

## JSON de ejemplo

```json title="payroll-replace.json"
{
  "resolution_number": "18760000002",
  "document_number": "10",
  "generation_city_id" : "836",
  "worker_code": "1063279307",
  "novelty": false,
  "pay_day": "2022-08-30",
  "replacing_predecessor": {
    "number": "NE27",
    "cune": "fa6e59a1d6f69b1d4e37d15f7485744ce5f74627496e91fba0058aacb52d580f6482d89faa34c8861a6e29df856f4dfa",
    "generation_date": "2022-08-28"
  },
  "period": {
    "date_entry": "2017-01-01",
    "departure_date": null,
    "settlement_start_date": "2022-08-01",
    "settlement_end_date": "2022-08-30",
    "time_worked": "30",
    "generation_date": "2022-09-24"
  },
  "general_information": {
    "generation_date": "2022-09-24",
    "generation_time": "10:00:00",
    "period_id": "5",
    "currency_id": "272",
    "trm": "0"
  },
  "notes": "",
  "employee": {
    "worker_type_id": 1,
    "worker_subtype_id": 1,
    "high_risk_pension": "false",
    "identity_document_id": "1",
    "document_number": "1063279307",
    "first_surname": "LOPEZ",
    "second_surname": "GOMES",
    "first_name": "LEWIS",
    "other_names": "OSWALDO",
    "working_country_id": 45,
    "work_city_id": 149,
    "work_address": "Calle 64 #1631 La  Capilla Dosquebradas",
    "integral_salary": "false",
    "contract_type_id": 1,
    "salary": "1200000",
    "worker_code": "1063279307"
  },
  "payment": {
    "payment_method_id": "1",
    "means_payment_id": "31",
    "bank": "BANCOLOMBIA",
    "account_type": "AHORROS",
    "account_number": "96645544844"
  },
  "earn": {
    "basic": {
      "worked_days": "30",
      "salary_worked": "1200000"
    },
    "transport": {
      "transportation_assistance": "106454",
      "viatic_maintenance": "0.0",
      "viatic_non_salary_maintenance": "0.0"
    },
    "HEDs": [
      {
        "start_time": "2022-12-31T00:00:00",
        "final_hour": "2022-12-31T00:00:00",
        "amount": "0",
        "percentage": "0.00",
        "payment": "0.00"
      }
    ],
    "HENs": [
      {
        "start_time": "2022-12-31T00:00:00",
        "final_hour": "2022-12-31T00:00:00",
        "amount": "0",
        "percentage": "0.00",
        "payment": "0.00"
      }
    ],
    "HRNs": [
      {
        "start_time": "2022-12-31T00:00:00",
        "final_hour": "2022-12-31T00:00:00",
        "amount": "0",
        "percentage": "0.00",
        "payment": "0.00"
      }
    ],
    "HEDDFs": [
      {
        "start_time": "2022-12-31T00:00:00",
        "final_hour": "2022-12-31T00:00:00",
        "amount": "0",
        "percentage": "0.00",
        "payment": "0.00"
      }
    ],
    "HRDDFs": [
      {
        "start_time": "2022-12-31T00:00:00",
        "final_hour": "2022-12-31T00:00:00",
        "amount": "0",
        "percentage": "0.00",
        "payment": "0.00"
      }
    ],
    "HENDFs": [
      {
        "start_time": "2022-12-31T00:00:00",
        "final_hour": "2022-12-31T00:00:00",
        "amount": "0",
        "percentage": "0.00",
        "payment": "0.00"
      }
    ],
    "HRNDFs": [
      {
        "start_time": "2022-12-31T00:00:00",
        "final_hour": "2022-12-31T00:00:00",
        "amount": "0",
        "percentage": "0.00",
        "payment": "0.00"
      }
    ],
    "vacations": {
      "common": {
        "start_date": "2022-12-31",
        "final_date": "2022-12-31",
        "amount": "0",
        "payment": "0.00"
      },
      "paid": {
        "amount": "0",
        "payment": "0.00"
      }
    },
    "bonus": {
      "amount": "0",
      "payment": "0.00",
      "non_salary_payment": "0.00"
    },
    "cesantias": {
      "payment": "0",
      "percentage": "0.00",
      "interest_payment": "0.00"
    },
    "incapacity": [
      {
        "start_date": "2022-12-31",
        "final_date": "2022-12-31",
        "amount": "0",
        "type_id": 1,
        "payment": "0.00"
      }
    ],
    "licenses":
    {
      "licenseMP": {
        "start_date": "2022-12-31",
        "final_date": "2022-12-31",
        "amount": "0",
        "payment": "0.00"
      },
      "licenseR": {
        "start_date": "2022-12-31",
        "final_date": "2022-12-31",
        "amount": "0",
        "payment": "0.00"
      },
      "licenseNR": {
        "start_date": "2022-12-31",
        "final_date": "2022-12-31",
        "amount": "0"
      }
    },
    "bonuses": [
      {
        "bonusS": "0.00",
        "bonusNS": "0.00"
      }
    ],
    "assistances": [
      {
        "assistanceS": "0.00",
        "assistanceNS": "0.00"
      }
    ],
    "legal_strikes": [
      {
        "start_date": "2022-12-31",
        "final_date": "2022-12-31",
        "amount": "0"
      }
    ],
    "other_concepts": [
      {
        "description": "A",
        "conceptS": "0.00",
        "conceptNS": "0.00"
      }
    ],
    "compensations": [
      {
        "compensationO": "0.00",
        "compensationE": "0.00"
      }
    ],
    "bondEPCTVs": [
      {
        "paymentS": "0.00",
        "paymentNS": "0.00",
        "payment_foodS": "0.00",
        "payment_foodNS": "0.00"
      }
    ],
    "commissions": [
      {
        "commission": "0.00"
      }
    ],
    "payments_third_party": [
      {
        "payment_third_party": "0.00"
      }
    ],
    "advances": [
      {
        "advance": "0.00"
      }
    ],
    "endowment": "0.00",
    "sustaining_support": "0.00",
    "teleworking": "0.00",
    "withdrawal_bonus": "0.00",
    "indemnification": "0.00",
    "refund": "0.00"
  },
  "deductions": {
    "health": {
      "percentage": "4",
      "deduction": "43700"
    },
    "pension_fund": {
      "percentage": "4",
      "deduction": "43700"
    },
    "fundSP": {
      "percentage": "0.00",
      "deduction": "0.00",
      "percentageSub": "0.00",
      "deductionSub": "0.00"
    },
    "trade_union": [
      {
        "percentage": "0.00",
        "deduction": "0.00"
      }
    ],
    "sanctions": [
      {
        "sanctionPublic": "0.00",
        "sanctionPriv": "0.00"
      }
    ],
    "libranzas": [
      {
        "description": "",
        "deduction": "0.00"
      }
    ],
    "third_party_payment": [
      {
        "third_party_pay": "0.00"
      }
    ],
    "advances": [
      {
        "advance": "0.00"
      }
    ],
    "other_deductions": [
      {
        "other_deduction": "0.00"
      }
    ],
    "voluntary_pension": "0.00",
    "retefuente": "0.00",
    "afc": "0.00",
    "cooperative": "0.00",
    "tax_embargo": "0.00",
    "complementary_plan": "0.00",
    "education": "0.00",
    "refund": "0.00",
    "debt": "0.00"
  },
  "rounding": "46",
  "total_earned": "1200000",
  "deductions_total": "87400",
  "total_voucher": "1219100"
}
```

# Diccionario de Datos

## Campos Principales

- `resolution_number`: STRING. Número de la resolución.
- `document_number`: STRING. Número de documento asociado.
- `generation_city_id`: STRING. ID de la ciudad donde se genera el documento.
- `worker_code`: STRING. Código único del trabajador.
- `novelty`: BOOLEAN. Indica si hay novedades.
- `pay_day`: DATE. Fecha de pago.
- `notes`: STRING. Notas adicionales.
- `rounding`: STRING. Redondeo aplicado.
- `total_earned`: STRING. Total ganado.
- `deductions_total`: STRING. Total deducción.
- `total_voucher`: STRING. Total del comprobante.

## Reemplazo

- `replacing_predecessor`: OBJETO. Información del predecesor reemplazado con `number`, `cune`, y `generation_date`.
  - `number`: STRING. Número del predecesor.
  - `cune`: STRING. Código único de nómina electrónica.
  - `generation_date`: DATE. Fecha de generación del documento.

## Periodo

- `date_entry`: DATE. Fecha de entrada.
- `departure_date`: DATE. Fecha de salida, puede ser nula.
- `settlement_start_date`: DATE. Inicio del período de liquidación.
- `settlement_end_date`: DATE. Fin del período de liquidación.
- `time_worked`: STRING / INTEGER. Tiempo laborado por el trabajador en la empresa (en días). Validación: mínimo `1` (`min:1`), **sin tope máximo**.
- `generation_date`: DATE. Fecha de generación del documento.

## Información General

- `generation_date`: DATE. Fecha de generación del documento.
- `generation_time`: TIME. Hora de generación del documento.
- `period_id`: STRING. ID del período.
- `currency_id`: STRING. ID de la moneda.
- `trm`: STRING. Tasa representativa del mercado.

## Empleado

- `worker_type_id`: INTEGER. Tipo de trabajador.
- `worker_subtype_id`: INTEGER. Subtipo de trabajador.
- `high_risk_pension`: BOOLEAN. Indica si es pensión de alto riesgo.
- `identity_document_id`: STRING. ID del documento de identidad.
- `document_number`: STRING. Número de documento del trabajador.
- `first_surname`: STRING. Primer apellido.
- `second_surname`: STRING. Segundo apellido.
- `first_name`: STRING. Primer nombre.
- `other_names`: STRING. Otros nombres.
- `working_country_id`: INTEGER. ID del país de trabajo.
- `work_city_id`: INTEGER. ID de la ciudad de trabajo.
- `work_address`: STRING. Dirección de trabajo.
- `integral_salary`: BOOLEAN. Indica si el salario es integral.
- `contract_type_id`: INTEGER. Tipo de contrato.
- `salary`: STRING. Salario.

## Pago

- `payment_method_id`: STRING. ID del método de pago.
- `means_payment_id`: STRING. ID del medio de pago.
- `bank`: STRING. Banco.
- `account_type`: STRING. Tipo de cuenta.
- `account_number`: STRING. Número de cuenta.

## Devengado (`earn`)

### Básico (`basic`)

- `worked_days`: STRING. Días trabajados en el período.
- `salary_worked`: STRING. Salario correspondiente a los días trabajados.

### Transporte (`transport`)

- `transportation_assistance`: STRING. Asistencia de transporte.
- `viatic_maintenance`: STRING. Viáticos de mantenimiento.
- `viatic_non_salary_maintenance`: STRING. Viáticos de mantenimiento no salariales.

### Horas Extras Diurnas (`HEDs`)

- `start_time`: TIME (nullable). Hora de inicio de las horas extras diurnas, puede ser nulo.
- `final_hour`: TIME (nullable). Hora final de las horas extras diurnas, puede ser nulo.
- `amount`: STRING. Cantidad de horas extras diurnas trabajadas.
- `percentage`: STRING. Porcentaje aplicado a las horas extras diurnas.
- `payment`: STRING. Pago correspondiente a las horas extras diurnas.

### Horas Extras Nocturnas (`HENs`), Horas de Recargo Nocturno (`HRNs`), Horas Extras Diurnas en Día Festivo (`HEDDFs`), etc.

- Cada tipo de hora extra o recargo tiene campos para `start_time`, `final_hour`, `amount`, `percentage`, y `payment`, adaptándose según el tipo específico.

### Vacaciones (`vacations`)

- `common`: OBJETO. Vacaciones comunes con `start_date`, `final_date`, `amount`, y `payment`.
- `paid`: OBJETO. Vacaciones pagadas con `amount` y `payment`.

### Primas (`bonus`)

- `amount`: STRING. Cantidad de la prima.
- `payment`: STRING. Pago de la prima.
- `non_salary_payment`: STRING. Pago de la prima no salarial.

### Cesantías (`cesantias`)

- `payment`: STRING. Pago de las cesantías.
- `percentage`: STRING. Porcentaje aplicado a las cesantías.
- `interest_payment`: STRING. Pago de intereses sobre las cesantías.

### Incapacidades (`incapacity`)

- Lista de incapacidades, cada una con `start_date`, `final_date`, `amount`, `type_id`, y `payment`.

### Licencias (`licenses`)

- Incluye licencias por maternidad (`licenseMP`), recreativas (`licenseR`), y no remuneradas (`licenseNR`), cada una con `start_date`, `final_date`, `amount`, y `payment` (cuando aplique).

### Otros Conceptos de Ganancias

- Detalles de bonificaciones especiales (`bonuses`), asistencias (`assistances`),
huelgas legales (`legal_strikes`), otros conceptos (`other_concepts`), compensaciones (`compensations`),
bonificaciones por EPCTV (`bondEPCTVs`), comisiones (`commissions`), pagos a terceros (`payments_third_party`),
anticipos (`advances`), dotación (`endowment`), apoyo sostenimiento (`sustaining_support`),
teletrabajo (`teleworking`), bonificación por retiro (`withdrawal_bonus`), indemnizaciones
(`indemnification`), reembolsos (`refund`), especificando los campos relevantes para cada uno.

## Deducciones (`deductions`)

### Salud (`health`)

- `percentage`: STRING. Porcentaje de deducción por concepto de salud.
- `deduction`: STRING. Monto deducido por salud.

### Fondo de Pensiones (`pension_fund`)

- `percentage`: STRING. Porcentaje de deducción por fondo de pensiones.
- `deduction`: STRING. Monto deducido por fondo de pensiones.

### Fondo de Solidaridad Pensional (`fundSP`)

- `percentage`: STRING. Porcentaje de contribución al fondo de solidaridad pensional.
- `deduction`: STRING. Monto deducido por fondo de solidaridad pensional.
- `percentageSub`: STRING. Porcentaje de contribución subsidiada al fondo de solidaridad pensional.
- `deductionSub`: STRING. Monto deducido por contribución subsidiada.

### Sindicato (`trade_union`)

- `percentage`: STRING. Porcentaje de deducción por sindicato.
- `deduction`: STRING. Monto deducido por sindicato.

### Sanciones (`sanctions`)

- `sanctionPublic`: STRING. Sanciones públicas.
- `sanctionPriv`: STRING. Sanciones privadas.

### Libranzas (`libranzas`)

- `description`: STRING. Descripción de la libranza.
- `deduction`: STRING. Monto deducido por libranza.

### Pago a Terceros (`third_party_payment`)

- `third_party_pay`: STRING. Pago realizado a terceros.

### Anticipos (`advances`)

- `advance`: STRING. Monto de los anticipos proporcionados.

### Otras Deducciones (`other_deductions`)

- `other_deduction`: STRING. Monto de otras deducciones no especificadas anteriormente.

### Pension Voluntaria (`voluntary_pension`)

- `voluntary_pension`: STRING. Monto deducido por concepto de pensión voluntaria.

### Retención en la Fuente (`retefuente`)

- `retefuente`: STRING. Monto deducido por retención en la fuente.

### AFC (`afc`)

- `afc`: STRING. Monto deducido por cuentas de ahorro para el fomento de la construcción (AFC).

### Cooperativa (`cooperative`)

- `cooperative`: STRING. Monto deducido por aportes a cooperativas.

### Embargo Fiscal (`tax_embargo`)

- `tax_embargo`: STRING. Monto deducido por embargos fiscales.

### Plan Complementario (`complementary_plan`)

- `complementary_plan`: STRING. Monto deducido por plan complementario de salud.

### Educación (`education`)

- `education`: STRING. Monto deducido por concepto de educación.

### Reembolso (`refund`)

- `refund`: STRING. Monto de reembolsos realizados al empleado.

### Deuda (`debt`)

- `debt`: STRING. Monto deducido por deudas con la empresa.

## Totales del Documento

- `total_earned`: STRING. Total de ingresos ganados por el empleado durante el período.
- `deductions_total`: STRING. Total de deducciones aplicadas al pago del empleado.
- `total_voucher`: STRING. Monto final después de aplicar ingresos y deducciones.

---

<!-- Fuente: https://docs.matias-api.com/docs/payroll/payroll-delete -->

# Nómina de eliminación

## JSON de ejemplo

```json title="payroll-delete.json"
{
  "resolution_number": "18760000002",
  "document_number": "11",
  "generation_city_id" : "836",
  "deleting_predecessor": {
    "number": "SETPNE0017",
    "cune": "fa6e59a1d6f69b1d4e37d15f7485744ce5f74627496e91fba0058aacb52d580f6482d89faa34c8861a6e29df856f4dfa",
    "generation_date": "2022-08-28"
  },
  "general_information": {
    "generation_date": "2022-08-28",
    "generation_time": "10:00:00"
  },
  "notes": "Documento eliminado por error contable"
}
```

## Diccionario de datos
- `resolution_number` (string): Número de resolución.
- `document_number` (string): Número de documento.
- `generation_city_id` (string): Identificador de la ciudad de generación.
- `deleting_predecessor` (object): Predecesor de eliminación.
  - `number` (string): Número de predecesor.
  - `cune` (string): CUNE.
  - `generation_date` (string): Fecha de generación.
- `general_information` (object): Información general.
  - `generation_date` (string): Fecha de generación.
  - `generation_time` (string): Hora de generación.
- `notes` (string): Notas.
