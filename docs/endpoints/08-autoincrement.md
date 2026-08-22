---
sidebar_position: 8
sidebar_label: 🔢 Numeración Automática
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 🚀 API de Autoincremento {#autoincremento}

:::warning Autenticación Requerida
Incluir en todos los endpoints: `Authorization: Bearer {token}`
:::

:::info Parámetro Multi-Tenant: `client_uuid`
Todos los endpoints aceptan `?client_uuid={{client_uuid}}` para operar en nombre de empresas cliente.
```http
GET {{url}}/company/customers
Authorization: Bearer {token}
```
:::

Esta API delega a la plataforma el manejo del consecutivo y prefijo de los documentos, evitando colisiones en envíos concurrentes.

:::note ¿Cómo funciona el autoincremento?
Cuando envías una petición, la plataforma **reserva atómicamente** el siguiente número consecutivo disponible en la resolución DIAN configurada antes de procesar el documento. Esto garantiza que incluso en escenarios de alta concurrencia, no se produzcan duplicados ni gaps en la numeración.

**El body del payload es idéntico** al de los endpoints estándar (ej. `POST /invoice`), con la única diferencia de que **no debes enviar** `prefix` ni `document_number` — se asignan automáticamente.
:::

---

## 📤 Emisión Autoincremental {#emision}

<details open>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/auto-increment/invoices</b> — Factura Autoincremental</summary>

```http
POST {{url}}/auto-increment/invoices?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

Emite una factura tomando automáticamente el siguiente número consecutivo disponible.

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "{{url}}/auto-increment/invoices" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{ ... }'
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
const response = await axios.post(`${url}/auto-increment/invoices`, payload, {
  headers: { Authorization: `Bearer ${token}` }
});
const uuid = response.data.uuid;
const cufe = response.data.XmlDocumentKey;
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$response = $client->post("{$url}/auto-increment/invoices", [
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
  "uuid": "0b96bb6e-7dd0-11f0-ba9f-f02f74cac485",
  "message": "Solicitud procesada por la DIAN.",
  "send_to_queue": 0,
  "XmlDocumentKey": "6142be764d365c08872933a58c67177b000764e24e4108b67e5aa0872d709ad52a23c7543ffcad42bdec5e9e726d7644",
  "response": {
    "ErrorMessage": {},
    "IsValid": "true",
    "StatusCode": "00",
    "StatusDescription": "Procesado Correctamente.",
    "StatusMessage": "La Factura Electrónica F1001, ha sido autorizada."
  }
}
```

</details>

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/auto-increment/credit-notes · /debit-notes</b> — Notas Autoincrementales</summary>

```http
POST {{url}}/auto-increment/credit-notes?client_uuid={{client_uuid}}
POST {{url}}/auto-increment/debit-notes?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

Notas de crédito y débito con numeración automática asignada.

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/auto-increment/support-documents</b> — Documento Soporte Autoincremental</summary>

```http
POST {{url}}/auto-increment/support-documents?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

Cubre tanto residentes como no residentes (se define en el payload).

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/auto-increment/pos-documents</b> — Documento POS Autoincremental</summary>

```http
POST {{url}}/auto-increment/pos-documents?client_uuid={{client_uuid}}
POST {{url}}/auto-increment/debit-notes?client_uuid={{client_uuid}}
POST {{url}}/auto-increment/credit-notes?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

Para Notas POS usa la misma ruta general, enviando el `type_document_id` adecuado en el JSON.

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/auto-increment/adjustment-notes</b> — Nota de Ajuste Autoincremental</summary>

```http
POST {{url}}/auto-increment/adjustment-notes?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

Nota de ajuste a Documento Soporte con numeración automática.

</details>

---

## 🔄 Reenvío y Reintentos {#reenvio}

<details open>
<summary><span className="badge badge--warning margin-right--sm">PATCH</span> <b>/auto-increment/invoices/&#123;uuid&#125;</b> — Reenvío de Factura</summary>

```http
PATCH {{url}}/auto-increment/invoices/{uuid}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

Reintenta la emisión de una factura autoincremental que haya fallado, usando su UUID interno.

| Parámetro | Ubicación | Requerido | Descripción |
|-----------|-----------|-----------|-------------|
| `uuid` | path | ✅ Sí | UUID interno del documento a reenviar. |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

</details>

<details>
<summary><span className="badge badge--warning margin-right--sm">PATCH</span> <b>/auto-increment/support-documents/&#123;uuid&#125;</b> — Reenvío de Documento Soporte</summary>

```http
PATCH {{url}}/auto-increment/support-documents/{uuid}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

| Parámetro | Ubicación | Requerido | Descripción |
|-----------|-----------|-----------|-------------|
| `uuid` | path | ✅ Sí | UUID interno del documento soporte a reenviar. |

</details>

<details>
<summary><span className="badge badge--warning margin-right--sm">PATCH</span> <b>/auto-increment/pos-documents/&#123;uuid&#125;</b> — Reenvío de Documento POS</summary>

```http
PATCH {{url}}/auto-increment/pos-documents/{uuid}?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

| Parámetro | Ubicación | Requerido | Descripción |
|-----------|-----------|-----------|-------------|
| `uuid` | path | ✅ Sí | UUID interno del documento POS a reenviar. |

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/documents/&#123;uuid&#125;/resend</b> — Reenviar Documentos en Lote</summary>

```http
POST {{url}}/documents/{uuid}/resend?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

Reenvía un documento específico procesado en modo asíncrono o que falló temporalmente.

| Parámetro | Ubicación | Requerido | Descripción |
|-----------|-----------|-----------|-------------|
| `uuid` | path | ✅ Sí | UUID interno del documento a reenviar. |
| `client_uuid` | query | No | UUID del cliente (Multi-Tenant). |

</details>
