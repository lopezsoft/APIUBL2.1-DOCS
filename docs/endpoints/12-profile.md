---
sidebar_position: 12
sidebar_label: 👤 Perfil
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 👤 Perfil

> ✅ **Autenticación REQUERIDA**
> Incluir en todos los endpoints de esta sección el header: `Authorization: Bearer {token}`

## Datos del Usuario Autenticado

### Obtener Datos del Usuario - 🔵 GET
```http
GET {{url}}/profile
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Retorna la información del usuario y su rol asociados a la sesión activa (token Bearer).

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

**Respuesta Exitosa (HTTP 200):**
```json
{
  "dataRecords": {
    "data": [
      {
        "id": 1,
        "type_id": 1,
        "first_name": "DEMO",
        "last_name": "LOPEZSOFT",
        "email": "demo@lopezsoft.net.co",
        "avatar": "users/1/profile/logo-circle.png",
        "active": 1,
        "name": "DEMO LOPEZSOFT",
        "avatarUrl": "http://apidian.test/storage/users/1/profile/logo-circle.png",
        "user_type": {
          "id": 1,
          "user_type_name": "ADMINISTRADOR",
          "type": 1,
          "active": 1
        }
      }
    ]
  },
  "success": true
}
```

**Respuesta de Error (HTTP 401 - No Autenticado):**
```json
{
  "message": "Unauthenticated."
}
```

---

## Actualizar perfil de usuario

### Actualizar perfil de usuario - 🟠 PUT
```http
PUT {{url}}/profile/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `id` | path | Sí | ID del usuario a actualizar. |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Body (JSON):**
```json
{
  "first_name": "DEMO",
  "last_name": "LOPEZSOFT",
  "email": "demo@lopezsoft.net.co",
  "imgdata": "base64_imagen_opcional"
}
```

**Respuesta Exitosa (HTTP 200):**
```json
{
  "dataRecords": {
    "data": {
      "id": 1,
      "type_id": 1,
      "first_name": "DEMO",
      "last_name": "LOPEZSOFT",
      "email": "demo@lopezsoft.net.co",
      "avatar": "users/1/profile/logo-circle.png",
      "active": 1,
      "name": "DEMO LOPEZSOFT",
      "avatarUrl": "http://apidian.test/storage/users/1/profile/logo-circle.png",
      "user_type": {
        "id": 1,
        "user_type_name": "ADMINISTRADOR",
        "type": 1,
        "active": 1
      }
    }
  },
  "success": true
}
```

---

## Actualizar correo electrónico del usuario

### Actualizar correo electrónico del usuario - 🟠 PUT
```http
PUT {{url}}/profile/update-email
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Permite al usuario actualizar su correo electrónico. Requiere que el nuevo correo no esté en uso por otro usuario. El `email_verified_at` se establece en null y se envía automáticamente un correo de verificación al nuevo email.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

**Body (JSON):**
```json
{
  "email": "lopezsoft.com@gmail.com"
}
```

**Respuesta Exitosa (HTTP 200):**
```json
{
  "success": true,
  "message": "Correo electrónico actualizado exitosamente. Se ha enviado un correo de verificación a tu nuevo email.",
  "data": {
    "email": "lopezsoft.com@gmail.com",
    "email_verified_at": null,
    "previous_email": "demo@lopezsoft.net.co",
    "verification_sent": true
  }
}
```

**Respuesta de Error de Validación (HTTP 422):**
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

---

## Actualizar imagen de perfil

### Actualizar imagen de perfil - 🟠 PUT
```http
PUT {{url}}/profile/{id}/image
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Permite actualizar el avatar del usuario enviando la imagen en Base64.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `id` | path | Sí | ID del usuario. |
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). |

**Body (JSON):**
```json
{
  "records": "{\"imgdata\":\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...\"}"
}
```

:::info 💡 Guía para Desarrolladores — Imagen en Base64
Envía la imagen del avatar codificada en Base64 con prefijo Data URI dentro del campo `imgdata` en `records`.
:::

<Tabs>
<TabItem value="js" label="JavaScript / Node.js" default>

```javascript
import fs from 'fs';
import axios from 'axios';

const imgBuffer = fs.readFileSync('avatar.png');
const base64Img = 'data:image/png;base64,' + imgBuffer.toString('base64');

const response = await axios.put(`${url}/profile/${userId}/image`, {
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
$imgData = file_get_contents('avatar.png');
$base64Img = 'data:image/png;base64,' . base64_encode($imgData);

$payload = json_encode(['records' => json_encode(['imgdata' => $base64Img])]);

$ch = curl_init("{$url}/profile/{$userId}/image");
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

with open("avatar.png", "rb") as f:
    b64_img = "data:image/png;base64," + base64.b64encode(f.read()).decode("utf-8")

response = requests.put(
    f"{url}/profile/{userId}/image",
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

**Respuesta de Error (HTTP 400 - Imagen Vacía):**
```json
{
  "message": "La imagen en base64 está vacía",
  "success": false
}
```
