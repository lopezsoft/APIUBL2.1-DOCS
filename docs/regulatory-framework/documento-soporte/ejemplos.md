---
sidebar_position: 2
description: "Ejemplos prácticos de Documentos Soporte con casos reales"
---

# Documento Soporte - Ejemplos Prácticos

## 🎯 Introducción

Esta sección presenta 5 casos reales de Documento Soporte con estructura completa, validaciones y análisis de cada situación.

---

## 📝 Caso 1: Venta en Tienda Física

### Contexto

```
Tienda:      Electrónica ABC S.A.S.
Cliente:     Cliente final (Persona natural)
Operación:   Compra de audífonos
Fecha:       2025-10-17
Medio:       Efectivo
```

### Documento Completo

```json
{
  "tipoDocumento": "DOCUMENTO_SOPORTE",
  "radicado": "DS20251017000001",
  "consecutivo": "DS-001-2025",
  "fechaEmision": "2025-10-17",
  "fechaOperacion": "2025-10-17",
  "horaEmision": "14:30:00",
  
  "emisor": {
    "nit": "123456789-1",
    "nombre": "Electrónica ABC S.A.S.",
    "razonSocial": "Electrónica ABC S.A.S.",
    "domicilio": "Carrera 50 #23-45, Medellín, Colombia",
    "ciudad": "Medellín",
    "departamento": "Antioquia",
    "pais": "CO"
  },
  
  "adquirente": {
    "tipoIdentificacion": "CC",
    "numeroIdentificacion": "98765432-1",
    "nombre": "Juan Carlos Pérez García",
    "domicilio": "Calle 123 #45-67",
    "ciudad": "Medellín"
  },
  
  "detalles": [
    {
      "numero": 1,
      "descripcion": "Audífonos inalámbricos marca Sony",
      "cantidad": 1,
      "unidadMedida": "UN",
      "valorUnitario": 250000,
      "descuentoLinea": 0,
      "valorTotal": 250000
    }
  ],
  
  "totales": {
    "subtotal": 250000,
    "descuentosGlobales": 0,
    "totalOperacion": 250000,
    "iva": 0,
    "retencion": 0
  },
  
  "medioPago": {
    "tipo": "EFECTIVO",
    "monto": 250000,
    "detalles": "Efectivo al contado"
  },
  
  "conceptoAdicional": "Comprobante de transacción de efectivo - Venta de bienes",
  "observaciones": "Producto con garantía de 12 meses",
  
  "firma": {
    "certificadoDigital": "CN=Electrónica ABC S.A.S., O=Empresa, C=CO",
    "fechaFirma": "2025-10-17T14:30:00-05:00",
    "algoritmoFirma": "RSA-SHA256",
    "hashDocumento": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
  }
}
```

### Validación y Análisis

```
✅ VALIDACIONES EXITOSAS:

1. Emisor válido
   ├─ NIT: 123456789-1 ✓
   ├─ Nombre coincide registros ✓
   └─ Habilitado para operar ✓

2. Firma digital
   ├─ Certificado vigente ✓
   ├─ No revocado ✓
   └─ RSA-2048 válido ✓

3. Estructura
   ├─ XML bien formado ✓
   ├─ Todas las secciones presentes ✓
   └─ Tipos de dato correctos ✓

4. Valores
   ├─ Cantidad = 1 ✓
   ├─ Valor unitario = $250,000 ✓
   ├─ Total = $250,000 ✓
   └─ Sin IVA ✓

5. Adquirente
   ├─ Identificación presente ✓
   ├─ Cédula válida ✓
   └─ Nombre presente ✓

ESTADO: ✅ VALIDADO - LISTO PARA RADICACIÓN
```

---

## 📝 Caso 2: Servicio Profesional

### Contexto

```
Profesional:  Ingeniero de sistemas (Trabajador independiente)
Cliente:      Pequeña empresa
Operación:    Consultoría técnica (3 horas)
Fecha:        2025-10-17
Medio:        Transferencia bancaria
```

### Documento Completo

