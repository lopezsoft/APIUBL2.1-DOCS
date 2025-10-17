---
sidebar_position: 12
---
# Factura con Retenciones

A continuación se muestra un ejemplo de un JSON que representa una factura con retenciones. Este JSON se puede utilizar para pruebas o para simular una factura real.

```json title="invoice-with-retentions.json"
{
  "resolution_number": "18764055792775",
  "date": "2024-01-12",
  "time": "22:46:53",
  "notes": "Nota del documento",
  "document_number": "8001",
  "operation_type_id": 1,
  "type_document_id": 7,
  "graphic_representation": 1,
  "send_email": 0,
  "payments": [{
    "payment_method_id": 1,
    "means_payment_id": 10,
    "value_paid": "224.00"
  }],
  "customer": {
    "country_id": "49",
    "city_id": "149",
    "identity_document_id": "1",
    "type_organization_id": 2,
    "tax_regime_id": 2,
    "tax_level_id": 5,
    "company_name": "NOMBRE DEL CLIENTE",
    "dni": "123456",
    "mobile": "310548121",
    "email": "correo@hotmail.com",
    "address": "Direccion residencial",
    "postal_code": "000000"
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
        },
        {
          "tax_id": "6",
          "tax_amount": 3,
          "taxable_amount": 100,
          "percent": 3
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
    "payable_amount": "224.00"
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
    },
    {
      "tax_id": "5",
      "tax_amount": 3.6,
      "taxable_amount": 24,
      "percent": 15
    },
    {
      "tax_id": "7",
      "tax_amount": 2.2,
      "taxable_amount": 200,
      "percent": 11
    }
  ]
}
```
