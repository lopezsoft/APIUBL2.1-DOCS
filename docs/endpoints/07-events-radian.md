---
sidebar_position: 7
sidebar_label: ⚡ Eventos RADIAN
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 🔄 API de Eventos RADIAN

:::info Base URL, Autenticación & Multi-Tenant (`client_uuid`)
- **Base URL:** `/api/ubl2.1/events`
- **Autenticación:** Requiere header `Authorization: Bearer {token}` en todos los endpoints.
- **Casas de Software (Multi-Tenant):** Puedes gestionar, consultar y transmitir eventos RADIAN en nombre de tus empresas cliente agregando el parámetro `?client_uuid={{client_uuid}}` a cualquiera de las URLs de esta sección.

**¿Dónde encontrar el `client_uuid` de tus clientes?**  
Puedes consultar el listado completo de tus empresas cliente y sus respectivos `client_uuid` mediante el endpoint:
```http
GET {{url}}/company/customers
Authorization: Bearer {token}
Content-Type: application/json
```
:::

**RADIAN** es la plataforma de la DIAN que permite la circulación electrónica de la Factura Electrónica de Venta (FEV) como título valor negociable. A través de esta API puedes registrar y transmitir los eventos del ciclo de vida de una factura desde la perspectiva del adquiriente.

### Ciclo de vida de una factura en RADIAN

El flujo estándar de eventos es secuencial. Un documento debe ser **importado** antes de poder enviar cualquier evento sobre él.

```
[Importar CUFE] → [030 Acuse de Recibo] → [032 Recibo del Bien] → [033 Aceptación Expresa]
                                         ↘ [031 Reclamo]
```

### Tipos de Evento Soportados

| Código | Nombre Oficial DIAN | Requiere `claim_code` |
|--------|---------------------|-----------------------|
| `030` | Acuse de Recibo de Factura Electrónica | No |
| `031` | Reclamo de la Factura Electrónica de Venta | **Sí** |
| `032` | Recibo del Bien y/o Prestación del Servicio | No |
| `033` | Aceptación Expresa | No |

---

## 📥 1. Importación y Encolamiento

<details open>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/import-excel</b> — Importar desde Excel</summary>

Permite importar múltiples documentos a RADIAN desde un archivo Excel `.xlsx`. El archivo debe enviarse codificado en **base64**.

**Body (JSON):**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `document_base64` | `string` | **Sí** | Archivo Excel (`.xlsx`/`.xls`) codificado en base64 |

> [!WARNING]
> El envío de archivos binarios (`multipart/form-data`) ya no es soportado. El archivo debe enviarse estrictamente como string en base64.

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "{{url}}/events/import-excel" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "document_base64": "UEsDBBQABgAIAAAAIQBi7p..."
  }'
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
const fs = require('fs');

const fileBase64 = fs.readFileSync('facturas.xlsx').toString('base64');

