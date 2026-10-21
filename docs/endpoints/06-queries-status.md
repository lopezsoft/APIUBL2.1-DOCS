---
sidebar_position: 6
sidebar_label: 🔍 Consultas y Estados
description: "Consulta de documentos y estados DIAN: por uuid, por número o trackId, descarga de XML y PDF, reenvío por correo y eliminación de documentos no validados."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 🔍 Búsqueda y Estados de Documentos {#busqueda-estados}

:::info Autenticación Requerida
Incluir en todos: `Authorization: Bearer {token}`
:::

:::info ¿Dónde obtener el `client_uuid`? — Multi-Tenant para Casas de Software
Si operas como **Casa de Software** o **Cuenta Principal**, puedes consultar documentos, estados, XMLs, PDFs y rangos de numeración de tus empresas cliente agregando el parámetro `client_uuid` en la URL:
- **URL con Query Param:** `?client_uuid={{client_uuid}}`
- **Header:** `Authorization: Bearer {token_cuenta_principal}`
- **Comportamiento:** La consulta o descarga se ejecutará en el contexto de la empresa cliente especificada por su UUID.

**¿Dónde encontrar el `client_uuid` de tus clientes?**
```http
GET {{url}}/company/customers
Authorization: Bearer {token}
Content-Type: application/json
```
:::

:::tip GET para búsquedas · POST para descargas y acciones
- 🟢 **GET** → Búsquedas, listados, consultas de datos
- 🟠 **POST** → Descarga de archivos, envío de correos, actualización de estados
:::

---

## 📋 Búsqueda y Listado {#busqueda-listado}

<details open>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/documents</b> — Buscar Documentos</summary>

```http
GET {{url}}/documents?order_number=251956&query=&limit=1&resolution=&number=&prefix=&client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `order_number` | query | No | Número de orden interno. |
| `number` | query | No | Número consecutivo del documento. |
| `prefix` | query | No | Prefijo de la resolución. |
| `resolution` | query | No | Número de resolución DIAN. |
| `query` | query | No | Búsqueda por texto libre. |
| `limit` | query | No | Registros por página (por defecto `20`, máximo `50`). |
| `start_date` | query | No | Fecha inicial de emisión (`YYYY-MM-DD`). |
| `end_date` | query | No | Fecha final de emisión (`YYYY-MM-DD`). |
| `document_key` | query | No | CUFE o CUDE del documento. |
| `document_type` | query | No | Tipo de documento (`type_document_id`, p. ej. `7` = Factura electrónica). |
| `document_status` | query | No | Estado: `-1` = todos (por defecto), `0` = no validados por la DIAN (`validation_state` `NOT_VALIDATED`, `PENDING_REVALIDATION`, `NOT_FOUND_OR_REJECTED`, `CERTIFICATE_EXPIRED` o `PENDING`), `1` = solo validados. Los documentos en `PENDING_RESEND` (reenvío pendiente) no aparecen con `0`, solo con `-1`. |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X GET "{{url}}/documents?limit=20&start_date=2026-08-01&end_date=2026-08-31" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
const response = await axios.get(`${url}/documents`, {
  params: { limit: 20, start_date: '2026-08-01', end_date: '2026-08-31' },
  headers: { Authorization: `Bearer ${token}` }
});
const docs = response.data.dataRecords.data;
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$response = $client->get("{$url}/documents", [
    'headers' => ['Authorization' => "Bearer {$token}"],
    'query'   => ['limit' => 20, 'start_date' => '2026-08-01', 'end_date' => '2026-08-31'],
]);
```

</TabItem>
</Tabs>

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "dataRecords": {
    "current_page": 1,
    "data": [
      {
        "id": 1024,
        "uuid": "dde72910-eb42-11ef-9b27-f02f74cac485",
        "document_number": "LZT836",
        "XmlDocumentKey": "cf9864294501e8a9578235dd2ab3c4fd...",
        "is_valid": 1,
        "invoice_date": "01-08-2026"
      }
    ],
    "total": 142
  },
  "success": true
}
```

</details>

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/documents/last</b> — Último Documento Generado</summary>

```http
GET {{url}}/documents/last?resolution=18764074347312&prefix=LZT&client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Trae el último documento válido emitido para una resolución específica.

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `resolution` | query | ✅ Sí | Número de resolución DIAN. |
| `prefix` | query | No | Prefijo de la resolución. |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "dataRecords": {
    "data": {
      "uuid": "dde72910-eb42-11ef-9b27-f02f74cac485",
      "document_number": "LZT836",
      "is_valid": true,
      "invoice_date": "2026-08-20T05:00:00.000000Z"
    }
  },
  "success": true
}
```

</details>

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/documents/consume</b> — Consumo de Documentos</summary>

```http
GET {{url}}/documents/consume?p_year=2026&p_type=1&client_uuid={{client_uuid}}
GET {{url}}/documents/consume?p_year=2026&p_type=6&_dni=900123456&client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Devuelve el reporte de documentos del año, agrupados según `p_type`.

