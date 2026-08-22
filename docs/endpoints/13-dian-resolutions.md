---
sidebar_position: 13
sidebar_label: 📄 Resoluciones DIAN
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

---

## 📋 Consulta y Sincronización {#consulta-sincronizacion}

<details open>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/resolutions</b> — Listar Resoluciones</summary>

```http
GET {{url}}/resolutions?query=1&type_id=1&client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Retorna el listado de resoluciones de facturación configuradas en la empresa, permitiendo filtrar por término de búsqueda y por tipo de documento.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `query` | query | No | Término de búsqueda por número de resolución, prefijo o nombre. |
| `type_id` | query | No | `1` Factura, `3` Documento Soporte, `4` POS. |
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "dataRecords": {
    "data": [
      {
        "id": 813,
        "type_document_id": 1,
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
    ]
  }
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

```json
{
  "dataRecords": {
    "data": {
      "id": 813,
      "type_document_id": 1,
      "prefix": "FV",
      "resolution_number": "18764074347312",
      "range_from": 1,
      "range_up": 5000000,
      "date_from": "2024-01-01",
      "date_up": "2025-12-31",
      "initial_number": 1,
      "active": 1
    }
  }
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

**Descripción:** Consulta directamente el servicio SOAP de la DIAN (`GetNumberingRange`) y sincroniza de forma automática los rangos autorizados y claves técnicas con la base de datos local.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `type_id` | query | No | `1` Facturación, `3` Doc Soporte, `4` POS. Omitir para consultar todos. |
| `sync` | query | No | `1` para forzar la sincronización automática (default activo). |
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

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
    "total": 1
  },
  "success": true
}
```

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
  type_document_id: 1,               // 1: Factura, 3: Doc Soporte, 4: Nota Débito, 5: Nota Crédito, 20: POS
  resolution_number: "18763005880468",// Número de resolución DIAN
  prefix: "FV",                      // Prefijo
  invoice_name: "FACTURA ELECTRÓNICA DE VENTA",
  range_from: 1,                     // Rango inicial
  range_up: 10000,                   // Rango final
  date_from: "2026-01-01",           // Vigencia desde (YYYY-MM-DD)
  date_up: "2028-12-31",             // Vigencia hasta (YYYY-MM-DD)
  initial_number: 1,                 // Consecutivo inicial
  headerline1: "Encabezado",         // Opcional
  headerline2: "Línea 2",            // Opcional
  active: 1,                         // 1: Activa, 0: Inactiva
  technical_key: "clave_tecnica_dian"// Clave técnica DIAN
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
    'type_document_id'  => 1,
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
    "type_document_id": 1,
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
    type_document_id = 1,
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
    type_document_id: 1,
    resolution_number: "18763005880468",
    prefix: "FV",
    invoice_name: "FACTURA ELECTRÓNICA DE VENTA",
    range_from: 1,
    range_up = 10000,
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
| `type_document_id` | integer | ✅ Sí | `1` Factura, `3` Doc Soporte, `4` Nota Débito, `5` Nota Crédito, `20` POS. |
| `resolution_number` | string | ✅ Sí | Número de resolución otorgado por la DIAN. |
| `prefix` | string | ✅ Sí | Prefijo autorizado (ej. `FV`, `NC`, `DS`). |
| `invoice_name` | string | ✅ Sí | Título impreso del documento. |
| `range_from` | integer | ✅ Sí | Número inicial del rango autorizado. |
| `range_up` | integer | ✅ Sí | Número final del rango autorizado. |
| `date_from` | string | ✅ Sí | Vigencia desde (`YYYY-MM-DD`). |
| `date_up` | string | ✅ Sí | Vigencia hasta (`YYYY-MM-DD`). |
| `initial_number` | integer | ✅ Sí | Consecutivo inicial de emisión. |
| `headerline1` | string | No | Encabezado 1 en PDF. |
| `headerline2` | string | No | Encabezado 2 en PDF. |
| `active` | integer | ✅ Sí | `1` Activa, `0` Inactiva. |
| `technical_key` | string | No | Clave técnica DIAN. |

<details>
<summary>✅ Respuesta Exitosa (HTTP 201)</summary>

```json
{
  "success": true,
  "message": "Registro guardado exitosamente"
}
```

</details>

<details>
<summary>❌ Resolución Duplicada (HTTP 400)</summary>

```json
{
  "message": "Ya existe una resolución con el mismo número y prefijo. Por favor verifique",
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

**Body (JSON):** Igual esquema que `POST /resolutions` encapsulado en `records`.

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "success": true,
  "message": "Registro actualizado exitosamente"
}
```

</details>

</details>

<details>
<summary><span className="badge badge--danger margin-right--sm">DELETE</span> <b>/resolutions/&#123;id&#125;</b> — Eliminar Resolución</summary>

```http
DELETE {{url}}/resolutions/{id}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `id` | path | ✅ Sí | ID numérico de la resolución a eliminar. |
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "success": true,
  "message": "Resolución eliminada exitosamente"
}
```

</details>

</details>
