---
sidebar_position: 3
description: "Guía para ventas internacionales y exportaciones"
---

# Guía: Escenarios de Exportación

## Introducción

Esta guía te enseñará cómo emitir facturas de exportación según los requisitos de la DIAN. Las facturas de exportación tienen características especiales que debes conocer.

## ¿Cuándo usar esta guía?

✅ Venta a cliente en el exterior
✅ Transacción en moneda extranjera (USD, EUR, etc.)
✅ Necesitas especificar INCOTERM
✅ Productos salen de Colombia
✅ Cliente no tiene NIT colombiano

## Características de Facturas de Exportación

### 📌 Tipo de Documento
```
type_document_id: 2  // Factura de Exportación
```

### 📌 Operación
```
operation_type_id: 2  // Exportación
```

### 📌 Moneda
```
currency_id: 840  // USD (no es COP)
```

### 📌 IVA
```
// Las exportaciones están EXENTAS de IVA
tax_percentage: 0
```

## Paso 1: Información de Cliente Exterior

El cliente debe ser de otro país:

```json
{
  "customer": {
    "identity_document_id": "3",           // 3 = Pasaporte
    "document_number": "AB12345678",       // Número de pasaporte
    "company_name": "ABC DISTRIBUTORS INC",
    "address": "123 Main Street, Floor 5",
    "city": "New York",
    "country_id": "226",                   // USA
    "email": "buyer@abcdistributors.us",
    "phone": "+1-212-555-0123"
  }
}
```

### Códigos de Países Comunes

| País | Código | Código ISO |
|------|--------|-----------|
| Estados Unidos | 226 | US |
| México | 137 | MX |
| Brasil | 37 | BR |
| Panamá | 155 | PA |
| Ecuador | 70 | EC |
| Perú | 156 | PE |
| Canadá | 41 | CA |
| España | 217 | ES |

## Paso 2: Especificar INCOTERM

El INCOTERM define quién paga transporte y seguros:

```json
{
  "export_information": {
    "incoterm_code": "FOB",                // Free on Board
    "incoterm_location": "Puerto de Buenaventura",
    "exchange_rate": 4000.00,              // TRM del día
    "reference_currency": 170              // Referencia a COP
  }
}
```

### INCOTERMS Comunes

| Código | Término | Significado | Riesgo |
|--------|---------|-------------|--------|
| **FOB** | Free on Board | Libre a bordo | Hasta el puerto |
| **CIF** | Cost, Insurance & Freight | Costo, seguro y flete | Incluye todo |
| **DDP** | Delivered Duty Paid | Entrega con derechos pagos | El vendedor paga todo |
| **EXW** | Ex Works | En fábrica | El comprador paga todo |
| **FCA** | Free Carrier | Franco transportista | Similar a FOB |
| **CPT** | Carriage Paid To | Porte pagado | Sin seguro |

## Paso 3: Estructura JSON Completa - Exportación

```json
{
  // === IDENTIFICACIÓN ===
  "resolution_number": "18764074347312",
  "prefix": "FEV",
  "document_number": 2010,
  "type_document_id": 2,                   // 2 = Exportación
  "operation_type_id": 2,                  // 2 = Exportación
  
  // === FECHAS ===
  "date": "2024-10-17",
  "time": "15:30:00",
  
  // === MONEDA EXTRANJERA ===
  "currency_id": 840,                      // USD
  
  // === EMISOR ===
  "issuer": {
    "tax_id": "9001234567",
    "name": "EXPORTADORA COLOMBIANA SAS",
    "address": "Calle 72 #50-40",
    "city": "Medellín",
    "country_id": "169",
    "tax_regime_id": 1,
    "email": "exports@exportadora.com.co"
  },
  
  // === CLIENTE EXTERIOR ===
  "customer": {
    "identity_document_id": "3",
    "document_number": "AB12345678",
    "company_name": "ABC DISTRIBUTORS INC",
    "address": "123 Main Street",
    "city": "New York",
    "country_id": "226",                   // USA
    "email": "buyer@abcdist.us"
  },
  
  // === INFORMACIÓN DE EXPORTACIÓN ===
  "export_information": {
    "incoterm_code": "FOB",
    "incoterm_location": "Puerto de Buenaventura",
    "exchange_rate": 4000.00,
    "reference_currency": 170,
    "customs_declaration": "2024100001234",
    "transport_method": "SEA"               // SEA, AIR, LAND, RAIL
  },
  
  // === LÍNEAS DE PRODUCTOS ===
  "lines": [
    {
      "description": "COFFEE BEANS - 100% COLOMBIAN ARABICA",
      "code": "COFFEE-001",
      "quantity": 1000,
      "quantity_units_id": "1115",          // kg (kilogramos)
      "unit_price": 50.00,                  // USD
      "line_extension_amount": 50000.00,
      
      // === IVA EN EXPORTACIÓN: 0% ===
      "taxes": [
        {
          "tax_type_id": 1,
          "tax_percentage": 0,              // EXENTO
          "tax_amount": 0.00
        }
      ]
    },
    {
      "description": "FLOWER ARRANGEMENTS - FRESH CUT",
      "code": "FLOWER-001",
      "quantity": 500,
      "quantity_units_id": "1093",          // Unidad
      "unit_price": 15.00,
      "line_extension_amount": 7500.00,
      
      "taxes": [
        {
          "tax_type_id": 1,
          "tax_percentage": 0,              // EXENTO
          "tax_amount": 0.00
        }
      ]
    }
  ],
  
  // === TOTALES ===
  "totals": {
    "subtotal": 57500.00,                  // En USD
    "total_discount": 0.00,
    "total_tax": 0.00,                     // Sin impuestos
    "payable_amount": 57500.00,            // En USD
    
    // === REFERENCIA EN COP ===
    "payable_amount_cop": 230000000.00     // 57500 × 4000
  },
  
  // === FORMA DE PAGO ===
  "payments": [
    {
      "payment_method_id": "10",           // Transferencia
      "means_payment_id": "42",
      "currency_id": 840,                  // USD
      "value_paid": 57500.00,
      "payment_due_date": "2024-11-17"     // 30 días
    }
  ],
  
  "notes": "Exportación a USA - FOB Puerto de Buenaventura"
}
```

