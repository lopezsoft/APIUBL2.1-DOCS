---
sidebar_position: 4
description: "Guía para identificar y solucionar errores comunes"
sidebar_label: Errores Comunes
---

# ⚠️ Guía: Errores Comunes y Soluciones

## 📋 Introducción

Esta guía enumera los errores más frecuentes al trabajar con la API MATIAS de facturación electrónica y cómo solucionarlos. Los ejemplos están basados en estructuras reales del API.

<div className="doc-status-grid">
  <div className="doc-status-card doc-status-card--warning">
    <div style={{fontSize: '1.75rem', marginBottom: '0.4rem'}}>🔐</div>
    <strong>Autenticación</strong><br/>
    <small>Tokens, verificación de correo (404), Sandbox vs Producción</small>
  </div>
  <div className="doc-status-card doc-status-card--danger">
    <div style={{fontSize: '1.75rem', marginBottom: '0.4rem'}}>🧮</div>
    <strong>Cálculos UBL 2.1</strong><br/>
    <small>Totales, impuestos, descuentos y retenciones</small>
  </div>
  <div className="doc-status-card doc-status-card--info">
    <div style={{fontSize: '1.75rem', marginBottom: '0.4rem'}}>🚦</div>
    <strong>Concurrencia DIAN</strong><br/>
    <small>Errores 409, 503, Regla 90 y DOCUMENT_POSSIBLY_SENT</small>
  </div>
  <div className="doc-status-card doc-status-card--success">
    <div style={{fontSize: '1.75rem', marginBottom: '0.4rem'}}>📝</div>
    <strong>Estructura y Clientes</strong><br/>
    <small>NIT sin DV, campos requeridos y ?client_uuid</small>
  </div>
</div>

---

## 🔐 Errores de Autenticación

### ❌ "Unauthorized" / "invalid_token"

:::warning ⚠️ Error Común
Este es uno de los errores más frecuentes. Generalmente el token ha expirado o falta el encabezado `Authorization: Bearer {token}`.
:::

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
3. Token no emitido: si el login falló, `POST /auth/login` responde **404** `"Credenciales inválidas."` y no entrega token
4. Token malformado o corrupto
5. Token revocado manualmente

**Solución:**
```bash
# 1. Obtener nuevo token
curl -X POST "{{url}}/auth/login" \
  -H "Accept: application/json" \
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
curl -X POST "{{url}}/invoice" \
  -H "Authorization: Bearer YOUR_NEW_TOKEN" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{...}'
```

