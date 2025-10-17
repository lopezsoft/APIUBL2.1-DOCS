---
sidebar_position: 1
description: "Introducción completa al Documento Soporte para operaciones de efectivo"
---

# Documento Soporte - Introducción Completa

## 🎯 Definición y Alcance

El **Documento Soporte de Operaciones Efectivo** es un documento electrónico autorizado por la DIAN que:

- ✅ Comprueba transacciones con terceros sin obligación de facturar
- ✅ Respalda operaciones de efectivo
- ✅ Válido para comercio electrónico
- ✅ Obligatorio en plataformas de pagos electrónicos

```
DIFERENCIA CON FACTURA:
┌────────────────────┬──────────────┬──────────────┐
│ Aspecto            │ FACTURA      │ DOC SOPORTE  │
├────────────────────┼──────────────┼──────────────┤
│ Quien puede emitir  │ Obligado     │ Cualquiera   │
│ IVA                │ Sí           │ No           │
│ Crédito fiscal     │ Sí           │ No           │
│ Retención         │ Sí           │ No           │
│ Cumplimiento       │ Obligatorio  │ Circunstanc. │
│ Plazo respuesta    │ 30 días      │ 5 días       │
│ Circulación        │ RADIAN       │ No (directo) │
└────────────────────┴──────────────┴──────────────┘
```

---

## 📋 Base Normativa

| Elemento | Descripción |
|----------|------------|
| **Resolución Principal** | Resolución 000160 de 2024 (DIAN) |
| **Versión Vigente** | 1.1 |
| **Aplicabilidad** | 2024-2025 |
| **Casos de Uso** | Efectivo, servicios en línea, compras a no obligados |
| **Firma Digital** | Certificado X.509 (Clase 2 o 3) |
| **Formato** | UBL 2.1 (XML) |

---

## 🎯 Propósitos Principales

### 1. **Respaldar Operaciones Efectivo**
```
Vendedor → Cliente (Efectivo) → Documento Soporte
         Transacción sin factura
         Respaldo tributario
```

### 2. **Comercio Electrónico**
```
Plataforma Online → Cliente → Documento Soporte
Operaciones pequeñas sin iva
Trazabilidad en línea
```

### 3. **Adquisiciones a No Obligados**
```
Empresa → Trabajador/Proveedor no FE → Documento Soporte
Ejemplo: Compra a persona natural sin RUT
```

### 4. **Servicios Puntuales**
```
Profesional → Cliente → Documento Soporte
Consultoría, reparación, servicios puntales
```

---

## 👥 Sujetos Intervinientes

### **Emisor (E)**

```
Quién:  Cualquier persona (natural o jurídica)
Qué:    Emite Documento Soporte
Cuándo: En operación de efectivo
Cómo:   Firma y radica en DIAN
```

**Requisitos:**
- NIT/Cédula válido
- Certificado digital (X.509)
- Sistema de información
- Conectividad DIAN

### **Adquirente/Receptor (R)**

```
Quién:  Cualquier persona que recibe documento
Qué:    Recibe comprobante
Cuándo: Al momento de transacción
Cómo:   Descarga de DIAN o email
```

**Derechos:**
- Solicitar aclaración
- Reportar inconsistencias
- Descargar documento
- Usar para deducción (si aplica)

### **DIAN (Tercero)**

```
Quién:  Dirección de Impuestos y Aduanas Nacionales
Qué:    Valida, radica, almacena
Cuándo: En tiempo real
Cómo:   Sistema de información
```

---

## 📊 Estructura del Documento

```
DOCUMENTO SOPORTE
│
├─ HEADER (Datos generales)
│  ├─ Radicado único (generado DIAN)
│  ├─ Consecutivo (del emisor)
│  ├─ Fecha emisión
│  ├─ Fecha operación
│  └─ Tipo operación
│
├─ EMISOR
│  ├─ NIT
│  ├─ Razón social / Nombre
│  └─ Domicilio
│
├─ ADQUIRENTE
│  ├─ Identificación
│  ├─ Nombre
│  └─ Domicilio
│
├─ DETALLES
│  ├─ Descripción
│  ├─ Cantidad
│  ├─ Valor unitario
│  └─ Valor total (SIN IVA)
│
├─ TOTALES
│  ├─ Subtotal
│  ├─ Descuentos (si aplica)
│  ├─ Total operación
│  └─ SIN IVA
│
├─ MEDIOS DE PAGO
│  ├─ Efectivo
│  ├─ Transferencia
│  ├─ Tarjeta
│  └─ Otro
│
└─ FIRMA DIGITAL
   ├─ Certificado emisor
   ├─ Fecha/hora firma
   ├─ Algoritmo criptográfico
   └─ Hash documento
```

