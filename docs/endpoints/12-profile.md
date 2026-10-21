---
sidebar_position: 12
sidebar_label: 👤 Perfil
description: "Perfil del usuario autenticado: datos, tipos de usuario, imagen y cambio de correo."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 👤 Perfil {#perfil}

:::warning Autenticación Requerida
Incluir en todos los endpoints de esta sección el header: `Authorization: Bearer {token}`
:::

:::info Parámetro Multi-Tenant: `client_uuid`
Si operas como **Casa de Software**, puedes actualizar el perfil del usuario de una de tus sub-cuentas agregando `?client_uuid={{client_uuid}}` en los endpoints `PUT`. `GET /profile` y `GET /profile/types` no lo usan: siempre responden sobre el usuario del token.
:::

---

## 👤 Gestión del Perfil {#gestion-perfil}

<details open>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/profile</b> — Obtener Datos del Usuario</summary>

```http
GET {{url}}/profile
Authorization: Bearer {token}
Accept: application/json
```

**Descripción:** Retorna la información del usuario dueño del token y su tipo de usuario. Es equivalente a `GET /auth/user`.

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "dataRecords": {
    "data": [
      {
        "id": 1,
        "type_id": 2,
        "first_name": "JUAN",
        "last_name": "PEREZ",
        "email": "usuario@miempresa.com",
        "avatar": "users/1/profile/avatar.png",
        "active": 1,
        "name": "JUAN PEREZ",
        "avatarUrl": "https://sandbox-api.matias-api.com/storage/users/1/profile/avatar.png",
        "user_type": {
          "id": 2,
          "user_type_name": "DESARROLLADOR",
          "type": 2,
          "active": 1
        }
      }
    ]
  },
  "success": true
}
```

</details>

<details>
<summary>❌ No Autenticado (HTTP 401)</summary>

Requiere `Accept: application/json`; sin esa cabecera, la respuesta es una redirección (HTTP 302).

```json
{
  "message": "Unauthenticated."
}
```

</details>

</details>

<span id="tipos-usuario"></span>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/profile/types</b> — Listar Tipos de Usuario</summary>

```http
GET {{url}}/profile/types
Authorization: Bearer {token}
Accept: application/json
```

**Descripción:** Devuelve el catálogo de tipos de usuario, el valor de `type_id` en el perfil y en la respuesta del login.

| `type_id` | Tipo | Quién lo tiene |
|---|---|---|
| `1` | ADMINISTRADOR | Administración de la plataforma |
| `2` | DESARROLLADOR | Casa de Software / cuenta principal creada con `POST /register` |
| `3` | EMPRESA | No se asigna con `POST /register` ni al crear sub-cuentas |
| `4` | USUARIO | No se asigna con `POST /register` ni al crear sub-cuentas |
| `5` | CLIENTE | Usuario de una sub-cuenta creada por una Casa de Software (`POST /company/{uuid}/customer`) |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "records": [
    {
      "id": 1,
      "user_type_name": "ADMINISTRADOR",
      "type": 1,
      "active": 1
    },
    {
      "id": 2,
      "user_type_name": "DESARROLLADOR",
      "type": 2,
      "active": 1
    }
  ],
  "success": true
}
```

</details>

</details>

<details>
<summary><span className="badge badge--warning margin-right--sm">PUT</span> <b>/profile/&#123;id&#125;</b> — Actualizar Perfil de Usuario</summary>

