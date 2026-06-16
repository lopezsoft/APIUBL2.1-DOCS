---
sidebar_position: 6
sidebar_label: Búsqueda y Estados
---

# 🔍 Búsqueda y Estados de Documentos

> ✅ **Autenticación REQUERIDA**
> Incluir en todos: `Authorization: Bearer {token}`

Esta sección documenta los endpoints para la búsqueda masiva e individual de los documentos electrónicos emitidos.

> 🟢 GET para búsquedas y consultas
> 🟘 POST para descargar archivos adjuntos / correos

## Búsqueda y Listado

### Buscar Documentos - 🟢 GET
```http
GET {{url}}/documents?order_number=251956&query=&limit=1&resolution=&number=&prefix=
```
Busca documentos utilizando múltiples filtros (opcionales):
- `order_number`, `number`, `prefix`, `resolution`
- `query` (búsqueda de texto)
- `limit`
- `start_date`, `end_date`
- `document_key` (CUFE/CUDE)
- `document_type`
- `document_status` (-1, 0, 1)

### Último Documento Generado - 🟢 GET
```http
GET {{url}}/documents/last?resolution=18764074347312&prefix=LZT
```
Trae el último documento válido emitido para una resolución específica.

### Consumo de Documentos - 🟢 GET
```http
GET {{url}}/documents/consume?p_year=2024&p_type=4&p_dni=901091403
```
Devuelve el reporte de documentos consumidos (usados). `p_type` define la agrupación (por mes, año, cliente, desarrollador, etc.).

---

## Descargas de Archivos

Para descargar los adjuntos y representaciones gráficas del documento usando el **CUFE/CUDE** (`trackId`).

### Descargar PDF - 🟢 GET
```http
GET {{url}}/documents/pdf/{trackId}?regenerate=0
```
Parámetro `regenerate=1` fuerza a reescribir el PDF.

### Descargar XML - 🟢 GET
```http
GET {{url}}/documents/xml/{trackId}
```

### Descargar Adjunto (Attached Document) - 🟘 POST
```http
POST {{url}}/documents/attached/{trackId}
```
Descarga el `.zip` con el ApplicationResponse completo.

---

## Consulta de Estados (Status)

### Estado en modo de pruebas (ZIP) - 🟢 GET
```http
GET {{url}}/status/zip/{trackId}
```

### Estado en Producción - 🟢 GET
```http
GET {{url}}/status/document/{trackId}
```
Verifica el estado del documento directamente con la DIAN en producción.

### Estado Interno de la API - 🟢 GET
```http
GET {{url}}/status?order_number=251956&resolution=&number=LZT836&prefix=
```
Obtiene información del documento registrado en el API, validación y detalles del Código QR.

---

## Utilidades de Correo y Adquirentes

### Envío y Reenvío de Correos
```http
POST {{url}}/documents/sendmail/to
POST {{url}}/documents/sendmail/{trackId}
```
Permite enviar por primera vez (con base64 adjuntos) o reenviar un documento ya emitido por CUFE/CUDE al adquirente u otros destinatarios.

### Consulta de Adquirente - 🟢 GET
```http
GET {{url}}/acquirer?identificationType=13&identificationNumber=1063279303
```
Retorna información asociada (como correos) de un Adquirente registrado previamente en las facturas.

### Intercambio de Correos - 🟢 GET
```http
GET {{url}}/exchange-emails
```
Obtiene la lista de correos registrados para recepción en la plataforma.

---

## Configuraciones

### Rango de Numeración - 🟢 GET
```http
GET {{url}}/numbering-range
```
Obtiene las resoluciones y rangos de numeración activos de facturación.
