---
sidebar_position: 3
description: "Ejemplos prácticos de aplicación de Factura Electrónica"
---

# Ejemplos de Aplicación - Factura Electrónica

## Introducción

Esta sección proporciona ejemplos reales y comentados de cómo estructurar diferentes tipos de facturas electrónicas según la normativa DIAN.

## 1. Factura Estándar Simple

### Caso de Uso
Venta de productos a cliente empresario, sin descuentos ni complicaciones.

### Escenario
- Vendedor: COMERCIAL MATIAS SAS
- Cliente: DISTRIBUIDORA COLOMBIA LTDA
- Productos: 2 artículos diferentes
- Total: $224,000

### JSON Comentado

```json
{
  // === IDENTIFICACIÓN DEL DOCUMENTO ===
  "resolution_number": "18764074347312",    // Resolución de facturación
  "prefix": "FEV",                          // Prefijo autorizado
  "document_number": 2002,                  // Número secuencial
  "type_document_id": 7,                    // 7 = Factura de venta
  "operation_type_id": 1,                   // 1 = Operación nacional
  
  // === FECHAS ===
  "date": "2024-10-15",                     // Fecha de emisión
  "time": "14:30:00",                       // Hora de emisión
  
  // === MONEDA ===
  "currency_id": 170,                       // 170 = COP (Pesos Colombianos)
  
  // === EMISOR ===
  "issuer": {
    "tax_id": "9001234567",                 // NIT sin verificación
    "name": "COMERCIAL MATIAS SAS",
    "address": "Carrera 10 #25-50",
    "city": "Bogotá",
    "country_id": "169",
    "tax_regime_id": 1,                     // Régimen común
    "phone": "3101234567",
    "email": "ventas@matias.com.co"
  },
  
  // === CLIENTE ===
  "customer": {
    "identity_document_id": "2",            // 2 = NIT
    "document_number": "8001234567",        // NIT del cliente
    "company_name": "DISTRIBUIDORA COLOMBIA LTDA",
    "address": "Calle 15 #8-30",
    "city": "Medellín",
    "country_id": "169",
    "email": "compras@distribuidora.com.co"
  },
  
  // === LÍNEAS DE FACTURA ===
  "lines": [
    {
      "description": "PRODUCTO A - Descripción detallada",
      "code": "PA-001",                     // Código interno/SKU
      "quantity": 2,                        // Cantidad
      "quantity_units_id": "1093",          // 1093 = Unidad (UNECE)
      "unit_price": 50000.00,               // Precio sin impuestos
      "line_extension_amount": 100000.00,   // 2 × 50000
      "free_of_charge_indicator": false,
      "taxes": [
        {
          "tax_type_id": 1,                 // 1 = IVA
          "tax_percentage": 19,             // 19%
          "tax_amount": 19000.00            // 100000 × 0.19
        }
      ]
    },
    {
      "description": "PRODUCTO B - Artículo de consumo",
      "code": "PB-002",
      "quantity": 2,
      "quantity_units_id": "1093",
      "unit_price": 50000.00,
      "line_extension_amount": 100000.00,
      "taxes": [
        {
          "tax_type_id": 1,
          "tax_percentage": 19,
          "tax_amount": 19000.00
        }
      ]
    }
  ],
  
  // === DESCUENTOS (opcionales) ===
  // En este ejemplo no hay descuentos
  
  // === IMPUESTOS TOTALES ===
  "taxes": [
    {
      "tax_type_id": 1,                     // IVA
      "tax_percentage": 19,
      "tax_amount": 38000.00                // 19000 + 19000
    }
  ],
  
  // === TOTALES ===
  "totals": {
    "subtotal": 200000.00,                  // Suma de líneas
    "total_discount": 0.00,                 // Sin descuentos
    "total_tax": 38000.00,                  // IVA total
    "payable_amount": 238000.00             // 200000 + 38000
  },
  
  // === FORMAS DE PAGO ===
  "payments": [
    {
      "payment_method_id": "10",            // Transferencia bancaria
      "means_payment_id": "42",             // Transferencia
      "payment_due_date": "2024-11-15",     // 30 días
      "value_paid": 238000.00               // Total
    }
  ],
  
  // === NOTAS ===
  "notes": "Factura de venta estándar - Pago a 30 días"
}
```

