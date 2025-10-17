---
sidebar_position: 2
---

# Factura con datos extra

A continuación se muestra un ejemplo de un JSON que representa una factura. Este JSON se puede utilizar para pruebas o para simular una factura real.

```json title="invoice-extra-data.json"
{
  "resolution_number": "18764074347312",
  "prefix": "LZT",
  "notes": "Nota del documento",
  "document_number": "2015",
  "graphic_representation": 0,
  "send_email": 1,
  "operation_type_id": 1,
  "type_document_id": 7,
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
      "extra_data": [
        {
          "title": "LOTE",
          "value": "45413",
          "align": "left"
        },
        {
          "title": "FECHA DE EXPIRACIÓN",
          "value": "02/02/2026",
          "align": "center"
        }
      ],
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
      "extra_data": [
        {
          "title": "LOTE",
          "value": "26545"
        },
        {
          "title": "FECHA DE EXPIRACIÓN",
          "value": "02/04/2028"
        }
      ],
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
