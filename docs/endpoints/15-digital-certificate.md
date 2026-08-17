---
sidebar_position: 15
sidebar_label: 🔐 Certificado Digital
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 🔐 Certificado de Firma Digital

> ✅ **Autenticación REQUERIDA**  
> Incluir en todos los endpoints de esta sección el header: `Authorization: Bearer {token}`

El certificado de firma digital (`.p12` o `.pfx`) es indispensable para la emisión y firma electrónica de los documentos fiscales ante la DIAN. Solo se puede tener un certificado activo por empresa.

:::info ¿Dónde obtener el `client_uuid`? — Parámetro Multi-Tenant para Casas de Software
Si operas como **Casa de Software** o **Cuenta Principal**, puedes consultar, cargar y renovar los certificados digitales de tus empresas cliente agregando el parámetro `client_uuid` en la query string de la URL:
- **URL con Query Param:** `{{url}}/certificate?client_uuid={{client_uuid}}`
- **Header:** `Authorization: Bearer {token_cuenta_principal}`
- **Comportamiento:** La operación se ejecutará sobre la empresa cliente especificada por su UUID.

**¿Dónde encontrar el `client_uuid` de tus clientes?**  
Puedes consultar el listado completo de tus empresas cliente y sus respectivos `client_uuid` mediante el endpoint:
```http
GET {{url}}/company/customers
Authorization: Bearer {token}
Content-Type: application/json
```
:::

---

## Obtener Certificado Activo

### Obtener Certificado Activo - 🔵 GET
```http
GET {{url}}/certificate?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Obtiene los metadatos del certificado de firma digital actualmente registrado para la empresa emisora.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente asociado a una cuenta principal (opcional). |

**Respuesta Exitosa (HTTP 200):**
```json
{
  "dataRecords": {
    "data": {
      "id": 1,
      "name": "NOMBRE.p12",
      "description": "LOPEZSOFT SAS",
      "extension": ".p12",
      "expiration_date": "09-07-2028 02:56:30 pm",
      "timestamp": "2026-07-13 23:06:11"
    }
  }
}
```

---

## Cargar / Registrar Certificado Digital

### Cargar / Registrar Certificado Digital - 🟘 POST
```http
POST {{url}}/certificate?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Carga un nuevo archivo de certificado digital `.p12` o `.pfx` codificado en **Base64** junto con su contraseña privada y una descripción opcional.

:::info 💡 Guía para Desarrolladores — Envío del Certificado `.p12` en Base64
El archivo binario `.p12` o `.pfx` debe convertirse a **Base64** (con o sin prefijo Data URI `data:application/x-pkcs12;base64,`) y asignarse a la propiedad `certificate` dentro del string JSON `records`.
:::

<Tabs>
<TabItem value="js" label="JavaScript / Node.js" default>

```javascript
import fs from 'fs';
import axios from 'axios';

// 1. Leer el archivo .p12 y convertir a Base64
const p12Buffer = fs.readFileSync('ruta/al/certificado.p12');
const base64Certificate = 'data:application/x-pkcs12;base64,' + p12Buffer.toString('base64');

// 2. Definir los datos del certificado
const records = {
  certificate: base64Certificate,
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

</TabItem>
<TabItem value="php" label="PHP (Guzzle / cURL)">

```php
<?php
// 1. Leer .p12 y codificar en Base64
$p12Data = file_get_contents('ruta/al/certificado.p12');
$base64Cert = 'data:application/x-pkcs12;base64,' . base64_encode($p12Data);

// 2. Armar payload
$records = [
    'certificate' => $base64Cert,
    'password'    => 'password_del_certificado',
    'description' => 'Certificado digital de producción',
];

$payload = json_encode(['records' => json_encode($records)]);

// 3. Enviar petición con cURL
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

</TabItem>
<TabItem value="python" label="Python">

```python
import base64
import json
import requests

# 1. Leer binario del certificado y pasar a Base64
with open("certificado.p12", "rb") as f:
    b64_cert = "data:application/x-pkcs12;base64," + base64.b64encode(f.read()).decode("utf-8")

records = {
    "certificate": b64_cert,
    "password": "password_del_certificado",
    "description": "Certificado digital de producción"
}

# 2. Enviar petición
response = requests.post(
    f"{url}/certificate",
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

byte[] certBytes = await File.ReadAllBytesAsync("certificado.p12");
string b64Cert = "data:application/x-pkcs12;base64," + Convert.ToBase64String(certBytes);

var records = new {
    certificate = b64Cert,
    password = "password_del_certificado",
    description = "Certificado digital de producción"
};

var payload = new { records = JsonSerializer.Serialize(records) };

var client = new HttpClient();
client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

var response = await client.PostAsJsonAsync($"{url}/certificate", payload);
```

</TabItem>
<TabItem value="postman" label="Postman">

```javascript
// Pre-request Script en Postman
const records = {
    certificate: "data:application/x-pkcs12;base64,MIIKgAIBAz...",
    password: "password_del_certificado",
    description: "Certificado digital de producción"
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
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

**Body JSON resultante:**
```json
{
  "records": "{\"certificate\":\"data:application/x-pkcs12;base64,MIIKgAIBAzCCCmcGCSqGSIb3DQEHAaCCC...\",\"password\":\"clave_certificado\",\"description\":\"Certificado digital de producción\"}"
}
```

| Propiedad en `records` | Tipo | Requerido | Descripción |
|---|---|---|---|
| `certificate` | string | ✅ Sí | Contenido completo del archivo `.p12` codificado en Base64. |
| `password` | string | ✅ Sí | Contraseña privada del certificado digital. |
| `description` | string | No | Descripción identificativa del certificado. |

**Respuesta Exitosa (HTTP 201):**
```json
{
  "success": true,
  "message": "Certificado cargado exitosamente"
}
```

---

## Actualizar / Renovar Certificado

### Actualizar / Renovar Certificado - 🟠 PUT
```http
PUT {{url}}/certificate?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Renueva o actualiza el certificado digital activo de la empresa. El payload y formato son idénticos a los del endpoint de creación (`POST /certificate`).

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `client_uuid` | query | No | UUID del cliente (Casa de Software). |

**Body (JSON):** Igual al POST de creación (`records` serializado con `certificate`, `password` y `description`).

**Respuesta Exitosa (HTTP 200):**
```json
{
  "success": true,
  "message": "Certificado actualizado exitosamente"
}
```

---

## Validar Expiración del Certificado

### Validar Expiración del Certificado - 🔵 GET
```http
GET {{url}}/certificate/expiration/{dni}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Verifica la fecha de expiración, los días restantes de vigencia y si el certificado digital se encuentra expirado a partir del NIT de la empresa.

**Parámetros:**
| Nombre | Ubicación | Requerido | Descripción |
|---|---|---|---|
| `dni` | path | ✅ Sí | NIT de la empresa a consultar (sin dígito de verificación ni guiones). |

**Respuesta Exitosa (HTTP 200):**
```json
{
  "dataRecords": {
        "data": {
            "expiration_date": "2028-07-09 14:56:30"
        }
    }
}
```