:::tip 💡 Pro tip
**Novedad v3.0.0:** Puedes crear **Personal Access Tokens** con duración configurable (de 1 a 365 días; 90 por defecto) para evitar estar renovando constantemente. [Ver guía de PAT](/docs/endpoints/intro-auth#personal-access-tokens)
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

<div className="doc-formula-box">
  <strong>Posición:</strong> 1  2  3  4  5  6  7  8  9<br/>
  <strong>Dígito:</strong>   8  0  0  1  2  3  4  5  6<br/>
  <strong>Peso:</strong>     3  7  13 17 19 23 29 37 41<br/><br/>
  <div>
    8×3 + 0×7 + 0×13 + 1×17 + 2×19 + 3×23 + 4×29 + 5×37 + 6×41<br/>
    = 24 + 0 + 0 + 17 + 38 + 69 + 116 + 185 + 246 = <strong>695</strong>
  </div>
  <div style={{marginTop: '0.5rem'}}>
    695 ÷ 11 = 63 resto <strong>2</strong> → Dígito verificador = 11 - 2 = <strong>9</strong>
  </div>
  <div style={{marginTop: '0.5rem', color: 'var(--ifm-color-primary)'}}>
    ✓ <strong>NIT correcto: 800123456 (DV 9) — en el campo dni envía solo &quot;800123456&quot;</strong>
  </div>
</div>

**💡 Solución:**

<div className="doc-status-grid">
  <div className="doc-status-card doc-status-card--success">
    🔍 <strong>NITValidator</strong><br/>
    <small><a href="/docs/interactive-tools">Abrir Herramientas Interactivas</a></small>
  </div>
  <div className="doc-status-card doc-status-card--info">
    🧮 <strong>Regla para el JSON</strong><br/>
    <small>Envía solo dígitos en <code>dni</code>, sin guiones ni DV</small>
  </div>
</div>

---

## 🧮 Errores de Cálculo de Totales

### ❌ "Total no coincide"

:::danger ❌ Error Crítico
Uno de los errores más comunes al crear facturas. Revisa las sumatorias de `legal_monetary_totals` cuidadosamente.
:::

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

<div className="doc-formula-box">
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

<div className="doc-formula-box">
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

:::warning ⚠️ Atención
Intentas crear un documento con un número que ya fue validado previamente por la DIAN.
:::

**Respuesta del API:**
```json
{
  "message": "El documento (Factura electrónica) con numero LZT2002 ya se encuentra validado.",
  "data": {
    "uuid": "dde72910-eb42-11ef-9b27-f02f74cac485",
    "document_number": "LZT2002",
    "XmlDocumentKey": "cf9864294501e8a9578235dd2ab3c4fd...",
    "is_valid": 1
  },
  "success": false
}
```

**HTTP Status**: 400 - Bad Request

**Causa:** El mismo `prefix` + `document_number` ya fue validado por la DIAN. En `data` llega el registro del envío existente.

**💡 Soluciones:**

<div className="doc-status-grid">
  <div className="doc-status-card doc-status-card--success">
    <strong>✅ Opción 1: Incrementar número secuencial</strong><br/>
    <small>Actual: <code>LZT-2002</code> (Ya existe) → Nuevo: <code>LZT-2003</code></small>
  </div>
  <div className="doc-status-card doc-status-card--info">
    <strong>✅ Opción 2: Usar diferente prefijo autorizado</strong><br/>
    <small>Actual: <code>LZT-2002</code> → Nuevo: <code>LZX-2002</code></small>
  </div>
</div>

**Solución - Opción 3: Consultar documento anterior**
```bash
# Estado del documento (validación y QR)
curl -X GET "{{url}}/status?prefix=LZT&number=LZT2002" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Accept: application/json"

# O búsqueda en el listado de documentos
curl -X GET "{{url}}/documents?prefix=LZT&number=LZT2002" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Accept: application/json"
```

:::warning 📜 IMPORTANTE
Los prefijos deben estar **registrados previamente** en tu resolución de facturación ante la DIAN.
:::

---

## 🚦 Errores de Transmisión Concurrente, Validación Pendiente y Posible Envío

:::danger Regla de oro
Ninguno de estos casos se resuelve emitiendo el documento con **otro número**. Consulta primero el estado del documento con `GET /documents/{uuid}` o `GET /status?prefix=...&number=...`.
:::

### ❌ `DOCUMENT_IN_TRANSMISSION` — el número ya se está transmitiendo

**HTTP Status**: 409 - Conflict

```json
{
  "code": "DOCUMENT_IN_TRANSMISSION",
  "message": "El documento LZT2002 ya se está transmitiendo a la DIAN en otra solicitud; consulte su estado antes de enviarlo de nuevo.",
  "data": {
    "document_number": "LZT2002"
  },
  "success": false
}
```

**Causa:** otra solicitud (un reintento, un doble clic o un lote) está transmitiendo ese mismo número a la DIAN.

**Solución:** no envíes el mismo documento en paralelo. Espera unos segundos y consulta su estado antes de reenviarlo.

### ❌ `DOCUMENT_IN_VALIDATION` — la DIAN aún valida el envío anterior

**HTTP Status**: 409 - Conflict (solo en producción)

```json
{
  "code": "DOCUMENT_IN_VALIDATION",
  "message": "La DIAN aún está validando el documento LZT2002 (CUFE/CUDE cf9864294501e8a9...). No se transmitió de nuevo: consulte su estado en unos minutos antes de reenviarlo.",
  "data": {
    "uuid": "dde72910-eb42-11ef-9b27-f02f74cac485",
    "document_number": "LZT2002",
    "document_key": "cf9864294501e8a9..."
  },
  "success": false
}
```

**Causa:** el envío anterior de ese número quedó en `StatusCode 98` y la DIAN sigue validándolo.

**Solución:** espera unos minutos y consulta el estado con `POST /status/document/{trackId}` usando `data.document_key`.

### ❌ `DIAN_STATUS_UNAVAILABLE` — no se pudo confirmar el envío anterior

**HTTP Status**: 503 - Service Unavailable (solo en producción)

```json
{
  "success": false,
  "code": "DIAN_STATUS_UNAVAILABLE",
  "message": "No se pudo confirmar en la DIAN el estado del envío anterior del documento LZT2002 (CUFE/CUDE cf9864294501e8a9...). No se transmitió de nuevo para no duplicarlo: intente en unos minutos.",
  "data": {
    "uuid": "dde72910-eb42-11ef-9b27-f02f74cac485",
    "document_number": "LZT2002",
    "document_key": "cf9864294501e8a9..."
  }
}
```

**Causa:** no es una caída general de la DIAN: la API no pudo confirmar el estado del envío anterior de ese número y, para no duplicarlo, **no transmitió** el documento.

**Solución:** reintenta en unos minutos con el mismo número.

### ❌ `DOCUMENT_POSSIBLY_SENT` — posible envío sin respuesta definitiva

**HTTP Status**: normalmente 500 - Internal Server Error

```json
{
  "success": false,
  "message": "No se obtuvo una respuesta definitiva para el documento LZT2002 y es posible que la DIAN lo haya recibido. No lo emita de nuevo: consulte su estado con el uuid del envío antes de cualquier reintento. Detalle: Error interno del servidor. ...",
  "reference": "3b0c6f5e-8d2a-4c7e-9f1b-2a6d5e4c3b21",
  "code": "DOCUMENT_POSSIBLY_SENT",
  "data": {
    "uuid": "dde72910-eb42-11ef-9b27-f02f74cac485",
    "document_number": "LZT2002"
  }
}
```

**Causa:** el error (timeout, respuesta inesperada o fallo al guardar) ocurrió **después** de transmitir el documento a la DIAN. El consecutivo se conserva.

**Solución:** no reemitas. Consulta `GET /documents/{uuid}` con `data.uuid` (o `GET /status`) y actúa según su estado. Si reportas el caso a soporte, incluye `reference`.

### ❌ "El uuid proporcionado ya se usó en otro documento de la empresa"

**HTTP Status**: 409 - Conflict

```json
{
  "success": false,
  "message": "El uuid proporcionado ya se usó en otro documento de la empresa. No se emitió de nuevo: consulte ese documento o envíe un uuid nuevo."
}
```

**Causa:** el `uuid` anti-duplicados que enviaste ya pertenece a otro documento de la empresa. No se transmitió nada.

**Solución:** consulta ese documento con `GET /documents/{uuid}` o envía un `uuid` nuevo si se trata de otro documento.

### ⚠️ Avisos de regla 90: `ALREADY_AUTHORIZED_*` / `ALREADY_PROCESSED_NOT_CONFIRMED`

En producción, cuando la DIAN responde "documento procesado anteriormente" (regla 90), la API concilia el número con la DIAN y lo informa en `warnings`:

| `code` | Significado | Acción |
|---|---|---|
| `ALREADY_AUTHORIZED_RECOVERED` | La DIAN ya había autorizado ese número con el mismo contenido: se devuelve el documento autorizado. | Ninguna: el documento es válido. |
| `ALREADY_AUTHORIZED_OTHER_CONTENT` | La DIAN autorizó ese número con **otro contenido**. El documento enviado no se marcó como válido. | No lo reenvíes con ese número; consulta el documento autorizado. |
| `ALREADY_PROCESSED_NOT_CONFIRMED` | La DIAN indicó que lo procesó, pero no confirmó la autorización. | Consulta su estado antes de reenviarlo. |

### ⚠️ Avisos posteriores a la aceptación: `PDF_NOT_GENERATED` / `EMAIL_NOT_SENT` / `ATTACHED_DOCUMENT_NOT_GENERATED`

```json
{
  "warnings": [
    {
      "code": "PDF_NOT_GENERATED",
      "message": "El documento fue validado por la DIAN, pero no se pudo generar la representación gráfica. No reenvíe el documento: ya es válido ante la DIAN."
    }
  ]
}
```

**Causa:** la DIAN validó el documento, pero falló un paso posterior (PDF, correo o AttachedDocument).

**Solución:** **no reenvíes el documento**: ya es válido. Genera el PDF con `POST /documents/pdf/{trackId}?regenerate=1` o reenvía el correo con `POST /documents/sendmail/{trackId}`. Ver [Avisos de la respuesta](/docs/response-json#warnings).

### 📦 Envío masivo: `DUPLICATE_DOCUMENT_UUID` y `POSSIBLY_SENT`

- **`DUPLICATE_DOCUMENT_UUID`**: el item termina en `FAILED` porque la empresa ya emitió un documento con ese `uuid`. No se emite de nuevo; consulta el documento existente con `GET /documents/{uuid}`.
- **`POSSIBLY_SENT`**: el item no obtuvo una respuesta definitiva de la DIAN después de transmitirse. No lo reenvíes en otro lote; consulta su estado con `GET /documents/{uuid}` usando el `document_uuid` del item.

Más detalles en [Envío Masivo de Documentos](/docs/bulk-documents).

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

:::info ⚡ Referencia Rápida de Errores
Encuentra rápidamente la causa probable y la solución recomendada para el código o mensaje recibido:
:::

<div style={{overflowX: 'auto'}}>

| 🔍 Síntoma | 🐛 Causa Probable | ✅ Solución |
|---------|---|---|
| `401 Unauthorized` | 🔐 Token expirado | 🔄 Obtén nuevo token |
| `invalid_json` | 📝 JSON malformado | ✔️ Valida sintaxis JSON |
| `NIT verificador inválido` | 🔢 Dígito incorrecto | 🔍 Usa herramienta NITValidator |
| `Total no coincide` | 🧮 Cálculo de suma | 📊 Valida con TotalCalculator |
| `Tax not calculated correctly` | 💰 Fórmula impuesto | 🎯 Usa: amount = base × (percent/100) |
| `400 ... ya se encuentra validado.` | 🔄 Número ya validado | 🔍 Consulta `GET /status`; ➕ usa el siguiente número |
| `409 DOCUMENT_IN_TRANSMISSION` | 🚦 Envío en paralelo del mismo número | ⏳ Espera y consulta el estado; no reenvíes en paralelo |
| `409 DOCUMENT_IN_VALIDATION` | ⏳ La DIAN sigue en `98` | 🔍 Consulta el estado en unos minutos con `data.document_key` |
| `503 DIAN_STATUS_UNAVAILABLE` | 🔌 No se confirmó el envío anterior (no se transmitió) | 🔄 Reintenta más tarde con el mismo número |
| `DOCUMENT_POSSIBLY_SENT` | 📡 Fallo después de transmitir | 🚫 No reemitas; consulta `GET /documents/{uuid}` |
| `409 uuid ya se usó` | 🆔 `uuid` anti-duplicados repetido | 🔍 Consulta ese documento o usa un `uuid` nuevo |
| `warnings` `ALREADY_*` | 🔁 Regla 90 conciliada | 📖 Revisa el `code` del aviso |
| `warnings` `PDF_NOT_GENERATED` / `EMAIL_NOT_SENT` | 📄 Falló un paso posterior | ✅ Documento válido: no lo reenvíes |
| `Currency invalid for export` | 💱 Moneda incorrecta | 💵 Usa currency_id: 272 (USD) |
| `Tax not allowed in export` | 🌎 IVA en exportación | ❌ Usa tax_totals: [] |
| `Discount exceeds amount` | 🏷️ Descuento > base | ⚖️ Asegura que amount ≤ base_amount |
| `Required field missing` | 📋 Campo faltante | 📖 Consulta documentación |

</div>

---

## 🛠️ Herramientas Disponibles

<div className="doc-status-grid">
  <div className="doc-status-card doc-status-card--success">
    🔍 <strong>NITValidator</strong><br/>
    <small>Valida y calcula dígito verificador Módulo 11</small>
  </div>
  <div className="doc-status-card doc-status-card--info">
    ✅ <strong>JSONValidator</strong><br/>
    <small>Valida estructura completa de la factura</small>
  </div>
  <div className="doc-status-card doc-status-card--warning">
    🧮 <strong>TotalCalculator</strong><br/>
    <small>Calcula bases e impuestos automáticamente</small>
  </div>
</div>

👉 **[Abrir Herramientas Interactivas en el Navegador →](/docs/interactive-tools)**

---

## 🔬 Debugging

:::tip 🎯 Guía de Depuración Paso a Paso
Sigue estos pasos para aislar y resolver rechazos de validación o comunicación:
:::

### 📡 Paso 1: Verificar Respuesta Completa

```bash
curl -X POST "{{url}}/invoice" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json" \
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

<div className="doc-status-grid">
  <a href="/docs/jsons-billing/invoice" style={{textDecoration: 'none', color: 'inherit'}}>
    <div className="doc-status-card doc-status-card--info">
      📄 <strong>Factura Simple</strong><br/>
      <small>Ejemplo básico nacional</small>
    </div>
  </a>
  <a href="/docs/jsons-billing/invoice-with-discount" style={{textDecoration: 'none', color: 'inherit'}}>
    <div className="doc-status-card doc-status-card--warning">
      🏷️ <strong>Con Descuento</strong><br/>
      <small>Ejemplo con descuentos comerciales</small>
    </div>
  </a>
  <a href="/docs/jsons-billing/USD-invoice-exportation" style={{textDecoration: 'none', color: 'inherit'}}>
    <div className="doc-status-card doc-status-card--success">
      🌎 <strong>Exportación</strong><br/>
      <small>Ejemplo internacional en USD</small>
    </div>
  </a>
</div>

---

## 🎯 Próximos Pasos

<div className="doc-status-grid">
  <a href="/docs/use-cases/simple-invoice" style={{textDecoration: 'none', color: 'inherit'}}>
    <div className="doc-status-card doc-status-card--info">
      <div style={{fontSize: '1.75rem', marginBottom: '0.4rem'}}>📄</div>
      <strong>Factura Simple</strong><br/>
      <small>Guía básica paso a paso</small>
    </div>
  </a>
  <a href="/docs/use-cases/invoice-with-discounts" style={{textDecoration: 'none', color: 'inherit'}}>
    <div className="doc-status-card doc-status-card--info">
      <div style={{fontSize: '1.75rem', marginBottom: '0.4rem'}}>🏷️</div>
      <strong>Factura con Descuentos</strong><br/>
      <small>Descuentos por línea y globales</small>
    </div>
  </a>
  <a href="/docs/use-cases/export-scenarios" style={{textDecoration: 'none', color: 'inherit'}}>
    <div className="doc-status-card doc-status-card--success">
      <div style={{fontSize: '1.75rem', marginBottom: '0.4rem'}}>🌎</div>
      <strong>Exportaciones</strong><br/>
      <small>Facturas internacionales multimoneda</small>
    </div>
  </a>
  <a href="/docs/interactive-tools" style={{textDecoration: 'none', color: 'inherit'}}>
    <div className="doc-status-card doc-status-card--warning">
      <div style={{fontSize: '1.75rem', marginBottom: '0.4rem'}}>🛠️</div>
      <strong>Herramientas Interactivas</strong><br/>
      <small>Validadores y calculadoras en vivo</small>
    </div>
  </a>
</div>
