---
sidebar_position: 13
sidebar_label: 📄 Resoluciones DIAN
description: "Resoluciones de numeración DIAN: creación manual, consulta, actualización, eliminación y sincronización con la DIAN."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 📄 Resoluciones DIAN {#resoluciones-dian}

:::warning Autenticación Requerida
Incluir en todos los endpoints de esta sección el header: `Authorization: Bearer {token}`
:::

:::info Parámetro Multi-Tenant: `client_uuid`
Si operas como **Casa de Software**, puedes administrar las resoluciones de tus empresas cliente agregando `?client_uuid={{client_uuid}}`.
```http
GET {{url}}/company/customers
Authorization: Bearer {token}
```
:::

:::tip Tipos de documento (`type_document_id`)
El `type_document_id` de una resolución es el mismo que envías al emitir el documento, y con él la API busca la resolución al numerar. Valores habituales:

| `type_document_id` | Documento |
|---|---|
| `7` | Factura electrónica |
| `8` | Factura de exportación |
| `9` · `10` | Factura por contingencia (facturador · DIAN) |
| `4` · `5` | Nota débito · Nota crédito |
| `11` | Documento soporte |
| `15` | Nota de ajuste del documento soporte |
| `20` | POS electrónico |
| `93` · `94` | Nota débito · Nota crédito POS electrónico |
| `25`, `27`, `30` … `60` | Otros documentos equivalentes electrónicos |

Los valores `1` y `3` no son tipos de documento: una resolución creada con ellos nunca la encuentra la emisión.
:::

---

## 📋 Consulta y Sincronización {#consulta-sincronizacion}

<details open>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/resolutions</b> — Listar Resoluciones</summary>

```http
GET {{url}}/resolutions?query=FV&active=1&limit=15&page=1&client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Retorna, paginadas, las resoluciones de la empresa, con un filtro opcional por término de búsqueda.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `query` | query | No | Coincidencia parcial en prefijo, número de resolución, nombre (`invoice_name`) o nombre del tipo de documento. También se acepta como `search`, `searchQuery` o `searchParam`. |
| `active` | query | No | `1` (default) resoluciones activas, `0` resoluciones inactivas (incluidas las eliminadas con `DELETE`). |
| `limit` | query | No | Registros por página. Default `15`. |
| `page` | query | No | Página. |
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json title="Respuesta (extracto)"
{
  "dataRecords": {
    "current_page": 1,
    "data": [
      {
        "id": 813,
        "type_document_id": 7,
        "resolution_number": "18764074347312",
        "prefix": "FV",
        "invoice_name": "FACTURA ELECTRÓNICA DE VENTA",
        "range_from": 1,
        "range_up": 5000000,
        "date_from": "2024-01-01",
        "date_up": "2025-12-31",
        "initial_number": 1,
        "active": 1
      }
    ],
    "per_page": 15,
    "total": 1
  },
  "success": true
}
```

</details>

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/resolutions/&#123;id&#125;</b> — Obtener Resolución por ID</summary>

```http
GET {{url}}/resolutions/{id}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `id` | path | ✅ Sí | ID numérico de la resolución. |
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json title="Respuesta (extracto)"
{
  "dataRecords": {
    "data": {
      "id": 813,
      "type_document_id": 7,
      "prefix": "FV",
      "resolution_number": "18764074347312",
      "range_from": 1,
      "range_up": 5000000,
      "date_from": "2024-01-01",
      "date_up": "2025-12-31",
      "initial_number": 1,
      "active": 1
    }
  },
  "success": true
}
```

</details>

<details>
<summary>❌ Resolución no encontrada (HTTP 404)</summary>

```json
{
  "message": "No se encontró la resolución con ID: 813 para la empresa con ID: 1262.",
  "success": false
}
```

</details>

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/numbering-range</b> — Sincronizar Resoluciones con DIAN</summary>

```http
GET {{url}}/numbering-range?type_id=1&sync=1&client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Consulta en la DIAN los rangos de numeración autorizados para el software de la empresa y, si ese software está en **producción**, los sincroniza con las resoluciones de la empresa. Requiere un certificado digital válido.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `type_id` | query | No | Software de la empresa con el que se consulta: `1` Facturación (default), `3` Documento Soporte, `4` POS / Documento equivalente. Omitirlo equivale a `1`. La nómina electrónica no maneja rangos de numeración. |
| `sync` | query | No | `1` (default) sincroniza las resoluciones; `0` solo consulta. |
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

**Cómo sincroniza:**

- Solo si el software tiene `environment_id` `1` (producción) y `sync` está activo. En otro caso `sync` es `null`.
- Con `type_id=1`, cada rango con `TechnicalKey` se guarda como factura electrónica (`type_document_id` `7`) y cada rango sin `TechnicalKey` como documento soporte (`11`). Con `type_id=3` se guarda como `11` y con `type_id=4` como `20`.
- Cada rango se busca por tipo de documento, prefijo y número de resolución: si existe se actualiza (conserva su `initial_number`); si no, se crea con `initial_number` igual al `FromNumber` de la DIAN. En ambos casos queda activo.
- Una numeración sin prefijo se sincroniza con prefijo vacío. Un rango sin `ResolutionNumber` no se guarda y se cuenta como fallido (`ResolutionNumber vacío en respuesta DIAN`).

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "message": "Consulta generada con éxito",
  "ResponseDian": {
    "Envelope": {
      "Body": {
        "GetNumberingRangeResponse": {
          "GetNumberingRangeResult": {
            "OperationCode": "100",
            "OperationDescription": "Acción completada OK.",
            "ResponseList": {
              "NumberRangeResponse": [
                {
                  "ResolutionNumber": "18764112492320",
                  "ResolutionDate": "2026-07-14",
                  "Prefix": "LZT",
                  "FromNumber": "5000",
                  "ToNumber": "10000",
                  "ValidDateFrom": "2026-07-14",
                  "ValidDateTo": "2028-07-14",
                  "TechnicalKey": "20e961ce6420ef81a1dd2190c33234d22254cf719dd726da7fff7047c0bdda91"
                }
              ]
            }
          }
        }
      }
    }
  },
  "sync": {
    "created": 1,
    "updated": 0,
    "failed": 0,
    "errors": [],
    "total": 1
  },
  "success": true
}
```

| Campo de `sync` | Descripción |
|---|---|
| `created` · `updated` · `failed` | Resoluciones creadas, actualizadas y fallidas. |
| `errors` | Detalle de los fallos: `{ "resolution_number": "...", "error": "..." }` o `{ "error": "..." }`. |
| `total` | Rangos recibidos de la DIAN. |
| `skipped` · `reason` | Solo aparecen cuando no se sincronizó nada: la respuesta de la DIAN no se pudo leer, no trajo rangos o su `OperationCode` no es `100`. `reason` explica el motivo. |

</details>

</details>

---

## ⚙️ Configuración Manual {#configuracion-manual}

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/resolutions</b> — Crear Resolución Manual</summary>

```http
POST {{url}}/resolutions?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Crea manualmente una resolución de facturación en la plataforma.

:::info 💡 Guía para Desarrolladores — Formato del Payload `records`
Este endpoint recibe los datos encapsulados dentro de la propiedad **`records`** como una cadena JSON serializada (`stringified JSON`).
:::

<Tabs>
<TabItem value="js" label="JavaScript / Node.js" default>

```javascript
import axios from 'axios';

const records = {
  type_document_id: 7,               // 7: Factura, 11: Doc Soporte, 4: Nota Débito, 5: Nota Crédito, 20: POS
  resolution_number: "18763005880468",// Número de resolución DIAN
  prefix: "FV",                      // Prefijo (opcional)
  invoice_name: "FACTURA ELECTRÓNICA DE VENTA",
  range_from: 1,                     // Rango inicial
  range_up: 10000,                   // Rango final
  date_from: "2026-01-01",           // Vigencia desde (YYYY-MM-DD)
  date_up: "2028-12-31",             // Vigencia hasta (YYYY-MM-DD)
  initial_number: 1,                 // Consecutivo inicial
  headerline1: "Encabezado",         // Opcional
  headerline2: "Línea 2",            // Opcional
  active: 1,                         // 1: Activa, 0: Inactiva
  technical_key: "clave_tecnica_dian"// Clave técnica DIAN (opcional)
};

const response = await axios.post(`${url}/resolutions`, {
  records: JSON.stringify(records)
}, {
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  }
});
```

</TabItem>
<TabItem value="php" label="PHP (cURL)">

```php
<?php
$records = [
    'type_document_id'  => 7,
    'resolution_number' => '18763005880468',
    'prefix'            => 'FV',
    'invoice_name'      => 'FACTURA ELECTRÓNICA DE VENTA',
    'range_from'        => 1,
    'range_up'          => 10000,
    'date_from'         => '2026-01-01',
    'date_up'           => '2028-12-31',
    'initial_number'    => 1,
    'active'            => 1,
    'technical_key'     => 'clave_tecnica_dian',
];

