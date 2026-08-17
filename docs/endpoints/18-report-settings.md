---
sidebar_position: 18
sidebar_label: 📊 Configuración de Reportes
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 📊 Configuración de Reportes

> ✅ **Autenticación REQUERIDA**
> Incluir en todos los endpoints de esta sección el header: `Authorization: Bearer {token}`

:::info ¿Dónde obtener el `client_uuid`? — Parámetro Multi-Tenant para Casas de Software
Si operas como **Casa de Software** o **Cuenta Principal**, puedes configurar los encabezados, pies de página y logos de los reportes de tus empresas cliente agregando el parámetro `client_uuid` en la query string de la URL:
- **URL con Query Param:** `{{url}}/settings/reports?client_uuid={{client_uuid}}`
- **Header:** `Authorization: Bearer {token_cuenta_principal}`
- **Comportamiento:** La configuración del reporte gráfico se aplicará a la empresa cliente especificada por su UUID.

**¿Dónde encontrar el `client_uuid` de tus clientes?**  
Puedes consultar el listado completo de tus empresas cliente y sus respectivos `client_uuid` mediante el endpoint:
```http
GET {{url}}/company/customers
Authorization: Bearer {token}
Content-Type: application/json
```
:::

---

## Listar Encabezados de Reporte

### Listar Encabezados de Reporte - 🔵 GET
```http
GET {{url}}/settings/reports?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). |

**Respuesta Exitosa (HTTP 200):**
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

---

## Crear Encabezado de Reporte

### Crear Encabezado de Reporte - 🟘 POST
```http
POST {{url}}/crud?tbPrefix=T063&client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Crea un nuevo encabezado y pie de página para los reportes y representaciones gráficas enviando el contenido formateado en HTML dentro del objeto `records` serializado en JSON.

:::info 💡 Guía para Desarrolladores — Formato HTML en `records`
Puedes enviar contenido con etiquetas HTML (negrita, alineación, saltos de línea) dentro de `line1`, `line2` y `foot`. Los datos se envían serializados en el campo `records`.
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
<TabItem value="php" label="PHP (Guzzle / cURL)">

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

var payload = new { records = JsonSerializer.Serialize(records) };

var client = new HttpClient();
client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

var response = await client.PostAsJsonAsync($"{url}/crud?tbPrefix=T063", payload);
```

</TabItem>
<TabItem value="postman" label="Postman">

```javascript
// Pre-request Script
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

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `tbPrefix` | query | ✅ Sí | Prefijo de la tabla. Siempre `T063` para encabezados de reporte. |
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

**Body JSON resultante:**
```json
{
  "records": "{\"line1\":\"<p class=\\\"ql-align-center\\\">EMPRESA S.A.S </p><p class=\\\"ql-align-center\\\">N.I.T: 999.999.999-2 </p>\",\"line2\":\"<p>CRA 15A # 47-24. Los Naranjos Dosquebradas - Risaralda CEL: 310-843-5431</p>\",\"foot\":\"<p style=\\\"text-align: center;\\\">Cel: 301 843 5431 - Email: gerencia@lopezsoft.net.co</p>\"}"
}
```

| Propiedad en `records` | Tipo | Requerido | Descripción |
|---|---|---|---|
| `line1` | string (HTML) | ✅ Sí | Línea principal del encabezado (Razón social, NIT, régimen fiscal). |
| `line2` | string (HTML) | No | Línea secundaria del encabezado (Dirección, ciudad, teléfonos). |
| `foot` | string (HTML) | No | Pie de página del documento (Canales de contacto, web, notas). |

**Respuesta Exitosa (HTTP 201):**
```json
{
  "success": true,
  "message": "Encabezado creado exitosamente",
  "data": {
    "id": 7
  }
}
```

---

## Actualizar Encabezado de Reporte

### Actualizar Encabezado de Reporte - 🟠 PUT
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

**Body (JSON):** Igual al POST de creación (`records` serializado con `line1`, `line2`, `foot`).

**Respuesta Exitosa (HTTP 200):**
```json
{
  "success": true,
  "message": "Encabezado actualizado exitosamente"
}
```

---

## Actualizar Logo del Encabezado

### Actualizar Logo del Encabezado - 🟠 PUT
```http
PUT {{url}}/settings/reports/{id}/image?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Actualiza la imagen/logo asociada a un encabezado de reporte enviando la imagen codificada en **Base64** dentro del objeto `records`.

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
// Pre-request Script
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

**Respuesta Exitosa (HTTP 200):**
```json
{
  "success": true,
  "message": "Logo del encabezado actualizado exitosamente"
}
```

**Respuesta de Error (HTTP 404 - Registro No Encontrado):**
```json
{
  "success": false,
  "message": "No se encontró el registro con id 7 para la compañía: LOPEZSOFT S.A.S."
}
```

---

## Eliminar Encabezado de Reporte

### Eliminar Encabezado de Reporte - 🔴 DELETE
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

**Respuesta Exitosa (HTTP 200):**
```json
{
  "success": true,
  "message": "Encabezado eliminado correctamente"
}
```
