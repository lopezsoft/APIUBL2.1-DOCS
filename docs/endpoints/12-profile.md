---
sidebar_position: 12
sidebar_label: 👤 Perfil
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 👤 Perfil {#perfil}

:::warning Autenticación Requerida
Incluir en todos los endpoints de esta sección el header: `Authorization: Bearer {token}`
:::

:::info Parámetro Multi-Tenant: `client_uuid`
Si operas como **Casa de Software**, puedes consultar o actualizar información en nombre de un cliente agregando `?client_uuid={{client_uuid}}`.
:::

---

## 👤 Gestión del Perfil {#gestion-perfil}

<details open>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/profile</b> — Obtener Datos del Usuario</summary>

```http
GET {{url}}/profile?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Retorna la información del usuario y su rol asociados a la sesión activa (token Bearer).

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

</details>

<details>
<summary>❌ No Autenticado (HTTP 401)</summary>

```json
{
  "message": "Unauthenticated."
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
```

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `id` | path | ✅ Sí | ID del usuario a actualizar. |
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

**Body (JSON):**
```json
{
  "first_name": "DEMO",
  "last_name": "LOPEZSOFT",
  "email": "demo@lopezsoft.net.co",
  "imgdata": "base64_imagen_opcional"
}
```

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

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

</details>

</details>

<details>
<summary><span className="badge badge--warning margin-right--sm">PUT</span> <b>/profile/update-email</b> — Actualizar Correo Electrónico</summary>

```http
PUT {{url}}/profile/update-email?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Permite al usuario actualizar su correo electrónico. Requiere que el nuevo correo no esté en uso. Se enviará automáticamente un correo de verificación al nuevo email.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

**Body (JSON):**
```json
{
  "email": "lopezsoft.com@gmail.com"
}
```

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

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

</details>

<details>
<summary>❌ Error de Validación (HTTP 422)</summary>

```json
{
  "message": "Validación fallida",
  "errors": {
    "email": [
      "El correo electrónico ya está en uso, por favor elige otro correo electrónico."
    ]
  },
  "success": false
}
```

</details>

</details>

<details>
<summary><span className="badge badge--warning margin-right--sm">PUT</span> <b>/profile/&#123;id&#125;/image</b> — Actualizar Imagen de Perfil</summary>

```http
PUT {{url}}/profile/{id}/image?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Permite actualizar el avatar del usuario enviando la imagen en Base64.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `id` | path | ✅ Sí | ID del usuario. |
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

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

<details>
<summary>❌ Imagen Vacía (HTTP 400)</summary>

```json
{
  "message": "La imagen en base64 está vacía",
  "success": false
}
```

</details>

</details>
