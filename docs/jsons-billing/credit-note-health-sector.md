---
sidebar_position: 32
sidebar_label: 🏥 Nota Crédito Sector Salud
description: "Ejemplo de payload JSON para Nota Crédito Electrónica del Sector Salud con soporte RIPS según la Resolución 000948 de 2026 y Documento Técnico 2 del MinSalud."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 🏥 Nota Crédito del Sector Salud

La **Nota Crédito Electrónica del Sector Salud** se utiliza para realizar anulaciones, devoluciones, glosas, ajustes o correcciones a facturas electrónicas de servicios y tecnologías en salud previamente emitidas, manteniendo la trazabilidad e interoperabilidad con el **RIPS**.

:::info 📋 Marco Normativo Vigente
Este documento cumple con las especificaciones de la **Resolución 000948 de 2026** (14 de mayo de 2026) del Ministerio de Salud y Protección Social —que deroga expresamente las Resoluciones 2275 de 2023, 558 y 1884 de 2024— y el **Documento Técnico 2 Versión 001** (*Campos de datos del sector salud adicionales a la generación de la FEV*).
:::

---

## 📦 Estructura del Payload JSON

A continuación se detalla el payload completo para emitir una Nota Crédito del Sector Salud referenciando una Factura Electrónica previa:

```json title="credit_note_sector_salud.json"
{
  "resolution_number": "18763005880468",
  "prefix": "NC",
  "notes": "Documento anulado por errores en datos del cliente",
  "document_number": "7061",
  "operation_type_id": 12,
  "type_document_id": 5,
  "graphic_representation": 1,
  "send_email": 1,
  "document_signature": {
    "cashier": "Nombre del cajero(a)",
    "seller": "Nombre del vendedor(a)"
  },
  "discrepancy_response": {
    "reference_id": "LZT6004",
    "response_id": "2"
  },
  "billing_reference": {
    "number": "LZT6004",
    "date": "2026-08-16",
    "uuid": "ba87dd080aefd0558251633ceae95bb6cfe99b18625370c098edc73765bd65914a0447288ab72d1e24913e36813a4289"
  },
  "order_reference": {
    "reference_number": "4502878541",
    "reference_date": "2026-05-02"
  },
  "payments": [
    {
      "payment_method_id": 1,
      "means_payment_id": 10,
      "value_paid": "224.00"
    }
  ],
  "health": {
    "operation_type": "SS-CUDE",
    "invoice_period": {
      "start_date": "2026-07-01",
      "start_time": "23:59:59",
      "end_date": "2026-07-30",
      "end_time": "23:59:59"
    },
    "download_attachments": {
      "url": "www.ips-1.com.co",
      "arguments": [
        {
          "name": "excelFile",
          "value": "a1b2c3.xlsx"
        },
        {
          "name": "txtFile",
          "value": "a1b2c3.txt"
        }
      ]
    },
    "document_delivery": {
      "ws": "https://ws4erp.ips-987.com.co/WcfRecibiendoDocs4ERP.svc?wsdl",
      "arguments": [
        {
          "name": "Método-1",
          "value": "ClienteEntregaAcuseDeReciboDeFEV-VP"
        },
        {
          "name": "Método-2",
          "value": "ClienteEntregaConstanciaDeMercanciaEntregada"
        }
      ]
    },
    "provider_code": "2341702036",
    "payment_modality": "02",
    "coverage": "01",
    "contract_number": "c12bab98915513f00c50e7efdde112763c65b421afcc1f3cea76302e1c80e21c",
    "policy_number": "",
    "copayment": 0,
    "moderator_fee": 0,
    "shared_payments": 0,
    "advance": 0,
    "justification_without_contract": ""
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

---

## 🔍 Parámetros Clave de la Nota Crédito en Salud

| Campo | Valor en Ejemplo | Descripción |
|---|:---:|---|
| `operation_type_id` | `12` | Tipo de operación: Nota Crédito que referencia una Factura Electrónica. |
| `type_document_id` | `5` | Tipo de documento DIAN: **Nota Crédito**. |
| `health.operation_type` | `"SS-CUDE"` | Identificador de operación del sector salud para documentos con CUDE (Notas Crédito / Débito). |
| `discrepancy_response` | `{ "reference_id": "LZT6004", "response_id": "2" }` | Concepto de corrección DIAN (`2` = Anulación de factura electrónica). |
| `billing_reference` | `{ "number": "LZT6004", "uuid": "..." }` | Referencia a la factura electrónica original afectada (número, fecha y CUFE). |
| `health.provider_code` | `"2341702036"` | Código de habilitación REPS del prestador emisor. |
| `health.payment_modality` | `"02"` | Modalidad de pago pactada (`02` = Pago global prospectivo). |
| `health.coverage` | `"01"` | Cobertura o plan de beneficios (`01` = UPC Contributiva). |

---

## 💻 Ejemplos de Envío a la API

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "{{url}}/notes/credit" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d @credit_note_sector_salud.json
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```javascript
import axios from 'axios';