### Validaciones Aplicadas

✅ Prefijo y número dentro del rango autorizado
✅ Cliente identificado con NIT válido
✅ Al menos una línea de factura
✅ Cálculos correctos: 2 × 50000 = 100000
✅ IVA calculado correctamente
✅ Total pagadero = 200000 + 38000 = 238000
✅ Forma de pago especificada

---

## 2. Factura con Descuentos

### Caso de Uso
Venta con descuento comercial por volumen.

### Escenario
- Cliente mayorista
- Descuento comercial: 10%
- Total antes de descuento: $100,000

### JSON Comentado

```json
{
  "resolution_number": "18764074347312",
  "prefix": "FEV",
  "document_number": 2003,
  "type_document_id": 7,
  "operation_type_id": 1,
  "date": "2024-10-15",
  "time": "15:45:00",
  "currency_id": 170,
  
  // ... emisor y cliente igual al ejemplo anterior ...
  
  "lines": [
    {
      "description": "PRODUCTO MAYORISTA A",
      "quantity": 100,
      "unit_price": 1000.00,
      "line_extension_amount": 100000.00,
      "discount_amount": 10000.00,         // 10% descuento
      "discount_percentage": 10,
      "line_amount": 90000.00,             // 100000 - 10000
      "taxes": [
        {
          "tax_type_id": 1,
          "tax_percentage": 19,
          "tax_amount": 17100.00            // 90000 × 0.19
        }
      ]
    }
  ],
  
  "totals": {
    "subtotal": 100000.00,
    "total_discount": 10000.00,            // IMPORTANTE: Descuento aplicado
    "total_tax": 17100.00,
    "payable_amount": 107100.00            // 100000 - 10000 + 17100
  },
  
  "payments": [
    {
      "payment_method_id": "10",
      "means_payment_id": "42",
      "value_paid": 107100.00
    }
  ]
}
```

### Nota sobre Descuentos

⚠️ **IMPORTANTE**: Los descuentos se aplican al subtotal ANTES de calcular impuestos.

**Fórmula correcta:**
```
Subtotal = 100000
Descuento = 10000 (10%)
Base Imponible = 90000
IVA (19%) = 17100
Total Pagadero = 107100
```

---

## 3. Factura de Exportación

### Caso de Uso
Venta a cliente en el exterior en USD.

### Escenario
- Cliente: Distribuidor en Estados Unidos
- Moneda: USD
- Incoterm: FOB (Free on Board)
- TRM: 4,000

### JSON Comentado

```json
{
  "resolution_number": "18764074347312",
  "prefix": "FEV",
  "document_number": 2004,
  "type_document_id": 2,                    // 2 = Factura de exportación
  "operation_type_id": 2,                   // 2 = Exportación
  
  "date": "2024-10-15",
  "time": "16:30:00",
  "currency_id": 840,                       // 840 = USD
  
  "issuer": {
    "tax_id": "9001234567",
    "name": "COMERCIAL MATIAS SAS",
    // ... resto igual ...
  },
  
  "customer": {
    "identity_document_id": "3",            // 3 = Pasaporte (extranjero)
    "document_number": "AB12345678",
    "company_name": "ABC DISTRIBUTORS INC",
    "address": "123 Main Street",
    "city": "New York",
    "country_id": "226",                    // USA
    "email": "buyer@abcdist.com"
  },
  
  // === INFORMACIÓN DE EXPORTACIÓN ===
  "export_information": {
    "incoterm_code": "FOB",                // FOB - Free on Board
    "incoterm_location": "Puerto de Buenaventura",
    "exchange_rate": 4000.00,              // TRM
    "reference_currency": 170              // Referencia a COP
  },
  
  "lines": [
    {
      "description": "EXPORTED PRODUCT - Description",
      "code": "EXP-001",
      "quantity": 50,
      "quantity_units_id": "1093",
      "unit_price": 1000.00,                // en USD
      "line_extension_amount": 50000.00,    // 50 × 1000
      
      // IMPORTANTE: Productos de exportación pueden estar exentos de IVA
      "taxes": [
        {
          "tax_type_id": 1,
          "tax_percentage": 0,              // 0% - Exento por exportación
          "tax_amount": 0.00
        }
      ]
    }
  ],
  
  "totals": {
    "subtotal": 50000.00,
    "total_tax": 0.00,                     // Sin IVA en exportación
    "payable_amount": 50000.00,
    "payable_amount_cop": 200000000.00     // 50000 × 4000 (referencia)
  },
  
  "payments": [
    {
      "payment_method_id": "10",
      "means_payment_id": "42",
      "currency_id": 840,                  // USD
      "value_paid": 50000.00
    }
  ],
  
  "notes": "Exportación FOB Puerto de Buenaventura"
}
```

