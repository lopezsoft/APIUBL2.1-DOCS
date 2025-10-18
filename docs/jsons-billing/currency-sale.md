---
sidebar_position: 20
---

# Factura venta de divisas

A continuación se muestra un ejemplo de un JSON que representa una factura. Este JSON se puede utilizar para pruebas o para simular una factura real.

```json title="currency-sale.json"
{
    "resolution_number": "18764074347312",
    "prefix": "LZT",
    "notes": "Nota del documento",
    "document_number": "864",
    "graphic_representation": 0,
    "send_email": 0,
    "operation_type_id": 7,
    "type_document_id": 7,
    "payments": [{
        "payment_method_id": 1,
        "means_payment_id": 10,
        "value_paid": "13300.00"
    }],
    "document_signature": {
        "cashier": "Nombre del cajero(a)",
        "seller": "Nombre del vendedor(a)"
    },
    "customer": {
        "country_id": "45",
        "city_id": "836",
        "identity_document_id": "1",
        "type_organization_id": 2,
        "tax_regime_id": 2,
        "tax_level_id": 5,
        "company_name": "LOPEZ GOMEZ LEWIS OSWALDO",
        "dni": "1063279307",
        "mobile": "3108435423",
        "email": "lws_1234@hotmail.com",
        "address": "Calle 64 #1823",
        "postal_code": "661002"
    },
    "lines": [
        {
            "invoiced_quantity": "2",
            "quantity_units_id": "70",
            "line_extension_amount": "8500.00",
            "free_of_charge_indicator": false,
            "description": "DOLARES",
            "code": "18234000-DL",
            "type_item_identifications_id": "4",
            "reference_price_id": "1",
            "price_amount": "4250",
            "base_quantity": "2",
            "um": "U"
        },
        {
            "invoiced_quantity": "1",
            "quantity_units_id": "70",
            "line_extension_amount": "4800.00",
            "free_of_charge_indicator": false,
            "description": "EUROS",
            "code": "18234000-EU",
            "type_item_identifications_id": "4",
            "reference_price_id": "1",
            "price_amount": "4800",
            "base_quantity": "1"
        }
    ],
    "legal_monetary_totals": {
        "line_extension_amount": "13300.00",
        "tax_exclusive_amount": "0.00",
        "tax_inclusive_amount": "13300.00",
        "payable_amount": 13300.00
    }
}
```
