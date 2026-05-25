---
slug: version-3-0-4-onboarding-ux-webhooks-json-restructure
title: "Versión 3.0.4 - Rediseño de Onboarding, Recuperación de Webhooks y Reestructuración de Ejemplos"
authors: [lewis]
tags: [release, v3-0-4, onboarding, webhooks, json-examples, sidebars, premium-ux]
date: 2026-05-25
---

# 🚀 API UBL 2.1 v3.0.4 - Rediseño de Onboarding y DX

Se publica la **versión 3.0.4** de la documentación de la API de Facturación Electrónica. Esta entrega es una actualización de gran envergadura centrada completamente en la **Experiencia del Desarrollador (DX/UX)**, facilitando la integración técnica desde el primer minuto.

<!--truncate-->

---

## 🌟 Qué hay de nuevo en la v3.0.4

### 1. Flujo de Onboarding Lineal (`intro.md`)

Rediseñamos por completo el documento de **Introducción** para erradicar la sobrecarga de información y guiar al desarrollador de forma lineal en su proceso de integración:
* **Secuencia de Integración Clara:** Se reestructuró el contenido en pasos numerados del 1 al 4 (Registro ➔ Credenciales/Tokens ➔ Uso de Tokens ➔ Revocación) eliminando temas avanzados del tope.
* **Encapsulación de Payloads JSON:** Los extensos requests y responses de prueba (que ocupaban más de 400 líneas) fueron agrupados en acordeones interactivos `<details>`, reduciendo la longitud visual del archivo en un 70%.
* **Eliminación de Redundancia:** Se removió la tabla de contenidos manual (Docusaurus la autogenera) y se eliminaron las duplicaciones de códigos en lenguajes (Tabs) y características obsoletas.

---

### 2. Recuperación del Módulo de Webhooks

* **Restauración Técnica:** Identificamos que durante la modularización del monolito anterior, la especificación de la API de Webhooks y la verificación de firmas HMAC-SHA256 había sido omitida accidentalmente.
* **Nueva Guía Activa:** Reconstruimos y publicamos el documento `docs/endpoints/10-webhooks.md`, que documenta los 26 eventos disponibles, cabeceras HMAC, backoff exponencial y ejemplos de verificación en Node.js y PHP.

---

### 3. Reestructuración de Ejemplos JSON en el Sidebar

* **Menú Colapsable Limpio:** Para evitar la fatiga visual de una lista plana de 50 archivos simultáneamente en la barra de navegación lateral, agrupamos los ejemplos dentro de 4 subcategorías colapsables y cerradas por defecto en `sidebars.ts`:
  * **Facturación** (posición 1)
  * **POS** (posición 2)
  * **Documento Soporte** (posición 3)
  * **Nómina** (posición 4)
* **Página Índice Unificada:** Ahora, la URL base `/docs/jsons-billing` funciona como un hermoso panel índice centralizado que expone dinámicamente el acceso a las cuatro categorías lógicas.

---

### 4. Factura de Exportación Avanzada (USD)

* **Guía Completa de Incoterms y Logística:** Documentamos el payload avanzado de exportación en `docs/jsons-billing/invoice-exportation.md` agregando parámetros reales para Incoterms (`delivery_terms`), transportistas de carga (`deliveries`), documentos de despacho y remisiones.
* **Eliminación de `base_rate`:** Limpiamos el objeto de tasa de cambio (`payment_exchange_rate`) removiendo el campo obsoleto `base_rate` y consolidando el TRM oficial únicamente en `exchange_rate` según el estándar de la versión 3.x.

---

## 📈 Historial de Cambios de la Versión

* **`package.json`**: Actualizado a versión estable `"3.0.4"`.
* **`docs/intro.md`**: Actualizado pie de página a versión de API `v3.0.4` (Mayo 2026).
* **`docs/response-json.md`**: Se resolvieron todas las anclas y enlaces rotos.
* **`sidebars.ts`**: Reestructuración del índice de Ejemplos JSON.
