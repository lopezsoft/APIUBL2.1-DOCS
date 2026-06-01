# Magic Values â€” MATIAS API Sandbox

El sandbox soporta **32 magic values** que permiten simular diferentes respuestas de la DIAN sin necesidad de endpoints especiales.

## Uso

EnvÃ­a el header `X-Sandbox-Force-Status` en **cualquier** request de generaciÃ³n de documentos:

- `POST /invoice` â€” Factura electrÃ³nica
- `POST /notes/credit` â€” Nota crÃ©dito
- `POST /notes/debit` â€” Nota dÃ©bito
- `POST /ds/document` â€” Documento soporte
- `POST /ds/adjustment-note` â€” Nota de ajuste DS
- `POST /ep/payroll` â€” NÃ³mina electrÃ³nica individual
- `POST /ep/payroll/replace` â€” Reemplazo de nÃ³mina
- `POST /ep/payroll/delete` â€” EliminaciÃ³n de nÃ³mina
- `POST /auto-increment/invoices` â€” Factura auto-incremento
- `POST /auto-increment/credit-notes` â€” NC auto-incremento
- `POST /auto-increment/debit-notes` â€” ND auto-incremento
- `POST /auto-increment/support-documents` â€” DS auto-incremento
- `POST /auto-increment/adjustment-notes` â€” Nota ajuste auto-incremento
- `POST /auto-increment/pos-documents` â€” POS auto-incremento

```bash
# Ejemplo: forzar rechazo en una factura
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/invoice \
  -H "Authorization: Bearer {token}" \
  -H "X-Sandbox-Force-Status: ERROR_REJECTED" \
  -H "Content-Type: application/json" \
  -d @invoice.json

# Ejemplo: forzar error CUDE en POS electrÃ³nico
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

# Ejemplo: forzar CUNE invÃ¡lido en NÃ³mina ElectrÃ³nica
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/ep/payroll \
  -H "Authorization: Bearer {token}" \
  -H "X-Sandbox-Force-Status: ERROR_PAYROLL_CUNE_INVALID" \
  -H "Content-Type: application/json" \
  -d @payroll.json
```

> **Nota:** Si no se envÃ­a el header, el sandbox devuelve `ACCEPTED` (happy path) para todos los tipos de documento.

## Magic Values Disponibles (32)

### Errores Generales / Infraestructura (6)

Aplican a **todos** los tipos de documento.

| Header Value | Comportamiento | CÃ³digo DIAN | Caso de Uso |
|---|---|---|---|
| `ERROR_REJECTED` | Documento rechazado por validaciÃ³n de negocio | B7B01 | Probar manejo de rechazos |
| `ERROR_DUPLICATE` | Documento ya reportado previamente | 89 | Probar idempotencia |
| `ERROR_AUTH` | Error de autenticaciÃ³n del certificado | IFE043 | Probar manejo de errores de auth |
| `ERROR_SCHEMA` | Error de validaciÃ³n XSD del documento | FAD06 | Probar manejo de errores de esquema |
| `ERROR_500` | Error interno del servicio DIAN (HTTP 500) | â€” | Probar resiliencia ante caÃ­das |
| `ERROR_TIMEOUT` | Timeout de conexiÃ³n con DIAN | â€” | Probar manejo de timeouts |

### Errores Factura ElectrÃ³nica (12) â€” Anexo TÃ©cnico 1.9

| Header Value | Comportamiento | CÃ³digo DIAN | Caso de Uso |
|---|---|---|---|
| `ERROR_MATH_ROUNDING` | Error matemÃ¡tico en cÃ¡lculo de impuestos | FAS01A | Probar descuadres decimales o aritmÃ©ticos |
| `ERROR_GROSS_TOTAL` | Inconsistencia en valor bruto de lÃ­neas vs cabecera | FAD04 | Probar sumatorias incorrectas |
| `ERROR_CUFE_MISMATCH` | El CUFE calculado difiere de la validaciÃ³n | FAD12 | Probar cÃ¡lculos criptogrÃ¡ficos fallidos |
| `ERROR_QR_INVALID` | Estructura de cÃ³digo QR invÃ¡lida | FAD13 | Probar fallos en el formato de la URL QR |
| `ERROR_SIGNATURE` | Firma XAdES invÃ¡lida (alterada o polÃ­tica incorrecta) | IFE044 | Probar manipulaciÃ³n de XML post-firma |
| `ERROR_EMAIL_MISMATCH` | Correo del receptor no coincide con el del RUT | FAJ71 | Probar alertas de validaciÃ³n de identidad |
| `ERROR_NIT_INVALID` | NIT del adquirente inexistente o DV incorrecto | DAJ48 | Probar validaciÃ³n de datos maestros |
| `ERROR_RESOLUTION_EXPIRED` | ResoluciÃ³n agotada o con fecha lÃ­mite vencida | FAD09B | Probar control de agotamiento de resoluciones |
| `ERROR_DATE_OUT_OF_RANGE` | Fecha de emisiÃ³n fuera de los dÃ­as permitidos | FAD11 | Probar desfase temporal en la transmisiÃ³n |
| `ERROR_ALREADY_PROCESSED` | Documento procesado y aprobado previamente | 90 | Probar retransmisiÃ³n de facturas aceptadas |
| `ERROR_SOFTWARE_SECURITY` | SoftwareSecurityCode (PIN) no autorizado | FAB27 | Probar bloqueos de software no autorizado |
| `ERROR_ENVIRONMENT` | El schemeID no coincide con el entorno | FAD07 | Probar envÃ­os accidentales entre Prod y Test |

