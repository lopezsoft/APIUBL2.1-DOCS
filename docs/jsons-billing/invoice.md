---
sidebar_position: 1
---

# Factura

A continuación se muestra un ejemplo de un JSON que representa una factura. Este JSON se puede utilizar para pruebas o para simular una factura real.

```json title="invoice.json"
{
  "resolution_number": "18764074347312",
  "prefix": "LZT",
  "notes": "Nota del documento",
  "document_number": "2002",
  "graphic_representation": 0,
  "send_email": 1,
  "operation_type_id": 1,
  "type_document_id": 7,
  "attachments": [
    {
      "content": "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"
    }
  ],
  "payments": [{
    "payment_method_id": 1,
    "means_payment_id": 10,
    "value_paid": "224.00"
  }],
  "document_signature": {
    "cashier": "Nombre del cajero(a)",
    "seller": "Nombre del vendedor(a)"
  },
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
      "invoiced_quantity": "2",
      "quantity_units_id": "1093",
      "line_extension_amount": "100.00",
      "free_of_charge_indicator": false,
      "description": "TIJERA NECROPSIA AVES",
      "code": "HMT83",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "price_amount": "50",
      "base_quantity": "2",
      "um": "M",
      "tax_totals": [
        {
          "tax_id": "1",
          "tax_amount": 19,
          "taxable_amount": 100,
          "percent": 19
        }
      ]
    },
    {
      "invoiced_quantity": "2",
      "quantity_units_id": "1093",
      "line_extension_amount": "100.00",
      "free_of_charge_indicator": false,
      "description": "TIJERA NECROPSIA AVES 2",
      "code": "HMT84",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "price_amount": "50",
      "base_quantity": "2",
      "tax_totals": [
        {
          "tax_id": "1",
          "tax_amount": 5,
          "taxable_amount": 100,
          "percent": 5
        }
      ]
    }
  ],
  "legal_monetary_totals": {
    "line_extension_amount": "200.00",
    "tax_exclusive_amount": "200.00",
    "tax_inclusive_amount": "224.00",
    "payable_amount": 224.00
  },
  "tax_totals": [
    {
      "tax_id": "1",
      "tax_amount": 19,
      "taxable_amount": 100,
      "percent": 19
    },
    {
      "tax_id": "1",
      "tax_amount": 5,
      "taxable_amount": 100,
      "percent": 5
    }
  ]
}
```
