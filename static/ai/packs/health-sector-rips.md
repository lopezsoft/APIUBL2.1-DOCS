# MATIAS API UBL 2.1 — Paquete de Contexto IA: Sector Salud y RIPS (Resolución 000948 de 2026)

> Campos obligatorios del Sector Salud, interoperabilidad RIPS, facturación de servicios médicos, copagos y notas crédito de salud.

- **Versión API:** v3.10.0
- **URL del paquete:** https://docs.matias-api.com/ai/packs/health-sector-rips.md
- **Índice general IA:** https://docs.matias-api.com/llms.txt
- **Especificación OpenAPI 3:** https://docs.matias-api.com/openapi.json

## Páginas incluidas en este paquete

- [Facturación y Documentos Equivalentes (POS)](https://docs.matias-api.com/docs/endpoints/invoices-pos.md)
- [Campos de todos los documentos electrónicos](https://docs.matias-api.com/docs/billing-fields.md)
- [Respuestas de la API](https://docs.matias-api.com/docs/response-json.md)
- [Factura Electrónica del Sector Salud](https://docs.matias-api.com/docs/jsons-billing/invoice-health-sector.md)
- [Nota Crédito del Sector Salud](https://docs.matias-api.com/docs/jsons-billing/credit-note-health-sector.md)

---

<!-- Fuente: https://docs.matias-api.com/docs/endpoints/invoices-pos -->

# 📄 Facturación y Documentos Equivalentes (POS)

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

## 📋 Tipos de Documento Soportados

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

## 1. Emisión de Facturas

**POST /invoice — Enviar Factura Electrónica**

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

**Body:** JSON con estructura completa. Ver [Campos del Documento](https://docs.matias-api.com/docs/billing-fields.md) para todos los detalles técnicos.

📦 [Ver ejemplos de Factura completos](https://docs.matias-api.com/docs/jsons-billing/invoices)

**cURL**

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

**JavaScript (Axios)**

```js
const response = await axios.post(`${url}/invoice`, payload, {
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const cufe = response.data.XmlDocumentKey;
```

**PHP (Guzzle)**

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

:::tip Cómo leer la respuesta
El HTTP `200` con `success: true` indica que **la DIAN respondió**, no que haya aceptado el documento. El resultado fiscal está en `response.IsValid` y `response.StatusCode`: el documento es válido solo con `IsValid: "true"` y `StatusCode: "00"`. Un rechazo de la DIAN también llega con HTTP `200` (ver abajo). El HTTP `422` se reserva para errores de validación del JSON enviado.
:::

**✅ Respuesta Exitosa — Producción (HTTP 200)**

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
| `uuid` | Identificador del **envío** en la plataforma. Úsalo para consultar el documento o reintentar. Es distinto del `uuid` opcional que tú puedes enviar en el body (ver [Campos del Documento](https://docs.matias-api.com/docs/billing-fields#uuid)). |
| `message` | En producción es `"Solicitud procesada por la DIAN."` tanto si la DIAN acepta como si rechaza. Cambia cuando se devuelve un documento que la DIAN ya había autorizado o aplica la regla 90 (ver [Advertencias](https://docs.matias-api.com/docs/endpoints/invoices-pos#warnings-emision)). |
| `XmlDocumentKey` | CUFE/CUDE del documento. |
| `response` | Respuesta de la DIAN: `IsValid`, `StatusCode`, `StatusDescription`, `StatusMessage`, `ErrorMessage`. |
| `AttachedDocument`, `qr`, `pdf` | Archivos generados después de la aceptación. `pdf` es `null` si no pediste `graphic_representation` ni `send_email`. En un rechazo son `null`. |
| `warnings` | Arreglo de objetos `code` + `message`. Vacío si todo salió bien. Un warning **nunca** significa reenviar. Ver [Advertencias](https://docs.matias-api.com/docs/endpoints/invoices-pos#warnings-emision). |

**⚠️ Rechazo DIAN — Producción (HTTP 200, `IsValid: "false"`)**

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

**🧪 Respuesta en Habilitación (software en pruebas)**

Mientras el software DIAN está en ambiente de habilitación, el documento se envía al set de pruebas de forma asíncrona y la respuesta tiene otra forma: no incluye `uuid`, `message`, `warnings` ni archivos generados. Consulta el resultado con el `ZipKey` en [`POST /status/zip/{trackId}`](https://docs.matias-api.com/docs/endpoints/queries-status#consulta-estados).

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

Para los errores propios de la emisión (`409`, `503`, documento posiblemente enviado) consulta [Respuestas, advertencias y errores de emisión](https://docs.matias-api.com/docs/endpoints/invoices-pos#respuestas-emision).

---

## 2. Notas de Crédito y Débito

**POST /notes/credit — Enviar Nota Crédito**

```http
POST {{url}}/notes/credit?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Casos:** Devoluciones, Descuentos globales, Correcciones hacia abajo.  
**Campo Clave:** `type_document_id: 5`

📦 [Ver ejemplos de Nota Crédito](https://docs.matias-api.com/docs/jsons-billing/credit-note.md)

**✅ Respuesta Exitosa — DIAN 200 OK**

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

La respuesta, el rechazo DIAN y los errores siguen las mismas reglas que `POST /invoice`. Ver [Respuestas, advertencias y errores de emisión](https://docs.matias-api.com/docs/endpoints/invoices-pos#respuestas-emision).

**POST /notes/debit — Enviar Nota Débito**

```http
POST {{url}}/notes/debit?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Casos:** Intereses, Cargos adicionales, Correcciones hacia arriba.  
**Campo Clave:** `type_document_id: 4`

---

## 3. Documentos Equivalentes (POS y Otros)

**POST /invoice — POS Electrónico (Documento 20)**

```http
POST {{url}}/invoice?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Casos:**
- POS con cliente (consumidor final u otros).
- POS sin envío de email.

**Campo Clave:** `type_document_id: 20`

📦 [Ver ejemplos de POS](https://docs.matias-api.com/docs/jsons-pos/pos.md)

**POST /notes/credit | /notes/debit — Notas para POS**

```http
POST {{url}}/notes/credit?client_uuid={{client_uuid}}
POST {{url}}/notes/debit?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

Notas de crédito o débito asociadas a un documento P.O.S.

**POST /invoice — Boleta de Ingreso a Cine (Documento 25)**

```http
POST {{url}}/invoice?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

Documento equivalente para ingreso a cine (Documento 25).  
**Campo Clave:** `type_document_id: 25`

**POST /invoice — SPD — Servicios Públicos Domiciliarios (Documento 60)**

```http
POST {{url}}/invoice?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

Factura o documento equivalente por servicios públicos domiciliarios.  
**Campo Clave:** `type_document_id: 60`

---

## 4. Respuestas, advertencias y errores de emisión

Las reglas de esta sección aplican a `POST /invoice`, `POST /notes/credit`, `POST /notes/debit`, `POST /ds/document`, `POST /ds/adjustment-note` y a los endpoints de [Numeración Automática](https://docs.matias-api.com/docs/endpoints/autoincrement.md) (`POST` y `PATCH /auto-increment/...`).

:::caution No reemitas a ciegas
Ante un `409`, un `503`, un error con `code: "DOCUMENT_POSSIBLY_SENT"` o una petición sin respuesta (timeout), **no generes un número nuevo**: el documento pudo llegar a la DIAN. Consulta su estado con [`GET /status`](https://docs.matias-api.com/docs/endpoints/queries-status#consulta-estados) o `GET /documents/{uuid}` y, si hace falta, reintenta en unos minutos con el **mismo número**.
:::

### 🆕 Advertencias (`warnings`)

En producción toda respuesta de emisión incluye `warnings`: un arreglo de objetos con `code` y `message`. Si la DIAN ya validó el documento y falla un paso posterior (AttachedDocument, PDF, correo), la respuesta **sigue siendo HTTP 200 de éxito** y el fallo se informa aquí. La respuesta de habilitación no incluye `warnings`.

| `code` | Cuándo ocurre | ¿Reenviar? |
|---|---|---|
| `ATTACHED_DOCUMENT_NOT_GENERATED` | La DIAN validó el documento, pero no se pudo generar el AttachedDocument (ni enviar el correo, si se pidió `send_email`). | ❌ No |
| `PDF_NOT_GENERATED` | La DIAN validó el documento, pero no se pudo generar la representación gráfica. | ❌ No |
| `EMAIL_NOT_SENT` | La DIAN validó el documento, pero no se pudo enviar el correo. | ❌ No |
| `ATTACHMENTS_NOT_LINKED` | El documento fue procesado, pero no se pudieron vincular sus adjuntos (`attachments`). | ❌ No, si el documento es válido |
| `ALREADY_AUTHORIZED_RECOVERED` | Solo producción. El número ya estaba autorizado por la DIAN y se devuelve ese documento (ver [Regla 90](https://docs.matias-api.com/docs/endpoints/invoices-pos#regla-90) y [Reintento de un número ya transmitido](https://docs.matias-api.com/docs/endpoints/invoices-pos#reintento-transmitido)). No descuenta documentos de tu plan (ver [Documento recuperado: sin cobro de consumo](https://docs.matias-api.com/docs/endpoints/invoices-pos#recuperado-sin-consumo)). | ❌ No |
| `ALREADY_AUTHORIZED_OTHER_CONTENT` | Solo producción, regla 90. La DIAN ya autorizó ese número con **otro contenido**; el documento enviado no se marcó como válido. | ❌ No con este número: consulta el documento autorizado |
| `ALREADY_PROCESSED_NOT_CONFIRMED` | Solo producción, regla 90. La DIAN indicó que el documento fue procesado anteriormente, pero no confirmó la autorización de la clave. | Consulta su estado antes de reenviarlo |

Los mensajes de `ATTACHED_DOCUMENT_NOT_GENERATED`, `PDF_NOT_GENERATED` y `EMAIL_NOT_SENT` terminan siempre en `No reenvíe el documento: ya es válido ante la DIAN.` Si el fallo se debe a una regla de negocio (por ejemplo, el límite de correos de tu plan), el mensaje incluye además `Motivo: ...`.

:::tip Un warning nunca significa reenviar
El documento de una respuesta con `warnings` ya tiene una respuesta de la DIAN. Reenviarlo no repara el paso que falló. Para obtener los archivos del documento usa los endpoints de [Consultas y Estados](https://docs.matias-api.com/docs/endpoints/queries-status.md).
:::

**📋 Ejemplo — documento validado con correo no enviado**

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

### Regla 90 — "Documento procesado anteriormente"

Solo en producción. Si la DIAN rechaza el envío con la regla 90, la API consulta en la DIAN el documento autorizado antes de responder:

| Resultado de la consulta | Respuesta |
|---|---|
| La DIAN tiene autorizado ese documento | HTTP `200` con el **documento autorizado** (`IsValid: "true"`) y el warning `ALREADY_AUTHORIZED_RECOVERED`. El `message` es: `La DIAN indicó que el documento {número} ya había sido procesado. Se recuperó el documento que la DIAN autorizó (CUFE/CUDE {clave}); no se generó uno nuevo.` |
| La DIAN autorizó ese número con otro contenido | Rechazo (HTTP `200`, `IsValid: "false"`) con el warning `ALREADY_AUTHORIZED_OTHER_CONTENT`; su texto también va en `message`. |
| La DIAN no confirma la clave | Rechazo (HTTP `200`, `IsValid: "false"`) con el warning `ALREADY_PROCESSED_NOT_CONFIRMED`; su texto también va en `message`. |
| La consulta falla (red, DIAN no disponible) | El rechazo llega tal como lo devolvió la DIAN, sin warning. |

### Reintento de un número ya transmitido

Solo en producción. Cuando reenvías un número cuyo intento anterior se transmitió a la DIAN pero quedó sin validar (sin respuesta definitiva, en validación o interrumpido), la API **consulta primero la DIAN** en lugar de transmitir un XML nuevo con otro CUFE/CUDE:

| Estado en la DIAN del intento anterior | Respuesta |
|---|---|
| Autorizado con el mismo contenido (número, emisor, tipo, total, adquiriente y, en notas, la factura referenciada) | HTTP `200` con ese documento y el warning `ALREADY_AUTHORIZED_RECOVERED`: `El documento {número} ya estaba autorizado por la DIAN (CUFE/CUDE {clave}). Se devuelve ese documento y no se transmitió de nuevo.` |
| La DIAN aún lo está validando | HTTP `409` con `code: "DOCUMENT_IN_VALIDATION"`. No se transmite. |
| No se pudo confirmar el estado | HTTP `503` con `code: "DIAN_STATUS_UNAVAILABLE"`. No se transmite. |
| No autorizado, o autorizado con otro contenido | Se transmite normalmente. |

La consulta no se hace si la DIAN ya había rechazado esa misma clave. En los casos `409` y `503` el número sigue reservado para ese documento: reintenta en unos minutos con el mismo número.

### 🆕 Documento recuperado: sin cobro de consumo

Un documento que la DIAN ya tenía autorizado y que la API recupera (HTTP `200` con el warning `ALREADY_AUTHORIZED_RECOVERED`, por la [regla 90](https://docs.matias-api.com/docs/endpoints/invoices-pos#regla-90) o por la [consulta previa al reenvío](https://docs.matias-api.com/docs/endpoints/invoices-pos#reintento-transmitido)) queda válido **sin descontar documentos de tu plan**: ya se había emitido antes, por esta API o fuera de ella. Lo mismo ocurre cuando un documento queda válido más tarde, al consultar su estado en la DIAN.

Por eso, el número de documentos válidos de un periodo puede ser mayor que el consumo cobrado a tu plan.

### Códigos de error

| HTTP | `code` | Cuándo ocurre | Qué hacer |
|---|---|---|---|
| `400` | — | El documento con ese número ya está validado ante la DIAN (también si otro proceso lo validó mientras se transmitía este intento). `data` trae el registro del envío. | No lo reenvíes. Usa el documento existente. |
| `400` | — | Se envió `send_to_queue: 1` (el envío a cola aún no está habilitado). | Omite el campo. Para procesamiento asíncrono usa [`POST /bulk/documents`](https://docs.matias-api.com/docs/endpoints/bulk-documents.md). |
| `409` | `DOCUMENT_IN_TRANSMISSION` | Otra petición está transmitiendo a la DIAN el mismo documento (empresa, tipo y número). Si ese proceso se interrumpe, el número queda bloqueado como máximo 5 minutos. | Consulta el estado antes de enviarlo de nuevo. |
| `409` | `DOCUMENT_IN_VALIDATION` | Solo producción. La DIAN aún valida un intento anterior de ese número. | Consulta el estado en unos minutos. |
| `409` | — | El `uuid` que enviaste en el body ya pertenece a otro documento de la empresa. En `POST /auto-increment/...` un `uuid` ya registrado responde antes `400` (ver [UUID ya usado](https://docs.matias-api.com/docs/endpoints/autoincrement#uuid-ya-usado)). | Consulta ese documento o envía un `uuid` nuevo. |
| `422` | — | Error de validación del JSON (formato estándar con `message` y `errors`). | Corrige el campo indicado. |
| `503` | `DIAN_STATUS_UNAVAILABLE` | Solo producción. No se pudo confirmar en la DIAN el estado de un intento anterior de ese número. | Reintenta en unos minutos. |
| `500` (normalmente) | `DOCUMENT_POSSIBLY_SENT` | Falló algo después de iniciar la transmisión (timeout, error al guardar): la DIAN pudo haber recibido el documento. El número se conserva. | Consulta el estado con el `uuid` del envío (`data.uuid`) antes de cualquier reintento. |

Los errores `5xx` incluyen un campo `reference`: compártelo con soporte para ubicar el caso.

**❌ 409 — `DOCUMENT_IN_TRANSMISSION`**

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

**❌ 409 — `DOCUMENT_IN_VALIDATION`**

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

**❌ 503 — `DIAN_STATUS_UNAVAILABLE`**

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

**❌ 500 — `DOCUMENT_POSSIBLY_SENT`**

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

**❌ 409 — `uuid` ya usado en otro documento**

```json
{
  "success": false,
  "message": "El uuid proporcionado ya se usó en otro documento de la empresa. No se emitió de nuevo: consulte ese documento o envíe un uuid nuevo."
}
```

**❌ 400 — Envío a cola no habilitado**

```json
{
  "success": false,
  "message": "El envío a cola de procesamiento aún no está habilitado."
}
```

---

<!-- Fuente: https://docs.matias-api.com/docs/billing-fields -->

# 📋 Campos de todos los documentos electrónicos

**📖 Referencia Completa de Campos**  

En esta sección se describen **todos los campos** que se deben considerar para la generación de factura electrónica, nota de crédito y nota de débito, documento soporte y documento equivalente, con sus respectivas notas de ajuste.

📄

**Factura Electrónica**  

Tipos 7, 8, 9, 10

📝

**Notas de Ajuste**  

Crédito (5) / Débito (4)

🏪

**POS Electrónico**  

Tipo 20

📑

**Documento Soporte**  

Tipo 11

---

## 🎯 Referencia Rápida de Tipos de Documento

#### ⚠️ IMPORTANTE: IDs del API vs Códigos DIAN

Los valores en la columna **ID (API)** son los que debes usar en `type_document_id`. El **Code (DIAN)** es solo para referencia con la normativa DIAN.  

**🔑 REGLA DE ORO:** En el API **SIEMPRE** usas el `ID de la DB`, **NUNCA** el code DIAN.

| ID (API) | Code (DIAN) | Tipo                            | Descripción                             | Normativa | Notas                                                                 |
| -------- | ----------- | ------------------------------- | --------------------------------------- | --------- | --------------------------------------------------------------------- |
| **7**    | 01          | Factura de Venta                | Documento estándar de venta             | Res. 165  | `type_document_id: 7`                                                 |
| **8**    | 02          | Factura de Exportación          | Factura para operaciones con exterior   | Res. 165  | `type_document_id: 8`                                                 |
| **9**    | 03          | Factura de Contingencia Tipo 03 | Emitida cuando falla conexión DIAN      | Res. 165  | **`type_document_id: 9`** ⚠️ Requiere `additional_document_reference` |
| **10**   | 04          | Factura de Contingencia Tipo 04 | Protocolo alternativo especial          | Res. 165  | **`type_document_id: 10`** - Opcional `additional_document_reference` |
| **11**   | 05          | Documento Soporte               | Para servicios y operaciones especiales | Res. 165  | `type_document_id: 11`                                                |
| **20**   | 20          | Documento Equivalente POS       | Factura de Punto de Venta               | Res. 165  | **`type_document_id: 20`** ⚠️ Requiere `point_of_sale`                |
| **5**    | 91          | Nota Crédito                    | Devolución o descuento                  | Res. 165  | `type_document_id: 5` ⚠️ Genera CUDE                                  |
| **4**    | 92          | Nota Débito                     | Ajuste por aumento                      | Res. 165  | `type_document_id: 4` ⚠️ Genera CUDE                                  |

---

## ✅ Compatibilidad de Campos por Tipo

**📊 Matriz de Compatibilidad:** Verifica qué campos son obligatorios (🔴), opcionales (🟢) o condicionales (🟡) según el tipo de documento.

| Campo                           | Factura (1,2) | Contingencia (3,4) | Documento Soporte (7) | POS (9) | Nota Crédito (91) | Nota Débito (92) |
| ------------------------------- | :-----------: | :----------------: | :-------------------: | :-----: | :---------------: | :--------------: |
| `resolution_number`             |      🔴       |         🔴         |          🔴           |   🔴    |        🔴         |        🔴        |
| `prefix`                        |      🔴       |         🔴         |          🔴           |   🔴    |        🔴         |        🔴        |
| `date`                          |      🟢       |         🟢         |          🟢           |   🟢    |        🟢         |        🟢        |
| `document_number`               |      🔴       |         🔴         |          🔴           |   🔴    |        🔴         |        🔴        |
| `operation_type_id`             |      🔴       |         🔴         |          🔴           |   🔴    |        🔴         |        🔴        |
| `type_document_id`              |      🔴       |         🔴         |          🔴           |   🔴    |        🔴         |        🔴        |
| `payments`                      |      🔴       |         🔴         |          🔴           |   🔴    |        🔴         |        🔴        |
| `customer`                      |      🔴       |         🔴         |          🔴           |   🔴    |        🔴         |        🔴        |
| `legal_monetary_totals`         |      🔴       |         🔴         |          🔴           |   🔴    |        🔴         |        🔴        |
| `lines`                         |      🔴       |         🔴         |          🔴           |   🔴    |        🔴         |        🔴        |
| `additional_document_reference` |      🟢       |         🔴         |          🟢           |   🟢    |        🟢         |        🟢        |
| `point_of_sale`                 |      🟢       |         🟢         |          🟢           |   🔴    |        🟢         |        🟢        |
| `billing_reference`             |      🟢       |         🟢         |          🟢           |   🟢    |        🔴         |        🔴        |
| `order_reference`               |      🟢       |         🟢         |          🟢           |   🟢    |        🟢         |        🟢        |
| `notes`                         |      🟢       |         🟢         |          🟢           |   🟢    |        🟢         |        🟢        |
| `shareholders`                  |      🟢       |         🟢         |          🟢           |   🟢    |        🟢         |        🟢        |

🔴 **Obligatorio**

🟢 **Opcional**

🟡 **Condicional**

---

## 🔧 Referencia de Campos

:::info Guía de Uso
A continuación se describe el uso detallado de cada campo del request body. Los campos están agrupados por función para facilitar la navegación.
:::

### `resolution_number` 🔴

Número de resolución de facturación asignado por la DIAN. Debe coincidir exactamente con el valor configurado en el portal web del proveedor tecnológico. _Este campo es obligatorio_ para todos los documentos y debe ser un string.

### `prefix` 🟡

Prefijo asociado a la resolución de facturación. Identifica la serie o rango del documento (ej. `"FEV"`, `"NC"`, `"DS"`). _Este campo es condicional_: obligatorio cuando la resolución tiene prefijo configurado. Debe ser un string.

### `date` 🟢

Fecha de emisión del documento. _Este campo es opcional_. Si no se envía, la API asigna la **fecha actual del servidor**. Debe ser un string en formato **`YYYY-MM-DD`** (ej. `"2025-05-25"`).

### `expiration_date` 🟢

Fecha de vencimiento del documento. _Este campo es opcional_ y debe ser un string en formato **`YYYY-MM-DD`**. Se utiliza principalmente en documentos equivalentes electrónicos y debe corresponder con las fechas negociadas o acordadas de pago.

### `time` 🟢

Hora de emisión del documento. _Este campo es opcional_. Si no se envía, la API asigna la **hora actual del servidor**. Debe ser un string en formato **`HH:mm:ss`** (ej. `"14:30:00"`).

### `notes` 🟢

Notas u observaciones adicionales a nivel de encabezado del documento. Se incluye en el XML como `cbc:Note` (en facturas, documento soporte, POS y **notas crédito y débito, incluidas las de POS**) y se imprime en la representación gráfica (PDF). _Este campo es opcional_ y debe ser un string. Acepta texto libre de cualquier longitud.

### `document_number` 🔴

Número consecutivo del documento **sin prefijo**. _Este campo es obligatorio_ para todos los documentos. Debe ser un número entero (ej. `990000001`). Este número debe estar dentro del rango autorizado por la resolución DIAN vigente.

:::note Numeración automática
En los endpoints `/auto-increment/*` **no** se envía `document_number`: la plataforma lo asigna. Ver [Numeración Automática](https://docs.matias-api.com/docs/endpoints/autoincrement.md).
:::

### `uuid` 🟢 **NEW**

Identificador del documento **de tu lado** (anti-duplicados). _Este campo es opcional_ y va en la raíz del body. Se recomienda enviar un UUID (ej. `"3d6f1a8e-2b4c-4f7d-9e0a-6c1b5d8f2a47"`): la emisión no valida su formato, pero la consulta `GET /documents/{uuid}` sí exige un UUID válido.

El `uuid` se registra **antes** de transmitir el documento a la DIAN, de modo que un reintento con el mismo `uuid` no emite un documento distinto:

| Situación | Resultado |
|---|---|
| Reintentas el **mismo número** con el **mismo** `uuid` | Se procesa normalmente (no choca). |
| El `uuid` ya pertenece a **otro** documento de la empresa (`POST /invoice`, `/notes/*`, `/ds/*` y los `PATCH /auto-increment/*`) | HTTP `409`: `El uuid proporcionado ya se usó en otro documento de la empresa. No se emitió de nuevo: consulte ese documento o envíe un uuid nuevo.` El consecutivo no se consume. |
| El `uuid` ya fue usado y lo envías en `POST /auto-increment/*` | HTTP `400` con el estado del envío original. Ver [UUID ya usado](https://docs.matias-api.com/docs/endpoints/autoincrement#uuid-ya-usado). |
| La emisión falla antes de transmitir a la DIAN | El `uuid` se libera y puedes volver a usarlo. |

Puedes consultar el documento con `GET /documents/{uuid}` usando tu `uuid` o el `uuid` del envío que devuelve la respuesta de emisión.

- #### Ejemplo

```json
  "uuid": "3d6f1a8e-2b4c-4f7d-9e0a-6c1b5d8f2a47"
```

### `operation_type_id` 🔴

Se refiere al tipo de operación que afecta al documento. _Este campo es obligatorio_ para todos los documentos y debe ser un entero que corresponda al **ID** de la tabla `operation_types` del API.

:::warning IMPORTANTE
En el API siempre se envía el **ID** (columna izquierda), **NUNCA** el code DIAN. El valor más común es `1` (Estándar).
:::

**📄 Factura Electrónica y Documento Soporte**

| ID (API) | Code DIAN | Tipo de Operación | Uso |
|:--------:|:---------:|-------------------|-----|
| **1** | 10 | Estándar | ✅ Valor por defecto para la mayoría de facturas |
| **2** | 09 | Servicios AIU | Administración, Imprevistos y Utilidad |
| **3** | 11 | Mandatos | Operaciones de mandato ([ver `lines->mandate`](https://docs.matias-api.com/docs/billing-fields#lines-mandate)) |
| **4** | 12 | Transporte | Sector transporte |
| **5** | 14 | Notarios | Sector notarial |
| **6** | 15 | Compra Divisas | Operaciones de compra de divisas |
| **7** | 16 | Venta Divisas | Operaciones de venta de divisas |

**📑 Documento Soporte (Residente / No Residente)**

| ID (API) | Code DIAN | Tipo de Operación | Uso |
|:--------:|:---------:|-------------------|-----|
| **9** | 10 | Residente | Proveedor residente en Colombia |
| **10** | 11 | No Residente | Proveedor no residente — Requiere [`payment_exchange_rate`](https://docs.matias-api.com/docs/billing-fields#payment_exchange_rate-) |

**📝 Notas de Ajuste (Crédito / Débito)**

| ID (API) | Code DIAN | Tipo de Operación | Uso |
|:--------:|:---------:|-------------------|-----|
| **11** | 20 | Nota ajuste Doc. Equivalente POS | Ajuste al documento equivalente POS |
| **12** | 20 | Nota Crédito → Factura Electrónica | Referencia una factura electrónica existente |
| **13** | 24 | Nota Ajuste → FE Aceptada | Para facturas electrónicas de venta aceptadas |
| **14** | 30 | Nota Débito → Factura Electrónica | Referencia una factura electrónica existente |
| **15** | 22 | Nota Crédito sin referencia FE | Sin referencia a una factura electrónica |
| **16** | 32 | Nota Débito sin referencia FE | Sin referencia a una factura electrónica |

- #### Ejemplo

```json
  "operation_type_id": 1
```

### `type_document_id` 🔴

Se refiere al tipo de documento que se está enviando a la DIAN. _Este campo es obligatorio_ para todos los documentos y debe ser un **entero que corresponda al `id` de la tabla `accounting_documents` del API** (NO el `code` DIAN).

:::danger CRÍTICO
En el API **SIEMPRE** se usa el **`id`** de la base de datos (columna izquierda). **NUNCA** el `code` DIAN. Confundir estos valores es el error más común de integración.
:::

:::info Columnas de referencia
- **`id`** → Valor que se envía en `type_document_id`
- **`code`** → Código DIAN (solo referencia normativa)
- **`cufe_algorithm`** → Algoritmo de hash que genera la DIAN para el documento
- **`apply_notes`** → `1` si el documento acepta notas de crédito/débito
:::

**📄 Facturas Electrónicas**

| `id` | `code` | Documento | Algoritmo | Notas | Requisitos especiales |
|:----:|:------:|-----------|:---------:|:-----:|----------------------|
| **7** | 01 | Factura electrónica | CUFE-SHA384 | ✅ | — |
| **8** | 02 | Factura de Exportación | CUFE-SHA384 | ✅ | Requiere [`payment_exchange_rate`](https://docs.matias-api.com/docs/billing-fields#payment_exchange_rate-) |
| **9** | 03 | Factura por Contingencia Facturador | CUDE-SHA384 | ✅ | ⚠️ Requiere [`additional_document_reference`](https://docs.matias-api.com/docs/billing-fields#additional_document_reference-referencia-a-documento-adicional) |
| **10** | 04 | Factura por Contingencia DIAN | CUFE-SHA384 | ✅ | — |

**📑 Documento Soporte**

| `id` | `code` | Documento | Algoritmo | Notas | Requisitos especiales |
|:----:|:------:|-----------|:---------:|:-----:|----------------------|
| **11** | 05 | Documento de Soporte | CUDS-SHA384 | ✅ | Requiere `invoice_period` en cada línea |
| **15** | 95 | Nota de ajuste documento soporte | CUDS-SHA384 | ❌ | Requiere [`billing_reference`](https://docs.matias-api.com/docs/billing-fields#billing_reference-) |

**🏪 Documento Equivalente POS**

| `id` | `code` | Documento | Algoritmo | Notas | Requisitos especiales |
|:----:|:------:|-----------|:---------:|:-----:|----------------------|
| **20** | 20 | P.O.S Electrónico | CUDE-SHA384 | ✅ | ⚠️ Requiere [`point_of_sale`](https://docs.matias-api.com/docs/billing-fields#point_of_sale-) y [`software_manufacturer`](https://docs.matias-api.com/docs/billing-fields#software_manufacturer-) |
| **93** | 93 | Nota débito P.O.S Electrónico | CUDE-SHA384 | ❌ | Requiere [`billing_reference`](https://docs.matias-api.com/docs/billing-fields#billing_reference-) |
| **94** | 94 | Nota crédito P.O.S Electrónico | CUDE-SHA384 | ❌ | Requiere [`billing_reference`](https://docs.matias-api.com/docs/billing-fields#billing_reference-) con `scheme_name` |

**📝 Notas Crédito y Débito**

| `id` | `code` | Documento | Algoritmo | Requisitos especiales |
|:----:|:------:|-----------|:---------:|----------------------|
| **5** | 91 | Nota crédito | CUDE-SHA384 | Requiere [`discrepancy_response`](https://docs.matias-api.com/docs/billing-fields#discrepancy_response-) y [`billing_reference`](https://docs.matias-api.com/docs/billing-fields#billing_reference-) |
| **4** | 92 | Nota débito | CUDE-SHA384 | Requiere [`discrepancy_response`](https://docs.matias-api.com/docs/billing-fields#discrepancy_response-) y [`billing_reference`](https://docs.matias-api.com/docs/billing-fields#billing_reference-) |

**👷 Nómina Electrónica**

| `id` | `code` | Documento | Algoritmo | Notas |
|:----:|:------:|-----------|:---------:|:-----:|
| **13** | 102 | Documento Soporte Nómina Electrónica | CUNE-SHA384 | ✅ |
| **14** | 103 | Nota de Ajuste Nómina Electrónica | CUNE-SHA384 | ✅ |

**🔔 Eventos y Otros**

| `id` | `code` | Documento | Algoritmo | Descripción |
|:----:|:------:|-----------|:---------:|-------------|
| **12** | 96 | Eventos (ApplicationResponse) | CUDE-SHA384 | Acuse de recibo, aceptación/rechazo |
| **99** | 999 | Attached Document | CUDS-SHA384 | Documento adjunto |

**🎫 Otros Documentos Equivalentes (próximamente)**

| `id` | `code` | Documento | Estado |
|:----:|:------:|-----------|:------:|
| **25** | 25 | Boleta de ingreso a cine | 🔜 Inactivo |
| **27** | 27 | Boleta espectáculos públicos | 🔜 Inactivo |
| **30** | 30 | Juegos localizados y no localizados | 🔜 Inactivo |
| **35** | 35 | Tiquete transporte terrestre de pasajeros | 🔜 Inactivo |
| **40** | 40 | Cobro de peajes | 🔜 Inactivo |
| **45** | 45 | Extracto sociedades financieras y fondos | 🔜 Inactivo |
| **50** | 50 | Tiquete transporte aéreo de pasajeros | 🔜 Inactivo |
| **55** | 55 | Operación bolsa de valores y comodities | 🔜 Inactivo |
| **60** | 60 | Servicios públicos domiciliarios | 🔜 Inactivo |

- #### Ejemplo

```json
  "type_document_id": 7
```

**Consultar también:** [Referencia Rápida de Tipos de Documento](https://docs.matias-api.com/docs/billing-fields#-referencia-rápida-de-tipos-de-documento) | [Glosario: Contingencia](https://docs.matias-api.com/docs/glossary#contingencia)

### `graphic_representation` 🟢

Indicador para solicitar que la API genere el **PDF de representación gráfica** del documento. _Este campo es opcional_. Enviar `1` para generar el PDF, `0` o no enviar si no se requiere. Debe ser un entero.

- #### Ejemplo

```json
  "graphic_representation": 1
```

### `send_email` 🟢

Indicador para solicitar que la API **envíe automáticamente por email** el documento al cliente (al correo definido en `customer.email`). _Este campo es opcional_. Enviar `1` para enviar, `0` o no enviar si no se requiere. Debe ser un entero.

- #### Ejemplo

```json
"send_email": 1
```

### `currency_id` 🟢

ID de la moneda del documento (`cbc:DocumentCurrencyCode`). _Este campo es opcional_: si no se envía, la API asume **Peso Colombiano (COP)** (`id: 272`). Solo se debe enviar cuando el documento está en moneda extranjera. Debe ser un entero.

:::warning Importante
La moneda debe estar **habilitada en su cuenta** del proveedor tecnológico. Si envía un `currency_id` de una moneda no configurada en su cuenta, el API rechazará el documento. Consulte las monedas disponibles en el **ENDPOINT** `{{url}}/currencies`.
:::

**💱 Monedas activas**

| `id` | ISO | Moneda | Símbolo |
|:----:|:---:|--------|:-------:|
| **272** | COP | Peso Colombiano _(predeterminado)_ | $ |
| **188** | USD | Dólar Americano | $ |
| **213** | EUR | Euro | € |
| **277** | MXN | Peso Mexicano | $ |
| **270** | ARS | Peso Argentino | $ |
| **271** | CLP | Peso Chileno | $ |
| **194** | CAD | Dólar Canadiense | $ |
| **266** | PEN | Nuevo Sol (Perú) | S |
| **278** | UYU | Peso Uruguayo | $ |
| **274** | DOP | Peso Dominicano | R |
| **273** | CUP | Peso Cubano | $ |
| **225** | PYG | Guaraní (Paraguay) | ₲ |
| **165** | BOB | Boliviano (Bolivia) | B |
| **164** | VEF | Bolívar Fuerte (Venezuela) | B |
| **168** | CRC | Colón Costarricense | ₡ |
| **169** | SVC | Colón Salvadoreño | ₡ |
| **195** | GYD | Dólar de Guyana | G |

- #### Ejemplo

```json
"currency_id": 188
```

### `send_to_queue` 🟢

:::caution NO IMPLEMENTADO
Este campo **aún no está disponible**. No lo envíe: con `send_to_queue: 1` la emisión **se rechaza** con HTTP `400` y no se consume el consecutivo.

```json
{
  "success": false,
  "message": "El envío a cola de procesamiento aún no está habilitado."
}
```

Para procesamiento asíncrono use [`POST /bulk/documents`](https://docs.matias-api.com/docs/endpoints/bulk-documents.md).
:::

Indicador reservado para enviar el documento a una cola de procesamiento asíncrono. Omítalo o envíe `0`. En la respuesta de emisión, `send_to_queue` siempre es `0`.

### `rounding` 🟢

Valor de redondeo aplicado al total del documento (`cbc:PayableRoundingAmount`). _Este campo es opcional_ y debe ser un string con valor flotante. Se utiliza principalmente en **Nómina Electrónica** para ajustar centavos o decimales en el total pagable.

:::info Uso principal
Este campo aplica para documentos de **Nómina Electrónica** (`type_document_id: 13, 14`). En facturación electrónica estándar generalmente no se requiere.
:::

### `attachments`: **NEW**

Archivos adjuntos opcionales cargados y vinculados al documento (máximo 4 archivos, almacenados de forma segura en Amazon S3). _Este campo es opcional (nullable)_ y debe ser un arreglo de objetos con los siguientes campos:

**💻 JSON de ejemplo**

```json
"attachments": [
  {
    "filename": "Soporte.pdf",
    "content": "JVBERi0xLjQKJeLjz9MKMyAwIG9iago...",
    "content_type": "application/pdf"
  }
]
```

**📎 Campos del adjunto**

| Campo | Tipo | Requerido | Descripción / Reglas |
|-------|------|-----------|----------------------|
| `filename` | `string` | ⚠️ Condicional | Nombre del archivo adjunto con extensión. **Obligatorio si se envía `attachments`**. Max: 255 chars. |
| `content` | `string` | ⚠️ Condicional | Contenido del archivo en base64. **Obligatorio si se envía `attachments`**. |
| `content_type` | `string` | Opcional | Tipo MIME del archivo (ej. `application/pdf`, `image/png`). Max: 100 chars. |

### `invoice_period` 🟢

Periodo de facturación del documento a nivel general (`cac:InvoicePeriod`). Diferente al `invoice_period` dentro de `lines`. _Este campo es opcional_ y debe ser un objeto.

:::tip ¿Cuándo se usa?
- **Documento Soporte** (`type_document_id: 11`): para indicar el periodo de prestación del servicio.
- **Sector Salud**: periodo de facturación del servicio médico.
- **Notas Crédito/Débito sin referencia a factura** (`operation_type_id: 15, 16`): obligatorio para indicar el periodo que cubre la nota.
:::

- #### Ejemplo

```json
"invoice_period": {
    "start_date": "2024-01-01",
    "start_time": "00:00:00",
    "end_date": "2024-01-31",
    "end_time": "23:59:59"
  }
```

- #### Detalle de los campos
  - #### `start_date`
Fecha de inicio del periodo. Formato `YYYY-MM-DD`.
  - #### `start_time`
Hora de inicio del periodo. Formato `HH:mm:ss`.
  - #### `end_date`
Fecha de fin del periodo. Formato `YYYY-MM-DD`.
  - #### `end_time`
Hora de fin del periodo. Formato `HH:mm:ss`.

### `deliveries`: **NEW**

Grupo de información de la entrega de bienes o prestación de servicios (`cac:Delivery`). _Este campo es opcional_ y debe ser un arreglo de objetos. Permite informar la dirección, fecha, transportador y contacto de la entrega física de mercancías.

**📦 Ejemplo JSON completo**

```json
"deliveries": [
    {
      "date": "2026-05-21",
      "time": "14:00:00",
      "address": "NORTE DE VIRGINIA H10",
      "country_id": "239",
      "delivery_party": {
        "identity_document_id": "10",
        "type_organization_id": 1,
        "tax_regime_id": 2,
        "tax_level_id": "5",
        "company_name": "Nombre de la empresa transportadora",
        "address": "cra prueba",
        "dni": "1019016005",
        "country_id": "45",
        "city_id": "149",
        "postal_code": "110121",
        "merchant_registration": "12454"
      },
      "delivery_contact": {
        "email": "cliente1@ejemplo.com",
        "mobile": "3164444444",
        "contact_name": "Nombre del contacto",
        "note": "Nota adicional de contacto"
      }
    }
  ]
```

**📍 Campos del delivery — Lugar y fecha de entrega**

| Campo | Tipo | Requerido | XPath UBL | Descripción |
|-------|:----:|:---------:|-----------|-------------|
| `date` | string | Opcional | `cbc:ActualDeliveryDate` | Fecha real o estimada de entrega. Formato `YYYY-MM-DD` |
| `time` | string | Opcional | `cbc:ActualDeliveryTime` | Hora real o estimada de entrega. Formato `HH:mm:ss` |
| `address` | string | **Sí** | `cac:DeliveryAddress` | Dirección del lugar de entrega |
| `country_id` | string | Opcional | `cac:Country` | ID del país de entrega. Por defecto `"45"` (Colombia). **Endpoint:** `{{url}}/countries` |
| `city_id` | string | ⚠️ Condicional | `cac:DeliveryAddress` | Ciudad/municipio de entrega. **Obligatorio si `country_id = "45"` (Colombia)**. **Endpoint:** `{{url}}/cities` |
| `postal_code` | string | ⚠️ Condicional | `cac:DeliveryAddress` | Código postal de entrega. **Obligatorio si `country_id = "45"` (Colombia)** |

:::warning Entregas en Colombia
Cuando el país de entrega es **Colombia** (`country_id: "45"`), los campos `city_id` y `postal_code` son **obligatorios**. La DIAN rechazará el documento si no se informan.
:::

**🏢 delivery_party — Transportador o parte que entrega**

Información fiscal y de identificación del transportador (`cac:DeliveryParty`). _Opcional_.

| Campo | Tipo | Requerido | Descripción |
|-------|:----:|:---------:|-------------|
| `identity_document_id` | string | **Sí** | Tipo de documento de identidad. **Endpoint:** `{{url}}/identity-documents` |
| `type_organization_id` | int | **Sí** | `1` = Persona Jurídica, `2` = Persona Natural |
| `company_name` | string | **Sí** | Razón social o nombre completo del transportador |
| `dni` | string | **Sí** | Número de identificación sin dígito de verificación |
| `tax_regime_id` | int | Opcional | Régimen fiscal. Por defecto `2` (No responsable de IVA). **Endpoint:** `{{url}}/accounting-regime` |
| `tax_level_id` | string | Opcional | Responsabilidad tributaria. Por defecto `"5"` (No aplica). **Endpoint:** `{{url}}/fiscal-regime` |
| `address` | string | Opcional | Dirección fiscal del transportador |
| `country_id` | string | Opcional | País del transportador. Por defecto `"45"` (Colombia) |
| `city_id` | string | ⚠️ Condicional | Ciudad/municipio. **Obligatorio si `country_id = "45"`**. **Endpoint:** `{{url}}/cities` |
| `postal_code` | string | ⚠️ Condicional | Código postal. **Obligatorio si `country_id = "45"`**. Por defecto `"000000"` |
| `merchant_registration` | string | Opcional | Matrícula mercantil (`cbc:CorporateRegistrationScheme`) |

**👤 delivery_contact — Contacto de la entrega**

Persona responsable de recibir o coordinar la entrega (`cac:Contact`). _Opcional_.

| Campo | Tipo | Requerido | Descripción |
|-------|:----:|:---------:|-------------|
| `contact_name` | string | Opcional | Nombre de la persona de contacto |
| `email` | string | Opcional | Correo electrónico de contacto |
| `mobile` | string | Opcional | Teléfono o celular de contacto |
| `note` | string | Opcional | Nota adicional sobre la entrega |

### `delivery_terms` 🟢

Términos de entrega o condiciones INCOTERM del documento. _Este campo es opcional_ y debe ser un objeto. Aplicable en facturas de exportación o cuando se negocian condiciones de entrega.

- #### Ejemplo

```json
"delivery_terms": {
    "delivery_id": "1",
    "terms": "FOB"
  }
```

- #### Detalle de los campos
  - #### `delivery_id`
ID de la condición de entrega. Puede consultar las diferentes condiciones en el **ENDPOINT** `{{url}}/delivery-conditions`.
  - #### `terms`
Texto descriptivo de los términos de entrega. _Este campo es opcional_ y debe ser un string.

### `despatch_document_references` 🟢

Referencias a documentos de despacho asociados al documento electrónico. _Este campo es opcional_ y debe ser un arreglo de objetos.

- #### Ejemplo

```json
"despatch_document_references": [
    {
      "number": "DESP-001",
      "date": "2024-02-28"
    }
  ]
```

- #### Detalle de los campos
  - #### `number`
Número del documento de despacho referenciado. _Obligatorio_ y debe ser un string.
  - #### `date`
Fecha del documento de despacho. Formato `YYYY-MM-DD`.

### `receipt_document_references` 🟢

Referencias a documentos de recepción asociados al documento electrónico. _Este campo es opcional_ y debe ser un arreglo de objetos.

- #### Ejemplo

```json
"receipt_document_references": [
    {
      "number": "REC-001",
      "date": "2024-03-01"
    }
  ]
```

- #### Detalle de los campos
  - #### `number`
Número del documento de recepción referenciado. _Obligatorio_ y debe ser un string.
  - #### `date`
Fecha del documento de recepción. Formato `YYYY-MM-DD`.

### `showroomInformation` 🟢

:::caution NO IMPLEMENTADO
Este campo **aún no está disponible** en la versión actual de la API. Se documenta como referencia para futuras versiones. No lo envíe en el request body, será ignorado.
:::

Información de la sala de ventas o punto de exhibición. _Este campo es opcional_ y debe ser un objeto. Utilizado cuando la venta se realiza en una ubicación diferente a la sede principal.

- #### Ejemplo

```json
"showroomInformation": {
    "showroom": "Sala de Ventas Norte",
    "showroomAddress": "Cra 15 #100-45 Local 201",
    "dataShow": "Información adicional de la sala"
  }
```

### `prepaid_payments` 🟢

Información de anticipos recibidos que se deben descontar del total a pagar del documento. _Este campo es opcional_ y debe ser un objeto.

- #### Ejemplo

```json
"prepaid_payments": {
    "id": "SFR3123856",
    "paid_amount": "10.00",
    "received_date": "2018-09-29",
    "paid_date": "2018-09-29",
    "instruction_id": "Prepago recibido"
  }
```

- #### Detalle de los campos
  - #### `id`
Identificador del anticipo o prepago. _Este campo es obligatorio_ y debe ser un string.
  - #### `paid_amount`
Monto del anticipo pagado. _Este campo es obligatorio_ y debe ser un string con valor flotante de máximo dos decimales.
  - #### `received_date`
Fecha en que se recibió el anticipo. _Este campo es obligatorio_ y debe ser un string en formato `YYYY-MM-DD`.
  - #### `paid_date`
Fecha en que se realizó el pago del anticipo. _Este campo es obligatorio_ y debe ser un string en formato `YYYY-MM-DD`.
  - #### `instruction_id`
Descripción o instrucción del prepago. _Este campo es opcional_ y debe ser un string.

### `payments` 🔴

Información de los pagos del documento. Define el método (contado/crédito), medio de pago y valor. Permite múltiples pagos. _Este campo es obligatorio_ para todos los documentos y debe ser un arreglo de objetos.

- #### Ejemplo

```json
"payments": [
    {
      "payment_method_id": 1,
      "means_payment_id": 10,
      "value_paid": "141100.00",
      "payment_due_date": "2024-02-22"
    }
  ]
```

- ### Detalle de los campos
  - #### `payment_method_id`
Método de pago: **`1`** = Contado, **`2`** = Crédito. _Este campo es obligatorio_ y debe ser un entero.
  - #### `means_payment_id`
Medio de pago (ej. `10` = Efectivo, `42` = Consignación bancaria, `47` = Transferencia). _Este campo es obligatorio_ y debe ser un entero.
Puede consultar todos los medios de pago disponibles en el **ENDPOINT** `{{url}}/payment-means`.
  - #### `value_paid`
Valor pagado. _Este campo es obligatorio_ para todos los documentos y debe ser un número flotante con máximo dos decimales, encerrado entre `""`.
  - #### `payment_due_date`
Fecha de vencimiento del pago. Este campo es usado para indicar la fecha de vencimiento de un pago a **crédito**.
**Es obligatorio solo para las ventas a crédito** y debe ser un string en formato `YYYY-MM-DD`.
  - #### `duration_measure`
Duración de la medida del pago en días. _Este campo es opcional_ y se utiliza para indicar la duración del periodo de pago a crédito. Debe ser un string.

### `report_header`: **NEW**

Plantilla para personalizar el encabezado y pie de página de la representación gráfica (PDF). La API renderiza dinámicamente los valores proporcionados sobre una plantilla prediseñada. _Este campo es opcional_ y debe ser un objeto.

:::info ¿Cómo funciona?
Se proporciona el `uuid` de una plantilla previamente creada en el sistema y un arreglo de `vars` con los valores a inyectar. La API busca la plantilla y reemplaza los marcadores de posición (placeholders) con los valores proporcionados.
:::

**🧩 Estructura del objeto**

| Campo | Tipo | Requerido | Descripción |
|-------|:----:|:---------:|-------------|
| `uuid` | string | **Sí** | UUID de la plantilla de diseño previamente creada en el sistema |
| `vars` | array | **Sí** | Lista de variables para reemplazar los placeholders de la plantilla |

**Cada objeto dentro de `vars`:**

| Campo | Tipo | Requerido | Descripción |
|-------|:----:|:---------:|-------------|
| `name` | string | **Sí** | Nombre del placeholder **sin llaves `{}`**. Ej: si el marcador es `{sucursal}`, enviar `"sucursal"` |
| `value` | string | **Sí** | Valor de texto o HTML que reemplazará el marcador. Se inserta tal cual en la plantilla |

**📦 Ejemplo JSON**

```json
"report_header": {
  "uuid": "101413670038274164",
  "vars": [
    {
      "name": "sucursal",
      "value": "Bodega Principal Cali"
    },
    {
      "name": "direccion",
      "value": "Zona Franca Palmaseca Bodega 5"
    },
    {
      "name": "celular",
      "value": "315 112 4411"
    }
  ]
}
```

### `due_diligence`: **NEW**

- Información para control cambiario
- **Control Cambiario - Debida Diligencia**. Los tipos de operación que se encuentran permitidos son los que se encuentran en la columna “Código” que están dentro de
la tabla 18.3 Control Cambiario - Debida Diligencia, ubicada en la Caja de Herramientas en la siguiente ruta
“Caja_de_herramientas_Factura_Electronica_Validacion_Previa.zip\Anexo Tecnico\Tablas Referenciadas”, en formato Excel “.xlsx”
- #### Ejemplo

```json
"due_diligence": {
  "code": "01"
}
```

- #### Tabla debida diligencia - Control cambiario
| Código | Descripción                                                                                     |
| ------ | ----------------------------------------------------------------------------------------------- |
| 01     | Debida Diligencia del Cliente – DDC General                                                     |
| 02     | Debida Diligencia del Cliente – DDC Reforzada                                                   |
| 03     | Debida diligencia intensificada por razón de la cuantía de las operaciones – DDC intensificada. |
| 04     | Debida Diligencia del Cliente – DDC simplificada                                                |

### `document_signature`: **NEW**

Información de la firma del documento. _Este campo es opcional_ y debe ser un objeto.

- #### Ejemplo

```json
"document_signature": {
    "cashier": "Nombre del cajero(a)",
    "seller": "Nombre del vendedor(a)"
  }
```

- #### Detalle de los campos
  - #### `cashier`
Nombre del cajero(a). _Este campo es opcional_ y debe ser un string.
  - #### `cashier_title`
Título o etiqueta que se muestra debajo de la firma del cajero en la representación gráfica. _Este campo es opcional_ y debe ser un string.
  - #### `seller`
Nombre del vendedor(a). _Este campo es opcional_ y debe ser un string.
  - #### `seller_title`
Título o etiqueta que se muestra debajo de la firma del vendedor en la representación gráfica. _Este campo es opcional_ y debe ser un string.

### `payment_exchange_rate` 🟡

Tasa de cambio aplicada al documento. _Este campo es obligatorio_ cuando `currency_id` indica una moneda extranjera (diferente a COP). Define la equivalencia entre la moneda extranjera y el Peso Colombiano. Debe ser un objeto.

- #### Ejemplo

```json
"payment_exchange_rate": {
    "exchange_rate": "3950.00",
    "rate_date": "2022-06-28",
    "currency_id": 188
  }
```

- #### Detalle de los campos
  - #### `exchange_rate`
Valor equivalente de **1 unidad de la moneda extranjera en Pesos Colombianos (COP)**. Por ejemplo, si el documento es en USD y 1 USD = 3950 COP, el valor debe ser `"3950.00"`. _Este campo es obligatorio_ y debe ser un string con valor flotante.
  - #### `rate_date`
Fecha de la tasa de cambio utilizada. _Este campo es obligatorio_ y debe ser un string en formato `YYYY-MM-DD`.
  - #### `currency_id`
ID de la moneda extranjera del documento. _Este campo es obligatorio_ y debe ser un entero. Consulte los valores en [`currency_id`](https://docs.matias-api.com/docs/billing-fields#currency_id-).

### `point_of_sale` 🟡

Información del punto de venta físico donde se realizó la transacción. _Este campo es obligatorio_ para documentos de tipo **P.O.S Electrónico** (`type_document_id = 20`) y debe ser un objeto.

**📦 Ejemplo JSON**

```json
"point_of_sale": {
    "cashier_name": "LEWIS LOPEZ",
    "terminal_number": "CJ001aB",
    "cashier_type": "Caja de apoyo",
    "sales_code": "POS01",
    "address": "Gilbarco Encore 4 L1 Mangue ra 17 AC",
    "sub_total": "2000.10"
  }
```

**🏪 Campos del punto de venta**

| Campo | Tipo | Descripción |
|-------|:----:|-------------|
| `cashier_name` | string | Nombre del cajero que realiza la venta |
| `terminal_number` | string | Número de terminal del punto de venta (ej. `"CJ001aB"`) |
| `cashier_type` | string | Tipo de caja (ej. `"GENÉRICA"`, `"Caja de apoyo"`) |
| `sales_code` | string | Código o ID de la venta (ej. `"POS01"`, `"45212"`) |
| `address` | string | Dirección física del punto de venta |
| `sub_total` | string | Subtotal de la venta (total sin IVA). Formato `"0.00"` |

:::info Todos los campos son **obligatorios** para `type_document_id = 20`.
:::

### `software_manufacturer` 🟡

Información del fabricante del software POS que generó el documento. _Este campo es obligatorio_ para documentos equivalentes P.O.S (`type_document_id = 20`) y debe ser un objeto.

- #### Ejemplo

```json
{
  "owner_name": "LEWIS LOPEZ GOMEZ",
  "company_name": "LOPEZSOFT SAS",
  "software_name": "SOFTWARE POS MATIAS APP"
}
```

- #### Detalle de los campos
  - #### `owner_name`
Nombre del propietario. _Este campo es obligatorio_ solo para los documentos equivalentes P.O.S y debe ser un string.
  - #### `company_name`
Nombre de la compañía. _Este campo es obligatorio_ solo para los documentos equivalentes P.O.S y debe ser un string.
  - #### `software_name`
Nombre del software. _Este campo es obligatorio_ solo para los documentos equivalentes P.O.S y debe ser un string.

### `order_reference` 🟢

Referencia de la orden de compra. _Este campo es opcional_ y debe ser usado de acuerdo al giro del documento. Debe ser un objeto.

**Diferencia con `additional_document_reference`:**

- Use `order_reference` para **UNA SOLA** orden de compra
- Use [`additional_document_reference`](https://docs.matias-api.com/docs/billing-fields#additional_document_reference-referencia-a-documento-adicional) para **MÚLTIPLES** documentos de referencia

- #### Ejemplo

```json
"order_reference": {
    "reference_number": "4545478787",
    "reference_date": "2021-05-19"
  }
```

- #### Detalle de los campos
  - #### `reference_number`
Número de referencia. _Este campo es opcional_ debe ser usado de acuerdo al giro del documento y debe ser un string.
  - #### `reference_date`
Fecha de referencia. _Este campo es opcional_ debe ser usado de acuerdo al giro del documento y debe ser un string.

### `health` 🟢

Información específica y obligatoria para documentos electrónicos del **Sector Salud** (reglamentada por la **Resolución 000948 de 2026** [14 de mayo de 2026] del Ministerio de Salud y Protección Social —que deroga expresamente las Resoluciones 2275 de 2023, 558 y 1884 de 2024—, Resolución 866 de 2021 y el **Documento Técnico 2 versión 001 - FEV Sector Salud** del MinSalud / DIAN). _Este campo es requerido_ cuando el emisor sea un prestador de servicios de salud (IPS, profesional independiente, transporte asistencial) o proveedor de tecnologías en salud que facture a EPS, entidades territoriales, ADRES, aseguradoras SOAT o planes voluntarios de salud. Debe ser un objeto.

**📋 Ejemplo de Payload JSON — Objeto health**

```json
"health": {
  "operation_type": "SS-CUFE",
  "provider_code": "2341702036",
  "payment_modality": "02",
  "coverage": "01",
  "contract_number": "c12bab98915513f00c50e7efdde112763c65b421afcc1f3cea76302e1c80e21c",
  "policy_number": "",
  "copayment": 0,
  "moderator_fee": 0,
  "shared_payments": 0,
  "advance": 0,
  "justification_without_contract": "",
  "invoice_period": {
    "start_date": "2026-07-01",
    "start_time": "00:00:00",
    "end_date": "2026-07-30",
    "end_time": "23:59:59"
  },
  "download_attachments": {
    "url": "www.ips-1.com.co",
    "arguments": [
      {
        "name": "excelFile",
        "value": "a1b2c3.xlsx"
      },
      {
        "name": "txtFile",
        "value": "a1b2c3.txt"
      }
    ]
  },
  "document_delivery": {
    "ws": "https://ws4erp.ips-987.com.co/WcfRecibiendoDocs4ERP.svc?wsdl",
    "arguments": [
      {
        "name": "Método-1",
        "value": "ClienteEntregaAcuseDeReciboDeFEV-VP"
      },
      {
        "name": "Método-2",
        "value": "ClienteEntregaConstanciaDeMercanciaEntregada"
      }
    ]
  }
}
```

**🏥 Campos Principales del Prestador y Contrato (Extensión Salud)**

| Campo | Tipo | Requerido | Descripción |
|-------|:----:|:---------:|-------------|
| `operation_type` | string | ✅ Sí | Tipo de operación del sector salud. Valores habituales: `"SS-CUFE"` (Factura electrónica con CUFE), `"SS-CUDE"` (Notas débito/crédito), `"SS-POS"`, `"SS-SinAporte"`. |
| `provider_code` | string | ✅ Sí | Código asignado en el SGSSS al prestador en el Registro Especial de Prestadores de Servicios de Salud (**REPS** - tabla `IPSCodHabilitación`) o código asignado por MinSalud (tabla `IPSnoREPS`) para Proveedores de Tecnologías en Salud. |
| `payment_modality` | string | ✅ Sí | Código de la modalidad de pago pactada objeto de facturación (Catálogo `modalidadPago` de SISPRO). En facturas multiusuario, todos deben compartir la misma modalidad. |
| `coverage` | string | ✅ Sí | Código de la entidad/fuente responsable de financiar la cobertura o plan de beneficios (Catálogo `coberturaPlan` de SISPRO). |
| `contract_number` | string | ⚠️ Condicional | Número del contrato suscrito objeto de facturación. Si la entidad está obligada por la Ley 1966/2019, debe registrar el código **CUCON** expedido por la plataforma de contratación. En caso de no existir contrato, enviar vacío `""`. |
| `policy_number` | string | ⚠️ Condicional | Número de la póliza de seguro. **Obligatorio** cuando se trate de atenciones cubiertas por póliza **SOAT** (cobertura `04`) o planes voluntarios de salud (pólizas de salud `12`). En los demás casos debe ir vacío `""`. |
| `justification_without_contract` | string | ⚠️ Condicional | Código de justificación de atención cuando se factura sin contrato previo con el pagador (Catálogo `facturaSinContrato` de SISPRO). Obligatorio según causal específica (ej. urgencias, tutelas, portabilidad). Si hay contrato, enviar vacío `""`. |

:::info Campos que el API exige
Cuando envías `health`, el API exige `operation_type`, `provider_code`, `payment_modality`, `coverage` e `invoice_period` (con sus fechas y horas). `contract_number` y `policy_number` son opcionales para el API: si se omiten se informan vacíos (`""`). Si omites `contract_number` (o lo envías `null`), el API exige `justification_without_contract` y responde `422` sin él: `El campo health.justification_without_contract es requerido cuando no se envía health.contract_number`. Si hay contrato, envía `contract_number` y deja `justification_without_contract` vacío. Las columnas ⚠️ Condicional indican cuándo la normativa del sector salud exige el valor real.
:::

---

#### 📌 Catálogo de Modalidades de Pago (`payment_modality`)

| Código | Modalidad | Definición (Decreto 780 de 2016) |
|:---:|---|---|
| `01` | **Pago individual por caso / Paquete / Canasta** | Conjunto integral de atenciones por patología, grupo relacionado de diagnóstico o procedimiento quirúrgico. |
| `02` | **Pago global prospectivo** | Tarifa global pactada anticipadamente para cubrir un volumen o grupo de servicios durante un periodo acordado. |
| `03` | **Pago por capitación** | Pago anticipado de una suma fija por persona que se pacta para atender un conjunto definido de servicios durante un periodo. |
| `04` | **Pago por evento** | Mecanismo en el que el pago se realiza por cada actividad, procedimiento, intervención, insumo o medicamento efectivamente prestado. |

---

#### 📌 Catálogo de Cobertura o Plan de Beneficios (`coverage`)

| Código | Cobertura / Plan de Beneficios | Descripción y Base Normativa |
|:---:|---|---|
| `01` | **UPC Contributiva** | Plan de beneficios en salud financiado con UPC contributiva (Resolución 2765 de 2025). |
| `02` | **Presupuesto Máximo** | Servicios y tecnologías no financiados con UPC y no excluidos de la financiación con recursos del SGSSS (Resolución 067 de 2025). |
| `03` | **Prima EPS, no asegurados SOAT** | Víctimas de accidentes de tránsito ocasionados por vehículos no asegurados por SOAT o no identificados (Art. 106 D.L. 2106/2019). |
| `04` | **Cobertura póliza SOAT** | Servicios prestados a víctimas de accidentes con póliza SOAT vigente (Decreto 780 de 2016). Requiere `policy_number`. |
| `05` | **Cobertura ARL** | Prestaciones asistenciales derivadas de accidentes de trabajo y enfermedad laboral a cargo de la ARL (Dec. 1295/1994). |
| `06` | **Cobertura ADRES** | Coberturas en salud a cargo de la Administradora de los Recursos del SGSSS (Ley 1955/2019). |
| `07` | **Cobertura Salud Pública** | Acciones colectivas de gestión en salud pública Nación / Entidades Territoriales (Res. 1597 de 2025). |
| `08` | **Entidad Territorial (Recursos de Oferta)** | Prestación a cargo de la entidad territorial para población no afiliada al SGSSS (Leyes 715/2001 y 1955/2019). |
| `09` | **Urgencias Población Migrante** | Atención de urgencias a población migrante regular no afiliada o irregular (Art. 232 Ley 1955/2019). |
| `10` | **Plan Complementario en Salud** | Coberturas contratadas voluntariamente financiadas por afiliado/empleador (Dec. 780/2016). |
| `11` | **Plan Medicina Prepagada** | Coberturas de medicina prepagada contratadas voluntariamente (Dec. 780/2016). |
| `12` | **Pólizas en Salud** | Pólizas de hospitalización y cirugía contratadas voluntariamente (Dec. 780/2016). Requiere `policy_number`. |
| `13` | **Régimen Especial o Excepción** | Servicios a regímenes de excepción: Fuerzas Militares, Policía, Magisterio, Ecopetrol, Universidades (Ley 647/2001). |
| `14` | **Fondo Nacional PPL / INPEC** | Población privada de la libertad en custodia del INPEC (Ley 1709 de 2014 / Dec. 1069 de 2015). |
| `15` | **Particular** | Servicios y tecnologías asumidos directamente por el paciente con recursos propios. |
| `16` | **UPC Subsidiada** | Plan de beneficios en salud financiado con UPC subsidiada (Resolución 2765 de 2025). |

---

#### 📌 Causales de Factura Sin Contrato (`justification_without_contract`)

Se diligencia exclusivamente cuando el prestador no cuenta con acuerdo de voluntades previo con el pagador:
1. Atención de urgencias vitales.
2. Atención a cargo de ADRES, aseguradora SOAT o pólizas voluntarias / medicina prepagada.
3. Atención en salud por fallos de tutela u órdenes judiciales.
4. Atención en salud por Portabilidad o asignación masiva de afiliados (Art. 2.5.3.4.7.9 Decreto 780/2016).
5. Atención excepcional por cotizaciones o autorizaciones adicionales de servicios.
6. Gestión y recuperación de órganos para trasplante (Ley Estatutaria 1751 de 2015).
7. Profesionales independientes en atención a pacientes particulares.

**💰 Copagos, Cuotas Moderadoras, Pagos Compartidos y Anticipos (PrepaidPayment)**

Todos los montos numéricos deben ser mayores o iguales a `0`, expresados sin separadores de miles y con punto decimal. Estos valores se descuentan o informan de acuerdo con las reglas de interoperabilidad con **RIPS**.

Para el API los cuatro montos son **opcionales** (aceptan `null`): si no se envían, se informan como `0`. Aun así, la DIAN y la validación de RIPS pueden exigir el valor real recaudado, así que envíalos siempre que apliquen.

| Campo | Tipo | Requerido | Descripción |
|-------|:----:|:---------:|-------------|
| `copayment` | number | No (por defecto `0`) | Valor total efectivamente recaudado por el prestador correspondiente a **Copago**. En facturas multiusuario corresponde a la sumatoria de copagos. Debe coincidir exactamente con el valor reportado en el JSON de RIPS. |
| `moderator_fee` | number | No (por defecto `0`) | Valor efectivamente recaudado por concepto de **Cuota Moderadora**. En facturas multiusuario es la sumatoria de cuotas. Debe coincidir con el valor de RIPS. |
| `shared_payments` | number | No (por defecto `0`) | Valor recaudado por **Pagos Compartidos** en planes voluntarios de salud (medicina prepagada, pólizas, planes complementarios). Debe coincidir con RIPS. |
| `advance` | number | No (por defecto `0`) | Valor del **Anticipo** a legalizar que se descuenta del valor de la factura en ejecución del contrato pactado. |

**📅 Periodo de Facturación (invoice_period)**

Define el lapso temporal de la prestación de los servicios de salud (obligatorio para usuario único o facturación multiusuario / capitación):

| Campo | Tipo | Requerido | Formato | Descripción |
|-------|:----:|:---------:|:-------:|-------------|
| `start_date` | string | ✅ Sí | `YYYY-MM-DD` | Fecha de inicio de prestación del servicio o inicio del periodo facturado (ej. `"2026-07-01"`). |
| `start_time` | string | ✅ Sí | `HH:mm:ss` | Hora de inicio de la atención o inicio de periodo (ej. `"00:00:00"`). |
| `end_date` | string | ✅ Sí | `YYYY-MM-DD` | Fecha final de prestación del servicio o fin del periodo facturado (ej. `"2026-07-30"`). |
| `end_time` | string | ✅ Sí | `HH:mm:ss` | Hora final de la atención o cierre de periodo (ej. `"23:59:59"`). |

**📎 Descarga de Adjuntos y Entrega Electrónica (download_attachments / document_delivery)**

Permite configurar canales automatizados para la descarga de soportes clínicos y la entrega de acuses entre el prestador y el pagador/ERP. Ambos bloques son **opcionales**: si no se envían, no se incluyen en el XML. Si se envían, `url` / `ws` toman `""` y `arguments` toma `[]` cuando se omiten.

#### Objeto `download_attachments` (Descarga de Soportes)
| Campo | Tipo | Requerido | Descripción |
|-------|:----:|:---------:|-------------|
| `url` | string | No | Dominio o URL del servicio web donde el pagador puede descargar los anexos y soportes clínicos (ej. `"www.ips-1.com.co"`). |
| `arguments` | array | No | Arreglo de objetos `{ "name": "...", "value": "..." }` con los nombres y rutas de los archivos adjuntos (ej. soportes en Excel, PDF de historia clínica o archivos RIPS). |

#### Objeto `document_delivery` (Integración de Web Service)
| Campo | Tipo | Requerido | Descripción |
|-------|:----:|:---------:|-------------|
| `ws` | string | No | Endpoint WSDL/SOAP o REST para la recepción de acuses de recibo y constancias de entrega de la factura electrónica. Si se envía, debe ser una URL válida. |
| `arguments` | array | No | Arreglo de objetos `{ "name": "...", "value": "..." }` con métodos o parámetros de consumo (ej. `"ClienteEntregaAcuseDeReciboDeFEV-VP"`). |

---

### `customer` 🔴

Información del cliente o proveedor. _Este campo es obligatorio_ para todos los documentos y debe ser un objeto.

**📄 Factura Electrónica y Documento Soporte**

| Campo | Tipo | Requerido | Default | Descripción |
|-------|:----:|:---------:|:-------:|-------------|
| `company_name` | string | **Sí** | — | Razón social o nombre de persona natural |
| `dni` | string | **Sí** | — | Número de identificación **sin dígito de verificación** |
| `email` | string | **Sí** | — | Correo para envío del documento electrónico |
| `identity_document_id` | int | Opcional | `3` (NIT) | Tipo de documento de identidad. **Endpoint:** `{{url}}/identity-documents` |
| `type_organization_id` | int | Opcional | `2` | `1` = Persona Jurídica, `2` = Persona Natural |
| `tax_regime_id` | int | Opcional | `2` | Régimen fiscal (código `49` = No responsable IVA). **Endpoint:** `{{url}}/accounting-regime` |
| `tax_level_id` | int | Opcional | `5` | Responsabilidad tributaria (`R-99-PN` = No aplica). **Endpoint:** `{{url}}/fiscal-regime` |
| `country_id` | int | Opcional | `45` | País del cliente (Colombia). **Endpoint:** `{{url}}/countries` |
| `city_id` | int | Opcional | — | Ciudad del cliente. **Endpoint:** `{{url}}/cities` |
| `address` | string | Opcional | `""` | Dirección del cliente |
| `postal_code` | string | Opcional | `"000000"` | Código postal del cliente |
| `mobile` | string | Opcional | `""` | Teléfono o celular del cliente |
| `city_name` | string | Opcional | — | **NEW** — Nombre de la ciudad. Solo para clientes/proveedores extranjeros |
| `extra_data` | array | Opcional | — | **NEW** — Información adicional para la representación gráfica (no se envía a DIAN) |

**🏷️ extra_data — Campos adicionales del cliente**

Arreglo de objetos `{title, value}` con datos propios del adquiriente que se muestran en el PDF pero **no se envían a la DIAN**. Útil para mostrar número de socio, categoría, fecha de vinculación, etc.

```json
"extra_data": [
  { "title": "No. Socio", "value": "78-54121-454" },
  { "title": "FECHA DE VINCULACIÓN", "value": "02/02/2026" }
]
```

| Campo | Tipo | Requerido | Descripción |
|-------|:----:|:---------:|-------------|
| `title` | string | **Sí** | Etiqueta del campo. Máx. 60 caracteres |
| `value` | string | **Sí** | Valor a mostrar. Máx. 500 caracteres |

:::tip ¿Dato del cliente o del documento?
Si el dato es sobre la **operación** (centro de costo, orden de servicio), usa [`additional_data`](https://docs.matias-api.com/docs/billing-fields#additional_data-) a nivel de documento. `customer.extra_data` es exclusivamente para datos que **describen al adquiriente**.
:::

**🏪 Documento P.O.S Electrónico — Campos del cliente POS**

| Campo | Tipo | Requerido | Default | Descripción |
|-------|:----:|:---------:|:-------:|-------------|
| `company_name` | string | **Sí** | — | Nombre de la empresa o persona natural |
| `dni` | string | **Sí** | — | Número de identificación sin dígito de verificación |
| `email` | string | Opcional | — | Correo para envío del documento |
| `points` | int | Opcional | `0` | Puntos acumulados del cliente |

### `shareholders` 🟢 **NEW**

Participantes o consorciados cuando el documento es emitido por un **Consorcio o Unión Temporal**. _Este campo es opcional_ y debe ser un arreglo de objetos.

Genera un bloque `cac:ShareholderParty` por cada partícipe dentro del nodo del **emisor** (`cac:AccountingSupplierParty / cac:Party`), sin alterar la estructura ni los datos del adquiriente (`customer`). Además, los consorciados asociados al documento **se conservan automáticamente en los reenvíos** (`POST /documents/{uuid}/resend`).

**📦 Ejemplo JSON**

```json
"shareholders": [
  {
    "dni": "1063279307",
    "company_name": "LEWIS LOPEZ A S.A.S.",
    "tax_level_id": 5,
    "tax_regime_id": 2,
    "participation_percent": 60
  },
  {
    "dni": "900123456",
    "company_name": "INGENIERIA Y PROYECTOS S.A.S.",
    "tax_level_id": 5,
    "tax_regime_id": 1,
    "participation_percent": 40
  }
]
```

**🤝 Campos de cada consorciado**

| Campo | Tipo | Requerido | Descripción |
|-------|:----:|:---------:|-------------|
| `dni` | string | **Sí** | NIT del consorciado o partícipe (sin dígito de verificación). No se permiten NITs duplicados en el arreglo |
| `dv` | string / int | Opcional | Dígito de verificación del NIT. Si se envía, se valida contra el cálculo módulo 11 de la DIAN; si se omite, el sistema lo calcula a partir del `dni` |
| `company_name` | string | **Sí** | Razón social o nombre completo del consorciado |
| `tax_level_id` | int | **Sí** | Responsabilidad fiscal del consorciado (`1`: `O-13`, `2`: `O-15`, `3`: `O-23`, `4`: `O-47`, `5`: `R-99-PN`). **Endpoint:** `{{url}}/tax-level` |
| `tax_regime_id` | int | **Sí** | Régimen tributario (`1`: Responsable de IVA `48`, `2`: No responsable de IVA `49`). **Endpoint:** `{{url}}/tax-regime` |
| `participation_percent` | number | **Sí** | Porcentaje de participación del consorciado en la operación (ej. `60`, `40`, `100`) |

:::warning Validaciones de `shareholders` (HTTP 422)
- **Dígito de verificación (`dv`):** si se informa `dv`, debe coincidir con el dígito de verificación módulo 11 correspondiente al `dni`.
- **Sin NITs repetidos:** no puede haber dos consorciados con el mismo `dni` dentro del arreglo `shareholders`.
- **Suma de porcentajes igual a 100:** la suma de `participation_percent` de todos los elementos de `shareholders` debe ser exactamente **`100`** (si hay un único consorciado registrado en el arreglo, su `participation_percent` debe ser `100`).
:::

📦 [Ver ejemplo completo de Factura con Consorciados](https://docs.matias-api.com/docs/jsons-billing/shareholders-invoice.md)

### `discrepancy_response` 🟢

Respuesta a discrepancias. _Este campo es obligatorio_ solo para las notas de crédito, débito y de ajustes de todos los documentos y debe ser un objeto.

- #### Ejemplo

```json
"discrepancy_response": {
    "reference_id": "EPOS2",
    "response_id": "9"
  }
```

- #### Detalle de los campos
  - #### `reference_id`
Número del documento al que se le hace la nota, con el prefijo, **ejemplo(FE4578)**. _Este campo es obligatorio_ solo para las notas de crédito, débito y de ajustes de todos los documentos y debe ser un string.
  - #### `response_id`
Hace referencia al tipo de corrección aplicado a la nota. _Este campo es obligatorio_ solo para las notas de crédito, débito y de ajustes de todos los documentos y debe ser un string.
Puede consultar los diferentes tipos de corrección en el **ENDPOINT** `{{url}}/correction-notes`.

### `billing_reference` 🟡

- 🔴 **Obligatorio** para Notas Crédito/Débito (referencia a factura original)
- 🟢 **Opcional** para otros documentos

Referencia al documento original sobre el cual se emite la nota. _Debe ser un objeto_.

**📦 Ejemplo JSON**

```json
"billing_reference": {
    "number": "EPOS2",
    "date": "2023-12-22",
    "uuid": "b1b5d93a2918...031aea39",
    "scheme_name": "CUDE-SHA384"
  }
```

**🧾 Campos de la referencia**

| Campo | Tipo | Requerido | Descripción |
|-------|:----:|:---------:|-------------|
| `number` | string | **Sí** | Número del documento referenciado **con prefijo** (ej. `"FE4578"`) |
| `date` | string | **Sí** | Fecha del documento referenciado. Formato `YYYY-MM-DD` |
| `uuid` | string | **Sí** | CUFE o CUDE del documento referenciado |
| `scheme_name` | string | ⚠️ Condicional | **Obligatorio** para notas POS Electrónico y notas de ajuste Doc. Soporte. Valores: `CUFE-SHA384`, `CUDE-SHA384`, `CUDS-SHA384` |

### `allowance_charges` 🟢

Descuentos o cargos **a nivel de factura** que no afectan las bases gravables. Los que afectan bases gravables se informan a nivel de ítem. _Este campo es opcional_ y debe ser un arreglo de objetos.

**📦 Ejemplo JSON**

```json
"allowance_charges": [
    {
        "amount": "10000",
        "base_amount": "725000",
        "charge_indicator": true,
        "allowance_charge_reason": "Motivo del cargo a la factura"
    },
    {
        "amount": "10000",
        "base_amount": "725000",
        "charge_indicator": false,
        "discount_id": 2,
        "allowance_charge_reason": "Motivo del descuento a la factura"
    }
  ]
```

**🧾 Campos del cargo/descuento**

| Campo | Tipo | Requerido | Descripción |
|-------|:----:|:---------:|-------------|
| `charge_indicator` | boolean | **Sí** | `true` = Cargo (aumenta el total), `false` = Descuento (reduce el total) |
| `amount` | string | **Sí** | Valor del cargo o descuento. Si es descuento, no puede superar `base_amount` |
| `base_amount` | string | **Sí** | Valor base sobre el cual se calcula el cargo o descuento |
| `allowance_charge_reason` | string | **Sí** | Razón o motivo del cargo/descuento |
| `discount_id` | int | ⚠️ Condicional | **Obligatorio si es descuento** (`charge_indicator: false`). **Endpoint:** `{{url}}/discount-codes` |
| `multiplier_factor_numeric` | string | Opcional | Porcentaje como decimal (ej. `"10.00"` = 10%) |

### `legal_monetary_totals` 🔴

Totales monetarios del documento. Agrupa los valores brutos, impuestos, cargos, descuentos y el total a pagar. La DIAN valida que estos valores sean **matemáticamente consistentes** con las líneas y los impuestos. _Este campo es obligatorio_ y debe ser un objeto.

**📦 Ejemplo JSON**

```json
"legal_monetary_totals": {
    "line_extension_amount": "50000",
    "tax_exclusive_amount": "50000",
    "tax_inclusive_amount": "59500",
    "total_charges": 0,
    "total_allowance": 0,
    "payable_amount": "59500"
  }
```

**🔴 Campos obligatorios**

| Campo | Tipo | Descripción |
|-------|:----:|-------------|
| `line_extension_amount` | string | Suma de las líneas antes de impuestos **(Valor Bruto)** |
| `tax_exclusive_amount` | string | Base imponible total. Si no hay impuestos = `"0"` |
| `tax_inclusive_amount` | string | Valor Bruto + tributos de todas las líneas |
| `payable_amount` | string | **Total a pagar:** ítems + tributos + cargos globales − descuentos globales |

**🟢 Campos opcionales**

| Campo | Tipo | Default | Descripción |
|-------|:----:|:-------:|-------------|
| `total_charges` | string | `0` | Suma de todos los cargos globales |
| `total_allowance` | string | `0` | Suma de todos los descuentos globales |
| `allowance_total_amount` | string | — | Alternativa detallada a `total_allowance` |
| `charge_total_amount` | string | — | Alternativa detallada a `total_charges` |
| `pre_paid_amount` | string | — | Anticipos o prepagos que se descuentan del total |

### `lines` 🔴

Líneas de detalle del documento. Cada elemento del arreglo representa un ítem (producto o servicio) con su cantidad, precio, impuestos y descripción. Mínimo **1 línea** por documento. _Este campo es obligatorio_ y debe ser un arreglo de objetos.

**📋 Campos obligatorios del ítem**

| Campo | Tipo | Default | Descripción |
|-------|:----:|:-------:|-------------|
| `invoiced_quantity` | string | — | Cantidad del producto o servicio |
| `line_extension_amount` | string | — | Valor total de la línea sin impuesto: **C × PU - D + R**. Formato `"0.00"` |
| `description` | string | — | Descripción del artículo o servicio |
| `code` | string | — | Código interno del artículo o servicio |
| `price_amount` | string | — | Valor unitario del artículo o servicio. Formato `"0.00"` |
| `base_quantity` | string | — | Cantidad sobre la que aplica el precio. Se recomienda igual a `invoiced_quantity` |
| `quantity_units_id` | string | `1093` | Unidad de medida. **Endpoint:** `{{url}}/quantity-units` |
| `type_item_identifications_id` | string | `4` | Estándar de identificación del ítem. **Endpoint:** `{{url}}/type-item-identifications` |
| `reference_price_id` | string | `1` | Precio de referencia. **Endpoint:** `{{url}}/reference-price` |
| `free_of_charge_indicator` | boolean | `false` | `true` = producto gratis o muestra |

**📝 Campos opcionales del ítem**

| Campo | Tipo | Descripción |
|-------|:----:|-------------|
| `notes` | string | Nota adicional a nivel de línea (`cbc:Note` en el XML para facturas, documento soporte y **notas crédito y débito, incluidas las de POS**). **Obligatorio en la línea de Administración para AIU** (`operation_type_id: 2`), donde debe iniciar con: `"Contrato de servicios AIU por concepto de:"` |
| `brand_name` | string | Marca del producto. Se muestra en la representación gráfica |
| `model_name` | string | Modelo del producto |
| `sellers_item_identification` | string | Código interno alterno del vendedor |
| `pack_size_numeric` | string | Unidades por paquete o empaque |
| `um` / `mu` / `unit_measure_code` | string | Unidad de medida alternativa para la representación gráfica |

### `lines->mandate`

Grupo de información que describe el mandatario de la operación de venta. _Este campo es obligatorio solo para facturas de mandato_ y debe ser un objeto.

Este campo se informa a nivel de ítem y aplica solo para mandatos. Un mandante por ítem.

- #### Ejemplo

```json
"mandate": {
  "dni": "2222222222",
  "dv": "2",
  "code": "0"
}
```

- #### Detalle de los campos
  - #### `dni`
Número de identificación del mandatario. _Este campo es obligatorio_ y debe ser un string.
  - #### `dv`
Dígito de verificación del mandatario. _Este campo es obligatorio_ y debe ser un string.
  - #### `code`

Código que indica el tipo de ingreso del mandatario. _Este campo es obligatorio_ y debe ser un string.

| Código | Significado                          |
| ------ | ------------------------------------ |
| 0      | B/S ingreso propio                   |
| 1      | B/S Ingresos Recibidos para Terceros |

### `linea->extra_data`: **NEW**

Genera **columnas dinámicas** en el detalle del PDF. Los datos se muestran en la representación gráfica del documento pero **no se envían a la DIAN**. _Este campo es opcional_ y debe ser un arreglo de objetos.

:::info Columnas consistentes
El campo `title` debe ser **idéntico** en todas las líneas que comparten la misma columna. La plantilla lo usa como encabezado de columna único; si varía entre líneas, se generan columnas distintas.
:::

**📋 Campos disponibles**

| Campo | Tipo | Requerido | Descripción |
|-------|:----:|:---------:|-------------|
| `title` | string | **Sí** | Encabezado de la columna en el PDF |
| `value` | string | **Sí** | Valor de la celda en esa línea |
| `align` | string | No | `left`, `center`, `right`. Default: `left` |
| `position` | int | No | 1–7. Indica después de qué columna base se inserta. Fuera de rango → comportamiento legacy |

**🗺️ Guía de Posicionamiento (PDF)**

El valor de `position` indica **después de qué columna base** se inserta la columna dinámica:

| `position` | Columna insertada después de... | Ejemplo visual |
|:----------:|--------------------------------|----------------|
| `1` | **CÓDIGO** | `CÓDIGO \| 👉 MI_CAMPO \| DETALLE \| CANT \| ...` |
| `2` | **DETALLE** | `CÓDIGO \| DETALLE \| 👉 MI_CAMPO \| CANT \| ...` |
| `3` | **CANT** | `... \| CANT \| 👉 MI_CAMPO \| U.M \| ...` |
| `4` | **U.M** | `... \| U.M \| 👉 MI_CAMPO \| PRECIO \| ...` |
| `5` | **PRECIO** | `... \| PRECIO \| 👉 MI_CAMPO \| DESCUENTO \| ...` |
| `6` | **DESCUENTO** (si aplica) | `... \| DESCUENTO \| 👉 MI_CAMPO \| RECARGO \| ...` |
| `7` | **RECARGO** (si aplica) | `... \| RECARGO \| 👉 MI_CAMPO \| IVA \| ...` |
| _sin valor_ | _(comportamiento legacy)_ | Después de recargos, antes de impuestos |

:::warning Reglas
- **Rango válido:** 1–7. Valores mayores a 7 se ignoran silenciosamente (comportamiento legacy).
- **Resolución de conflictos:** Si múltiples líneas definen el mismo `title` con diferente `position`, la **primera línea** que define el título determina la posición para toda la tabla.
- `position` es **por columna** (`title`), no por línea individual. Todas las líneas del documento comparten el mismo layout.
:::

**📝 Ejemplo JSON completo**

```json
"invoice_lines": [
  {
    "code": "PROD-001",
    "description": "Producto de ejemplo",
    "extra_data": [
      { "title": "LOTE", "value": "L-2026-001", "position": 2 },
      { "title": "FECHA VENCIMIENTO", "value": "2026-12-31", "align": "center" }
    ]
  }
]
```

:::tip Resultado visual en el PDF

```
CÓDIGO | DETALLE | LOTE | CANT | U.M | PRECIO | FECHA VENCIMIENTO | IVA | TOTAL
                (position=2)                    (sin position → legacy)
```

:::

### `lines->invoice_period`

Periodo de facturación de la línea del documento soporte. _Este campo es obligatorio_ solo para los documentos soporte y debe ser un objeto.

- #### Ejemplo

```json
"invoice_period": {
    "start_date": "2022-06-28",
    "description_code": 1
  }
```

- #### Descripción de los campos
  - #### `start_date`
Fecha de inicio. _Este campo es obligatorio_ solo para los documentos soporte y debe ser un string.
  - #### `description_code`
Código de descripción. _Este campo es obligatorio_ solo para los documentos soporte y debe ser un entero.

### `lines->allowance_charges`

Grupo de campos para información relacionada con un cargo o un descuento en la línea.
Este grupo se debe informar a nivel de ítem, si y solamente si el cargo o descuento afecta la base gravable del ítem.
Si un cargo individual, general a la factura genera IVA, debe reportarse como ítem. Para el caso de los descuentos a nivel de ítem no es necesario codificarlos.
Este campo es opcional y debe ser un arreglo de objetos.

- #### Ejemplo

```json
"allowance_charges": [
    {
        "amount": "10000",
        "base_amount": "725000",
        "charge_indicator": true,
        "allowance_charge_reason": "Motivo del cargo a la linea"
    },
    {
        "amount": "10000",
        "base_amount": "725000",
        "charge_indicator": false,
        "discount_id": 1,
        "allowance_charge_reason": "Motivo del descuento a la linea"
    }
]
```

- #### Detalle de los campos
  - #### `amount`
Valor total del cargo o descuento. _Este campo es obligatorio_ y debe ser un número flotante con máximo dos decimales encerrado entre `""`.
  - #### `base_amount`
Valor Base para calcular el descuento el cargo. _Este campo es obligatorio_ y debe ser un número flotante con máximo dos decimales encerrado entre `""`.
  - #### `charge_indicator`
Indica que el elemento es un Cargo y no un descuento.
Cargo es `true`, es un Débito aumenta el valor de la item.
Descuento es `false`, un Crédito descuenta el valor del ítem
El elemento solamente puede identificar una de las informaciones.
_Este campo es obligatorio_ cuando el cargo no es un descuento y debe ser un booleano.
  - #### `allowance_charge_reason`
Texto libre para informar de la razón del descuento. _Este campo es obligatorio_ y debe ser un string.

### `lines->tax_totals`

Grupo de campos para información relacionada con todos los impuestos de la línea. _Este campo es obligatorio_ solo cuando la línea tiene impuestos y debe ser un arreglo de objetos.

La estructura del objeto varía según el **tipo de tributo**: porcentual (ej. IVA) o **nominal/valor fijo por unidad** (ej. Código `18`, INC Bolsas - Código `22`, etc.).

- #### Ejemplo (Impuesto Porcentual — IVA, Código `01`)

```json
"tax_totals": [
    {
        "tax_id": "1",
        "tax_amount": 294.633000,
        "taxable_amount": 1550.700000,
        "percent": 19
    }
]
```

- #### Ejemplo (Impuesto Nominal — Código `32`)

:::warning Reglas DIAN para impuestos nominales
La DIAN valida **matemáticamente** que `tax_amount = per_unit_amount × base_unit_measure`. Los campos `percent` y `taxable_amount` **deben enviarse con valor `0`** para este tipo de tributo. La regla de validación es `FAX07` (línea) / `FAS07` (cabecera).
:::

```json
"tax_totals": [
    {
        "tax_id": "18",
        "tax_amount": 387.675000,
        "taxable_amount": 0,
        "percent": 0,
        "per_unit_amount": 387.675000,
        "base_unit_measure": 1,
        "quantity_units_id": 70
    }
]
```

> **Cálculo:** `387.675 × 1 = 387.675` (debe ser matemáticamente exacto). El valor de `quantity_units_id` debe corresponder al código numérico de la unidad de medida en el catálogo DIAN.

- #### Detalle de los campos
  - #### `tax_id`
ID del impuesto. _Este campo es obligatorio_ y debe ser un string.
  - #### `tax_amount`
Monto o valor total del impuesto. _Este campo es obligatorio_ y debe ser un número flotante con máximo dos decimales.
    - Para impuestos porcentuales: resultado de `taxable_amount × percent / 100`.
    - Para impuestos nominales: resultado exacto de `per_unit_amount × base_unit_measure`.
  - #### `taxable_amount`
Base gravable del impuesto. _Este campo es obligatorio_ y debe ser un número flotante.
    - Para impuestos porcentuales: valor sobre el que se aplica el porcentaje.
    - Para impuestos nominales: **debe enviarse como `0`**.
  - #### `percent`
Porcentaje del impuesto. _Este campo es obligatorio_ y debe ser un número.
    - Para impuestos porcentuales: valor del porcentaje (ej. `19` para IVA del 19%).
    - Para impuestos nominales: **debe enviarse como `0`**.
  - #### `per_unit_amount`
Valor monetario fijo del tributo por cada unidad de medida física. Obligatorio para impuestos nominales. Debe ser un número flotante con máximo dos decimales.
  - #### `base_unit_measure`
Cantidad de unidades físicas sujetas al impuesto. Obligatorio para impuestos nominales. Debe ser un número flotante.
  - #### `quantity_units_id`
Código numérico de la unidad de medida del catálogo DIAN para `base_unit_measure`. Obligatorio para impuestos nominales. Debe ser un número entero.

### `tax_totals` 🔴

Arreglo que contiene la suma de todos los impuestos del documento, agrupados por tipo de impuesto. _Este campo es obligatorio_ solo cuando el documento tiene impuestos.

La estructura del objeto dentro de este arreglo varía según el **tipo de tributo**: porcentual (ej. IVA) o **nominal/valor fijo por unidad** (ej. Código `18`, INC Bolsas - Código `22`, INCarbono, INCombustibles).

- #### Ejemplo completo (Porcentual + Nominal)

:::warning Reglas DIAN para impuestos nominales
La DIAN valida **matemáticamente** que `tax_amount = per_unit_amount × base_unit_measure`. Los campos `percent` y `taxable_amount` **deben enviarse con valor `0`** para impuestos nominales.

- Regla a nivel de línea: **`FAX07`** (Factura) / **`DEAX07`** (Doc. Equivalente).
- Regla a nivel global: **`FAS07`** (Factura) / **`DEAS07`** (Doc. Equivalente).
:::

```json
"tax_totals": [
    {
        "tax_id": "1",
        "tax_amount": 294.633000,
        "taxable_amount": 1550.700000,
        "percent": 19
    },
    {
        "tax_id": "18",
        "tax_amount": 387.675000,
        "per_unit_amount": 387.675000,
        "base_unit_measure": 1,
        "quantity_units_id": 70,
        "taxable_amount": 0,
        "percent": 0
    }
]
```

> **Cálculo entrada nominal:** `387.675 × 1 = 387.675`. La multiplicación debe ser matemáticamente exacta y consistente con la suma de los valores de línea para no detonar la regla de descuadre general.

- #### Detalle de los campos
  - #### `tax_id`
    - ID del impuesto. _Este campo es obligatorio_ y debe ser un string.
    - Este campo agrupa todos los impuestos que tengan el mismo ID.
  - #### `tax_amount`
    - Monto o valor total del impuesto. _Este campo es obligatorio_ y debe ser un número flotante con máximo dos decimales.
    - Este campo agrupa la suma del monto o valor total de todos los impuestos que tengan el mismo ID.
    - Para impuestos nominales: resultado exacto de `per_unit_amount × base_unit_measure`.
  - #### `taxable_amount`
    - Base gravable del impuesto. _Este campo es obligatorio_ y debe ser un número flotante con máximo dos decimales.
    - Para impuestos porcentuales: valor sobre el que se aplica el porcentaje.
    - Para impuestos de valor fijo por unidad (**códigos 21, 22, 23, 24, 18** y similares): **debe enviarse como `0`**.
  - #### `percent`
    - Porcentaje del impuesto. _Este campo es obligatorio_ y debe ser un número.
    - Para impuestos porcentuales (ej: IVA - Código `01`): valor del porcentaje (ej. `19`).
    - Para impuestos de valor fijo por unidad (**códigos 21, 22, 23, 24, 18** y similares): **debe enviarse como `0`**.

  - ### `quantity_units_id`
    - Código **numérico** de la unidad de medida base del catálogo DIAN sobre la cual se aplica la tarifa fija del tributo.
    - Obligatorio para impuestos de valor fijo por unidad (**códigos 21, 22, 23, 24, 18** y similares).
    - Debe ser un número entero (ej. `886` para NIU - Unidad en INC Bolsas; `821` para la unidad de medida en el código `18`).

  - ### `per_unit_amount`
    - Tarifa o valor monetario fijo del tributo por cada unidad de medida física. Obligatorio para impuestos nominales (**códigos 21, 22, 23, 24, 18** y similares).
    - Debe ser un número flotante con máximo dos decimales (ej. `39.16` para código `18`; `70.00` para INC Bolsas 2025).

  - ### `base_unit_measure`
    - Cantidad de unidades físicas sujetas al impuesto. Obligatorio para impuestos nominales (**códigos 21, 22, 23, 24, 18** y similares).
    - Para INC Bolsas su valor es generalmente `1`; para otros nominales corresponde al total de unidades físicas del ítem (ej. `9.90` para código `18`).
    - Debe ser un número flotante.

### `additional_document_reference` 🟡

Arreglo de objetos utilizado para referenciar documentos adicionales. **Es OBLIGATORIO** para Facturas de Contingencia (Tipo 03) para relacionar el documento físico entregado. Para otros documentos, es **opcional** y sirve para referenciar documentos comerciales (múltiples órdenes, contratos, etc).

**🧾 Campos de la referencia**

| Campo | Tipo | Requerido | Descripción |
|-------|:----:|:---------:|-------------|
| `number` | string | **Sí** | Prefijo y Número del documento referenciado (ej. `"PAPEL-001"`) |
| `date` | string | ⚠️ Condicional | Fecha de emisión del documento. **Obligatorio para Tipo 03**. Formato `YYYY-MM-DD` |
| `uuid` | string | ⚠️ Condicional | CUFE/CUDE del documento referenciado. **Obligatorio para referencias electrónicas**. _(No aplica para papel)_ |
| `code` | string | Opcional | Código interno de la empresa (ej. `"TALONARIO"`, `"OC"`) |
| `scheme_name` | string | Opcional | Algoritmo del UUID (ej. `"CUFE-SHA384"`) |

**🚨 Uso en Factura de Contingencia (Tipo 03)**

Cuando expide una factura física por contingencia, luego debe transmitirla con `type_document_id = 9`. En este caso, informe los datos del papel y **no envíe CUFE**.

```json
"additional_document_reference": [
  {
    "number": "TALONARIO-123",
    "date": "2025-02-10",
    "code": "TALONARIO"
  }
]
```

**🏢 Uso para Referencias Comerciales**

Sirve para referenciar múltiples órdenes de compra, contratos u otros documentos electrónicos.

```json
"additional_document_reference": [
  {
    "number": "OC-2025-001",
    "uuid": "0bd41b047f40dbca91ab0cdebdb89f6a41b57aa821ca92be68f05a58acbad48f04f66301e2df014965d588734c4ee567",
    "scheme_name": "CUFE-SHA384",
    "date": "2025-01-15",
    "code": "OC"
  }
]
```

---

### `additional_data` 🟢 **NEW**

Información que quieres ver impresa en el PDF del documento y que **no viaja a la DIAN**: centro de costo, datos del afiliado, orden de servicio, medios de pago internos.

:::info ¿Por qué existe esto?
El modelo de factura electrónica cubre lo que exige la DIAN. Todo lo demás —lo que tu operación necesita ver en el documento— no tiene sitio en ese modelo. Este campo lo resuelve: envías los datos en el JSON y la plantilla **Preprinted** los imprime sin que haya que modificarla. Las plantillas Classic, Minimal y Modern no imprimen este bloque (ver [Cómo llega al PDF](https://docs.matias-api.com/docs/billing-fields#additional-data-pdf)).
:::

#### Los tres ámbitos de datos adicionales

| Ámbito | Clave en el JSON | Para qué |
|---|---|---|
| Documento | `additional_data` | Centro de costo, afiliado, orden de servicio |
| Cliente | `customer.extra_data` | Nº de socio, categoría, fecha de vinculación |
| Línea | `lines[].extra_data` | Lote, fecha de vencimiento, serial |

Ninguno de los tres se envía a la DIAN.

**📦 Con secciones — Estructura recomendada**

Cada sección es un bloque con título; la plantilla la pinta como tal.

```json
"additional_data": [
  {
    "section": "INFORMACIÓN DEL CENTRO DE COSTO",
    "fields": [
      { "title": "Nombre del Centro de Costo", "value": "Sede Norte" },
      { "title": "Dirección y Teléfono", "value": "Av. Siempre Viva 742 - 601 123 4567" },
      { "title": "Ciudad", "value": "Bogotá D.C." }
    ]
  },
  {
    "section": "INFORMACIÓN DEL USUARIO",
    "fields": [
      { "title": "Afiliado Dependiente/Particular", "value": "Juan Pérez Gómez" },
      { "title": "Identificación", "value": "1098765432" }
    ]
  }
]
```

**📋 Lista plana — Sin secciones**

Si solo necesitas un par de campos sueltos, omite las secciones:

```json
"additional_data": [
  { "title": "Orden de servicio", "value": "OS-2026-0042" },
  { "title": "Observación", "value": "Entrega en portería" }
]
```

Se guardan como una sección sin título.

:::warning No mezcles secciones y campos sueltos
La validación revisa cada elemento por separado: los que traen `fields` (o `items`) son secciones y los demás son campos sueltos, así que un arreglo que mezcla las dos formas **no** se rechaza. El PDF, en cambio, decide la forma de todo el arreglo por el **primer elemento**:

- Si el primer elemento no trae `fields` y trae un `value` no nulo, todo el arreglo se lee como lista plana y las secciones se descartan sin aviso.
- En cualquier otro caso, todo se lee como secciones y los campos sueltos se descartan.

Por eso, en una lista plana el **primer campo debe llevar `value` no nulo** (vale `""`). Si el primero no trae `value` o lo trae en `null`, no se imprime nada del bloque.
:::

**📐 Estructura de campos**

**Sección:**

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `section` | string | No | Título del bloque (alias: `title`). Omitido o `null` para campos sueltos. Máx. 120 |
| `order` | int | No | Orden del bloque. Por defecto, el de llegada |
| `fields` | array | **Sí** | Campos del bloque (alias: `items`). Es lo que identifica a un elemento como sección: sin `fields` el elemento se trata como un campo suelto. Un arreglo vacío se acepta y no imprime nada |

**Campo:**

| Campo | Tipo | Requerido | Por defecto | Descripción |
|---|---|---|---|---|
| `title` | string | **Sí** | — | Etiqueta (alias: `label`). No puede ir vacía. Máx. 60 |
| `value` | string o number | No | vacío | Valor a imprimir. Debe ser un dato simple: un arreglo u objeto se rechaza. `null` u omitido se imprime vacío. Máx. 500 |
| `type` | string | No | `TEXT` | `TEXT`, `NUMBER`, `DATE`, `CURRENCY` (alias: `value_type`; acepta minúsculas) |
| `align` | string | No | `LEFT` | `LEFT`, `CENTER`, `RIGHT` (alias: `alignment`; acepta minúsculas) |
| `order` | int | No | orden de llegada | Orden dentro de la sección |

El campo `type` le dice a la plantilla cómo formatear el valor, sin deducirlo del contenido:

```json
{ "title": "Anticipos", "value": "150000", "type": "CURRENCY", "align": "RIGHT" }
```

Con 2 decimales configurados, se imprime como `$ 150.000,00` alineado a la derecha. Envía el valor **en crudo** (`150000`), no preformateado.

Cómo imprime cada `type` la plantilla Preprinted:

| `type` | Se imprime |
|---|---|
| `CURRENCY` | El símbolo de la moneda del documento (por defecto `$`), un espacio y el número con punto de miles, coma decimal y los decimales de totales configurados en la empresa |
| `NUMBER` | El número con punto de miles y sin decimales |
| `DATE` | El valor tal cual: no se le aplica formato de fecha |
| `TEXT` | El valor tal cual |

`CURRENCY` y `NUMBER` solo dan formato si `value` es numérico. Si no lo es, se imprime tal cual. `align` fija la alineación del valor dentro de su celda.

**⚠️ Validación y límites**

Las peticiones que excedan estos límites se rechazan con **HTTP 422**, indicando qué campo lo provocó.

| Regla | Límite |
|---|---|
| Elementos de primer nivel del arreglo (secciones o, en una lista plana, campos) | 10 |
| Campos por sección | 20 |
| Longitud de `title` | 60 |
| Longitud de `value` | 500 |
| Título de sección | 120 |

El límite de 10 cuenta los elementos de primer nivel de `additional_data`, antes de distinguir secciones de campos. Una **lista plana** admite por tanto como máximo **10 campos**, no 20, y el exceso se rechaza con `El campo additional data admite como máximo 10 secciones.`

**Se rechaza con HTTP 422** (en `POST /invoice`, `/notes/credit`, `/notes/debit`, `/ds/document`, `/ds/adjustment-note`, `POST /auto-increment/*` y `PATCH /auto-increment/*/{uuid}`):

| Entrada | Mensaje |
|---|---|
| `additional_data` no es un arreglo | Llegan dos mensajes: `El campo additional_data debe ser un arreglo de secciones o de campos` y `El campo additional data debe ser un arreglo de secciones o de campos.` |
| Más de 10 elementos | `El campo additional data admite como máximo 10 secciones.` |
| Un elemento no es un objeto (por ejemplo, un texto suelto) | `El elemento 2 de additional data debe ser un objeto.` |
| El título de la sección (`section` o `title`) no es texto | `El título de la sección 0 debe ser texto.` |
| Título de sección de más de 120 caracteres | `El título de la sección 0 supera los 120 caracteres.` |
| `fields` no es un arreglo | `Los campos de la sección 0 deben ser un arreglo.` |
| Más de 20 campos en una sección | `La sección 0 admite como máximo 20 campos.` |
| Un campo de la sección no es un objeto | `El campo 1 de la sección 0 debe ser un objeto.` |
| Campo sin `title` o con `title` vacío | `El campo 0.1 requiere un título.` |
| `title` de más de 60 caracteres | `El título del campo 0.1 supera los 60 caracteres.` |
| `value` es un arreglo u objeto | `El valor del campo 0.1 debe ser un dato simple.` |
| `value` de más de 500 caracteres | `El valor del campo 0.1 supera los 500 caracteres.` |
| `type` distinto de `TEXT`, `NUMBER`, `DATE`, `CURRENCY` | `El tipo del campo 0.1 debe ser uno de: TEXT, NUMBER, DATE, CURRENCY.` |
| `align` distinto de `LEFT`, `CENTER`, `RIGHT` | `La alineación del campo 0.1 debe ser una de: LEFT, CENTER, RIGHT.` |

En los mensajes, el número que acompaña a «elemento» o «sección» es su índice dentro de `additional_data`, y `0.1` es la ruta del campo: sección `0`, campo `1` (en una lista plana es solo el índice del campo). Todos los mensajes llegan en `errors.additional_data`, y la validación del bloque se detiene en el primer error que encuentra. El error llega con el formato estándar de validación:

```json
{
  "message": "El tipo del campo 0.1 debe ser uno de: TEXT, NUMBER, DATE, CURRENCY.",
  "errors": {
    "additional_data": [
      "El tipo del campo 0.1 debe ser uno de: TEXT, NUMBER, DATE, CURRENCY."
    ]
  }
}
```

**Casos tolerados** (el documento se emite igual):

| Entrada | Comportamiento |
|---|---|
| `additional_data` ausente, `null` o `[]` | No se imprime ningún bloque |
| Sección con `fields` vacío | Se acepta y no imprime nada |
| Campo sin `value` o con `value: null` | Se imprime la etiqueta con valor vacío. Excepción: en una lista plana, si es el **primer** campo no se imprime nada del bloque (ver [Lista plana](https://docs.matias-api.com/docs/billing-fields#additional_data-)) |
| Arreglo que mezcla secciones y campos sueltos | Se acepta, pero el PDF solo imprime una de las dos formas, según el primer elemento |
| `type` o `align` en minúsculas (ej. `"currency"`, `"right"`) | Se aceptan |

En el [envío masivo](https://docs.matias-api.com/docs/endpoints/bulk-documents.md) el payload de cada documento no pasa por esta validación: allí un `type` o `align` no reconocido cae al valor por defecto (`TEXT` / `LEFT`), un campo sin `title` se omite y lo que excede los límites se recorta (secciones y campos de más, textos largos) en lugar de rechazarse.

:::warning Se rechaza, no se trunca
Un dato cortado a la mitad en una factura impresa es peor que un error al emitir. Si un valor supera el límite, la petición falla para que puedas corregirla antes de que el documento llegue a la DIAN.
:::

**🖨️ Cómo llega al PDF — Plantilla Preprinted**

:::caution Solo la plantilla Preprinted imprime additional_data
Las plantillas **Classic**, **Minimal** y **Modern** no leen el bloque. La API lo acepta y lo valida igual en `POST /invoice`, `/notes/credit`, `/notes/debit`, `/ds/document`, `/ds/adjustment-note`, `POST /auto-increment/*` y `PATCH /auto-increment/*/{uuid}`, pero con esas plantillas no aparece en el PDF. La plantilla de la empresa se elige en [Plantillas de la empresa](https://docs.matias-api.com/docs/endpoints/company-templates#datos-adicionales-pdf).
:::

Con **Preprinted**, una sección nueva aparece en el PDF sin que nadie toque la plantilla. La plantilla toma los datos del propio documento, así que se imprimen desde la primera emisión.

**Secciones con sitio fijo.** Preprinted reconoce dos secciones por su título, sin distinguir mayúsculas, acentos ni espacios, y las coloca en un sitio fijo del formato:

| El título de la sección contiene | Dónde se pinta | Etiquetas que se imprimen |
|---|---|---|
| *"centro de costo"* o *"centro costo"* | Recuadro superior izquierdo | El `title` de cada campo. Si envías menos de tres campos, los renglones que faltan se rotulan `Nombre del Centro de Costo`, `Dirección y Teléfono` y `Ciudad` |
| *"del usuario"* o *"afiliado"* | Bloque **INFORMACIÓN DEL USUARIO** | Fijas: `Afiliado Dependiente/Particular`, `Identificación` y `Descripción`. El `title` que envíes se ignora |

- Ambos bloques imprimen los campos **por posición** y solo los **3 primeros**: del 4.º en adelante no se imprimen.
- Solo se usa la **primera** sección que coincide. Las demás secciones cuyo título también coincide no se imprimen, porque se excluyen del recorrido general.

**El resto de secciones** se pinta en el orden en que llegan (o el que fijes con `order`), dentro del cuerpo del documento: después de **INFORMACIÓN DEL CLIENTE** y del bloque del usuario, y **antes** del documento de referencia (en las notas) y del detalle de líneas. Cada sección es una tabla con su título como franja (si la sección no tiene título, no lleva franja) y dos campos por renglón, con la forma `Etiqueta: valor`.

**Campo `Anticipos`.** Si un campo de `additional_data` se titula `Anticipos` (sin distinguir mayúsculas ni acentos), Preprinted muestra además su valor en la fila **ANTICIPOS** de los totales. Esa fila es informativa: el **TOTAL A PAGAR** sigue siendo el total del documento.

---

## Ejemplo Mínimo Requerido {#ejemplo-mínimo-requerido}

Este es un ejemplo con **SOLO los campos obligatorios** para generar una factura simple (tipo 1):

```json
{
  "resolution_number": "18760000001",
  "prefix": "FEV",
  "document_number": 990000001,
  "operation_type_id": 1,
  "type_document_id": 1,
  "customer": {
    "country_id": "45",
    "city_id": "836",
    "identity_document_id": "1",
    "type_organization_id": 2,
    "tax_regime_id": 2,
    "tax_level_id": 5,
    "company_name": "NOMBRE DEL CLIENTE",
    "dni": "1234564",
    "email": "correo@cliente.com"
  },
  "payments": [
    {
      "payment_method_id": 1,
      "means_payment_id": 10,
      "value_paid": "141100.00"
    }
  ],
  "legal_monetary_totals": {
    "line_extension_amount": "131600.00",
    "tax_exclusive_amount": "131600.00",
    "tax_inclusive_amount": "141100.00",
    "payable_amount": "141100.00"
  },
  "lines": [
    {
      "invoiced_quantity": "1",
      "quantity_units_id": "1093",
      "line_extension_amount": "131600.00",
      "description": "Producto ejemplo",
      "price_amount": "131600.00"
    }
  ],
  "tax_totals": [
    {
      "tax_id": "01",
      "tax_amount": 9500,
      "taxable_amount": 131600,
      "percent": 19
    }
  ]
}
```

**📊 Notas importantes sobre este ejemplo:**

✅ Todos los campos 🔴 **Obligatorios** están presentes

✅ Campos 🟢 **Opcionales** se omitieron para simplicidad

✅ Puede extenderse con campos adicionales según necesidad

⚠️ Para contingencia (tipo 03), debe agregar [`additional_document_reference`](https://docs.matias-api.com/docs/billing-fields#additional_document_reference-referencia-a-documento-adicional)

⚠️ Para POS (tipo 9), debe agregar [`point_of_sale`](https://docs.matias-api.com/docs/billing-fields#point_of_sale)

---

## 🎯 Próximos Pasos

[📄 **Factura Simple** Ejemplo práctico paso a paso](https://docs.matias-api.com/docs/use-cases/simple-invoice.md)
[🌎 **Exportaciones** Facturas internacionales](https://docs.matias-api.com/docs/use-cases/export-scenarios.md)
[🔌 **Endpoints API** Referencia completa de endpoints](https://docs.matias-api.com/docs/endpoints)
[⚠️ **Errores Comunes** Troubleshooting](https://docs.matias-api.com/docs/use-cases/common-errors.md)

---

📅 **Última actualización:** Febrero 2026 •
📖 **Tipo:** Referencia Técnica Completa •
🎯 **Nivel:** ⭐⭐⭐ Avanzado

---

<!-- Fuente: https://docs.matias-api.com/docs/response-json -->

# 📬 Respuestas de la API

:::info 📖 Guía Completa de Respuestas JSON
Todas las respuestas que emite la API están estructuradas en formato JSON estandarizado, proporcionando información detallada sobre el estado de la solicitud, documentos generados y las validaciones emitidas por la DIAN.
:::

✅

**HTTP 200/201**  

Procesamiento exitoso

⏳

**StatusCode 98**  

En proceso / Reintente

❌

**HTTP 4xx/5xx**  

Errores y Rechazos

🔄

**Contingencia**  

Timeouts y posible envío

---

## 🚀 Quick Reference

| Código | Tipo | Descripción | Acción Recomendada |
|---|---|---|---|
| **200** | 200 OK | Solicitud procesada. En la emisión, la DIAN pudo **aceptar o rechazar** el documento: revisa `response.IsValid` | `IsValid: "true"` → almacenar archivos. `IsValid: "false"` → corregir según `response.ErrorMessage` |
| **201** | 201 Created | Recurso creado o lote aceptado (p. ej. `POST /bulk/documents`, creación de tokens o webhooks). La emisión unitaria **no** responde 201 | Guardar el identificador devuelto (p. ej. `batch_id`) |
| **202** | 202 Accepted | Solicitud aceptada para procesarse en segundo plano (p. ej. `POST /events/mailbox/{id}/retry`) | Consultar el estado más tarde |
| **400** | 400 Bad Request | Regla de negocio incumplida (documento ya validado, en cola, `send_to_queue=1`, etc.) | Leer `message` y corregir la petición |
| **401** | 401 Unauthorized | Sin autorización (falta el token o expiró) | Renovar el token de acceso en la cabecera |
| **402** | 402 Payment Required | Saldo insuficiente de folios o cuenta inactiva | Ampliar paquete o renovar suscripción |
| **403** | 403 Forbidden | Sin `error_code`: acción no autorizada (p. ej. un `client_uuid` que no es de tu cuenta). Con `error_code: "RECEPTION_NOT_IN_PLAN"`: el plan no incluye la recepción de facturas ni los eventos RADIAN | Sin `error_code`: verificar permisos y `client_uuid`. Con `RECEPTION_NOT_IN_PLAN`: actualizar o renovar el plan (solo planes de pago vigentes) |
| **404** | 404 Not Found | Recurso o endpoint no encontrado | Verificar identificador y endpoint |
| **409** | 409 Conflict | La operación choca con otra en curso o con el estado del recurso (ver [409](https://docs.matias-api.com/docs/response-json#errores-409)) | Leer `code` / `error_code`; consultar el estado antes de reintentar |
| **422** | 422 Unprocessable | Validación del JSON enviado (campos faltantes o con formato inválido). **No** es un rechazo de la DIAN | Revisar el objeto `errors` |
| **429** | 429 Too Many Requests | Límite de peticiones superado. Todas las rutas del API (incluido el registro público `POST /register`) tienen un límite general, por defecto de **90 solicitudes por minuto**, contadas por usuario autenticado o, sin token, por IP. Algunas rutas tienen además límites propios más estrictos (creación de tokens, envíos masivos), que pueden responder con su propio mensaje. El límite general responde solo `{"message": "Too Many Attempts."}`, sin `success` | Esperar los segundos del header `Retry-After` y reintentar con backoff |
| **500** | 500 Server Error | Error interno. Normalmente trae `reference`. En emisión puede traer `code: "DOCUMENT_POSSIBLY_SENT"` | Con `DOCUMENT_POSSIBLY_SENT`: **no retransmitir**, consultar el estado. Si no, reportar a soporte con `reference` |
| **503** | 503 Unavailable | `code: "DIAN_STATUS_UNAVAILABLE"`: no se pudo confirmar en la DIAN el envío anterior de ese número y **no se transmitió** | Reintentar en unos minutos |
| **504** | 504 Timeout | Tu cliente o una puerta de enlace cortó la conexión antes de recibir la respuesta | **No retransmitir**: consultar el estado con `GET /status` |

:::note La emisión unitaria no responde 201
La emisión es síncrona: responde **HTTP 200** con el resultado de la DIAN. El envío a cola (`send_to_queue: 1`) aún no está habilitado y responde **HTTP 400** `El envío a cola de procesamiento aún no está habilitado.`
:::

---

## 🎯 Guía Rápida de Interpretación

:::tip Flujo de Diagnóstico en 4 Pasos
1. **Paso 1: Código HTTP**
   - `HTTP 200/201` ➔ ✅ La API procesó la solicitud (en la emisión, la DIAN pudo aceptar **o rechazar** el documento)
   - `HTTP 400–429` ➔ ⚠️ Error en la petición, en los datos o conflicto con otra operación
   - `HTTP 5xx` ➔ ❌ Error del servidor o de la comunicación con la DIAN (revisa `code` y `reference`)
2. **Paso 2: Propiedad `success`**
   - `success: true` ➔ ✅ Operación completada
   - `success: false` ➔ ❌ Fallo en validación, datos o procesamiento
3. **Paso 3: `response.IsValid` y `StatusCode` DIAN**
   - `IsValid: "true"` y `StatusCode: "00"` ➔ ✅ Autorizado por la DIAN
   - `IsValid: "false"` ➔ ❌ Rechazado por la DIAN (detalle en `response.ErrorMessage`)
   - `StatusCode: "98"` ➔ ⏳ En procesamiento en la DIAN
4. **Paso 4: `warnings`**
   - Arreglo vacío ➔ sin avisos
   - Con elementos ➔ el documento quedó procesado, pero algo posterior falló o se concilió (ver [Avisos](https://docs.matias-api.com/docs/response-json#warnings))
:::

---

## 🧱 Formato de los Errores

:::tip Envía siempre `Accept: application/json`
Sin esa cabecera, un error de validación (422) responde con una redirección (302) y un token inválido o ausente redirige (302) a la página de inicio de sesión en lugar de responder 401.
:::

Según el origen del error, el cuerpo tiene una de estas formas:

| Origen | HTTP | Cuerpo |
|---|---|---|
| Validación del JSON enviado | 422 | `message` y `errors` (un objeto con un arreglo de mensajes por cada campo). No incluye `success`. Algunas consultas (p. ej. `GET /documents/consume`) responden además `success: false`, con `message` `Error de validación de datos.` |
| Reglas de negocio | 400, 403, 404, 409... | `success: false` y `message`. Los 403 de autorización empiezan con `Acceso no autorizado.` |
| Dato que viola una restricción de la base de datos | 400 | `success: false` y `message` con el detalle devuelto por la base de datos. |
| Error del servidor | 500 o superior | `success: false`, `message` y `reference`. Los errores internos empiezan con `Error interno del servidor.` |
| Autenticación, límite general de peticiones y errores no controlados | 401, 429, 500 | Solo `message` (`Unauthenticated.`, `Too Many Attempts.`, `Server Error`). |

**📦 Ejemplos**

**Validación (HTTP 422):**

```json
{
  "message": "El campo customer.dni es obligatorio.",
  "errors": {
    "customer.dni": ["El campo customer.dni es obligatorio."]
  }
}
```

**Regla de negocio (HTTP 404):**

```json
{
  "success": false,
  "message": "No se encontró el documento."
}
```

**Error del servidor (HTTP 500):**

```json
{
  "success": false,
  "message": "Error interno del servidor. ...",
  "reference": "3b0c6f5e-8d2a-4c7e-9f1b-2a6d5e4c3b21"
}
```

:::info Campo `reference` en errores 5xx
Las respuestas 5xx causadas por un error interno de la emisión y de las consultas traen `reference`: el identificador con el que soporte ubica el error. El 503 `DIAN_STATUS_UNAVAILABLE` no lo trae, porque no es un error interno. **Inclúyelo siempre al reportar un incidente.** Estas respuestas ya no incluyen `file` ni `line`.

Un 500 no implica que el error sea de la DIAN. En la emisión, si el error ocurrió **después** de transmitir el documento, la respuesta trae `code: "DOCUMENT_POSSIBLY_SENT"` y no debe reintentarse a ciegas (ver [Timeouts y posible envío](https://docs.matias-api.com/docs/response-json#timeouts-contingencia)).
:::

---

## ✅ Estructura de la Respuesta Exitosa

:::tip HTTP 200 — Documento Procesado Exitosamente
Cuando la DIAN acepta y autoriza legalmente el documento, la API responde con un objeto que incluye la clave única (CUFE/CUDE/CUNE), el XML firmado, el PDF, el código QR de validación y los avisos (`warnings`) del procesamiento.
:::

### 📋 Campos Principales

| Campo | Tipo | Descripción |
|---|---|---|
| `uuid` | `string` | Identificador del envío en el API. Úsalo con `GET /documents/{uuid}`. |
| `message` | `string` | Resumen del resultado del procesamiento. |
| `send_to_queue` | `integer` | Siempre `0` (el envío a cola aún no está habilitado). |
| `XmlDocumentKey` | `string` | CUFE (Factura) / CUDE (Notas) / CUNE (Nómina). |
| `response` | `object` | Respuesta directa de la DIAN. |
| `XmlBase64Bytes` | `string` | XML del documento en base64. |
| `AttachedDocument` | `object` | Enlaces y metadatos del XML firmado y el contenedor Zip. |
| `qr` | `object` | Rutas y base64 para el código QR de validación. |
| `pdf` | `object` | Enlaces de descarga y metadatos del archivo PDF generado. |
| `warnings` | `array` | 🆕 Avisos del procesamiento. **Siempre está presente**: arreglo vacío si no hay avisos. Ver [Avisos](https://docs.matias-api.com/docs/response-json#warnings). |
| `success` | `boolean` | `true` si la operación se completó. |

:::note Ambiente de habilitación DIAN
Si el software está en el ambiente de **pruebas (habilitación)** de la DIAN, la emisión responde un objeto reducido: `XmlDocumentKey`, `ZipKey`, `response`, `XmlDocumentName`, `ShippingMethod`, `XmlBase64Bytes` y `success` (sin `uuid`, `pdf` ni `warnings`).
:::

**📦 Ver JSON Completo de Respuesta Exitosa**

```json title="response.json"
{
  "uuid": "dde72910-eb42-11ef-9b27-f02f74cac485",
  "message": "Solicitud procesada por la DIAN.",
  "send_to_queue": 0,
  "XmlDocumentKey": "d45f3b2ed042ce0e075891591c3b3a7ae3a9c176ca191dab1bd23e5cdd3b48b8c548a088dfcbe20ee7baa2bed2dccd48",
  "response": {
    "ErrorMessage": {
      "string": [
        "Regla: RUT01, Notificación: La validación del estado del RUT próximamente estará disponible."
      ]
    },
    "IsValid": "true",
    "StatusCode": "00",
    "StatusDescription": "Procesado Correctamente.",
    "StatusMessage": "La Factura electrónica LZT2002, ha sido autorizada.",
    "XmlBase64Bytes": "",
    "XmlBytes": {
      "_attributes": {
        "nil": "true"
      }
    },
    "XmlDocumentKey": "d45f3b2ed042ce0e075891591c3b3a7ae3a9c176ca191dab1bd23e5cdd3b48b8c548a088dfcbe20ee7baa2bed2dccd48",
    "XmlFileName": "fv09010914030002500000095"
  },
  "XmlBase64Bytes": "",
  "AttachedDocument": {
    "pathZip": null,
    "path": "1/ad/ad09010914030002500000041.xml",
    "url": "https://sandbox-api.matias-api.com/attachments/1/ad/ad09010914030002500000041.xml",
    "data": ""
  },
  "qr": {
    "qrDian": "https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=d45f...",
    "url": "https://sandbox-api.matias-api.com/qr/1/fv09010914030002500000095.png",
    "path": "1/fv09010914030002500000095.png",
    "data": ""
  },
  "pdf": {
    "path": "1/fv09010914030002500000095.pdf",
    "url": "https://sandbox-api.matias-api.com/pdf/1/fv09010914030002500000095.pdf",
    "data": ""
  },
  "warnings": [],
  "success": true
}
```

**🔍 Diccionario Detallado de Campos**

#### Objeto `response` (Validación Directa DIAN)
| Campo | Tipo | Descripción |
|---|---|---|
| `ErrorMessage` | `object` | Notificaciones DIAN (si el documento es válido) o motivos del rechazo. |
| `IsValid` | `string` | Indica si cumple los estándares oficiales (`"true"` o `"false"`). |
| `StatusCode` | `string` | Estado interno DIAN (`"00"`: Autorizado). |
| `StatusDescription` | `string` | Glosa oficial (ej. `"Procesado Correctamente."`). |
| `StatusMessage` | `string` | Detalle específico de la autorización. |
| `XmlDocumentKey` | `string` | CUFE / CUDE del documento. |
| `XmlFileName` | `string` | Nombre bajo el cual el XML firmado se registra en la DIAN. |

#### Objeto `AttachedDocument` (Archivos XML)
| Campo | Tipo | Descripción |
|---|---|---|
| `pathZip` | `null` | **Obsoleto:** siempre `null`. El ZIP ya no se guarda en el servidor; se arma al enviar el correo. |
| `path` | `string` | Ruta relativa del XML firmado. |
| `url` | `string` | Enlace público para descarga directa del XML firmado. |

#### Objeto `pdf` (Representación Gráfica)
| Campo | Tipo | Descripción |
|---|---|---|
| `path` | `string` | Ruta de almacenamiento de la representación gráfica. |
| `url` | `string` | Enlace público de descarga del PDF generado. |

---

## 🔔 Avisos de la Respuesta (`warnings`)

`warnings` es un arreglo de objetos `code` + `message`. Un aviso **no convierte en error** un documento que la DIAN ya validó: si algo falla después de la aceptación, la emisión sigue siendo exitosa y se informa aquí.

| `code` | Cuándo aparece | ¿Reenviar? |
|---|---|---|
| `PDF_NOT_GENERATED` | El documento fue validado, pero no se pudo generar la representación gráfica. | ❌ No. Genera el PDF con `POST /documents/pdf/{trackId}?regenerate=1`. |
| `EMAIL_NOT_SENT` | El documento fue validado, pero no se pudo enviar el correo (`send_email: 1`). | ❌ No. Reenvía el correo con `POST /documents/sendmail/{trackId}`. |
| `ATTACHED_DOCUMENT_NOT_GENERATED` | El documento fue validado, pero no se pudo generar el AttachedDocument (ni enviar el correo, si se pidió). | ❌ No. |
| `ATTACHMENTS_NOT_LINKED` | El documento fue procesado, pero no se pudieron vincular sus adjuntos. | ❌ No, si el documento es válido. |
| `ALREADY_AUTHORIZED_RECOVERED` | La DIAN ya había autorizado ese número con el mismo contenido: se devuelve el documento autorizado y no se generó uno nuevo. | ❌ No: el documento es válido. |
| `ALREADY_AUTHORIZED_OTHER_CONTENT` | La DIAN ya autorizó ese número con **otro contenido**. El documento enviado no se marcó como válido. | ❌ No con ese número: consulta el documento autorizado. |
| `ALREADY_PROCESSED_NOT_CONFIRMED` | La DIAN indicó que el documento fue procesado anteriormente, pero no confirmó su autorización. | ⏳ Consulta su estado antes de reenviarlo. |

Los tres avisos `ALREADY_*` solo aparecen en producción (ver [Documento duplicado y regla 90](https://docs.matias-api.com/docs/response-json#documento-duplicado)).

**📦 Ejemplo: correo no enviado (`EMAIL_NOT_SENT`)**

```json
{
  "warnings": [
    {
      "code": "EMAIL_NOT_SENT",
      "message": "El documento fue validado por la DIAN, pero no se pudo enviar el correo. Motivo: No se pudo enviar el email a ningún destinatario. Errores: El envío fue bloqueado automáticamente porque la(s) siguiente(s) dirección(es) no puede(n) recibir correo. Verifique que estén bien escritas: compras@dominio-inexistente.com (el dominio dominio-inexistente.com no existe o no recibe correo) No reenvíe el documento: ya es válido ante la DIAN."
    }
  ]
}
```

**Sobre `EMAIL_NOT_SENT`:**

- El texto `Motivo:` solo se incluye cuando la causa es de negocio, por ejemplo: ningún destinatario pudo recibir el correo (formato o dominio inválido, envío reciente o límite de envíos), ya hay un envío de correo en curso para ese documento o se excedió el límite de destinatarios. Los errores técnicos no se detallan.
- Si **solo algunos** destinatarios fallan, el correo se envía a los demás y **no** se agrega el aviso.

---

## 🔄 Documento Duplicado y Regla 90

:::warning Documento ya validado — HTTP 400
Si intentas emitir de nuevo un prefijo y consecutivo que ya fue validado ante la DIAN, la API responde **HTTP 400** con el registro del envío existente en `data`:
:::

```json title="response.json"
{
  "message": "El documento (Factura electrónica) con numero LZT224 ya se encuentra validado.",
  "data": {
    "uuid": "dde72910-eb42-11ef-9b27-f02f74cac485",
    "document_number": "LZT224",
    "XmlDocumentKey": "cf9864294501e8a9578235dd2ab3c4fd...",
    "is_valid": 1
  },
  "success": false
}
```

Si ese número está en cola de procesamiento, la respuesta es también **HTTP 400**: `El documento (Factura electrónica) con numero LZT224 se encuentra en cola de procesamiento.`, con `data`.

**Regla 90 ("Documento procesado anteriormente")** — en producción, si la DIAN responde que el documento ya fue procesado, la API lo concilia con la DIAN:

- Si la DIAN autorizó ese número con el mismo contenido, devuelve el documento autorizado con el aviso `ALREADY_AUTHORIZED_RECOVERED`.
- Si no, devuelve el rechazo con el aviso `ALREADY_AUTHORIZED_OTHER_CONTENT` o `ALREADY_PROCESSED_NOT_CONFIRMED`.
- Si en ese momento no se pudo consultar la DIAN, el rechazo llega tal cual, sin aviso: consulta el estado antes de reenviar.
- Nunca guarda el intento rechazado encima de un documento ya validado.

---

## ⚠️ Rechazo de la DIAN (HTTP 200)

:::danger Rechazo de Validación DIAN
Cuando el documento contiene errores aritméticos, de catálogos o de reglas de validación DIAN, la API responde **HTTP 200** con `success: true` y `response.IsValid: "false"`. El código HTTP 422 se reserva para la validación del JSON enviado, antes de llegar a la DIAN.
:::

```json title="response.json"
{
  "uuid": "dde72910-eb42-11ef-9b27-f02f74cac485",
  "message": "Solicitud procesada por la DIAN.",
  "send_to_queue": 0,
  "XmlDocumentKey": "d45f3b2ed042ce0e075891591c3b3a7ae3a9c176ca191dab1bd23e5cdd3b48b8c548a088dfcbe20ee7baa2bed2dccd48",
  "response": {
    "IsValid": "false",
    "StatusCode": "99",
    "StatusDescription": "Documento con errores en campos obligatorios.",
    "ErrorMessage": {
      "string": [
        "Regla: FAS01A, Notificación: Error en el cálculo de la base imponible del IVA."
      ]
    }
  },
  "XmlBase64Bytes": "",
  "AttachedDocument": null,
  "qr": null,
  "pdf": null,
  "warnings": [],
  "success": true
}
```

---

## 🚦 Conflictos (HTTP 409)

| `code` / `error_code` | Endpoint | Significado y acción |
|---|---|---|
| `DOCUMENT_IN_TRANSMISSION` | Emisión, `POST /status/document/{trackId}`, `DELETE /documents/{id}` | Ese número se está transmitiendo a la DIAN en otra solicitud. No envíes en paralelo: espera y consulta el estado. |
| `DOCUMENT_IN_VALIDATION` | Emisión (producción) | La DIAN aún valida (`StatusCode 98`) el envío anterior de ese número. `data.document_key` trae su CUFE/CUDE. No se transmitió: consulta el estado en unos minutos. |
| — | Emisión | `El uuid proporcionado ya se usó en otro documento de la empresa. No se emitió de nuevo: consulte ese documento o envíe un uuid nuevo.` |
| — | Envío de eventos RADIAN | `El evento ya se está enviando.` |
| — | Importación de recepción por CUFE/CUDE | `El cufe/cude ya está en proceso de importación.`, el CUFE/CUDE ya fue importado y omitido, o el documento fue eliminado de la recepción (impórtalo de nuevo por su CUFE). |
| `MAILBOX_RETRY_UNAVAILABLE`, `MAILBOX_RETRY_NO_LOCATION`, `MAILBOX_RETRY_EXPIRED`, `MAILBOX_RETRY_IN_PROGRESS`, `MAILBOX_ALREADY_PROCESSED` | `POST /events/mailbox/{id}/retry` | El correo del buzón no se puede reintentar (ver `message`). |
| — | Personas de recepción | No se puede eliminar la persona por defecto mientras haya otras, ni cambiar el modo de envío sin personas registradas. |

**📦 Ejemplos de 409 en la emisión**

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

```json
{
  "code": "DOCUMENT_IN_VALIDATION",
  "message": "La DIAN aún está validando el documento LZT836 (CUFE/CUDE cf9864294501e8a9...). No se transmitió de nuevo: consulte su estado en unos minutos antes de reenviarlo.",
  "data": {
    "uuid": "dde72910-eb42-11ef-9b27-f02f74cac485",
    "document_number": "LZT836",
    "document_key": "cf9864294501e8a9..."
  },
  "success": false
}
```

---

## ⏳ Timeouts y Posible Envío

:::info `DOCUMENT_POSSIBLY_SENT` — No retransmitir a ciegas
Si la comunicación con la DIAN falla **después** de transmitir el documento (timeout, respuesta inesperada o fallo al guardar), la API no puede saber si la DIAN lo recibió. Responde normalmente con **HTTP 500**, `code: "DOCUMENT_POSSIBLY_SENT"`, `data.uuid`, `data.document_number` y `reference`. El consecutivo se conserva.

1. **No emitas de nuevo** el documento con otro número.
2. **Consulta el estado** con `GET /documents/{uuid}` (usando `data.uuid`) o con `GET /status?prefix=...&number=...`.
3. **Contingencia Tipo 04:** si la caída persiste y es informada oficialmente por la DIAN, emite con `operation_type_id: 3` (Factura de Contingencia) y transmite dentro de las 48 horas siguientes.
:::

```json title="response.json"
{
  "success": false,
  "message": "No se obtuvo una respuesta definitiva para el documento LZT836 y es posible que la DIAN lo haya recibido. No lo emita de nuevo: consulte su estado con el uuid del envío antes de cualquier reintento. Detalle: Error interno del servidor. ...",
  "reference": "3b0c6f5e-8d2a-4c7e-9f1b-2a6d5e4c3b21",
  "code": "DOCUMENT_POSSIBLY_SENT",
  "data": {
    "uuid": "dde72910-eb42-11ef-9b27-f02f74cac485",
    "document_number": "LZT836"
  }
}
```

:::warning 503 `DIAN_STATUS_UNAVAILABLE` no es una caída general de la DIAN
En producción, antes de retransmitir un número cuyo envío anterior no quedó confirmado, la API consulta ese envío en la DIAN. Si no logra confirmarlo, responde **HTTP 503** con `code: "DIAN_STATUS_UNAVAILABLE"` y **no transmite** el documento para no duplicarlo. Reintenta en unos minutos.
:::

```json title="response.json"
{
  "success": false,
  "code": "DIAN_STATUS_UNAVAILABLE",
  "message": "No se pudo confirmar en la DIAN el estado del envío anterior del documento LZT836 (CUFE/CUDE cf9864294501e8a9...). No se transmitió de nuevo para no duplicarlo: intente en unos minutos.",
  "data": {
    "uuid": "dde72910-eb42-11ef-9b27-f02f74cac485",
    "document_number": "LZT836",
    "document_key": "cf9864294501e8a9..."
  }
}
```

---

## ⏳ StatusCode 98 — En Procesamiento

:::tip Estado Transitorio de Validación
`StatusCode 98` indica que la DIAN recibió el documento y lo tiene en cola. **No es un error**.
1. Espera 3 a 5 minutos.
2. Consulta el estado con `POST /status/document/{trackId}`.
3. No retransmitas con un nuevo número para evitar cobros dobles o duplicados.

En producción, si envías de nuevo el mismo número, la API primero consulta la DIAN: si sigue en 98, responde **HTTP 409** `DOCUMENT_IN_VALIDATION` sin transmitir.
:::

```json title="response.json"
{
  "message": "Solicitud procesada por la DIAN.",
  "response": {
    "IsValid": "false",
    "StatusCode": "98",
    "StatusDescription": "En Proceso",
    "XmlDocumentKey": null
  }
}
```

---

## ❓ Preguntas Frecuentes (FAQ)

**¿Qué diferencia hay entre `success` e `IsValid`?**  
`success: true` indica que la API procesó la solicitud HTTP correctamente. `IsValid: "true"` es la confirmación oficial de que la DIAN autorizó fiscalmente el documento. Un rechazo de la DIAN llega con `success: true` e `IsValid: "false"`.

**Recibí un timeout o un `DOCUMENT_POSSIBLY_SENT`, ¿el documento se emitió?**  
Es posible. El XML pudo llegar a la DIAN y procesarse. **Nunca retransmitas** sin antes consultar el estado con `GET /documents/{uuid}` o `GET /status`.

**La respuesta trae `warnings`, ¿debo reenviar el documento?**  
No. Si `response.IsValid` es `"true"`, el documento ya es válido ante la DIAN; los avisos indican pasos posteriores (PDF, correo, adjuntos) que puedes repetir por separado.

**¿Qué significa `nil="true"` en algunos nodos XML?**  
Es un estándar de serialización SOAP/XML que indica que el campo está vacío (equivalente a `null`).

---

📅 **Versión:** 3.7.0 (Agosto 2026) •
📨 **Respuestas Documentadas:** HTTP, avisos y conflictos •
🎯 **Nivel:** ⭐⭐⭐ Referencia Técnica de Integración

---

<!-- Fuente: https://docs.matias-api.com/docs/jsons-billing/invoice-health-sector -->

# 🏥 Factura Electrónica del Sector Salud

La **Factura Electrónica de Venta (FEV) del Sector Salud** incorpora campos de datos específicos definidos por el Ministerio de Salud y Protección Social y la DIAN, actuando como soporte y validación previa del **Registro Individual de Prestación de Servicios de Salud (RIPS)**.

:::info 📋 Marco Normativo Vigente
Este documento cumple con las especificaciones de la **Resolución 000948 de 2026** (14 de mayo de 2026) —que deroga expresamente las Resoluciones 2275 de 2023, 558 y 1884 de 2024— y el **Documento Técnico 2 Versión 001** (*Campos de datos del sector salud adicionales a la generación de la FEV*).
:::

---

## 📦 Estructura del Payload JSON

A continuación se presenta el payload completo para emitir una Factura Electrónica del Sector Salud a través de la API:

```json title="invoice_sector_salud.json"
{
  "resolution_number": "18764112492320",
  "prefix": "LZT",
  "notes": "Nota del documento",
  "document_number": "6006",
  "graphic_representation": 1,
  "send_email": 1,
  "operation_type_id": 1,
  "type_document_id": 7,
  "payments": [
    {
      "payment_method_id": 1,
      "means_payment_id": 10,
      "value_paid": "224.00"
    }
  ],
  "health": {
    "operation_type": "SS-CUFE",
    "invoice_period": {
      "start_date": "2026-07-01",
      "start_time": "23:59:59",
      "end_date": "2026-07-30",
      "end_time": "23:59:59"
    },
    "download_attachments": {
      "url": "www.ips-1.com.co",
      "arguments": [
        {
          "name": "excelFile",
          "value": "a1b2c3.xlsx"
        },
        {
          "name": "txtFile",
          "value": "a1b2c3.txt"
        }
      ]
    },
    "document_delivery": {
      "ws": "https://ws4erp.ips-987.com.co/WcfRecibiendoDocs4ERP.svc?wsdl",
      "arguments": [
        {
          "name": "Método-1",
          "value": "ClienteEntregaAcuseDeReciboDeFEV-VP"
        },
        {
          "name": "Método-2",
          "value": "ClienteEntregaConstanciaDeMercanciaEntregada"
        }
      ]
    },
    "provider_code": "2341702036",
    "payment_modality": "02",
    "coverage": "01",
    "contract_number": "c12bab98915513f00c50e7efdde112763c65b421afcc1f3cea76302e1c80e21c",
    "policy_number": "",
    "copayment": 0,
    "moderator_fee": 0,
    "shared_payments": 0,
    "advance": 0,
    "justification_without_contract": ""
  },
  "customer": {
    "country_id": "170",
    "city_id": "149",
    "identity_document_id": "1",
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
      "invoiced_quantity": "2",
      "quantity_units_id": "1093",
      "line_extension_amount": "100.00",
      "free_of_charge_indicator": false,
      "description": "TIJERA NECROPSIA AVES",
      "code": "HMT83",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "price_amount": "50",
      "base_quantity": "2"
    },
    {
      "invoiced_quantity": "2",
      "quantity_units_id": "1093",
      "line_extension_amount": "100.00",
      "free_of_charge_indicator": false,
      "description": "TIJERA NECROPSIA AVES 2",
      "code": "HMT84",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "price_amount": "50",
      "base_quantity": "2"
    }
  ],
  "legal_monetary_totals": {
    "line_extension_amount": "200.00",
    "tax_exclusive_amount": "0.00",
    "tax_inclusive_amount": "200.00",
    "payable_amount": 200.00,
    "pre_paid_amount": "0"
  }
}
```

---

## 🔍 Desglose del Objeto `health`

| Campo | Valor en Ejemplo | Descripción y Validación |
|---|:---:|---|
| `operation_type` | `"SS-CUFE"` | Tipo de operación en salud para factura electrónica con CUFE. |
| `provider_code` | `"2341702036"` | Código de habilitación REPS del prestador asignado en el Registro Especial de Prestadores de Servicios de Salud. |
| `payment_modality` | `"02"` | Modalidad de pago pactada (`02` = Pago global prospectivo). Catálogo `modalidadPago` de SISPRO. |
| `coverage` | `"01"` | Cobertura o plan de beneficios (`01` = Plan de beneficios en salud financiado con UPC Contributiva). Catálogo `coberturaPlan`. |
| `contract_number` | `"c12bab..."` | Número de contrato suscrito o código CUCON (Ley 1966 de 2019). |
| `policy_number` | `""` | Número de póliza de salud o SOAT (aplica para coberturas `04` SOAT o `12` Pólizas voluntarias). |
| `copayment` | `0` | Valor total de copagos recaudados al usuario (debe coincidir con RIPS). |
| `moderator_fee` | `0` | Valor de cuotas moderadoras efectivamente recaudadas (debe coincidir con RIPS). |
| `shared_payments` | `0` | Pagos compartidos en planes voluntarios de salud recaudados por el prestador. |
| `advance` | `0` | Anticipos pactados a legalizar descontados del valor de la factura. |
| `justification_without_contract` | `""` | Causal de atención sin contrato (Catálogo `facturaSinContrato` de SISPRO). Vacío cuando existe contrato. |
| `invoice_period` | `{...}` | Fechas y horas de inicio (`start_date`, `start_time`) y fin (`end_date`, `end_time`) de la prestación del servicio. |
| `download_attachments` | `{...}` | URL y lista de parámetros/archivos de soportes clínicos y RIPS adjuntos. |
| `document_delivery` | `{...}` | Web service SOAP/WSDL o REST para entrega y recepción de acuses de la factura. |

---

## 💻 Ejemplos de Envío a la API

**cURL**

```bash
curl -X POST "{{url}}/invoice" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d @invoice_sector_salud.json
```

**JavaScript (Axios)**

```javascript
import axios from 'axios';

const payload = {
  resolution_number: "18764112492320",
  prefix: "LZT",
  notes: "Nota del documento",
  document_number: "6006",
  graphic_representation: 1,
  send_email: 1,
  operation_type_id: 1,
  type_document_id: 7,
  payments: [
    {
      payment_method_id: 1,
      means_payment_id: 10,
      value_paid: "224.00"
    }
  ],
  health: {
    operation_type: "SS-CUFE",
    invoice_period: {
      start_date: "2026-07-01",
      start_time: "23:59:59",
      end_date: "2026-07-30",
      end_time: "23:59:59"
    },
    download_attachments: {
      url: "www.ips-1.com.co",
      arguments: [
        { name: "excelFile", value: "a1b2c3.xlsx" },
        { name: "txtFile", value: "a1b2c3.txt" }
      ]
    },
    document_delivery: {
      ws: "https://ws4erp.ips-987.com.co/WcfRecibiendoDocs4ERP.svc?wsdl",
      arguments: [
        { name: "Método-1", value: "ClienteEntregaAcuseDeReciboDeFEV-VP" },
        { name: "Método-2", value: "ClienteEntregaConstanciaDeMercanciaEntregada" }
      ]
    },
    provider_code: "2341702036",
    payment_modality: "02",
    coverage: "01",
    contract_number: "c12bab98915513f00c50e7efdde112763c65b421afcc1f3cea76302e1c80e21c",
    policy_number: "",
    copayment: 0,
    moderator_fee: 0,
    shared_payments: 0,
    advance: 0,
    justification_without_contract: ""
  },
  customer: {
    country_id: "170",
    city_id: "149",
    identity_document_id: "1",
    type_organization_id: 2,
    tax_regime_id: 2,
    tax_level_id: 5,
    company_name: "Santiago Arango",
    dni: "1152440359",
    mobile: "3108435423",
    email: "cliente4@ejemplo.com",
    address: "Direccion residencial",
    postal_code: "661002"
  },
  lines: [
    {
      invoiced_quantity: "2",
      quantity_units_id: "1093",
      line_extension_amount: "100.00",
      free_of_charge_indicator: false,
      description: "TIJERA NECROPSIA AVES",
      code: "HMT83",
      type_item_identifications_id: "4",
      reference_price_id: "1",
      price_amount: "50",
      base_quantity: "2"
    },
    {
      invoiced_quantity: "2",
      quantity_units_id: "1093",
      line_extension_amount: "100.00",
      free_of_charge_indicator: false,
      description: "TIJERA NECROPSIA AVES 2",
      code: "HMT84",
      type_item_identifications_id: "4",
      reference_price_id: "1",
      price_amount: "50",
      base_quantity: "2"
    }
  ],
  legal_monetary_totals: {
    line_extension_amount: "200.00",
    tax_exclusive_amount: "0.00",
    tax_inclusive_amount: "200.00",
    payable_amount: 200.00,
    pre_paid_amount: "0"
  }
};

const response = await axios.post(`${url}/invoice`, payload, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

console.log(response.data);
```

**PHP (Guzzle)**

```php
use GuzzleHttp\Client;

$client = new Client();
$response = $client->post("{$url}/invoice", [
    'headers' => [
        'Authorization' => "Bearer {$token}",
        'Content-Type'  => 'application/json',
    ],
    'json' => [
        'resolution_number'      => '18764112492320',
        'prefix'                 => 'LZT',
        'notes'                  => 'Nota del documento',
        'document_number'        => '6006',
        'graphic_representation' => 1,
        'send_email'             => 1,
        'operation_type_id'      => 1,
        'type_document_id'       => 7,
        'payments' => [
            [
                'payment_method_id' => 1,
                'means_payment_id'  => 10,
                'value_paid'        => '224.00'
            ]
        ],
        'health' => [
            'operation_type'   => 'SS-CUFE',
            'provider_code'    => '2341702036',
            'payment_modality' => '02',
            'coverage'         => '01',
            'contract_number'  => 'c12bab98915513f00c50e7efdde112763c65b421afcc1f3cea76302e1c80e21c',
            'policy_number'    => '',
            'copayment'        => 0,
            'moderator_fee'    => 0,
            'shared_payments'  => 0,
            'advance'          => 0,
            'justification_without_contract' => '',
            'invoice_period'   => [
                'start_date' => '2026-07-01',
                'start_time' => '23:59:59',
                'end_date'   => '2026-07-30',
                'end_time'   => '23:59:59'
            ],
            'download_attachments' => [
                'url' => 'www.ips-1.com.co',
                'arguments' => [
                    ['name' => 'excelFile', 'value' => 'a1b2c3.xlsx'],
                    ['name' => 'txtFile', 'value' => 'a1b2c3.txt']
                ]
            ],
            'document_delivery' => [
                'ws' => 'https://ws4erp.ips-987.com.co/WcfRecibiendoDocs4ERP.svc?wsdl',
                'arguments' => [
                    ['name' => 'Método-1', 'value' => 'ClienteEntregaAcuseDeReciboDeFEV-VP'],
                    ['name' => 'Método-2', 'value' => 'ClienteEntregaConstanciaDeMercanciaEntregada']
                ]
            ]
        ],
        'customer' => [
            'country_id'           => '170',
            'city_id'              => '149',
            'identity_document_id' => '1',
            'type_organization_id' => 2,
            'tax_regime_id'        => 2,
            'tax_level_id'         => 5,
            'company_name'         => 'Santiago Arango',
            'dni'                  => '1152440359',
            'mobile'               => '3108435423',
            'email'                => 'cliente4@ejemplo.com',
            'address'              => 'Direccion residencial',
            'postal_code'          => '661002'
        ],
        'lines' => [
            [
                'invoiced_quantity'            => '2',
                'quantity_units_id'            => '1093',
                'line_extension_amount'        => '100.00',
                'free_of_charge_indicator'     => false,
                'description'                  => 'TIJERA NECROPSIA AVES',
                'code'                         => 'HMT83',
                'type_item_identifications_id' => '4',
                'reference_price_id'           => '1',
                'price_amount'                 => '50',
                'base_quantity'                => '2'
            ],
            [
                'invoiced_quantity'            => '2',
                'quantity_units_id'            => '1093',
                'line_extension_amount'        => '100.00',
                'free_of_charge_indicator'     => false,
                'description'                  => 'TIJERA NECROPSIA AVES 2',
                'code'                         => 'HMT84',
                'type_item_identifications_id' => '4',
                'reference_price_id'           => '1',
                'price_amount'                 => '50',
                'base_quantity'                => '2'
            ]
        ],
        'legal_monetary_totals' => [
            'line_extension_amount' => '200.00',
            'tax_exclusive_amount'  => '0.00',
            'tax_inclusive_amount'  => '200.00',
            'payable_amount'        => 200.00,
            'pre_paid_amount'       => '0'
        ]
    ]
]);

echo $response->getBody();
```

---

## 📋 Lista de Chequeo para Emisión en Salud
- [ ] **Código REPS Válido:** `provider_code` debe corresponder al código de habilitación activo de la IPS o proveedor en el Registro Especial de Prestadores de Servicios de Salud.
- [ ] **Modalidad y Cobertura:** `payment_modality` y `coverage` deben ser códigos válidos de las tablas SISPRO.
- [ ] **Periodo de Facturación:** Las fechas de `invoice_period` deben cubrir los servicios prestados o el periodo contractual acordado.
- [ ] **Sincronización con RIPS:** Los valores de `copayment`, `moderator_fee` y `shared_payments` deben coincidir exactamente con los montos consignados en la estructura del archivo RIPS JSON.

---

<!-- Fuente: https://docs.matias-api.com/docs/jsons-billing/credit-note-health-sector -->

# 🏥 Nota Crédito del Sector Salud

La **Nota Crédito Electrónica del Sector Salud** se utiliza para realizar anulaciones, devoluciones, glosas, ajustes o correcciones a facturas electrónicas de servicios y tecnologías en salud previamente emitidas, manteniendo la trazabilidad e interoperabilidad con el **RIPS**.

:::info 📋 Marco Normativo Vigente
Este documento cumple con las especificaciones de la **Resolución 000948 de 2026** (14 de mayo de 2026) del Ministerio de Salud y Protección Social —que deroga expresamente las Resoluciones 2275 de 2023, 558 y 1884 de 2024— y el **Documento Técnico 2 Versión 001** (*Campos de datos del sector salud adicionales a la generación de la FEV*).
:::

---

## 📦 Estructura del Payload JSON

A continuación se detalla el payload completo para emitir una Nota Crédito del Sector Salud referenciando una Factura Electrónica previa:

```json title="credit_note_sector_salud.json"
{
  "resolution_number": "18763005880468",
  "prefix": "NC",
  "notes": "Documento anulado por errores en datos del cliente",
  "document_number": "7061",
  "operation_type_id": 12,
  "type_document_id": 5,
  "graphic_representation": 1,
  "send_email": 1,
  "document_signature": {
    "cashier": "Nombre del cajero(a)",
    "seller": "Nombre del vendedor(a)"
  },
  "discrepancy_response": {
    "reference_id": "LZT6004",
    "response_id": "2"
  },
  "billing_reference": {
    "number": "LZT6004",
    "date": "2026-08-16",
    "uuid": "ba87dd080aefd0558251633ceae95bb6cfe99b18625370c098edc73765bd65914a0447288ab72d1e24913e36813a4289"
  },
  "order_reference": {
    "reference_number": "4502878541",
    "reference_date": "2026-05-02"
  },
  "payments": [
    {
      "payment_method_id": 1,
      "means_payment_id": 10,
      "value_paid": "224.00"
    }
  ],
  "health": {
    "operation_type": "SS-CUDE",
    "invoice_period": {
      "start_date": "2026-07-01",
      "start_time": "23:59:59",
      "end_date": "2026-07-30",
      "end_time": "23:59:59"
    },
    "download_attachments": {
      "url": "www.ips-1.com.co",
      "arguments": [
        {
          "name": "excelFile",
          "value": "a1b2c3.xlsx"
        },
        {
          "name": "txtFile",
          "value": "a1b2c3.txt"
        }
      ]
    },
    "document_delivery": {
      "ws": "https://ws4erp.ips-987.com.co/WcfRecibiendoDocs4ERP.svc?wsdl",
      "arguments": [
        {
          "name": "Método-1",
          "value": "ClienteEntregaAcuseDeReciboDeFEV-VP"
        },
        {
          "name": "Método-2",
          "value": "ClienteEntregaConstanciaDeMercanciaEntregada"
        }
      ]
    },
    "provider_code": "2341702036",
    "payment_modality": "02",
    "coverage": "01",
    "contract_number": "c12bab98915513f00c50e7efdde112763c65b421afcc1f3cea76302e1c80e21c",
    "policy_number": "",
    "copayment": 0,
    "moderator_fee": 0,
    "shared_payments": 0,
    "advance": 0,
    "justification_without_contract": ""
  },
  "customer": {
    "country_id": "45",
    "city_id": "836",
    "identity_document_id": "1",
    "type_organization_id": 2,
    "tax_regime_id": 2,
    "tax_level_id": 5,
    "company_name": "LOPEZ GOMEZ LEWIS OSWALDO",
    "dni": "1063279307",
    "mobile": "3108435423",
    "email": "cliente4@ejemplo.com",
    "address": "Calle 64 #1823",
    "postal_code": "661002"
  },
  "lines": [
    {
      "invoiced_quantity": "2",
      "quantity_units_id": "1093",
      "line_extension_amount": "100.00",
      "free_of_charge_indicator": false,
      "description": "TIJERA NECROPSIA AVES",
      "code": "HMT83",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "price_amount": "50",
      "base_quantity": "2",
      "tax_totals": [
        {
          "tax_id": "1",
          "tax_amount": 19,
          "taxable_amount": 100,
          "percent": 19
        }
      ]
    },
    {
      "invoiced_quantity": "2",
      "quantity_units_id": "1093",
      "line_extension_amount": "100.00",
      "free_of_charge_indicator": false,
      "description": "TIJERA NECROPSIA AVES 2",
      "code": "HMT84",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "price_amount": "50",
      "base_quantity": "2",
      "tax_totals": [
        {
          "tax_id": "1",
          "tax_amount": 5,
          "taxable_amount": 100,
          "percent": 5
        }
      ]
    }
  ],
  "legal_monetary_totals": {
    "line_extension_amount": "200.00",
    "tax_exclusive_amount": "200.00",
    "tax_inclusive_amount": "224.00",
    "payable_amount": 224.00
  },
  "tax_totals": [
    {
      "tax_id": "1",
      "tax_amount": 19,
      "taxable_amount": 100,
      "percent": 19
    },
    {
      "tax_id": "1",
      "tax_amount": 5,
      "taxable_amount": 100,
      "percent": 5
    }
  ]
}
```

---

## 🔍 Parámetros Clave de la Nota Crédito en Salud

| Campo | Valor en Ejemplo | Descripción |
|---|:---:|---|
| `operation_type_id` | `12` | Tipo de operación: Nota Crédito que referencia una Factura Electrónica. |
| `type_document_id` | `5` | Tipo de documento DIAN: **Nota Crédito**. |
| `health.operation_type` | `"SS-CUDE"` | Identificador de operación del sector salud para documentos con CUDE (Notas Crédito / Débito). |
| `discrepancy_response` | `{ "reference_id": "LZT6004", "response_id": "2" }` | Concepto de corrección DIAN (`2` = Anulación de factura electrónica). |
| `billing_reference` | `{ "number": "LZT6004", "uuid": "..." }` | Referencia a la factura electrónica original afectada (número, fecha y CUFE). |
| `health.provider_code` | `"2341702036"` | Código de habilitación REPS del prestador emisor. |
| `health.payment_modality` | `"02"` | Modalidad de pago pactada (`02` = Pago global prospectivo). |
| `health.coverage` | `"01"` | Cobertura o plan de beneficios (`01` = UPC Contributiva). |

---

## 💻 Ejemplos de Envío a la API

**cURL**

```bash
curl -X POST "{{url}}/notes/credit" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d @credit_note_sector_salud.json
```

**JavaScript (Axios)**

```javascript
import axios from 'axios';

const payload = {
  resolution_number: "18763005880468",
  prefix: "NC",
  notes: "Documento anulado por errores en datos del cliente",
  document_number: "7061",
  operation_type_id: 12,
  type_document_id: 5,
  graphic_representation: 1,
  send_email: 1,
  document_signature: {
    cashier: "Nombre del cajero(a)",
    seller: "Nombre del vendedor(a)"
  },
  discrepancy_response: {
    reference_id: "LZT6004",
    response_id: "2"
  },
  billing_reference: {
    number: "LZT6004",
    date: "2026-08-16",
    uuid: "ba87dd080aefd0558251633ceae95bb6cfe99b18625370c098edc73765bd65914a0447288ab72d1e24913e36813a4289"
  },
  order_reference: {
    reference_number: "4502878541",
    reference_date: "2026-05-02"
  },
  payments: [
    {
      payment_method_id: 1,
      means_payment_id: 10,
      value_paid: "224.00"
    }
  ],
  health: {
    operation_type: "SS-CUDE",
    invoice_period: {
      start_date: "2026-07-01",
      start_time: "23:59:59",
      end_date: "2026-07-30",
      end_time: "23:59:59"
    },
    download_attachments: {
      url: "www.ips-1.com.co",
      arguments: [
        { name: "excelFile", value: "a1b2c3.xlsx" },
        { name: "txtFile", value: "a1b2c3.txt" }
      ]
    },
    document_delivery: {
      ws: "https://ws4erp.ips-987.com.co/WcfRecibiendoDocs4ERP.svc?wsdl",
      arguments: [
        { name: "Método-1", value: "ClienteEntregaAcuseDeReciboDeFEV-VP" },
        { name: "Método-2", value: "ClienteEntregaConstanciaDeMercanciaEntregada" }
      ]
    },
    provider_code: "2341702036",
    payment_modality: "02",
    coverage: "01",
    contract_number: "c12bab98915513f00c50e7efdde112763c65b421afcc1f3cea76302e1c80e21c",
    policy_number: "",
    copayment: 0,
    moderator_fee: 0,
    shared_payments: 0,
    advance: 0,
    justification_without_contract: ""
  },
  customer: {
    country_id: "45",
    city_id: "836",
    identity_document_id: "1",
    type_organization_id: 2,
    tax_regime_id: 2,
    tax_level_id: 5,
    company_name: "LOPEZ GOMEZ LEWIS OSWALDO",
    dni: "1063279307",
    mobile: "3108435423",
    email: "cliente4@ejemplo.com",
    address: "Calle 64 #1823",
    postal_code: "661002"
  },
  lines: [
    {
      invoiced_quantity: "2",
      quantity_units_id: "1093",
      line_extension_amount: "100.00",
      free_of_charge_indicator: false,
      description: "TIJERA NECROPSIA AVES",
      code: "HMT83",
      type_item_identifications_id: "4",
      reference_price_id: "1",
      price_amount: "50",
      base_quantity: "2",
      tax_totals: [
        {
          tax_id: "1",
          tax_amount: 19,
          taxable_amount: 100,
          percent: 19
        }
      ]
    },
    {
      invoiced_quantity: "2",
      quantity_units_id: "1093",
      line_extension_amount: "100.00",
      free_of_charge_indicator: false,
      description: "TIJERA NECROPSIA AVES 2",
      code: "HMT84",
      type_item_identifications_id: "4",
      reference_price_id: "1",
      price_amount: "50",
      base_quantity: "2",
      tax_totals: [
        {
          tax_id: "1",
          tax_amount: 5,
          taxable_amount: 100,
          percent: 5
        }
      ]
    }
  ],
  legal_monetary_totals: {
    line_extension_amount: "200.00",
    tax_exclusive_amount: "200.00",
    tax_inclusive_amount: "224.00",
    payable_amount: 224.00
  },
  tax_totals: [
    {
      tax_id: "1",
      tax_amount: 19,
      taxable_amount: 100,
      percent: 19
    },
    {
      tax_id: "1",
      tax_amount: 5,
      taxable_amount: 100,
      percent: 5
    }
  ]
};

const response = await axios.post(`${url}/notes/credit`, payload, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

console.log(response.data);
```

**PHP (Guzzle)**

```php
use GuzzleHttp\Client;

$client = new Client();
$response = $client->post("{$url}/notes/credit", [
    'headers' => [
        'Authorization' => "Bearer {$token}",
        'Content-Type'  => 'application/json',
    ],
    'json' => [
        'resolution_number'      => '18763005880468',
        'prefix'                 => 'NC',
        'notes'                  => 'Documento anulado por errores en datos del cliente',
        'document_number'        => '7061',
        'operation_type_id'      => 12,
        'type_document_id'       => 5,
        'graphic_representation' => 1,
        'send_email'             => 1,
        'document_signature' => [
            'cashier' => 'Nombre del cajero(a)',
            'seller'  => 'Nombre del vendedor(a)'
        ],
        'discrepancy_response' => [
            'reference_id' => 'LZT6004',
            'response_id'  => '2'
        ],
        'billing_reference' => [
            'number' => 'LZT6004',
            'date'   => '2026-08-16',
            'uuid'   => 'ba87dd080aefd0558251633ceae95bb6cfe99b18625370c098edc73765bd65914a0447288ab72d1e24913e36813a4289'
        ],
        'order_reference' => [
            'reference_number' => '4502878541',
            'reference_date'   => '2026-05-02'
        ],
        'payments' => [
            [
                'payment_method_id' => 1,
                'means_payment_id'  => 10,
                'value_paid'        => '224.00'
            ]
        ],
        'health' => [
            'operation_type'   => 'SS-CUDE',
            'provider_code'    => '2341702036',
            'payment_modality' => '02',
            'coverage'         => '01',
            'contract_number'  => 'c12bab98915513f00c50e7efdde112763c65b421afcc1f3cea76302e1c80e21c',
            'policy_number'    => '',
            'copayment'        => 0,
            'moderator_fee'    => 0,
            'shared_payments'  => 0,
            'advance'          => 0,
            'justification_without_contract' => '',
            'invoice_period'   => [
                'start_date' => '2026-07-01',
                'start_time' => '23:59:59',
                'end_date'   => '2026-07-30',
                'end_time'   => '23:59:59'
            ],
            'download_attachments' => [
                'url' => 'www.ips-1.com.co',
                'arguments' => [
                    ['name' => 'excelFile', 'value' => 'a1b2c3.xlsx'],
                    ['name' => 'txtFile', 'value' => 'a1b2c3.txt']
                ]
            ],
            'document_delivery' => [
                'ws' => 'https://ws4erp.ips-987.com.co/WcfRecibiendoDocs4ERP.svc?wsdl',
                'arguments' => [
                    ['name' => 'Método-1', 'value' => 'ClienteEntregaAcuseDeReciboDeFEV-VP'],
                    ['name' => 'Método-2', 'value' => 'ClienteEntregaConstanciaDeMercanciaEntregada']
                ]
            ]
        ],
        'customer' => [
            'country_id'           => '45',
            'city_id'              => '836',
            'identity_document_id' => '1',
            'type_organization_id' => 2,
            'tax_regime_id'        => 2,
            'tax_level_id'         => 5,
            'company_name'         => 'LOPEZ GOMEZ LEWIS OSWALDO',
            'dni'                  => '1063279307',
            'mobile'               => '3108435423',
            'email'                => 'cliente4@ejemplo.com',
            'address'              => 'Calle 64 #1823',
            'postal_code'          => '661002'
        ],
        'lines' => [
            [
                'invoiced_quantity'            => '2',
                'quantity_units_id'            => '1093',
                'line_extension_amount'        => '100.00',
                'free_of_charge_indicator'     => false,
                'description'                  => 'TIJERA NECROPSIA AVES',
                'code'                         => 'HMT83',
                'type_item_identifications_id' => '4',
                'reference_price_id'           => '1',
                'price_amount'                 => '50',
                'base_quantity'                => '2',
                'tax_totals' => [
                    [
                        'tax_id'         => '1',
                        'tax_amount'     => 19,
                        'taxable_amount' => 100,
                        'percent'        => 19
                    ]
                ]
            ],
            [
                'invoiced_quantity'            => '2',
                'quantity_units_id'            => '1093',
                'line_extension_amount'        => '100.00',
                'free_of_charge_indicator'     => false,
                'description'                  => 'TIJERA NECROPSIA AVES 2',
                'code'                         => 'HMT84',
                'type_item_identifications_id' => '4',
                'reference_price_id'           => '1',
                'price_amount'                 => '50',
                'base_quantity'                => '2',
                'tax_totals' => [
                    [
                        'tax_id'         => '1',
                        'tax_amount'     => 5,
                        'taxable_amount' => 100,
                        'percent'        => 5
                    ]
                ]
            ]
        ],
        'legal_monetary_totals' => [
            'line_extension_amount' => '200.00',
            'tax_exclusive_amount'  => '200.00',
            'tax_inclusive_amount'  => '224.00',
            'payable_amount'        => 224.00
        ],
        'tax_totals' => [
            [
                'tax_id'         => '1',
                'tax_amount'     => 19,
                'taxable_amount' => 100,
                'percent'        => 19
            ],
            [
                'tax_id'         => '1',
                'tax_amount'     => 5,
                'taxable_amount' => 100,
                'percent'        => 5
            ]
        ]
    ]
]);

echo $response->getBody();
```

---

## 📋 Reglas de Validación para Nota Crédito en Salud
- [ ] **Tipo de Operación y Documento:** `operation_type_id: 12` y `type_document_id: 5`.
- [ ] **Operación Salud CUDE:** En el objeto `health`, el campo `operation_type` debe ser `"SS-CUDE"`.
- [ ] **Referencia a Factura Obligatoria:** Debe incluir `billing_reference` con el número y CUFE exacto de la factura de salud afectada.
- [ ] **Concepto de Corrección:** El campo `discrepancy_response.response_id` debe contener el código de concepto DIAN aplicable (ej. `2` = Anulación).
