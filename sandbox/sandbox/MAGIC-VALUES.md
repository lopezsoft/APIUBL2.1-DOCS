# Magic Values - MATIAS API Sandbox

El sandbox soporta **32 magic values** que permiten simular diferentes respuestas de la DIAN sin necesidad de endpoints especiales.

## Uso

Envia el header `X-Sandbox-Force-Status` en **cualquier** request de generacion de documentos:

- `POST /invoice` - Factura electronica
- `POST /notes/credit` - Nota credito
- `POST /notes/debit` - Nota debito
- `POST /ds/document` - Documento soporte (residente y no residente)
- `POST /ds/adjustment-note` - Nota de ajuste DS (residente y no residente)
- `POST /ep/payroll` - Nomina electronica individual
- `POST /ep/payroll/replace` - Reemplazo de nomina
- `POST /ep/payroll/delete` - Eliminacion de nomina
- `POST /auto-increment/invoices` - Factura auto-incremento
- `POST /auto-increment/credit-notes` - NC auto-incremento
- `POST /auto-increment/debit-notes` - ND auto-incremento
- `POST /auto-increment/support-documents` - DS auto-incremento
- `POST /auto-increment/adjustment-notes` - Nota ajuste auto-incremento
- `POST /auto-increment/pos-documents` - POS auto-incremento
- `POST /auto-increment/pos-credit-notes` - Nota Credito POS auto-incremento
- `POST /auto-increment/pos-debit-notes` - Nota Debito POS auto-incremento

```bash
# Ejemplo: forzar rechazo en una factura
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/invoice \
  -H "Authorization: Bearer {token}" \
  -H "X-Sandbox-Force-Status: ERROR_REJECTED" \
  -H "Content-Type: application/json" \
  -d @invoice.json

# Ejemplo: forzar error CUDE en POS electronico
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

# Ejemplo: forzar CUNE invalido en Nomina Electronica
curl -X POST https://sandbox-api.matias-api.com/api/ubl2.1/ep/payroll \
  -H "Authorization: Bearer {token}" \
  -H "X-Sandbox-Force-Status: ERROR_PAYROLL_CUNE_INVALID" \
  -H "Content-Type: application/json" \
  -d @payroll.json
```

> **Nota:** Si no se envia el header, el sandbox devuelve `ACCEPTED` (happy path) para todos los tipos de documento.

## Magic Values Disponibles (32)

### Errores Generales / Infraestructura (6)

Aplican a **todos** los tipos de documento.

| Header Value | Comportamiento | Codigo DIAN | Caso de Uso |
|---|---|---|---|
| `ERROR_REJECTED` | Documento rechazado por validacion de negocio | B7B01 | Probar manejo de rechazos |
| `ERROR_DUPLICATE` | Documento ya reportado previamente | 89 | Probar idempotencia |
| `ERROR_AUTH` | Error de autenticacion del certificado | IFE043 | Probar manejo de errores de auth |
| `ERROR_SCHEMA` | Error de validacion XSD del documento | FAD06 | Probar manejo de errores de esquema |
| `ERROR_500` | Error interno del servicio DIAN (HTTP 500) | -- | Probar resiliencia ante caidas |
| `ERROR_TIMEOUT` | Timeout de conexion con DIAN | -- | Probar manejo de timeouts |

### Errores Factura Electronica (12) - Anexo Tecnico 1.9

| Header Value | Comportamiento | Codigo DIAN | Caso de Uso |
|---|---|---|---|
| `ERROR_MATH_ROUNDING` | Error matematico en calculo de impuestos | FAS01A | Probar descuadres decimales o aritmeticos |
| `ERROR_GROSS_TOTAL` | Inconsistencia en valor bruto de lineas vs cabecera | FAD04 | Probar sumatorias incorrectas |
| `ERROR_CUFE_MISMATCH` | El CUFE calculado difiere de la validacion | FAD12 | Probar calculos criptograficos fallidos |
| `ERROR_QR_INVALID` | Estructura de codigo QR invalida | FAD13 | Probar fallos en el formato de la URL QR |
| `ERROR_SIGNATURE` | Firma XAdES invalida (alterada o politica incorrecta) | IFE044 | Probar manipulacion de XML post-firma |
| `ERROR_EMAIL_MISMATCH` | Correo del receptor no coincide con el del RUT | FAJ71 | Probar alertas de validacion de identidad |
| `ERROR_NIT_INVALID` | NIT del adquirente inexistente o DV incorrecto | DAJ48 | Probar validacion de datos maestros |
| `ERROR_RESOLUTION_EXPIRED` | Resolucion agotada o con fecha limite vencida | FAD09B | Probar control de agotamiento de resoluciones |
| `ERROR_DATE_OUT_OF_RANGE` | Fecha de emision fuera de los dias permitidos | FAD11 | Probar desfase temporal en la transmision |
| `ERROR_ALREADY_PROCESSED` | Documento procesado y aprobado previamente | 90 | Probar retransmision de facturas aceptadas |
| `ERROR_SOFTWARE_SECURITY` | SoftwareSecurityCode (PIN) no autorizado | FAB27 | Probar bloqueos de software no autorizado |
| `ERROR_ENVIRONMENT` | El schemeID no coincide con el entorno | FAD07 | Probar envios accidentales entre Prod y Test |

