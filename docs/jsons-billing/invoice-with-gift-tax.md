---
sidebar_position: 16
---
# Factura con Item de Regalo con impuesto

A continuación se muestra un ejemplo de un JSON que representa una factura con regalo. Este JSON se puede utilizar para pruebas o para simular una factura real.

```json title="invoice-with-gift-tax.json"
{
  "resolution_number":"18764074347312",
  "prefix":"LZT",
  "document_number":"2047",
  "graphic_representation":0,
  "send_email":0,
  "operation_type_id":1,
  "type_document_id":7,
  "payments":[
    {
      "payment_method_id":1,
      "means_payment_id":1,
      "value_paid":"952.00"
    }
  ],
  "lines":[
    {
      "invoiced_quantity":"1",
      "quantity_units_id":"1093",
      "line_extension_amount":"0.00",
      "free_of_charge_indicator":true,
      "description":"POSTRE DE LA CASA",
      "code":"0145",
      "type_item_identifications_id":"4",
      "reference_price_id":"1",
      "price_amount":"11900",
      "base_quantity":"1",
      "tax_totals":[
        {
          "tax_id":"4",
          "tax_amount": 952,
          "taxable_amount": 11900,
          "percent": 8
        }
      ]
    }
  ],
  "legal_monetary_totals":{
    "line_extension_amount":"0",
    "tax_exclusive_amount":"11900",
    "tax_inclusive_amount":"952",
    "total_charges":"0.00",
    "total_allowance":"0",
    "payable_amount":"952"
  },
  "tax_totals": [
    {
      "tax_id": "4",
      "tax_amount": 952,
      "taxable_amount": 11900,
      "percent": 8
    }
  ]
}
```
