---
sidebar_position: 5
description: "Casos especiales y escenarios avanzados en Factura Electrónica"
---

# Casos Especiales

## 🛍️ Casos de Venta al Detal (POS Electrónico)

### ¿Qué es POS Electrónico?

Sistema de facturación en punto de venta que emite Factura Electrónica de forma inmediata al cliente.

**Características:**
- ✅ Emisión en tiempo real
- ✅ Válida para consumidor final
- ✅ Múltiples pagos en una transacción
- ✅ Resumen diario ante DIAN

---

### Validaciones Especiales para POS

**Campo de cliente:**
```json
{
  "customer_id_type": "13",           // 13 = Cédula de Ciudadanía
  "customer_id": "123456789",
  "customer_name": "CONSUMIDOR FINAL",
  // O datos reales si se identifica
}
```

**Múltiples formas de pago en una transacción:**
```json
{
  "payment_methods": [
    {
      "method": "1",           // Efectivo
      "amount": 50000,
      "payment_date": "2025-10-17"
    },
    {
      "method": "2",           // Cheque
      "amount": 50000,
      "payment_date": "2025-10-20"
    }
  ]
}
```

---

### Características de Documento POS

| Aspecto | POS | Factura Normal |
|--------|-----|---------|
| Cliente | Puede ser anónimo | Datos completos |
| Pago | Múltiples formas | Generalmente una |
| Frecuencia | Decenas/minuto | Varias al día |
| Resumen | Sí, diariamente | No, individual |
| Importe | Generalmente bajo | Variable |

---

### Ejemplo de Factura POS

```json
{
  "invoice_number": "POS-001",
  "issue_date": "2025-10-17",
  "issue_time": "14:32:15",
  "customer": {
    "id_type": "13",
    "id": "123456789",
    "name": "CONSUMIDOR FINAL"
  },
  "lines": [
    {
      "description": "Chocolate Caliente",
      "quantity": 1,
      "unit_price": 8500,
      "line_extension": 8500
    },
    {
      "description": "Croissant",
      "quantity": 2,
      "unit_price": 7000,
      "line_extension": 14000
    }
  ],
  "subtotal": 22500,
  "tax": 4275,
  "total": 26775,
  "payment_methods": [
    {
      "method": "1",           // Efectivo
      "amount": 26775
    }
  ]
}
```

---

## 🌍 Exportaciones (Artículos a Exterior)

### Características de Exportación

**Impuesto:**
- IVA: **0%** (Exento)
- Retefuente: Según país

**Validación obligatoria:**
```json
{
  "country_code": "840",         // 840 = USA, no 57 (Colombia)
  "tax_id": null,                // Sin IVA
  "percentage": 0,
  "tax_amount": 0
}
```

---

### Campos Obligatorios para Exportación

```json
{
  "invoice": {
    "issue_date": "2025-10-17",
    "customer": {
      "country_code": "840",              // País destino
      "city_code": "49000",               // Código ciudad USA
      "name": "Company International Inc.",
      "address": "123 Main Street"
    }
  },
  "lines": [
    {
      "description": "Widget Premium",
      "quantity": 1000,
      "unit": "94",                       // Unidad 94 = Boxes
      "price": 50,                        // USD
      "currency": "USD"
    }
  ],
  "currency_code": "USD",
  "exchange_rate": 4050,                  // TRM del día
  "payment_terms": "CIF Miami"            // Incoterm
}
```

---

### Incoterms para Exportación

| Incoterm | Significado | Responsabilidad Vendedor |
|----------|-------------|------------------------|
| **EXW** | Ex Works | Mínima (en fábrica) |
| **FCA** | Free Carrier | Hasta punto de carga |
| **FOB** | Free on Board | Hasta embarque |
| **CFR** | Cost & Freight | Hasta puerto destino |
| **CIF** | Cost, Insurance & Freight | Completa + seguros |
| **DDP** | Delivered Duty Paid | Máxima (entrega final) |

:::tip
El Incoterm afecta quién paga qué. Especifícalo correctamente.
:::

---

## 🚗 Venta de Vehículos Automotores

### Validaciones Especiales

**Impuesto especial:**
```json
{
  "taxes": [
    {
      "tax_id": 1,
      "percentage": 19,      // IVA estándar
      "amount": 2850000
    },
    {
      "tax_id": 4,
      "tax_type": "TIMBRE",
      "amount": 97500        // Impuesto de timbre (específico vehículos)
    }
  ]
}
```

---

### Datos Obligatorios del Vehículo

```json
{
  "item": {
    "description": "Vehículo - Toyota Corolla 2025",
    "reference": {
      "line_id": "VEH001",
      "brand": "Toyota",
      "model": "Corolla",
      "year": 2025,
      "color": "Blanco",
      "serial": "3FCPT5FH2L306445",
      "vin": "JTHAP0C8A85000001"
    },
    "unit_price": 85000000,
    "quantity": 1
  }
}
```

