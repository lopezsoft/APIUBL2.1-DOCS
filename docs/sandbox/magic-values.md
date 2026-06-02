---
sidebar_position: 2
title: Magic Values
description: 32 valores de simulación para probar diferentes respuestas de la DIAN en el sandbox.
---

# Magic Values — MATIAS API Sandbox

---

:::info Enlaces Oficiales del Sandbox
El entorno de pruebas cuenta con los siguientes puntos de acceso oficiales:
- **API:** **`https://sandbox-api.matias-api.com`** (reemplaza `{{SANDBOX_URL}}` en tus peticiones).
- **Frontend Web:** **`https://sandbox-auth.matias-api.com/`** (portal de administración visual del sandbox).
:::

---

El sandbox soporta **32 magic values** que permiten simular diferentes respuestas de la DIAN sin necesidad de endpoints especiales.

## Uso

Envía el header `X-Sandbox-Force-Status` en **cualquier** request de generación de documentos:

- `POST /invoice` — Factura electrónica
- `POST /notes/credit` — Nota crédito
- `POST /notes/debit` — Nota débito
- `POST /ds/document` — Documento soporte
- `POST /ds/adjustment-note` — Nota de ajuste DS
- `POST /ep/payroll` — Nómina electrónica individual
- `POST /ep/payroll/replace` — Reemplazo de nómina
- `POST /ep/payroll/delete` — Eliminación de nómina
- `POST /auto-increment/invoices` — Factura auto-incremento
- `POST /auto-increment/credit-notes` — NC auto-incremento
- `POST /auto-increment/debit-notes` — ND auto-incremento
- `POST /auto-increment/support-documents` — DS auto-incremento
- `POST /auto-increment/adjustment-notes` — Nota ajuste auto-incremento
- `POST /auto-increment/pos-documents` — POS auto-incremento

```bash
# Ejemplo: forzar rechazo en una factura
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/invoice \
  -H "Authorization: Bearer {token}" \
  -H "X-Sandbox-Force-Status: ERROR_REJECTED" \
  -H "Content-Type: application/json" \
  -d @invoice.json

# Ejemplo: forzar error CUDE en POS electrónico
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/auto-increment/pos-documents \
  -H "Authorization: Bearer {token}" \
  -H "X-Sandbox-Force-Status: ERROR_POS_CUDE_INVALID" \
  -H "Content-Type: application/json" \
  -d @pos.json

# Ejemplo: forzar impuesto no permitido en Documento Soporte
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/ds/document \
  -H "Authorization: Bearer {token}" \
  -H "X-Sandbox-Force-Status: ERROR_DS_TAX_INVALID" \
  -H "Content-Type: application/json" \
  -d @ds.json

# Ejemplo: forzar CUNE inválido en Nómina Electrónica
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/ep/payroll \
  -H "Authorization: Bearer {token}" \
  -H "X-Sandbox-Force-Status: ERROR_PAYROLL_CUNE_INVALID" \
  -H "Content-Type: application/json" \
  -d @payroll.json
```

> **Nota:** Si no se envía el header, el sandbox devuelve `ACCEPTED` (happy path) para todos los tipos de documento.

## Magic Values Disponibles (32)

### Errores Generales / Infraestructura (6)

Aplican a **todos** los tipos de documento.

| Header Value | Comportamiento | Código DIAN | Caso de Uso |
|---|---|---|---|
| `ERROR_REJECTED` | Documento rechazado por validación de negocio | B7B01 | Probar manejo de rechazos |
| `ERROR_DUPLICATE` | Documento ya reportado previamente | 89 | Probar idempotencia |
| `ERROR_AUTH` | Error de autenticación del certificado | IFE043 | Probar manejo de errores de auth |
| `ERROR_SCHEMA` | Error de validación XSD del documento | FAD06 | Probar manejo de errores de esquema |
| `ERROR_500` | Error interno del servicio DIAN (HTTP 500) | — | Probar resiliencia ante caídas |
| `ERROR_TIMEOUT` | Timeout de conexión con DIAN | — | Probar manejo de timeouts |

