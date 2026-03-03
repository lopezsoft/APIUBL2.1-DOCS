---
sidebar_position: 30
---

# Factura Impuesto Licores - AD VALOREM

A continuación se muestra un ejemplo de un JSON que representa una factura con Impuesto al Consumo de Licores bajo la modalidad **Ad Valorem** (porcentual). A diferencia del impuesto nominal, el Ad Valorem se calcula como un **porcentaje sobre la base gravable** (`taxable_amount × percent / 100`), siguiendo el mismo patrón que el IVA.

```json title="invoice-licores-ad-valorem.json"
{
  "resolution_number": "18764074347312",
  "prefix": "LZT",
  "notes": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  "document_number": "4065",
  "report_header": {
    "uuid": "101413670038274164",
    "vars": [
      {
        "name": "sucursal",
        "value": "Bodega Principal Cali"
      },
      {
        "name": "direccion",
        "value": "Zona Franca Palmaseca Bodega 5"
      },
      {
        "name": "celular",
        "value": "315 112 4411"
      }
    ]
  },
  "graphic_representation": 0,
  "send_email": 1,
  "operation_type_id": 1,
  "type_document_id": 7,
  "payments": [
    {
      "payment_method_id": 1,
      "means_payment_id": 10,
      "value_paid": "2233.008"
    }
  ],
  "order_reference": {
    "reference_number": "4541212",
    "reference_date": "2025-06-01"
  },
  "document_signature": {
    "cashier": "CAROLINA RODRIGUEZ",
    "seller": "BRIYI SIRLEY ARIAS MONTOYA"
  },
  "customer": {
    "identity_document_id": "3",
    "company_name": "LOPEZ GOMEZ LEWIS OSWALDO",
    "dni": "1063279307",
    "email": "lopezsoft.com@gmail.com"
  },
  "lines": [
    {
      "invoiced_quantity": "1",
      "quantity_units_id": "70",
      "line_extension_amount": "1550.700000",
      "free_of_charge_indicator": false,
      "description": "POKER 330 X30",
      "code": "00725",
      "type_item_identifications_id": "4",
      "reference_price_id": "1",
      "price_amount": "1550.700000",
      "base_quantity": "1",
      "um": "UND",
      "tax_totals": [
        {
          "tax_id": "1",
          "tax_amount": 294.633000,
          "taxable_amount": 1550.700000,
          "percent": 19
        },
        {
          "tax_id": "22",
          "tax_amount": 387.675000,
          "taxable_amount": 1550.700000,
          "percent": 25
        }
      ]
    }
  ],
  "legal_monetary_totals": {
    "line_extension_amount": "1550.700000",
    "tax_exclusive_amount": "1550.700000",
    "tax_inclusive_amount": "2233.008000",
    "total_charges": "0.000000",
    "total_allowance": "0",
    "payable_amount": "2233.008000"
  },
  "tax_totals": [
    {
      "tax_id": "1",
      "tax_amount": 294.633000,
      "taxable_amount": 1550.700000,
      "percent": 19.00
    },
    {
      "tax_id": "22",
      "tax_amount": 387.675000,
      "taxable_amount": 1550.700000,
      "percent": 25.00
    }
  ]
}
```
