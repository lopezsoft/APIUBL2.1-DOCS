---
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Introducción

Matias es una plataforma de **facturación electrónica** que permite a las empresas emitir, enviar y gestionar facturas electrónicas de forma segura y eficiente. Nuestra **API RESTful** proporciona acceso completo a los servicios de Matias.

Con Matias, los desarrolladores pueden integrar la funcionalidad de facturación electrónica en sus aplicaciones, automatizando completamente el proceso de emisión de documentos de forma segura, legal y eficiente.

---

## 🌐 URL Base de la API {#url-base-de-la-api}

:::info 🚀 Acceso a la Plataforma

**Sandbox (Gratuito - Sin Contrato):**
- ✅ Acceso completamente **GRATUITO**
- ✅ Sin necesidad de contrato
- ✅ Perfecto para pruebas y desarrollo
- ✅ Mismos endpoints que producción
- ✅ Datos de prueba disponibles
- ✅ Crear cuenta en: `https://sandbox-auth.matias-api.com/`

**Producción (Requiere Contrato):**
- ✅ Acceso exclusivo para clientes con servicio activo
- ✅ URL base de producción proporcionada al contratar
- ✅ Credenciales obtenidas al registrarse en el ambiente de producción
- ✅ Emisión de documentos reales ante DIAN
- ✅ Soporte técnico especializado incluido
- ✅ Certificado digital y resoluciones DIAN requeridas

[📖 Ver documentación completa del Sandbox](/docs/sandbox/quickstart)
:::

En toda la documentación, utilizaremos el parámetro `{{URL}}` como marcador de posición para la URL base de producción, la cual le será proporcionada al contratar el servicio. De manera similar, usaremos `{{SANDBOX_URL}}` para referirnos al entorno de pruebas.

:::info Enlaces de Referencia

**Producción (`{{URL}}`)**:
```text
https://api.ejemplo.com (Ejemplo ilustrativo)
```

**Sandbox (`{{SANDBOX_URL}}`)**:
- **API:** `https://sandbox-api.matias-api.com/api/ubl2.1`
- **Frontend Web:** `https://sandbox-auth.matias-api.com/`
:::

### ⚠️ Cuentas Separadas: Producción vs Sandbox {#cuentas-separadas-prod-sandbox}

:::warning IMPORTANTE: Credenciales Diferentes para Cada Entorno

**Las credenciales de Producción NO funcionan automáticamente en Sandbox.**

Debes crear **DOS CUENTAS DIFERENTES** — una para cada entorno:

#### 1️⃣ Cuenta de Producción
- **URL Base:** `{{URL}}`
- **Portal Web:** `{{URL}}/#/auth/login`
- **Propósito:** Emitir documentos reales ante la DIAN
- **Requisitos:** Certificado digital, información del software DIAN, resolución de facturación

#### 2️⃣ Cuenta de Sandbox (Pruebas)
- **URL API:** `https://sandbox-api.matias-api.com`
- **Portal Web:** `https://sandbox-auth.matias-api.com/`
- **Propósito:** Probar tu integración sin enviar documentos a la DIAN
- **Requisitos:** Crear una cuenta separada en el portal de sandbox
- **Datos de Prueba:** Disponibles para testing sin restricciones

#### 📋 Flujo Recomendado

1. **Crea tu cuenta en Producción** → Obtienes credenciales de prod
2. **Crea una cuenta separada en Sandbox** → Obtienes credenciales de sandbox
3. **Prueba tu integración en Sandbox** → Usa credenciales de sandbox
4. **Valida todo funciona correctamente** → Luego usa credenciales de prod en tu app final

#### 🔄 Cambiar entre Entornos

Para cambiar de Sandbox a Producción (o viceversa), simplemente:
- Cambia la URL base en tu código
- Usa las credenciales correspondientes al entorno

**Ejemplo:**
```javascript
// Sandbox
const SANDBOX_URL = 'https://sandbox-api.matias-api.com';
const SANDBOX_TOKEN = 'token_de_sandbox_aqui';

// Producción
const PROD_URL = '{{URL}}';
const PROD_TOKEN = 'token_de_produccion_aqui';
```

:::

### ⚠️ Requisitos Previos Obligatorios {#nota-importante}

> [!IMPORTANT]
> **Antes de usar la API para emitir documentos ante la DIAN, debe haber realizado:**
>
> 1. ✅ **Subida del certificado digital** (Resolución DIAN)
> 2. ✅ **Información del Software** generada por portal DIAN
> 3. ✅ **Resolución de facturación** (números de rango)
>
> Registre esta información de forma visual en el portal web:
> `{{URL}}/#/auth/login`
>
> Sin estos requisitos previos, la API rechazará sus solicitudes de emisión de facturas.

### 📤 Formato de las Solicitudes {#formato-de-las-solicitudes}

