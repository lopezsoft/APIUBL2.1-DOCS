---
sidebar_position: 3
---
# Factura con cargos + IVA - descuentos

A continuación se muestra un ejemplo de un JSON que representa una factura con cargos + IVA - descuentos. Este JSON se puede utilizar para pruebas o para simular una factura real.

```json title="invoice-with-taxes-charges-discounts.json"
{
  "resolution_number": "18764074347312",
  "prefix": "LZT",
  "notes": "Nota del documento",
  "document_number": "2005",
  "graphic_representation": 0,
  "send_email": 1,
  "operation_type_id": 1,
  "type_document_id": 7,
  "payments": [{
    "payment_method_id": 1,
    "means_payment_id": 10,
    "value_paid": "159800.00"
  }],
  "customer": {
    "country_id": "45",
    "city_id": "836",
    "identity_document_id": "1",
    "type_organization_id": 2,
    "company_name": "LOPEZ GOMEZ LEWIS OSWALDO",
    "dni": "1063279307",
    "email": "lws_1234@hotmail.com",
    "postal_code": "661002"
  },
  "lines": [
    {
      "invoiced_quantity": "2",
      "quantity_units_id": "1093",
      "line_extension_amount": "43000.00",
      "free_of_charge_indicator": false,
      "description": "PE ROLLO PAPEL OSMOTICO (200MT X 30CM)",
      "code": "HMT83",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "price_amount": "21800",
      "base_quantity": "2",
      "um": "M",
      "allowance_charges": [
        {
          "amount": "600",
          "base_amount": "43600",
          "charge_indicator": false,
          "discount_id": 1,
          "allowance_charge_reason": "Motivo del descuento a la linea"
        }
      ],
      "tax_totals": [
        {
          "tax_id": "1",
          "tax_amount": 8170,
          "taxable_amount": 43000,
          "percent": 19
        }
      ]
    },
    {
      "invoiced_quantity": "2",
      "quantity_units_id": "1093",
      "line_extension_amount": "87000.00",
      "free_of_charge_indicator": false,
      "description": "PE ROLLO PAPEL OSMOTICO (500MT X 30CM)",
      "code": "HMT84",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "price_amount": "43300",
      "base_quantity": "2",
      "allowance_charges": [
        {
          "amount": "400",
          "base_amount": "86600",
          "charge_indicator": true,
          "allowance_charge_reason": "Motivo del cargo a la linea"
        }
      ],
      "tax_totals": [
        {
          "tax_id": "1",
          "tax_amount": 16530,
          "taxable_amount": 87000,
          "percent": 19
        }
      ]
    },
    {
      "invoiced_quantity": "2",
      "quantity_units_id": "1093",
      "line_extension_amount": "5100",
      "free_of_charge_indicator": false,
      "description": "TIJERA NECROPSIA AVES",
      "code": "HMT835",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "price_amount": "2650",
      "base_quantity": "2",
      "allowance_charges": [
        {
          "amount": "200",
          "base_amount": "5300",
          "charge_indicator": false,
          "discount_id": 1,
          "allowance_charge_reason": "Motivo del descuento a la linea"
        }
      ]
    }
  ],
  "legal_monetary_totals": {
    "line_extension_amount": "135100.00",
    "tax_exclusive_amount": "130000",
    "tax_inclusive_amount": "159800.00",
    "payable_amount": "159800.00"
  },
  "tax_totals": [
    {
      "tax_id": "1",
      "tax_amount": 24700,
      "taxable_amount": 130000,
      "percent": 19
    }
  ]
}
```