const response = await axios.post(`${url}/events/import-excel`, {
  document_base64: fileBase64
}, {
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$fileBase64 = base64_encode(file_get_contents('facturas.xlsx'));

$response = $client->post("{$url}/events/import-excel", [
    'headers' => [
        'Authorization' => "Bearer {$token}",
        'Content-Type'  => 'application/json',
    ],
    'json' => [
        'document_base64' => $fileBase64,
    ],
]);
```

</TabItem>
</Tabs>

<details>
<summary>💻 Ver Respuesta Exitosa (200)</summary>

```json
{
    "message": "Importación procesada.",
    "total_rows": 18,
    "queued": 6,
    "skipped": 12,
    "errors": [],
    "success": true
}
```

**Explicación de la respuesta:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `total_rows` | `int` | Total de filas leídas del Excel |
| `queued` | `int` | Documentos encolados para procesamiento |
| `skipped` | `int` | Documentos omitidos (duplicados, filtros) |
| `errors` | `array` | Detalle de errores por fila |
</details>

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/import-track-id</b> — Importar por Track ID</summary>

Importa un documento individual a RADIAN usando su CUFE o CUDE.

**Body (JSON):**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `trackId` | `string` | **Sí** | CUFE o CUDE del documento a importar |

:::tip Ruta alternativa
También puedes enviar el `trackId` directamente en la URL: `POST /{trackId}/import` (misma funcionalidad).
:::

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "{{url}}/events/import-track-id" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "trackId": "{{trackId}}"
  }'
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
const response = await axios.post(`${url}/events/import-track-id`, {
  trackId: trackId
}, {
  headers: { Authorization: `Bearer ${token}` }
});
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$response = $client->post("{$url}/events/import-track-id", [
    'headers' => ['Authorization' => "Bearer {$token}"],
    'json'    => ['trackId' => $trackId],
]);
```

</TabItem>
</Tabs>

<details>
<summary>💻 Ver Respuesta Exitosa (200)</summary>

```json
{
    "message": "Documento encolado para procesamiento.",
    "id": 42,
    "success": true
}
```
</details>

</details>

---

## 🔍 2. Consultas y Detalles

:::tip Flujo recomendado
`import-track-id` → `status/{trackId}` → `send/{trackId}`  
Verifica que el documento esté en estado `ACCEPTED` antes de enviar un evento sobre él.
:::

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/document-receptions</b> — Listar Recepciones</summary>

**Query Params:**

| Parámetro | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `query` | `string` | — | Buscar por nombre o NIT del emisor |
| `startDate` | `string` | — | Fecha inicio (`YYYY-MM-DD`) |
| `endDate` | `string` | — | Fecha fin (`YYYY-MM-DD`) |
| `trackId` | `string` | — | Buscar por CUFE/CUDE exacto |
| `limit` | `int` | 20 | Registros por página (máx. 50) |
| `client_uuid` | `string` | — | UUID del cliente (Multi-Tenant) |

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X GET "{{url}}/events/document-receptions?startDate=2026-08-01&endDate=2026-08-31&limit=20" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
const response = await axios.get(`${url}/events/document-receptions`, {
  params: { startDate: '2026-08-01', endDate: '2026-08-31', limit: 20 },
  headers: { Authorization: `Bearer ${token}` }
});
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$response = $client->get("{$url}/events/document-receptions", [
    'headers' => ['Authorization' => "Bearer {$token}"],
    'query'   => ['startDate' => '2026-08-01', 'endDate' => '2026-08-31', 'limit' => 20],
]);
```

</TabItem>
</Tabs>

<details>
<summary>💻 Ver Respuesta Exitosa (200)</summary>

```json
{
    "dataRecords": {
        "current_page": 1,
        "data": [ ... ],
        "total": 18
    },
    "success": true
}
```
</details>

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/document-receptions/&#123;documentId&#125;</b> — Detalle de Recepción con Eventos</summary>

**Path Params:**

| Parámetro | Tipo | Descripción |
|-------|------|-------------|
| `documentId` | `int` | ID interno de la recepción |

<details>
<summary>💻 Ver Respuesta Exitosa (200)</summary>

```json
{
    "dataRecords": {
        "data": [ ... ]
    },
    "success": true
}
```
</details>

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/status/&#123;trackId&#125;</b> — Consultar Estado de Evento</summary>

**Path Params:**

| Parámetro | Tipo | Descripción |
|-------|------|-------------|
| `trackId` | `string` | CUFE o CUDE del documento |

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X GET "{{url}}/events/status/{{trackId}}" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
const response = await axios.get(`${url}/events/status/${trackId}`, {
  headers: { Authorization: `Bearer ${token}` }
});
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$response = $client->get("{$url}/events/status/{$trackId}", [
    'headers' => ['Authorization' => "Bearer {$token}"],
]);
```

</TabItem>
</Tabs>

<details>
<summary>💻 Ver Respuesta Exitosa (200)</summary>

```json
{
    "message": "Consulta generada con éxito",
    "ResponseDian": { ... },
    "success": true
}
```
</details>

</details>

---

## 📤 3. Envío de Eventos a la DIAN

Todos los eventos se envían al mismo endpoint. El tipo de evento se determina por el campo `code` en el body.

**Endpoint:** `POST {{url}}/events/send/{{trackId}}`

| Parámetro | Ubicación | Tipo | Descripción |
|-----------|-----------|------|-------------|
| `trackId` | Path | `string` | CUFE o CUDE del documento receptor |
| `code` | Body | `string` | Código del evento RADIAN (`030`–`033`) |
| `notes` | Body | `string` | Descripción o nota del evento |
| `claim_code` | Body | `string` | ⚠️ **Solo evento `031`** — Código del motivo del reclamo |

---

### Evento 030 — Acuse de Recibo

<details open>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/send/&#123;trackId&#125;</b> — <code>030</code> Acuse de Recibo de Factura Electrónica</summary>

El adquiriente confirma que recibió la factura electrónica. **Es el primer evento obligatorio** antes de poder enviar cualquier otro.

**Body (JSON):**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `code` | `string` | **Sí** | Fijo: `"030"` |
| `notes` | `string` | **Sí** | Nota o descripción del acuse |

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "{{url}}/events/send/{{trackId}}" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "030",
    "notes": "Acuso recibido de factura."
  }'
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
const response = await axios.post(`${url}/events/send/${trackId}`, {
  code: '030',
  notes: 'Acuso recibido de factura.'
}, {
  headers: { Authorization: `Bearer ${token}` }
});
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$response = $client->post("{$url}/events/send/{$trackId}", [
    'headers' => ['Authorization' => "Bearer {$token}"],
    'json'    => [
        'code'  => '030',
        'notes' => 'Acuso recibido de factura.',
    ],
]);
```

</TabItem>
</Tabs>

<details>
<summary>💻 Ver Respuesta Exitosa (200)</summary>

```json
{
    "success": true
}
```
</details>

</details>

---

### Evento 031 — Reclamo de la FEV

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/send/&#123;trackId&#125;</b> — <code>031</code> Reclamo de la Factura Electrónica de Venta</summary>

El adquiriente registra un reclamo sobre la factura. Requiere el campo adicional `claim_code` con el motivo del reclamo.

:::caution Prerrequisito
Solo puede enviarse después de haber enviado el evento **030** (Acuse de Recibo).
:::

**Body (JSON):**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `code` | `string` | **Sí** | Fijo: `"031"` |
| `notes` | `string` | **Sí** | Descripción del reclamo |
| `claim_code` | `string` | **Sí** | Motivo del reclamo (ver tabla abajo) |

**Valores válidos para `claim_code`:**

| `claim_code` | Descripción |
|---|---|
| `01` | Documento con inconsistencias |
| `02` | Mercancía no entregada |
| `03` | Mercancía entregada parcialmente |
| `04` | Servicio no prestado |

:::tip Endpoint de consulta
Puedes obtener siempre la lista actualizada de conceptos de reclamo desde:
```http
GET {{url}}/claim-concepts
```
:::

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "{{url}}/events/send/{{trackId}}" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "031",
    "notes": "Reclamo de la Factura Electrónica de Venta.",
    "claim_code": "01"
  }'
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
const response = await axios.post(`${url}/events/send/${trackId}`, {
  code: '031',
  notes: 'Reclamo de la Factura Electrónica de Venta.',
  claim_code: '01'
}, {
  headers: { Authorization: `Bearer ${token}` }
});
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$response = $client->post("{$url}/events/send/{$trackId}", [
    'headers' => ['Authorization' => "Bearer {$token}"],
    'json'    => [
        'code'       => '031',
        'notes'      => 'Reclamo de la Factura Electrónica de Venta.',
        'claim_code' => '01',
    ],
]);
```

</TabItem>
</Tabs>

<details>
<summary>💻 Ver Respuesta Exitosa (200)</summary>

```json
{
    "success": true
}
```
</details>

</details>

---

### Evento 032 — Recibo del Bien y/o Servicio

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/send/&#123;trackId&#125;</b> — <code>032</code> Recibo del Bien y/o Prestación del Servicio</summary>

El adquiriente confirma que recibió el bien o que el servicio fue prestado conforme a lo acordado.

:::caution Prerrequisito
Solo puede enviarse después de haber enviado el evento **030** (Acuse de Recibo).
:::

**Body (JSON):**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `code` | `string` | **Sí** | Fijo: `"032"` |
| `notes` | `string` | **Sí** | Nota del recibo del bien/servicio |

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "{{url}}/events/send/{{trackId}}" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "032",
    "notes": "Recibo del bien y/o prestación del servicio."
  }'
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
const response = await axios.post(`${url}/events/send/${trackId}`, {
  code: '032',
  notes: 'Recibo del bien y/o prestación del servicio.'
}, {
  headers: { Authorization: `Bearer ${token}` }
});
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$response = $client->post("{$url}/events/send/{$trackId}", [
    'headers' => ['Authorization' => "Bearer {$token}"],
    'json'    => [
        'code'  => '032',
        'notes' => 'Recibo del bien y/o prestación del servicio.',
    ],
]);
```

</TabItem>
</Tabs>

<details>
<summary>💻 Ver Respuesta Exitosa (200)</summary>

```json
{
    "success": true
}
```
</details>

</details>

---

### Evento 033 — Aceptación Expresa

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/send/&#123;trackId&#125;</b> — <code>033</code> Aceptación Expresa</summary>

El adquiriente acepta expresamente la factura como título valor, habilitándola para su circulación y negociación en el mercado de valores.

:::caution Prerrequisito
Solo puede enviarse después de haber enviado los eventos **030** y **032** en ese orden.
:::

**Body (JSON):**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `code` | `string` | **Sí** | Fijo: `"033"` |
| `notes` | `string` | **Sí** | Nota de la aceptación expresa |

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "{{url}}/events/send/{{trackId}}" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "033",
    "notes": "Aceptación expresa."
  }'
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
const response = await axios.post(`${url}/events/send/${trackId}`, {
  code: '033',
  notes: 'Aceptación expresa.'
}, {
  headers: { Authorization: `Bearer ${token}` }
});
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$response = $client->post("{$url}/events/send/{$trackId}", [
    'headers' => ['Authorization' => "Bearer {$token}"],
    'json'    => [
        'code'  => '033',
        'notes' => 'Aceptación expresa.',
    ],
]);
```