### Errores Notas CrÃ©dito / DÃ©bito (3) â€” Anexo TÃ©cnico 1.9 (NC/ND)

| Header Value | Comportamiento | CÃ³digo DIAN | Caso de Uso |
|---|---|---|---|
| `ERROR_NC_DATE_MISMATCH` | Fecha de generaciÃ³n â‰  fecha de firma | DAD09e | Probar sincronizaciÃ³n fecha-firma en NC/ND |
| `ERROR_NC_PAYMENT_METHOD` | Medio de pago no vÃ¡lido segÃºn catÃ¡logo DIAN | FAN03 | Probar catÃ¡logos de medios de pago |
| `ERROR_REFERENCE_ORPHAN` | Nota crÃ©dito apunta a un CUFE inexistente | CBG04 | Probar trazabilidad en documentos relacionados |

### Errores Documento Soporte ElectrÃ³nico (3) â€” ResoluciÃ³n 000167

| Header Value | Comportamiento | CÃ³digo DIAN | Caso de Uso |
|---|---|---|---|
| `ERROR_DS_VENDOR_ID` | IdentificaciÃ³n del vendedor inconsistente | DSAJ25b | Probar validaciÃ³n tipo documento vendedor |
| `ERROR_DS_TAX_INVALID` | Impuesto no permitido (ej. ReteICA) | DSAY13 | Probar tributos no permitidos en DS |
| `ERROR_DS_LOCATION` | Municipio no corresponde al departamento | DSAK25 | Probar consistencia geogrÃ¡fica DANE |

### Errores Notas de Ajuste Documento Soporte (1) â€” ResoluciÃ³n 000167

| Header Value | Comportamiento | CÃ³digo DIAN | Caso de Uso |
|---|---|---|---|
| `ERROR_DS_NOTE_REF` | Doc. soporte original referenciado no encontrado | DSD04 | Probar trazabilidad de CUDS en notas DS |

### Errores POS / Documento Equivalente ElectrÃ³nico (3) â€” ResoluciÃ³n 000165 V1.0

| Header Value | Comportamiento | CÃ³digo DIAN | Caso de Uso |
|---|---|---|---|
| `ERROR_POS_VENDOR_RUT` | RazÃ³n social del emisor â‰  RUT | FAJ43A | Probar datos maestros del punto de venta |
| `ERROR_POS_CUDE_INVALID` | CUDE invÃ¡lido (SHA-384 no coincide) | DEEAD01 | Probar cÃ¡lculo criptogrÃ¡fico del CUDE |
| `ERROR_POS_RESOLUTION` | ResoluciÃ³n POS no autorizada o vencida | NSBG01 | Probar control de resoluciones POS |

### Errores Notas de Ajuste POS (2) â€” ResoluciÃ³n 000165 V1.0

| Header Value | Comportamiento | CÃ³digo DIAN | Caso de Uso |
|---|---|---|---|
| `ERROR_POS_NOTE_CUDE_REF` | CUDE del POS original no encontrado | DEEAD02 | Probar trazabilidad del CUDE en notas POS |
| `ERROR_POS_NOTE_NABA06` | Literal 195 no informado en nota POS | NABA06 | Probar campos obligatorios en notas POS |

### Errores NÃ³mina ElectrÃ³nica (3) â€” Anexo TÃ©cnico NÃ³mina V1.0

