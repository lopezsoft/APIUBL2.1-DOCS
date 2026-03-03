---
slug: version-1-4-1-mandatos
title: "v1.4.1 - Soporte de Mandatos en Facturas Electrónicas"
authors: [lewis]
tags: [mandatos, facturas, api, v1.4.1]
date: 2025-10-17
---

# Versión 1.4.1 - Soporte de Mandatos en Facturas Electrónicas 📋

Estamos emocionados de anunciar la versión **1.4.1** de nuestro API UBL 2.1, que incluye soporte completo para **mandatos en facturas electrónicas**.

<!--truncate-->

## ✨ Nuevas Características

### 📌 Soporte de Mandatos

Ahora puedes generar facturas de mandatos indicando los mandatarios a nivel de ítem. Esta funcionalidad es esencial para operaciones comerciales donde actúas como intermediario en nombre de terceros.

**Campo nuevo en líneas:**
```json
"mandate": {
  "dni": "2222222222",
  "dv": "2",
  "code": "0"
}
```

### 🎯 Códigos de Mandato

Se soportan dos tipos de ingresos según el mandato:

| Código | Significado |
|--------|-------------|
| **0** | B/S ingreso propio |
| **1** | B/S Ingresos Recibidos para Terceros |

## 📚 Documentación

Hemos actualizado completamente la documentación con:

- ✅ Descripción detallada del campo `mandate` en [Campos de Facturación](/docs/billing-fields#lines-mandate)
- ✅ Ejemplo completo de factura de mandatos en [JSON Ejemplos - Factura Mandatos](/docs/jsons-billing/mandate-invoice)
- ✅ Tabla de códigos de mandato
- ✅ Estructura y validación completa

## 💡 Casos de Uso

Este tipo de facturas es ideal para:

- **Distribuidoras**: Vender productos en nombre de terceros
- **Comisionistas**: Actuar como intermediario en operaciones
- **Agentes de ventas**: Registrar ventas en nombre de otros
- **Operaciones de mandato**: Cualquier transacción donde se actúa en representación

## 🔧 Implementación

### Ejemplo de Factura de Mandatos

```json
{
  "type_document_id": 7,
  "operation_type_id": 3,
  "lines": [
    {
      "description": "PRODUCTO A",
      "price_amount": "50",
      "invoiced_quantity": "2",
      "line_extension_amount": "100.00",
      "mandate": {
        "dni": "2222222222",
        "dv": "2",
        "code": "1"  // B/S Ingresos para Terceros
      }
    }
  ]
}
```

## 🚀 Mejoras Incluidas

- ✨ Parser JSON/XML mejorado con auto-detección
- 📱 Responsividad completa del chat (desktop, tablet, mobile)
- 🎨 Efectos visuales profesionales en controles
- 📦 Sistema offcanvas para sidebar en mobile
- 💻 Headers compactos optimizados
- 🎯 Overlay dinámico para mejor UX

## 📊 Estadísticas

- **Líneas agregadas**: 173
- **Nuevos archivos**: 1 (mandate-invoice.md)
- **Documentación actualizada**: billing-fields.md
- **Build**: ✅ Exitoso sin errores

## 🔗 Links Importantes

- 📖 [Documentación de Mandatos](/docs/billing-fields#lines-mandate)
- 📋 [Ejemplo JSON Completo](/docs/jsons-billing/mandate-invoice)
- 🔧 [Campos de Facturación](/docs/billing-fields)
- 💬 [Chat Asistente IA](/chat)

## ✅ Compatibilidad

- ✅ Compatible con DIAN (Resolución 000165 de 2024)
- ✅ Soporta ambientes de habilitación y producción
- ✅ Compatible con todos los tipos de documentos electrónicos

## 📝 Notas de Actualización

- El campo `mandate` es **obligatorio solo para facturas de mandato**
- Se informa a **nivel de ítem**
- Un **mandante por ítem**
- Los códigos de mandato son valores específicos (0 o 1)

---

**¡Comienza a usar mandatos hoy mismo!** Consulta nuestra documentación completa o prueba con nuestro [Chat Asistente IA](/chat) para recibir ayuda personalizada.

**Versión**: 1.4.1  
**Fecha**: 17 de Octubre de 2025  
**Estado**: ✅ Producción
