---
sidebar_position: 2
description: "Guía paso a paso para facturas con descuentos comerciales"
---

# Guía: Factura con Descuentos

## Introducción

Esta guía te enseñará cómo emitir una factura electrónica **con descuentos comerciales**. Los descuentos se aplican a nivel de línea o documento y reducen la base imponible para el cálculo de impuestos.

## ¿Cuándo usar esta guía?

✅ Cliente mayorista con descuento
✅ Descuento por volumen o promoción
✅ Descuento comercial o rebaja
✅ Operación con incentivo al cliente
✅ Necesitas reducir el precio sin cambiar el unitario

:::warning
**Punto Crítico**: En el API MATIAS, los descuentos se aplican usando `allowance_charges` dentro de cada línea, NO como un campo separado.
:::

## Estructura de Descuentos en el API

En MATIAS API, los descuentos se manejan así:

```json
"allowance_charges": [
  {
    "amount": "VALOR_DESCUENTO",
    "base_amount": "VALOR_ORIGINAL",
    "charge_indicator": false,
    "allowance_charge_reason": "Promocion"
  }
]
```

**Campos:**
- `amount`: Valor del descuento en dinero
- `base_amount`: Valor original (price_amount × quantity)
- `charge_indicator`: `false` para descuento, `true` para cargo
- `allowance_charge_reason`: Motivo del descuento

## Ejemplo Real: Factura con Descuento

### Escenario
- Producto: CALZADO OSIRIS D3 2001
- Precio original: $220.00
- Descuento: $22.00 (10%)
- Precio final: $198.00
- Impuesto: EXENTO (0%)
- Total a pagar: $198.00

### JSON Completo

```json title="factura-con-descuento.json"
{
  "resolution_number": "18764074347312",
  "prefix": "FEV",
  "notes": "Factura con descuento comercial",
  "document_number": "2005",
  "graphic_representation": 0,
  "send_email": 1,
  "operation_type_id": 1,
  "type_document_id": 7,
  
  "payments": [
    {
      "payment_method_id": 1,
      "means_payment_id": 10,
      "value_paid": "198.00"
    }
  ],
  
  "customer": {
    "country_id": "45",
    "city_id": "1041",
    "identity_document_id": "3",
    "type_organization_id": 2,
    "tax_regime_id": 2,
    "tax_level_id": 5,
    "company_name": "CONSUMIDOR FINAL",
    "dni": "222222222222",
    "mobile": "3043965204",
    "email": "compras@cliente.com",
    "address": "CALLE 22 NRO. 32 29",
    "postal_code": "76834"
  },
  
  "lines": [
    {
      "invoiced_quantity": "1",
      "quantity_units_id": "1093",
      "line_extension_amount": "198.00",
      "free_of_charge_indicator": false,
      "description": "CALZADO OSIRIS D3 2001",
      "code": "A50824",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "price_amount": "220.00",
      "base_quantity": "1",
      
      "allowance_charges": [
        {
          "amount": "22.00",
          "base_amount": "220.00",
          "charge_indicator": false,
          "allowance_charge_reason": "Promocion"
        }
      ]
    }
  ],
  
  "legal_monetary_totals": {
    "line_extension_amount": "198.00",
    "tax_exclusive_amount": "0.00",
    "tax_inclusive_amount": "198.00",
    "payable_amount": 198.00
  }
}
```

## Paso 1: Entender la Matemática

### Fórmula con Descuento

```
PRECIO UNITARIO × CANTIDAD = SUBTOTAL DE LÍNEA
            ↓
SUBTOTAL - DESCUENTO = VALOR FINAL DE LÍNEA
            ↓
VALOR FINAL × TASA IVA = IMPUESTO
            ↓
VALOR FINAL + IMPUESTO = TOTAL DE LÍNEA
```

### Ejemplo Numérico

```
Precio unitario: $220.00
Cantidad: 1 unidad
Subtotal: $220.00

Descuento: $22.00 (10% de $220)
Valor final: $198.00

Impuesto (0% exento): $0.00
Total: $198.00
```

## Paso 2: Crear la Línea con Descuento

```json
{
  "invoiced_quantity": "1",
  "quantity_units_id": "1093",
  "price_amount": "220.00",
  "base_quantity": "1",
  "line_extension_amount": "198.00",
  "free_of_charge_indicator": false,
  "description": "CALZADO OSIRIS D3 2001",
  "code": "A50824",
  "type_item_identifications_id": "4",
  "reference_price_id": "1",
  
  "allowance_charges": [
    {
      "amount": "22.00",
      "base_amount": "220.00",
      "charge_indicator": false,
      "allowance_charge_reason": "Promocion"
    }
  ]
}
```

**Reglas Importantes:**

| Campo | Valor | Cálculo |
|-------|-------|---------|
| `price_amount` | 220.00 | Precio SIN descuento |
| `base_amount` en allowance_charges | 220.00 | SIEMPRE = price_amount × quantity |
| `amount` en allowance_charges | 22.00 | 220.00 × 0.10 (descuento del 10%) |
| `line_extension_amount` | 198.00 | 220.00 - 22.00 |

## Paso 3: Calcular Impuestos Correctamente

Los impuestos se calculan sobre el valor **DESPUÉS del descuento**:

### Caso 1: Producto Exento (0% IVA)

```json
"tax_totals": []  // Array vacío
```

**Totales:**
```json
{
  "line_extension_amount": "198.00",
  "tax_exclusive_amount": "0.00",
  "tax_inclusive_amount": "198.00",
  "payable_amount": 198.00
}
```

