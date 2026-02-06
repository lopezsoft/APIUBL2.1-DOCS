---
sidebar_position: 2
description: "Guía completa para emitir facturas electrónicas con descuentos comerciales"
---

# 🏷️ Guía: Factura con Descuentos

## 📋 Introducción

Esta guía te enseñará cómo emitir una factura electrónica **con descuentos comerciales**. Los descuentos se aplican a nivel de línea y reducen la base imponible para el cálculo de impuestos.

---

## 🎯 ¿Cuándo usar esta guía?

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', margin: '1rem 0'}}>
  <div style={{padding: '1rem', border: '2px solid #4CAF50', borderRadius: '8px', backgroundColor: '#f1f8f4'}}>
    ✅ <strong>Cliente mayorista</strong> con descuento
  </div>
  <div style={{padding: '1rem', border: '2px solid #4CAF50', borderRadius: '8px', backgroundColor: '#f1f8f4'}}>
    ✅ <strong>Descuento por volumen</strong> o promoción
  </div>
  <div style={{padding: '1rem', border: '2px solid #4CAF50', borderRadius: '8px', backgroundColor: '#f1f8f4'}}>
    ✅ <strong>Descuento comercial</strong> o rebaja
  </div>
  <div style={{padding: '1rem', border: '2px solid #4CAF50', borderRadius: '8px', backgroundColor: '#f1f8f4'}}>
    ✅ <strong>Operación con incentivo</strong> al cliente
  </div>
</div>

:::warning ⚠️ Punto Crítico
En el API MATIAS, los descuentos se aplican usando **`allowance_charges`** dentro de cada línea del producto, **NO** como campo separado global.
:::

---

## 📦 Requisitos Previos

Antes de empezar, asegúrate de tener:

- ✅ Token de autenticación válido ([ver guía](/docs/intro#obtener-el-token-de-acceso))
- ✅ Resolución de facturación activa
- ✅ Información completa del cliente
- ✅ Productos con precio base y porcentaje de descuento

---

## 🔧 Estructura de Descuentos en el API

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

### 📊 Descripción de Campos

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|----------|
| `amount` | decimal | **Valor del descuento** en dinero | `22.00` |
| `base_amount` | decimal | **Valor original** (price_amount × quantity) | `220.00` |
| `charge_indicator` | boolean | `false` = descuento, `true` = cargo | `false` |
| `allowance_charge_reason` | string | **Motivo del descuento** | `"Promocion"` |

---

## 🧮 La Matemática de Descuentos

La fórmula correcta es:

<div style={{backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', border: '2px solid #dee2e6', fontFamily: 'monospace', fontSize: '14px', margin: '1rem 0'}}>
  <div style={{marginBottom: '1rem'}}>
    <strong style={{color: '#0066cc'}}>PASO 1:</strong> PRECIO UNITARIO × CANTIDAD = SUBTOTAL
  </div>
  <div style={{textAlign: 'center', fontSize: '1.5rem', margin: '0.5rem 0', color: '#6c757d'}}>↓</div>
  <div style={{marginBottom: '1rem'}}>
    <strong style={{color: '#0066cc'}}>PASO 2:</strong> SUBTOTAL - DESCUENTO = VALOR FINAL
  </div>
  <div style={{textAlign: 'center', fontSize: '1.5rem', margin: '0.5rem 0', color: '#6c757d'}}>↓</div>
  <div style={{marginBottom: '1rem'}}>
    <strong style={{color: '#0066cc'}}>PASO 3:</strong> VALOR FINAL × TASA IVA = IMPUESTO
  </div>
  <div style={{textAlign: 'center', fontSize: '1.5rem', margin: '0.5rem 0', color: '#6c757d'}}>↓</div>
  <div>
    <strong style={{color: '#0066cc'}}>PASO 4:</strong> VALOR FINAL + IMPUESTO = TOTAL
  </div>
</div>

### 💡 Ejemplo Práctico

<div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1rem 0'}}>
  <div style={{padding: '1rem', backgroundColor: '#e7f3ff', borderRadius: '8px', border: '1px solid #0066cc'}}>
    <h4 style={{marginTop: 0, color: '#0066cc'}}>📊 Datos Iniciales</h4>
    <ul style={{listStyle: 'none', padding: 0}}>
      <li>💵 Precio unitario: <strong>$220.00</strong></li>
      <li>📦 Cantidad: <strong>1</strong></li>
      <li>➕ Subtotal: <strong>$220.00</strong></li>
    </ul>
  </div>
  <div style={{padding: '1rem', backgroundColor: '#d4edda', borderRadius: '8px', border: '1px solid #28a745'}}>
    <h4 style={{marginTop: 0, color: '#28a745'}}>✅ Resultado Final</h4>
    <ul style={{listStyle: 'none', padding: 0}}>
      <li>🏷️ Descuento (10%): <strong>$22.00</strong></li>
      <li>💰 Valor final: <strong>$198.00</strong></li>
      <li>📋 Impuesto (0%): <strong>$0.00</strong></li>
      <li>🎯 <strong>TOTAL: $198.00</strong></li>
    </ul>
  </div>
</div>

---

## 📄 Paso 1: Ejemplo Real del API

:::tip JSON Listo para Usar
Este es el JSON **real y completo** que acepta MATIAS API. Puedes copiarlo y adaptarlo a tu caso.
:::

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

---

## 🔍 Paso 2: Entender la Estructura

### 🎯 Campos Clave para Descuentos

Analicemos el JSON línea por línea:

<div style={{overflowX: 'auto'}}>

| Campo | Valor | Explicación | Fórmula |
|-------|-------|-------------|----------|
| `price_amount` | `220.00` | 💵 Precio SIN descuento | Precio base |
| `base_amount` | `220.00` | 📊 Base para descuento | `price_amount × quantity` |
| `amount` (descuento) | `22.00` | 🏷️ Valor del descuento | `220.00 × 0.10` (10%) |
| `line_extension_amount` | `198.00` | 💰 Precio FINAL | `220.00 - 22.00` |
| `charge_indicator` | `false` | ⬇️ Tipo de ajuste | `false` = descuento |

</div>

:::tip 💡 Regla de Oro
**`line_extension_amount`** siempre debe ser igual a: 
`(price_amount × quantity) - descuentos`
:::

---

## 🏪 Paso 3: Caso Mayorista con Descuento por Volumen

:::info Caso Real
Cliente mayorista que compra **100 unidades** y recibe **15% de descuento** por volumen.
:::

```json
{
  "resolution_number": "18764074347312",
  "prefix": "LZT",
  "document_number": "5045",
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

### 🧮 Desglose de Cálculos

<div style={{backgroundColor: '#fff3cd', padding: '1.5rem', borderRadius: '8px', border: '2px solid #ffc107', margin: '1rem 0'}}>
  <h4 style={{marginTop: 0}}>💰 Cálculo Paso a Paso</h4>
  <table style={{width: '100%', borderCollapse: 'collapse'}}>
    <tbody>
      <tr style={{borderBottom: '1px solid #dee2e6'}}>
        <td style={{padding: '0.5rem'}}>💵 Precio unitario:</td>
        <td style={{padding: '0.5rem', textAlign: 'right'}}><strong>$10,000.00</strong></td>
      </tr>
      <tr style={{borderBottom: '1px solid #dee2e6'}}>
        <td style={{padding: '0.5rem'}}>📦 Cantidad:</td>
        <td style={{padding: '0.5rem', textAlign: 'right'}}><strong>100</strong></td>
      </tr>
      <tr style={{borderBottom: '2px solid #ffc107', backgroundColor: '#fff9e6'}}>
        <td style={{padding: '0.5rem'}}>➕ Subtotal:</td>
        <td style={{padding: '0.5rem', textAlign: 'right'}}><strong>$1,000,000.00</strong></td>
      </tr>
      <tr style={{borderBottom: '1px solid #dee2e6'}}>
        <td style={{padding: '0.5rem'}}>🏷️ Descuento (15%):</td>
        <td style={{padding: '0.5rem', textAlign: 'right', color: '#dc3545'}}><strong>- $150,000.00</strong></td>
      </tr>
      <tr style={{borderBottom: '2px solid #ffc107', backgroundColor: '#fff9e6'}}>
        <td style={{padding: '0.5rem'}}>💰 Valor final:</td>
        <td style={{padding: '0.5rem', textAlign: 'right'}}><strong>$850,000.00</strong></td>
      </tr>
      <tr style={{borderBottom: '1px solid #dee2e6'}}>
        <td style={{padding: '0.5rem'}}>📊 IVA (19%):</td>
        <td style={{padding: '0.5rem', textAlign: 'right'}}><strong>+ $161,500.00</strong></td>
      </tr>
      <tr style={{backgroundColor: '#d4edda', fontWeight: 'bold'}}>
        <td style={{padding: '0.5rem'}}>🎯 TOTAL A PAGAR:</td>
        <td style={{padding: '0.5rem', textAlign: 'right', fontSize: '1.2rem', color: '#28a745'}}><strong>$1,011,500.00</strong></td>
      </tr>
    </tbody>
  </table>
</div>

---

## 🚀 Paso 4: Enviar a la API

:::warning 🔐 Requisito: Token de Autenticación
Asegúrate de tener un token válido. Si no tienes uno, [obtén tu token aquí](/docs/intro#obtener-el-token-de-acceso).
:::

```bash
curl -X POST https://api-v2.matias-api.com/api/ubl2.1/invoices \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d @factura-descuento.json
```

### Respuesta Exitosa
```json
{
  "message": "El documento ha sido procesado por la DIAN.",
  "send_to_queue": 0,
  "XmlDocumentKey": "d45f3b2ed042ce0e075891591c3b3a7ae3a9c176ca191dab1bd23e5cdd3b48b8c548a088dfcbe20ee7baa2bed2dccd48",
  "response": {
    "ErrorMessage": {
      "string": []
    },
    "IsValid": "true",
    "StatusCode": "00",
    "StatusDescription": "Procesado Correctamente.",
    "StatusMessage": "La Factura electrónica FEV2005, ha sido autorizada.",
    "XmlDocumentKey": "d45f3b2ed042ce0e075891591c3b3a7ae3a9c176ca191dab1bd23e5cdd3b48b8c548a088dfcbe20ee7baa2bed2dccd48",
    "XmlFileName": "fv09010914030002500000096"
  },
  "AttachedDocument": {
    "path": "1/ad/ad09010914030002500000042.xml",
    "url": "https://api-v2.matias-api.com/attachments/1/ad/ad09010914030002500000042.xml"
  },
  "pdf": {
    "path": "1/fv09010914030002500000096.pdf",
    "url": "https://api-v2.matias-api.com/pdf/1/fv09010914030002500000096.pdf"
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
:::

---

## 📝 Paso 5: Razones de Descuento Válidas

:::tip 💬 Descripción del Descuento
En el campo **`allowance_charge_reason`** usa una descripción clara del motivo del descuento:
:::

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', margin: '1rem 0'}}>
  <div style={{padding: '1rem', backgroundColor: '#e7f3ff', borderRadius: '8px', border: '1px solid #0066cc'}}>
    <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🎉</div>
    <strong>Promocion</strong><br/>
    <small>Descuento promocional</small>
  </div>
  <div style={{padding: '1rem', backgroundColor: '#e7f3ff', borderRadius: '8px', border: '1px solid #0066cc'}}>
    <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>📦</div>
    <strong>Volumen</strong><br/>
    <small>Descuento por cantidad</small>
  </div>
  <div style={{padding: '1rem', backgroundColor: '#e7f3ff', borderRadius: '8px', border: '1px solid #0066cc'}}>
    <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>⚡</div>
    <strong>Pronto pago</strong><br/>
    <small>Pago inmediato</small>
  </div>
  <div style={{padding: '1rem', backgroundColor: '#e7f3ff', borderRadius: '8px', border: '1px solid #0066cc'}}>
    <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🎁</div>
    <strong>Bonificacion</strong><br/>
    <small>Bonificación especial</small>
  </div>
  <div style={{padding: '1rem', backgroundColor: '#e7f3ff', borderRadius: '8px', border: '1px solid #0066cc'}}>
    <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>💰</div>
    <strong>Rebaja</strong><br/>
    <small>Rebaja comercial</small>
  </div>
</div>

---

## ✅ Validaciones Críticas

:::danger ⚠️ Verificar ANTES de Enviar
Estas validaciones son **obligatorias** para que la DIAN acepte tu factura:
:::

<div style={{backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', border: '2px solid #dc3545', margin: '1rem 0'}}>

### 🔐 Checklist de Validación

<div style={{display: 'grid', gap: '0.75rem'}}>
  <div style={{padding: '0.75rem', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #dee2e6'}}>
    ☐ <code>allowance_charges[].amount</code> ≤ <code>allowance_charges[].base_amount</code><br/>
    <small style={{color: '#6c757d'}}>El descuento no puede ser mayor al precio base</small>
  </div>
  <div style={{padding: '0.75rem', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #dee2e6'}}>
    ☐ <code>line_extension_amount</code> = <code>price_amount × quantity - descuentos</code><br/>
    <small style={{color: '#6c757d'}}>El valor final debe reflejar el descuento aplicado</small>
  </div>
  <div style={{padding: '0.75rem', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #dee2e6'}}>
    ☐ <code>tax_amount</code> = <code>taxable_amount × (percent / 100)</code><br/>
    <small style={{color: '#6c757d'}}>El impuesto se calcula sobre el valor CON descuento</small>
  </div>
  <div style={{padding: '0.75rem', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #dee2e6'}}>
    ☐ <code>tax_exclusive_amount</code> = suma de <code>line_extension_amount</code><br/>
    <small style={{color: '#6c757d'}}>Total sin impuestos = suma de líneas finales</small>
  </div>
  <div style={{padding: '0.75rem', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #dee2e6'}}>
    ☐ <code>tax_inclusive_amount</code> = <code>tax_exclusive_amount + impuestos</code><br/>
    <small style={{color: '#6c757d'}}>Total con impuestos incluidos</small>
  </div>
  <div style={{padding: '0.75rem', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #dee2e6'}}>
    ☐ <code>payable_amount</code> = <code>tax_inclusive_amount</code><br/>
    <small style={{color: '#6c757d'}}>Monto a pagar = total con impuestos</small>
  </div>
  <div style={{padding: '0.75rem', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #dee2e6'}}>
    ☐ <code>charge_indicator</code> = <code>false</code> para descuentos<br/>
    <small style={{color: '#6c757d'}}>false = descuento, true = cargo adicional</small>
  </div>
</div>

</div>

---

## 🔧 Troubleshooting

### ❌ Error: "allowance_charges amount exceeds base amount"

<div style={{backgroundColor: '#fff3cd', padding: '1rem', borderRadius: '8px', border: '1px solid #ffc107', marginBottom: '1rem'}}>
  <strong>❌ Causa:</strong> El descuento es mayor al precio original<br/>
  <strong>✅ Solución:</strong> Verifica que <code>amount</code> ≤ <code>base_amount</code>
</div>

### ❌ Error: "Tax calculated on wrong amount"

<div style={{backgroundColor: '#fff3cd', padding: '1rem', borderRadius: '8px', border: '1px solid #ffc107', marginBottom: '1rem'}}>
  <strong>❌ Causa:</strong> Impuesto calculado sobre el precio SIN descuento<br/>
  <strong>✅ Solución:</strong> Calcula impuesto sobre <code>line_extension_amount</code> (después del descuento)
</div>

### ❌ Error: "Total mismatch"

<div style={{backgroundColor: '#fff3cd', padding: '1rem', borderRadius: '8px', border: '1px solid #ffc107', marginBottom: '1rem'}}>
  <strong>❌ Causa:</strong> Los totales no coinciden<br/>
  <strong>✅ Solución:</strong> Usa la <a href="/docs/interactive-tools">herramienta TotalCalculator</a> para validar
</div>

---

## 🎯 Próximos Pasos

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', margin: '2rem 0'}}>
  <a href="/docs/use-cases/simple-invoice" style={{textDecoration: 'none', color: 'inherit'}}>
    <div style={{padding: '1.5rem', backgroundColor: '#e7f3ff', borderRadius: '8px', border: '2px solid #0066cc', cursor: 'pointer', transition: 'transform 0.2s'}} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>📄</div>
      <strong>Factura Simple</strong><br/>
      <small>Guía básica sin descuentos</small>
    </div>
  </a>
  <a href="/docs/use-cases/export-scenarios" style={{textDecoration: 'none', color: 'inherit'}}>
    <div style={{padding: '1.5rem', backgroundColor: '#e7f3ff', borderRadius: '8px', border: '2px solid #0066cc', cursor: 'pointer', transition: 'transform 0.2s'}} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🌎</div>
      <strong>Exportación</strong><br/>
      <small>Facturas internacionales</small>
    </div>
  </a>
  <a href="/docs/use-cases/common-errors" style={{textDecoration: 'none', color: 'inherit'}}>
    <div style={{padding: '1.5rem', backgroundColor: '#fff3cd', borderRadius: '8px', border: '2px solid #ffc107', cursor: 'pointer', transition: 'transform 0.2s'}} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>⚠️</div>
      <strong>Errores Comunes</strong><br/>
      <small>Troubleshooting</small>
    </div>
  </a>
  <a href="/docs/interactive-tools" style={{textDecoration: 'none', color: 'inherit'}}>
    <div style={{padding: '1.5rem', backgroundColor: '#d4edda', borderRadius: '8px', border: '2px solid #28a745', cursor: 'pointer', transition: 'transform 0.2s'}} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🧮</div>
      <strong>Calculadora</strong><br/>
      <small>Herramientas interactivas</small>
    </div>
  </a>
</div>

---

<div style={{backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '8px', textAlign: 'center', marginTop: '2rem'}}>
  <small>
    📅 <strong>Última actualización:</strong> Febrero 2026 • 
    ⏱️ <strong>Tiempo estimado:</strong> 20 minutos • 
    🎯 <strong>Nivel:</strong> ⭐⭐ Intermedio
  </small>
</div>