</TabItem>
</Tabs>

<details>
<summary>💻 Ver Respuesta Exitosa (200)</summary>

```json
{
    "success": true
}
```
</details>

</details>

---

## 📧 4. Reenvío de Correo

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/send/mail/&#123;trackId&#125;</b> — Reenviar Correo de Evento</summary>

Reenvía el correo de notificación asociado a un evento ya procesado.

**Path Params:**

| Parámetro | Tipo | Descripción |
|-------|------|-------------|
| `trackId` | `string` | Track ID del evento |

<details>
<summary>💻 Ver Respuesta Exitosa (200)</summary>

```json
{
    "success": true
}
```
</details>

</details>

---

## 🗑️ 5. Eliminación

<details>
<summary><span className="badge badge--danger margin-right--sm">DELETE</span> <b>/document-receptions/&#123;id&#125;</b> — Eliminar Recepción</summary>

**Path Params:**

| Parámetro | Tipo | Descripción |
|-------|------|-------------|
| `id` | `int` | ID interno de la recepción |

> [!CAUTION]
> No se puede eliminar una recepción si ya tiene eventos con estado `ACCEPTED` o `PROCESSING`.

<details>
<summary>💻 Ver Respuesta Exitosa (200)</summary>

```json
{
    "message": "Recepción de documento eliminada exitosamente.",
    "success": true
}
```
</details>

</details>