- **Tipo de Formato:** Todas las solicitudes hacia la API deben estar en formato `JSON`. Este formato se aplica tanto para las peticiones enviadas como para las respuestas recibidas, facilitando la estandarización del intercambio de datos.
- **Uso de HTTPS:** Es obligatorio realizar solicitudes a través de HTTPS, dado que la API no procesará peticiones enviadas mediante HTTP. Esta medida garantiza la seguridad y la integridad de los datos transmitidos.

---

## 🔐 Flujo de Autenticación {#flujo-de-autenticación}

:::tip Nuevo en v3.0.0: Dos Métodos de Autenticación
Ofrecemos **dos opciones** para autenticarte según las necesidades de tu integración:
- **Personal Access Tokens (PAT):** Recomendado para integraciones servidor-a-servidor, scripts automatizados y tareas en segundo plano.
- **OAuth2 Tradicional (login):** Para aplicaciones web con usuarios que inician sesión interactivamente.
:::

<details>
<summary>🗺️ Ver Diagrama: Flujo OAuth2 Tradicional (login)</summary>

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
</details>

<details>
<summary>🗺️ Ver Diagrama: Flujo Personal Access Tokens (PAT)</summary>

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
</details>

### 🛡️ Autenticación de API con OAuth2 {#autenticación-de-api-con-oauth2}

La autenticación para acceder a la API se gestiona mediante **Tokens de acceso** siguiendo el estándar de autenticación OAuth2. Esto asegura que las interacciones con la API sean seguras y estén autorizadas.

:::info Ventajas de Personal Access Tokens (PAT)
- **Creación self-service:** Tú mismo los creas y los gestionas directamente.
- **Expiración configurable:** Desde 1 hasta 90 días (recomendado: 30-60 días).
- **Revocación instantánea:** Revoca cualquier token de forma selectiva.
- **Múltiples tokens:** Usa tokens únicos para diferentes servidores o entornos de integración.

[📖 Ver documentación completa de Personal Access Tokens](/docs/endpoints/intro-auth#personal-access-tokens)
:::

### 📝 Encabezado de Autorización {#encabezado-de-autorización}

Para acceder a los recursos protegidos de la API, incluya el encabezado de autorización en cada solicitud con el siguiente formato:

```http
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjM...
Content-Type: application/json
Accept: application/json
```

---

## 📝 Paso 1: Registro en la API {#registro-en-la-api}

Para acceder y utilizar los servicios de la API, el primer paso es registrarse en nuestra plataforma de autenticación.

### ⚙️ Opciones de Registro {#opciones-de-registro}

1. **A través de nuestro sitio web:** Complete el formulario de registro y recibirá las credenciales por correo electrónico.
2. **Mediante el servicio REST:** Realice una petición `POST` al endpoint `{{URL}}/register` con los parámetros obligatorios.

| Parámetro | Tipo | Requerido | Descripción | Ejemplo |
|-----------|------|-----------|-------------|----------|
| `first_name` | `string` | ✅ Sí | Nombre del usuario | `"Lewis"` |
| `last_name` | `string` | ✅ Sí | Apellido del usuario | `"Lopez Gomez"` |
| `email` | `string` | ✅ Sí | Correo electrónico válido | `"correo@correo.com"` |
| `password` | `string` | ✅ Sí | Contraseña (mínimo 8 caracteres) | `"MiPassword123!"` |
| `password_confirmation` | `string` | ✅ Sí | Confirmación de contraseña | `"MiPassword123!"` |
| `address` | `string` | ✅ Sí | Dirección física | `"Calle 123 #45-67"` |
| `city_id` | `integer` | ✅ Sí | ID de ciudad ([ver glosario](/docs/glossary)) | `836` |
| `company_name` | `string` | ✅ Sí | Nombre de la empresa | `"Mi Empresa S.A."` |
| `dni` | `string` | ✅ Sí | Número de identificación (NIT) | `"1234567890"` |
| `identity_document_id` | `integer` | ✅ Sí | Tipo de documento (1=CC, 3=NIT) | `3` |
| `mobile` | `string` | ✅ Sí | Teléfono celular | `"3108435431"` |
| `tax_level_id` | `integer` | ✅ Sí | Nivel fiscal ([ver glosario](/docs/glossary)) | `5` |
| `tax_regime_id` | `integer` | ✅ Sí | Régimen fiscal ([ver glosario](/docs/glossary)) | `2` |
| `type_organization_id` | `integer` | ✅ Sí | Tipo de organización ([ver glosario](/docs/glossary)) | `1` |

<details>
<summary>📦 Ver JSON de Petición (Request Body)</summary>

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
</details>

<details>
<summary>📦 Ver Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "message": "Empresa creada con éxito. Verifique su dirección de correo electrónico: gerencia@lopezsoft.net.co",
  "success": true
}
```
</details>

<details>
<summary>📦 Ver Respuestas de Error (HTTP 422 / 500)</summary>

**Respuesta HTTP 422 (Error de Validación):**
```json
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