```http
PUT {{url}}/profile/{id}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

:::caution Problema conocido
A la fecha, este endpoint valida la petición y responde `200`, pero **no guarda** los cambios de nombre, apellido ni avatar. No lo uses todavía para actualizar el perfil: para cambiar la imagen, usa [`PUT /profile/{id}/image`](#actualizar-imagen), y para el correo, [`PUT /profile/update-email`](#actualizar-correo).
:::

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `id` | path | ✅ Sí | ID del usuario. Debe ser el usuario de la empresa del token (o de la sub-cuenta indicada en `client_uuid`). |
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |
| `records` | body | ✅ Sí | Cadena JSON (`stringified JSON`) con los campos a cambiar. |

**Campos dentro de `records`:**

| Campo | Tipo | Descripción |
|---|---|---|
| `first_name` | `string` | Nombre |
| `last_name` | `string` | Apellido |
| `imgdata` | `string` | Opcional. Imagen del avatar en Base64 con prefijo Data URI |
| `imgname` | `string` | Nombre del archivo de la imagen. Obligatorio si se envía `imgdata` |

Cualquier otro campo se ignora. **El correo no se cambia aquí**: usa [`PUT /profile/update-email`](#actualizar-correo).

**Body (JSON):**

```json
{
  "records": "{\"first_name\":\"JUAN\",\"last_name\":\"PEREZ\"}"
}
```

<details>
<summary>✅ Respuesta (HTTP 200)</summary>

Devuelve el usuario **tal como estaba antes** de la petición.

```json
{
  "dataRecords": {
    "data": {
      "id": 1,
      "type_id": 2,
      "first_name": "JUAN",
      "last_name": "PEREZ",
      "email": "usuario@miempresa.com",
      "avatar": "users/1/profile/avatar.png",
      "active": 1,
      "name": "JUAN PEREZ",
      "avatarUrl": "https://sandbox-api.matias-api.com/storage/users/1/profile/avatar.png",
      "user_type": {
        "id": 2,
        "user_type_name": "DESARROLLADOR",
        "type": 2,
        "active": 1
      }
    }
  },
  "success": true
}
```

</details>

<details>
<summary>❌ El ID no Corresponde al Usuario (HTTP 400)</summary>

```json
{
  "message": "El usuario autenticado no coincide con el ID proporcionado",
  "success": false
}
```

</details>

<details>
<summary>❌ Falta `records` (HTTP 422)</summary>

Se recibe si se envían los campos sueltos en el body en lugar de dentro de `records`.

```json
{
  "message": "El campo records es requerido",
  "errors": {
    "records": [
      "El campo records es requerido"
    ]
  }
}
```

Si `records` no es un JSON válido, el mensaje es `El campo records debe ser un JSON válido`.

</details>

</details>

<span id="actualizar-correo"></span>

<details>
<summary><span className="badge badge--warning margin-right--sm">PUT</span> <b>/profile/update-email</b> — Actualizar Correo Electrónico</summary>

```http
PUT {{url}}/profile/update-email?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

**Descripción:** Cambia el correo electrónico del usuario. El nuevo correo no puede estar en uso por otro usuario. La API envía automáticamente un correo de verificación a la nueva dirección.

:::warning El correo queda sin verificar
Tras el cambio, el correo queda **sin verificar**: hasta abrir el enlace enviado a la nueva dirección, `POST /auth/login` responde **HTTP 404** con `El correo electrónico no ha sido verificado. Comuníquese con el administrador.` Los tokens ya emitidos siguen funcionando. Si el correo no llega, pide uno nuevo con [`POST /email/verification-notification`](/docs/endpoints/intro-auth#verificacion-correo).
:::

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |
| `email` | body | ✅ Sí | Nuevo correo (formato válido, máx. 255, no usado por otro usuario). |

**Body (JSON):**

```json
{
  "email": "nuevo-correo@miempresa.com"
}
```

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "message": "Correo electrónico actualizado exitosamente. Se ha enviado un correo de verificación a tu nuevo email.",
  "dataRecords": {
    "data": {
      "email": "nuevo-correo@miempresa.com",
      "email_verified_at": null,
      "previous_email": "usuario@miempresa.com",
      "verification_sent": true
    }
  },
  "success": true
}
```

</details>

<details>
<summary>❌ Error de Validación (HTTP 422)</summary>

```json
{
  "message": "Validación fallida",
  "errors": {
    "email": [
      "El correo electrónico ya está en uso, por favor elige otro correo electrónico. Si este es tu correo electrónico, por favor inicia sesión con él."
    ]
  },
  "success": false
}
```

Otros mensajes de `errors.email`: `El correo electrónico es obligatorio`, `El correo electrónico debe ser una dirección válida` y `El correo electrónico no puede exceder 255 caracteres`.

</details>

</details>

<span id="actualizar-imagen"></span>

<details>
<summary><span className="badge badge--warning margin-right--sm">PUT</span> <b>/profile/&#123;id&#125;/image</b> — Actualizar Imagen de Perfil</summary>

```http
PUT {{url}}/profile/{id}/image?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

