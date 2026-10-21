---
sidebar_position: 1
sidebar_label: 🔐 Autenticación
description: "Autenticación de la API: login, tokens de acceso personal (PAT), verificación de correo, recuperación de contraseña y cierre de sesión."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 🔌 Introducción y Autenticación {#introduccion-autenticacion}

:::info 📖 Referencia Completa de Endpoints
Los endpoints son las URL que se utilizan para acceder a los recursos de la API. Cada endpoint es un punto de acceso que devuelve datos o realiza operaciones en el servidor.

<a href="https://documenter.getpostman.com/view/8699065/2s9YyvBLby" target="_blank" rel="noopener noreferrer" className="button button--warning">
  📮 Ver Colección Oficial de Postman
</a>
:::

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', margin: '1.5rem 0'}}>
  <div style={{padding: '1rem', backgroundColor: 'var(--ifm-color-success-contrast-background)', borderRadius: '8px', border: '1px solid var(--ifm-color-success)', textAlign: 'center'}}>
    <div style={{fontSize: '2rem'}}>🟢</div>
    <strong>Públicos</strong><br/>
    <small>Sin autenticación</small>
  </div>
  <div style={{padding: '1rem', backgroundColor: 'var(--ifm-color-warning-contrast-background)', borderRadius: '8px', border: '1px solid var(--ifm-color-warning)', textAlign: 'center'}}>
    <div style={{fontSize: '2rem'}}>🔐</div>
    <strong>Privados</strong><br/>
    <small>Requieren token</small>
  </div>
  <div style={{padding: '1rem', backgroundColor: 'var(--ifm-color-info-contrast-background)', borderRadius: '8px', border: '1px solid var(--ifm-color-info)', textAlign: 'center'}}>
    <div style={{fontSize: '2rem'}}>📄</div>
    <strong>Documentos</strong><br/>
    <small>CRUD y consultas</small>
  </div>
  <div style={{padding: '1rem', backgroundColor: 'var(--ifm-color-info-contrast-background)', borderRadius: '8px', border: '1px solid var(--ifm-color-info)', textAlign: 'center'}}>
    <div style={{fontSize: '2rem'}}>🔔</div>
    <strong>Webhooks</strong><br/>
    <small>v3.0.0</small>
  </div>
</div>

## 🎯 Flujo Completo de una Factura Electrónica {#flujo-completo}

```
1. AUTENTICACIÓN        2. CONSULTA              3. ENVÍO                4. ESTADO
   /auth/login              /document-type            /invoice               /status
       ↓                       ↓                        ↓                       ↓
  [Token]                 [Tabla DIAN]            [Factura JSON]        [Validado]
       ↓                       ↓                        ↓                       ↓
  Públicos                  Públicos               Privados               Privados
```

## 🏷️ Tipos de Endpoints {#tipos-de-endpoints}

| Tipo            | Autenticación | Uso                         | Headers                         |
| --------------- | ------------- | --------------------------- | ------------------------------- |
| **🟢 Públicos** | ❌ No         | Tablas DIAN, autenticación  | Ninguno                         |
| **🔐 Privados** | ✅ Sí         | Documentos, estado, eventos | `Authorization: Bearer {token}` |

:::warning Importante
Los endpoints privados requieren el header `Authorization: Bearer {token}` en **todas** las solicitudes.
:::

---

## 🔑 Autenticación {#autenticacion}

:::warning Verifica el correo antes del primer login
Las cuentas principales creadas con `POST /register` quedan con el correo **sin verificar**. Hasta abrir el enlace del correo de verificación, `POST /auth/login` responde **HTTP 404** con el mensaje `El correo electrónico no ha sido verificado. Comuníquese con el administrador.` Si el correo no llegó o el enlace venció, pide uno nuevo con [`POST /email/verification-notification`](#verificacion-correo). Las sub-cuentas que una Casa de Software crea con `POST /company/{uuid}/customer` ya quedan verificadas.
:::

<details open>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/auth/login</b> — Iniciar Sesión</summary>

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

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "{{url}}/auth/login" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "email": "usuario@miempresa.com",
    "password": "MiPassword123!"
  }'
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
const response = await axios.post(`${url}/auth/login`, {
  email: 'usuario@miempresa.com',
  password: 'MiPassword123!'
}, {
  headers: { Accept: 'application/json' }
});
const token = response.data.access_token;
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

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

</TabItem>
</Tabs>

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

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
- La respuesta **no** incluye `token_type` ni roles: el tipo de usuario está en `user.type_id` y `user.user_type` (ver [`GET /profile/types`](/docs/endpoints/profile#tipos-usuario)).

</details>

<details>
<summary>❌ Inicio de Sesión Rechazado (HTTP 404)</summary>

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
| `El correo electrónico no ha sido verificado. Comuníquese con el administrador.` | Cuenta de `POST /register` sin verificar, o correo cambiado con `PUT /profile/update-email` y aún sin verificar. Ver [verificación de correo](#verificacion-correo). |
| `No se ha encontrado el perfil de usuario.` | El usuario no está asociado a ninguna empresa. |
| `No se ha encontrado la empresa asociada al usuario.` | La empresa del usuario no existe. |
| `La empresa se encuentra inactiva. Comuníquese con el administrador.` | La empresa está inactiva. |

</details>

<details>
<summary>❌ Error de Validación (HTTP 422)</summary>

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

</details>

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/auth/user</b> — Obtener Usuario Actual</summary>

```http
GET {{url}}/auth/user
Authorization: Bearer {token}
Accept: application/json
```

Devuelve el usuario dueño del token. Es equivalente a [`GET /profile`](/docs/endpoints/profile#gestion-perfil).

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

</details>

<details>
<summary>❌ No Autenticado (HTTP 401)</summary>

Sin token, o con un token inválido, vencido o revocado. Este formato solo se recibe si la petición envía `Accept: application/json`; sin esa cabecera, la respuesta es una redirección (HTTP 302).

```json
{
  "message": "Unauthenticated."
}
```

</details>

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/auth/logout</b> — Cerrar Sesión</summary>

```http
GET {{url}}/auth/logout
Authorization: Bearer {token}
Accept: application/json
```

Revoca el token con el que se hace la petición y cierra la sesión asociada. Los demás tokens del usuario siguen vigentes (para revocarlos, usa [`POST /tokens/revoke-all`](#personal-access-tokens)).

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "message": "Successfully logged out",
  "success": true
}
```

</details>

<details>
<summary>❌ No Autenticado (HTTP 401)</summary>

Sin token, o con un token inválido o ya revocado. Requiere `Accept: application/json`; sin esa cabecera, la respuesta es una redirección (HTTP 302).

```json
{
  "message": "Unauthenticated."
}
```

</details>

</details>

---

## 📧 Verificación de Correo {#verificacion-correo}

:::info 🆕 Paso obligatorio para cuentas nuevas
Al registrarse con `POST /register`, la API envía un correo con un **enlace de verificación firmado y con vencimiento**. Hay que abrirlo antes de iniciar sesión. Estos endpoints son públicos: no llevan token.
:::

<details open>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/email/verification-notification</b> — Reenviar Correo de Verificación</summary>

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

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "{{url}}/email/verification-notification" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email": "usuario@miempresa.com"}'
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
await axios.post(`${url}/email/verification-notification`, {
  email: 'usuario@miempresa.com'
}, {
  headers: { Accept: 'application/json' }
});
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$response = $client->post("{$url}/email/verification-notification", [
    'headers' => ['Accept' => 'application/json'],
    'json'    => ['email' => 'usuario@miempresa.com'],
]);
```

</TabItem>
</Tabs>

<details>
<summary>✅ Correo Enviado (HTTP 200)</summary>

```json
{
  "message": "Se ha enviado un correo electrónico de verificación"
}
```

</details>

<details>
<summary>❌ Correo no Registrado (HTTP 404)</summary>

También se recibe si no se envía `email`.

```json
{
  "message": "El usuario no existe.",
  "success": false
}
```

</details>

<details>
<summary>❌ Correo ya Verificado (HTTP 400)</summary>

```json
{
  "message": "El correo electrónico ya fue verificado.",
  "success": false
}
```

</details>

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>Enlace de verificación</b> — Confirmar el Correo</summary>

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

</details>

---

## 🔁 Recuperar Contraseña {#recuperar-contrasena}

Endpoints públicos (sin token) para restablecer la contraseña por correo.

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/forgot-password</b> — Solicitar Enlace de Restablecimiento</summary>

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

<details>
<summary>✅ Enlace Enviado (HTTP 200)</summary>

```json
{
  "success": true,
  "message": "¡Recordatorio de contraseña enviado!"
}
```

El correo contiene el enlace con el `token` que se usa en `POST /reset-password`.

</details>

<details>
<summary>❌ No se Pudo Enviar (HTTP 422)</summary>

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

</details>

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/reset-password</b> — Restablecer Contraseña</summary>

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

<details>
<summary>✅ Contraseña Restablecida (HTTP 200)</summary>

```json
{
  "success": true,
  "message": "¡Su contraseña ha sido restablecida!"
}
```

</details>

<details>
<summary>❌ Token Inválido o Vencido (HTTP 422)</summary>

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

</details>

</details>

---

## 🔐 Gestión de Tokens (Personal Access Tokens) {#personal-access-tokens}

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

<details open>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/tokens</b> — Listar Tokens</summary>

```http
GET {{url}}/tokens?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Accept: application/json
```

Obtiene la lista de los tokens **vigentes** del usuario (no incluye los revocados ni los vencidos), del más reciente al más antiguo. También aparecen los tokens de las sesiones abiertas con `POST /auth/login`, con `name` igual a `Login - {correo}`.

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

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

</details>

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/tokens/&#123;token_id&#125;</b> — Obtener Token por ID</summary>

```http
GET {{url}}/tokens/{token_id}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Accept: application/json
```

| Parámetro | Ubicación | Descripción |
|-----------|-----------|-------------|
| `token_id` | path | ID del token (`id` en `GET /tokens`, `token_id` al crearlo) |
| `client_uuid` | query | Opcional. UUID de la sub-cuenta (Casa de Software) |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

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

</details>

<details>
<summary>❌ Token no Encontrado (HTTP 404)</summary>

El token no existe o ya fue revocado.

```json
{
  "success": false,
  "message": "Token not found."
}
```

</details>

<details>
<summary>❌ Token de Otro Usuario (HTTP 403)</summary>

```json
{
  "success": false,
  "message": "Token does not belong to the authenticated user"
}
```

</details>

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/tokens</b> — Crear Nuevo Token</summary>

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

<Tabs>
<TabItem value="curl" label="cURL">

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

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

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

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

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

</TabItem>
</Tabs>

<details>
<summary>✅ Respuesta Exitosa (HTTP 201)</summary>

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

</details>

<details>
<summary>❌ Límite Diario Alcanzado (HTTP 429)</summary>

```json
{
  "success": false,
  "message": "Límite de creación de tokens alcanzado. Máximo 10 por día.",
  "error": "Rate limit exceeded",
  "retry_after": 3600
}
```

`retry_after` indica los segundos que faltan para poder crear otro token.

</details>

<details>
<summary>❌ Error de Validación (HTTP 422)</summary>

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

</details>

</details>

<details>
<summary><span className="badge badge--danger margin-right--sm">DELETE</span> <b>/tokens/&#123;token_id&#125;</b> — Revocar Token</summary>

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

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "message": "Token revoked successfully",
  "success": true
}
```

Revocar un token que ya estaba revocado también responde `200`.

</details>

<details>
<summary>❌ Token no Encontrado o de Otro Usuario (HTTP 404 / 403)</summary>

```json
{
  "success": false,
  "message": "Token not found: cb6282ed9f5cb116416928518f9dd93b53aafc2c0273722bbe5eb7eb96d7ccfac10178f43b8fe617"
}
```

Si el token pertenece a otro usuario, la respuesta es **HTTP 403** con `Token does not belong to user`.

</details>

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/tokens/revoke-all</b> — Revocar Todos los Tokens</summary>

```http
POST {{url}}/tokens/revoke-all?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Accept: application/json
```

Revoca todos tus tokens **excepto el que estás usando actualmente**.

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

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

</details>

</details>
