---
sidebar_position: 24
---
# Nota Débito

A continuación se muestra un ejemplo de un JSON que representa una nota débito. Este JSON se puede utilizar para pruebas o para simular una nota débito real.

```json title="debit-note.json"
{
	"resolution_number": "18763005880468",
	"date": "2024-01-24",
	"time": "14:49:36",
    "document_number": "18",
	"operation_type_id": 1,
	"type_document_id": 4,
    "graphic_representation": 1,
    "send_email": 1,
	"payments": [{
        "payment_method_id": 1,
        "means_payment_id": 10,
        "value_paid": "95000.00"
    }],
   "customer": {
        "country_id": "45",
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
	"discrepancy_response": {
		"reference_id": "8003",
		"response_id": "9"
	},
	"billing_reference": {
		"number": "8003",
        "date": "2023-12-22",
        "uuid": "8cbf2a265778d1360bebf75b704af307e875bfc3926ffc3b9135c98c469c34f6cf7a1b5df7093638e883a078f92d9d2e"
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
		"charge_total_amount": 0,
		"pre_paid_amount": 0,
		"allowance_total_amount": 0,
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