:::note Documentos válidos, no consumo cobrado
En las agrupaciones `1` a `4`, `total` cuenta solo los documentos validados por la DIAN. Estas cifras no son el consumo cobrado de la membresía y pueden superar el `consumed` de [`GET /memberships/summary`](./09-memberships-health.md#que-consume-del-plan): un documento que la API recupera porque la DIAN ya lo tenía autorizado, o que queda validado más tarde al consultar su estado, cuenta aquí pero no se cobra. Ver [Documento recuperado: sin cobro de consumo](./03-invoices-pos.md#recuperado-sin-consumo).
:::

**Parámetros:**

Los parámetros se validan antes de consultar.

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `p_type` | query | No | 🆕 Agrupación (entero, por defecto `1`). Solo se aceptan estos valores: `1` = por mes y tipo de documento (la empresa y sus clientes); `2` = por año (la empresa y sus clientes); `3` = por cliente y mes (solo clientes); `4` = por cliente y año (solo clientes); `6` = un cliente (`_dni`) por mes y tipo de documento. El valor `5` ya no se acepta. |
| `p_year` | query | No | 🆕 Año del reporte (entero entre `2000` y el año siguiente al actual). Por defecto, el año actual. |
| `_dni` | query | Solo con `p_type=6` | 🆕 NIT del cliente sin dígito de verificación: solo dígitos, máximo 15 caracteres. También se acepta como `p_dni`. Las agrupaciones `1` a `4` no lo usan, pero si se envía debe tener un formato válido. |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X GET "{{url}}/documents/consume?p_year=2026&p_type=6&_dni=900123456" \
  -H "Authorization: Bearer {token}" \
  -H "Accept: application/json"
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
const response = await axios.get(`${url}/documents/consume`, {
  params: { p_year: 2026, p_type: 6, _dni: '900123456' },
  headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
});
const rows = response.data.dataRecords.data;
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$response = $client->get("{$url}/documents/consume", [
    'headers' => ['Authorization' => "Bearer {$token}", 'Accept' => 'application/json'],
    'query'   => ['p_year' => 2026, 'p_type' => 6, '_dni' => '900123456'],
]);
```

</TabItem>
</Tabs>

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

Ejemplo con `p_type=6`:

```json
{
  "dataRecords": {
    "data": [
      {
        "nyear": 2026,
        "nmonth": "08",
        "total": 42,
        "payment": "12500000.00",
        "voucher_name": "Factura electrónica de venta",
        "company_name": "CLIENTE EJEMPLO S.A.S",
        "company_dni": "900123456",
        "parent_company": "CASA DE SOFTWARE EJEMPLO S.A.S",
        "parent_dni": "900654321"
      }
    ]
  },
  "success": true
}
```

Las columnas de cada fila dependen de `p_type`:

| `p_type` | Columnas | Filas |
|---|---|---|
| `1` | `nyear`, `nmonth` (texto de 2 dígitos), `total`, `payment`, `parent_dni`, `parent_company`, `document_code`, `voucher_name` | Las de los clientes y las propias de la empresa, por separado, ordenadas por año, mes y código de documento. |
| `2` | `nyear`, `total`, `payment`, `parent_dni`, `parent_company` | Una fila para los clientes y otra para la empresa. |
| `3` | `nyear`, `nmonth` (texto de 2 dígitos), `total`, `payment`, `company_name`, `company_dni`, `parent_dni`, `parent_company` | Solo clientes, por cliente y mes. |
| `4` | `nyear`, `total`, `payment`, `company_name`, `company_dni`, `parent_dni`, `parent_company` | Solo clientes, por cliente y año. |
| `6` | `nyear`, `nmonth` (texto de 2 dígitos), `total`, `payment`, `voucher_name`, `company_name`, `company_dni`, `parent_company`, `parent_dni` | El cliente `_dni` de la empresa autenticada, por mes y tipo de documento. |

</details>

<details>
<summary>❌ Parámetros inválidos (HTTP 422)</summary>

Un `p_type` que no sea `1`, `2`, `3`, `4` o `6` (incluido el `5`), un `p_year` fuera de rango, un `_dni` no numérico o de más de 15 caracteres, o `p_type=6` sin `_dni`, responden **HTTP 422**. La clave del error es `_dni` aunque se haya enviado `p_dni`.

```json
{
  "success": false,
  "message": "Error de validación de datos.",
  "errors": {
    "_dni": ["El campo  dni es obligatorio cuando el campo p type es 6."]
  }
}
```

Antes, un `p_type` fuera de rango respondía HTTP 500.

</details>

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/documents/&#123;uuid&#125;</b> — Consultar Documento por UUID 🆕</summary>

```http
GET {{url}}/documents/{uuid}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Devuelve un documento de la empresa a partir de un UUID. Acepta cualquiera de estos dos identificadores:

- El **uuid del envío**: el `uuid` que devuelve la respuesta de emisión (o el `document_uuid` de un item de envío masivo).
- El **uuid anti-duplicados** que tú enviaste en el campo `uuid` del documento (o en `documents[].uuid` del envío masivo).

:::tip Endpoint recomendado tras un `DOCUMENT_POSSIBLY_SENT`
Si una emisión respondió con el código `DOCUMENT_POSSIBLY_SENT` (o un item masivo quedó en `POSSIBLY_SENT`), consulta este endpoint con `data.uuid` antes de cualquier reintento: así sabes si el documento quedó registrado y validado sin transmitirlo de nuevo.
:::

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `uuid` | path | ✅ Sí | UUID del envío o UUID anti-duplicados enviado por el integrador. Debe tener formato UUID. |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X GET "{{url}}/documents/dde72910-eb42-11ef-9b27-f02f74cac485" \
  -H "Authorization: Bearer {token}" \
  -H "Accept: application/json"
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
const response = await axios.get(`${url}/documents/${uuid}`, {
  headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
});
const record = response.data.dataRecord; // null si no existe
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$response = $client->get("{$url}/documents/{$uuid}", [
    'headers' => ['Authorization' => "Bearer {$token}", 'Accept' => 'application/json'],
]);
```

</TabItem>
</Tabs>

<details>
<summary>✅ Respuesta Exitosa con el uuid del envío (HTTP 200)</summary>

Se muestran los campos principales del envío. El `id` es el identificador numérico que usa `DELETE /documents/{id}`.

```json
{
  "dataRecord": {
    "id": 1024,
    "uuid": "dde72910-eb42-11ef-9b27-f02f74cac485",
    "document_number": "LZT836",
    "type_document_id": 7,
    "XmlDocumentKey": "cf9864294501e8a9578235dd2ab3c4fd...",
    "XmlDocumentName": "fv09010914030002500000095",
    "order_number": "251956",
    "is_valid": 1,
    "invoice_date": "14-02-2025",
    "jsonData": {},
    "createdAt": "14-02-2025 10:15:00 am",
    "updatedAt": "14-02-2025 10:15:04 am"
  },
  "success": true
}
```

</details>

<details>
<summary>✅ Respuesta Exitosa con el uuid anti-duplicados (HTTP 200)</summary>

Con el uuid que envió el integrador, `dataRecord` es el vínculo entre ese uuid y el envío; el envío viene en `shipping_history`. Se muestran los campos principales.

```json
{
  "dataRecord": {
    "shipping_history_uuid": "dde72910-eb42-11ef-9b27-f02f74cac485",
    "document_uuid": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "shipping_history": {
      "uuid": "dde72910-eb42-11ef-9b27-f02f74cac485",
      "document_number": "LZT836",
      "is_valid": 1
    }
  },
  "success": true
}
```

</details>

<details>
<summary>ℹ️ Documento inexistente (HTTP 200)</summary>

Si ningún documento de la empresa tiene ese uuid, la respuesta es **HTTP 200** con `dataRecord: null` (no 404):

```json
{
  "dataRecord": null,
  "success": true
}
```

</details>

<details>
<summary>❌ UUID con formato inválido (HTTP 400)</summary>

```json
{
  "success": false,
  "message": "El UUID proporcionado no es válido."
}
```

</details>

</details>

<details>
<summary><span className="badge badge--danger margin-right--sm">DELETE</span> <b>/documents/&#123;id&#125;</b> — Eliminar Documento No Validado 🆕</summary>

```http
DELETE {{url}}/documents/{id}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Elimina el registro de un documento de la empresa **solo si la DIAN no lo tiene**. El `id` es el identificador numérico del envío (campo `id` de `GET /documents` o de `GET /documents/{uuid}`).

**Se puede eliminar** cuando su `validation_state` (ver `GET /status`) es `NOT_VALIDATED` o `NOT_FOUND_OR_REJECTED`, y además:

- nunca se transmitió (no tiene CUFE/CUDE), o
- la DIAN devolvió un rechazo definitivo para ese mismo CUFE/CUDE.

**No se puede eliminar** un documento validado, uno en cualquier otro estado intermedio (`PENDING_REVALIDATION` tras un `StatusCode 98`, `CERTIFICATE_EXPIRED`, `PENDING_RESEND`, `PENDING`), uno rechazado por la regla 90 ("documento procesado anteriormente") ni uno cuyo envío no obtuvo una respuesta definitiva de la DIAN.

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `id` | path | ✅ Sí | Id numérico del envío. |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X DELETE "{{url}}/documents/1024" \
  -H "Authorization: Bearer {token}" \
  -H "Accept: application/json"
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
const response = await axios.delete(`${url}/documents/${id}`, {
  headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
});
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$response = $client->delete("{$url}/documents/{$id}", [
    'headers' => ['Authorization' => "Bearer {$token}", 'Accept' => 'application/json'],
]);
```

</TabItem>
</Tabs>

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "message": "Documento eliminado correctamente.",
  "success": true
}
```

</details>

<details>
<summary>❌ Respuestas de Error</summary>

| HTTP | `code` | `message` |
|---|---|---|
| 404 | — | `No se encontró el documento.` |
| 400 | — | `No se puede eliminar un documento validado por la DIAN.` |
| 400 | — | `No se puede eliminar un documento que la DIAN podría tener o cuya validación está pendiente.` |
| 409 | `DOCUMENT_IN_TRANSMISSION` | El número se está transmitiendo a la DIAN en otra solicitud. |
| 409 | — | `El documento cambió mientras se eliminaba; consulte su estado.` |

```json
{
  "code": "DOCUMENT_IN_TRANSMISSION",
  "message": "El documento LZT836 ya se está transmitiendo a la DIAN en otra solicitud; consulte su estado antes de enviarlo de nuevo.",
  "success": false
}
```

</details>

</details>

---

## 📥 Descarga de Archivos {#descarga-archivos}

Para descargar los adjuntos y representaciones gráficas del documento usando el **CUFE/CUDE** (`trackId`).

<details open>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/documents/pdf/&#123;trackId&#125;</b> — Descargar PDF</summary>

```http
POST {{url}}/documents/pdf/{trackId}?regenerate=0&client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `trackId` | path | ✅ Sí | CUFE/CUDE del documento. |
| `regenerate` | query | No | `1` fuerza regenerar el PDF, `0` descarga el existente. |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

:::tip QR del PDF regenerado
El QR de un PDF generado corresponde siempre al CUFE/CUDE consultado (`trackId`). Si un documento se transmitió más de una vez y su PDF quedó con el QR de otro intento, `regenerate=1` genera el PDF de nuevo con el QR correcto. Con `regenerate=0` se entrega el PDF existente tal cual.
:::

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "{{url}}/documents/pdf/{{trackId}}?regenerate=0" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
const response = await axios.post(
  `${url}/documents/pdf/${trackId}?regenerate=0`,
  {},
  { headers: { Authorization: `Bearer ${token}` } }
);
const pdfUrl = response.data.pdf.url;
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$response = $client->post("{$url}/documents/pdf/{$trackId}", [
    'headers' => ['Authorization' => "Bearer {$token}"],
    'query'   => ['regenerate' => 0],
]);
```

</TabItem>
</Tabs>

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "message": "PDF generado correctamente.",
  "pdf": {
    "path": "1/b46e15b0-69db-11f1-984a-345a60fd780b.pdf",
    "url": "https://api.ejemplo.com/pdf/1/b46e15b0-69db-11f1-984a-345a60fd780b.pdf",
    "data": "JVBERi0xLjQKJeLjz9MKMyAwIG9iago..."
  }
}
```

</details>

<details>
<summary>❌ trackId no encontrado (HTTP 404)</summary>

```json
{
  "success": false,
  "message": "No se puede generar el PDF. No se encontró un documento asociado al trackId: cf9864294501e8a9578235dd2ab3c4fd..."
}
```

</details>

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/documents/xml/&#123;trackId&#125;</b> — Descargar XML</summary>

```http
GET {{url}}/documents/xml/{trackId}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

