---
sidebar_position: 3
sidebar_label: 🧾 Facturación y POS
description: "Emisión de factura electrónica, notas crédito y débito y documento equivalente POS: request, respuestas, advertencias (warnings) y errores de emisión."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 📄 Facturación y Documentos Equivalentes (POS) {#facturacion-pos}

:::info Autenticación Requerida
Incluir en todos los endpoints: `Authorization: Bearer {token}`
:::

:::info Parámetro Multi-Tenant: `client_uuid`
Todos los endpoints de esta sección aceptan el parámetro opcional `?client_uuid={{client_uuid}}` en la query string. Permite procesar documentos en nombre de empresas cliente cuando operas como **Casa de Software**.

Obtén el listado de tus clientes y sus UUIDs en:
```http
GET {{url}}/company/customers
Authorization: Bearer {token}
```
:::

## 📋 Tipos de Documento Soportados {#tipos-de-documento}

| `type_document_id` | Tipo de Documento | Endpoint |
|---|---|---|
| `1` | Factura Electrónica de Venta | `POST /invoice` |
| `4` | Nota Débito | `POST /notes/debit` |
| `5` | Nota Crédito | `POST /notes/credit` |
| `7` | Factura Sector Salud (FEV) | `POST /invoice` |
| `20` | Documento Equivalente POS | `POST /invoice` |
| `25` | Boleta de Ingreso a Espectáculo Público (Cine) | `POST /invoice` |
| `60` | Servicios Públicos Domiciliarios (SPD) | `POST /invoice` |

---

## 1. Emisión de Facturas {#emision-facturas}

<details open>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/invoice</b> — Enviar Factura Electrónica</summary>

```http
POST {{url}}/invoice?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Tipos soportados principales:**
- Factura nacional (01)
- Factura de exportación (02)
- Factura contingencia (03, 04)

**Ejemplos de Casos Soportados:**
- Factura Básica, Decimales, Ajustes.
- Factura Sector Salud, Mandatos, Consorciados (`shareholders`), Compra y Venta de Divisas.
- Factura con Propina, Obsequio (Regalos), Descuentos, Retenciones y Cargos.
- Facturas en Moneda Extranjera (Euro, USD) y Exportación.
- Factura con Impuestos (Licores AD VALOREM / ICL, ICUI, Bolsas, Varios impuestos).

**Body:** JSON con estructura completa. Ver [Campos del Documento](/docs/billing-fields) para todos los detalles técnicos.

📦 [Ver ejemplos de Factura completos](/docs/jsons-billing/invoices)

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "{{url}}/invoice" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "resolution_number": "18764074347312",
    "prefix": "LZT",
    "document_number": "836",
    "operation_type_id": 1,
    "type_document_id": 1,
    "payments": [{"payment_method_id": 1, "means_payment_id": 10, "value_paid": "224.00"}],
    "customer": { "company_name": "Cliente Ejemplo", "dni": "1063279307", "email": "cliente@correo.com" },
    "lines": [{"invoiced_quantity": "1", "line_extension_amount": "200.00", "description": "Producto", "price_amount": "200.00", "base_quantity": "1"}],
    "legal_monetary_totals": {"line_extension_amount": "200.00", "tax_exclusive_amount": "200.00", "tax_inclusive_amount": "224.00", "payable_amount": "224.00"}
  }'
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
const response = await axios.post(`${url}/invoice`, payload, {
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const cufe = response.data.XmlDocumentKey;
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$response = $client->post("{$url}/invoice", [
    'headers' => [
        'Authorization' => "Bearer {$token}",
        'Content-Type'  => 'application/json',
    ],
    'json' => $payload,
]);
$cufe = json_decode($response->getBody())->XmlDocumentKey;
```

</TabItem>
</Tabs>

:::tip Cómo leer la respuesta
El HTTP `200` con `success: true` indica que **la DIAN respondió**, no que haya aceptado el documento. El resultado fiscal está en `response.IsValid` y `response.StatusCode`: el documento es válido solo con `IsValid: "true"` y `StatusCode: "00"`. Un rechazo de la DIAN también llega con HTTP `200` (ver abajo). El HTTP `422` se reserva para errores de validación del JSON enviado.
:::

<details>
<summary>✅ Respuesta Exitosa — Producción (HTTP 200)</summary>

```json
{
  "uuid": "0b96bb6e-7dd0-11f0-ba9f-f02f74cac485",
  "message": "Solicitud procesada por la DIAN.",
  "send_to_queue": 0,
  "XmlDocumentKey": "ad20e8c21f359c96389fb254104fe2282b0c9d0a1be8e651d09b73b927f267dfe0a07fc03b10b6f068e7d7ab1b15bcbc",
  "response": {
    "ErrorMessage": {},
    "IsValid": "true",
    "StatusCode": "00",
    "StatusDescription": "Procesado Correctamente.",
    "StatusMessage": "La Factura Electrónica LZT836, ha sido autorizada.",
    "XmlDocumentKey": "ad20e8c21f359c96389fb254104fe2282b0c9d0a1be8e651d09b73b927f267dfe0a07fc03b10b6f068e7d7ab1b15bcbc"
  },
  "XmlBase64Bytes": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4...",
  "AttachedDocument": {
    "pathZip": null,
    "path": "1/ad/ad09010914030002500000041.xml",
    "url": "https://sandbox-api.matias-api.com/attachments/1/ad/ad09010914030002500000041.xml",
    "data": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4..."
  },
  "qr": {
    "qrDian": "https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=ad20e8c2...",
    "url": "https://sandbox-api.matias-api.com/qr/1/QR-0b96bb6e-7dd0-11f0-ba9f-f02f74cac485.png",
    "path": "1/QR-0b96bb6e-7dd0-11f0-ba9f-f02f74cac485.png",
    "data": "iVBORw0KGgoAAAANSUhEUgAA..."
  },
  "pdf": null,
  "warnings": [],
  "success": true
}
```

| Campo | Descripción |
|---|---|
| `uuid` | Identificador del **envío** en la plataforma. Úsalo para consultar el documento o reintentar. Es distinto del `uuid` opcional que tú puedes enviar en el body (ver [Campos del Documento](/docs/billing-fields#uuid)). |
| `message` | En producción es `"Solicitud procesada por la DIAN."` tanto si la DIAN acepta como si rechaza. Cambia cuando se devuelve un documento que la DIAN ya había autorizado o aplica la regla 90 (ver [Advertencias](#warnings-emision)). |
| `XmlDocumentKey` | CUFE/CUDE del documento. |
| `response` | Respuesta de la DIAN: `IsValid`, `StatusCode`, `StatusDescription`, `StatusMessage`, `ErrorMessage`. |
| `AttachedDocument`, `qr`, `pdf` | Archivos generados después de la aceptación. `pdf` es `null` si no pediste `graphic_representation` ni `send_email`. En un rechazo son `null`. |
| `warnings` | Arreglo de objetos `code` + `message`. Vacío si todo salió bien. Un warning **nunca** significa reenviar. Ver [Advertencias](#warnings-emision). |

</details>

<details>
<summary>⚠️ Rechazo DIAN — Producción (HTTP 200, <code>IsValid: "false"</code>)</summary>

La DIAN respondió, pero rechazó el documento. La petición fue exitosa (`success: true`); corrige el JSON y vuelve a enviarlo con el **mismo número**.

```json
{
  "uuid": "0b96bb6e-7dd0-11f0-ba9f-f02f74cac485",
  "message": "Solicitud procesada por la DIAN.",
  "send_to_queue": 0,
  "XmlDocumentKey": "ad20e8c21f359c96389fb254104fe2282b0c9d0a1be8e651d09b73b927f267dfe0a07fc03b10b6f068e7d7ab1b15bcbc",
  "response": {
    "IsValid": "false",
    "StatusCode": "99",
    "StatusDescription": "Documento con errores en campos obligatorios.",
    "ErrorMessage": {
      "string": [
        "CAU04b: El campo TaxAmount es obligatorio cuando ExistsWithholdingTax es verdadero."
      ]
    },
    "XmlDocumentKey": "ad20e8c21f359c96389fb254104fe2282b0c9d0a1be8e651d09b73b927f267dfe0a07fc03b10b6f068e7d7ab1b15bcbc"
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

<details>
<summary>🧪 Respuesta en Habilitación (software en pruebas)</summary>

Mientras el software DIAN está en ambiente de habilitación, el documento se envía al set de pruebas de forma asíncrona y la respuesta tiene otra forma: no incluye `uuid`, `message`, `warnings` ni archivos generados. Consulta el resultado con el `ZipKey` en [`POST /status/zip/{trackId}`](/docs/endpoints/queries-status#consulta-estados).

```json
{
  "XmlDocumentKey": "ad20e8c21f359c96389fb254104fe2282b0c9d0a1be8e651d09b73b927f267dfe0a07fc03b10b6f068e7d7ab1b15bcbc",
  "ZipKey": "c2a7e8d1-4b3f-4e9a-9d2c-1f0b6a5e7d33",
  "response": {
    "ErrorMessageList": {},
    "ZipKey": "c2a7e8d1-4b3f-4e9a-9d2c-1f0b6a5e7d33"
  },
  "XmlDocumentName": "fv09010914030002500000041.xml",
  "ShippingMethod": "SendTestSetAsync",
  "XmlBase64Bytes": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4...",
  "success": true
}
```

</details>

Para los errores propios de la emisión (`409`, `503`, documento posiblemente enviado) consulta [Respuestas, advertencias y errores de emisión](#respuestas-emision).

</details>

---

## 2. Notas de Crédito y Débito {#notas-credito-debito}

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/notes/credit</b> — Enviar Nota Crédito</summary>

```http
POST {{url}}/notes/credit?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Casos:** Devoluciones, Descuentos globales, Correcciones hacia abajo.  
**Campo Clave:** `type_document_id: 5`

📦 [Ver ejemplos de Nota Crédito](/docs/jsons-billing/credit-note)

<details>
<summary>✅ Respuesta Exitosa — DIAN 200 OK</summary>

```json
{
  "uuid": "5c1f0a2e-7dd1-11f0-ba9f-f02f74cac485",
  "message": "Solicitud procesada por la DIAN.",
  "send_to_queue": 0,
  "XmlDocumentKey": "ad20e8c21f359c96389fb254104fe2282b0c9d0a1be8e651d09b73b927f267dfe0a07fc03b10b6f068e7d7ab1b15bcbc",
  "response": {
    "ErrorMessage": {},
    "IsValid": "true",
    "StatusCode": "00",
    "StatusDescription": "Procesado Correctamente.",
    "StatusMessage": "La Nota Crédito NC50, ha sido autorizada."
  },
  "XmlBase64Bytes": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4...",
  "AttachedDocument": {
    "pathZip": null,
    "path": "1/ad/ad09010914030002500000050.xml",
    "url": "https://sandbox-api.matias-api.com/attachments/1/ad/ad09010914030002500000050.xml",
    "data": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4..."
  },
  "qr": {
    "qrDian": "https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=ad20e8c2...",
    "url": "https://sandbox-api.matias-api.com/qr/1/QR-5c1f0a2e-7dd1-11f0-ba9f-f02f74cac485.png",
    "path": "1/QR-5c1f0a2e-7dd1-11f0-ba9f-f02f74cac485.png",
    "data": "iVBORw0KGgoAAAANSUhEUgAA..."
  },
  "pdf": null,
  "warnings": [],
  "success": true
}
```

La respuesta, el rechazo DIAN y los errores siguen las mismas reglas que `POST /invoice`. Ver [Respuestas, advertencias y errores de emisión](#respuestas-emision).

</details>

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/notes/debit</b> — Enviar Nota Débito</summary>

```http
POST {{url}}/notes/debit?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Casos:** Intereses, Cargos adicionales, Correcciones hacia arriba.  
**Campo Clave:** `type_document_id: 4`

</details>

---

## 3. Documentos Equivalentes (POS y Otros) {#documentos-equivalentes}

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/invoice</b> — POS Electrónico (Documento 20)</summary>

```http
POST {{url}}/invoice?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Casos:**
- POS con cliente (consumidor final u otros).
- POS sin envío de email.

**Campo Clave:** `type_document_id: 20`

📦 [Ver ejemplos de POS](/docs/jsons-pos/pos)

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/notes/credit | /notes/debit</b> — Notas para POS</summary>

```http
POST {{url}}/notes/credit?client_uuid={{client_uuid}}
POST {{url}}/notes/debit?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

Notas de crédito o débito asociadas a un documento P.O.S.

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/invoice</b> — Boleta de Ingreso a Cine (Documento 25)</summary>

```http
POST {{url}}/invoice?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

Documento equivalente para ingreso a cine (Documento 25).  
**Campo Clave:** `type_document_id: 25`

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/invoice</b> — SPD — Servicios Públicos Domiciliarios (Documento 60)</summary>

```http
POST {{url}}/invoice?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

Factura o documento equivalente por servicios públicos domiciliarios.  
**Campo Clave:** `type_document_id: 60`

</details>

---

## 4. Respuestas, advertencias y errores de emisión {#respuestas-emision}

Las reglas de esta sección aplican a `POST /invoice`, `POST /notes/credit`, `POST /notes/debit`, `POST /ds/document`, `POST /ds/adjustment-note` y a los endpoints de [Numeración Automática](/docs/endpoints/autoincrement) (`POST` y `PATCH /auto-increment/...`).

:::caution No reemitas a ciegas
Ante un `409`, un `503`, un error con `code: "DOCUMENT_POSSIBLY_SENT"` o una petición sin respuesta (timeout), **no generes un número nuevo**: el documento pudo llegar a la DIAN. Consulta su estado con [`GET /status`](/docs/endpoints/queries-status#consulta-estados) o `GET /documents/{uuid}` y, si hace falta, reintenta en unos minutos con el **mismo número**.
:::

### 🆕 Advertencias (`warnings`) {#warnings-emision}

En producción toda respuesta de emisión incluye `warnings`: un arreglo de objetos con `code` y `message`. Si la DIAN ya validó el documento y falla un paso posterior (AttachedDocument, PDF, correo), la respuesta **sigue siendo HTTP 200 de éxito** y el fallo se informa aquí. La respuesta de habilitación no incluye `warnings`.

| `code` | Cuándo ocurre | ¿Reenviar? |
|---|---|---|
| `ATTACHED_DOCUMENT_NOT_GENERATED` | La DIAN validó el documento, pero no se pudo generar el AttachedDocument (ni enviar el correo, si se pidió `send_email`). | ❌ No |
| `PDF_NOT_GENERATED` | La DIAN validó el documento, pero no se pudo generar la representación gráfica. | ❌ No |
| `EMAIL_NOT_SENT` | La DIAN validó el documento, pero no se pudo enviar el correo. | ❌ No |
| `ATTACHMENTS_NOT_LINKED` | El documento fue procesado, pero no se pudieron vincular sus adjuntos (`attachments`). | ❌ No, si el documento es válido |
| `ALREADY_AUTHORIZED_RECOVERED` | Solo producción. El número ya estaba autorizado por la DIAN y se devuelve ese documento (ver [Regla 90](#regla-90) y [Reintento de un número ya transmitido](#reintento-transmitido)). No descuenta documentos de tu plan (ver [Documento recuperado: sin cobro de consumo](#recuperado-sin-consumo)). | ❌ No |
| `ALREADY_AUTHORIZED_OTHER_CONTENT` | Solo producción, regla 90. La DIAN ya autorizó ese número con **otro contenido**; el documento enviado no se marcó como válido. | ❌ No con este número: consulta el documento autorizado |
| `ALREADY_PROCESSED_NOT_CONFIRMED` | Solo producción, regla 90. La DIAN indicó que el documento fue procesado anteriormente, pero no confirmó la autorización de la clave. | Consulta su estado antes de reenviarlo |

Los mensajes de `ATTACHED_DOCUMENT_NOT_GENERATED`, `PDF_NOT_GENERATED` y `EMAIL_NOT_SENT` terminan siempre en `No reenvíe el documento: ya es válido ante la DIAN.` Si el fallo se debe a una regla de negocio (por ejemplo, el límite de correos de tu plan), el mensaje incluye además `Motivo: ...`.

:::tip Un warning nunca significa reenviar
El documento de una respuesta con `warnings` ya tiene una respuesta de la DIAN. Reenviarlo no repara el paso que falló. Para obtener los archivos del documento usa los endpoints de [Consultas y Estados](/docs/endpoints/queries-status).
:::

<details>
<summary>📋 Ejemplo — documento validado con correo no enviado</summary>

```json
{
  "uuid": "0b96bb6e-7dd0-11f0-ba9f-f02f74cac485",
  "message": "Solicitud procesada por la DIAN.",
  "send_to_queue": 0,
  "XmlDocumentKey": "ad20e8c21f359c96389fb254104fe2282b0c9d0a1be8e651d09b73b927f267dfe0a07fc03b10b6f068e7d7ab1b15bcbc",
  "response": {
    "IsValid": "true",
    "StatusCode": "00",
    "StatusDescription": "Procesado Correctamente.",
    "StatusMessage": "La Factura Electrónica LZT836, ha sido autorizada."
  },
  "XmlBase64Bytes": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4...",
  "AttachedDocument": {
    "pathZip": null,
    "path": "1/ad/ad09010914030002500000041.xml",
    "url": "https://sandbox-api.matias-api.com/attachments/1/ad/ad09010914030002500000041.xml",
    "data": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4..."
  },
  "qr": {
    "qrDian": "https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=ad20e8c2...",
    "url": "https://sandbox-api.matias-api.com/qr/1/QR-0b96bb6e-7dd0-11f0-ba9f-f02f74cac485.png",
    "path": "1/QR-0b96bb6e-7dd0-11f0-ba9f-f02f74cac485.png",
    "data": "iVBORw0KGgoAAAANSUhEUgAA..."
  },
  "pdf": {
    "path": "1/fv09010914030002500000095.pdf",
    "url": "https://sandbox-api.matias-api.com/pdf/1/fv09010914030002500000095.pdf",
    "data": "JVBERi0xLjcKJeLjz9MK..."
  },
  "warnings": [
    {
      "code": "EMAIL_NOT_SENT",
      "message": "El documento fue validado por la DIAN, pero no se pudo enviar el correo. No reenvíe el documento: ya es válido ante la DIAN."
    }
  ],
  "success": true
}
```

</details>

### Regla 90 — "Documento procesado anteriormente" {#regla-90}

Solo en producción. Si la DIAN rechaza el envío con la regla 90, la API consulta en la DIAN el documento autorizado antes de responder:

| Resultado de la consulta | Respuesta |
|---|---|
| La DIAN tiene autorizado ese documento | HTTP `200` con el **documento autorizado** (`IsValid: "true"`) y el warning `ALREADY_AUTHORIZED_RECOVERED`. El `message` es: `La DIAN indicó que el documento {número} ya había sido procesado. Se recuperó el documento que la DIAN autorizó (CUFE/CUDE {clave}); no se generó uno nuevo.` |
| La DIAN autorizó ese número con otro contenido | Rechazo (HTTP `200`, `IsValid: "false"`) con el warning `ALREADY_AUTHORIZED_OTHER_CONTENT`; su texto también va en `message`. |
| La DIAN no confirma la clave | Rechazo (HTTP `200`, `IsValid: "false"`) con el warning `ALREADY_PROCESSED_NOT_CONFIRMED`; su texto también va en `message`. |
| La consulta falla (red, DIAN no disponible) | El rechazo llega tal como lo devolvió la DIAN, sin warning. |

### Reintento de un número ya transmitido {#reintento-transmitido}

Solo en producción. Cuando reenvías un número cuyo intento anterior se transmitió a la DIAN pero quedó sin validar (sin respuesta definitiva, en validación o interrumpido), la API **consulta primero la DIAN** en lugar de transmitir un XML nuevo con otro CUFE/CUDE:

| Estado en la DIAN del intento anterior | Respuesta |
|---|---|
| Autorizado con el mismo contenido (número, emisor, tipo, total, adquiriente y, en notas, la factura referenciada) | HTTP `200` con ese documento y el warning `ALREADY_AUTHORIZED_RECOVERED`: `El documento {número} ya estaba autorizado por la DIAN (CUFE/CUDE {clave}). Se devuelve ese documento y no se transmitió de nuevo.` |
| La DIAN aún lo está validando | HTTP `409` con `code: "DOCUMENT_IN_VALIDATION"`. No se transmite. |
| No se pudo confirmar el estado | HTTP `503` con `code: "DIAN_STATUS_UNAVAILABLE"`. No se transmite. |
| No autorizado, o autorizado con otro contenido | Se transmite normalmente. |

La consulta no se hace si la DIAN ya había rechazado esa misma clave. En los casos `409` y `503` el número sigue reservado para ese documento: reintenta en unos minutos con el mismo número.

### 🆕 Documento recuperado: sin cobro de consumo {#recuperado-sin-consumo}

Un documento que la DIAN ya tenía autorizado y que la API recupera (HTTP `200` con el warning `ALREADY_AUTHORIZED_RECOVERED`, por la [regla 90](#regla-90) o por la [consulta previa al reenvío](#reintento-transmitido)) queda válido **sin descontar documentos de tu plan**: ya se había emitido antes, por esta API o fuera de ella. Lo mismo ocurre cuando un documento queda válido más tarde, al consultar su estado en la DIAN.

Por eso, el número de documentos válidos de un periodo puede ser mayor que el consumo cobrado a tu plan.

### Códigos de error {#errores-emision}

| HTTP | `code` | Cuándo ocurre | Qué hacer |
|---|---|---|---|
| `400` | — | El documento con ese número ya está validado ante la DIAN (también si otro proceso lo validó mientras se transmitía este intento). `data` trae el registro del envío. | No lo reenvíes. Usa el documento existente. |
| `400` | — | Se envió `send_to_queue: 1` (el envío a cola aún no está habilitado). | Omite el campo. Para procesamiento asíncrono usa [`POST /bulk/documents`](/docs/endpoints/bulk-documents). |
| `409` | `DOCUMENT_IN_TRANSMISSION` | Otra petición está transmitiendo a la DIAN el mismo documento (empresa, tipo y número). Si ese proceso se interrumpe, el número queda bloqueado como máximo 5 minutos. | Consulta el estado antes de enviarlo de nuevo. |
| `409` | `DOCUMENT_IN_VALIDATION` | Solo producción. La DIAN aún valida un intento anterior de ese número. | Consulta el estado en unos minutos. |
| `409` | — | El `uuid` que enviaste en el body ya pertenece a otro documento de la empresa. En `POST /auto-increment/...` un `uuid` ya registrado responde antes `400` (ver [UUID ya usado](/docs/endpoints/autoincrement#uuid-ya-usado)). | Consulta ese documento o envía un `uuid` nuevo. |
| `422` | — | Error de validación del JSON (formato estándar con `message` y `errors`). | Corrige el campo indicado. |
| `503` | `DIAN_STATUS_UNAVAILABLE` | Solo producción. No se pudo confirmar en la DIAN el estado de un intento anterior de ese número. | Reintenta en unos minutos. |
| `500` (normalmente) | `DOCUMENT_POSSIBLY_SENT` | Falló algo después de iniciar la transmisión (timeout, error al guardar): la DIAN pudo haber recibido el documento. El número se conserva. | Consulta el estado con el `uuid` del envío (`data.uuid`) antes de cualquier reintento. |

Los errores `5xx` incluyen un campo `reference`: compártelo con soporte para ubicar el caso.

<details>
<summary>❌ 409 — <code>DOCUMENT_IN_TRANSMISSION</code></summary>

```json
{
  "code": "DOCUMENT_IN_TRANSMISSION",
  "message": "El documento LZT836 ya se está transmitiendo a la DIAN en otra solicitud; consulte su estado antes de enviarlo de nuevo.",
  "data": {
    "document_number": "LZT836"
  },
  "success": false
}
```

</details>

<details>
<summary>❌ 409 — <code>DOCUMENT_IN_VALIDATION</code></summary>

```json
{
  "code": "DOCUMENT_IN_VALIDATION",
  "message": "La DIAN aún está validando el documento LZT836 (CUFE/CUDE ad20e8c21f35...). No se transmitió de nuevo: consulte su estado en unos minutos antes de reenviarlo.",
  "data": {
    "uuid": "0b96bb6e-7dd0-11f0-ba9f-f02f74cac485",
    "document_number": "LZT836",
    "document_key": "ad20e8c21f35..."
  },
  "success": false
}
```

</details>

<details>
<summary>❌ 503 — <code>DIAN_STATUS_UNAVAILABLE</code></summary>

```json
{
  "success": false,
  "code": "DIAN_STATUS_UNAVAILABLE",
  "message": "No se pudo confirmar en la DIAN el estado del envío anterior del documento LZT836 (CUFE/CUDE ad20e8c21f35...). No se transmitió de nuevo para no duplicarlo: intente en unos minutos.",
  "data": {
    "uuid": "0b96bb6e-7dd0-11f0-ba9f-f02f74cac485",
    "document_number": "LZT836",
    "document_key": "ad20e8c21f35..."
  }
}
```

</details>

<details>
<summary>❌ 500 — <code>DOCUMENT_POSSIBLY_SENT</code></summary>

```json
{
  "success": false,
  "message": "No se obtuvo una respuesta definitiva para el documento LZT836 y es posible que la DIAN lo haya recibido. No lo emita de nuevo: consulte su estado con el uuid del envío antes de cualquier reintento. Detalle: Error interno del servidor.",
  "reference": "3f2b6c1e-9a4d-4e7b-8c21-5d0f7a9e1b42",
  "code": "DOCUMENT_POSSIBLY_SENT",
  "data": {
    "uuid": "0b96bb6e-7dd0-11f0-ba9f-f02f74cac485",
    "document_number": "LZT836"
  }
}
```

</details>

<details>
<summary>❌ 409 — <code>uuid</code> ya usado en otro documento</summary>

```json
{
  "success": false,
  "message": "El uuid proporcionado ya se usó en otro documento de la empresa. No se emitió de nuevo: consulte ese documento o envíe un uuid nuevo."
}
```

</details>

<details>
<summary>❌ 400 — Envío a cola no habilitado</summary>

```json
{
  "success": false,
  "message": "El envío a cola de procesamiento aún no está habilitado."
}
```

</details>
