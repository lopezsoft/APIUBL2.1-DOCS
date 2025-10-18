---
sidebar_position: 3
description: "Validaciones y restricciones para Documentos Soporte"
---

# Documento Soporte - Validaciones Detalladas

## 🎯 Introducción

Esta sección detalla todas las validaciones que realiza DIAN para Documentos Soporte, organizadas por categorías de validación y criterios de aceptación/rechazo.

---

## ✅ Validaciones de Estructura

### **1. Validación XML**

```
COMPONENTE: Formato del documento
VALIDACIÓN: XML bien formado (WFX)
CRITERIO:   Document type declaration presente

ACEPTADO:
<?xml version="1.0" encoding="UTF-8"?>
<DocumentoSoporte>
  ...
</DocumentoSoporte>

RECHAZADO:
<DocumentoSoporte
  ... (sin declaración XML)

RECHAZADO:
<DocumentoSoporte>
  <Emisor>
    <NIT>123</NIT
    ... (sin cierre de etiqueta)
</DocumentoSoporte>

ERROR: Documento mal formado
CÓDIGO: E001 - Invalid XML Structure
```

### **2. Esquema XSD**

```
COMPONENTE: Validación contra esquema
VALIDACIÓN: Cumplimiento con XSD DIAN

VALIDAR:
├─ Todas las etiquetas requeridas presentes
├─ Tipos de datos correctos
├─ Restricciones de longitud
├─ Restricciones de formato
└─ Cardinalidad correcta

RECHAZADO SI:
├─ Falta etiqueta obligatoria
├─ Tipo de dato incorrecto
├─ Longitud excedida
└─ Cardinalidad violada
```

### **3. Namespaces**

```
DEBE INCLUIR:
xmlns="urn:oasis:names:specification:ubl:schema:xsd:DocumentoSoporte-1"
xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2"

VALIDACIÓN: Prefijos correctos en todo el documento
RECHAZO: Namespaces inconsistentes o faltantes
```

---

## 👤 Validaciones del Emisor

### **1. Identificación del Emisor**

```
CAMPO:       NIT o Cédula
OBLIGATORIO: Sí
VALIDACIÓN: 

├─ Formato: xxxxxxxxx-d (9 dígitos + dígito verificador)
├─ Rango:   1 a 999.999.999
├─ Cálculo: Dígito verificador validado
├─ Activo:  Debe estar activo en registros DIAN

ACEPTADO:
  NIT: "123456789-1"     ✓ Formato correcto
  NIT: "555666777-8"     ✓ Formato correcto
  CC:  "98765432-1"      ✓ Para personas naturales

RECHAZADO:
  NIT: "12345678-1"      ✗ Menos dígitos
  NIT: "123456789"       ✗ Sin dígito verificador
  NIT: "abc-1"           ✗ No es número
  NIT: "123456789-0"     ✗ Dígito verificador incorrecto
  NIT: "999999999-9"     ✗ Inactivo/cancelado

ERROR: Invalid Identification
CÓDIGO: E101
```

### **2. Nombre del Emisor**

```
CAMPO:       Nombre o Razón Social
OBLIGATORIO: Sí
VALIDACIÓN:

├─ Longitud: Entre 2 y 200 caracteres
├─ Caracteres: Alfanuméricos, espacios, guiones, puntos
├─ Consistencia: Coincide con registros DIAN
├─ Encoding: UTF-8 válido

ACEPTADO:
  "Electrónica ABC S.A.S."          ✓
  "Jhon Fredy Rodríguez Pérez"      ✓
  "El Sabor Colombiano S.A.S."      ✓
  "2x20 Reparaciones & Servicios"   ✓

RECHAZADO:
  ""                                ✗ Vacío
  "A"                               ✗ Menos de 2 caracteres
  "XYZ" + 200 caracteres            ✗ Excede máximo
  "Empresa <script>alert()</script>" ✗ Caracteres no permitidos

ERROR: Invalid Emitter Name
CÓDIGO: E102
```

### **3. Certificado Digital**

