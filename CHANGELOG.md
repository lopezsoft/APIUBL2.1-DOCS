# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y este proyecto se adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.6] - 2026-05-26

### Añadido
* **Posicionamiento en `extra_data` de líneas:** Añadida la documentación técnica del parámetro `position` (`docs/billing-fields.md`) para controlar la ubicación exacta de las columnas de datos adicionales (`extra_data`) en la representación gráfica del PDF. Incluye tabla explicativa de posiciones base (1 a 7), reglas de resolución de conflictos, y el ejemplo JSON de integración de ítem actualizado.

---

## [3.0.5] - 2026-05-25

### Solucionado
* **Sincronización de Adjuntos (S3):** Corregido el esquema técnico y de validación para el nodo de archivos adjuntos `attachments` en `docs/billing-fields.md` y `docs/jsons-billing/invoice.md`. Se actualizaron los parámetros a la nomenclatura de validación real (`filename`, `content`, `content_type`), y se documentó la cuota máxima de 4 archivos con almacenamiento en Amazon S3.

---

## [3.0.4] - 2026-05-25

### Añadido
* **Módulo de Webhooks Recuperado:** Restaurada la documentación técnica de Webhooks (`docs/endpoints/10-webhooks.md`) omitida accidentalmente en modularizaciones previas. Incluye los 26 eventos, cabeceras HMAC y reintentos automáticos.
* **Factura de Exportación Avanzada:** Creada la guía y ejemplo en `docs/jsons-billing/invoice-exportation.md` con campos avanzados para términos de entrega Incoterms (`delivery_terms`), transportistas (`deliveries`) y referencias de remisión.
* **Nueva entrada en el Blog:** Creado artículo para el lanzamiento oficial de la v3.0.4.

### Modificado
* **Rediseño Onboarding (`docs/intro.md`):** Reestructurado el flujo lógico inicial de integración a un esquema de pasos del 1 al 4, encapsulando payloads JSON y diagramas ASCII extensos en acordeones `<details>`.
* **Reestructuración del Sidebar de Ejemplos JSON (`sidebars.ts`):** Agrupados los ejemplos de forma ordenada en 4 subcategorías colapsables y cerradas por defecto (**Facturación**, **POS**, **Documento Soporte**, **Nómina**) evitando la saturación del sidebar.
* **Página Índice Centralizada:** Vinculada la URL `/docs/jsons-billing` como panel central de acceso a las cuatro subcategorías lógicas.
* **Eliminación de `base_rate`:** Removido el campo obsoleto de tasa de cambio `base_rate` en `invoice-exportation.md` para cumplir los lineamientos 3.x.

### Solucionado
* **Saneamiento de Enlaces y Anclas Rotas:** Corregidos todos los identificadores de rutas rotas tras la modularización de endpoints (en `intro.md`, casos de uso e históricos del blog).
* **Warnings de Docusaurus:** Eliminadas todas las alertas de rutas duplicadas o enlaces rotos del compilador.

---

## [3.0.3] - 2026-03-12

### Añadido
* **Campo `extra_data` en `customer`:** Añadido soporte del array de pares clave-valor de datos adicionales a nivel del cliente que se renderizan en el PDF sin transmitirse a la DIAN.
* **Actualización del Ejemplo:** Añadido `extra_data` en `customer` dentro de la guía `invoice-extra-data`.

---

## [3.0.2] - 2026-03-03

### Añadido
* **Impuesto a Licores Ad Valorem:** Incluido el soporte y ejemplo JSON para tributación específica de licores con porcentajes Ad Valorem.

---

## [3.0.1] - 2026-02-14

### Añadido
* **Módulo de Endpoints de Membresías:** Agregada la documentación modular detallada para consumos, límites y cuotas.

---

## [3.0.0] - 2026-02-06

### Añadido
* **Membresías y Límites de Consumo:** Sistema de restricción y métricas de cuotas.
* **Personal Access Tokens (PAT):** Introducida la creación self-service de tokens de acceso de larga duración configurable.
* **Sistema de Webhooks:** Integración de notificaciones HTTP en tiempo real con firmas HMAC.

---

## [1.4.2] - 2025-10-17

### Solucionado
* **Parser JSON:** Corrección de fallos en el tratamiento de cadenas de texto y parseo de caracteres especiales.

---

## [1.4.1] - 2025-10-17

### Añadido
* **Casos Especiales de Mandatos:** Guías detalladas para facturación por cuenta de terceros (mandatos).

---

## [1.4.0] - 2025-10-17

### Añadido
* **Marco Regulatorio DIAN:** Anexos técnicos oficiales para Factura Electrónica v1.9, Nómina Electrónica v3.0, RADIAN v2.0 y Documento Soporte v1.1.

---

## [1.1.8] - 2025-05-08

### Añadido
* Lanzamiento inicial de la plataforma de documentación integrada con Docusaurus y asistente de IA.
