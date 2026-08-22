---
sidebar_position: 6
sidebar_label: 🔍 Consultas y Estados
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
| `limit` | query | No | Límite de registros retornados. |
| `start_date` | query | No | Fecha inicial de emisión (`YYYY-MM-DD`). |
| `end_date` | query | No | Fecha final de emisión (`YYYY-MM-DD`). |
| `document_key` | query | No | CUFE o CUDE del documento. |
| `document_type` | query | No | Tipo de documento (`01`=Factura, etc.). |
| `document_status` | query | No | Estado (`-1`=Rechazado, `0`=Pendiente, `1`=Aceptado). |
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
        "uuid": "dde72910-eb42-11ef-9b27-f02f74cac485",
        "document_number": "LZT836",
        "document_key": "cf9864294501e8a9578235dd2ab3c4fd...",
        "is_valid": true,
        "invoice_date": "2026-08-01T05:00:00.000000Z"
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
GET {{url}}/documents/consume?p_year=2024&p_type=4&p_dni=901091403&client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Devuelve el reporte de documentos consumidos (usados).

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `p_year` | query | No | Año del reporte. |
| `p_type` | query | No | Tipo de agrupación (por mes, año, cliente, etc.). |
| `p_dni` | query | No | NIT a consultar. |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

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

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/documents/xml/&#123;trackId&#125;</b> — Descargar XML</summary>

```http
GET {{url}}/documents/xml/{trackId}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `trackId` | path | ✅ Sí | CUFE/CUDE del documento. |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

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
const isValid = response.data.ResponseDian.Envelope.Body.GetStatusResponse.GetStatusResult.IsValid;
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

```json
{
  "message": "Consulta generada con éxito",
  "ResponseDian": {
    "Envelope": {
      "Body": {
        "GetStatusResponse": {
          "GetStatusResult": {
            "IsValid": "true",
            "StatusCode": "00",
            "StatusDescription": "Procesado Correctamente.",
            "StatusMessage": "Documento verificado y validado por la DIAN."
          }
        }
      }
    }
  },
  "success": true
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

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "message": "Consulta generada con éxito",
  "ResponseDian": {
    "Envelope": {
      "Body": {
        "GetStatusResponse": {
          "GetStatusResult": {
            "IsValid": "true",
            "StatusCode": "00",
            "StatusDescription": "Procesado Correctamente.",
            "StatusMessage": "Documento verificado y validado por la DIAN."
          }
        }
      }
    }
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
    "Envelope": {
      "Body": {
        "GetStatusResponse": {
          "GetStatusResult": {
            "IsValid": "true",
            "StatusCode": "00",
            "StatusDescription": "Procesado Correctamente.",
            "StatusMessage": "Documento verificado y validado por la DIAN."
          }
        }
      }
    }
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

Obtiene información del documento registrado en el API, validación y detalles del Código QR.

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `order_number` | query | No | Número de orden interno. |
| `number` | query | No | Número de documento. |
| `prefix` | query | No | Prefijo de la resolución. |
| `resolution` | query | No | Número de resolución. |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "document": {
    "uuid": "dde72910-eb42-11ef-9b27-f02f74cac485",
    "document_number": "LZT836",
    "document_key": "cf9864294501e8a9578235dd2ab3c4fd1d9085fe5d3b345d191fbb8c9afa6ff8acec7a97a177393b2d32735d225a9f1d",
    "is_valid": true,
    "invoice_date": "2025-02-14T05:00:00.000000Z",
    "qr": {
      "qrDian": "https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=cf9864...",
      "data": "TnVtRmFjOiBMWlQ4MzYK..."
    }
  },
  "status": "Validado por la DIAN",
  "message": "Consulta exitosa",
  "success": true
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

Permite enviar por primera vez (con base64 adjuntos) o reenviar un documento ya emitido por CUFE/CUDE al adquirente u otros destinatarios.

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `trackId` | path | No | CUFE/CUDE del documento (para reenvío por ID). |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "success": true,
  "message": "Correo electrónico enviado satisfactoriamente",
  "recipients": ["cliente@correo.com"]
}
```

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
