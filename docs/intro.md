---
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Introducción

Matias es una plataforma de **facturación electrónica** que permite a las empresas emitir, enviar y gestionar facturas electrónicas de forma segura y eficiente. Nuestra **API RESTful** proporciona acceso completo a los servicios de Matias.

Con Matias, los desarrolladores pueden integrar la funcionalidad de facturación electrónica en sus aplicaciones, automatizando completamente el proceso de emisión de documentos de forma segura, legal y eficiente.

---

## 🛠️ Herramientas de Desarrollo {#herramientas-de-desarrollo}

Antes de leer la documentación completa, ten a mano las dos herramientas que más vas a usar durante tu integración:

<div style={{display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px'}}>

<div style={{flex: '1', minWidth: '260px', border: '2px solid #FF6C37', borderRadius: '10px', padding: '20px', background: 'var(--ifm-card-background-color)'}}>

### 📮 Colección Postman

Importa todos los endpoints con payloads de ejemplo listos para ejecutar. La forma más rápida de probar la API sin escribir código.

<a
  href="https://documenter.getpostman.com/view/8699065/2s9YyvBLby"
  target="_blank"
  rel="noopener noreferrer"
  style={{
    display: 'inline-block',
    backgroundColor: '#FF6C37',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '6px',
    fontWeight: 'bold',
    textDecoration: 'none',
    marginTop: '8px'
  }}
>
  🔗 Abrir Colección Postman
</a>

<br/><small style={{color: 'var(--ifm-color-emphasis-600)', marginTop: '8px', display: 'block'}}>Incluye ejemplos de Factura, Nota Crédito, Nómina, Salud, Eventos RADIAN y más.</small>

</div>

<div style={{flex: '1', minWidth: '260px', border: '2px solid #4CAF50', borderRadius: '10px', padding: '20px', background: 'var(--ifm-card-background-color)'}}>

### 📘 Swagger UI

Explora y prueba los endpoints interactivamente desde el navegador. Requiere tu token de acceso.

<button
  onClick={() => window.open(atob('aHR0cHM6Ly9hcGktdjIubWF0aWFzLWFwaS5jb20vYXBpL2RvY3M='), '_blank')}
  style={{
    backgroundColor: '#4CAF50',
    border: 'none',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '8px',
    fontSize: '14px'
  }}
>
  🚀 Abrir Swagger UI
</button>

<br/><small style={{color: 'var(--ifm-color-emphasis-600)', marginTop: '8px', display: 'block'}}>Disponible únicamente para clientes con servicio activo.</small>

</div>

</div>

:::tip ¿Quieres probar sin un contrato?
Usa el **[Sandbox gratuito](/docs/sandbox/quickstart)** — no requiere contrato ni configuración DIAN. Crea tu cuenta en `https://sandbox-auth.matias-api.com/` y empieza a probar en minutos.
:::

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
</details>

<details>
<summary>🗺️ Ver Diagrama: Flujo Personal Access Tokens (PAT)</summary>

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
</details>

### 🛡️ Autenticación de API con OAuth2 {#autenticación-de-api-con-oauth2}

La autenticación para acceder a la API se gestiona mediante **Tokens de acceso** siguiendo el estándar de autenticación OAuth2. Esto asegura que las interacciones con la API sean seguras y estén autorizadas.

:::info Ventajas de Personal Access Tokens (PAT)
- **Creación self-service:** Tú mismo los creas y los gestionas directamente.
- **Expiración configurable:** Desde 1 hasta 365 días; si no se indica, 90 días (recomendado: 30-60 días).
- **Límite de creación:** Hasta 10 tokens nuevos por día y usuario.
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

1. **A través de nuestro sitio web:** Complete el formulario de registro y verifique su correo con el enlace que recibirá.
2. **Mediante el servicio REST:** Realice una petición `POST` al endpoint público `{{URL}}/register` (sin token), con las cabeceras `Content-Type: application/json` y `Accept: application/json`.

:::warning Este endpoint crea cuentas principales, no sub-cuentas
`POST /register` crea una **cuenta principal** (usuario y empresa) de tipo desarrollador. Si usted es una **Casa de Software** y quiere crear la cuenta de un cliente, use [`POST /company/{uuid}/customer`](/docs/endpoints/company#clientes-casa-software) con su token. Enviar `company_id` a `/register` responde 422.
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
| `identity_document_id` | `integer` | `3` | Tipo de documento ([ver glosario](/docs/glossary)) |
| `type_organization_id` | `integer` | `1` | Tipo de organización ([ver glosario](/docs/glossary)) |
| `tax_regime_id` | `integer` | `1` | Régimen fiscal ([ver glosario](/docs/glossary)) |
| `tax_level_id` | `integer` | `5` | Nivel fiscal ([ver glosario](/docs/glossary)) |
| `country_id` | `integer` | `45` | País |
| `city_id` | `integer` | `149` | Ciudad ([ver glosario](/docs/glossary)) |
| `address` | `string` | `""` | Dirección física |
| `location` | `string` | `""` | Ubicación (texto libre) |
| `postal_code` | `string` | `""` | Código postal |
| `mobile` | `string` | `""` | Teléfono celular |
| `phone` | `string` | `""` | Teléfono fijo |
| `web` | `string` | `""` | Sitio web |

- El usuario se crea siempre como **desarrollador**: un `type_id` enviado se ignora.
- Nombres, apellidos y razón social se guardan en **mayúsculas**.
- La cuenta recibe una suscripción inicial **FREE de 100 documentos por 1 año**. En el sandbox, la cuenta principal recibe en su lugar una suscripción de pruebas de **5.000 documentos por 1 año**.
- La respuesta **no** incluye token: el correo queda **sin verificar** y hay que abrir el enlace del correo antes de iniciar sesión (ver [Paso 2](#obtener-el-token-de-acceso)).

<details>
<summary>📦 Ver JSON de Petición (Request Body)</summary>

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
</details>

<details>
<summary>📦 Ver Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "message": "Empresa creada con éxito. Verifique su dirección de correo electrónico: usuario@miempresa.com",
  "success": true
}
```
</details>

<details>
<summary>📦 Ver Respuestas de Error (HTTP 422 / 400 / 500)</summary>

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

**Respuesta HTTP 400 (Dato Inválido):** un valor de catálogo no existe (por ejemplo, `country_id`, `city_id` o `tax_level_id`). No se crea nada. El `message` trae el detalle técnico del rechazo: revise los IDs contra el [glosario](/docs/glossary).

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
Si falla el envío del correo de verificación, la API responde 500 aunque **la cuenta ya quedó creada**. No repita `POST /register` (respondería 422 `El correo electrónico ya existe`): pida un correo nuevo con [`POST /email/verification-notification`](/docs/endpoints/intro-auth#verificacion-correo).
:::
</details>

---

## 🔑 Paso 2: Obtener el Token de Acceso {#obtener-el-token-de-acceso}

:::warning Primero verifique su correo
Después de `POST /register`, abra el enlace de verificación que llega al correo registrado. Hasta hacerlo, el login responde **HTTP 404** con `El correo electrónico no ha sido verificado. Comuníquese con el administrador.` Si el correo no llegó o el enlace venció, pida uno nuevo con [`POST /email/verification-notification`](/docs/endpoints/intro-auth#verificacion-correo).
:::

Con el correo verificado, obtenga su token de acceso enviando una petición `POST` al endpoint `{{URL}}/auth/login`. Para emitir documentos ante la DIAN necesitará, además, los [requisitos previos](#nota-importante) configurados en el portal.

### Parámetros del Body

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `email` | `string` | ✅ Sí | Correo electrónico registrado |
| `password` | `string` | ✅ Sí | Contraseña de la cuenta |
| `remember_me` | `boolean` | No | Opcional; no cambia la vigencia del token |

<details>
<summary>📦 Ver JSON de Petición (Request Body)</summary>

```json
{
  "email": "usuario@miempresa.com",
  "password": "MiPassword123!"
}
```
</details>

<details>
<summary>📦 Ver Respuesta Exitosa (HTTP 200)</summary>

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
</details>

<details>
<summary>📦 Ver Respuestas de Inicio de Sesión Rechazado (HTTP 404)</summary>

Todos los rechazos del login responden **HTTP 404** (no 401):

```json
{
  "message": "Credenciales inválidas.",
  "success": false
}
```

Otros mensajes posibles: `El usuario se encuentra inactivo. Comuníquese con el administrador.`, `El correo electrónico no ha sido verificado. Comuníquese con el administrador.`, `No se ha encontrado el perfil de usuario.`, `No se ha encontrado la empresa asociada al usuario.` y `La empresa se encuentra inactiva. Comuníquese con el administrador.` [Ver detalle](/docs/endpoints/intro-auth#autenticacion).
</details>

---

## 🔐 Paso 3: Uso del Token de Acceso {#uso-del-token-de-acceso}

Incluya el token obtenido en todas sus llamadas HTTP a endpoints protegidos. Los ejemplos consultan el usuario autenticado con `GET {{URL}}/auth/user` (equivalente a `GET {{URL}}/profile`), que responde con el usuario dentro de `dataRecords.data`.

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

axios.get('{{URL}}/auth/user', { headers })
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

</TabItem>
<TabItem value="php" label="PHP">

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

</TabItem>
<TabItem value="java" label="Java">

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

</TabItem>
<TabItem value="csharp" label="C#">

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

</TabItem>
<TabItem value="ruby" label="Ruby">

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

**Respuesta de Error / No Autenticado (HTTP 401):** sin token, o con un token inválido o ya revocado. Este JSON (sin campo `success`) solo se recibe si la petición envía `Accept: application/json`; sin esa cabecera, la respuesta es una redirección (HTTP 302).

```json
{
  "message": "Unauthenticated."
}
```

El logout revoca solo el token usado en la petición. Para revocar un Personal Access Token concreto o todos los demás, use [`DELETE /tokens/{id}` o `POST /tokens/revoke-all`](/docs/endpoints/intro-auth#personal-access-tokens).
</details>

---

## 🔗 Siguientes Pasos y Conceptos Avanzados {#siguientes-pasos}

Una vez completada la autenticación, explore los temas avanzados y recursos clave para la integración:

### 🔔 Webhooks: Notificaciones en Tiempo Real {#webhooks-notificaciones-en-tiempo-real}

:::tip Eventos del Ciclo de Vida
Los webhooks le permiten recibir notificaciones automáticas y seguras (firmadas con HMAC-SHA256) directamente en su servidor cuando ocurren eventos clave como:
- **Documentos electrónicos** (los mismos eventos para facturas, notas, documento soporte, nómina y demás tipos): `document.created`, `document.emitted`, `document.accepted`, `document.rejected`, `document.voided`
- **Correos:** `email.sent`, `email.delivered`, `email.bounced`, `email.complaint`, `email.opened`, `email.clicked`
- **Envío masivo:** `bulk.batch.completed`

Suscribirse a un evento que no está en el catálogo responde 422 (`Evento inválido: <evento>`).

[📖 Ver catálogo completo de eventos](/docs/endpoints/webhooks#eventos-disponibles) · [Firma HMAC](/docs/endpoints/webhooks#seguridad-hmac)
:::

### 📊 Límites de Consumo y Membresías {#límites-de-consumo-y-membresías}

Cada cuenta tiene una **bolsa de documentos por periodo de suscripción** (normalmente anual, ampliable con recargas), no un cupo mensual. Los correos tienen sus propios topes según el plan: un máximo anual de correos (contado por año calendario, desde el 1 de enero), un máximo de destinatarios por envío y un máximo de reenvíos por documento. Consulte su saldo con `GET /memberships/summary` o el historial de recargas con `GET /memberships/recharges`.

<details>
<summary>📦 Ver Respuestas de Límite de Consumo (HTTP 402 / 429 / 413)</summary>

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
- 📄 **[Campos del Documento](/docs/billing-fields)** - Especificaciones completas de campos y Sector Salud.
- 💼 **[Nómina Electrónica](/docs/payroll/payroll-fields)** - Guía completa de campos y devengos/deducciones.
- 🌐 **[Eventos RADIAN](/docs/endpoints/events-radian)** - Endpoints para acuses y recepción de facturas.
- 📋 **[Documento Soporte](/docs/endpoints/support-documents)** - Operaciones con no obligados a facturar.
- 📚 **[Glosario Técnico](/docs/glossary)** - Términos técnicos, normativas y acrónimos.
- 📥 **[Anexos Oficiales DIAN](https://www.dian.gov.co/impuestos/factura-electronica)** - Descargas directas del portal DIAN.

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

**Versión de Documentación:** 3.7.0 | **Última actualización:** Agosto 2026 | **API:** v3.7.0