## Paso 4: Certificados y Documentos

Para exportación, posiblemente necesites:

### Certificados de Origen
- ✅ Certificado de Origen (CO)
- ✅ Certificado Fitosanitario (si aplica)
- ✅ Análisis de Calidad

```json
{
  "certificates": [
    {
      "type": "ORIGIN",
      "number": "CO-2024-123456",
      "issuer": "CÁMARA DE COMERCIO"
    },
    {
      "type": "PHYTOSANITARY",
      "number": "ICA-2024-789012",
      "issuer": "INSTITUTO COLOMBIANO AGROPECUARIO"
    }
  ]
}
```

## Paso 5: Validaciones Especiales

La API validará:

✅ Moneda ≠ COP (170)
✅ Cliente es del exterior
✅ IVA = 0%
✅ INCOTERM especificado
✅ TRM válido y actual

## Comparativa: Nacional vs Exportación

| Aspecto | Nacional | Exportación |
|---------|----------|------------|
| **Tipo Doc** | 7 | 2 |
| **Operación** | 1 | 2 |
| **Moneda** | COP (170) | USD (840), EUR (978), etc. |
| **IVA** | 19% | 0% (Exento) |
| **INCOTERM** | No aplica | Obligatorio |
| **Cliente** | Colombia | Exterior |
| **Forma Pago** | Diversas | Generalmente a plazo |

## Paso 6: Validar y Enviar

```bash
# Validar
curl -X POST https://api.matias.com/api/validate/invoice \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d @exportacion.json

# Enviar
curl -X POST https://api.matias.com/api/invoices/create \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d @exportacion.json
```

## Errores Comunes en Exportación

### ❌ Error: "Moneda debe ser diferente de COP"
```json
// INCORRECTO
{
  "currency_id": 170,  // COP en exportación
  "customer.country_id": "226"  // USA
}
```

**Solución**: Especifica USD (840) o EUR (978)

### ❌ Error: "IVA debe ser 0%"
```json
// INCORRECTO
{
  "taxes": [
    {
      "tax_percentage": 19  // No se aplica IVA
    }
  ]
}
```

**Solución**: Especifica 0% para exportaciones

### ❌ Error: "INCOTERM no especificado"
**Solución**: Agrega campo `incoterm_code`

## Checklist de Exportación

- [ ] Cliente en país diferente a Colombia
- [ ] Currency_id ≠ 170
- [ ] Type_document_id = 2
- [ ] Operation_type_id = 2
- [ ] IVA = 0%
- [ ] INCOTERM especificado
- [ ] TRM registrado
- [ ] Documentos certificados adjuntos
- [ ] Forma de pago internacional

## Próximos Pasos

- 📖 [Guía: Factura Simple](/docs/use-cases/simple-invoice)
- 📖 [Guía: Con Descuentos](/docs/use-cases/invoice-with-discounts)
- 📋 [Códigos DIAN](/docs/reference-tables/overview)

---

**Última actualización**: Octubre 2024
**Tiempo estimado**: 25 minutos
**Nivel de dificultad**: ⭐⭐⭐ Avanzado
