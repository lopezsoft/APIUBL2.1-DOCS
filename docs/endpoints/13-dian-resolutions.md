---
sidebar_position: 13
sidebar_label: 📄 Resoluciones DIAN
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 📄 Resoluciones DIAN

> ✅ **Autenticación REQUERIDA**
> Incluir en todos los endpoints de esta sección el header: `Authorization: Bearer {token}`

:::info ¿Dónde obtener el `client_uuid`? — Parámetro Multi-Tenant para Casas de Software
Si operas como **Casa de Software** o **Cuenta Principal**, puedes consultar, registrar, sincronizar y administrar las resoluciones de facturación de tus empresas cliente agregando el parámetro `client_uuid` en la query string de la URL:
- **URL con Query Param:** `{{url}}/resolutions?client_uuid={{client_uuid}}`
- **Header:** `Authorization: Bearer {token_cuenta_principal}`
- **Comportamiento:** La operación de resoluciones y rangos de numeración se ejecutará sobre la empresa cliente especificada por su UUID.

**¿Dónde encontrar el `client_uuid` de tus clientes?**  
Puedes consultar el listado completo de tus empresas cliente y sus respectivos `client_uuid` mediante el endpoint:
```http
GET {{url}}/company/customers
Authorization: Bearer {token}
Content-Type: application/json
```
:::

---

## Listar Resoluciones DIAN

### Listar Resoluciones DIAN - 🔵 GET
```http
GET {{url}}/resolutions?query=1&type_id=1&client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Retorna el listado de resoluciones de facturación configuradas en la empresa, permitiendo filtrar por término de búsqueda y por tipo de documento.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `query` | query | No | Término de búsqueda por número de resolución, prefijo o nombre de factura. |
| `type_id` | query | No | Tipo de documento: `1` Factura Electrónica, `3` Documento Soporte, `4` P.O.S Electrónico. |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Respuesta Exitosa (HTTP 200):**
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

---

## Obtener una Resolución por ID

### Obtener una Resolución por ID - 🔵 GET
```http
GET {{url}}/resolutions/{id}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `id` | path | ✅ Sí | ID numérico de la resolución. |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). |

**Respuesta Exitosa (HTTP 200):**
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

---

## Crear Resolución DIAN

### Crear Resolución DIAN - 🟘 POST
```http
POST {{url}}/resolutions?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Crea manualmente una resolución de facturación en la plataforma. 

:::info 💡 Guía para Desarrolladores — Formato del Payload `records`
Este endpoint recibe los datos del formulario encapsulados dentro de la propiedad **`records`** como una cadena JSON serializada (`stringified JSON`). A continuación tienes ejemplos listos para copiar en diferentes lenguajes de programación:
:::

<Tabs>
<TabItem value="js" label="JavaScript / Node.js" default>

```javascript
import axios from 'axios';

// 1. Definir los datos de la resolución
const records = {
  type_document_id: 4,               // 1: Factura, 3: Doc Soporte, 4: Nota Débito, 5: Nota Crédito, 20: POS
  resolution_number: "18763005880468",// Número de resolución DIAN
  prefix: "NB",                      // Prefijo de numeración
  invoice_name: "NOTA DÉBITO",       // Título impreso del documento
  range_from: 1,                     // Rango inicial autorizado
  range_up: 10000,                   // Rango final autorizado
  date_from: "2020-01-01",           // Vigencia desde (YYYY-MM-DD)
  date_up: "2029-12-31",             // Vigencia hasta (YYYY-MM-DD)
  initial_number: 1,                 // Consecutivo inicial
  headerline1: "Encabezado",         // Opcional
  headerline2: "Línea 2",            // Opcional
  footline1: "",                     // Opcional
  active: 1,                         // 1: Activa, 0: Inactiva
  technical_key: null                // Clave técnica DIAN si aplica
};

// 2. Enviar la petición serializando records en JSON
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
<TabItem value="php" label="PHP (Guzzle / cURL)">

