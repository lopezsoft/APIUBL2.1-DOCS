---
sidebar_position: 15
---
# Notas de ajuste documento soporte no residente

A continuación se muestra un ejemplo de un JSON que representa un documento soporte de nota de ajuste. Este JSON se puede utilizar para pruebas o para simular un documento soporte real.

## No residente

```json title="adjustment-note.json"
{
  "resolution_number": "18760000001",
  "notes": "Nota del documento",
  "document_number": "71",
  "operation_type_id": 10,
  "type_document_id": 15,
  "graphic_representation": 1,
  "send_email": 1,
  "currency_id": 272,
  "discrepancy_response": {
    "reference_id": "DS106",
    "response_id": "11",
    "description": "Anulación porque el documento se generó a vendedor incorecto"
  },
  "billing_reference": {
    "number": "DS106",
    "date": "2025-04-13",
    "uuid": "7afa7f2dcf133ca8be44853dc5506b48b9860e86d585dc56ac0692fb65281f2d6a51dc7fd6d1fa44d78e9f5ed2dc714e",
    "scheme_name": "CUDS-SHA384"
  },
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
