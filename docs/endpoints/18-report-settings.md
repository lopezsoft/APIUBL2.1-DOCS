---
sidebar_position: 18
sidebar_label: 📊 Configuración de Reportes
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 📊 Configuración de Reportes {#configuracion-reportes}

:::warning Autenticación Requerida
Incluir en todos los endpoints de esta sección el header: `Authorization: Bearer {token}`
:::

:::info Parámetro Multi-Tenant: `client_uuid`
Si operas como **Casa de Software**, puedes configurar encabezados y logos de reporte para tus clientes agregando `?client_uuid={{client_uuid}}`.
```http
GET {{url}}/company/customers
Authorization: Bearer {token}
```
:::

---

## 📋 Encabezados y Pies de Página {#encabezados}

<details open>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/settings/reports</b> — Listar Encabezados de Reporte</summary>

```http
GET {{url}}/settings/reports?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "dataRecords": {
    "data": [
      {
        "id": 7,
        "line1": "<p class=\"ql-align-center\">EMPRESA S.A.S </p><p class=\"ql-align-center\">N.I.T: 999.999.999-2 </p>",
        "line2": "<p>CRA 15A # 47-24. Dosquebradas - Risaralda CEL: 310-843-5431</p>",
        "foot": "<p style=\"text-align: center;\">Email: gerencia@lopezsoft.net.co</p>"
      }
    ]
  }
}
```

</details>

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/crud?tbPrefix=T063</b> — Crear Encabezado de Reporte</summary>

```http
POST {{url}}/crud?tbPrefix=T063&client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Crea un nuevo encabezado y pie de página para los reportes y representaciones gráficas enviando el contenido formateado en HTML dentro del objeto `records` serializado en JSON.

:::info 💡 Guía para Desarrolladores — Formato HTML en `records`
Puedes enviar contenido con etiquetas HTML (negrita, alineación, saltos de línea) dentro de `line1`, `line2` y `foot`.
:::

<Tabs>
<TabItem value="js" label="JavaScript / Node.js" default>

```javascript
import axios from 'axios';

const records = {
  line1: '<p class="ql-align-center">EMPRESA S.A.S </p><p class="ql-align-center">N.I.T: 999.999.999-2 </p><p class="ql-align-center">IVA REGIMEN COMÚN</p>',
  line2: '<p>CRA 15A # 47-24. Dosquebradas - Risaralda CEL: 310-843-5431</p>',
  foot: '<p style="text-align: center;">Email: gerencia@lopezsoft.net.co - Sitio web: https://lopezsoft.net.co</p>'
};

const response = await axios.post(`${url}/crud?tbPrefix=T063`, {
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
    'line1' => '<p class="ql-align-center">EMPRESA S.A.S</p><p class="ql-align-center">N.I.T: 999.999.999-2</p>',
    'line2' => '<p>CRA 15A # 47-24. Dosquebradas - Risaralda CEL: 310-843-5431</p>',
    'foot'  => '<p style="text-align: center;">Email: gerencia@lopezsoft.net.co</p>',
];

$payload = json_encode(['records' => json_encode($records)]);

$ch = curl_init("{$url}/crud?tbPrefix=T063");
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
    "line1": '<p class="ql-align-center">EMPRESA S.A.S</p><p class="ql-align-center">N.I.T: 999.999.999-2</p>',
    "line2": '<p>CRA 15A # 47-24. Dosquebradas - Risaralda CEL: 310-843-5431</p>',
    "foot": '<p style="text-align: center;">Email: gerencia@lopezsoft.net.co</p>'
}

response = requests.post(
    f"{url}/crud?tbPrefix=T063",
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
    line1 = "<p class=\"ql-align-center\">EMPRESA S.A.S</p><p class=\"ql-align-center\">N.I.T: 999.999.999-2</p>",
    line2 = "<p>CRA 15A # 47-24. Dosquebradas - Risaralda CEL: 310-843-5431</p>",
    foot = "<p style=\"text-align: center;\">Email: gerencia@lopezsoft.net.co</p>"
};

var client = new HttpClient();
client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
var response = await client.PostAsJsonAsync($"{url}/crud?tbPrefix=T063", new {
    records = JsonSerializer.Serialize(records)
});
```

</TabItem>
<TabItem value="postman" label="Postman">

```javascript
const records = {
    line1: '<p class="ql-align-center">EMPRESA S.A.S </p><p class="ql-align-center">N.I.T: 999.999.999-2 </p>',
    line2: '<p>CRA 15A # 47-24. Dosquebradas - Risaralda CEL: 310-843-5431</p>',
    foot: '<p style="text-align: center;">Email: gerencia@lopezsoft.net.co</p>'
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
| `line1` | string (HTML) | ✅ Sí | Línea principal del encabezado (Razón social, NIT, régimen). |
| `line2` | string (HTML) | No | Línea secundaria (Dirección, ciudad, teléfonos). |
| `foot` | string (HTML) | No | Pie de página del documento (Canales de contacto, web, notas). |

<details>
<summary>✅ Respuesta Exitosa (HTTP 201)</summary>

```json
{
  "success": true,
  "message": "Encabezado creado exitosamente",
  "data": {
    "id": 7
  }
}
```

</details>

</details>

<details>
<summary><span className="badge badge--warning margin-right--sm">PUT</span> <b>/settings/reports/&#123;id&#125;</b> — Actualizar Encabezado</summary>

```http
PUT {{url}}/settings/reports/{id}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `id` | path | ✅ Sí | ID del encabezado a actualizar. |
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "success": true,
  "message": "Encabezado actualizado exitosamente"
}
```

</details>

</details>

<details>
<summary><span className="badge badge--danger margin-right--sm">DELETE</span> <b>/settings/reports/&#123;id&#125;</b> — Eliminar Encabezado</summary>

```http
DELETE {{url}}/settings/reports/{id}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `id` | path | ✅ Sí | ID del encabezado a eliminar. |
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "success": true,
  "message": "Encabezado eliminado correctamente"
}
```

</details>

</details>

---

## 🖼️ Logotipo de Reportes {#logotipo}

<details>
<summary><span className="badge badge--warning margin-right--sm">PUT</span> <b>/settings/reports/&#123;id&#125;/image</b> — Actualizar Logo del Encabezado</summary>

```http
PUT {{url}}/settings/reports/{id}/image?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Actualiza el logo asociado a un encabezado de reporte enviando la imagen codificada en **Base64** dentro del objeto `records`.

:::info 💡 Guía para Desarrolladores — Carga de Imagen en Base64
Convierte la imagen (PNG/JPG) a Base64 con el prefijo Data URI (ej. `data:image/png;base64,...`) y envíala en `imgdata`.
:::

<Tabs>
<TabItem value="js" label="JavaScript / Node.js" default>

```javascript
import fs from 'fs';
import axios from 'axios';

const imgBuffer = fs.readFileSync('logo.png');
const base64Img = 'data:image/png;base64,' + imgBuffer.toString('base64');

const response = await axios.put(`${url}/settings/reports/${id}/image`, {
  records: JSON.stringify({ imgdata: base64Img })
}, {
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  }
});
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
$imgData = file_get_contents('logo.png');
$base64Img = 'data:image/png;base64,' . base64_encode($imgData);

$payload = json_encode(['records' => json_encode(['imgdata' => $base64Img])]);

$ch = curl_init("{$url}/settings/reports/{$id}/image");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CUSTOMREQUEST  => 'PUT',
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

with open("logo.png", "rb") as f:
    b64_img = "data:image/png;base64," + base64.b64encode(f.read()).decode("utf-8")

response = requests.put(
    f"{url}/settings/reports/{id}/image",
    json={"records": json.dumps({"imgdata": b64_img})},
    headers={
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
)
```

</TabItem>
<TabItem value="postman" label="Postman">

```javascript
const records = {
    imgdata: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
};

const payload = { records: JSON.stringify(records) };
pm.request.body.mode = 'raw';
pm.request.body.raw = JSON.stringify(payload);
pm.request.headers.add({key: 'Content-Type', value: 'application/json'});
```

</TabItem>
</Tabs>

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "success": true,
  "message": "Logo del encabezado actualizado exitosamente"
}
```

</details>

<details>
<summary>❌ Registro No Encontrado (HTTP 404)</summary>

```json
{
  "success": false,
  "message": "No se encontró el registro con id para la compañía especificada"
}
```

</details>

</details>
