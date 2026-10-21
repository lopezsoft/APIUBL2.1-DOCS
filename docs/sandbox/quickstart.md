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

## 1. Crear cuenta en el Sandbox

El acceso al sandbox es **completamente gratuito y no requiere contrato**. Para comenzar tus pruebas, debes crear una **cuenta independiente en el entorno Sandbox**, ya sea desde el portal web visual o mediante el endpoint API de registro:

<Tabs>
<TabItem value="curl" label="cURL">

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

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

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

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

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

</TabItem>
</Tabs>

**Respuesta Exitosa (HTTP 200):** no incluye token ni datos de la cuenta.

```json
{
  "message": "Empresa creada con éxito. Verifique su dirección de correo electrónico: tu@email.com",
  "success": true
}
```

- El `dni` va **solo con dígitos** (sin dígito de verificación, puntos ni guiones); el DV lo calcula la API.
- En el sandbox, la cuenta principal recibe una suscripción de **5.000 documentos por 1 año**.
- Envía siempre `Accept: application/json`: sin esa cabecera, los errores de validación (422) llegan como una redirección (HTTP 302). Ver todos los campos y errores en [Registro en la API](/docs/intro#registro-en-la-api).

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

Más detalles en [Verificación de Correo](/docs/endpoints/intro-auth#verificacion-correo).

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

Si el login falla, la API responde **HTTP 404** (no 401) con `message` y `success: false` (por ejemplo, `Credenciales inválidas.`). Ver todos los motivos en [Autenticación](/docs/endpoints/intro-auth#autenticacion).

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
1. **Numeración activa de eventos** (`type_document_id` `12`), registrada en el portal o con [`POST /resolutions`](/docs/endpoints/dian-resolutions#configuracion-manual). Sin ella: `400` `No tiene una numeración activa para los eventos de recepción`.
2. **Persona de recepción**, creada con `POST /events/reception-people` (ver [Personas de Recepción](/docs/endpoints/events-radian#personas-recepcion)). Sin ella: `400` `No tiene una persona de recepción asignada` (al importar, puedes evitarlo enviando los datos de la persona en `reception_person`).
3. *(Opcional)* **Modo automático**: una empresa nueva arranca en modo **manual**, así que importar un documento no crea eventos. Si quieres que los eventos 030, 032 y 033 se generen solos, activa el modo con `PUT /events/reception-people/mode` y `{"send_events": true}` (ver [modo de eventos](/docs/endpoints/events-radian#eventos-automaticos)).
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

* [Magic Values](./magic-values.md) — Conoce todas las cabeceras para simular errores y respuestas DIAN.
* [Certificado de Prueba](./test-cert.md) — Especificaciones del certificado digital de pruebas.
* [Colección Postman](./postman.md) — Descarga la colección oficial para importar en Postman / Insomnia.