```
CAMPO:       Certificado X.509
OBLIGATORIO: Sí
VALIDACIÓN:

├─ Presente en firma
├─ Formato: PEM o DER válido
├─ Vigencia: Fecha válida (no vencido)
├─ Revocación: No revocado en CRL
├─ Autoridad: Emitido por AC acreditada
├─ Usar: "Firma digital"
├─ Común Name: Coincide con NIT/Cédula emisor

ACEPTADO:
  Certificado:
  - Emisor: Autoridad Certificante Acreditada
  - CN: 123456789-1
  - Valid From: 2024-01-15
  - Valid Until: 2026-01-15 (futuro)
  - Status: No revocado ✓

RECHAZADO:
  - Certificado vencido (2022-12-31)
  - Emitido por autoridad no acreditada
  - Revocado en CRL
  - CN no coincide con NIT
  - Uso no es "Firma"

ERROR: Invalid Digital Certificate
CÓDIGO: E201
```

---

## 💼 Validaciones del Adquirente

### **1. Tipo y Número de Identificación**

```
CAMPO:       TipoIdentificacion + NumeroIdentificacion
OBLIGATORIO: Sí
VALIDACIÓN:

TIPOS VÁLIDOS:
├─ CC: Cédula Colombiana
├─ NIT: Número de Identificación Tributaria
├─ CE: Cédula de Extranjería
├─ PA: Pasaporte
├─ PEP: Permiso Especial de Permanencia
├─ NUIP: Número Único de Identificación Personal
└─ Otros: Per normativa DIAN

VALIDACIÓN POR TIPO:
├─ CC: 8-10 dígitos + verificador (si aplica)
├─ NIT: Formato xxxxxxxxx-d
├─ CE: Formato válido extranjería
├─ PA: Pasaporte formato válido
└─ PEP: Formato PEP válido

ACEPTADO:
  Tipo: CC, Número: 98765432-1         ✓
  Tipo: NIT, Número: 555666777-8       ✓
  Tipo: CE, Número: 1234567890         ✓
  Tipo: NUIP, Número: 12345678900001   ✓

RECHAZADO:
  Tipo: XYZ (no válido)                ✗
  Tipo: CC, Número: "abc"              ✗
  Tipo: NIT, Número: "123"             ✗
  Número vacío                          ✗

ERROR: Invalid Acquirer Identification
CÓDIGO: E301
```

### **2. Nombre del Adquirente**

```
CAMPO:       Nombre del adquirente
OBLIGATORIO: Sí
VALIDACIÓN:

├─ Longitud: Entre 2 y 200 caracteres
├─ Caracteres: Alfanuméricos, espacios, guiones
├─ No vacío
├─ UTF-8 válido

ACEPTADO:
  "Juan Carlos Pérez García"          ✓
  "María Rosa García Sánchez"         ✓
  "Usuario App Taxi Seguro"           ✓
  "Soluciones Digitales Ltda."        ✓

RECHAZADO:
  ""                                  ✗ Vacío
  "A"                                 ✗ Muy corto
  "XXXXXXXX" (200+ caracteres)        ✗ Muy largo
  Caracteres especiales no permitidos  ✗

ERROR: Invalid Acquirer Name
CÓDIGO: E302
```

### **3. Domicilio**

```
CAMPO:       Domicilio del adquirente
OBLIGATORIO: Sí (puede ser "No especificado" para clientes finales)
VALIDACIÓN:

├─ Longitud: Máximo 200 caracteres
├─ Formato: Texto válido
├─ Ciudad: Debe ser válida

ACEPTADO:
  "Carrera 50 #23-45, Medellín"       ✓
  "Calle 123 #45-67"                  ✓
  "No especificado"                   ✓ (clientes finales)

RECHAZADO:
  ""                                  ✗
  Caracteres inválidos                ✗

ERROR: Invalid Address
CÓDIGO: E303
```

---

## 📝 Validaciones de Detalles

### **1. Líneas del Documento**

