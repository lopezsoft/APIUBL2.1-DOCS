---
sidebar_position: 98
description: "Guía paso a paso para ventas internacionales y exportaciones (DEPRECATED - usar export-scenarios-new.md)"
---

# Guía: Exportaciones e Internacionalización

## Introducción

Esta guía te enseñará cómo emitir facturas de **exportación**. Las facturas de exportación tienen características especiales: cliente en el exterior, moneda extranjera, y están exentas de IVA.

## ¿Cuándo usar esta guía?

✅ Venta a cliente en el exterior
✅ Transacción en moneda extranjera (USD, EUR)
✅ Productos salen de Colombia
✅ Cliente no tiene NIT colombiano
✅ Necesitas especificar tasa de cambio

:::warning
**Punto Crítico**: En API MATIAS, la exportación se marca con `type_document_id: 8` y `operation_type_id: 1` (NO `operation_type_id: 2`).
:::

## Características Clave de Exportación

| Característica | Valor |
|---|---|
| **Tipo de Documento** | `type_document_id: 8` |
| **Operación** | `operation_type_id: 1` |
| **Moneda** | `currency_id: 272` (USD) |
| **IVA** | Exento (0%) |
| **Cliente** | País diferente de Colombia |
| **Tasa de Cambio** | Especificar con `payment_exchange_rate` |

## Paso 1: Información del Cliente Exterior

El cliente debe ser de otro país:

```json
{
  "country_id": "239",
  "identity_document_id": "10",
  "type_organization_id": 1,
  "company_name": "AMAZON",
  "dni": "444444055",
  "address": "NORTE DE VIRGINIA H10",
  "city_name": "VIRGINIA",
  "postal_code": "110121"
}
```

### Códigos de País Comunes

| País | country_id |
|------|-----------|
| Estados Unidos | 239 |
| México | 137 |
| Brasil | 37 |
| Panamá | 155 |
| Ecuador | 70 |
| Canadá | 41 |
| España | 217 |

### identity_document_id para Extranjeros

| Código | Tipo |
|--------|------|
| `10` | Pasaporte |
| `3` | Cédula Extranjería |
| `12` | NIT Extranjero |

## Paso 2: Configurar Moneda y Tasa de Cambio

```json
{
  "currency_id": 272,
  "payment_exchange_rate": {
    "exchange_rate": "4243.80",
    "base_rate": "4243.80",
    "rate_date": "2025-05-05",
    "currency_id": 188
  }
}
```

**Campos:**
- `currency_id: 272` → Dólares USD
- `exchange_rate` → TRM del día (pesos por dólar)
- `rate_date` → Fecha de la transacción

### Códigos de Moneda Comunes

| Moneda | currency_id |
|--------|-------------|
| USD (Dólar) | 272 |
| EUR (Euro) | 273 |
| COP (Peso) | 170 |
| MXN (Peso Mexicano) | 274 |
| BRL (Real) | 275 |

## Paso 3: Ejemplo Real de Exportación

```json title="factura-exportacion.json"
{
  "resolution_number": "18764074347312",
  "prefix": "LZT",
  "document_number": "2055",
  "operation_type_id": 1,
  "type_document_id": 8,
  "currency_id": 272,
  "graphic_representation": 0,
  "send_email": 1,
  
  "payments": [
    {
      "payment_method_id": 1,
      "means_payment_id": 42,
      "value_paid": "4243.80"
    }
  ],
  
  "payment_exchange_rate": {
    "exchange_rate": "4243.80",
    "base_rate": "4243.80",
    "rate_date": "2025-05-05",
    "currency_id": 188
  },
  
  "customer": {
    "country_id": "239",
    "identity_document_id": "10",
    "type_organization_id": 1,
    "company_name": "AMAZON",
    "dni": "444444055",
    "address": "NORTE DE VIRGINIA H10",
    "city_name": "VIRGINIA",
    "postal_code": "110121"
  },
  
  "lines": [
    {
      "invoiced_quantity": "1.00",
      "quantity_units_id": "1093",
      "line_extension_amount": "4243.80",
      "free_of_charge_indicator": false,
      "description": "HONORARIOS REPRESENTACION LEGAL",
      "code": "999-001",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "price_amount": "4243.80",
      "base_quantity": 1.00
    }
  ],
  
  "legal_monetary_totals": {
    "line_extension_amount": "4243.80",
    "tax_exclusive_amount": "0.00",
    "tax_inclusive_amount": "4243.80",
    "payable_amount": 4243.80
  }
}
```

**Cálculos:**
```
Precio unitario: $4,243.80 USD
Cantidad: 1
Subtotal: $4,243.80 USD

Impuesto: $0.00 (Exento)
Total: $4,243.80 USD

TRM: 4,243.80 COP/USD
Equivalente en COP: $18,000,000 aprox
```

## Paso 4: Exportación con Múltiples Líneas