```php
<?php
// 1. Definir los datos de la resolución
$records = [
    'type_document_id'  => 4,
    'resolution_number' => '18763005880468',
    'prefix'            => 'NB',
    'invoice_name'      => 'NOTA DÉBITO',
    'range_from'        => 1,
    'range_up'          => 10000,
    'date_from'         => '2020-01-01',
    'date_up'           => '2029-12-31',
    'initial_number'    => 1,
    'headerline1'       => 'Encabezado',
    'headerline2'       => 'Línea 2',
    'active'            => 1,
    'technical_key'     => null,
];

// 2. Enviar mediante cURL serializando 'records'
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
    "type_document_id": 4,
    "resolution_number": "18763005880468",
    "prefix": "NB",
    "invoice_name": "NOTA DÉBITO",
    "range_from": 1,
    "range_up": 10000,
    "date_from": "2020-01-01",
    "date_up": "2029-12-31",
    "initial_number": 1,
    "headerline1": "Encabezado",
    "active": 1,
    "technical_key": None
}

# Serializar records como string JSON dentro del body
payload = {
    "records": json.dumps(records)
}

response = requests.post(
    f"{url}/resolutions",
    json=payload,
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
    type_document_id = 4,
    resolution_number = "18763005880468",
    prefix = "NB",
    invoice_name = "NOTA DÉBITO",
    range_from = 1,
    range_up = 10000,
    date_from = "2020-01-01",
    date_up = "2029-12-31",
    initial_number = 1,
    active = 1,
    technical_key = (string)null
};

var payload = new {
    records = JsonSerializer.Serialize(records)
};

var client = new HttpClient();
client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

var response = await client.PostAsJsonAsync($"{url}/resolutions", payload);
```

</TabItem>
<TabItem value="postman" label="Postman (Pre-request Script)">

```javascript
// Pre-request Script en Postman
const records = {
    type_document_id: 4,
    resolution_number: "18763005880468",
    prefix: "NB",
    invoice_name: "NOTA DÉBITO",
    range_from: 1,
    range_up: 10000,
    date_from: "2020-01-01",
    date_up: "2029-12-31",
    initial_number: 1,
    headerline1: "Encabezado",
    headerline2: "Línea 2",
    footline1: "",
    active: 1,
    technical_key: null
};

// Crear y asignar el payload
const payload = { records: JSON.stringify(records) };
pm.request.body.mode = 'raw';
pm.request.body.raw = JSON.stringify(payload);
pm.request.headers.add({key: 'Content-Type', value: 'application/json'});
```

</TabItem>
</Tabs>

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). |

**Body JSON resultante enviado:**
```json
{
  "records": "{\"type_document_id\":4,\"resolution_number\":\"18763005880468\",\"prefix\":\"NB\",\"invoice_name\":\"NOTA DÉBITO\",\"range_from\":1,\"range_up\":10000,\"date_from\":\"2020-01-01\",\"date_up\":\"2029-12-31\",\"initial_number\":1,\"headerline1\":\"Encabezado\",\"headerline2\":\"Línea 2\",\"footline1\":\"\",\"footline2\":\"\",\"footline3\":\"\",\"footline4\":\"\",\"active\":1,\"technical_key\":null}"
}
```

| Propiedad en `records` | Tipo | Requerido | Descripción |
|---|---|---|---|
| `type_document_id` | integer | ✅ Sí | ID del tipo de documento (`1` Factura, `3` Doc Soporte, `4` Nota Débito, `5` Nota Crédito, `20` POS). |
| `resolution_number` | string | ✅ Sí | Número de formulario de resolución otorgado por la DIAN. |
| `prefix` | string | ✅ Sí | Prefijo de facturación autorizado (ej. `FV`, `NB`, `NC`, `DS`). |
| `invoice_name` | string | ✅ Sí | Nombre visible del documento (ej. `FACTURA ELECTRÓNICA DE VENTA`). |
| `range_from` | integer | ✅ Sí | Número inicial del rango autorizado. |
| `range_up` | integer | ✅ Sí | Número final del rango autorizado. |
| `date_from` | string | ✅ Sí | Fecha inicial de vigencia de la resolución (`YYYY-MM-DD`). |
| `date_up` | string | ✅ Sí | Fecha final de vigencia de la resolución (`YYYY-MM-DD`). |
| `initial_number` | integer | ✅ Sí | Consecutivo inicial con el que empezará la emisión. |
| `headerline1` | string | No | Texto de encabezado 1 en la representación gráfica. |
| `headerline2` | string | No | Texto de encabezado 2 en la representación gráfica. |
| `footline1` ... `footline4` | string | No | Textos de pie de página opcionales. |
| `active` | integer | ✅ Sí | `1` Activa (disponible para emitir), `0` Inactiva. |
| `technical_key` | string | No | Clave técnica asignada por la DIAN para la resolución. |

