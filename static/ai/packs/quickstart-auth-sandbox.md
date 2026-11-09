# MATIAS API UBL 2.1 — Paquete de Contexto IA: Inicio Rápido, Autenticación y Sandbox

> Flujos OAuth2 y Personal Access Tokens (PAT), separación de cuentas Sandbox vs Producción, verificación de correo y Magic Values.

- **Versión API:** v3.10.0
- **URL del paquete:** https://docs.matias-api.com/ai/packs/quickstart-auth-sandbox.md
- **Índice general IA:** https://docs.matias-api.com/llms.txt
- **Especificación OpenAPI 3:** https://docs.matias-api.com/openapi.json

## Páginas incluidas en este paquete

- [Introducción](https://docs.matias-api.com/docs/intro.md)
- [Quickstart](https://docs.matias-api.com/docs/sandbox/quickstart.md)
- [Magic Values](https://docs.matias-api.com/docs/sandbox/magic-values.md)
- [Test Certificate](https://docs.matias-api.com/docs/sandbox/test-cert.md)
- [Colección Postman](https://docs.matias-api.com/docs/sandbox/postman.md)
- [Introducción y Autenticación](https://docs.matias-api.com/docs/endpoints/intro-auth.md)

---

<!-- Fuente: https://docs.matias-api.com/docs/intro -->

# Introducción

Matias es una plataforma de **facturación electrónica** que permite a las empresas emitir, enviar y gestionar facturas electrónicas de forma segura y eficiente. Nuestra **API RESTful** proporciona acceso completo a los servicios de Matias.

Con Matias, los desarrolladores pueden integrar la funcionalidad de facturación electrónica en sus aplicaciones, automatizando completamente el proceso de emisión de documentos de forma segura, legal y eficiente.

---

## 🛠️ Herramientas de Desarrollo

Antes de leer la documentación completa, ten a mano las dos herramientas que más vas a usar durante tu integración:

### 📮 Colección Postman

Importa todos los endpoints con payloads de ejemplo listos para ejecutar. La forma más rápida de probar la API sin escribir código.

[🔗 Abrir Colección Postman](https://documenter.getpostman.com/view/8699065/2s9YyvBLby)

Incluye ejemplos de Factura, Nota Crédito, Nómina, Salud, Eventos RADIAN y más.

### 📘 Swagger UI

Explora y prueba los endpoints interactivamente desde el navegador. Requiere tu token de acceso.

Disponible únicamente para clientes con servicio activo.

:::tip ¿Quieres probar sin un contrato?
Usa el **[Sandbox gratuito](https://docs.matias-api.com/docs/sandbox/quickstart.md)** — no requiere contrato ni configuración DIAN. Crea tu cuenta en `https://sandbox-auth.matias-api.com/` y empieza a probar en minutos.
:::

---

## 🌐 URL Base de la API

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

[📖 Ver documentación completa del Sandbox](https://docs.matias-api.com/docs/sandbox/quickstart.md)
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

### ⚠️ Cuentas Separadas: Producción vs Sandbox

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

### ⚠️ Requisitos Previos Obligatorios

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

### 📤 Formato de las Solicitudes

- **Tipo de Formato:** Todas las solicitudes hacia la API deben estar en formato `JSON`. Este formato se aplica tanto para las peticiones enviadas como para las respuestas recibidas, facilitando la estandarización del intercambio de datos.
- **Uso de HTTPS:** Es obligatorio realizar solicitudes a través de HTTPS, dado que la API no procesará peticiones enviadas mediante HTTP. Esta medida garantiza la seguridad y la integridad de los datos transmitidos.

---

## 🔐 Flujo de Autenticación {#flujo-de-autenticación}

:::tip Nuevo en v3.0.0: Dos Métodos de Autenticación
Ofrecemos **dos opciones** para autenticarte según las necesidades de tu integración:
- **Personal Access Tokens (PAT):** Recomendado para integraciones servidor-a-servidor, scripts automatizados y tareas en segundo plano.
- **OAuth2 Tradicional (login):** Para aplicaciones web con usuarios que inician sesión interactivamente.
:::

**🗺️ Ver Diagrama: Flujo OAuth2 Tradicional (login)**

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
│  Confirmación Email       access_token (90 días)             │
│  (OBLIGATORIA: enlace          ↓                              │
│   del correo; sin ella                                        │
│   el login responde 404)                                      │
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

**🗺️ Ver Diagrama: Flujo Personal Access Tokens (PAT)**

```
┌─────────────────────────────────────────────────────────────┐
│           FLUJO PERSONAL ACCESS TOKENS (v3.0.0)             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. LOGIN INICIAL          2. CREAR PAT                      │
│  POST /auth/login          POST /tokens                      │
│      ↓                           ↓                            │
│  [Obtener token inicial]    [name, expires_in_days]          │
│      ↓                           ↓                            │
│  Token temporal (90 días)   Personal Token (1-365 días)      │
│                                  ↓                            │
│  ────────────────────────────────────────────────────────    │
│                                                               │
│  3. USAR PAT                  4. GESTIÓN                     │
│  Bearer {pat_token}           GET /tokens (listar)           │
│      ↓                        GET /tokens/{id}               │
│  [Solicitudes API]            DELETE /tokens/{id}            │
│      ↓                        POST /tokens/revoke-all        │
│  Respuestas JSON                     ↓                       │
│                               Token específico revocado      │
│                                                               │
│  VENTAJAS PAT:                                               │
│  ✅ Expiración configurable (1-365 días, 90 por defecto)    │
│  ✅ Múltiples tokens por cuenta                             │
│  ✅ Revocación selectiva instantánea                        │
│  ✅ Autogestión completa (sin contactar soporte)            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 🛡️ Autenticación de API con OAuth2 {#autenticación-de-api-con-oauth2}

La autenticación para acceder a la API se gestiona mediante **Tokens de acceso** siguiendo el estándar de autenticación OAuth2. Esto asegura que las interacciones con la API sean seguras y estén autorizadas.

:::info Ventajas de Personal Access Tokens (PAT)
- **Creación self-service:** Tú mismo los creas y los gestionas directamente.
- **Expiración configurable:** Desde 1 hasta 365 días; si no se indica, 90 días (recomendado: 30-60 días).
- **Límite de creación:** Hasta 10 tokens nuevos por día y usuario.
- **Revocación instantánea:** Revoca cualquier token de forma selectiva.
- **Múltiples tokens:** Usa tokens únicos para diferentes servidores o entornos de integración.

[📖 Ver documentación completa de Personal Access Tokens](https://docs.matias-api.com/docs/endpoints/intro-auth#personal-access-tokens)
:::

### 📝 Encabezado de Autorización {#encabezado-de-autorización}

Para acceder a los recursos protegidos de la API, incluya el encabezado de autorización en cada solicitud con el siguiente formato:

```http
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjM...
Content-Type: application/json
Accept: application/json
```

---

## 📝 Paso 1: Registro en la API

Para acceder y utilizar los servicios de la API, el primer paso es registrarse en nuestra plataforma de autenticación.

### ⚙️ Opciones de Registro

1. **A través de nuestro sitio web:** Complete el formulario de registro y verifique su correo con el enlace que recibirá.
2. **Mediante el servicio REST:** Realice una petición `POST` al endpoint público `{{URL}}/register` (sin token), con las cabeceras `Content-Type: application/json` y `Accept: application/json`.

:::warning Este endpoint crea cuentas principales, no sub-cuentas
`POST /register` crea una **cuenta principal** (usuario y empresa) de tipo desarrollador. Si usted es una **Casa de Software** y quiere crear la cuenta de un cliente, use [`POST /company/{uuid}/customer`](https://docs.matias-api.com/docs/endpoints/company#clientes-casa-software) con su token. Enviar `company_id` a `/register` responde 422.
:::

**Campos obligatorios:**

| Parámetro | Tipo | Requerido | Descripción | Ejemplo |
|-----------|------|-----------|-------------|----------|
| `first_name` | `string` | ✅ Sí | Nombre del usuario (máx. 100) | `"Juan"` |
| `last_name` | `string` | ✅ Sí | Apellido del usuario (máx. 100) | `"Perez"` |
| `company_name` | `string` | ✅ Sí | Razón social de la empresa (máx. 100) | `"Mi Empresa SAS"` |
| `email` | `string` | ✅ Sí | Correo electrónico válido y con dominio existente (máx. 255). Único | `"usuario@miempresa.com"` |
| `password` | `string` | ✅ Sí | Contraseña (mínimo 8 caracteres) | `"MiPassword123!"` |
| `password_confirmation` | `string` | ✅ Sí | Confirmación de la contraseña | `"MiPassword123!"` |
| `dni` | `string` | ✅ Sí | NIT o documento, **solo dígitos** (sin dígito de verificación, puntos ni guiones), máx. 15. Único. El DV lo calcula la API | `"900123456"` |

**Campos opcionales** (si no se envían, se usa el valor por defecto):

| Parámetro | Tipo | Por defecto | Descripción |
|-----------|------|-------------|-------------|
| `trade_name` | `string` | — | Nombre comercial (máx. 250). Se guarda tal como se envía |
| `identity_document_id` | `integer` | `3` | Tipo de documento ([ver glosario](https://docs.matias-api.com/docs/glossary.md)) |
| `type_organization_id` | `integer` | `1` | Tipo de organización ([ver glosario](https://docs.matias-api.com/docs/glossary.md)) |
| `tax_regime_id` | `integer` | `1` | Régimen fiscal ([ver glosario](https://docs.matias-api.com/docs/glossary.md)) |
| `tax_level_id` | `integer` | `5` | Nivel fiscal ([ver glosario](https://docs.matias-api.com/docs/glossary.md)) |
| `country_id` | `integer` | `45` | País |
| `city_id` | `integer` | `149` | Ciudad ([ver glosario](https://docs.matias-api.com/docs/glossary.md)) |
| `address` | `string` | `""` | Dirección física |
| `location` | `string` | `""` | Ubicación (texto libre) |
| `postal_code` | `string` | `""` | Código postal |
| `mobile` | `string` | `""` | Teléfono celular |
| `phone` | `string` | `""` | Teléfono fijo |
| `web` | `string` | `""` | Sitio web |

- El usuario se crea siempre como **desarrollador**: un `type_id` enviado se ignora.
- Nombres, apellidos y razón social se guardan en **mayúsculas**.
- La cuenta recibe una suscripción inicial **FREE de 100 documentos por 1 año**. En el sandbox, la cuenta principal recibe en su lugar una suscripción de pruebas de **5.000 documentos por 1 año**.
- La respuesta **no** incluye token: el correo queda **sin verificar** y hay que abrir el enlace del correo antes de iniciar sesión (ver [Paso 2](https://docs.matias-api.com/docs/intro#obtener-el-token-de-acceso)).

**📦 Ver JSON de Petición (Request Body)**

```json
{
  "first_name": "Juan",
  "last_name": "Perez",
  "company_name": "Mi Empresa SAS",
  "email": "usuario@miempresa.com",
  "password": "MiPassword123!",
  "password_confirmation": "MiPassword123!",
  "dni": "900123456",
  "address": "Calle 123 #45-67",
  "mobile": "3001234567",
  "city_id": 149,
  "identity_document_id": 3,
  "type_organization_id": 1,
  "tax_regime_id": 1,
  "tax_level_id": 5
}
```

**📦 Ver Respuesta Exitosa (HTTP 200)**

```json
{
  "message": "Empresa creada con éxito. Verifique su dirección de correo electrónico: usuario@miempresa.com",
  "success": true
}
```

**📦 Ver Respuestas de Error (HTTP 422 / 400 / 500)**

**Respuesta HTTP 422 (Error de Validación):** formato estándar, sin campo `success`. Requiere `Accept: application/json`; sin esa cabecera, la respuesta es una redirección (HTTP 302).

```json
{
  "message": "El correo electrónico ya existe (and 1 more error)",
  "errors": {
    "email": [
      "El correo electrónico ya existe"
    ],
    "dni": [
      "El NIT ya existe"
    ]
  }
}
```

| Campo | Mensajes posibles |
|-------|-------------------|
| `first_name` | `El nombre es requerido` |
| `last_name` | `El apellido es requerido` |
| `company_name` | `El nombre de la empresa es requerido` |
| `email` | `El correo electrónico es requerido` · `El correo electrónico no es válido o su dominio no existe` · `El correo electrónico ya existe` |
| `dni` | `El NIT es requerido` · `El NIT ya existe` · `El NIT debe contener solo dígitos, sin puntos, guiones ni dígito de verificación` · `El NIT no puede tener más de 15 dígitos` |
| `company_id` | `Este endpoint no crea sub-cuentas. Use POST /api/ubl2.1/company/{uuid}/customer con el token del desarrollador.` |

Los errores de `password` (longitud, confirmación) usan los mensajes estándar de validación.

**Respuesta HTTP 400 (Dato Inválido):** un valor de catálogo no existe (por ejemplo, `country_id`, `city_id` o `tax_level_id`). No se crea nada. El `message` trae el detalle técnico del rechazo: revise los IDs contra el [glosario](https://docs.matias-api.com/docs/glossary.md).

```json
{
  "success": false,
  "message": "Detalle técnico del valor de catálogo rechazado"
}
```

**Respuesta HTTP 500 (Error Interno):**

```json
{
  "success": false,
  "message": "Error interno del servidor. ...",
  "reference": "3f1c2b9e-8d7a-4c6b-9e5f-1a2b3c4d5e6f"
}
```

Indique la `reference` al soporte técnico.

:::caution Si el 500 llega por el correo de verificación
Si falla el envío del correo de verificación, la API responde 500 aunque **la cuenta ya quedó creada**. No repita `POST /register` (respondería 422 `El correo electrónico ya existe`): pida un correo nuevo con [`POST /email/verification-notification`](https://docs.matias-api.com/docs/endpoints/intro-auth#verificacion-correo).
:::

---

## 🔑 Paso 2: Obtener el Token de Acceso

:::warning Primero verifique su correo
Después de `POST /register`, abra el enlace de verificación que llega al correo registrado. Hasta hacerlo, el login responde **HTTP 404** con `El correo electrónico no ha sido verificado. Comuníquese con el administrador.` Si el correo no llegó o el enlace venció, pida uno nuevo con [`POST /email/verification-notification`](https://docs.matias-api.com/docs/endpoints/intro-auth#verificacion-correo).
:::

Con el correo verificado, obtenga su token de acceso enviando una petición `POST` al endpoint `{{URL}}/auth/login`. Para emitir documentos ante la DIAN necesitará, además, los [requisitos previos](https://docs.matias-api.com/docs/intro#nota-importante) configurados en el portal.

### Parámetros del Body

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `email` | `string` | ✅ Sí | Correo electrónico registrado |
| `password` | `string` | ✅ Sí | Contraseña de la cuenta |
| `remember_me` | `boolean` | No | Opcional; no cambia la vigencia del token |

**📦 Ver JSON de Petición (Request Body)**

```json
{
  "email": "usuario@miempresa.com",
  "password": "MiPassword123!"
}
```

**📦 Ver Respuesta Exitosa (HTTP 200)**

```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjM",
  "token_id": "f2e1eb82d52213a6b1c0d3e4f5a60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f9",
  "user": {
    "id": 1,
    "type_id": 2,
    "first_name": "JUAN",
    "last_name": "PEREZ",
    "email": "usuario@miempresa.com",
    "avatar": null,
    "active": 1,
    "name": "JUAN PEREZ",
    "avatarUrl": null,
    "user_type": {
      "id": 2,
      "user_type_name": "DESARROLLADOR",
      "type": 2,
      "active": 1
    }
  },
  "expires_at": "2026-05-02 19:55:42",
  "message": "Bienvenido. Su sesión ha sido iniciada con éxito.",
  "success": true
}
```

El token vence en `expires_at` (por defecto, 90 días después del login).

**📦 Ver Respuestas de Inicio de Sesión Rechazado (HTTP 404)**

Todos los rechazos del login responden **HTTP 404** (no 401):

```json
{
  "message": "Credenciales inválidas.",
  "success": false
}
```

Otros mensajes posibles: `El usuario se encuentra inactivo. Comuníquese con el administrador.`, `El correo electrónico no ha sido verificado. Comuníquese con el administrador.`, `No se ha encontrado el perfil de usuario.`, `No se ha encontrado la empresa asociada al usuario.` y `La empresa se encuentra inactiva. Comuníquese con el administrador.` [Ver detalle](https://docs.matias-api.com/docs/endpoints/intro-auth#autenticacion).

---

## 🔐 Paso 3: Uso del Token de Acceso

Incluya el token obtenido en todas sus llamadas HTTP a endpoints protegidos. Los ejemplos consultan el usuario autenticado con `GET {{URL}}/auth/user` (equivalente a `GET {{URL}}/profile`), que responde con el usuario dentro de `dataRecords.data`.

### 📄 Formato del Encabezado

```http
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjM...
```

### 💻 Ejemplos de Implementación

**Node.js**

```javascript
const axios = require('axios');
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjM...'; // Token de acceso

const headers = {
   'Content-Type': 'application/json', 
   'Accept': 'application/json',
   'Authorization': `Bearer ${token}`
};

axios.get('{{URL}}/auth/user', { headers })
.then(response => {
    console.log(response.data);
})
.catch(error => {
    console.error(error);
});
```

**Python**

```python
import requests

url = "{{URL}}/auth/user"
token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjM..."

headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': f'Bearer {token}'
}

response = requests.get(url, headers=headers)
print(response.json())
```

**PHP**

```php
$token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjM...';

$curl = curl_init();
curl_setopt_array($curl, array(
  CURLOPT_URL => "{{URL}}/auth/user",
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

**Java**

```java
OkHttpClient client = new OkHttpClient().newBuilder().build();
String token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjM...";

Request request = new Request.Builder()
  .url("{{URL}}/auth/user")
  .method("GET", null)
  .addHeader("Content-Type", "application/json")
  .addHeader("Accept", "application/json")
  .addHeader("Authorization", "Bearer " + token)
  .build();
Response response = client.newCall(request).execute();
```

**C#**

```csharp
var client = new RestClient("{{URL}}/auth/user");
var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjM...";

var request = new RestRequest(Method.GET);
request.AddHeader("Content-Type", "application/json");
request.AddHeader("Accept", "application/json");
request.AddHeader("Authorization", "Bearer " + token);
IRestResponse response = client.Execute(request);
Console.WriteLine(response.Content);
```

**Ruby**

```ruby
require 'uri'
require 'net/http'

url = URI("{{URL}}/auth/user")
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

**Go**

```go
package main

import (
  "fmt"
  "net/http"
  "io/ioutil"
)

func main() {
  url := "{{URL}}/auth/user"
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

---

## 🚫 Paso 4: Revocar el Token

:::caution Revocación de Sesión (Logout)
Para invalidar un token activo antes de que venza, envíe una petición **GET** a `{{URL}}/auth/logout` con el token en la cabecera de autorización.
:::

**📦 Ver Respuestas de Revocación**

**Respuesta Exitosa (HTTP 200):**

```json
{
  "message": "Successfully logged out",
  "success": true
}
```

**Respuesta de Error / No Autenticado (HTTP 401):** sin token, o con un token inválido o ya revocado. Este JSON (sin campo `success`) solo se recibe si la petición envía `Accept: application/json`; sin esa cabecera, la respuesta es una redirección (HTTP 302).

```json
{
  "message": "Unauthenticated."
}
```

El logout revoca solo el token usado en la petición. Para revocar un Personal Access Token concreto o todos los demás, use [`DELETE /tokens/{id}` o `POST /tokens/revoke-all`](https://docs.matias-api.com/docs/endpoints/intro-auth#personal-access-tokens).

---

## 🔗 Siguientes Pasos y Conceptos Avanzados

Una vez completada la autenticación, explore los temas avanzados y recursos clave para la integración:

### 🔔 Webhooks: Notificaciones en Tiempo Real

:::tip Eventos del Ciclo de Vida
Los webhooks le permiten recibir notificaciones automáticas y seguras (firmadas con HMAC-SHA256) directamente en su servidor cuando ocurren eventos clave como:
- **Documentos electrónicos** (los mismos eventos para facturas, notas, documento soporte, nómina y demás tipos): `document.created`, `document.emitted`, `document.accepted`, `document.rejected`, `document.voided`
- **Correos:** `email.sent`, `email.delivered`, `email.bounced`, `email.complaint`, `email.opened`, `email.clicked`
- **Envío masivo:** `bulk.batch.completed`

Suscribirse a un evento que no está en el catálogo responde 422 (`Evento inválido: <evento>`).

[📖 Ver catálogo completo de eventos](https://docs.matias-api.com/docs/endpoints/webhooks#eventos-disponibles) · [Firma HMAC](https://docs.matias-api.com/docs/endpoints/webhooks#seguridad-hmac)
:::

### 📊 Límites de Consumo y Membresías {#límites-de-consumo-y-membresías}

Cada cuenta tiene una **bolsa de documentos por periodo de suscripción** (normalmente anual, ampliable con recargas), no un cupo mensual. Los correos tienen sus propios topes según el plan: un máximo anual de correos (contado por año calendario, desde el 1 de enero), un máximo de destinatarios por envío y un máximo de reenvíos por documento. Consulte su saldo con `GET /memberships/summary` o el historial de recargas con `GET /memberships/recharges`.

**📦 Ver Respuestas de Límite de Consumo (HTTP 402 / 429 / 413)**

**Sin cupo o membresía inactiva (HTTP 402)** — al enviar un documento:

```json
{
  "success": false,
  "message": "Límite de documentos de la membresía alcanzado o membresía inactiva."
}
```

**Plan FREE: límite diario alcanzado (HTTP 429)** — el plan FREE permite un número de documentos por día (10 por defecto):

```json
{
  "success": false,
  "message": "Límite diario alcanzado. Plan FREE permite 10 documentos por día.",
  "limit": 10,
  "consumed_today": 10,
  "upgrade_url": "https://api.ejemplo.com/upgrade"
}
```

**Envío masivo: cupo insuficiente para el lote (HTTP 402):**

```json
{
  "success": false,
  "message": "Cuota insuficiente para procesar el lote completo.",
  "requested": 250
}
```

**Envío masivo: lote mayor que el máximo de su suscripción (HTTP 413):**

```json
{
  "success": false,
  "message": "El lote excede el máximo permitido para tu suscripción.",
  "max_items": 100,
  "received": 250,
  "upgrade_url": "https://api.ejemplo.com/upgrade"
}
```

Las respuestas de límite no traen un código de error ni una fecha de reinicio: use `GET /memberships/summary` para conocer el consumo y el saldo.

[📖 Consultar consumo en tiempo real](https://docs.matias-api.com/docs/endpoints/memberships-health#memberships-consumption)

---

### 🏛️ Marco Regulatorio DIAN

Matias cumple rigurosamente con los marcos regulatorios y anexos técnicos oficiales vigentes de la DIAN para documentos electrónicos:

| Documento | Resolución | Versión | Estado |
|-----------|-----------|---------|---------|
| **Factura Electrónica** | 000165/2024 | v1.9 | ✅ Vigente |
| **Nómina Electrónica** | 0000040/2024 | v3.0 | ✅ Vigente |
| **RADIAN** | 000198/2024 | v2.0 | ✅ Vigente |
| **Documento Soporte** | 000160/2024 | v1.1 | ✅ Vigente |

#### 🚀 Accesos Rápidos a Guías Técnicas
- 📄 **[Campos del Documento](https://docs.matias-api.com/docs/billing-fields.md)** - Especificaciones completas de campos y Sector Salud.
- 💼 **[Nómina Electrónica](https://docs.matias-api.com/docs/payroll/payroll-fields.md)** - Guía completa de campos y devengos/deducciones.
- 🌐 **[Eventos RADIAN](https://docs.matias-api.com/docs/endpoints/events-radian.md)** - Endpoints para acuses y recepción de facturas.
- 📋 **[Documento Soporte](https://docs.matias-api.com/docs/endpoints/support-documents.md)** - Operaciones con no obligados a facturar.
- 📚 **[Glosario Técnico](https://docs.matias-api.com/docs/glossary.md)** - Términos técnicos, normativas y acrónimos.
- 📥 **[Anexos Oficiales DIAN](https://www.dian.gov.co/impuestos/factura-electronica)** - Descargas directas del portal DIAN.

---

## 💬 Soporte y Ayuda

¿Necesita soporte durante su proceso de integración? Nuestro equipo técnico especializado está disponible para guiarle.

:::warning Canales de Atención Exclusivos
El soporte técnico y de integración comercial se brinda **únicamente a clientes con suscripciones activas**.

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

:::

---

**Versión de Documentación:** 3.7.0 | **Última actualización:** Agosto 2026 | **API:** v3.7.0

---

<!-- Fuente: https://docs.matias-api.com/docs/sandbox/quickstart -->

# ⚡ Quickstart — MATIAS API Sandbox

Guía rápida para integrar con el sandbox de MATIAS API en 5 minutos. El sandbox es un ambiente aislado donde puedes probar todos nuestros endpoints sin alterar tus datos reales de producción ni realizar transmisiones fiscales ante la DIAN.

---

:::info 🌐 Enlaces Oficiales del Sandbox
El entorno de pruebas cuenta con los siguientes puntos de acceso oficiales:
* **API Sandbox:** **`https://sandbox-api.matias-api.com/api/ubl2.1`** (marcador `{{SANDBOX_URL}}` en tus peticiones).
* **Portal Web Sandbox:** **`https://sandbox-auth.matias-api.com/`** (panel administrativo visual del sandbox).
* **Variable de Entorno Base:** En tus integraciones utiliza `{{url}}` / `{{SANDBOX_URL}}` de forma dinámica para alternar fácilmente entre Sandbox y Producción.
:::

---

## 1. Crear cuenta en el Sandbox

El acceso al sandbox es **completamente gratuito y no requiere contrato**. Para comenzar tus pruebas, debes crear una **cuenta independiente en el entorno Sandbox**, ya sea desde el portal web visual o mediante el endpoint API de registro:

**cURL**

```bash
curl -X POST {{SANDBOX_URL}}/register \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "first_name": "Tu Nombre",
    "last_name": "Tu Apellido",
    "company_name": "Mi Empresa SAS",
    "email": "tu@email.com",
    "password": "tu-password-seguro",
    "password_confirmation": "tu-password-seguro",
    "dni": "900123456"
  }'
```

**JavaScript (Axios)**

```javascript
import axios from 'axios';

const SANDBOX_URL = 'https://sandbox-api.matias-api.com/api/ubl2.1';

const response = await axios.post(`${SANDBOX_URL}/register`, {
  first_name: "Tu Nombre",
  last_name: "Tu Apellido",
  company_name: "Mi Empresa SAS",
  email: "tu@email.com",
  password: "tu-password-seguro",
  password_confirmation: "tu-password-seguro",
  dni: "900123456"
}, {
  headers: { Accept: 'application/json' }
});

console.log(response.data);
```

**PHP (Guzzle)**

```php
use GuzzleHttp\Client;

$client = new Client();
$sandboxUrl = 'https://sandbox-api.matias-api.com/api/ubl2.1';

$response = $client->post("{$sandboxUrl}/register", [
    'headers' => ['Accept' => 'application/json'],
    'json'    => [
        'first_name'            => 'Tu Nombre',
        'last_name'             => 'Tu Apellido',
        'company_name'          => 'Mi Empresa SAS',
        'email'                 => 'tu@email.com',
        'password'              => 'tu-password-seguro',
        'password_confirmation' => 'tu-password-seguro',
        'dni'                   => '900123456'
    ]
]);

echo $response->getBody();
```

**Respuesta Exitosa (HTTP 200):** no incluye token ni datos de la cuenta.

```json
{
  "message": "Empresa creada con éxito. Verifique su dirección de correo electrónico: tu@email.com",
  "success": true
}
```

- El `dni` va **solo con dígitos** (sin dígito de verificación, puntos ni guiones); el DV lo calcula la API.
- En el sandbox, la cuenta principal recibe una suscripción de **5.000 documentos por 1 año**.
- Envía siempre `Accept: application/json`: sin esa cabecera, los errores de validación (422) llegan como una redirección (HTTP 302). Ver todos los campos y errores en [Registro en la API](https://docs.matias-api.com/docs/intro#registro-en-la-api).

### 1.1 Verificar el correo (obligatorio)

La cuenta queda con el correo **sin verificar**. Abre el enlace que llega a tu correo antes de iniciar sesión: hasta hacerlo, `POST /auth/login` responde **HTTP 404**:

```json
{
  "message": "El correo electrónico no ha sido verificado. Comuníquese con el administrador.",
  "success": false
}
```

Si el correo no llegó o el enlace venció, pide uno nuevo:

```bash
curl -X POST {{SANDBOX_URL}}/email/verification-notification \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email": "tu@email.com"}'
```

Más detalles en [Verificación de Correo](https://docs.matias-api.com/docs/endpoints/intro-auth#verificacion-correo).

:::warning ⚠️ Cuentas Separadas: Producción vs Sandbox
**Las credenciales de Producción NO funcionan en Sandbox, ni las de Sandbox en Producción.**

Debes crear **DOS CUENTAS INDEPENDIENTES** según el entorno en el que vayas a operar:
* **Cuenta de Sandbox:** Creada en `https://sandbox-auth.matias-api.com/` o vía `POST {{SANDBOX_URL}}/register`. No requiere contrato y es 100% gratuita para desarrollo y pruebas.
* **Cuenta de Producción:** Creada en el ambiente productivo proporcionado al contratar el servicio. Requiere certificado digital real y resoluciones DIAN vigentes.
:::

---

## 2. Iniciar sesión en el Sandbox

Con el correo verificado, inicia sesión con las **credenciales de tu cuenta de Sandbox** para obtener el token JWT de acceso (`access_token`):

```bash
curl -X POST {{SANDBOX_URL}}/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "email": "tu@email.com",
    "password": "tu-password-seguro"
  }'
```

**Respuesta Exitosa (HTTP 200):**

```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIs...",
  "token_id": "f2e1eb82d52213a6b1c0d3e4f5a60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f9",
  "user": {
    "id": 1,
    "type_id": 2,
    "first_name": "TU NOMBRE",
    "last_name": "TU APELLIDO",
    "email": "tu@email.com",
    "avatar": null,
    "active": 1,
    "name": "TU NOMBRE TU APELLIDO",
    "avatarUrl": null,
    "user_type": {
      "id": 2,
      "user_type_name": "DESARROLLADOR",
      "type": 2,
      "active": 1
    }
  },
  "expires_at": "2026-05-15 20:00:00",
  "message": "Bienvenido. Su sesión ha sido iniciada con éxito.",
  "success": true
}
```

Si el login falla, la API responde **HTTP 404** (no 401) con `message` y `success: false` (por ejemplo, `Credenciales inválidas.`). Ver todos los motivos en [Autenticación](https://docs.matias-api.com/docs/endpoints/intro-auth#autenticacion).

---

## 3. Generar un Personal Access Token (PAT)

Genera tu token de acceso persistente de larga duración para realizar pruebas automatizadas de integración:

```bash
curl -X POST {{SANDBOX_URL}}/tokens \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"name": "Token Integracion ERP Sandbox"}'
```

`expires_in_days` es opcional (de 1 a 365; por defecto, 90). Cada usuario puede crear hasta **10 tokens por día**; al superarlo, la API responde **HTTP 429**.

**Respuesta Exitosa (HTTP 201):**

```json
{
  "dataRecords": {
    "data": {
      "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIs...",
      "token_id": "cb6282ed9f5cb116416928518f9dd93b53aafc2c0273722bbe5eb7eb96d7ccfac10178f43b8fe617",
      "name": "Token Integracion ERP Sandbox",
      "description": null,
      "expires_at": "2026-05-02 12:00:00",
      "created_at": "2026-02-01 12:00:00"
    }
  },
  "message": "Token creado exitosamente. Asegúrese de guardar el token, ya que no podrá verlo nuevamente.",
  "success": true
}
```

El token está en `dataRecords.data.token` y solo se muestra **una vez**: guárdalo en ese momento.

:::tip 🔑 Autenticación JWT Estándar
Tanto en producción como en el ambiente sandbox, el token generado es un **JWT estándar**, garantizando un esquema de autenticación idéntico y seguro para todos tus entornos.
:::

---

## 4. Enviar documentos electrónicos

El sandbox soporta **todos los tipos de documento** de la API. A continuación se detallan los comandos estructurados por módulo:

### 4.1 Factura Electrónica y Sector Salud (Resolución 000948 de 2026)

```bash
# Factura Electrónica Estándar
curl -X POST {{SANDBOX_URL}}/invoice \
  -H "Authorization: Bearer {tu_token}" \
  -H "Content-Type: application/json" \
  -d @tu-factura.json

# Factura Electrónica del Sector Salud (con objeto health)
curl -X POST {{SANDBOX_URL}}/invoice \
  -H "Authorization: Bearer {tu_token}" \
  -H "Content-Type: application/json" \
  -d @factura-salud.json
```

### 4.2 Notas Crédito y Débito

```bash
# Enviar Nota Crédito (Estándar o Sector Salud)
curl -X POST {{SANDBOX_URL}}/notes/credit \
  -H "Authorization: Bearer {tu_token}" \
  -H "Content-Type: application/json" \
  -d @nota-credito.json

# Enviar Nota Débito
curl -X POST {{SANDBOX_URL}}/notes/debit \
  -H "Authorization: Bearer {tu_token}" \
  -H "Content-Type: application/json" \
  -d @nota-debito.json
```

### 4.3 Documento P.O.S Electrónico

```bash
# Documento POS
curl -X POST {{SANDBOX_URL}}/pos \
  -H "Authorization: Bearer {tu_token}" \
  -H "Content-Type: application/json" \
  -d @documento-pos.json
```

### 4.4 Documento Soporte y Nota de Ajuste

```bash
# Enviar Documento Soporte Electrónico
curl -X POST {{SANDBOX_URL}}/ds/document \
  -H "Authorization: Bearer {tu_token}" \
  -H "Content-Type: application/json" \
  -d @documento-soporte.json

# Enviar Nota de Ajuste a Documento Soporte
curl -X POST {{SANDBOX_URL}}/ds/adjustment-note \
  -H "Authorization: Bearer {tu_token}" \
  -H "Content-Type: application/json" \
  -d @nota-ajuste-ds.json
```

### 4.5 Nómina Electrónica

```bash
# Enviar Nómina Individual
curl -X POST {{SANDBOX_URL}}/ep/payroll \
  -H "Authorization: Bearer {tu_token}" \
  -H "Content-Type: application/json" \
  -d @nomina.json

# Enviar Reemplazo de Nómina
curl -X POST {{SANDBOX_URL}}/ep/payroll/replace \
  -H "Authorization: Bearer {tu_token}" \
  -H "Content-Type: application/json" \
  -d @nomina-replace.json

# Enviar Eliminación de Nómina
curl -X POST {{SANDBOX_URL}}/ep/payroll/delete \
  -H "Authorization: Bearer {tu_token}" \
  -H "Content-Type: application/json" \
  -d @nomina-delete.json
```

### 4.6 Documentos con Numeración Automática (Auto-increment)

```bash
# Factura con consecutivo automático
curl -X POST {{SANDBOX_URL}}/auto-increment/invoices \
  -H "Authorization: Bearer {tu_token}" \
  -H "Content-Type: application/json" \
  -d @factura-auto.json

# Nota Crédito con consecutivo automático
curl -X POST {{SANDBOX_URL}}/auto-increment/credit-notes \
  -H "Authorization: Bearer {tu_token}" \
  -d @nc-auto.json

# Documento Soporte con consecutivo automático
curl -X POST {{SANDBOX_URL}}/auto-increment/support-documents \
  -H "Authorization: Bearer {tu_token}" \
  -d @ds-auto.json

# Documento POS con consecutivo automático
curl -X POST {{SANDBOX_URL}}/auto-increment/pos-documents \
  -H "Authorization: Bearer {tu_token}" \
  -d @pos-auto.json
```

:::tip 🔄 Reenvíos de Auto-incremento
Todos los endpoints con numeración automática soportan la llamada **`PATCH /{uuid}`** para gestionar reenvíos transparentes de documentos previamente generados.
:::

### 4.7 Eventos RADIAN (Recepción y Trazabilidad)

En el sandbox, el módulo de recepción está **siempre habilitado** (no se responde `403` `RECEPTION_NOT_IN_PLAN`) y el cupo de recepción es **ilimitado**. Aun así, el sandbox **no crea** los prerrequisitos de la recepción: sin ellos, importar o enviar eventos responde `400`.

:::warning Prerrequisitos antes de importar o enviar eventos
1. **Numeración activa de eventos** (`type_document_id` `12`), registrada en el portal o con [`POST /resolutions`](https://docs.matias-api.com/docs/endpoints/dian-resolutions#configuracion-manual). Sin ella: `400` `No tiene una numeración activa para los eventos de recepción`.
2. **Persona de recepción**, creada con `POST /events/reception-people` (ver [Personas de Recepción](https://docs.matias-api.com/docs/endpoints/events-radian#personas-recepcion)). Sin ella: `400` `No tiene una persona de recepción asignada` (al importar, puedes evitarlo enviando los datos de la persona en `reception_person`).
3. *(Opcional)* **Modo automático**: una empresa nueva arranca en modo **manual**, así que importar un documento no crea eventos. Si quieres que los eventos 030, 032 y 033 se generen solos, activa el modo con `PUT /events/reception-people/mode` y `{"send_events": true}` (ver [modo de eventos](https://docs.matias-api.com/docs/endpoints/events-radian#eventos-automaticos)).
:::

```bash
# 1. Registrar la persona de recepción (la primera queda por defecto)
curl -X POST {{SANDBOX_URL}}/events/reception-people \
  -H "Authorization: Bearer {tu_token}" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "identity_document_id": 1,
    "dni": "1234567890",
    "first_name": "Nombre",
    "last_name": "Apellido",
    "job_title": "Contador"
  }'

# 2. (Opcional) Activar el modo automático de eventos
curl -X PUT {{SANDBOX_URL}}/events/reception-people/mode \
  -H "Authorization: Bearer {tu_token}" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"send_events": true}'

# Importar un documento por CUFE/trackId
curl -X POST {{SANDBOX_URL}}/events/import-track-id \
  -H "Authorization: Bearer {tu_token}" \
  -H "Content-Type: application/json" \
  -d '{"trackId": "cufe-del-documento"}'

# Listar recepciones de documentos
curl -X GET {{SANDBOX_URL}}/events/document-receptions \
  -H "Authorization: Bearer {tu_token}"

# Enviar evento de acuse de recibo (030)
curl -X POST {{SANDBOX_URL}}/events/send/{trackId} \
  -H "Authorization: Bearer {tu_token}" \
  -H "Content-Type: application/json" \
  -d '{"code": "030", "notes": "Acuse de recibo"}'

# Consultar estado del evento
curl -X GET {{SANDBOX_URL}}/events/status/{trackId} \
  -H "Authorization: Bearer {tu_token}"
```

---

## 5. Simulación de Errores y Validaciones

El sandbox te permite forzar respuestas y escenarios de error en **cualquier** endpoint de documentos mediante la cabecera HTTP `X-Sandbox-Force-Status`:

```bash
# Simular documento rechazado por reglas de validación DIAN
curl -X POST {{SANDBOX_URL}}/invoice \
  -H "Authorization: Bearer {tu_token}" \
  -H "X-Sandbox-Force-Status: ERROR_REJECTED" \
  -d @tu-factura.json

# Simular timeout o indisponibilidad de la DIAN
curl -X POST {{SANDBOX_URL}}/ep/payroll \
  -H "Authorization: Bearer {tu_token}" \
  -H "X-Sandbox-Force-Status: ERROR_TIMEOUT" \
  -d @nomina.json
```

:::warning 🛡️ Aislamiento del Entorno
La cabecera `X-Sandbox-Force-Status` **solo es procesada en el sandbox**. En producción, esta cabecera es ignorada por motivos de seguridad e integridad tributaria.
:::

Consulta el catálogo completo de cabeceras en la guía de [Magic Values](https://docs.matias-api.com/docs/sandbox/magic-values.md).

---

## 6. Verificación de Cabeceras del Entorno

Todas las respuestas emitidas por el sandbox inyectan la siguiente cabecera HTTP de diagnóstico:

```http
X-MATIAS-Environment: sandbox
```

---

## 📊 Matriz de Endpoints Soportados en el Sandbox

El sandbox ofrece paridad funcional total con el entorno de producción para los 20 módulos de la API:

### 📄 1. Emisión y Transmisión de Documentos

| Endpoint API | Método | Tipo de Documento / Operación |
|:---|:---:|:---|
| `/invoice` | `POST` | Factura Electrónica estándar y Sector Salud (Resolución 000948 de 2026) |
| `/pos` | `POST` | Documento Equivalente POS Electrónico |
| `/notes/credit` | `POST` | Nota Crédito electrónica (incluye notas en salud `SS-CUDE`) |
| `/notes/debit` | `POST` | Nota Débito electrónica |
| `/ds/document` | `POST` | Documento Soporte Electrónico |
| `/ds/adjustment-note` | `POST` | Nota de Ajuste a Documento Soporte |
| `/ep/payroll` | `POST` | Nómina Electrónica Individual |
| `/ep/payroll/replace` | `POST` | Reemplazo de Nómina Electrónica |
| `/ep/payroll/delete` | `POST` | Eliminación de Nómina Electrónica |
| `/auto-increment/invoices` | `POST` | Factura con consecutivo automático |
| `/auto-increment/credit-notes` | `POST` | Nota Crédito automática |
| `/auto-increment/debit-notes` | `POST` | Nota Débito automática |
| `/auto-increment/support-documents` | `POST` | Documento Soporte automático |
| `/auto-increment/adjustment-notes` | `POST` | Nota de Ajuste automática |
| `/auto-increment/pos-documents` | `POST` | Documento POS automático |
| `/auto-increment/pos-credit-notes` | `POST` | Nota Crédito POS automática |
| `/auto-increment/pos-debit-notes` | `POST` | Nota Débito POS automática |
| `/bulk/documents` | `POST` | Emisión Masiva de Documentos (Bulk) |

### 📥 2. Eventos RADIAN y Consultas de Estado

| Endpoint API | Método | Descripción |
|:---|:---:|:---|
| `/events/import-track-id` | `POST` | Importar documento por CUFE/trackId |
| `/events/document-receptions` | `GET` | Listar recepciones de documentos |
| `/events/send/{trackId}` | `POST` | Enviar evento DIAN (030, 031, 032, 033) |
| `/events/send-bulk` | `POST` | Enviar en bloque el acuse 030 de varios documentos |
| `/events/{id}/cancel` | `POST` | Cancelar evento RADIAN en estado PENDING |
| `/events/status/{trackId}` | `GET` | Consultar estado del evento RADIAN |
| `/events/mailbox` | `GET` | Bandeja del buzón de recepción (correos entrantes) |
| `/events/mailbox/{id}` | `GET` | Detalle de un correo del buzón |
| `/events/mailbox/address` | `GET` | Dirección del buzón de recepción de la empresa |
| `/events/mailbox/quota` | `GET` | Consumo del cupo de recepción (ilimitado en sandbox) |
| `/events/mailbox/{id}/retry` | `POST` | Reintentar el procesamiento de un correo del buzón |
| `/events/reception-people` | `GET` · `POST` | Listar o registrar personas de recepción |
| `/events/reception-people/mode` | `PUT` | Cambiar el modo de eventos de la empresa (`send_events`) |
| `/events/reception-people/{uuid}` | `PUT` · `DELETE` | Actualizar o eliminar una persona de recepción |
| `/events/reception-people/{uuid}/default` | `POST` | Marcar una persona de recepción como la de por defecto |
| `/status/zip/{trackId}` | `POST` | Consultar estado ZIP de envío |
| `/status/document/{trackId}` | `POST` | Consultar estado del documento |
| `/documents/{uuid}/files` | `GET` | Obtener archivos asociados (PDF, XML, ApplicationResponse) |

### 🛠️ 3. Configuración, Catálogos y Utilidades

| Familia de Endpoints | Descripción del Comportamiento |
|:---|:---|
| `/auth/*` y `/tokens/*` | Autenticación, gestión de sesiones y Personal Access Tokens (PAT). |
| `/profile/*` | Consulta y actualización de datos de usuario. |
| `/company/*` | Consulta, actualización de empresa, logos y gestión de clientes. |
| `/resolutions/*` | Registro, consulta y sincronización de numeraciones DIAN. |
| `/software/*` y `/certificate/*` | Configuración de software DIAN y certificado digital de firma. |
| `/currency/*` | Consulta de monedas y configuración de tasas de cambio (TRM). |
| `/settings/templates/*` y `/settings/reports/*` | Plantillas PDF y encabezados de reporte. |
| `/webhooks/*` | Registro, delivery history y firma HMAC de webhooks. |
| `/memberships/*` | Consulta de membresías y consumo de documentos. |
| `/numbers-to-letters` y `/digit-verification` | Utilidades públicas de conversión a letras y dígito de verificación. |

---

## ⚖️ Comparativa: Producción vs Sandbox

| Aspecto | Producción | Sandbox |
|:---|:---|:---|
| **Cuentas y Acceso** | Requiere contrato comercial activo; credenciales emitidas en producción | **100% Gratuito y sin contrato**; cuenta independiente creada en Sandbox |
| **Dominio API** | `{{url}}` (URL entregada al contratar el servicio) | `{{SANDBOX_URL}}` (`https://sandbox-api.matias-api.com/api/ubl2.1`) |
| **Transmisión DIAN** | Transmisión SOAP en tiempo real a los servidores de la DIAN | Respuestas DIAN simuladas y mockeadas automáticamente |
| **Firma Digital** | Certificado digital de firma emitido por entidad de certificación (ONAC) | Certificado digital de prueba (*Test Cert*) asignado automáticamente |
| **Persistencia** | Datos persistidos en base de datos de producción | Aislamiento completo de base de datos |
| **Autenticación** | JWT estándar | JWT estándar con credenciales de Sandbox |
| **Endpoints Disponibles** | 20 módulos oficiales | **100% de paridad funcional** |
| **Tasa de Cambio (TRM)** | Consulta en tiempo real de la TRM oficial | Valores adaptables y controlables |

---

## 🚀 Próximos Pasos

* [Magic Values](https://docs.matias-api.com/docs/sandbox/magic-values.md) — Conoce todas las cabeceras para simular errores y respuestas DIAN.
* [Certificado de Prueba](https://docs.matias-api.com/docs/sandbox/test-cert.md) — Especificaciones del certificado digital de pruebas.
* [Colección Postman](https://docs.matias-api.com/docs/sandbox/postman.md) — Descarga la colección oficial para importar en Postman / Insomnia.

---

<!-- Fuente: https://docs.matias-api.com/docs/sandbox/magic-values -->

# 🪄 Magic Values — MATIAS API Sandbox

:::info 🌐 Enlaces Oficiales del Sandbox
* **API Sandbox:** **`https://sandbox-api.matias-api.com/api/ubl2.1`** (marcador `{{SANDBOX_URL}}` en tus peticiones).
* **Portal Web Sandbox:** **`https://sandbox-auth.matias-api.com/`** (portal de administración visual del sandbox).
:::

---

El sandbox soporta **32 magic values** que permiten simular diferentes respuestas, códigos de validación y escenarios de rechazo de la DIAN sin necesidad de endpoints especiales ni alterar la integridad de tus esquemas de datos.

---

## 🛠️ Cómo Utilizarlos

Envía el encabezado HTTP `X-Sandbox-Force-Status` en **cualquier** petición de generación o transmisión de documentos:

* `POST /invoice` — Factura electrónica estándar, Sector Salud (Resolución 000948 de 2026) y Documento Equivalente POS Electrónico
* `POST /notes/credit` — Nota crédito electrónica
* `POST /notes/debit` — Nota débito electrónica
* `POST /ds/document` — Documento Soporte electrónico
* `POST /ds/adjustment-note` — Nota de ajuste a Documento Soporte
* `POST /ep/payroll` — Nómina electrónica individual
* `POST /ep/payroll/replace` — Reemplazo de nómina electrónica
* `POST /ep/payroll/delete` — Eliminación de nómina electrónica
* `POST /auto-increment/invoices` — Factura con consecutivo automático
* `POST /auto-increment/credit-notes` — Nota Crédito automática
* `POST /auto-increment/debit-notes` — Nota Débito automática
* `POST /auto-increment/support-documents` — Documento Soporte automático
* `POST /auto-increment/adjustment-notes` — Nota de Ajuste automática
* `POST /auto-increment/pos-documents` — Documento POS automático

:::note Notas del POS
No existen rutas propias para el POS ni para sus notas (`/pos`, `/auto-increment/pos-credit-notes` o `/auto-increment/pos-debit-notes`). El POS se emite con `POST /invoice` o `POST /auto-increment/pos-documents`, y sus notas con `POST /notes/credit`, `POST /notes/debit`, `POST /auto-increment/credit-notes` o `POST /auto-increment/debit-notes`.
:::

```bash
# Ejemplo 1: Forzar rechazo de validación en una factura
curl -X POST {{SANDBOX_URL}}/invoice \
  -H "Authorization: Bearer {token}" \
  -H "X-Sandbox-Force-Status: ERROR_REJECTED" \
  -H "Content-Type: application/json" \
  -d @invoice.json

# Ejemplo 2: Forzar error de CUDE en POS electrónico
curl -X POST {{SANDBOX_URL}}/auto-increment/pos-documents \
  -H "Authorization: Bearer {token}" \
  -H "X-Sandbox-Force-Status: ERROR_POS_CUDE_INVALID" \
  -H "Content-Type: application/json" \
  -d @pos.json

# Ejemplo 3: Forzar impuesto no permitido en Documento Soporte
curl -X POST {{SANDBOX_URL}}/ds/document \
  -H "Authorization: Bearer {token}" \
  -H "X-Sandbox-Force-Status: ERROR_DS_TAX_INVALID" \
  -H "Content-Type: application/json" \
  -d @ds.json

# Ejemplo 4: Forzar CUNE inválido en Nómina Electrónica
curl -X POST {{SANDBOX_URL}}/ep/payroll \
  -H "Authorization: Bearer {token}" \
  -H "X-Sandbox-Force-Status: ERROR_PAYROLL_CUNE_INVALID" \
  -H "Content-Type: application/json" \
  -d @payroll.json
```

:::tip Comportamiento por Defecto (Happy Path)
Si no se envía la cabecera `X-Sandbox-Force-Status`, el sandbox valida la sintaxis básica y devuelve automáticamente un estado `ACCEPTED` (aprobado por DIAN con código `00`).
:::

---

## 📋 Catálogo Completo de Magic Values (32)

### 1. ⚙️ Errores Generales y de Infraestructura (6)
Aplican a **todos** los tipos de documento:

| Header Value | Comportamiento | Código DIAN | Caso de Uso |
|---|---|:---:|---|
| `ERROR_REJECTED` | Documento rechazado por validación de negocio | `B7B01` | Probar manejo de rechazos generales |
| `ERROR_DUPLICATE` | Documento ya reportado previamente | `89` | Probar idempotencia y duplicados |
| `ERROR_AUTH` | Error de autenticación del certificado | `IFE043` | Probar manejo de fallos en credenciales de firma |
| `ERROR_SCHEMA` | Error de validación XSD del documento | `FAD06` | Probar control de esquemas XML inválidos |
| `ERROR_500` | Error interno del servicio DIAN durante la transmisión. La API responde HTTP 500 con `code: "DOCUMENT_POSSIBLY_SENT"` | — | Probar el manejo de un posible envío: consultar el estado, no reintentar |
| `ERROR_TIMEOUT` | Timeout de conexión con la DIAN durante la transmisión. La API responde HTTP 500 (no 504) con `code: "DOCUMENT_POSSIBLY_SENT"` | — | Probar el manejo de un posible envío: consultar el estado, no reintentar |

:::warning `ERROR_500` y `ERROR_TIMEOUT` simulan un posible envío
El fallo se simula **durante la transmisión**, cuando el documento ya pudo llegar a la DIAN. Por eso la API conserva el consecutivo y responde HTTP 500 con `code: "DOCUMENT_POSSIBLY_SENT"`, `data.uuid`, `data.document_number` y `reference`. La conducta correcta es **consultar el estado** con `GET /documents/{uuid}` o `GET /status`, no reintentar con otro número. En el envío masivo, estos items quedan en `POSSIBLY_SENT`.
:::

```json
{
  "success": false,
  "message": "No se obtuvo una respuesta definitiva para el documento SETP990000001 y es posible que la DIAN lo haya recibido. No lo emita de nuevo: consulte su estado con el uuid del envío antes de cualquier reintento. Detalle: Error interno del servidor. DIAN Web Service error: HTTP 500 Internal Server Error (simulated by sandbox)",
  "reference": "3b0c6f5e-8d2a-4c7e-9f1b-2a6d5e4c3b21",
  "code": "DOCUMENT_POSSIBLY_SENT",
  "data": {
    "uuid": "dde72910-eb42-11ef-9b27-f02f74cac485",
    "document_number": "SETP990000001"
  }
}
```

---

### 2. 📄 Errores de Factura Electrónica (12) — Anexo Técnico 1.9
Aplicables a Facturación Estándar, Exportación y Sector Salud:

| Header Value | Comportamiento | Código DIAN | Caso de Uso |
|---|---|:---:|---|
| `ERROR_MATH_ROUNDING` | Error matemático en cálculo de impuestos | `FAS01A` | Probar descuadres decimales o aritméticos |
| `ERROR_GROSS_TOTAL` | Inconsistencia en valor bruto de líneas vs cabecera | `FAD04` | Probar sumatorias incorrectas |
| `ERROR_CUFE_MISMATCH` | El CUFE calculado difiere de la validación | `FAD12` | Probar cálculos criptográficos fallidos |
| `ERROR_QR_INVALID` | Estructura de código QR inválida | `FAD13` | Probar fallos en el formato de la URL QR |
| `ERROR_SIGNATURE` | Firma XAdES inválida (alterada o política incorrecta) | `IFE044` | Probar manipulación de XML post-firma |
| `ERROR_EMAIL_MISMATCH` | Correo del receptor no coincide con el del RUT | `FAJ71` | Probar alertas de validación de identidad |
| `ERROR_NIT_INVALID` | NIT del adquirente inexistente o DV incorrecto | `DAJ48` | Probar validación de datos maestros |
| `ERROR_RESOLUTION_EXPIRED` | Resolución agotada o con fecha límite vencida | `FAD09B` | Probar control de agotamiento de resoluciones |
| `ERROR_DATE_OUT_OF_RANGE` | Fecha de emisión fuera de los días permitidos | `FAD11` | Probar desfase temporal en la transmisión |
| `ERROR_ALREADY_PROCESSED` | Documento procesado y aprobado previamente (regla 90). En sandbox llega el rechazo tal cual (ver nota) | `90` | Probar retransmisión de facturas aceptadas |
| `ERROR_SOFTWARE_SECURITY` | SoftwareSecurityCode (PIN) no autorizado | `FAB27` | Probar bloqueos de software no autorizado |
| `ERROR_ENVIRONMENT` | El schemeID no coincide con el entorno | `FAD07` | Probar envíos accidentales entre Prod y Test |

:::info `ERROR_ALREADY_PROCESSED` en sandbox
En sandbox la conciliación con la DIAN está desactivada: se recibe el rechazo tal cual (HTTP 200, `response.IsValid: "false"`, `StatusCode: "99"` con la regla `90`), sin los avisos `ALREADY_*` (`ALREADY_AUTHORIZED_RECOVERED`, `ALREADY_AUTHORIZED_OTHER_CONTENT`, `ALREADY_PROCESSED_NOT_CONFIRMED`) que sí aparecen en producción cuando la API concilia el número con la DIAN. Ver [Documento duplicado y regla 90](https://docs.matias-api.com/docs/response-json#documento-duplicado).
:::

---

### 3. 📑 Errores de Notas Crédito y Débito (3) — Anexo Técnico 1.9
| Header Value | Comportamiento | Código DIAN | Caso de Uso |
|---|---|:---:|---|
| `ERROR_NC_DATE_MISMATCH` | Fecha de generación ≠ fecha de firma | `DAD09e` | Probar sincronización de fecha y firma en NC/ND |
| `ERROR_NC_PAYMENT_METHOD` | Medio de pago no válido según catálogo DIAN | `FAN03` | Probar validación de catálogos de pago |
| `ERROR_REFERENCE_ORPHAN` | Nota crédito apunta a un CUFE inexistente | `CBG04` | Probar trazabilidad en documentos referenciados |

---

### 4. 🧾 Errores de Documento Soporte Electrónico (3) — Resolución 000167
| Header Value | Comportamiento | Código DIAN | Caso de Uso |
|---|---|:---:|---|
| `ERROR_DS_VENDOR_ID` | Identificación del vendedor inconsistente | `DSAJ25b` | Probar validación de tipo de documento del vendedor |
| `ERROR_DS_TAX_INVALID` | Impuesto no permitido (ej. ReteICA) | `DSAY13` | Probar tributos no permitidos en Documento Soporte |
| `ERROR_DS_LOCATION` | Municipio no corresponde al departamento | `DSAK25` | Probar consistencia geográfica DANE |

---

### 5. 🛠️ Errores de Notas de Ajuste a Documento Soporte (1) — Resolución 000167
| Header Value | Comportamiento | Código DIAN | Caso de Uso |
|---|---|:---:|---|
| `ERROR_DS_NOTE_REF` | Documento soporte original referenciado no encontrado | `DSD04` | Probar trazabilidad de CUDS en notas de ajuste |

---

### 6. 🏪 Errores de POS / Documento Equivalente Electrónico (3) — Resolución 000165
| Header Value | Comportamiento | Código DIAN | Caso de Uso |
|---|---|:---:|---|
| `ERROR_POS_VENDOR_RUT` | Razón social del emisor ≠ RUT | `FAJ43A` | Probar datos maestros del punto de venta |
| `ERROR_POS_CUDE_INVALID` | CUDE inválido (SHA-384 no coincide) | `DEEAD01` | Probar cálculo criptográfico del CUDE |
| `ERROR_POS_RESOLUTION` | Resolución POS no autorizada o vencida | `NSBG01` | Probar control de rangos de numeración POS |

---

### 7. 🔄 Errores de Notas de Ajuste POS (2) — Resolución 000165
| Header Value | Comportamiento | Código DIAN | Caso de Uso |
|---|---|:---:|---|
| `ERROR_POS_NOTE_CUDE_REF` | CUDE del POS original no encontrado | `DEEAD02` | Probar trazabilidad del CUDE en notas POS |
| `ERROR_POS_NOTE_NABA06` | Literal 195 no informado en nota POS | `NABA06` | Probar campos obligatorios en notas POS |

---

### 8. 👥 Errores de Nómina Electrónica (3) — Anexo Técnico Nómina V1.0
| Header Value | Comportamiento | Código DIAN | Caso de Uso |
|---|---|:---:|---|
| `ERROR_PAYROLL_DEPT` | Código de departamento inexistente | `NIE014` | Probar validaciones de tablas paramétricas DIAN |
| `ERROR_PAYROLL_CUNE_INVALID` | CUNE de nómina calculado incorrectamente | `NIE024` | Probar cálculo criptográfico del CUNE nómina |
| `ERROR_PAYROLL_PERIOD` | Período de liquidación inconsistente | `NIE016` | Probar validación de fechas de liquidación |

---

### 9. 🔐 Certificados Digitales (2)
| Header Value | Comportamiento | Caso de Uso |
|---|---|---|
| `CERT_EXPIRED` | Fuerza un certificado expirado al firmar | Probar manejo y alertas de certificado vencido |
| `CERT_NEAR_EXPIRY` | Certificado con validez restante menor a 5 días | Probar notificaciones preventivas de renovación |

---

## 🔄 Matriz de Compatibilidad con Tipos de Documento

Todos los 32 magic values operan de manera transversal en **todos** los endpoints de emisión:

| Tipo de Documento | Endpoint | Compatibilidad Magic Values |
|---|---|:---:|
| Factura Electrónica (Estándar / Salud) y POS | `POST /invoice` | ✅ Los 32 |
| Nota Crédito Electrónica | `POST /notes/credit` | ✅ Los 32 |
| Nota Débito Electrónica | `POST /notes/debit` | ✅ Los 32 |
| Documento Soporte Electrónico | `POST /ds/document` | ✅ Los 32 |
| Nota de Ajuste Documento Soporte | `POST /ds/adjustment-note` | ✅ Los 32 |
| Nómina Electrónica Individual | `POST /ep/payroll` | ✅ Los 32 |
| Reemplazo de Nómina | `POST /ep/payroll/replace` | ✅ Los 32 |
| Eliminación de Nómina | `POST /ep/payroll/delete` | ✅ Los 32 |
| Factura Auto-increment | `POST /auto-increment/invoices` | ✅ Los 32 |
| NC Auto-increment | `POST /auto-increment/credit-notes` | ✅ Los 32 |
| ND Auto-increment | `POST /auto-increment/debit-notes` | ✅ Los 32 |
| DS Auto-increment | `POST /auto-increment/support-documents` | ✅ Los 32 |
| Ajuste DS Auto-increment | `POST /auto-increment/adjustment-notes` | ✅ Los 32 |
| POS Auto-increment | `POST /auto-increment/pos-documents` | ✅ Los 32 |

---

## 📦 Estructuras de Respuesta

### 1. Respuesta Exitosa — `ACCEPTED` (Sin Magic Value)

La respuesta aceptada tiene la misma estructura que en producción (sin objeto `data`); se muestran los campos principales. Ver [Respuestas de la API](https://docs.matias-api.com/docs/response-json#respuesta-exitosa).

```json
{
  "uuid": "dde72910-eb42-11ef-9b27-f02f74cac485",
  "message": "Solicitud procesada por la DIAN.",
  "send_to_queue": 0,
  "XmlDocumentKey": "a1b2c3d4e5f67890abcdef1234567890...",
  "response": {
    "IsValid": "true",
    "StatusCode": "00",
    "StatusDescription": "Procesado Correctamente.",
    "XmlDocumentKey": "a1b2c3d4e5f67890abcdef1234567890..."
  },
  "XmlBase64Bytes": "",
  "AttachedDocument": {},
  "qr": {},
  "pdf": {},
  "warnings": [],
  "success": true
}
```

### 2. Respuesta de Rechazo — `ERROR_POS_CUDE_INVALID`

```json
{
  "response": {
    "ErrorMessage": {
      "string": [
        "Regla: DEEAD01, Rechazo: El Código Único de Documento Equivalente (CUDE) calculado no coincide con la validación de la DIAN (SHA-384)."
      ]
    },
    "IsValid": "false",
    "StatusCode": "99",
    "StatusDescription": "Validación Fallida",
    "StatusMessage": "Regla: DEEAD01, Rechazo: CUDE Inválido (SETP990000001)"
  }
}
```

### 3. Respuesta de Rechazo — `ERROR_DS_TAX_INVALID`

```json
{
  "response": {
    "ErrorMessage": {
      "string": [
        "Regla: DSAY13, Rechazo: El tributo reportado no está incluido en la tabla de tributos permitidos para Documento Soporte."
      ]
    },
    "IsValid": "false",
    "StatusCode": "99",
    "StatusDescription": "Validación Fallida",
    "StatusMessage": "Regla: DSAY13, Rechazo: Impuesto no permitido en Documento Soporte (SETP990000001)"
  }
}
```

---

## ⚡ Reglas Operativas del Sandbox

* **Aislamiento Estricto:** Los magic values **solo se evalúan** en el entorno sandbox (`{{SANDBOX_URL}}`). En producción, la cabecera `X-Sandbox-Force-Status` es descartada silenciosamente.
* **Sin Contaminación de Payload:** No necesitas modificar el JSON del documento para probar errores; toda la simulación se controla mediante la cabecera HTTP.
* **Eventos RADIAN:** Los endpoints de eventos RADIAN (`/events/*`) no requieren magic values; sus llamadas SOAP (`SendEvent`, `GetStatusEvents`, `GetXmlByDocumentKey`) son simuladas automáticamente devolviendo `ACCEPTED`.

---

<!-- Fuente: https://docs.matias-api.com/docs/sandbox/test-cert -->

# Test Certificate — MATIAS API Sandbox

Para facilitar el desarrollo, el entorno sandbox emite de forma automática un **certificado digital de prueba (Test Cert)** único para cada empresa que se registre en la plataforma.

Este certificado es **estructuralmente equivalente** a un certificado de firma real emitido por una entidad de certificación abierta (CA) acreditada ante la ONAC en Colombia, pero está firmado bajo nuestra CA interna y simulada de desarrollo.

---

## Especificaciones Técnicas

| Atributo / Campo | Valor Técnico de Prueba |
|:---|:---|
| **Formato** | PKCS#12 (`.p12` / binario) |
| **Versión X.509** | v3 |
| **Algoritmo de firma** | `sha256WithRSAEncryption` |
| **Tamaño de Llave** | RSA 2048 bits |
| **Issuer (Emisor)** | `CN=MATIAS SANDBOX TEST CA, O=MATIAS API, OU=Sandbox, C=CO` |
| **Subject (Sujeto)** | `CN={NIT}{DV}, O={razón_social}, OU=Persona Juridica, C=CO` |
| **Validez** | 1 año a partir del momento de generación |
| **Uso de Llave (Key Usage)** | `digitalSignature`, `nonRepudiation`, `keyEncipherment` |
| **Clave de Acceso (Passphrase)**| Única por empresa (consúltala dinámicamente vía `GET /certificate`) |

---

## Comportamiento del Certificado

### 1. Auto-Asignación
El certificado de pruebas se genera y asocia a tu cuenta automáticamente en dos escenarios:
*   Al crear una nueva cuenta/empresa a través del endpoint de registro del sandbox.
*   Al ejecutar seeders de inicialización rápida en tu ambiente aislado.

### 2. Ciclo de Vida Homologado
Todos los endpoints de gestión de certificados se comportan de forma **exactamente idéntica a producción**:

| Endpoint API | Comportamiento en Sandbox |
|:---|:---|
| `POST /certificate` | Permite subir tu propio archivo de firma `.p12` de prueba. |
| `GET /certificate` | Devuelve la metadata completa y la passphrase del certificado activo. |
| `GET /certificate/expiration/{dni}` | Expone el cálculo de expiración real del Test Cert asignado. |
| `PUT /certificate/{id}` | Permite actualizar la firma digital asociada. |
| `DELETE /certificate/{id}` | Desvincula el certificado asignado. |

### 3. Tipos de Documento Firmados
El certificado digital de prueba se utiliza de forma automática para firmar criptográficamente **todas** las tipologías de documentos electrónicos enviadas al sandbox:

| Tipo de Documento Electrónico | Endpoint del API de Pruebas |
|:---|:---|
| Factura electrónica estándar / Salud (Res. 000948/2026) | `POST /invoice` |
| Documento Equivalente POS Electrónico | `POST /pos` |
| Nota crédito electrónica (estándar / salud) | `POST /notes/credit` |
| Nota débito electrónica | `POST /notes/debit` |
| Documento soporte electrónico | `POST /ds/document` |
| Nota de ajuste a Documento Soporte | `POST /ds/adjustment-note` |
| Nómina electrónica individual | `POST /ep/payroll` |
| Reemplazo de nómina electrónica | `POST /ep/payroll/replace` |
| Eliminación/Anulación de nómina | `POST /ep/payroll/delete` |
| Factura auto-incrementable | `POST /auto-increment/invoices` |
| NC auto-incrementable | `POST /auto-increment/credit-notes` |
| ND auto-incrementable | `POST /auto-increment/debit-notes` |
| DS auto-incrementable | `POST /auto-increment/support-documents` |
| Nota de ajuste auto-incrementable | `POST /auto-increment/adjustment-notes` |
| POS equivalente auto-incrementable | `POST /auto-increment/pos-documents` |

---

## Firma Estructural (XMLDSig)

El XML resultante de la firma digital con el Test Cert del sandbox cuenta con todas las estructuras criptográficas requeridas:
*   Bloques `SignedInfo`, `SignatureValue`, `KeyInfo` y `X509Data` correctamente poblados.
*   Pasa de forma exitosa cualquier validador de esquemas XSD de la especificación UBL 2.1 de la DIAN.
*   :::info Rechazo DIAN
Cualquier envío de este XML a servidores reales de la DIAN resultará en un rechazo inmediato debido a que la CA de emisión (`MATIAS SANDBOX TEST CA`) no forma parte de la cadena oficial de certificación digital ONAC.
:::

---

## Red de Seguridad en Producción

Para garantizar que un certificado de pruebas del sandbox nunca sea transmitido por error a ambientes reales y productivos de la DIAN, el gateway de producción de MATIAS API cuenta con una capa de seguridad activa llamada `CertificateFingerprintGuard`:

:::caution Protección Activa
*   **Validación de Huella:** Valida la firma del certificado mediante una base de datos local de huellas SHA-256 de desarrollo (`fingerprints.json`).
*   **Verificación de CN:** Examina que el atributo `issuer.CN` no coincida con el nombre `MATIAS SANDBOX TEST CA`.
*   **Bloqueo Preventivo:** Si el emisor o la firma corresponden al Test Cert en una llamada productiva, el API arrojará inmediatamente una excepción `RuntimeException` de seguridad, cancelando el envío del documento.
:::

---

## Descarga de la CA de Pruebas

Si tu software o validador local de firmas requiere incorporar nuestra CA simulada al truststore para validar la firma de los documentos que recibes en el sandbox, puedes descargar el archivo de certificado raíz libremente:

```http
{{SANDBOX_URL}}/pki/test-ca.crt
```

---

<!-- Fuente: https://docs.matias-api.com/docs/sandbox/postman -->

# 📮 Colección Postman — MATIAS API Sandbox

Para acelerar la integración técnica y las pruebas de comportamiento en el sandbox, disponemos de una **Colección Postman oficial con 43 solicitudes** preconfiguradas que cubren tanto el flujo exitoso (*happy path*) como todos los escenarios de error simulables (*Magic Values*).

---

## 📥 Descarga e Importación

[📮 Ver Documentación Interactiva en Postman](https://documenter.getpostman.com/view/8699065/2s9YyvBLby)
[⬇️ Descargar Archivo JSON de Colección](https://docs.matias-api.com/sandbox-quickstart.postman_collection.json)

### Pasos para importar en Postman:
1. Abre tu aplicación Postman (Web o Desktop).
2. Haz clic en **Import** (esquina superior izquierda).
3. Arrastra o selecciona el archivo `sandbox-quickstart.postman_collection.json`.
4. Selecciona el Environment de Sandbox y comienza a realizar tus peticiones.

---

## 📁 Estructura de la Colección (43 Requests)

La colección se encuentra estructurada en **11 carpetas lógicas**:

| Carpeta | Requests | Descripción |
|---|:---:|---|
| **1. Producción** | 1 | Registro de cuenta en ambiente productivo. |
| **2. Sandbox — Auth** | 2 | Login y generación de tokens de acceso (PAT) para el Sandbox. |
| **3. Sandbox — Facturación** | 14 | Happy Path y **13 simulaciones de error (Magic Values)** para facturas. |
| **4. Sandbox — PDF & Status** | 3 | Consulta asíncrona de estado, descarga de PDF y metadatos. |
| **5. Sandbox — Notas Crédito/Débito** | 2 | Pruebas de notas y validaciones de fechas desfasadas. |
| **6. Sandbox — Documento Soporte** | 2 | Documento Soporte electrónico y tributos no permitidos. |
| **7. Sandbox — Nómina Electrónica** | 3 | Simulación de nómina, CUNE alterado y validación territorial. |
| **8. Sandbox — Auto-Increment** | 2 | Pruebas de emisión con series y consecutivos automáticos. |
| **9. Sandbox — POS Electrónico** | 5 | Documento Equivalente POS y notas de ajuste (NC/ND). |
| **10. Sandbox — DS No Residente** | 2 | Documentos Soporte y notas para proveedores del exterior. |
| **11. Sandbox — Eventos RADIAN** | 7 | Envío y consulta de eventos de factura (030, 031, 032, 033). |

---

## ⚙️ Variables de Entorno Recomendadas

Configura un **Environment** en Postman con las siguientes variables para operar de forma dinámica:

| Variable | Tipo | Valor Sugerido | Descripción |
|:---|:---|:---|:---|
| `url` | default | URL entregada al contratar | URL base de producción (en el sandbox: `https://sandbox-api.matias-api.com/api/ubl2.1`). |
| `sandbox_url` | default | `https://sandbox-api.matias-api.com/api/ubl2.1` | URL base del Sandbox. |
| `access_token` | secret | `eyJ...` | Token JWT obtenido en `/auth/login`. |
| `pat_token` | secret | `1\|eyJ...` | Personal Access Token (PAT) persistente. |

:::tip Scripts Automatizados en Tests
La colección incluye scripts en la pestaña **Tests** del Login y Creación de PAT que extraen y guardan automáticamente los tokens en tus variables de entorno para que no tengas que copiarlos manualmente.
:::

---

<!-- Fuente: https://docs.matias-api.com/docs/endpoints/intro-auth -->

# 🔌 Introducción y Autenticación

:::info 📖 Referencia Completa de Endpoints
Los endpoints son las URL que se utilizan para acceder a los recursos de la API. Cada endpoint es un punto de acceso que devuelve datos o realiza operaciones en el servidor.

[📮 Ver Colección Oficial de Postman](https://documenter.getpostman.com/view/8699065/2s9YyvBLby)
:::

🟢

**Públicos**  

Sin autenticación

🔐

**Privados**  

Requieren token

📄

**Documentos**  

CRUD y consultas

🔔

**Webhooks**  

v3.0.0

## 🎯 Flujo Completo de una Factura Electrónica

```
1. AUTENTICACIÓN        2. CONSULTA              3. ENVÍO                4. ESTADO
   /auth/login              /document-type            /invoice               /status
       ↓                       ↓                        ↓                       ↓
  [Token]                 [Tabla DIAN]            [Factura JSON]        [Validado]
       ↓                       ↓                        ↓                       ↓
  Públicos                  Públicos               Privados               Privados
```

## 🏷️ Tipos de Endpoints

| Tipo            | Autenticación | Uso                         | Headers                         |
| --------------- | ------------- | --------------------------- | ------------------------------- |
| **🟢 Públicos** | ❌ No         | Tablas DIAN, autenticación  | Ninguno                         |
| **🔐 Privados** | ✅ Sí         | Documentos, estado, eventos | `Authorization: Bearer {token}` |

:::warning Importante
Los endpoints privados requieren el header `Authorization: Bearer {token}` en **todas** las solicitudes.
:::

---

## 🔑 Autenticación

:::warning Verifica el correo antes del primer login
Las cuentas principales creadas con `POST /register` quedan con el correo **sin verificar**. Hasta abrir el enlace del correo de verificación, `POST /auth/login` responde **HTTP 404** con el mensaje `El correo electrónico no ha sido verificado. Comuníquese con el administrador.` Si el correo no llegó o el enlace venció, pide uno nuevo con [`POST /email/verification-notification`](https://docs.matias-api.com/docs/endpoints/intro-auth#verificacion-correo). Las sub-cuentas que una Casa de Software crea con `POST /company/{uuid}/customer` ya quedan verificadas.
:::

**POST /auth/login — Iniciar Sesión**

```http
POST {{url}}/auth/login
Content-Type: application/json
Accept: application/json
```

**Parámetros del Body:**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `email` | `string` | ✅ Sí | Correo electrónico registrado (formato de correo válido) |
| `password` | `string` | ✅ Sí | Contraseña de la cuenta |
| `remember_me` | `boolean` | No | Opcional. Se acepta por compatibilidad, pero no cambia la vigencia del token |

**cURL**

```bash
curl -X POST "{{url}}/auth/login" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "email": "usuario@miempresa.com",
    "password": "MiPassword123!"
  }'
```

**JavaScript (Axios)**

```js
const response = await axios.post(`${url}/auth/login`, {
  email: 'usuario@miempresa.com',
  password: 'MiPassword123!'
}, {
  headers: { Accept: 'application/json' }
});
const token = response.data.access_token;
```

**PHP (Guzzle)**

```php
$response = $client->post("{$url}/auth/login", [
    'headers' => ['Accept' => 'application/json'],
    'json'    => [
        'email'    => 'usuario@miempresa.com',
        'password' => 'MiPassword123!',
    ],
]);
$token = json_decode($response->getBody())->access_token;
```

**✅ Respuesta Exitosa (HTTP 200)**

```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImYyZTFlYjgyZDUyMjEz...",
  "token_id": "f2e1eb82d52213a6b1c0d3e4f5a60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f9",
  "user": {
    "id": 1,
    "type_id": 2,
    "first_name": "JUAN",
    "last_name": "PEREZ",
    "email": "usuario@miempresa.com",
    "avatar": null,
    "active": 1,
    "name": "JUAN PEREZ",
    "avatarUrl": null,
    "user_type": {
      "id": 2,
      "user_type_name": "DESARROLLADOR",
      "type": 2,
      "active": 1
    }
  },
  "expires_at": "2026-05-15 20:00:00",
  "message": "Bienvenido. Su sesión ha sido iniciada con éxito.",
  "success": true
}
```

- `access_token`: el token que se envía en `Authorization: Bearer {token}`.
- `token_id`: identificador del token (el mismo `id` que aparece en `GET /tokens`).
- `expires_at`: fecha de vencimiento (`YYYY-MM-DD HH:MM:SS`). Por defecto, 90 días después del login.
- La respuesta **no** incluye `token_type` ni roles: el tipo de usuario está en `user.type_id` y `user.user_type` (ver [`GET /profile/types`](https://docs.matias-api.com/docs/endpoints/profile#tipos-usuario)).

**❌ Inicio de Sesión Rechazado (HTTP 404)**

Todos los rechazos del login responden **HTTP 404** (no 401) con el mismo formato. Se comprueban en el orden de la tabla:

```json
{
  "message": "Credenciales inválidas.",
  "success": false
}
```

| `message` | Causa |
|-----------|-------|
| `Credenciales inválidas.` | El correo o la contraseña no coinciden. |
| `El usuario se encuentra inactivo. Comuníquese con el administrador.` | El usuario está inactivo. |
| `El correo electrónico no ha sido verificado. Comuníquese con el administrador.` | Cuenta de `POST /register` sin verificar, o correo cambiado con `PUT /profile/update-email` y aún sin verificar. Ver [verificación de correo](https://docs.matias-api.com/docs/endpoints/intro-auth#verificacion-correo). |
| `No se ha encontrado el perfil de usuario.` | El usuario no está asociado a ninguna empresa. |
| `No se ha encontrado la empresa asociada al usuario.` | La empresa del usuario no existe. |
| `La empresa se encuentra inactiva. Comuníquese con el administrador.` | La empresa está inactiva. |

**❌ Error de Validación (HTTP 422)**

Falta `email` o `password`, o el correo no tiene un formato válido. Envía `Accept: application/json` para recibir el error en JSON (sin esa cabecera, la respuesta es una redirección HTTP 302).

```json
{
  "message": "El campo email es obligatorio.",
  "errors": {
    "email": [
      "El campo email es obligatorio."
    ]
  }
}
```

**GET /auth/user — Obtener Usuario Actual**

```http
GET {{url}}/auth/user
Authorization: Bearer {token}
Accept: application/json
```

Devuelve el usuario dueño del token. Es equivalente a [`GET /profile`](https://docs.matias-api.com/docs/endpoints/profile#gestion-perfil).

**✅ Respuesta Exitosa (HTTP 200)**

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
        "avatar": null,
        "active": 1,
        "name": "JUAN PEREZ",
        "avatarUrl": null,
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

**❌ No Autenticado (HTTP 401)**

Sin token, o con un token inválido, vencido o revocado. Este formato solo se recibe si la petición envía `Accept: application/json`; sin esa cabecera, la respuesta es una redirección (HTTP 302).

```json
{
  "message": "Unauthenticated."
}
```

**GET /auth/logout — Cerrar Sesión**

```http
GET {{url}}/auth/logout
Authorization: Bearer {token}
Accept: application/json
```

Revoca el token con el que se hace la petición y cierra la sesión asociada. Los demás tokens del usuario siguen vigentes (para revocarlos, usa [`POST /tokens/revoke-all`](https://docs.matias-api.com/docs/endpoints/intro-auth#personal-access-tokens)).

**✅ Respuesta Exitosa (HTTP 200)**

```json
{
  "message": "Successfully logged out",
  "success": true
}
```

**❌ No Autenticado (HTTP 401)**

Sin token, o con un token inválido o ya revocado. Requiere `Accept: application/json`; sin esa cabecera, la respuesta es una redirección (HTTP 302).

```json
{
  "message": "Unauthenticated."
}
```

---

## 📧 Verificación de Correo

:::info 🆕 Paso obligatorio para cuentas nuevas
Al registrarse con `POST /register`, la API envía un correo con un **enlace de verificación firmado y con vencimiento**. Hay que abrirlo antes de iniciar sesión. Estos endpoints son públicos: no llevan token.
:::

**POST /email/verification-notification — Reenviar Correo de Verificación**

```http
POST {{url}}/email/verification-notification
Content-Type: application/json
Accept: application/json
```

Envía de nuevo el correo de verificación. Úsalo cuando el correo no llegó o cuando el enlace venció.

**Parámetros del Body:**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `email` | `string` | ✅ Sí | Correo de la cuenta pendiente de verificar |

**cURL**

```bash
curl -X POST "{{url}}/email/verification-notification" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email": "usuario@miempresa.com"}'
```

**JavaScript (Axios)**

```js
await axios.post(`${url}/email/verification-notification`, {
  email: 'usuario@miempresa.com'
}, {
  headers: { Accept: 'application/json' }
});
```

**PHP (Guzzle)**

```php
$response = $client->post("{$url}/email/verification-notification", [
    'headers' => ['Accept' => 'application/json'],
    'json'    => ['email' => 'usuario@miempresa.com'],
]);
```

**✅ Correo Enviado (HTTP 200)**

```json
{
  "message": "Se ha enviado un correo electrónico de verificación"
}
```

**❌ Correo no Registrado (HTTP 404)**

También se recibe si no se envía `email`.

```json
{
  "message": "El usuario no existe.",
  "success": false
}
```

**❌ Correo ya Verificado (HTTP 400)**

```json
{
  "message": "El correo electrónico ya fue verificado.",
  "success": false
}
```

**GET Enlace de verificación — Confirmar el Correo**

El correo contiene un enlace con esta forma. Lo genera la API: no se construye a mano.

```http
GET {{url}}/verify-email/{id}/{hash}?expires={timestamp}&signature={firma}
```

| Resultado | Comportamiento |
|-----------|----------------|
| Enlace válido | Marca el correo como verificado, activa el usuario y redirige al portal web, a la pantalla de inicio de sesión. Si el correo ya estaba verificado, también redirige al login. |
| Enlace vencido o alterado | **HTTP 403** (`Invalid signature.`). Pide un enlace nuevo con `POST /email/verification-notification`. |
| Usuario inexistente | **HTTP 404**. |

Se admiten hasta 6 intentos por minuto sobre este enlace.

---

## 🔁 Recuperar Contraseña

Endpoints públicos (sin token) para restablecer la contraseña por correo.

**POST /forgot-password — Solicitar Enlace de Restablecimiento**

```http
POST {{url}}/forgot-password
Content-Type: application/json
Accept: application/json
```

**Parámetros del Body:**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `email` | `string` | ✅ Sí | Correo de la cuenta (formato válido) |

Envía al correo un enlace con el `token` de restablecimiento. El enlace **vence a los 60 minutos**.

```bash
curl -X POST "{{url}}/forgot-password" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email": "usuario@miempresa.com"}'
```

**✅ Enlace Enviado (HTTP 200)**

```json
{
  "success": true,
  "message": "¡Recordatorio de contraseña enviado!"
}
```

El correo contiene el enlace con el `token` que se usa en `POST /reset-password`.

**❌ No se Pudo Enviar (HTTP 422)**

El correo no está registrado o ya se pidió un enlace hace muy poco (en ese caso, `Por favor espere antes de volver a intentarlo.`). Si falta `email` o no tiene formato válido, el error es el de validación (`El campo email es obligatorio.`).

```json
{
  "message": "No se ha encontrado un usuario con esa dirección de correo.",
  "errors": {
    "email": [
      "No se ha encontrado un usuario con esa dirección de correo."
    ]
  }
}
```

**POST /reset-password — Restablecer Contraseña**

```http
POST {{url}}/reset-password
Content-Type: application/json
Accept: application/json
```

**Parámetros del Body:**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `token` | `string` | ✅ Sí | Token recibido en el enlace del correo |
| `email` | `string` | ✅ Sí | Correo de la cuenta |
| `password` | `string` | ✅ Sí | Nueva contraseña (mínimo 8 caracteres) |
| `password_confirmation` | `string` | ✅ Sí | Debe coincidir con `password` |

```bash
curl -X POST "{{url}}/reset-password" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "token": "token-recibido-en-el-correo",
    "email": "usuario@miempresa.com",
    "password": "NuevaPassword123!",
    "password_confirmation": "NuevaPassword123!"
  }'
```

**✅ Contraseña Restablecida (HTTP 200)**

```json
{
  "success": true,
  "message": "¡Su contraseña ha sido restablecida!"
}
```

**❌ Token Inválido o Vencido (HTTP 422)**

El token no corresponde al correo enviado o ya venció (60 minutos). Si el correo no está registrado, el mensaje es `No se ha encontrado un usuario con esa dirección de correo.` Los errores de la contraseña (longitud, confirmación) llegan en `errors.password`.

```json
{
  "message": "Este token de restablecimiento de contraseña es inválido.",
  "errors": {
    "email": [
      "Este token de restablecimiento de contraseña es inválido."
    ]
  }
}
```

---

## 🔐 Gestión de Tokens (Personal Access Tokens)

:::tip PAT vs OAuth2 — ¿Cuándo usar cada uno?
| | **PAT** | **OAuth2 (login)** |
|---|---|---|
| **Caso de uso** | Integraciones servidor-a-servidor, scripts automatizados, ERP | Apps web con usuarios que inician sesión |
| **Creación** | Self-service desde la API | Login con email/contraseña |
| **Expiración** | Configurable: 1–365 días (por defecto, 90) | 90 días |
| **Revocación** | Selectiva por ID | Logout del token usado |
| **Recomendado para** | ✅ Integraciones B2B | ✅ Portales web |
:::

:::info Parámetro Multi-Tenant: `client_uuid`
Todos los endpoints de `/tokens` aceptan `?client_uuid={{client_uuid}}`. Una **Casa de Software** lo usa para gestionar los tokens del usuario de una de sus sub-cuentas (con relación activa). Sin el parámetro, se gestionan los tokens del propio usuario.
:::

**GET /tokens — Listar Tokens**

```http
GET {{url}}/tokens?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Accept: application/json
```

Obtiene la lista de los tokens **vigentes** del usuario (no incluye los revocados ni los vencidos), del más reciente al más antiguo. También aparecen los tokens de las sesiones abiertas con `POST /auth/login`, con `name` igual a `Login - {correo}`.

**✅ Respuesta Exitosa (HTTP 200)**

```json
{
  "dataRecords": {
    "data": [
      {
        "id": "cb6282ed9f5cb116416928518f9dd93b53aafc2c0273722bbe5eb7eb96d7ccfac10178f43b8fe617",
        "name": "Token ERP",
        "description": "Token de integración para facturación",
        "ip_address": "203.0.113.10",
        "user_agent": "curl/8.4.0",
        "scopes": [],
        "revoked": false,
        "expires_at": "2026-05-02 12:00:00",
        "created_at": "2026-02-01 12:00:00",
        "last_used_at": "2026-02-10 08:30:00",
        "is_expired": false
      }
    ],
    "total": 1
  },
  "success": true
}
```

**GET /tokens/{token_id} — Obtener Token por ID**

```http
GET {{url}}/tokens/{token_id}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Accept: application/json
```

| Parámetro | Ubicación | Descripción |
|-----------|-----------|-------------|
| `token_id` | path | ID del token (`id` en `GET /tokens`, `token_id` al crearlo) |
| `client_uuid` | query | Opcional. UUID de la sub-cuenta (Casa de Software) |

**✅ Respuesta Exitosa (HTTP 200)**

```json
{
  "dataRecords": {
    "data": {
      "id": "cb6282ed9f5cb116416928518f9dd93b53aafc2c0273722bbe5eb7eb96d7ccfac10178f43b8fe617",
      "name": "Token ERP",
      "description": "Token de integración para facturación",
      "ip_address": "203.0.113.10",
      "user_agent": "curl/8.4.0",
      "scopes": [],
      "revoked": false,
      "expires_at": "2026-05-02 12:00:00",
      "created_at": "2026-02-01 12:00:00",
      "last_used_at": "2026-02-10 08:30:00",
      "is_expired": false
    }
  },
  "success": true
}
```

**❌ Token no Encontrado (HTTP 404)**

El token no existe o ya fue revocado.

```json
{
  "success": false,
  "message": "Token not found."
}
```

**❌ Token de Otro Usuario (HTTP 403)**

```json
{
  "success": false,
  "message": "Token does not belong to the authenticated user"
}
```

**POST /tokens — Crear Nuevo Token**

```http
POST {{url}}/tokens?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

**Parámetros del Body:**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `name` | `string` | ✅ Sí | Nombre descriptivo (máx. 100). Solo letras sin tilde, números, espacios, guiones (`-`), guiones bajos (`_`) y puntos |
| `description` | `string` | No | Descripción del uso del token (máx. 500) |
| `expires_in_days` | `integer` | No | Días de vigencia, de 1 a 365. Por defecto, 90 |

:::caution Límite diario
Cada usuario puede crear hasta **10 tokens por día**. Al superarlo, la API responde **HTTP 429**.
:::

**cURL**

```bash
curl -X POST "{{url}}/tokens" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "Token Produccion",
    "description": "Token para integración ERP",
    "expires_in_days": 60
  }'
```

**JavaScript (Axios)**

```js
const response = await axios.post(`${url}/tokens`, {
  name: 'Token Produccion',
  description: 'Token para integración ERP',
  expires_in_days: 60
}, {
  headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
});
// Guardar: response.data.dataRecords.data.token (solo se muestra una vez)
const pat = response.data.dataRecords.data.token;
```

**PHP (Guzzle)**

```php
$response = $client->post("{$url}/tokens", [
    'headers' => [
        'Authorization' => "Bearer {$token}",
        'Accept'        => 'application/json',
    ],
    'json'    => [
        'name'            => 'Token Produccion',
        'description'     => 'Token para integración ERP',
        'expires_in_days' => 60,
    ],
]);
// Guardar: dataRecords.data.token (solo se muestra una vez)
$pat = json_decode($response->getBody())->dataRecords->data->token;
```

**✅ Respuesta Exitosa (HTTP 201)**

```json
{
  "dataRecords": {
    "data": {
      "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI...",
      "token_id": "cb6282ed9f5cb116416928518f9dd93b53aafc2c0273722bbe5eb7eb96d7ccfac10178f43b8fe617",
      "name": "Token Produccion",
      "description": "Token para integración ERP",
      "expires_at": "2026-05-02 12:00:00",
      "created_at": "2026-03-03 12:00:00"
    }
  },
  "message": "Token creado exitosamente. Asegúrese de guardar el token, ya que no podrá verlo nuevamente.",
  "success": true
}
```

:::caution Guarda el token ahora
El valor `dataRecords.data.token` solo se muestra **una vez** al crearlo. No se puede recuperar después.
:::

**❌ Límite Diario Alcanzado (HTTP 429)**

```json
{
  "success": false,
  "message": "Límite de creación de tokens alcanzado. Máximo 10 por día.",
  "error": "Rate limit exceeded",
  "retry_after": 3600
}
```

`retry_after` indica los segundos que faltan para poder crear otro token.

**❌ Error de Validación (HTTP 422)**

```json
{
  "message": "The token name may only contain letters, numbers, spaces, hyphens, underscores, and periods.",
  "errors": {
    "name": [
      "The token name may only contain letters, numbers, spaces, hyphens, underscores, and periods."
    ]
  }
}
```

**DELETE /tokens/{token_id} — Revocar Token**

```http
DELETE {{url}}/tokens/{token_id}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Accept: application/json
```

| Parámetro | Ubicación | Descripción |
|-----------|-----------|-------------|
| `token_id` | path | ID del token a revocar |
| `client_uuid` | query | Opcional. UUID de la sub-cuenta (Casa de Software) |
| `reason` | body | Opcional. Motivo de la revocación |

**✅ Respuesta Exitosa (HTTP 200)**

```json
{
  "message": "Token revoked successfully",
  "success": true
}
```

Revocar un token que ya estaba revocado también responde `200`.

**❌ Token no Encontrado o de Otro Usuario (HTTP 404 / 403)**

```json
{
  "success": false,
  "message": "Token not found: cb6282ed9f5cb116416928518f9dd93b53aafc2c0273722bbe5eb7eb96d7ccfac10178f43b8fe617"
}
```

Si el token pertenece a otro usuario, la respuesta es **HTTP 403** con `Token does not belong to user`.

**POST /tokens/revoke-all — Revocar Todos los Tokens**

```http
POST {{url}}/tokens/revoke-all?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Accept: application/json
```

Revoca todos tus tokens **excepto el que estás usando actualmente**.

**✅ Respuesta Exitosa (HTTP 200)**

```json
{
  "dataRecords": {
    "data": {
      "revoked_count": 0
    }
  },
  "message": "Tokens revoked successfully",
  "success": true
}
```
