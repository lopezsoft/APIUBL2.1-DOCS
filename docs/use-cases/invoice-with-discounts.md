---
sidebar_position: 2
description: "Guía paso a paso para facturas con descuentos comerciales"
---

# Guía: Factura con Descuentos

## Introducción

Esta guía te enseñará cómo emitir una factura electrónica **con descuentos comerciales**. Los descuentos se aplican a nivel de línea y reducen la base imponible para el cálculo de impuestos.

## ¿Cuándo usar esta guía?

✅ Cliente mayorista con descuento
✅ Descuento por volumen o promoción
✅ Descuento comercial o rebaja
✅ Operación con incentivo al cliente
✅ Necesitas reducir el precio sin cambiar el unitario

:::warning
**Punto Crítico**: En el API MATIAS, los descuentos se aplican usando `allowance_charges` dentro de cada línea, NO como campo separado global.
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

## La Matemática de Descuentos

La fórmula correcta es:

```
PRECIO UNITARIO × CANTIDAD = SUBTOTAL
            ↓
SUBTOTAL - DESCUENTO = VALOR FINAL
            ↓
VALOR FINAL × TASA IVA = IMPUESTO
            ↓
VALOR FINAL + IMPUESTO = TOTAL
```

### Ejemplo

```
Precio unitario: $220.00
Cantidad: 1
Subtotal: $220.00

Descuento: $22.00 (10%)
Valor final: $198.00

Impuesto (0% exento): $0.00
Total: $198.00
```

## Paso 1: Ejemplo Real del API

Este es el JSON **real** que acepta MATIAS API:

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

## Paso 2: Entender la Estructura
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

Analicemos el JSON línea por línea:

| Campo | Valor | Explicación |
|-------|-------|-------------|
| `price_amount` | 220.00 | Precio SIN descuento |
| `base_amount` | 220.00 | SIEMPRE = price_amount × quantity |
| `amount` (descuento) | 22.00 | 220.00 × 0.10 (10% descuento) |
| `line_extension_amount` | 198.00 | 220.00 - 22.00 |
| `charge_indicator` | false | `false` = descuento, `true` = cargo |

## Paso 3: Caso Mayorista con Múltiples Descuentos

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
    }
  ],
  
  "legal_monetary_totals": {
    "line_extension_amount": "850000.00",
    "tax_exclusive_amount": "850000.00",
    "tax_inclusive_amount": "1011500.00",
    "payable_amount": 1011500.00
  },
  
  "tax_totals": [
    {
      "tax_id": "1",
      "tax_amount": 161500.00,
      "taxable_amount": 850000.00,
      "percent": 19
    }
  ],
  
  "payments": [
    {
      "payment_method_id": 1,
      "means_payment_id": 10,
      "value_paid": "1011500.00"
    }
  ]
}
```

**Cálculos:**
```
Precio unitario: $10,000.00
Cantidad: 100
Subtotal: $1,000,000.00

Descuento (15%): $150,000.00
Valor final: $850,000.00

IVA (19%): $161,500.00
Total: $1,011,500.00
```

## Paso 4: Enviar a la API

```bash
curl -X POST https://api.matias-app.com/api/invoices \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d @factura-descuento.json
```

### Respuesta
```json
{
  "id": 12346,
  "document_id": "FEV-2005",
  "cufe": "101413670038274165",
  "status_id": 1,
  "status_name": "Registrada",
  "message": "Factura creada exitosamente"
}
```

## Paso 5: Razones de Descuento Válidas

En `allowance_charge_reason` usa uno de estos valores:

| Razón | Descripción |
|-------|-------------|
| `Promocion` | Descuento promocional |
| `Volumen` | Descuento por cantidad |
| `Pronto pago` | Descuento por pago inmediato |
| `Bonificacion` | Bonificación especial |
| `Rebaja` | Rebaja comercial |

## Validaciones Críticas

✅ Verificar ANTES de enviar:

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
