---
sidebar_position: 4
---
# Nota Débito P.O.S.

A continuación se muestra un ejemplo de un JSON que representa una nota débito P.O.S. Este JSON se puede utilizar para pruebas o para simular una nota débito real.

```json title="pos-debit-note.json"
{
	"resolution_number": "18760000001",
	"date": "2024-01-24",
	"time": "14:49:36",
    "document_number": "1",
	"operation_type_id": 14,
	"type_document_id": 93,
    "graphic_representation": 1,
    "send_email": 1,
	"payments": [{
        "payment_method_id": 1,
        "means_payment_id": 10,
        "value_paid": "95000.00"
    }],
    "customer": {
        "company_name": "Santiago Arango",
        "dni": "1152440359",
        "points": 0
    },
	"discrepancy_response": {
		"reference_id": "EPOS2",
		"response_id": "9"
	},
	"billing_reference": {
		"number": "EPOS2",
        "date": "2023-12-22",
        "uuid": "b1b5d93a2918407a2ef0048ed3092e5d96c94f73db178779463f202f8c52dd53ef5b9888d804d4b609521b1d031aea39"
	},
	"lines": [
		{
			"invoiced_quantity": 1,
			"quantity_units_id": "1093",
			"line_extension_amount":  79831.93,
			"free_of_charge_indicator": false,
			"description": "STILOGRAFOLAMYALSTAR025M",
			"code": "4014519428527",
			"type_item_identifications_id": "4",
			"reference_price_id": "1",
			"price_amount": 95000,
			"base_quantity": 1,
			"tax_totals": [
				{
					"tax_id": 1,
					"tax_amount":  15168.07,
					"taxable_amount": 79831.93,
					"percent": "19"
				}
			]
		}
	],
    "legal_monetary_totals": {
		"line_extension_amount":  79831.93,
		"tax_exclusive_amount":  79831.93,
		"tax_inclusive_amount": 95000,
		"total_charges": 0,
		"pre_paid_amount": 0,
		"total_allowance": 0,
		"payable_amount": 95000
	},
	"tax_totals": [
		{
			"tax_id": 1,
			"tax_amount": 15168.07,
			"taxable_amount": 79831.93,
			"percent": "19"
		}
	]
}
```
