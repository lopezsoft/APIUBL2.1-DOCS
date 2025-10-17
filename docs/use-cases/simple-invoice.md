---
sidebar_position: 1
description: "Guía paso a paso para emitir una factura electrónica simple"
---

# Guía: Factura Electrónica Simple

## Introducción

Esta guía te mostrará cómo emitir tu primera factura electrónica usando la API de MATIAS. Es perfecta si acabas de empezar y tienes un caso de uso simple: vender un producto o servicio a un cliente empresario.

## ¿Cuándo usar esta guía?

✅ Tu primer documento electrónico
✅ Venta sin descuentos
✅ Cliente empresario identificado
✅ Pago único (no a plazo)
✅ No necesitas casos especiales

:::tip
Si tu caso es más complejo (exportación, múltiples monedas, descuentos), consulta las otras guías.
:::

## Requisitos Previos

Antes de empezar, asegúrate de tener:

- ✅ Usuario y contraseña en MATIAS API
- ✅ Token OAuth2 obtenido
- ✅ Resolución de facturación de DIAN
- ✅ Certificado digital vigente
- ✅ Datos de tu empresa

## Paso 1: Obtener el Token de Autenticación

Primero, necesitas autenticarte en la API:

### Solicitud
```bash
curl -X POST https://api.matias.com/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "grant_type=client_credentials"
```

### Respuesta
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

:::info
Guarda este `access_token`, lo usarás en todos los próximos pasos.
:::

## Paso 2: Preparar los Datos de la Factura

Reúne la información necesaria:

### 📝 Información del Emisor
```json
{
  "tax_id": "9001234567",
  "name": "MI EMPRESA SAS",
  "address": "Carrera 10 #25-50",
  "city": "Bogotá",
  "country": "Colombia"
}
```

### 📝 Información del Cliente
```json
{
  "document_type": "NIT",
  "document_number": "8001234567",
  "company_name": "CLIENTE EMPRESA LTDA",
  "address": "Calle 15 #8-30",
  "city": "Medellín",
  "email": "compras@cliente.com"
}
```

### 📝 Información del Documento
```json
{
  "resolution_number": "18764074347312",
  "prefix": "FEV",
  "document_number": 2001,
  "date": "2024-10-17",
  "time": "14:30:00"
}
```

## Paso 3: Crear la Estructura JSON de la Factura

Monta el JSON completo con la siguiente estructura:

```json
{
  // === Identificación ===
  "resolution_number": "18764074347312",
  "prefix": "FEV",
  "document_number": 2001,
  "type_document_id": 7,
  "operation_type_id": 1,
  
  // === Fechas ===
  "date": "2024-10-17",
  "time": "14:30:00",
  
  // === Moneda ===
  "currency_id": 170,
  
  // === Emisor ===
  "issuer": {
    "tax_id": "9001234567",
    "name": "MI EMPRESA SAS",
    "address": "Carrera 10 #25-50",
    "city": "Bogotá",
    "country_id": "169",
    "tax_regime_id": 1,
    "phone": "3101234567",
    "email": "ventas@miempresa.com"
  },
  
  // === Cliente ===
  "customer": {
    "identity_document_id": "2",
    "document_number": "8001234567",
    "company_name": "CLIENTE EMPRESA LTDA",
    "address": "Calle 15 #8-30",
    "city": "Medellín",
    "country_id": "169",
    "email": "compras@cliente.com"
  },
  
  // === Líneas de Producto ===
  "lines": [
    {
      "description": "PRODUCTO O SERVICIO",
      "code": "PRD-001",
      "quantity": 1,
      "quantity_units_id": "1093",
      "unit_price": 100000.00,
      "line_extension_amount": 100000.00,
      "taxes": [
        {
          "tax_type_id": 1,
          "tax_percentage": 19,
          "tax_amount": 19000.00
        }
      ]
    }
  ],
  
  // === Totales ===
  "totals": {
    "subtotal": 100000.00,
    "total_tax": 19000.00,
    "payable_amount": 119000.00
  },
  
  // === Formas de Pago ===
  "payments": [
    {
      "payment_method_id": "10",
      "means_payment_id": "42",
      "value_paid": 119000.00
    }
  ],
  
  "notes": "Factura de venta electrónica"
}
```

## Paso 4: Validar la Factura

Antes de enviarla, valida que la estructura sea correcta:

```bash
curl -X POST https://api.matias.com/api/validate/invoice \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d @factura.json
```

### Respuesta Exitosa
```json
{
  "valid": true,
  "errors": [],
  "warnings": [],
  "message": "Factura válida"
}
```

### Si Hay Errores
```json
{
  "valid": false,
  "errors": [
    {
      "code": "VAL-TOTAL-004",
      "message": "Total no coincide con suma de líneas"
    }
  ]
}
```

:::warning
Si hay errores, corrígelos antes de continuar.
:::

## Paso 5: Enviar la Factura a la API

Una vez validada, envía la factura:

```bash
curl -X POST https://api.matias.com/api/invoices/create \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d @factura.json
```

### Respuesta Exitosa
```json
{
  "success": true,
  "invoice_id": 12345,
  "cufe": "101413670038274164",
  "status": "sent",
  "message": "Factura creada y enviada exitosamente",
  "pdf_url": "https://cdn.matias.com/invoices/12345.pdf",
  "xml_url": "https://cdn.matias.com/invoices/12345.xml"
}
```

## Paso 6: Validar Recepción en DIAN

La DIAN validará tu factura y te enviará un correo con:

- ✅ Número de validación
- ✅ Estado de aceptación
- ✅ Cualquier error o advertencia

Este proceso toma generalmente **30 minutos a 2 horas**.

## Paso 7: Enviar Comprobante al Cliente

Una vez que la DIAN acepta la factura:

```bash
curl -X POST https://api.matias.com/api/invoices/{invoice_id}/send-email \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "recipient_email": "compras@cliente.com",
    "include_pdf": true,
    "include_xml": true
  }'
```

## Checklist Final

Antes de considerar completado este proceso:

- [ ] Token obtenido exitosamente
- [ ] Datos del emisor verificados
- [ ] Datos del cliente correctos
- [ ] JSON creado sin errores
- [ ] Validación pasada sin problemas
- [ ] Factura enviada a API
- [ ] Respuesta OK recibida
- [ ] DIAN validó la factura
- [ ] Cliente recibió correo

## Troubleshooting

### ❌ "Token inválido"
**Solución**: Verifica que el `access_token` no ha expirado. Obtén uno nuevo si es necesario.

### ❌ "NIT con dígito verificador incorrecto"
**Solución**: Calcula correctamente el dígito verificador del NIT del cliente.

### ❌ "Total no coincide"
**Solución**: Verifica que `subtotal + taxes = payable_amount`

### ❌ "Factura duplicada"
**Solución**: El número de factura ya fue usado. Incrementa el consecutivo.

## Próximos Pasos

¡Felicidades! Has emitido tu primera factura electrónica. Ahora puedes:

- 📖 [Consultar la guía de Facturas con Descuentos](/docs/use-cases/invoice-with-discounts)
- 📖 [Aprender sobre Exportaciones](/docs/use-cases/export-scenarios)
- 📋 [Ver Referencias Técnicas](/docs/billing-fields)

---

**Última actualización**: Octubre 2024
**Tiempo estimado**: 15 minutos
**Nivel de dificultad**: ⭐ Principiante
