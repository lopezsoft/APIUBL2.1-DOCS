---
sidebar_position: 1
sidebar_label: Autenticación
---

# 🔌 Introducción y Autenticación

<div style={{backgroundColor: '#e7f3ff', padding: '1.5rem', borderRadius: '8px', border: '2px solid #0066cc', margin: '1.5rem 0'}}>
  <strong>📖 Referencia Completa de Endpoints</strong><br/>
  Los endpoints son las URL que se utilizan para acceder a los recursos de la API. Cada endpoint es un punto de acceso que devuelve datos o realiza operaciones en el servidor.
  
  <br/><br/>
  <a href="/postman_collection.json" target="_blank" download className="button button--primary">
    📥 Descargar Colección de Postman Completa
  </a>
</div>

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', margin: '1.5rem 0'}}>
  <div style={{padding: '1rem', backgroundColor: '#d4edda', borderRadius: '8px', border: '1px solid #28a745', textAlign: 'center'}}>
    <div style={{fontSize: '2rem'}}>🟢</div>
    <strong>Públicos</strong><br/>
    <small>Sin autenticación</small>
  </div>
  <div style={{padding: '1rem', backgroundColor: '#fff3cd', borderRadius: '8px', border: '1px solid #ffc107', textAlign: 'center'}}>
    <div style={{fontSize: '2rem'}}>🔐</div>
    <strong>Privados</strong><br/>
    <small>Requieren token</small>
  </div>
  <div style={{padding: '1rem', backgroundColor: '#d1ecf1', borderRadius: '8px', border: '1px solid #17a2b8', textAlign: 'center'}}>
    <div style={{fontSize: '2rem'}}>📄</div>
    <strong>Documentos</strong><br/>
    <small>CRUD y consultas</small>
  </div>
  <div style={{padding: '1rem', backgroundColor: '#e7f3ff', borderRadius: '8px', border: '1px solid #0066cc', textAlign: 'center'}}>
    <div style={{fontSize: '2rem'}}>🔔</div>
    <strong>Webhooks</strong><br/>
    <small>v3.0.0</small>
  </div>
</div>

## 🎯 Introducción a los Endpoints de la API

### 🎟️ Flujo Completo de una Factura Electrónica

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

<div style={{backgroundColor: '#fff3cd', padding: '1rem', borderRadius: '8px', border: '1px solid #ffc107', marginTop: '1rem'}}>
  <strong>⚠️ Importante:</strong> Los endpoints privados requieren el header <code>Authorization: Bearer {'{token}'}</code> en todas las solicitudes.
</div>

---

## Autenticación

### Iniciar Sesión - 🟘 POST

```http
POST {{url}}/auth/login
Content-Type: application/json
```

**Body requerido:**
```json
{
  "email": "usuario@empresa.com",
  "password": "tu_contraseña",
  "remember_me": 0
}
```
**Respuesta:** Incluye `access_token`, `user`, `expires_at` (90 días máximo).

### Obtener Usuario Actual - 🟢 GET
```http
GET {{url}}/auth/user
Authorization: Bearer {token}
```
**Respuesta:** Información del usuario logueado.

### Cerrar Sesión - 🟢 GET
```http
GET {{url}}/auth/logout
Authorization: Bearer {token}
```
**Uso:** Revoca el token actual. Recomendado al final de sesión.

---

## Gestión de Tokens (Personal Access Tokens)

### Listar Tokens - 🟢 GET
```http
GET {{url}}/tokens
Authorization: Bearer {token}
```
Obtiene la lista de tokens del usuario.

### Listar Token por ID - 🟢 GET
```http
GET {{url}}/tokens/{token_id}
Authorization: Bearer {token}
```

### Crear Nuevo Token - 🔵 POST
```http
POST {{url}}/tokens
Authorization: Bearer {token}
Content-Type: application/json
```
**Body:**
```json
{
  "name": "Token Producción",
  "description": "Token para integración ERP",
  "expires_in_days": 60
}
```

### Eliminar (Revocar) Token - 🔴 DELETE
```http
DELETE {{url}}/tokens/{token_id}
Authorization: Bearer {token}
```

### Revocar Todos los Tokens - 🔵 POST
```http
POST {{url}}/tokens/revoke-all
Authorization: Bearer {token}
```
Revoca todos tus tokens **excepto el que estás usando actualmente**.
