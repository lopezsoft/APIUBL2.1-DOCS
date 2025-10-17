---
sidebar_position: 13
---
# Factura AIU

A continuación se muestra un ejemplo de un JSON que representa una factura AIU. Este JSON se puede utilizar para pruebas o para simular una factura real.

```json title="AIU-invoice.json"
{
  "resolution_number": "18760000001",
  "date": "2021-11-22",
  "time": "22:46:53",
  "notes": "Contrato de servicios AIU por conceptode: El contribuyente debe incluir el objeto del contrato facturado.",
  "document_number": 990000337,
  "operation_type_id": 2,
  "type_document_id": 7,
  "payments": [{
    "payment_method_id": 1,
    "means_payment_id": 10,
    "value_paid": "731400.00"
  }],
  "customer": {
    "country_id": "170",
    "city_id": "149",
    "identity_document_id": "1",
    "type_organization_id": 2,
    "tax_regime_id": 2,
    "tax_level_id": 5,
    "company_name": "Santiago Arango",
    "dni": "1152440359",
    "email": "arangotorosantiago@outlook.com",
    "address": "Direccion residencial"
  },
  "legal_monetary_totals": {
    "line_extension_amount": "720000.00",
    "tax_exclusive_amount": "60000",
    "tax_inclusive_amount": "731400.00",
    "payable_amount": "731400.00"
  },
  "lines": [
    {
      "invoiced_quantity": "1",
      "quantity_units_id": "1093",
      "line_extension_amount": "600000",
      "free_of_charge_indicator": false,
      "description": "ADMINISTRACIÓN",
      "code": "HMT82",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "price_amount": "600000",
      "base_quantity": "1"
    },
    {
      "invoiced_quantity": "1",
      "quantity_units_id": "1093",
      "line_extension_amount": "60000",
      "free_of_charge_indicator": false,
      "description": "IMPREVISTO",
      "code": "HMT83",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "price_amount": "60000",
      "base_quantity": "1"
    },
    {
      "invoiced_quantity": "1",
      "quantity_units_id": "1093",
      "line_extension_amount": "60000",
      "free_of_charge_indicator": false,
      "description": "UTILIDAD",
      "code": "HMT84",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "price_amount": "71400",
      "base_quantity": "1",
      "tax_totals": [
        {
          "tax_id": "1",
          "tax_amount": 11400,
          "taxable_amount": 60000,
          "percent": 19
        }
      ]
    }
  ],
  "tax_totals": [
    {
      "tax_id": "1",
      "tax_amount": 11400,
      "taxable_amount": 60000,
      "percent": 19
    }
  ]
}
```

