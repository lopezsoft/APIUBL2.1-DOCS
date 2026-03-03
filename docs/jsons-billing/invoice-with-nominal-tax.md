---
sidebar_position: 29
---

# Factura con Impuesto Nominal

A continuación se muestra un ejemplo de un JSON que representa una factura con impuesto nominal (valor fijo por unidad). Este tipo de impuesto **no** se calcula como un porcentaje sobre una base gravable, sino como un valor monetario fijo multiplicado por la cantidad de unidades. Los campos `taxable_amount` y `percent` deben enviarse con valor `0`.

:::warning Regla de validación DIAN
La DIAN valida matemáticamente que `tax_amount = per_unit_amount × base_unit_measure`. Una diferencia en el resultado genera rechazo por las reglas `FAX07` (línea) / `FAS07` (cabecera del documento).
:::

```json title="invoice-with-nominal-tax.json"
{
  "resolution_number": "18764074347312",
  "prefix": "LZT",
  "notes": "Nota del documento",
  "document_number": "3001",
  "graphic_representation": 0,
  "send_email": 1,
  "operation_type_id": 1,
  "type_document_id": 7,
  "payments": [
    {
      "payment_method_id": 1,
      "means_payment_id": 10,
      "value_paid": "2233.01"
    }
  ],
  "customer": {
    "country_id": "45",
    "city_id": "836",
    "identity_document_id": "1",
    "type_organization_id": 2,
    "tax_regime_id": 2,
    "tax_level_id": 5,
    "company_name": "LOPEZ GOMEZ LEWIS OSWALDO",
    "dni": "1063279307",
    "mobile": "3108435423",
    "email": "lws_1234@hotmail.com",
    "address": "Calle 64 #1823",
    "postal_code": "661002"
  },
  "lines": [
    {
      "invoiced_quantity": "1",
      "quantity_units_id": "70",
      "line_extension_amount": "1550.70",
      "free_of_charge_indicator": false,
      "description": "PRODUCTO SUJETO A IMPUESTO NOMINAL",
      "code": "PROD001",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "price_amount": "1550.70",
      "base_quantity": "1",
      "tax_totals": [
        {
          "tax_id": "1",
          "tax_amount": 294.633000,
          "taxable_amount": 1550.700000,
          "percent": 19
        },
        {
          "tax_id": "18",
          "tax_amount": 387.675000,
          "per_unit_amount": 387.675000,
          "base_unit_measure": 1,
          "quantity_units_id": 70,
          "taxable_amount": 0,
          "percent": 0
        }
      ]
    }
  ],
  "legal_monetary_totals": {
    "line_extension_amount": "1550.70",
    "tax_exclusive_amount": "1550.70",
    "tax_inclusive_amount": "2233.008",
    "payable_amount": 2233.01
  },
  "tax_totals": [
    {
      "tax_id": "1",
      "tax_amount": 294.633000,
      "taxable_amount": 1550.700000,
      "percent": 19
    },
    {
      "tax_id": "18",
      "tax_amount": 387.675000,
      "per_unit_amount": 387.675000,
      "base_unit_measure": 1,
      "quantity_units_id": 70,
      "taxable_amount": 0,
      "percent": 0
    }
  ]
}
```