**Campos de referencia:**
- `brand`: Marca del vehículo
- `model`: Modelo exacto
- `year`: Año de fabricación
- `serial`: Número de serie
- `vin`: Vehicle Identification Number

:::warning
El VIN debe coincidir con documento de propiedad (SOAT/RCV).
:::

---

## 🍺 Productos Regulados (Alcohol, Cigarrillos)

### Impuestos Específicos

**Artículos sujetos a regulación:**

| Producto | Impuesto | Adicional |
|----------|----------|-----------|
| Cerveza | 19% IVA | Consumo 26.5% |
| Licor | 19% IVA | Consumo 30% |
| Cigarrillos | 19% IVA | Consumo 15% |
| Hidrocarburos | 0% IVA | Consumo específico |

---

### Estructura de Precios - Alcohol

```json
{
  "item": "Cerveza Pilsen 6x355ml",
  "subtotal": 15000,
  "tax_iva": 2850,              // 19%
  "tax_consumo": 3975,          // 26.5% sobre subtotal
  "total": 21825
}
```

**Cálculo correcto:**
```
Subtotal:       $15,000
+ IVA 19%:      $ 2,850
Subtotal + IVA: $17,850
+ Consumo 26.5%: $ 3,975 (aplicado sobre base original)
━━━━━━━━━━━━━━━━━━━━━━
Total:          $21,825
```

:::warning
El impuesto de consumo se calcula sobre el subtotal, NO sobre el subtotal + IVA.
:::

---

### Marcación de Productos Regulados

```json
{
  "items": [
    {
      "description": "Cerveza importada",
      "additional_data": {
        "regulated": true,
        "regulation_type": "ALCOHOL",
        "sanitary_registration": "INV-2025-001234",
        "batch": "LOTE-2025-04-001"
      }
    }
  ]
}
```

---

## 💊 Servicios Profesionales (Abogados, Ingenieros, Médicos)

### Retefuente Aplicable

```json
{
  "professional_service": {
    "description": "Asesoría Legal - Análisis de Contrato",
    "professional": "Dr. Juan García",
    "license": "12345",
    "hours": 5,
    "rate": 200000,           // Por hora
    "subtotal": 1000000
  },
  "tax": {
    "type": "RETEFUENTE",
    "percentage": 2,          // Servicios profesionales
    "amount": 20000           // 2% retención
  },
  "net_amount": 980000        // Cliente recibe esto
}
```

---

### Información Requerida

| Campo | Requerido | Ejemplo |
|-------|-----------|---------|
| Descripción Servicio | ✅ Sí | "Asesoría Legal" |
| Horas/Días | ✅ Sí | "5 horas" |
| Tarifa | ✅ Sí | "$200,000/hora" |
| Profesional | ✅ Sí | "Dr. Juan García" |
| Cédula Profesional | ✅ Sí | "12345" |
| Retefuente | ✅ Sí | 2% |

:::tip
Algunos servicios son **exentos de IVA**:
- Servicios de salud
- Servicios educativos
- Servicios financieros
:::

---

## 🏢 Factura entre Empresas Relacionadas

### Documentación Adicional Requerida

```json
{
  "supplier_relationship": {
    "relationship_type": "CONTROLADOR_CONTROLADA",
    "related_party": true,
    "relationship_description": "Matriz-Filial",
    "transfer_pricing_year": 2025
  }
}
```

**Tipos de relación DIAN:**
- Matriz-Filial
- Hermanas
- Controladora-Controlada
- Asociados
- Fiduciarios

:::warning
Las operaciones entre relacionadas pueden tener **precios de transferencia** regulados.
Conserva documentación del análisis de precios (TP).
:::

---

### Validaciones Especiales

```json
{
  "items": [
    {
      "description": "Componentes para ensamble",
      "quantity": 1000,
      "unit_price": 45000,
      "transfer_pricing_reference": "TP-2025-DOC-001",
      "justification": "Comparabilidad con mercado independiente"
    }
  ]
}
```

---

## 📱 Servicios Digitales

### Aplicable a Plataformas Online

```json
{
  "invoice": {
    "description": "Suscripción Streaming Premium - 30 días",
    "item_type": "DIGITAL_SERVICE",
    "delivery_method": "DIGITAL",
    "recipient": {
      "email": "cliente@example.com"
    }
  },
  "lines": [
    {
      "description": "Acceso Premium 1 mes",
      "quantity": 1,
      "unit": "MES",
      "price": 29900,
      "tax": 5681          // IVA 19%
    }
  ]
}
```

**Características:**
- Entrega: Inmediata (digital)
- Activación: Automática
- Evidencia: Email de confirmación
- Rescisión: Posible en período de prueba

