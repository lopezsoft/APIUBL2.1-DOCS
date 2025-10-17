---
sidebar_position: 1
description: "Introducción a la Factura Electrónica según la DIAN"
---

# Factura Electrónica (FE)

## Definición

La **Factura Electrónica de Venta** es un documento electrónico que expresa un comprobante de venta y es emitido por el responsable del régimen de facturación. Tiene plena validez legal y valor probatorio ante cualquier autoridad.

## Base Normativa

| Aspecto | Detalle |
|--------|---------|
| **Resolución** | Resolución 000165 de 2024 DIAN |
| **Versión Vigente** | 1.9 |
| **Estándar** | UBL 2.1 (Universal Business Language) |
| **XML Namespace** | urn:oasis:names:specification:ubl:schema:xsd:Invoice-2 |
| **Validez** | Reconocida como documento contable oficial |

## Propósito

La Factura Electrónica cumple los siguientes propósitos:

✅ **Comprobante de Venta**: Evidencia la transacción comercial entre vendedor y comprador

✅ **Documento Fiscal**: Registra operaciones para fines tributarios

✅ **Trazabilidad**: Permite seguimiento de operaciones comerciales

✅ **Facilidad Administrativa**: Reduce trámites y tiempos de gestión

✅ **Integridad de Datos**: Garantiza autenticidad mediante firma digital

## Obligatoriedad

Están **obligados a emitir Factura Electrónica**:

- Responsables del régimen común
- Responsables del régimen simplificado que voluntariamente se acogen a FE
- Empresas obligadas por resolución DIAN
- Prestadores de servicios de telecomunicaciones
- Proveedores de energía eléctrica

:::note
Existen excepciones y casos especiales. Consulta con la DIAN si tienes dudas sobre tu obligatoriedad.
:::

## Estructura General

Una Factura Electrónica contiene:

```
Factura Electrónica
├── Encabezado (Header)
│   ├── Identificación del documento
│   ├── Información del emisor (Vendedor)
│   ├── Información del comprador
│   └── Fechas y referencias
├── Líneas de Producto/Servicio
│   ├── Descripción
│   ├── Cantidad
│   ├── Precio
│   ├── Descuentos
│   └── Impuestos
├── Totales
│   ├── Subtotal
│   ├── Descuentos totales
│   ├── Impuestos totales
│   └── Total a pagar
└── Firma Digital
    ├── Certificado digital
    └── Hash encriptado
```

## Ciclo de Vida de una Factura

```
┌─────────────┐
│  Creación   │ ← Se genera la factura
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Firma      │ ← Se firma digitalmente
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Validación │ ← La DIAN valida estructura y datos
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Rechazo    │ ← Si no cumple requisitos
│    o        │
│  Aceptación │ ← Si es válida
└─────────────┘
```

## Documentos Relacionados

Además de la Factura Electrónica de Venta estándar, existen:

### 📌 Nota Crédito
Documento que modifica el comprobante fiscal disminuyendo el monto total de la operación. Se usa para:
- Devoluciones parciales
- Descuentos posteriores a la factura
- Ajustes comerciales

### 📌 Nota Débito
Documento que modifica el comprobante fiscal aumentando el monto total de la operación. Se usa para:
- Aumentos de precio
- Cargos adicionales
- Ajustes por servicios adicionales

### 📌 Factura de Cambio de Régimen
Emitida cuando el responsable cambia de régimen fiscal.

## Próximos Pasos

Selecciona el tema que necesites:

- 📋 [Anexo Técnico Detallado](/docs/regulatory-framework/factura-electronica/technical-annex) - Especificaciones completas de campos
- ⚙️ [Validaciones](/docs/regulatory-framework/factura-electronica/anexo-tecnico/validaciones) - Reglas de validación
- ⚠️ [Excepciones](/docs/regulatory-framework/factura-electronica/anexo-tecnico/excepciones) - Casos especiales
- 💡 [Ejemplos de Aplicación](/docs/regulatory-framework/factura-electronica/ejemplos-aplicacion) - Casos prácticos
