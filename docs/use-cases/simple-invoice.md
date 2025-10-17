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

### 📝 Información del Documento
```json
{
  "resolution_number": "18764074347312",
  "prefix": "FEV",
  "document_number": "2001",
  "date": "2024-10-17",
  "time": "14:30:00"
}
```

### 📝 Información del Cliente (Comprador)
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

:::info
**Nota Importante:** El emisor (tu empresa) NO se envía en el JSON. La API identifica al emisor por el **token de autenticación**. Solo debes enviar información del cliente (comprador).
:::

## Paso 3: Crear la Estructura JSON de la Factura

Monta el JSON completo usando la estructura real del API:

```json
{
  "resolution_number": "18764074347312",
  "prefix": "FEV",
  "notes": "Factura de venta electrónica",
  "document_number": "2001",
  "graphic_representation": 0,
  "send_email": 1,
  "operation_type_id": 1,
  "type_document_id": 7,
  
  "payments": [
    {
      "payment_method_id": 1,
      "means_payment_id": 10,
      "value_paid": "119000.00"
    }
  ],
  
  "customer": {
    "country_id": "45",
    "city_id": "76",
    "identity_document_id": "2",
    "type_organization_id": 2,
    "tax_regime_id": 1,
    "tax_level_id": 5,
    "company_name": "CLIENTE EMPRESA LTDA",
    "dni": "8001234567",
    "mobile": "3001234567",
    "email": "compras@cliente.com",
    "address": "Calle 15 #8-30",
    "postal_code": "050001"
  },
  
  "lines": [
    {
      "invoiced_quantity": "1",
      "quantity_units_id": "1093",
      "line_extension_amount": "100000.00",
      "free_of_charge_indicator": false,
      "description": "PRODUCTO O SERVICIO",
      "code": "PRD-001",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "price_amount": "100000.00",
      "base_quantity": "1",
      "tax_totals": [
        {
          "tax_id": "1",
          "tax_amount": 19000.00,
          "taxable_amount": 100000.00,
          "percent": 19
        }
      ]
    }
  ],
  
  "legal_monetary_totals": {
    "line_extension_amount": "100000.00",
    "tax_exclusive_amount": "100000.00",
    "tax_inclusive_amount": "119000.00",
    "payable_amount": 119000.00
  },
  
  "tax_totals": [
    {
      "tax_id": "1",
      "tax_amount": 19000.00,
      "taxable_amount": 100000.00,
      "percent": 19
    }
  ]
}
```

:::warning
**Puntos Importantes:**
- `type_document_id: 7` → Factura de venta
- `operation_type_id: 1` → Estándar
- `line_extension_amount` = `invoiced_quantity` × `price_amount`
- `tax_inclusive_amount` = `tax_exclusive_amount` + suma de `tax_totals.tax_amount`
- El `customer.dni` NO incluye dígito verificador en este caso
:::

## Paso 4: Validar la Factura Localmente

Antes de enviarla a la API, verifica:

✅ **Identificación**
- `resolution_number` válida
- `prefix` registrada en DIAN
- `document_number` no duplicado
- `type_document_id: 7` (Factura de venta)
- `operation_type_id: 1` (Operación estándar)

✅ **Cliente**
- `dni` válido y formateado correctamente
- `company_name` no vacío
- `email` con formato correcto
- `country_id: 45` (Colombia)

✅ **Líneas**
- `invoiced_quantity` > 0
- `price_amount` > 0
- `line_extension_amount` = `invoiced_quantity` × `price_amount`
- `tax_totals` calcular correctamente

✅ **Totales**
- `tax_exclusive_amount` = suma de `line_extension_amount`
- `tax_inclusive_amount` = `tax_exclusive_amount` + impuestos
- `payable_amount` = `tax_inclusive_amount`

✅ **Pagos**
- `value_paid` = `payable_amount`
- `payment_method_id` válido
- `means_payment_id` válido

## Paso 5: Enviar la Factura a la API

