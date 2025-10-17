---
sidebar_position: 14
---
# Documento soporte no residente

A continuación se muestra un ejemplo de un JSON que representa un documento soporte. Este JSON se puede utilizar para pruebas o para simular un documento soporte real.

## No residente
```json title="support-document-non-residents.json"
{
  "resolution_number": "18764090837763",
  "document_number": "106",
  "operation_type_id": 10,
  "type_document_id": 11,
  "graphic_representation": 1,
  "currency_id": 272,
  "payments": [
    {
      "payment_method_id": "1",
      "means_payment_id": "10",
      "value_paid": "790329.00"
    }
  ],
  "lines": [
    {
      "invoiced_quantity": "1.00",
      "quantity_units_id": "1093",
      "um": "UND",
      "line_extension_amount": "790329.00",
      "free_of_charge_indicator": false,
      "description": "COMPRA KRYTOX POR CHEMOURS GPL 205 GRASA, PFPE PURO",
      "code": "999-001",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "price_amount": 790329.00,
      "base_quantity": 1.00,
      "invoice_period": {
        "start_date": "2025-03-01",
        "description_code": "1"
      }
    }
  ],
  "customer": {
    "country_id": "239",
    "identity_document_id": "10",
    "company_name": "AMAZON",
    "dni": "444444055",
    "address": "NORTE DE VIRGINIA H10",
    "city_name": "VIRGINIA",
    "postal_code": "110121"
  },
  "legal_monetary_totals": {
    "line_extension_amount": "790329.00",
    "tax_exclusive_amount": "0.00",
    "tax_inclusive_amount": "790329.00",
    "payable_amount": "790329.00"
  }
}
```