const payload = {
  resolution_number: "18763005880468",
  prefix: "NC",
  notes: "Documento anulado por errores en datos del cliente",
  document_number: "7061",
  operation_type_id: 12,
  type_document_id: 5,
  graphic_representation: 1,
  send_email: 1,
  document_signature: {
    cashier: "Nombre del cajero(a)",
    seller: "Nombre del vendedor(a)"
  },
  discrepancy_response: {
    reference_id: "LZT6004",
    response_id: "2"
  },
  billing_reference: {
    number: "LZT6004",
    date: "2026-08-16",
    uuid: "ba87dd080aefd0558251633ceae95bb6cfe99b18625370c098edc73765bd65914a0447288ab72d1e24913e36813a4289"
  },
  order_reference: {
    reference_number: "4502878541",
    reference_date: "2026-05-02"
  },
  payments: [
    {
      payment_method_id: 1,
      means_payment_id: 10,
      value_paid: "224.00"
    }
  ],
  health: {
    operation_type: "SS-CUDE",
    invoice_period: {
      start_date: "2026-07-01",
      start_time: "23:59:59",
      end_date: "2026-07-30",
      end_time: "23:59:59"
    },
    download_attachments: {
      url: "www.ips-1.com.co",
      arguments: [
        { name: "excelFile", value: "a1b2c3.xlsx" },
        { name: "txtFile", value: "a1b2c3.txt" }
      ]
    },
    document_delivery: {
      ws: "https://ws4erp.ips-987.com.co/WcfRecibiendoDocs4ERP.svc?wsdl",
      arguments: [
        { name: "Método-1", value: "ClienteEntregaAcuseDeReciboDeFEV-VP" },
        { name: "Método-2", value: "ClienteEntregaConstanciaDeMercanciaEntregada" }
      ]
    },
    provider_code: "2341702036",
    payment_modality: "02",
    coverage: "01",
    contract_number: "c12bab98915513f00c50e7efdde112763c65b421afcc1f3cea76302e1c80e21c",
    policy_number: "",
    copayment: 0,
    moderator_fee: 0,
    shared_payments: 0,
    advance: 0,
    justification_without_contract: ""
  },
  customer: {
    country_id: "45",
    city_id: "836",
    identity_document_id: "1",
    type_organization_id: 2,
    tax_regime_id: 2,
    tax_level_id: 5,
    company_name: "LOPEZ GOMEZ LEWIS OSWALDO",
    dni: "1063279307",
    mobile: "3108435423",
    email: "lws_1234@hotmail.com",
    address: "Calle 64 #1823",
    postal_code: "661002"
  },
  lines: [
    {
      invoiced_quantity: "2",
      quantity_units_id: "1093",
      line_extension_amount: "100.00",
      free_of_charge_indicator: false,
      description: "TIJERA NECROPSIA AVES",
      code: "HMT83",
      type_item_identifications_id: "4",
      reference_price_id: "1",
      price_amount: "50",
      base_quantity: "2",
      tax_totals: [
        {
          tax_id: "1",
          tax_amount: 19,
          taxable_amount: 100,
          percent: 19
        }
      ]
    },
    {
      invoiced_quantity: "2",
      quantity_units_id: "1093",
      line_extension_amount: "100.00",
      free_of_charge_indicator: false,
      description: "TIJERA NECROPSIA AVES 2",
      code: "HMT84",
      type_item_identifications_id: "4",
      reference_price_id: "1",
      price_amount: "50",
      base_quantity: "2",
      tax_totals: [
        {
          tax_id: "1",
          tax_amount: 5,
          taxable_amount: 100,
          percent: 5
        }
      ]
    }
  ],
  legal_monetary_totals: {
    line_extension_amount: "200.00",
    tax_exclusive_amount: "200.00",
    tax_inclusive_amount: "224.00",
    payable_amount: 224.00
  },
  tax_totals: [
    {
      tax_id: "1",
      tax_amount: 19,
      taxable_amount: 100,
      percent: 19
    },
    {
      tax_id: "1",
      tax_amount: 5,
      taxable_amount: 100,
      percent: 5
    }
  ]
};

