---
sidebar_position: 11.2
---
# P.O.S con descuento

A continuación se muestra un ejemplo de un JSON que representa una factura de P.O.S Electrónico para consumidor final. Este JSON se puede utilizar para pruebas o para simular un punto de venta real.

**Nota:** Este JSON es un ejemplo está de cuerdo de acuerdo a los últimos ajustes de la DIAN.
```json title="pos.json"
{
  "resolution_number": "18764071667638",
  "prefix": "FPOS",
  "date": "2024-06-07",
  "time": "12:55:32",
  "notes": "",
  "document_number": "14",
  "graphic_representation": 1,
  "send_email": 1,
  "operation_type_id": 1,
  "type_document_id": 20,
  "payments": [
    {
      "payment_method_id": 1,
      "means_payment_id": 10,
      "value_paid": "59.50"
    }
  ],
  "software_manufacturer": {
    "owner_name": "LEWIS LOPEZ GOMEZ",
    "company_name": "LOPEZSOFT SAS",
    "software_name": "SOFTWARE POS MATIAS APP"
  },
  "lines": [
    {
      "invoiced_quantity": 1,
      "quantity_units_id": "1093",
      "line_extension_amount": "50",
      "free_of_charge_indicator": false,
      "description": "producto alimento",
      "code": "11952875",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "price_amount": "100",
      "base_quantity": 1,
      "tax_totals": [
        {
          "tax_id": "1",
          "tax_amount": 9.5,
          "taxable_amount": 50,
          "percent": 19
        }
      ],
      "allowance_charges": [
        {
          "charge_indicator": false,
          "allowance_charge_reason": "Descuento por promoción",
          "base_amount": "100",
          "amount": "50"
        }
      ]
    }
  ],
  "legal_monetary_totals": {
    "line_extension_amount": "50",
    "tax_exclusive_amount": "50",
    "tax_inclusive_amount": "59.5",
    "total_allowance": 0,
    "payable_amount": 59.5
  },
  "tax_totals": [
    {
      "tax_id": "1",
      "tax_amount": 9.5,
      "taxable_amount": 50,
      "percent": 19
    }
  ],
  "point_of_sale": {
    "cashier_name": "Veterinario demo2",
    "terminal_number": "CJ001aB",
    "cashier_type": "Caja de apoyo",
    "sales_code": "POS1",
    "address": "Storni 6278",
    "sub_total": 59.50
  }
}
```
