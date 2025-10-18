---
sidebar_position: 3
---
# Notas de ajuste documento soporte residente

A continuación se muestra un ejemplo de un JSON que representa un documento soporte de nota de ajuste. Este JSON se puede utilizar para pruebas o para simular un documento soporte real.

## Residente
```json title="adjustment-note.json"
{
  "resolution_number": "18760000001",
  "date": "2024-01-12",
  "time": "22:46:53",
  "notes": "Nota del documento",
  "document_number": "3",
  "operation_type_id": 1,
  "type_document_id": 15,
  "graphic_representation": 1,
  "send_email": 1,
  "currency_id": 272,
	"payments": [{
    "payment_method_id": 1,
    "means_payment_id": 10,
    "value_paid": "230525.00"
	}],
    "discrepancy_response": {
        "reference_id": "DS10",
        "response_id": "11",
        "description": "Anulación porque el documento se generó a vendedor incorecto"
    },
    "billing_reference": {
        "number": "DS10",
        "date": "2024-01-11",
        "uuid": "4d3aa5a3d69e674adb0b29b8b7c091682e5ce5d47a35c7b7a24442e8c93eaeb8a7e84c4b012ce76f04fb9dd692ef7168",
        "scheme_name": "CUDS-SHA384"
    },
	"customer": {
		"country_id": "45",
		"city_id": "836",
		"identity_document_id": "3",
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
			"invoiced_quantity": "3",
			"quantity_units_id": "1093",
			"line_extension_amount": "81600", 
			"free_of_charge_indicator": false,
			"description": "Hunters Mini Tumaco 82%",
			"code": "HMT82",
			"type_item_identifications_id": "4",
			"reference_price_id": "1",
			"price_amount": "27200",
			"base_quantity": "3",
      "invoice_period": {
          "start_date": "2022-08-30",
          "description_code": 1
      }
		},
		{
			"invoiced_quantity": "2",
			"quantity_units_id": "1093",
			"line_extension_amount": "100000", 
			"free_of_charge_indicator": false,
			"description": "TIJERA NECROPSIA AVES 2",
			"code": "HMT84",
			"type_item_identifications_id": "4",
			"reference_price_id": "1",
			"price_amount": "50000",
			"base_quantity": "2",
      "invoice_period": {
          "start_date": "2022-08-30",
          "description_code": 1
      },
			"tax_totals": [
				{
					"tax_id": "1",
					"tax_amount": 19000,
					"taxable_amount": 100000,
					"percent": 19
				}
			]
		},
        {
			"invoiced_quantity": "1",
			"quantity_units_id": "1093",
			"line_extension_amount": "28500", 
			"free_of_charge_indicator": false,
			"description": "TIJERA NECROPSIA AVES",
			"code": "HMT81",
			"type_item_identifications_id": "4",
			"reference_price_id": "1",
			"price_amount": "28500",
			"base_quantity": "1",
      "invoice_period": {
          "start_date": "2022-08-30",
          "description_code": 1
      },
			"tax_totals": [
				{
					"tax_id": "1",
					"tax_amount":  1425,
					"taxable_amount": 28500,
					"percent": 5
				}
			]
		}
	],
    "legal_monetary_totals": {
		"line_extension_amount": "210100",
		"tax_exclusive_amount": "128500",
		"tax_inclusive_amount": "230525",
		"payable_amount": "230525"
	},
	"tax_totals": [
        {
          "tax_id": "1",
          "tax_amount":  1425,
          "taxable_amount": 28500,
          "percent": 5
        },
        {
          "tax_id": "1",
          "tax_amount": 19000,
          "taxable_amount": 100000,
          "percent": 19
        }
	]
}
```