---
sidebar_position: 4
description: "Guía para identificar y solucionar errores comunes"
---

# Guía: Errores Comunes y Soluciones

## Introducción

Esta guía enumera los errores más frecuentes al trabajar con facturación electrónica y cómo solucionarlos.

## Errores de Autenticación

### ❌ "Token expirado" / "Invalid token"

**Síntoma**: 
```json
{
  "error": "invalid_token",
  "message": "Token has expired"
}
```

**Causa**: El token OAuth2 ya no es válido (generalmente caduca en 1 hora)

**Solución**:
```bash
# Obtener un nuevo token
curl -X POST https://api.matias.com/oauth/token \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "grant_type=client_credentials"
```

### ❌ "Unauthorized" / "Invalid credentials"

**Causa**: Client ID o Client Secret incorrectos

**Solución**: 
1. Verifica tus credenciales en el dashboard de MATIAS
2. Asegúrate de no tener espacios en blanco extras
3. Si los olvidaste, regenera las credenciales

---

## Errores de Validación de Datos

### ❌ "NIT con dígito verificador incorrecto"

**Síntoma**:
```json
{
  "error": "VAL-PARTY-001",
  "message": "NIT 9001234567 - Invalid check digit"
}
```

**Causa**: El dígito verificador del NIT no coincide

**Solución**: Calcula el dígito verificador correctamente

**Algoritmo**:
```
NIT: 900123456
Pesos: 3 7 13 17 19 23 29 37 41 43

9 × 3  = 27
0 × 7  = 0
0 × 13 = 0
1 × 17 = 17
2 × 19 = 38
3 × 23 = 69
4 × 29 = 116
5 × 37 = 185
6 × 41 = 246
SUMA = 698

698 ÷ 11 = 63 con resto 5
Dígito = 11 - 5 = 6
Resultado: 9001234567
```

**Herramienta online**: https://www.calculardigitoverificador.com/

### ❌ "Fecha inválida"

**Síntoma**:
```json
{
  "error": "VAL-DATE-001",
  "message": "Date cannot be in the future"
}
```

**Causa**: Estás usando una fecha posterior a hoy

**Solución**: 
```json
// INCORRECTO
{
  "date": "2025-10-17"  // Fecha futura
}

// CORRECTO
{
  "date": "2024-10-17"  // Fecha de hoy o anterior
}
```

---

## Errores de Cálculos

### ❌ "Total no coincide"

**Síntoma**:
```json
{
  "error": "VAL-TOTAL-004",
  "message": "Total amount does not match calculation"
}
```

**Causa**: Los cálculos no son consistentes

**Verificación**:
```
Subtotal = 100000
Descuento = 10000
Base imponible = 90000
Impuesto (19%) = 17100
Total = 90000 + 17100 = 107100

✓ Es correcto
```

**Error común**:
```
// INCORRECTO - Impuesto sobre monto original
Subtotal = 100000
Descuento = 10000
Impuesto (19% sobre 100000) = 19000  ❌
Total = 109000
```

**Solución**:
```json
{
  "subtotal": 100000.00,
  "total_discount": 10000.00,
  "total_tax": 17100.00,        // 19% de (100000-10000)
  "payable_amount": 107100.00   // 90000 + 17100
}
```

### ❌ "Línea de factura incorrecta"

**Síntoma**:
```json
{
  "error": "VAL-LINE-004",
  "message": "Line extension amount does not match quantity × price"
}
```

**Verificación**:
```
Cantidad: 2
Precio: 50000
Línea esperada: 2 × 50000 = 100000
Línea recibida: 95000  ❌ No coincide
```

**Solución**: Recalcula:
```json
{
  "quantity": 2,
  "unit_price": 50000.00,
  "line_extension_amount": 100000.00  // Debe ser exacto
}
```

---

## Errores de Documentos

### ❌ "Documento duplicado"

**Síntoma**:
```json
{
  "error": "DOC-DUP-001",
  "message": "Invoice FEV-2001 already exists"
}
```

**Causa**: Ya emitiste una factura con ese prefijo y número

**Solución**: Incrementa el consecutivo
```json
// INCORRECTO - Ya existe
{
  "prefix": "FEV",
  "document_number": 2001
}

// CORRECTO - Siguiente consecutivo
{
  "prefix": "FEV",
  "document_number": 2002
}
```

