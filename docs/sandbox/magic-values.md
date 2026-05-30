---
sidebar_position: 2
title: Magic Values
description: 8 valores de simulación para probar diferentes respuestas de la DIAN en el sandbox.
---

# Magic Values — MATIAS API Sandbox

El entorno sandbox de MATIAS API soporta **8 valores mágicos (Magic Values)** a través de cabeceras HTTP especiales. Esto te permite forzar y testear cómo reacciona tu integración ante diferentes estados y códigos de error reales de la DIAN en **cualquiera de nuestros endpoints**, sin necesidad de alterar tu base de datos o registrar payloads de prueba incorrectos.

---

## Cómo Utilizar los Magic Values

Para forzar un estado, incluye la cabecera HTTP **`X-Sandbox-Force-Status`** en cualquiera de tus solicitudes de emisión o envío de documentos electrónicos:

### Mapeo de Endpoints Compatibles

*   `POST /invoice` — Factura electrónica estándar
*   `POST /notes/credit` — Nota crédito electrónica
*   `POST /notes/debit` — Nota débito electrónica
*   `POST /ds/document` — Documento soporte electrónico
*   `POST /ds/adjustment-note` — Nota de ajuste a Documento Soporte
*   `POST /ep/payroll` — Nómina electrónica individual
*   `POST /ep/payroll/replace` — Reemplazo de nómina
*   `POST /ep/payroll/delete` — Anulación/Eliminación de nómina
*   `POST /auto-increment/invoices` — Factura auto-incrementable
*   `POST /auto-increment/credit-notes` — Nota Crédito auto-incrementable
*   `POST /auto-increment/debit-notes` — Nota Débito auto-incrementable
*   `POST /auto-increment/support-documents` — Documento Soporte auto-incrementable
*   `POST /auto-increment/adjustment-notes` — Nota ajuste auto-incrementable
*   `POST /auto-increment/pos-documents` — POS auto-incrementable

---

## Ejemplos de Comandos de Simulación

A continuación se exponen ejemplos de peticiones forzadas para diferentes tipos de flujos y documentos:

```bash
# Ejemplo 1: Forzar un rechazo por validaciones de negocio en Factura Electrónica
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/invoice \
  -H "Authorization: Bearer {token}" \
  -H "X-Sandbox-Force-Status: ERROR_REJECTED" \
  -H "Content-Type: application/json" \
  -d @invoice.json

# Ejemplo 2: Forzar un timeout de la DIAN en Nómina Electrónica
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/ep/payroll \
  -H "Authorization: Bearer {token}" \
  -H "X-Sandbox-Force-Status: ERROR_TIMEOUT" \
  -H "Content-Type: application/json" \
  -d @payroll.json

# Ejemplo 3: Forzar una validación de documento duplicado en Nota Crédito
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/notes/credit \
  -H "Authorization: Bearer {token}" \
  -H "X-Sandbox-Force-Status: ERROR_DUPLICATE" \
  -H "Content-Type: application/json" \
  -d @credit-note.json

# Ejemplo 4: Forzar error estructural XSD en Documento Soporte Auto-incrementable
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/auto-increment/support-documents \
  -H "Authorization: Bearer {token}" \
  -H "X-Sandbox-Force-Status: ERROR_SCHEMA" \
  -H "Content-Type: application/json" \
  -d @ds-auto.json
```

:::info Comportamiento por Defecto
Si no especificas la cabecera `X-Sandbox-Force-Status` en tu solicitud, el sandbox procesará el documento de forma exitosa y devolverá un estado de aceptación estándar de la DIAN (**`ACCEPTED`**) en cualquiera de los módulos.
:::

---

## Catálogo de Magic Values

### 1. Errores DIAN (6)

| Header `X-Sandbox-Force-Status` | Estado HTTP | Código DIAN | Descripción del Comportamiento |
|:---|:---:|:---:|:---|
| **`ERROR_REJECTED`** | `422` | `B7B01` | El documento es rechazado formalmente por validación de negocio. |
| **`ERROR_DUPLICATE`** | `422` | `89` | Simula que el prefijo y número de factura ya fueron reportados previamente. |
| **`ERROR_AUTH`** | `422` | `IFE043` | Simula un fallo de autenticación de credenciales o de la firma del certificado. |
| **`ERROR_SCHEMA`** | `422` | `FAD06` | El XML generado no pasa la validación estructural XSD obligatoria. |
| **`ERROR_500`** | `500` | — | Simula una caída general de los servidores SOAP de la DIAN. |
| **`ERROR_TIMEOUT`** | `500` | — | Simula un retraso excesivo o pérdida de conexión (timeout) con la DIAN. |

