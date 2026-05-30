---
sidebar_position: 1
title: Quickstart
description: Guía rápida para integrar con el sandbox de MATIAS API en 5 minutos.
---

# Quickstart — MATIAS API Sandbox

Guía rápida para integrar con el sandbox de MATIAS API en 5 minutos. El sandbox es un ambiente aislado donde puedes probar todos nuestros endpoints sin alterar tus datos reales de producción ni realizar reportes reales ante la DIAN.

---

## 1. Crear cuenta

Registra tu cuenta en **producción**. Las credenciales registradas se replicarán automáticamente al ambiente sandbox en tiempo real.

```bash
curl -X POST {{URL}}/register \
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

:::info Registro Centralizado
El registro se realiza únicamente a través del endpoint de producción (`{{URL}}`). No necesitas crear una cuenta diferente para el sandbox; tus credenciales son globales.

*Nota: En toda la documentación se utiliza `{{URL}}` como marcador de posición para la URL base real de producción, la cual puede variar dependiendo de tu proveedor tecnológico o tu propia instancia dedicada de servidor (por ejemplo, `https://api-v2.matias-api.com`).*
:::

---

## 2. Login en sandbox

Realiza el inicio de sesión en el sandbox utilizando las **mismas credenciales** que registraste en producción:

```bash
curl -X POST https://sandbox-api.matias-api.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tu@email.com",
    "password": "tu-password-seguro"
  }'
```

**Respuesta exitosa:**
```json
{
  "access_token": "eyJ...",
  "token_type": "Bearer"
}
```

---

## 3. Generar un PAT (Personal Access Token)

Genera tu token de acceso de larga duración para realizar pruebas de integración de forma segura:

```bash
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/auth/token \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json" \
  -d '{"name": "Mi Token de Prueba"}'
```

:::tip Prefijo de Token
Los tokens del ambiente sandbox se generan automáticamente con el prefijo **`sk_test_*`**, lo que te permite identificarlos fácilmente de tus tokens de producción con prefijo **`sk_live_*`**.
:::

---

## 4. Enviar documentos electrónicos

El sandbox soporta **todos los tipos de documento** de la API de producción. A continuación se exponen los comandos y endpoints de prueba estructurados por tipo:

### 4.1 Factura electrónica

```bash
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/invoice \
  -H "Authorization: Bearer sk_test_..." \
  -H "Content-Type: application/json" \
  -d @tu-factura.json
```

### 4.2 Notas crédito y débito

```bash
# Enviar Nota Crédito
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/notes/credit \
  -H "Authorization: Bearer sk_test_..." \
  -H "Content-Type: application/json" \
  -d @nota-credito.json

# Enviar Nota Débito
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/notes/debit \
  -H "Authorization: Bearer sk_test_..." \
  -H "Content-Type: application/json" \
  -d @nota-debito.json
```

### 4.3 Documento soporte y nota de ajuste

```bash
# Enviar Documento Soporte
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/ds/document \
  -H "Authorization: Bearer sk_test_..." \
  -H "Content-Type: application/json" \
  -d @documento-soporte.json

# Enviar Nota de Ajuste al Documento Soporte
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/ds/adjustment-note \
  -H "Authorization: Bearer sk_test_..." \
  -H "Content-Type: application/json" \
  -d @nota-ajuste-ds.json
```

### 4.4 Nómina electrónica

```bash
# Enviar Nómina Individual
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/ep/payroll \
  -H "Authorization: Bearer sk_test_..." \
  -H "Content-Type: application/json" \
  -d @nomina.json

# Enviar Reemplazo de Nómina
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/ep/payroll/replace \
  -H "Authorization: Bearer sk_test_..." \
  -H "Content-Type: application/json" \
  -d @nomina-replace.json

# Enviar Eliminación de Nómina
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/ep/payroll/delete \
  -H "Authorization: Bearer sk_test_..." \
  -H "Content-Type: application/json" \
  -d @nomina-delete.json
```

### 4.5 Documentos con consecutivo automático (auto-increment)

Todos los endpoints de auto-incremento de numeración también operan y responden en el sandbox:

```bash
# Factura con consecutivo automático
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/auto-increment/invoices \
  -H "Authorization: Bearer sk_test_..." \
  -H "Content-Type: application/json" \
  -d @factura-auto.json

# Nota Crédito con consecutivo automático
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/auto-increment/credit-notes \
  -H "Authorization: Bearer sk_test_..." \
  -d @nc-auto.json

# Nota Débito con consecutivo automático
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/auto-increment/debit-notes \
  -H "Authorization: Bearer sk_test_..." \
  -d @nd-auto.json

# Documento Soporte con consecutivo automático
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/auto-increment/support-documents \
  -H "Authorization: Bearer sk_test_..." \
  -d @ds-auto.json

# Nota de Ajuste con consecutivo automático
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/auto-increment/adjustment-notes \
  -H "Authorization: Bearer sk_test_..." \
  -d @ajuste-auto.json

# Documento POS con consecutivo automático
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/auto-increment/pos-documents \
  -H "Authorization: Bearer sk_test_..." \
  -d @pos-auto.json
```

:::tip Reenvíos de Auto-incremento
Todos los endpoints con consecutivo automático soportan la llamada **`PATCH /{uuid}`** para gestionar de forma transparente el reenvío de documentos.
:::