**Respuesta Exitosa (HTTP 201):**
```json
{
  "success": true,
  "message": "Registro guardado exitosamente"
}
```

**Respuesta de Error (HTTP 400 - Resolución Duplicada):**
```json
{
  "message": "Ya existe una resolución con el mismo número(18763005880468) y prefijo(NB). Por favor verifique",
  "success": false
}
```

---

## Actualizar Resolución DIAN

### Actualizar Resolución DIAN - 🟠 PUT
```http
PUT {{url}}/resolutions/{id}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Actualiza los datos de configuración de una resolución de facturación existente.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `id` | path | ✅ Sí | ID numérico de la resolución a actualizar. |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). |

**Body (JSON):**
```json
{
  "records": "{\"type_document_id\":4,\"resolution_number\":\"18763005880468\",\"prefix\":\"NB\",\"invoice_name\":\"NOTA DÉBITO\",\"range_from\":1,\"range_up\":10000,\"date_from\":\"2020-01-01\",\"date_up\":\"2029-12-31\",\"initial_number\":1,\"headerline1\":\"Encabezado\",\"headerline2\":\"Línea 2\",\"footline1\":\"\",\"footline2\":\"\",\"footline3\":\"\",\"footline4\":\"\",\"active\":1}"
}
```

**Respuesta Exitosa (HTTP 200):**
```json
{
  "success": true,
  "message": "Registro actualizado exitosamente"
}
```

---

## Eliminar Resolución DIAN

### Eliminar Resolución DIAN - 🔴 DELETE
```http
DELETE {{url}}/resolutions/{id}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `id` | path | ✅ Sí | ID numérico de la resolución a eliminar. |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). |

**Respuesta Exitosa (HTTP 200):**
```json
{
  "success": true,
  "message": "Resolución eliminada exitosamente"
}
```

---

## Sincronizar Resoluciones con DIAN

### Sincronizar Resoluciones con DIAN - 🔵 GET
```http
GET {{url}}/numbering-range?type_id=1&sync=1&client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Consulta directamente el servicio web de la DIAN (`GetNumberingRange`) y sincroniza de forma automática los rangos de numeración autorizados y sus claves técnicas con la base de datos local.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `type_id` | query | No | Tipo de documento a consultar: `1` Facturación Electrónica, `3` Documento Soporte, `4` P.O.S Electrónico. Omitir para consultar todos. |
| `sync` | query | No | `1` para forzar la sincronización y actualización automática en la base de datos (por defecto activo). |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). |

**Respuesta Exitosa (HTTP 200):**
```json
{
  "message": "Consulta generada con éxito",
  "ResponseDian": {
    "Envelope": {
      "Header": {
        "Action": {
          "_attributes": {
            "mustUnderstand": "1"
          },
          "_value": "http://wcf.dian.colombia/IWcfDianCustomerServices/GetNumberingRangeResponse"
        }
      },
      "Body": {
        "GetNumberingRangeResponse": {
          "GetNumberingRangeResult": {
            "OperationCode": "100",
            "OperationDescription": "Acción completada OK.",
            "ResponseList": {
              "NumberRangeResponse": [
                {
                  "ResolutionNumber": "18764082739152",
                  "ResolutionDate": "2024-11-01",
                  "Prefix": "DSL",
                  "FromNumber": "1",
                  "ToNumber": "2000",
                  "ValidDateFrom": "2024-11-01",
                  "ValidDateTo": "2026-11-01",
                  "TechnicalKey": {
                    "_attributes": {
                      "nil": "true"
                    }
                  }
                },
                {
                  "ResolutionNumber": "18764110237931",
                  "ResolutionDate": "2026-05-26",
                  "Prefix": "FVL",
                  "FromNumber": "730",
                  "ToNumber": "5000",
                  "ValidDateFrom": "2026-05-26",
                  "ValidDateTo": "2028-05-26",
                  "TechnicalKey": "2a954e75b0ee5957f5f88fda2f1d968ffee34bacaa867818463fc27251a076a2"
                },
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
    "created": 3,
    "updated": 0,
    "failed": 0,
    "errors": [],
    "total": 3
  },
  "success": true
}
```
