---
sidebar_position: 3
---
# Factura con varios impuestos

A continuación se muestra un ejemplo de un JSON que representa una factura con varios impuestos. Este JSON se puede utilizar para pruebas o para simular una factura real.

```json title="invoice-with-taxes.json"
{
  "resolution_number": "18764074347312",
  "prefix": "LZT",
  "notes": "Nota del documento",
  "document_number": "858",
  "graphic_representation": 0,
  "send_email": 1,
  "operation_type_id": 1,
  "type_document_id": 7,
  "payments": [{
    "payment_method_id": 1,
    "means_payment_id": 10,
    "value_paid": "1000.00"
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
      "invoiced_quantity": "1",
      "quantity_units_id": "70",
      "line_extension_amount": "840.34",
      "free_of_charge_indicator": false,
      "description": "SERVICIO DE ASEO",
      "code": "012910",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "price_amount": "840.34",
      "base_quantity": "1",
      "tax_totals": [
        {
          "tax_id": "1",
          "tax_amount": 159.66,
          "taxable_amount": 840.34,
          "percent": 19
        }
      ],
      "mu": "U"
    }
  ],
  "legal_monetary_totals": {
    "line_extension_amount": "840.34",
    "tax_exclusive_amount": "840.34",
    "tax_inclusive_amount": "1000.00",
    "payable_amount": 1000.00
  },
  "tax_totals": [
    {
      "tax_id": 6,
      "tax_amount": 25.21,
      "taxable_amount": 840.34,
      "percent": 3
    },
    {
      "tax_id": 5,
      "tax_amount": 23.95,
      "taxable_amount": 159.66,
      "percent": 15
    },
    {
      "tax_id": 1,
      "tax_amount": 159.66,
      "taxable_amount": 840.34,
      "percent": 19
    }
  ]
}
```
