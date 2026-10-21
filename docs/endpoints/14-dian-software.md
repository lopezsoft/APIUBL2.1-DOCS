---
sidebar_position: 14
sidebar_label: 💻 Software DIAN
description: "Software DIAN de la empresa: registro, consulta, actualización y eliminación del identificador y PIN por tipo de documento."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 💻 Software DIAN {#software-dian}

:::warning Autenticación Requerida
Incluir en todos los endpoints de esta sección el header: `Authorization: Bearer {token}`
:::

:::info Parámetro Multi-Tenant: `client_uuid`
Si operas como **Casa de Software**, puedes configurar el software DIAN de tus empresas cliente agregando `?client_uuid={{client_uuid}}`.
```http
GET {{url}}/company/customers
Authorization: Bearer {token}
```
:::

:::tip Valores de `environment_id` y `type_id`
| Campo | Valores |
|---|---|
| `environment_id` | `1` Producción · `2` Pruebas / Habilitación. Al iniciar la habilitación el software pasa a `2` y, al terminarla con éxito, a `1`. |
| `type_id` | `1` Facturación electrónica (facturas y notas) · `2` Nómina electrónica · `3` Documento soporte (y su nota de ajuste) · `4` POS / Documento equivalente electrónico. |

Solo puede existir **un software por empresa y `type_id`**.
:::

---

## 📋 Consulta de Software DIAN {#consulta-software}

<details open>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/software</b> — Listar Software DIAN</summary>

```http
GET {{url}}/software?page=1&client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Lista, paginado, el software DIAN de la empresa. Cada software trae su último proceso de habilitación en `test_process` (`null` si nunca se inició).

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `page` | query | No | Página (15 por página). |
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json title="Respuesta (extracto)"
{
  "dataRecords": {
    "current_page": 1,
    "data": [
      {
        "id": 27,
        "environment_id": 1,
        "type_id": 1,
        "identification": "96ab0f7c-2ab0-4de4-8c30-1268e6c8c6c3",
        "pin": "12345",
        "technical_key": "fc8eac422eba16e22ffd8c6f94b3f40a6e38162c",
        "testsetid": "6142be76-4d36-5c08-8729-33a58c67177b",
        "initial_number": 100,
        "test_process_status": "INITIAL",
        "typeDescription": "Facturación",
        "integrationDescription": "Software propio",
        "test_process": null
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
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/software/&#123;id&#125;</b> — Obtener Software DIAN por ID</summary>

```http
GET {{url}}/software/{id}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `id` | path | ✅ Sí | ID del software registrado. |
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json title="Respuesta (extracto)"
{
  "dataRecords": {
    "data": {
      "id": 27,
      "environment_id": 1,
      "type_id": 1,
      "identification": "96ab0f7c-2ab0-4de4-8c30-1268e6c8c6c3",
      "testsetid": "6142be76-4d36-5c08-8729-33a58c67177b",
      "initial_number": 100,
      "test_process": null
    }
  },
  "success": true
}
```

</details>

<details>
<summary>❌ Software no encontrado (HTTP 404)</summary>

```json
{
  "success": false,
  "message": "No se encontró el software para la compañía especificada."
}
```

</details>

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/software/test/&#123;id&#125;</b> — Listado de Set de Pruebas DIAN</summary>

```http
GET {{url}}/software/test/{id}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Lista, paginados (15 por página) y del más reciente al más antiguo, los procesos de habilitación del software indicado. Cada proceso trae su estado, el software y los documentos de prueba enviados a la DIAN. Si el software no existe o no es de la empresa, `data` viene vacío.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `id` | path | ✅ Sí | ID del software registrado (`software_id`). |
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
        "id": 54,
        "uuid": "3b9d2f1e-5c4a-4e7b-9a10-2f6c8d1e4b73",
        "status": "FINISHED",
        "status_description": "Finalizado",
        "software_id": 27,
        "error_message": {
          "string": "El proceso de habilitación ha sido finalizado con éxito."
        },
        "StatusDescription": null,
        "documents": [
          {
            "id": 310,
            "process_id": 54,
            "type_document_id": 7,
            "document_number": "SETP990000001",
            "zipkey": "00000000-0000-0000-0000-000000000000",
            "document": {
              "id": 7,
              "code": "01",
              "voucher_name": "Factura electrónica"
            }
          }
        ],
        "software": {
          "id": 27,
          "type_id": 1,
          "environment_id": 1,
          "identification": "96ab0f7c-2ab0-4de4-8c30-1268e6c8c6c3"
        }
      }
    ],
    "per_page": 15,
    "total": 1
  },
  "success": true
}
```

| Campo | Descripción |
|---|---|
| `status` | `CREATED` Creado · `RUNNING` En ejecución · `SENDING` Enviado a la DIAN · `VALIDATING` Validando · `FINISHED` Finalizado · `ERROR` Error. `status_description` trae el texto. |
| `error_message` · `StatusDescription` | Detalle del error devuelto por la DIAN cuando `status` es `ERROR`; al finalizar con éxito, `error_message` trae el mensaje de cierre. |
| `documents` | Documentos de prueba enviados, con su tipo de documento en `document`. |

</details>

</details>

---

## ⚙️ Registro y Mantenimiento {#registro-mantenimiento}

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/software</b> — Registrar Software DIAN</summary>

```http
POST {{url}}/software?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Registra un nuevo software ante la plataforma para operar con la DIAN en ambiente de pruebas o producción.

