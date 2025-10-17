---
sidebar_position: 4
description: "Guía para identificar y solucionar errores comunes"
---

# Guía: Errores Comunes y Soluciones

## Introducción

Esta guía enumera los errores más frecuentes al trabajar con la API MATIAS de facturación electrónica y cómo solucionarlos. Los ejemplos están basados en estructuras reales del API.

---

## Errores de Autenticación

### ❌ "Unauthorized" / "invalid_token"

**Respuesta del API:**
```json
{
  "success": false,
  "message": "Unauthorized - Token inválido o expirado"
}
```

**HTTP Status**: 401 - Unauthorized

**Causas posibles:**
1. Token OAuth2 ha expirado (generalmente 1 hora)
2. Token no incluido en header Authorization
3. Credenciales client_id/client_secret incorrectas
4. Token malformado o corrupto

**Solución:**
```bash
# 1. Obtener nuevo token
curl -X POST https://api.matias-app.com/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "grant_type=client_credentials"

# 2. Respuesta con nuevo token
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}

# 3. Usar en requests posterior
curl -X POST https://api.matias-app.com/api/invoices \
  -H "Authorization: Bearer YOUR_NEW_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{...}'
```

:::tip
**Pro tip:** Guarda la fecha/hora de expiración del token. Obtén uno nuevo 5 minutos antes de que expire.
:::

---

## Errores de Estructura JSON

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
// INCORRECTO - Falta cierre de llaves
{
  "resolution_number": "18764074347312",
  "prefix": "FEV",
  "document_number": "2001"
  // Falta cierre }
}
```

**Solución:**
```json
// CORRECTO
{
  "resolution_number": "18764074347312",
  "prefix": "FEV",
  "document_number": "2001"
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

**Campos obligatorios:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `resolution_number` | string | Resolución DIAN de facturación |
| `prefix` | string | Prefijo registrado (ej: FEV, FVD) |
| `document_number` | string | Número secuencial del documento |
| `type_document_id` | int | Tipo de documento (7=Factura) |
| `operation_type_id` | int | Tipo de operación (1=Estándar) |
| `customer` | object | Datos del cliente/comprador |
| `lines` | array | Ítems facturados |
| `legal_monetary_totals` | object | Totales finales |
| `payments` | array | Información de pago |

**Solución:** Verifica que el JSON incluya todos estos campos con valores válidos.

---

## Errores de Validación de NIT

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

**Algoritmo Colombiano Correcto:**
Posición: 1 2 3 4 5 6 7 8 9
Dígito:   8 0 0 1 2 3 4 5 6
Peso:     3 7 13 17 19 23 29 37 41

8×3  + 0×7  + 0×13 + 1×17 + 2×19 + 3×23 + 4×29 + 5×37 + 6×41
= 24 + 0   + 0    + 17   + 38   + 69   + 116  + 185  + 246
= 695

695 ÷ 11 = 63 resto 2
Dígito verificador = 11 - 2 = 9

✓ NIT correcto: 800123456-9
```

**Solución:**
- Usa la herramienta **NITValidator** en [Herramientas Interactivas](/docs/interactive-tools)
- O calcula manualmente usando el algoritmo anterior

---

## Errores de Cálculo de Totales

### ❌ "Total no coincide"

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

**Fórmula Correcta:**
```
tax_inclusive_amount = tax_exclusive_amount + SUMA(tax_totals[*].tax_amount)
payable_amount = tax_inclusive_amount
```

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
      "tax_amount": 19.00,              // ✓ CORRECTO: 100 × 0.19 = 19.00
      "taxable_amount": 100.00,
      "percent": 19
    }
  ]
}
```

**Fórmula:**
```
tax_amount = taxable_amount × (percent / 100)
```

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
      "amount": "50.00",                // ✓ CORRECTO: Menor o igual a base
      "base_amount": "100.00",
      "charge_indicator": false
    }
  ]
}
```

---

## Errores de Validación de Cliente

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

**Campos requeridos del cliente:**

| Campo | Obligatorio | Ejemplo |
|-------|------------|---------|
| `country_id` | Sí | "45" (Colombia) |
| `city_id` | Sí | "76" |
| `identity_document_id` | Sí | "2" |
| `type_organization_id` | Sí | 2 |
| `tax_regime_id` | Sí | 1 |
| `company_name` | Sí | "CLIENTE LTDA" |
| `dni` | Sí | "8001234567" |
| `email` | No | "cliente@example.com" |
| `mobile` | No | "3001234567" |
| `address` | No | "Calle 15 #8-30" |

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

## Errores de Factura Duplicada

### ❌ "Documento duplicado"

**Respuesta del API:**
```json
{
  "success": false,
  "message": "El documento (Factura electrónica) con numero FEV2001, ya se encuentra validado"
}
```

**HTTP Status**: 422 - Unprocessable Entity

**Causa:** El mismo `prefix` + `document_number` ya existe en el sistema

**Solución - Opción 1: Incrementar número secuencial**
```
Actual: FEV-2001  ❌ Ya existe
Nuevo:  FEV-2002  ✓ Use este
```

**Solución - Opción 2: Usar diferente prefijo**
```
Actual: FEV-2001  ❌ Ya existe
Nuevo:  FEX-2001  ✓ Prefijo diferente
```

**Solución - Opción 3: Consultar documento anterior**
```bash
curl -X GET "https://api.matias-app.com/api/invoices?prefix=FEV&document_number=2001" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