También acepta `POST` en la misma ruta.

:::note Solo planes de pago
La descarga del XML no está disponible en el plan FREE: responde **HTTP 403** con `Esta funcionalidad no está disponible en el plan FREE. Actualice su plan para acceder.`
:::

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `trackId` | path | ✅ Sí | CUFE/CUDE del documento. |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

El XML entregado corresponde siempre al CUFE/CUDE solicitado: si el documento no está validado y el XML guardado pertenece a otro intento del mismo número (otra clave), se obtiene de la DIAN el XML de la clave pedida.

<details>
<summary>❌ trackId no encontrado (HTTP 404)</summary>

Un `trackId` que no pertenece a la empresa autenticada responde:

```json
{
  "success": false,
  "message": "No se encontró un documento asociado al trackId: cf9864294501e8a9578235dd2ab3c4fd..."
}
```

</details>

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/documents/attached/&#123;trackId&#125;</b> — Descargar Adjunto (Attached Document)</summary>

```http
POST {{url}}/documents/attached/{trackId}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Descarga el `.zip` con el ApplicationResponse completo.

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `trackId` | path | ✅ Sí | CUFE/CUDE del documento. |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/documents/&#123;uuid&#125;/files</b> — Obtener Archivos del Documento</summary>

```http
GET {{url}}/documents/{uuid}/files?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Retorna los archivos asociados a un documento (PDF, XML, ApplicationResponse) identificado por su UUID interno.

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `uuid` | path | ✅ Sí | UUID interno del documento. |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "dataRecords": {
    "current_page": 1,
    "data": [
      {
        "document_uuid": "1868f3c9-98fb-11f1-b521-345a60fd780b",
        "uuid": "102035600026107941",
        "file_path": "xml/1/fv/fv636afa85-c756-463e-b28c-0c0fa8adf3c3.xml",
        "file_name": "fv636afa85-c756-463e-b28c-0c0fa8adf3c3.xml",
        "type": "xml"
      }
    ],
    "total": 3
  }
}
```

</details>

</details>

---

## 📊 Consulta de Estados {#consulta-estados}

<details open>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/status/document/&#123;trackId&#125;</b> — Estado en Producción</summary>

```http
POST {{url}}/status/document/{trackId}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Verifica el estado del documento directamente con la DIAN en producción.

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `trackId` | path | ✅ Sí | CUFE/CUDE del documento emitido. |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "{{url}}/status/document/{{trackId}}" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
const response = await axios.post(
  `${url}/status/document/${trackId}`,
  {},
  { headers: { Authorization: `Bearer ${token}` } }
);
const isValid = response.data.is_valid === 1;
const dian = response.data.response; // IsValid, StatusCode, StatusDescription...
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$response = $client->post("{$url}/status/document/{$trackId}", [
    'headers' => ['Authorization' => "Bearer {$token}"],
]);
```

</TabItem>
</Tabs>

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

La respuesta de la DIAN llega en `response`, ya extraída del sobre SOAP (sin `Envelope` ni `Body`).

```json
{
  "message": "Consulta generada con éxito",
  "response": {
    "ErrorMessage": {
      "string": []
    },
    "IsValid": "true",
    "StatusCode": "00",
    "StatusDescription": "Procesado Correctamente.",
    "StatusMessage": "La Factura electrónica LZT836, ha sido autorizada.",
    "XmlDocumentKey": "cf9864294501e8a9578235dd2ab3c4fd...",
    "XmlFileName": "fv09010914030002500000095"
  },
  "is_valid": 1,
  "success": true
}
```

</details>

<details>
<summary>📌 Reglas de <code>is_valid</code></summary>

- `is_valid` es `1` solo si la DIAN responde `IsValid: "true"` con `StatusCode: "00"`, el CUFE/CUDE de la respuesta coincide con el `trackId` consultado (o la DIAN no lo devuelve) y el documento conserva ese CUFE/CUDE.
- Si la DIAN responde la regla 90 ("documento procesado anteriormente"), `is_valid` es `0`.
- Un documento ya validado **nunca se degrada**: si la DIAN no lo confirma en esta consulta, la respuesta trae `is_valid: 0` pero el documento sigue registrado como validado.

</details>

<details>
<summary>❌ Respuestas de Error</summary>

| HTTP | `code` | `message` |
|---|---|---|
| 404 | — | `No se encontró el documento con el trackId: {trackId}` (el `trackId` no pertenece a la empresa). |
| 409 | `DOCUMENT_IN_TRANSMISSION` | Ese número se está transmitiendo a la DIAN en otra solicitud; consulte de nuevo en unos instantes. |

```json
{
  "message": "No se encontró el documento con el trackId: cf9864294501e8a9578235dd2ab3c4fd...",
  "success": false
}
```

</details>

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/status/zip/&#123;trackId&#125;</b> — Estado en Pruebas (ZIP)</summary>

```http
POST {{url}}/status/zip/{trackId}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `trackId` | path | ✅ Sí | Track ID del envío en pruebas. |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