### Errores Notas Credito / Debito (3) - Anexo Tecnico 1.9 (NC/ND)

| Header Value | Comportamiento | Codigo DIAN | Caso de Uso |
|---|---|---|---|
| `ERROR_NC_DATE_MISMATCH` | Fecha de generacion != fecha de firma | DAD09e | Probar sincronizacion fecha-firma en NC/ND |
| `ERROR_NC_PAYMENT_METHOD` | Medio de pago no valido segun catalogo DIAN | FAN03 | Probar catalogos de medios de pago |
| `ERROR_REFERENCE_ORPHAN` | Nota credito apunta a un CUFE inexistente | CBG04 | Probar trazabilidad en documentos relacionados |

### Errores Documento Soporte Electronico (3) - Resolucion 000167

| Header Value | Comportamiento | Codigo DIAN | Caso de Uso |
|---|---|---|---|
| `ERROR_DS_VENDOR_ID` | Identificacion del vendedor inconsistente | DSAJ25b | Probar validacion tipo documento vendedor |
| `ERROR_DS_TAX_INVALID` | Impuesto no permitido (ej. ReteICA) | DSAY13 | Probar tributos no permitidos en DS |
| `ERROR_DS_LOCATION` | Municipio no corresponde al departamento | DSAK25 | Probar consistencia geografica DANE |

### Errores Notas de Ajuste Documento Soporte (1) - Resolucion 000167

| Header Value | Comportamiento | Codigo DIAN | Caso de Uso |
|---|---|---|---|
| `ERROR_DS_NOTE_REF` | Doc. soporte original referenciado no encontrado | DSD04 | Probar trazabilidad de CUDS en notas DS |

### Errores POS / Documento Equivalente Electronico (3) - Resolucion 000165 V1.0

| Header Value | Comportamiento | Codigo DIAN | Caso de Uso |
|---|---|---|---|
| `ERROR_POS_VENDOR_RUT` | Razon social del emisor != RUT | FAJ43A | Probar datos maestros del punto de venta |
| `ERROR_POS_CUDE_INVALID` | CUDE invalido (SHA-384 no coincide) | DEEAD01 | Probar calculo criptografico del CUDE |
| `ERROR_POS_RESOLUTION` | Resolucion POS no autorizada o vencida | NSBG01 | Probar control de resoluciones POS |

### Errores Notas de Ajuste POS (2) - Resolucion 000165 V1.0

| Header Value | Comportamiento | Codigo DIAN | Caso de Uso |
|---|---|---|---|
| `ERROR_POS_NOTE_CUDE_REF` | CUDE del POS original no encontrado | DEEAD02 | Probar trazabilidad del CUDE en notas POS |
| `ERROR_POS_NOTE_NABA06` | Literal 195 no informado en nota POS | NABA06 | Probar campos obligatorios en notas POS |

### Errores Nomina Electronica (3) - Anexo Tecnico Nomina V1.0

| Header Value | Comportamiento | Codigo DIAN | Caso de Uso |
|---|---|---|---|
| `ERROR_PAYROLL_DEPT` | Codigo de departamento inexistente | NIE014 | Probar validaciones tablas parametricas DIAN |
| `ERROR_PAYROLL_CUNE_INVALID` | CUNE de nomina calculado incorrectamente | NIE024 | Probar calculo criptografico del CUNE nomina |
| `ERROR_PAYROLL_PERIOD` | Periodo de liquidacion inconsistente | NIE016 | Probar validacion de fechas de liquidacion |

### Certificados (2)

| Header Value | Comportamiento | Caso de Uso |
|---|---|---|
| `CERT_EXPIRED` | Fuerza un certificado expirado al firmar | Probar la rama de "certificado expirado" |
| `CERT_NEAR_EXPIRY` | Certificado con validez de +5 dias | Probar alertas de pre-vencimiento |

