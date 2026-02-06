---
sidebar_position: 4
description: "Guía para identificar y solucionar errores comunes"
---

# ⚠️ Guía: Errores Comunes y Soluciones

## 📋 Introducción

Esta guía enumera los errores más frecuentes al trabajar con la API MATIAS de facturación electrónica y cómo solucionarlos. Los ejemplos están basados en estructuras reales del API.

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', margin: '1.5rem 0'}}>
  <div style={{padding: '1rem', backgroundColor: '#fff3cd', borderRadius: '8px', border: '2px solid #ffc107'}}>
    <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🔐</div>
    <strong>Autenticación</strong><br/>
    <small>Tokens, credenciales, permisos</small>
  </div>
  <div style={{padding: '1rem', backgroundColor: '#f8d7da', borderRadius: '8px', border: '2px solid #dc3545'}}>
    <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🧮</div>
    <strong>Cálculos</strong><br/>
    <small>Totales, impuestos, descuentos</small>
  </div>
  <div style={{padding: '1rem', backgroundColor: '#d1ecf1', borderRadius: '8px', border: '2px solid #17a2b8'}}>
    <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>👥</div>
    <strong>Clientes</strong><br/>
    <small>NIT, datos obligatorios</small>
  </div>
  <div style={{padding: '1rem', backgroundColor: '#e2e3e5', borderRadius: '8px', border: '2px solid #6c757d'}}>
    <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>📝</div>
    <strong>Estructura JSON</strong><br/>
    <small>Validación, campos requeridos</small>
  </div>
</div>

---

## 🔐 Errores de Autenticación

### ❌ "Unauthorized" / "invalid_token"

<div style={{backgroundColor: '#fff3cd', padding: '1rem', borderRadius: '8px', border: '1px solid #ffc107', marginBottom: '1rem'}}>
  <strong>⚠️ Error Común:</strong> Este es uno de los errores más frecuentes. Generalmente el token ha expirado.
</div>

**Respuesta del API:**
```json
{
  "success": false,
  "message": "Unauthorized - Token inválido o expirado"
}
```

**HTTP Status**: 401 - Unauthorized

**Causas posibles:**
1. Token OAuth2 ha expirado (duración: 90 días máximo)
2. Token no incluido en header Authorization
3. Credenciales email/password incorrectas
4. Token malformado o corrupto
5. Token revocado manualmente

**Solución:**
```bash
# 1. Obtener nuevo token
curl -X POST https://api-v2.matias-api.com/api/ubl2.1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tu-email@empresa.com",
    "password": "tu-contraseña",
    "remember_me": 0
  }'

# 2. Respuesta con nuevo token
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjM...",
  "user": {
    "id": 1,
    "email": "tu-email@empresa.com"
  },
  "expires_at": "2026-05-06 14:30:00",
  "success": true
}

# 3. Usar en requests posteriores
curl -X POST https://api-v2.matias-api.com/api/ubl2.1/invoices \
  -H "Authorization: Bearer YOUR_NEW_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{...}'
```

