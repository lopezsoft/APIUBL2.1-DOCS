---
sidebar_position: 4
sidebar_label: 📑 Documento Soporte
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 📦 Documento Soporte {#documento-soporte}

:::warning Autenticación Requerida
Incluir en todos los endpoints: `Authorization: Bearer {token}`
:::

:::info Parámetro Multi-Tenant: `client_uuid`
Todos los endpoints aceptan el parámetro opcional `?client_uuid={{client_uuid}}`. Permite emitir documentos en nombre de empresas cliente cuando operas como **Casa de Software**.
```http
GET {{url}}/company/customers
Authorization: Bearer {token}
```
:::

Los documentos soporte certifican adquisiciones efectuadas a sujetos **no obligados a expedir factura de venta** o documento equivalente.

:::tip Orden de configuración recomendado
Antes de emitir documentos soporte, asegúrate de tener configurados: **Resolución DIAN** → **Software DIAN** → **Certificado Digital**.
:::

## 📋 Diferencias clave: Documento Soporte vs Factura {#diferencias}

| Característica | Factura Electrónica | Documento Soporte |
|---|---|---|
| Endpoint | `POST /invoice` | `POST /ds/document` |
| `type_document_id` | `1` (FEV) | No aplica (definido en payload) |
| Proveedor | Obligado a facturar | **No obligado** a facturar |
| Nota de ajuste | Nota Crédito/Débito | `POST /ds/adjustment-note` |
| Referenciado en | `billing_reference` | `billing_reference` |

📦 Ver ejemplos en [/docs/jsons-support-document](/docs/jsons-support-document/support-document)

---

## 1. Emisión {#emision}

<details open>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/ds/document</b> — Enviar Documento Soporte</summary>

```http
POST {{url}}/ds/document?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Variantes disponibles:**
- Documento Soporte **Residente**.
- Documento Soporte **No Residente**.
- Casos especiales: IVA + RTE IVA, con decimales.

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "{{url}}/ds/document" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{ ... }'
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
const response = await axios.post(`${url}/ds/document`, payload, {
  headers: { Authorization: `Bearer ${token}` }
});
const cude = response.data.XmlDocumentKey;
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$response = $client->post("{$url}/ds/document", [
    'headers' => ['Authorization' => "Bearer {$token}"],
    'json'    => $payload,
]);
```

</TabItem>
</Tabs>

<details>
<summary>✅ Respuesta Exitosa — DIAN 200 OK</summary>

```json
{
  "message": "El documento ha sido procesado por la DIAN.",
  "send_to_queue": 0,
  "XmlDocumentKey": "9fa2bd902a5b498c79a844ba5e70f3c67009fc5a0fea1cb0cd4aeac38a10a7425f0e08ad71b83c821372adb1771e07dd",
  "response": {
    "ErrorMessage": {},
    "IsValid": "true",
    "StatusCode": "00",
    "StatusDescription": "Procesado Correctamente.",
    "StatusMessage": "El Documento Soporte DSE12, ha sido autorizado."
  }
}
```

</details>

<details>
<summary>❌ Rechazo DIAN (HTTP 422)</summary>

```json
{
  "message": "El documento ha sido rechazado por la DIAN.",
  "response": {
    "IsValid": "false",
    "StatusCode": "99",
    "ErrorMessage": {
      "string": ["Error en campos obligatorios del documento soporte."]
    }
  }
}
```

</details>

</details>

---

## 2. Nota de Ajuste {#nota-ajuste}

<details open>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/ds/adjustment-note</b> — Enviar Nota de Ajuste</summary>

```http
POST {{url}}/ds/adjustment-note?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Uso:** Para ajustar valores de un documento soporte previamente emitido.

**Variantes disponibles:**
- Nota de ajuste a Documento Soporte **Residente** y **No Residente**.
- Nota de ajuste con IVA + RTE IVA.

<details>
<summary>✅ Respuesta Exitosa — DIAN 200 OK</summary>

```json
{
  "message": "El documento ha sido procesado por la DIAN.",
  "send_to_queue": 0,
  "XmlDocumentKey": "9fa2bd902a5b498c79a844ba5e70f3c67009fc5a0fea1cb0cd4aeac38a10a7425f0e08ad71b83c821372adb1771e07dd",
  "response": {
    "ErrorMessage": {},
    "IsValid": "true",
    "StatusCode": "00",
    "StatusDescription": "Procesado Correctamente.",
    "StatusMessage": "El Documento Soporte DSE12, ha sido autorizado."
  }
}
```

</details>

</details>