---

## 🔄 Ciclo de Vida

```
GENERACIÓN
│
├─→ RADICACIÓN EN DIAN
│   └─ Validación estructura
│   └─ Validación negocio
│   └─ Asignación radicado
│
├─→ NOTIFICACIÓN
│   └─ Email al adquirente
│   └─ Disponible en DIAN portal
│
├─→ DESCARGA
│   └─ Adquirente descarga
│   └─ Acceso 5 años permanente
│
├─→ SOLICITUD DE ACLARACIÓN (Opcional)
│   └─ Si adquirente tiene dudas
│   └─ Emisor debe responder
│
└─→ CIERRE
    └─ Documento permanente
    └─ No se anula (genera nuevo si error)
    └─ Auditable
```

---

## 📝 Tipos de Operaciones

### **Tipo 1: Venta de Bienes**

```json
{
  "tipoOperacion": "VENTA_BIENES",
  "descripcion": "Venta de artículos físicos",
  "ejemplo": "Tienda vende 5 pantalones por $150,000",
  "medida": "Cantidad × Valor unitario",
  "iva": false,
  "retencion": false
}
```

### **Tipo 2: Prestación de Servicios**

```json
{
  "tipoOperacion": "SERVICIO",
  "descripcion": "Servicios profesionales o técnicos",
  "ejemplo": "Reparación de computador: $200,000",
  "medida": "Valor fijo",
  "iva": false,
  "retencion": false
}
```

### **Tipo 3: Comida/Bebida (Alimentos)**

```json
{
  "tipoOperacion": "ALIMENTOS",
  "descripcion": "Venta de alimentos preparados",
  "ejemplo": "Restaurante: Almuerzo + bebida: $25,000",
  "medida": "Cantidad de platos/bebidas",
  "iva": false,
  "retencion": false
}
```

### **Tipo 4: Transporte**

```json
{
  "tipoOperacion": "TRANSPORTE",
  "descripcion": "Servicios de transporte",
  "ejemplo": "Taxi/Uber: viaje por $15,000",
  "medida": "Viaje único",
  "iva": false,
  "retencion": false
}
```

### **Tipo 5: Hospedaje**

```json
{
  "tipoOperacion": "HOSPEDAJE",
  "descripcion": "Alojamiento en hotel/hostal",
  "ejemplo": "Noche de hotel: $150,000",
  "medida": "Noche × tarifa",
  "iva": false,
  "retencion": false
}
```

---

## 💰 Cálculo de Valores

### **Fórmula Básica**

```
VALOR TOTAL = (Cantidad × Valor Unitario) - Descuentos

CARACTERÍSTICA PRINCIPAL: SIN IVA
├─ No se puede agregar IVA
├─ No se calcula retención
├─ No hay crédito fiscal
└─ Valor es final
```

### **Ejemplo Cálculo**

```
Operación: Venta de 10 libros

Detalles:
├─ Descripción: Libros técnicos (compilación)
├─ Cantidad: 10 unidades
├─ Valor unitario: $50,000
├─ Subtotal: 10 × $50,000 = $500,000

Descuentos (si aplica):
├─ Descuento por volumen: 5% = $25,000
├─ Descuento promoción: 2% = $10,000

CÁLCULO:
└─ Subtotal:              $500,000
   └─ Descuento volumen:  -$25,000
   └─ Descuento promo:    -$10,000
   ═════════════════════════════════
   └─ VALOR TOTAL:        $465,000

NOTAS:
├─ NO hay IVA adicional
├─ Este es el valor final
├─ El cliente paga: $465,000
├─ El vendedor recibe: $465,000
└─ NO hay base imponible
```

---

## ✅ Validaciones Obligatorias

```
┌─────────────────────────────────────────┐
│   VALIDACIONES EN GENERACIÓN             │
├─────────────────────────────────────────┤
│                                         │
│ 1. IDENTIFICACIÓN EMISOR                │
│    ├─ NIT válido y activo               │
│    ├─ Razón social coincide registros   │
│    └─ Habilitación para operar          │
│                                         │
│ 2. FIRMA DIGITAL                        │
│    ├─ Certificado vigente               │
│    ├─ No revocado                       │
│    └─ Emitido por AC acreditada         │
│                                         │
│ 3. ESTRUCTURA DOCUMENTO                 │
│    ├─ Formato XML válido                │
│    ├─ Todas las secciones presentes     │
│    ├─ Tipos de dato correctos           │
│    └─ Validación de cálculos            │
│                                         │
│ 4. VALORES                              │
│    ├─ Cantidad > 0                      │
│    ├─ Valores > 0                       │
│    ├─ Total = Suma de líneas            │
│    └─ Sin IVA ni retención              │
│                                         │
│ 5. ADQUIRENTE                           │
│    ├─ Identificación presente           │
│    ├─ Nombre presente                   │
│    └─ Domicilio válido                  │
│                                         │
│ 6. FECHAS                               │
│    ├─ Fecha emisión = Hoy               │
│    ├─ Fecha operación ≤ Hoy             │
│    └─ Coherencia temporal               │
│                                         │
│ 7. MEDIO DE PAGO                        │
│    ├─ Indicado correctamente            │
│    └─ Coexistencia válida               │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🚫 Restricciones Importantes

```
❌ NO PERMITIDO EN DOCUMENTO SOPORTE:

