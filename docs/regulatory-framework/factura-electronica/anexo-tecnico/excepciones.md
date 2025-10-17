---
sidebar_position: 2
description: "Excepciones y casos especiales en Factura Electrónica"
---

# Excepciones y Casos Especiales

## Introducción

Además de las validaciones estándar, existen casos especiales donde se aplican reglas diferentes. Este documento describe los escenarios excepcionales.

## 1. Factura de Exportación

### Características

- **Tipo de Documento**: Factura de Exportación
- **Incoterms**: Obligatorio especificar
- **Moneda**: Generalmente diferente a COP
- **TRM**: Se debe especificar la tasa de cambio

### Campos Especiales

| Campo | Descripción |
|-------|-------------|
| `operation_type_id` | Debe ser tipo exportación |
| `incoterm_code` | Código INCOTERM (FOB, CIF, DDP, etc.) |
| `currency_id` | USD, EUR, u otra moneda |
| `exchange_rate` | TRM de la fecha de emisión |

### Ejemplo

```json
{
  "operation_type_id": 2,  // Exportación
  "type_document_id": 2,   // Factura Exportación
  "currency_id": 840,      // USD
  "exchange_rate": 4000.00,
  "incoterm_code": "FOB",
  "lines": [
    {
      "description": "Merchandise Export",
      "quantity": 1000,
      "unit_price": 50.00,
      "currency_total": 50000.00
    }
  ]
}
```

## 2. Factura Final Consumer

### Características

- Cliente es **consumidor final**
- No requiere información detallada del cliente
- Solo se necesita documento de identidad

### Campos Simplificados

```json
{
  "customer": {
    "identity_document_id": "1",  // CC
    "dni": "1234567890",
    "company_name": "CONSUMIDOR FINAL",
    // Otros campos pueden estar vacíos
  }
}
```

### Validaciones Especiales

- ✓ Documento cliente es obligatorio (incluso para consumidor final)
- ✗ Razón social puede ser "CONSUMIDOR FINAL"
- ✓ Dirección puede ser simplificada

## 3. Operaciones con Retención

### Cuando Aplica Retención

- Cliente es responsable del IVA
- Según DIAN, retención aplica
- Se debe especificar el porcentaje

### Estructura con Retención

```json
{
  "line_items": [
    {
      "description": "Servicio profesional",
      "quantity": 1,
      "unit_price": 1000000.00,
      "tax_amount": 190000.00,  // IVA
      "retention_amount": 95000.00  // Retención 50% del IVA
    }
  ],
  "totals": {
    "subtotal": 1000000.00,
    "total_tax": 190000.00,
    "total_retention": 95000.00,
    "payable_amount": 1095000.00  // sin retención
  }
}
```

## 4. Factura con Descuentos Especiales

### Descuento por Pronto Pago

```json
{
  "discounts": [
    {
      "type": "PROMPT_PAYMENT",
      "description": "2% por pago inmediato",
      "percentage": 2,
      "days": 0
    }
  ]
}
```

### Descuento Comercial

```json
{
  "discounts": [
    {
      "type": "COMMERCIAL",
      "description": "Descuento cliente mayorista",
      "percentage": 10,
      "amount": 10000.00
    }
  ]
}
```

## 5. Factura con Múltiples Monedas

### Cuando Aplica

- Transacciones internacionales
- Pagos en diferentes monedas

### Estructura

```json
{
  "currency_id": 170,  // COP (moneda principal)
  "equivalent_currency": 840,  // USD
  "exchange_rate": 4000.00,
  "payment_currency": [
    {
      "currency_id": 840,
      "amount": 27500.00  // USD
    },
    {
      "currency_id": 170,
      "amount": 2500000.00  // COP
    }
  ]
}
```

## 6. Factura de Sujetos No Obligados (Doc. Equivalente)

### Diferencias

- No tienen resolución de facturación
- No están obligados a FE
- Emiten como "Documento Equivalente"

:::note
Este es un tipo de documento diferente. Ver [Documentos Equivalentes](/docs/regulatory-framework/documentos-equivalentes/intro).
:::