### Consideraciones de Exportación

📌 **IVA**: Las exportaciones están exentas de IVA (0%)
📌 **Moneda**: Se especifica en USD
📌 **TRM**: Se debe registrar para referencia
📌 **INCOTERM**: Especifica términos comerciales internacionales

---

## 4. Nota Crédito

### Caso de Uso
Devolución de mercancía defectuosa.

### Escenario
- Referencia: Factura 2001 del 2024-10-10
- Motivo: Producto defectuoso
- Cantidad devuelta: 1 unidad de $50,000

### JSON Comentado

```json
{
  "resolution_number": "18764074347312",
  "prefix": "NCV",                          // Prefijo para nota crédito
  "document_number": 1001,                  // Numeración separada para NC
  "type_document_id": 91,                   // 91 = Nota Crédito
  
  "date": "2024-10-16",                     // Un día después de factura
  "time": "10:00:00",
  "currency_id": 170,
  
  // === REFERENCIA A FACTURA ORIGINAL ===
  "document_reference": {
    "original_document_type": 7,            // Factura (no NC)
    "original_document_number": "2001",
    "original_document_prefix": "FEV",
    "original_document_date": "2024-10-10",
    "correction_concept_id": 1              // 1 = Devolución en venta
  },
  
  "lines": [
    {
      "description": "Devolución - Producto defectuoso",
      "code": "PA-001",
      "quantity": 1,
      "unit_price": -50000.00,              // NEGATIVO
      "line_extension_amount": -50000.00,
      "free_of_charge_indicator": false,
      "taxes": [
        {
          "tax_type_id": 1,
          "tax_percentage": 19,
          "tax_amount": -9500.00             // NEGATIVO
        }
      ]
    }
  ],
  
  "totals": {
    "subtotal": -50000.00,                  // Negativo
    "total_tax": -9500.00,                  // Negativo
    "payable_amount": -59500.00             // Crédito para cliente
  },
  
  "payments": [
    {
      "payment_method_id": "10",
      "means_payment_id": "0",              // Crédito (no hay pago)
      "value_paid": 0.00
    }
  ],
  
  "notes": "NC por devolución de mercancía defectuosa - Ref: FEV-2001"
}
```

### Puntos Importantes

⚠️ **Signos Negativos**: Todos los valores van en negativo
⚠️ **Referencia Obligatoria**: DIAN requiere dato de factura original
⚠️ **Motivo de Corrección**: Debe ser código válido DIAN
⚠️ **Numeración**: Generalmente con prefijo diferente (NCV, NCC, etc.)

---

## 5. Factura POS (Punto de Venta)

### Caso de Uso
Venta en establecimiento comercial a consumidor final.

### JSON Comentado

