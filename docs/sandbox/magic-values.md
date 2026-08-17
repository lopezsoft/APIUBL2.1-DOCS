---
sidebar_position: 2
title: Magic Values
description: 32 valores de simulación para probar diferentes respuestas de la DIAN en el sandbox.
---

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

* `POST /invoice` — Factura electrónica estándar y Sector Salud (Resolución 000948 de 2026)
* `POST /pos` — Documento Equivalente POS Electrónico
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
* `POST /auto-increment/pos-credit-notes` — Nota Crédito POS automática
* `POST /auto-increment/pos-debit-notes` — Nota Débito POS automática

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
| `ERROR_500` | Error interno del servicio DIAN (HTTP 500) | — | Probar resiliencia ante caídas del servidor fiscal |
| `ERROR_TIMEOUT` | Timeout de conexión con los servidores DIAN | — | Probar reintentos por tiempo de espera agotado |

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
| `ERROR_ALREADY_PROCESSED` | Documento procesado y aprobado previamente | `90` | Probar retransmisión de facturas aceptadas |
| `ERROR_SOFTWARE_SECURITY` | SoftwareSecurityCode (PIN) no autorizado | `FAB27` | Probar bloqueos de software no autorizado |
| `ERROR_ENVIRONMENT` | El schemeID no coincide con el entorno | `FAD07` | Probar envíos accidentales entre Prod y Test |

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
| Factura Electrónica (Estándar / Salud) | `POST /invoice` | ✅ Los 32 |
| Documento POS Electrónico | `POST /pos` | ✅ Los 32 |
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
| NC POS Auto-increment | `POST /auto-increment/pos-credit-notes` | ✅ Los 32 |
| ND POS Auto-increment | `POST /auto-increment/pos-debit-notes` | ✅ Los 32 |

---

## 📦 Estructuras de Respuesta

### 1. Respuesta Exitosa — `ACCEPTED` (Sin Magic Value)
```json
{
  "success": true,
  "message": "Solicitud procesada por la DIAN.",
  "data": {
    "XmlDocumentKey": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "StatusCode": "00",
    "StatusDescription": "Procesado Correctamente.",
    "IsValid": "true"
  }
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