## 7. Notas Crédito

### Características

- Se refieren a una factura anterior
- Pueden ser totales o parciales
- Reducen el valor de la operación

### Estructura

```json
{
  "type_document_id": 91,  // Nota Crédito
  "document_reference": {
    "original_invoice_number": "2001",
    "original_invoice_prefix": "FEV",
    "original_invoice_date": "2024-10-01",
    "correction_concept": "01"  // 01=Devolución, 02=Rebaja, etc.
  },
  "lines": [
    {
      "description": "Devolución - Producto defectuoso",
      "quantity": 1,
      "unit_price": -50000.00,  // Monto negativo
      "line_amount": -50000.00
    }
  ]
}
```

## 8. Notas Débito

### Características

- Se refieren a una factura anterior
- Aumentan el valor de la operación
- Por servicios adicionales o recargos

### Estructura

```json
{
  "type_document_id": 92,  // Nota Débito
  "document_reference": {
    "original_invoice_number": "2001",
    "original_invoice_prefix": "FEV"
  },
  "lines": [
    {
      "description": "Cargo por envío adicional",
      "quantity": 1,
      "unit_price": 50000.00,
      "line_amount": 50000.00
    }
  ]
}
```

## 9. Factura POS (Punto de Venta)

### Características

- Transacciones de consumidor final
- Cantidades pequeñas
- Múltiples líneas cortas

### Campos Adicionales

```json
{
  "point_of_sale": {
    "cashier_name": "LEWIS LOPEZ",
    "terminal_number": "CJ001",
    "sale_code": "POS01"
  },
  "document_signature": {
    "cashier": "LEWIS LOPEZ",
    "seller": "VENDEDOR"
  }
}
```

## 10. Factura del Sector Salud

### Características

- Cumple normativa sanitaria
- Contiene información de procedimientos
- Requiere información adicional

### Campos Especiales

```json
{
  "health": {
    "operation_type": "SS-CUFE",
    "invoice_period": {
      "start_date": "2024-10-01",
      "end_date": "2024-10-31"
    },
    "service_type": "CONSULTA",
    "procedure_code": "900001"
  }
}
```

## 11. Factura con Garantía o Depósitos

### Característica

- Incluye montos retenidos para garantía

### Estructura

```json
{
  "payment_conditions": {
    "retention_type": "GUARANTEE",
    "retention_amount": 5000.00,
    "retention_date": "2024-11-15"
  }
}
```

## 12. Casos de Cambio de Régimen

### Cuando Aplica

- Cambio de régimen tributario
- Empresa deja de ser responsable de IVA
- O comienza a serlo

### Validación Especial

- Debe haber autorización expresa de DIAN
- La resolución debe mencionar el cambio de régimen

## Matriz de Excepciones

| Caso | Campos Especiales | Validaciones Modificadas |
|------|-------------------|-------------------------|
| Exportación | incoterm, TRM | Moneda diferente a COP |
| Consumidor Final | dni simplificado | Documento requerido |
| Con Retención | retention_amount | Retención no cuenta en total pagadero |
| Múltiples Monedas | equivalent_currency | Validación de cambio |
| Nota Crédito | document_reference | Puede tener líneas negativas |
| Nota Débito | document_reference | Puede tener líneas positivas |
| POS | point_of_sale | Consumidor final automático |
| Salud | health | Cumplimiento normativo adicional |

## Preguntas Frecuentes sobre Excepciones

**P: ¿Puedo emitir una Nota Crédito sin referencia a una factura anterior?**
R: No, DIAN requiere referencia obligatoria a la factura original.

**P: ¿Qué pasa si cometo error en una Nota Crédito?**
R: Debes emitir una Nota Débito correctiva o una nueva Nota Crédito.

**P: ¿Puedo cambiar de régimen durante el año?**
R: Solo con autorización de DIAN, generalmente una vez al año.

**P: ¿Cómo válido una Nota Crédito sin referencia?**
R: Ver endpoint especial en API documentation.

---

**Última actualización**: Octubre 2024
**Versión**: 1.0