:::info 💡 Guía para Desarrolladores — Formato del Payload `records`
Este endpoint recibe los datos encapsulados dentro de la propiedad **`records`** como una cadena JSON serializada (`stringified JSON`).
:::

<Tabs>
<TabItem value="js" label="JavaScript / Node.js" default>

```javascript
import axios from 'axios';

const records = {
  environment_id: 2, // 1: Producción, 2: Pruebas / Habilitación (default)
  type_id: 1,        // 1: Facturación, 2: Nómina, 3: Documento Soporte, 4: POS / Doc. equivalente
  testsetid: '6142be76-4d36-5c08-8729-33a58c67177b', // Set de pruebas DIAN
  technical_key: 'fc8eac422eba16e22ffd8c6f94b3f40a6e38162c', // Clave técnica DIAN
  pin: '12345',      // PIN asignado en portal DIAN (obligatorio)
  identification: '96ab0f7c-2ab0-4de4-8c30-1268e6c8c6c3', // ID de software DIAN
  initial_number: 100 // Número inicial para pruebas
};

const response = await axios.post(`${url}/software`, {
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
    'environment_id' => 2,
    'type_id'        => 1,
    'testsetid'      => '6142be76-4d36-5c08-8729-33a58c67177b',
    'technical_key'  => 'fc8eac422eba16e22ffd8c6f94b3f40a6e38162c',
    'pin'            => '12345',
    'identification' => '96ab0f7c-2ab0-4de4-8c30-1268e6c8c6c3',
    'initial_number' => 100,
];

$payload = json_encode(['records' => json_encode($records)]);

$ch = curl_init("{$url}/software");
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
    "environment_id": 2,
    "type_id": 1,
    "testsetid": "6142be76-4d36-5c08-8729-33a58c67177b",
    "technical_key": "fc8eac422eba16e22ffd8c6f94b3f40a6e38162c",
    "pin": "12345",
    "identification": "96ab0f7c-2ab0-4de4-8c30-1268e6c8c6c3",
    "initial_number": 100
}

response = requests.post(
    f"{url}/software",
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
    environment_id = 2,
    type_id = 1,
    testsetid = "6142be76-4d36-5c08-8729-33a58c67177b",
    technical_key = "fc8eac422eba16e22ffd8c6f94b3f40a6e38162c",
    pin = "12345",
    identification = "96ab0f7c-2ab0-4de4-8c30-1268e6c8c6c3",
    initial_number = 100
};

var client = new HttpClient();
client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
var response = await client.PostAsJsonAsync($"{url}/software", new {
    records = JsonSerializer.Serialize(records)
});
```

</TabItem>
<TabItem value="postman" label="Postman">

```javascript
const records = {
    environment_id: 2,
    type_id: 1,
    testsetid: '6142be76-4d36-5c08-8729-33a58c67177b',
    technical_key: 'fc8eac422eba16e22ffd8c6f94b3f40a6e38162c',
    pin: '12345',
    identification: '96ab0f7c-2ab0-4de4-8c30-1268e6c8c6c3',
    initial_number: 100
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
| `environment_id` | integer | No | Ambiente: `1` Producción, `2` Pruebas/Habilitación. Default `2`. |
| `type_id` | integer | No | Tipo de software: `1` Facturación electrónica, `2` Nómina electrónica, `3` Documento soporte, `4` POS / Documento equivalente electrónico. Default `1`. Solo uno por empresa y tipo. |
| `integration_type` | integer | No | `1` Software propio (default), `2` Proveedor tecnológico. |
| `testsetid` | string | No | Código del TestSetId DIAN (requerido para habilitación). |
| `technical_key` | string | No | Clave técnica asignada por la DIAN. Si se omite, se usa la clave de pruebas. |
| `pin` | string | ✅ Sí | PIN de 5 dígitos del software en la DIAN. |
| `identification` | string | ✅ Sí | ID del software generado en la DIAN. |
| `initial_number` | integer | No | Consecutivo inicial de pruebas (ej. `100`). Default `1`. |

El software se crea con `test_process_status` `INITIAL`.

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json title="Respuesta (extracto)"
{
  "message": "Registro creado correctamente.",
  "record": {
    "id": 27,
    "company_id": 1262,
    "type_id": 1,
    "environment_id": 2,
    "testsetid": "6142be76-4d36-5c08-8729-33a58c67177b",
    "technical_key": "fc8eac422eba16e22ffd8c6f94b3f40a6e38162c",
    "pin": "12345",
    "identification": "96ab0f7c-2ab0-4de4-8c30-1268e6c8c6c3",
    "integration_type": 1,
    "initial_number": 100,
    "test_process_status": "INITIAL"
  },
  "success": true
}
```

La respuesta es `200`, no `201`. `record` es el software creado, con su `id`.

</details>