**Descripción:** Permite actualizar el avatar del usuario enviando la imagen en Base64.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `id` | path | ✅ Sí | ID del usuario. Debe ser el usuario de la empresa del token (o de la sub-cuenta indicada en `client_uuid`). |
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |
| `records` | body | ✅ Sí | Cadena JSON (`stringified JSON`) con los campos de la imagen. |

**Campos dentro de `records`:**

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `id` | `integer` | ✅ Sí | El mismo ID del usuario del path. Sin él, la imagen se sube pero el avatar del perfil no cambia |
| `imgdata` | `string` | ✅ Sí | Imagen codificada en Base64 con prefijo Data URI (`data:image/png;base64,...`) |
| `imgname` | `string` | ✅ Sí | Nombre del archivo, con extensión (por ejemplo, `avatar.png`) |

**Body (JSON):**

```json
{
  "records": "{\"id\":1,\"imgname\":\"avatar.png\",\"imgdata\":\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...\"}"
}
```

:::info 💡 Guía para Desarrolladores — Imagen en Base64
Envía la imagen del avatar codificada en Base64 con prefijo Data URI en el campo `imgdata`, junto con `id` e `imgname`, dentro de `records`.
:::

<Tabs>
<TabItem value="js" label="JavaScript / Node.js" default>

```javascript
import fs from 'fs';
import axios from 'axios';

const imgBuffer = fs.readFileSync('avatar.png');
const base64Img = 'data:image/png;base64,' + imgBuffer.toString('base64');

const response = await axios.put(`${url}/profile/${userId}/image`, {
  records: JSON.stringify({ id: userId, imgname: 'avatar.png', imgdata: base64Img })
}, {
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
$imgData = file_get_contents('avatar.png');
$base64Img = 'data:image/png;base64,' . base64_encode($imgData);

$payload = json_encode(['records' => json_encode([
    'id'      => $userId,
    'imgname' => 'avatar.png',
    'imgdata' => $base64Img,
])]);

$ch = curl_init("{$url}/profile/{$userId}/image");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CUSTOMREQUEST  => 'PUT',
    CURLOPT_POSTFIELDS     => $payload,
    CURLOPT_HTTPHEADER     => [
        'Authorization: Bearer ' . $token,
        'Content-Type: application/json',
        'Accept: application/json'
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

with open("avatar.png", "rb") as f:
    b64_img = "data:image/png;base64," + base64.b64encode(f.read()).decode("utf-8")

response = requests.put(
    f"{url}/profile/{userId}/image",
    json={"records": json.dumps({"id": userId, "imgname": "avatar.png", "imgdata": b64_img})},
    headers={
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
)
```

</TabItem>
<TabItem value="postman" label="Postman">

```javascript
// Pre-request Script
const records = {
    id: Number(pm.environment.get('user_id')),
    imgname: "avatar.png",
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
<summary>✅ Respuesta (HTTP 200)</summary>

Devuelve el usuario **tal como estaba antes** de la petición. Consulta `GET /profile` para ver el nuevo `avatarUrl`.

```json
{
  "dataRecords": {
    "data": {
      "id": 1,
      "type_id": 2,
      "first_name": "JUAN",
      "last_name": "PEREZ",
      "email": "usuario@miempresa.com",
      "avatar": "users/1/profile/avatar-anterior.png",
      "active": 1,
      "name": "JUAN PEREZ",
      "avatarUrl": "https://sandbox-api.matias-api.com/storage/users/1/profile/avatar-anterior.png",
      "user_type": {
        "id": 2,
        "user_type_name": "DESARROLLADOR",
        "type": 2,
        "active": 1
      }
    }
  },
  "success": true
}
```

</details>

<details>
<summary>❌ Imagen Ausente o Vacía (HTTP 400)</summary>

Sin `imgdata` (o si `records` no es un JSON válido):

```json
{
  "message": "No se proporcionó la imagen en base64",
  "success": false
}
```

Con `imgdata` vacío (por ejemplo, solo el prefijo Data URI):

```json
{
  "message": "La imagen en base64 está vacía",
  "success": false
}
```

Si `{id}` no es el usuario de la empresa, la respuesta es `400` con `El usuario autenticado no coincide con el ID proporcionado`. Sin `imgname`, la API responde `500`.

</details>

</details>
