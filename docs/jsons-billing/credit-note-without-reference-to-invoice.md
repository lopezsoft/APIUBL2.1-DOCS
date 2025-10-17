---
sidebar_position: 9
---
# Nota Crédito sin referencia a factura

A continuación se muestra un ejemplo de un JSON que representa una nota crédito. Este JSON se puede utilizar para pruebas o para simular una nota crédito real.

```json title="credit-note-without-reference-to-invoice.json"
{
    "resolution_number": "18763005880468",
    "prefix": "NC",
    "notes": "Documento anulado por errores en datos del cliente",
    "document_number": "325",
	"operation_type_id": 15,
	"type_document_id": 5,
    "graphic_representation": 1,
    "send_email": 1,
    "invoice_period": {
        "start_date": "2024-11-01",
        "start_time": "19:43:00",
        "end_date": "2024-11-30",
        "end_time": "19:43:00"
    },
	"payments": [{
        "payment_method_id": 1,
        "means_payment_id": 10,
        "value_paid": "224.00"
    }],
    "customer": {
        "country_id": "45",
        "city_id": "149",
        "identity_document_id": "1",
        "type_organization_id": 2,
        "tax_regime_id": 2,
        "tax_level_id": 5,
        "company_name": "Lewis Lopez",
        "dni": "1063279307",
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
