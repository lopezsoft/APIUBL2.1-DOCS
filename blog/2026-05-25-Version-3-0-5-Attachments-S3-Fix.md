---
slug: version-3-0-5-attachments-s3-fix
title: "Versión 3.0.5 - Corrección en Parámetros de Adjuntos (S3) y Nomenclatura"
authors: [lewis]
tags: [release, v3-0-5, attachments, s3, bugfix, api-validation]
date: 2026-05-25
---

# 📎 API UBL 2.1 v3.0.5 - Corrección en Estructura de Archivos Adjuntos

Publicamos de forma inmediata la **versión 3.0.5** de la documentación de la API. Esta actualización de parche corrige una inconsistencia crítica en la nomenclatura de los campos del nodo de archivos adjuntos (`attachments`), previniendo errores de validación (`422 Unprocessable Entity`) durante las pruebas de integración de nuestros desarrolladores.

<!--truncate-->

---

## 🔧 Qué se ha corregido en la v3.0.5

Durante las auditorías de integración de la API v3.x, identificamos que la documentación previa exponía de forma errónea nombres de campos que diferían con las reglas reales de validación del backend de PHP y el almacenamiento seguro de Amazon S3. 

Hemos aplicado las siguientes correcciones de inmediato:

### 1. Nomenclatura del Objeto `attachments`

Se corrigieron los nombres de los atributos internos a su forma correcta y homologada:
*   **`filename`** (anteriormente documentado como `name`): Representa el nombre del archivo con su extensión.
*   **`content`**: El contenido binario del archivo codificado en un string Base64.
*   **`content_type`** (anteriormente documentado como `mime`): El tipo MIME/Content-Type del archivo (ej. `application/pdf`).

### 2. Reglas de Validación y Cuotas de S3

Añadimos de forma explícita el conjunto de reglas de validación que aplica el API a nivel de backend:
*   **Capacidad Máxima:** Hasta **4 archivos adjuntos opcionales** por documento electrónico.
*   **Persistencia:** Almacenamiento directo y seguro en buckets de **Amazon S3** administrados.
*   **Reglas de validación exactas:**
    ```php
    'attachments'                => 'nullable|array|max:4',
    'attachments.*.filename'     => 'required_with:attachments|string|max:255',
    'attachments.*.content'      => 'required_with:attachments|string',
    'attachments.*.content_type' => 'nullable|string|max:100',
    ```

---

## 📝 Ejemplo JSON Homologado (`invoice.json`)

Para evitar cualquier error en tus llamadas API, el ejemplo principal ha sido actualizado al nuevo esquema:

```json
{
  "resolution_number": "18764074347312",
  "prefix": "LZT",
  "document_number": "2002",
  "graphic_representation": 0,
  "send_email": 1,
  "operation_type_id": 1,
  "type_document_id": 7,
  "attachments": [
    {
      "filename": "Factura.pdf",
      "content": "JVBERi0xLjQKJeLjz9MKMyAwIG9iago...",
      "content_type": "application/pdf"
    }
  ]
}
```

---

## 📈 Resumen de Cambios

*   **`package.json`**: Incremento a versión estable `"3.0.5"`.
*   **`docusaurus.config.ts`**: Actualizado copyright a `"v3.0.5 🚀"`.
*   **`docs/intro.md`**: Actualizado pie de página a versión `"v3.0.5"`.
*   **`docs/billing-fields.md`**: Corrección de campos de attachments e incorporación de reglas PHP.
*   **`docs/jsons-billing/invoice.md`**: Sincronización del ejemplo de adjuntos en la factura estándar.