```json
{
  "tipoDocumento": "DOCUMENTO_SOPORTE",
  "radicado": "DS20251017000002",
  "consecutivo": "DS-002-2025",
  "fechaEmision": "2025-10-17",
  "fechaOperacion": "2025-10-17",
  "horaEmision": "15:45:00",
  
  "emisor": {
    "nit": "987654321-2",
    "nombre": "Carlos Alberto López Martínez",
    "domicilio": "Apartado 234, Bogotá, Colombia",
    "ciudad": "Bogotá",
    "departamento": "Cundinamarca",
    "pais": "CO"
  },
  
  "adquirente": {
    "tipoIdentificacion": "NIT",
    "numeroIdentificacion": "555666777-8",
    "nombre": "Soluciones Digitales Ltda.",
    "domicilio": "Calle 50 #23-45, Bogotá",
    "ciudad": "Bogotá"
  },
  
  "detalles": [
    {
      "numero": 1,
      "descripcion": "Consultoría técnica - Auditoría de seguridad infraestructura IT",
      "cantidad": 3,
      "unidadMedida": "HOR",
      "valorUnitario": 150000,
      "descuentoLinea": 0,
      "valorTotal": 450000
    }
  ],
  
  "totales": {
    "subtotal": 450000,
    "descuentosGlobales": 0,
    "totalOperacion": 450000,
    "iva": 0,
    "retencion": 0
  },
  
  "medioPago": {
    "tipo": "TRANSFERENCIA_BANCARIA",
    "monto": 450000,
    "detalles": "Transferencia a cuenta corriente Banco X",
    "referencia": "Consultoría octubre 2025"
  },
  
  "conceptoAdicional": "Servicio profesional de consultoría independiente",
  "observaciones": "Informe técnico entregado en email separado",
  
  "firma": {
    "certificadoDigital": "CN=Carlos Alberto López Martínez, O=Independiente, C=CO",
    "fechaFirma": "2025-10-17T15:45:00-05:00",
    "algoritmoFirma": "RSA-SHA256",
    "hashDocumento": "b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7"
  }
}
```

### Análisis

```
CARACTERÍSTICAS:

✓ Emisor es persona natural (trabajador independiente)
✓ Cantidad = 3 horas × $150,000 = $450,000
✓ Medio de pago es transferencia (válido)
✓ Sin IVA (NO obligado a facturar)
✓ Sin retención
✓ Comprobante de servicio profesional

DEDUCIBILIDAD:
├─ Documento válido como comprobante
├─ Cliente puede usar para deducciones operacionales
├─ NO genera crédito fiscal (sin IVA)
└─ Documentación suficiente para auditoría
```

---

## 📝 Caso 3: Operación de Alimentos (Restaurante)

### Contexto

```
Restaurante:  El Sabor Colombiano
Cliente:      Cliente final
Operación:    Almuerzo + bebidas
Fecha:        2025-10-17
Hora:         12:30
Medio:        Efectivo + Tarjeta
```

### Documento Completo

```json
{
  "tipoDocumento": "DOCUMENTO_SOPORTE",
  "radicado": "DS20251017000003",
  "consecutivo": "DSR-0001-2025",
  "fechaEmision": "2025-10-17",
  "fechaOperacion": "2025-10-17",
  "horaEmision": "12:35:00",
  
  "emisor": {
    "nit": "444555666-7",
    "nombre": "El Sabor Colombiano S.A.S.",
    "razonSocial": "El Sabor Colombiano S.A.S.",
    "domicilio": "Calle 45 #12-34, Cali, Colombia",
    "ciudad": "Cali",
    "departamento": "Valle",
    "pais": "CO"
  },
  
  "adquirente": {
    "tipoIdentificacion": "CC",
    "numeroIdentificacion": "12345678-9",
    "nombre": "Cliente Final",
    "domicilio": "No especificado",
    "ciudad": "Cali"
  },
  
  "detalles": [
    {
      "numero": 1,
      "descripcion": "Bandeja Paisa (1 plato)",
      "cantidad": 1,
      "unidadMedida": "UN",
      "valorUnitario": 35000,
      "descuentoLinea": 0,
      "valorTotal": 35000
    },
    {
      "numero": 2,
      "descripcion": "Bebida gaseosa (1 vaso)",
      "cantidad": 1,
      "unidadMedida": "UN",
      "valorUnitario": 5000,
      "descuentoLinea": 0,
      "valorTotal": 5000
    },
    {
      "numero": 3,
      "descripcion": "Postre - Flan casero",
      "cantidad": 1,
      "unidadMedida": "UN",
      "valorUnitario": 8000,
      "descuentoLinea": 0,
      "valorTotal": 8000
    }
  ],
  
  "totales": {
    "subtotal": 48000,
    "descuentosGlobales": 0,
    "totalOperacion": 48000,
    "iva": 0,
    "retencion": 0
  },
  
  "medioPago": {
    "tipo": "MIXTO",
    "composicion": [
      {
        "tipo": "EFECTIVO",
        "monto": 25000
      },
      {
        "tipo": "TARJETA_CREDITO",
        "monto": 23000,
        "ultimosCuatro": "5678"
      }
    ],
    "totalPago": 48000
  },
  
  "conceptoAdicional": "Comprobante de venta de alimentos preparados",
  "observaciones": "Servicio al mesón",
  
  "firma": {
    "certificadoDigital": "CN=El Sabor Colombiano S.A.S., O=Restaurante, C=CO",
    "fechaFirma": "2025-10-17T12:35:00-05:00",
    "algoritmoFirma": "RSA-SHA256",
    "hashDocumento": "c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8"
  }
}
```