**Respuesta HTTP 500 (Error Interno):**
```json
{
  "success": false,
  "message": "Error interno del servidor. Por favor, intente más tarde."
}
```
</details>

---

## 🔑 Paso 2: Obtener el Token de Acceso {#obtener-el-token-de-acceso}

Una vez registrado y con los requisitos previos configurados en el portal, obtenga su token de acceso enviando una petición `POST` al endpoint `{{URL}}/auth/login`.

### Parámetros del Body

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `email` | `string` | ✅ Sí | Correo electrónico registrado |
| `password` | `string` | ✅ Sí | Contraseña de la cuenta |
| `remember_me` | `integer` | ✅ Sí | Debe ser `0` |

<details>
<summary>📦 Ver JSON de Petición (Request Body)</summary>

```json
{
  "email": "correo@correo.com",
  "password": "MiPassword123!",
  "remember_me": 0
}
```
</details>

<details>
<summary>📦 Ver Respuesta Exitosa (HTTP 200)</summary>

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
</details>

<details>
<summary>📦 Ver Respuesta de Credenciales Inválidas (HTTP 401)</summary>

```json
{
  "message": "Credenciales inválidas",
  "success": false
}
```
</details>

---

## 🔐 Paso 3: Uso del Token de Acceso {#uso-del-token-de-acceso}

Incluya el token obtenido en todas sus llamadas HTTP a endpoints protegidos.

### 📄 Formato del Encabezado
```http
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjM...
```

### 💻 Ejemplos de Implementación

<Tabs>
<TabItem value="nodejs" label="Node.js" default>

```javascript
const axios = require('axios');
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjM...'; // Token de acceso

const headers = {
   'Content-Type': 'application/json', 
   'Accept': 'application/json',
   'Authorization': `Bearer ${token}`
};

axios.get('{{URL}}/v1/user', { headers })
.then(response => {
    console.log(response.data);
})
.catch(error => {
    console.error(error);
});
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

url = "{{URL}}/v1/user"
token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjM..."

headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': f'Bearer {token}'
}

response = requests.get(url, headers=headers)
print(response.json())
```

</TabItem>
<TabItem value="php" label="PHP">

```php
$token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjM...';

$curl = curl_init();
curl_setopt_array($curl, array(
  CURLOPT_URL => "{{URL}}/v1/user",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => "GET",
  CURLOPT_HTTPHEADER => array(
    "Content-Type: application/json",
    "Accept: application/json",
    "Authorization: Bearer " . $token
  ),
));
$response = curl_exec($curl);
curl_close($curl);
echo $response;
```

</TabItem>
<TabItem value="java" label="Java">

