---
sidebar_position: 5
---
# Factura con Propina

A continuación se muestra un ejemplo de un JSON que representa una factura con cargos. Este JSON se puede utilizar para pruebas o para simular una factura real.

```json title="invoice-with-tip.json"
{
  "resolution_number": "18764074347312",
  "prefix": "LZT",
  "notes": "Nota del documento",
  "document_number": "1",
  "graphic_representation": 0,
  "send_email": 0,
  "operation_type_id": 1,
  "type_document_id": 7,
  "payments": [
    {
      "payment_method_id": 1,
      "means_payment_id": 10,
      "value_paid": "13600.00"
    },
    {
      "payment_method_id": 1,
      "means_payment_id": 47,
      "value_paid": "10000"
    }
  ],
  "customer": {
    "country_id": "45",
    "city_id": "149",
    "identity_document_id": "1",
    "type_organization_id": 2,
    "tax_regime_id": 2,
    "tax_level_id": 5,
    "company_name": "LEWIS LOPEZ GOMEZ",
    "dni": "1063279307",
    "mobile": "3108435431",
    "email": "lws_1234@hotmail.com",
    "address": "Direccion residencial",
    "postal_code": "661002"
  },
  "lines": [
    {
      "invoiced_quantity": 1,
      "quantity_units_id": "1093",
      "line_extension_amount": 12500,
      "free_of_charge_indicator": false,
      "description": "Hamburguesa Gaucha (Hamburguesa Gaucha)",
      "code": "P118076",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "price_amount": 15000,
      "base_quantity": 1,
      "mu": "U",
      "allowance_charges": [
        {
          "charge_indicator": false,
          "allowance_charge_reason": "Descuento 10%",
          "base_amount": 15000,
          "amount": 1500
        }
      ],
      "tax_totals": [
        {
          "tax_id": "4",
          "tax_amount": 1000,
          "percent": 8,
          "taxable_amount": 12500
        }
      ]
    },
    {
      "invoiced_quantity": 1,
      "quantity_units_id": "1093",
      "line_extension_amount": 3333.33,
      "free_of_charge_indicator": false,
      "description": "Tocineta",
      "code": "M58978",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "price_amount": 4000,
      "base_quantity": 1,
      "mu": "U",
      "allowance_charges": [
        {
          "charge_indicator": false,
          "allowance_charge_reason": "Descuento 10%",
          "base_amount": 4000,
          "amount": 400
        }
      ],
      "tax_totals": [
        {
          "tax_id": "4",
          "tax_amount": 266.67,
          "percent": 8,
          "taxable_amount": 3333.33
        }
      ]
    },
    {
      "invoiced_quantity": 1,
      "quantity_units_id": "1093",
      "line_extension_amount": 4166.67,
      "free_of_charge_indicator": false,
      "description": "Queso Provolone",
      "code": "M58979",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "price_amount": 5000,
      "base_quantity": 1,
      "allowance_charges": [
        {
          "charge_indicator": false,
          "allowance_charge_reason": "Descuento 10%",
          "base_amount": 5000,
          "amount": 500
        }
      ],
      "mu": "U",
      "tax_totals": [
        {
          "tax_id": "4",
          "tax_amount": 333.33,
          "percent": 8,
          "taxable_amount": 4166.67
        }
      ]
    }
  ],
  "allowance_charges": [
    {
      "charge_indicator": true,
      "amount": 2000,
      "base_amount": 20000,
      "allowance_charge_reason": "PROPINA 10%",
      "multiplier_factor_numeric": "10.00"
    }
  ],
  "legal_monetary_totals": {
    "line_extension_amount": 20000,
    "tax_exclusive_amount": 20000,
    "tax_inclusive_amount": 21600,
    "charge_total_amount": 2000.00,
    "allowance_total_amount": 0,
    "pre_paid_amount": 0,
    "payable_amount": 23600
  },
  "tax_totals": [
    {
      "tax_id": 4,
      "tax_amount": 1600,
      "taxable_amount": 20000,
      "percent": 8
    }
  ]
}
```
