---
sidebar_position: 5
---
# Factura con Descuento

A continuación se muestra un ejemplo de un JSON que representa una factura con cargos. Este JSON se puede utilizar para pruebas o para simular una factura real.

```json title="invoice-with-discuount.json"
{
  "resolution_number": "18764074347312",
  "date": "2024-10-04",
  "time": "11:53:23",
  "notes": "",
  "document_number": "5045",
  "graphic_representation": 0,
  "send_email": 1,
  "operation_type_id": 1,
  "type_document_id": 7,
  "payments": [
    {
      "payment_method_id": 1,
      "means_payment_id": 10,
      "value_paid": "198.00"
    }
  ],
  "customer": {
    "country_id": "45",
    "city_id": "1041",
    "identity_document_id": "3",
    "type_organization_id": 2,
    "tax_regime_id": 2,
    "tax_level_id": 5,
    "company_name": "CONSUMIDOR FINAL",
    "dni": "222222222222",
    "mobile": "3043965204",
    "email": "todosoft2009@gmail.com",
    "address": "CALLE 22 NRO. 32 29",
    "postal_code": "76834"
  },
  "lines": [
    {
      "invoiced_quantity": "1",
      "quantity_units_id": "1093",
      "line_extension_amount": "198",
      "free_of_charge_indicator": false,
      "description": "CALZADO OSIRIS D3 2001",
      "code": "A50824",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "price_amount": "220",
      "base_quantity": "1",
      "allowance_charges": [
        {
          "amount": "22",
          "base_amount": "198",
          "charge_indicator": false,
          "allowance_charge_reason": "Promocion"
        }
      ]
    }
  ],
  "legal_monetary_totals": {
    "line_extension_amount": "198.00",
    "tax_exclusive_amount": "0.00",
    "tax_inclusive_amount": "198.00",
    "payable_amount": 198
  }
}
```
