---
sidebar_position: 7
sidebar_label: Eventos RADIAN
---

# API de Eventos de Documentos

**Base URL:** `/api/ubl2.1/events`
**Autenticación:** Bearer Token en todos los endpoints.

---

## 1. Importar desde Excel

`POST /import-excel`

**Content-Type:** `application/json`

**Body:**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `document_base64` | string | Sí | Archivo Excel (.xlsx/.xls) codificado en base64 |

> ⚠️ El envío de archivos binarios (`multipart/form-data`) ya no es soportado. El archivo debe enviarse como string base64.

**Respuesta exitosa (200):**

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

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `total_rows` | int | Total de filas leídas del Excel |
| `queued` | int | Documentos encolados para procesamiento |
| `skipped` | int | Documentos omitidos (duplicados, filtros) |
| `errors` | array | Detalle de errores por fila |

---

## 2. Importar por Track ID

`POST /import-track-id`

**Body:**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `trackId` | string | Sí | CUFE o CUDE del documento |

**Respuesta exitosa (200):**

```json
{
    "message": "Documento encolado para procesamiento.",
    "id": 42,
    "success": true
}
```

**Ruta alternativa:** `POST /{trackId}/import` — Misma funcionalidad, el trackId va en la URL.

---

## 3. Listar Recepciones

`GET /document-receptions`

**Query Params:**

| Param | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `query` | string | — | Buscar por nombre o NIT del emisor |
| `startDate` | string | — | Fecha inicio |
| `endDate` | string | — | Fecha fin |
| `trackId` | string | — | Buscar por CUFE/CUDE exacto |
| `limit` | int | 20 | Registros por página (máx. 50) |

**Respuesta exitosa (200):**

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

---

## 4. Detalle de Recepción con Eventos

`GET /document-receptions/{documentId}`

**Path Params:**

| Param | Tipo | Descripción |
|-------|------|-------------|
| `documentId` | int | ID de la recepción |

**Respuesta exitosa (200):**

```json
{
    "dataRecords": {
        "data": [ ... ]
    },
    "success": true
}
```

---

## 5. Consultar Estado de Evento

`GET /status/{trackId}`

**Path Params:**

| Param | Tipo | Descripción |
|-------|------|-------------|
| `trackId` | string | Track ID del evento |

**Respuesta exitosa (200):**

```json
{
    "message": "Consulta generada con éxito",
    "ResponseDian": { ... },
    "success": true
}
```

---

## 6. Enviar Evento a la DIAN

`POST /send/{trackId}`

**Path Params:**

| Param | Tipo | Descripción |
|-------|------|-------------|
| `trackId` | string | Track ID del documento |

**Respuesta exitosa (200):**

```json
{
    "success": true
}
```

---

## 7. Reenviar Correo de Evento

`POST /send/mail/{trackId}`

**Path Params:**

| Param | Tipo | Descripción |
|-------|------|-------------|
| `trackId` | string | Track ID del evento |

**Respuesta exitosa (200):**

```json
{
    "success": true
}
```

---

## 8. Eliminar Recepción

`DELETE /document-receptions/{id}`

**Path Params:**

| Param | Tipo | Descripción |
|-------|------|-------------|
| `id` | int | ID de la recepción |

**Respuesta exitosa (200):**

```json
{
    "message": "Recepción de documento eliminada exitosamente.",
    "success": true
}
```

> No se puede eliminar si tiene eventos con estado `ACCEPTED` o `PROCESSING`.