## Compatibilidad con Tipos de Documento

Todos los magic values funcionan con **todos** los tipos de documento:

| Tipo de Documento | Endpoint | Magic Values |
|---|---|---|
| Factura electronica | `POST /invoice` | Todos (32) |
| Nota credito | `POST /notes/credit` | Todos (32) |
| Nota debito | `POST /notes/debit` | Todos (32) |
| Documento soporte | `POST /ds/document` | Todos (32) |
| Nota de ajuste DS | `POST /ds/adjustment-note` | Todos (32) |
| Nomina individual | `POST /ep/payroll` | Todos (32) |
| Reemplazo nomina | `POST /ep/payroll/replace` | Todos (32) |
| Eliminacion nomina | `POST /ep/payroll/delete` | Todos (32) |
| Factura auto-increment | `POST /auto-increment/invoices` | Todos (32) |
| NC auto-increment | `POST /auto-increment/credit-notes` | Todos (32) |
| ND auto-increment | `POST /auto-increment/debit-notes` | Todos (32) |
| DS auto-increment | `POST /auto-increment/support-documents` | Todos (32) |
| Ajuste auto-increment | `POST /auto-increment/adjustment-notes` | Todos (32) |
| POS auto-increment | `POST /auto-increment/pos-documents` | Todos (32) |
| NC POS auto-increment | `POST /auto-increment/pos-credit-notes` | Todos (32) |
| ND POS auto-increment | `POST /auto-increment/pos-debit-notes` | Todos (32) |

## Respuesta de Ejemplo - ACCEPTED (sin magic value)

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

## Respuesta de Ejemplo - ERROR_POS_CUDE_INVALID

```json
{
  "response": {
    "ErrorMessage": {
      "string": ["Regla: DEEAD01, Rechazo: El Codigo Unico de Documento Equivalente (CUDE) calculado no coincide con la validacion de la DIAN (SHA-384)."]
    },
    "IsValid": "false",
    "StatusCode": "99",
    "StatusDescription": "Validacion Fallida",
    "StatusMessage": "Regla: DEEAD01, Rechazo: CUDE Invalido (SETP990000001)"
  }
}
```

## Respuesta de Ejemplo - ERROR_DS_TAX_INVALID

```json
{
  "response": {
    "ErrorMessage": {
      "string": ["Regla: DSAY13, Rechazo: El tributo reportado (ej. ReteICA) no esta incluido en la tabla de tributos permitidos para Documento Soporte."]
    },
    "IsValid": "false",
    "StatusCode": "99",
    "StatusDescription": "Validacion Fallida",
    "StatusMessage": "Regla: DSAY13, Rechazo: Impuesto no permitido en Documento Soporte (SETP990000001)"
  }
}
```

## Payloads de Ejemplo

Los payloads de ejemplo para cada tipo de documento se encuentran en:

```
docs/sandbox/jsons/
  jsons-billing/        # Facturas, NC, ND y variantes
  jsons-pos/            # POS Electronico, NC POS, ND POS
  jsons-support-document/  # Doc. Soporte, Notas Ajuste (residente y no residente)
  payroll/              # Nomina individual, replace, delete
```

## Notas

- Los magic values **solo funcionan** en el entorno sandbox (`sandbox-api.matias-api.com`).
- En produccion, el header `X-Sandbox-Force-Status` es **ignorado completamente**.
- Los magic values **no contaminan el payload** de la solicitud - son un mecanismo de control lateral via headers HTTP.
- El mismo magic value produce la **misma estructura de respuesta** independientemente del tipo de documento.
- Los errores especificos por tipo (ej. `ERROR_DS_*`, `ERROR_POS_*`, `ERROR_PAYROLL_*`, `ERROR_NC_*`) usan los codigos de regla exactos de sus respectivos Anexos Tecnicos.

## Eventos RADIAN (sin magic values)

Los endpoints de eventos RADIAN (`/events/*`) **no usan magic values**. Las llamadas SOAP se simulan automaticamente con `SandboxResponseFactory`:

| Llamada SOAP | Servicio | Respuesta Sandbox |
|---|---|---|
| `SendEvent` | `EventDeliveryService::send()` | Evento ACCEPTED automaticamente |
| `GetStatusEvents` | `DocumentReceptionService::getEventStatus()` | Status ACCEPTED |
| `GetXmlByDocumentKey` | `XmlExtractDataService::getXml()` | Invoice UBL 2.1 simulado |

Estos guards se activan automaticamente cuando `config('sandbox.enabled')` es `true`, sin necesidad de headers adicionales.

