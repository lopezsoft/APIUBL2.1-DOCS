---
sidebar_position: 18
---
# Factura en USD Exportación

A continuación se muestra un ejemplo de un JSON que representa una factura en dólares. Este JSON se puede utilizar para pruebas o para simular una factura real.

```json title="invoice_usd.json"
{
  "resolution_number":"18764074347312",
  "prefix":"LZT",
  "document_number":"2055",
  "operation_type_id": 1,
  "type_document_id": 8,
  "currency_id": 272,
  "payments": [
    {
      "payment_method_id": 1,
      "means_payment_id": 42,
      "value_paid": "4243.80"
    }
  ],
  "payment_exchange_rate": {
    "exchange_rate": "4243.80",
    "base_rate": "4243.80",
    "rate_date": "2025-05-05",
    "currency_id": 188
  },
  "lines": [
    {
      "invoiced_quantity": "1.00",
      "quantity_units_id": "1093",
      "um": "UNI",
      "line_extension_amount": "4243.80",
      "free_of_charge_indicator": false,
      "description": "HONORARIOS REPRESENTACION LEGAL ECUADOR",
      "code": "999-001",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "price_amount": "4243.80",
      "base_quantity": 1.00
    }
  ],
  "customer": {
    "country_id": "239",
    "identity_document_id": "10",
    "type_organization_id": 1,
    "company_name": "AMAZON",
    "dni": "444444055",
    "address": "NORTE DE VIRGINIA H10",
    "city_name": "VIRGINIA",
    "postal_code": "110121"
  },
  "legal_monetary_totals": {
    "line_extension_amount": "4243.80",
    "tax_exclusive_amount": "0",
    "tax_inclusive_amount": "4243.80",
    "payable_amount": 4243.80
  }
}
```

