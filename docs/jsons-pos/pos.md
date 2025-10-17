---
sidebar_position: 11
---
# P.O.S Electrónico

A continuación se muestra un ejemplo de un JSON que representa una factura de P.O.S Electrónico. Este JSON se puede utilizar para pruebas o para simular un punto de venta real.

**Nota:** Este JSON es un ejemplo está de cuerdo de acuerdo a los últimos ajustes de la DIAN.
```json title="pos.json"
{
    "resolution_number": "18764071164948",
    "prefix": "FPOS",
    "notes": "Nota del documento",
    "document_number": "229",
    "graphic_representation": 1,
    "send_email": 1,
    "operation_type_id": 1,
    "type_document_id": 20,
    "payments": [{
        "payment_method_id": 1,
        "means_payment_id": 10,
        "value_paid": "224.00"
    }],
    "document_signature": {
        "cashier": "Nombre del cajero(a)",
        "seller": "Nombre del vendedor(a)"
    },
    "customer": {
        "company_name": "LOPEZ GOMEZ LEWIS OSWALDO",
        "dni": "1063279307",
        "email": "lws_1234@hotmail.com",
        "points": 0
    },
    "point_of_sale": {
        "cashier_name": "LEWIS OSWALDO LOPEZ GOMEZ",
        "terminal_number": "CJ001aB",
        "cashier_type": "Caja de apoyo",
        "sales_code": "POS01",
        "address": "Gilbarco Encore 4 L1 - Mangue ra 17 AC",
        "sub_total": "2000.10"
    },
    "software_manufacturer": {
        "owner_name": "LEWIS LOPEZ GOMEZ",
        "company_name": "LOPEZSOFT SAS",
        "software_name": "SOFTWARE POS MATIAS APP"
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
