---
sidebar_position: 2
---

# Factura partida arancelaria

A continuación se muestra un ejemplo de un JSON que representa una factura. 
Este JSON se puede utilizar para pruebas o para simular una factura real.

```json title="invoice-tariff.json"
{
  "resolution_number": "18764074347312",
  "prefix": "LZT",
  "document_number": "2056",
  "graphic_representation": 0,
  "send_email": 1,
  "operation_type_id": 1,
  "type_document_id": 7,
  "payments": [
    {
      "payment_method_id": 1,
      "means_payment_id": 10,
      "value_paid": "224.00"
    }
  ],
  "delivery_terms": {
    "terms" : "Portes Pagados",
    "delivery_id": 1
  },
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
  "lines": [
    {
      "invoiced_quantity": "1",
      "quantity_units_id": "1093",
      "line_extension_amount": "224.00",
      "free_of_charge_indicator": false,
      "description": "CABAÑA BREMEN",
      "code": "000001",
      "type_item_identifications_id": "3",
      "reference_price_id": "1",
      "price_amount": "224",
      "base_quantity": "1",
      "um": "M"
    }
  ],
  "legal_monetary_totals": {
    "line_extension_amount": "224.00",
    "tax_exclusive_amount": "0.00",
    "tax_inclusive_amount": "224.00",
    "payable_amount": 224
  }
}
```
