---
sidebar_position: 11
sidebar_label: 🏢 Empresa
---

# 🏢 Empresa

> ✅ **Autenticación REQUERIDA**
> Incluir en todos los endpoints de esta sección el header: `Authorization: Bearer {token}`

:::info ¿Dónde obtener el `client_uuid`? — Parámetro Multi-Tenant para Casas de Software
Si operas como **Casa de Software** o **Cuenta Principal**, puedes configurar y administrar tus empresas cliente agregando el parámetro `client_uuid` en la query string de la URL:
- **URL con Query Param:** `{{url}}/company/settings?client_uuid={{client_uuid}}`
- **Header:** `Authorization: Bearer {token_cuenta_principal}`
- **Comportamiento:** La operación se aplicará sobre la empresa cliente indicada por su UUID.

**¿Dónde encontrar el `client_uuid` de tus clientes?**  
Puedes consultar el listado completo de tus empresas cliente y sus respectivos `client_uuid` mediante el endpoint:
```http
GET {{url}}/company/customers
Authorization: Bearer {token}
Content-Type: application/json
```
:::

## Obtener configuración de la empresa

### Obtener configuración de la empresa - 🔵 GET
```http
GET {{url}}/company/settings
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Respuesta Exitosa (HTTP 200):**
```json
{
  "settings": {}
}
```

---

## Actualizar configuración de la empresa

### Actualizar configuración de la empresa - 🟠 PUT
```http
PUT {{url}}/company/settings
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Body (JSON):**
```json
{
  "setting_key": "invoice_prefix",
  "setting_value": "FV"
}
```

**Respuesta Exitosa (HTTP 200):**
```json
{}
```

---

## Deshabilitar un cliente

### Deshabilitar un cliente - 🔴 DELETE
```http
DELETE {{url}}/company/customers/{client_uuid}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Desactiva la cuenta de una empresa cliente asociada a la Casa de Software. La empresa pasa a estado inactivo (`active: 0`), impidiendo la emisión de nuevos documentos electrónicos hasta que sea reactivada.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | path | ✅ Sí | UUID de la empresa cliente a deshabilitar. |

**Respuesta Exitosa (HTTP 200):**
```json
{
  "success": true,
  "message": "Cliente deshabilitado exitosamente"
}
```

---

## Habilitar un cliente

### Habilitar un cliente - 🟘 POST
```http
POST {{url}}/company/customers/{client_uuid}/enable
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Reactiva la cuenta de una empresa cliente previamente deshabilitada (`active: 1`), restaurando su operatividad en la plataforma.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | path | ✅ Sí | UUID de la empresa cliente a habilitar. |

**Respuesta Exitosa (HTTP 200):**
```json
{
  "success": true,
  "message": "Cliente habilitado exitosamente"
}
```

---

## Listar clientes de la empresa (Casas de Software)

### Listar clientes de la empresa - 🔵 GET
```http
GET {{url}}/company/customers
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Retorna el listado completo de todas las empresas cliente asociadas a la cuenta principal (Casa de Software). Cada registro incluye su `client_uuid` (identificador único para ejecutar peticiones delegadas mediante `?client_uuid={{client_uuid}}`), datos fiscales y estado de activación.

**Respuesta Exitosa (HTTP 200):**
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

---

## Obtener información de la empresa

### Obtener información de la empresa - 🔵 GET
```http
GET {{url}}/company
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Respuesta Exitosa (HTTP 200):**
```json
{}
```

---

## Actualizar Empresa

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

### Actualizar Empresa - 🟠 PUT
```http
PUT {{url}}/company/{uuid}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Actualiza todos los datos fiscales, comerciales, de contacto y configuración de la empresa identificada por su `uuid`.

:::info 💡 Guía para Desarrolladores — Formato del Payload `records`
Los 20 campos de datos de la empresa se encapsulan dentro de un objeto `records` serializado en formato JSON (`stringified JSON`).
:::

<Tabs>
<TabItem value="js" label="JavaScript / Node.js" default>

```javascript
import axios from 'axios';

