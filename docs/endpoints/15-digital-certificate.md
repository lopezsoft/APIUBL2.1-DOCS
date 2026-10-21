---
sidebar_position: 15
sidebar_label: 🔐 Certificado Digital
description: "Certificado de firma digital (.p12/.pfx): carga, renovación, consulta y vencimiento, y cupos de certificado incluidos en el plan."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 🔐 Certificado de Firma Digital {#certificado-digital}

:::warning Autenticación Requerida
Incluir en todos los endpoints de esta sección el header: `Authorization: Bearer {token}`
:::

El certificado de firma digital (`.p12` o `.pfx`) es indispensable para la emisión y firma electrónica de los documentos fiscales ante la DIAN. Solo se puede tener un certificado activo por empresa.

:::info Parámetro Multi-Tenant: `client_uuid`
Si operas como **Casa de Software**, puedes administrar los certificados de tus clientes agregando `?client_uuid={{client_uuid}}`.
```http
GET {{url}}/company/customers
Authorization: Bearer {token}
```
:::

:::note 🎁 Certificados incluidos en el plan
Algunos planes **pagados** incluyen cupos de certificado de firma digital en la plataforma de certificados **MATICERTS**. Al activarse el plan, la empresa titular recibe automáticamente los cupos que incluye; no hay que llamar a ningún endpoint.

- **Cuándo se otorgan:** en la compra, la renovación y el cambio a un plan inferior. En los planes pagados de **Casa de Software**, solo en la primera compra de un plan pagado. El cambio a un plan superior no otorga cupos nuevos, porque el cupo llegó con la compra original.
- **Cupos actuales:** 1 en los planes PYME y Paquete por NIT, y 1 en los planes de Casa de Software desde 10.000 documentos. El plan FREE y el plan de Arrendamiento no incluyen cupos por ahora.
- **No reciben cupos:** los planes FREE o sin cupos incluidos, las sub-cuentas (clientes) de una Casa de Software y el ambiente sandbox.
:::

---

## 🔐 Gestión del Certificado {#gestion-certificado}

<details open>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/certificate</b> — Obtener Certificado Activo</summary>

```http
GET {{url}}/certificate?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Obtiene los metadatos del certificado de firma digital actualmente registrado para la empresa emisora.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "dataRecords": {
    "data": {
      "id": 1,
      "name": "9001234561.p12",
      "description": "EMPRESA DEMO SAS",
      "extension": ".p12",
      "expiration_date": "09-07-2028 02:56:30 pm",
      "timestamp": "2026-07-13 23:06:11"
    }
  },
  "success": true
}
```

</details>

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/certificate</b> — Cargar Certificado Digital</summary>

```http
POST {{url}}/certificate?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Carga un nuevo archivo `.p12` o `.pfx` codificado en **Base64** junto con su contraseña privada. Si la empresa ya tiene un certificado, usa `PUT /certificate/{id}` para reemplazarlo.

:::info 💡 Guía para Desarrolladores — Envío del Certificado en Base64
El body lleva una sola propiedad, `records`, cuyo valor es un **JSON serializado como texto** con las propiedades `data`, `password` y `description`.

El archivo binario `.p12` o `.pfx` debe convertirse a **Base64** y enviarse en la propiedad `data` **con el prefijo Data URI** `data:application/x-pkcs12;base64,`. La API descarta todo lo que va hasta la primera coma: sin el prefijo, el Base64 llega recortado y el certificado no se puede leer.
:::

<Tabs>
<TabItem value="js" label="JavaScript / Node.js" default>

```javascript
import fs from 'fs';
import axios from 'axios';

// 1. Leer el archivo .p12 y convertir a Base64 con el prefijo Data URI
const p12Buffer = fs.readFileSync('certificado.p12');
const base64Certificate = 'data:application/x-pkcs12;base64,' + p12Buffer.toString('base64');

// 2. Definir los datos del certificado
const records = {
  data: base64Certificate,
  password: "password_del_certificado",
  description: "Certificado digital de producción"
};

// 3. Enviar la petición serializada
const response = await axios.post(`${url}/certificate`, {
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
$p12Data = file_get_contents('certificado.p12');
$base64Cert = 'data:application/x-pkcs12;base64,' . base64_encode($p12Data);

$records = [
    'data'        => $base64Cert,
    'password'    => 'password_del_certificado',
    'description' => 'Certificado digital de producción',
];

$payload = json_encode(['records' => json_encode($records)]);

$ch = curl_init("{$url}/certificate");
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
import base64
import json
import requests

with open("certificado.p12", "rb") as f:
    b64_cert = "data:application/x-pkcs12;base64," + base64.b64encode(f.read()).decode("utf-8")

records = {
    "data": b64_cert,
    "password": "password_del_certificado",
    "description": "Certificado digital de producción"
}

response = requests.post(
    f"{url}/certificate",
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

byte[] certBytes = await File.ReadAllBytesAsync("certificado.p12");
string b64Cert = "data:application/x-pkcs12;base64," + Convert.ToBase64String(certBytes);

var records = new {
    data = b64Cert,
    password = "password_del_certificado",
    description = "Certificado digital de producción"
};

var client = new HttpClient();
client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
var response = await client.PostAsJsonAsync($"{url}/certificate", new {
    records = JsonSerializer.Serialize(records)
});
```

</TabItem>
<TabItem value="postman" label="Postman">

```javascript
const records = {
    data: "data:application/x-pkcs12;base64,MIIKgAIBAz...",
    password: "password_del_certificado",
    description: "Certificado digital de producción"
};

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
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |
| `records` | body | ✅ Sí | JSON serializado como texto con las propiedades de abajo. |

**Propiedades de `records`:**
| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `data` | string | ✅ Sí | Archivo `.p12` o `.pfx` en Base64, con el prefijo Data URI `data:application/x-pkcs12;base64,`. |
| `password` | string | ✅ Sí | Contraseña privada del certificado. |
| `description` | string | ✅ Sí | Descripción identificativa del certificado. |

:::warning El nombre de la propiedad es `data`
Si el archivo se envía en una propiedad con otro nombre (por ejemplo, `certificate`), la API responde `500` con el mensaje `Error interno del servidor. El certificado es requerido.`. Si falta `password` o `description`, la respuesta también es un `500`.
:::

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

El nombre del archivo se genera con el NIT y el dígito de verificación de la empresa. La contraseña y el contenido del certificado no se devuelven.

```json
{
  "dataRecords": {
    "data": {
      "id": 1,
      "name": "9001234561.p12",
      "description": "Certificado digital de producción",
      "extension": ".p12",
      "expiration_date": "09-07-2028 02:56:30 pm"
    }
  },
  "success": true
}
```

</details>

<details>
<summary>❌ Errores</summary>

| HTTP | Mensaje | Causa |
|---|---|---|
| `422` | `El campo records es requerido` / `El campo records debe ser un JSON válido` | Falta `records` o su valor no es un JSON válido. |
| `400` | `The given data was invalid.` / `The certificate could not be read. ...` | El contenido de `data` no es Base64 válido, se envió sin el prefijo Data URI, el archivo no es un `.p12` válido o la contraseña es incorrecta. |
| `500` | `Error interno del servidor. Ya existe un certificado para esta empresa.` | La empresa ya tiene un certificado. Usa `PUT /certificate/{id}`. |
| `500` | `Error interno del servidor. El certificado es requerido.` | Falta la propiedad `data` en `records`. |

Las respuestas `500` incluyen un campo `reference` para que soporte ubique el caso:

```json
{
  "success": false,
  "message": "Error interno del servidor. Ya existe un certificado para esta empresa.",
  "reference": "3f1c2a9e-7b4d-4e8a-9c61-0d2b5e8f7a14"
}
```

</details>

</details>

<details>
<summary><span className="badge badge--warning margin-right--sm">PUT</span> <b>/certificate/&#123;id&#125;</b> — Actualizar / Renovar Certificado</summary>

```http
PUT {{url}}/certificate/{id}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Reemplaza el certificado digital de la empresa (por ejemplo, al renovarlo). El body tiene el mismo formato que la creación (`POST /certificate`). La ruta exige un `{id}` (puedes usar el `id` que devuelve `GET /certificate`); se actualiza siempre el certificado de la empresa autenticada o de la indicada en `client_uuid`. `PUT /certificate` sin `{id}` responde `405`.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `id` | path | ✅ Sí | ID del certificado. |
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |
| `records` | body | ✅ Sí | JSON serializado como texto con `data` (Base64 con el prefijo Data URI), `password` y `description`. Las tres propiedades son obligatorias. |

```json
{
  "records": "{\"data\":\"data:application/x-pkcs12;base64,MIIKgAIBAz...\",\"password\":\"password_del_certificado\",\"description\":\"Certificado digital renovado\"}"
}
```

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "dataRecords": {
    "data": {
      "id": 1,
      "name": "9001234561.p12",
      "description": "Certificado digital renovado",
      "extension": ".p12",
      "expiration_date": "15-08-2029 10:12:45 am",
      "timestamp": "2026-10-21 08:30:00"
    }
  },
  "success": true
}
```

</details>

<details>
<summary>❌ Errores</summary>

| HTTP | Mensaje | Causa |
|---|---|---|
| `422` | `El campo records es requerido` / `El campo records debe ser un JSON válido` | Falta `records` o su valor no es un JSON válido. |
| `400` | `The given data was invalid.` / `The certificate could not be read. ...` | El contenido no es Base64 válido, el archivo no es un `.p12` válido o la contraseña es incorrecta. |
| `500` | `Error interno del servidor. No existe un certificado para esta empresa.` | La empresa aún no tiene certificado. Usa `POST /certificate`. |
| `500` | `Error interno del servidor. El contenido del certificado es requerido.` | Falta la propiedad `data` en `records`. |
| `500` | `Error interno del servidor. El certificado es requerido.` | `data` se envió sin el prefijo Data URI. |

</details>

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/certificate/expiration/&#123;dni&#125;</b> — Validar Expiración del Certificado</summary>

```http
GET {{url}}/certificate/expiration/{dni}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Verifica la fecha de expiración y vigencia del certificado digital a partir del NIT de la empresa.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `dni` | path | ✅ Sí | NIT de la empresa a consultar (sin dígito de verificación ni guiones). |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "dataRecords": {
    "data": {
      "expiration_date": "2028-07-09 14:56:30"
    }
  },
  "success": true
}
```

</details>

</details>
