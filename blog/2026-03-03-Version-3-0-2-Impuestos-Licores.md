---
slug: version-3-0-2-impuestos-licores-documentacion
title: "Versión 3.0.2 - Soporte de Impuestos Nominales y Licores"
authors: [lewis]
tags: [release, v3-0-2, impuestos, licores, ad-valorem, nominal, documentacion]
date: 2026-03-03
---

# 📋 API UBL 2.1 v3.0.2 - Impuestos Nominales y Licores

Se publica la **versión 3.0.2** de la documentación de la API de Facturación Electrónica. Esta entrega se enfoca en la correcta integración de impuestos sobre licores y bebidas, cubriendo tanto la modalidad **Ad Valorem** (porcentual) como la modalidad **Nominal** (valor fijo por unidad), de acuerdo con el estándar UBL 2.1 y las reglas de validación de la DIAN.

<!--truncate-->

## Que hay de nuevo

### Documentación de Impuestos Nominales

Se actualizaron las secciones `lines->tax_totals` y `tax_totals` de la [Referencia de Campos](/docs/billing-fields) para cubrir de forma explícita los impuestos de valor fijo por unidad (nominales).

**Cambios clave:**

- Se unificó la estructura de ambas secciones para los dos tipos de tributo: **porcentual** y **nominal**.
- Se incorporó la advertencia de validación DIAN con las reglas `FAX07` / `FAS07` (línea y cabecera).
- Se documentó la fórmula obligatoria: `tax_amount = per_unit_amount x base_unit_measure`.
- Se dejó en claro que `taxable_amount` y `percent` deben enviarse con **valor `0`** para impuestos nominales (no omitirse).
- Se añadió la descripción del campo `quantity_units_id` como entero numérico.

**Estructura JSON para impuesto nominal:**

```json
{
  "tax_id": "18",
  "tax_amount": 387.675000,
  "per_unit_amount": 387.675000,
  "base_unit_measure": 1,
  "quantity_units_id": 70,
  "taxable_amount": 0,
  "percent": 0
}
```

---

### Nuevo ejemplo: Factura con Impuesto Nominal

Se añadió el ejemplo [`invoice-with-nominal-tax`](/docs/jsons-billing/invoice-with-nominal-tax) que combina:

- **IVA** (Código `01`) — impuesto porcentual del 19% sobre la base gravable.
- **Impuesto Nominal** (Código `18`) — valor fijo por unidad.

```json
"tax_totals": [
  {
    "tax_id": "1",
    "tax_amount": 294.633,
    "taxable_amount": 1550.70,
    "percent": 19
  },
  {
    "tax_id": "18",
    "tax_amount": 387.675,
    "per_unit_amount": 387.675,
    "base_unit_measure": 1,
    "quantity_units_id": 70,
    "taxable_amount": 0,
    "percent": 0
  }
]
```

---

### Nuevo ejemplo: Factura Licores - Ad Valorem

Se añadió el ejemplo [`invoice-licores-ad-valorem`](/docs/jsons-billing/invoice-licores-ad-valorem) para facturas de cerveza, vinos y licores bajo la modalidad **Ad Valorem** (porcentual, Código `22`).

En esta modalidad el impuesto al consumo se calcula sobre la base gravable usando `taxable_amount` y `percent`, igual que el IVA.

```json
"tax_totals": [
  {
    "tax_id": "1",
    "tax_amount": 294.633,
    "taxable_amount": 1550.70,
    "percent": 19.00
  },
  {
    "tax_id": "22",
    "tax_amount": 387.675,
    "taxable_amount": 1550.70,
    "percent": 25.00
  }
]
```

**Diferencia entre Ad Valorem y Nominal:**

| Campo | Ad Valorem | Nominal |
|---|---|---|
| `percent` | porcentaje (ej. 25) | 0 |
| `taxable_amount` | base en pesos | 0 |
| `per_unit_amount` | no aplica | valor fijo por unidad |
| `base_unit_measure` | no aplica | cantidad de unidades |
| `quantity_units_id` | no aplica | codigo unidad DIAN |

---

## Resumen de Cambios

| Tipo | Detalle |
|---|---|
| Documentacion | Secciones `lines->tax_totals` y `tax_totals` actualizadas en `billing-fields` |
| Ejemplo nuevo | `invoice-with-nominal-tax` — Impuesto nominal (Codigo 18) |
| Ejemplo nuevo | `invoice-licores-ad-valorem` — Licores Ad Valorem (Codigo 22, 25%) |
| Conteo ejemplos | Actualizado de 26 a 30 en el indice de facturacion |

---

## Como actualizar

No se requieren cambios en integraciones existentes. Si facturas productos sujetos a impuestos de licores o bebidas, revisa la modalidad aplicable:

- **Ad Valorem:** usa `taxable_amount` y `percent`.
- **Nominal/Especifico:** usa `per_unit_amount`, `base_unit_measure` y `quantity_units_id`; envía `taxable_amount: 0` y `percent: 0`.

Consulta la [referencia completa de campos](/docs/billing-fields#lines-tax_totals) para mas detalles.
