---
sidebar_position: 3
---
# Factura con Impuesto al Consumo de Bolsa Plástica

A continuación se muestra un ejemplo de un JSON que representa una factura con regalo. Este JSON se puede utilizar para pruebas o para simular una factura real.

```json title="invoice-with-gift-tax.json"
{
  "resolution_number":"18764074347312",
  "prefix":"LZT",
  "document_number":"2054",
  "graphic_representation":0,
  "send_email":0,
  "operation_type_id":1,
  "type_document_id":7,
  "payments":[
    {
      "payment_method_id":1,
      "means_payment_id":10,
      "value_paid":"24330.00"
    }
  ],
  "customer":{
    "country_id":"",
    "city_id":"823",
    "identity_document_id":"1",
    "type_organization_id":2,
    "tax_regime_id":1,
    "tax_level_id":"5",
    "company_name":"CUANTIAS MENORES",
    "dni":"222222222",
    "mobile":"1243436",
    "email":"rindemaxla23sas@gmail.com",
    "address":"DG 13 A 33 LC 1",
    "postal_code":"000000"
  },
  "lines":[
    {
      "invoiced_quantity":"1",
      "quantity_units_id":"1093",
      "line_extension_amount":"403.36",
      "free_of_charge_indicator":false,
      "description":"BOLSA T-40",
      "code":"022555",
      "type_item_identifications_id":"4",
      "reference_price_id":"1",
      "price_amount":"403.36",
      "base_quantity":"1",
      "tax_totals":[
        {
          "tax_id":"1",
          "tax_amount":76.64,
          "taxable_amount":403.36,
          "percent":19
        },
        {
          "tax_id":"10",
          "tax_amount": 70,
          "taxable_amount": 0,
          "quantity_units_id": "886",
          "per_unit_amount": 70,
          "base_unit_measure": 1
        }
      ]
    }
  ,{
      "invoiced_quantity":"1",
      "quantity_units_id":"1093",
      "line_extension_amount":"2260.50",
      "free_of_charge_indicator":false,
      "description":"SAN LIMPIO BICARBONATO X 1000 ML",
      "code":"3005964",
      "type_item_identifications_id":"4",
      "reference_price_id":"1",
      "price_amount":"2260.50",
      "base_quantity":"1",
      "tax_totals":[
        {
          "tax_id":"1",
          "tax_amount":429.50,
          "taxable_amount":2260.50,
          "percent":19
        }
      ]
    }
  ,{
      "invoiced_quantity":"1",
      "quantity_units_id":"1093",
      "line_extension_amount":"3823.53",
      "free_of_charge_indicator":false,
      "description":"FUROR ESPONJA ORO PLATA PG 2 LLV 3",
      "code":"771952",
      "type_item_identifications_id":"4",
      "reference_price_id":"1",
      "price_amount":"3823.53",
      "base_quantity":"1",
      "tax_totals":[
        {
          "tax_id":"1",
          "tax_amount":726.47,
          "taxable_amount":3823.53,
          "percent":19
        }
      ]
    }
  ,{
      "invoiced_quantity":"1",
      "quantity_units_id":"1093",
      "line_extension_amount":"3067.23",
      "free_of_charge_indicator":false,
      "description":"GUANTE FUROR DOMESTICO AMARILLO TALLA 7-71/2",
      "code":"3003670",
      "type_item_identifications_id":"4",
      "reference_price_id":"1",
      "price_amount":"3067.23",
      "base_quantity":"1",
      "tax_totals":[
        {
          "tax_id":"1",
          "tax_amount":582.77,
          "taxable_amount":3067.23,
          "percent":19
        }
      ]
    }
  ,{
      "invoiced_quantity":"1",
      "quantity_units_id":"1093",
      "line_extension_amount":"4411.76",
      "free_of_charge_indicator":false,
      "description":"SANPIC VAINILLA DOY PACK X 450 ML",
      "code":"3003014",
      "type_item_identifications_id":"4",
      "reference_price_id":"1",
      "price_amount":"4411.76",
      "base_quantity":"1",
      "tax_totals":[
        {
          "tax_id":"1",
          "tax_amount":838.24,
          "taxable_amount":4411.76,
          "percent":19
        }
      ]
    }
  ,{
      "invoiced_quantity":"1",
      "quantity_units_id":"1093",
      "line_extension_amount":"4949.58",
      "free_of_charge_indicator":false,
      "description":"PAÑO LIMPION TASK ANTIBACTERIAL PG 4 LLV 6 UND",
      "code":"3002766",
      "type_item_identifications_id":"4",
      "reference_price_id":"1",
      "price_amount":"4949.58",
      "base_quantity":"1",
      "tax_totals":[
        {
          "tax_id":"1",
          "tax_amount":940.42,
          "taxable_amount":4949.58,
          "percent":19
        }
      ]
    }
  ,{
      "invoiced_quantity":"1.8000",
      "quantity_units_id":"1093",
      "line_extension_amount":"1512.61",
      "free_of_charge_indicator":false,
      "description":"SALTINAS DORE X 117 G",
      "code":"3007666",
      "type_item_identifications_id":"4",
      "reference_price_id":"1",
      "price_amount":"840.34",
      "base_quantity":"1.8000",
      "tax_totals":[
        {
          "tax_id":"1",
          "tax_amount":287.40,
          "taxable_amount":1512.61,
          "percent":19
        }
      ]
    }
  ],
  "legal_monetary_totals":{
    "line_extension_amount":"20428.57",
    "tax_exclusive_amount":"20428.57",
    "tax_inclusive_amount":"24380.01",
    "total_charges":"0.00",
    "total_allowance":"0",
    "payable_amount":"24380.01"
  }	,
  "tax_totals":[
    {
      "tax_id":"1",
      "tax_amount":3881.42,
      "taxable_amount":20428.57,
      "percent":19.00
    },
    {
      "tax_id":"10",
      "tax_amount": 70,
      "quantity_units_id": "886",
      "per_unit_amount": 70,
      "base_unit_measure": 1
    }
  ]
}
```