### Errores Factura Electrónica (12) — Anexo Técnico 1.9

| Header Value | Comportamiento | Código DIAN | Caso de Uso |
|---|---|---|---|
| `ERROR_MATH_ROUNDING` | Error matemático en cálculo de impuestos | FAS01A | Probar descuadres decimales o aritméticos |
| `ERROR_GROSS_TOTAL` | Inconsistencia en valor bruto de líneas vs cabecera | FAD04 | Probar sumatorias incorrectas |
| `ERROR_CUFE_MISMATCH` | El CUFE calculado difiere de la validación | FAD12 | Probar cálculos criptográficos fallidos |
| `ERROR_QR_INVALID` | Estructura de código QR inválida | FAD13 | Probar fallos en el formato de la URL QR |
| `ERROR_SIGNATURE` | Firma XAdES inválida (alterada o política incorrecta) | IFE044 | Probar manipulación de XML post-firma |
| `ERROR_EMAIL_MISMATCH` | Correo del receptor no coincide con el del RUT | FAJ71 | Probar alertas de validación de identidad |
| `ERROR_NIT_INVALID` | NIT del adquirente inexistente o DV incorrecto | DAJ48 | Probar validación de datos maestros |
| `ERROR_RESOLUTION_EXPIRED` | Resolución agotada o con fecha límite vencida | FAD09B | Probar control de agotamiento de resoluciones |
| `ERROR_DATE_OUT_OF_RANGE` | Fecha de emisión fuera de los días permitidos | FAD11 | Probar desfase temporal en la transmisión |
| `ERROR_ALREADY_PROCESSED` | Documento procesado y aprobado previamente | 90 | Probar retransmisión de facturas aceptadas |
| `ERROR_SOFTWARE_SECURITY` | SoftwareSecurityCode (PIN) no autorizado | FAB27 | Probar bloqueos de software no autorizado |
| `ERROR_ENVIRONMENT` | El schemeID no coincide con el entorno | FAD07 | Probar envíos accidentales entre Prod y Test |

### Errores Notas Crédito / Débito (3) — Anexo Técnico 1.9 (NC/ND)

| Header Value | Comportamiento | Código DIAN | Caso de Uso |
|---|---|---|---|
| `ERROR_NC_DATE_MISMATCH` | Fecha de generación â‰  fecha de firma | DAD09e | Probar sincronización fecha-firma en NC/ND |
| `ERROR_NC_PAYMENT_METHOD` | Medio de pago no válido según catálogo DIAN | FAN03 | Probar catálogos de medios de pago |
| `ERROR_REFERENCE_ORPHAN` | Nota crédito apunta a un CUFE inexistente | CBG04 | Probar trazabilidad en documentos relacionados |

### Errores Documento Soporte Electrónico (3) — Resolución 000167

| Header Value | Comportamiento | Código DIAN | Caso de Uso |
|---|---|---|---|
| `ERROR_DS_VENDOR_ID` | Identificación del vendedor inconsistente | DSAJ25b | Probar validación tipo documento vendedor |
| `ERROR_DS_TAX_INVALID` | Impuesto no permitido (ej. ReteICA) | DSAY13 | Probar tributos no permitidos en DS |
| `ERROR_DS_LOCATION` | Municipio no corresponde al departamento | DSAK25 | Probar consistencia geográfica DANE |

### Errores Notas de Ajuste Documento Soporte (1) — Resolución 000167

| Header Value | Comportamiento | Código DIAN | Caso de Uso |
|---|---|---|---|
| `ERROR_DS_NOTE_REF` | Doc. soporte original referenciado no encontrado | DSD04 | Probar trazabilidad de CUDS en notas DS |

### Errores POS / Documento Equivalente Electrónico (3) — Resolución 000165 V1.0

