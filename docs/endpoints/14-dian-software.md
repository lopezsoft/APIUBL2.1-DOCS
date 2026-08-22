---
sidebar_position: 14
sidebar_label: 💻 Software DIAN
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

---

## 📋 Consulta de Software DIAN {#consulta-software}

<details open>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/software</b> — Listar Software DIAN</summary>

```http
GET {{url}}/software?uid=3&client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `uid` | query | No | ID del tipo de software a filtrar. |
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "dataRecords": {
    "data": [
      {
        "id": 27,
        "environment_id": 1,
        "type_id": 1,
        "identification": "96ab0f7c-2ab0-4de4-8c30-1268e6c8c6c3",
        "pin": "12345",
        "technical_key": "fc8eac422eba16e22ffd8c6f94b3f40a6e38162c",
        "testsetid": "6142be76-4d36-5c08-8729-33a58c67177b",
        "initial_number": 100
      }
    ]
  }
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

**Descripción:** Obtiene el estado y listado de documentos enviados durante el set de pruebas de habilitación para el software indicado.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `id` | path | ✅ Sí | ID del software registrado (`software_id`). |
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "dataRecords": {
    "data": [
      {
        "id": 1,
        "document_type": "Factura Electrónica",
        "track_id": "000000000000000000000000",
        "status": "Aceptado",
        "created_at": "2026-02-01 10:00:00"
      }
    ]
  }
}
```

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
  environment_id: 1, // 1: Habilitación / Pruebas, 2: Producción
  type_id: 1,        // 1: Facturación Electrónica, 3: Documento Soporte, etc.
  testsetid: '6142be76-4d36-5c08-8729-33a58c67177b', // Set de pruebas DIAN
  technical_key: 'fc8eac422eba16e22ffd8c6f94b3f40a6e38162c', // Clave técnica DIAN
  pin: '12345',      // PIN asignado en portal DIAN
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
    'environment_id' => 1,
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
    "environment_id": 1,
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
    environment_id = 1,
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
    environment_id: 1,
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
| `environment_id` | integer | ✅ Sí | Ambiente de destino (`1` Habilitación/Pruebas, `2` Producción). |
| `type_id` | integer | ✅ Sí | Tipo de documento (`1` Factura Electrónica, `3` Documento Soporte, `4` Nómina). |
| `testsetid` | string | No | Código del TestSetId DIAN (requerido para habilitación). |
| `technical_key` | string | No | Clave técnica asignada por la DIAN. |
| `pin` | string | ✅ Sí | PIN de 5 dígitos del software en la DIAN. |
| `identification` | string | ✅ Sí | ID del software generado en la DIAN. |
| `initial_number` | integer | No | Consecutivo inicial de pruebas (ej. `100`). |

<details>
<summary>✅ Respuesta Exitosa (HTTP 201)</summary>

```json
{
  "success": true,
  "message": "Software registrado exitosamente"
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

**Body (JSON):**
```json
{
  "records": "{\"environment_id\":2,\"type_id\":1,\"testsetid\":\"\",\"technical_key\":\"fc8eac422eba16e22ffd8c6f94b3f40a6e38162c\",\"pin\":\"12345\",\"identification\":\"96ab0f7c-2ab0-4de4-8c30-1268e6c8c6c3\",\"initial_number\":100}"
}
```

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "success": true,
  "message": "Software actualizado exitosamente"
}
```

</details>

</details>

<details>
<summary><span className="badge badge--danger margin-right--sm">DELETE</span> <b>/software/&#123;id&#125;</b> — Eliminar Software DIAN</summary>

```http
DELETE {{url}}/software/{id}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `id` | path | ✅ Sí | ID del software a eliminar. |
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "success": true,
  "message": "Software eliminado exitosamente"
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
  "success": true,
  "message": "Proceso de habilitación iniciado correctamente"
}
```

</details>

</details>
