---
sidebar_position: 6
description: "Glosario de términos técnicos, normativas y acrónimos de facturación electrónica"
---

# Glosario Técnico

## Introducción

Este glosario contiene los términos técnicos, normativas, acrónimos y conceptos principales relacionados con la facturación electrónica en Colombia.

---

## A

### Ambiente de Destino
**Definición**: El entorno al cual se envía la factura electrónica.

**Valores**:
- **Producción (1)**: Ambiente real donde se emiten facturas válidas
- **Pruebas (2)**: Ambiente de prueba para validar integraciones

**Código DIAN**: `cbc:ProfileExecutionID`

**Ejemplo**:
```json
{
  "environment_id": 1  // Producción
}
```

---

### APCRUDO
**Definición**: Arancel de Protección de la Producción Agrícola Colombiana.

**Aplicación**: Sobretasa arancelaria para productos agrícolas.

---

### Asignación por Inflación
**Definición**: Incremento al valor del auxilio de transporte por incrementos en el IPC.

---

## B

### Base Imponible
**Definición**: El valor sobre el cual se calculan los impuestos.

**Fórmula**: `Base Imponible = Subtotal - Descuentos`

**Ejemplo**:
```
Subtotal: 100,000
Descuento: 10,000
Base Imponible: 90,000
IVA (19%): 17,100
```

---

## C

### CUFE
**Definición**: Código Único de Factura Electrónica.

**Significado**: Identificador único generado por la DIAN para cada factura.

**Formato**: Secuencia alfanumérica de 44 caracteres.

**Cálculo**: SHA256 de: NIT_EMISOR + PREFIJO + NUMERO + FECHA + MONTO_TOTAL + NIT_CLIENTE + IVA + ICA + FIRMA

**Ejemplo**:
```
CUFE: f8e5c3a9b2d1e6f4g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3
```

---

### Certificado Digital
**Definición**: Documento criptográfico que identifica digitalmente a una persona o entidad.

**Requisitos**:
- Emitido por Entidad de Certificación acreditada
- Debe estar vigente
- Contiene clave privada para firmar

**Tipos**:
- Certificado A1 (en software)
- Certificado A3 (en token/tarjeta)

---

### Código de Descuento
**Definición**: Código asignado por DIAN para justificar descuentos.

**Ejemplos**:
- `001`: Descuento por volumen
- `002`: Rebaja
- `003`: Bonificación
- `004`: Devolución de IVA

---

## D

### Descuento
**Definición**: Reducción del precio de la factura antes de aplicar impuestos.

**Tipos**:
- **Descuento Comercial**: Por volumen o cliente especial
- **Descuento por Pronto Pago**: Si se paga antes de fecha limite
- **Descuento por Rebaja**: Ajuste por defecto

**Cálculo**: Se aplica ANTES de calcular impuestos

---

### Dígito Verificador
**Definición**: Dígito calculado mediante algoritmo para validar integridad de un número.

**Usado en**:
- NIT de personas
- Cédulas
- Códigos de productos

