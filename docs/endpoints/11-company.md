---
sidebar_position: 11
sidebar_label: 🏢 Empresa
description: "Datos de la empresa y gestión de clientes y sub-cuentas para Casas de Software: alta, listado, habilitación, estadísticas, logo y configuración."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 🏢 Empresa {#empresa}

:::warning Autenticación Requerida
Incluir en todos los endpoints: `Authorization: Bearer {token}`
:::

:::info Parámetro Multi-Tenant: `client_uuid`
Agrega `?client_uuid={{client_uuid}}` para operar sobre una empresa cliente (Casa de Software) en los endpoints de **configuración** y **datos de la empresa**.

- El `client_uuid` de un cliente es el campo `uuid` que devuelve `GET /company/customers` o el alta del cliente (`dataRecords.uuid`).
- Solo funciona con la relación **activa**. Con la relación deshabilitada responde `403` con `Acceso no autorizado. Acceso denegado: No tiene permisos para operar sobre esta empresa o la relación no está activa.`
- Si envías el `id` numérico en lugar del `uuid`, responde `500` con `Error interno del servidor. Debe enviar el UUID del cliente, no el ID.` Un `uuid` que no existe responde `404` con `Empresa no encontrada.`

```http
GET {{url}}/company/customers
Authorization: Bearer {token}
```
:::

---

## 🔧 Configuración de la Empresa {#configuracion}

<details open>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/company/settings</b> — Obtener Configuración</summary>

```http
GET {{url}}/company/settings?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Devuelve las configuraciones generales de la empresa. Si a la empresa le falta alguna configuración, la API la crea con su valor por defecto antes de responder. Solo se listan las configuraciones vigentes, ordenadas por grupo (`setting.tag`).

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json title="Respuesta (extracto)"
{
  "settings": [
    {
      "id": 5012,
      "company_id": 1262,
      "setting_id": 1,
      "value": "0",
      "active": 1,
      "setting": {
        "id": 1,
        "tag": 1,
        "key_value": "SENDMAILCOPY",
        "data_type": "B",
        "value": "0",
        "description": "Enviar copia del correo",
        "active": 1
      }
    }
  ],
  "success": true
}
```

</details>

Usa el `id` de cada elemento de `settings` (no el de `setting`) para actualizarlo con `PUT /company/settings`.

</details>

<details>
<summary><span className="badge badge--warning margin-right--sm">PUT</span> <b>/company/settings</b> — Actualizar Configuración</summary>

```http
PUT {{url}}/company/settings?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

El body lleva `records`: un **arreglo serializado como texto JSON**. Cada elemento indica el `id` de la configuración (el `id` que devuelve `GET /company/settings` en cada elemento de `settings`) y su nuevo `value`.

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `records` | string (JSON) | ✅ | Arreglo de objetos `{ "id": ..., "value": ... }` serializado como texto. |
| `records[].id` | integer | ✅ | `id` de la configuración de la empresa. |
| `records[].value` | string | ✅ | Nuevo valor. |

```json
{
  "records": "[{\"id\":5012,\"value\":\"1\"},{\"id\":5013,\"value\":\"facturacion@empresaejemplo.com\"}]"
}
```

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "message": "Configuración actualizada",
  "success": true
}
```

</details>

<details>
<summary>❌ Errores</summary>

| Status | Mensaje | Causa |
|:---:|---|---|
| `422` | `El campo records es requerido` · `El campo records debe ser un JSON válido` | Falta `records` o no es texto JSON. Un body plano (sin `records`) responde este error. |
| `401` | `Unauthenticated.` | Token ausente o inválido. |
| `403` | `Acceso no autorizado. ...` | Empresa inactiva o relación con el cliente no activa. |

</details>

</details>

---

## 🏢 Datos de la Empresa {#datos-empresa}

<details open>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/company</b> — Obtener Información de la Empresa</summary>

```http
GET {{url}}/company?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Devuelve tu empresa o, con `client_uuid`, la del cliente. Es la forma de obtener el **`uuid` de tu propia empresa**, que exigen `PUT /company/{uuid}`, `PUT /company/{uuid}/image` y `POST /company/{uuid}/customer`. Toda empresa recibe su `uuid` al crearse.

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json title="Respuesta (extracto)"
{
  "dataRecords": {
    "data": {
      "uuid": "1f3a0b11-b698-11f1-a6c7-d843ae899220",
      "country_id": 45,
      "city_id": 149,
      "identity_document_id": 3,
      "type_organization_id": 1,
      "tax_regime_id": 1,
      "tax_level_id": 5,
      "company_name": "EMPRESA EJEMPLO S.A.S",
      "trade_name": "Empresa Ejemplo",
      "dni": "900123456",
      "dv": 8,
      "address": "Calle 123 # 45-67",
      "email": "facturacion@empresaejemplo.com",
      "full_path_image": ""
    }
  },
  "total": 1,
  "success": true
}
```

La respuesta no incluye el `id` numérico de la empresa.

</details>

<details>
<summary>❌ Errores</summary>

| Status | Mensaje | Causa |
|:---:|---|---|
| `401` | `Unauthenticated.` | Token ausente o inválido. |
| `403` | `Acceso no autorizado. La empresa se encuentra inactiva.` | La empresa resuelta está inactiva. |
| `403` | `Acceso no autorizado. Acceso denegado: No tiene permisos para operar sobre esta empresa o la relación no está activa.` | El `client_uuid` no es un cliente tuyo o la relación está deshabilitada. |
| `403` | `Usuario no asociado a ninguna empresa.` | El usuario del token no tiene empresa. |
| `404` | `Empresa no encontrada.` | El `client_uuid` no existe. |
| `500` | `Error interno del servidor. Debe enviar el UUID del cliente, no el ID.` | Se envió el `id` numérico como `client_uuid`. |

</details>

</details>

<details>
<summary><span className="badge badge--warning margin-right--sm">PUT</span> <b>/company/&#123;uuid&#125;</b> — Actualizar Empresa</summary>

```http
PUT {{url}}/company/{uuid}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

| Parámetro | Ubicación | Requerido | Descripción |
|-----------|-----------|-----------|-------------|
| `uuid` | path | ✅ Sí | `uuid` de la empresa que se actualiza: la tuya o, si envías `client_uuid`, la del cliente. Si no coincide, responde `404` con `La empresa no existe.` |
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

:::info Formato del payload `records`
Los datos de la empresa se encapsulan dentro de `records`, serializado como texto JSON. Solo se guardan los campos cuyo valor cambia.
:::

**Campos de `records`:**

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `country_id` | integer | ✅ | ID del país (`45` Colombia). Debe venir siempre. Si es el número `45` (no el texto `"45"`), la API recalcula el `dv` a partir de `dni`. |
| `dni` | string | Si `country_id` es `45` | NIT sin dígito de verificación. Solo se usa para recalcular el `dv`: **el NIT no se actualiza**. |
| `city_id` | integer | No | ID de la ciudad/municipio DIAN |
| `identity_document_id` | integer | No | Tipo de documento (`3` NIT, `1` Cédula) |
| `type_organization_id` | integer | No | `1` Jurídica, `2` Natural |
| `tax_regime_id` | integer | No | `1` Responsable IVA, `2` No responsable |
| `tax_level_id` | integer | No | `4` No aplica, `5` R-99-PN |
| `company_name` | string | No | Razón social o nombre completo |
| `trade_name` | string | No | Nombre comercial |
| `address` | string | No | Dirección fiscal completa |
| `city_name` | string | No | Nombre de la ciudad |
| `merchant_registration` | string | No | Matrícula mercantil |
| `location` | string | No | Barrio / ubicación complementaria |
| `postal_code` | string | No | Código postal |
| `mobile` | string | No | Teléfono móvil |
| `phone` | string | No | Teléfono fijo |
| `email` | string | No | Correo de notificaciones |
| `web` | string | No | Sitio web corporativo |
| `extra_data` | string | No | Información adicional |
| `imgdata` | string | No | Logo en Base64 con prefijo Data URI. Si trae contenido, `imgname` es obligatorio. `imgdata: ""` se ignora. |
| `imgname` | string | Con `imgdata` | Nombre del archivo del logo. Solo se usa su extensión (ver [Actualizar Logo](#actualizar-logo)). |

El `dv` que envíes se sobrescribe. Cualquier otro campo (por ejemplo `active`, `uuid` o `id`) se ignora: el estado de la empresa no se cambia por este endpoint.

<Tabs>
<TabItem value="js" label="JavaScript / Node.js" default>

```javascript
const records = {
  country_id: 45, city_id: 149, identity_document_id: 3,
  type_organization_id: 1, tax_regime_id: 1, tax_level_id: 5,
  company_name: "EMPRESA EJEMPLO S.A.S", trade_name: "Empresa Ejemplo", dni: "900123456",
  address: "Calle 123 # 45-67", merchant_registration: "000000",
  location: "", postal_code: "110111", mobile: "3001234567",
  phone: "6012345678", email: "facturacion@empresaejemplo.com",
  web: "https://empresaejemplo.com/",
  imgdata: "", imgname: ""   // Opcional: logo en Base64 + nombre del archivo (ej. "logo.png")
};
const response = await axios.put(`${url}/company/${uuid}`, {
  records: JSON.stringify(records)
}, { headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' } });
```

</TabItem>
<TabItem value="php" label="PHP (cURL)">

```php
$records = [
    'country_id' => 45, 'city_id' => 149, 'identity_document_id' => 3,
    'type_organization_id' => 1, 'tax_regime_id' => 1, 'tax_level_id' => 5,
    'company_name' => 'EMPRESA EJEMPLO S.A.S', 'dni' => '900123456',
    'address' => 'Calle 123 # 45-67', 'email' => 'facturacion@empresaejemplo.com',
    // Opcional: 'imgdata' => 'data:image/png;base64,...', 'imgname' => 'logo.png',
];
$payload = json_encode(['records' => json_encode($records)]);
$ch = curl_init("{$url}/company/{$uuid}");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true, CURLOPT_CUSTOMREQUEST => 'PUT',
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $token, 'Content-Type: application/json'],
]);
curl_exec($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
records = {
    "country_id": 45, "city_id": 149, "identity_document_id": 3,
    "type_organization_id": 1, "tax_regime_id": 1, "tax_level_id": 5,
    "company_name": "EMPRESA EJEMPLO S.A.S", "dni": "900123456",
    "address": "Calle 123 # 45-67", "email": "facturacion@empresaejemplo.com",
    # Opcional: "imgdata": "data:image/png;base64,...", "imgname": "logo.png",
}
response = requests.put(f"{url}/company/{uuid}", json={"records": json.dumps(records)},
    headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"})
```

</TabItem>
<TabItem value="postman" label="Postman (Pre-request)">

```javascript
const records = {
    country_id: 45, city_id: 149, identity_document_id: 3,
    type_organization_id: 1, tax_regime_id: 1, tax_level_id: 5,
    company_name: "EMPRESA EJEMPLO S.A.S", trade_name: "Empresa Ejemplo", dni: "900123456",
    address: "Calle 123 # 45-67", merchant_registration: "000000", location: "",
    postal_code: "110111", mobile: "3001234567", phone: "6012345678",
    email: "facturacion@empresaejemplo.com", web: "https://empresaejemplo.com/",
    imgdata: "", imgname: "",
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

```json title="Respuesta (extracto)"
{
  "dataRecords": {
    "uuid": "1f3a0b11-b698-11f1-a6c7-d843ae899220",
    "country_id": 45,
    "city_id": 149,
    "company_name": "EMPRESA EJEMPLO S.A.S",
    "dni": "900123456",
    "dv": 8,
    "address": "Calle 123 # 45-67",
    "email": "facturacion@empresaejemplo.com",
    "full_path_image": ""
  },
  "message": "Registro actualizado correctamente.",
  "success": true
}
```

`dataRecords` es la empresa actualizada, sin el `id` numérico.

</details>

<details>
<summary>❌ Errores</summary>

| Status | Mensaje | Causa |
|:---:|---|---|
| `422` | `El campo records es requerido` · `El campo records debe ser un JSON válido` | Falta `records` o no es texto JSON. |
| `404` | `La empresa no existe.` | El `{uuid}` de la ruta no es el de la empresa que se actualiza. |
| `400` | Mensaje de la base de datos | Un valor viola una restricción de integridad (por ejemplo, un `city_id` inexistente). |
| `500` | `Error interno del servidor. La propiedad RECORDS no está definida.` | `records` decodifica a un valor vacío. |
| `500` | `Error interno del servidor. ...` | Falta `country_id`, falta `dni` con `country_id` `45`, o falta `imgname` con `imgdata`. |

Además, los errores de `client_uuid` descritos en [Obtener Información de la Empresa](#datos-empresa).

</details>

</details>

<details>
<summary><span className="badge badge--warning margin-right--sm">PUT</span> <b>/company/&#123;uuid&#125;/image</b> — Actualizar Logo</summary>

<a id="actualizar-logo"></a>

```http
PUT {{url}}/company/{uuid}/image?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

:::info Logo en Base64
Envía dentro de `records` (texto JSON) dos propiedades:

- `imgdata`: el logo en Base64 con prefijo Data URI (`data:image/png;base64,...`). Se toma lo que sigue a la primera coma.
- `imgname`: nombre del archivo, **obligatorio**. Solo se usa su extensión: `png`, `jpg`, `jpeg`, `gif`, `webp`, `svg`, `jfif`, `bmp` o `ico`. Cualquier otra, o ninguna, se guarda como `png`. El nombre final del archivo lo asigna la API.
:::

<Tabs>
<TabItem value="js" label="JavaScript / Node.js" default>

```javascript
const imgBuffer = fs.readFileSync('logo.png');
const base64Img = 'data:image/png;base64,' + imgBuffer.toString('base64');
await axios.put(`${url}/company/${uuid}/image`, {
  records: JSON.stringify({ imgdata: base64Img, imgname: 'logo.png' })
}, { headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' } });
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$base64Img = 'data:image/png;base64,' . base64_encode(file_get_contents('logo.png'));
$payload = json_encode(['records' => json_encode(['imgdata' => $base64Img, 'imgname' => 'logo.png'])]);
$ch = curl_init("{$url}/company/{$uuid}/image");
curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_CUSTOMREQUEST => 'PUT',
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $token, 'Content-Type: application/json']]);
curl_exec($ch);
```

</TabItem>
<TabItem value="python" label="Python">

```python
with open("logo.png", "rb") as f:
    b64_img = "data:image/png;base64," + base64.b64encode(f.read()).decode("utf-8")
requests.put(f"{url}/company/{uuid}/image",
    json={"records": json.dumps({"imgdata": b64_img, "imgname": "logo.png"})},
    headers={"Authorization": f"Bearer {token}"})
```

</TabItem>
<TabItem value="postman" label="Postman (Pre-request)">

```javascript
const payload = { records: JSON.stringify({ imgdata: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...", imgname: "logo.png" }) };
pm.request.body.mode = 'raw'; pm.request.body.raw = JSON.stringify(payload);
pm.request.headers.add({key: 'Content-Type', value: 'application/json'});
```

</TabItem>
</Tabs>

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json title="Respuesta (extracto)"
{
  "dataRecords": {
    "uuid": "1f3a0b11-b698-11f1-a6c7-d843ae899220",
    "company_name": "EMPRESA EJEMPLO S.A.S",
    "image": "/storage/companies/1262/logo/7c1e9a52-0b3d-4f6e-a8d1-93b2c4e5f607.png",
    "full_path_image": "https://sandbox-api.matias-api.com/storage/companies/1262/logo/7c1e9a52-0b3d-4f6e-a8d1-93b2c4e5f607.png"
  },
  "message": "Imagen actualizada correctamente.",
  "success": true
}
```

</details>

<details>
<summary>❌ Errores</summary>

| Status | Mensaje | Causa |
|:---:|---|---|
| `404` | `La empresa no existe.` | El `{uuid}` de la ruta no es el de la empresa que se actualiza. |
| `404` | `La propiedad IMGDATA no está definida.` | `records` no trae `imgdata`. |
| `404` | `La propiedad IMGDATA no está definida o está vacía.` | `imgdata` no trae contenido después de la coma. |
| `500` | `Error interno del servidor. La propiedad RECORDS no está definida.` | `records` ausente o no es JSON válido (este endpoint no responde `422`). |
| `500` | `Error interno del servidor. ...` | Falta `imgname`. |

Además, los errores de `client_uuid` descritos en [Obtener Información de la Empresa](#datos-empresa).

</details>

</details>

---

## 👥 Gestión de Clientes (Casa de Software) {#clientes-casa-software}

Una Casa de Software tiene una **cuenta principal** y, debajo de ella, crea las empresas de sus clientes como **sub-cuentas**. Cada sub-cuenta queda vinculada a la Casa de Software mediante una **relación**, que puede estar activa o deshabilitada.

| | Cuenta principal | Sub-cuenta (cliente) |
|---|---|---|
| **Endpoint** | `POST /register` (público, sin token) | `POST /company/{uuid}/customer` (con el token de la Casa de Software) |
| **Tipo de usuario** | `DEVELOPER`, lo fija el servidor | `CLIENT`, lo fija el servidor |
| **Correo** | Se envía un correo de verificación; hay que verificarlo antes de iniciar sesión | No se envía ningún correo; queda verificado y el cliente puede iniciar sesión de inmediato |
| **Vínculo** | Ninguno | Relación activa con la Casa de Software |
| **Respuesta** | Solo `message` y `success` | `dataRecords` con la empresa creada, incluidos su `uuid` y su `id` |

:::danger `POST /register` no crea sub-cuentas
`POST /register` es el auto-registro de una cuenta principal. Si envías `company_id`, responde `422` y no crea nada. Las sub-cuentas se crean **solo** con `POST /company/{uuid}/customer` y el token de la Casa de Software.
:::

:::danger No envíes `client_uuid` ni `companyId` en los endpoints de clientes
En los endpoints de esta sección quien actúa es siempre la **Casa de Software**, y el cliente se identifica con el `{uuid}` de la ruta. En el listado, las estadísticas, la deshabilitación y la habilitación, si envías `client_uuid` o `companyId` la API toma esa empresa como la que actúa, y la operación falla o se aplica sobre otra empresa. En la creación se ignora, y en los dos `PUT` de clientes el servidor lo reemplaza por el `{uuid}` de la ruta.
:::

<details open>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/company/customers</b> — Listar Clientes</summary>

```http
GET {{url}}/company/customers?is_active=1&search=900123456
Authorization: Bearer {token}
```

Devuelve tus clientes paginados (15 por página), ordenados por razón social.

| Parámetro | Ubicación | Requerido | Descripción |
|-----------|-----------|-----------|-------------|
| `is_active` | query | No | `1` (default) clientes con relación activa, `0` clientes deshabilitados. |
| `search` | query | No | Coincidencia parcial en NIT (`dni`) o razón social (`company_name`). |
| `uuid` | query | No | Filtra por el `uuid` exacto de un cliente. |
| `page` | query | No | Página. El tamaño de página es fijo: 15. |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json title="Respuesta (extracto)"
{
  "dataRecords": {
    "current_page": 1,
    "data": [
      {
        "id": 1262,
        "uuid": "1f3a0b11-b698-11f1-a6c7-d843ae899220",
        "dni": "900123456",
        "dv": 8,
        "company_name": "CLIENTE EJEMPLO S.A.S",
        "trade_name": null,
        "email": "facturacion@clienteejemplo.com",
        "active": 1,
        "full_path_image": "",
        "quotas": [],
        "company": {
          "id": 845,
          "company_id": 37,
          "customer_id": 1262,
          "active": 1
        }
      }
    ],
    "first_page_url": "https://sandbox-api.matias-api.com/api/ubl2.1/company/customers?page=1",
    "from": 1,
    "last_page": 1,
    "last_page_url": "https://sandbox-api.matias-api.com/api/ubl2.1/company/customers?page=1",
    "links": [],
    "next_page_url": null,
    "path": "https://sandbox-api.matias-api.com/api/ubl2.1/company/customers",
    "per_page": 15,
    "prev_page_url": null,
    "to": 1,
    "total": 1
  },
  "success": true
}
```

Cada elemento de `data` es la empresa cliente:

| Campo | Contenido |
|-------|-----------|
| `id` | `id` numérico del cliente. Es el `client_company_id` de las cuotas (`POST /memberships/quotas`). |
| `uuid` | Identificador del cliente para `/company/customers/{uuid}...` y para `client_uuid` en el resto de la API. |
| `software`, `certificate`, `resolutions` | Software, certificado y resoluciones activas del cliente. `certificate` no incluye la contraseña, la ruta del archivo, el contenido del certificado ni `company_id`. |
| `country`, `city`, `identity_document`, `type_organization` | Catálogos asociados. |
| `quotas` | Cuotas del cliente agrupadas por suscripción, de la más reciente a la más antigua. Cada elemento trae `subscription_id`, y en `assigned_documents` y `consumed_documents` la suma de las cuotas de esa suscripción. Los demás campos (`id`, `uuid`, `start_date`, `end_date`) son los de una de las cuotas del grupo. |
| `company` | Relación con la Casa de Software (`company_id`, `customer_id`, `active`) y, anidada, tu empresa. |

:::warning No confundas los IDs
`data[i].company.id` es el ID de la relación Casa de Software ↔ cliente, no el del cliente. El estado de la relación está en `data[i].company.active`.
:::

</details>

<details>
<summary>❌ Errores</summary>

| Status | Mensaje | Causa |
|:---:|---|---|
| `401` | `Unauthenticated.` | Token ausente o inválido. |
| `403` | `La empresa se encuentra inactiva.` | Tu empresa está inactiva. La respuesta solo trae `message`. |
| `500` | `Server Error` | El usuario del token no tiene empresa asociada, u otro error interno. |
| `429` | `Too Many Attempts.` | Se superó el límite de solicitudes. |

</details>

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/company/&#123;uuid&#125;/customer</b> — Crear Cliente (sub-cuenta)</summary>

```http
POST {{url}}/company/{uuid}/customer
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

Crea el usuario y la empresa del cliente y los vincula a tu cuenta principal. Todo ocurre en una sola transacción: si algo falla, no se crea nada.

| Parámetro | Ubicación | Requerido | Descripción |
|-----------|-----------|-----------|-------------|
| `uuid` | path | ✅ Sí | `uuid` de **tu propia empresa** (cuenta principal), no el de un cliente. Lo obtienes con `GET /company`. |

**Requisitos:** el titular de tu empresa es una Casa de Software (usuario `DEVELOPER`), tu empresa está activa y, en producción, tu plan no es FREE (en sandbox esta restricción no aplica).

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `first_name` | string | ✅ | Nombre del usuario del cliente. Máx. 100. Se guarda en mayúsculas. |
| `last_name` | string | ✅ | Apellido del usuario del cliente. Máx. 100. Se guarda en mayúsculas. |
| `company_name` | string | ✅ | Razón social. Máx. 100. Se guarda en mayúsculas. |
| `trade_name` | string | No | Nombre comercial. Máx. 250. Se guarda tal como llega. |
| `email` | string | ✅ | Correo del usuario y de la empresa. Máx. 255. Debe ser válido, con dominio existente, y no estar registrado. |
| `password` | string | ✅ | Mínimo 8 caracteres. |
| `password_confirmation` | string | ✅ | Debe coincidir con `password`. |
| `dni` | string | ✅ | NIT **solo dígitos** (sin `dv`, puntos ni guiones). Máx. 15. No debe estar registrado. El `dv` lo calcula la API. |
| `country_id` | integer | No | Default `45`. |
| `city_id` | integer | No | Default `149`. |
| `identity_document_id` | integer | No | Default `3`. |
| `type_organization_id` | integer | No | Default `1`. |
| `tax_regime_id` | integer | No | Default `1`. |
| `tax_level_id` | integer | No | Default `5`. |
| `address`, `location`, `postal_code`, `mobile`, `phone`, `web` | string | No | Default vacío. |

Si envías `type_id`, se ignora: el usuario del cliente siempre es `CLIENT`.

```json
{
  "first_name": "Juan",
  "last_name": "Pérez",
  "company_name": "Cliente Ejemplo S.A.S",
  "email": "facturacion@clienteejemplo.com",
  "password": "ClaveSegura2026",
  "password_confirmation": "ClaveSegura2026",
  "dni": "900123456",
  "country_id": 45,
  "city_id": 149,
  "address": "Calle 123 # 45-67",
  "mobile": "3001234567"
}
```

**Qué crea:** un usuario `CLIENT` activo con el correo ya verificado (no se le envía ningún correo), la empresa del cliente con su `uuid` y su `dv`, una suscripción FREE de 100 documentos por 1 año a nombre del cliente (también en sandbox) y la relación activa con tu empresa. No crea cuotas.

Esa suscripción FREE no limita la emisión del cliente mientras está vinculado a tu empresa: cada documento que emite se descuenta de tu suscripción activa. Si le asignas una cuota vigente, el cliente consume de esa cuota; si no, consume de tu bolsa compartida. Ver [Guía rápida: cuotas para clientes](./09-memberships-health.md#guia-cuotas).

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json title="Respuesta (extracto)"
{
  "dataRecords": {
    "id": 1262,
    "uuid": "1f3a0b11-b698-11f1-a6c7-d843ae899220",
    "country_id": 45,
    "city_id": 149,
    "identity_document_id": 3,
    "type_organization_id": 1,
    "tax_regime_id": 1,
    "tax_level_id": 5,
    "company_name": "CLIENTE EJEMPLO S.A.S",
    "trade_name": null,
    "dni": "900123456",
    "dv": 8,
    "address": "Calle 123 # 45-67",
    "location": "",
    "postal_code": "",
    "mobile": "3001234567",
    "phone": "",
    "email": "facturacion@clienteejemplo.com",
    "web": "",
    "full_path_image": ""
  },
  "message": "Cliente creado con éxito, ya puede iniciar sesión. No es necesario verificar el correo electrónico.",
  "success": true
}
```

La respuesta es `200`, no `201`. Guarda los dos identificadores:

- `dataRecords.uuid`: para `/company/customers/{uuid}...` y como `client_uuid` en el resto de la API.
- `dataRecords.id`: el `client_company_id` de las cuotas.

</details>

<details>
<summary>❌ Errores</summary>

| Status | Mensaje | Causa |
|:---:|---|---|
| `401` | `Unauthenticated.` | Token ausente o inválido. |
| `422` | `El nombre es requerido` · `El apellido es requerido` · `El nombre de la empresa es requerido` | Falta `first_name`, `last_name` o `company_name`. |
| `422` | `El correo electrónico es requerido` · `El correo electrónico no es válido o su dominio no existe` · `El correo electrónico ya existe` | `email` ausente, inválido o ya registrado. |
| `422` | `El NIT es requerido` · `El NIT ya existe` | `dni` ausente o ya registrado. |
| `422` | `El NIT debe contener solo dígitos, sin puntos, guiones ni dígito de verificación` | `dni` con caracteres que no son dígitos. |
| `422` | `El NIT no puede tener más de 15 dígitos` | `dni` de más de 15 dígitos. |
| `422` | Mensaje estándar | `password` de menos de 8 caracteres o `password_confirmation` que no coincide. |
| `403` | `Acceso no autorizado. Acceso denegado: Solo puede crear clientes en su propia empresa.` | El `{uuid}` de la ruta no es el de tu empresa. |
| `403` | `Acceso no autorizado. La empresa se encuentra inactiva.` | Tu empresa está inactiva. |
| `403` | `Usuario no asociado a ninguna empresa.` | El usuario del token, o el titular de tu empresa, no tiene empresa. |
| `403` | `El plan FREE no permite agregar clientes. Actualice su plan para acceder a esta funcionalidad.` | Tu plan es FREE (solo en producción). |
| `403` | `Solo los usuarios DESARROLLADORES pueden crear clientes.` | El titular de tu empresa no es una Casa de Software. |
| `404` | `Empresa no encontrada.` | El `{uuid}` no existe. |
| `404` | `Usuario no encontrado.` | El usuario titular de tu empresa no existe. |
| `400` | Mensaje de la base de datos | Un valor viola una restricción de integridad (por ejemplo, un `country_id` o `city_id` inexistente). |
| `500` | `Error interno del servidor. ...` | Cualquier otro error al guardar. Incluye `reference` para soporte. |
| `429` | `Too Many Attempts.` | Se superó el límite de solicitudes. |

La validación del body (`422`) ocurre **antes** de comprobar el `{uuid}`. Los `403`, `404` y `400` traen la forma `{"success": false, "message": "..."}`; con cualquiera de ellos no se crea nada.

```json
{
  "message": "El correo electrónico ya existe (and 1 more error)",
  "errors": {
    "email": ["El correo electrónico ya existe"],
    "dni": ["El NIT ya existe"]
  }
}
```

</details>

</details>

<details>
<summary><span className="badge badge--warning margin-right--sm">PUT</span> <b>/company/customers/&#123;client_uuid&#125;</b> — Actualizar Datos del Cliente</summary>

```http
PUT {{url}}/company/customers/{client_uuid}
Authorization: Bearer {token}
Content-Type: application/json
```

| Parámetro | Ubicación | Requerido | Descripción |
|-----------|-----------|-----------|-------------|
| `client_uuid` | path | ✅ Sí | `uuid` del cliente. La relación con el cliente debe estar activa. |

El body lleva `records`: los datos **serializados como texto JSON**, con los mismos campos que [Actualizar Empresa](#datos-empresa). `country_id` es obligatorio; si es el número `45`, también `dni` (solo para recalcular el `dv`: el NIT no se actualiza). Opcionalmente, `imgdata` + `imgname` para cambiar el logo. Los campos no admitidos se ignoran y solo se guardan los valores que cambian.

```json
{
  "records": "{\"country_id\":45,\"dni\":\"900123456\",\"city_id\":149,\"address\":\"Carrera 7 # 10-20\",\"phone\":\"6012345678\"}"
}
```

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json title="Respuesta (extracto)"
{
  "dataRecords": {
    "uuid": "1f3a0b11-b698-11f1-a6c7-d843ae899220",
    "country_id": 45,
    "city_id": 149,
    "company_name": "CLIENTE EJEMPLO S.A.S",
    "dni": "900123456",
    "dv": 8,
    "address": "Carrera 7 # 10-20",
    "phone": "6012345678",
    "email": "facturacion@clienteejemplo.com",
    "full_path_image": ""
  },
  "message": "Registro actualizado correctamente.",
  "success": true
}
```

</details>

<details>
<summary>❌ Errores</summary>

| Status | Mensaje | Causa |
|:---:|---|---|
| `401` | `Unauthenticated.` | Token ausente o inválido. |
| `422` | `El campo records es requerido` · `El campo records debe ser un JSON válido` | Falta `records` (por ejemplo, un body plano) o no es texto JSON. |
| `403` | `Acceso no autorizado. Acceso denegado: No tiene permisos para operar sobre esta empresa o la relación no está activa.` | El cliente no es tuyo o la relación está deshabilitada. |
| `403` | `Acceso no autorizado. La empresa se encuentra inactiva.` | La empresa del cliente está inactiva. |
| `403` | `Usuario no asociado a ninguna empresa.` | El usuario del token no tiene empresa. |
| `404` | `Empresa no encontrada.` | El `uuid` no existe. |
| `400` | Mensaje de la base de datos | Un valor viola una restricción de integridad. |
| `500` | `Error interno del servidor. Debe enviar el UUID del cliente, no el ID.` | Se envió el `id` numérico en la ruta. |
| `500` | `Error interno del servidor. La propiedad RECORDS no está definida.` | `records` decodifica a un valor vacío. |
| `500` | `Error interno del servidor. ...` | Falta `country_id`, falta `dni` con `country_id` `45`, o falta `imgname` con `imgdata`. |
| `429` | `Too Many Attempts.` | Se superó el límite de solicitudes. |

</details>

</details>

<details>
<summary><span className="badge badge--warning margin-right--sm">PUT</span> <b>/company/customers/&#123;client_uuid&#125;/image</b> — Actualizar Imagen del Cliente</summary>

```http
PUT {{url}}/company/customers/{client_uuid}/image
Authorization: Bearer {token}
Content-Type: application/json
```

Permite a una Casa de Software actualizar el logo de una empresa cliente. La relación con el cliente debe estar activa. `records` lleva `imgdata` e `imgname`, con las mismas reglas que [Actualizar Logo](#actualizar-logo).

```json
{
  "records": "{\"imgdata\":\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...\",\"imgname\":\"logo.png\"}"
}
```

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json title="Respuesta (extracto)"
{
  "dataRecords": {
    "uuid": "1f3a0b11-b698-11f1-a6c7-d843ae899220",
    "company_name": "CLIENTE EJEMPLO S.A.S",
    "image": "/storage/companies/1262/logo/7c1e9a52-0b3d-4f6e-a8d1-93b2c4e5f607.png",
    "full_path_image": "https://sandbox-api.matias-api.com/storage/companies/1262/logo/7c1e9a52-0b3d-4f6e-a8d1-93b2c4e5f607.png"
  },
  "message": "Imagen actualizada correctamente.",
  "success": true
}
```

</details>

<details>
<summary>❌ Errores</summary>

| Status | Mensaje | Causa |
|:---:|---|---|
| `401` | `Unauthenticated.` | Token ausente o inválido. |
| `403` | `Acceso no autorizado. Acceso denegado: No tiene permisos para operar sobre esta empresa o la relación no está activa.` | El cliente no es tuyo o la relación está deshabilitada. |
| `403` | `Acceso no autorizado. La empresa se encuentra inactiva.` | La empresa del cliente está inactiva. |
| `403` | `Usuario no asociado a ninguna empresa.` | El usuario del token no tiene empresa. La respuesta trae la forma `{"success": false, "message": "..."}`. |
| `404` | `Empresa no encontrada.` | El `uuid` no existe. |
| `404` | `La propiedad IMGDATA no está definida.` | `records` no trae `imgdata`. |
| `404` | `La propiedad IMGDATA no está definida o está vacía.` | `imgdata` no trae contenido después de la coma. |
| `500` | `Error interno del servidor. La propiedad RECORDS no está definida.` | `records` ausente o no es JSON válido. |
| `500` | `Error interno del servidor. Debe enviar el UUID del cliente, no el ID.` | Se envió el `id` numérico en la ruta. |
| `500` | `Error interno del servidor. ...` | Falta `imgname`. |
| `429` | `Too Many Attempts.` | Se superó el límite de solicitudes. |

</details>

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/company/customers/&#123;uuid&#125;/stats</b> — Estadísticas del Cliente</summary>

```http
GET {{url}}/company/customers/{uuid}/stats
Authorization: Bearer {token}
```

Consolida el consumo de documentos, el almacenamiento de XML y la membresía con la que opera el cliente. Funciona también con clientes deshabilitados.

| Parámetro | Ubicación | Requerido | Descripción |
|-----------|-----------|-----------|-------------|
| `uuid` | path | ✅ Sí | `uuid` del cliente. |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "dataRecords": {
    "customer": {
      "id": 1262,
      "dni": "900123456",
      "dv": 8,
      "company_name": "CLIENTE EJEMPLO S.A.S",
      "email": "facturacion@clienteejemplo.com",
      "city": "Bogotá D.C."
    },
    "stats": {
      "total_documents_consumed": 148,
      "total_storage_bytes": 5242880,
      "total_storage_mb": 5.0
    },
    "subscription": {
      "id": 311,
      "status": "active",
      "start_date": "2026-10-14T05:00:00.000000Z",
      "end_date": "2027-10-13T05:00:00.000000Z",
      "total_documents_limit": 500,
      "plan_name": "Cuota Asignada",
      "is_unlimited": false
    }
  },
  "success": true
}
```

| Campo | Descripción |
|-------|-------------|
| `customer.city` | Nombre de la ciudad, o `null`. |
| `stats.total_documents_consumed` | Documentos consumidos por el cliente, sumando todos sus periodos. |
| `stats.total_storage_bytes` | Bytes de los XML del cliente ya almacenados. |
| `stats.total_storage_mb` | Lo mismo en MB, con 2 decimales. |
| `subscription` | Membresía con la que opera el cliente. Es `null` si la relación está activa y tu empresa no tiene suscripción activa, o si la relación no está activa y el cliente no tiene una suscripción propia activa. |

| Caso | `plan_name` | `total_documents_limit` |
|------|-------------|-------------------------|
| Relación activa y el cliente tiene una cuota vigente (hoy entre su `start_date` y su `end_date`) en la suscripción activa con la que opera tu empresa | `Cuota Asignada` | `assigned_documents` de la cuota |
| Relación activa y el cliente consume de tu bolsa, sin cuota vigente en esa suscripción | `CUENTA MAESTRA` | `0` (no expone el límite de tu plan) |
| Relación no activa (por ejemplo, cliente deshabilitado): el cliente opera con su propia suscripción | Nombre de su plan | Documentos de su suscripción |

Con la relación activa, `subscription.id`, `status`, `start_date`, `end_date` e `is_unlimited` son los de **tu** suscripción activa, no los del cliente: solo cambian `plan_name` y `total_documents_limit`.

</details>

<details>
<summary>❌ Errores</summary>

| Status | Mensaje | Causa |
|:---:|---|---|
| `401` | `Unauthenticated.` | Token ausente o inválido. |
| `403` | `La empresa se encuentra inactiva.` | Tu empresa está inactiva. |
| `404` | `Cliente no encontrado.` | El `uuid` no existe o no es un cliente tuyo. |
| `500` | `Error interno del servidor.` | Cualquier otro error, incluido un usuario sin empresa asociada. |
| `429` | `Too Many Attempts.` | Se superó el límite de solicitudes. |

```json
{
  "message": "Cliente no encontrado.",
  "success": false
}
```

</details>

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/company/customers/&#123;client_uuid&#125;/enable</b> — Habilitar Cliente</summary>

```http
POST {{url}}/company/customers/{client_uuid}/enable
Authorization: Bearer {token}
```

Vuelve a activar la relación con un cliente **tuyo**. Si la empresa del cliente estaba inactiva, también la reactiva. No lleva body.

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{ "message": "Cliente habilitado correctamente.", "success": true }
```

Si el cliente ya estaba habilitado, la respuesta también es `200`.

</details>

<details>
<summary>❌ Errores</summary>

| Status | Mensaje | Causa |
|:---:|---|---|
| `401` | `Unauthenticated.` | Token ausente o inválido. |
| `404` | `El cliente no existe.` | El `uuid` no existe o no es un cliente tuyo. No se modifica nada. |
| `403` | `Acceso no autorizado. La empresa se encuentra inactiva.` | Tu empresa está inactiva. |
| `403` | `Usuario no asociado a ninguna empresa.` | El usuario del token no tiene empresa. |
| `500` | `Error interno del servidor. ...` | Error interno. Incluye `reference`. |
| `429` | `Too Many Attempts.` | Se superó el límite de solicitudes. |

```json
{ "success": false, "message": "El cliente no existe." }
```

</details>

</details>

<details>
<summary><span className="badge badge--danger margin-right--sm">DELETE</span> <b>/company/customers/&#123;client_uuid&#125;</b> — Deshabilitar Cliente</summary>

```http
DELETE {{url}}/company/customers/{client_uuid}
Authorization: Bearer {token}
```

:::warning Acción reversible
Deshabilita la **relación** entre tu Casa de Software y el cliente. Es un borrado lógico: no elimina la empresa, el usuario ni la suscripción del cliente, y no cambia el estado de la empresa del cliente. Se puede revertir con `POST .../enable`.
:::

Desde ese momento:

- El cliente sale del listado por defecto y aparece al consultar con `is_active=0`.
- Ya no puedes operar en su nombre con `client_uuid` ni actualizar sus datos o su logo (`403`).

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{ "message": "Cliente eliminado correctamente.", "success": true }
```

Si el cliente ya estaba deshabilitado, la respuesta también es `200`.

</details>

<details>
<summary>❌ Errores</summary>

| Status | Mensaje | Causa |
|:---:|---|---|
| `401` | `Unauthenticated.` | Token ausente o inválido. |
| `404` | `El cliente no existe.` | El `uuid` no existe o no es un cliente tuyo. No se modifica nada. |
| `403` | `Acceso no autorizado. La empresa se encuentra inactiva.` | Tu empresa está inactiva. |
| `403` | `Usuario no asociado a ninguna empresa.` | El usuario del token no tiene empresa. |
| `500` | `Error interno del servidor. ...` | Error interno. Incluye `reference`. |
| `429` | `Too Many Attempts.` | Se superó el límite de solicitudes. |

</details>

</details>