:::warning
**IMPORTANTE**: Los prefijos deben estar registrados previamente en tu resolución de facturación ante la DIAN.
:::

---

## Errores de Moneda y Exportación

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

**Incorrecto:**
```json
{
  "type_document_id": 8,       // Exportación
  "currency_id": 170,          // COP ❌
  "customer": { "country_id": "239" }  // USA
}
```

**Correcto:**
```json
{
  "type_document_id": 8,       // Exportación
  "currency_id": 272,          // USD ✓
  "customer": { "country_id": "239" }  // USA
}
```

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
      "percent": 19  // ❌ No permitido en exportación
    }
  ]
}
```

**Correcto:**
```json
{
  "tax_totals": []  // ✓ Array vacío
}
```

---

## Matriz de Solución Rápida

| Síntoma | Causa Probable | Solución |
|---------|---|---|
| `401 Unauthorized` | Token expirado | Obtén nuevo token |
| `invalid_json` | JSON malformado | Valida sintaxis JSON |
| `NIT verificador inválido` | Dígito incorrecto | Usa herramienta NITValidator |
| `Total no coincide` | Cálculo de suma | Valida con TotalCalculator |
| `Tax not calculated correctly` | Fórmula impuesto | Usa: amount = base × (percent/100) |
| `Duplicate document` | Factura duplicada | Incrementa number o cambia prefix |
| `Currency invalid for export` | Moneda incorrecta | Usa currency_id: 272 (USD) |
| `Tax not allowed in export` | IVA en exportación | Usa tax_totals: [] |
| `Discount exceeds amount` | Descuento > base | Asegura que amount ≤ base_amount |
| `Required field missing` | Campo faltante | Consulta documentación de campos requeridos |

---

## Herramientas Disponibles

Para evitar errores, usa nuestras herramientas interactivas:

- 🔍 **NITValidator**: Valida y calcula dígito verificador
- ✅ **JSONValidator**: Valida estructura completa de factura
- 🧮 **TotalCalculator**: Calcula totales con impuestos y descuentos

Accede en: [Herramientas Interactivas](/docs/interactive-tools)

---

## Debugging

### Paso 1: Verificar Respuesta Completa

```bash
curl -X POST https://api.matias-app.com/api/invoices \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d @factura.json \
  -v  # Modo verbose para ver toda la respuesta
```

### Paso 2: Validar Localmente

```bash
# Instalar jq para parsear JSON
npm install -g jq

# Validar que el JSON sea válido
cat factura.json | jq empty
```

### Paso 3: Comparar con Ejemplo Real

Compara tu JSON con los ejemplos en:
- [Factura Simple](/docs/jsons-billing/invoice.md)
- [Factura con Descuento](/docs/jsons-billing/invoice-with-discount.md)
- [Factura de Exportación](/docs/jsons-billing/USD-invoice-exportation.md)

---

**Última actualización**: Octubre 2024
**Próximos pasos**: [Herramientas Interactivas](/docs/interactive-tools)