Si realizas la solicitud sin especificar cabeceras de simulación de estado, el sandbox validará y devolverá un estado de aceptación `ACCEPTED` automáticamente para cualquier tipo de documento.

---

## 5. Probar errores

El sandbox te permite forzar escenarios de error en **cualquier** endpoint de documentos (factura, notas crédito/débito, documento soporte, nómina o auto-increment). Para esto, utiliza la cabecera HTTP `X-Sandbox-Force-Status`:

```bash
# Simular documento rechazado por validaciones de negocio (en /invoice, /notes/credit, etc.)
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/invoice \
  -H "Authorization: Bearer sk_test_..." \
  -H "X-Sandbox-Force-Status: ERROR_REJECTED" \
  -d @tu-factura.json

# Simular timeout de conexión con la DIAN en el módulo de Nómina
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/ep/payroll \
  -H "Authorization: Bearer sk_test_..." \
  -H "X-Sandbox-Force-Status: ERROR_TIMEOUT" \
  -d @nomina.json
```

:::warning Aislamiento de Simulación
La cabecera `X-Sandbox-Force-Status` **solo es procesada en el sandbox** (`https://sandbox-api.matias-api.com`). En producción, esta cabecera es ignorada por completo por motivos de seguridad.
:::

Puedes consultar la lista completa de estados simulables en la guía de [Magic Values](./magic-values.md).

---

## 6. Verificar entorno

Todas las respuestas del sandbox inyectan la siguiente cabecera HTTP de diagnóstico:

```http
X-MATIAS-Environment: sandbox
```

---

## Endpoints Soportados en el Sandbox

El sandbox ofrece paridad funcional total con producción. A continuación se listan las familias de endpoints activas:

### 📄 1. Emisión de Documentos (Respuestas DIAN Simuladas)

| Endpoint API | Método | Tipo de Documento Emitido |
|:---|:---:|:---|
| `/invoice` | `POST` | Factura electrónica estándar |
| `/notes/credit` | `POST` | Nota crédito electrónica |
| `/notes/debit` | `POST` | Nota débito electrónica |
| `/ds/document` | `POST` | Documento soporte electrónico |
| `/ds/adjustment-note` | `POST` | Nota de ajuste a Documento Soporte |
| `/ep/payroll` | `POST` | Nómina electrónica individual |
| `/ep/payroll/replace` | `POST` | Reemplazo de nómina electrónica |
| `/ep/payroll/delete` | `POST` | Anulación/Eliminación de nómina |
| `/auto-increment/invoices` | `POST` | Factura con consecutivo auto-incrementable |
| `/auto-increment/credit-notes` | `POST` | Nota Crédito auto-incrementable |
| `/auto-increment/debit-notes` | `POST` | Nota Débito auto-incrementable |
| `/auto-increment/support-documents` | `POST` | Documento Soporte auto-incrementable |
| `/auto-increment/adjustment-notes` | `POST` | Nota de Ajuste auto-incrementable |
| `/auto-increment/pos-documents` | `POST` | Documento equivalente POS auto-incrementable |

### 🛠️ 2. CRUD y Configuración (Misma Lógica de Negocio que Producción)

| Familia de Endpoints | Descripción del Comportamiento |
|:---|:---|
| `/certificate/*` | Carga, descarga y validación de certificados digitales. |
| `/resolutions/*` | Registro y consulta de rangos de numeración autorizados por la DIAN. |
| `/software/*` | Configuración técnica del software registrado ante la DIAN. |
| `/company/*` | Consulta y actualización de datos de la organización/emisor. |
| `/documents/*` | Trazabilidad de envíos, consulta de estados y descarga de representaciones gráficas (PDF/XML). |
| `/tokens/*` | Autogestión de Personal Access Tokens (PAT). |
| `/currency/*` | Consulta de monedas autorizadas y TRM (con simulación adaptiva en sandbox). |

---

## Diferencias: Producción vs Sandbox

| Aspecto | Producción | Sandbox |
|:---|:---|:---|
| **Dominio API** | `{{URL}}` (ej. `api-v2.matias-api.com`) | `https://sandbox-api.matias-api.com` |
| **Envío a la DIAN** | Transmisión real SOAP a servidores DIAN | Respuestas simuladas/mockeadas |
| **Firma de Documentos** | Certificado digital emitido por CA real (ONAC) | Certificado digital de prueba (Test Cert) auto-asignado |
| **Persistencia de Datos** | Persistentes en base de datos real | Aislados de producción (persistencia simulada) |
| **Prefijo de Token (PAT)** | `sk_live_*` | `sk_test_*` |
| **Endpoints del API** | Todos | **Idénticos a producción** |
| **TRM (Tasa de Cambio)** | Consulta real vía API externa financiera | Valores de fallback fijos/mockeados |

---

## Próximos Pasos

*   [Magic Values](./magic-values.md) — Lista completa de cabeceras de simulación de errores de la DIAN.
*   [Test Certificate](./test-cert.md) — Especificaciones del certificado digital de prueba autogenerado.
*   [Colección Postman](./postman.md) — Importa la colección de 14 peticiones de prueba listas para usar.