| Header Value | Comportamiento | Código DIAN | Caso de Uso |
|---|---|---|---|
| `ERROR_POS_VENDOR_RUT` | Razón social del emisor â‰  RUT | FAJ43A | Probar datos maestros del punto de venta |
| `ERROR_POS_CUDE_INVALID` | CUDE inválido (SHA-384 no coincide) | DEEAD01 | Probar cálculo criptográfico del CUDE |
| `ERROR_POS_RESOLUTION` | Resolución POS no autorizada o vencida | NSBG01 | Probar control de resoluciones POS |

### Errores Notas de Ajuste POS (2) — Resolución 000165 V1.0

| Header Value | Comportamiento | Código DIAN | Caso de Uso |
|---|---|---|---|
| `ERROR_POS_NOTE_CUDE_REF` | CUDE del POS original no encontrado | DEEAD02 | Probar trazabilidad del CUDE en notas POS |
| `ERROR_POS_NOTE_NABA06` | Literal 195 no informado en nota POS | NABA06 | Probar campos obligatorios en notas POS |

### Errores Nómina Electrónica (3) — Anexo Técnico Nómina V1.0

| Header Value | Comportamiento | Código DIAN | Caso de Uso |
|---|---|---|---|
| `ERROR_PAYROLL_DEPT` | Código de departamento inexistente | NIE014 | Probar validaciones tablas paramétricas DIAN |
| `ERROR_PAYROLL_CUNE_INVALID` | CUNE de nómina calculado incorrectamente | NIE024 | Probar cálculo criptográfico del CUNE nómina |
| `ERROR_PAYROLL_PERIOD` | Período de liquidación inconsistente | NIE016 | Probar validación de fechas de liquidación |

### Certificados (2)

| Header Value | Comportamiento | Caso de Uso |
|---|---|---|
| `CERT_EXPIRED` | Fuerza un certificado expirado al firmar | Probar la rama de "certificado expirado" |
| `CERT_NEAR_EXPIRY` | Certificado con validez de +5 días | Probar alertas de pre-vencimiento |

## Compatibilidad con Tipos de Documento

Todos los magic values funcionan con **todos** los tipos de documento:

| Tipo de Documento | Endpoint | Magic Values |
|---|---|---|
| Factura electrónica | `POST /invoice` | ✅ Los 32 |
| Nota crédito | `POST /notes/credit` | ✅ Los 32 |
| Nota débito | `POST /notes/debit` | ✅ Los 32 |
| Documento soporte | `POST /ds/document` | ✅ Los 32 |
| Nota de ajuste DS | `POST /ds/adjustment-note` | ✅ Los 32 |
| Nómina individual | `POST /ep/payroll` | ✅ Los 32 |
| Reemplazo nómina | `POST /ep/payroll/replace` | ✅ Los 32 |
## Uso

Envía el header `X-Sandbox-Force-Status` en **cualquier** request de generación de documentos:

- `POST /invoice` — Factura electrónica
- `POST /notes/credit` — Nota crédito
- `POST /notes/debit` — Nota débito
- `POST /ds/document` — Documento soporte
- `POST /ds/adjustment-note` — Nota de ajuste DS
- `POST /ep/payroll` — Nómina electrónica individual
- `POST /ep/payroll/replace` — Reemplazo de nómina
- `POST /ep/payroll/delete` — Eliminación de nómina
- `POST /auto-increment/invoices` — Factura auto-incremento
- `POST /auto-increment/credit-notes` — NC auto-incremento
- `POST /auto-increment/debit-notes` — ND auto-incremento
- `POST /auto-increment/support-documents` — DS auto-incremento
- `POST /auto-increment/adjustment-notes` — Nota ajuste auto-incremento
- `POST /auto-increment/pos-documents` — POS auto-incremento