```
CAMPO:       Detalles/Líneas
OBLIGATORIO: Sí (mínimo 1)
VALIDACIÓN:

├─ Cantidad: Mínimo 1 línea
├─ Máximo: 1000 líneas
├─ Cada línea: Completa y válida
└─ Consecutivo: Secuencial único

ACEPTADO:
  1 línea con todo correcto            ✓
  5 líneas con totales correctos       ✓
  50 líneas bien formadas              ✓

RECHAZADO:
  0 líneas (vacío)                     ✗
  Líneas duplicadas                    ✗
  Línea 1, 2, 4 (falta 3)             ✗
  1001 líneas                          ✗

ERROR: Invalid Lines
CÓDIGO: E401
```

### **2. Descripción**

```
CAMPO:       Descripción de la línea
OBLIGATORIO: Sí
VALIDACIÓN:

├─ Longitud: Entre 5 y 1000 caracteres
├─ Caracteres: Alfanuméricos, espacios, puntuación
├─ No vacía
├─ UTF-8 válido

ACEPTADO:
  "Audífonos inalámbricos marca Sony"           ✓
  "Consultoría técnica - Auditoría IT"          ✓
  "Reparación de lavadora (cambio de motor)"    ✓
  "Servicio de transporte (Viaje Uber)"         ✓

RECHAZADO:
  ""                                            ✗ Vacío
  "ABC"                                         ✗ Menos de 5 caracteres
  Descripción genérica excesivamente corta      ✗

ERROR: Invalid Description
CÓDIGO: E402
```

### **3. Cantidad**

```
CAMPO:       Cantidad
OBLIGATORIO: Sí
VALIDACIÓN:

├─ Tipo: Número decimal positivo
├─ Rango: > 0 y ≤ 999,999.99
├─ Decimales: Máximo 2
├─ Unidad de medida: Válida

ACEPTADO:
  1          ✓
  3.5        ✓
  150.25     ✓
  0.5        ✓
  999999.99  ✓

RECHAZADO:
  0          ✗ No puede ser cero
  -5         ✗ No puede ser negativo
  1000000    ✗ Excede máximo
  1.999      ✗ Más de 2 decimales
  ABC        ✗ No es número
  Vacío      ✗

ERROR: Invalid Quantity
CÓDIGO: E403

UNIDADES VÁLIDAS:
├─ UN: Unidad
├─ KG: Kilogramo
├─ LT: Litro
├─ MTS: Metro
├─ HOR: Hora
├─ DIA: Día
├─ VIJ: Viaje
└─ Otros según UNECE
```

### **4. Valor Unitario**

```
CAMPO:       Valor unitario
OBLIGATORIO: Sí
VALIDACIÓN:

├─ Tipo: Número decimal positivo
├─ Rango: > 0
├─ Decimales: Máximo 2 (normalmente)
├─ Moneda: COP (únicamente)
├─ Coherencia: Razonable con producto

ACEPTADO:
  250000     ✓
  150000.50  ✓
  35000      ✓
  80000      ✓

RECHAZADO:
  0          ✗ Debe ser > 0
  -100000    ✗ Negativo
  0.01       ✗ Muy bajo (posible error)
  999999999  ✗ Muy alto (posible error)

ERROR: Invalid Unit Price
CÓDIGO: E404

CRITERIOS DE COHERENCIA:
├─ Producto simple: $1,000 - $1,000,000
├─ Servicio: $10,000 - $2,000,000
├─ Alimentos: $1,000 - $200,000
├─ Transporte: $5,000 - $100,000
└─ Valores fuera de rango: Aviso (no bloquea)
```

### **5. Cálculo de Línea**

```
VALIDACIÓN: Cantidad × Valor Unitario = Valor Total

FÓRMULA:
Valor_Total = Cantidad × Valor_Unitario

EJEMPLO:
├─ Cantidad: 3
├─ Valor Unitario: $150,000
├─ Esperado: 3 × $150,000 = $450,000
├─ Recibido: $450,000
└─ Resultado: ✓ VÁLIDO

RECHAZADO SI:
├─ Valor_Total ≠ Cantidad × Valor_Unitario
├─ Error de cálculo: $451,000 (esperado $450,000)
└─ Código: E405

TOLERANCIA: 0 (sin tolerancia, exacto)
```

