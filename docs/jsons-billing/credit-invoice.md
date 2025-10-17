---
sidebar_position: 4
---
# Factura a crédito

A continuación se muestra un ejemplo de un JSON que representa una factura a crédito. Este JSON se puede utilizar para pruebas o para simular una factura real.

```json title="credit-invoice.json"
{
    "resolution_number": "18764055792775",
    "date": "2024-01-22",
    "time": "22:46:53",
    "notes": "Nota del documento",
    "document_number": "8003",
    "operation_type_id": 1,
    "type_document_id": 7,
    "graphic_representation": 1,
    "send_email": 1,
    "payments": [{
        "payment_method_id": 2,
        "means_payment_id": 30,
        "value_paid": "224.00",
        "payment_due_date": "2024-02-22"
    }],
     "customer": {
        "country_id": "170",
        "city_id": "149",
        "identity_document_id": "1",
        "type_organization_id": 2,
        "tax_regime_id": 2,
        "tax_level_id": 5,
        "company_name": "Santiago Arango",
        "dni": "1152440359",
        "mobile": "3108435423",
        "email": "lws_1234@hotmail.com",
        "address": "Direccion residencial",
        "postal_code": "661002"
    },
    "lines": [
        {
            "invoiced_quantity": "2",
            "quantity_units_id": "1093",
            "line_extension_amount": "100.00",
            "free_of_charge_indicator": false,
            "description": "TIJERA NECROPSIA AVES",
            "code": "HMT83",
            "type_item_identifications_id": "4",
            "reference_price_id": "1",
            "price_amount": "50",
            "base_quantity": "2",
            "tax_totals": [
                {
                    "tax_id": "1",
                    "tax_amount": 19,
                    "taxable_amount": 100,
                    "percent": 19
                }
            ]
        },
        {
            "invoiced_quantity": "2",
            "quantity_units_id": "1093",
            "line_extension_amount": "100.00",
            "free_of_charge_indicator": false,
            "description": "TIJERA NECROPSIA AVES 2",
            "code": "HMT84",
            "type_item_identifications_id": "4",
            "reference_price_id": "1",
            "price_amount": "50",
            "base_quantity": "2",
            "tax_totals": [
                {
                    "tax_id": "1",
                    "tax_amount": 5,
                    "taxable_amount": 100,
                    "percent": 5
                }
            ]
        }
    ],
    "legal_monetary_totals": {
        "line_extension_amount": "200.00",
        "tax_exclusive_amount": "200.00",
        "tax_inclusive_amount": "224.00",
        "payable_amount": 224.00
    },
    "tax_totals": [
        {
            "tax_id": "1",
            "tax_amount": 19,
            "taxable_amount": 100,
            "percent": 19
        },
        {
            "tax_id": "1",
            "tax_amount": 5,
            "taxable_amount": 100,
            "percent": 5
        }
    ]
}
```