### ❌ "Prefijo no autorizado"

**Síntoma**:
```json
{
  "error": "VAL-ID-002",
  "message": "Prefix XYZ not authorized in resolution"
}
```

**Causa**: El prefijo no está registrado en tu resolución

**Solución**: 
1. Verifica tu resolución de facturación
2. Usa solo los prefijos autorizados
3. Si necesitas otro prefijo, solicita una nueva resolución a DIAN

---

## Errores de Cliente

### ❌ "Documento cliente inválido"

**Síntoma**:
```json
{
  "error": "VAL-PARTY-003",
  "message": "Client document is invalid"
}
```

**Causa**: El documento del cliente no coincide con su tipo

**Solución**: Verifica el formato
```json
// Si es NIT
{
  "identity_document_id": "2",
  "document_number": "8001234567"  // 10 dígitos + verificador
}

// Si es Cédula
{
  "identity_document_id": "1",
  "document_number": "1234567890"  // 10 dígitos
}

// Si es Pasaporte (extranjero)
{
  "identity_document_id": "3",
  "document_number": "AB12345678"  // Formato variable
}
```

### ❌ "Cliente país no válido"

**Síntoma**:
```json
{
  "error": "VAL-PARTY-004",
  "message": "Country code not valid"
}
```

**Causa**: El código de país no existe

**Solución**: Usa código ISO válido
```json
// INCORRECTO
{
  "country_id": "USA"  // Texto en lugar de código
}

// CORRECTO
{
  "country_id": "226"  // Código para USA
}
```

---

## Errores de Impuestos

### ❌ "Porcentaje de IVA no permitido"

**Síntoma**:
```json
{
  "error": "VAL-TAX-002",
  "message": "Tax percentage 15% not allowed"
}
```

**Porcentajes válidos en Colombia**:
```
IVA:
- 0% (exento)
- 5% (alimentos básicos)
- 19% (general)

ICA (varía por ciudad):
- 0% a 8.64%

ICE:
- Varios (bebidas, cigarrillos, etc.)
```

**Solución**:
```json
{
  "taxes": [
    {
      "tax_type_id": 1,
      "tax_percentage": 19  // Usar 0, 5 o 19
    }
  ]
}
```

---

## Errores de Pago

### ❌ "Monto de pago no coincide"

**Síntoma**:
```json
{
  "error": "VAL-PAYMENT-002",
  "message": "Payment amount does not match total"
}
```

**Causa**: La suma de pagos no iguala el total

**Solución**:
```json
// INCORRECTO
{
  "payable_amount": 119000.00,
  "payments": [
    {
      "value_paid": 100000.00  // No suma 119000
    }
  ]
}

// CORRECTO
{
  "payable_amount": 119000.00,
  "payments": [
    {
      "value_paid": 119000.00  // Coincide exactamente
    }
  ]
}
```

---

## Matriz de Resolución Rápida

| Error | Posible Causa | Solución |
|-------|---------------|----------|
| Token expirado | Sesión vencida | Obtener nuevo token |
| NIT inválido | Dígito verificador incorrecto | Recalcular dígito |
| Total no coincide | Cálculos incorrectos | Verificar suma |
| Documento duplicado | Número ya usado | Incrementar consecutivo |
| Prefijo no autorizado | Prefijo no existe | Verificar resolución |
| Fecha futura | Usando fecha incorrecta | Usar fecha actual o anterior |

---

## Herramientas de Debugging

### 1. Validador de NIT
```bash
curl -X POST https://api.matias.com/api/validate/nit \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "nit": "9001234567"
  }'
```

### 2. Validador de Factura
```bash
curl -X POST https://api.matias.com/api/validate/invoice \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d @factura.json
```

### 3. Listar Tus Facturas
```bash
curl https://api.matias.com/api/invoices \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"
```

---

## Contacto y Soporte

Si después de revisar esta guía aún tienes problemas:

- 📧 **Email**: soporte@matias.com
- 💬 **Chat**: https://matias.com/chat
- 📞 **Teléfono**: +57 (1) 1234-5678
- 🐛 **Reportar Bug**: https://github.com/lopezsoft/APIUBL2.1-DOCS/issues

---

**Última actualización**: Octubre 2024
**Versión**: 2.0
**Cobertura**: 95% de errores comunes
