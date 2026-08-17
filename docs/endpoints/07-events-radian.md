---
sidebar_position: 7
sidebar_label: ⚡ Eventos RADIAN
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 🔄 API de Eventos de Documentos (RADIAN)

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

---

## 📥 1. Importación y Encolamiento

<details open>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/import-excel</b> — Importar desde Excel</summary>

**Content-Type:** `application/json`

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `document_base64` | `string` | **Sí** | Archivo Excel (`.xlsx`/`.xls`) codificado en base64 |

> [!WARNING]
> El envío de archivos binarios (`multipart/form-data`) ya no es soportado. El archivo debe enviarse estrictamente como string en base64.

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

**Body:**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `trackId` | `string` | **Sí** | CUFE o CUDE del documento a importar |

:::tip Ruta alternativa
También puedes enviar el `trackId` directamente en la URL: `POST /{trackId}/import` (misma funcionalidad).
:::

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

<details>
<summary><span className="badge badge--info margin-right--sm">GET</span> <b>/document-receptions</b> — Listar Recepciones</summary>

**Query Params:**

| Parámetro | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `query` | `string` | — | Buscar por nombre o NIT del emisor |
| `startDate` | `string` | — | Fecha inicio |
| `endDate` | `string` | — | Fecha fin |
| `trackId` | `string` | — | Buscar por CUFE/CUDE exacto |
| `limit` | `int` | 20 | Registros por página (máx. 50) |
| `client_uuid` | `string` | — | UUID del cliente asociado a una cuenta principal (opcional). Permite realizar procesos en nombre de cada cliente usando el token de la cuenta principal/casa de software. |

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
| `trackId` | `string` | Track ID (CUFE/CUDE) del evento |

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

## 📤 3. Acciones de Eventos (DIAN)

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/send/&#123;trackId&#125;</b> — Enviar Evento a la DIAN</summary>

**Path Params:**

| Parámetro | Tipo | Descripción |
|-------|------|-------------|
| `trackId` | `string` | Track ID del documento |

<details>
<summary>💻 Ver Respuesta Exitosa (200)</summary>

```json
{
    "success": true
}
```
</details>

</details>

<details>
<summary><span className="badge badge--success margin-right--sm">POST</span> <b>/send/mail/&#123;trackId&#125;</b> — Reenviar Correo de Evento</summary>

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

## 🗑️ 4. Eliminación

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