**Algoritmo para NIT**: Ver [Validaciones de NIT](/docs/regulatory-framework/factura-electronica/anexo-tecnico/validaciones#31-identificación-del-emisor)

---

### Documento Electrónico
**Definición**: Documento que existe únicamente en formato digital y tiene validez legal.

**Características**:
- ✅ Firma digital
- ✅ Validez probatoria
- ✅ Integridad garantizada
- ✅ Trazabilidad

---

### DIAN
**Definición**: Dirección de Impuestos y Aduanas Nacionales de Colombia.

**Función**: Entidad estatal que regula la facturación electrónica.

**Sitio Web**: https://www.dian.gov.co

---

## E

### Encabezado
**Definición**: Sección inicial del documento que contiene información general.

**Incluye**:
- Número y prefijo
- Fechas
- Emisor y receptor
- Tipo de documento

---

### Estándar UBL
**Definición**: Universal Business Language - Estándar XML internacional para documentos comerciales.

**Versión**: UBL 2.1

**Namespace**: `urn:oasis:names:specification:ubl:schema:xsd:Invoice-2`

---

### Expedición
**Definición**: Lugar donde se genera la factura.

**Diferente de**: Lugar de entrega o destino del producto.

---

## F

### Factura Electrónica (FE)
**Definición**: Documento electrónico que comprueba una transacción de venta.

**Características**:
- ✅ Validez legal ante cualquier autoridad
- ✅ Consecutividad obligatoria
- ✅ Firma digital requerida
- ✅ Aceptación DIAN necesaria

**Normativa**: Resolución 000165 de 2024

---

### Firma Digital
**Definición**: Mecanismo criptográfico que garantiza autenticidad e integridad de un documento.

**Componentes**:
- Certificado digital (identifica)
- Hash encriptado (garantiza integridad)

---

### Folio
**Definición**: Número secuencial único de un documento.

**En Colombia se llama**: Número de factura o consecutivo

---

## G

### Gasto No Deducible
**Definición**: Gasto que la empresa no puede descontar de sus impuestos.

**Ejemplo**: Multas, sanciones

---

## H

### Hash
**Definición**: Valor criptográfico que resume el contenido de un documento.

**Propiedad**: Cualquier cambio en el documento genera un hash diferente.

**Algoritmo usado**: SHA256

---

## I

### ICA
**Definición**: Impuesto de Industria y Comercio.

**Características**:
- Impuesto municipal (varía por ciudad)
- Tarifa: 0% a 8.64% según sector
- Base: Ingresos brutos

---

### ICE
**Definición**: Impuesto Nacional al Consumo.

**Aplicación**: Bienes específicos (cigarrillos, bebidas, gasolina, etc.)

**Tarifa**: Según bien (0% a 60%)

---

### INCOTERM
**Definición**: Términos de Comercio Internacional que definen obligaciones en transporte internacional.

**Comunes**:
- **FOB** (Free on Board): Libre a bordo, vendedor paga hasta puerto
- **CIF** (Cost, Insurance & Freight): Incluye seguro y flete
- **DDP** (Delivered Duty Paid): Comprador no paga derechos
- **EXW** (Ex Works): En fábrica, comprador paga todo

---

### IVA
**Definición**: Impuesto al Valor Agregado.

**Características**:
- Impuesto nacional
- Tarifa general: 19%
- Tarifa reducida: 5% (alimentos básicos)
- Tarifa especial: 0% (exentos, exportaciones)

---

### Item
**Definición**: Producto o servicio individual en una línea de factura.

**Sinónimos**: Línea, producto, SKU

---

## J

### JSON
**Definición**: JavaScript Object Notation - Formato de datos basado en texto.

**Uso en API**: Formato estándar de intercambio de datos.

**Ejemplo**:
```json
{
  "invoice_number": 2001,
  "total": 119000.00
}
```

---

## L

### Línea de Factura
**Definición**: Cada producto o servicio individual en el detalle de la factura.

**Componentes**:
- Descripción
- Cantidad
- Precio unitario
- Descuentos
- Impuestos

---

### Liquidación del IVA
**Definición**: Cálculo del IVA a pagar basado en facturación.

**Fórmula**: IVA Cobrado - IVA Pagado = IVA a Pagar

---

## M

### Medio de Pago
**Definición**: Instrumento específico de pago.

**Ejemplos**:
- Efectivo (10)
- Tarjeta de crédito (41)
- Tarjeta de débito (40)
- Cheque (02)
- Transferencia bancaria (42)

---

### Método de Pago
**Definición**: Categoría general de pago.

**Ejemplos**:
- Contado (01)
- Crédito (02)
- Mixto (03)

---

### Moneda
**Definición**: Divisa en la que se expresa el valor de la factura.

**Código ISO 4217**:
- COP (170): Peso Colombiano
- USD (840): Dólar estadounidense
- EUR (978): Euro

---

## N

### NIT
**Definición**: Número de Identificación Tributaria.

**Características**:
- Identificador único en Colombia
- 8-10 dígitos + dígito verificador
- Obligatorio para personas y empresas

**Validación**: Ver algoritmo de [Dígito Verificador](#dígito-verificador)

---

### Nota Crédito
**Definición**: Documento que reduce el valor de una factura anterior.

**Usos**:
- Devoluciones
- Descuentos posteriores
- Ajustes comerciales

**Normativa**: Resolución 000165 de 2024

---

### Nota Débito
**Definición**: Documento que aumenta el valor de una factura anterior.

**Usos**:
- Servicios adicionales
- Recargos
- Ajustes por error

---

## O

### Operación
**Definición**: Clasificación del tipo de transacción.

**Tipos**:
- Nacional (1)
- Exportación (2)
- Importación (3)
- Devolución (4)

---

### OAuth2
**Definición**: Protocolo abierto de autorización.

**Usado para**: Autenticación segura en APIs.

**Ventajas**:
- ✅ No requiere compartir contraseña
- ✅ Token con expiración
- ✅ Permisos granulares

---

## P

### Pago
**Definición**: Transferencia de dinero para saldar una obligación.

**Componentes**:
- Método de pago
- Medio de pago
- Monto
- Fecha

---

### PDF
**Definición**: Portable Document Format - Formato de archivo universal.

**Uso**: Representación visual imprimible de la factura.

---

### Período de Facturación
**Definición**: Rango de fechas que cubre la factura.

**Ejemplo**: Mes, trimestre, período específico

---

### Prefijo
**Definición**: Secuencia de caracteres que precede al número de factura.

**Ejemplo**: "FEV", "NCV", "POS"

**Autorizado por**: Resolución de facturación DIAN

---

## Q

### Que (¿Qué es...?)
Esta letra no tiene términos específicos en facturación electrónica.

---

## R

### Radian
**Definición**: Red de Administración de Documentos Activos de Identificación Normalizada.

**Función**: Intercambio seguro de documentos electrónicos.

**Normativa**: Resolución 000198 de 2024

---

### Régimen Fiscal
**Definición**: Clasificación tributaria de una empresa.

**Tipos**:
- Régimen común (1)
- Régimen simplificado (2)
- Régimen de transición (3)

---

### Régimen Contable
**Definición**: Forma de llevar libros de contabilidad.

**Tipos**:
- Tributario (1)
- NIIF (2)

---

### Resolución de Facturación
**Definición**: Autorización de DIAN para emitir facturas.

**Información**:
- Número único
- Rango de números autorizado
- Prefijos autorizados
- Fecha de vigencia

---

### Retención
**Definición**: Porcentaje del pago retenido por el comprador.

**Usos**:
- Retención en la fuente (IVA)
- Retención por servicios
- Garantía de cumplimiento

---

### RUT
**Definición**: Registro Único Tributario (Colombia).

**Diferencia con NIT**: RUT puede incluir NIT + otras informaciones.

---

## S

### SKU
**Definición**: Stock Keeping Unit - Código de identificación de producto.

**Ejemplo**: "PROD-001", "PRD-A1234"

---

### Subtotal
**Definición**: Suma de todos los precios de líneas antes de descuentos e impuestos.

**Fórmula**: `Subtotal = SUM(cantidad × precio_unitario de cada línea)`

---

## T

### TM
**Definición**: Timbre Marcario o Timbrado.

**Función**: Marca oficial de la DIAN en documentos.

---

### Total
**Definición**: Monto final a pagar por el cliente.

**Fórmula**: `Total = Subtotal - Descuentos + Impuestos`

---

### TRM
**Definición**: Tasa Representativa del Mercado.

**Función**: Valor oficial del dólar en Colombia.

**Uso**: Convertir valores en moneda extranjera a COP.

**Fuente**: Banco de la República

---

### Tributario
**Definición**: Relacionado con impuestos y contribuciones.

---

## U

### UBL
**Definición**: Universal Business Language - Ver [Estándar UBL](#estándar-ubl)

---

### Unidad de Medida
**Definición**: Forma de contar los productos (cantidad).

**Ejemplos**:
- Unidad (1093)
- Kilogramo (kg)
- Litro (L)
- Metro (m)
- Docena (dz)

**Código UNECE**: Códigos internacionales

---

## V

### Validación
**Definición**: Verificación de que un documento cumple con requisitos.

**Niveles**:
- Estructura (XML válido)
- Datos (valores correctos)
- Negocio (reglas DIAN)
- Firma (certificado válido)

---

### Valor Agregado
**Definición**: Incremento de valor desde producción hasta venta final.

**Relacionado con**: IVA (Impuesto al Valor Agregado)

---

## W

### Webhook
**Definición**: Notificación automática de eventos en tiempo real.

**Uso**: Avisar cuando DIAN acepta/rechaza una factura.

---

## X

### XML
**Definición**: eXtensible Markup Language - Formato de datos estructurado.

**Usado para**: Estructura técnica de facturas electrónicas.

**Ejemplo**:
```xml
<Invoice>
  <ID>2001</ID>
  <Total>119000.00</Total>
</Invoice>
```

---

## Y

### YO (No hay términos)
Esta letra no tiene términos específicos en facturación electrónica.

---

## Z

### Zona Franca
**Definición**: Área territorial con beneficios tributarios especiales.

**Beneficio**: Exención o reducción de impuestos.

---

## Tablas de Referencia Rápida

### Códigos de Documentos
| Código | Tipo | Normativa |
|--------|------|-----------|
| 1 | Factura de Venta | Res. 165 |
| 2 | Factura de Exportación | Res. 165 |
| 91 | Nota Crédito | Res. 165 |
| 92 | Nota Débito | Res. 165 |

### Tipos de Identificación
| Código | Tipo |
|--------|------|
| 1 | Cédula de Ciudadanía |
| 2 | NIT |
| 3 | Pasaporte |
| 4 | Documento de Extranjería |
| 5 | Tarjeta de Identidad |

### Códigos de Países
| Código | País | ISO |
|--------|------|-----|
| 45 | Colombia | CO |
| 169 | Colombia | CO |
| 226 | Estados Unidos | US |
| 137 | México | MX |
| 37 | Brasil | BR |

---

## 🔗 Enlaces Relacionados

- 📋 [Validaciones Técnicas](/docs/regulatory-framework/factura-electronica/anexo-tecnico/validaciones)
- ⚠️ [Excepciones y Casos Especiales](/docs/regulatory-framework/factura-electronica/anexo-tecnico/excepciones)
- 🎓 [Guías de Caso de Uso](/docs/use-cases/simple-invoice)
- 📖 [Marco Regulatorio DIAN](/docs/regulatory-framework/overview)

---

**Última actualización**: Octubre 2024
**Versión**: 1.0
**Términos**: 100+ definiciones
**Cobertura**: Facturación, impuestos, DIAN, operaciones