### Análisis

```
CARACTERÍSTICAS ESPECIALES:

✓ Venta de alimentos preparados
✓ Múltiples líneas (plato + bebida + postre)
✓ Método de pago mixto (efectivo + tarjeta)
✓ Cliente final (sin razón social)
✓ Operación rápida (al contado)

TOTALIZACIONES:
├─ Plato principal: $35,000
├─ Bebida: $5,000
├─ Postre: $8,000
├─ SUBTOTAL: $48,000
├─ SIN IVA ← Característica clave
└─ TOTAL PAGO: $48,000

OBSERVACIÓN IMPORTANTE:
Aunque sea alimentos (normalmente sujeto a IVA),
en este caso SIN IVA porque es comprobante
de operación de efectivo, no factura.
```

---

## 📝 Caso 4: Servicio de Transporte

### Contexto

```
Plataforma:   Taxi App Seguro
Conductor:    Jhon Fredy Rodríguez
Pasajero:     Cliente app
Operación:    Viaje desde norte a sur
Fecha:        2025-10-17
Medio:        Tarjeta débito (app)
```

### Documento Completo

```json
{
  "tipoDocumento": "DOCUMENTO_SOPORTE",
  "radicado": "DS20251017000004",
  "consecutivo": "DSTX-0001-2025",
  "fechaEmision": "2025-10-17",
  "fechaOperacion": "2025-10-17",
  "horaEmision": "08:15:00",
  
  "emisor": {
    "nit": "777888999-0",
    "nombre": "Jhon Fredy Rodríguez Pérez",
    "domicilio": "Avenida 123 #45-67, Bogotá",
    "ciudad": "Bogotá"
  },
  
  "adquirente": {
    "tipoIdentificacion": "CC",
    "numeroIdentificacion": "55566677788",
    "nombre": "Usuario App Taxi Seguro",
    "domicilio": "Bogotá, Colombia"
  },
  
  "detalles": [
    {
      "numero": 1,
      "descripcion": "Servicio de transporte - Viaje de pasajero (Plataforma Taxi Seguro)",
      "cantidad": 1,
      "unidadMedida": "VIJ",
      "valorUnitario": 18500,
      "descuentoLinea": 0,
      "valorTotal": 18500
    }
  ],
  
  "totales": {
    "subtotal": 18500,
    "descuentosGlobales": 0,
    "totalOperacion": 18500,
    "iva": 0,
    "retencion": 0
  },
  
  "medioPago": {
    "tipo": "TARJETA_DEBITO",
    "monto": 18500,
    "detalles": "Débito automático en plataforma app",
    "referenciaTransaccion": "TX-20251017-001234"
  },
  
  "conceptoAdicional": "Comprobante de transporte de pasajeros",
  "observaciones": "Servicio solicitado y completado vía aplicación móvil",
  
  "coordenadas": {
    "origen": {
      "latitud": 4.7169,
      "longitud": -74.0704
    },
    "destino": {
      "latitud": 4.5571,
      "longitud": -74.0995
    }
  },
  
  "firma": {
    "certificadoDigital": "CN=Jhon Fredy Rodríguez Pérez, O=Conductor Independiente, C=CO",
    "fechaFirma": "2025-10-17T08:15:00-05:00",
    "algoritmoFirma": "RSA-SHA256",
    "hashDocumento": "d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9"
  }
}
```

### Análisis

```
CARACTERÍSTICAS:

✓ Operación digital (app)
✓ Conductor persona natural
✓ Pasajero identificado por app
✓ Coordenadas geográficas registradas
✓ Pago automático sin efectivo
✓ Trazabilidad completa

DETALLES ESPECIALES:
├─ Único viaje = 1 operación
├─ Valor fijo por plataforma: $18,500
├─ Débito instantáneo
├─ Comprobante enviado automáticamente
└─ Sin IVA adicional

CUMPLIMIENTO:
├─ Documento válido para conductor
├─ Comprobante para pasajero
├─ Auditable por DIAN
└─ Registro permanente
```

