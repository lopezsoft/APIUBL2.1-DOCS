---
sidebar_position: 2
description: "Guía paso a paso para facturas con descuentos"
---

# Guía: Factura con Descuentos

## Introducción

Esta guía te enseñará cómo emitir una factura electrónica con descuentos comerciales. Los descuentos son muy comunes en operaciones mayoristas, promociones o clientes especiales.

## ¿Cuándo usar esta guía?

✅ Cliente mayorista con descuento
✅ Descuento por volumen
✅ Promoción especial
✅ Descuento comercial o por pronto pago
✅ Operación con rebaja

:::warning
Los descuentos se aplican ANTES de calcular impuestos.
:::

## Tipos de Descuentos

### 1. Descuento en Línea
Aplicado a cada línea de factura individualmente.

```json
{
  "line_items": [
    {
      "description": "PRODUCTO A",
      "unit_price": 100000.00,
      "quantity": 2,
      "line_extension_amount": 200000.00,
      "discount_percentage": 10,
      "discount_amount": 20000.00,
      "line_amount": 180000.00  // Después del descuento
    }
  ]
}
```

### 2. Descuento Global
Aplicado al total de la factura.

```json
{
  "totals": {
    "subtotal": 200000.00,
    "total_discount": 20000.00,  // 10% global
    "taxable_base": 180000.00,
    "total_tax": 34200.00,
    "payable_amount": 214200.00
  }
}
```

## Paso 1: Calcular Correctamente

La fórmula correcta es:

```
SUBTOTAL (sin descuento)
    ↓
MENOS: Descuentos
    ↓
BASE IMPONIBLE (sobre la que se calculan impuestos)
    ↓
PLUS: Impuestos calculados sobre BASE IMPONIBLE
    ↓
TOTAL PAGADERO
```

### ❌ Error Común
```
Subtotal: 100000
Descuento: 10000
Impuesto sobre 90000: 17100
PERO reportar Total: 107100 ✓ CORRECTO
```

### ✅ Correcto
```
Subtotal: 100000
Descuento: 10% = 10000
Base Imponible: 90000
Impuesto (19%): 17100
Total: 107100
```

## Paso 2: Estructura JSON con Descuento

```json
{
  "resolution_number": "18764074347312",
  "prefix": "FEV",
  "document_number": 2002,
  "type_document_id": 7,
  "operation_type_id": 1,
  
  "date": "2024-10-17",
  "time": "14:45:00",
  "currency_id": 170,
  
  "issuer": {
    "tax_id": "9001234567",
    "name": "MI EMPRESA SAS",
    "address": "Carrera 10 #25-50",
    "city": "Bogotá",
    "country_id": "169",
    "tax_regime_id": 1
  },
  
  "customer": {
    "identity_document_id": "2",
    "document_number": "8001234567",
    "company_name": "CLIENTE MAYORISTA",
    "address": "Calle 15 #8-30",
    "city": "Medellín",
    "country_id": "169"
  },
  
  // === LÍNEAS CON DESCUENTO ===
  "lines": [
    {
      "description": "PRODUCTO MAYORISTA A - 100 unidades",
      "code": "PRD-001",
      "quantity": 100,
      "quantity_units_id": "1093",
      "unit_price": 10000.00,
      "line_extension_amount": 1000000.00,
      
      // === DESCUENTO POR LÍNEA ===
      "discount_percentage": 15,           // 15% de descuento
      "discount_amount": 150000.00,        // 1000000 × 0.15
      "line_amount": 850000.00,            // Después del descuento
      
      "taxes": [
        {
          "tax_type_id": 1,
          "tax_percentage": 19,
          "tax_amount": 161500.00           // 850000 × 0.19
        }
      ]
    },
    {
      "description": "PRODUCTO MAYORISTA B - 50 unidades",
      "code": "PRD-002",
      "quantity": 50,
      "unit_price": 20000.00,
      "line_extension_amount": 1000000.00,
      
      "discount_percentage": 15,
      "discount_amount": 150000.00,
      "line_amount": 850000.00,
      
      "taxes": [
        {
          "tax_type_id": 1,
          "tax_percentage": 19,
          "tax_amount": 161500.00
        }
      ]
    }
  ],
  
  // === TOTALES (incluyendo descuentos) ===
  "totals": {
    "subtotal": 2000000.00,                // Suma de líneas ANTES descuento
    "total_discount": 300000.00,           // 150000 + 150000
    "taxable_base": 1700000.00,            // 2000000 - 300000
    "total_tax": 323000.00,                // 161500 + 161500
    "payable_amount": 2023000.00           // 1700000 + 323000
  },
  
  "payments": [
    {
      "payment_method_id": "10",
      "means_payment_id": "42",
      "value_paid": 2023000.00
    }
  ],
  
  "notes": "Venta mayorista con descuento comercial 15%"
}
```