### **6. Descuentos por Línea**

```
CAMPO:       Descuento
OBLIGATORIO: No (opcional)
VALIDACIÓN:

├─ Tipo: Número decimal ≥ 0
├─ Rango: 0 a (Cantidad × Valor Unitario)
├─ Decimales: Máximo 2
├─ Justificación: Si > 10% del total
└─ Cálculo: Actualiza valor_total

FÓRMULA:
Valor_Total_Línea = (Cantidad × Valor_Unitario) - Descuento

ACEPTADO:
  Descuento: 0            ✓ Sin descuento
  Descuento: 10000        ✓ Valor fijo
  Descuento: 50000.50     ✓

RECHAZADO:
  Descuento: -5000        ✗ Negativo
  Descuento: 999999999    ✗ Excede línea

ERROR: Invalid Discount
CÓDIGO: E406
```

---

## 💰 Validaciones de Totales

### **1. Subtotal**

```
FÓRMULA:
Subtotal = Σ(Cantidad × Valor Unitario) - Σ(Descuentos Línea)

VALIDACIÓN:
├─ Sumar todos los (Cantidad × Valor Unitario)
├─ Restar todos los descuentos por línea
├─ Resultado debe coincidir con Subtotal

EJEMPLO (3 líneas):
Línea 1: (1 × $250,000) = $250,000
Línea 2: (3 × $150,000) - $15,000 = $435,000
Línea 3: (1 × $80,000) = $80,000
─────────────────────────────────
Subtotal esperado: $765,000

Subtotal recibido: $765,000
Resultado: ✓ VÁLIDO

ERROR SI: No coinciden
CÓDIGO: E501
```

### **2. Descuentos Globales**

```
CAMPO:       Descuentos globales
OBLIGATORIO: No (opcional)
VALIDACIÓN:

├─ Tipo: Número decimal ≥ 0
├─ Rango: 0 a Subtotal
├─ Aplicación: Sobre subtotal total
├─ Decimales: Máximo 2

FÓRMULA:
Total_Operación = Subtotal - Descuentos_Globales

EJEMPLO:
Subtotal: $765,000
Descuento global: $50,000 (6.53%)
Total: $765,000 - $50,000 = $715,000 ✓

ERROR SI:
├─ Descuento > Subtotal              ✗
├─ Descuento negativo                ✗
└─ Cálculo no coincide               ✗

CÓDIGO: E502
```

### **3. IVA (Validación de NO Inclusión)**

```
VALIDACIÓN CLAVE: Document Soporte NO PUEDE TENER IVA

CAMPO:       IVA
VALOR:       DEBE SER 0
VALIDACIÓN:

├─ IVA presente pero = 0              ✓
├─ IVA no presente                    ✓
├─ IVA con valor > 0                  ✗ RECHAZO

ACEPTADO:
{
  "iva": 0           ✓
}

{
  "iva": null        ✓ (omitido)
}

RECHAZADO:
{
  "iva": 53000       ✗ NO PERMITIDO
  "iva": 1           ✗ INCLUSO $1
}

ERROR: Document Soporte cannot include VAT
CÓDIGO: E503

RAZÓN: Los documentos soporte son para operaciones
de efectivo SIN IVA. Si necesita incluir IVA,
debe usar FACTURA ELECTRÓNICA.
```

### **4. Retención (Validación de NO Inclusión)**

```
VALIDACIÓN CLAVE: NO PUEDE HABER RETENCIÓN

CAMPO:       Retención
VALOR:       DEBE SER 0 o ausente
VALIDACIÓN:

├─ Retención = 0                     ✓
├─ Retención omitida                 ✓
├─ Retención > 0                     ✗ RECHAZO

ACEPTADO:
{
  "retencion": 0     ✓
}

{
  "retencion": null  ✓
}

RECHAZADO:
{
  "retencion": 50000 ✗ NO PERMITIDO
}

ERROR: Document Soporte cannot include withholding
CÓDIGO: E504
```