| Header Value | Comportamiento | CÃ³digo DIAN | Caso de Uso |
|---|---|---|---|
| `ERROR_PAYROLL_DEPT` | CÃ³digo de departamento inexistente | NIE014 | Probar validaciones tablas paramÃ©tricas DIAN |
| `ERROR_PAYROLL_CUNE_INVALID` | CUNE de nÃ³mina calculado incorrectamente | NIE024 | Probar cÃ¡lculo criptogrÃ¡fico del CUNE nÃ³mina |
| `ERROR_PAYROLL_PERIOD` | PerÃ­odo de liquidaciÃ³n inconsistente | NIE016 | Probar validaciÃ³n de fechas de liquidaciÃ³n |

### Certificados (2)

| Header Value | Comportamiento | Caso de Uso |
|---|---|---|
| `CERT_EXPIRED` | Fuerza un certificado expirado al firmar | Probar la rama de "certificado expirado" |
| `CERT_NEAR_EXPIRY` | Certificado con validez de +5 dÃ­as | Probar alertas de pre-vencimiento |

## Compatibilidad con Tipos de Documento

Todos los magic values funcionan con **todos** los tipos de documento:

| Tipo de Documento | Endpoint | Magic Values |
|---|---|---|
| Factura electrÃ³nica | `POST /invoice` | âœ… Los 32 |
| Nota crÃ©dito | `POST /notes/credit` | âœ… Los 32 |
| Nota dÃ©bito | `POST /notes/debit` | âœ… Los 32 |
| Documento soporte | `POST /ds/document` | âœ… Los 32 |
| Nota de ajuste DS | `POST /ds/adjustment-note` | âœ… Los 32 |
| NÃ³mina individual | `POST /ep/payroll` | âœ… Los 32 |
| Reemplazo nÃ³mina | `POST /ep/payroll/replace` | âœ… Los 32 |
| EliminaciÃ³n nÃ³mina | `POST /ep/payroll/delete` | âœ… Los 32 |
| Factura auto-increment | `POST /auto-increment/invoices` | âœ… Los 32 |
| NC auto-increment | `POST /auto-increment/credit-notes` | âœ… Los 32 |
| ND auto-increment | `POST /auto-increment/debit-notes` | âœ… Los 32 |
| DS auto-increment | `POST /auto-increment/support-documents` | âœ… Los 32 |
| Ajuste auto-increment | `POST /auto-increment/adjustment-notes` | âœ… Los 32 |
| POS auto-increment | `POST /auto-increment/pos-documents` | âœ… Los 32 |

## Respuesta de Ejemplo â€” ACCEPTED (sin magic value)

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

## Respuesta de Ejemplo â€” ERROR_POS_CUDE_INVALID

```json
{
  "response": {
    "ErrorMessage": {
      "string": ["Regla: DEEAD01, Rechazo: El CÃ³digo Ãšnico de Documento Equivalente (CUDE) calculado no coincide con la validaciÃ³n de la DIAN (SHA-384)."]
    },
    "IsValid": "false",
    "StatusCode": "99",
    "StatusDescription": "ValidaciÃ³n Fallida",
    "StatusMessage": "Regla: DEEAD01, Rechazo: CUDE InvÃ¡lido (SETP990000001)"
  }
}
```

## Respuesta de Ejemplo â€” ERROR_DS_TAX_INVALID

```json
{
  "response": {
    "ErrorMessage": {
      "string": ["Regla: DSAY13, Rechazo: El tributo reportado (ej. ReteICA) no estÃ¡ incluido en la tabla de tributos permitidos para Documento Soporte."]
    },
    "IsValid": "false",
    "StatusCode": "99",
    "StatusDescription": "ValidaciÃ³n Fallida",
    "StatusMessage": "Regla: DSAY13, Rechazo: Impuesto no permitido en Documento Soporte (SETP990000001)"
  }
}
```

## Notas

- Los magic values **solo funcionan** en el entorno sandbox (`sandbox-api.matias-api.com`).
- En producciÃ³n, el header `X-Sandbox-Force-Status` es **ignorado completamente**.
- Los magic values **no contaminan el payload** de la solicitud â€” son un mecanismo de control lateral vÃ­a headers HTTP.
- El mismo magic value produce la **misma estructura de respuesta** independientemente del tipo de documento.
- Los errores especÃ­ficos por tipo (ej. `ERROR_DS_*`, `ERROR_POS_*`, `ERROR_PAYROLL_*`, `ERROR_NC_*`) usan los cÃ³digos de regla exactos de sus respectivos Anexos TÃ©cnicos.
