---
sidebar_position: 4
sidebar_label: 📑 Documento Soporte
description: "Emisión de documento soporte y nota de ajuste para adquisiciones a no obligados a facturar, incluidos no residentes."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 📦 Documento Soporte {#documento-soporte}

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

## 📋 Diferencias clave: Documento Soporte vs Factura {#diferencias}

| Característica | Factura Electrónica | Documento Soporte |
|---|---|---|
| Endpoint | `POST /invoice` | `POST /ds/document` |
| `type_document_id` | `1` (FEV) | No aplica (definido en payload) |
| Proveedor | Obligado a facturar | **No obligado** a facturar |
| Nota de ajuste | Nota Crédito/Débito | `POST /ds/adjustment-note` |
| Referenciado en | `billing_reference` | `billing_reference` |

📦 Ver ejemplos en [/docs/jsons-support-document](/docs/jsons-support-document/support-document)

---

## 1. Emisión {#emision}

<details open>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/ds/document</b> — Enviar Documento Soporte</summary>

```http
POST {{url}}/ds/document?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Variantes disponibles:**
- Documento Soporte **Residente**.
- Documento Soporte **No Residente**.
- Casos especiales: IVA + RTE IVA, con decimales.

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "{{url}}/ds/document" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{ ... }'
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
const response = await axios.post(`${url}/ds/document`, payload, {
  headers: { Authorization: `Bearer ${token}` }
});
const cude = response.data.XmlDocumentKey;
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$response = $client->post("{$url}/ds/document", [
    'headers' => ['Authorization' => "Bearer {$token}"],
    'json'    => $payload,
]);
```

</TabItem>
</Tabs>

<details>
<summary>✅ Respuesta Exitosa — Producción (HTTP 200)</summary>

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

`uuid` identifica el envío en la plataforma y `warnings` informa los pasos posteriores a la aceptación que hayan fallado (un warning nunca significa reenviar). Ver [Advertencias](/docs/endpoints/invoices-pos#warnings-emision).

</details>

<details>
<summary>⚠️ Rechazo DIAN — Producción (HTTP 200, <code>IsValid: "false"</code>)</summary>

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

</details>

:::info Mismas reglas que la factura
El documento soporte usa el mismo flujo de emisión que `POST /invoice`: la respuesta de habilitación, los warnings de la regla 90 (`ALREADY_AUTHORIZED_*`), el `409` por `uuid` ya usado y los errores `409 DOCUMENT_IN_TRANSMISSION`, `409 DOCUMENT_IN_VALIDATION`, `503 DIAN_STATUS_UNAVAILABLE` y `DOCUMENT_POSSIBLY_SENT` aplican igual. Ver [Respuestas, advertencias y errores de emisión](/docs/endpoints/invoices-pos#respuestas-emision).
:::

</details>

---

## 2. Nota de Ajuste {#nota-ajuste}

<details open>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/ds/adjustment-note</b> — Enviar Nota de Ajuste</summary>

```http
POST {{url}}/ds/adjustment-note?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Uso:** Para ajustar valores de un documento soporte previamente emitido.

**Variantes disponibles:**
- Nota de ajuste a Documento Soporte **Residente** y **No Residente**.
- Nota de ajuste con IVA + RTE IVA.

<details>
<summary>✅ Respuesta Exitosa — DIAN 200 OK</summary>

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

</details>

La nota de ajuste sigue las mismas reglas de respuesta, rechazo DIAN (HTTP `200` con `IsValid: "false"`) y errores que el documento soporte. Ver [Respuestas, advertencias y errores de emisión](/docs/endpoints/invoices-pos#respuestas-emision).

</details>
