---
sidebar_position: 6
---
# Factura en Euros

A continuación se muestra un ejemplo de un JSON que representa una factura en euros. Este JSON se puede utilizar para pruebas o para simular una factura real.

```json title="invoice-euro.json"
{
  "date": "2022-02-24",
  "time": "12:57:53",
  "document_number": "990000369",
  "operation_type_id": 1,
  "type_document_id": 7,
  "payments": [{
    "payment_method_id": 2,
    "means_payment_id": 30,
    "value_paid": "1372.62"
  }],
  "lines": [
    {
      "invoiced_quantity": "1.00",
      "quantity_units_id": "1093",
      "um": "UNI",
      "line_extension_amount": "137.00",
      "free_of_charge_indicator": "false",
      "description": "HONORARIOS Notificación sanitaria ASEO  Purificador de aire acondicionado",
      "code": "999-001",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "price_amount": "163.03",
      "base_quantity": 1.0000,
      "tax_totals": [
        {
          "tax_id": "1",
          "tax_amount": 26.03,
          "taxable_amount": 137.00,
          "percent": 19
        }
      ]
    },
    {
      "invoiced_quantity": "1.00",
      "quantity_units_id": "1093",
      "um": "UNI",
      "line_extension_amount": "137.00",
      "free_of_charge_indicator": "false",
      "description": "HONORARIOS Notificación sanitaria ASEO  Aceite multiusos todo en 1",
      "code": "999-001",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "price_amount": "163.03",
      "base_quantity": 1.0000,
      "tax_totals": [
        {
          "tax_id": "1",
          "tax_amount": 26.03,
          "taxable_amount": 137.00,
          "percent": 19
        }
      ]
    },
    {
      "invoiced_quantity": "1.00",
      "quantity_units_id": "1093",
      "um": "",
      "line_extension_amount": "112.00",
      "free_of_charge_indicator": "false",
      "description": "ORGANIZACION FICHA TECNICA Purificador de aire acondicionado",
      "code": "999-003",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "price_amount": "133.28",
      "base_quantity": 1.0000,
      "tax_totals": [
        {
          "tax_id": "1",
          "tax_amount": 21.28,
          "taxable_amount": 112.00,
          "percent": 19
        }
      ]
    },
    {
      "invoiced_quantity": "1.00",
      "quantity_units_id": "1093",
      "um": "",
      "line_extension_amount": "112.00",
      "free_of_charge_indicator": "false",
      "description": "ORGANIZACION FICHA TECNICA Aceite multiusos todo en 1",
      "code": "999-003",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "price_amount": "133.28",
      "base_quantity": 1.0000,
      "tax_totals": [
        {
          "tax_id": "1",
          "tax_amount": 21.28,
          "taxable_amount": 112.00,
          "percent": 19
        }
      ]
    },
    {
      "invoiced_quantity": "2.00",
      "quantity_units_id": "1093",
      "um": "",
      "line_extension_amount": "780.00",
      "free_of_charge_indicator": "false",
      "description": "PAGOS OFICIALES",
      "code": "999-002",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "price_amount": "390.00",
      "base_quantity": 2.0000,
      "tax_totals": [
        {
          "tax_id": "1",
          "tax_amount": 0.0,
          "taxable_amount": 0.0,
          "percent": 0
        }
      ]
    }
  ],
  "customer": {
    "country_id": "214",
    "city_id": "149",
    "identity_document_id": "10",
    "type_organization_id": 1,
    "tax_regime_id": 1,
    "tax_level_id": "5",
    "company_name": "QUIMI ROMAR S.L.",
    "dni": "444444016",
    "email": "ryc.consultor@gmail.com",
    "address": "CRTA MONCADA - NAQUERA CV 315 KM 11.2"
  },
  "legal_monetary_totals": {
    "line_extension_amount": "1278.00",
    "tax_exclusive_amount": "498.00",
    "tax_inclusive_amount": "1372.62",
    "payable_amount": "1372.62"
  },
  "tax_totals": [
    {
      "tax_id": 1,
      "tax_amount": "94.62",
      "taxable_amount": "498.00",
      "percent": 19.0
    }
  ],
  "payment_exchange_rate": {
    "exchange_rate": "4200.00",
    "rate_date": "2022-02-24",
    "base_rate": "3800.00",
    "currency_id": 213
  }
}
```