### **5. Total de Operación**

```
FÓRMULA:
Total = Subtotal - Descuentos_Globales

VALIDACIÓN:
├─ Cálculo correcto
├─ Coherencia con líneas
├─ Total > 0
├─ Total coincide con suma de pagos

RANGO TÍPICO:
├─ Mínimo: $1,000
├─ Máximo: $50,000,000 (sin límite oficial)
├─ Fuera de rango: Aviso (no bloquea)

EJEMPLO:
Subtotal:           $765,000
Descuentos:         -$50,000
─────────────────────────────
Total Operación:    $715,000 ✓

ERROR SI: No coinciden cálculos
CÓDIGO: E505
```

---

## 💳 Validaciones de Medio de Pago

### **1. Tipo de Pago**

```
CAMPO:       Tipo de Pago
OBLIGATORIO: Sí
VALIDACIÓN:

TIPOS VÁLIDOS:
├─ EFECTIVO
├─ TRANSFERENCIA_BANCARIA
├─ TARJETA_CREDITO
├─ TARJETA_DEBITO
├─ CHEQUE
├─ LETRA_DE_CAMBIO
├─ OTROS
└─ MIXTO (combinación de tipos)

ACEPTADO:
  "EFECTIVO"                      ✓
  "TRANSFERENCIA_BANCARIA"        ✓
  "TARJETA_CREDITO"              ✓
  "MIXTO"                         ✓ (múltiples tipos)

RECHAZADO:
  ""                              ✗ Vacío
  "CRIPTOMONEDA"                  ✗ No válido
  "DESCONOCIDO"                   ✗ No válido

ERROR: Invalid Payment Type
CÓDIGO: E601
```

### **2. Monto de Pago**

```
VALIDACIÓN:

├─ Tipo: Número decimal positivo
├─ Rango: > 0
├─ Exactitud: Suma de pagos = Total
├─ Moneda: COP

FÓRMULA (Pago simple):
Monto_Pago = Total_Operación

FÓRMULA (Pago múltiple):
Σ(Monto_Pago_i) = Total_Operación

EJEMPLO - Pago Simple:
Total: $250,000
Monto: $250,000    ✓ Coinciden exactamente

EJEMPLO - Pago Múltiple:
Total: $48,000
Efectivo: $25,000
Tarjeta: $23,000
────────────────
Suma: $48,000      ✓ Coinciden

ERROR SI:
├─ Monto ≠ Total                 ✗ (ej: $47,000)
├─ Suma < Total                  ✗ (falta dinero)
├─ Suma > Total                  ✗ (dinero extra)

ERROR: Invalid Payment Amount
CÓDIGO: E602
```

### **3. Detalles de Referencia**

```
CAMPO:       Detalles / Referencia
OBLIGATORIO: Sí (especialmente para no efectivo)
VALIDACIÓN:

PARA TRANSFERENCIA:
├─ Nombre banco
├─ Número de cuenta
├─ Referencia/Comprobante
└─ Todos presentes

PARA TARJETA:
├─ Últimos 4 dígitos
├─ Tipo (crédito/débito)
├─ Referencia/Transacción
└─ Todos presentes

PARA EFECTIVO:
├─ Simple: "Efectivo al contado"
└─ Válido

ACEPTADO:
{
  "tipo": "TARJETA_CREDITO",
  "monto": 250000,
  "detalles": "Débito automático",
  "ultimosCuatro": "5678"       ✓
}

RECHAZADO:
{
  "tipo": "TRANSFERENCIA_BANCARIA",
  "monto": 450000,
  "detalles": ""                ✗ Vacío
}

ERROR: Incomplete Payment Details
CÓDIGO: E603
```

---

## 📅 Validaciones de Fechas y Horas

### **1. Fecha de Emisión**