---

## 📝 Caso 5: Documento Soporte Modificado (Corrección)

### Situación

```
Problema: Se emitió documento incorrecto
Causa:    Error en cantidad
Solución: Emitir nuevo documento
```

### Documento Original (INCORRECTO)

```json
{
  "consecutivo": "DS-005-2025",
  "descripcion": "Reparación de lavadora",
  "cantidad": 3,  ← ERROR: Debería ser 1
  "valorUnitario": 80000,
  "valorTotal": 240000  ← ERROR
}
```

### Documento Nuevo (CORRECCIÓN)

```json
{
  "tipoDocumento": "DOCUMENTO_SOPORTE",
  "radicado": "DS20251017000005",
  "consecutivo": "DS-005-CORR-2025",  ← Nuevo consecutivo
  "fechaEmision": "2025-10-17",
  "fechaOperacion": "2025-10-17",
  "horaEmision": "16:30:00",
  
  "emisor": {
    "nit": "111222333-4",
    "nombre": "Reparaciones Técnicas ABC",
    "domicilio": "Carrera 50 #23-45"
  },
  
  "adquirente": {
    "tipoIdentificacion": "CC",
    "numeroIdentificacion": "10111213141",
    "nombre": "María Rosa García Sánchez"
  },
  
  "detalles": [
    {
      "numero": 1,
      "descripcion": "Reparación de lavadora automática (cambio de motor)",
      "cantidad": 1,  ← CORREGIDO
      "unidadMedida": "UN",
      "valorUnitario": 80000,
      "descuentoLinea": 0,
      "valorTotal": 80000  ← CORREGIDO
    }
  ],
  
  "totales": {
    "subtotal": 80000,
    "descuentosGlobales": 0,
    "totalOperacion": 80000,
    "iva": 0,
    "retencion": 0
  },
  
  "observaciones": "Corrección del documento DS-005-2025 (error en cantidad). Original rechazado.",
  "documentoReferenciado": "DS-005-2025",
  
  "firma": {
    "certificadoDigital": "CN=Reparaciones Técnicas ABC, O=Empresa, C=CO",
    "fechaFirma": "2025-10-17T16:30:00-05:00",
    "algoritmoFirma": "RSA-SHA256",
    "hashDocumento": "e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0"
  }
}
```

### Procedimiento de Corrección

```
PASO 1: Identificar error
   └─ Cantidad incorrecta (3 vs 1)

PASO 2: NO anular anterior
   └─ Doc Soporte no se anula
   └─ Se registra como rechazado

PASO 3: Emitir nuevo con identificación
   └─ Nuevo consecutivo: DS-005-CORR-2025
   └─ Referencia: al documento anterior
   └─ Observación: Detalla error

PASO 4: Cliente usa documento nuevo
   └─ Descarta anterior
   └─ Usa la corrección
   └─ DIAN tiene historial

RESULTADO:
├─ Documento original: Rechazado
├─ Documento corrección: Válido
├─ Auditoría: Completa
└─ Cliente: Satisfecho con comprobante correcto
```

---

## 📊 Comparativa de Casos

| Caso | Tipo | Monto | Medio | Emisor | Estado |
|------|------|-------|-------|--------|--------|
| 1 | Bienes | $250,000 | Efectivo | Empresa | ✅ Válido |
| 2 | Servicio | $450,000 | Transferencia | Independiente | ✅ Válido |
| 3 | Alimentos | $48,000 | Mixto | Empresa | ✅ Válido |
| 4 | Transporte | $18,500 | Tarjeta app | Independiente | ✅ Válido |
| 5 | Reparación | $80,000 | Efectivo | Empresa | ✅ Corrección |

---

## ✅ Checklist para Validación

```
Antes de radicación, verificar:

□ Emisor existe y está habilitado
□ NIT/Cédula válidos
□ Certificado digital vigente
□ Documento bien formado (XML)
□ Firma digital válida
□ Adquirente identificado
□ Valores > 0
□ Total = suma de líneas
□ Sin IVA
□ Sin retención
□ Fecha coherente
□ Descripción clara
□ Medio de pago indicado
□ Observaciones si aplican
□ Hash del documento correcto

Si TODOS marcados ✓ → Listo para radicación
```

---

**Última actualización:** Octubre 2025  
**Versión:** 1.1 (Resolución 000160/2024)
