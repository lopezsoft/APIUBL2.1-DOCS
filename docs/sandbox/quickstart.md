---
sidebar_position: 1
title: Quickstart
description: Guía rápida para integrar con el sandbox de MATIAS API en 5 minutos.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

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

## 1. Crear cuenta

Registra tu cuenta en **producción**. Las credenciales registradas se sincronizan automáticamente con el ambiente sandbox en tiempo real.

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X POST {{url}}/register \
  -H "Content-Type: application/json" \
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

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```javascript
import axios from 'axios';

const response = await axios.post(`${url}/register`, {
  first_name: "Tu Nombre",
  last_name: "Tu Apellido",
  company_name: "Mi Empresa SAS",
  email: "tu@email.com",
  password: "tu-password-seguro",
  password_confirmation: "tu-password-seguro",
  dni: "900123456"
});

console.log(response.data);
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
use GuzzleHttp\Client;

$client = new Client();
$response = $client->post("{$url}/register", [
    'json' => [
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

</TabItem>
</Tabs>

:::info 🔐 Registro Centralizado
El registro se realiza a través del endpoint de producción (`{{url}}`). No necesitas crear una cuenta independiente para el sandbox; tus credenciales son globales.
:::

---

## 2. Iniciar sesión en el Sandbox

Realiza el login en el sandbox utilizando las **mismas credenciales** de tu cuenta:

```bash
curl -X POST {{SANDBOX_URL}}/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tu@email.com",
    "password": "tu-password-seguro"
  }'
```

**Respuesta Exitosa (HTTP 200):**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIs...",
  "token_type": "Bearer",
  "expires_at": "2026-05-15 20:00:00",
  "user": {
    "id": 1,
    "first_name": "Lewis",
    "last_name": "Lopez Gomez",
    "email": "tu@email.com",
    "roles": ["admin"]
  }
}
```

---

## 3. Generar un Personal Access Token (PAT)

Genera tu token de acceso persistente de larga duración para realizar pruebas automatizadas de integración:

```bash
curl -X POST {{SANDBOX_URL}}/tokens \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json" \
  -d '{"name": "Token Integracion ERP Sandbox"}'
```

**Respuesta Exitosa (HTTP 201):**
```json
{
  "success": true,
  "message": "Token de acceso creado exitosamente",
  "token": "1|eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIs...",
  "data": {
    "name": "Token Integracion ERP Sandbox",
    "expires_at": "2026-05-02 12:00:00"
  }
}
```

:::tip 🔑 Autenticación JWT Estándar
Tanto en producción como en el ambiente sandbox, el token generado es un **JWT estándar (Laravel Passport)**, garantizando un esquema de autenticación idéntico y seguro para todos tus entornos.
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

```bash
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

Consulta el catálogo completo de cabeceras en la guía de [Magic Values](./magic-values.md).

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
| `/events/send/{trackId}` | `POST` | Enviar evento DIAN (030, 031, 032, 033, 034) |
| `/events/status/{trackId}` | `GET` | Consultar estado del evento RADIAN |
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
| **Dominio API** | `{{url}}` (ej. `https://api.matias-api.com/api/ubl2.1`) | `{{SANDBOX_URL}}` (`https://sandbox-api.matias-api.com/api/ubl2.1`) |
| **Transmisión DIAN** | Transmisión SOAP en tiempo real a los servidores de la DIAN | Respuestas DIAN simuladas y mockeadas automáticamente |
| **Firma Digital** | Certificado digital de firma emitido por entidad de certificación (ONAC) | Certificado digital de prueba (*Test Cert*) asignado automáticamente |
| **Persistencia** | Datos persistidos en base de datos de producción | Aislamiento completo de base de datos |
| **Autenticación** | JWT estándar (Laravel Passport) | JWT estándar (Laravel Passport) |
| **Endpoints Disponibles** | 20 módulos oficiales | **100% de paridad funcional** |
| **Tasa de Cambio (TRM)** | Consulta en tiempo real de la TRM oficial | Valores adaptables y controlables |

---

## 🚀 Próximos Pasos

* [Magic Values](./magic-values.md) — Conoce todas las cabeceras para simular errores y respuestas DIAN.
* [Certificado de Prueba](./test-cert.md) — Especificaciones del certificado digital de pruebas.
* [Colección Postman](./postman.md) — Descarga la colección oficial para importar en Postman / Insomnia.