Una vez validada localmente, envía la factura:

```bash
curl -X POST https://api.matias-app.com/api/invoices \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "resolution_number": "18764074347312",
  "prefix": "FEV",
  "document_number": "2001",
  "type_document_id": 7,
  "operation_type_id": 1,
  "graphic_representation": 0,
  "send_email": 1,
  "customer": {
    "country_id": "45",
    "city_id": "76",
    "identity_document_id": "2",
    "type_organization_id": 2,
    "tax_regime_id": 1,
    "tax_level_id": 5,
    "company_name": "CLIENTE EMPRESA LTDA",
    "dni": "8001234567",
    "mobile": "3001234567",
    "email": "compras@cliente.com",
    "address": "Calle 15 #8-30",
    "postal_code": "050001"
  },
  "lines": [
    {
      "invoiced_quantity": "1",
      "quantity_units_id": "1093",
      "line_extension_amount": "100000.00",
      "free_of_charge_indicator": false,
      "description": "PRODUCTO O SERVICIO",
      "code": "PRD-001",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "price_amount": "100000.00",
      "base_quantity": "1",
      "tax_totals": [
        {
          "tax_id": "1",
          "tax_amount": 19000.00,
          "taxable_amount": 100000.00,
          "percent": 19
        }
      ]
    }
  ],
  "legal_monetary_totals": {
    "line_extension_amount": "100000.00",
    "tax_exclusive_amount": "100000.00",
    "tax_inclusive_amount": "119000.00",
    "payable_amount": 119000.00
  },
  "tax_totals": [
    {
      "tax_id": "1",
      "tax_amount": 19000.00,
      "taxable_amount": 100000.00,
      "percent": 19
    }
  ],
  "payments": [
    {
      "payment_method_id": 1,
      "means_payment_id": 10,
      "value_paid": "119000.00"
    }
  ]
}'
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
    "StatusMessage": "La Factura electrónica FEV2001, ha sido autorizada.",
    "XmlBase64Bytes": "",
    "XmlBytes": {
      "_attributes": {
        "nil": "true"
      }
    },
    "XmlDocumentKey": "d45f3b2ed042ce0e075891591c3b3a7ae3a9c176ca191dab1bd23e5cdd3b48b8c548a088dfcbe20ee7baa2bed2dccd48",
    "XmlFileName": "fv09010914030002500000095"
  },
  "XmlBase64Bytes": "",
  "AttachedDocument": {
    "pathZip": "1/ad/z09010914030002500000042.zip",
    "path": "1/ad/ad09010914030002500000041.xml",
    "url": "https://api-v2.matias-api.com/attachments/1/ad/ad09010914030002500000041.xml",
    "data": ""
  },
  "qr": {
    "qrDian": "",
    "url": "",
    "path": "1/fv09010914030002500000095.png",
    "data": ""
  },
  "pdf": {
    "path": "1/fv09010914030002500000095.pdf",
    "url": "https://api-v2.matias-api.com/pdf/1/fv09010914030002500000095.pdf",
    "data": ""
  },
  "success": true
}
```

:::info
**Campos Clave en la Respuesta:**
- `message`: Mensaje genérico del API
- `XmlDocumentKey` (CUFE): Identificador único del documento en DIAN
- `response.IsValid`: "true" = documento válido
- `response.StatusCode`: "00" = procesado correctamente
- `response.StatusMessage`: Confirmación de autorización
- `XmlFileName`: Nombre del documento en portal DIAN
- `success`: true = operación exitosa
- `pdf.url`: Enlace para descargar el PDF
- `AttachedDocument.url`: Enlace del XML
:::

### Si Hay Errores
```json
{
  "success": false,
  "message": "El documento (Factura electrónica) con numero FEV2001, ya se encuentra validado"
}
```

:::warning
**Códigos de Error Comunes:**
- Documento duplicado
- Datos de cliente inválidos
- Cálculos de totales incorrectos
- NIT sin dígito verificador o incorrecto
- Resolución no válida o vencida
:::