<details>
<summary>❌ Errores</summary>

| Status | Mensaje | Causa |
|:---:|---|---|
| `422` | `El campo records es requerido` · `El campo records debe ser un JSON válido` | Falta `records` o no es texto JSON. |
| `400` | `Ya existe un software registrado para esta compañía con el mismo tipo.` | La empresa ya tiene un software con ese `type_id`. |
| `500` | `Error interno del servidor. ...` | Falta `pin` en `records`. Incluye `reference` para soporte. |

```json
{
  "success": false,
  "message": "Ya existe un software registrado para esta compañía con el mismo tipo."
}
```

</details>

</details>

<details>
<summary><span className="badge badge--warning margin-right--sm">PUT</span> <b>/software/&#123;id&#125;</b> — Actualizar Software DIAN</summary>

```http
PUT {{url}}/software/{id}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `id` | path | ✅ Sí | ID del software a actualizar. |
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

**Body (JSON):** `records` serializado como texto JSON con los campos a cambiar. `type_id` no se puede cambiar (se ignora). Solo se guardan los valores que cambian.

```json
{
  "records": "{\"environment_id\":1,\"testsetid\":\"\",\"technical_key\":\"fc8eac422eba16e22ffd8c6f94b3f40a6e38162c\",\"pin\":\"12345\",\"identification\":\"96ab0f7c-2ab0-4de4-8c30-1268e6c8c6c3\",\"initial_number\":100}"
}
```

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json title="Respuesta (extracto)"
{
  "message": "Software actualizado correctamente.",
  "dataRecords": {
    "id": 27,
    "environment_id": 1,
    "type_id": 1,
    "identification": "96ab0f7c-2ab0-4de4-8c30-1268e6c8c6c3",
    "testsetid": "",
    "initial_number": 100
  },
  "success": true
}
```

</details>

<details>
<summary>❌ Errores</summary>

| Status | Mensaje | Causa |
|:---:|---|---|
| `422` | `El campo records es requerido` · `El campo records debe ser un JSON válido` | Falta `records` o no es texto JSON. |
| `404` | `No se encontró el software para la compañía especificada.` | El `{id}` no existe o no pertenece a la empresa. |

</details>

</details>

<details>
<summary><span className="badge badge--danger margin-right--sm">DELETE</span> <b>/software/&#123;id&#125;</b> — Eliminar Software DIAN</summary>

```http
DELETE {{url}}/software/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `id` | path | ✅ Sí | ID del software a eliminar. |

:::warning El registro a eliminar se indica en `records`
El body es obligatorio: `records`, serializado como texto JSON, con el `id` del software a eliminar. El software que se elimina es el que indica `records`, no el `{id}` de la ruta: envía el mismo valor en ambos.
:::

```json
{
  "records": "{\"id\":27}"
}
```

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json title="Respuesta (extracto)"
{
  "records": [
    {
      "id": 27,
      "type_id": 1,
      "environment_id": 2,
      "identification": "96ab0f7c-2ab0-4de4-8c30-1268e6c8c6c3"
    }
  ],
  "success": true
}
```

`records` lista el software eliminado; si ningún software coincide, viene vacío.

</details>

<details>
<summary>❌ Errores</summary>

| Status | Mensaje | Causa |
|:---:|---|---|
| `422` | `El campo records es requerido` · `El campo records debe ser un JSON válido` | Falta `records` o no es texto JSON. |
| `400` | `No se indicó qué registro eliminar.` | `records` es un objeto o arreglo vacío (`{}` o `[]`). |
| `500` | `{ "error": "..." }` | Error interno. En este caso `message` es un objeto con `error` y la respuesta trae `payload`. |

```json
{
  "success": false,
  "message": { "error": "..." },
  "payload": "Internal Server Error"
}
```

</details>

</details>

---

## 🧪 Habilitación y Pruebas DIAN {#habilitacion-pruebas}

<details open>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/document/run-test</b> — Iniciar Habilitación</summary>

```http
POST {{url}}/document/run-test?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Inicia automáticamente el envío de pruebas DIAN para el software indicado.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

**Body (JSON):**
```json
{
  "software_id": 27
}
```

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `software_id` | integer | ✅ Sí | ID del software DIAN registrado con el que se iniciará la habilitación. |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "message": "Se ha iniciado el proceso de habilitación de documentos electrónicos.",
  "process_id": 54,
  "success": true
}
```

El proceso corre en segundo plano. Consulta su avance con `GET /software/test/{id}` usando el `id` del software.

</details>

<details>
<summary>❌ Errores</summary>

| Status | Mensaje | Causa |
|:---:|---|---|
| `404` | `No se encontró el software especificado.` | El `software_id` no existe o no es de la empresa. |
| `500` | `Error interno del servidor. Ya existe un proceso en ejecución para este software. Por favor espere a que finalice.` | El último proceso del software no ha terminado (no está en `FINISHED` ni en `ERROR`). |
| `500` | `Error interno del servidor. El software no tiene un testsetid DIAN configurado. Por favor configure uno antes de ejecutar el SET DE PRUEBAS.` | El software no tiene `testsetid`. |

</details>

</details>
