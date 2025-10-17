---
sidebar_position: 2
description: "Anexo técnico detallado de la Factura Electrónica versión 1.9 con especificaciones completas"
---

# Anexo Técnico - Factura Electrónica v1.9

## Información General

Este documento proporciona una descripción técnica completa del formato y estructura de la Factura Electrónica de Venta versión 1.9, conforme a la **Resolución 000165 de 2024** de la DIAN.

### Especificaciones Base

| Aspecto | Detalle |
|--------|---------|
| **Versión** | 1.9 |
| **Estándar** | UBL 2.1 (Universal Business Language) |
| **Formato** | XML digitalizado |
| **Namespace** | urn:oasis:names:specification:ubl:schema:xsd:Invoice-2 |
| **Resolución DIAN** | 000165 de 2024 |
| **Firma Digital** | Obligatoria (Certificado válido) |

📥 **Documentación oficial**: [Descargar Anexo Técnico Oficial PDF](https://www.dian.gov.co/)

---

## 1. Estructura General de la Factura

La factura electrónica está compuesta por las siguientes secciones principales:

```
┌─────────────────────────────────────┐
│   IDENTIFICACIÓN DEL DOCUMENTO      │
│  - Resolución, Prefijo, Número      │
│  - Fecha, Hora, Tipo de documento   │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│    DATOS DE LAS PARTES (Emisor)     │
│  - NIT, Razón Social, Dirección     │
│  - Régimen tributario, Ciudad       │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│    DATOS DEL CLIENTE (Receptor)     │
│  - Documento, Nombre, Dirección     │
│  - País, Ciudad, Contacto           │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│      LÍNEAS DEL DOCUMENTO           │
│  - Descripción, Cantidad, Precio    │
│  - Impuestos, Descuentos por línea  │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│     TOTALES Y CÁLCULOS              │
│  - Subtotal, Impuestos, Descuentos  │
│  - Total final, Retenciones         │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│     INFORMACIÓN DE PAGO             │
│  - Forma de pago, Plazo             │
│  - Datos bancarios (si aplica)      │
└─────────────────────────────────────┘
```

---

## 2. Identificación del Documento

### 2.1 Campos de Identificación

| Campo | Tipo | Obligatorio | Longitud | Descripción |
|-------|------|-------------|----------|-------------|
| `resolution_number` | String | Sí | Max 50 | Número de resolución de facturación (ej: 18760000001) |
| `prefix` | String | Sí | Max 5 | Prefijo de la serie (ej: FEV, FEC) |
| `document_number` | Integer | Sí | - | Número secuencial de la factura |
| `date` | Date | Sí | YYYY-MM-DD | Fecha de emisión |
| `time` | DateTime | Sí | HH:MM:SS | Hora de emisión |
| `type_document_id` | Integer | Sí | - | ID del tipo de documento (01=FE, 02=NC, etc.) |
| `notes` | String | No | Max 500 | Notas adicionales sobre la factura |
| `expiration_date` | Date | No | YYYY-MM-DD | Fecha de vencimiento |

### 2.2 Tipos de Documento

| ID | Tipo | Descripción |
|----|------|-------------|
| 01 | **FE** | Factura Electrónica |
| 02 | **NC** | Nota Crédito Electrónica |
| 03 | **ND** | Nota Débito Electrónica |
| 04 | **FCam** | Factura Cambio de Régimen |
| 05 | **FProv** | Factura por Importación |
| 91 | **POS** | Factura POS |

---

## 3. Datos de las Partes

### 3.1 Emisor (Vendedor/Proveedor)

El emisor es quien expide la factura electrónica. Sus datos deben ser verificables ante el Registro Único Tributario (RUT) de la DIAN.

| Campo | Tipo | Obligatorio | Validaciones | Descripción |
|-------|------|-------------|--------------|-------------|
| `issuer.tax_id` | String(13) | Sí | Debe existir en RUT DIAN | NIT sin dígito de verificación |
| `issuer.name` | String(500) | Sí | No puede estar vacío | Razón social |
| `issuer.address` | String(500) | Sí | - | Dirección completa |
| `issuer.city_id` | Integer | Sí | Código DANE | Ciudad (código de la DIAN) |
| `issuer.country_id` | Integer | Sí | ISO 3166 | País (Colombia = 45) |
| `issuer.postal_code` | String(20) | No | - | Código postal |
| `issuer.phone` | String(20) | No | - | Teléfono de contacto |
| `issuer.email` | String(100) | No | Formato email | Email de contacto |
| `issuer.tax_regime_id` | Integer | Sí | Válido en DIAN | Régimen tributario |
| `issuer.tax_level_id` | Integer | No | 0-5 | Nivel de impuesto |

### 3.2 Receptor (Cliente/Comprador)

El receptor es quien recibe la factura. Puede ser persona natural o empresa.

| Campo | Tipo | Obligatorio | Validaciones | Descripción |
|-------|------|-------------|--------------|-------------|
| `customer.identity_document_id` | Integer | Sí | Código DIAN | Tipo de documento (CC, NIT, CE, etc.) |
| `customer.document_number` | String(20) | Sí | Formato válido | Número de documento |
| `customer.name` | String(500) | Sí | No vacío | Nombre o razón social |
| `customer.address` | String(500) | No | - | Dirección |
| `customer.city_id` | Integer | Sí | Código DANE | Ciudad |
| `customer.country_id` | Integer | Sí | ISO 3166 | País |
| `customer.postal_code` | String(20) | No | - | Código postal |
| `customer.phone` | String(20) | No | - | Teléfono |
| `customer.email` | String(100) | No | Formato email | Email |
| `customer.type_organization_id` | Integer | No | Código DIAN | Tipo de organización |
| `customer.tax_regime_id` | Integer | Sí (si es empresa) | - | Régimen tributario |

### 3.3 Tipos de Identidad

| ID | Tipo | Descripción |
|----|------|-------------|
| 1 | **CC** | Cédula de Ciudadanía |
| 2 | **CE** | Cédula de Extranjería |
| 3 | **NIT** | Número de Identificación Tributaria |
| 4 | **TI** | Tarjeta de Identidad |
| 5 | **PP** | Pasaporte |
| 10 | **NURE** | Número Único de Registro Económico |

---

## 4. Líneas del Documento

Cada línea representa un artículo o servicio facturado.

### 4.1 Estructura de Línea

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `invoice_line_number` | Integer | Sí | Número secuencial de la línea (1, 2, 3...) |
| `description` | String(500) | Sí | Descripción del artículo/servicio |
| `code` | String(50) | Sí | Código del artículo en la empresa |
| `type_item_identifications_id` | Integer | Sí | Tipo de código (ej: interno, EAN, etc.) |
| `invoiced_quantity` | Decimal(19,2) | Sí | Cantidad facturada |
| `quantity_units_id` | Integer | Sí | Unidad de medida (kg, m, unidad, etc.) |
| `unit_measure_name` | String(20) | No | Nombre de la unidad |
| `line_extension_amount` | Decimal(19,2) | Sí | Subtotal de la línea (cantidad × precio unitario) |
| `free_of_charge_indicator` | Boolean | No | Si es complementaria (sin costo) |
| `price_amount` | Decimal(19,2) | Sí | Precio unitario |
| `reference_price_id` | Integer | No | Tipo de referencia de precio |

### 4.2 Impuestos por Línea

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `tax_id` | Integer | Sí | ID del impuesto (1=IVA, 2=Consumo, etc.) |
| `percent` | Decimal(5,2) | Sí | Porcentaje del impuesto (19, 5, 0, etc.) |
| `taxable_amount` | Decimal(19,2) | Sí | Base imponible |
| `tax_amount` | Decimal(19,2) | Sí | Valor del impuesto |

### 4.3 Descuentos por Línea

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `charge_indicator` | Boolean | Sí | false = descuento, true = cargo adicional |
| `allowance_charge_reason` | String(50) | Sí | Código DIAN de la razón del descuento |
| `allowance_charge_reason_description` | String(500) | No | Descripción adicional |
| `percentage` | Decimal(5,2) | No | Porcentaje del descuento |
| `base_amount` | Decimal(19,2) | No | Base sobre la que se aplica |
| `amount` | Decimal(19,2) | Sí | Valor del descuento |

---

## 5. Impuestos

### 5.1 Tipos de Impuestos

| ID | Tipo | Código | Descripción | Tasa Típica |
|----|------|--------|-------------|------------|
| 1 | **IVA** | 01 | Impuesto al Valor Agregado | 19%, 5%, 0% |
| 2 | **Consumo** | 03 | Impuesto al Consumo | Varios |
| 3 | **Timbre** | 04 | Impuesto de Timbre | Excepciones |
| 4 | **Bolsa** | 08 | Impuesto a Bolsas Plásticas | 8% |
| 5 | **Impuesto a Bebidas** | 07 | Impuesto a Bebidas Azucaradas | 8% |

### 5.2 Cálculo de Impuestos

```
Para cada línea:
1. Calcular línea_subtotal = cantidad × precio_unitario
2. Aplicar descuentos de línea
3. línea_base = línea_subtotal - descuentos
4. línea_impuesto = línea_base × porcentaje_impuesto / 100
5. línea_total = línea_base + línea_impuesto

Agregados:
total_base = suma(línea_base) para todas las líneas
total_descuentos = suma(descuentos)
total_impuestos = suma(línea_impuesto)
total_factura = total_base + total_impuestos
```

---

## 6. Descuentos y Cargos

### 6.1 Descuentos Globales

Los descuentos pueden aplicarse al total de la factura después de todas las líneas.

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| `discount_percentage` | No | Porcentaje de descuento global |
| `discount_amount` | No | Valor del descuento global |
| `discount_reason` | Sí (si hay descuento) | Código DIAN de razón |

### 6.2 Cargos Adicionales

Valores adicionales que se suman al total (ej: transporte, seguros).

| Campo | Obligatorio | Descripción |
|-------|-------------|-------------|
| `charge_percentage` | No | Porcentaje de cargo |
| `charge_amount` | No | Valor del cargo |
| `charge_reason` | Sí (si hay cargo) | Razón del cargo |

---

## 7. Información de Pago

### 7.1 Forma de Pago

| ID | Tipo | Descripción |
|----|------|-------------|
| 1 | **Efectivo** | Pago en efectivo |
| 2 | **Cheque** | Pago con cheque |
| 3 | **Tarjeta Débito** | Tarjeta de débito |
| 4 | **Tarjeta Crédito** | Tarjeta de crédito |
| 5 | **Transferencia** | Transferencia bancaria |
| 6 | **Concepto** | Otras formas de pago |
| 7 | **Compensación** | Compensación/Trueque |
| 8 | **Moneda** | Pago en otra moneda |
| 9 | **Cheque Postdatado** | Cheque para fecha futura |
| 10 | **Letra** | Letra de cambio |

### 7.2 Medios de Pago

| ID | Descripción |
|----|-------------|
| 1 | Efectivo |
| 2 | Cheque de Terceros |
| 3 | Cheque Propio |
| 4 | Tarjeta de Crédito |
| 5 | Tarjeta de Débito |
| 6 | Transferencia Bancaria |
| 10 | Cuenta Corriente |
| 31 | Billetera Digital |

### 7.3 Condiciones de Pago

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `payment_method_id` | Integer | Sí | Forma de pago |
| `means_payment_id` | Integer | Sí | Medio de pago |
| `value_paid` | Decimal | Sí | Valor pagado |
| `payment_due_date` | Date | No | Fecha de vencimiento |
| `payment_terms` | String | No | Términos (ej: "Net 30") |

---

## 8. Moneda Extranjera

Si la factura está en moneda diferente a COP:

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `currency_id` | Integer | Sí | ID de la moneda |
| `trm` | Decimal | Sí | Tasa representativa del mercado |
| `original_currency_total` | Decimal | Sí | Total en moneda original |
| `total_in_cop` | Decimal | Sí | Total convertido a COP |

### Monedas Soportadas

| ID | Código | Descripción |
|----|--------|-------------|
| 272 | COP | Peso Colombiano |
| 484 | USD | Dólar Estadounidense |
| 978 | EUR | Euro |
| 124 | CAD | Dólar Canadiense |

---

## 9. Retenciones

Las retenciones son valores que se descartan de la factura por obligación fiscal.

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `withholding_type_id` | Integer | No | Tipo de retención |
| `withholding_percentage` | Decimal | No | Porcentaje retenido |
| `withholding_amount` | Decimal | No | Valor retenido |

### Tipos de Retención

| ID | Tipo | Descripción |
|----|------|-------------|
| 1 | **Reteiva** | Retención en la Fuente IVA |
| 2 | **Retefuente** | Retención en la Fuente Renta |
| 3 | **Reteica** | Retención ICA |

---

## 10. Validaciones Obligatorias

Todas las facturas deben cumplir con estas validaciones antes de ser aceptadas:

### 10.1 Validaciones Estructurales

✅ **Documento bien formado**: El XML debe ser válido según esquema UBL 2.1
✅ **Consecutividad**: Número debe ser consecutivo respecto al anterior
✅ **Rango de facturación**: Número debe estar dentro del rango autorizado
✅ **Fecha válida**: Debe ser fecha válida del calendario
✅ **Hora válida**: Debe ser hora válida del día
✅ **Prefijo**: Debe coincidir con el autorizado

### 10.2 Validaciones de Datos

✅ **Emisor existente**: NIT debe estar en RUT de la DIAN
✅ **Receptor válido**: Documento del cliente debe ser válido
✅ **Cantidades positivas**: Todas las cantidades > 0
✅ **Precios positivos**: Todos los precios > 0
✅ **Cálculos correctos**: Totales deben ser matemáticamente correctos

### 10.3 Validaciones de Impuestos

✅ **Porcentajes válidos**: IVA debe ser 19%, 5%, 0% u otro autorizados
✅ **Base imponible**: Debe ser coherente con cálculos de línea
✅ **Valor del impuesto**: Debe calcularse correctamente

### 10.4 Validaciones de Firma

✅ **Firma digital**: Debe estar presente
✅ **Certificado válido**: Debe ser vigente y emitido por AC autorizada
✅ **Integridad**: Firma debe verificar correctamente el documento

---

## 11. Errores Comunes y Soluciones

### ❌ Error: "Factura sin prefijo"
**Causa**: Campo `prefix` vacío o no configurado
**Solución**: Configurar el prefijo según la resolución de facturación (ej: FEV)

### ❌ Error: "Total no coincide con suma de líneas"
**Causa**: Error en cálculos o redondeos
**Solución**: 
1. Verificar que línea_total = cantidad × precio
2. Verificar cálculos de impuestos
3. Verificar descuentos aplicados
4. Redondear a 2 decimales

### ❌ Error: "Documento del cliente inválido"
**Causa**: Número de documento no válido para el tipo
**Solución**: Validar que el formato sea correcto para el tipo de documento

### ❌ Error: "Emisor no existe"
**Causa**: NIT no está registrado en RUT DIAN
**Solución**: Verificar que el NIT sea correcto y esté activo

### ❌ Error: "Fuera de rango de facturación"
**Causa**: Número de factura no está en el rango autorizado
**Solución**: Verificar que el número esté dentro del rango (del-al) autorizado

### ❌ Error: "Firma inválida"
**Causa**: Certificado expirado, revocado o documento modificado
**Solución**: 
1. Verificar que el certificado sea vigente
2. Verificar que no se haya modificado el documento
3. Re-firmar si es necesario

### ❌ Error: "Impuesto no permitido"
**Causa**: Porcentaje de impuesto no autorizado
**Solución**: Usar solo porcentajes válidos (19%, 5%, 0%)

---

## 12. Consideraciones Especiales

### Descuentos Condicionales
Se pueden especificar descuentos por pronto pago:
- Aplican solo si se cumplen las condiciones de pago
- Se deben documentar claramente

### Documentos Complementarios
Factura puede referenciar:
- Orden de compra
- Remisión
- Contrato previo

### Información Adicional
Campos opcionales para información contextual:
- Referencia de cliente
- Centro de costos
- Proyecto asociado

---

## 13. Referencias Normativas

| Referencia | Descripción |
|-----------|-------------|
| **Resolución 000165 de 2024** | Regulación oficial de Factura Electrónica |
| **UBL 2.1** | Estándar de estructura XML |
| **RUT DIAN** | Registro de contribuyentes |
| **Decreto 1165 de 2022** | Obligatoriedad de facturación electrónica |

---

## 14. Enlaces Rápidos

- 📋 [Validaciones Detalladas](/docs/regulatory-framework/factura-electronica/anexo-tecnico/validaciones)
- ⚠️ [Excepciones y Casos Especiales](/docs/regulatory-framework/factura-electronica/anexo-tecnico/excepciones)
- 💡 [Ejemplos Prácticos](/docs/regulatory-framework/factura-electronica/ejemplos-aplicacion)
- 🔧 [Tablas de Equivalencias](/docs/regulatory-framework/factura-electronica/tablas-equivalencias)
- ❓ [Preguntas Frecuentes (FAQ)](/docs/regulatory-framework/factura-electronica/faq)
- 📥 [Descargar PDF Oficial](https://www.dian.gov.co/)

---

**Última actualización**: Octubre 2025  
**Versión del Anexo Técnico**: 1.9  
**Estado**: Vigente