```json
{
  "resolution_number": "18764074347312",
  "prefix": "POS",                          // Prefijo POS
  "document_number": 50001,
  "type_document_id": 7,
  
  "date": "2024-10-15",
  "time": "17:45:32",
  "currency_id": 170,
  
  "issuer": {
    "tax_id": "9001234567",
    "name": "COMERCIAL MATIAS SAS",
    // ...
  },
  
  // === CLIENTE CONSUMIDOR FINAL ===
  "customer": {
    "identity_document_id": "1",            // 1 = CC (Consumidor final)
    "document_number": "1234567890",
    "company_name": "CONSUMIDOR FINAL",
    "city": "Bogotá"
    // Otros datos no requeridos
  },
  
  // === PUNTO DE VENTA ===
  "point_of_sale": {
    "terminal_number": "CJ001",             // Terminal/Caja
    "cashier_name": "MARIA GARCIA",         // Cajero
    "sales_person": "MARIA GARCIA"
  },
  
  // === DOCUMENTACIÓN BANCARIA ===
  "document_signature": {
    "cashier": "MARIA GARCIA",
    "seller": "VENDEDOR POS"
  },
  
  "lines": [
    {
      "description": "BEBIDA REFRESCANTE 500ML",
      "code": "BEB-001",
      "quantity": 3,
      "unit_price": 5000.00,
      "line_extension_amount": 15000.00,
      "taxes": [
        {
          "tax_type_id": 1,
          "tax_percentage": 0,               // Bebidas básicas exentas
          "tax_amount": 0.00
        }
      ]
    },
    {
      "description": "CHOCOLATINA 50GR",
      "code": "CHO-002",
      "quantity": 2,
      "unit_price": 3000.00,
      "line_extension_amount": 6000.00,
      "taxes": [
        {
          "tax_type_id": 1,
          "tax_percentage": 19,
          "tax_amount": 1140.00
        }
      ]
    }
  ],
  
  "totals": {
    "subtotal": 21000.00,
    "total_tax": 1140.00,
    "payable_amount": 22140.00
  },
  
  "payments": [
    {
      "payment_method_id": "1",             // Efectivo
      "means_payment_id": "10",
      "value_paid": 22140.00
    }
  ]
}
```

---

## 6. Factura con Retención

### Caso de Uso
Factura donde el cliente debe hacer retención en la fuente.

### JSON Comentado

```json
{
  "resolution_number": "18764074347312",
  "prefix": "FEV",
  "document_number": 2005,
  
  "lines": [
    {
      "description": "SERVICIO PROFESIONAL",
      "quantity": 1,
      "unit_price": 1000000.00,
      "line_extension_amount": 1000000.00,
      "taxes": [
        {
          "tax_type_id": 1,                 // IVA
          "tax_percentage": 19,
          "tax_amount": 190000.00
        }
      ],
      "retentions": [
        {
          "retention_type_id": 1,           // Retención IVA
          "retention_percentage": 50,       // 50% del IVA
          "retention_amount": 95000.00
        }
      ]
    }
  ],
  
  "totals": {
    "subtotal": 1000000.00,
    "total_tax": 190000.00,
    "total_retention": 95000.00,
    "payable_amount": 1095000.00            // Sin restar retención
  },
  
  "payments": [
    {
      "payment_method_id": "10",
      "value_paid": 1095000.00,
      "retention_applied": 95000.00
    }
  ]
}
```

---

## Checklist de Validación por Tipo

### ✅ Factura Estándar
- [ ] Prefijo y número secuencial
- [ ] Emisor con NIT válido
- [ ] Cliente identificado
- [ ] Mínimo 1 línea
- [ ] Totales correctos

### ✅ Factura de Exportación
- [ ] Type document = 2
- [ ] Currency ≠ 170
- [ ] Incoterm especificado
- [ ] IVA = 0%
- [ ] Cliente en exterior

### ✅ Nota Crédito
- [ ] Prefijo diferente
- [ ] Type document = 91
- [ ] Referencia a factura original
- [ ] Valores negativos
- [ ] Concepto de corrección

### ✅ Nota Débito
- [ ] Prefijo diferente
- [ ] Type document = 92
- [ ] Referencia a factura original
- [ ] Valores positivos
- [ ] Concepto de corrección

---

**Última actualización**: Octubre 2024
**Versión**: 1.0