```bash
# Ejemplo: forzar rechazo en una factura
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/invoice \
  -H "Authorization: Bearer {token}" \
  -H "X-Sandbox-Force-Status: ERROR_REJECTED" \
  -H "Content-Type: application/json" \
  -d @invoice.json

# Ejemplo: forzar error CUDE en POS electrónico
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/auto-increment/pos-documents \
  -H "Authorization: Bearer {token}" \
  -H "X-Sandbox-Force-Status: ERROR_POS_CUDE_INVALID" \
  -H "Content-Type: application/json" \
  -d @pos.json

# Ejemplo: forzar impuesto no permitido en Documento Soporte
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/ds/document \
  -H "Authorization: Bearer {token}" \
  -H "X-Sandbox-Force-Status: ERROR_DS_TAX_INVALID" \
  -H "Content-Type: application/json" \
  -d @ds.json

# Ejemplo: forzar CUNE inválido en Nómina Electrónica
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/ep/payroll \
  -H "Authorization: Bearer {token}" \
  -H "X-Sandbox-Force-Status: ERROR_PAYROLL_CUNE_INVALID" \
  -H "Content-Type: application/json" \
  -d @payroll.json
```

> **Nota:** Si no se envía el header, el sandbox devuelve `ACCEPTED` (happy path) para todos los tipos de documento.

## Magic Values Disponibles (32)

### Errores Generales / Infraestructura (6)

Aplican a **todos** los tipos de documento.

| Header Value | Comportamiento | Código DIAN | Caso de Uso |
|---|---|---|---|
| `ERROR_REJECTED` | Documento rechazado por validación de negocio | B7B01 | Probar manejo de rechazos |
| `ERROR_DUPLICATE` | Documento ya reportado previamente | 89 | Probar idempotencia |
| `ERROR_AUTH` | Error de autenticación del certificado | IFE043 | Probar manejo de errores de auth |
| `ERROR_SCHEMA` | Error de validación XSD del documento | FAD06 | Probar manejo de errores de esquema |
| `ERROR_500` | Error interno del servicio DIAN (HTTP 500) | — | Probar resiliencia ante caídas |
| `ERROR_TIMEOUT` | Timeout de conexión con DIAN | — | Probar manejo de timeouts |

### Errores Factura Electrónica (12) — Anexo Técnico 1.9

| Header Value | Comportamiento | Código DIAN | Caso de Uso |
|---|---|---|---|
| `ERROR_MATH_ROUNDING` | Error matemático en cálculo de impuestos | FAS01A | Probar descuadres decimales o aritméticos |
| `ERROR_GROSS_TOTAL` | Inconsistencia en valor bruto de líneas vs cabecera | FAD04 | Probar sumatorias incorrectas |
| `ERROR_CUFE_MISMATCH` | El CUFE calculado difiere de la validación | FAD12 | Probar cálculos criptográficos fallidos |
| `ERROR_QR_INVALID` | Estructura de código QR inválida | FAD13 | Probar fallos en el formato de la URL QR |
| `ERROR_SIGNATURE` | Firma XAdES inválida (alterada o política incorrecta) | IFE044 | Probar manipulación de XML post-firma |
| `ERROR_EMAIL_MISMATCH` | Correo del receptor no coincide con el del RUT | FAJ71 | Probar alertas de validación de identidad |
| `ERROR_NIT_INVALID` | NIT del adquirente inexistente o DV incorrecto | DAJ48 | Probar validación de datos maestros |
| `ERROR_RESOLUTION_EXPIRED` | Resolución agotada o con fecha límite vencida | FAD09B | Probar control de agotamiento de resoluciones |
| `ERROR_DATE_OUT_OF_RANGE` | Fecha de emisión fuera de los días permitidos | FAD11 | Probar desfase temporal en la transmisión |
| `ERROR_ALREADY_PROCESSED` | Documento procesado y aprobado previamente | 90 | Probar retransmisión de facturas aceptadas |
| `ERROR_SOFTWARE_SECURITY` | SoftwareSecurityCode (PIN) no autorizado | FAB27 | Probar bloqueos de software no autorizado |
| `ERROR_ENVIRONMENT` | El schemeID no coincide con el entorno | FAD07 | Probar envíos accidentales entre Prod y Test |