## Paso 6: Consultar Detalles del Documento

Para obtener los detalles completos de tu factura después de haberla creado:

```bash
curl -X GET "https://api.matias-app.com/api/invoices/FEV-2001" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Respuesta
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
    "StatusMessage": "La Factura electrónica FEV2001, ha sido autorizada.",
    "XmlBase64Bytes": "",
    "XmlBytes": {
      "_attributes": {
        "nil": "true"
      }
    },
    "XmlDocumentKey": "d45f3b2ed042ce0e075891591c3b3a7ae3a9c176ca191dab1bd23e5cdd3b48b8c548a088dfcbe20ee7baa2bed2dccd48",
    "XmlFileName": "fv09010914030002500000095"
  },
  "XmlBase64Bytes": "",
  "AttachedDocument": {
    "pathZip": "1/ad/z09010914030002500000042.zip",
    "path": "1/ad/ad09010914030002500000041.xml",
    "url": "https://api-v2.matias-api.com/attachments/1/ad/ad09010914030002500000041.xml",
    "data": ""
  },
  "qr": {
    "qrDian": "",
    "url": "",
    "path": "1/fv09010914030002500000095.png",
    "data": ""
  },
  "pdf": {
    "path": "1/fv09010914030002500000095.pdf",
    "url": "https://api-v2.matias-api.com/pdf/1/fv09010914030002500000095.pdf",
    "data": ""
  },
  "success": true
}
```

:::success
**¡Tu factura está lista!**

Con los datos de la respuesta puedes:
- 📥 **Descargar el PDF**: Usa `pdf.url`
- 📄 **Obtener el XML**: Usa `AttachedDocument.url`
- 📱 **Compartir el QR**: Usa `qr.url`
- ✅ **Verificar**: El CUFE (`XmlDocumentKey`) es único e irrepetible
:::

**Tiempo estimado de validación DIAN**: 30 minutos a 2 horas

## Paso 7: Enviar Comprobante al Cliente

Si configuraste `send_email: 1`, la API enviará automáticamente. Para enviar nuevamente:

```bash
curl -X POST https://api.matias-app.com/api/invoices/12345/send-email \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "compras@cliente.com"
  }'
```

## Checklist de Éxito

- [x] JSON coincide con estructura del API
- [x] Todos los campos requeridos presentes
- [x] Cálculos de totales e impuestos correctos
- [x] NIT del cliente válido
- [x] Respuesta HTTP 200 o 201
- [x] `status_id: 1` o superior en respuesta
- [x] CUFE generado correctamente
- [x] Cliente recibió email

## Troubleshooting

### ❌ "invalid_json"
**Causa**: JSON malformado o campos extras  
**Solución**: Usa la estructura exacta del ejemplo. Revisa la documentación de campos obligatorios.

### ❌ "NIT verificador inválido"
**Causa**: El dígito verificador del NIT es incorrecto  
**Solución**: Usa el validador NITValidator en herramientas interactivas

### ❌ "Duplicate document"
**Causa**: Ya existe una factura con el mismo `prefix` y `document_number`  
**Solución**: Incrementa el `document_number` o usa diferente `prefix`

### ❌ "tax_amount calculation error"
**Causa**: Los impuestos no se calculan correctamente  
**Solución**: `tax_amount` = `taxable_amount` × (`percent` / 100)

## Próximos Pasos

¡Felicidades! Has emitido tu primera factura electrónica. Ahora puedes:

- 📖 [Consultar la guía de Facturas con Descuentos](/docs/use-cases/invoice-with-discounts)
- 📖 [Aprender sobre Exportaciones](/docs/use-cases/export-scenarios)
- 📋 [Ver Referencias Técnicas](/docs/billing-fields)

---

**Última actualización**: Octubre 2024
**Tiempo estimado**: 15 minutos
**Nivel de dificultad**: ⭐ Principiante
