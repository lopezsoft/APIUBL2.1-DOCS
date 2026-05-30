---
sidebar_position: 2
title: Magic Values
description: 8 valores de simulación para probar diferentes respuestas de la DIAN en el sandbox.
---

# Magic Values — MATIAS API Sandbox

El entorno sandbox de MATIAS API soporta **8 valores mágicos (Magic Values)** a través de cabeceras HTTP especiales. Esto te permite forzar y testear cómo reacciona tu integración ante diferentes estados y códigos de error reales de la DIAN, sin necesidad de alterar tu base de datos o registrar payloads de prueba incorrectos.

---

## Cómo Utilizar los Magic Values

Para forzar un estado, incluye la cabecera HTTP **`X-Sandbox-Force-Status`** en cualquiera de tus solicitudes de emisión o envío de documentos electrónicos (`POST /invoice`, `POST /notes/credit`, `POST /notes/debit`, `POST /ep/payroll`, etc.).

```bash
# Ejemplo: Forzar un rechazo por validaciones de negocio de la DIAN
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/invoice \
  -H "Authorization: Bearer {token}" \
  -H "X-Sandbox-Force-Status: ERROR_REJECTED" \
  -H "Content-Type: application/json" \
  -d @invoice.json
```

:::info Comportamiento por Defecto
Si no especificas la cabecera `X-Sandbox-Force-Status` en tu solicitud, el sandbox procesará el documento de forma exitosa y devolverá un estado de aceptación estándar de la DIAN (**`ACCEPTED`**).
:::

---

## Catálogo de Magic Values

### 1. Errores DIAN (6)

Utiliza estos valores para testear la tolerancia a fallos, reintentos o el flujo de alerta para tus usuarios finales ante rechazos de la DIAN:

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

Permite verificar las notificaciones o flujos preventivos de tu sistema ante problemas de vigencia del certificado:

| Header `X-Sandbox-Force-Status` | Comportamiento Simulado | Objetivo de Prueba |
|:---|:---|:---|
| **`CERT_EXPIRED`** | Fuerza un error por certificado de firma expirado. | Validar bloqueos e instructivos de renovación en tu ERP. |
| **`CERT_NEAR_EXPIRY`** | Genera una alerta por certificado a menos de 5 días de expirar. | Validar el procesamiento de warnings y alarmas de alerta temprana. |

---

## Ejemplos de Respuestas del Sandbox

A continuación se exponen las estructuras de respuesta HTTP completas que devuelve el sandbox según el caso:

<details open>
<summary>🟢 Respuesta Happy Path — ACCEPTED (Sin Magic Value)</summary>

Esta respuesta se obtiene cuando el documento pasa todas las validaciones estructurales y de negocio correctamente:

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

Devuelve un fallo semántico detallado con los códigos de regla y razones oficiales de la DIAN:

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

El documento es aceptado pero se inyecta una colección de advertencias preventivas:

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
*   Si envías esta cabecera al entorno de **Producción**, el gateway de enlace la **eliminará de forma silenciosa** para evitar alteraciones accidentales en facturaciones reales.
:::