## Paso 3: Validar Cálculos

Verifica estos cálculos antes de enviar:

```javascript
// JavaScript para validar
const subtotal = 2000000;
const discount = 300000;
const discountPercentage = (discount / subtotal) * 100;  // 15%

const taxableBase = subtotal - discount;  // 1700000

const taxAmount = taxableBase * 0.19;     // 323000

const total = taxableBase + taxAmount;    // 2023000

console.assert(total === 2023000, "Total no coincide");
console.log("✓ Validación exitosa");
```

## Paso 4: Casos Especiales de Descuentos

### Descuento por Pronto Pago

```json
{
  "discounts": [
    {
      "type": "PROMPT_PAYMENT",
      "description": "2% por pago en 7 días",
      "percentage": 2,
      "days": 7,
      "amount": 40000.00
    }
  ]
}
```

### Descuento Escalonado

```json
{
  "lines": [
    {
      "quantity": 100,
      "unit_price": 10000,
      "line_extension_amount": 1000000,
      
      // Descuento progresivo
      "discounts": [
        {
          "reason": "Volumen 100+ unidades",
          "percentage": 5,
          "amount": 50000
        },
        {
          "reason": "Cliente Clase A",
          "percentage": 10,
          "amount": 100000
        }
      ],
      
      "total_discount": 150000,
      "line_amount": 850000
    }
  ]
}
```

## Paso 5: Enviar a la API

```bash
curl -X POST https://api.matias.com/api/invoices/create \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d @factura-descuento.json
```

## Validaciones Específicas para Descuentos

La API validará que:

✅ El descuento no exceda el subtotal
✅ Los descuentos estén antes de impuestos
✅ El porcentaje sea válido (0-100)
✅ Los totales sean consistentes

## Checklist de Validación

- [ ] Subtotal calculado correctamente
- [ ] Descuento calculado correctamente
- [ ] Base imponible = subtotal - descuento
- [ ] Impuesto sobre base imponible
- [ ] Total = base imponible + impuesto
- [ ] Descuento ≤ Subtotal
- [ ] Campos de descuento en cada línea O en totales (no ambos sin coordinar)

## Errores Comunes

### ❌ Error: "Descuento excede el monto"
```json
// INCORRECTO
{
  "subtotal": 100000,
  "discount": 150000,  // Mayor que subtotal
  "line_amount": -50000  // Negativo
}
```

**Solución**: Verifica que descuento ≤ subtotal

### ❌ Error: "Impuesto no corresponde"
```json
// INCORRECTO - IVA sobre subtotal completo
{
  "subtotal": 100000,
  "discount": 20000,
  "tax": 19000.00  // 100000 × 0.19 ❌
}
```

**Solución**: Calcula impuesto sobre base imponible (80000 × 0.19 = 15200)

## Próximos Pasos

- 📖 [Guía: Factura de Exportación](/docs/use-cases/export-scenarios)
- 📖 [Guía: Factura Simple](/docs/use-cases/simple-invoice)
- 📋 [Ver Validaciones](/docs/regulatory-framework/factura-electronica/anexo-tecnico/validaciones)

---

**Última actualización**: Octubre 2024
**Tiempo estimado**: 20 minutos
**Nivel de dificultad**: ⭐⭐ Intermedio