```json
{
  "resolution_number": "18764074347312",
  "prefix": "EXP",
  "document_number": "2100",
  "operation_type_id": 1,
  "type_document_id": 8,
  "currency_id": 272,
  "graphic_representation": 0,
  "send_email": 1,
  
  "payments": [
    {
      "payment_method_id": 1,
      "means_payment_id": 42,
      "value_paid": "12500.00"
    }
  ],
  
  "payment_exchange_rate": {
    "exchange_rate": "4243.80",
    "base_rate": "4243.80",
    "rate_date": "2025-05-05",
    "currency_id": 188
  },
  
  "customer": {
    "country_id": "137",
    "city_id": "100001",
    "identity_document_id": "10",
    "type_organization_id": 2,
    "company_name": "GRUPO COMERCIAL MEXICO",
    "dni": "AAA123456789",
    "mobile": "+52-555-1234567",
    "email": "compras@grupocomercial.com.mx",
    "address": "Avenida Paseo de la Reforma 505",
    "postal_code": "06500"
  },
  
  "lines": [
    {
      "invoiced_quantity": "100",
      "quantity_units_id": "1093",
      "line_extension_amount": "7500.00",
      "free_of_charge_indicator": false,
      "description": "TEXTILES - Tela de algodón 100%",
      "code": "TEX-001",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "price_amount": "75.00",
      "base_quantity": "100"
    },
    {
      "invoiced_quantity": "50",
      "quantity_units_id": "1093",
      "line_extension_amount": "5000.00",
      "free_of_charge_indicator": false,
      "description": "TEXTILES - Hilo de poliéster",
      "code": "TEX-002",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "price_amount": "100.00",
      "base_quantity": "50"
    }
  ],
  
  "legal_monetary_totals": {
    "line_extension_amount": "12500.00",
    "tax_exclusive_amount": "0.00",
    "tax_inclusive_amount": "12500.00",
    "payable_amount": 12500.00
  }
}
```

## Paso 5: Enviar a la API

```bash
curl -X POST https://api.matias-app.com/api/invoices \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d @factura-exportacion.json
```

### Respuesta Exitosa
```json
{
  "message": "El documento ha sido procesado por la DIAN.",
  "send_to_queue": 0,
  "XmlDocumentKey": "c56g4c3fe153df1f186902602d4c4b8bf4b0d287db202ebc2ce34f6dee4c59c9d659b199ecgdf31ff8cbb3cfe3eddde59",
  "response": {
    "ErrorMessage": {
      "string": []
    },
    "IsValid": "true",
    "StatusCode": "00",
    "StatusDescription": "Procesado Correctamente.",
    "StatusMessage": "La Factura electrónica LZT2055, ha sido autorizada.",
    "XmlDocumentKey": "c56g4c3fe153df1f186902602d4c4b8bf4b0d287db202ebc2ce34f6dee4c59c9d659b199ecgdf31ff8cbb3cfe3eddde59",
    "XmlFileName": "fv09010914030002500000097"
  },
  "AttachedDocument": {
    "path": "1/ad/ad09010914030002500000043.xml",
    "url": "https://api-v2.matias-api.com/attachments/1/ad/ad09010914030002500000043.xml"
  },
  "pdf": {
    "path": "1/fv09010914030002500000097.pdf",
    "url": "https://api-v2.matias-api.com/pdf/1/fv09010914030002500000097.pdf"
  },
  "success": true
}
```

:::success
**Exportación Registrada**: El documento está en el sistema de DIAN y en proceso de validación
:::

## Documentación Requerida para DIAN

- ✅ Certificado de origen (si aplica)
- ✅ Documentos de aduanas
- ✅ Declaración de exportación
- ✅ Comprobante de cambio de moneda
- ✅ Comprobante de envío internacional

## Validaciones Críticas

✅ Verificar ANTES de enviar:

- [ ] `country_id` ≠ 45 (No es Colombia)
- [ ] `identity_document_id` es de extranjero (10, 3, 12)
- [ ] `type_document_id: 8` (Exportación)
- [ ] `currency_id: 272` (USD) u otra moneda válida
- [ ] `payment_exchange_rate` completado
- [ ] IVA = 0% (exento)
- [ ] Totales = suma de líneas
- [ ] `payable_amount` = `tax_inclusive_amount`

## Troubleshooting

### ❌ "Invalid country for export"
**Causa**: country_id es 45 (Colombia)  
**Solución**: Especifica un country_id válido del exterior

### ❌ "Currency mismatch"
**Causa**: Moneda no coincide entre línea y total  
**Solución**: Usa `currency_id: 272` en todo el documento

### ❌ "Exchange rate required"
**Causa**: payment_exchange_rate no está definido  
**Solución**: Añade `payment_exchange_rate` con TRM del día

### ❌ "Tax not allowed for exports"
**Causa**: Se incluyó IVA en una exportación  
**Solución**: Establece todos los tax_totals en vacío: `[]`

## Próximos Pasos

- 📖 [Factura Simple](/docs/use-cases/simple-invoice)
- 📖 [Factura con Descuentos](/docs/use-cases/invoice-with-discounts)
- 📖 [Casos de Error Común](/docs/use-cases/common-errors)
- 📚 [Marco Regulatorio DIAN](/docs/regulatory-framework/overview)

---

**Última actualización**: Octubre 2025
**Tiempo estimado**: 25 minutos
**Nivel de dificultad**: ⭐⭐⭐ Avanzado
