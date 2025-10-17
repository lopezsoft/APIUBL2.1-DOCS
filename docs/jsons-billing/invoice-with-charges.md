---
sidebar_position: 5
---
# Factura con Cargos

A continuación se muestra un ejemplo de un JSON que representa una factura con cargos. Este JSON se puede utilizar para pruebas o para simular una factura real.

```json title="invoice-with-charges.json"
{
  "resolution_number": "18764055792775",
  "date": "2024-01-22",
  "time": "22:46:53",
  "notes": "Nota del documento",
  "document_number": "8007",
  "operation_type_id": 1,
  "type_document_id": 7,
  "payments": [{
    "payment_method_id": 1,
    "means_payment_id": 10,
    "value_paid": "319600.00"
  }],
  "allowance_charges": [
    {
      "amount": "10000",
      "base_amount": "725000",
      "charge_indicator": true,
      "allowance_charge_reason": "Motivo del cargo a la factura"
    },
    {
      "amount": "10000",
      "base_amount": "725000",
      "charge_indicator": false,
      "discount_id": 2,
      "allowance_charge_reason": "Motivo del descuento a la factura"
    }
  ],
  "customer": {
    "country_id": "170",
    "city_id": "149",
    "identity_document_id": "1",
    "type_organization_id": 2,
    "tax_regime_id": 2,
    "tax_level_id": 5,
    "company_name": "Santiago Arango",
    "dni": "1152440359",
    "mobile": "3108435423",
    "email": "arangotorosantiago@outlook.com",
    "address": "Direccion residencial"
  },
  "lines": [
    {
      "invoiced_quantity": "3",
      "quantity_units_id": "1093",
      "line_extension_amount": "81600",
      "free_of_charge_indicator": false,
      "description": "Hunters Mini Tumaco 82%",
      "code": "HMT82",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "price_amount": "27200",
      "base_quantity": "3",
      "allowance_charges": [
        {
          "amount": "10000",
          "base_amount": "725000",
          "charge_indicator": true,
          "allowance_charge_reason": "Motivo del cargo a la linea"
        },
        {
          "amount": "10000",
          "base_amount": "725000",
          "charge_indicator": false,
          "discount_id": 1,
          "allowance_charge_reason": "Motivo del descuento a la linea"
        }
      ]
    },
    {
      "invoiced_quantity": "2",
      "quantity_units_id": "1093",
      "line_extension_amount": "100000",
      "free_of_charge_indicator": false,
      "description": "TIJERA NECROPSIA AVES",
      "code": "HMT83",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "price_amount": "59500",
      "base_quantity": "1",
      "tax_totals": [
        {
          "tax_id": "1",
          "tax_amount": 19000,
          "taxable_amount": 100000,
          "percent": 19
        }
      ]
    },
    {
      "invoiced_quantity": "2",
      "quantity_units_id": "1093",
      "line_extension_amount": "100000",
      "free_of_charge_indicator": false,
      "description": "TIJERA NECROPSIA AVES 2",
      "code": "HMT84",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "price_amount": "50000",
      "base_quantity": "1",
      "tax_totals": [
        {
          "tax_id": "1",
          "tax_amount": 19000,
          "taxable_amount": 100000,
          "percent": 19
        }
      ]
    }
  ],
  "legal_monetary_totals": {
    "line_extension_amount": "281600.00",
    "tax_exclusive_amount": "200000",
    "tax_inclusive_amount": "319600.00",
    "payable_amount": "319600.00"
  },
  "tax_totals": [
    {
      "tax_id": "1",
      "tax_amount": 38000,
      "taxable_amount": 200000,
      "percent": 19
    }
  ]
}
```
