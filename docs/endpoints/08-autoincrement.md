---
sidebar_position: 8
sidebar_label: 🔢 Numeración Automática
description: "Emisión con numeración automática: la plataforma asigna el consecutivo de factura, notas, documento soporte y POS, y permite reenviar por uuid."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 🚀 API de Autoincremento {#autoincremento}

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

Esta API delega a la plataforma el manejo del consecutivo y prefijo de los documentos, evitando colisiones en envíos concurrentes.

:::note ¿Cómo funciona el autoincremento?
Cuando envías una petición, la plataforma **reserva atómicamente** el siguiente número consecutivo disponible en la resolución DIAN indicada antes de procesar el documento. Así dos peticiones simultáneas nunca reciben el mismo número.

**El body del payload es idéntico** al de los endpoints estándar (ej. `POST /invoice`), con una diferencia: **no envíes** `document_number`, que se asigna automáticamente.
:::

#### Requisitos del body {#requisitos}

| Campo | ¿Se envía? | Descripción |
|---|---|---|
| `resolution_number` | ✅ Sí | Junto con `prefix` identifica la resolución. Debe ser una resolución de la empresa, activa y vigente hoy (entre su fecha inicial y su fecha final). |
| `prefix` | ✅ Sí | Prefijo de esa resolución. Omítelo solo si la resolución no tiene prefijo. |
| `document_number` | ❌ No | Si lo envías, la petición se rechaza con HTTP `422`. |
| `uuid` | Opcional | Identificador del documento de tu lado (se recomienda un UUID). Evita que un reintento consuma otro consecutivo. Ver [UUID ya usado](#uuid-ya-usado). |

:::caution La numeración puede tener huecos
Si la emisión falla **antes** de transmitir a la DIAN, la reserva se libera, pero el número solo se reutiliza si seguía siendo el último reservado de la resolución. Si la emisión falla **después** de iniciar la transmisión, el número se conserva para ese documento: consulta su estado y corrígelo con el `PATCH` de [Reenvío y Reintentos](#reenvio) en lugar de enviar un `POST` nuevo.
:::

<details>
<summary>❌ Errores propios del autoincremento</summary>

**HTTP 422** — se envió `document_number`:

```json
{
  "success": false,
  "message": "Para la generación automática, no debe enviar el campo document_number."
}
```

**HTTP 404** — no hay una resolución activa y vigente con ese `resolution_number` y `prefix`:

```json
{
  "success": false,
  "message": "No se encontró una resolución de facturación activa para los datos proporcionados."
}
```

**HTTP 409** — el siguiente número supera el rango autorizado de la resolución (`Se ha alcanzado el número máximo para la resolución ...`). Solicita una nueva resolución a la DIAN.

Además aplican los errores y advertencias comunes de la emisión (`409 DOCUMENT_IN_TRANSMISSION`, `409 DOCUMENT_IN_VALIDATION`, `503 DIAN_STATUS_UNAVAILABLE`, `DOCUMENT_POSSIBLY_SENT`, `warnings`). Ver [Respuestas, advertencias y errores de emisión](/docs/endpoints/invoices-pos#respuestas-emision).

</details>

#### UUID ya usado {#uuid-ya-usado}

Si envías un `uuid` que ya está registrado para tu empresa, **no se emite un documento nuevo** (cada `POST` consumiría otro consecutivo) y la respuesta es HTTP `400`. El `message` depende del estado del envío original:

| Estado del envío original | `message` |
|---|---|
| Validado por la DIAN | `El documento {número} con el UUID proporcionado ya fue validado por la DIAN. No lo reenvíe: cada llamada a este endpoint genera un nuevo consecutivo.` |
| Sin respuesta definitiva de la DIAN | `El UUID proporcionado corresponde al documento {número}, que aún no tiene una respuesta definitiva de la DIAN. No lo reenvíe: consulte su estado con el uuid del envío.` |
| Procesado y no validado | `El UUID proporcionado ya fue procesado como el documento {número} y no se encuentra validado. Para corregirlo sin consumir un nuevo consecutivo use PATCH /api/ubl2.1/auto-increment/{tipo}/{uuid del envío}.` |
| Sin envío asociado | `El UUID proporcionado ya fue utilizado en un envío anterior. No lo reenvíe por este endpoint: cada llamada genera un nuevo consecutivo.` |

<details>
<summary>❌ HTTP 400 — UUID ya procesado y no validado</summary>

```json
{
  "message": "El UUID proporcionado ya fue procesado como el documento F1001 y no se encuentra validado. Para corregirlo sin consumir un nuevo consecutivo use PATCH /api/ubl2.1/auto-increment/invoices/0b96bb6e-7dd0-11f0-ba9f-f02f74cac485.",
  "data": {
    "shipping_history_uuid": "0b96bb6e-7dd0-11f0-ba9f-f02f74cac485",
    "document_uuid": "3d6f1a8e-2b4c-4f7d-9e0a-6c1b5d8f2a47",
    "company_id": 1,
    "document_number": "F1001",
    "is_valid": false,
    "XmlDocumentKey": "6142be764d365c08872933a58c67177b000764e24e4108b67e5aa0872d709ad52a23c7543ffcad42bdec5e9e726d7644"
  },
  "success": false
}
```

`data.shipping_history_uuid` es el `uuid` del envío que debes usar en el `PATCH`; `data.document_uuid` es el `uuid` que enviaste. `data` puede incluir otros campos del registro.

</details>

---

## 📤 Emisión Autoincremental {#emision}

<details open>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/auto-increment/invoices</b> — Factura Autoincremental</summary>

```http
POST {{url}}/auto-increment/invoices?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

Emite una factura tomando automáticamente el siguiente número consecutivo disponible.

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "{{url}}/auto-increment/invoices" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{ ... }'
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
const response = await axios.post(`${url}/auto-increment/invoices`, payload, {
  headers: { Authorization: `Bearer ${token}` }
});
const uuid = response.data.uuid;
const cufe = response.data.XmlDocumentKey;
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$response = $client->post("{$url}/auto-increment/invoices", [
    'headers' => ['Authorization' => "Bearer {$token}"],
    'json'    => $payload,
]);
```

</TabItem>
</Tabs>

<details>
<summary>✅ Respuesta Exitosa — DIAN 200 OK</summary>

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
  },
  "XmlBase64Bytes": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4...",
  "AttachedDocument": {
    "pathZip": null,
    "path": "1/ad/ad09010914030002500001001.xml",
    "url": "https://sandbox-api.matias-api.com/attachments/1/ad/ad09010914030002500001001.xml",
    "data": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4..."
  },
  "qr": {
    "qrDian": "https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=6142be76...",
    "url": "https://sandbox-api.matias-api.com/qr/1/QR-0b96bb6e-7dd0-11f0-ba9f-f02f74cac485.png",
    "path": "1/QR-0b96bb6e-7dd0-11f0-ba9f-f02f74cac485.png",
    "data": "iVBORw0KGgoAAAANSUhEUgAA..."
  },
  "pdf": null,
  "warnings": [],
  "success": true
}
```

Guarda el `uuid` de la respuesta: identifica el envío y es el que usas en el `PATCH` de reenvío. La respuesta, el rechazo DIAN (HTTP `200` con `IsValid: "false"`), la forma en habilitación y los `warnings` son los mismos de `POST /invoice`. Ver [Respuestas, advertencias y errores de emisión](/docs/endpoints/invoices-pos#respuestas-emision).

</details>

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/auto-increment/credit-notes · /debit-notes</b> — Notas Autoincrementales</summary>

```http
POST {{url}}/auto-increment/credit-notes?client_uuid={{client_uuid}}
POST {{url}}/auto-increment/debit-notes?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

Notas de crédito y débito con numeración automática asignada.

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/auto-increment/support-documents</b> — Documento Soporte Autoincremental</summary>

```http
POST {{url}}/auto-increment/support-documents?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

Cubre tanto residentes como no residentes (se define en el payload).

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/auto-increment/pos-documents</b> — Documento POS Autoincremental</summary>

```http
POST {{url}}/auto-increment/pos-documents?client_uuid={{client_uuid}}
POST {{url}}/auto-increment/debit-notes?client_uuid={{client_uuid}}
POST {{url}}/auto-increment/credit-notes?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

Para Notas POS usa la misma ruta general, enviando el `type_document_id` adecuado en el JSON.

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/auto-increment/adjustment-notes</b> — Nota de Ajuste Autoincremental</summary>

```http
POST {{url}}/auto-increment/adjustment-notes?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

Nota de ajuste a Documento Soporte con numeración automática.

</details>

---

## 🔄 Reenvío y Reintentos {#reenvio}

<details open>
<summary><span className="badge badge--warning margin-right--sm">PATCH</span> <b>/auto-increment/invoices/&#123;uuid&#125;</b> — Reenvío de Factura</summary>

```http
PATCH {{url}}/auto-increment/invoices/{uuid}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

Reintenta la emisión de una factura autoincremental que no quedó validada (por ejemplo, rechazada por la DIAN), con el JSON corregido en el body. **Reutiliza el número, la resolución, el prefijo y el consecutivo originales**: no consume un número nuevo.

| Parámetro | Ubicación | Requerido | Descripción |
|-----------|-----------|-----------|-------------|
| `uuid` | path | ✅ Sí | `uuid` del **envío** (el que devolvió la emisión original). Debe pertenecer a la empresa del token (o a la indicada en `client_uuid`). |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

<details>
<summary>❌ Errores del reenvío</summary>

**HTTP 404** — el `uuid` no corresponde a un envío de la empresa:

```json
{
  "success": false,
  "message": "No se encontró ningún envío con el UUID proporcionado."
}
```

**HTTP 400** — el documento ya está validado ante la DIAN: `El documento (...) con numero ... ya se encuentra validado.` No lo reenvíes.

Además aplican `409 DOCUMENT_IN_TRANSMISSION`, `409 DOCUMENT_IN_VALIDATION`, `503 DIAN_STATUS_UNAVAILABLE` y `DOCUMENT_POSSIBLY_SENT`. Ver [Códigos de error de emisión](/docs/endpoints/invoices-pos#errores-emision).

</details>

Estas reglas aplican a todos los endpoints `PATCH /auto-increment/...` de esta sección.

</details>

<details>
<summary><span className="badge badge--warning margin-right--sm">PATCH</span> <b>/auto-increment/credit-notes/&#123;uuid&#125; · /debit-notes/&#123;uuid&#125;</b> — Reenvío de Notas Crédito y Débito</summary>

```http
PATCH {{url}}/auto-increment/credit-notes/{uuid}?client_uuid={{client_uuid}}
PATCH {{url}}/auto-increment/debit-notes/{uuid}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

Reenvía una nota crédito o débito autoincremental no validada, conservando su número original.

| Parámetro | Ubicación | Requerido | Descripción |
|-----------|-----------|-----------|-------------|
| `uuid` | path | ✅ Sí | `uuid` del envío de la nota a reenviar. |

</details>

<details>
<summary><span className="badge badge--warning margin-right--sm">PATCH</span> <b>/auto-increment/adjustment-notes/&#123;uuid&#125;</b> — Reenvío de Nota de Ajuste</summary>

```http
PATCH {{url}}/auto-increment/adjustment-notes/{uuid}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

Reenvía una nota de ajuste a Documento Soporte autoincremental no validada, conservando su número original.

| Parámetro | Ubicación | Requerido | Descripción |
|-----------|-----------|-----------|-------------|
| `uuid` | path | ✅ Sí | `uuid` del envío de la nota de ajuste a reenviar. |

</details>

<details>
<summary><span className="badge badge--warning margin-right--sm">PATCH</span> <b>/auto-increment/support-documents/&#123;uuid&#125;</b> — Reenvío de Documento Soporte</summary>

```http
PATCH {{url}}/auto-increment/support-documents/{uuid}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

| Parámetro | Ubicación | Requerido | Descripción |
|-----------|-----------|-----------|-------------|
| `uuid` | path | ✅ Sí | `uuid` del envío del documento soporte a reenviar. |

</details>

<details>
<summary><span className="badge badge--warning margin-right--sm">PATCH</span> <b>/auto-increment/pos-documents/&#123;uuid&#125;</b> — Reenvío de Documento POS</summary>

```http
PATCH {{url}}/auto-increment/pos-documents/{uuid}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

| Parámetro | Ubicación | Requerido | Descripción |
|-----------|-----------|-----------|-------------|
| `uuid` | path | ✅ Sí | `uuid` del envío del documento POS a reenviar. |

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/documents/&#123;uuid&#125;/resend</b> — Reenviar un documento</summary>

```http
POST {{url}}/documents/{uuid}/resend?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Reenvía **un** documento de la empresa, identificado por el `uuid` del envío (no es un reenvío en lote). No lleva body: la API reconstruye el documento a partir de su historial, con el **mismo número, resolución y prefijo**, y fuerza `send_email: 1` y `graphic_representation: 1`.

El reenvío pasa por el mismo flujo de emisión que `POST /invoice`, con su misma respuesta y sus `warnings`. Ver [Respuestas, advertencias y errores de emisión](/docs/endpoints/invoices-pos/#respuestas-emision).

| Parámetro | Ubicación | Requerido | Descripción |
|-----------|-----------|-----------|-------------|
| `uuid` | path | ✅ Sí | `uuid` del **envío** (el que devolvió la emisión). Debe pertenecer a la empresa del token (o a la indicada en `client_uuid`). |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

:::warning Un reenvío transmitido genera un CUFE/CUDE nuevo
El documento reconstruido no conserva la fecha y la hora originales. Si el reenvío llega a transmitirse a la DIAN, el documento tiene un CUFE/CUDE distinto al del intento anterior.
:::

:::caution Datos que el reenvío no reconstruye
El documento reconstruido no incluye el bloque `health` del sector salud ni los datos adicionales (`additional_data`, `customer.extra_data` y `lines[].extra_data`). Si el documento los lleva, no uses este endpoint: envía de nuevo el JSON completo con el mismo número o, en numeración automática, corrígelo con `PATCH /auto-increment/*/{uuid}`.
:::

<details>
<summary>❌ Errores del reenvío</summary>

**HTTP 404** — el `uuid` no corresponde a un envío de la empresa:

```json
{
  "success": false,
  "message": "No se encontró el envío con UUID: 0b96bb6e-7dd0-11f0-ba9f-f02f74cac485"
}
```

**HTTP 400** — el documento ya está validado ante la DIAN: `El documento (...) con numero ... ya se encuentra validado.` No lo reenvíes.

**HTTP 400** — el envío está en cola de procesamiento: `El documento (...) con numero ... se encuentra en cola de procesamiento.`

Además aplican `409 DOCUMENT_IN_TRANSMISSION` y, en producción, la [consulta previa a la DIAN del intento anterior](/docs/endpoints/invoices-pos/#reintento-transmitido) (HTTP `200` con `ALREADY_AUTHORIZED_RECOVERED`, `409 DOCUMENT_IN_VALIDATION` o `503 DIAN_STATUS_UNAVAILABLE`), la [regla 90](/docs/endpoints/invoices-pos/#regla-90) y `DOCUMENT_POSSIBLY_SENT`. Ver [Códigos de error de emisión](/docs/endpoints/invoices-pos/#errores-emision).

</details>

</details>
