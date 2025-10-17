---
sidebar_position: 3
---
# Factura con Item de Regalo

A continuación se muestra un ejemplo de un JSON que representa una factura con regalo. Este JSON se puede utilizar para pruebas o para simular una factura real.

```json title="invoice-with-gift.json"
{
  "resolution_number": "18764074347312",
  "prefix": "LZT",
  "notes": "",
  "document_number": "851",
  "graphic_representation": 1,
  "send_email": 1,
  "operation_type_id": 1,
  "type_document_id": 7,
  "payments":[
    {
      "payment_method_id":2,
      "means_payment_id":31,
      "value_paid":"10210000.00"
    ,"payment_due_date":"2025-02-27"
    }
  ],
  "customer":{
    "country_id":"",
    "city_id":"836",
    "identity_document_id":"1",
    "type_organization_id":2,
    "tax_regime_id":2,
    "tax_level_id":"",
    "company_name":"MARIA BLANDON",
    "dni":"34044613",
    "mobile":"3156516023",
    "email":"DIEGOGO2@GMAIL.COM",
    "address":"CALLE 20 22 31",
    "postal_code":"000000"
  },
  "lines":[
    {
      "invoiced_quantity":"1",
      "quantity_units_id":"1093",
      "line_extension_amount":"10210000.00",
      "free_of_charge_indicator":false,
      "description":"THER IV 100 MSC",
      "code":"000001",
      "type_item_identifications_id":"4",
      "reference_price_id":"1",
      "price_amount":"10210000",
      "base_quantity":"1"
    }
  ,{
      "invoiced_quantity":"1",
      "quantity_units_id":"1093",
      "line_extension_amount":"0.00",
      "free_of_charge_indicator": true,
      "description":"THER VES IV -OBS",
      "code":"000017",
      "type_item_identifications_id":"4",
      "reference_price_id":"1",
      "price_amount":"1000",
      "base_quantity":"1"
    }
  ],
  "legal_monetary_totals":{
    "line_extension_amount":"10210000.00",
    "tax_exclusive_amount":"0.00",
    "tax_inclusive_amount":"10210000.00",
    "total_charges":"0.00",
    "total_allowance":"0",
    "payable_amount":"10210000.00"
  }
}
```
