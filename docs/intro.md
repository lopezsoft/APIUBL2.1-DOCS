---
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Introducción

Matias es una plataforma de **facturación electrónica** que permite a las empresas emitir, enviar y gestionar facturas electrónicas de forma segura y eficiente. Nuestra **API RESTful** proporciona acceso completo a los servicios de Matias.

Con Matias, los desarrolladores pueden integrar la funcionalidad de facturación electrónica en sus aplicaciones, automatizando completamente el proceso de emisión de documentos de forma segura, legal y eficiente.

## 📋 Tabla de Contenidos

1. [Flujo de Autenticación](#flujo-de-autenticación)
2. [Registro en la API](#registro-en-la-api)
3. [Obtener Token de Acceso](#obtener-el-token-de-acceso)
4. [Uso del Token](#uso-del-token-de-acceso)
5. [Revocar Token](#revocar-el-token)
6. [Marco Regulatorio DIAN](#marco-regulatorio-dian)
7. [Recursos Adicionales](#ejemplos-y-endpoints-en-postman)

---

## 🏛️ Marco Regulatorio DIAN

Matias en v1.4.0 incluye **documentación completa** de todos los marcos regulatorios emitidos por DIAN para documentos electrónicos. Consulta las especificaciones técnicas, casos de uso y ejemplos prácticos:

### 📄 Documentos Disponibles

| Documento | Resolución | Versión | Estado |
|-----------|-----------|---------|---------|
| **Factura Electrónica** | 000165/2024 | v1.9 | ✅ Vigente |
| **Nómina Electrónica** | 0000040/2024 | v3.0 | ✅ Vigente |
| **RADIAN** | 000198/2024 | v2.0 | ✅ Vigente |
| **Documento Soporte** | 000160/2024 | v1.1 | ✅ Vigente |

### 🚀 Acceso Rápido

- 📖 **[Factura Electrónica v1.9](/docs/regulatory-framework/factura-electronica/intro)** - Especificación técnica y anexos
- 💼 **[Nómina Electrónica v3.0](/docs/regulatory-framework/nomina-electronica/intro)** - Guía completa de campos y cálculos
- 🌐 **[RADIAN v2.0](/docs/regulatory-framework/radian/intro)** - Sistema de radicación y validación
- 📋 **[Documento Soporte v1.1](/docs/regulatory-framework/documento-soporte/intro)** - Especificaciones técnicas
- 📊 **[Tablas de Referencia](/docs/regulatory-framework/tablas-referencia)** - Todas las tablas DIAN consolidadas
- 📥 **[Descargas PDF](/docs/regulatory-framework/descargas-pdf)** - Anexos técnicos oficiales DIAN

---

## Flujo de Autenticación

:::tip Nuevo en v3.0.0: Dos Métodos de Autenticación
Ahora tienes **dos opciones** para autenticarte:
- **OAuth2 Tradicional (login):** Para aplicaciones con usuarios que inician sesión
- **Personal Access Tokens (PAT):** Para integraciones servidor-a-servidor y scripts automatizados
:::

### Opción 1: OAuth2 Tradicional (Login)

```
┌─────────────────────────────────────────────────────────────┐
│              FLUJO OAUTH2 TRADICIONAL (v2.x)                │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. REGISTRO              2. OBTENER TOKEN                   │
│  POST /register           POST /auth/login                   │
│      ↓                         ↓                              │
│  [Email/Password]         [Credenciales]                     │
│      ↓                         ↓                              │
│  Confirmación Email       access_token (90 días máx)         │
│                                ↓                              │
│  ────────────────────────────────────────────────────────    │
│                                                               │
│  3. USAR TOKEN                4. REVOCACIÓN                  │
│  Bearer {token}               GET /auth/logout               │
│      ↓                              ↓                         │
│  [Solicitudes API]            Token Revocado                 │
│      ↓                                                        │
│  Respuestas JSON                                             │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Opción 2: Personal Access Tokens (PAT) - Nuevo en v3.0.0

```
┌─────────────────────────────────────────────────────────────┐
│           FLUJO PERSONAL ACCESS TOKENS (v3.0.0)             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. LOGIN INICIAL          2. CREAR PAT                      │
│  POST /auth/login          POST /v3/auth/tokens              │
│      ↓                           ↓                            │
│  [Obtener token inicial]    [name, expires_in_days]          │
│      ↓                           ↓                            │
│  Token temporal (90 días)   Personal Token (1-90 días)       │
│                                  ↓                            │
│  ────────────────────────────────────────────────────────    │
│                                                               │
│  3. USAR PAT                  4. GESTIÓN                     │
│  Bearer {pat_token}           GET /v3/auth/tokens (listar)   │
│      ↓                        DELETE /v3/auth/tokens/{id}    │
│  [Solicitudes API]                   ↓                       │
│      ↓                        Token específico revocado      │
│  Respuestas JSON                                             │
│                                                               │
│  VENTAJAS PAT:                                               │
│  ✅ Expiración configurable (1-90 días)                     │
│  ✅ Múltiples tokens por cuenta                             │
│  ✅ Revocación selectiva instantánea                        │
│  ✅ Autogestión completa (sin contactar soporte)            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Autenticación de API con OAuth2

La autenticación para acceder a la API se gestiona mediante **Tokens de acceso** siguiendo el estándar de autenticación OAuth2. Esto asegura que las interacciones con la API sean seguras y estén autorizadas.

:::info Nuevo en v3.0.0: Personal Access Tokens
Además del flujo OAuth2 tradicional, ahora puedes crear **Personal Access Tokens (PAT)** directamente desde tu cuenta, sin necesidad de contactar a soporte técnico.

**Ventajas de PAT:**
- ✅ Creación self-service (tú mismo los creas)
- ✅ Expiración configurable (1-90 días, recomendado: 30-60)
- ✅ Revocación instantánea
- ✅ Múltiples tokens por cuenta
- ✅ Mejor control de seguridad

**¿Cuándo usar cada método?**
- **OAuth2 tradicional:** Para integrar en aplicaciones web con login de usuarios
- **Personal Access Tokens:** Para scripts, integraciones servidor-a-servidor, o aplicaciones que no necesitan login de usuario

[📖 Ver documentación completa de Personal Access Tokens](/docs/endpoints#personal-access-tokens)
:::

## Formato de las Solicitudes

- **Tipo de Formato:** Todas las solicitudes hacia la API deben estar en formato `JSON`. Este formato se aplica tanto para las peticiones enviadas como para las respuestas recibidas, facilitando la estandarización del intercambio de datos.

- **Uso de HTTPS:** Es obligatorio realizar solicitudes a través de HTTPS, dado que la API no procesará peticiones enviadas mediante HTTP. Esta medida garantiza la seguridad y la integridad de los datos transmitidos.

## Encabezado de Autorización

Para acceder a los recursos de la API, es necesario incluir un encabezado de autorización en cada solicitud. Este encabezado debe contener el token de acceso obtenido durante el proceso de autenticación.

### Formato Esperado

```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjM...
Content-Type: application/json
Accept: application/json
```

Donde `eyJ0eXAi...` es el token de acceso obtenido en el login.


## URL Base de la API

:::warning Acceso Exclusivo para Clientes
La URL base de la API (`{{URL}}`) y el acceso al entorno sandbox **son proporcionados únicamente a clientes que adquieran nuestro servicio**. 

**No ofrecemos:**
- ❌ Cuentas gratuitas
- ❌ Sandbox público o de prueba gratuito
- ❌ Acceso de demostración sin contrato

La URL base y las credenciales de acceso se entregarán una vez formalizada la contratación del servicio.
:::

En toda la documentación, utilizaremos el parámetro `{{URL}}` como marcador de posición, el cual debe ser sustituido por la URL base real que le será proporcionada al contratar el servicio.

:::info Ejemplo de URL base
```
https://api.ejemplo.com
```
*Esta es solo una URL de ejemplo para fines ilustrativos en la documentación.*
:::

## Registro en la API

Para acceder y utilizar los servicios de nuestra API, es necesario que primero se registre en nuestra base de datos de autenticación. Ofrecemos dos métodos para completar el proceso de registro, detallados a continuación:

## Opciones de Registro

1. **A través del formulario de registro en nuestro sitio web**: Complete el formulario disponible en nuestro sitio web. Tras enviar el formulario, recibirá por correo electrónico los datos necesarios para acceder a los servicios de la API.

2. **Mediante una petición al servicio REST**: Si prefiere, puede registrarse realizando una petición al servicio REST, siguiendo estos pasos:

  - Realice una petición de tipo `POST` a la siguiente dirección: `{{URL}}/register`.
  - El cuerpo (`BODY`) de la petición debe incluir los siguientes parámetros:

:::info Parámetros de Registro

| Parámetro | Tipo | Requerido | Descripción | Ejemplo |
|-----------|------|-----------|-------------|----------|
| `first_name` | `string` | ✅ Sí | Nombre del usuario | "Lewis" |
| `last_name` | `string` | ✅ Sí | Apellido del usuario | "Lopez Gomez" |
| `email` | `string` | ✅ Sí | Correo electrónico válido | "correo@correo.com" |
| `password` | `string` | ✅ Sí | Contraseña (min 8 caracteres) | "MiPassword123!" |
| `password_confirmation` | `string` | ✅ Sí | Confirmación de contraseña | "MiPassword123!" |
| `address` | `string` | ✅ Sí | Dirección física | "Calle 123 #45-67" |
| `city_id` | `integer` | ✅ Sí | ID de ciudad ([ver tabla](/docs/glossary)) | 836 |
| `company_name` | `string` | ✅ Sí | Nombre de la empresa | "Mi Empresa S.A." |
| `dni` | `string` | ✅ Sí | Número de identificación (NIT) | "1234567890" |
| `identity_document_id` | `integer` | ✅ Sí | Tipo de documento (1=CC, 3=NIT) | 3 |
| `mobile` | `string` | ✅ Sí | Teléfono celular | "3108435431" |
| `tax_level_id` | `integer` | ✅ Sí | Nivel fiscal ([ver tabla](/docs/glossary)) | 5 |
| `tax_regime_id` | `integer` | ✅ Sí | Régimen fiscal ([ver tabla](/docs/glossary)) | 2 |
| `type_organization_id` | `integer` | ✅ Sí | Tipo de organización ([ver tabla](/docs/glossary)) | 1 |

:::

**Ejemplo JSON completo:**
```json
{
  "first_name": "Lewis",
  "last_name": "Lopez Gomez",
  "email": "correo@correo.com", 
  "password": "MiPassword123!",
  "password_confirmation": "MiPassword123!",
  "address": "Calle 123 #45-67", 
  "city_id": 836, 
  "company_name": "Mi Empresa S.A.", 
  "dni": "1234567890", 
  "identity_document_id": 3, 
  "mobile": "3108435431", 
  "tax_level_id": 5, 
  "tax_regime_id": 2,
  "type_organization_id": 1
}
```
  - Si el registro es correcto, la petición devolverá una respuesta HTTP 200 en formato JSON con la estructura:
    ```
    {
      "message": "Empresa creada con éxito. Verifique su dirección de correo electrónico: gerencia@lopezsoft.net.co",
      "success": true
    }
    ```
  - Si el registro es incorrecto, la petición devolverá una respuesta HTTP 422 o 500 en formato JSON con la estructura:
    - respuesta HTTP 422
      ```
      {
         "message": "El correo electrónico ya existe (and 2 more errors)",
         "errors": {
          "email": [
              "El correo electrónico ya existe"
          ],
          "password": [
              "El campo password debe contener al menos 8 caracteres."
          ],
          "dni": [
              "El NIT ya existe"
          ]
        }
      }           
      ```
    - respuesta HTTP 500
        ```
        {
            "success": false,
            "message": "Error interno del servidor. Por favor",
        }
        ```
---

## 🔑 Token de Acceso

:::info Información Importante
Después de completar el registro, para realizar acciones como la **emisión de documentos al portal de la DIAN**, es necesario contar con un **token de acceso**. Este token proporciona acceso a las URLs protegidas de nuestra API.

**Duración del Token según el Método:**

| Método | Duración | Configurabilidad |
|--------|----------|------------------|
| **OAuth2 (login tradicional)** | 90 días fijo | ❌ No configurable |
| **Personal Access Token (PAT)** | 1-90 días | ✅ Configurable al crear |

**Características Comunes:**
- ✅ Puede ser revocado en cualquier momento
- ✅ Necesario para todas las operaciones de la API
- ✅ Incluir en header `Authorization: Bearer {token}`

**Recomendaciones de Duración (PAT):**
- **7-15 días:** Entornos de desarrollo/pruebas
- **30 días:** Integración continua y scripts automatizados
- **60-90 días:** Producción (balance seguridad/conveniencia) ⭐ Recomendado
:::

:::tip Migrar a Personal Access Tokens
Si actualmente usas OAuth2 tradicional, considera migrar a **Personal Access Tokens** para:
- ✅ Mayor control sobre la expiración
- ✅ Crear múltiples tokens para diferentes propósitos
- ✅ Revocar tokens específicos sin afectar otros
- ✅ Autogestión sin contactar soporte

[📖 Ver guía de migración a PAT](/docs/endpoints#personal-access-tokens)
:::

---

## 📥 Obtener el Token de Acceso

Para obtener el token de acceso, se debe realizar los siguientes pasos:

- **a.** Enviar una petición de tipo `POST` a `{{URL}}/auth/login`
- **b.** El cuerpo (BODY) de la petición debe contener los siguientes parámetros:

```json
{
  "email": "", // Correo electrónico registrado
  "password": "", // Contraseña enviada al correo
  "remember_me": 0 // Siempre debe ser 0
}
```      
- Si la autenticación es correcta, la petición devolverá una respuesta HTTP 200 en formato JSON con la estructura:

    ```json
    {
        "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjM",
        "user": {
            "id": 1,
            "type_id": 2,
            "first_name": "LEWIS",
            "last_name": "LOPEZ GOMEZ",
            "email": "gerencia@lopezsoft.net.co",
            "avatar": "users/1/profile/agente-de-servicio-al-cliente.png",
            "active": 1,
            "name": "LEWIS LOPEZ GOMEZ",
            "avatarUrl": "{{URL}}/storage/users/1/profile/agente-de-servicio-al-cliente.png",
            "user_type": {
                "id": 1,
                "user_type_name": "ADMINISTRADOR",
                "type": 1,
                "active": 1
            }
        },
        "expires_at": "2025-02-02 19:55:42",
        "message": "Bienvenido a Matias. Su sesión ha sido iniciada con éxito.",
        "success": true
    }
    ```
- Si la autenticación es incorrecta, la petición devolverá una respuesta HTTP 401 en formato JSON con la estructura:

    ```json
    {
        "message": "Credenciales inválidas",
        "success": false
    }
    ``` 
---

## 🔐 Uso del Token de Acceso

:::tip Uso Correcto del Token
Tras obtener el token de acceso, este **debe incluirse en el encabezado de autorización** de **TODAS** las solicitudes a la API.
:::

### 📄 Formato del Encabezado

```http
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjM...
Content-Type: application/json
Accept: application/json
```

### 💻 Ejemplos de Uso por Lenguaje

<Tabs>
<TabItem value="nodejs" label="Node.js" default>

```javascript
const axios = require('axios');
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjM...'; // Token obtenido del login

const headers = {
   'Content-Type': 'application/json', 
   'Accept': 'application/json',
   'Authorization': `Bearer ${token}`
};

axios.get('{{URL}}/v1/user', { headers: headers })
.then(response => {
    console.log(response.data);
})
.catch(error => {
    console.log(error);
});
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

url = "{{URL}}/v1/user"
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Bearer ' + token
}

response = requests.request("GET", url, headers=headers)
print(response.text)
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$curl = curl_init();
curl_setopt_array($curl, array(
  CURLOPT_URL => "{{URL}}/v1/user",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "GET",
  CURLOPT_HTTPHEADER => array(
    "Content-Type: application/json",
    "Accept: application/json",
    "Authorization: Bearer $token"
  ),
));
$response = curl_exec($curl);
curl_close($curl);
echo $response;
```

</TabItem>
<TabItem value="java" label="Java">

```java
OkHttpClient client = new OkHttpClient().newBuilder()
  .build();
Request request = new Request.Builder()
  .url("{{URL}}/v1/user")
  .method("GET", null)
  .addHeader("Content-Type", "application/json")
  .addHeader("Accept", "application/json")
  .addHeader("Authorization", "Bearer " + token)
  .build();
Response response = client.newCall(request).execute();
```

</TabItem>
<TabItem value="csharp" label="C#">

```csharp
var client = new RestClient("{{URL}}/v1/user");
client.Timeout = -1;
var request = new RestRequest(Method.GET);
request.AddHeader("Content-Type", "application/json");
request.AddHeader("Accept", "application/json");
request.AddHeader("Authorization", "Bearer " + token);
IRestResponse response = client.Execute(request);
Console.WriteLine(response.Content);
```

</TabItem>
<TabItem value="ruby" label="Ruby">

```ruby
require 'uri'
require 'net/http'

url = URI("{{URL}}/v1/user")
http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["Content-Type"] = "application/json"
request["Accept"] = "application/json"
request["Authorization"] = "Bearer " + token

response = http.request(request)
puts response.read_body
```

</TabItem>
<TabItem value="go" label="Go">

```go
package main

import (
  "fmt"
  "net/http"
  "io/ioutil"
)

func main() {
  url := "{{URL}}/v1/user"
  method := "GET"
  
  client := &http.Client {}
  req, err := http.NewRequest(method, url, nil)
  
  if err != nil {
    fmt.Println(err)
    return
  }
  
  req.Header.Add("Content-Type", "application/json")
  req.Header.Add("Accept", "application/json")
  req.Header.Add("Authorization", "Bearer " + token)
  
  res, err := client.Do(req)
  if err != nil {
    fmt.Println(err)
    return
  }
  defer res.Body.Close()
  
  body, err := ioutil.ReadAll(res.Body)
  if err != nil {
    fmt.Println(err)
    return
  }
  fmt.Println(string(body))
}
```

</TabItem>
</Tabs>

### 💻 Ejemplos de Uso por Lenguaje

<Tabs>
<TabItem value="nodejs" label="Node.js" default>

```javascript
const axios = require('axios');
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjM...'; // Token obtenido del login

const headers = {
   'Content-Type': 'application/json', 
   'Accept': 'application/json',
   'Authorization': `Bearer ${token}`
};

axios.get('{{URL}}/v1/user', { headers: headers })
.then(response => {
    console.log(response.data);
})
.catch(error => {
    console.log(error);
});
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

url = "{{URL}}/v1/user"
headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': 'Bearer ' + token
}

response = requests.request("GET", url, headers=headers)
print(response.text)
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$curl = curl_init();
curl_setopt_array($curl, array(
  CURLOPT_URL => "{{URL}}/v1/user",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "GET",
  CURLOPT_HTTPHEADER => array(
    "Content-Type: application/json",
    "Accept: application/json",
    "Authorization: Bearer $token"
  ),
));
$response = curl_exec($curl);
curl_close($curl);
echo $response;
```

</TabItem>
<TabItem value="java" label="Java">

```java
OkHttpClient client = new OkHttpClient().newBuilder()
  .build();
Request request = new Request.Builder()
  .url("{{URL}}/v1/user")
  .method("GET", null)
  .addHeader("Content-Type", "application/json")
  .addHeader("Accept", "application/json")
  .addHeader("Authorization", "Bearer " + token)
  .build();
Response response = client.newCall(request).execute();
```

</TabItem>
<TabItem value="csharp" label="C#">

```csharp
var client = new RestClient("{{URL}}/v1/user");
client.Timeout = -1;
var request = new RestRequest(Method.GET);
request.AddHeader("Content-Type", "application/json");
request.AddHeader("Accept", "application/json");
request.AddHeader("Authorization", "Bearer " + token);
IRestResponse response = client.Execute(request);
Console.WriteLine(response.Content);
```

</TabItem>
<TabItem value="ruby" label="Ruby">

```ruby
require 'uri'
require 'net/http'

url = URI("{{URL}}/v1/user")
http = Net::HTTP.new(url.host, url.port)
http.use_ssl = true

request = Net::HTTP::Get.new(url)
request["Content-Type"] = "application/json"
request["Accept"] = "application/json"
request["Authorization"] = "Bearer " + token

response = http.request(request)
puts response.read_body
```

</TabItem>
<TabItem value="go" label="Go">

```go
package main

import (
  "fmt"
  "net/http"
  "io/ioutil"
)

func main() {
  url := "{{URL}}/v1/user"
  method := "GET"
  
  client := &http.Client {}
  req, err := http.NewRequest(method, url, nil)
  
  if err != nil {
    fmt.Println(err)
    return
  }
  
  req.Header.Add("Content-Type", "application/json")
  req.Header.Add("Accept", "application/json")
  req.Header.Add("Authorization", "Bearer " + token)
  
  res, err := client.Do(req)
  if err != nil {
    fmt.Println(err)
    return
  }
  defer res.Body.Close()
  
  body, err := ioutil.ReadAll(res.Body)
  if err != nil {
    fmt.Println(err)
    return
  }
  fmt.Println(string(body))
}
```

</TabItem>
</Tabs>

---

## 🚫 Revocar el Token

:::caution Revocación de Token
Para revocar un token generado anteriormente y que aún no ha vencido, debe enviarse una petición de tipo **GET** a `{{URL}}/auth/logout`.

Una vez revocado, el token dejará de ser válido inmediatamente.
::: 
- Si la revocación es correcta, la petición devolverá una respuesta HTTP 200 en formato JSON con la estructura:

    ```json
    {
        "message": "Successfully logged out",
        "success": true
    }
    ```
- Si la revocación es incorrecta, la petición devolverá una respuesta HTTP 401 en formato JSON con la estructura:

    ```json
    {
        "message": "Unauthenticated.",
        "success": false
    }
    ```

## ⚠️ Nota Importante

> **REQUISITO PREVIO OBLIGATORIO:** Para que pueda dar continuidad a esta documentación y usar la API para emitir documentos ante la DIAN, debe haber realizado:
>
> 1. ✅ Subida del **certificado digital** (Resolución DIAN)
> 2. ✅ Información del **Software** generada por portal DIAN
> 3. ✅ **Resolución de facturación** (números de rango)
>
> Registre esta información de forma visual en el portal web:
> ```
> {{URL}}/#/auth/login
> ```
>
> Sin estos requisitos, el API rechazará sus solicitudes de emisión de facturas.

---

## 🔔 Webhooks: Notificaciones en Tiempo Real

:::tip Nuevo en v3.0.0
El sistema de **Webhooks** te permite recibir notificaciones automáticas en tiempo real cuando ocurren eventos importantes en tu cuenta, sin necesidad de estar consultando constantemente la API (polling).
:::

### ✨ Ventajas de los Webhooks

- **🚀 Tiempo Real:** Recibe notificaciones instantáneas cuando ocurre un evento
- **⚡ Eficiente:** No necesitas hacer polling constante a la API
- **🔐 Seguro:** Firmas HMAC-SHA256 para verificar autenticidad
- **🔄 Confiable:** Sistema de reintentos automáticos (máx. 5 intentos)
- **📊 Completo:** 26 tipos de eventos diferentes disponibles

### 📋 Eventos Disponibles

Puedes suscribirte a eventos como:

- **Facturación:** `invoice.created`, `invoice.accepted`, `invoice.rejected`
- **Nota Crédito:** `credit_note.created`, `credit_note.accepted`
- **Página de Pagos:** `payment_page.paid`, `payment_page.expired`
- **Membresías:** `membership.activated`, `membership.limit_reached`
- **Tokens:** `token.created`, `token.revoked`
- **Webhooks:** `webhook.created`, `webhook.test_sent`
- **Y muchos más...**

### 🔄 Flujo de Trabajo Típico

1. **Registras tu webhook:** Indicas la URL donde quieres recibir notificaciones
2. **Ocurre un evento:** Por ejemplo, una factura es aceptada por la DIAN
3. **Enviamos POST a tu URL:** Con toda la información del evento
4. **Verificas la firma:** Para asegurar que proviene de nuestra API
5. **Respondes 200 OK:** Confirmando recepción exitosa

### 📖 Documentación Completa

Para información detallada sobre cómo configurar y usar webhooks, consulta:

[📖 Ver documentación completa de Webhooks](/docs/endpoints#webhooks)

Incluye:
- Cómo crear y configurar webhooks
- Lista completa de los 26 eventos disponibles
- Ejemplos de verificación de firma HMAC en JavaScript y PHP
- Manejo de reintentos y errores
- Buenas prácticas de seguridad

---

## 📊 Límites de Consumo y Membresías

:::info Nuevo en v3.0.0
A partir de la versión 3.0.0, implementamos un **sistema de membresías con límites de consumo** para proporcionar un servicio más sostenible y escalable.
:::

### 🎯 Límites por Membresía

Cada plan de membresía incluye límites específicos para:

- **📄 Documentos electrónicos:** Facturas, notas crédito/débito emitidas por mes
- **💾 Almacenamiento XML:** Espacio para archivos XML y attachments
- **📧 Envíos de email:** Cantidad de correos mensuales
- **🔗 Webhooks:** Número de webhooks configurables

### ⚠️ Manejo de Límites Excedidos

Cuando alcanzas un límite, la API retorna:

```json
{
  "error": "Límite de documentos alcanzado",
  "code": "DOCUMENT_LIMIT_REACHED",
  "current_usage": 1000,
  "limit": 1000,
  "reset_date": "2026-03-01T00:00:00Z"
}
```

**Código HTTP:** `402 Payment Required`

### 📈 Consultar Consumo Actual

Puedes consultar tu consumo actual en cualquier momento:

```http
GET /v3/memberships/consumption
Authorization: Bearer {token}
```

[📖 Ver documentación de Membresías y Consumo](/docs/endpoints#memberships-consumption)

---

## 🔗 Siguientes Pasos

Ahora que comprende el flujo de autenticación, consulte:

### 🆕 Nuevas Características v3.0.0

- 🔑 **[Personal Access Tokens](/docs/endpoints#personal-access-tokens)** - Crea y gestiona tus propios tokens de acceso
- 🔔 **[Webhooks](/docs/endpoints#webhooks)** - Recibe notificaciones en tiempo real de eventos
- 📊 **[Membresías y Consumo](/docs/endpoints#memberships-consumption)** - Consulta tus límites y uso actual

### 📚 Documentación Esencial

- 📚 **[Referencia Completa de Campos](/docs/billing-fields)** - Todos los campos disponibles en facturas
- 🔌 **[Endpoints Disponibles](/docs/endpoints)** - Lista completa de endpoints del API
- 📖 **[Glosario Técnico](/docs/glossary)** - Términos y conceptos clave
- 💡 **[Casos de Uso Comunes](/docs/use-cases/common-errors)** - Errores frecuentes

## Ejemplos y endpoints en Postman

Para facilitar la comprensión de los ejemplos de uso de la API, hemos creado una colección de ejemplos en Postman.
Puede descargar la colección de ejemplos en el siguiente enlace:
```
https://documenter.getpostman.com/view/8699065/2s9YyvBLby
```

## 📘 Documentación Interactiva con Swagger

Explore nuestra documentación interactiva de la API con Swagger/OpenAPI, donde podrá:

- ✅ Ver todos los endpoints disponibles
- ✅ Probar las peticiones directamente desde el navegador
- ✅ Revisar esquemas de request y response
- ✅ Consultar parámetros y modelos de datos

:::info Acceso a Swagger UI
<button 
  onClick={() => window.open(atob('aHR0cHM6Ly9hcGktdjIubWF0aWFzLWFwaS5jb20vYXBpL2RvY3M='), '_blank')}
  style={{
    backgroundColor: '#4CAF50',
    border: 'none',
    color: 'white',
    padding: '12px 24px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    margin: '4px 2px',
    cursor: 'pointer',
    borderRadius: '4px'
  }}
>
  🚀 Abrir Documentación Swagger
</button>

*Disponible únicamente para clientes con servicio activo*
:::

---

## 💬 Soporte y Ayuda

:::warning Soporte Exclusivo para Clientes
El soporte técnico para **integración de la API** está disponible **únicamente para clientes con servicio activo**. 

Si aún no es cliente, por favor contacte a nuestro equipo comercial para adquirir el servicio.

<button 
  onClick={() => window.open(atob('aHR0cHM6Ly93YS5tZS81NzMwNDQzMzgxMDQ/dGV4dD1Ib2xhJTJDJTIwbWUlMjBpbnRlcmVzYSUyMGNvbm9jZXIlMjBtJUMzJUExcyUyMHNvYnJlJTIwbG9zJTIwc2VydmljaW9zJTIweSUyMHBsYW5lcyUyMGRlJTIwTUFUSUFTJTIwQVBJJTIwcGFyYSUyMGludGVncmFjaSVDMyVCM24lMjBkZSUyMGZhY3R1cmFjaSVDMyVCM24lMjBlbGVjdHIlQzMlQjNuaWNhLg=='), '_blank')}
  style={{
    backgroundColor: '#0088cc',
    border: 'none',
    color: 'white',
    padding: '10px 20px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '14px',
    margin: '8px 0',
    cursor: 'pointer',
    borderRadius: '4px',
    fontWeight: 'bold'
  }}
>
  💼 Contactar Ventas por WhatsApp
</button>
:::

¿Necesita ayuda con la integración? Nuestro equipo de soporte está disponible para asistirle.

:::tip Canales de Atención

### 📧 Contacto por Email
```
soporte@matias.com.co
```
Para consultas generales y asistencia técnica.

### 💚 WhatsApp
Atención directa y respuesta rápida a consultas técnicas.

<button 
  onClick={() => window.open(atob('aHR0cHM6Ly93YS5tZS81NzMxMDg0MzU0MzE/dGV4dD1Ib2xhJTIwZXF1aXBvJTIwZGUlMjBzb3BvcnRlJTJDJTIwbmVjZXNpdG8lMjBheXVkYSUyMGNvbiUyMGxhJTIwaW50ZWdyYWNpJUMzJUIzbiUyMGRlJTIwbGElMjBBUEklMjBkZSUyME1hdGlhcw=='), '_blank')}
  style={{
    backgroundColor: '#25D366',
    border: 'none',
    color: 'white',
    padding: '10px 20px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '14px',
    margin: '8px 0',
    cursor: 'pointer',
    borderRadius: '4px'
  }}
>
  📱 Abrir Chat de WhatsApp
</button>

### 🎟️ Centro de Ayuda (Sistema de Tickets)
Para obtener ayuda especializada con la API, abra un ticket en nuestro portal:
```
https://support.lopezsoft.net.co/portal
```

**Al crear un ticket, incluya:**
- ✅ Descripción clara del problema
- ✅ Endpoint que está usando
- ✅ Payload (JSON) que está enviando
- ✅ Respuesta de error que recibe
- ✅ Identificador de transacción (si aplica)

:::

---

**Versión de Documentación:** 3.0 | **Última actualización:** Febrero 2026 | **API:** v3.0.0

### 📢 ¡Nuevo en v3.0.0!

#### 🔑 Personal Access Tokens (PAT)
Ahora puedes crear y gestionar tus propios tokens de acceso sin necesidad de contactar a soporte:
- ✅ Creación self-service
- ✅ Expiración configurable (90 días recomendado)
- ✅ Revocación instantánea
- ✅ Múltiples tokens por cuenta

[📖 Ver documentación de Personal Access Tokens](/docs/endpoints#personal-access-tokens)

#### 🔔 Webhooks
Recibe notificaciones en tiempo real cuando ocurren eventos importantes:
- ✅ 26 tipos de eventos (documentos, emails, pagos, membresías)
- ✅ Firma HMAC-SHA256 para seguridad
- ✅ Reintentos automáticos
- ✅ Testing integrado

[📖 Ver documentación de Webhooks](/docs/endpoints#webhooks)

#### 📊 Gestión de Límites y Consumo
Consulta en tiempo real el consumo de tu plan:
- ✅ Límites diarios y mensuales
- ✅ Estadísticas de uso
- ✅ Historial de consumo
- ✅ Headers informativos en cada respuesta

[📖 Ver documentación de Membresías](/docs/endpoints#membresías-y-consumo)

### 📚 Marco Regulatorio DIAN
Documentación completa de todos los marcos regulatorios emitidos por DIAN con 11,539 líneas de contenido técnico. Consulta las nuevas secciones en el menú lateral.