---
slug: version-3-2-0-bulk-endpoints-ux-sandbox-ui
title: 📦 v3.2.0 - API Bulk, Mejoras UX y Frontend Sandbox
authors: [matias]
tags: [novedades, bulk, ux, sandbox]
---

¡Damos la bienvenida a la versión **3.2.0** de la documentación de **MATIAS API**! En esta actualización de impacto mayor, introducimos las directrices para el procesamiento asíncrono de alto volumen y grandes optimizaciones en la experiencia de integración de nuestros desarrolladores.

<!--truncate-->

### 📦 Lanzamiento del Endpoint de Envío Masivo (Bulk)

Hemos publicado la documentación oficial de nuestra infraestructura de **Envío Masivo**. Diseñada específicamente para empresas que requieren procesar miles de documentos por minuto sin bloqueos sincrónicos.

*   **Endpoint Unificado:** Un solo request `POST /bulk/documents` capaz de absorber e iterar facturas, notas crédito, documentos soporte y documentos equivalentes POS.
*   **Idempotencia Asegurada:** Envía con tranquilidad integrando el header `Idempotency-Key` (evitando doble facturación por fallos de red).
*   **Control Granular:** Descubre los endpoints para auditar el estado asíncrono tanto a nivel macro (Lote) como a nivel micro (Documento individual).
*   **Advertencia de Fase BETA:** Hemos sido muy transparentes delineando nuestra política de purga temporal agresiva de 2 días. [Ver Documentación Completa](/docs/bulk-documents).

### 🖥️ Frontend Web para el Sandbox

A raíz del éxito de nuestro entorno seguro de simulación API, damos el siguiente paso oficializando el acceso al portal de administración visual del Sandbox.

Ya no solo interactúas vía cURL o Postman. Ahora cuentas con acceso directo al dashboard simulado para gestionar facturas en tiempo real usando tus mismas credenciales de producción:
👉 **[Acceder al Frontend Sandbox](https://sandbox-auth.matias-api.com/)**

### ✨ Reestructuración UX en Documentación (Campos Payload)

Escuchamos su feedback: los muros de texto interminables complican la integración.
Hemos rediseñado y refactorizado de principio a fin nuestra sección más técnica: la [Referencia de Campos del Payload](/docs/billing-fields).

*   **Acordeones Interactivos:** Ahora la documentación agrupa lógicamente todas las secciones (Pagos, Líneas, Salud, POS, etc.) en bloques colapsables limpios.
*   **Tablas de Lectura Rápida:** Transición de listas planas a tablas semánticas para identificar instantáneamente si un campo es Obligatorio, Opcional, su Tipo de Dato y los defaults recomendados.

Esta nueva arquitectura de información está pensada para ser escaneada rápidamente en medio de una intensa jornada de código.

---
Te invitamos a explorar los nuevos recursos y seguir optimizando la facturación electrónica en Colombia con **MATIAS API**.
