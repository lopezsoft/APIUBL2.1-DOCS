---
sidebar_position: 3
description: "Guía completa para emitir facturas de exportación y ventas internacionales"
---

# 🌎 Guía: Exportaciones e Internacionalización

## 📋 Introducción

Esta guía te enseñará cómo emitir facturas de **exportación**. Las facturas de exportación tienen características especiales: cliente en el exterior, moneda extranjera, y están exentas de IVA.

---

## 🎯 ¿Cuándo usar esta guía?

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', margin: '1rem 0'}}>
  <div style={{padding: '1rem', border: '2px solid #17a2b8', borderRadius: '8px', backgroundColor: '#e7f7f9'}}>
    ✅ <strong>Venta a cliente</strong> en el exterior
  </div>
  <div style={{padding: '1rem', border: '2px solid #17a2b8', borderRadius: '8px', backgroundColor: '#e7f7f9'}}>
    ✅ <strong>Transacción en moneda</strong> extranjera (USD, EUR)
  </div>
  <div style={{padding: '1rem', border: '2px solid #17a2b8', borderRadius: '8px', backgroundColor: '#e7f7f9'}}>
    ✅ <strong>Productos salen</strong> de Colombia
  </div>
  <div style={{padding: '1rem', border: '2px solid #17a2b8', borderRadius: '8px', backgroundColor: '#e7f7f9'}}>
    ✅ <strong>Cliente sin NIT</strong> colombiano
  </div>
  <div style={{padding: '1rem', border: '2px solid #17a2b8', borderRadius: '8px', backgroundColor: '#e7f7f9'}}>
    ✅ <strong>Requiere tasa</strong> de cambio especificada
  </div>
</div>

:::warning ⚠️ Punto Crítico
En API MATIAS, la exportación se marca con:
- 📑 **`type_document_id: 8`** (Factura de Exportación)
- 🔄 **`operation_type_id: 1`** (NO usar `operation_type_id: 2`)
:::

---

## 📦 Requisitos Previos

Antes de empezar, asegúrate de tener:

