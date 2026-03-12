---
slug: version-3-0-3-customer-extra-data
title: "Versión 3.0.3 - Datos Extra del Cliente en Documentos Electrónicos"
authors: [lewis]
tags: [release, v3-0-3, customer, extra-data, representacion-grafica, documentacion]
date: 2026-03-12
---

# 📋 API UBL 2.1 v3.0.3 - Datos Extra del Cliente

Se publica la **versión 3.0.3** de la documentación de la API de Facturación Electrónica. Esta entrega incorpora el soporte del campo `extra_data` dentro del objeto `customer`, permitiendo incluir información adicional del cliente en la representación gráfica del documento.

<!--truncate-->

## Qué hay de nuevo

### Campo `extra_data` en `customer`

Se añadió el campo `extra_data` al objeto `customer` en la [Referencia de Campos](/docs/billing-fields), siguiendo el mismo patrón ya existente en las líneas del documento (`lines->extra_data`).

Este campo permite enviar pares clave-valor que se mostrarán en la representación gráfica del documento (PDF) y **no se transmiten a la DIAN**.

**Casos de uso típicos:**

- Número de socio o afiliado
- Fecha de vinculación del cliente
- Código interno del cliente
- Cualquier dato adicional de presentación en el comprobante

**Estructura JSON:**

```json
"customer": {
  "city_id": "836",
  "identity_document_id": "3",
  "type_organization_id": 2,
  "tax_regime_id": 2,
  "tax_level_id": 5,
  "company_name": "LOPEZ GOMEZ LEWIS OSWALDO",
  "dni": "1063279307",
  "mobile": "3108435423",
  "email": "lws_1234@hotmail.com",
  "address": "Calle 64 #1823",
  "postal_code": "661002",
  "extra_data": [
    {
      "title": "No. Socio",
      "value": "78-54121-454"
    },
    {
      "title": "FECHA DE VINCULACIÓN",
      "value": "02/02/2026"
    }
  ]
}
```

#### Detalle de los campos de `extra_data`

| Campo   | Tipo   | Requerido | Descripción                          |
| ------- | ------ | :-------: | ------------------------------------ |
| `title` | string |    🔴     | Etiqueta o nombre del dato adicional |
| `value` | string |    🔴     | Valor del dato adicional             |

---

### Actualización del ejemplo `invoice-extra-data`

Se actualizó el ejemplo [Factura con datos extra](/docs/jsons-billing/invoice-extra-data) para incluir el nuevo campo `extra_data` dentro del objeto `customer`, complementando los datos extra que ya existían a nivel de línea.

**Cambios en el ejemplo:**

- `document_number` actualizado a `"4068"`.
- Se añadió el array `extra_data` al `customer` con los campos **No. Socio** y **FECHA DE VINCULACIÓN**.