---

## 🔗 Documentos Relacionados (Referenciamiento)

### Cuando una Factura Referencias Otra

```json
{
  "invoice": {
    "number": "FEV-2025",
    "references": [
      {
        "type": "ANTERIOR",
        "document_id": "FEV-2024",
        "document_date": "2025-09-01",
        "amount": 5000000,
        "reason": "Complementación de factura anterior"
      }
    ]
  }
}
```

**Casos de uso:**
- Factura complementaria
- Corrección de error anterior
- Consolidación de múltiples documentos

---

## 🎓 Operaciones Contado vs Crédito con Garantía

### Factura con Garantía

```json
{
  "payment": {
    "method": "2",                    // Crédito
    "due_date": "2025-11-17",
    "terms": "Net 30",
    "guarantee": {
      "type": "PRENDA",               // Prenda (garantía de mueble)
      "value": 5000000,               // Valor garantizado
      "description": "Maquinaria"
    }
  }
}
```

**Tipos de garantía:**
- Prenda
- Hipoteca
- Fianza
- Contrato de seguro

:::tip
Conserva copia del contrato de garantía para auditoría.
:::

---

## 💰 Facturas en Moneda Extranjera

### Validación de TRM

```json
{
  "invoice": {
    "currency": "USD",
    "amount_currency": 5000,
    "exchange_rate": 4050,            // TRM Banrep del día
    "amount_cop": 20250000,
    "exchange_date": "2025-10-17",
    "exchange_source": "BANREP"
  }
}
```

**Monedas soportadas:**
- USD - Dólar Estadounidense
- EUR - Euro
- CAD - Dólar Canadiense
- MXN - Peso Mexicano
- BRL - Real Brasileño

**Regla importante:**
- TRM debe ser la del día de emisión
- Consulta Banco de la República: www.banrep.gov.co

:::warning
Usar TRM incorrecta causa rechazo por DIAN.
:::

---

## 📦 Operaciones de Consignación

### Factura de Envío a Consignación

```json
{
  "invoice": {
    "type": "FACTURA_A_CONSIGNACION",
    "consignment_terms": {
      "consignee": "Nombre Distribuidor",
      "consignee_id": "987654321",
      "estimated_sell_date": "2025-12-31",
      "return_deadline": "2025-12-31",
      "payment_deadline": "2026-01-31"
    },
    "items": [
      {
        "description": "Producto en Consignación",
        "quantity": 100,
        "unit_price": 10000,
        "consignment_value": 1000000
      }
    ]
  }
}
```

---

### Nota Crédito en Consignación (Devolución)

```json
{
  "credit_note": {
    "type": "DEVOLUCION_CONSIGNACION",
    "references": {
      "original_invoice": "FEV-2025",
      "returned_quantity": 30,
      "reason": "No se vendieron"
    }
  }
}
```

---

## 🔄 Rectificativas (Correcciones)

### Nota Crédito vs Nota Débito

**Nota Crédito (Reduce deuda):**
```json
{
  "type": "NOTA_CREDITO",
  "reason": "Devolución parcial",
  "original_invoice": "FEV-2025",
  "items_returned": [
    {
      "description": "Producto defectuoso",
      "quantity": 5,
      "unit_price": 100000,
      "reason": "CALIDAD_DEFECTUOSA"
    }
  ]
}
```

**Nota Débito (Aumenta deuda):**
```json
{
  "type": "NOTA_DEBITO",
  "reason": "Ajuste por error de cantidad",
  "original_invoice": "FEV-2025",
  "adjustment": {
    "quantity_corrected": 10,     // En lugar de 5
    "difference": 500000          // Adicional a cobrar
  }
}
```

---

## 📋 Checklist para Casos Especiales

### Antes de Emitir

- ✅ Identifica tipo de caso especial
- ✅ Verifica impuestos aplicables
- ✅ Confirma datos del cliente
- ✅ Valida documentación adicional
- ✅ Calcula correctamente impuestos
- ✅ Prueba en ambiente de desarrollo
- ✅ Emite en producción
- ✅ Guarda copia XML + PDF
- ✅ Documenta en registros contables

---

## 🆘 Errores Comunes en Casos Especiales

| Error | Causa | Solución |
|-------|-------|---------|
| Impuesto incorrecto | Desconocimiento de regulación | Consultar tabla de impuestos |
| Cliente incorrecto | Datos no validados | Verificar documento de identidad |
| Moneda errada | TRM equivocada | Usar TRM Banrep del día |
| Referencias incompletas | No documentado | Incluir referencias COMPLETAS |
| Garantía faltante | Olvidada en estructura | Documentar garantía siempre |

---

**Última actualización**: Octubre 2025  
**Vigencia**: Actual  
**Casos no cubiertos**: Contacta al equipo de soporte
