# MATIAS API UBL 2.1 — Paquete de Contexto IA: Solución de Errores, Concurrencia DIAN y Catálogos

> Guía de errores 401/404/409/422/503, manejo de concurrencia (Regla 90, DOCUMENT_POSSIBLY_SENT), configuración DIAN, Casas de Software y Glosario.

- **Versión API:** v3.10.0
- **URL del paquete:** https://docs.matias-api.com/ai/packs/troubleshooting-errors.md
- **Índice general IA:** https://docs.matias-api.com/llms.txt
- **Especificación OpenAPI 3:** https://docs.matias-api.com/openapi.json

## Páginas incluidas en este paquete

- [Empresa](https://docs.matias-api.com/docs/endpoints/company.md)
- [Gestión de Membresías y Consumo](https://docs.matias-api.com/docs/endpoints/memberships-health.md)
- [Resoluciones DIAN](https://docs.matias-api.com/docs/endpoints/dian-resolutions.md)
- [Software DIAN](https://docs.matias-api.com/docs/endpoints/dian-software.md)
- [Certificado de Firma Digital](https://docs.matias-api.com/docs/endpoints/digital-certificate.md)
- [API de Autoincremento](https://docs.matias-api.com/docs/endpoints/autoincrement.md)
- [Respuestas de la API](https://docs.matias-api.com/docs/response-json.md)
- [Guía: Errores Comunes y Soluciones](https://docs.matias-api.com/docs/use-cases/common-errors.md)
- [Glosario Técnico](https://docs.matias-api.com/docs/glossary.md)

---

<!-- Fuente: https://docs.matias-api.com/docs/endpoints/company -->

# 🏢 Empresa

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

## 🔧 Configuración de la Empresa

**GET /company/settings — Obtener Configuración**

```http
GET {{url}}/company/settings?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Devuelve las configuraciones generales de la empresa. Si a la empresa le falta alguna configuración, la API la crea con su valor por defecto antes de responder. Solo se listan las configuraciones vigentes, ordenadas por grupo (`setting.tag`).

**✅ Respuesta Exitosa (HTTP 200)**

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

Usa el `id` de cada elemento de `settings` (no el de `setting`) para actualizarlo con `PUT /company/settings`.

**PUT /company/settings — Actualizar Configuración**

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

**✅ Respuesta Exitosa (HTTP 200)**

```json
{
  "message": "Configuración actualizada",
  "success": true
}
```

**❌ Errores**

| Status | Mensaje | Causa |
|:---:|---|---|
| `422` | `El campo records es requerido` · `El campo records debe ser un JSON válido` | Falta `records` o no es texto JSON. Un body plano (sin `records`) responde este error. |
| `401` | `Unauthenticated.` | Token ausente o inválido. |
| `403` | `Acceso no autorizado. ...` | Empresa inactiva o relación con el cliente no activa. |

---

## 🏢 Datos de la Empresa

**GET /company — Obtener Información de la Empresa**

```http
GET {{url}}/company?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Devuelve tu empresa o, con `client_uuid`, la del cliente. Es la forma de obtener el **`uuid` de tu propia empresa**, que exigen `PUT /company/{uuid}`, `PUT /company/{uuid}/image` y `POST /company/{uuid}/customer`. Toda empresa recibe su `uuid` al crearse.

**✅ Respuesta Exitosa (HTTP 200)**

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

**❌ Errores**

| Status | Mensaje | Causa |
|:---:|---|---|
| `401` | `Unauthenticated.` | Token ausente o inválido. |
| `403` | `Acceso no autorizado. La empresa se encuentra inactiva.` | La empresa resuelta está inactiva. |
| `403` | `Acceso no autorizado. Acceso denegado: No tiene permisos para operar sobre esta empresa o la relación no está activa.` | El `client_uuid` no es un cliente tuyo o la relación está deshabilitada. |
| `403` | `Usuario no asociado a ninguna empresa.` | El usuario del token no tiene empresa. |
| `404` | `Empresa no encontrada.` | El `client_uuid` no existe. |
| `500` | `Error interno del servidor. Debe enviar el UUID del cliente, no el ID.` | Se envió el `id` numérico como `client_uuid`. |

**PUT /company/{uuid} — Actualizar Empresa**

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
| `imgname` | string | Con `imgdata` | Nombre del archivo del logo. Solo se usa su extensión (ver [Actualizar Logo](https://docs.matias-api.com/docs/endpoints/company#actualizar-logo)). |

El `dv` que envíes se sobrescribe. Cualquier otro campo (por ejemplo `active`, `uuid` o `id`) se ignora: el estado de la empresa no se cambia por este endpoint.

**JavaScript / Node.js**

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

**PHP (cURL)**

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

**Python**

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

**Postman (Pre-request)**

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

**✅ Respuesta Exitosa (HTTP 200)**

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

**❌ Errores**

| Status | Mensaje | Causa |
|:---:|---|---|
| `422` | `El campo records es requerido` · `El campo records debe ser un JSON válido` | Falta `records` o no es texto JSON. |
| `404` | `La empresa no existe.` | El `{uuid}` de la ruta no es el de la empresa que se actualiza. |
| `400` | Mensaje de la base de datos | Un valor viola una restricción de integridad (por ejemplo, un `city_id` inexistente). |
| `500` | `Error interno del servidor. La propiedad RECORDS no está definida.` | `records` decodifica a un valor vacío. |
| `500` | `Error interno del servidor. ...` | Falta `country_id`, falta `dni` con `country_id` `45`, o falta `imgname` con `imgdata`. |

Además, los errores de `client_uuid` descritos en [Obtener Información de la Empresa](https://docs.matias-api.com/docs/endpoints/company#datos-empresa).

**PUT /company/{uuid}/image — Actualizar Logo**

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

**JavaScript / Node.js**

```javascript
const imgBuffer = fs.readFileSync('logo.png');
const base64Img = 'data:image/png;base64,' + imgBuffer.toString('base64');
await axios.put(`${url}/company/${uuid}/image`, {
  records: JSON.stringify({ imgdata: base64Img, imgname: 'logo.png' })
}, { headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' } });
```

**PHP**

```php
$base64Img = 'data:image/png;base64,' . base64_encode(file_get_contents('logo.png'));
$payload = json_encode(['records' => json_encode(['imgdata' => $base64Img, 'imgname' => 'logo.png'])]);
$ch = curl_init("{$url}/company/{$uuid}/image");
curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_CUSTOMREQUEST => 'PUT',
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $token, 'Content-Type: application/json']]);
curl_exec($ch);
```

**Python**

```python
with open("logo.png", "rb") as f:
    b64_img = "data:image/png;base64," + base64.b64encode(f.read()).decode("utf-8")
requests.put(f"{url}/company/{uuid}/image",
    json={"records": json.dumps({"imgdata": b64_img, "imgname": "logo.png"})},
    headers={"Authorization": f"Bearer {token}"})
```

**Postman (Pre-request)**

```javascript
const payload = { records: JSON.stringify({ imgdata: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...", imgname: "logo.png" }) };
pm.request.body.mode = 'raw'; pm.request.body.raw = JSON.stringify(payload);
pm.request.headers.add({key: 'Content-Type', value: 'application/json'});
```

**✅ Respuesta Exitosa (HTTP 200)**

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

**❌ Errores**

| Status | Mensaje | Causa |
|:---:|---|---|
| `404` | `La empresa no existe.` | El `{uuid}` de la ruta no es el de la empresa que se actualiza. |
| `404` | `La propiedad IMGDATA no está definida.` | `records` no trae `imgdata`. |
| `404` | `La propiedad IMGDATA no está definida o está vacía.` | `imgdata` no trae contenido después de la coma. |
| `500` | `Error interno del servidor. La propiedad RECORDS no está definida.` | `records` ausente o no es JSON válido (este endpoint no responde `422`). |
| `500` | `Error interno del servidor. ...` | Falta `imgname`. |

Además, los errores de `client_uuid` descritos en [Obtener Información de la Empresa](https://docs.matias-api.com/docs/endpoints/company#datos-empresa).

---

## 👥 Gestión de Clientes (Casa de Software)

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

**GET /company/customers — Listar Clientes**

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

**✅ Respuesta Exitosa (HTTP 200)**

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
| `id` | `id` numérico interno del cliente. |
| `uuid` | Identificador del cliente para `/company/customers/{uuid}...` y para `client_uuid` en el resto de la API, incluidas las cuotas (`POST /memberships/quotas`). |
| `software`, `certificate`, `resolutions` | Software, certificado y resoluciones activas del cliente. `certificate` no incluye la contraseña, la ruta del archivo, el contenido del certificado ni `company_id`. |
| `country`, `city`, `identity_document`, `type_organization` | Catálogos asociados. |
| `quotas` | Cuotas del cliente agrupadas por suscripción, de la más reciente a la más antigua. Cada elemento trae `subscription_id`, y en `assigned_documents` y `consumed_documents` la suma de las cuotas de esa suscripción. Los demás campos (`id`, `uuid`, `start_date`, `end_date`) son los de una de las cuotas del grupo. |
| `company` | Relación con la Casa de Software (`company_id`, `customer_id`, `active`) y, anidada, tu empresa. |

:::warning No confundas los IDs
`data[i].company.id` es el ID de la relación Casa de Software ↔ cliente, no el del cliente. El estado de la relación está en `data[i].company.active`.
:::

**❌ Errores**

| Status | Mensaje | Causa |
|:---:|---|---|
| `401` | `Unauthenticated.` | Token ausente o inválido. |
| `403` | `La empresa se encuentra inactiva.` | Tu empresa está inactiva. La respuesta solo trae `message`. |
| `500` | `Server Error` | El usuario del token no tiene empresa asociada, u otro error interno. |
| `429` | `Too Many Attempts.` | Se superó el límite de solicitudes. |

**POST /company/{uuid}/customer — Crear Cliente (sub-cuenta)**

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

Esa suscripción FREE no limita la emisión del cliente mientras está vinculado a tu empresa: cada documento que emite se descuenta de tu suscripción activa. Si le asignas una cuota vigente, el cliente consume de esa cuota; si no, consume de tu bolsa compartida. Ver [Guía rápida: cuotas para clientes](https://docs.matias-api.com/docs/endpoints/memberships-health#guia-cuotas).

**✅ Respuesta Exitosa (HTTP 200)**

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

La respuesta es `200`, no `201`. Guarda `dataRecords.uuid`: es el identificador del cliente para `/company/customers/{uuid}...` y el `client_uuid` del resto de la API, incluidas las [cuotas](https://docs.matias-api.com/docs/endpoints/memberships-health#guia-cuotas). `dataRecords.id` es el `id` interno.

**❌ Errores**

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

**PUT /company/customers/{client_uuid} — Actualizar Datos del Cliente**

```http
PUT {{url}}/company/customers/{client_uuid}
Authorization: Bearer {token}
Content-Type: application/json
```

| Parámetro | Ubicación | Requerido | Descripción |
|-----------|-----------|-----------|-------------|
| `client_uuid` | path | ✅ Sí | `uuid` del cliente. La relación con el cliente debe estar activa. |

El body lleva `records`: los datos **serializados como texto JSON**, con los mismos campos que [Actualizar Empresa](https://docs.matias-api.com/docs/endpoints/company#datos-empresa). `country_id` es obligatorio; si es el número `45`, también `dni` (solo para recalcular el `dv`: el NIT no se actualiza). Opcionalmente, `imgdata` + `imgname` para cambiar el logo. Los campos no admitidos se ignoran y solo se guardan los valores que cambian.

```json
{
  "records": "{\"country_id\":45,\"dni\":\"900123456\",\"city_id\":149,\"address\":\"Carrera 7 # 10-20\",\"phone\":\"6012345678\"}"
}
```

**✅ Respuesta Exitosa (HTTP 200)**

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

**❌ Errores**

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

**PUT /company/customers/{client_uuid}/image — Actualizar Imagen del Cliente**

```http
PUT {{url}}/company/customers/{client_uuid}/image
Authorization: Bearer {token}
Content-Type: application/json
```

Permite a una Casa de Software actualizar el logo de una empresa cliente. La relación con el cliente debe estar activa. `records` lleva `imgdata` e `imgname`, con las mismas reglas que [Actualizar Logo](https://docs.matias-api.com/docs/endpoints/company#actualizar-logo).

```json
{
  "records": "{\"imgdata\":\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...\",\"imgname\":\"logo.png\"}"
}
```

**✅ Respuesta Exitosa (HTTP 200)**

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

**❌ Errores**

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

**GET /company/customers/{uuid}/stats — Estadísticas del Cliente**

```http
GET {{url}}/company/customers/{uuid}/stats
Authorization: Bearer {token}
```

Consolida el consumo de documentos, el almacenamiento de XML y la membresía con la que opera el cliente. Funciona también con clientes deshabilitados.

| Parámetro | Ubicación | Requerido | Descripción |
|-----------|-----------|-----------|-------------|
| `uuid` | path | ✅ Sí | `uuid` del cliente. |

**✅ Respuesta Exitosa (HTTP 200)**

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

**❌ Errores**

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

**POST /company/customers/{client_uuid}/enable — Habilitar Cliente**

```http
POST {{url}}/company/customers/{client_uuid}/enable
Authorization: Bearer {token}
```

Vuelve a activar la relación con un cliente **tuyo**. Si la empresa del cliente estaba inactiva, también la reactiva. No lleva body.

**✅ Respuesta Exitosa (HTTP 200)**

```json
{ "message": "Cliente habilitado correctamente.", "success": true }
```

Si el cliente ya estaba habilitado, la respuesta también es `200`.

**❌ Errores**

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

**DELETE /company/customers/{client_uuid} — Deshabilitar Cliente**

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

**✅ Respuesta Exitosa (HTTP 200)**

```json
{ "message": "Cliente eliminado correctamente.", "success": true }
```

Si el cliente ya estaba deshabilitado, la respuesta también es `200`.

**❌ Errores**

| Status | Mensaje | Causa |
|:---:|---|---|
| `401` | `Unauthenticated.` | Token ausente o inválido. |
| `404` | `El cliente no existe.` | El `uuid` no existe o no es un cliente tuyo. No se modifica nada. |
| `403` | `Acceso no autorizado. La empresa se encuentra inactiva.` | Tu empresa está inactiva. |
| `403` | `Usuario no asociado a ninguna empresa.` | El usuario del token no tiene empresa. |
| `500` | `Error interno del servidor. ...` | Error interno. Incluye `reference`. |
| `429` | `Too Many Attempts.` | Se superó el límite de solicitudes. |

---

<!-- Fuente: https://docs.matias-api.com/docs/endpoints/memberships-health -->

# 📊 Gestión de Membresías y Consumo

:::warning Autenticación Requerida
Incluir en todos los endpoints: `Authorization: Bearer {token}`
:::

Esta sección abarca la consulta del plan y del consumo, las recargas de documentos, la gestión de cuotas de emisión para clientes y el uso de almacenamiento y correos del plan. Está pensada para casas de software, ERPs y plataformas SaaS integradoras.

:::info Parámetro Multi-Tenant: `client_uuid`
Si operas como **Casa de Software**, puedes consultar el resumen, las recargas y las estadísticas de una sub-cuenta propia y activa agregando `?client_uuid={{client_uuid}}`. El UUID se obtiene del listado de clientes:

```http
GET {{url}}/company/customers
Authorization: Bearer {token}
```

En los endpoints de **cuotas** (`POST /memberships/quotas` y `DELETE /memberships/quotas/{client_uuid}`) el `client_uuid` identifica **al cliente que recibe la cuota**. Quien actúa es siempre la Casa de Software dueña del token.
:::

---

## 📈 Membresías y Consumo

**GET /memberships/summary — Resumen de Membresía**

```http
GET {{url}}/memberships/summary?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Obtiene el resumen de la membresía: tipo de cuenta, plan, límite de documentos, consumo, vigencia y, para la cuenta principal, las cuotas asignadas a los clientes (paginadas).

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID de una sub-cuenta propia y activa (Casa de Software). Debe ser el UUID, no el ID numérico. |
| `search` | query | No | Filtra las cuotas asignadas por razón social del cliente (coincidencia parcial). |
| `page` | query | No | Página del listado de cuotas asignadas (15 por página). |

**Campos de `data`:**

| Campo | Tipo | Descripción |
|---|---|---|
| `type` | `string` | `developer` (cuenta principal o independiente), `client_quota` (sub-cuenta con cuota asignada) o `client_shared` (sub-cuenta que consume de la bolsa de la Casa de Software). |
| `plan_name` | `string` | Nombre del plan. En `client_quota` es `Cuota de {razón social de la Casa de Software}`; en `client_shared`, `Plan {plan} (Compartido)`. |
| `is_unlimited` | `boolean` | `true` si el plan no tiene límite de documentos. |
| `valid_until` | `string` | Fecha de vencimiento (`YYYY-MM-DD`). En `developer` es la fecha más lejana entre las suscripciones vigentes. |
| `limit` | `integer` | Límite de documentos. En `developer` suma todas las suscripciones vigentes (incluida una renovación en cola); en `client_quota` es la cuota asignada; en `client_shared`, la bolsa de la Casa de Software. |
| `consumed` | `integer` | Documentos consumidos. En `client_shared` es el consumo total de la Casa de Software. Ver [qué consume del plan](https://docs.matias-api.com/docs/endpoints/memberships-health#que-consume-del-plan). |
| `assigned_quotas` | `object` | Solo en `developer`. Listado paginado de las cuotas asignadas a clientes. |
| `daily_limit` | `object` | Solo en `developer` con plan **FREE**: `limit`, `consumed`, `remaining` y `next_reset` (inicio del día siguiente, ISO 8601). |

:::note Formato de la respuesta
Esta respuesta va envuelta en `data`, **sin** `dataRecords` y **sin** `success`.
:::

:::info 🆕 Qué consume del plan
Un documento consume del plan **una sola vez**: cuando la DIAN lo valida en la emisión (`response.IsValid: "true"`). Un evento RADIAN consume cuando la DIAN lo acepta.

**No** consumen:

- Los documentos rechazados o pendientes.
- El documento que la API devuelve como ya autorizado, con `ALREADY_AUTHORIZED_RECOVERED` en `warnings` (tras la [regla 90](https://docs.matias-api.com/docs/endpoints/invoices-pos#regla-90) o en el [reintento de un número ya transmitido](https://docs.matias-api.com/docs/endpoints/invoices-pos#reintento-transmitido)), porque ya estaba emitido.
- El documento que queda validado más tarde, al consultar su estado (`POST /status/document/{trackId}`) o en la revalidación automática.

Por eso `consumed` puede ser menor que el número de documentos que reporta [`GET /documents/consume`](https://docs.matias-api.com/docs/endpoints/queries-status#busqueda-listado): en sus agrupaciones `p_type` `1` a `4` ese reporte cuenta documentos validados por la DIAN, no consumo cobrado, así que incluye los recuperados y los validados tarde, que no se cobran. Ver [Documento recuperado: sin cobro de consumo](https://docs.matias-api.com/docs/endpoints/invoices-pos#recuperado-sin-consumo).
:::

**✅ Respuesta Exitosa — Cuenta principal (HTTP 200)**

```json
{
  "data": {
    "type": "developer",
    "plan_name": "PLAN CASA DE SOFTWARE",
    "is_unlimited": false,
    "valid_until": "2027-10-13",
    "limit": 10000,
    "consumed": 3254,
    "assigned_quotas": {
      "current_page": 1,
      "data": [
        {
          "id": 58,
          "uuid": "9b2f6d0e-3c1a-4f7e-8a51-2d6c0b9e4f13",
          "subscription_id": 311,
          "client_company_id": 1262,
          "assigned_documents": 500,
          "consumed_documents": 120,
          "start_date": "2026-10-14T05:00:00.000000Z",
          "end_date": "2027-10-13T05:00:00.000000Z",
          "created_at": "2026-10-14T20:15:03.000000Z",
          "updated_at": "2026-10-14T20:15:03.000000Z",
          "client": {
            "id": 1262,
            "company_name": "Cliente Ejemplo S.A.S"
          }
        }
      ],
      "first_page_url": "https://sandbox-api.matias-api.com/api/ubl2.1/memberships/summary?page=1",
      "from": 1,
      "last_page": 1,
      "last_page_url": "https://sandbox-api.matias-api.com/api/ubl2.1/memberships/summary?page=1",
      "links": [],
      "next_page_url": null,
      "path": "https://sandbox-api.matias-api.com/api/ubl2.1/memberships/summary",
      "per_page": 15,
      "prev_page_url": null,
      "to": 1,
      "total": 1
    }
  }
}
```

**✅ Respuesta Exitosa — Plan FREE (HTTP 200)**

```json
{
  "data": {
    "type": "developer",
    "plan_name": "FREE",
    "is_unlimited": false,
    "valid_until": "2027-10-13",
    "limit": 100,
    "consumed": 42,
    "assigned_quotas": {
      "current_page": 1,
      "data": [],
      "per_page": 15,
      "total": 0
    },
    "daily_limit": {
      "limit": 10,
      "consumed": 3,
      "remaining": 7,
      "next_reset": "2026-10-22T00:00:00-05:00"
    }
  }
}
```

**✅ Respuesta Exitosa — Sub-cuenta con cuota (HTTP 200)**

```json
{
  "data": {
    "type": "client_quota",
    "plan_name": "Cuota de CASA DE SOFTWARE EJEMPLO S.A.S",
    "is_unlimited": false,
    "valid_until": "2027-10-13",
    "limit": 500,
    "consumed": 120
  }
}
```

**✅ Respuesta Exitosa — Sub-cuenta sin cuota (HTTP 200)**

```json
{
  "data": {
    "type": "client_shared",
    "plan_name": "Plan PLAN CASA DE SOFTWARE (Compartido)",
    "is_unlimited": false,
    "valid_until": "2027-10-13",
    "limit": 10000,
    "consumed": 3254
  }
}
```

**❌ Sin membresía activa (HTTP 404)**

En una sub-cuenta, también aplica si la Casa de Software no tiene membresía activa.

```json
{
  "message": "No se encontró una membresía activa o legada para esta cuenta.",
  "data": null,
  "success": false
}
```

**❌ client_uuid no autorizado (HTTP 403)**

La empresa del `client_uuid` no es una sub-cuenta activa de quien llama.

```json
{
  "success": false,
  "message": "Acceso no autorizado. Acceso denegado: No tiene permisos para operar sobre esta empresa o la relación no está activa."
}
```

Si en lugar del UUID se envía el ID numérico de la empresa, la respuesta es `500` con el mensaje `Error interno del servidor. Debe enviar el UUID del cliente, no el ID.`.

**GET /memberships/recharges — Mis Recargas**

:::info 🆕 Nuevo
Desglose de la suscripción activa entre los documentos del plan y los documentos recargados, con su vencimiento.
:::

```http
GET {{url}}/memberships/recharges?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Muestra cuántos documentos del límite vienen del plan y cuántos de recargas, cuántos recargados quedan sin usar, cuándo vencen y el historial de recargas. Es de solo lectura y no incluye datos del pago (ni precio, ni monto, ni referencia).

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID de una sub-cuenta propia y activa. Se consulta la suscripción activa **propia** de esa empresa. |

**Campos de la respuesta:**

| Campo | Tipo | Descripción |
|---|---|---|
| `plan_documents` | `integer` | Tamaño del plan según el catálogo. Si el catálogo no lo define, es igual a `base_documents`. |
| `base_documents` | `integer` | Documentos del límite que no vienen de recargas del ciclo vigente. `base_documents` + `recharged_documents` = `total_documents`. |
| `recharged_documents` | `integer` | Documentos recargados en el ciclo vigente. |
| `total_documents` | `integer` | Límite de documentos de la suscripción activa. |
| `unused_recharged_documents` | `integer` | Recargados sin usar. Se consumen primero los documentos del plan, así que es el menor entre `recharged_documents` y lo que queda por consumir. |
| `end_date` | `string` | Vencimiento de la suscripción y de sus recargas (`YYYY-MM-DD`). |
| `remaining_days` | `integer` | Días calendario hasta el vencimiento; el día en curso cuenta. |
| `expiry_warning` | `boolean` | `true` solo si quedan menos de 30 días **y** hay documentos recargados sin usar. |
| `expiry_message` | `string` \| `null` | Texto del aviso cuando `expiry_warning` es `true`; `null` en otro caso. |
| `transferred_count` | `integer` | Cantidad de recargas `TRANSFERRED` incluidas en `recharges`. |
| `recharges` | `array` | Historial de recargas (ver abajo). |

**Elementos de `recharges`:**

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `integer` | Identificador de la recarga. |
| `date` | `string` | Fecha y hora de la recarga (`YYYY-MM-DD HH:mm:ss`). |
| `documents` | `integer` | Documentos recargados. En una `TRANSFERRED` es la cantidad que se recargó originalmente, no la que se trasladó: los documentos ya usados no pasan al plan nuevo. |
| `status` | `string` | `ACTIVE`: del ciclo vigente, suma al límite y vence con la suscripción. `TRANSFERRED`: de un plan anterior de la misma empresa; sus documentos sin usar pasaron al plan actual en un cambio de plan. |
| `transferred_at` | `string` \| `null` | Solo `TRANSFERRED`: fecha del traslado (`YYYY-MM-DD`). |
| `from_plan_name` | `string` \| `null` | Solo `TRANSFERRED`: nombre del plan de origen. |

:::tip Cómo leer las recargas
- Las recargas no tienen vencimiento propio: vencen con la suscripción (`end_date`).
- El orden es: primero las `ACTIVE` y después las `TRANSFERRED` (últimos 12 meses, máximo 50); en cada grupo, la más reciente primero.
- Las `TRANSFERRED` no suman en `recharged_documents` ni en `unused_recharged_documents`: sus documentos sin usar ya están dentro de `base_documents`.
- Para saber cuánto se recargó en el ciclo vigente, usa `recharged_documents` o suma solo los elementos `ACTIVE`. No sumes todos los `recharges[].documents`.
- Sin recargas, `recharges` llega vacío y los totales de recarga en `0`.
:::

**✅ Respuesta Exitosa (HTTP 200)**

```json
{
  "plan_documents": 8000,
  "base_documents": 8200,
  "recharged_documents": 300,
  "total_documents": 8500,
  "unused_recharged_documents": 300,
  "end_date": "2026-10-29",
  "remaining_days": 9,
  "expiry_warning": true,
  "expiry_message": "Tu plan vence en 9 días (2026-10-29). Los documentos recargados que no uses antes de esa fecha se pierden.",
  "transferred_count": 1,
  "recharges": [
    {
      "id": 12,
      "date": "2026-10-17 09:42:10",
      "documents": 300,
      "status": "ACTIVE",
      "transferred_at": null,
      "from_plan_name": null
    },
    {
      "id": 7,
      "date": "2025-06-03 15:10:44",
      "documents": 500,
      "status": "TRANSFERRED",
      "transferred_at": "2025-10-29",
      "from_plan_name": "PLAN BÁSICO"
    }
  ],
  "success": true
}
```

En el ejemplo, de los 500 documentos de la recarga `TRANSFERRED` quedaron 200 sin usar al cambiar de plan. Esos 200 pasaron al plan actual y están dentro de `base_documents` (8000 del plan + 200). La recarga sigue mostrando `documents: 500`.

**❌ Sin suscripción activa (HTTP 404)**

```json
{
  "success": false,
  "message": "No tienes una suscripción activa"
}
```

**❌ Otros errores**

| HTTP | Causa |
|---|---|
| `401` | Petición sin autenticar. |
| `403` | Usuario sin empresa, empresa inactiva o `client_uuid` de una empresa que no es sub-cuenta activa de quien llama. |
| `404` | `Empresa no encontrada.` |

### 🆕 Guía rápida: cuotas para clientes

Usa siempre el token de la Casa de Software (usuario Administrador o Desarrollador).

1. **Obtén el `client_uuid` del cliente:** es el `uuid` de cada cliente en [`GET /company/customers`](https://docs.matias-api.com/docs/endpoints/company#clientes-casa-software), el mismo que usa el resto de la API.
2. **Verifica la disponibilidad (opcional):** `GET /memberships/summary`, **sin** `client_uuid` (así ves la bolsa de la Casa de Software).
3. **Asigna la cuota:** `POST /memberships/quotas` con `client_uuid` en el body (o en la query) y los campos en `snake_case`.
4. **Para ajustarla**, vuelve a llamar al `POST` con el nuevo total: reemplaza la cuota anterior, no se suma.
5. **Para liberarla**, `DELETE /memberships/quotas/{client_uuid}`.

:::caution 🆕 Cambio del 2026-10-21: `client_uuid` reemplaza a `client_company_id`
Antes el cliente se identificaba con su `id` numérico (`client_company_id`) y enviar `client_uuid` hacía que la API tomara al cliente como quien actúa, con un error. Ahora:

- `client_uuid` es el identificador del cliente en el `POST` y en la ruta del `DELETE`.
- La Casa de Software es siempre la empresa del token: un `client_uuid` ya no la reemplaza.
- `client_company_id` en el `POST` (solo si no envías `client_uuid`) y el `id` numérico en la ruta del `DELETE` siguen funcionando, con la misma validación de pertenencia, pero están **obsoletos** y se retirarán. Migra a `client_uuid`.
- Pueden gestionar cuotas los usuarios **Administrador** y **Desarrollador** (antes, asignar era solo para Desarrollador).
:::

**POST /memberships/quotas — Asignar o Actualizar Cuota de un Cliente**

```http
POST {{url}}/memberships/quotas
Authorization: Bearer {token}
Content-Type: application/json
```

Permite a una Casa de Software reservar una parte de la bolsa de documentos de su plan para una empresa cliente. Un cliente con cuota consume de su cuota; un cliente sin cuota consume de la bolsa compartida de la Casa de Software.

Usa el token de la **Casa de Software** (usuario Administrador o Desarrollador). El cliente se identifica con `client_uuid`, en el body o en la query (`?client_uuid=...`); la Casa de Software que asigna es siempre la del token.

**Parámetros del Body** (JSON plano, en `snake_case`):

:::note Nombres de campos
Los campos van en **snake_case**. Nombres en otro formato (`clientUuid`, `startDate`, `endDate`, `folios`) no se reconocen: se ignoran y la API responde `422` por los campos requeridos que faltan.
:::

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | `string` (uuid) | ✅ Sí | 🆕 `uuid` del cliente (sub-cuenta) de la Casa de Software, tal como aparece en `GET /company/customers`. También se acepta en la query. |
| `client_company_id` | `integer` | ⚠️ Obsoleto | `id` numérico del cliente. Solo se usa si no envías `client_uuid`. Se retirará: usa `client_uuid`. |
| `assigned_documents` | `integer` | ✅ Sí | Documentos a reservar. Mínimo `0`. |
| `start_date` | `string` | ✅ Sí | Inicio de vigencia de la cuota (`YYYY-MM-DD`). |
| `end_date` | `string` | ✅ Sí | Fin de vigencia (`YYYY-MM-DD`). Debe ser igual o posterior a `start_date`. |

```json
{
  "client_uuid": "1f3a0b11-b698-11f1-a6c7-d843ae899220",
  "assigned_documents": 500,
  "start_date": "2026-10-14",
  "end_date": "2027-10-13"
}
```

**Reglas de negocio:**

- Es un **upsert**: si el cliente ya tiene cuota en la suscripción activa, la cuota se **reemplaza** con los nuevos valores; no se suma a la anterior.
- El `client_uuid` debe ser de un cliente de la Casa de Software del token. Un cliente de otra cuenta, o un uuid que no existe, responde `404 El cliente no existe.` También se acepta un cliente **deshabilitado**: su `uuid` aparece en `GET /company/customers?is_active=0`, porque el listado por defecto solo trae los activos.
- La Casa de Software debe tener una suscripción activa que no sea el plan FREE.
- En planes con bolsa finita, `assigned_documents` no puede superar lo disponible: el menor entre (bolsa − asignado a otros clientes con fechas que se solapan) y (bolsa − consumido).
- En planes ilimitados no se valida la bolsa: la cuota es opcional y funciona como límite de control para ese cliente.

**✅ Respuesta Exitosa (HTTP 201)**

```json
{
  "message": "Cuota asignada correctamente.",
  "quota": {
    "id": 58,
    "uuid": "9b2f6d0e-3c1a-4f7e-8a51-2d6c0b9e4f13",
    "subscription_id": 311,
    "client_company_id": 1262,
    "assigned_documents": 500,
    "start_date": "2026-10-14T05:00:00.000000Z",
    "end_date": "2027-10-13T05:00:00.000000Z",
    "created_at": "2026-10-14T20:15:03.000000Z",
    "updated_at": "2026-10-14T20:15:03.000000Z",
    "client_uuid": "1f3a0b11-b698-11f1-a6c7-d843ae899220"
  },
  "success": true
}
```

🆕 `quota.client_uuid` devuelve el `uuid` del cliente. `quota.client_company_id` es su `id` interno.

**❌ Documentos insuficientes (HTTP 409)**

```json
{
  "message": "No tiene suficientes documentos disponibles para asignar. Disponibles: 2800, Solicitados: 3000",
  "available_documents": 2800,
  "requested_documents": 3000,
  "total_documents": 10000,
  "consumed_documents": 7200,
  "already_assigned": 0,
  "success": false
}
```

La validación final de disponibilidad, que descuenta lo asignado a otros clientes, puede responder también con este formato:

```json
{
  "success": false,
  "message": "No tienes suficientes documentos disponibles para asignar. Disponibles: 2800 (Bolsa: 10000, Asignados: 2500, Consumidos: 7200)"
}
```

**❌ Error de validación (HTTP 422)**

```json
{
  "message": "La fecha de finalización es obligatoria.",
  "errors": {
    "end_date": ["La fecha de finalización es obligatoria."]
  }
}
```

Con el body en `camelCase` (por ejemplo `clientUuid`, `startDate`, `endDate`) faltan los cuatro campos y `errors` los lista todos. El `message` es el primer error seguido del total restante, que la API devuelve en inglés:

```json
{
  "message": "El UUID del cliente (client_uuid) es obligatorio. (and 3 more errors)",
  "errors": {
    "client_uuid": ["El UUID del cliente (client_uuid) es obligatorio."],
    "assigned_documents": ["El número de documentos asignados es obligatorio."],
    "start_date": ["La fecha de inicio es obligatoria."],
    "end_date": ["La fecha de finalización es obligatoria."]
  }
}
```

**❌ Otros errores**

| HTTP | Mensaje | Causa |
|---|---|---|
| `400` | `No tienes permisos para asignar cuotas a clientes.` | El usuario del token no es Administrador ni Desarrollador. |
| `402` | `El plan FREE no permite asignar cuotas a clientes. Actualice su plan para acceder a esta funcionalidad.` | La Casa de Software tiene plan FREE. |
| `402` | `El desarrollador no tiene una suscripción activa.` | No hay suscripción vigente. |
| `403` | `Usuario no asociado a ninguna empresa.` / `Acceso no autorizado. La empresa se encuentra inactiva.` | El usuario del token no tiene empresa, o la empresa del token está inactiva. |
| `404` | `El cliente no existe.` | 🆕 El `client_uuid` (o el `client_company_id` obsoleto) no es de un cliente de la Casa de Software del token, o no existe. |
| `422` | `El UUID del cliente (client_uuid) es obligatorio.` | Falta `client_uuid` (y tampoco se envió `client_company_id`), o el body no está en `snake_case`. |
| `422` | `La fecha de inicio es obligatoria.` / `La fecha de finalización debe ser igual o posterior a la fecha de inicio.` | Fechas ausentes o fuera de orden. |

Los controles se aplican en este orden: datos del body (`422`), tipo de usuario (`400`), empresa del token (`403`), cliente propio (`404`), plan FREE (`402`), disponibilidad (`409`) y suscripción activa (`402`).

**DELETE /memberships/quotas/{client_uuid} — Eliminar Cuota de un Cliente**

```http
DELETE {{url}}/memberships/quotas/{client_uuid}
Authorization: Bearer {token}
```

Elimina la cuota del cliente. Desde ese momento el cliente vuelve a consumir de la bolsa compartida de la Casa de Software, o de forma ilimitada si el plan es ilimitado. Usa el token de la Casa de Software (usuario Administrador o Desarrollador).

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | path | ✅ Sí | 🆕 `uuid` del cliente de la Casa de Software. Un valor numérico se toma como el `id` interno del cliente: es la forma **obsoleta**, que se retirará. |

| `consumption_mode` | Significado |
|---|---|
| `shared_pool` | El cliente consume de la bolsa compartida. |
| `unlimited` | El plan de la Casa de Software es ilimitado. |

**✅ Respuesta Exitosa (HTTP 200)**

```json
{
  "message": "Cuota eliminada correctamente. El cliente ahora consume de la bolsa general.",
  "data": {
    "client_uuid": "1f3a0b11-b698-11f1-a6c7-d843ae899220",
    "client_company_id": 1262,
    "consumption_mode": "shared_pool"
  },
  "success": true
}
```

Es **idempotente**: si el cliente no tenía cuota, la respuesta también es `200`, con el mensaje `El cliente no tenía cuota asignada. Ya consume de la bolsa general.` y el mismo `data`.

**❌ Errores**

| HTTP | Mensaje | Causa |
|---|---|---|
| `402` | `No tienes permisos para eliminar cuotas de clientes.` | El usuario del token no es Administrador ni Desarrollador. |
| `402` | `El desarrollador no tiene una suscripción activa.` | No hay suscripción vigente. |
| `403` | `Usuario no asociado a ninguna empresa.` / `Acceso no autorizado. La empresa se encuentra inactiva.` | El usuario del token no tiene empresa, o la empresa del token está inactiva. |
| `404` | `El cliente no existe.` | 🆕 El `client_uuid` no es de un cliente de la Casa de Software del token, o no existe. Un cliente deshabilitado sí se acepta. Antes, un cliente ajeno respondía `422`. |

---

## 💾 Almacenamiento y Correos del Plan

Consulta el uso de almacenamiento, de adjuntos y de correos frente a los límites del plan. Aceptan `client_uuid` para consultar una sub-cuenta propia; una sub-cuenta se mide contra el plan de su Casa de Software, pero solo cuenta su propio uso. En `storage` y `emails`, una Casa de Software (cuenta principal) ve el uso sumado de su cuenta y de sus sub-cuentas; `attachments` cuenta solo los adjuntos de la empresa consultada.

**GET /memberships/server-stats — Estadísticas Completas**

```http
GET {{url}}/memberships/server-stats?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Devuelve en una sola llamada los objetos `storage`, `attachments` y `emails`.

**Objeto `storage`:**

| Campo | Tipo | Descripción |
|---|---|---|
| `used_gb` | `number` | Almacenamiento usado (GB). |
| `limit_gb` | `number` | Límite del plan (GB). `0` significa sin límite. |
| `usage_percent` | `number` | Porcentaje de uso. |
| `files_count` | `integer` | Cantidad de archivos. |
| `plan_name` | `string` | Nombre del plan. |
| `is_unlimited` | `boolean` | `true` si el plan no limita el almacenamiento. |
| `status` | `string` | `unlimited`, `normal`, `warning` (desde 70 %), `critical` (desde 90 %) o `exceeded` (desde 100 %). Sin suscripción: `no_subscription`. |

**Objeto `attachments`** (adjuntos de los documentos):

| Campo | Tipo | Descripción |
|---|---|---|
| `used_gb` | `number` | Espacio usado por adjuntos (GB). |
| `used_bytes` | `integer` | Espacio usado por adjuntos (bytes). |
| `files_count` | `integer` | Cantidad de adjuntos. |
| `limit_gb` | `number` \| `null` | Límite de adjuntos (GB). `null` en el plan de Arrendamiento, donde los adjuntos comparten la cuota de `storage`. |
| `usage_percent` | `number` | Porcentaje de uso. |
| `is_shared` | `boolean` | `true` si los adjuntos comparten cuota con `storage`. |
| `plan_name` | `string` | Nombre del plan (`SIN SUSCRIPCIÓN` si no hay). |
| `status` | `string` | `shared_with_custody`, `unlimited`, `normal`, `warning`, `critical`, `exceeded` o `no_subscription`. |

**Objeto `emails`** (correos del periodo de la suscripción activa):

| Campo | Tipo | Descripción |
|---|---|---|
| `used` | `integer` | Correos enviados en el periodo. |
| `limit` | `integer` | Correos incluidos en el plan. `0` significa sin límite. |
| `remaining` | `integer` | Correos restantes. `-1` significa ilimitado. |
| `usage_percent` | `number` | Porcentaje de uso. |
| `plan_name` | `string` | Nombre del plan. |
| `status` | `string` | `unlimited`, `normal`, `critical` (desde 90 %) o `exceeded` (desde 100 %). Sin suscripción: `no_subscription`. |

Si un objeto no se puede calcular, llega como `{"error": "mensaje"}` sin afectar a los demás.

**✅ Respuesta Exitosa (HTTP 200)**

```json
{
  "message": "Estadísticas completas obtenidas con éxito",
  "data": {
    "storage": {
      "used_gb": 3.42,
      "limit_gb": 50,
      "usage_percent": 6.84,
      "files_count": 18250,
      "plan_name": "PLAN CASA DE SOFTWARE",
      "is_unlimited": false,
      "status": "normal"
    },
    "attachments": {
      "used_gb": 0.2154,
      "used_bytes": 231289856,
      "files_count": 412,
      "limit_gb": 50,
      "usage_percent": 0.43,
      "is_shared": false,
      "plan_name": "PLAN CASA DE SOFTWARE",
      "status": "normal"
    },
    "emails": {
      "used": 8420,
      "limit": 20000,
      "remaining": 11580,
      "usage_percent": 42.1,
      "plan_name": "PLAN CASA DE SOFTWARE",
      "status": "normal"
    }
  },
  "success": true
}
```

**GET /memberships/server-stats/storage — Almacenamiento**

```http
GET {{url}}/memberships/server-stats/storage?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Devuelve los campos del objeto `storage` en el primer nivel de `data`, más el objeto `attachments`.

**✅ Respuesta Exitosa (HTTP 200)**

```json
{
  "message": "Estadísticas de almacenamiento obtenidas con éxito",
  "data": {
    "used_gb": 3.42,
    "limit_gb": 50,
    "usage_percent": 6.84,
    "files_count": 18250,
    "plan_name": "PLAN CASA DE SOFTWARE",
    "is_unlimited": false,
    "status": "normal",
    "attachments": {
      "used_gb": 0.2154,
      "used_bytes": 231289856,
      "files_count": 412,
      "limit_gb": 50,
      "usage_percent": 0.43,
      "is_shared": false,
      "plan_name": "PLAN CASA DE SOFTWARE",
      "status": "normal"
    }
  },
  "success": true
}
```

**GET /memberships/server-stats/emails — Correos**

```http
GET {{url}}/memberships/server-stats/emails?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Devuelve los campos del objeto `emails` en `data`.

**✅ Respuesta Exitosa (HTTP 200)**

```json
{
  "message": "Estadísticas de emails obtenidas con éxito",
  "data": {
    "used": 8420,
    "limit": 20000,
    "remaining": 11580,
    "usage_percent": 42.1,
    "plan_name": "PLAN CASA DE SOFTWARE",
    "status": "normal"
  },
  "success": true
}
```

**GET /memberships/server-stats/emails/resend-count/{documentId} — Reenvíos de un Documento**

```http
GET {{url}}/memberships/server-stats/emails/resend-count/{documentId}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Indica cuántas veces se ha enviado por correo un documento y cuántos reenvíos le quedan según el plan.

**Parámetros:**

| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `documentId` | path | ✅ Sí | ID del documento. |
| `client_uuid` | query | No | UUID de una sub-cuenta propia y activa. |

| Campo | Tipo | Descripción |
|---|---|---|
| `current_count` | `integer` | Envíos registrados del documento. |
| `max_allowed` | `integer` | Reenvíos permitidos por el plan. `0` significa ilimitado. |
| `remaining` | `integer` | Reenvíos restantes. `-1` significa ilimitado. |

**✅ Respuesta Exitosa (HTTP 200)**

```json
{
  "message": "Estadísticas de reenvío obtenidas con éxito",
  "data": {
    "current_count": 2,
    "max_allowed": 5,
    "remaining": 3
  },
  "success": true
}
```

---

<!-- Fuente: https://docs.matias-api.com/docs/endpoints/dian-resolutions -->

# 📄 Resoluciones DIAN

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

## 📋 Consulta y Sincronización

**GET /resolutions — Listar Resoluciones**

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

**✅ Respuesta Exitosa (HTTP 200)**

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

**GET /resolutions/{id} — Obtener Resolución por ID**

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

**✅ Respuesta Exitosa (HTTP 200)**

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

**❌ Resolución no encontrada (HTTP 404)**

```json
{
  "message": "No se encontró la resolución con ID: 813 para la empresa con ID: 1262.",
  "success": false
}
```

**GET /numbering-range — Sincronizar Resoluciones con DIAN**

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

**✅ Respuesta Exitosa (HTTP 200)**

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

---

## ⚙️ Configuración Manual

**POST /resolutions — Crear Resolución Manual**

```http
POST {{url}}/resolutions?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Crea manualmente una resolución de facturación en la plataforma.

:::info 💡 Guía para Desarrolladores — Formato del Payload `records`
Este endpoint recibe los datos encapsulados dentro de la propiedad **`records`** como una cadena JSON serializada (`stringified JSON`).
:::

**JavaScript / Node.js**

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

**PHP (cURL)**

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

**Python**

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

**C# / .NET**

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

**Postman**

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

**✅ Respuesta Exitosa (HTTP 200)**

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

**❌ Error de Validación (HTTP 422)**

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

**❌ Resolución Duplicada (HTTP 400)**

Ya existe en la empresa una resolución con el mismo tipo de documento, número y prefijo. La comprobación incluye las resoluciones inactivas, también las eliminadas con `DELETE` (el borrado es lógico). Para volver a usar una de ellas, búscala con `GET /resolutions?active=0` y reactívala con `PUT /resolutions/{id}` enviando `active` `1`. El mensaje incluye un salto de línea y espacios entre `y` y `prefijo`:

```json
{
  "message": "Ya existe una resolución con el mismo número(18763005880468) y\n                prefijo(FV). Por favor verifique",
  "success": false
}
```

**PUT /resolutions/{id} — Actualizar Resolución**

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

**✅ Respuesta Exitosa (HTTP 200)**

```json
{
  "success": true
}
```

**❌ Errores**

| Status | Mensaje | Causa |
|:---:|---|---|
| `422` | `El campo records es requerido` · `El campo records debe ser un JSON válido` | Falta `records` o no es texto JSON. |
| `422` | `Validación fallida` | `invoice_name` o `resolution_number` vienen vacíos o exceden su longitud (120 y 20), o `prefix` excede 20 caracteres. Trae `errors` por campo y `success: false`. |
| `500` | `Server Error` | Falta alguno de los campos que deben venir siempre, o el `{id}` no existe. |

**DELETE /resolutions/{id} — Eliminar Resolución**

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

**✅ Respuesta Exitosa (HTTP 200)**

```json
{
  "success": true
}
```

**❌ Resolución no encontrada (HTTP 404)**

```json
{
  "message": "No se encontró la resolución con ID: 813 para la empresa: EMPRESA EJEMPLO S.A.S.",
  "success": false
}
```

---

<!-- Fuente: https://docs.matias-api.com/docs/endpoints/dian-software -->

# 💻 Software DIAN

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

## 📋 Consulta de Software DIAN

**GET /software — Listar Software DIAN**

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

**✅ Respuesta Exitosa (HTTP 200)**

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

**GET /software/{id} — Obtener Software DIAN por ID**

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

**✅ Respuesta Exitosa (HTTP 200)**

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

**❌ Software no encontrado (HTTP 404)**

```json
{
  "success": false,
  "message": "No se encontró el software para la compañía especificada."
}
```

**GET /software/test/{id} — Listado de Set de Pruebas DIAN**

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

**✅ Respuesta Exitosa (HTTP 200)**

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

---

## ⚙️ Registro y Mantenimiento

**POST /software — Registrar Software DIAN**

```http
POST {{url}}/software?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Registra un nuevo software ante la plataforma para operar con la DIAN en ambiente de pruebas o producción.

:::info 💡 Guía para Desarrolladores — Formato del Payload `records`
Este endpoint recibe los datos encapsulados dentro de la propiedad **`records`** como una cadena JSON serializada (`stringified JSON`).
:::

**JavaScript / Node.js**

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

**PHP (cURL)**

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

**Python**

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

**C# / .NET**

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

**Postman**

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

**✅ Respuesta Exitosa (HTTP 200)**

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

**❌ Errores**

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

**PUT /software/{id} — Actualizar Software DIAN**

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

**✅ Respuesta Exitosa (HTTP 200)**

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

**❌ Errores**

| Status | Mensaje | Causa |
|:---:|---|---|
| `422` | `El campo records es requerido` · `El campo records debe ser un JSON válido` | Falta `records` o no es texto JSON. |
| `404` | `No se encontró el software para la compañía especificada.` | El `{id}` no existe o no pertenece a la empresa. |

**DELETE /software/{id} — Eliminar Software DIAN**

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

**✅ Respuesta Exitosa (HTTP 200)**

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

**❌ Errores**

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

---

## 🧪 Habilitación y Pruebas DIAN

**POST /document/run-test — Iniciar Habilitación**

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

**✅ Respuesta Exitosa (HTTP 200)**

```json
{
  "message": "Se ha iniciado el proceso de habilitación de documentos electrónicos.",
  "process_id": 54,
  "success": true
}
```

El proceso corre en segundo plano. Consulta su avance con `GET /software/test/{id}` usando el `id` del software.

**❌ Errores**

| Status | Mensaje | Causa |
|:---:|---|---|
| `404` | `No se encontró el software especificado.` | El `software_id` no existe o no es de la empresa. |
| `500` | `Error interno del servidor. Ya existe un proceso en ejecución para este software. Por favor espere a que finalice.` | El último proceso del software no ha terminado (no está en `FINISHED` ni en `ERROR`). |
| `500` | `Error interno del servidor. El software no tiene un testsetid DIAN configurado. Por favor configure uno antes de ejecutar el SET DE PRUEBAS.` | El software no tiene `testsetid`. |

---

<!-- Fuente: https://docs.matias-api.com/docs/endpoints/digital-certificate -->

# 🔐 Certificado de Firma Digital

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

## 🔐 Gestión del Certificado

**GET /certificate — Obtener Certificado Activo**

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

**✅ Respuesta Exitosa (HTTP 200)**

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

**POST /certificate — Cargar Certificado Digital**

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

**JavaScript / Node.js**

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

**PHP (cURL)**

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

**Python**

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

**C# / .NET**

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

**Postman**

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

**✅ Respuesta Exitosa (HTTP 200)**

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

**❌ Errores**

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

**PUT /certificate/{id} — Actualizar / Renovar Certificado**

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

**✅ Respuesta Exitosa (HTTP 200)**

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

**❌ Errores**

| HTTP | Mensaje | Causa |
|---|---|---|
| `422` | `El campo records es requerido` / `El campo records debe ser un JSON válido` | Falta `records` o su valor no es un JSON válido. |
| `400` | `The given data was invalid.` / `The certificate could not be read. ...` | El contenido no es Base64 válido, el archivo no es un `.p12` válido o la contraseña es incorrecta. |
| `500` | `Error interno del servidor. No existe un certificado para esta empresa.` | La empresa aún no tiene certificado. Usa `POST /certificate`. |
| `500` | `Error interno del servidor. El contenido del certificado es requerido.` | Falta la propiedad `data` en `records`. |
| `500` | `Error interno del servidor. El certificado es requerido.` | `data` se envió sin el prefijo Data URI. |

**GET /certificate/expiration/{dni} — Validar Expiración del Certificado**

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

**✅ Respuesta Exitosa (HTTP 200)**

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

---

<!-- Fuente: https://docs.matias-api.com/docs/endpoints/autoincrement -->

# 🚀 API de Autoincremento

:::warning Autenticación Requerida
Incluir en todos los endpoints: `Authorization: Bearer {token}`
:::

:::info Parámetro Multi-Tenant: `client_uuid`
Todos los endpoints aceptan `?client_uuid={{client_uuid}}` para operar en nombre de empresas cliente.

```http
GET {{url}}/company/customers
Authorization: Bearer {token}
```

:::

Esta API delega a la plataforma el manejo del consecutivo y prefijo de los documentos, evitando colisiones en envíos concurrentes.

:::note ¿Cómo funciona el autoincremento?
Cuando envías una petición, la plataforma **reserva atómicamente** el siguiente número consecutivo disponible en la resolución DIAN indicada antes de procesar el documento. Así dos peticiones simultáneas nunca reciben el mismo número.

**El body del payload es idéntico** al de los endpoints estándar (ej. `POST /invoice`), con una diferencia: **no envíes** `document_number`, que se asigna automáticamente.
:::

#### Requisitos del body

| Campo | ¿Se envía? | Descripción |
|---|---|---|
| `resolution_number` | ✅ Sí | Junto con `prefix` identifica la resolución. Debe ser una resolución de la empresa, activa y vigente hoy (entre su fecha inicial y su fecha final). |
| `prefix` | ✅ Sí | Prefijo de esa resolución. Omítelo solo si la resolución no tiene prefijo. |
| `document_number` | ❌ No | Si lo envías, la petición se rechaza con HTTP `422`. |
| `uuid` | Opcional | Identificador del documento de tu lado (se recomienda un UUID). Evita que un reintento consuma otro consecutivo. Ver [UUID ya usado](https://docs.matias-api.com/docs/endpoints/autoincrement#uuid-ya-usado). |

:::caution La numeración puede tener huecos
Si la emisión falla **antes** de transmitir a la DIAN, la reserva se libera, pero el número solo se reutiliza si seguía siendo el último reservado de la resolución. Si la emisión falla **después** de iniciar la transmisión, el número se conserva para ese documento: consulta su estado y corrígelo con el `PATCH` de [Reenvío y Reintentos](https://docs.matias-api.com/docs/endpoints/autoincrement#reenvio) en lugar de enviar un `POST` nuevo.
:::

**❌ Errores propios del autoincremento**

**HTTP 422** — se envió `document_number`:

```json
{
  "success": false,
  "message": "Para la generación automática, no debe enviar el campo document_number."
}
```

**HTTP 404** — no hay una resolución activa y vigente con ese `resolution_number` y `prefix`:

```json
{
  "success": false,
  "message": "No se encontró una resolución de facturación activa para los datos proporcionados."
}
```

**HTTP 409** — el siguiente número supera el rango autorizado de la resolución (`Se ha alcanzado el número máximo para la resolución ...`). Solicita una nueva resolución a la DIAN.

Además aplican los errores y advertencias comunes de la emisión (`409 DOCUMENT_IN_TRANSMISSION`, `409 DOCUMENT_IN_VALIDATION`, `503 DIAN_STATUS_UNAVAILABLE`, `DOCUMENT_POSSIBLY_SENT`, `warnings`). Ver [Respuestas, advertencias y errores de emisión](https://docs.matias-api.com/docs/endpoints/invoices-pos#respuestas-emision).

#### UUID ya usado

Si envías un `uuid` que ya está registrado para tu empresa, **no se emite un documento nuevo** (cada `POST` consumiría otro consecutivo) y la respuesta es HTTP `400`. El `message` depende del estado del envío original:

| Estado del envío original | `message` |
|---|---|
| Validado por la DIAN | `El documento {número} con el UUID proporcionado ya fue validado por la DIAN. No lo reenvíe: cada llamada a este endpoint genera un nuevo consecutivo.` |
| Sin respuesta definitiva de la DIAN | `El UUID proporcionado corresponde al documento {número}, que aún no tiene una respuesta definitiva de la DIAN. No lo reenvíe: consulte su estado con el uuid del envío.` |
| Procesado y no validado | `El UUID proporcionado ya fue procesado como el documento {número} y no se encuentra validado. Para corregirlo sin consumir un nuevo consecutivo use PATCH /api/ubl2.1/auto-increment/{tipo}/{uuid del envío}.` |
| Sin envío asociado | `El UUID proporcionado ya fue utilizado en un envío anterior. No lo reenvíe por este endpoint: cada llamada genera un nuevo consecutivo.` |

**❌ HTTP 400 — UUID ya procesado y no validado**

```json
{
  "message": "El UUID proporcionado ya fue procesado como el documento F1001 y no se encuentra validado. Para corregirlo sin consumir un nuevo consecutivo use PATCH /api/ubl2.1/auto-increment/invoices/0b96bb6e-7dd0-11f0-ba9f-f02f74cac485.",
  "data": {
    "shipping_history_uuid": "0b96bb6e-7dd0-11f0-ba9f-f02f74cac485",
    "document_uuid": "3d6f1a8e-2b4c-4f7d-9e0a-6c1b5d8f2a47",
    "company_id": 1,
    "document_number": "F1001",
    "is_valid": false,
    "XmlDocumentKey": "6142be764d365c08872933a58c67177b000764e24e4108b67e5aa0872d709ad52a23c7543ffcad42bdec5e9e726d7644"
  },
  "success": false
}
```

`data.shipping_history_uuid` es el `uuid` del envío que debes usar en el `PATCH`; `data.document_uuid` es el `uuid` que enviaste. `data` puede incluir otros campos del registro.

---

## 📤 Emisión Autoincremental

**POST /auto-increment/invoices — Factura Autoincremental**

```http
POST {{url}}/auto-increment/invoices?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

Emite una factura tomando automáticamente el siguiente número consecutivo disponible.

**cURL**

```bash
curl -X POST "{{url}}/auto-increment/invoices" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{ ... }'
```

**JavaScript (Axios)**

```js
const response = await axios.post(`${url}/auto-increment/invoices`, payload, {
  headers: { Authorization: `Bearer ${token}` }
});
const uuid = response.data.uuid;
const cufe = response.data.XmlDocumentKey;
```

**PHP (Guzzle)**

```php
$response = $client->post("{$url}/auto-increment/invoices", [
    'headers' => ['Authorization' => "Bearer {$token}"],
    'json'    => $payload,
]);
```

**✅ Respuesta Exitosa — DIAN 200 OK**

```json
{
  "uuid": "0b96bb6e-7dd0-11f0-ba9f-f02f74cac485",
  "message": "Solicitud procesada por la DIAN.",
  "send_to_queue": 0,
  "XmlDocumentKey": "6142be764d365c08872933a58c67177b000764e24e4108b67e5aa0872d709ad52a23c7543ffcad42bdec5e9e726d7644",
  "response": {
    "ErrorMessage": {},
    "IsValid": "true",
    "StatusCode": "00",
    "StatusDescription": "Procesado Correctamente.",
    "StatusMessage": "La Factura Electrónica F1001, ha sido autorizada."
  },
  "XmlBase64Bytes": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4...",
  "AttachedDocument": {
    "pathZip": null,
    "path": "1/ad/ad09010914030002500001001.xml",
    "url": "https://sandbox-api.matias-api.com/attachments/1/ad/ad09010914030002500001001.xml",
    "data": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4..."
  },
  "qr": {
    "qrDian": "https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=6142be76...",
    "url": "https://sandbox-api.matias-api.com/qr/1/QR-0b96bb6e-7dd0-11f0-ba9f-f02f74cac485.png",
    "path": "1/QR-0b96bb6e-7dd0-11f0-ba9f-f02f74cac485.png",
    "data": "iVBORw0KGgoAAAANSUhEUgAA..."
  },
  "pdf": null,
  "warnings": [],
  "success": true
}
```

Guarda el `uuid` de la respuesta: identifica el envío y es el que usas en el `PATCH` de reenvío. La respuesta, el rechazo DIAN (HTTP `200` con `IsValid: "false"`), la forma en habilitación y los `warnings` son los mismos de `POST /invoice`. Ver [Respuestas, advertencias y errores de emisión](https://docs.matias-api.com/docs/endpoints/invoices-pos#respuestas-emision).

**POST /auto-increment/credit-notes · /debit-notes — Notas Autoincrementales**

```http
POST {{url}}/auto-increment/credit-notes?client_uuid={{client_uuid}}
POST {{url}}/auto-increment/debit-notes?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

Notas de crédito y débito con numeración automática asignada.

**POST /auto-increment/support-documents — Documento Soporte Autoincremental**

```http
POST {{url}}/auto-increment/support-documents?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

Cubre tanto residentes como no residentes (se define en el payload).

**POST /auto-increment/pos-documents — Documento POS Autoincremental**

```http
POST {{url}}/auto-increment/pos-documents?client_uuid={{client_uuid}}
POST {{url}}/auto-increment/debit-notes?client_uuid={{client_uuid}}
POST {{url}}/auto-increment/credit-notes?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

Para Notas POS usa la misma ruta general, enviando el `type_document_id` adecuado en el JSON.

**POST /auto-increment/adjustment-notes — Nota de Ajuste Autoincremental**

```http
POST {{url}}/auto-increment/adjustment-notes?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

Nota de ajuste a Documento Soporte con numeración automática.

---

## 🔄 Reenvío y Reintentos

**PATCH /auto-increment/invoices/{uuid} — Reenvío de Factura**

```http
PATCH {{url}}/auto-increment/invoices/{uuid}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

Reintenta la emisión de una factura autoincremental que no quedó validada (por ejemplo, rechazada por la DIAN), con el JSON corregido en el body. **Reutiliza el número, la resolución, el prefijo y el consecutivo originales**: no consume un número nuevo.

| Parámetro | Ubicación | Requerido | Descripción |
|-----------|-----------|-----------|-------------|
| `uuid` | path | ✅ Sí | `uuid` del **envío** (el que devolvió la emisión original). Debe pertenecer a la empresa del token (o a la indicada en `client_uuid`). |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

**❌ Errores del reenvío**

**HTTP 404** — el `uuid` no corresponde a un envío de la empresa:

```json
{
  "success": false,
  "message": "No se encontró ningún envío con el UUID proporcionado."
}
```

**HTTP 400** — el documento ya está validado ante la DIAN: `El documento (...) con numero ... ya se encuentra validado.` No lo reenvíes.

Además aplican `409 DOCUMENT_IN_TRANSMISSION`, `409 DOCUMENT_IN_VALIDATION`, `503 DIAN_STATUS_UNAVAILABLE` y `DOCUMENT_POSSIBLY_SENT`. Ver [Códigos de error de emisión](https://docs.matias-api.com/docs/endpoints/invoices-pos#errores-emision).

Estas reglas aplican a todos los endpoints `PATCH /auto-increment/...` de esta sección.

**PATCH /auto-increment/credit-notes/{uuid} · /debit-notes/{uuid} — Reenvío de Notas Crédito y Débito**

```http
PATCH {{url}}/auto-increment/credit-notes/{uuid}?client_uuid={{client_uuid}}
PATCH {{url}}/auto-increment/debit-notes/{uuid}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

Reenvía una nota crédito o débito autoincremental no validada, conservando su número original.

| Parámetro | Ubicación | Requerido | Descripción |
|-----------|-----------|-----------|-------------|
| `uuid` | path | ✅ Sí | `uuid` del envío de la nota a reenviar. |

**PATCH /auto-increment/adjustment-notes/{uuid} — Reenvío de Nota de Ajuste**

```http
PATCH {{url}}/auto-increment/adjustment-notes/{uuid}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

Reenvía una nota de ajuste a Documento Soporte autoincremental no validada, conservando su número original.

| Parámetro | Ubicación | Requerido | Descripción |
|-----------|-----------|-----------|-------------|
| `uuid` | path | ✅ Sí | `uuid` del envío de la nota de ajuste a reenviar. |

**PATCH /auto-increment/support-documents/{uuid} — Reenvío de Documento Soporte**

```http
PATCH {{url}}/auto-increment/support-documents/{uuid}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

| Parámetro | Ubicación | Requerido | Descripción |
|-----------|-----------|-----------|-------------|
| `uuid` | path | ✅ Sí | `uuid` del envío del documento soporte a reenviar. |

**PATCH /auto-increment/pos-documents/{uuid} — Reenvío de Documento POS**

```http
PATCH {{url}}/auto-increment/pos-documents/{uuid}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

| Parámetro | Ubicación | Requerido | Descripción |
|-----------|-----------|-----------|-------------|
| `uuid` | path | ✅ Sí | `uuid` del envío del documento POS a reenviar. |

**POST /documents/{uuid}/resend — Reenviar un documento**

```http
POST {{url}}/documents/{uuid}/resend?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

Reenvía **un** documento de la empresa, identificado por el `uuid` del envío (no es un reenvío en lote). No lleva body: la API reconstruye el documento a partir de su historial, con el **mismo número, resolución y prefijo**, y fuerza `send_email: 1` y `graphic_representation: 1`.

El reenvío pasa por el mismo flujo de emisión que `POST /invoice`, con su misma respuesta y sus `warnings`. Ver [Respuestas, advertencias y errores de emisión](https://docs.matias-api.com/docs/endpoints/invoices-pos#respuestas-emision).

| Parámetro | Ubicación | Requerido | Descripción |
|-----------|-----------|-----------|-------------|
| `uuid` | path | ✅ Sí | `uuid` del **envío** (el que devolvió la emisión). Debe pertenecer a la empresa del token (o a la indicada en `client_uuid`). |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

:::warning Un reenvío transmitido genera un CUFE/CUDE nuevo
El documento reconstruido no conserva la fecha y la hora originales. Si el reenvío llega a transmitirse a la DIAN, el documento tiene un CUFE/CUDE distinto al del intento anterior.
:::

:::caution Datos que el reenvío reconstruye y excluye
El documento reconstruido **sí conserva** los consorciados (`shareholders`). En cambio, no incluye el bloque `health` del sector salud ni los datos adicionales (`additional_data`, `customer.extra_data` y `lines[].extra_data`). Si el documento lleva estos últimos, no uses este endpoint: envía de nuevo el JSON completo con el mismo número o, en numeración automática, corrígelo con `PATCH /auto-increment/*/{uuid}`.
:::

**❌ Errores del reenvío**

**HTTP 404** — el `uuid` no corresponde a un envío de la empresa:

```json
{
  "success": false,
  "message": "No se encontró el envío con UUID: 0b96bb6e-7dd0-11f0-ba9f-f02f74cac485"
}
```

**HTTP 400** — el documento ya está validado ante la DIAN: `El documento (...) con numero ... ya se encuentra validado.` No lo reenvíes.

**HTTP 400** — el envío está en cola de procesamiento: `El documento (...) con numero ... se encuentra en cola de procesamiento.`

Además aplican `409 DOCUMENT_IN_TRANSMISSION` y, en producción, la [consulta previa a la DIAN del intento anterior](https://docs.matias-api.com/docs/endpoints/invoices-pos#reintento-transmitido) (HTTP `200` con `ALREADY_AUTHORIZED_RECOVERED`, `409 DOCUMENT_IN_VALIDATION` o `503 DIAN_STATUS_UNAVAILABLE`), la [regla 90](https://docs.matias-api.com/docs/endpoints/invoices-pos#regla-90) y `DOCUMENT_POSSIBLY_SENT`. Ver [Códigos de error de emisión](https://docs.matias-api.com/docs/endpoints/invoices-pos#errores-emision).

---

<!-- Fuente: https://docs.matias-api.com/docs/response-json -->

# 📬 Respuestas de la API

:::info 📖 Guía Completa de Respuestas JSON
Todas las respuestas que emite la API están estructuradas en formato JSON estandarizado, proporcionando información detallada sobre el estado de la solicitud, documentos generados y las validaciones emitidas por la DIAN.
:::

✅

**HTTP 200/201**  

Procesamiento exitoso

⏳

**StatusCode 98**  

En proceso / Reintente

❌

**HTTP 4xx/5xx**  

Errores y Rechazos

🔄

**Contingencia**  

Timeouts y posible envío

---

## 🚀 Quick Reference

| Código | Tipo | Descripción | Acción Recomendada |
|---|---|---|---|
| **200** | 200 OK | Solicitud procesada. En la emisión, la DIAN pudo **aceptar o rechazar** el documento: revisa `response.IsValid` | `IsValid: "true"` → almacenar archivos. `IsValid: "false"` → corregir según `response.ErrorMessage` |
| **201** | 201 Created | Recurso creado o lote aceptado (p. ej. `POST /bulk/documents`, creación de tokens o webhooks). La emisión unitaria **no** responde 201 | Guardar el identificador devuelto (p. ej. `batch_id`) |
| **202** | 202 Accepted | Solicitud aceptada para procesarse en segundo plano (p. ej. `POST /events/mailbox/{id}/retry`) | Consultar el estado más tarde |
| **400** | 400 Bad Request | Regla de negocio incumplida (documento ya validado, en cola, `send_to_queue=1`, etc.) | Leer `message` y corregir la petición |
| **401** | 401 Unauthorized | Sin autorización (falta el token o expiró) | Renovar el token de acceso en la cabecera |
| **402** | 402 Payment Required | Saldo insuficiente de folios o cuenta inactiva | Ampliar paquete o renovar suscripción |
| **403** | 403 Forbidden | Sin `error_code`: acción no autorizada (p. ej. un `client_uuid` que no es de tu cuenta). Con `error_code: "RECEPTION_NOT_IN_PLAN"`: el plan no incluye la recepción de facturas ni los eventos RADIAN | Sin `error_code`: verificar permisos y `client_uuid`. Con `RECEPTION_NOT_IN_PLAN`: actualizar o renovar el plan (solo planes de pago vigentes) |
| **404** | 404 Not Found | Recurso o endpoint no encontrado | Verificar identificador y endpoint |
| **409** | 409 Conflict | La operación choca con otra en curso o con el estado del recurso (ver [409](https://docs.matias-api.com/docs/response-json#errores-409)) | Leer `code` / `error_code`; consultar el estado antes de reintentar |
| **422** | 422 Unprocessable | Validación del JSON enviado (campos faltantes o con formato inválido). **No** es un rechazo de la DIAN | Revisar el objeto `errors` |
| **429** | 429 Too Many Requests | Límite de peticiones superado. Todas las rutas del API (incluido el registro público `POST /register`) tienen un límite general, por defecto de **90 solicitudes por minuto**, contadas por usuario autenticado o, sin token, por IP. Algunas rutas tienen además límites propios más estrictos (creación de tokens, envíos masivos), que pueden responder con su propio mensaje. El límite general responde solo `{"message": "Too Many Attempts."}`, sin `success` | Esperar los segundos del header `Retry-After` y reintentar con backoff |
| **500** | 500 Server Error | Error interno. Normalmente trae `reference`. En emisión puede traer `code: "DOCUMENT_POSSIBLY_SENT"` | Con `DOCUMENT_POSSIBLY_SENT`: **no retransmitir**, consultar el estado. Si no, reportar a soporte con `reference` |
| **503** | 503 Unavailable | `code: "DIAN_STATUS_UNAVAILABLE"`: no se pudo confirmar en la DIAN el envío anterior de ese número y **no se transmitió** | Reintentar en unos minutos |
| **504** | 504 Timeout | Tu cliente o una puerta de enlace cortó la conexión antes de recibir la respuesta | **No retransmitir**: consultar el estado con `GET /status` |

:::note La emisión unitaria no responde 201
La emisión es síncrona: responde **HTTP 200** con el resultado de la DIAN. El envío a cola (`send_to_queue: 1`) aún no está habilitado y responde **HTTP 400** `El envío a cola de procesamiento aún no está habilitado.`
:::

---

## 🎯 Guía Rápida de Interpretación

:::tip Flujo de Diagnóstico en 4 Pasos
1. **Paso 1: Código HTTP**
   - `HTTP 200/201` ➔ ✅ La API procesó la solicitud (en la emisión, la DIAN pudo aceptar **o rechazar** el documento)
   - `HTTP 400–429` ➔ ⚠️ Error en la petición, en los datos o conflicto con otra operación
   - `HTTP 5xx` ➔ ❌ Error del servidor o de la comunicación con la DIAN (revisa `code` y `reference`)
2. **Paso 2: Propiedad `success`**
   - `success: true` ➔ ✅ Operación completada
   - `success: false` ➔ ❌ Fallo en validación, datos o procesamiento
3. **Paso 3: `response.IsValid` y `StatusCode` DIAN**
   - `IsValid: "true"` y `StatusCode: "00"` ➔ ✅ Autorizado por la DIAN
   - `IsValid: "false"` ➔ ❌ Rechazado por la DIAN (detalle en `response.ErrorMessage`)
   - `StatusCode: "98"` ➔ ⏳ En procesamiento en la DIAN
4. **Paso 4: `warnings`**
   - Arreglo vacío ➔ sin avisos
   - Con elementos ➔ el documento quedó procesado, pero algo posterior falló o se concilió (ver [Avisos](https://docs.matias-api.com/docs/response-json#warnings))
:::

---

## 🧱 Formato de los Errores

:::tip Envía siempre `Accept: application/json`
Sin esa cabecera, un error de validación (422) responde con una redirección (302) y un token inválido o ausente redirige (302) a la página de inicio de sesión en lugar de responder 401.
:::

Según el origen del error, el cuerpo tiene una de estas formas:

| Origen | HTTP | Cuerpo |
|---|---|---|
| Validación del JSON enviado | 422 | `message` y `errors` (un objeto con un arreglo de mensajes por cada campo). No incluye `success`. Algunas consultas (p. ej. `GET /documents/consume`) responden además `success: false`, con `message` `Error de validación de datos.` |
| Reglas de negocio | 400, 403, 404, 409... | `success: false` y `message`. Los 403 de autorización empiezan con `Acceso no autorizado.` |
| Dato que viola una restricción de la base de datos | 400 | `success: false` y `message` con el detalle devuelto por la base de datos. |
| Error del servidor | 500 o superior | `success: false`, `message` y `reference`. Los errores internos empiezan con `Error interno del servidor.` |
| Autenticación, límite general de peticiones y errores no controlados | 401, 429, 500 | Solo `message` (`Unauthenticated.`, `Too Many Attempts.`, `Server Error`). |

**📦 Ejemplos**

**Validación (HTTP 422):**

```json
{
  "message": "El campo customer.dni es obligatorio.",
  "errors": {
    "customer.dni": ["El campo customer.dni es obligatorio."]
  }
}
```

**Regla de negocio (HTTP 404):**

```json
{
  "success": false,
  "message": "No se encontró el documento."
}
```

**Error del servidor (HTTP 500):**

```json
{
  "success": false,
  "message": "Error interno del servidor. ...",
  "reference": "3b0c6f5e-8d2a-4c7e-9f1b-2a6d5e4c3b21"
}
```

:::info Campo `reference` en errores 5xx
Las respuestas 5xx causadas por un error interno de la emisión y de las consultas traen `reference`: el identificador con el que soporte ubica el error. El 503 `DIAN_STATUS_UNAVAILABLE` no lo trae, porque no es un error interno. **Inclúyelo siempre al reportar un incidente.** Estas respuestas ya no incluyen `file` ni `line`.

Un 500 no implica que el error sea de la DIAN. En la emisión, si el error ocurrió **después** de transmitir el documento, la respuesta trae `code: "DOCUMENT_POSSIBLY_SENT"` y no debe reintentarse a ciegas (ver [Timeouts y posible envío](https://docs.matias-api.com/docs/response-json#timeouts-contingencia)).
:::

---

## ✅ Estructura de la Respuesta Exitosa

:::tip HTTP 200 — Documento Procesado Exitosamente
Cuando la DIAN acepta y autoriza legalmente el documento, la API responde con un objeto que incluye la clave única (CUFE/CUDE/CUNE), el XML firmado, el PDF, el código QR de validación y los avisos (`warnings`) del procesamiento.
:::

### 📋 Campos Principales

| Campo | Tipo | Descripción |
|---|---|---|
| `uuid` | `string` | Identificador del envío en el API. Úsalo con `GET /documents/{uuid}`. |
| `message` | `string` | Resumen del resultado del procesamiento. |
| `send_to_queue` | `integer` | Siempre `0` (el envío a cola aún no está habilitado). |
| `XmlDocumentKey` | `string` | CUFE (Factura) / CUDE (Notas) / CUNE (Nómina). |
| `response` | `object` | Respuesta directa de la DIAN. |
| `XmlBase64Bytes` | `string` | XML del documento en base64. |
| `AttachedDocument` | `object` | Enlaces y metadatos del XML firmado y el contenedor Zip. |
| `qr` | `object` | Rutas y base64 para el código QR de validación. |
| `pdf` | `object` | Enlaces de descarga y metadatos del archivo PDF generado. |
| `warnings` | `array` | 🆕 Avisos del procesamiento. **Siempre está presente**: arreglo vacío si no hay avisos. Ver [Avisos](https://docs.matias-api.com/docs/response-json#warnings). |
| `success` | `boolean` | `true` si la operación se completó. |

:::note Ambiente de habilitación DIAN
Si el software está en el ambiente de **pruebas (habilitación)** de la DIAN, la emisión responde un objeto reducido: `XmlDocumentKey`, `ZipKey`, `response`, `XmlDocumentName`, `ShippingMethod`, `XmlBase64Bytes` y `success` (sin `uuid`, `pdf` ni `warnings`).
:::

**📦 Ver JSON Completo de Respuesta Exitosa**

```json title="response.json"
{
  "uuid": "dde72910-eb42-11ef-9b27-f02f74cac485",
  "message": "Solicitud procesada por la DIAN.",
  "send_to_queue": 0,
  "XmlDocumentKey": "d45f3b2ed042ce0e075891591c3b3a7ae3a9c176ca191dab1bd23e5cdd3b48b8c548a088dfcbe20ee7baa2bed2dccd48",
  "response": {
    "ErrorMessage": {
      "string": [
        "Regla: RUT01, Notificación: La validación del estado del RUT próximamente estará disponible."
      ]
    },
    "IsValid": "true",
    "StatusCode": "00",
    "StatusDescription": "Procesado Correctamente.",
    "StatusMessage": "La Factura electrónica LZT2002, ha sido autorizada.",
    "XmlBase64Bytes": "",
    "XmlBytes": {
      "_attributes": {
        "nil": "true"
      }
    },
    "XmlDocumentKey": "d45f3b2ed042ce0e075891591c3b3a7ae3a9c176ca191dab1bd23e5cdd3b48b8c548a088dfcbe20ee7baa2bed2dccd48",
    "XmlFileName": "fv09010914030002500000095"
  },
  "XmlBase64Bytes": "",
  "AttachedDocument": {
    "pathZip": null,
    "path": "1/ad/ad09010914030002500000041.xml",
    "url": "https://sandbox-api.matias-api.com/attachments/1/ad/ad09010914030002500000041.xml",
    "data": ""
  },
  "qr": {
    "qrDian": "https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=d45f...",
    "url": "https://sandbox-api.matias-api.com/qr/1/fv09010914030002500000095.png",
    "path": "1/fv09010914030002500000095.png",
    "data": ""
  },
  "pdf": {
    "path": "1/fv09010914030002500000095.pdf",
    "url": "https://sandbox-api.matias-api.com/pdf/1/fv09010914030002500000095.pdf",
    "data": ""
  },
  "warnings": [],
  "success": true
}
```

**🔍 Diccionario Detallado de Campos**

#### Objeto `response` (Validación Directa DIAN)
| Campo | Tipo | Descripción |
|---|---|---|
| `ErrorMessage` | `object` | Notificaciones DIAN (si el documento es válido) o motivos del rechazo. |
| `IsValid` | `string` | Indica si cumple los estándares oficiales (`"true"` o `"false"`). |
| `StatusCode` | `string` | Estado interno DIAN (`"00"`: Autorizado). |
| `StatusDescription` | `string` | Glosa oficial (ej. `"Procesado Correctamente."`). |
| `StatusMessage` | `string` | Detalle específico de la autorización. |
| `XmlDocumentKey` | `string` | CUFE / CUDE del documento. |
| `XmlFileName` | `string` | Nombre bajo el cual el XML firmado se registra en la DIAN. |

#### Objeto `AttachedDocument` (Archivos XML)
| Campo | Tipo | Descripción |
|---|---|---|
| `pathZip` | `null` | **Obsoleto:** siempre `null`. El ZIP ya no se guarda en el servidor; se arma al enviar el correo. |
| `path` | `string` | Ruta relativa del XML firmado. |
| `url` | `string` | Enlace público para descarga directa del XML firmado. |

#### Objeto `pdf` (Representación Gráfica)
| Campo | Tipo | Descripción |
|---|---|---|
| `path` | `string` | Ruta de almacenamiento de la representación gráfica. |
| `url` | `string` | Enlace público de descarga del PDF generado. |

---

## 🔔 Avisos de la Respuesta (`warnings`)

`warnings` es un arreglo de objetos `code` + `message`. Un aviso **no convierte en error** un documento que la DIAN ya validó: si algo falla después de la aceptación, la emisión sigue siendo exitosa y se informa aquí.

| `code` | Cuándo aparece | ¿Reenviar? |
|---|---|---|
| `PDF_NOT_GENERATED` | El documento fue validado, pero no se pudo generar la representación gráfica. | ❌ No. Genera el PDF con `POST /documents/pdf/{trackId}?regenerate=1`. |
| `EMAIL_NOT_SENT` | El documento fue validado, pero no se pudo enviar el correo (`send_email: 1`). | ❌ No. Reenvía el correo con `POST /documents/sendmail/{trackId}`. |
| `ATTACHED_DOCUMENT_NOT_GENERATED` | El documento fue validado, pero no se pudo generar el AttachedDocument (ni enviar el correo, si se pidió). | ❌ No. |
| `ATTACHMENTS_NOT_LINKED` | El documento fue procesado, pero no se pudieron vincular sus adjuntos. | ❌ No, si el documento es válido. |
| `ALREADY_AUTHORIZED_RECOVERED` | La DIAN ya había autorizado ese número con el mismo contenido: se devuelve el documento autorizado y no se generó uno nuevo. | ❌ No: el documento es válido. |
| `ALREADY_AUTHORIZED_OTHER_CONTENT` | La DIAN ya autorizó ese número con **otro contenido**. El documento enviado no se marcó como válido. | ❌ No con ese número: consulta el documento autorizado. |
| `ALREADY_PROCESSED_NOT_CONFIRMED` | La DIAN indicó que el documento fue procesado anteriormente, pero no confirmó su autorización. | ⏳ Consulta su estado antes de reenviarlo. |

Los tres avisos `ALREADY_*` solo aparecen en producción (ver [Documento duplicado y regla 90](https://docs.matias-api.com/docs/response-json#documento-duplicado)).

**📦 Ejemplo: correo no enviado (`EMAIL_NOT_SENT`)**

```json
{
  "warnings": [
    {
      "code": "EMAIL_NOT_SENT",
      "message": "El documento fue validado por la DIAN, pero no se pudo enviar el correo. Motivo: No se pudo enviar el email a ningún destinatario. Errores: El envío fue bloqueado automáticamente porque la(s) siguiente(s) dirección(es) no puede(n) recibir correo. Verifique que estén bien escritas: compras@dominio-inexistente.com (el dominio dominio-inexistente.com no existe o no recibe correo) No reenvíe el documento: ya es válido ante la DIAN."
    }
  ]
}
```

**Sobre `EMAIL_NOT_SENT`:**

- El texto `Motivo:` solo se incluye cuando la causa es de negocio, por ejemplo: ningún destinatario pudo recibir el correo (formato o dominio inválido, envío reciente o límite de envíos), ya hay un envío de correo en curso para ese documento o se excedió el límite de destinatarios. Los errores técnicos no se detallan.
- Si **solo algunos** destinatarios fallan, el correo se envía a los demás y **no** se agrega el aviso.

---

## 🔄 Documento Duplicado y Regla 90

:::warning Documento ya validado — HTTP 400
Si intentas emitir de nuevo un prefijo y consecutivo que ya fue validado ante la DIAN, la API responde **HTTP 400** con el registro del envío existente en `data`:
:::

```json title="response.json"
{
  "message": "El documento (Factura electrónica) con numero LZT224 ya se encuentra validado.",
  "data": {
    "uuid": "dde72910-eb42-11ef-9b27-f02f74cac485",
    "document_number": "LZT224",
    "XmlDocumentKey": "cf9864294501e8a9578235dd2ab3c4fd...",
    "is_valid": 1
  },
  "success": false
}
```

Si ese número está en cola de procesamiento, la respuesta es también **HTTP 400**: `El documento (Factura electrónica) con numero LZT224 se encuentra en cola de procesamiento.`, con `data`.

**Regla 90 ("Documento procesado anteriormente")** — en producción, si la DIAN responde que el documento ya fue procesado, la API lo concilia con la DIAN:

- Si la DIAN autorizó ese número con el mismo contenido, devuelve el documento autorizado con el aviso `ALREADY_AUTHORIZED_RECOVERED`.
- Si no, devuelve el rechazo con el aviso `ALREADY_AUTHORIZED_OTHER_CONTENT` o `ALREADY_PROCESSED_NOT_CONFIRMED`.
- Si en ese momento no se pudo consultar la DIAN, el rechazo llega tal cual, sin aviso: consulta el estado antes de reenviar.
- Nunca guarda el intento rechazado encima de un documento ya validado.

---

## ⚠️ Rechazo de la DIAN (HTTP 200)

:::danger Rechazo de Validación DIAN
Cuando el documento contiene errores aritméticos, de catálogos o de reglas de validación DIAN, la API responde **HTTP 200** con `success: true` y `response.IsValid: "false"`. El código HTTP 422 se reserva para la validación del JSON enviado, antes de llegar a la DIAN.
:::

```json title="response.json"
{
  "uuid": "dde72910-eb42-11ef-9b27-f02f74cac485",
  "message": "Solicitud procesada por la DIAN.",
  "send_to_queue": 0,
  "XmlDocumentKey": "d45f3b2ed042ce0e075891591c3b3a7ae3a9c176ca191dab1bd23e5cdd3b48b8c548a088dfcbe20ee7baa2bed2dccd48",
  "response": {
    "IsValid": "false",
    "StatusCode": "99",
    "StatusDescription": "Documento con errores en campos obligatorios.",
    "ErrorMessage": {
      "string": [
        "Regla: FAS01A, Notificación: Error en el cálculo de la base imponible del IVA."
      ]
    }
  },
  "XmlBase64Bytes": "",
  "AttachedDocument": null,
  "qr": null,
  "pdf": null,
  "warnings": [],
  "success": true
}
```

---

## 🚦 Conflictos (HTTP 409)

| `code` / `error_code` | Endpoint | Significado y acción |
|---|---|---|
| `DOCUMENT_IN_TRANSMISSION` | Emisión, `POST /status/document/{trackId}`, `DELETE /documents/{id}` | Ese número se está transmitiendo a la DIAN en otra solicitud. No envíes en paralelo: espera y consulta el estado. |
| `DOCUMENT_IN_VALIDATION` | Emisión (producción) | La DIAN aún valida (`StatusCode 98`) el envío anterior de ese número. `data.document_key` trae su CUFE/CUDE. No se transmitió: consulta el estado en unos minutos. |
| — | Emisión | `El uuid proporcionado ya se usó en otro documento de la empresa. No se emitió de nuevo: consulte ese documento o envíe un uuid nuevo.` |
| — | Envío de eventos RADIAN | `El evento ya se está enviando.` |
| — | Importación de recepción por CUFE/CUDE | `El cufe/cude ya está en proceso de importación.`, el CUFE/CUDE ya fue importado y omitido, o el documento fue eliminado de la recepción (impórtalo de nuevo por su CUFE). |
| `MAILBOX_RETRY_UNAVAILABLE`, `MAILBOX_RETRY_NO_LOCATION`, `MAILBOX_RETRY_EXPIRED`, `MAILBOX_RETRY_IN_PROGRESS`, `MAILBOX_ALREADY_PROCESSED` | `POST /events/mailbox/{id}/retry` | El correo del buzón no se puede reintentar (ver `message`). |
| — | Personas de recepción | No se puede eliminar la persona por defecto mientras haya otras, ni cambiar el modo de envío sin personas registradas. |

**📦 Ejemplos de 409 en la emisión**

```json
{
  "code": "DOCUMENT_IN_TRANSMISSION",
  "message": "El documento LZT836 ya se está transmitiendo a la DIAN en otra solicitud; consulte su estado antes de enviarlo de nuevo.",
  "data": {
    "document_number": "LZT836"
  },
  "success": false
}
```

```json
{
  "code": "DOCUMENT_IN_VALIDATION",
  "message": "La DIAN aún está validando el documento LZT836 (CUFE/CUDE cf9864294501e8a9...). No se transmitió de nuevo: consulte su estado en unos minutos antes de reenviarlo.",
  "data": {
    "uuid": "dde72910-eb42-11ef-9b27-f02f74cac485",
    "document_number": "LZT836",
    "document_key": "cf9864294501e8a9..."
  },
  "success": false
}
```

---

## ⏳ Timeouts y Posible Envío

:::info `DOCUMENT_POSSIBLY_SENT` — No retransmitir a ciegas
Si la comunicación con la DIAN falla **después** de transmitir el documento (timeout, respuesta inesperada o fallo al guardar), la API no puede saber si la DIAN lo recibió. Responde normalmente con **HTTP 500**, `code: "DOCUMENT_POSSIBLY_SENT"`, `data.uuid`, `data.document_number` y `reference`. El consecutivo se conserva.

1. **No emitas de nuevo** el documento con otro número.
2. **Consulta el estado** con `GET /documents/{uuid}` (usando `data.uuid`) o con `GET /status?prefix=...&number=...`.
3. **Contingencia Tipo 04:** si la caída persiste y es informada oficialmente por la DIAN, emite con `operation_type_id: 3` (Factura de Contingencia) y transmite dentro de las 48 horas siguientes.
:::

```json title="response.json"
{
  "success": false,
  "message": "No se obtuvo una respuesta definitiva para el documento LZT836 y es posible que la DIAN lo haya recibido. No lo emita de nuevo: consulte su estado con el uuid del envío antes de cualquier reintento. Detalle: Error interno del servidor. ...",
  "reference": "3b0c6f5e-8d2a-4c7e-9f1b-2a6d5e4c3b21",
  "code": "DOCUMENT_POSSIBLY_SENT",
  "data": {
    "uuid": "dde72910-eb42-11ef-9b27-f02f74cac485",
    "document_number": "LZT836"
  }
}
```

:::warning 503 `DIAN_STATUS_UNAVAILABLE` no es una caída general de la DIAN
En producción, antes de retransmitir un número cuyo envío anterior no quedó confirmado, la API consulta ese envío en la DIAN. Si no logra confirmarlo, responde **HTTP 503** con `code: "DIAN_STATUS_UNAVAILABLE"` y **no transmite** el documento para no duplicarlo. Reintenta en unos minutos.
:::

```json title="response.json"
{
  "success": false,
  "code": "DIAN_STATUS_UNAVAILABLE",
  "message": "No se pudo confirmar en la DIAN el estado del envío anterior del documento LZT836 (CUFE/CUDE cf9864294501e8a9...). No se transmitió de nuevo para no duplicarlo: intente en unos minutos.",
  "data": {
    "uuid": "dde72910-eb42-11ef-9b27-f02f74cac485",
    "document_number": "LZT836",
    "document_key": "cf9864294501e8a9..."
  }
}
```

---

## ⏳ StatusCode 98 — En Procesamiento

:::tip Estado Transitorio de Validación
`StatusCode 98` indica que la DIAN recibió el documento y lo tiene en cola. **No es un error**.
1. Espera 3 a 5 minutos.
2. Consulta el estado con `POST /status/document/{trackId}`.
3. No retransmitas con un nuevo número para evitar cobros dobles o duplicados.

En producción, si envías de nuevo el mismo número, la API primero consulta la DIAN: si sigue en 98, responde **HTTP 409** `DOCUMENT_IN_VALIDATION` sin transmitir.
:::

```json title="response.json"
{
  "message": "Solicitud procesada por la DIAN.",
  "response": {
    "IsValid": "false",
    "StatusCode": "98",
    "StatusDescription": "En Proceso",
    "XmlDocumentKey": null
  }
}
```

---

## ❓ Preguntas Frecuentes (FAQ)

**¿Qué diferencia hay entre `success` e `IsValid`?**  
`success: true` indica que la API procesó la solicitud HTTP correctamente. `IsValid: "true"` es la confirmación oficial de que la DIAN autorizó fiscalmente el documento. Un rechazo de la DIAN llega con `success: true` e `IsValid: "false"`.

**Recibí un timeout o un `DOCUMENT_POSSIBLY_SENT`, ¿el documento se emitió?**  
Es posible. El XML pudo llegar a la DIAN y procesarse. **Nunca retransmitas** sin antes consultar el estado con `GET /documents/{uuid}` o `GET /status`.

**La respuesta trae `warnings`, ¿debo reenviar el documento?**  
No. Si `response.IsValid` es `"true"`, el documento ya es válido ante la DIAN; los avisos indican pasos posteriores (PDF, correo, adjuntos) que puedes repetir por separado.

**¿Qué significa `nil="true"` en algunos nodos XML?**  
Es un estándar de serialización SOAP/XML que indica que el campo está vacío (equivalente a `null`).

---

📅 **Versión:** 3.7.0 (Agosto 2026) •
📨 **Respuestas Documentadas:** HTTP, avisos y conflictos •
🎯 **Nivel:** ⭐⭐⭐ Referencia Técnica de Integración

---

<!-- Fuente: https://docs.matias-api.com/docs/use-cases/common-errors -->

# ⚠️ Guía: Errores Comunes y Soluciones

## 📋 Introducción

Esta guía enumera los errores más frecuentes al trabajar con la API MATIAS de facturación electrónica y cómo solucionarlos. Los ejemplos están basados en estructuras reales del API.

🔐

**Autenticación**  

Tokens, verificación de correo (404), Sandbox vs Producción

🧮

**Cálculos UBL 2.1**  

Totales, impuestos, descuentos y retenciones

🚦

**Concurrencia DIAN**  

Errores 409, 503, Regla 90 y DOCUMENT_POSSIBLY_SENT

📝

**Estructura y Clientes**  

NIT sin DV, campos requeridos y ?client_uuid

---

## 🔐 Errores de Autenticación

### ❌ "Unauthorized" / "invalid_token"

:::warning ⚠️ Error Común
Este es uno de los errores más frecuentes. Generalmente el token ha expirado o falta el encabezado `Authorization: Bearer {token}`.
:::

**Respuesta del API:**

```json
{
  "success": false,
  "message": "Unauthorized - Token inválido o expirado"
}
```

**HTTP Status**: 401 - Unauthorized

**Causas posibles:**
1. Token OAuth2 ha expirado (duración: 90 días máximo)
2. Token no incluido en header Authorization
3. Token no emitido: si el login falló, `POST /auth/login` responde **404** `"Credenciales inválidas."` y no entrega token
4. Token malformado o corrupto
5. Token revocado manualmente

**Solución:**

```bash
# 1. Obtener nuevo token
curl -X POST "{{url}}/auth/login" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tu-email@empresa.com",
    "password": "tu-contraseña",
    "remember_me": 0
  }'

# 2. Respuesta con nuevo token
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjM...",
  "user": {
    "id": 1,
    "email": "tu-email@empresa.com"
  },
  "expires_at": "2026-05-06 14:30:00",
  "success": true
}

# 3. Usar en requests posteriores
curl -X POST "{{url}}/invoice" \
  -H "Authorization: Bearer YOUR_NEW_TOKEN" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{...}'
```

:::tip 💡 Pro tip
**Novedad v3.0.0:** Puedes crear **Personal Access Tokens** con duración configurable (de 1 a 365 días; 90 por defecto) para evitar estar renovando constantemente. [Ver guía de PAT](https://docs.matias-api.com/docs/endpoints/intro-auth#personal-access-tokens)
:::

---

## 📝 Errores de Estructura JSON

### ❌ "Invalid JSON" / "Malformed request"

**Respuesta del API:**

```json
{
  "success": false,
  "message": "Invalid or malformed JSON"
}
```

**HTTP Status**: 400 - Bad Request

**Causa común - JSON inválido:**

Ejemplo de JSON malformado (falta cierre de llave):

```json
{
  "resolution_number": "18764074347312",
  "prefix": "LZT",
  "document_number": "2002"
}
```

**Solución:**

```json
{
  "resolution_number": "18764074347312",
  "prefix": "LZT",
  "document_number": "2002"
}
```

### ❌ "Campos requeridos faltantes"

**Respuesta del API:**

```json
{
  "success": false,
  "message": "Required field missing: lines"
}
```

**HTTP Status**: 400 - Bad Request

**📋 Campos obligatorios:**

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|--------|
| `resolution_number` | string | 📜 Resolución DIAN de facturación | `"18764074347312"` |
| `prefix` | string | 🏷️ Prefijo registrado | `"FEV"`, `"FVD"` |
| `document_number` | string | 🔢 Número secuencial | `"2002"` |
| `type_document_id` | int | 📄 Tipo de documento | `7` (Factura) |
| `operation_type_id` | int | ⚙️ Tipo de operación | `1` (Estándar) |
| `customer` | object | 👤 Datos del cliente/comprador | `{...}` |
| `lines` | array | 📦 Ítems facturados | `[{...}]` |
| `legal_monetary_totals` | object | 💰 Totales finales | `{...}` |
| `payments` | array | 💳 Información de pago | `[{...}]` |

:::danger ⚠️ Importante
Verifica que el JSON incluya **todos estos campos** con valores válidos antes de enviar la solicitud.
:::

---

## 🆔 Errores de Validación de NIT

### ❌ "NIT con dígito verificador inválido"

**Respuesta del API:**

```json
{
  "success": false,
  "message": "El documento (cliente.dni) con numero 8001234567-8, no es valido"
}
```

**HTTP Status**: 422 - Unprocessable Entity

**Ejemplo:** NIT `8001234567-8` es inválido

**🧮 Algoritmo Colombiano Correcto:**

**Posición:** 1  2  3  4  5  6  7  8  9  

**Dígito:**   8  0  0  1  2  3  4  5  6  

**Peso:**     3  7  13 17 19 23 29 37 41  

8×3 + 0×7 + 0×13 + 1×17 + 2×19 + 3×23 + 4×29 + 5×37 + 6×41  

= 24 + 0 + 0 + 17 + 38 + 69 + 116 + 185 + 246 = **695**

695 ÷ 11 = 63 resto **2** → Dígito verificador = 11 - 2 = **9**

✓ **NIT correcto: 800123456 (DV 9) — en el campo dni envía solo "800123456"**

**💡 Solución:**

🔍 **NITValidator**  

[Abrir Herramientas Interactivas](https://docs.matias-api.com/docs/interactive-tools.md)

🧮 **Regla para el JSON**  

Envía solo dígitos en `dni`, sin guiones ni DV

---

## 🧮 Errores de Cálculo de Totales

### ❌ "Total no coincide"

:::danger ❌ Error Crítico
Uno de los errores más comunes al crear facturas. Revisa las sumatorias de `legal_monetary_totals` cuidadosamente.
:::

**Respuesta del API:**

```json
{
  "error": true,
  "errors": [
    {
      "field": "legal_monetary_totals",
      "message": "Total no coincide con suma de líneas"
    }
  ]
}
```

**Ejemplo incorrecto:**

```json
{
  "lines": [
    {
      "invoiced_quantity": "2",
      "price_amount": "100.00",
      "line_extension_amount": "200.00",
      "tax_totals": [
        {
          "tax_id": "1",
          "tax_amount": 38.00,
          "taxable_amount": 200.00,
          "percent": 19
        }
      ]
    }
  ],
  "legal_monetary_totals": {
    "line_extension_amount": "200.00",
    "tax_exclusive_amount": "200.00",
    "tax_inclusive_amount": "237.00",
    "payable_amount": 237.00
  }
}
```

**Respuesta del API:**

```json
{
  "success": false,
  "message": "La validación de tax_inclusive_amount es incorrecta. Se esperaba 238.00, se recibió 237.00"
}
```

**Corrección:**

```json
{
  "legal_monetary_totals": {
    "line_extension_amount": "200.00",
    "tax_exclusive_amount": "200.00",
    "tax_inclusive_amount": "238.00",
    "payable_amount": 238.00
  }
}
```

**🎯 Fórmula Correcta:**

**tax_inclusive_amount** = tax_exclusive_amount + SUMA(tax_totals[*].tax_amount)  

**payable_amount** = tax_inclusive_amount

### ❌ "Impuesto calculado incorrectamente"

**Respuesta del API:**

```json
{
  "error": true,
  "errors": [
    {
      "field": "lines[0].tax_totals",
      "message": "tax_amount no coincide con cálculo esperado"
    }
  ]
}
```

**Ejemplo incorrecto:**

```json
{
  "lines": [
    {
      "line_extension_amount": "100.00",
      "tax_totals": [
        {
          "tax_id": "1",
          "tax_amount": 20.00,          // ❌ INCORRECTO: 100 × 0.19 = 19
          "taxable_amount": 100.00,
          "percent": 19
        }
      ]
    }
  ]
}
```

**Corrección:**

```json
{
  "tax_totals": [
    {
      "tax_id": "1",
      "tax_amount": 19.00,
      "taxable_amount": 100.00,
      "percent": 19
    }
  ]
}
```

:::info 📊 Cálculo Correcto
100 × 0.19 = **19.00**
:::

**🎯 Fórmula:**

**tax_amount** = taxable_amount × (percent / 100)

### ❌ "Descuento excede el monto"

**Respuesta del API:**

```json
{
  "success": false,
  "message": "Allowance/Charge amount cannot exceed line base amount"
}
```

**HTTP Status**: 422 - Unprocessable Entity

**Ejemplo incorrecto:**

```json
{
  "lines": [
    {
      "price_amount": "100.00",
      "allowance_charges": [
        {
          "amount": "150.00",
          "base_amount": "100.00",
          "charge_indicator": false
        }
      ]
    }
  ]
}
```

**Corrección:**

```json
{
  "allowance_charges": [
    {
      "amount": "50.00",
      "base_amount": "100.00",
      "charge_indicator": false
    }
  ]
}
```

:::tip ✅ Validación
El monto debe ser ≤ al monto base **(50 ≤ 100)** ✓
:::

---

## 👥 Errores de Validación de Cliente

### ❌ "Cliente no válido" / "Invalid party"

**Respuesta del API:**

```json
{
  "error": true,
  "errors": [
    {
      "field": "customer",
      "message": "Datos de cliente incompletos"
    }
  ]
}
```

**📋 Campos requeridos del cliente:**

| Campo | Obligatorio | Ejemplo | Descripción |
|-------|------------|---------|-------------|
| `country_id` | ✅ Sí | `"45"` | 🌎 País (45 = Colombia) |
| `city_id` | ✅ Sí | `"76"` | 🏙️ Ciudad (76 = Cali) |
| `identity_document_id` | ✅ Sí | `"2"` | 🆔 Tipo documento (2 = NIT) |
| `type_organization_id` | ✅ Sí | `2` | 🏢 Tipo organización |
| `tax_regime_id` | ✅ Sí | `1` | 📊 Régimen tributario |
| `company_name` | ✅ Sí | `"CLIENTE LTDA"` | 🏷️ Razón social |
| `dni` | ✅ Sí | `"8001234567"` | 🔢 NIT sin dígito |
| `email` | ⚪ No | `"cliente@example.com"` | 📧 Email contacto |
| `mobile` | ⚪ No | `"3001234567"` | 📱 Teléfono móvil |
| `address` | ⚪ No | `"Calle 15 #8-30"` | 📍 Dirección física |

**Ejemplo correcto:**

```json
{
  "country_id": "45",
  "city_id": "76",
  "identity_document_id": "2",
  "type_organization_id": 2,
  "tax_regime_id": 1,
  "tax_level_id": 5,
  "company_name": "CLIENTE EMPRESA LTDA",
  "dni": "8001234567",
  "email": "compras@cliente.com",
  "address": "Calle 15 #8-30",
  "postal_code": "050001"
}
```

---

## 🔄 Errores de Factura Duplicada

### ❌ "Documento duplicado"

:::warning ⚠️ Atención
Intentas crear un documento con un número que ya fue validado previamente por la DIAN.
:::

**Respuesta del API:**

```json
{
  "message": "El documento (Factura electrónica) con numero LZT2002 ya se encuentra validado.",
  "data": {
    "uuid": "dde72910-eb42-11ef-9b27-f02f74cac485",
    "document_number": "LZT2002",
    "XmlDocumentKey": "cf9864294501e8a9578235dd2ab3c4fd...",
    "is_valid": 1
  },
  "success": false
}
```

**HTTP Status**: 400 - Bad Request

**Causa:** El mismo `prefix` + `document_number` ya fue validado por la DIAN. En `data` llega el registro del envío existente.

**💡 Soluciones:**

**✅ Opción 1: Incrementar número secuencial**  

Actual: `LZT-2002` (Ya existe) → Nuevo: `LZT-2003`

**✅ Opción 2: Usar diferente prefijo autorizado**  

Actual: `LZT-2002` → Nuevo: `LZX-2002`

**Solución - Opción 3: Consultar documento anterior**

```bash
# Estado del documento (validación y QR)
curl -X GET "{{url}}/status?prefix=LZT&number=LZT2002" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Accept: application/json"

# O búsqueda en el listado de documentos
curl -X GET "{{url}}/documents?prefix=LZT&number=LZT2002" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Accept: application/json"
```

:::warning 📜 IMPORTANTE
Los prefijos deben estar **registrados previamente** en tu resolución de facturación ante la DIAN.
:::

---

## 🚦 Errores de Transmisión Concurrente, Validación Pendiente y Posible Envío

:::danger Regla de oro
Ninguno de estos casos se resuelve emitiendo el documento con **otro número**. Consulta primero el estado del documento con `GET /documents/{uuid}` o `GET /status?prefix=...&number=...`.
:::

### ❌ `DOCUMENT_IN_TRANSMISSION` — el número ya se está transmitiendo

**HTTP Status**: 409 - Conflict

```json
{
  "code": "DOCUMENT_IN_TRANSMISSION",
  "message": "El documento LZT2002 ya se está transmitiendo a la DIAN en otra solicitud; consulte su estado antes de enviarlo de nuevo.",
  "data": {
    "document_number": "LZT2002"
  },
  "success": false
}
```

**Causa:** otra solicitud (un reintento, un doble clic o un lote) está transmitiendo ese mismo número a la DIAN.

**Solución:** no envíes el mismo documento en paralelo. Espera unos segundos y consulta su estado antes de reenviarlo.

### ❌ `DOCUMENT_IN_VALIDATION` — la DIAN aún valida el envío anterior

**HTTP Status**: 409 - Conflict (solo en producción)

```json
{
  "code": "DOCUMENT_IN_VALIDATION",
  "message": "La DIAN aún está validando el documento LZT2002 (CUFE/CUDE cf9864294501e8a9...). No se transmitió de nuevo: consulte su estado en unos minutos antes de reenviarlo.",
  "data": {
    "uuid": "dde72910-eb42-11ef-9b27-f02f74cac485",
    "document_number": "LZT2002",
    "document_key": "cf9864294501e8a9..."
  },
  "success": false
}
```

**Causa:** el envío anterior de ese número quedó en `StatusCode 98` y la DIAN sigue validándolo.

**Solución:** espera unos minutos y consulta el estado con `POST /status/document/{trackId}` usando `data.document_key`.

### ❌ `DIAN_STATUS_UNAVAILABLE` — no se pudo confirmar el envío anterior

**HTTP Status**: 503 - Service Unavailable (solo en producción)

```json
{
  "success": false,
  "code": "DIAN_STATUS_UNAVAILABLE",
  "message": "No se pudo confirmar en la DIAN el estado del envío anterior del documento LZT2002 (CUFE/CUDE cf9864294501e8a9...). No se transmitió de nuevo para no duplicarlo: intente en unos minutos.",
  "data": {
    "uuid": "dde72910-eb42-11ef-9b27-f02f74cac485",
    "document_number": "LZT2002",
    "document_key": "cf9864294501e8a9..."
  }
}
```

**Causa:** no es una caída general de la DIAN: la API no pudo confirmar el estado del envío anterior de ese número y, para no duplicarlo, **no transmitió** el documento.

**Solución:** reintenta en unos minutos con el mismo número.

### ❌ `DOCUMENT_POSSIBLY_SENT` — posible envío sin respuesta definitiva

**HTTP Status**: normalmente 500 - Internal Server Error

```json
{
  "success": false,
  "message": "No se obtuvo una respuesta definitiva para el documento LZT2002 y es posible que la DIAN lo haya recibido. No lo emita de nuevo: consulte su estado con el uuid del envío antes de cualquier reintento. Detalle: Error interno del servidor. ...",
  "reference": "3b0c6f5e-8d2a-4c7e-9f1b-2a6d5e4c3b21",
  "code": "DOCUMENT_POSSIBLY_SENT",
  "data": {
    "uuid": "dde72910-eb42-11ef-9b27-f02f74cac485",
    "document_number": "LZT2002"
  }
}
```

**Causa:** el error (timeout, respuesta inesperada o fallo al guardar) ocurrió **después** de transmitir el documento a la DIAN. El consecutivo se conserva.

**Solución:** no reemitas. Consulta `GET /documents/{uuid}` con `data.uuid` (o `GET /status`) y actúa según su estado. Si reportas el caso a soporte, incluye `reference`.

### ❌ "El uuid proporcionado ya se usó en otro documento de la empresa"

**HTTP Status**: 409 - Conflict

```json
{
  "success": false,
  "message": "El uuid proporcionado ya se usó en otro documento de la empresa. No se emitió de nuevo: consulte ese documento o envíe un uuid nuevo."
}
```

**Causa:** el `uuid` anti-duplicados que enviaste ya pertenece a otro documento de la empresa. No se transmitió nada.

**Solución:** consulta ese documento con `GET /documents/{uuid}` o envía un `uuid` nuevo si se trata de otro documento.

### ⚠️ Avisos de regla 90: `ALREADY_AUTHORIZED_*` / `ALREADY_PROCESSED_NOT_CONFIRMED`

En producción, cuando la DIAN responde "documento procesado anteriormente" (regla 90), la API concilia el número con la DIAN y lo informa en `warnings`:

| `code` | Significado | Acción |
|---|---|---|
| `ALREADY_AUTHORIZED_RECOVERED` | La DIAN ya había autorizado ese número con el mismo contenido: se devuelve el documento autorizado. | Ninguna: el documento es válido. |
| `ALREADY_AUTHORIZED_OTHER_CONTENT` | La DIAN autorizó ese número con **otro contenido**. El documento enviado no se marcó como válido. | No lo reenvíes con ese número; consulta el documento autorizado. |
| `ALREADY_PROCESSED_NOT_CONFIRMED` | La DIAN indicó que lo procesó, pero no confirmó la autorización. | Consulta su estado antes de reenviarlo. |

### ⚠️ Avisos posteriores a la aceptación: `PDF_NOT_GENERATED` / `EMAIL_NOT_SENT` / `ATTACHED_DOCUMENT_NOT_GENERATED`

```json
{
  "warnings": [
    {
      "code": "PDF_NOT_GENERATED",
      "message": "El documento fue validado por la DIAN, pero no se pudo generar la representación gráfica. No reenvíe el documento: ya es válido ante la DIAN."
    }
  ]
}
```

**Causa:** la DIAN validó el documento, pero falló un paso posterior (PDF, correo o AttachedDocument).

**Solución:** **no reenvíes el documento**: ya es válido. Genera el PDF con `POST /documents/pdf/{trackId}?regenerate=1` o reenvía el correo con `POST /documents/sendmail/{trackId}`. Ver [Avisos de la respuesta](https://docs.matias-api.com/docs/response-json#warnings).

### 📦 Envío masivo: `DUPLICATE_DOCUMENT_UUID` y `POSSIBLY_SENT`

- **`DUPLICATE_DOCUMENT_UUID`**: el item termina en `FAILED` porque la empresa ya emitió un documento con ese `uuid`. No se emite de nuevo; consulta el documento existente con `GET /documents/{uuid}`.
- **`POSSIBLY_SENT`**: el item no obtuvo una respuesta definitiva de la DIAN después de transmitirse. No lo reenvíes en otro lote; consulta su estado con `GET /documents/{uuid}` usando el `document_uuid` del item.

Más detalles en [Envío Masivo de Documentos](https://docs.matias-api.com/docs/bulk-documents.md).

---

## 💱 Errores de Moneda y Exportación

### ❌ "Moneda inválida para exportación"

**Respuesta del API:**

```json
{
  "error": true,
  "errors": [
    {
      "field": "currency_id",
      "message": "No puedes usar COP en una exportación"
    }
  ]
}
```

**❌ Incorrecto:**

```json
{
  "type_document_id": 8,       // Exportación
  "currency_id": 170,          // COP ❌
  "customer": { "country_id": "239" }  // USA
}
```

**✅ Correcto:**

```json
{
  "type_document_id": 8,       // Exportación
  "currency_id": 272,          // USD ✓
  "customer": { "country_id": "239" }  // USA
}
```

### ❌ "IVA no permitido en exportación"

**Respuesta del API:**

```json
{
  "error": true,
  "errors": [
    {
      "field": "lines[0].tax_totals",
      "message": "Las exportaciones no pueden tener IVA"
    }
  ]
}
```

**Incorrecto:**

```json
{
  "tax_totals": [
    {
      "tax_id": "1",
      "tax_amount": 19.00,
      "percent": 19
    }
  ]
}
```

❌ **INCORRECTO**: Los documentos de exportación no pueden tener impuestos

**Correcto:**

```json
{
  "tax_totals": []
}
```

✓ **CORRECTO**: Array vacío para exportaciones

---

## 🎯 Matriz de Solución Rápida

:::info ⚡ Referencia Rápida de Errores
Encuentra rápidamente la causa probable y la solución recomendada para el código o mensaje recibido:
:::

| 🔍 Síntoma | 🐛 Causa Probable | ✅ Solución |
|---------|---|---|
| `401 Unauthorized` | 🔐 Token expirado | 🔄 Obtén nuevo token |
| `invalid_json` | 📝 JSON malformado | ✔️ Valida sintaxis JSON |
| `NIT verificador inválido` | 🔢 Dígito incorrecto | 🔍 Usa herramienta NITValidator |
| `Total no coincide` | 🧮 Cálculo de suma | 📊 Valida con TotalCalculator |
| `Tax not calculated correctly` | 💰 Fórmula impuesto | 🎯 Usa: amount = base × (percent/100) |
| `400 ... ya se encuentra validado.` | 🔄 Número ya validado | 🔍 Consulta `GET /status`; ➕ usa el siguiente número |
| `409 DOCUMENT_IN_TRANSMISSION` | 🚦 Envío en paralelo del mismo número | ⏳ Espera y consulta el estado; no reenvíes en paralelo |
| `409 DOCUMENT_IN_VALIDATION` | ⏳ La DIAN sigue en `98` | 🔍 Consulta el estado en unos minutos con `data.document_key` |
| `503 DIAN_STATUS_UNAVAILABLE` | 🔌 No se confirmó el envío anterior (no se transmitió) | 🔄 Reintenta más tarde con el mismo número |
| `DOCUMENT_POSSIBLY_SENT` | 📡 Fallo después de transmitir | 🚫 No reemitas; consulta `GET /documents/{uuid}` |
| `409 uuid ya se usó` | 🆔 `uuid` anti-duplicados repetido | 🔍 Consulta ese documento o usa un `uuid` nuevo |
| `warnings` `ALREADY_*` | 🔁 Regla 90 conciliada | 📖 Revisa el `code` del aviso |
| `warnings` `PDF_NOT_GENERATED` / `EMAIL_NOT_SENT` | 📄 Falló un paso posterior | ✅ Documento válido: no lo reenvíes |
| `Currency invalid for export` | 💱 Moneda incorrecta | 💵 Usa currency_id: 272 (USD) |
| `Tax not allowed in export` | 🌎 IVA en exportación | ❌ Usa tax_totals: [] |
| `Discount exceeds amount` | 🏷️ Descuento > base | ⚖️ Asegura que amount ≤ base_amount |
| `Required field missing` | 📋 Campo faltante | 📖 Consulta documentación |

---

## 🛠️ Herramientas Disponibles

🔍 **NITValidator**  

Valida y calcula dígito verificador Módulo 11

✅ **JSONValidator**  

Valida estructura completa de la factura

🧮 **TotalCalculator**  

Calcula bases e impuestos automáticamente

👉 **[Abrir Herramientas Interactivas en el Navegador →](https://docs.matias-api.com/docs/interactive-tools.md)**

---

## 🔬 Debugging

:::tip 🎯 Guía de Depuración Paso a Paso
Sigue estos pasos para aislar y resolver rechazos de validación o comunicación:
:::

### 📡 Paso 1: Verificar Respuesta Completa

```bash
curl -X POST "{{url}}/invoice" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d @factura.json \
  -v  # Modo verbose para ver toda la respuesta
```

### ✔️ Paso 2: Validar Localmente

```bash
# Instalar jq para parsear JSON
npm install -g jq

# Validar que el JSON sea válido
cat factura.json | jq empty
```

### 📚 Paso 3: Comparar con Ejemplo Real

[📄 **Factura Simple** Ejemplo básico nacional](https://docs.matias-api.com/docs/jsons-billing/invoice.md)
[🏷️ **Con Descuento** Ejemplo con descuentos comerciales](https://docs.matias-api.com/docs/jsons-billing/invoice-with-discount.md)
[🌎 **Exportación** Ejemplo internacional en USD](https://docs.matias-api.com/docs/jsons-billing/USD-invoice-exportation.md)

---

## 🎯 Próximos Pasos

[📄 **Factura Simple** Guía básica paso a paso](https://docs.matias-api.com/docs/use-cases/simple-invoice.md)
[🏷️ **Factura con Descuentos** Descuentos por línea y globales](https://docs.matias-api.com/docs/use-cases/invoice-with-discounts.md)
[🌎 **Exportaciones** Facturas internacionales multimoneda](https://docs.matias-api.com/docs/use-cases/export-scenarios.md)
[🛠️ **Herramientas Interactivas** Validadores y calculadoras en vivo](https://docs.matias-api.com/docs/interactive-tools.md)

---

<!-- Fuente: https://docs.matias-api.com/docs/glossary -->

# 📚 Glosario Técnico

:::info 📖 Referencia Normativa y Conceptual
Este glosario contiene los **términos técnicos, normativas, acrónimos y conceptos principales** relacionados con la facturación electrónica, documentos equivalentes, nómina electrónica, RADIAN y el **Sector Salud (Resolución 000948 de 2026 / RIPS)** en Colombia.
:::

## 🗯️ Navegación Alfabética

[A](https://docs.matias-api.com/docs/glossary#a)
[B](https://docs.matias-api.com/docs/glossary#b)
[C](https://docs.matias-api.com/docs/glossary#c)
[D](https://docs.matias-api.com/docs/glossary#d)
[E](https://docs.matias-api.com/docs/glossary#e)
[F](https://docs.matias-api.com/docs/glossary#f)
[G](https://docs.matias-api.com/docs/glossary#g)
[H](https://docs.matias-api.com/docs/glossary#h)
[I](https://docs.matias-api.com/docs/glossary#i)
[J](https://docs.matias-api.com/docs/glossary#j)
[L](https://docs.matias-api.com/docs/glossary#l)
[M](https://docs.matias-api.com/docs/glossary#m)
[N](https://docs.matias-api.com/docs/glossary#n)
[O](https://docs.matias-api.com/docs/glossary#o)
[P](https://docs.matias-api.com/docs/glossary#p)
[Q](https://docs.matias-api.com/docs/glossary#q)
[R](https://docs.matias-api.com/docs/glossary#r)
[S](https://docs.matias-api.com/docs/glossary#s)
[T](https://docs.matias-api.com/docs/glossary#t)
[U](https://docs.matias-api.com/docs/glossary#u)
[V](https://docs.matias-api.com/docs/glossary#v)
[W](https://docs.matias-api.com/docs/glossary#w)
[X](https://docs.matias-api.com/docs/glossary#x)
[Z](https://docs.matias-api.com/docs/glossary#z)

:::warning ⚠️ Nota Crítica: IDs de API vs Códigos DIAN
**Esta es la distinción más importante para utilizar la API correctamente:**
* **ID (Base de Datos API):** Número entero único usado en las peticiones JSON (ej: `type_document_id: 7` para Factura Electrónica).
* **Code (DIAN):** Código normativo de la DIAN, usado exclusivamente para referencia regulatoria (ej: Code `01` = Factura de Venta).

**🔑 REGLA FUNDAMENTAL:** En el cuerpo de las peticiones SIEMPRE utilizas el **ID numérico de la API**, NUNCA el código alfanumérico DIAN.
:::

---

## A

### Additional Document Reference (Documento Adicional de Referencia)
**Definición**: Grupo de datos que contiene referencias a documentos comerciales o de soporte adicionales.
* **Uso Obligatorio**: Facturas tipo 03 (Factura de Contingencia) para referenciar el documento de papel o talonario original.
* **Estructura**: `number`, `uuid` (CUFE/CUDE), `scheme_name`, `date`, `code`.

---

### ADRES
**Definición**: Administradora de los Recursos del Sistema General de Seguridad Social en Salud. Entidad pública adscrita al MinSalud que administra los recursos financieros del SGSSS y efectúa pagos/giros directos a prestadores y proveedores.

---

### Ambiente de Destino
**Definición**: El entorno al cual se envía el documento electrónico.
* **Producción (`1`)**: Ambiente real con validez fiscal y transmisión directa a la DIAN.
* **Pruebas / Habilitación (`2`)**: Ambiente del set de pruebas para validar habilitación de software.

---

### Anticipo (`advance`)
**Definición**: Valor monetario entregado con anterioridad a la prestación del servicio que se legaliza y descuenta en la factura electrónica en ejecución del contrato pactado.

---

### ARL
**Definición**: Administradora de Riesgos Laborales. Entidad responsable de financiar y prestar servicios de salud derivados de accidentes de trabajo y enfermedades laborales.

---

## B

### Base Imponible
**Definición**: Valor sobre el cual se calcula el porcentaje de impuesto (IVA, INC, Retención) aplicable a cada línea o al total del documento.

---

### Buzón de Recepción
**Definición**: Dirección de correo única por empresa, con la forma `{identificador}@{dominio}`, a la que los proveedores envían sus facturas electrónicas para que la API las registre como recepciones. Se asigna al registrar la primera [persona de recepción](https://docs.matias-api.com/docs/glossary#persona-de-recepcion) y no cambia. Se consulta con `GET /events/mailbox/address`. Ver [Buzón de recepción](https://docs.matias-api.com/docs/endpoints/events-radian#buzon-recepcion).

---

## C

### Certificado Digital
**Definición**: Archivo criptográfico PKCS#12 (`.p12` o `.pfx`) emitido por una entidad de certificación acreditada (ONAC) que garantiza la autoría, integridad y no repudio de los documentos XML transmitidos a la DIAN.

---

### Cobertura o Plan de Beneficios (`coverage`)
**Definición**: Plan de beneficios en salud bajo el cual se prestan los servicios (ej. Plan de Beneficios en Salud - UPC, Plan Complementario, Pólizas de Salud, SOAT).

---

### Contingencia
**Definición**: Mecanismo operativo que permite emitir facturas cuando se presentan fallas técnicas atribuibles a la DIAN (Contingencia Tipo 04) o al facturador (Contingencia Tipo 03).

---

### Copago (`copayment`)
**Definición**: Aporte en dinero correspondiente a una parte del valor del servicio cubierto por el Plan de Beneficios en Salud, a cargo exclusivo de los beneficiarios del régimen contributivo.

---

### Correo Retenido
**Definición**: Correo del [buzón de recepción](https://docs.matias-api.com/docs/glossary#buzon-de-recepcion) que llegó cuando el plan de pago de la empresa estaba vencido. Queda con `status` `IGNORED` y `reason_code` `PLAN_EXPIRED` (`is_held` = `true`), no consume cupo y se procesa automáticamente al renovar el plan si no han pasado más de 30 días desde su llegada (también con `POST /events/mailbox/{id}/retry`). Una suscripción de pago **cancelada** no retiene correos: quedan `IGNORED` sin retención. Ver [Correos retenidos](https://docs.matias-api.com/docs/endpoints/events-radian#correos-retenidos).

---

### CUCON
**Definición**: Código Único de Facturación Electrónica en Contingencia.

---

### CUDE
**Definición**: Código Único de Documento Electrónico. Cadena criptográfica SHA-384 que identifica unívocamente notas crédito, notas débito, documentos soporte y documentos equivalentes POS.

---

### CUFE
**Definición**: Código Único de Facturación Electrónica. Cadena criptográfica generada mediante algoritmo SHA-384 que identifica de manera única e irrepetible cada factura electrónica de venta autorizada por la DIAN.

---

### CUNE
**Definición**: Código Único de Nómina Electrónica. Identificador unívoco generado a partir de los datos de liquidación del Documento Soporte de Pago de Nómina Electrónica.

---

### Cuota Moderadora (`moderator_fee`)
**Definición**: Pago monetario que regula la utilización de los servicios de salud y estimula su buen uso, a cargo de cotizantes y beneficiarios en el régimen contributivo.

---

## D

### DIAN
**Definición**: Dirección de Impuestos y Aduanas Nacionales. Autoridad tributaria, aduanera y cambiaria de Colombia encargada de regular y validar los documentos fiscales electrónicos.

---

### Dígito Verificador (DV)
**Definición**: Cifra numérica calculada mediante el algoritmo oficial módulo 11 de la DIAN que valida la integridad y congruencia del NIT.

---

### Documento Equivalente POS Electrónico
**Definición**: Documento electrónico (tipo `20`) que reemplaza la tradicional tirilla de máquina registradora POS y otorga derecho a deducción de costos y gastos cuando identifica al adquirente.

---

### Documento Soporte Electrónico (DS)
**Definición**: Documento electrónico (tipo `11`) expedido por el comprador para soportar transacciones con personas o proveedores no obligados a expedir factura de venta.

---

## E

### EPS
**Definición**: Entidad Promotora de Salud. Entidad responsable de la afiliación, registro y recaudo de cotizaciones de los usuarios en el sistema de salud colombiano.

---

### Eventos RADIAN
**Definición**: Mensajes electrónicos oficiales transmitidos a la DIAN para gestionar el ciclo de vida de la factura electrónica como título valor:
* **Evento 030**: Acuse de recibo de la factura.
* **Evento 031**: Reclamo de la factura (con `claim_code` del `01` al `04`).
* **Evento 032**: Recibo de bienes y/o servicios.
* **Evento 033**: Aceptación expresa.

Solo aplican a **facturas electrónicas de venta a crédito**: las facturas de contado (o sin medio de pago) y las notas crédito/débito no admiten eventos. Ver [Eventos RADIAN](https://docs.matias-api.com/docs/endpoints/events-radian.md).

---

## F

### Factura Electrónica de Venta (FEV)
**Definición**: Título valor digital que soporta transacciones de compraventa de bienes o prestación de servicios, validado previamente en tiempo real por la DIAN antes de su entrega al adquirente.

---

### Factura del Sector Salud
**Definición**: Factura electrónica que incorpora el objeto regulatorio `health` conforme a la **Resolución 000948 de 2026**, integrando la información estructurada de atenciones de salud con los RIPS.

---

## G

### Generación de Documentos
**Definición**: Proceso de estructuración y validación sintáctica del JSON de entrada para construir el XML conforme al estándar UBL 2.1 antes de la firma digital.

---

### Geolocalización DANE
**Definición**: Codificación oficial de departamentos y municipios establecida por el Departamento Administrativo Nacional de Estadística (DANE) utilizada en los campos `city_id` y `department_id`.

---

## H

### Health (Objeto `health`)
**Definición**: Objeto JSON opcional pero obligatorio para facturas del sector salud. Contiene información asistencial, periodos de atención, modalidad de pago, copagos y cuotas moderadoras.

---

## I

### ICA
**Definición**: Impuesto de Industria y Comercio. Tributo territorial municipal que grava la realización de actividades industriales, comerciales o de servicios.

---

### INCOTERM
**Definición**: Términos internacionales de comercio (ej. FOB, CIF, EXW) requeridos en facturas de exportación para definir responsabilidades entre comprador y vendedor.

---

### IPS
**Definición**: Institución Prestadora de Servicios de Salud. Hospitales, clínicas, laboratorios y centros médicos habilitados para prestar servicios de salud.

---

### IVA
**Definición**: Impuesto sobre las Ventas. Tributo nacional indirecto de valor agregado que grava la venta de bienes y la prestación de servicios (tarifas estándar: 0%, 5%, 19%).

---

## J

### JSON (JavaScript Object Notation)
**Definición**: Formato estándar de intercambio de datos ligero y legible por humanos utilizado en toda la API de MATIAS para el envío y recepción de información.

---

## L

### Línea de Factura (`lines`)
**Definición**: Array de ítems o conceptos facturados que detalla cantidades, precios unitarios, descuentos, tributos y descripciones del servicio o producto.

---

### Lote Masivo (Bulk)
**Definición**: Conjunto de múltiples documentos electrónicos enviados de manera agrupada mediante `POST /bulk/documents` para procesamiento en cola asíncrona.

---

## M

### Magic Values
**Definición**: Catálogo de 32 cabeceras HTTP especiales (`X-Sandbox-Force-Status`) utilizables en el ambiente Sandbox para simular rechazos, códigos de error y respuestas DIAN específicas.

---

### Modalidad de Pago (Salud)
**Definición**: Mecanismo contractual de pago de servicios de salud entre prestadores y pagadores (ej. Pago por evento `01`, Pago por capitación `02`, Pago por conjunto integral `03`).

---

### Modo de Eventos (Automático / Manual)
**Definición**: Configuración de la empresa (`send_events`) que define qué eventos RADIAN se generan sin intervención del usuario al registrar una factura a crédito (buzón o importación por Excel/CUFE). **Automático** (`true`): se crean y envían el `030`, el `032` y el `033`. **Manual** (`false`, valor inicial de una empresa nueva): no se crea ninguno, tampoco el `030`; el usuario los envía con `POST /events/send/{trackId}` o `POST /events/send-bulk`. Se cambia con `PUT /events/reception-people/mode`.

---

## N

### NIT
**Definición**: Número de Identificación Tributaria asignado por la DIAN para la individualización de personas jurídicas y naturales en Colombia.

---

### Nómina Electrónica
**Definición**: Documento soporte de pago de nómina electrónica y notas de ajuste que sustentan los costos deducibles derivados de pagos laborales.

---

### Nota Crédito
**Definición**: Documento electrónico (tipo `5`) utilizado para anular facturas, conceder descuentos posteriores o registrar devoluciones de mercancías.

---

### Nota Débito
**Definición**: Documento electrónico (tipo `4`) utilizado para registrar cargos adicionales, intereses de mora o aumentos de valor sobre facturas previamente emitidas.

---

## O

### ONAC
**Definición**: Organismo Nacional de Acreditación de Colombia. Entidad responsable de acreditar a las Entidades de Certificación Digital que emiten certificados de firma válidos ante la DIAN.

---

### Operación de Facturación
**Definición**: Código paramétrico (`operation_type_id`) que define el tipo de operación mercantil (ej. Estándar `1`, Servicios `2`, Salud `7`).

---

## P

### Pago Compartido (`shared_payments`)
**Definición**: Montos recaudados por el prestador en planes voluntarios de salud (medicina prepagada, planes complementarios) a cargo del usuario o titular.

---

### Persona de Recepción
**Definición**: Persona cuyos datos firman (acusan, reciben, aceptan o reclaman) los eventos RADIAN de la empresa. Una empresa puede tener varias, con una **por defecto**: la que firma los eventos automáticos del buzón y la que se usa cuando no se indica `reception_person_uuid`. La persona indicada al importar por Excel o CUFE firma solo los eventos automáticos de esa recepción; los envíos manuales usan la persona de su propia solicitud o la por defecto. Se administra con `/events/reception-people`. Ver [Personas de recepción](https://docs.matias-api.com/docs/endpoints/events-radian#personas-recepcion).

---

### Personal Access Token (PAT)
**Definición**: Token de autenticación de larga duración (JWT estándar basado en Laravel Passport) que permite autenticar peticiones API desde sistemas ERP o servidores backend.

---

### P.O.S (Point of Sale)
**Definición**: Punto de venta o caja registradora donde se originan transacciones comerciales directas con el consumidor final.

---

## Q

### QR Code (Código QR)
**Definición**: Código bidimensional de respuesta rápida generado e insertado obligatoriamente en la representación gráfica (PDF) que enlaza al catálogo público de validación de la DIAN.

---

## R

### RADIAN
**Definición**: Plataforma oficial administrada por la DIAN que registra y custodia los eventos y operaciones de factoring electrónico sobre facturas electrónicas de venta como título valor.

---

### RECEPTION_NOT_IN_PLAN
**Definición**: Código de error (`error_code`) de la respuesta `403` que devuelve todo el módulo de recepción (`/events/*`: eventos RADIAN, importación, buzón y personas de recepción) cuando la empresa no tiene un plan de pago vigente (plan FREE, plan vencido o sin suscripción). Para una sub-cuenta cuenta el plan de su Casa de Software. Reemplaza al código `MAILBOX_NOT_IN_PLAN`, que el buzón ya no emite. Ver [Requisito de plan](https://docs.matias-api.com/docs/endpoints/events-radian#requisito-de-plan).

---

### REPS
**Definición**: Registro Especial de Prestadores de Servicios de Salud del Ministerio de Salud y Protección Social. Contiene el código de habilitación (`provider_code`) de las IPS y profesionales del país.

---

### RIPS
**Definición**: Registro Individual de Prestación de Servicios de Salud. Conjunto de datos estructurados de atenciones en salud que constituye el soporte obligatorio de la Factura Electrónica en salud conforme a la **Resolución 000948 de 2026**.

---

### RUT
**Definición**: Registro Único Tributario. Mecanismo de identificación administrado por la DIAN que clasifica la responsabilidad fiscal de los contribuyentes.

---

## S

### Sector Salud (FEV Salud)
**Definición**: Régimen especial de emisión de facturación electrónica obligatorio para prestadores de servicios y proveedores de tecnologías en salud reglamentado por el MinSalud y la DIAN.

---

### SOAT
**Definición**: Seguro Obligatorio de Accidentes de Tránsito. Cobertura obligatoria para víctimas de accidentes de tránsito que se referencia con código `04` en `health.coverage` y requiere `health.policy_number`.

---

## T

### TRM
**Definición**: Tasa Representativa del Mercado. Tipo de cambio oficial peso colombiano / dólar estadounidense certificado por la Superintendencia Financiera de Colombia.

---

## U

### UBL 2.1
**Definición**: Universal Business Language (versión 2.1). Estándar XML internacional adoptado por la DIAN para la estructura formal de los documentos tributarios electrónicos en Colombia.

---

### UPC (Unidad de Pago por Capitación)
**Definición**: Valor anual que reconoce el Estado a las EPS por cada afiliado para garantizar la prestación de los servicios del Plan de Beneficios en Salud.

---

## V

### Validación Previa
**Definición**: Mecanismo tecnológico mediante el cual la DIAN revisa y valida en tiempo real las reglas fiscales y aritméticas del XML antes de autorizar su entrega legal al adquirente.

---

## W

### Webhook
**Definición**: Mecanismo de notificación HTTP asíncrono en tiempo real mediante el cual la API avisa a tu servidor cuando un documento o evento cambia de estado o completa su validación ante la DIAN.

---

## X

### XML
**Definición**: Extensible Markup Language. Formato de texto estructurado en el que se codifican, firman y transmiten los documentos electrónicos ante la DIAN.

---

## Z

### ZIP (Contenedor AttachedDocument)
**Definición**: Archivo comprimido `.zip` generado por la API que contiene el documento XML firmado electrónicamente junto con el `ApplicationResponse` oficial de aprobación emitido por la DIAN.

---

## 📊 Tablas de Referencia Rápida

### 📄 Identificadores de Tipos de Documento en la API (`type_document_id`)

| ID (API) | Código DIAN | Tipo de Documento | Endpoint Principal | Identificador Criptográfico |
|:---:|:---:|---|---|:---:|
| **7** | `01` | Factura Electrónica de Venta (Estándar / Salud) | `POST /invoice` | CUFE |
| **8** | `02` | Factura de Exportación | `POST /invoice` | CUFE |
| **9** | `03` | Factura de Contingencia (Tipo 03) | `POST /invoice` | CUFE |
| **10** | `04` | Factura de Contingencia (Tipo 04) | `POST /invoice` | CUFE |
| **11** | `05` | Documento Soporte Electrónico | `POST /ds/document` | CUDS / CUDE |
| **20** | `20` | Documento Equivalente POS Electrónico | `POST /invoice` | CUDE |
| **5** | `91` | Nota Crédito Electrónica | `POST /notes/credit` | CUDE |
| **4** | `92` | Nota Débito Electrónica | `POST /notes/debit` | CUDE |

---

### 🆔 Tipos de Identificación (`identity_document_id`)
| ID (API) | Documento |
|:---:|---|
| **1** | Cédula de Ciudadanía |
| **2** | NIT |
| **3** | Cédula de Extranjería |
| **4** | Tarjeta de Identidad |
| **5** | Pasaporte |
| **6** | Documento de Identificación Extranjero |
| **10** | Sin identificación del exterior / Consumidor Final |

---

### 🏛️ Tipos de Organización (`type_organization_id`)
| ID (API) | Organización |
|:---:|---|
| **1** | Persona Jurídica |
| **2** | Persona Natural |

---

📅 **Versión:** 3.7.0 (Agosto 2026) •
📚 **Términos:** 150+ definiciones completas •
🎯 **Nivel:** ⭐⭐⭐ Referencia Técnica y Normativa