```java
OkHttpClient client = new OkHttpClient().newBuilder().build();
String token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjM...";

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
var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjM...";

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
token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjM..."

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
  token := "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjM..."
  
  client := &http.Client {}
  req, err := http.NewRequest("GET", url, nil)
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

## 🚫 Paso 4: Revocar el Token {#revocar-el-token}

:::caution Revocación de Sesión (Logout)
Para invalidar un token activo antes de que venza, envíe una petición **GET** a `{{URL}}/auth/logout` con el token en la cabecera de autorización.
:::

<details>
<summary>📦 Ver Respuestas de Revocación</summary>

**Respuesta Exitosa (HTTP 200):**
```json
{
  "message": "Successfully logged out",
  "success": true
}
```

**Respuesta de Error / No Autenticado (HTTP 401):**
```json
{
  "message": "Unauthenticated.",
  "success": false
}
```
</details>

---

## 🔗 Siguientes Pasos y Conceptos Avanzados {#siguientes-pasos}

Una vez completada la autenticación, explore los temas avanzados y recursos clave para la integración:

### 🔔 Webhooks: Notificaciones en Tiempo Real {#webhooks-notificaciones-en-tiempo-real}

:::tip Eventos del Ciclo de Vida
Los webhooks le permiten recibir notificaciones automáticas y seguras (firmadas con HMAC-SHA256) directamente en su servidor cuando ocurren eventos clave como:
- **Facturas:** `invoice.created`, `invoice.accepted`, `invoice.rejected`
- **Notas Crédito:** `credit_note.created`, `credit_note.accepted`
- **Membresías:** `membership.limit_reached`, `membership.activated`

[📖 Ver documentación de Webhooks y firma HMAC](/docs/endpoints/webhooks)
:::

### 📊 Límites de Consumo y Membresías {#límites-de-consumo-y-membresías}

Las cuentas cuentan con límites mensuales en la emisión de documentos, envíos de correo y espacio en la nube según su suscripción. Si excede su cupo, la API responderá con un error `402 Payment Required`.

<details>
<summary>📦 Ver JSON de Error de Límite (HTTP 402)</summary>

```json
{
  "error": "Límite de documentos alcanzado",
  "code": "DOCUMENT_LIMIT_REACHED",
  "current_usage": 1000,
  "limit": 1000,
  "reset_date": "2026-03-01T00:00:00Z"
}
```
</details>

[📖 Consultar consumo en tiempo real](/docs/endpoints/memberships-health#memberships-consumption)

---

### 🏛️ Marco Regulatorio DIAN {#marco-regulatorio-dian}

Matias cumple rigurosamente con los marcos regulatorios y anexos técnicos oficiales vigentes de la DIAN para documentos electrónicos:

| Documento | Resolución | Versión | Estado |
|-----------|-----------|---------|---------|
| **Factura Electrónica** | 000165/2024 | v1.9 | ✅ Vigente |
| **Nómina Electrónica** | 0000040/2024 | v3.0 | ✅ Vigente |
| **RADIAN** | 000198/2024 | v2.0 | ✅ Vigente |
| **Documento Soporte** | 000160/2024 | v1.1 | ✅ Vigente |

#### 🚀 Accesos Rápidos a Guías Técnicas
- 📄 **[Factura Electrónica v1.9](/docs/regulatory-framework/factura-electronica/intro)** - Especificaciones técnicas y anexos.
- 💼 **[Nómina Electrónica v3.0](/docs/regulatory-framework/nomina-electronica/intro)** - Guía completa de campos y cálculos.
- 🌐 **[RADIAN v2.0](/docs/regulatory-framework/radian/intro)** - Sistema de radicación y registro.
- 📋 **[Documento Soporte v1.1](/docs/regulatory-framework/documento-soporte/intro)** - Operaciones con no obligados a facturar.
- 📊 **[Tablas de Referencia](/docs/regulatory-framework/tablas-referencia)** - Todas las tablas DIAN consolidadas.
- 📥 **[Anexos Oficiales DIAN](https://www.dian.gov.co/impuestos/factura-electronica)** - Descargas directas del portal DIAN.

---

### 🛠️ Herramientas de Desarrollo {#ejemplos-y-endpoints-en-postman}

#### 📮 Colección Oficial de Postman
Ponemos a su disposición una colección completa de Postman con payloads de ejemplo listos para importar y ejecutar:

```
https://documenter.getpostman.com/view/8699065/2s9YyvBLby
```

#### 📘 Documentación Interactiva con Swagger {#documentación-interactiva-con-swagger}

Explore interactivamente y pruebe los endpoints de la API de forma ágil desde el navegador a través de Swagger UI:

:::info Swagger UI
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
    borderRadius: '4px',
    fontWeight: 'bold'
  }}
>
  🚀 Abrir Documentación Swagger
</button>

*Disponible únicamente para clientes con servicio activo.*
:::

---

## 💬 Soporte y Ayuda {#soporte-y-ayuda}

¿Necesita soporte durante su proceso de integración? Nuestro equipo técnico especializado está disponible para guiarle.

:::warning Canales de Atención Exclusivos
El soporte técnico y de integración comercial se brinda **únicamente a clientes con suscripciones activas**.

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

:::tip Canales de Soporte Técnico

### 🎟️ Centro de Ayuda (Sistema de Tickets)
Para reportar fallos, dudas o incidentes con integraciones activas, abra un ticket en:
```
https://support.lopezsoft.net.co/portal
```

**Al crear un caso, asegúrese de incluir:**
- ✅ Descripción detallada del comportamiento esperado y obtenido.
- ✅ Endpoint exacto utilizado y método HTTP.
- ✅ Payload (JSON) completo de la petición.
- ✅ JSON completo de la respuesta de error o código HTTP devuelto.

### 📧 Contacto por Email
Escríbanos a: **soporte@matias.com.co** para consultas generales.

### 💚 Canal Rápido de WhatsApp
Para dudas técnicas rápidas o verificación de estado de servicios:

<button 
  onClick={() => window.open(atob('aHR0cHM6Ly93YS5tZS81NzMxMDg0MzU0MzE/dGV4dD1Ib2xhJTIwZXF1aXBvJTIwZGU%20c29wb3J0ZSUyQyUyMG5lY2VzaXRvJTIwYXl1ZGElMjBjb24lMjBsYSUyMGludGVncmFjaSVDMyVCM24lMjBkZSUyMGxhJTIwQVBJJTIwZGUlMjBNYXRpYXM='), '_blank')}
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
    borderRadius: '4px',
    fontWeight: 'bold'
  }}
>
  📱 Abrir Chat de WhatsApp
</button>
:::

---

**Versión de Documentación:** 3.0.7 | **Última actualización:** Mayo 2026 | **API:** v3.0.7