---
sidebar_position: 8
sidebar_label: Autoincremento
---

# 🚀 API de Autoincremento

> ✅ **Autenticación REQUERIDA**
> Incluir en todos: `Authorization: Bearer {token}`

Esta sección expone una nueva API de autoincremento para emitir documentos delegando a la plataforma el manejo consecutivo (conteo autoincremental de la resolución de facturación) y prefijo de los números de documento, evitando posibles colisiones en envíos concurrentes.

**Formato General:**
El body de estos endpoints es el mismo que el de la API de emisión estándar (por ejemplo: `POST /invoice`), con la diferencia de que el prefijo y número se resuelven automáticamente en base a la numeración configurada en la DIAN.

### Factura Autoincremental - 🟘 POST
```http
POST {{url}}/auto-increment/invoices
```
Emite una factura tomando automáticamente el siguiente número consecutivo disponible.

### Reenvío de Documento Autoincremental - 🟘 PATCH
```http
PATCH {{url}}/auto-increment/invoices/{uuid}
```
Reintenta el proceso de emisión para un documento que haya fallado o requerido ajuste, utilizando su UUID interno.

### Notas de Crédito y Débito Autoincrementales - 🟘 POST
```http
POST {{url}}/auto-increment/credit-notes
POST {{url}}/auto-increment/debit-notes
```

### Documento Soporte Autoincremental - 🟘 POST
```http
POST {{url}}/auto-increment/support-documents
```
Cubre tanto residentes como no residentes (se define en el payload).

### Documento POS (y Notas POS) Autoincremental - 🟘 POST
```http
POST {{url}}/auto-increment/pos-documents
POST {{url}}/auto-increment/debit-notes
POST {{url}}/auto-increment/credit-notes
```
(Para Notas POS se usa la misma ruta general, enviando el `type_document_id` adecuado en el JSON).

### Nota de Ajuste a Documento Soporte Autoincremental - 🟘 POST
```http
POST {{url}}/auto-increment/adjustment-notes
```

### Reenviar Documentos en Lote - 🟘 POST
```http
POST {{url}}/documents/{uuid}/resend
```
Reenvía un documento específico procesado en modo asíncrono o que falló temporalmente.
