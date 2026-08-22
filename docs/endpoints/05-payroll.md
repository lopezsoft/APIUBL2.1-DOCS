---
sidebar_position: 5
sidebar_label: 💼 Nómina Electrónica
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 💼 Nómina Electrónica {#nomina-electronica}

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

El Documento Soporte de Pago de Nómina Electrónica es el soporte de los costos y deducciones en el impuesto sobre la renta derivado de los pagos relacionados con la nómina.

## 📋 Tipos de Documentos de Nómina {#tipos-nomina}

| Tipo | Endpoint | Uso |
|------|----------|-----|
| Nómina individual | `POST /ep/payroll` | Transmisión del período de pago |
| Nota de reemplazo | `POST /ep/payroll/replace` | Corrección de una nómina enviada |
| Nota de eliminación | `POST /ep/payroll/delete` | Eliminación legal de nómina errónea |

📦 Ver campos completos en [Campos de Nómina](/docs/payroll/payroll-fields)

---

## 1. Emisión {#emision}

<details open>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/ep/payroll</b> — Enviar Nómina</summary>

```http
POST {{url}}/ep/payroll?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

Transmite el documento soporte de pago de nómina electrónica a la DIAN.

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "{{url}}/ep/payroll" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{ ... }'
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
const response = await axios.post(`${url}/ep/payroll`, payload, {
  headers: { Authorization: `Bearer ${token}` }
});
const cuneKey = response.data.XmlDocumentKey;
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$response = $client->post("{$url}/ep/payroll", [
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
  "XmlDocumentKey": "860ff75995712a3bf5e9d14233e70bf2aca76b8ab5afdf41040e40331fe597c1bbb659a3af87e295a767a39921202e2e",
  "response": {
    "ErrorMessage": {},
    "IsValid": "true",
    "StatusCode": "00",
    "StatusDescription": "Procesado Correctamente.",
    "StatusMessage": "El Documento Soporte de Pago de Nómina Electrónica NIE10, ha sido autorizado."
  }
}
```

</details>

</details>

---

## 2. Nota de Reemplazo {#nota-reemplazo}

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/ep/payroll/replace</b> — Nota de Ajuste — Reemplazo</summary>

```http
POST {{url}}/ep/payroll/replace?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Uso:** Corregir un documento de nómina previamente enviado. La DIAN asume este nuevo documento como el reemplazo legal (corrección de valores).

<details>
<summary>✅ Respuesta Exitosa — DIAN 200 OK</summary>

```json
{
  "message": "El documento ha sido procesado por la DIAN.",
  "send_to_queue": 0,
  "XmlDocumentKey": "...",
  "response": {
    "IsValid": "true",
    "StatusCode": "00",
    "StatusDescription": "Procesado Correctamente.",
    "StatusMessage": "La Nota de Nómina Electrónica ha sido autorizada."
  }
}
```

</details>

</details>

---

## 3. Nota de Eliminación {#nota-eliminacion}

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/ep/payroll/delete</b> — Nota de Ajuste — Eliminación</summary>

```http
POST {{url}}/ep/payroll/delete?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Uso:** Eliminar un documento de nómina de forma legal ante la DIAN si fue generado por error y no se reemplazará por otro en el período actual.

:::warning Consecuencias legales
La nota de eliminación es una acción irreversible ante la DIAN. Úsala únicamente cuando el documento fue emitido por error y **no** va a ser reemplazado por una nueva nómina en el mismo período.
:::

<details>
<summary>✅ Respuesta Exitosa — DIAN 200 OK</summary>

```json
{
  "message": "El documento ha sido procesado por la DIAN.",
  "send_to_queue": 0,
  "XmlDocumentKey": "...",
  "response": {
    "IsValid": "true",
    "StatusCode": "00",
    "StatusDescription": "Procesado Correctamente.",
    "StatusMessage": "La Nota de Eliminación de Nómina ha sido autorizada."
  }
}
```

</details>

</details>