:::note
A diferencia de `POST /status/document/{trackId}`, este endpoint y `POST /status/document/test/{trackId}` conservan la clave `ResponseDian` en la respuesta.
:::

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "message": "Consulta generada con éxito",
  "ResponseDian": {
    "IsValid": "true",
    "StatusCode": "00",
    "StatusDescription": "Procesado Correctamente.",
    "StatusMessage": "Documento verificado y validado por la DIAN."
  },
  "success": true
}
```

</details>

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/status/document/test/&#123;trackId&#125;</b> — Estado en Pruebas (Test)</summary>

```http
POST {{url}}/status/document/test/{trackId}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Verifica el estado de un documento en el ambiente de **pruebas** (habilitación) directamente con la DIAN. A diferencia del ZIP, usa el trackId del documento de prueba.

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `trackId` | path | ✅ Sí | CUFE/CUDE del documento de prueba. |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "message": "Consulta generada con éxito",
  "ResponseDian": {
    "IsValid": "true",
    "StatusCode": "00",
    "StatusDescription": "Procesado Correctamente.",
    "StatusMessage": "Documento verificado y validado por la DIAN."
  },
  "success": true
}
```

</details>

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/status</b> — Estado Interno de la API</summary>

```http
GET {{url}}/status?order_number=251956&resolution=&number=LZT836&prefix=&client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Obtiene información del documento registrado en el API, su estado de validación y los datos del Código QR.

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `order_number` | query | No | Número de orden interno. |
| `number` | query | No | Número de documento. |
| `prefix` | query | No | Prefijo de la resolución. |
| `resolution` | query | No | Número de resolución. |
| `type_document_id` | query | No | 🆕 Tipo de documento (entero mayor que 0). También se acepta como `document_type`. Un valor no numérico se ignora. Útil cuando dos tipos de documento comparten numeración. |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

