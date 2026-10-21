---
sidebar_position: 18
sidebar_label: 📊 Configuración de Reportes
description: "Encabezado de reportes y PDF: datos de contacto, logo y configuración por empresa."
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

**Descripción:** Lista, paginados (15 por página), los encabezados de reporte de la empresa. Si la empresa aún no tiene ninguno, el servidor crea uno vacío y lo devuelve, así que la lista nunca llega vacía.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `id` | query | No | Filtra por el `id` de un encabezado. |
| `page` | query | No | Número de página (default: `1`). |
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "dataRecords": {
    "current_page": 1,
    "data": [
      {
        "id": 7,
        "company_id": 120,
        "line1": "<p class=\"ql-align-center\">EMPRESA S.A.S </p><p class=\"ql-align-center\">N.I.T: 999.999.999-2 </p>",
        "line2": "<p>Calle 00 # 00-00. Ciudad Ejemplo - Departamento CEL: 300-000-0000</p>",
        "foot": "<p style=\"text-align: center;\">Email: contacto@empresa-ejemplo.com</p>",
        "image": null
      }
    ],
    "per_page": 15,
    "total": 1
  },
  "success": true
}
```

El paginador incluye además los campos estándar (`from`, `to`, `last_page`, `links`, etc.).

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
  line2: '<p>Calle 00 # 00-00. Ciudad Ejemplo - Departamento CEL: 300-000-0000</p>',
  foot: '<p style="text-align: center;">Email: contacto@empresa-ejemplo.com - Sitio web: https://empresa-ejemplo.com</p>'
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
    'line2' => '<p>Calle 00 # 00-00. Ciudad Ejemplo - Departamento CEL: 300-000-0000</p>',
    'foot'  => '<p style="text-align: center;">Email: contacto@empresa-ejemplo.com</p>',
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
    "line2": '<p>Calle 00 # 00-00. Ciudad Ejemplo - Departamento CEL: 300-000-0000</p>',
    "foot": '<p style="text-align: center;">Email: contacto@empresa-ejemplo.com</p>'
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
    line2 = "<p>Calle 00 # 00-00. Ciudad Ejemplo - Departamento CEL: 300-000-0000</p>",
    foot = "<p style=\"text-align: center;\">Email: contacto@empresa-ejemplo.com</p>"
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
    line2: '<p>Calle 00 # 00-00. Ciudad Ejemplo - Departamento CEL: 300-000-0000</p>',
    foot: '<p style="text-align: center;">Email: contacto@empresa-ejemplo.com</p>'
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
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

Devuelve la fila creada en `payload`. Si envías `records` como arreglo de objetos, `payload` trae la lista de filas creadas.

```json
{
  "message": "Registro creado correctamente.",
  "payload": {
    "id": 7,
    "company_id": 120,
    "line1": "<p class=\"ql-align-center\">EMPRESA S.A.S</p><p class=\"ql-align-center\">N.I.T: 999.999.999-2</p>",
    "line2": "<p>Calle 00 # 00-00. Ciudad Ejemplo - Departamento CEL: 300-000-0000</p>",
    "foot": "<p style=\"text-align: center;\">Email: contacto@empresa-ejemplo.com</p>",
    "image": null
  },
  "success": true
}
```

</details>

<details>
<summary>📏 Reglas del CRUD genérico (<code>/crud</code>)</summary>

- `company_id` lo fija siempre el servidor con la empresa del token (o del `client_uuid`) y no se puede cambiar. `created_at` y `deleted_at` se ignoran. Si la tabla exige `uuid`, el servidor lo genera, y no se puede cambiar en un `PUT`.
- `records` debe ser un objeto JSON o un arreglo de objetos. Con un arreglo, cada registro se valida por separado y la respuesta 400 trae el primer error. En un `PUT` con arreglo, cada registro debe incluir su llave primaria.
- Solo se pueden escribir tablas propias de la empresa. Los catálogos y la configuración del sistema son de solo lectura.
- Un registro de otra empresa responde igual que uno inexistente (404).
- Un filtro `where` con condiciones `OR` no amplía el alcance: siempre se filtra por la empresa.
- Las personas de recepción (`tbPrefix=T005`) no se escriben por el CRUD: se gestionan con `/events/reception-people`. Además, el módulo de recepción exige un plan de pago, también para leerlas: sin él, la respuesta es 403 con `error_code: RECEPTION_NOT_IN_PLAN`.

| HTTP | Mensaje | Causa |
|---|---|---|
| 400 | `No se ha especificado el prefijo de la tabla (tbPrefix).` | Falta `tbPrefix`. |
| 400 | `Debe enviar los registros (records).` | Falta `records` o viene vacío. |
| 400 | `Cada registro de records debe ser un objeto JSON.` | Un elemento de `records` no es un objeto. |
| 400 | `Cada registro debe incluir su id.` | `PUT` con arreglo sin la llave primaria en algún registro. |
| 403 | `La tabla '<tabla>' es de solo lectura: pertenece a la configuración del sistema y no se puede modificar por el CRUD.` | Escritura sobre un catálogo del sistema. |
| 403 | `La tabla '<tabla>' es de solo lectura por el CRUD: se gestiona con /api/ubl2.1/events/reception-people.` | Escritura sobre `T005`. |
| 404 | `El prefijo de tabla '<prefijo>' no existe.` | `tbPrefix` desconocido. |
| 404 | `La tabla '<tabla>' no está disponible en este sistema.` | El prefijo existe pero la tabla no está disponible. |
| 404 | `Recurso no encontrado.` | El registro no existe o es de otra empresa. |

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

**Body (JSON):** `records` como string JSON con los campos a actualizar (`line1`, `line2`, `foot`). Si incluyes `imgdata` para cambiar también el logo, debes enviar `imgname` (ver [Actualizar Logo del Encabezado](#logotipo)).

```json
{
  "records": "{\"line1\":\"<p>EMPRESA S.A.S</p>\",\"foot\":\"<p>Gracias por su compra</p>\"}"
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
<summary>❌ Registro No Encontrado (HTTP 404)</summary>

El encabezado no existe o no pertenece a la empresa. Si falta `records` o no es un JSON válido, la respuesta es HTTP 422 (`El campo records es requerido` o `El campo records debe ser un JSON válido`).

```json
{
  "success": false,
  "message": "No se encontró el registro con id 7 para la compañía: EMPRESA DE EJEMPLO SAS"
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

La respuesta no incluye el campo `success`:

```json
{
  "message": "Configuración eliminada exitosamente"
}
```

</details>

<details>
<summary>❌ Registro No Encontrado (HTTP 404)</summary>

```json
{
  "success": false,
  "message": "No se encontró el registro con id 7 para la compañía: EMPRESA DE EJEMPLO SAS"
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
Convierte la imagen (PNG/JPG) a Base64 con el prefijo Data URI (ej. `data:image/png;base64,...`) y envíala en `imgdata`, junto con `imgname`, el nombre del archivo original (ej. `logo.png`).
:::

**Propiedades de `records`:**
| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `imgdata` | string | ✅ Sí | Imagen como Data URI en Base64. Se toma lo que sigue a la primera coma. |
| `imgname` | string | ✅ Sí | Nombre del archivo original. Solo se usa su extensión: `png`, `jpg`, `jpeg`, `gif`, `webp`, `svg`, `jfif`, `bmp` o `ico`; cualquier otra se guarda como `png`. El nombre final del archivo lo asigna el servidor. |

<Tabs>
<TabItem value="js" label="JavaScript / Node.js" default>

```javascript
import fs from 'fs';
import axios from 'axios';

const imgBuffer = fs.readFileSync('logo.png');
const base64Img = 'data:image/png;base64,' + imgBuffer.toString('base64');

const response = await axios.put(`${url}/settings/reports/${id}/image`, {
  records: JSON.stringify({ imgdata: base64Img, imgname: 'logo.png' })
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

$payload = json_encode(['records' => json_encode([
    'imgdata' => $base64Img,
    'imgname' => 'logo.png',
])]);

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
    json={"records": json.dumps({"imgdata": b64_img, "imgname": "logo.png"})},
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
    imgdata: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    imgname: "logo.png"
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
  "success": true
}
```

</details>

<details>
<summary>❌ Errores</summary>

| HTTP | Mensaje | Causa |
|---|---|---|
| 422 | `El campo records es requerido` | Falta `records` (formato estándar de validación, con `errors`). |
| 422 | `El campo records debe ser un JSON válido` | `records` no es un JSON válido. |
| 404 | `No se encontró el registro con id <id> para la compañía: <razón social>` | El encabezado no existe o no pertenece a la empresa. |
| 404 | `La propiedad IMGDATA no está definida.` | `records` no incluye `imgdata`. |
| 404 | `La cadena base64 de la imagen no es válida.` | `imgdata` viene vacío. |
| 500 | `Error interno del servidor. La propiedad RECORDS no está definida.` | `records` es un JSON vacío o nulo (por ejemplo `null` o `[]`). |
| 500 | `Error interno del servidor. ...` | `records` no incluye `imgname`. Envíalo siempre junto con `imgdata`. |
| 500 | Respuesta `{"success": false, "error": "..."}` | Falló la actualización del registro. |

```json
{
  "success": false,
  "message": "No se encontró el registro con id 7 para la compañía: EMPRESA DE EJEMPLO SAS"
}
```

Las respuestas 500 incluyen además un `reference` para que soporte ubique el error.

</details>

</details>