### Errores Notas Crédito / Débito (3) — Anexo Técnico 1.9 (NC/ND)

| Header Value | Comportamiento | Código DIAN | Caso de Uso |
|---|---|---|---|
| `ERROR_NC_DATE_MISMATCH` | Fecha de generación â‰  fecha de firma | DAD09e | Probar sincronización fecha-firma en NC/ND |
| `ERROR_NC_PAYMENT_METHOD` | Medio de pago no válido según catálogo DIAN | FAN03 | Probar catálogos de medios de pago |
| `ERROR_REFERENCE_ORPHAN` | Nota crédito apunta a un CUFE inexistente | CBG04 | Probar trazabilidad en documentos relacionados |

### Errores Documento Soporte Electrónico (3) — Resolución 000167

| Header Value | Comportamiento | Código DIAN | Caso de Uso |
|---|---|---|---|
| `ERROR_DS_VENDOR_ID` | Identificación del vendedor inconsistente | DSAJ25b | Probar validación tipo documento vendedor |
| `ERROR_DS_TAX_INVALID` | Impuesto no permitido (ej. ReteICA) | DSAY13 | Probar tributos no permitidos en DS |
| `ERROR_DS_LOCATION` | Municipio no corresponde al departamento | DSAK25 | Probar consistencia geográfica DANE |

### Errores Notas de Ajuste Documento Soporte (1) — Resolución 000167

| Header Value | Comportamiento | Código DIAN | Caso de Uso |
|---|---|---|---|
| `ERROR_DS_NOTE_REF` | Doc. soporte original referenciado no encontrado | DSD04 | Probar trazabilidad de CUDS en notas DS |

### Errores POS / Documento Equivalente Electrónico (3) — Resolución 000165 V1.0

| Header Value | Comportamiento | Código DIAN | Caso de Uso |
|---|---|---|---|
| `ERROR_POS_VENDOR_RUT` | Razón social del emisor â‰  RUT | FAJ43A | Probar datos maestros del punto de venta |
| `ERROR_POS_CUDE_INVALID` | CUDE inválido (SHA-384 no coincide) | DEEAD01 | Probar cálculo criptográfico del CUDE |
| `ERROR_POS_RESOLUTION` | Resolución POS no autorizada o vencida | NSBG01 | Probar control de resoluciones POS |

### Errores Notas de Ajuste POS (2) — Resolución 000165 V1.0

| Header Value | Comportamiento | Código DIAN | Caso de Uso |
|---|---|---|---|
| `ERROR_POS_NOTE_CUDE_REF` | CUDE del POS original no encontrado | DEEAD02 | Probar trazabilidad del CUDE en notas POS |
| `ERROR_POS_NOTE_NABA06` | Literal 195 no informado en nota POS | NABA06 | Probar campos obligatorios en notas POS |

### Errores Nómina Electrónica (3) — Anexo Técnico Nómina V1.0

| Header Value | Comportamiento | Código DIAN | Caso de Uso |
|---|---|---|---|
| `ERROR_PAYROLL_DEPT` | Código de departamento inexistente | NIE014 | Probar validaciones tablas paramétricas DIAN |
| `ERROR_PAYROLL_CUNE_INVALID` | CUNE de nómina calculado incorrectamente | NIE024 | Probar cálculo criptográfico del CUNE nómina |
| `ERROR_PAYROLL_PERIOD` | Período de liquidación inconsistente | NIE016 | Probar validación de fechas de liquidación |

### Certificados (2)

| Header Value | Comportamiento | Caso de Uso |
|---|---|---|
| `CERT_EXPIRED` | Fuerza un certificado expirado al firmar | Probar la rama de "certificado expirado" |
| `CERT_NEAR_EXPIRY` | Certificado con validez de +5 días | Probar alertas de pre-vencimiento |

## Compatibilidad con Tipos de Documento

Todos los magic values funcionan con **todos** los tipos de documento:

| Tipo de Documento | Endpoint | Magic Values |
|---|---|---|
| Factura electrónica | `POST /invoice` | ✅ Los 32 |
| Nota crédito | `POST /notes/credit` | ✅ Los 32 |
| Nota débito | `POST /notes/debit` | ✅ Los 32 |
| Documento soporte | `POST /ds/document` | ✅ Los 32 |
| Nota de ajuste DS | `POST /ds/adjustment-note` | ✅ Los 32 |
| Nómina individual | `POST /ep/payroll` | ✅ Los 32 |
| Reemplazo nómina | `POST /ep/payroll/replace` | ✅ Los 32 |
| Eliminación nómina | `POST /ep/payroll/delete` | ✅ Los 32 |
| Factura auto-increment | `POST /auto-increment/invoices` | ✅ Los 32 |
| NC auto-increment | `POST /auto-increment/credit-notes` | ✅ Los 32 |
| ND auto-increment | `POST /auto-increment/debit-notes` | ✅ Los 32 |
| DS auto-increment | `POST /auto-increment/support-documents` | ✅ Los 32 |
| Ajuste auto-increment | `POST /auto-increment/adjustment-notes` | ✅ Los 32 |
| POS auto-increment | `POST /auto-increment/pos-documents` | ✅ Los 32 |
| NC POS auto-increment | `POST /auto-increment/pos-credit-notes` | ✅ Los 32 |
| ND POS auto-increment | `POST /auto-increment/pos-debit-notes` | ✅ Los 32 |

## Respuesta de Ejemplo — ACCEPTED (sin magic value)

```json
{
  "success": true,
  "message": "Solicitud procesada por la DIAN.",
  "data": {
    "XmlDocumentKey": "a1b2c3d4-...",
    "StatusCode": "00",
    "StatusDescription": "Procesado Correctamente.",
    "IsValid": "true"
  }
}
```

## Respuesta de Ejemplo — ERROR_POS_CUDE_INVALID

```json
{
  "response": {
    "ErrorMessage": {
      "string": ["Regla: DEEAD01, Rechazo: El Código Único de Documento Equivalente (CUDE) calculado no coincide con la validación de la DIAN (SHA-384)."]
    },
    "IsValid": "false",
    "StatusCode": "99",
    "StatusDescription": "Validación Fallida",
    "StatusMessage": "Regla: DEEAD01, Rechazo: CUDE Inválido (SETP990000001)"
  }
}
```

## Respuesta de Ejemplo — ERROR_DS_TAX_INVALID

```json
{
  "response": {
    "ErrorMessage": {
      "string": ["Regla: DSAY13, Rechazo: El tributo reportado (ej. ReteICA) no está incluido en la tabla de tributos permitidos para Documento Soporte."]
    },
    "IsValid": "false",
    "StatusCode": "99",
    "StatusDescription": "Validación Fallida",
    "StatusMessage": "Regla: DSAY13, Rechazo: Impuesto no permitido en Documento Soporte (SETP990000001)"
  }
}
```

## Payloads de Ejemplo

Los payloads de ejemplo para cada tipo de documento se encuentran en:

```text
docs/sandbox/jsons/
  jsons-billing/        # Facturas, NC, ND y variantes
  jsons-pos/            # POS Electrónico, NC POS, ND POS
  jsons-support-document/  # Doc. Soporte, Notas Ajuste (residente y no residente)
  payroll/              # Nómina individual, replace, delete
```

## Notas

- Los magic values **solo funcionan** en el entorno sandbox (`sandbox-api.matias-api.com`).
- En producción, el header `X-Sandbox-Force-Status` es **ignorado completamente**.
- Los magic values **no contaminan el payload** de la solicitud — son un mecanismo de control lateral vía headers HTTP.
- El mismo magic value produce la **misma estructura de respuesta** independientemente del tipo de documento.
- Los errores específicos por tipo (ej. `ERROR_DS_*`, `ERROR_POS_*`, `ERROR_PAYROLL_*`, `ERROR_NC_*`) usan los códigos de regla exactos de sus respectivos Anexos Técnicos.
