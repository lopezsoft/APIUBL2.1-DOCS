---
sidebar_position: 2
description: "Anexo técnico detallado de la Factura Electrónica versión 1.9"
---

# Anexo Técnico - Factura Electrónica v1.9

## Información General

Este documento proporciona una descripción técnica del formato y estructura de la Factura Electrónica de Venta versión 1.9, conforme a la Resolución 000165 de 2024.

**Documentación oficial**: [Descargar Anexo Técnico Oficial (PDF)](https://www.dian.gov.co/)

## Elementos Principales

### 1. Identificación del Documento

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `resolution_number` | String(50) | Sí | Número de resolución de facturación |
| `prefix` | String(5) | Sí | Prefijo de la serie (ej: FEV) |
| `document_number` | Integer | Sí | Número secuencial de la factura |
| `date` | Date | Sí | Fecha de emisión (YYYY-MM-DD) |
| `time` | DateTime | Sí | Hora de emisión (HH:MM:SS) |
| `expiration_date` | Date | No | Fecha de vencimiento de la factura |

### 2. Partes Involucradas

#### 2.1 Emisor (Proveedor/Vendedor)

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `issuer.tax_id` | String | Sí | NIT del emisor sin verificación |
| `issuer.name` | String | Sí | Razón social del emisor |
| `issuer.address` | String | Sí | Dirección del emisor |
| `issuer.city` | String | Sí | Ciudad del emisor |
| `issuer.country` | String | Sí | País del emisor (código ISO 3166) |
| `issuer.postal_code` | String | No | Código postal |
| `issuer.tax_regime` | String | Sí | Régimen tributario (común, simplificado, etc.) |

#### 2.2 Receptor (Cliente/Comprador)

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `customer.document_type` | String | Sí | Tipo de documento (CC, NIT, CE, etc.) |
| `customer.document_number` | String | Sí | Número de documento |
| `customer.name` | String | Sí | Nombre o razón social |
| `customer.address` | String | No | Dirección |
| `customer.city` | String | Sí | Ciudad |
| `customer.country` | String | Sí | País (código ISO 3166) |
| `customer.email` | String | No | Correo electrónico |
| `customer.phone` | String | No | Teléfono |

### 3. Información de Mercancías/Servicios

Cada línea de factura debe contener:

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `line_items[].description` | String | Sí | Descripción del producto/servicio |
| `line_items[].quantity` | Decimal | Sí | Cantidad |
| `line_items[].unit_of_measure` | String | Sí | Unidad de medida |
| `line_items[].unit_price` | Decimal | Sí | Precio unitario sin impuestos |
| `line_items[].line_amount` | Decimal | Sí | Cantidad × Precio unitario |
| `line_items[].discount_amount` | Decimal | No | Valor del descuento |
| `line_items[].tax_amount` | Decimal | No | Valor del impuesto |

### 4. Impuestos

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `taxes[].tax_type` | String | Sí | Tipo de impuesto (IVA, ICA, etc.) |
| `taxes[].tax_percentage` | Decimal | Sí | Porcentaje del impuesto |
| `taxes[].tax_amount` | Decimal | Sí | Valor del impuesto |

### 5. Totales

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `totals.subtotal` | Decimal | Sí | Subtotal antes de impuestos |
| `totals.total_discount` | Decimal | No | Total de descuentos |
| `totals.total_tax` | Decimal | Sí | Total de impuestos |
| `totals.gross_total` | Decimal | Sí | Total bruto (subtotal - descuentos + impuestos) |
| `totals.payable_amount` | Decimal | Sí | Monto total a pagar |

### 6. Forma de Pago

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `payment.payment_method` | String | Sí | Método de pago (01=Efectivo, 02=Cheque, etc.) |
| `payment.payment_means` | String | Sí | Medio de pago (10=Efectivo, 41=Tarjeta de crédito, etc.) |
| `payment.payment_due_date` | Date | No | Fecha de vencimiento del pago |
| `payment.amount` | Decimal | Sí | Monto del pago |

## Validaciones Obligatorias

:::danger
Todas estas validaciones DEBEN cumplirse para que la factura sea aceptada por el sistema de la DIAN.
:::

1. **Consecutividad**: La factura debe ser consecutiva según el rango autorizado
2. **Firma Digital**: Debe estar firmada con certificado válido
3. **Estructura XML**: Debe cumplir con el esquema UBL 2.1
4. **Moneda**: Debe declararse explícitamente
5. **Fechas**: Fecha y hora deben ser válidas y consistentes
6. **Cálculos**: Los totales deben ser matemáticamente correctos
7. **Partes**: Emisor y receptor deben estar correctamente identificados
8. **Impuestos**: Los porcentajes deben corresponder a los establecidos por la DIAN

## Consideraciones Especiales

### Descuentos

- Se pueden aplicar descuentos por línea de factura
- Se pueden aplicar descuentos globales (al total)
- Deben estar justificados (código de descuento DIAN)

### Retenciones

- Si aplica retención en la fuente, debe declararse explícitamente
- Se reportan como impuestos negativos en la estructura

### Moneda Extranjera

- Si la transacción es en moneda extranjera, debe incluirse TRM
- La factura tiene dos valores: en moneda extranjera y en COP

### Descuentos por Pronto Pago

- Se pueden especificar descuentos condicionales
- Aplican solo si el pago cumple con las condiciones

## Errores Comunes

❌ **Error**: Factura sin prefijo
✅ **Solución**: Configurar el prefijo según la resolución de facturación

❌ **Error**: Total no coincide con suma de líneas
✅ **Solución**: Verificar cálculos de líneas, descuentos e impuestos

❌ **Error**: Documento del cliente inválido
✅ **Solución**: Validar tipo y número de documento contra estándares DIAN

## Próximos Pasos

- 📋 [Ver Validaciones Detalladas](/docs/regulatory-framework/factura-electronica/anexo-tecnico/validaciones)
- ⚠️ [Consultar Excepciones](/docs/regulatory-framework/factura-electronica/anexo-tecnico/excepciones)
- 💡 [Ver Ejemplos Prácticos](/docs/regulatory-framework/factura-electronica/ejemplos-aplicacion)
