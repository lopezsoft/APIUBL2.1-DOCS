---
sidebar_position: 3
sidebar_label: 🧾 Facturación y POS
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 📄 Facturación y Documentos Equivalentes (POS) {#facturacion-pos}

:::info Autenticación Requerida
Incluir en todos los endpoints: `Authorization: Bearer {token}`
:::

:::info Parámetro Multi-Tenant: `client_uuid`
Todos los endpoints de esta sección aceptan el parámetro opcional `?client_uuid={{client_uuid}}` en la query string. Permite procesar documentos en nombre de empresas cliente cuando operas como **Casa de Software**.

Obtén el listado de tus clientes y sus UUIDs en:
```http
GET {{url}}/company/customers
Authorization: Bearer {token}
```
:::

## 📋 Tipos de Documento Soportados {#tipos-de-documento}

| `type_document_id` | Tipo de Documento | Endpoint |
|---|---|---|
| `1` | Factura Electrónica de Venta | `POST /invoice` |
| `4` | Nota Débito | `POST /notes/debit` |
| `5` | Nota Crédito | `POST /notes/credit` |
| `7` | Factura Sector Salud (FEV) | `POST /invoice` |
| `20` | Documento Equivalente POS | `POST /invoice` |
| `25` | Boleta de Ingreso a Espectáculo Público (Cine) | `POST /invoice` |
| `60` | Servicios Públicos Domiciliarios (SPD) | `POST /invoice` |

---

## 1. Emisión de Facturas {#emision-facturas}

<details open>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/invoice</b> — Enviar Factura Electrónica</summary>

```http
POST {{url}}/invoice?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Tipos soportados principales:**
- Factura nacional (01)
- Factura de exportación (02)
- Factura contingencia (03, 04)

**Ejemplos de Casos Soportados:**
- Factura Básica, Decimales, Ajustes.
- Factura Sector Salud, Mandatos, Compra y Venta de Divisas.
- Factura con Propina, Obsequio (Regalos), Descuentos, Retenciones y Cargos.
- Facturas en Moneda Extranjera (Euro, USD) y Exportación.
- Factura con Impuestos (Licores AD VALOREM / ICL, ICUI, Bolsas, Varios impuestos).

**Body:** JSON con estructura completa. Ver [Campos del Documento](/docs/billing-fields) para todos los detalles técnicos.

📦 [Ver ejemplos de Factura completos](/docs/jsons-billing/invoices)

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "{{url}}/invoice" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "resolution_number": "18764074347312",
    "prefix": "LZT",
    "document_number": "836",
    "operation_type_id": 1,
    "type_document_id": 1,
    "payments": [{"payment_method_id": 1, "means_payment_id": 10, "value_paid": "224.00"}],
    "customer": { "company_name": "Cliente Ejemplo", "dni": "1063279307", "email": "cliente@correo.com" },
    "lines": [{"invoiced_quantity": "1", "line_extension_amount": "200.00", "description": "Producto", "price_amount": "200.00", "base_quantity": "1"}],
    "legal_monetary_totals": {"line_extension_amount": "200.00", "tax_exclusive_amount": "200.00", "tax_inclusive_amount": "224.00", "payable_amount": "224.00"}
  }'
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
const response = await axios.post(`${url}/invoice`, payload, {
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const cufe = response.data.XmlDocumentKey;
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$response = $client->post("{$url}/invoice", [
    'headers' => [
        'Authorization' => "Bearer {$token}",
        'Content-Type'  => 'application/json',
    ],
    'json' => $payload,
]);
$cufe = json_decode($response->getBody())->XmlDocumentKey;
```

</TabItem>
</Tabs>

<details>
<summary>✅ Respuesta Exitosa — DIAN 200 OK</summary>

```json
{
  "message": "El documento ha sido procesado por la DIAN.",
  "send_to_queue": 0,
  "XmlDocumentKey": "ad20e8c21f359c96389fb254104fe2282b0c9d0a1be8e651d09b73b927f267dfe0a07fc03b10b6f068e7d7ab1b15bcbc",
  "response": {
    "ErrorMessage": {},
    "IsValid": "true",
    "StatusCode": "00",
    "StatusDescription": "Procesado Correctamente.",
    "StatusMessage": "La Factura Electrónica LZT836, ha sido autorizada.",
    "XmlBase64Bytes": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4..."
  }
}
```

</details>

<details>
<summary>❌ Rechazo DIAN (HTTP 422)</summary>

```json
{
  "message": "El documento ha sido rechazado por la DIAN.",
  "send_to_queue": 0,
  "response": {
    "IsValid": "false",
    "StatusCode": "99",
    "StatusDescription": "Documento con errores en campos obligatorios.",
    "ErrorMessage": {
      "string": [
        "CAU04b: El campo TaxAmount es obligatorio cuando ExistsWithholdingTax es verdadero."
      ]
    }
  }
}
```

</details>

</details>

---

## 2. Notas de Crédito y Débito {#notas-credito-debito}

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/notes/credit</b> — Enviar Nota Crédito</summary>

```http
POST {{url}}/notes/credit?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Casos:** Devoluciones, Descuentos globales, Correcciones hacia abajo.  
**Campo Clave:** `type_document_id: 5`

📦 [Ver ejemplos de Nota Crédito](/docs/jsons-billing/credit-note)

<details>
<summary>✅ Respuesta Exitosa — DIAN 200 OK</summary>

```json
{
  "message": "El documento ha sido procesado por la DIAN.",
  "send_to_queue": 0,
  "XmlDocumentKey": "ad20e8c21f359c96389fb254104fe2282b0c9d0a1be8e651d09b73b927f267dfe0a07fc03b10b6f068e7d7ab1b15bcbc",
  "response": {
    "ErrorMessage": {},
    "IsValid": "true",
    "StatusCode": "00",
    "StatusDescription": "Procesado Correctamente.",
    "StatusMessage": "La Factura Electrónica SETT50, ha sido autorizada.",
    "XmlBase64Bytes": "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4..."
  }
}
```

</details>

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/notes/debit</b> — Enviar Nota Débito</summary>

```http
POST {{url}}/notes/debit?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Casos:** Intereses, Cargos adicionales, Correcciones hacia arriba.  
**Campo Clave:** `type_document_id: 4`

</details>

---

## 3. Documentos Equivalentes (POS y Otros) {#documentos-equivalentes}

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/invoice</b> — POS Electrónico (Documento 20)</summary>

```http
POST {{url}}/invoice?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Casos:**
- POS con cliente (consumidor final u otros).
- POS sin envío de email.

**Campo Clave:** `type_document_id: 20`

📦 [Ver ejemplos de POS](/docs/jsons-pos/pos)

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/notes/credit | /notes/debit</b> — Notas para POS</summary>

```http
POST {{url}}/notes/credit?client_uuid={{client_uuid}}
POST {{url}}/notes/debit?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

Notas de crédito o débito asociadas a un documento P.O.S.

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/invoice</b> — Boleta de Ingreso a Cine (Documento 25)</summary>

```http
POST {{url}}/invoice?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

Documento equivalente para ingreso a cine (Documento 25).  
**Campo Clave:** `type_document_id: 25`

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/invoice</b> — SPD — Servicios Públicos Domiciliarios (Documento 60)</summary>

```http
POST {{url}}/invoice?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

Factura o documento equivalente por servicios públicos domiciliarios.  
**Campo Clave:** `type_document_id: 60`

</details>
