---
sidebar_position: 7
sidebar_label: Eventos RADIAN
---

# 🔄 Eventos DIAN y RADIAN

> ✅ **Autenticación REQUERIDA**
> Incluir en todos: `Authorization: Bearer {token}`

Estos endpoints permiten gestionar el ciclo completo de acuses y eventos sobre las facturas electrónicas a crédito (RADIAN).

## 1. Importación y Sincronización

Estos endpoints son utilizados para importar los documentos desde la DIAN hacia la API y poder generar los eventos de acuse.

### Importar por Excel - 🟘 POST
```http
POST {{url}}/events/import-excel
```
Importa el listado descargado desde el portal de facturación de la DIAN (formato Excel, máximo 100 registros). 
**Campos requeridos:** Tipo de documento, trackId, Folio, Prefijo, Fecha Emisión, Fecha Recepción, NIT Emisor, Nombre Emisor, NIT Receptor, Nombre Receptor, IVA, ICA, IPC, Total, Estado, Grupo.

### Importar por trackId (CUDE) - 🟘 POST
```http
POST {{url}}/events/import-track-id
```

### Importar Directo desde evento (trackId en URL) - 🟘 POST
```http
POST {{url}}/events/{trackId}/import
```

---

## 2. Generación de Acuses (Eventos)

### Enviar Evento (Acuse) - 🟘 POST
```http
POST {{url}}/events/send/{trackId}
```
**Body (JSON):**
```json
{
  "code": "Código del evento",
  "notes": "Notas justificativas"
}
```

**Códigos de Eventos Comunes:**
- `030`: Acuso recibido de factura.
- `031`: Reclamo de factura.
- `032`: Recibo del bien y/o prestación del servicio.
- `033`: Aceptación expresa.

---

## 3. Consultas

### Mostrar Recepciones de Documentos (Eventos Generados) - 🟢 GET
```http
GET {{url}}/events/document-receptions?startDate=&endDate=&trackId=&query&limit=20
```
Muestra el histórico y listado de los eventos enviados. Filtros por fechas y trackId.

### Estado del Evento en DIAN - 🟢 GET
```http
GET {{url}}/events/status/{trackId}
```
Obtiene el documento en la DIAN y el detalle de sus eventos generados, verificando la validez del acuse.