**¿Qué documento se devuelve?** Si la búsqueda incluye `number` y hay varios registros que coinciden, se prefiere el validado por la DIAN y, después, el más reciente. Sin `number`, se devuelve el más reciente.

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "document": {
    "uuid": "dde72910-eb42-11ef-9b27-f02f74cac485",
    "document_number": "LZT836",
    "order_number": "251956",
    "document_key": "cf9864294501e8a9578235dd2ab3c4fd1d9085fe5d3b345d191fbb8c9afa6ff8acec7a97a177393b2d32735d225a9f1d",
    "document_name": "fv09010914030002500000095",
    "is_valid": true,
    "validation_state": "VALID",
    "type_document_id": 7,
    "invoice_date": "2025-02-14T05:00:00.000000Z",
    "qr": {
      "qrDian": "https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=cf9864...",
      "data": "TnVtRmFjOiBMWlQ4MzYK...",
      "path": null,
      "url": null
    }
  },
  "status": "Validado por la DIAN",
  "message": "Consulta exitosa",
  "success": true
}
```

- `is_valid` es `true` **solo** si la DIAN validó el documento. Los estados intermedios (pendiente de consulta, reenvío pendiente, etc.) responden `false`; consulta `validation_state` para saber en qué punto está.
- `qr.qrDian` y `qr.data` corresponden a `document_key`, el CUFE/CUDE vigente del documento. `qr.path` y `qr.url` llegan en `null`.
- `qr.qrDian` es la URL de consulta de la DIAN con `document_key`. Conserva el ambiente (producción o habilitación) con el que se emitió el documento; si no hay una URL guardada, se arma con el ambiente del software configurado para ese tipo de documento. Llega en `null` si no hay una URL guardada y el documento no tiene CUFE/CUDE o no hay software configurado.
- `qr.data` es el texto del QR original en base64 (NumFac, FecFac, ..., CUFE) **solo** si contiene `document_key`. Si no lo contiene (por ejemplo, en un documento recuperado con `ALREADY_AUTHORIZED_RECOVERED` o con un QR guardado de otro intento), es la URL de `qr.qrDian` codificada en base64. Si no hay un QR original válido y `qr.qrDian` es `null`, también llega en `null`.

</details>

<details>
<summary>📌 Valores de <code>validation_state</code> y <code>status</code></summary>

| `validation_state` | `status` | Significado |
|---|---|---|
| `VALID` | `Validado por la DIAN` | La DIAN validó el documento. |
| `NOT_VALIDATED` | `Sin validación por la DIAN` | Sin validación (rechazo o sin respuesta válida). |
| `PENDING_REVALIDATION` | `Sin validación por la DIAN: pendiente de consultar su estado` | Pendiente de consultar su estado en la DIAN (por ejemplo, tras un `StatusCode 98`). |
| `NOT_FOUND_OR_REJECTED` | `Sin validación por la DIAN: la DIAN no tiene el documento o lo rechazó` | La consulta a la DIAN no lo encontró o lo rechazó. |
| `CERTIFICATE_EXPIRED` | `Sin validación por la DIAN: certificado vencido` | No se pudo consultar su estado porque el certificado está vencido. |
| `PENDING_RESEND` | `Sin validación por la DIAN: reenvío pendiente` | Marcado para reenvío a la DIAN. |
| `PENDING` | `Sin validación por la DIAN: pendiente de envío` | Pendiente de envío a la DIAN. |
| `UNKNOWN` | `Sin validación por la DIAN` | Estado no reconocido. |

</details>

<details>
<summary>❌ Documento no encontrado (HTTP 404)</summary>

```json
{
  "success": false,
  "message": "No se encontró el documento."
}
```

</details>

</details>

---

## 📧 Correos y Adquirentes {#correos-adquirentes}

<details open>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/documents/sendmail/to</b> · <b>/documents/sendmail/&#123;trackId&#125;</b> — Envío y Reenvío de Correos</summary>

```http
POST {{url}}/documents/sendmail/to?client_uuid={{client_uuid}}
POST {{url}}/documents/sendmail/{trackId}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Permite enviar un correo libre con archivos en base64 (`/sendmail/to`) o reenviar por CUFE/CUDE un documento ya validado (`/sendmail/{trackId}`) al adquirente u otros destinatarios.

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `trackId` | path | Solo en `/sendmail/{trackId}` | CUFE/CUDE (`XmlDocumentKey`) de un documento de la empresa. |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