```
CAMPO:       Fecha Emisión
OBLIGATORIO: Sí
VALIDACIÓN:

├─ Formato: YYYY-MM-DD (ISO 8601)
├─ Rango: ≤ Hoy (fecha actual o anterior)
├─ Coherencia: ≥ Fecha operación
├─ Vigencia: Últimos 5 años

ACEPTADO:
  "2025-10-17"        ✓ Hoy
  "2025-10-16"        ✓ Ayer
  "2020-10-17"        ✓ Hace 5 años

RECHAZADO:
  "2025-10-18"        ✗ Futuro
  "2099-01-01"        ✗ Muy futuro
  "17-10-2025"        ✗ Formato incorrecto
  "2015-01-01"        ✗ Más de 5 años atrás

ERROR: Invalid Emission Date
CÓDIGO: E701
```

### **2. Fecha de Operación**

```
CAMPO:       Fecha Operación
OBLIGATORIO: Sí
VALIDACIÓN:

├─ Formato: YYYY-MM-DD
├─ Rango: ≤ Fecha emisión
├─ Coherencia: Misma o anterior a emisión
├─ Vigencia: Últimos 5 años

ACEPTADO:
  "2025-10-17"        ✓ Mismo día que emisión
  "2025-10-16"        ✓ Un día antes
  "2025-01-01"        ✓ Meses anteriores

RECHAZADO:
  "2025-10-18"        ✗ Posterior a emisión
  "2099-01-01"        ✗ Futuro

ERROR: Invalid Operation Date
CÓDIGO: E702
```

### **3. Hora de Emisión**

```
CAMPO:       Hora Emisión (opcional)
OBLIGATORIO: No (pero recomendado)
VALIDACIÓN:

├─ Formato: HH:MM:SS (24 horas)
├─ Rango: 00:00:00 a 23:59:59
├─ Coherencia: Dentro de horario válido

ACEPTADO:
  "14:30:00"          ✓
  "08:15:00"          ✓
  "23:59:59"          ✓

RECHAZADO:
  "24:00:00"          ✗ Excede 24 horas
  "14:60:00"          ✗ Minutos inválidos
  "14:30"             ✗ Formato incompleto

ERROR: Invalid Emission Time
CÓDIGO: E703
```

---

## 🔐 Validaciones de Firma Digital

### **1. Firma XML**

```
VALIDACIÓN: Firma XMLDSig presente y válida

COMPONENTE:
├─ Certificado X.509 presente
├─ Algoritmo de firma válido
├─ Hash del documento correcto
├─ Referencia a documento
└─ Timestamp válido

VALIDACIÓN DEL HASH:
├─ Algoritmo: SHA-256
├─ Hash calculado = Hash en firma

ACEPTADO:
Firma válida con:
├─ Certificado vigente ✓
├─ Algoritmo SHA-256 ✓
├─ Hash coincide ✓
└─ Timestamp presente ✓

RECHAZADO:
├─ Firma corrupta
├─ Certificado vencido
├─ Hash no coincide
├─ Timestamp falta

ERROR: Invalid Digital Signature
CÓDIGO: E801
```

### **2. Certificado en Firma**

```
VALIDACIÓN: Certificado X.509 en firma

ELEMENTOS:
├─ Subject: CN = NIT/Cédula emisor
├─ Issuer: Autoridad Certificante
├─ Valid From: Antes de firma
├─ Valid Until: Después de firma
├─ CRL: No revocado
└─ Propósito: Firma digital

VALIDACIÓN ESPECÍFICA:
CN debe ser: EXACTAMENTE igual NIT/Cédula emisor

ACEPTADO:
Subject: CN=123456789-1     Emisor NIT: 123456789-1   ✓

RECHAZADO:
Subject: CN=Carlos López    Emisor NIT: 123456789-1   ✗
(No coinciden identidades)

ERROR: Certificate does not match emitter
CÓDIGO: E802
```

### **3. Revocación de Certificado**

