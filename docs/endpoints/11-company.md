---
sidebar_position: 11
sidebar_label: 🏢 Empresa
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 🏢 Empresa {#empresa}

:::warning Autenticación Requerida
Incluir en todos los endpoints: `Authorization: Bearer {token}`
:::

:::info Parámetro Multi-Tenant: `client_uuid`
Agrega `?client_uuid={{client_uuid}}` para operar sobre empresas cliente (Casa de Software).
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

</details>

<details>
<summary><span className="badge badge--warning margin-right--sm">PUT</span> <b>/company/settings</b> — Actualizar Configuración</summary>

```http
PUT {{url}}/company/settings?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

```json
{
  "setting_key": "invoice_prefix",
  "setting_value": "FV"
}
```

</details>

---

## 🏢 Datos de la Empresa {#datos-empresa}

<details open>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/company</b> — Obtener Información de la Empresa</summary>

```http
GET {{url}}/company?client_uuid={{client_uuid}}
Authorization: Bearer {token}
```

</details>

<details>
<summary><span className="badge badge--warning margin-right--sm">PUT</span> <b>/company/&#123;uuid&#125;</b> — Actualizar Empresa</summary>

```http
PUT {{url}}/company/{uuid}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

:::info Formato del payload `records`
Los datos de la empresa se encapsulan dentro de un objeto `records` serializado en JSON string.
:::

**Campos de `records`:**

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `country_id` | integer | ✅ | ID del país (`45` Colombia) |
| `city_id` | integer | ✅ | ID de la ciudad/municipio DIAN |
| `identity_document_id` | integer | ✅ | Tipo de documento (`3` NIT, `1` Cédula) |
| `type_organization_id` | integer | ✅ | `1` Jurídica, `2` Natural |
| `tax_regime_id` | integer | ✅ | `1` Responsable IVA, `2` No responsable |
| `tax_level_id` | integer | ✅ | `4` No aplica, `5` R-99-PN |
| `company_name` | string | ✅ | Razón social o nombre completo |
| `trade_name` | string | No | Nombre comercial |
| `dni` | string | ✅ | NIT sin dígito de verificación |
| `dv` | string | ✅ | Dígito de verificación |
| `address` | string | ✅ | Dirección fiscal completa |
| `merchant_registration` | string | No | Matrícula mercantil |
| `location` | string | No | Barrio / ubicación complementaria |
| `postal_code` | string | No | Código postal |
| `mobile` | string | No | Teléfono móvil |
| `phone` | string | No | Teléfono fijo |
| `email` | string | ✅ | Correo de notificaciones |
| `web` | string | No | Sitio web corporativo |
| `imgdata` | string | No | Logo en Base64 |
| `active` | integer | ✅ | `1` activa, `0` inactiva |

<Tabs>
<TabItem value="js" label="JavaScript / Node.js" default>

```javascript
const records = {
  country_id: 45, city_id: 836, identity_document_id: 3,
  type_organization_id: 1, tax_regime_id: 1, tax_level_id: 4,
  company_name: "LOPEZSOFT S.A.S.", trade_name: "", dni: "901091403",
  dv: "2", address: "Calle 64 # 1631 Apto 201", merchant_registration: "156722",
  location: "", postal_code: "610111", mobile: "310 843 5431",
  phone: "(036) 338 9625", email: "gerencia@lopezsoft.net.co",
  web: "https://lopezsoft.net.co/", imgdata: "", active: 1
};
const response = await axios.put(`${url}/company/${uuid}`, {
  records: JSON.stringify(records)
}, { headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' } });
```

</TabItem>
<TabItem value="php" label="PHP (cURL)">

```php
$records = [
    'country_id' => 45, 'city_id' => 836, 'identity_document_id' => 3,
    'type_organization_id' => 1, 'tax_regime_id' => 1, 'tax_level_id' => 4,
    'company_name' => 'LOPEZSOFT S.A.S.', 'dni' => '901091403', 'dv' => '2',
    'address' => 'Calle 64 # 1631 Apto 201', 'email' => 'gerencia@lopezsoft.net.co',
    'active' => 1,
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
    "country_id": 45, "city_id": 836, "identity_document_id": 3,
    "type_organization_id": 1, "tax_regime_id": 1, "tax_level_id": 4,
    "company_name": "LOPEZSOFT S.A.S.", "dni": "901091403", "dv": "2",
    "address": "Calle 64 # 1631 Apto 201", "email": "gerencia@lopezsoft.net.co", "active": 1
}
response = requests.put(f"{url}/company/{uuid}", json={"records": json.dumps(records)},
    headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"})
```

</TabItem>
<TabItem value="postman" label="Postman (Pre-request)">

```javascript
const records = {
    country_id: 45, city_id: 836, identity_document_id: 3,
    type_organization_id: 1, tax_regime_id: 1, tax_level_id: 4,
    company_name: "LOPEZSOFT S.A.S.", trade_name: "", dni: "901091403", dv: "2",
    address: "Calle 64 # 1631", merchant_registration: "156722", location: "",
    postal_code: "610111", mobile: "310 843 5431", phone: "(036) 338 9625",
    email: "gerencia@lopezsoft.net.co", web: "https://lopezsoft.net.co/",
    imgdata: "", active: 1,
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
  "message": "Empresa actualizada exitosamente"
}
```

</details>

</details>

<details>
<summary><span className="badge badge--warning margin-right--sm">PUT</span> <b>/company/&#123;uuid&#125;/image</b> — Actualizar Logo</summary>

```http
PUT {{url}}/company/{uuid}/image?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

:::info Logo en Base64
Convierte el logotipo PNG/JPG a Base64 con prefijo Data URI y envíalo en la propiedad `imgdata` dentro de `records`.
:::

<Tabs>
<TabItem value="js" label="JavaScript / Node.js" default>

```javascript
const imgBuffer = fs.readFileSync('logo.png');
const base64Img = 'data:image/png;base64,' + imgBuffer.toString('base64');
await axios.put(`${url}/company/${uuid}/image`, {
  records: JSON.stringify({ imgdata: base64Img })
}, { headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' } });
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$base64Img = 'data:image/png;base64,' . base64_encode(file_get_contents('logo.png'));
$payload = json_encode(['records' => json_encode(['imgdata' => $base64Img])]);
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
    json={"records": json.dumps({"imgdata": b64_img})},
    headers={"Authorization": f"Bearer {token}"})
```

</TabItem>
<TabItem value="postman" label="Postman (Pre-request)">

```javascript
const payload = { records: JSON.stringify({ imgdata: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..." }) };
pm.request.body.mode = 'raw'; pm.request.body.raw = JSON.stringify(payload);
pm.request.headers.add({key: 'Content-Type', value: 'application/json'});
```

</TabItem>
</Tabs>

</details>

---

## 👥 Gestión de Clientes (Casa de Software) {#clientes-casa-software}

<details open>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/company/customers</b> — Listar Clientes</summary>

```http
GET {{url}}/company/customers
Authorization: Bearer {token}
```

Retorna el listado completo de empresas cliente con su `client_uuid`, datos fiscales y estado de activación.

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "dataRecords": {
    "data": [
      {
        "client_uuid": "546fe314-7ca2-11f0-be83-d843ae899220",
        "company_name": "LOPEZSOFT S.A.S",
        "dni": "901091403",
        "email": "demo@lopezsoft.net.co",
        "address": "Cra 15 # 57-38",
        "is_active": true
      }
    ]
  }
}
```

</details>

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/company/&#123;uuid&#125;/customer</b> — Crear Cliente (sub-cuenta)</summary>

```http
POST {{url}}/company/{uuid}/customer
Authorization: Bearer {token}
Content-Type: application/json
```

| Parámetro | Ubicación | Requerido | Descripción |
|-----------|-----------|-----------|-------------|
| `uuid` | path | ✅ Sí | UUID de la empresa desarrolladora/casa de software. |

```json
{
  "first_name": "Juan", "last_name": "Pérez",
  "company_name": "Cliente SAS", "email": "cliente@empresa.com",
  "password": "string", "password_confirmation": "string",
  "dni": "900123456", "country_id": 45, "city_id": 149,
  "address": "Calle 123", "mobile": "+573001234567", "phone": "+5712345678"
}
```

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "message": "Cliente creado con éxito, ya puede iniciar sesión. No es necesario verificar el correo electrónico."
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
| `client_uuid` | path | ✅ Sí | UUID del cliente a actualizar. |

```json
{
  "company_name": "LOPEZSOFT S.A.S",
  "email": "correo@empresa.com",
  "mobile": "+573001234567"
}
```

</details>

<details>
<summary><span className="badge badge--warning margin-right--sm">PUT</span> <b>/company/customers/&#123;client_uuid&#125;/image</b> — Actualizar Imagen del Cliente</summary>

```http
PUT {{url}}/company/customers/{client_uuid}/image
Authorization: Bearer {token}
Content-Type: application/json
```

Permite a una Casa de Software actualizar el logo de una empresa cliente.

```json
{
  "records": "{\"imgdata\":\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...\"}"
}
```

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/company/customers/&#123;uuid&#125;/stats</b> — Estadísticas del Cliente</summary>

```http
GET {{url}}/company/customers/{uuid}/stats
Authorization: Bearer {token}
```

| Parámetro | Ubicación | Requerido |
|-----------|-----------|-----------|
| `uuid` | path | ✅ Sí |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "customer": {},
  "stats": {},
  "subscription": {}
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

Reactiva la cuenta de una empresa cliente previamente deshabilitada.

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{ "success": true, "message": "Cliente habilitado exitosamente" }
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
Desactiva la cuenta (`active: 0`) impidiendo la emisión de nuevos documentos. Se puede reactivar con `POST .../enable`.
:::

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{ "success": true, "message": "Cliente deshabilitado exitosamente" }
```

</details>

</details>