**Body:**

| Campo | Endpoint | Requerido | Descripción |
|---|---|---|---|
| `email_to` | Ambos | ✅ Sí | Una o varias direcciones separadas por `,` o `;` (más de 10 caracteres en total). En `/sendmail/{trackId}` no puede contener espacios; en `/sendmail/to` los espacios se eliminan. |
| `subject` | `/sendmail/to` | No | Asunto del correo. |
| `title` | `/sendmail/to` | No | Título del cuerpo del correo. |
| `message` | `/sendmail/to` | No | Texto del cuerpo del correo. |
| `documents` | `/sendmail/to` | No | Archivos a adjuntar: arreglo de objetos con `name`, `content` (base64) y `mime`. |
| `attachments` | `/sendmail/to` | No | Adjuntos adicionales del usuario, con la misma estructura del campo [`attachments`](/docs/billing-fields#attachments-new) de la emisión. |

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "{{url}}/documents/sendmail/{{trackId}}" \
  -H "Authorization: Bearer {token}" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"email_to": "compras@cliente-ejemplo.com;contabilidad@cliente-ejemplo.com"}'
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
const response = await axios.post(
  `${url}/documents/sendmail/to`,
  {
    email_to: 'compras@cliente-ejemplo.com',
    subject: 'Factura LZT836',
    title: 'Factura electrónica',
    message: 'Adjuntamos su factura.',
    documents: [{ name: 'factura.pdf', content: pdfBase64, mime: 'application/pdf' }]
  },
  { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }
);
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$response = $client->post("{$url}/documents/sendmail/{$trackId}", [
    'headers' => ['Authorization' => "Bearer {$token}", 'Accept' => 'application/json'],
    'json'    => ['email_to' => 'compras@cliente-ejemplo.com'],
]);
```

</TabItem>
</Tabs>

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

El envío es asíncrono: la respuesta confirma que el proceso inició y no devuelve la lista de destinatarios.

```json
{
  "message": "Se ha iniciado el proceso de envío del correo electrónico.",
  "success": true
}
```

En `/sendmail/{trackId}` el correo de una factura adjunta el ZIP (PDF + AttachedDocument) más los adjuntos que haya cargado el usuario; el PDF no se adjunta suelto.

</details>

<details>
<summary>🛡️ Validación de destinatarios (HTTP 400)</summary>

Antes de encolar el correo, en los dos endpoints se valida **cada** destinatario: el formato de la dirección y que su dominio pueda recibir correo. Si **una sola** dirección no puede recibir correo, se bloquea el envío completo:

```json
{
  "success": false,
  "message": "El envío fue bloqueado automáticamente porque la(s) siguiente(s) dirección(es) no puede(n) recibir correo. Verifique que estén bien escritas: compras@dominio-inexistente.com (el dominio dominio-inexistente.com no existe o no recibe correo), ventas@ (formato inválido)"
}
```

Si algún destinatario figura en la lista de supresión (por rebotes permanentes o quejas de spam anteriores), también se bloquea con HTTP 400: `El envío fue bloqueado automáticamente porque la(s) siguiente(s) dirección(es) de destinatario(s) se encuentra(n) en nuestra lista de supresión (...)`.

Esta validación ocurre antes de buscar el documento: un correo inválido responde 400 aunque el `trackId` no exista.

</details>

<details>
<summary>❌ Otros errores de <code>/sendmail/&#123;trackId&#125;</code></summary>

| HTTP | `message` |
|---|---|
| 400 | `Debe indicar, al menos un correo, a donde desea enviar el documento.` |
| 404 | `El trackId del documento no existe en la base de datos.` |
| 409 | `El documento no está validado por la DIAN y no puede enviarse por correo.` |
| 404 | `No se encontró el documento para el envío de correo.` |
| 400 | `No se puede enviar un correo electrónico a consumidor final.` |
| 400 | `El documento nómina electrónica no está soportado para el envío de email.` |
| 409 | `El documento {id} ya tiene N trabajo(s) de envío en proceso. Intente más tarde.` |
| 400 | `Límite de destinatarios excedido. Máximo permitido: X, solicitados: Y` |
| 400 | `No se pudo enviar el email a ningún destinatario. Errores: ...` |
| 500 | `Error interno del servidor. Hay espacios en blanco en la lista de correos electrónicos.` (incluye `reference`) |

En `/sendmail/to` aplica el mismo error 400 cuando falta `email_to` o es demasiado corto.

</details>

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/acquirer</b> — Consulta de Adquirente</summary>

```http
GET {{url}}/acquirer?identificationType=13&identificationNumber=1063279303&client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Retorna información asociada (como correos) de un Adquirente registrado previamente en las facturas.

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `identificationType` | query | ✅ Sí | Tipo de identificación (`13`=CC, `31`=NIT, etc.). |
| `identificationNumber` | query | ✅ Sí | Número de documento del adquirente. |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "message": "Consulta generada con éxito",
  "content": {
    "ReceiverEmail": "correo@cliente.com",
    "ReceiverName": "CLIENTE EJEMPLO S.A.S",
    "StatusCode": "200"
  },
  "customer": {
    "id": 748,
    "country_id": 45,
    "city_id": 149,
    "identity_document_id": 3,
    "company_name": "CLIENTE EJEMPLO S.A.S",
    "dni": "901091403",
    "email": "correo@cliente.com"
  }
}
```

</details>

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/exchange-emails</b> — Intercambio de Correos</summary>

```http
GET {{url}}/exchange-emails?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Obtiene la lista de correos registrados para recepción en la plataforma.

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

</details>

---

## 🔢 Numeración {#numeracion}

<details open>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/numbering-range</b> — Rango de Numeración</summary>

```http
GET {{url}}/numbering-range?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Obtiene las resoluciones y rangos de numeración activos de facturación.

:::tip Sincronización con la DIAN
Agrega `?sync=1` para forzar la sincronización del rango de numeración con los servicios SOAP de la DIAN (`GetNumberingRange`).
:::

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `type_id` | query | No | Tipo de documento: `1`=Factura, `3`=Doc Soporte, `4`=POS. |
| `sync` | query | No | `1` fuerza sincronización con la DIAN. |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "dataRecords": {
    "data": [
      {
        "id": 1,
        "resolution_number": "18764074347312",
        "prefix": "LZT",
        "from_number": 1,
        "to_number": 5000000,
        "current_number": 836,
        "date_from": "2024-01-01",
        "date_to": "2027-12-31",
        "is_active": true
      }
    ]
  },
  "success": true
}
```

</details>

</details>
