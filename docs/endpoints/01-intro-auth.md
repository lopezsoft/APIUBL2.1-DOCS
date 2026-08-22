---
sidebar_position: 1
sidebar_label: 🔐 Autenticación
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

<details open>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/auth/login</b> — Iniciar Sesión</summary>

```http
POST {{url}}/auth/login
Content-Type: application/json
```

**Parámetros del Body:**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `email` | `string` | ✅ Sí | Correo electrónico registrado |
| `password` | `string` | ✅ Sí | Contraseña de la cuenta |
| `remember_me` | `integer` | ✅ Sí | Debe ser `0` |

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "{{url}}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@lopezsoft.net.co",
    "password": "DEMO123456",
    "remember_me": 0
  }'
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
const response = await axios.post(`${url}/auth/login`, {
  email: 'demo@lopezsoft.net.co',
  password: 'DEMO123456',
  remember_me: 0
});
const token = response.data.access_token;
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$response = $client->post("{$url}/auth/login", [
    'json' => [
        'email'       => 'demo@lopezsoft.net.co',
        'password'    => 'DEMO123456',
        'remember_me' => 0,
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
  "token_type": "Bearer",
  "expires_at": "2026-05-15 20:00:00",
  "user": {
    "id": 1,
    "first_name": "Lewis",
    "last_name": "Lopez Gomez",
    "email": "demo@lopezsoft.net.co",
    "roles": ["admin"]
  }
}
```

</details>

<details>
<summary>❌ Credenciales Inválidas (HTTP 401)</summary>

```json
{
  "message": "Credenciales inválidas",
  "success": false
}
```

</details>

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/auth/user</b> — Obtener Usuario Actual</summary>

```http
GET {{url}}/auth/user
Authorization: Bearer {token}
```

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "id": 1,
  "first_name": "Lewis",
  "last_name": "Lopez Gomez",
  "email": "demo@lopezsoft.net.co",
  "roles": ["admin"]
}
```

</details>

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/auth/logout</b> — Cerrar Sesión</summary>

```http
GET {{url}}/auth/logout
Authorization: Bearer {token}
```

Revoca el token actual. Recomendado al final de sesión.

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "message": "Successfully logged out"
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
| **Expiración** | Configurable: 1–90 días | Fija: hasta 90 días |
| **Revocación** | Selectiva por ID | Solo logout total |
| **Recomendado para** | ✅ Integraciones B2B | ✅ Portales web |
:::

<details open>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/tokens</b> — Listar Tokens</summary>

```http
GET {{url}}/tokens
Authorization: Bearer {token}
```

Obtiene la lista de todos los Personal Access Tokens del usuario.

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "success": true,
  "data": [
    {
      "id": "cb6282ed9f5cb116416928518f9dd93b53aafc2c0273722bbe5eb7eb96d7ccfac10178f43b8fe617",
      "name": "Token ERP",
      "description": "Token de integración para facturación",
      "created_at": "2026-02-01T12:00:00.000000Z",
      "expires_at": "2026-05-02T12:00:00.000000Z",
      "is_expired": false
    }
  ]
}
```

</details>

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/tokens/&#123;token_id&#125;</b> — Obtener Token por ID</summary>

```http
GET {{url}}/tokens/{token_id}
Authorization: Bearer {token}
```

| Parámetro | Ubicación | Descripción |
|-----------|-----------|-------------|
| `token_id` | path | ID del token a consultar |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "success": true,
  "data": {
    "id": "cb6282ed9f5cb116416928518f9dd93b53aafc2c0273722bbe5eb7eb96d7ccfac10178f43b8fe617",
    "name": "Token ERP",
    "description": "Token de integración para facturación",
    "created_at": "2026-02-01T12:00:00.000000Z",
    "expires_at": "2026-05-02T12:00:00.000000Z",
    "is_expired": false
  }
}
```

</details>

<details>
<summary>❌ Token no encontrado (HTTP 404)</summary>

```json
{
  "message": "Token no encontrado",
  "success": false
}
```

</details>

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/tokens</b> — Crear Nuevo Token</summary>

```http
POST {{url}}/tokens
Authorization: Bearer {token}
Content-Type: application/json
```

**Parámetros del Body:**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `name` | `string` | ✅ Sí | Nombre descriptivo del token |
| `description` | `string` | No | Descripción del uso del token |
| `expires_in_days` | `integer` | ✅ Sí | Días de vigencia (1–90) |

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "{{url}}/tokens" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Token Producción",
    "description": "Token para integración ERP",
    "expires_in_days": 60
  }'
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
const response = await axios.post(`${url}/tokens`, {
  name: 'Token Producción',
  description: 'Token para integración ERP',
  expires_in_days: 60
}, {
  headers: { Authorization: `Bearer ${token}` }
});
// Guardar: response.data.token (solo se muestra una vez)
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$response = $client->post("{$url}/tokens", [
    'headers' => ['Authorization' => "Bearer {$token}"],
    'json'    => [
        'name'            => 'Token Producción',
        'description'     => 'Token para integración ERP',
        'expires_in_days' => 60,
    ],
]);
```

</TabItem>
</Tabs>

<details>
<summary>✅ Respuesta Exitosa (HTTP 201)</summary>

```json
{
  "success": true,
  "message": "Token de acceso creado exitosamente",
  "token": "1|eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI...",
  "data": {
    "name": "Token Producción",
    "description": "Token para integración ERP",
    "expires_at": "2026-05-02 12:00:00"
  }
}
```

:::caution Guarda el token ahora
El valor `token` solo se muestra **una vez** al crearlo. No se puede recuperar después.
:::

</details>

</details>

<details>
<summary><span className="badge badge--danger margin-right--sm">DELETE</span> <b>/tokens/&#123;token_id&#125;</b> — Revocar Token</summary>

```http
DELETE {{url}}/tokens/{token_id}
Authorization: Bearer {token}
```

| Parámetro | Ubicación | Descripción |
|-----------|-----------|-------------|
| `token_id` | path | ID del token a revocar |

<details>
<summary>✅ Respuesta Exitosa (HTTP 200)</summary>

```json
{
  "message": "Token revoked successfully",
  "success": true
}
```

</details>

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/tokens/revoke-all</b> — Revocar Todos los Tokens</summary>

```http
POST {{url}}/tokens/revoke-all
Authorization: Bearer {token}
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