1. IVA
   └─ No se puede agregar
   └─ Base imponible = 0
   └─ Valor neto obligatorio

2. Retención
   └─ No aplica retención en la fuente
   └─ No hay certificado de retención
   └─ Cliente no tiene descuento tributario

3. Descuentos especiales (Impuestos)
   └─ No hay descuentos por IVA
   └─ No hay crédito fiscal
   └─ Solo descuentos comerciales

4. Servicio de aduana
   └─ No es documento de importación
   └─ No válido para aduanas
   └─ Uso exclusivamente tributario

5. Cambio de moneda
   └─ Siempre COP (Pesos Colombianos)
   └─ No se admite USD o EUR
   └─ Conversión = Responsabilidad emisor

6. Conceptos no permitidos
   └─ No puede ser nota crédito
   └─ No puede ser nota débito
   └─ No es cancelación/devolución
   └─ Es documento de acto (único)
```

---

## 📊 Diferencia: Doc Soporte vs Documento Equivalente

```
┌──────────────────┬─────────────────┬──────────────────┐
│ Criterio         │ DOC. SOPORTE    │ DOC. EQUIVALENTE │
├──────────────────┼─────────────────┼──────────────────┤
│ Emisor           │ Cualquiera      │ No obligado FE    │
│ IVA              │ No              │ Sí (si aplica)    │
│ Retención        │ No              │ Sí (si aplica)    │
│ Crédito fiscal   │ No              │ Sí               │
│ RADIAN           │ No              │ No               │
│ Plazo respuesta  │ 5 días          │ 5 días           │
│ Base normativa   │ Res. 000160     │ Res. 000166      │
│ Uso principal    │ Efectivo        │ Adquisiciones    │
│ Circulación      │ Bilat/Directa   │ No circula       │
└──────────────────┴─────────────────┴──────────────────┘
```

---

## 🔗 Integración con DIAN

```
FLUJO DE INTEGRACIÓN:

Emisor
  ├─ Prepara documento en XML
  ├─ Firma digitalmente
  │
  └─→ Sistema del Emisor
       ├─ Valida estructura local
       ├─ Genera evidencia de envío
       │
       └─→ ENVÍO A DIAN (API/Web Service)
            ├─ Recepción inmediata
            ├─ Validación de estructura
            ├─ Validación de negocio
            │
            └─→ ASIGNACIÓN RADICADO
                 ├─ Radicado único = documento identificado
                 ├─ Persistencia permanente (5+ años)
                 │
                 └─→ NOTIFICACIÓN
                      ├─ Email al adquirente
                      ├─ Disponible en portal DIAN
                      └─ Descargable por receptor
```

---

## 📈 Estadísticas de Uso

```
Características del Documento Soporte:

Volumen:          ~1.2 millones mensuales (estim.)
Promedio valor:   $250,000 - $500,000
Sector mayor uso: Comercio minorista (45%)
                  Servicios (30%)
                  Alimentos (15%)
                  Otros (10%)

Tecnología:
├─ Formato: XML UBL 2.1
├─ Firma: RSA 2048 bits
├─ Hash: SHA-256
└─ Validación: Tiempo real DIAN
```

---

## 🎓 Diferencia con Documento Electrónico Equivalente

```
DOCUMENTO EQUIVALENTE:
└─ Emitido por NO OBLIGADO A FACTURAR
└─ Respalda adquisiciones
└─ Puede incluir IVA y retención
└─ Usado como comprobante tributario
└─ Ejemplo: Recepción de no obligado

DOCUMENTO SOPORTE:
└─ Emitido por CUALQUIERA
└─ Respalda operaciones de efectivo
└─ NO incluye IVA ni retención
└─ Comprobante de operación
└─ Ejemplo: Venta en tienda física
```

---

## 📚 Próximos Temas

1. **Ejemplos Prácticos** → Casos reales de uso
2. **Validaciones Detalladas** → Campos y restricciones
3. **Casos Especiales** → POS, viajes, servicios

**Última actualización:** Octubre 2025  
**Versión:** 1.1 (Resolución 000160/2024)