const records = {
  country_id: 45,
  city_id: 836,
  identity_document_id: 3,
  type_organization_id: 1,
  tax_regime_id: 1,
  tax_level_id: 4,
  company_name: "LOPEZSOFT S.A.S.",
  trade_name: "",
  dni: "901091403",
  dv: "2",
  address: "Calle 64 # 1631 Apto 201 barrio La Capilla",
  merchant_registration: "156722",
  location: "",
  postal_code: "610111",
  mobile: "310 843 5431",
  phone: "(036) 338 9625",
  email: "gerencia@lopezsoft.net.co",
  web: "https://lopezsoft.net.co/",
  imgdata: "", // Opcional: Base64 de la imagen del logo
  active: 1
};

const response = await axios.put(`${url}/company/${uuid}`, {
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
    'country_id'            => 45,
    'city_id'               => 836,
    'identity_document_id'  => 3,
    'type_organization_id'  => 1,
    'tax_regime_id'         => 1,
    'tax_level_id'          => 4,
    'company_name'          => 'LOPEZSOFT S.A.S.',
    'trade_name'            => '',
    'dni'                   => '901091403',
    'dv'                    => '2',
    'address'               => 'Calle 64 # 1631 Apto 201',
    'merchant_registration' => '156722',
    'postal_code'           => '610111',
    'mobile'                => '310 843 5431',
    'email'                 => 'gerencia@lopezsoft.net.co',
    'active'                => 1,
];

$payload = json_encode(['records' => json_encode($records)]);

$ch = curl_init("{$url}/company/{$uuid}");
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
import json
import requests

records = {
    "country_id": 45,
    "city_id": 836,
    "identity_document_id": 3,
    "type_organization_id": 1,
    "tax_regime_id": 1,
    "tax_level_id": 4,
    "company_name": "LOPEZSOFT S.A.S.",
    "dni": "901091403",
    "dv": "2",
    "address": "Calle 64 # 1631 Apto 201",
    "email": "gerencia@lopezsoft.net.co",
    "active": 1
}

response = requests.put(
    f"{url}/company/{uuid}",
    json={"records": json.dumps(records)},
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
    country_id: 45,
    city_id: 836,
    identity_document_id: 3,
    type_organization_id: 1,
    tax_regime_id: 1,
    tax_level_id: 4,
    company_name: "LOPEZSOFT S.A.S.",
    trade_name: "",
    dni: "901091403",
    dv: "2",
    address: "Calle 64 # 1631 Apto 201 barrio La Capilla",
    merchant_registration: "156722",
    location: "",
    postal_code: "610111",
    mobile: "310 843 5431",
    phone: "(036) 338 9625",
    email: "gerencia@lopezsoft.net.co",
    web: "https://lopezsoft.net.co/",
    imgdata: "",
    active: 1,
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
| `uuid` | path | ✅ Sí | UUID de la empresa a actualizar. |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Body JSON resultante:**
```json
{
  "records": "{\"country_id\":45,\"city_id\":836,\"identity_document_id\":3,\"type_organization_id\":1,\"tax_regime_id\":1,\"tax_level_id\":4,\"company_name\":\"LOPEZSOFT S.A.S.\",\"trade_name\":\"\",\"dni\":\"901091403\",\"dv\":\"2\",\"address\":\"Calle 64 # 1631 Apto 201 barrio La Capilla\",\"merchant_registration\":\"156722\",\"location\":\"\",\"postal_code\":\"610111\",\"mobile\":\"310 843 5431\",\"phone\":\"(036) 338 9625\",\"email\":\"gerencia@lopezsoft.net.co\",\"web\":\"https://lopezsoft.net.co/\",\"imgdata\":\"\",\"active\":1}"
}
```

| Propiedad en `records` | Tipo | Requerido | Descripción |
|---|---|---|---|
| `country_id` | integer | ✅ Sí | ID del país (`45` para Colombia). |
| `city_id` | integer | ✅ Sí | ID del municipio/ciudad según catálogo DIAN. |
| `identity_document_id` | integer | ✅ Sí | Tipo de documento (`3` para NIT, `1` para Cédula). |
| `type_organization_id` | integer | ✅ Sí | Tipo de organización (`1` Persona Jurídica, `2` Persona Natural). |
| `tax_regime_id` | integer | ✅ Sí | Régimen fiscal (`1` Responsable de IVA, `2` No responsable). |
| `tax_level_id` | integer | ✅ Sí | Responsabilidad fiscal (`4` No aplica - Otros, `5` R-99-PN). |
| `company_name` | string | ✅ Sí | Razón social o nombre completo del emisor. |
| `trade_name` | string | No | Nombre comercial de la empresa. |
| `dni` | string | ✅ Sí | NIT o número de identificación sin dígito de verificación. |
| `dv` | string | ✅ Sí | Dígito de verificación. |
| `address` | string | ✅ Sí | Dirección fiscal completa. |
| `merchant_registration` | string | No | Matrícula mercantil. |
| `location` | string | No | Ubicación complementaria / barrio. |
| `postal_code` | string | No | Código postal. |
| `mobile` | string | No | Teléfono móvil. |
| `phone` | string | No | Teléfono fijo. |
| `email` | string | ✅ Sí | Correo electrónico de recepción y notificaciones. |
| `web` | string | No | Sitio web corporativo. |
| `imgdata` | string | No | Logo codificado en Base64. |
| `active` | integer | ✅ Sí | Estado de la empresa (`1` activa, `0` inactiva). |

**Respuesta Exitosa (HTTP 200):**
```json
{
  "success": true,
  "message": "Empresa actualizada exitosamente"
}
```

---

## Obtener estadísticas de un cliente específico de la Casa de Software

### Obtener estadísticas de un cliente específico de la Casa de Software - 🔵 GET
```http
GET {{url}}/company/customers/{uuid}/stats
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `uuid` | path | ✅ Sí | UUID del cliente a consultar. |

**Respuesta Exitosa (HTTP 200):**
```json
{
  "customer": {},
  "stats": {},
  "subscription": {}
}
```

---

## Crear un nuevo cliente (sub-cuenta) para una empresa desarrolladora

### Crear un nuevo cliente (sub-cuenta) para una empresa desarrolladora - 🟘 POST
```http
POST {{url}}/company/{uuid}/customer
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `uuid` | path | ✅ Sí | UUID de la empresa padre (desarrolladora). |

**Body (JSON):**
```json
{
  "first_name": "Juan",
  "last_name": "Pérez",
  "company_name": "Cliente SAS",
  "email": "cliente@empresa.com",
  "password": "string",
  "password_confirmation": "string",
  "dni": "900123456",
  "country_id": 45,
  "city_id": 149,
  "address": "Calle 123",
  "mobile": "+573001234567",
  "phone": "+5712345678"
}
```

**Respuesta Exitosa (HTTP 200):**
```json
{
  "message": "Cliente creado con éxito, ya puede iniciar sesión. No es necesario verificar el correo electrónico."
}
```

---

## Actualizar Datos del Cliente - 🟠 PUT

```http
PUT {{url}}/company/customers/{client_uuid}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | path | ✅ Sí | UUID del cliente a actualizar. |

**Body (JSON):**
```json
{
  "company_name": "LOPEZSOFT S.A.S",
  "email": "correo@empresa.com",
  "mobile": "+573001234567"
}
```

---

## Actualizar Logo/Imagen de la Empresa - 🟠 PUT

```http
PUT {{url}}/company/{uuid}/image?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Permite actualizar el logo/imagen de la empresa enviando la imagen codificada en **Base64** dentro del objeto `records`.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `uuid` | path | ✅ Sí | UUID de la empresa. |
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

**Body (JSON):**
```json
{
  "records": "{\"imgdata\":\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...\"}"
}
```

:::info 💡 Guía para Desarrolladores — Logo en Base64
Convierte el logotipo (PNG/JPG) a Base64 con el prefijo Data URI y envíalo en la propiedad `imgdata` dentro de `records`.
:::

<Tabs>
<TabItem value="js" label="JavaScript / Node.js" default>

```javascript
import fs from 'fs';
import axios from 'axios';

const imgBuffer = fs.readFileSync('logo.png');
const base64Img = 'data:image/png;base64,' + imgBuffer.toString('base64');

const response = await axios.put(`${url}/company/${uuid}/image`, {
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

$ch = curl_init("{$url}/company/{$uuid}/image");
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
    f"{url}/company/{uuid}/image",
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

---

## Actualizar Imagen del Cliente - 🟠 PUT

```http
PUT {{url}}/company/customers/{client_uuid}/image
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Permite a una Casa de Software actualizar el logo de una empresa cliente específica enviando la imagen en **Base64**.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | path | ✅ Sí | UUID del cliente cuya imagen se actualizará. |

**Body (JSON):**
```json
{
  "records": "{\"imgdata\":\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...\"}"
}
```
