---
sidebar_position: 31
sidebar_label: 🏥 Factura Sector Salud
description: "Ejemplo de payload JSON para Factura Electrónica del Sector Salud con soporte RIPS según la Resolución 000948 de 2026 y Documento Técnico 2 del MinSalud."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 🏥 Factura Electrónica del Sector Salud

La **Factura Electrónica de Venta (FEV) del Sector Salud** incorpora campos de datos específicos definidos por el Ministerio de Salud y Protección Social y la DIAN, actuando como soporte y validación previa del **Registro Individual de Prestación de Servicios de Salud (RIPS)**.

:::info 📋 Marco Normativo Vigente
Este documento cumple con las especificaciones de la **Resolución 000948 de 2026** (14 de mayo de 2026) —que deroga expresamente las Resoluciones 2275 de 2023, 558 y 1884 de 2024— y el **Documento Técnico 2 Versión 001** (*Campos de datos del sector salud adicionales a la generación de la FEV*).
:::

---

## 📦 Estructura del Payload JSON

A continuación se presenta el payload completo para emitir una Factura Electrónica del Sector Salud a través de la API:

```json title="invoice_sector_salud.json"
{
  "resolution_number": "18764112492320",
  "prefix": "LZT",
  "notes": "Nota del documento",
  "document_number": "6006",
  "graphic_representation": 1,
  "send_email": 1,
  "operation_type_id": 1,
  "type_document_id": 7,
  "payments": [
    {
      "payment_method_id": 1,
      "means_payment_id": 10,
      "value_paid": "224.00"
    }
  ],
  "health": {
    "operation_type": "SS-CUFE",
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
      "base_quantity": "2"
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
      "base_quantity": "2"
    }
  ],
  "legal_monetary_totals": {
    "line_extension_amount": "200.00",
    "tax_exclusive_amount": "0.00",
    "tax_inclusive_amount": "200.00",
    "payable_amount": 200.00,
    "pre_paid_amount": "0"
  }
}
```

---

## 🔍 Desglose del Objeto `health`

| Campo | Valor en Ejemplo | Descripción y Validación |
|---|:---:|---|
| `operation_type` | `"SS-CUFE"` | Tipo de operación en salud para factura electrónica con CUFE. |
| `provider_code` | `"2341702036"` | Código de habilitación REPS del prestador asignado en el Registro Especial de Prestadores de Servicios de Salud. |
| `payment_modality` | `"02"` | Modalidad de pago pactada (`02` = Pago global prospectivo). Catálogo `modalidadPago` de SISPRO. |
| `coverage` | `"01"` | Cobertura o plan de beneficios (`01` = Plan de beneficios en salud financiado con UPC Contributiva). Catálogo `coberturaPlan`. |
| `contract_number` | `"c12bab..."` | Número de contrato suscrito o código CUCON (Ley 1966 de 2019). |
| `policy_number` | `""` | Número de póliza de salud o SOAT (aplica para coberturas `04` SOAT o `12` Pólizas voluntarias). |
| `copayment` | `0` | Valor total de copagos recaudados al usuario (debe coincidir con RIPS). |
| `moderator_fee` | `0` | Valor de cuotas moderadoras efectivamente recaudadas (debe coincidir con RIPS). |
| `shared_payments` | `0` | Pagos compartidos en planes voluntarios de salud recaudados por el prestador. |
| `advance` | `0` | Anticipos pactados a legalizar descontados del valor de la factura. |
| `justification_without_contract` | `""` | Causal de atención sin contrato (Catálogo `facturaSinContrato` de SISPRO). Vacío cuando existe contrato. |
| `invoice_period` | `{...}` | Fechas y horas de inicio (`start_date`, `start_time`) y fin (`end_date`, `end_time`) de la prestación del servicio. |
| `download_attachments` | `{...}` | URL y lista de parámetros/archivos de soportes clínicos y RIPS adjuntos. |
| `document_delivery` | `{...}` | Web service SOAP/WSDL o REST para entrega y recepción de acuses de la factura. |

---

## 💻 Ejemplos de Envío a la API

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "{{url}}/invoice" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d @invoice_sector_salud.json
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```javascript
import axios from 'axios';

const payload = {
  resolution_number: "18764112492320",
  prefix: "LZT",
  notes: "Nota del documento",
  document_number: "6006",
  graphic_representation: 1,
  send_email: 1,
  operation_type_id: 1,
  type_document_id: 7,
  payments: [
    {
      payment_method_id: 1,
      means_payment_id: 10,
      value_paid: "224.00"
    }
  ],
  health: {
    operation_type: "SS-CUFE",
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
    country_id: "170",
    city_id: "149",
    identity_document_id: "1",
    type_organization_id: 2,
    tax_regime_id: 2,
    tax_level_id: 5,
    company_name: "Santiago Arango",
    dni: "1152440359",
    mobile: "3108435423",
    email: "lws_1234@hotmail.com",
    address: "Direccion residencial",
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
      base_quantity: "2"
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
      base_quantity: "2"
    }
  ],
  legal_monetary_totals: {
    line_extension_amount: "200.00",
    tax_exclusive_amount: "0.00",
    tax_inclusive_amount: "200.00",
    payable_amount: 200.00,
    pre_paid_amount: "0"
  }
};

const response = await axios.post(`${url}/invoice`, payload, {
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
$response = $client->post("{$url}/invoice", [
    'headers' => [
        'Authorization' => "Bearer {$token}",
        'Content-Type'  => 'application/json',
    ],
    'json' => [
        'resolution_number'      => '18764112492320',
        'prefix'                 => 'LZT',
        'notes'                  => 'Nota del documento',
        'document_number'        => '6006',
        'graphic_representation' => 1,
        'send_email'             => 1,
        'operation_type_id'      => 1,
        'type_document_id'       => 7,
        'payments' => [
            [
                'payment_method_id' => 1,
                'means_payment_id'  => 10,
                'value_paid'        => '224.00'
            ]
        ],
        'health' => [
            'operation_type'   => 'SS-CUFE',
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
            'country_id'           => '170',
            'city_id'              => '149',
            'identity_document_id' => '1',
            'type_organization_id' => 2,
            'tax_regime_id'        => 2,
            'tax_level_id'         => 5,
            'company_name'         => 'Santiago Arango',
            'dni'                  => '1152440359',
            'mobile'               => '3108435423',
            'email'                => 'lws_1234@hotmail.com',
            'address'              => 'Direccion residencial',
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
                'base_quantity'                => '2'
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
                'base_quantity'                => '2'
            ]
        ],
        'legal_monetary_totals' => [
            'line_extension_amount' => '200.00',
            'tax_exclusive_amount'  => '0.00',
            'tax_inclusive_amount'  => '200.00',
            'payable_amount'        => 200.00,
            'pre_paid_amount'       => '0'
        ]
    ]
]);

echo $response->getBody();
```

</TabItem>
</Tabs>

---

## 📋 Lista de Chequeo para Emisión en Salud
- [ ] **Código REPS Válido:** `provider_code` debe corresponder al código de habilitación activo de la IPS o proveedor en el Registro Especial de Prestadores de Servicios de Salud.
- [ ] **Modalidad y Cobertura:** `payment_modality` y `coverage` deben ser códigos válidos de las tablas SISPRO.
- [ ] **Periodo de Facturación:** Las fechas de `invoice_period` deben cubrir los servicios prestados o el periodo contractual acordado.
- [ ] **Sincronización con RIPS:** Los valores de `copayment`, `moderator_fee` y `shared_payments` deben coincidir exactamente con los montos consignados en la estructura del archivo RIPS JSON.