---

### 2. Estados de Certificado Digital (2)

| Header `X-Sandbox-Force-Status` | Comportamiento Simulado | Objetivo de Prueba |
|:---|:---|:---|
| **`CERT_EXPIRED`** | Fuerza un error por certificado de firma expirado. | Validar bloqueos e instructivos de renovación en tu ERP. |
| **`CERT_NEAR_EXPIRY`** | Genera una alerta por certificado a menos de 5 días de expirar. | Validar el procesamiento de warnings y alarmas de alerta temprana. |

---

## Compatibilidad por Tipo de Documento

Todos los 8 magic values son **100% compatibles** con todas las tipologías de documentos electrónicos en el sandbox:

| Tipo de Documento | Endpoint Relativo | Magic Values Soportados |
|:---|:---|:---:|
| Factura electrónica | `POST /invoice` | ✅ Los 8 |
| Nota crédito | `POST /notes/credit` | ✅ Los 8 |
| Nota débito | `POST /notes/debit` | ✅ Los 8 |
| Documento soporte | `POST /ds/document` | ✅ Los 8 |
| Nota de ajuste DS | `POST /ds/adjustment-note` | ✅ Los 8 |
| Nómina individual | `POST /ep/payroll` | ✅ Los 8 |
| Reemplazo nómina | `POST /ep/payroll/replace` | ✅ Los 8 |
| Eliminación nómina | `POST /ep/payroll/delete` | ✅ Los 8 |
| Factura auto-increment | `POST /auto-increment/invoices` | ✅ Los 8 |
| NC auto-increment | `POST /auto-increment/credit-notes` | ✅ Los 8 |
| ND auto-increment | `POST /auto-increment/debit-notes` | ✅ Los 8 |
| DS auto-increment | `POST /auto-increment/support-documents` | ✅ Los 8 |
| Ajuste auto-increment | `POST /auto-increment/adjustment-notes` | ✅ Los 8 |
| POS auto-increment | `POST /auto-increment/pos-documents` | ✅ Los 8 |

---

## Ejemplos de Respuestas del Sandbox

Aplica con idéntica consistencia estructural para cualquier tipo de documento electrónico:

<details open>
<summary>🟢 Respuesta Happy Path — ACCEPTED (Sin Magic Value)</summary>

```json
{
  "success": true,
  "message": "Solicitud procesada por la DIAN.",
  "data": {
    "XmlDocumentKey": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    "StatusCode": "00",
    "StatusDescription": "Procesado Correctamente.",
    "IsValid": "true"
  }
}
```

</details>

<details>
<summary>🔴 Respuesta de Error Forzado — ERROR_REJECTED</summary>

```json
{
  "success": false,
  "message": "Regla: B7B01, Rechazo: El documento ha sido rechazado por validaciones de negocio.",
  "errors": [
    "Regla: B7B01, Rechazo: La fecha de emisión del documento no corresponde con el rango permitido por la DIAN."
  ]
}
```

</details>

<details>
<summary>🟡 Respuesta de Advertencia de Certificado — CERT_NEAR_EXPIRY</summary>

```json
{
  "success": true,
  "message": "Solicitud procesada con advertencias.",
  "warnings": [
    "Alerta: El certificado digital de firma vencerá en 4 días (2026-06-03). Por favor renueve sus credenciales."
  ],
  "data": {
    "XmlDocumentKey": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    "StatusCode": "00",
    "StatusDescription": "Procesado Correctamente.",
    "IsValid": "true"
  }
}
```

</details>

---

:::warning Reglas de Uso en Producción
*   El header `X-Sandbox-Force-Status` **solo es vinculante en el dominio del sandbox** (`https://sandbox-api.matias-api.com`).
*   En producción, esta cabecera es **ignorada por completo**.
*   El mismo magic value produce la **misma estructura de respuesta**, garantizando consistencia semántica en todo tu flujo de integración.
:::