```
VALIDACIÓN: Certificado no revocado

MÉTODO:
├─ Consulta CRL (Certificate Revocation List)
├─ Consulta OCSP (si disponible)
└─ Fecha de firma < Fecha de revocación

ACEPTADO:
├─ Certificado en lista blanca
├─ No aparece en CRL
├─ Vigencia válida
└─ Emitido por AC acreditada

RECHAZADO:
├─ Aparece en CRL
├─ Fue revocado antes de firma
├─ Status = Revocado

ERROR: Revoked Certificate
CÓDIGO: E803
```

---

## 🔄 Validaciones de Coherencia Global

### **1. Consistencia Emisor-Sujeto**

```
VALIDACIÓN: Coherencia total del emisor

├─ NIT/Cédula en encabezado = NIT/Cédula en firma
├─ Nombre en encabezado = Nombre en certificado
├─ Nombre en encabezado ≈ Registros DIAN

ACEPTADO:
Encabezado:
  NIT: 123456789-1
  Nombre: "Electrónica ABC S.A.S."

Firma:
  CN: 123456789-1
  Emisor: Autoridad XYZ

Registros DIAN:
  NIT: 123456789-1
  Razón Social: "Electrónica ABC S.A.S."
  
Resultado: ✓ TODO COINCIDE

RECHAZADO:
Encabezado NIT: 123456789-1
Firma CN: 987654321-9        ← NO COINCIDEN
Resultado: ✗ INCONSISTENCIA

ERROR: Emitter Consistency
CÓDIGO: E901
```

### **2. Integridad del Documento**

```
VALIDACIÓN: Documento no modificado después firma

MÉTODO:
├─ Calcular hash del documento actual
├─ Comparar con hash en firma
├─ Deben coincidir exactamente

ACEPTADO:
Hash calculado:     a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
Hash en firma:      a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
Resultado: ✓ ÍNTEGRO

RECHAZADO:
Hash calculado:     a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
Hash en firma:      b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7
Resultado: ✗ MODIFICADO (posible tampering)

ERROR: Document Integrity Failed
CÓDIGO: E902
```

### **3. Coherencia Temporal**

```
VALIDACIÓN: Fechas consistentes

ORDEN CRONOLÓGICO:
Fecha operación ≤ Fecha emisión ≤ Fecha firma

ACEPTADO:
Operación: 2025-10-15
Emisión:   2025-10-17
Firma:     2025-10-17 14:30:00
Orden: ✓ CORRECTO

RECHAZADO:
Operación: 2025-10-20
Emisión:   2025-10-17        ← Operación después de emisión
Resultado: ✗ INCONSISTENCIA TEMPORAL

ERROR: Temporal Coherence Failed
CÓDIGO: E903
```

---

## 📊 Tabla de Códigos de Error

| Código | Descripción | Tipo | Acción |
|--------|-------------|------|--------|
| E001 | Documento mal formado (XML) | Crítico | Rechazar |
| E101 | Identificación emisor inválida | Crítico | Rechazar |
| E102 | Nombre emisor incorrecto | Crítico | Rechazar |
| E201 | Certificado digital inválido | Crítico | Rechazar |
| E301 | Identificación adquirente inválida | Crítico | Rechazar |
| E302 | Nombre adquirente faltante | Crítico | Rechazar |
| E401 | Sin líneas de detalle | Crítico | Rechazar |
| E402 | Descripción inválida | Crítico | Rechazar |
| E403 | Cantidad inválida | Crítico | Rechazar |
| E404 | Valor unitario inválido | Crítico | Rechazar |
| E405 | Cálculo de línea incorrecto | Crítico | Rechazar |
| E503 | Documento contiene IVA | Crítico | Rechazar |
| E504 | Documento contiene retención | Crítico | Rechazar |
| E601 | Tipo de pago inválido | Crítico | Rechazar |
| E602 | Monto de pago inválido | Crítico | Rechazar |
| E701 | Fecha emisión inválida | Crítico | Rechazar |
| E801 | Firma digital inválida | Crítico | Rechazar |
| E802 | Certificado no coincide | Crítico | Rechazar |
| E803 | Certificado revocado | Crítico | Rechazar |

---

**Última actualización:** Octubre 2025  
**Versión:** 1.1 (Resolución 000160/2024)