### Caso 2: Producto con IVA (19%)

Si el mismo producto tuviera IVA:

```json
"tax_totals": [
  {
    "tax_id": "1",
    "tax_amount": 37.62,
    "taxable_amount": 198.00,
    "percent": 19
  }
]
```

**Cálculo:**
```
Valor después descuento: $198.00
IVA 19%: $198.00 × 0.19 = $37.62
Total con impuesto: $235.62
```

**Totales:**
```json
{
  "line_extension_amount": "198.00",
  "tax_exclusive_amount": "198.00",
  "tax_inclusive_amount": "235.62",
  "payable_amount": 235.62
}
```

## Paso 4: Ejemplo Completo de Múltiples Líneas

Si tienes varias líneas con diferentes descuentos:

```json
{
  "resolution_number": "18764074347312",
  "prefix": "FEV",
  "document_number": "2006",
  "operation_type_id": 1,
  "type_document_id": 7,
  "graphic_representation": 0,
  "send_email": 1,
  
  "customer": {
    "country_id": "45",
    "city_id": "76",
    "identity_document_id": "2",
    "type_organization_id": 2,
    "tax_regime_id": 1,
    "tax_level_id": 5,
    "company_name": "CLIENTE MAYORISTA",
    "dni": "8001234567",
    "email": "compras@mayorista.com",
    "address": "Calle 100 #50-80",
    "postal_code": "050001"
  },
  
  "lines": [
    {
      "invoiced_quantity": "100",
      "quantity_units_id": "1093",
      "price_amount": "10000.00",
      "line_extension_amount": "850000.00",
      "description": "PRODUCTO A - 100 unidades",
      "code": "PRD-A",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "base_quantity": "100",
      
      "allowance_charges": [
        {
          "amount": "150000.00",
          "base_amount": "1000000.00",
          "charge_indicator": false,
          "allowance_charge_reason": "Descuento volumen 15%"
        }
      ],
      
      "tax_totals": [
        {
          "tax_id": "1",
          "tax_amount": 161500.00,
          "taxable_amount": 850000.00,
          "percent": 19
        }
      ]
    },
    {
      "invoiced_quantity": "50",
      "quantity_units_id": "1093",
      "price_amount": "5000.00",
      "line_extension_amount": "225000.00",
      "description": "PRODUCTO B - 50 unidades",
      "code": "PRD-B",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "base_quantity": "50",
      
      "allowance_charges": [
        {
          "amount": "25000.00",
          "base_amount": "250000.00",
          "charge_indicator": false,
          "allowance_charge_reason": "Promoción especial"
        }
      ],
      
      "tax_totals": [
        {
          "tax_id": "1",
          "tax_amount": 42750.00,
          "taxable_amount": 225000.00,
          "percent": 19
        }
      ]
    }
  ],
  
  "legal_monetary_totals": {
    "line_extension_amount": "1075000.00",
    "tax_exclusive_amount": "1075000.00",
    "tax_inclusive_amount": "1281250.00",
    "payable_amount": 1281250.00
  },
  
  "tax_totals": [
    {
      "tax_id": "1",
      "tax_amount": 204250.00,
      "taxable_amount": 1075000.00,
      "percent": 19
    }
  ],
  
  "payments": [
    {
      "payment_method_id": 1,
      "means_payment_id": 10,
      "value_paid": "1281250.00"
    }
  ]
}
```

## Paso 5: Enviar a la API

```bash
curl -X POST https://api.matias-app.com/api/invoices \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d @factura-descuento.json
```

## Razones de Descuento Válidas

Usa `allowance_charge_reason` con uno de estos valores:

| Código | Razón |
|--------|-------|
| `Pronto pago` | Descuento por pago inmediato |
| `Volumen` | Descuento por cantidad |
| `Promocion` | Descuento promocional |
| `Bonificacion` | Bonificación especial |
| `Rebaja` | Rebaja comercial |
| `Descuento comercial` | Descuento estándar |

## Validaciones Importantes

✅ **Verificar antes de enviar:**

- [ ] `allowance_charges[].amount` ≤ `allowance_charges[].base_amount`
- [ ] `line_extension_amount` = `price_amount` × `quantity` - descuentos
- [ ] `tax_amount` = `taxable_amount` × (`percent` / 100)
- [ ] `tax_exclusive_amount` = suma de `line_extension_amount`
- [ ] `tax_inclusive_amount` = `tax_exclusive_amount` + suma de impuestos
- [ ] `payable_amount` = `tax_inclusive_amount`
- [ ] `charge_indicator` = `false` para descuentos

## Troubleshooting

### ❌ "allowance_charges amount exceeds base amount"
**Causa**: El descuento es mayor al precio original  
**Solución**: Verifica que `amount` ≤ `base_amount`

### ❌ "Tax calculated on wrong amount"
**Causa**: Impuesto calculado sobre el precio SIN descuento  
**Solución**: Calcula impuesto sobre `line_extension_amount` (después del descuento)

### ❌ "Total mismatch"
**Causa**: Los totales no coinciden  
**Solución**: Usa la herramienta TotalCalculator para validar

## Próximos Pasos

- 📖 [Exportación Internacional](/docs/use-cases/export-scenarios)
- 📖 [Casos de Error Común](/docs/use-cases/common-errors)
- ⚙️ [Calculadora Interactiva](/docs/interactive-tools)

---

**Última actualización**: Octubre 2024
**Tiempo estimado**: 20 minutos
**Nivel de dificultad**: ⭐⭐ Intermedio