- ✅ Token de autenticación válido ([ver guía](/docs/intro#obtener-el-token-de-acceso))
- ✅ Resolución de facturación activa
- ✅ Información del cliente extranjero
- ✅ Tasa de cambio (TRM) del día
- ✅ Documentos de exportación (si aplica)

---

## 🔑 Características Clave de Exportación

<div style={{overflowX: 'auto'}}>

| Característica | Valor | 📝 Descripción |
|---|---|---|
| **Tipo de Documento** | `type_document_id: 8` | 🌎 Factura de Exportación |
| **Operación** | `operation_type_id: 1` | 🔄 Operación estándar |
| **Moneda** | `currency_id: 272` | 💵 Dólares USD (u otra moneda) |
| **IVA** | Exento (0%) | 🚫 Sin impuestos |
| **Cliente** | País ≠ Colombia | 🌍 Extranjero |
| **Tasa de Cambio** | `payment_exchange_rate` | 💱 TRM del día |

</div>

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

### 🌍 Códigos de País Comunes

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', margin: '1rem 0'}}>
  <div style={{padding: '0.75rem', backgroundColor: '#e7f3ff', borderRadius: '6px', border: '1px solid #0066cc'}}>
    🇺🇸 <strong>Estados Unidos:</strong> 239
  </div>
  <div style={{padding: '0.75rem', backgroundColor: '#e7f3ff', borderRadius: '6px', border: '1px solid #0066cc'}}>
    🇲🇽 <strong>México:</strong> 137
  </div>
  <div style={{padding: '0.75rem', backgroundColor: '#e7f3ff', borderRadius: '6px', border: '1px solid #0066cc'}}>
    🇧🇷 <strong>Brasil:</strong> 37
  </div>
  <div style={{padding: '0.75rem', backgroundColor: '#e7f3ff', borderRadius: '6px', border: '1px solid #0066cc'}}>
    🇵🇦 <strong>Panamá:</strong> 155
  </div>
  <div style={{padding: '0.75rem', backgroundColor: '#e7f3ff', borderRadius: '6px', border: '1px solid #0066cc'}}>
    🇪🇨 <strong>Ecuador:</strong> 70
  </div>
  <div style={{padding: '0.75rem', backgroundColor: '#e7f3ff', borderRadius: '6px', border: '1px solid #0066cc'}}>
    🇨🇦 <strong>Canadá:</strong> 41
  </div>
  <div style={{padding: '0.75rem', backgroundColor: '#e7f3ff', borderRadius: '6px', border: '1px solid #0066cc'}}>
    🇪🇸 <strong>España:</strong> 217
  </div>
</div>

### 📍 Tipos de Documento para Extranjeros

<div style={{overflowX: 'auto'}}>

| Código | Tipo de Documento | 📝 Uso |
|--------|------------------|------|
| `10` | **Pasaporte** | Personas naturales extranjeras |
| `3` | **Cédula Extranjería** | Extranjeros residentes en Colombia |
| `12` | **NIT Extranjero** | Empresas internacionales |

</div>

---

## 💱 Paso 2: Configurar Moneda y Tasa de Cambio

:::info TRM - Tasa Representativa del Mercado
Usa la **TRM oficial** del día de la transacción. Puedes consultarla en el [Banco de la República](https://www.banrep.gov.co/es/estadisticas/trm).
:::

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

### 📊 Descripción de Campos

<div style={{overflowX: 'auto'}}>

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|----------|
| `currency_id` | integer | 💵 Moneda del documento | `272` (USD) |
| `exchange_rate` | decimal | 💱 TRM del día (pesos/dólar) | `"4243.80"` |
| `base_rate` | decimal | 📊 Tasa base (igual a exchange_rate) | `"4243.80"` |
| `rate_date` | date | 📅 Fecha de la transacción | `"2025-05-05"` |
| `currency_id` (dentro) | integer | 💴 Moneda base (COP = 188) | `188` |

</div>

### 💵 Códigos de Moneda Comunes

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', margin: '1rem 0'}}>
  <div style={{padding: '0.75rem', backgroundColor: '#d4edda', borderRadius: '6px', border: '1px solid #28a745'}}>
    💵 <strong>USD (Dólar):</strong> 272
  </div>
  <div style={{padding: '0.75rem', backgroundColor: '#d4edda', borderRadius: '6px', border: '1px solid #28a745'}}>
    💶 <strong>EUR (Euro):</strong> 273
  </div>
  <div style={{padding: '0.75rem', backgroundColor: '#d4edda', borderRadius: '6px', border: '1px solid #28a745'}}>
    💴 <strong>COP (Peso):</strong> 170
  </div>
  <div style={{padding: '0.75rem', backgroundColor: '#d4edda', borderRadius: '6px', border: '1px solid #28a745'}}>
    💵 <strong>MXN (Peso MX):</strong> 274
  </div>
  <div style={{padding: '0.75rem', backgroundColor: '#d4edda', borderRadius: '6px', border: '1px solid #28a745'}}>
    💶 <strong>BRL (Real):</strong> 275
  </div>
</div>

---

## 📄 Paso 3: Ejemplo Real de Exportación

:::tip JSON Listo para Usar
Este es el JSON **real y completo** para una factura de exportación a Estados Unidos.
:::

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

### 🧮 Desglose de Cálculos

<div style={{backgroundColor: '#e7f3ff', padding: '1.5rem', borderRadius: '8px', border: '2px solid #0066cc', margin: '1rem 0'}}>
  <h4 style={{marginTop: 0}}>💰 Cálculo en USD</h4>
  <table style={{width: '100%', borderCollapse: 'collapse'}}>
    <tbody>
      <tr style={{borderBottom: '1px solid #dee2e6'}}>
        <td style={{padding: '0.5rem'}}>💵 Precio unitario (USD):</td>
        <td style={{padding: '0.5rem', textAlign: 'right'}}><strong>$4,243.80</strong></td>
      </tr>
      <tr style={{borderBottom: '1px solid #dee2e6'}}>
        <td style={{padding: '0.5rem'}}>📦 Cantidad:</td>
        <td style={{padding: '0.5rem', textAlign: 'right'}}><strong>1</strong></td>
      </tr>
      <tr style={{borderBottom: '2px solid #0066cc', backgroundColor: '#f0f7ff'}}>
        <td style={{padding: '0.5rem'}}>➕ Subtotal (USD):</td>
        <td style={{padding: '0.5rem', textAlign: 'right'}}><strong>$4,243.80</strong></td>
      </tr>
      <tr style={{borderBottom: '1px solid #dee2e6'}}>
        <td style={{padding: '0.5rem'}}>🚫 Impuesto:</td>
        <td style={{padding: '0.5rem', textAlign: 'right', color: '#6c757d'}}><strong>$0.00 (Exento)</strong></td>
      </tr>
      <tr style={{backgroundColor: '#d4edda', fontWeight: 'bold'}}>
        <td style={{padding: '0.5rem'}}>🎯 TOTAL (USD):</td>
        <td style={{padding: '0.5rem', textAlign: 'right', fontSize: '1.2rem', color: '#28a745'}}><strong>$4,243.80</strong></td>
      </tr>
    </tbody>
  </table>
</div>

<div style={{backgroundColor: '#fff3cd', padding: '1rem', borderRadius: '8px', border: '1px solid #ffc107', margin: '1rem 0'}}>
  <h4 style={{marginTop: 0}}>💱 Conversión a COP</h4>
  <div style={{fontSize: '1.1rem'}}>
    <strong>TRM:</strong> 4,243.80 COP/USD<br/>
    <strong>Equivalente en COP:</strong> $4,243.80 USD × 4,243.80 = <span style={{color: '#856404', fontWeight: 'bold'}}>~$18,000,000 COP</span>
  </div>
</div>

---

## 📦 Paso 4: Exportación con Múltiples Líneas

:::info Caso Real
Exportación de **textiles a México** con múltiples productos.
:::

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

---

## 🚀 Paso 5: Enviar a la API

:::warning 🔐 Requisito: Token de Autenticación
Asegúrate de tener un token válido. Si no tienes uno, [obtén tu token aquí](/docs/intro#obtener-el-token-de-acceso).
:::

```bash
curl -X POST https://api-v2.matias-api.com/api/ubl2.1/invoices \
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

:::tip ✅ Respuesta Exitosa
**Indicadores de éxito:**
- ✅ `success: true`
- ✅ `StatusCode: "00"`
- ✅ `IsValid: "true"`
- ✅ CUFE generado (`XmlDocumentKey`)
- ✅ URLs de PDF y XML disponibles
- ✅ Documento registrado en DIAN
:::

---

## 📃 Documentación Requerida para DIAN

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', margin: '1rem 0'}}>
  <div style={{padding: '1rem', backgroundColor: '#e7f3ff', borderRadius: '8px', border: '1px solid #0066cc'}}>
    ✅ <strong>Certificado de origen</strong><br/>
    <small>(si aplica según destino)</small>
  </div>
  <div style={{padding: '1rem', backgroundColor: '#e7f3ff', borderRadius: '8px', border: '1px solid #0066cc'}}>
    ✅ <strong>Documentos de aduanas</strong><br/>
    <small>Declaración de exportación</small>
  </div>
  <div style={{padding: '1rem', backgroundColor: '#e7f3ff', borderRadius: '8px', border: '1px solid #0066cc'}}>
    ✅ <strong>Declaración de exportación</strong><br/>
    <small>Formulario DIAN</small>
  </div>
  <div style={{padding: '1rem', backgroundColor: '#e7f3ff', borderRadius: '8px', border: '1px solid #0066cc'}}>
    ✅ <strong>Comprobante de cambio</strong><br/>
    <small>TRM aplicada</small>
  </div>
  <div style={{padding: '1rem', backgroundColor: '#e7f3ff', borderRadius: '8px', border: '1px solid #0066cc'}}>
    ✅ <strong>Comprobante de envío</strong><br/>
    <small>Guía internacional</small>
  </div>
</div>

---

## ✅ Validaciones Críticas

:::danger ⚠️ Verificar ANTES de Enviar
Estas validaciones son **obligatorias** para facturas de exportación:
:::

<div style={{backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', border: '2px solid #dc3545', margin: '1rem 0'}}>

### 🔐 Checklist de Validación

<div style={{display: 'grid', gap: '0.75rem'}}>
  <div style={{padding: '0.75rem', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #dee2e6'}}>
    ☐ <code>country_id</code> ≠ 45 (No es Colombia)<br/>
    <small style={{color: '#6c757d'}}>El cliente debe ser de un país diferente a Colombia</small>
  </div>
  <div style={{padding: '0.75rem', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #dee2e6'}}>
    ☐ <code>identity_document_id</code> es de extranjero (10, 3, 12)<br/>
    <small style={{color: '#6c757d'}}>Usar pasaporte, cédula extranjería o NIT extranjero</small>
  </div>
  <div style={{padding: '0.75rem', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #dee2e6'}}>
    ☐ <code>type_document_id: 8</code> (Exportación)<br/>
    <small style={{color: '#6c757d'}}>Tipo de documento específico para exportación</small>
  </div>
  <div style={{padding: '0.75rem', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #dee2e6'}}>
    ☐ <code>currency_id: 272</code> (USD) u otra moneda válida<br/>
    <small style={{color: '#6c757d'}}>Especificar moneda extranjera correcta</small>
  </div>
  <div style={{padding: '0.75rem', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #dee2e6'}}>
    ☐ <code>payment_exchange_rate</code> completado<br/>
    <small style={{color: '#6c757d'}}>TRM del día con todos los campos requeridos</small>
  </div>
  <div style={{padding: '0.75rem', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #dee2e6'}}>
    ☐ IVA = 0% (exento)<br/>
    <small style={{color: '#6c757d'}}>Las exportaciones no pagan IVA</small>
  </div>
  <div style={{padding: '0.75rem', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #dee2e6'}}>
    ☐ Totales = suma de líneas<br/>
    <small style={{color: '#6c757d'}}>Verificar cálculos de totales</small>
  </div>
  <div style={{padding: '0.75rem', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #dee2e6'}}>
    ☐ <code>payable_amount</code> = <code>tax_inclusive_amount</code><br/>
    <small style={{color: '#6c757d'}}>Monto a pagar coincide con total</small>
  </div>
</div>

</div>

---

## 🔧 Troubleshooting

### ❌ Error: "Invalid country for export"

<div style={{backgroundColor: '#fff3cd', padding: '1rem', borderRadius: '8px', border: '1px solid #ffc107', marginBottom: '1rem'}}>
  <strong>❌ Causa:</strong> <code>country_id</code> es 45 (Colombia)<br/>
  <strong>✅ Solución:</strong> Especifica un <code>country_id</code> válido del exterior (ej: 239 para USA)
</div>

### ❌ Error: "Currency mismatch"

<div style={{backgroundColor: '#fff3cd', padding: '1rem', borderRadius: '8px', border: '1px solid #ffc107', marginBottom: '1rem'}}>
  <strong>❌ Causa:</strong> Moneda no coincide entre línea y totales<br/>
  <strong>✅ Solución:</strong> Usa <code>currency_id: 272</code> (USD) en <strong>todo el documento</strong>
</div>

### ❌ Error: "Exchange rate required"

<div style={{backgroundColor: '#fff3cd', padding: '1rem', borderRadius: '8px', border: '1px solid #ffc107', marginBottom: '1rem'}}>
  <strong>❌ Causa:</strong> <code>payment_exchange_rate</code> no está definido<br/>
  <strong>✅ Solución:</strong> Añade <code>payment_exchange_rate</code> con TRM del día
</div>

### ❌ Error: "Tax not allowed for exports"

<div style={{backgroundColor: '#fff3cd', padding: '1rem', borderRadius: '8px', border: '1px solid #ffc107', marginBottom: '1rem'}}>
  <strong>❌ Causa:</strong> Se incluyó IVA en una exportación<br/>
  <strong>✅ Solución:</strong> Las exportaciones <strong>NO pagan IVA</strong>. Elimina <code>tax_totals</code> o ponlo vacío: <code>[]</code>
</div>

---

## 🎯 Próximos Pasos

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', margin: '2rem 0'}}>
  <a href="/docs/use-cases/simple-invoice" style={{textDecoration: 'none', color: 'inherit'}}>
    <div style={{padding: '1.5rem', backgroundColor: '#e7f3ff', borderRadius: '8px', border: '2px solid #0066cc', cursor: 'pointer', transition: 'transform 0.2s'}} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>📄</div>
      <strong>Factura Simple</strong><br/>
      <small>Guía básica nacional</small>
    </div>
  </a>
  <a href="/docs/use-cases/invoice-with-discounts" style={{textDecoration: 'none', color: 'inherit'}}>
    <div style={{padding: '1.5rem', backgroundColor: '#e7f3ff', borderRadius: '8px', border: '2px solid #0066cc', cursor: 'pointer', transition: 'transform 0.2s'}} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🏷️</div>
      <strong>Factura con Descuentos</strong><br/>
      <small>Descuentos comerciales</small>
    </div>
  </a>
  <a href="/docs/use-cases/common-errors" style={{textDecoration: 'none', color: 'inherit'}}>
    <div style={{padding: '1.5rem', backgroundColor: '#fff3cd', borderRadius: '8px', border: '2px solid #ffc107', cursor: 'pointer', transition: 'transform 0.2s'}} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>⚠️</div>
      <strong>Errores Comunes</strong><br/>
      <small>Troubleshooting</small>
    </div>
  </a>
  <a href="/docs/regulatory-framework/overview" style={{textDecoration: 'none', color: 'inherit'}}>
    <div style={{padding: '1.5rem', backgroundColor: '#d4edda', borderRadius: '8px', border: '2px solid #28a745', cursor: 'pointer', transition: 'transform 0.2s'}} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>📖</div>
      <strong>Marco Regulatorio</strong><br/>
      <small>Normativa DIAN</small>
    </div>
  </a>
</div>

---

<div style={{backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '8px', textAlign: 'center', marginTop: '2rem'}}>
  <small>
    📅 <strong>Última actualización:</strong> Febrero 2026 • 
    ⏱️ <strong>Tiempo estimado:</strong> 25 minutos • 
    🎯 <strong>Nivel:</strong> ⭐⭐⭐ Avanzado
  </small>
</div>
