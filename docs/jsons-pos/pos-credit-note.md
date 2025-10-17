---
sidebar_position: 5
---
# Nota Crédito P.O.S

A continuación se muestra un ejemplo de un JSON que representa una nota crédito P.O.S. Este JSON se puede utilizar para pruebas o para simular una nota crédito real.

```json title="pos-credit-note.json"
{
  "resolution_number": "18760000001",
  "notes": "Nota del documento",
  "document_number": "26",
  "operation_type_id": 11,
  "type_document_id": 94,
  "graphic_representation": 1,
  "send_email": 1,
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
    "company_name": "LOPEZ GOMEZ LEWIS OSWALDO",
    "dni": "1063279307",
    "email": "lws_1234@hotmail.com",
    "points": 0
  },
  "discrepancy_response": {
    "reference_id": "FPOS229",
    "response_id": "16"
  },
  "billing_reference": {
    "number": "FPOS229",
    "date": "2025-03-29",
    "uuid": "4d91fa3e2d5a1835c6e3432c1eaa9dbbc9140085f19607680edbd57c7d6b7a86295e4177b3ac823a069684b2f702e216",
    "scheme_name": "CUDE-SHA384"
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