$payload = json_encode(['records' => json_encode($records)]);

$ch = curl_init("{$url}/resolutions");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $payload,
    CURLOPT_HTTPHEADER     => [
        'Authorization: Bearer ' . $token,
        'Content-Type: application/json'
    ],
]);

$response = curl_exec($ch);
curl_close($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
import json
import requests

records = {
    "type_document_id": 7,
    "resolution_number": "18763005880468",
    "prefix": "FV",
    "invoice_name": "FACTURA ELECTRÓNICA DE VENTA",
    "range_from": 1,
    "range_up": 10000,
    "date_from": "2026-01-01",
    "date_up": "2028-12-31",
    "initial_number": 1,
    "active": 1,
    "technical_key": "clave_tecnica_dian"
}

response = requests.post(
    f"{url}/resolutions",
    json={"records": json.dumps(records)},
    headers={
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
)
```

</TabItem>
<TabItem value="csharp" label="C# / .NET">

```csharp
using System.Text.Json;
using System.Net.Http.Headers;

var records = new {
    type_document_id = 7,
    resolution_number = "18763005880468",
    prefix = "FV",
    invoice_name = "FACTURA ELECTRÓNICA DE VENTA",
    range_from = 1,
    range_up = 10000,
    date_from = "2026-01-01",
    date_up = "2028-12-31",
    initial_number = 1,
    active = 1,
    technical_key = "clave_tecnica_dian"
};

var client = new HttpClient();
client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
var response = await client.PostAsJsonAsync($"{url}/resolutions", new {
    records = JsonSerializer.Serialize(records)
});
```

</TabItem>
<TabItem value="postman" label="Postman">

```javascript
const records = {
    type_document_id: 7,
    resolution_number: "18763005880468",
    prefix: "FV",
    invoice_name: "FACTURA ELECTRÓNICA DE VENTA",
    range_from: 1,
    range_up: 10000,
    date_from: "2026-01-01",
    date_up: "2028-12-31",
    initial_number: 1,
    active: 1,
    technical_key: "clave_tecnica_dian"
};

const payload = { records: JSON.stringify(records) };
pm.request.body.mode = 'raw';
pm.request.body.raw = JSON.stringify(payload);
pm.request.headers.add({key: 'Content-Type', value: 'application/json'});
```

</TabItem>
</Tabs>

**Propiedades de `records`:**
| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `type_document_id` | integer | ✅ Sí | Tipo de documento: `7` Factura electrónica, `11` Documento soporte, `4` Nota débito, `5` Nota crédito, `20` POS electrónico (ver la tabla de tipos al inicio de la página). |
| `resolution_number` | string | ✅ Sí | Número de resolución otorgado por la DIAN. Máx. 20 caracteres. |
| `prefix` | string | No | Prefijo autorizado (ej. `FV`, `NC`, `DS`). Máx. 20 caracteres. Si se omite, se guarda vacío. |
| `invoice_name` | string | ✅ Sí | Título impreso del documento. Máx. 120 caracteres. |
| `range_from` | integer | ✅ Sí | Número inicial del rango autorizado. |
| `range_up` | integer | ✅ Sí | Número final del rango autorizado. |
| `date_from` | string | ✅ Sí | Vigencia desde (`YYYY-MM-DD`). |
| `date_up` | string | ✅ Sí | Vigencia hasta (`YYYY-MM-DD`). |
| `initial_number` | integer | ✅ Sí | Consecutivo inicial de emisión. |
| `active` | integer | ✅ Sí | `1` Activa, `0` Inactiva. |
| `headerline1` · `headerline2` | string | No | Encabezados en el PDF. |
| `footline1` … `footline4` | string | No | Pies de página en el PDF. |
| `technical_key` | string | No | Clave técnica DIAN. |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json title="Respuesta (extracto)"
{
  "message": "Registro creado correctamente.",
  "record": {
    "id": 814,
    "company_id": 1262,
    "type_document_id": 7,
    "prefix": "FV",
    "invoice_name": "FACTURA ELECTRÓNICA DE VENTA",
    "range_from": 1,
    "range_up": 10000,
    "initial_number": 1,
    "date_from": "2026-01-01",
    "date_up": "2028-12-31",
    "resolution_number": "18763005880468",
    "technical_key": "clave_tecnica_dian",
    "active": 1
  },
  "success": true
}
```

La respuesta es `200`, no `201`. `record` es la resolución creada, con su `id`.

</details>

<details>
<summary>❌ Error de Validación (HTTP 422)</summary>

Si `records` falta o no es texto JSON, la respuesta es `422` con `El campo records es requerido` o `El campo records debe ser un JSON válido`. Si faltan campos requeridos o exceden su longitud:

```json
{
  "message": "Validación fallida (and 1 more errors)",
  "errors": {
    "invoice_name": ["El campo invoice_name es requerido"],
    "range_up": ["El campo range_up es requerido"]
  },
  "success": false
}
```

Con un solo error, `message` es `Validación fallida`.

</details>

<details>
<summary>❌ Resolución Duplicada (HTTP 400)</summary>

Ya existe en la empresa una resolución con el mismo tipo de documento, número y prefijo. La comprobación incluye las resoluciones inactivas, también las eliminadas con `DELETE` (el borrado es lógico). Para volver a usar una de ellas, búscala con `GET /resolutions?active=0` y reactívala con `PUT /resolutions/{id}` enviando `active` `1`. El mensaje incluye un salto de línea y espacios entre `y` y `prefijo`:

```json
{
  "message": "Ya existe una resolución con el mismo número(18763005880468) y\n                prefijo(FV). Por favor verifique",
  "success": false
}
```

</details>

</details>

<details>
<summary><span className="badge badge--warning margin-right--sm">PUT</span> <b>/resolutions/&#123;id&#125;</b> — Actualizar Resolución</summary>

```http
PUT {{url}}/resolutions/{id}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `id` | path | ✅ Sí | ID numérico de la resolución a actualizar. |
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

**Body (JSON):** `records` serializado como texto JSON, con el mismo esquema que `POST /resolutions`.

:::warning Envía la resolución completa
- `type_document_id`, `invoice_name`, `range_from`, `range_up`, `date_from` y `date_up` deben venir siempre; si falta alguno, la respuesta es `500` (`Server Error`).
- Los demás campos que no envíes **se sobrescriben** con su valor por defecto: `prefix`, `resolution_number`, `technical_key`, encabezados y pies quedan vacíos, `initial_number` en `1` y `active` en `1`.
- `type_document_id` **no se puede cambiar**: se ignora. `resolution_number` y `prefix` sí se actualizan.
:::

```json
{
  "records": "{\"type_document_id\":7,\"resolution_number\":\"18763005880468\",\"prefix\":\"FV\",\"invoice_name\":\"FACTURA ELECTRÓNICA DE VENTA\",\"range_from\":1,\"range_up\":20000,\"date_from\":\"2026-01-01\",\"date_up\":\"2028-12-31\",\"initial_number\":1,\"active\":1,\"technical_key\":\"clave_tecnica_dian\"}"
}
```

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "success": true
}
```

</details>

<details>
<summary>❌ Errores</summary>

| Status | Mensaje | Causa |
|:---:|---|---|
| `422` | `El campo records es requerido` · `El campo records debe ser un JSON válido` | Falta `records` o no es texto JSON. |
| `422` | `Validación fallida` | `invoice_name` o `resolution_number` vienen vacíos o exceden su longitud (120 y 20), o `prefix` excede 20 caracteres. Trae `errors` por campo y `success: false`. |
| `500` | `Server Error` | Falta alguno de los campos que deben venir siempre, o el `{id}` no existe. |

</details>

</details>

<details>
<summary><span className="badge badge--danger margin-right--sm">DELETE</span> <b>/resolutions/&#123;id&#125;</b> — Eliminar Resolución</summary>

```http
DELETE {{url}}/resolutions/{id}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Borrado lógico: la resolución queda inactiva (`active` `0`) y pasa a listarse con `GET /resolutions?active=0`.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `id` | path | ✅ Sí | ID numérico de la resolución a eliminar. |
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "success": true
}
```

</details>

<details>
<summary>❌ Resolución no encontrada (HTTP 404)</summary>

```json
{
  "message": "No se encontró la resolución con ID: 813 para la empresa: EMPRESA EJEMPLO S.A.S.",
  "success": false
}
```

</details>

</details>
