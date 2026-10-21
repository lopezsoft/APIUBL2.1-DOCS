---
sidebar_position: 7
sidebar_label: ⚡ Eventos RADIAN
description: "Recepción de documentos y eventos RADIAN (030, 031, 032, 033): importación, envío individual y en bloque, buzón de recepción y personas de recepción."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 🔄 API de Eventos RADIAN

:::info Base URL, Autenticación & Multi-Tenant (`client_uuid`)
- **Base URL:** `/api/ubl2.1/events`
- **Autenticación:** Requiere header `Authorization: Bearer {token}` en todos los endpoints.
- **Plan requerido:** Todo el módulo de recepción (eventos, importación, buzón y personas de recepción) exige un **plan de pago vigente**. Ver [Requisito de plan](#requisito-de-plan).
- **Casas de Software (Multi-Tenant):** Puedes gestionar, consultar y transmitir eventos RADIAN en nombre de tus empresas cliente agregando el parámetro `?client_uuid={{client_uuid}}` a cualquiera de las URLs de esta sección.

**¿Dónde encontrar el `client_uuid` de tus clientes?**  
Puedes consultar el listado completo de tus empresas cliente y sus respectivos `client_uuid` mediante el endpoint:
```http
GET {{url}}/company/customers
Authorization: Bearer {token}
Content-Type: application/json
```
:::

**RADIAN** es la plataforma de la DIAN que permite la circulación electrónica de la Factura Electrónica de Venta (FEV) como título valor negociable. A través de esta API puedes registrar y transmitir los eventos del ciclo de vida de una factura desde la perspectiva del adquiriente, recibir facturas de tus proveedores en un buzón de correo y administrar las personas que firman los eventos.

### Requisito de plan {#requisito-de-plan}

Todos los endpoints de `/api/ubl2.1/events/*` (recepciones, estado, archivos, importación, envío individual y en bloque, reenvío de correo, cancelación, eliminación, buzón y personas de recepción) exigen que la empresa tenga un **plan de pago vigente**: suscripción activa, no vencida y de un plan distinto de FREE.

* Un plan **FREE**, un plan de pago **vencido** o una empresa **sin suscripción** reciben `403` con `error_code: RECEPTION_NOT_IN_PLAN`. Esta respuesta se emite **antes** de validar el body, así que tiene prioridad sobre cualquier `422`.
* Quedarse **sin saldo** de documentos **no** quita el módulo: el plan ilimitado y los contratos mensuales o pospago tienen acceso mientras estén vigentes.
* Para una **sub-cuenta**, cuenta el plan de su Casa de Software.
* La empresa se determina con `client_uuid` (query o body) o, sin él, con la empresa del token. Si el `client_uuid` no es tuyo, la API responde el `403` habitual de acceso, que **no** trae `error_code`: así puedes distinguir un problema de plan de uno de permisos.
* Un cambio de plan puede tardar hasta **60 segundos** en reflejarse en la API.
* En el **Sandbox** el módulo siempre está incluido: este `403` no se emite.

```json
{
    "success": false,
    "message": "El plan FREE no incluye la recepción de facturas ni los eventos RADIAN. Actualice su plan para usarlos.",
    "error_code": "RECEPTION_NOT_IN_PLAN"
}
```

El mensaje es el mismo para plan FREE, plan vencido o empresa sin suscripción. Usa `error_code` para mostrar un aviso de actualización de plan sin cerrar la sesión del usuario.

:::caution 🆕 Migración: `MAILBOX_NOT_IN_PLAN` ya no se emite
El buzón (`GET /mailbox`, `GET /mailbox/{id}`, `GET /mailbox/address` y el resto de sus endpoints) es parte del módulo de recepción y responde este mismo `403` con `error_code` `RECEPTION_NOT_IN_PLAN`. Ya no devuelve `error_code` `MAILBOX_NOT_IN_PLAN` ni el mensaje «El plan FREE no incluye el buzón de recepción…». Si tu integración comparaba `error_code === "MAILBOX_NOT_IN_PLAN"`, compárala con `RECEPTION_NOT_IN_PLAN`.
:::

### Ciclo de vida de una factura en RADIAN

El flujo estándar de eventos es secuencial. **Importar el documento es opcional:** si envías un evento con `POST /send/{trackId}` sobre un CUFE/CUDE que la empresa aún no tiene registrado, la API descarga el documento de la DIAN y lo registra en ese momento.

```
[Importar CUFE (opcional)] → [030 Acuse de Recibo] → [032 Recibo del Bien] → [033 Aceptación Expresa]
                                                    ↘ [031 Reclamo]
```

:::caution Solo facturas de venta a crédito
La DIAN solo admite eventos RADIAN sobre **facturas electrónicas de venta a crédito**. Las facturas de **contado**, las facturas **sin medio de pago** (se asumen de contado) y las **notas crédito/débito** no generan ni admiten eventos: quedan registradas y visibles, con el motivo en el campo `status_reason`.
:::

### Eventos automáticos vs. manuales {#eventos-automaticos}

El **modo de eventos** es una configuración de la **empresa** (`send_events`), que se cambia con [`PUT /reception-people/mode`](#modo-eventos):

| Modo | `send_events` | Qué ocurre al registrar una factura a crédito (buzón o importación por Excel/CUFE) |
|------|:---:|------|
| **Automático** | `true` | Se crean los eventos `030`, `032` y `033` y se envían a la DIAN sin intervención del usuario. El `033` automático quita la posibilidad de reclamar con el `031`. El `031` nunca es automático. |
| **Manual** | `false` | No se crea **ningún** evento, **tampoco el `030`**. El usuario los envía con `POST /send/{trackId}` o `POST /send-bulk`. |

Reglas:

* **Una empresa nueva arranca en modo manual.**
* Si la empresa pasa a manual, los eventos que quedaron pendientes de envío automático **no** salen a la DIAN.
* Lo que pide el usuario (`POST /send/{trackId}` y `POST /send-bulk`) **siempre se envía**, también en modo manual.
* Sin persona de recepción, el buzón se trata como manual y la importación por Excel/CUFE responde `400` `No tiene una persona de recepción asignada` (salvo que envíes `reception_person` en la misma solicitud).
* El envío automático solo toma eventos pendientes creados en los **últimos 3 días** y de empresas con plan de pago vigente. Si la empresa pierde el plan, sus pendientes no se envían; al volver a un plan vigente, salen los de los últimos 3 días.
* Nunca se duplica un evento del mismo tipo para el mismo documento, aunque la empresa cambie de numeración.
* Un evento **aceptado** por la DIAN consume un documento del plan **una sola vez**.

### Tipos de Evento Soportados

| Código | Nombre Oficial DIAN | Requiere `claim_code` |
|--------|---------------------|-----------------------|
| `030` | Acuse de Recibo de Factura Electrónica | No |
| `031` | Reclamo de la Factura Electrónica de Venta | **Sí** |
| `032` | Recibo del Bien y/o Prestación del Servicio | No |
| `033` | Aceptación Expresa | No |

---

## 📥 1. Importación y Encolamiento {#importacion}

:::info Prerrequisitos de la importación
Antes de importar, la empresa necesita, en este orden:
1. Una **numeración activa para eventos de recepción**. Sin ella: `400` `No tiene una numeración activa para los eventos de recepción`.
2. Una **persona de recepción** (ver [Personas de recepción](#personas-recepcion)), salvo que envíes sus datos en `reception_person`. Sin ella: `400` `No tiene una persona de recepción asignada`. Si envías un `reception_person_uuid` que no es de la empresa: `404`.

El procesamiento es **asíncrono**: el resultado de cada documento se consulta en [`GET /document-receptions`](#consultas) (campos `import_status` y `status_reason`). Los eventos automáticos solo se crean si la empresa está en [modo automático](#eventos-automaticos).
:::

<span id="persona-importacion"></span>

:::note Persona elegida al importar
La persona que indicas al importar (`reception_person_uuid` o `reception_person`) se guarda con la recepción y **solo firma los eventos automáticos** (`030`, `032` y `033` en modo automático) que transmite el envío programado.

* En **modo manual** la importación no crea eventos, así que esa persona no firma nada.
* Los envíos que pides tú ([`POST /send/{trackId}`](#envio-eventos) y [`POST /send-bulk`](#envio-en-bloque)) firman con el `reception_person_uuid` de **esa** solicitud o, sin él, con la persona por defecto de la empresa. No usan la persona elegida al importar.

Si trabajas en modo manual y quieres que firme una persona distinta de la por defecto, envía `reception_person_uuid` en cada envío.
:::

<details open>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/import-excel</b> — Importar desde Excel</summary>

Permite importar múltiples documentos a RADIAN desde el archivo Excel `.xlsx`/`.xls` que exporta la DIAN. El archivo debe enviarse codificado en **base64**. Máximo **500 filas** por archivo.

**Body (JSON):**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `document_base64` | `string` | **Sí** | Archivo Excel (`.xlsx`/`.xls`) codificado en base64. Máximo **5 MB** decodificado. |
| `reception_person_uuid` | `string` (uuid) | No | Persona de recepción que firma los eventos **automáticos** de todo el lote. Sin él, se usa la persona por defecto. Ver [Persona elegida al importar](#persona-importacion). |
| `reception_person` | `object` | No | Datos de quien firma, enviados en la misma solicitud (ver tabla abajo). Si se envía, se ignora `reception_person_uuid`. Se aplica a todo el lote. |

**Objeto `reception_person` (opcional):**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `identity_document_id` | `integer` | **Sí** | Tipo de documento de identidad (catálogo `GET {{url}}/identity-documents`) |
| `dni` | `string` (máx. 20) | **Sí** | Número de identificación |
| `dv` | `string` (máx. 2) | No | Dígito de verificación |
| `first_name` | `string` (máx. 60) | **Sí** | Nombres |
| `last_name` | `string` (máx. 60) | **Sí** | Apellidos |
| `job_title` | `string` (máx. 100) | No | Cargo |
| `department` | `string` (máx. 100) | No | Área o departamento |

> [!WARNING]
> El envío de archivos binarios (`multipart/form-data`) ya no es soportado: la API responde `422` con un mensaje que explica cómo enviar el archivo en base64 dentro de un JSON.

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
    "skipped": 10,
    "cash": 2,
    "skipped_details": [
        {
            "row": 5,
            "cufe": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
            "reason_code": "DOCUMENT_TYPE_NOT_ALLOWED",
            "message": "Tipo de documento 'Nota de crédito electrónica' no admite eventos RADIAN: solo se procesan facturas electrónicas de venta."
        }
    ],
    "errors": [
        "Fila 9: CUFE/CUDE vacío."
    ],
    "success": true
}
```

**Explicación de la respuesta:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `total_rows` | `int` | Total de filas leídas del Excel |
| `queued` | `int` | Documentos encolados para procesamiento (incluye los CUFE ya registrados que se reprocesan: los que fallaron antes o los que eliminó el sistema) |
| `skipped` | `int` | Filas omitidas (las de `skipped_details` y las de `errors`) |
| `cash` | `int` | Facturas de **contado** según la columna `Forma de Pago` = `1`: se registran completas y visibles sin consultar la DIAN y **sin eventos**. No cuentan en `queued` ni en `skipped`. |
| `skipped_details` | `array` | Detalle de cada fila omitida: `row`, `cufe`, `reason_code` y `message` |
| `errors` | `array` | Errores por fila, como texto (p. ej. `Fila N: NIT receptor (x) no coincide con la empresa (y).` o `Fila N: CUFE/CUDE vacío.`) |

**Valores de `reason_code` en `skipped_details`:**

| `reason_code` | Motivo |
|---|---|
| `GROUP_NOT_RECEIVED` | La fila no pertenece al grupo `Recibido` |
| `DUPLICATED_IN_FILE` | El CUFE/CUDE está repetido en el archivo |
| `DOCUMENT_TYPE_NOT_ALLOWED` | Notas y otros tipos: solo se procesan facturas electrónicas de venta |
| `ALREADY_IMPORTED` | El CUFE/CUDE ya está registrado; `message` trae el motivo (ya importado, de contado, omitido o `El cufe/cude ya está en proceso de importación.`) |
| `USER_DELETED` | El usuario eliminó esa recepción: `El documento fue eliminado de la recepción; para recuperarlo impórtelo de nuevo por su CUFE.` La importación por Excel **no** restaura lo que el usuario eliminó. |

</details>

<details>
<summary>❌ Ver Respuestas de Error</summary>

| HTTP | Mensaje | Causa |
|:---:|---|---|
| `400` | `El archivo excede el límite de 500 filas. Filas encontradas: N.` | Más de 500 filas en el archivo |
| `400` | `No tiene una numeración activa para los eventos de recepción` | La empresa no tiene numeración activa de eventos |
| `400` | `No tiene una persona de recepción asignada` | Sin persona de recepción y sin `reception_person` |
| `403` | `RECEPTION_NOT_IN_PLAN` | Ver [Requisito de plan](#requisito-de-plan) |
| `404` | `La persona de recepción indicada (reception_person_uuid) no existe para esta empresa` | `reception_person_uuid` ajeno o eliminado |
| `422` | `El archivo decodificado no puede superar los 5MB.` | Archivo de más de 5 MB |
| `422` | `El archivo debe ser de tipo Excel (.xlsx o .xls).` | El contenido no es un Excel |
| `422` | `El campo document base64 no contiene un string base64 válido.` | `document_base64` no es base64 válido |

Los `422` de validación siguen el formato `{"message": "...", "errors": {"campo": ["..."]}}`.

</details>

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/import-track-id</b> — Importar por Track ID</summary>

Importa un documento individual a RADIAN usando su CUFE o CUDE.

**Body (JSON):**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `trackId` | `string` | **Sí** | CUFE o CUDE del documento a importar (entre 10 y 255 caracteres) |
| `reception_person_uuid` | `string` (uuid) | No | Persona de recepción que firma los eventos **automáticos** de este documento. Sin él, se usa la persona por defecto. Ver [Persona elegida al importar](#persona-importacion). |
| `reception_person` | `object` | No | Datos de quien firma, con los mismos campos que en [`/import-excel`](#importacion). Si se envía, se ignora `reception_person_uuid`. |

:::tip Ruta alternativa
También existe `POST /{trackId}/import`, pero esa ruta **también exige** el campo `trackId` en el body (sin él responde `422` `No ha enviado un trackId.`); cuando el body lo trae, se usa el de la URL. Recomendamos usar `POST /import-track-id`.
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

Documento nuevo:

```json
{
    "message": "Documento encolado para procesamiento.",
    "id": 42,
    "success": true
}
```

**Reimportación** de un CUFE ya registrado que fue eliminado (por el usuario o por el sistema) o cuya importación falló: se restaura y se vuelve a encolar.

```json
{
    "message": "Documento encolado nuevamente para procesamiento.",
    "id": 42,
    "success": true
}
```

</details>

<details>
<summary>❌ Ver Respuestas de Error</summary>

| HTTP | Mensaje | Causa |
|:---:|---|---|
| `400` | `El cufe/cude ya ha sido importado.` (más el motivo, si lo hay; p. ej. contado) | El documento ya está registrado y completo |
| `400` | `No tiene una numeración activa para los eventos de recepción` | La empresa no tiene numeración activa de eventos |
| `400` | `No tiene una persona de recepción asignada` | Sin persona de recepción y sin `reception_person` |
| `403` | `RECEPTION_NOT_IN_PLAN` | Ver [Requisito de plan](#requisito-de-plan) |
| `404` | `La persona de recepción indicada (reception_person_uuid) no existe para esta empresa` | `reception_person_uuid` ajeno o eliminado |
| `409` | `El cufe/cude ya está en proceso de importación.` | El documento se está importando |
| `409` | `El cufe/cude ya ha sido importado.` seguido del motivo | El documento fue omitido (p. ej. una nota crédito/débito) |
| `422` | `No ha enviado un trackId.` / `El trackId debe tener al menos 10 caracteres.` / `El trackId no puede superar los 255 caracteres.` / `reception_person_uuid debe ser un UUID válido.` | Validación del body |

Si al procesarlo el plan ya no incluye el módulo, el documento queda con `import_status` `FAILED` y el motivo del plan en `status_reason`. Una nota crédito/débito o un tipo no soportado queda `SKIPPED` con su motivo (no se borra).

</details>

</details>

---

## 🔍 2. Consultas y Detalles {#consultas}

:::tip Flujo recomendado
`import-track-id` → `document-receptions` (espera `import_status` = `COMPLETED` y `status_reason` = `null`) → `send/{trackId}`  
Un documento con `status_reason` distinto de `null` no admite eventos o aún se está importando.
:::

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/document-receptions</b> — Listar Recepciones</summary>

**Query Params:**

| Parámetro | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `trackId` | `string` | — | Buscar por CUFE/CUDE exacto. Si se envía, se ignoran `query`, `startDate` y `endDate`. |
| `query` | `string` | — | Buscar por folio, razón social o NIT del emisor |
| `startDate` | `string` | — | Fecha inicio (`YYYY-MM-DD`) de **registro en la plataforma** (no de emisión) |
| `endDate` | `string` | — | Fecha fin (`YYYY-MM-DD`) de registro. Se compara a medianoche: no incluye los registros de ese mismo día. |
| `limit` | `int` | 20 | Registros por página (máx. 50) |
| `client_uuid` | `string` | — | UUID del cliente (Multi-Tenant) |

El resultado se ordena por fecha de emisión, de la más reciente a la más antigua.

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

Se muestran los campos principales de cada recepción.

```json
{
    "dataRecords": {
        "current_page": 1,
        "data": [
            {
                "id": 42,
                "cufe_cude": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
                "folio": "FE1001",
                "issue_date": "15-08-2026",
                "total": "1190000.00",
                "document_origin": "RECEIVED",
                "import_status": "COMPLETED",
                "status_reason": null,
                "people": {
                    "id": 7,
                    "dni": "900123456",
                    "company_name": "PROVEEDOR DE EJEMPLO S.A.S.",
                    "email": "facturacion@proveedor-ejemplo.com",
                    "address": "Calle 1 # 2-3",
                    "phone": "3000000000"
                }
            }
        ],
        "per_page": 20,
        "total": 18
    },
    "success": true
}
```

**Campos de estado de cada recepción:**

| Campo | Descripción |
|-------|-------------|
| `import_status` | `PENDING`, `PROCESSING`, `COMPLETED`, `SKIPPED` (omitido, p. ej. una nota) o `FAILED` |
| `document_origin` | `IMPORTED` (Excel, CUFE o envío de evento) o `RECEIVED` (llegó por el buzón) |
| `status_reason` | `null` si el documento admite eventos. Si no, el motivo legible (tabla abajo). |

**Valores de `status_reason`:**

| Situación | Texto |
|---|---|
| Factura de contado | `Factura de contado: la DIAN no admite eventos RADIAN (acuse, recibo, aceptación o reclamo) para facturas de contado.` |
| Nota omitida (`SKIPPED`) | `Nota crédito/débito: la DIAN no admite eventos RADIAN sobre notas; solo se procesan facturas electrónicas de venta.` |
| Tipo no soportado (`SKIPPED`) | `Tipo de documento 'X' no soportado para eventos RADIAN: solo se procesan facturas electrónicas de venta (01).` |
| Importación fallida (`FAILED`) | `No fue posible obtener el documento desde la DIAN. Puede volver a importar el CUFE.` |
| Documento ilegible (`FAILED`) | `El documento que devolvió la DIAN para este CUFE no es una factura electrónica legible. Verifique el CUFE o contacte a soporte.` |
| Sin plan al procesar (`FAILED`) | `El plan FREE no incluye la recepción de facturas ni los eventos RADIAN. Actualice su plan para usarlos.` |
| En proceso (`PENDING` / `PROCESSING`) | `El documento se está importando; el resultado aparecerá en el listado en unos segundos.` |

</details>

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/document-receptions/&#123;documentId&#125;</b> — Detalle de Recepción con Eventos</summary>

Devuelve la recepción con su arreglo `events`. Ahí está el **`id` numérico de cada evento**, que necesitas para [cancelarlo](#cancelar-evento) o [reenviar su correo](#reenvio-correo), y su `document_status` (`PENDING`, `PROCESSING`, `ACCEPTED`, `REJECTED`, `CANCELLED` o `UNKNOWN`), que muestra el resultado final de un [envío en bloque](#envio-en-bloque).

**Path Params:**

| Parámetro | Tipo | Descripción |
|-------|------|-------------|
| `documentId` | `int` | ID de la recepción (campo `id` del listado) |

Si el `documentId` no existe o es de otra empresa, la respuesta es `200` con `data` vacío (no `404`).

<details>
<summary>💻 Ver Respuesta Exitosa (200)</summary>

Se muestran los campos principales.

```json
{
    "dataRecords": {
        "current_page": 1,
        "data": [
            {
                "id": 42,
                "cufe_cude": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
                "folio": "FE1001",
                "issue_date": "15-08-2026",
                "total": "1190000.00",
                "document_origin": "IMPORTED",
                "import_status": "COMPLETED",
                "status_reason": null,
                "people": {
                    "id": 7,
                    "dni": "900123456",
                    "company_name": "PROVEEDOR DE EJEMPLO S.A.S.",
                    "email": "facturacion@proveedor-ejemplo.com",
                    "address": "Calle 1 # 2-3",
                    "phone": "3000000000"
                },
                "events": [
                    {
                        "id": 128,
                        "type_event_id": 1,
                        "event_number": "EV1",
                        "date_event": "16-08-2026 09:30:00 am",
                        "description": "Acuso recibido de factura.",
                        "document_status": "ACCEPTED",
                        "send_mail": 1
                    }
                ]
            }
        ],
        "total": 1
    },
    "success": true
}
```

</details>

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/document-receptions/&#123;documentId&#125;/files</b> — Archivos de una Recepción</summary>

Lista los archivos custodiados de una recepción que llegó por el [buzón de recepción](#buzon-recepcion). Las recepciones importadas por Excel o CUFE no tienen archivos y devuelven una lista vacía.

**Path Params:**

| Parámetro | Tipo | Descripción |
|-------|------|-------------|
| `documentId` | `int` | ID de la recepción |

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X GET "{{url}}/events/document-receptions/42/files" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
const response = await axios.get(`${url}/events/document-receptions/${documentId}/files`, {
  headers: { Authorization: `Bearer ${token}` }
});
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$response = $client->get("{$url}/events/document-receptions/{$documentId}/files", [
    'headers' => ['Authorization' => "Bearer {$token}"],
]);
```

</TabItem>
</Tabs>

<details>
<summary>💻 Ver Respuesta Exitosa (200)</summary>

```json
{
    "dataRecords": {
        "data": [
            {
                "id": 9001,
                "type_document": "XML",
                "file_name": "document.xml",
                "mime_type": "application/xml",
                "file_size": 18432,
                "created_at": "2026-08-15T14:20:00.000000Z"
            },
            {
                "id": 9002,
                "type_document": "ZIP",
                "file_name": "fe1001.zip",
                "mime_type": "application/zip",
                "file_size": 9216,
                "created_at": "2026-08-15T14:20:00.000000Z"
            }
        ]
    },
    "success": true
}
```

| Campo | Descripción |
|-------|-------------|
| `id` | ID del archivo, para la descarga |
| `type_document` | `INBOUND_EMAIL_RAW` (correo original, `original.eml`), `XML` (el documento electrónico, `document.xml`), `ZIP` (el adjunto, con el nombre que traía en el correo) o `ATTACHED_DOC` (cuando el documento llegó como AttachedDocument XML suelto en lugar de ZIP) |
| `file_size` | Tamaño en bytes (puede ser `null`) |

</details>

<details>
<summary>❌ Recepción no encontrada (HTTP 404)</summary>

```json
{
    "success": false,
    "message": "Recepción de documento no encontrada."
}
```

</details>

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/document-receptions/&#123;documentId&#125;/files/&#123;fileManagerId&#125;/download</b> — Descargar Archivo</summary>

Devuelve el **binario** del archivo con su `Content-Type` y el encabezado `Content-Disposition: attachment; filename="..."`.

**Path Params:**

| Parámetro | Tipo | Descripción |
|-------|------|-------------|
| `documentId` | `int` | ID de la recepción |
| `fileManagerId` | `int` | `id` del archivo (de `/files` o de `files` en `GET /mailbox/{id}`) |

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X GET "{{url}}/events/document-receptions/42/files/9001/download" \
  -H "Authorization: Bearer {token}" \
  -o fe1001.xml
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
const response = await axios.get(
  `${url}/events/document-receptions/${documentId}/files/${fileId}/download`,
  {
    headers: { Authorization: `Bearer ${token}` },
    responseType: 'arraybuffer'
  }
);
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$response = $client->get("{$url}/events/document-receptions/{$documentId}/files/{$fileId}/download", [
    'headers' => ['Authorization' => "Bearer {$token}"],
    'sink'    => 'fe1001.xml',
]);
```

</TabItem>
</Tabs>

<details>
<summary>❌ Ver Respuestas de Error (HTTP 404)</summary>

| Mensaje | Causa |
|---|---|
| `Recepción de documento no encontrada.` | La recepción no existe o es de otra empresa |
| `Archivo no encontrado para esta recepción de documento.` | El archivo no pertenece a esa recepción |
| `El archivo no está disponible en el almacenamiento.` | El archivo ya no está almacenado |

</details>

:::caution 🆕 El 403 de plan llega en JSON
Sin plan de pago vigente, la descarga responde `403` en **JSON**, aunque hayas pedido un binario ([Requisito de plan](#requisito-de-plan)):

```json
{
    "success": false,
    "message": "El plan FREE no incluye la recepción de facturas ni los eventos RADIAN. Actualice su plan para usarlos.",
    "error_code": "RECEPTION_NOT_IN_PLAN"
}
```

Si pides la descarga como `blob` o `arraybuffer`, lee el cuerpo del error como texto JSON para obtener el `error_code`. Por ejemplo, con Axios: `JSON.parse(new TextDecoder().decode(error.response.data))` con `arraybuffer`, o `JSON.parse(await error.response.data.text())` con `blob`.
:::

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

`ResponseDian` trae la respuesta de la consulta a la DIAN.

```json
{
    "message": "Consulta generada con éxito",
    "ResponseDian": {},
    "success": true
}
```

</details>

</details>

---

<span id="envio-eventos"></span>

## 📤 3. Envío de Eventos a la DIAN

Todos los eventos se envían al mismo endpoint. El tipo de evento se determina por el campo `code` en el body.

**Endpoint:** `POST {{url}}/events/send/{{trackId}}`

| Parámetro | Ubicación | Tipo | Requerido | Descripción |
|-----------|-----------|------|:---:|-------------|
| `trackId` | Path | `string` | **Sí** | CUFE o CUDE del documento recibido |
| `code` | Body | `string` | **Sí** | Código del evento RADIAN (`030`–`033`) |
| `notes` | Body | `string` | No | Descripción o nota del evento (máx. 200 caracteres) |
| `claim_code` | Body | `string` | Solo `031` | ⚠️ **Solo evento `031`** — Código del motivo del reclamo |
| `reception_person_uuid` | Body | `string` (uuid) | No | Persona de recepción que firma el evento. Sin él, firma la persona por defecto. |

:::info Reglas del envío individual
* **Síncrono:** la respuesta llega después de transmitir a la DIAN. Es `200` también cuando la DIAN **rechaza** el evento: queda en `REJECTED` y `data` trae la respuesta de la DIAN. Cuando la DIAN lo acepta, `data` es `{"IsValid": "true"}`.
* **Sin importación previa:** si la empresa no tiene recepción para ese CUFE/CUDE, la API descarga el documento de la DIAN y lo registra (`document_origin` = `IMPORTED`). Solo admite facturas y notas (tipos `01`, `91`, `92`); luego aplica la regla de crédito: contado o nota responden `400` con el motivo. Sin medio de pago en el XML se asume contado.
* **Sin duplicados:** si el documento ya tiene un evento de ese tipo (en cualquier numeración), se reutiliza. Se reenvía un evento `PENDING`, `REJECTED`, `CANCELLED` o `UNKNOWN`; nunca uno `ACCEPTED`. 🆕 Si el evento reutilizado se creó con una numeración distinta de la vigente, al reenviarlo (aquí o con [`/send-bulk`](#envio-en-bloque)) pasa a la numeración activa de eventos y toma su siguiente número, así que cambia el número del evento en el detalle de la recepción. Si ya está en la numeración vigente, conserva su número.
* **Sale también en modo manual.**
* Si otro proceso (envío automático, envío en bloque u otra petición) está transmitiendo el mismo evento, responde `409`: no se envía en paralelo ni se cobra dos veces. Si ese envío falla, puedes reintentar.
:::

<details>
<summary>❌ Respuestas de error comunes a los eventos 030, 031, 032 y 033</summary>

Cuerpo: `{"success": false, "message": "..."}`, salvo el `422` de validación (formato `{"message": "...", "errors": {...}}`) y el `403` de plan.

| HTTP | Mensaje | Causa |
|:---:|---|---|
| `400` | `El tipo de evento no existe` | `code` inválido |
| `400` | `El código de reclamación es obligatorio.` | Evento `031` sin `claim_code` |
| `400` | `El código de reclamación no existe.` | `claim_code` inválido |
| `400` | `No tiene una persona de recepción asignada` | La empresa no tiene persona de recepción |
| `400` | `Factura de contado: la DIAN no admite eventos RADIAN (acuse, recibo, aceptación o reclamo) para facturas de contado.` | Documento de contado (o sin medio de pago) |
| `400` | `Nota crédito/débito: la DIAN no admite eventos RADIAN sobre notas; solo se procesan facturas electrónicas de venta.` | El documento es una nota (o el `status_reason` de un documento omitido) |
| `400` | `El tipo de documento no es permitido` | El CUFE/CUDE descargado de la DIAN no es factura ni nota |
| `400` | `No tiene una numeración activa para los eventos de recepción` | La empresa no tiene numeración activa de eventos |
| `400` | `El evento ya fue validado y aceptado.` | El evento ya está `ACCEPTED` |
| `403` | `RECEPTION_NOT_IN_PLAN` | Ver [Requisito de plan](#requisito-de-plan) |
| `404` | `La persona de recepción indicada (reception_person_uuid) no existe para esta empresa` | `reception_person_uuid` ajeno o eliminado (sin efectos) |
| `409` | `El evento ya se está enviando.` | Otro proceso lo está transmitiendo |
| `422` | `reception_person_uuid debe ser un UUID válido.` | `reception_person_uuid` mal formado |

</details>

---

### Evento 030 — Acuse de Recibo

<details open>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/send/&#123;trackId&#125;</b> — <code>030</code> Acuse de Recibo de Factura Electrónica</summary>

El adquiriente confirma que recibió la factura electrónica. **Es el primer evento obligatorio** antes de poder enviar cualquier otro.

**Body (JSON):**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `code` | `string` | **Sí** | Fijo: `"030"` |
| `notes` | `string` | No | Nota o descripción del acuse |
| `reception_person_uuid` | `string` (uuid) | No | Persona que firma; sin él, la persona por defecto |

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

`message` es `Evento creado con éxito` cuando el evento es nuevo y `Evento enviado con éxito` cuando se reenvía uno existente.

```json
{
    "message": "Evento creado con éxito",
    "data": {
        "IsValid": "true"
    },
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
Solo puede enviarse después de haber enviado el evento **030** (Acuse de Recibo). Si la empresa está en [modo automático](#eventos-automaticos), el `033` automático quita la posibilidad de reclamar.
:::

**Body (JSON):**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `code` | `string` | **Sí** | Fijo: `"031"` |
| `notes` | `string` | No | Descripción del reclamo |
| `claim_code` | `string` | **Sí** | Motivo del reclamo (ver tabla abajo) |
| `reception_person_uuid` | `string` (uuid) | No | Persona que firma; sin él, la persona por defecto |

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
    "message": "Evento creado con éxito",
    "data": {
        "IsValid": "true"
    },
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
| `notes` | `string` | No | Nota del recibo del bien/servicio |
| `reception_person_uuid` | `string` (uuid) | No | Persona que firma; sin él, la persona por defecto |

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
    "message": "Evento creado con éxito",
    "data": {
        "IsValid": "true"
    },
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
| `notes` | `string` | No | Nota de la aceptación expresa |
| `reception_person_uuid` | `string` (uuid) | No | Persona que firma; sin él, la persona por defecto |

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
    "message": "Evento creado con éxito",
    "data": {
        "IsValid": "true"
    },
    "success": true
}
```

</details>

</details>

---

### Envío en bloque del acuse 030 {#envio-en-bloque}

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/send-bulk</b> — Enviar el acuse <code>030</code> a varias recepciones 🆕</summary>

Envía el acuse de recibo (`030`) a varias recepciones de la empresa en una sola solicitud. Es la forma práctica de acusar en [modo manual](#eventos-automaticos).

**Body (JSON):**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `document_ids` | `array` de `int` | **Sí** | IDs de las recepciones (campo `id` de `GET /document-receptions`). Mínimo 1, máximo **50** por solicitud. Los repetidos se envían una sola vez. |
| `code` | `string` | **Sí** | Solo se admite `"030"` |
| `reception_person_uuid` | `string` (uuid) | No | Persona que firma; sin él, la persona por defecto |
| `client_uuid` | `string` | No | UUID de la empresa cliente (Casa de Software). También puede ir en el query. |

:::info Reglas del envío en bloque
* **Asíncrono:** `queued` significa **encolado**, no aceptado. El resultado final de cada documento se consulta en [`GET /document-receptions/{documentId}`](#consultas) (`document_status` del evento).
* **Siempre se envía**, también si la empresa está en modo manual.
* **Idempotente:** nunca crea un segundo `030` para el mismo documento. Un `030` `ACCEPTED` o en envío no se reenvía; uno `PENDING`, `REJECTED`, `CANCELLED` o `UNKNOWN` sí se envía.
* Un evento encolado por esta vía pasa de inmediato a envío (`PROCESSING`) y **no se puede cancelar** con `/{id}/cancel`.
* 🆕 **Plan perdido con el envío en cola:** si al momento de transmitir el `030` la empresa ya no tiene plan de pago vigente (bajó a FREE o venció), no se envía ni se cobra. El evento queda `REJECTED` y se notifica con el motivo del plan. Con un plan de pago vigente puedes volver a enviarlo (`/send/{trackId}` o `/send-bulk`). En cambio, un evento **automático** que ya estaba en cola vuelve a `PENDING` y sale solo si la empresa recupera el plan dentro de la ventana de 3 días.
:::

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "{{url}}/events/send-bulk" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "document_ids": [42, 43, 44],
    "code": "030"
  }'
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
const response = await axios.post(`${url}/events/send-bulk`, {
  document_ids: [42, 43, 44],
  code: '030'
}, {
  headers: { Authorization: `Bearer ${token}` }
});
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$response = $client->post("{$url}/events/send-bulk", [
    'headers' => ['Authorization' => "Bearer {$token}"],
    'json'    => [
        'document_ids' => [42, 43, 44],
        'code'         => '030',
    ],
]);
```

</TabItem>
</Tabs>

<details>
<summary>💻 Ver Respuesta Exitosa (200)</summary>

```json
{
    "message": "Envío en bloque procesado.",
    "summary": {
        "requested": 3,
        "queued": 1,
        "already_exists": 1,
        "not_applicable": 1,
        "not_found": 0,
        "error": 0
    },
    "results": [
        {
            "document_id": 42,
            "folio": "FE1001",
            "status": "queued",
            "message": "Acuse encolado para envío a la DIAN.",
            "event_id": 128,
            "document_status": "PROCESSING"
        },
        {
            "document_id": 43,
            "folio": "FE1002",
            "status": "already_exists",
            "message": "El acuse ya fue aceptado por la DIAN.",
            "event_id": 129,
            "document_status": "ACCEPTED"
        },
        {
            "document_id": 44,
            "folio": "FE1003",
            "status": "not_applicable",
            "message": "Factura de contado: la DIAN no admite eventos RADIAN (acuse, recibo, aceptación o reclamo) para facturas de contado.",
            "event_id": null,
            "document_status": null
        }
    ],
    "success": true
}
```

**Valores de `status` en `results`:**

| `status` | `message` |
|---|---|
| `queued` | `Acuse encolado para envío a la DIAN.` |
| `already_exists` | `El acuse ya fue aceptado por la DIAN.` o `El acuse ya se está enviando a la DIAN.` |
| `not_applicable` | Motivo legible: contado, nota crédito/débito, documento omitido, importación en proceso o fallida, o sin plan |
| `not_found` | `La recepción no existe para esta empresa.` |
| `error` | `No fue posible encolar el acuse. Intente de nuevo.` |

`event_id` es el `id` numérico del evento (sirve para `/send/mail/{id}`); `folio`, `event_id` y `document_status` pueden ser `null`.

</details>

<details>
<summary>❌ Ver Respuestas de Error</summary>

| HTTP | Mensaje | Causa |
|:---:|---|---|
| `400` | `No tiene una persona de recepción asignada` | Sin `reception_person_uuid` y sin persona de recepción |
| `400` | `No tiene una numeración activa para los eventos de recepción` | Solo si hay algo que enviar; no se crea nada |
| `403` | `RECEPTION_NOT_IN_PLAN` | Ver [Requisito de plan](#requisito-de-plan) |
| `404` | `La persona de recepción indicada (reception_person_uuid) no existe para esta empresa` | `reception_person_uuid` ajeno o eliminado (sin efectos) |
| `404` | `Ninguna de las recepciones indicadas existe para esta empresa.` | Ningún `document_id` es de la empresa |
| `422` | `Debe indicar las recepciones (document_ids).` | Falta `document_ids` |
| `422` | `Puede enviar como máximo 50 recepciones por solicitud.` | Demasiados elementos |
| `422` | `Cada document_id debe ser un número entero.` | Elemento no entero |
| `422` | `En bloque solo se admite el acuse de recibo (030).` | `code` distinto de `030` |
| `422` | `reception_person_uuid debe ser un UUID válido.` | UUID mal formado |

Los `422` siguen el formato `{"message": "...", "errors": {"campo": ["..."]}}`; los demás, `{"success": false, "message": "..."}`.

</details>

</details>

---

## 📧 4. Reenvío de Correo {#reenvio-correo}

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/send/mail/&#123;trackId&#125;</b> — Reenviar Correo de Evento</summary>

Reenvía el correo de notificación asociado a un evento ya procesado. El envío del correo se encola. Máximo **4 correos por evento**.

**Path Params:**

| Parámetro | Tipo | Descripción |
|-------|------|-------------|
| `trackId` | `int` | **ID numérico del evento** (el `id` de `events` en `GET /document-receptions/{documentId}` o el `event_id` de `send-bulk`). **No** es el CUFE/CUDE. |

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "{{url}}/events/send/mail/128" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
const eventId = 128;

const response = await axios.post(`${url}/events/send/mail/${eventId}`, {}, {
  headers: { Authorization: `Bearer ${token}` }
});
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$eventId = 128;

$response = $client->post("{$url}/events/send/mail/{$eventId}", [
    'headers' => ['Authorization' => "Bearer {$token}"],
]);
```

</TabItem>
</Tabs>

<details>
<summary>💻 Ver Respuesta Exitosa (200)</summary>

```json
{
    "message": "Correo enviado correctamente",
    "success": true
}
```

</details>

<details>
<summary>❌ Ver Respuestas de Error</summary>

| HTTP | Mensaje | Causa |
|:---:|---|---|
| `400` | `Se ha alcanzado el límite de envío de correos. No puede enviar más de 4 correos por evento.` | Ya se enviaron 4 correos de ese evento |
| `403` | `RECEPTION_NOT_IN_PLAN` | Ver [Requisito de plan](#requisito-de-plan) |
| `404` | `El evento no existe.` | El evento no existe o es de otra empresa (misma respuesta) |

</details>

</details>

---

## 🚫 5. Cancelación de Eventos Encolados {#cancelar-evento}

<details open>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/&#123;id&#125;/cancel</b> — Cancelar Evento en Estado PENDING</summary>

```http
POST {{url}}/events/{id}/cancel?client_uuid={{client_uuid}}
Authorization: Bearer {token}
Content-Type: application/json
```

**Descripción:** Permite cancelar un evento RADIAN mientras se encuentre en estado `PENDING`, antes de que el proceso automático de envío lo transmita a la DIAN.

:::info Reglas de Transición
* **Transición Exclusiva:** Únicamente permite transicionar de `PENDING` → `CANCELLED`.
* **Sin conflictos con el envío automático:** la cancelación y el envío automático nunca actúan a la vez sobre el mismo evento.
* **Estados no Cancelables:** Cualquier estado distinto de `PENDING` (`PROCESSING`, `ACCEPTED`, `REJECTED`, `CANCELLED`, `UNKNOWN`) se rechaza con HTTP 400.
* Los eventos encolados por [`/send-bulk`](#envio-en-bloque) pasan de inmediato a envío (`PROCESSING`) y no son cancelables.
* Un evento cancelado puede volver a enviarse con `POST /send/{trackId}` o `POST /send-bulk`.
* En [modo manual](#eventos-automaticos) los eventos `PENDING` no se envían automáticamente.
:::

**Parámetros:**

| Parámetro | Ubicación | Tipo | Requerido | Descripción |
|-----------|-----------|------|:---------:|-------------|
| `id` | Path | `integer` | ✅ Sí | ID numérico del evento (el `id` de `events` en `GET /document-receptions/{documentId}`; **no** el CUFE/trackId). |
| `client_uuid` | Query | `string` | No | UUID de la empresa cliente para operaciones multi-tenant (Casa de Software). |

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "{{url}}/events/128/cancel" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json"
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
const eventId = 128;

const response = await axios.post(`${url}/events/${eventId}/cancel`, {}, {
  headers: { 
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$eventId = 128;

$response = $client->post("{$url}/events/{$eventId}/cancel", [
    'headers' => [
        'Authorization' => "Bearer {$token}",
        'Content-Type'  => 'application/json',
    ],
]);
```

</TabItem>
</Tabs>

<details>
<summary>✅ Respuesta Exitosa (HTTP 200 OK)</summary>

`data` trae el evento con su nuevo estado (se muestran los campos principales).

```json
{
  "message": "Evento cancelado con éxito",
  "data": {
    "id": 128,
    "document_reception_id": 42,
    "type_event_id": 1,
    "document_status": "CANCELLED"
  },
  "success": true
}
```

</details>

<details>
<summary>❌ Evento en un estado distinto de PENDING (HTTP 400 Bad Request)</summary>

```json
{
  "success": false,
  "message": "Solo se pueden cancelar eventos en estado PENDING."
}
```

</details>

<details>
<summary>❌ Evento no encontrado o no pertenece a la empresa (HTTP 404 Not Found)</summary>

```json
{
  "success": false,
  "message": "El evento no existe."
}
```

</details>

<details>
<summary>❌ Plan sin módulo de recepción (HTTP 403 Forbidden)</summary>

```json
{
  "success": false,
  "message": "El plan FREE no incluye la recepción de facturas ni los eventos RADIAN. Actualice su plan para usarlos.",
  "error_code": "RECEPTION_NOT_IN_PLAN"
}
```

</details>

</details>

---

## 🗑️ 6. Eliminación de Recepción {#eliminar-recepcion}

<details>
<summary><span className="badge badge--danger margin-right--sm">DELETE</span> <b>/document-receptions/&#123;id&#125;</b> — Eliminar Recepción</summary>

**Path Params:**

| Parámetro | Tipo | Descripción |
|-------|------|-------------|
| `id` | `int` | ID de la recepción |

:::caution Restricción de Eliminación
No se puede eliminar una recepción si ya tiene eventos con estado `ACCEPTED` o `PROCESSING`. Al eliminarla se borran también sus demás eventos (pendientes, rechazados o cancelados).
:::

:::tip Recuperar una recepción eliminada
Si vuelves a importar ese CUFE con `POST /import-track-id`, la recepción se restaura y se reprocesa (`Documento encolado nuevamente para procesamiento.`). La importación por Excel **no** la restaura: la reporta en `skipped_details` con `reason_code` `USER_DELETED`.
:::

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X DELETE "{{url}}/events/document-receptions/42" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
const response = await axios.delete(`${url}/events/document-receptions/${documentId}`, {
  headers: { Authorization: `Bearer ${token}` }
});
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$response = $client->delete("{$url}/events/document-receptions/{$documentId}", [
    'headers' => ['Authorization' => "Bearer {$token}"],
]);
```

</TabItem>
</Tabs>

<details>
<summary>💻 Ver Respuesta Exitosa (200)</summary>

```json
{
    "message": "Recepción de documento eliminada exitosamente.",
    "success": true
}
```

</details>

<details>
<summary>❌ Ver Respuestas de Error</summary>

| HTTP | Mensaje | Causa |
|:---:|---|---|
| `400` | `No se puede eliminar una recepción con eventos válidos o en procesamiento.` | Tiene eventos `ACCEPTED` o `PROCESSING` |
| `403` | `RECEPTION_NOT_IN_PLAN` | Ver [Requisito de plan](#requisito-de-plan) |
| `404` | `Recepción de documento no encontrada.` | No existe o es de otra empresa |

</details>

</details>

---

## 📬 7. Buzón de Recepción {#buzon-recepcion}

:::info 🆕 Nuevo · Buzón de correo para recibir facturas
Cada empresa tiene **una** dirección de correo, con la forma `{identificador}@{dominio}`, a la que sus proveedores envían las facturas electrónicas. La API lee los adjuntos de cada correo, registra los documentos como recepciones (`document_origin` = `RECEIVED`) y, según el [modo de eventos](#eventos-automaticos), crea o no sus eventos.

* La dirección se asigna al registrar la **primera persona de recepción** ([`POST /reception-people`](#personas-recepcion)) y **no cambia**, aunque cambies la persona por defecto.
* La bandeja ([`GET /mailbox`](#buzon-recepcion)) muestra los **correos**, incluidos los que no generaron documento, con el motivo.
* El consumo del buzón usa un **cupo de recepción** aparte del de emisión ([`GET /mailbox/quota`](#buzon-recepcion)).
:::

### Cómo se procesa cada correo

* Se leen los **ZIP** y los **XML sueltos** del correo, hasta **10 documentos por correo**. Cada **ZIP** aporta un solo documento.
* 🆕 **Destinatarios:** el proveedor puede poner el buzón en **Para** o en **CC**, junto con la dirección del cliente. Si un mismo correo trae **varias direcciones de buzón** de la plataforma, solo se entrega a la **primera**; los demás buzones no lo reciben ni lo ven en su bandeja. El proveedor debe enviar **un correo por empresa**.
* 🆕 **Cupo solo para documentos nuevos:** consume cupo de recepción solo un documento cuyo CUFE la empresa **no tenía** registrado. Si el CUFE ya existe (llegó antes por el buzón, el proveedor lo reenvió o se importó por Excel o por CUFE), se reutiliza ese documento: **no consume cupo**, no queda `FAILED` por falta de cupo y solo se crean los eventos automáticos que aún no tenga, según el [modo de la empresa](#eventos-automaticos). Si el documento importado no tenía archivos, se le agregan los del correo (el XML y el ZIP, o el AttachedDocument si llegó suelto). El correo queda `PROCESSED` y vinculado a ese documento.
* Es **idempotente por CUFE**: un correo repetido o un reintento no duplica documentos, ni cobra cupo otra vez, ni duplica eventos.
* 🆕 **Numeración de eventos solo si hay eventos que crear:** el buzón exige una numeración activa de eventos de recepción solo para una **factura de venta a crédito** en **modo automático** (`send_events` = `true`) a la que le faltan eventos `030`, `032` o `033`. Las facturas de contado (o sin medio de pago), las notas crédito/débito y cualquier factura en modo manual quedan `PROCESSED` aunque la empresa no tenga numeración (ver la fila `FAILED` correspondiente abajo).
* Los correos se conservan **30 días** desde su llegada para poder reintentarlos.

**🆕 Adjuntos que se reconocen:**

* Nombres de adjunto codificados (RFC 2047 y RFC 2231). Un adjunto **sin nombre** o con la **extensión equivocada** se reconoce por su contenido: el ZIP por su firma y el XML por su contenido, con o sin BOM.
* El `.xml` adjunto directo, el ZIP con **subcarpetas** y un **ZIP dentro del ZIP** (un solo nivel de anidamiento). Dentro del ZIP se ignoran `__MACOSX`, los archivos ocultos y los PDF.
* De un **AttachedDocument** se extrae la factura o nota embebida, venga en CDATA o escapada.
* Un XML que no es factura, nota ni AttachedDocument (por ejemplo, un ApplicationResponse) **no cuenta** como documento.
* Un correo reenviado **como adjunto** (`.eml`) no se abre: el proveedor debe adjuntar el ZIP o el XML directamente.
* Por seguridad hay topes de tamaño y de número de entradas, también para el ZIP interno. Se descartan las rutas con `..` y los XML con DOCTYPE o entidades.

Motivos de descarte de un documento del correo:

| Motivo (`error_message`) |
|---|
| `Documento descartado: el XML declara DOCTYPE o entidades, que la DIAN no usa` |
| `Documento descartado: el XML adjunto no está bien formado` |
| `Documento descartado: el AttachedDocument adjunto no trae la factura o nota embebida` |
| `El .zip adjunto no contiene ningún XML` |
| `Tipo de documento 'X' aún no soportado por el buzón` (el buzón recibe facturas `01` y notas `91` y `92`) |

**🆕 Correos con varios documentos:**

* Cada documento se procesa con las mismas reglas (adquiriente, cupo, eventos) y uno inválido **no bloquea** a los demás.
* `document_reception` de la bandeja enlaza solo el **primer documento procesado**; los demás se consultan en [`GET /document-receptions`](#consultas).
* Si algún documento quedó **sin cupo** o **con error**, el correo queda `FAILED` aunque otros se hayan procesado. Su reintento no duplica ni vuelve a cobrar los ya creados.
* Los documentos que pasan del tope de **10** se **omiten**. Ningún reintento los recupera (el reintento vuelve a leer los mismos 10 primeros): hay que enviarlos en otro correo.
* Si todos los documentos se descartan, el correo queda `IGNORED`.
* `error_message` trae un resumen cuando algún documento quedó pendiente, se omitió o se descartó, también si el estado es `PROCESSED` (máximo 250 caracteres): `N de M documentos del correo procesados`, seguido, según el caso, de `; X pendiente(s) de reintento: motivo`, `; X omitido(s): el máximo es 10 documentos por correo` y `; X descartado(s): motivo`. Si todos se procesaron, es `null`.

**Estados del correo (`status`) y motivos (`error_message`):**

| `status` | Motivo | ¿Se puede reintentar? |
|---|---|---|
| `PROCESSED` | Generó su documento (`document_reception`) | No hace falta |
| `PENDING` | En cola o procesándose | No (ya está en proceso) |
| `IGNORED` | Correo descartado por **virus** | No |
| `IGNORED` | `El plan no incluye buzón de recepción` (plan FREE, o ni la empresa ni su Casa de Software tienen un plan de pago vencido o reemplazado: por ejemplo, nunca pagaron o su suscripción de pago fue **cancelada**) | No |
| `IGNORED` + `reason_code` `PLAN_EXPIRED` (**retenido**, `is_held` = `true`) | `Retenido: el plan de pago venció. Se procesará automáticamente al renovar el plan, si no han pasado más de 30 días desde su llegada`. No consume cupo. Ver [Correos retenidos](#correos-retenidos). | Sí: se procesa solo al renovar el plan, o con `POST /mailbox/{id}/retry` |
| `IGNORED` | `El correo no trae ningún adjunto .zip` (no trae ZIP ni XML de factura) | No |
| `IGNORED` | `Documento descartado: el adquiriente (NIT X) no es esta empresa (NIT Y)` o `Documento descartado: el XML no trae el NIT del adquiriente y no se puede verificar que sea para esta empresa`. Se avisa por correo a la cuenta principal o a la Casa de Software. 🆕 El NIT se compara solo por sus dígitos: se descarta el DV si viene tras un guion y se quitan puntos, espacios y ceros a la izquierda; también coincide si el NIT de la empresa está guardado con el DV pegado al final. Una diferencia de formato no descarta el documento. | No |
| `IGNORED` | Correo o ZIP demasiado grande (el motivo indica el límite) | No |
| `FAILED` | `Sin cupo disponible en el plan del buzón de recepción` (solo para un documento nuevo) | Sí, al ampliar el cupo |
| `FAILED` | 🆕 `No tiene una numeración activa para los eventos de recepción`: modo automático y factura a crédito sin numeración activa de eventos. El documento **sí** queda registrado (aparece en `document_reception`). | Sí, tras crear la numeración: el reintento encuentra el documento por CUFE, no lo duplica ni cobra cupo otra vez, y crea los eventos |
| `FAILED` | Error al procesar el documento | Sí |
| `FAILED` + `reason_code` `S3_OBJECT_MISSING` | El correo ya no está almacenado | No |

<span id="correos-retenidos"></span>

**🆕 Correos retenidos por plan vencido:**

* Un correo se retiene solo si la empresa o su Casa de Software **tuvo** un plan de pago que venció o que se reemplazó por un cambio de plan. Una suscripción de pago **cancelada** no cuenta: el correo queda `IGNORED` con `El plan no incluye buzón de recepción` y no se retiene.
* Mientras haya retenidos, la Casa de Software (o la cuenta principal, si la empresa no es sub-cuenta) recibe como máximo **un correo al día por empresa**: «Tienes N facturas retenidas en el buzón porque tu plan venció. Renueva para procesarlas.». La sub-cuenta nunca recibe ese aviso.
* Al activarse un plan de pago (compra, renovación, upgrade o asignación manual), los retenidos de los **últimos 30 días** se procesan solos y vuelven a validar el cupo: si no hay cupo, quedan `FAILED` con `Sin cupo disponible en el plan del buzón de recepción`.

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/mailbox</b> — Bandeja del Buzón</summary>

Lista los **correos** que llegaron al buzón de la empresa, del más reciente al más antiguo.

**Query Params:**

| Parámetro | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `status` | `string` | — | `PENDING`, `PROCESSED`, `FAILED` o `IGNORED` |
| `query` | `string` | — | Busca en el asunto y en el remitente (`%` y `_` se buscan como texto literal) |
| `startDate` | `string` | — | Fecha inicio (`YYYY-MM-DD`) de recepción del correo |
| `endDate` | `string` | — | Fecha fin (`YYYY-MM-DD`) de recepción; incluye todo el día |
| `archived` | `boolean` | `false` | `1` muestra solo los archivados; por defecto, solo los no archivados. Hoy ningún endpoint archiva correos, así que `archived=1` devuelve una lista vacía. |
| `limit` | `int` | 20 | Registros por página (máx. 50) |
| `client_uuid` | `string` | — | UUID del cliente (Multi-Tenant) |

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X GET "{{url}}/events/mailbox?status=FAILED&limit=20" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
const response = await axios.get(`${url}/events/mailbox`, {
  params: { status: 'FAILED', limit: 20 },
  headers: { Authorization: `Bearer ${token}` }
});
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$response = $client->get("{$url}/events/mailbox", [
    'headers' => ['Authorization' => "Bearer {$token}"],
    'query'   => ['status' => 'FAILED', 'limit' => 20],
]);
```

</TabItem>
</Tabs>

<details>
<summary>💻 Ver Respuesta Exitosa (200)</summary>

`dataRecords` es un paginador (`current_page`, `data`, `per_page`, `total`, etc.).

```json
{
    "dataRecords": {
        "current_page": 1,
        "data": [
            {
                "id": 3105,
                "from_email": "facturacion@proveedor-ejemplo.com",
                "subject": "Factura electrónica FE1001",
                "status": "PROCESSED",
                "received_at": "2026-08-15T14:18:00.000000Z",
                "has_attachments": true,
                "read_at": null,
                "archived_at": null,
                "starred": false,
                "error_message": null,
                "reason_code": null,
                "is_held": false,
                "can_retry": false,
                "document_reception": {
                    "id": 42,
                    "folio": "FE1001",
                    "total": "1190000.00",
                    "issue_date": "2026-08-15T00:00:00.000000Z"
                }
            },
            {
                "id": 3106,
                "from_email": "facturacion@proveedor-ejemplo.com",
                "subject": "Factura electrónica FE1002",
                "status": "FAILED",
                "received_at": "2026-08-16T10:02:00.000000Z",
                "has_attachments": true,
                "read_at": null,
                "archived_at": null,
                "starred": false,
                "error_message": "Sin cupo disponible en el plan del buzón de recepción",
                "reason_code": null,
                "is_held": false,
                "can_retry": true,
                "document_reception": null
            }
        ],
        "per_page": 20,
        "total": 2
    },
    "success": true
}
```

| Campo | Descripción |
|-------|-------------|
| `received_at` | Fecha de la cabecera del correo o, si falta, la del procesamiento. El listado se ordena por ella. |
| `read_at`, `archived_at`, `starred` | 🆕 De **solo lectura**: ningún endpoint del API marca un correo como leído, archivado o destacado |
| `error_message` | Motivo legible por el que el correo no generó documento, o el resumen de un correo con varios documentos (`null` si no aplica) |
| `reason_code` | `PLAN_EXPIRED` (retenido por plan vencido), `S3_OBJECT_MISSING` (el correo ya no está almacenado) o `null` |
| `is_held` | `true` si el correo está retenido por plan vencido |
| `can_retry` | `true` si `POST /mailbox/{id}/retry` lo aceptaría |
| `document_reception` | Documento generado (`id`, `folio`, `total`, `issue_date`) o `null`. Con varios documentos, el primero procesado. |

</details>

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/mailbox/address</b> — Dirección del Buzón</summary>

Devuelve la dirección a la que los proveedores deben enviar las facturas. Es de **solo lectura**.

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X GET "{{url}}/events/mailbox/address" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
const response = await axios.get(`${url}/events/mailbox/address`, {
  headers: { Authorization: `Bearer ${token}` }
});
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$response = $client->get("{$url}/events/mailbox/address", [
    'headers' => ['Authorization' => "Bearer {$token}"],
]);
```

</TabItem>
</Tabs>

<details>
<summary>💻 Ver Respuesta Exitosa (200)</summary>

El dominio del ejemplo es ilustrativo.

```json
{
    "dataRecord": {
        "address": "abc123xyz@buzon.ejemplo.com",
        "local_part": "abc123xyz",
        "domain": "buzon.ejemplo.com",
        "provisioned": true,
        "reception_person_uuid": "9b1d2c3e-4f50-4a6b-8c7d-0e1f2a3b4c5d",
        "message": null
    },
    "success": true
}
```

* El identificador es de la **empresa** (uno solo) y no cambia al cambiar la persona por defecto.
* Si la empresa eliminó su última persona de recepción, la dirección se conserva (sigue recibiendo correo) y `reception_person_uuid` es `null`.

Si la empresa **aún no tiene buzón**, la respuesta también es `200`:

```json
{
    "dataRecord": {
        "address": null,
        "local_part": null,
        "domain": "buzon.ejemplo.com",
        "provisioned": false,
        "reception_person_uuid": null,
        "message": "La empresa aún no tiene buzón de recepción: registre la persona de recepción en la configuración de eventos para obtener la dirección."
    },
    "success": true
}
```

</details>

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/mailbox/quota</b> — Cupo de Recepción</summary>

Consumo del **cupo de recepción** de la suscripción vigente (contador aparte del de emisión). Si la empresa es sub-cuenta, el cupo es la bolsa de su Casa de Software.

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X GET "{{url}}/events/mailbox/quota" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
const response = await axios.get(`${url}/events/mailbox/quota`, {
  headers: { Authorization: `Bearer ${token}` }
});
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$response = $client->get("{$url}/events/mailbox/quota", [
    'headers' => ['Authorization' => "Bearer {$token}"],
]);
```

</TabItem>
</Tabs>

<details>
<summary>💻 Ver Respuesta Exitosa (200)</summary>

```json
{
    "dataRecord": {
        "unlimited": false,
        "used": 850,
        "limit": 1000,
        "remaining": 150,
        "percent": 85,
        "exhausted": false,
        "level": "WARNING",
        "shared_pool": false,
        "period_start": "2026-01-01",
        "period_end": "2026-12-31",
        "message": "Ya usaste más del 80 % de tu cupo de recepción.",
        "upgrade_route": "/membership/subscription"
    },
    "success": true
}
```

| Campo | Descripción |
|-------|-------------|
| `unlimited` | `true` en planes ilimitados (`used`, `limit`, `remaining` y `percent` pueden venir en `null`) |
| `percent` | `used × 100 / limit`, con 2 decimales y sin tope (puede pasar de 100). `100` si `limit` es `0`; `null` si es ilimitado. |
| `exhausted` | `true` si `used` ≥ `limit` |
| `level` | `OK`, `WARNING` (más de 80 %), `CRITICAL` (más de 95 %), `EXHAUSTED` o `UNLIMITED` |
| `shared_pool` | `true` si es una sub-cuenta que consume la bolsa de su Casa de Software |
| `message` | Aviso según el nivel (`null` en `OK` y `UNLIMITED`) |
| `upgrade_route` | Ruta de la pantalla para ampliar o renovar el plan |

**Mensajes por nivel:**

| `level` | `message` |
|---|---|
| `WARNING` | `Ya usaste más del 80 % de tu cupo de recepción.` |
| `CRITICAL` | `Tu cupo de recepción está por agotarse: cuando se acabe, los correos nuevos quedarán sin procesar.` |
| `EXHAUSTED` | `Tu cupo de recepción se agotó: los correos nuevos quedarán sin procesar hasta que amplíes tu plan.` |

:::note Cupo compartido
Con `shared_pool` = `true`, cuando consulta la **propia sub-cuenta** (con o sin su `client_uuid`), `used`, `limit` y `remaining` vienen en `null`: solo ve el porcentaje y el nivel. La Casa de Software que consulta con `client_uuid` ve todas las cifras. Sin cupo, los correos nuevos quedan `FAILED` con `Sin cupo disponible en el plan del buzón de recepción`.
:::

</details>

</details>

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/mailbox/&#123;id&#125;</b> — Detalle de un Correo</summary>

**Path Params:**

| Parámetro | Tipo | Descripción |
|-------|------|-------------|
| `id` | `int` | ID del correo (campo `id` de `GET /mailbox`) |

Devuelve los mismos campos del listado más `to_email`, `message_id`, `body_preview`, `processed_at` y `files`. Para descargar un archivo usa [`GET /document-receptions/{documentId}/files/{fileManagerId}/download`](#consultas) con `document_reception.id` y `files[].id`.

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X GET "{{url}}/events/mailbox/3105" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
const response = await axios.get(`${url}/events/mailbox/${emailId}`, {
  headers: { Authorization: `Bearer ${token}` }
});
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$response = $client->get("{$url}/events/mailbox/{$emailId}", [
    'headers' => ['Authorization' => "Bearer {$token}"],
]);
```

</TabItem>
</Tabs>

<details>
<summary>💻 Ver Respuesta Exitosa (200)</summary>

```json
{
    "dataRecord": {
        "id": 3105,
        "from_email": "facturacion@proveedor-ejemplo.com",
        "subject": "Factura electrónica FE1001",
        "status": "PROCESSED",
        "received_at": "2026-08-15T14:18:00.000000Z",
        "has_attachments": true,
        "read_at": null,
        "archived_at": null,
        "starred": false,
        "error_message": null,
        "reason_code": null,
        "is_held": false,
        "can_retry": false,
        "document_reception": {
            "id": 42,
            "folio": "FE1001",
            "total": "1190000.00",
            "issue_date": "2026-08-15T00:00:00.000000Z"
        },
        "to_email": "abc123xyz@buzon.ejemplo.com",
        "message_id": "0100018f-ejemplo-mensaje",
        "body_preview": "Adjuntamos la factura electrónica FE1001.",
        "processed_at": "2026-08-15T14:20:00.000000Z",
        "files": [
            {
                "id": 9001,
                "type_document": "XML",
                "file_name": "document.xml",
                "mime_type": "application/xml",
                "file_size": 18432
            }
        ]
    },
    "success": true
}
```

`files[].type_document` puede ser `INBOUND_EMAIL_RAW`, `XML`, `ZIP` o `ATTACHED_DOC`. `files` está vacío si el correo no generó documento.

</details>

<details>
<summary>❌ Correo no encontrado (HTTP 404)</summary>

Si el correo no existe o es de otra empresa:

```json
{
    "success": false,
    "message": "Correo no encontrado en el buzón."
}
```

</details>

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/mailbox/&#123;id&#125;/retry</b> — Reintentar un Correo</summary>

Vuelve a poner en cola un correo `FAILED` o **retenido** (`IGNORED` con `reason_code` `PLAN_EXPIRED`). El reproceso revalida todo (plan, cupo, NIT del adquiriente) y el resultado se ve en la bandeja. El campo `can_retry` de `GET /mailbox` indica de antemano si se acepta.

**Path Params:**

| Parámetro | Tipo | Descripción |
|-------|------|-------------|
| `id` | `int` | ID del correo |

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "{{url}}/events/mailbox/3106/retry" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
const response = await axios.post(`${url}/events/mailbox/${emailId}/retry`, {}, {
  headers: { Authorization: `Bearer ${token}` }
});
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$response = $client->post("{$url}/events/mailbox/{$emailId}/retry", [
    'headers' => ['Authorization' => "Bearer {$token}"],
]);
```

</TabItem>
</Tabs>

<details>
<summary>💻 Ver Respuesta Exitosa (202)</summary>

```json
{
    "success": true,
    "message": "El correo se volvió a poner en cola para procesarlo.",
    "dataRecord": {
        "id": 3106,
        "status": "PENDING"
    }
}
```

</details>

<details>
<summary>❌ Ver Respuestas de Error</summary>

Cuerpo: `{"success": false, "message": "...", "error_code": "..."}` (el `404` no trae `error_code`).

| HTTP | `error_code` | Mensaje |
|:---:|---|---|
| `404` | — | `Correo no encontrado en el buzón.` (no existe, es de otra empresa o no correspondía a ningún buzón) |
| `409` | `MAILBOX_ALREADY_PROCESSED` | `El correo ya se procesó y generó su documento.` |
| `409` | `MAILBOX_RETRY_IN_PROGRESS` | `El correo ya se está procesando.` (está `PENDING`) o `El correo ya se está reprocesando.` (otro reintento lo tomó; no se encola otra vez) |
| `409` | `MAILBOX_RETRY_NO_LOCATION` | `Este correo llegó antes de que se guardara su ubicación: no se puede reintentar. Pida al proveedor que lo envíe de nuevo.` o `La ubicación guardada del correo ya no corresponde al buzón de entrada configurado: no se puede reintentar.` |
| `409` | `MAILBOX_RETRY_EXPIRED` | `El correo superó los 30 días de retención: ya no se puede reintentar. Pida al proveedor que lo envíe de nuevo.` o `El correo ya no está disponible en el almacenamiento: pida al proveedor que lo envíe de nuevo.` |
| `409` | `MAILBOX_RETRY_UNAVAILABLE` | `El reintento aún no está habilitado: el servidor no guarda la ubicación de los correos.` |
| `422` | `MAILBOX_RETRY_NOT_RETRYABLE` | `Los correos ignorados (virus, factura de otro NIT, sin XML o demasiado grandes) no se reintentan: pida al proveedor que lo envíe de nuevo.` |
| `403` | `RECEPTION_NOT_IN_PLAN` | Ver [Requisito de plan](#requisito-de-plan) |

</details>

</details>

---

## 👤 8. Personas de Recepción {#personas-recepcion}

:::info 🆕 Nuevo · Quién firma los eventos
Las **personas de recepción** son quienes firman (acusan, reciben, aceptan o reclaman) los eventos RADIAN de la empresa. Una empresa puede tener **varias**, con **una por defecto**: la que firma los eventos automáticos y la que se usa cuando no envías `reception_person_uuid`.

* La **primera** persona nace por defecto y recibe el [buzón de recepción](#buzon-recepcion).
* El [modo de eventos](#eventos-automaticos) (`send_events`) es de la **empresa**, no de una persona: se cambia con [`PUT /reception-people/mode`](#modo-eventos).
* Todos estos endpoints aceptan `client_uuid` para Casas de Software.
:::

:::warning El CRUD genérico ya no escribe personas de recepción
Las personas de recepción (`tbPrefix=T005`) son ahora de **solo lectura** por el CRUD genérico (`{{url}}/crud?tbPrefix=T005`): crear, editar o eliminar por esa vía responde `403` indicando que se gestionan con `/api/ubl2.1/events/reception-people`. La lectura excluye las personas eliminadas y, sin plan de pago vigente, cualquier operación (también la lectura) responde `403` con `error_code` `RECEPTION_NOT_IN_PLAN`. Si registrabas la persona de recepción por el CRUD, migra a los endpoints de esta sección.
:::

**Objeto `ReceptionPerson`:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `uuid` | `string` | Identificador de la persona (se usa en las rutas y en `reception_person_uuid`) |
| `identity_document_id` | `int` \| `null` | Tipo de documento de identidad |
| `identity_document` | `object` \| `null` | `id`, `code` y `name` del tipo de documento |
| `dni` | `string` | Número de identificación |
| `dv` | `string` \| `null` | Dígito de verificación |
| `first_name` | `string` | Nombres |
| `last_name` | `string` | Apellidos |
| `email` | `string` \| `null` | Correo de la persona |
| `job_title` | `string` \| `null` | Cargo |
| `department` | `string` \| `null` | Área o departamento |
| `is_default` | `boolean` | `true` si es la persona por defecto |
| `created_at` / `updated_at` | `string` | Fechas en ISO 8601 |

La dirección del buzón no se incluye: se consulta con [`GET /mailbox/address`](#buzon-recepcion).

**Estado de la empresa** (lo devuelven `GET /reception-people`, `DELETE`, `POST .../default` y `PUT /mode` en `dataRecord`):

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `send_events` | `boolean` | Modo de la empresa: `true` automático, `false` manual (`false` si no hay personas) |
| `default_person_uuid` | `string` \| `null` | `uuid` de la persona por defecto |
| `people` | `array` | Lista de `ReceptionPerson`, con la persona por defecto primero |

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/reception-people</b> — Listar Personas y Modo</summary>

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X GET "{{url}}/events/reception-people" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
const response = await axios.get(`${url}/events/reception-people`, {
  headers: { Authorization: `Bearer ${token}` }
});
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$response = $client->get("{$url}/events/reception-people", [
    'headers' => ['Authorization' => "Bearer {$token}"],
]);
```

</TabItem>
</Tabs>

<details>
<summary>💻 Ver Respuesta Exitosa (200)</summary>

`people` es una lista vacía si la empresa no tiene personas.

```json
{
    "dataRecord": {
        "send_events": false,
        "default_person_uuid": "9b1d2c3e-4f50-4a6b-8c7d-0e1f2a3b4c5d",
        "people": [
            {
                "uuid": "9b1d2c3e-4f50-4a6b-8c7d-0e1f2a3b4c5d",
                "identity_document_id": 1,
                "identity_document": {
                    "id": 1,
                    "code": "13",
                    "name": "Cédula de ciudadanía"
                },
                "dni": "1234567890",
                "dv": null,
                "first_name": "Ana",
                "last_name": "Pérez",
                "email": "recepcion@empresa-ejemplo.com",
                "job_title": "Analista de cuentas por pagar",
                "department": "Contabilidad",
                "is_default": true,
                "created_at": "2026-10-01T15:00:00+00:00",
                "updated_at": "2026-10-01T15:00:00+00:00"
            }
        ]
    },
    "success": true
}
```

</details>

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/reception-people</b> — Registrar Persona</summary>

**Body (JSON):**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `identity_document_id` | `integer` | **Sí** | Tipo de documento de identidad; debe existir en `GET {{url}}/identity-documents` |
| `dni` | `string` (máx. 20) | **Sí** | Número de identificación |
| `dv` | `string` (máx. 2) | No | Dígito de verificación |
| `first_name` | `string` (máx. 60) | **Sí** | Nombres |
| `last_name` | `string` (máx. 60) | **Sí** | Apellidos |
| `email` | `string` (email, máx. 100) | No | Correo de la persona |
| `job_title` | `string` (máx. 100) | No | Cargo |
| `department` | `string` (máx. 100) | No | Área o departamento |

:::caution Campos que no se envían
Estos campos responden `422` con el endpoint correcto en el mensaje: `is_default` (usa `POST /reception-people/{uuid}/default`), `send_events` (usa `PUT /reception-people/mode`), `email_reception` (la dirección del buzón la asigna el servidor) y `company_id` (la empresa sale del token o de `client_uuid`). `uuid` e `id` se ignoran.
:::

**Reglas:**

* La **primera** persona de la empresa nace por defecto (`is_default` = `true`) y recibe el buzón: la misma dirección si la empresa ya tuvo una, o una nueva.
* Una empresa nueva arranca en **modo manual** (`send_events` = `false`). Si la empresa ya había tenido personas y las eliminó, la nueva primera persona recupera el modo anterior.
* Las siguientes personas no son por defecto, no generan buzón y heredan el modo de la empresa.

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "{{url}}/events/reception-people" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "identity_document_id": 1,
    "dni": "1234567890",
    "first_name": "Ana",
    "last_name": "Pérez",
    "email": "recepcion@empresa-ejemplo.com",
    "job_title": "Analista de cuentas por pagar",
    "department": "Contabilidad"
  }'
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
const response = await axios.post(`${url}/events/reception-people`, {
  identity_document_id: 1,
  dni: '1234567890',
  first_name: 'Ana',
  last_name: 'Pérez',
  email: 'recepcion@empresa-ejemplo.com',
  job_title: 'Analista de cuentas por pagar',
  department: 'Contabilidad'
}, {
  headers: { Authorization: `Bearer ${token}` }
});
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$response = $client->post("{$url}/events/reception-people", [
    'headers' => ['Authorization' => "Bearer {$token}"],
    'json'    => [
        'identity_document_id' => 1,
        'dni'                  => '1234567890',
        'first_name'           => 'Ana',
        'last_name'            => 'Pérez',
        'email'                => 'recepcion@empresa-ejemplo.com',
        'job_title'            => 'Analista de cuentas por pagar',
        'department'           => 'Contabilidad',
    ],
]);
```

</TabItem>
</Tabs>

<details>
<summary>💻 Ver Respuesta Exitosa (201)</summary>

```json
{
    "message": "Persona de recepción registrada.",
    "dataRecord": {
        "uuid": "9b1d2c3e-4f50-4a6b-8c7d-0e1f2a3b4c5d",
        "identity_document_id": 1,
        "identity_document": {
            "id": 1,
            "code": "13",
            "name": "Cédula de ciudadanía"
        },
        "dni": "1234567890",
        "dv": null,
        "first_name": "Ana",
        "last_name": "Pérez",
        "email": "recepcion@empresa-ejemplo.com",
        "job_title": "Analista de cuentas por pagar",
        "department": "Contabilidad",
        "is_default": true,
        "created_at": "2026-10-01T15:00:00+00:00",
        "updated_at": "2026-10-01T15:00:00+00:00"
    },
    "success": true
}
```

</details>

<details>
<summary>❌ Ver Respuestas de Error</summary>

| HTTP | Mensaje | Causa |
|:---:|---|---|
| `403` | `RECEPTION_NOT_IN_PLAN` | Ver [Requisito de plan](#requisito-de-plan) |
| `422` | `El tipo de documento de identidad no existe.` | `identity_document_id` fuera del catálogo |
| `422` | `is_default no se envía: use POST /events/reception-people/{uuid}/default.` | Se envió `is_default` |
| `422` | `send_events es de la empresa: use PUT /events/reception-people/mode.` | Se envió `send_events` |
| `422` | `email_reception lo asigna el servidor: es la dirección del buzón de la empresa y no cambia.` | Se envió `email_reception` |
| `422` | `company_id no se envía: la empresa sale del token o de client_uuid.` | Se envió `company_id` |

Los `422` siguen el formato `{"message": "...", "errors": {"campo": ["..."]}}`.

</details>

</details>

<details>
<summary><span className="badge badge--warning margin-right--sm">PUT</span> <b>/reception-people/&#123;uuid&#125;</b> — Editar Persona</summary>

Edición **parcial**: cada campo es opcional, pero si se envía debe ser válido (mismas reglas y mismos campos prohibidos que el registro). No cambia la persona por defecto, el buzón ni el modo. Los eventos ya emitidos no cambian.

**Path Params:**

| Parámetro | Tipo | Descripción |
|-------|------|-------------|
| `uuid` | `string` (uuid) | `uuid` de la persona |

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X PUT "{{url}}/events/reception-people/9b1d2c3e-4f50-4a6b-8c7d-0e1f2a3b4c5d" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "job_title": "Jefe de cuentas por pagar"
  }'
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
const response = await axios.put(`${url}/events/reception-people/${personUuid}`, {
  job_title: 'Jefe de cuentas por pagar'
}, {
  headers: { Authorization: `Bearer ${token}` }
});
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$response = $client->put("{$url}/events/reception-people/{$personUuid}", [
    'headers' => ['Authorization' => "Bearer {$token}"],
    'json'    => ['job_title' => 'Jefe de cuentas por pagar'],
]);
```

</TabItem>
</Tabs>

<details>
<summary>💻 Ver Respuesta Exitosa (200)</summary>

`dataRecord` es el objeto `ReceptionPerson` actualizado.

```json
{
    "message": "Persona de recepción actualizada.",
    "dataRecord": {
        "uuid": "9b1d2c3e-4f50-4a6b-8c7d-0e1f2a3b4c5d",
        "identity_document_id": 1,
        "identity_document": {
            "id": 1,
            "code": "13",
            "name": "Cédula de ciudadanía"
        },
        "dni": "1234567890",
        "dv": null,
        "first_name": "Ana",
        "last_name": "Pérez",
        "email": "recepcion@empresa-ejemplo.com",
        "job_title": "Jefe de cuentas por pagar",
        "department": "Contabilidad",
        "is_default": true,
        "created_at": "2026-10-01T15:00:00+00:00",
        "updated_at": "2026-10-05T10:00:00+00:00"
    },
    "success": true
}
```

</details>

<details>
<summary>❌ Persona no encontrada (HTTP 404)</summary>

Si no existe, fue eliminada o es de otra empresa (misma respuesta):

```json
{
    "success": false,
    "message": "La persona de recepción no existe para esta empresa."
}
```

</details>

</details>

<details>
<summary><span className="badge badge--danger margin-right--sm">DELETE</span> <b>/reception-people/&#123;uuid&#125;</b> — Eliminar Persona</summary>

**Path Params:**

| Parámetro | Tipo | Descripción |
|-------|------|-------------|
| `uuid` | `string` (uuid) | `uuid` de la persona |

:::caution Reglas de eliminación
* No se puede eliminar la persona **por defecto** mientras haya otras registradas (`409`): primero marca otra como por defecto.
* La **última** persona sí se puede eliminar. La dirección del buzón se conserva y sigue recibiendo correo (en `GET /mailbox/address`, `reception_person_uuid` pasa a `null`). Sin persona, el buzón se comporta como modo manual y la importación por Excel/CUFE y el envío de eventos responden `400` `No tiene una persona de recepción asignada`.
* Al registrar la siguiente persona, la empresa recupera el mismo buzón y el modo anterior.
:::

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X DELETE "{{url}}/events/reception-people/9b1d2c3e-4f50-4a6b-8c7d-0e1f2a3b4c5d" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
const response = await axios.delete(`${url}/events/reception-people/${personUuid}`, {
  headers: { Authorization: `Bearer ${token}` }
});
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$response = $client->delete("{$url}/events/reception-people/{$personUuid}", [
    'headers' => ['Authorization' => "Bearer {$token}"],
]);
```

</TabItem>
</Tabs>

<details>
<summary>💻 Ver Respuesta Exitosa (200)</summary>

`dataRecord` es el estado resultante de la empresa.

```json
{
    "message": "Persona de recepción eliminada.",
    "dataRecord": {
        "send_events": false,
        "default_person_uuid": null,
        "people": []
    },
    "success": true
}
```

</details>

<details>
<summary>❌ Ver Respuestas de Error</summary>

| HTTP | Mensaje |
|:---:|---|
| `404` | `La persona de recepción no existe para esta empresa.` |
| `409` | `No se puede eliminar la persona de recepción por defecto mientras haya otras registradas. Marque otra como persona por defecto y vuelva a intentarlo.` |
| `403` | `RECEPTION_NOT_IN_PLAN` (ver [Requisito de plan](#requisito-de-plan)) |

</details>

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/reception-people/&#123;uuid&#125;/default</b> — Marcar Persona por Defecto</summary>

Marca la persona por defecto, sin body. El buzón (misma dirección) y el modo automático/manual se trasladan de la anterior y **no cambian**; si la empresa aún no tenía buzón, se le asigna uno a la nueva persona por defecto. Es **idempotente**: si ya es la persona por defecto, no cambia nada.

**Path Params:**

| Parámetro | Tipo | Descripción |
|-------|------|-------------|
| `uuid` | `string` (uuid) | `uuid` de la persona |

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X POST "{{url}}/events/reception-people/9b1d2c3e-4f50-4a6b-8c7d-0e1f2a3b4c5d/default" \
  -H "Authorization: Bearer {token}"
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
const response = await axios.post(`${url}/events/reception-people/${personUuid}/default`, {}, {
  headers: { Authorization: `Bearer ${token}` }
});
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$response = $client->post("{$url}/events/reception-people/{$personUuid}/default", [
    'headers' => ['Authorization' => "Bearer {$token}"],
]);
```

</TabItem>
</Tabs>

<details>
<summary>💻 Ver Respuesta Exitosa (200)</summary>

`dataRecord` es el estado resultante de la empresa (`people` con el mismo formato que en `GET /reception-people`).

```json
{
    "message": "Persona de recepción por defecto actualizada.",
    "dataRecord": {
        "send_events": true,
        "default_person_uuid": "9b1d2c3e-4f50-4a6b-8c7d-0e1f2a3b4c5d",
        "people": []
    },
    "success": true
}
```

</details>

<details>
<summary>❌ Persona no encontrada (HTTP 404)</summary>

```json
{
    "success": false,
    "message": "La persona de recepción no existe para esta empresa."
}
```

</details>

</details>

<details>
<summary><span className="badge badge--warning margin-right--sm">PUT</span> <b>/reception-people/mode</b> — Modo de Eventos (Automático / Manual)</summary>

<span id="modo-eventos"></span>

Cambia el [modo de eventos](#eventos-automaticos) de la **empresa** (se aplica a todas sus personas).

**Body (JSON):**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `send_events` | `boolean` | **Sí** | `true`: automático (se crean y envían `030`, `032` y `033` para facturas a crédito). `false`: manual (no se crea ningún evento automático, tampoco el `030`). |
| `client_uuid` | `string` | No | UUID de la empresa cliente (Casa de Software) |

:::warning El 033 automático
En modo automático, la aceptación expresa (`033`) se envía sin intervención del usuario y quita la posibilidad de reclamar la factura con el `031`. Actívalo a conciencia.
:::

<Tabs>
<TabItem value="curl" label="cURL">

```bash
curl -X PUT "{{url}}/events/reception-people/mode" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "send_events": false
  }'
```

</TabItem>
<TabItem value="js" label="JavaScript (Axios)">

```js
const response = await axios.put(`${url}/events/reception-people/mode`, {
  send_events: false
}, {
  headers: { Authorization: `Bearer ${token}` }
});
```

</TabItem>
<TabItem value="php" label="PHP (Guzzle)">

```php
$response = $client->put("{$url}/events/reception-people/mode", [
    'headers' => ['Authorization' => "Bearer {$token}"],
    'json'    => ['send_events' => false],
]);
```

</TabItem>
</Tabs>

<details>
<summary>💻 Ver Respuesta Exitosa (200)</summary>

`dataRecord` es el estado resultante de la empresa (`people` con el mismo formato que en `GET /reception-people`).

```json
{
    "message": "Modo de eventos actualizado.",
    "dataRecord": {
        "send_events": false,
        "default_person_uuid": "9b1d2c3e-4f50-4a6b-8c7d-0e1f2a3b4c5d",
        "people": []
    },
    "success": true
}
```

</details>

<details>
<summary>❌ Ver Respuestas de Error</summary>

| HTTP | Mensaje | Causa |
|:---:|---|---|
| `409` | `Registre primero una persona de recepción: el modo de los eventos se guarda con la persona por defecto.` | La empresa no tiene personas de recepción |
| `422` | `Indique send_events: true (eventos automáticos) o false (manuales).` | Falta `send_events` |
| `422` | `send_events debe ser true o false.` | Valor no booleano |
| `403` | `RECEPTION_NOT_IN_PLAN` | Ver [Requisito de plan](#requisito-de-plan) |

</details>

</details>