const response = await axios.post(`${url}/notes/credit`, payload, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

console.log(response.data);
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
use GuzzleHttp\Client;

$client = new Client();
$response = $client->post("{$url}/notes/credit", [
    'headers' => [
        'Authorization' => "Bearer {$token}",
        'Content-Type'  => 'application/json',
    ],
    'json' => [
        'resolution_number'      => '18763005880468',
        'prefix'                 => 'NC',
        'notes'                  => 'Documento anulado por errores en datos del cliente',
        'document_number'        => '7061',
        'operation_type_id'      => 12,
        'type_document_id'       => 5,
        'graphic_representation' => 1,
        'send_email'             => 1,
        'document_signature' => [
            'cashier' => 'Nombre del cajero(a)',
            'seller'  => 'Nombre del vendedor(a)'
        ],
        'discrepancy_response' => [
            'reference_id' => 'LZT6004',
            'response_id'  => '2'
        ],
        'billing_reference' => [
            'number' => 'LZT6004',
            'date'   => '2026-08-16',
            'uuid'   => 'ba87dd080aefd0558251633ceae95bb6cfe99b18625370c098edc73765bd65914a0447288ab72d1e24913e36813a4289'
        ],
        'order_reference' => [
            'reference_number' => '4502878541',
            'reference_date'   => '2026-05-02'
        ],
        'payments' => [
            [
                'payment_method_id' => 1,
                'means_payment_id'  => 10,
                'value_paid'        => '224.00'
            ]
        ],
        'health' => [
            'operation_type'   => 'SS-CUDE',
            'provider_code'    => '2341702036',
            'payment_modality' => '02',
            'coverage'         => '01',
            'contract_number'  => 'c12bab98915513f00c50e7efdde112763c65b421afcc1f3cea76302e1c80e21c',
            'policy_number'    => '',
            'copayment'        => 0,
            'moderator_fee'    => 0,
            'shared_payments'  => 0,
            'advance'          => 0,
            'justification_without_contract' => '',
            'invoice_period'   => [
                'start_date' => '2026-07-01',
                'start_time' => '23:59:59',
                'end_date'   => '2026-07-30',
                'end_time'   => '23:59:59'
            ],
            'download_attachments' => [
                'url' => 'www.ips-1.com.co',
                'arguments' => [
                    ['name' => 'excelFile', 'value' => 'a1b2c3.xlsx'],
                    ['name' => 'txtFile', 'value' => 'a1b2c3.txt']
                ]
            ],
            'document_delivery' => [
                'ws' => 'https://ws4erp.ips-987.com.co/WcfRecibiendoDocs4ERP.svc?wsdl',
                'arguments' => [
                    ['name' => 'Método-1', 'value' => 'ClienteEntregaAcuseDeReciboDeFEV-VP'],
                    ['name' => 'Método-2', 'value' => 'ClienteEntregaConstanciaDeMercanciaEntregada']
                ]
            ]
        ],
        'customer' => [
            'country_id'           => '45',
            'city_id'              => '836',
            'identity_document_id' => '1',
            'type_organization_id' => 2,
            'tax_regime_id'        => 2,
            'tax_level_id'         => 5,
            'company_name'         => 'LOPEZ GOMEZ LEWIS OSWALDO',
            'dni'                  => '1063279307',
            'mobile'               => '3108435423',
            'email'                => 'lws_1234@hotmail.com',
            'address'              => 'Calle 64 #1823',
            'postal_code'          => '661002'
        ],
        'lines' => [
            [
                'invoiced_quantity'            => '2',
                'quantity_units_id'            => '1093',
                'line_extension_amount'        => '100.00',
                'free_of_charge_indicator'     => false,
                'description'                  => 'TIJERA NECROPSIA AVES',
                'code'                         => 'HMT83',
                'type_item_identifications_id' => '4',
                'reference_price_id'           => '1',
                'price_amount'                 => '50',
                'base_quantity'                => '2',
                'tax_totals' => [
                    [
                        'tax_id'         => '1',
                        'tax_amount'     => 19,
                        'taxable_amount' => 100,
                        'percent'        => 19
                    ]
                ]
            ],
            [
                'invoiced_quantity'            => '2',
                'quantity_units_id'            => '1093',
                'line_extension_amount'        => '100.00',
                'free_of_charge_indicator'     => false,
                'description'                  => 'TIJERA NECROPSIA AVES 2',
                'code'                         => 'HMT84',
                'type_item_identifications_id' => '4',
                'reference_price_id'           => '1',
                'price_amount'                 => '50',
                'base_quantity'                => '2',
                'tax_totals' => [
                    [
                        'tax_id'         => '1',
                        'tax_amount'     => 5,
                        'taxable_amount' => 100,
                        'percent'        => 5
                    ]
                ]
            ]
        ],
        'legal_monetary_totals' => [
            'line_extension_amount' => '200.00',
            'tax_exclusive_amount'  => '200.00',
            'tax_inclusive_amount'  => '224.00',
            'payable_amount'        => 224.00
        ],
        'tax_totals' => [
            [
                'tax_id'         => '1',
                'tax_amount'     => 19,
                'taxable_amount' => 100,
                'percent'        => 19
            ],
            [
                'tax_id'         => '1',
                'tax_amount'     => 5,
                'taxable_amount' => 100,
                'percent'        => 5
            ]
        ]
    ]
]);

echo $response->getBody();
```

</TabItem>
</Tabs>

---

## 📋 Reglas de Validación para Nota Crédito en Salud
- [ ] **Tipo de Operación y Documento:** `operation_type_id: 12` y `type_document_id: 5`.
- [ ] **Operación Salud CUDE:** En el objeto `health`, el campo `operation_type` debe ser `"SS-CUDE"`.
- [ ] **Referencia a Factura Obligatoria:** Debe incluir `billing_reference` con el número y CUFE exacto de la factura de salud afectada.
- [ ] **Concepto de Corrección:** El campo `discrepancy_response.response_id` debe contener el código de concepto DIAN aplicable (ej. `2` = Anulación).