:::tip 💡 Pro tip
**Novedad v3.0.0:** Puedes crear **Personal Access Tokens** con duración configurable (1-90 días) para evitar estar renovando constantemente. [Ver guía de PAT](/docs/endpoints#personal-access-tokens)
:::

---

## 📝 Errores de Estructura JSON

### ❌ "Invalid JSON" / "Malformed request"

**Respuesta del API:**
```json
{
  "success": false,
  "message": "Invalid or malformed JSON"
}
```

**HTTP Status**: 400 - Bad Request

**Causa común - JSON inválido:**

Ejemplo de JSON malformado (falta cierre de llave):
```json
{
  "resolution_number": "18764074347312",
  "prefix": "LZT",
  "document_number": "2002"
}
```

**Solución:**
```json
{
  "resolution_number": "18764074347312",
  "prefix": "LZT",
  "document_number": "2002"
}
```

### ❌ "Campos requeridos faltantes"

**Respuesta del API:**
```json
{
  "success": false,
  "message": "Required field missing: lines"
}
```

**HTTP Status**: 400 - Bad Request

**📋 Campos obligatorios:**

<div style={{overflowX: 'auto', margin: '1rem 0'}}>

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|--------|
| `resolution_number` | string | 📜 Resolución DIAN de facturación | `"18764074347312"` |
| `prefix` | string | 🏷️ Prefijo registrado | `"FEV"`, `"FVD"` |
| `document_number` | string | 🔢 Número secuencial | `"2002"` |
| `type_document_id` | int | 📄 Tipo de documento | `7` (Factura) |
| `operation_type_id` | int | ⚙️ Tipo de operación | `1` (Estándar) |
| `customer` | object | 👤 Datos del cliente/comprador | `{...}` |
| `lines` | array | 📦 Ítems facturados | `[{...}]` |
| `legal_monetary_totals` | object | 💰 Totales finales | `{...}` |
| `payments` | array | 💳 Información de pago | `[{...}]` |

</div>

:::danger ⚠️ Importante
Verifica que el JSON incluya **todos estos campos** con valores válidos antes de enviar la solicitud.
:::

---

## 🆔 Errores de Validación de NIT

### ❌ "NIT con dígito verificador inválido"

**Respuesta del API:**
```json
{
  "success": false,
  "message": "El documento (cliente.dni) con numero 8001234567-8, no es valido"
}
```

**HTTP Status**: 422 - Unprocessable Entity

**Ejemplo:** NIT `8001234567-8` es inválido

**🧮 Algoritmo Colombiano Correcto:**

<div style={{backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', border: '1px solid #dee2e6', fontFamily: 'monospace', margin: '1rem 0'}}>
  <strong>Posición:</strong> 1  2  3  4  5  6  7  8  9<br/>
  <strong>Dígito:</strong>   8  0  0  1  2  3  4  5  6<br/>
  <strong>Peso:</strong>     3  7  13 17 19 23 29 37 41<br/><br/>
  
  <div style={{backgroundColor: '#e7f3ff', padding: '0.75rem', borderRadius: '4px', marginTop: '0.5rem'}}>
    8×3 + 0×7 + 0×13 + 1×17 + 2×19 + 3×23 + 4×29 + 5×37 + 6×41<br/>
    = 24 + 0 + 0 + 17 + 38 + 69 + 116 + 185 + 246<br/>
    = <strong>695</strong>
  </div>
  
  <div style={{backgroundColor: '#fff3cd', padding: '0.75rem', borderRadius: '4px', marginTop: '0.5rem'}}>
    695 ÷ 11 = 63 resto <strong>2</strong><br/>
    Dígito verificador = 11 - 2 = <strong style={{color: '#28a745'}}>9</strong>
  </div>
  
  <div style={{backgroundColor: '#d4edda', padding: '0.75rem', borderRadius: '4px', marginTop: '0.5rem', color: '#155724'}}>
    ✓ <strong>NIT correcto: 800123456-9</strong>
  </div>
</div>

**💡 Solución:**

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', margin: '1rem 0'}}>
  <div style={{padding: '1rem', backgroundColor: '#d4edda', borderRadius: '8px', border: '1px solid #28a745'}}>
    🔍 <strong>NITValidator</strong><br/>
    <small><a href="/docs/interactive-tools">Herramientas Interactivas</a></small>
  </div>
  <div style={{padding: '1rem', backgroundColor: '#e7f3ff', borderRadius: '8px', border: '1px solid #0066cc'}}>
    🧮 <strong>Cálculo Manual</strong><br/>
    <small>Usa el algoritmo anterior</small>
  </div>
</div>

---

## 🧮 Errores de Cálculo de Totales

### ❌ "Total no coincide"

<div style={{backgroundColor: '#f8d7da', padding: '1rem', borderRadius: '8px', border: '1px solid #dc3545', marginBottom: '1rem'}}>
  <strong>❌ Error Crítico:</strong> Uno de los errores más comunes al crear facturas. Revisa los cálculos cuidadosamente.
</div>

**Respuesta del API:**
```json
{
  "error": true,
  "errors": [
    {
      "field": "legal_monetary_totals",
      "message": "Total no coincide con suma de líneas"
    }
  ]
}
```

**Ejemplo incorrecto:**
```json
{
  "lines": [
    {
      "invoiced_quantity": "2",
      "price_amount": "100.00",
      "line_extension_amount": "200.00",
      "tax_totals": [
        {
          "tax_id": "1",
          "tax_amount": 38.00,
          "taxable_amount": 200.00,
          "percent": 19
        }
      ]
    }
  ],
  "legal_monetary_totals": {
    "line_extension_amount": "200.00",
    "tax_exclusive_amount": "200.00",
    "tax_inclusive_amount": "237.00",
    "payable_amount": 237.00
  }
}
```

**Respuesta del API:**
```json
{
  "success": false,
  "message": "La validación de tax_inclusive_amount es incorrecta. Se esperaba 238.00, se recibió 237.00"
}
```

**Corrección:**
```json
{
  "legal_monetary_totals": {
    "line_extension_amount": "200.00",
    "tax_exclusive_amount": "200.00",
    "tax_inclusive_amount": "238.00",
    "payable_amount": 238.00
  }
}
```

**🎯 Fórmula Correcta:**

<div style={{backgroundColor: '#d4edda', padding: '1rem', borderRadius: '8px', border: '1px solid #28a745', fontFamily: 'monospace', margin: '1rem 0'}}>
  <strong>tax_inclusive_amount</strong> = tax_exclusive_amount + SUMA(tax_totals[*].tax_amount)<br/>
  <strong>payable_amount</strong> = tax_inclusive_amount
</div>

### ❌ "Impuesto calculado incorrectamente"

**Respuesta del API:**
```json
{
  "error": true,
  "errors": [
    {
      "field": "lines[0].tax_totals",
      "message": "tax_amount no coincide con cálculo esperado"
    }
  ]
}
```

**Ejemplo incorrecto:**
```json
{
  "lines": [
    {
      "line_extension_amount": "100.00",
      "tax_totals": [
        {
          "tax_id": "1",
          "tax_amount": 20.00,          // ❌ INCORRECTO: 100 × 0.19 = 19
          "taxable_amount": 100.00,
          "percent": 19
        }
      ]
    }
  ]
}
```

**Corrección:**
```json
{
  "tax_totals": [
    {
      "tax_id": "1",
      "tax_amount": 19.00,
      "taxable_amount": 100.00,
      "percent": 19
    }
  ]
}
```
:::info 📊 Cálculo Correcto
100 × 0.19 = **19.00**
:::

**🎯 Fórmula:**

<div style={{backgroundColor: '#e7f3ff', padding: '1rem', borderRadius: '8px', border: '1px solid #0066cc', fontFamily: 'monospace', margin: '1rem 0'}}>
  <strong>tax_amount</strong> = taxable_amount × (percent / 100)
</div>

### ❌ "Descuento excede el monto"

**Respuesta del API:**
```json
{
  "success": false,
  "message": "Allowance/Charge amount cannot exceed line base amount"
}
```

**HTTP Status**: 422 - Unprocessable Entity

**Ejemplo incorrecto:**
```json
{
  "lines": [
    {
      "price_amount": "100.00",
      "allowance_charges": [
        {
          "amount": "150.00",
          "base_amount": "100.00",
          "charge_indicator": false
        }
      ]
    }
  ]
}
```

**Corrección:**
```json
{
  "allowance_charges": [
    {
      "amount": "50.00",
      "base_amount": "100.00",
      "charge_indicator": false
    }
  ]
}
```
:::tip ✅ Validación
El monto debe ser ≤ al monto base **(50 ≤ 100)** ✓
:::

---

## 👥 Errores de Validación de Cliente

### ❌ "Cliente no válido" / "Invalid party"

**Respuesta del API:**
```json
{
  "error": true,
  "errors": [
    {
      "field": "customer",
      "message": "Datos de cliente incompletos"
    }
  ]
}
```

**📋 Campos requeridos del cliente:**

<div style={{overflowX: 'auto', margin: '1rem 0'}}>

| Campo | Obligatorio | Ejemplo | Descripción |
|-------|------------|---------|-------------|
| `country_id` | ✅ Sí | `"45"` | 🌎 País (45 = Colombia) |
| `city_id` | ✅ Sí | `"76"` | 🏙️ Ciudad (76 = Cali) |
| `identity_document_id` | ✅ Sí | `"2"` | 🆔 Tipo documento (2 = NIT) |
| `type_organization_id` | ✅ Sí | `2` | 🏢 Tipo organización |
| `tax_regime_id` | ✅ Sí | `1` | 📊 Régimen tributario |
| `company_name` | ✅ Sí | `"CLIENTE LTDA"` | 🏷️ Razón social |
| `dni` | ✅ Sí | `"8001234567"` | 🔢 NIT sin dígito |
| `email` | ⚪ No | `"cliente@example.com"` | 📧 Email contacto |
| `mobile` | ⚪ No | `"3001234567"` | 📱 Teléfono móvil |
| `address` | ⚪ No | `"Calle 15 #8-30"` | 📍 Dirección física |

</div>

**Ejemplo correcto:**
```json
{
  "country_id": "45",
  "city_id": "76",
  "identity_document_id": "2",
  "type_organization_id": 2,
  "tax_regime_id": 1,
  "tax_level_id": 5,
  "company_name": "CLIENTE EMPRESA LTDA",
  "dni": "8001234567",
  "email": "compras@cliente.com",
  "address": "Calle 15 #8-30",
  "postal_code": "050001"
}
```

---

## 🔄 Errores de Factura Duplicada

### ❌ "Documento duplicado"

<div style={{backgroundColor: '#fff3cd', padding: '1rem', borderRadius: '8px', border: '1px solid #ffc107', marginBottom: '1rem'}}>
  <strong>⚠️ Atención:</strong> Intentas crear un documento con un número que ya existe en el sistema.
</div>

**Respuesta del API:**
```json
{
  "success": false,
  "message": "El documento (Factura electrónica) con numero LZT2002, ya se encuentra validado"
}
```

**HTTP Status**: 422 - Unprocessable Entity

**Causa:** El mismo `prefix` + `document_number` ya existe en el sistema

**💡 Soluciones:**

<div style={{display: 'grid', gap: '1rem', margin: '1rem 0'}}>
  <div style={{padding: '1rem', backgroundColor: '#d4edda', borderRadius: '8px', border: '1px solid #28a745'}}>
    <strong>✅ Opción 1: Incrementar número secuencial</strong><br/>
    <code style={{backgroundColor: '#f8d7da', padding: '0.25rem 0.5rem', borderRadius: '4px'}}>Actual: LZT-2002 ❌ Ya existe</code><br/>
    <code style={{backgroundColor: '#d4edda', padding: '0.25rem 0.5rem', borderRadius: '4px', marginTop: '0.5rem', display: 'inline-block'}}>Nuevo: LZT-2003 ✓ Use este</code>
  </div>
  
  <div style={{padding: '1rem', backgroundColor: '#e7f3ff', borderRadius: '8px', border: '1px solid #0066cc'}}>
    <strong>✅ Opción 2: Usar diferente prefijo</strong><br/>
    <code style={{backgroundColor: '#f8d7da', padding: '0.25rem 0.5rem', borderRadius: '4px'}}>Actual: LZT-2002 ❌ Ya existe</code><br/>
    <code style={{backgroundColor: '#d4edda', padding: '0.25rem 0.5rem', borderRadius: '4px', marginTop: '0.5rem', display: 'inline-block'}}>Nuevo: LZX-2002 ✓ Prefijo diferente</code>
  </div>
</div>

**Solución - Opción 3: Consultar documento anterior**
```bash
curl -X GET "https://api.matias-app.com/api/invoices?prefix=LZT&document_number=2002" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

:::warning 📜 IMPORTANTE
Los prefijos deben estar **registrados previamente** en tu resolución de facturación ante la DIAN.
:::

---

## 💱 Errores de Moneda y Exportación

### ❌ "Moneda inválida para exportación"

**Respuesta del API:**
```json
{
  "error": true,
  "errors": [
    {
      "field": "currency_id",
      "message": "No puedes usar COP en una exportación"
    }
  ]
}
```

<div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1rem 0'}}>
  <div>
    <strong style={{color: '#dc3545'}}>❌ Incorrecto:</strong>
    
```json
{
  "type_document_id": 8,       // Exportación
  "currency_id": 170,          // COP ❌
  "customer": { "country_id": "239" }  // USA
}
```
  </div>
  
  <div>
    <strong style={{color: '#28a745'}}>✅ Correcto:</strong>
    
```json
{
  "type_document_id": 8,       // Exportación
  "currency_id": 272,          // USD ✓
  "customer": { "country_id": "239" }  // USA
}
```
  </div>
</div>

### ❌ "IVA no permitido en exportación"

**Respuesta del API:**
```json
{
  "error": true,
  "errors": [
    {
      "field": "lines[0].tax_totals",
      "message": "Las exportaciones no pueden tener IVA"
    }
  ]
}
```

**Incorrecto:**
```json
{
  "tax_totals": [
    {
      "tax_id": "1",
      "tax_amount": 19.00,
      "percent": 19
    }
  ]
}
```

❌ **INCORRECTO**: Los documentos de exportación no pueden tener impuestos

**Correcto:**
```json
{
  "tax_totals": []
}
```

✓ **CORRECTO**: Array vacío para exportaciones

---

## 🎯 Matriz de Solución Rápida

<div style={{backgroundColor: '#e7f3ff', padding: '1.5rem', borderRadius: '8px', border: '2px solid #0066cc', margin: '1.5rem 0'}}>
  <h3 style={{marginTop: 0}}>⚡ Referencia Rápida de Errores</h3>
  <p>Encuentra rápidamente la solución al error que estás experimentando:</p>
</div>

<div style={{overflowX: 'auto'}}>

| 🔍 Síntoma | 🐛 Causa Probable | ✅ Solución |
|---------|---|---|
| `401 Unauthorized` | 🔐 Token expirado | 🔄 Obtén nuevo token |
| `invalid_json` | 📝 JSON malformado | ✔️ Valida sintaxis JSON |
| `NIT verificador inválido` | 🔢 Dígito incorrecto | 🔍 Usa herramienta NITValidator |
| `Total no coincide` | 🧮 Cálculo de suma | 📊 Valida con TotalCalculator |
| `Tax not calculated correctly` | 💰 Fórmula impuesto | 🎯 Usa: amount = base × (percent/100) |
| `Duplicate document` | 🔄 Factura duplicada | ➕ Incrementa number o cambia prefix |
| `Currency invalid for export` | 💱 Moneda incorrecta | 💵 Usa currency_id: 272 (USD) |
| `Tax not allowed in export` | 🌎 IVA en exportación | ❌ Usa tax_totals: [] |
| `Discount exceeds amount` | 🏷️ Descuento > base | ⚖️ Asegura que amount ≤ base_amount |
| `Required field missing` | 📋 Campo faltante | 📖 Consulta documentación |

</div>

---

## 🛠️ Herramientas Disponibles

<div style={{backgroundColor: '#d4edda', padding: '1.5rem', borderRadius: '8px', border: '2px solid #28a745', margin: '1.5rem 0'}}>
  <h3 style={{marginTop: 0}}>💡 Prevención de Errores</h3>
  <p>Para evitar errores, usa nuestras herramientas interactivas:</p>
  
  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem'}}>
    <div style={{padding: '1rem', backgroundColor: 'white', borderRadius: '6px'}}>
      🔍 <strong>NITValidator</strong><br/>
      <small>Valida y calcula dígito verificador</small>
    </div>
    <div style={{padding: '1rem', backgroundColor: 'white', borderRadius: '6px'}}>
      ✅ <strong>JSONValidator</strong><br/>
      <small>Valida estructura completa</small>
    </div>
    <div style={{padding: '1rem', backgroundColor: 'white', borderRadius: '6px'}}>
      🧮 <strong>TotalCalculator</strong><br/>
      <small>Calcula totales automáticamente</small>
    </div>
  </div>
  
  <div style={{marginTop: '1rem', textAlign: 'center'}}>
    <a href="/docs/interactive-tools" style={{color: '#155724', fontWeight: 'bold'}}>📱 Acceder a Herramientas →</a>
  </div>
</div>

---

## 🔬 Debugging

<div style={{backgroundColor: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', border: '1px solid #dee2e6', margin: '1.5rem 0'}}>
  <strong>🎯 Guía de Depuración Paso a Paso</strong><br/>
  Sigue estos pasos para identificar y resolver problemas:
</div>

### 📡 Paso 1: Verificar Respuesta Completa

```bash
curl -X POST https://api.matias-app.com/api/invoices \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d @factura.json \
  -v  # Modo verbose para ver toda la respuesta
```

### ✔️ Paso 2: Validar Localmente

```bash
# Instalar jq para parsear JSON
npm install -g jq

# Validar que el JSON sea válido
cat factura.json | jq empty
```

### 📚 Paso 3: Comparar con Ejemplo Real

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', margin: '1rem 0'}}>
  <a href="/docs/jsons-billing/invoice" style={{textDecoration: 'none', color: 'inherit'}}>
    <div style={{padding: '1rem', backgroundColor: '#e7f3ff', borderRadius: '8px', border: '1px solid #0066cc', cursor: 'pointer'}}>
      📄 <strong>Factura Simple</strong><br/>
      <small>Ejemplo básico</small>
    </div>
  </a>
  <a href="/docs/jsons-billing/invoice-with-discount" style={{textDecoration: 'none', color: 'inherit'}}>
    <div style={{padding: '1rem', backgroundColor: '#fff3cd', borderRadius: '8px', border: '1px solid #ffc107', cursor: 'pointer'}}>
      🏷️ <strong>Con Descuento</strong><br/>
      <small>Ejemplo con descuentos</small>
    </div>
  </a>
  <a href="/docs/jsons-billing/USD-invoice-exportation" style={{textDecoration: 'none', color: 'inherit'}}>
    <div style={{padding: '1rem', backgroundColor: '#d4edda', borderRadius: '8px', border: '1px solid #28a745', cursor: 'pointer'}}>
      🌎 <strong>Exportación</strong><br/>
      <small>Ejemplo internacional</small>
    </div>
  </a>
</div>

---

## 🎯 Próximos Pasos

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', margin: '2rem 0'}}>
  <a href="/docs/use-cases/simple-invoice" style={{textDecoration: 'none', color: 'inherit'}}>
    <div style={{padding: '1.5rem', backgroundColor: '#e7f3ff', borderRadius: '8px', border: '2px solid #0066cc', cursor: 'pointer', transition: 'transform 0.2s'}} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>📄</div>
      <strong>Factura Simple</strong><br/>
      <small>Guía básica paso a paso</small>
    </div>
  </a>
  <a href="/docs/use-cases/invoice-with-discounts" style={{textDecoration: 'none', color: 'inherit'}}>
    <div style={{padding: '1.5rem', backgroundColor: '#e7f3ff', borderRadius: '8px', border: '2px solid #0066cc', cursor: 'pointer', transition: 'transform 0.2s'}} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🏷️</div>
      <strong>Factura con Descuentos</strong><br/>
      <small>Descuentos comerciales</small>
    </div>
  </a>
  <a href="/docs/use-cases/export-scenarios" style={{textDecoration: 'none', color: 'inherit'}}>
    <div style={{padding: '1.5rem', backgroundColor: '#d4edda', borderRadius: '8px', border: '2px solid #28a745', cursor: 'pointer', transition: 'transform 0.2s'}} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🌎</div>
      <strong>Exportaciones</strong><br/>
      <small>Facturas internacionales</small>
    </div>
  </a>
  <a href="/docs/interactive-tools" style={{textDecoration: 'none', color: 'inherit'}}>
    <div style={{padding: '1.5rem', backgroundColor: '#fff3cd', borderRadius: '8px', border: '2px solid #ffc107', cursor: 'pointer', transition: 'transform 0.2s'}} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
      <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>🛠️</div>
      <strong>Herramientas</strong><br/>
      <small>Validadores y calculadoras</small>
    </div>
  </a>
</div>

---

<div style={{backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '8px', textAlign: 'center', marginTop: '2rem'}}>
  <small>
    📅 <strong>Última actualización:</strong> Febrero 2026 • 
    ⏱️ <strong>Tiempo estimado:</strong> 30 minutos • 
    🎯 <strong>Nivel:</strong> ⭐⭐ Intermedio
  </small>
</div>
