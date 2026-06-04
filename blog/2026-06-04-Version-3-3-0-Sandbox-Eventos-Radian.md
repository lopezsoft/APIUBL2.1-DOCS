---
slug: version-3-3-0-sandbox-eventos-radian
title: "v3.3.0: Soporte Total de Eventos RADIAN en el Sandbox y Mejoras de Documentación"
authors: [matias]
tags: [Sandbox, RADIAN, Postman, Release]
---

Nos complace anunciar el lanzamiento de la **versión 3.3.0**, la cual expande de forma oficial las capacidades de nuestro entorno de pruebas (Sandbox) para cubrir el ciclo completo de la recepción de documentos y envío de acuses (Eventos RADIAN).

<!--truncate-->

## 🔄 Simulación de Eventos RADIAN en Sandbox

Hasta la versión anterior, la validación de eventos en el entorno de pruebas dependía de llamadas directas a los servidores de la DIAN, lo cual generaba bloqueos al no existir un entorno de homologación equivalente.

A partir de la versión 3.3.0, hemos implementado el **`SandboxResponseFactory`** de forma nativa para las siguientes transacciones SOAP:
* `SendEvent` (Envío de Acuses, Reclamos, Aceptaciones, etc.)
* `GetStatusEvents` (Consulta de estado de eventos)
* `GetXmlByDocumentKey` (Extracción de XML)

¿Qué significa esto para los integradores? **Que todos los endpoints de la API de Eventos (`/api/ubl2.1/events/*`) ahora son totalmente operacionales en el sandbox (`https://sandbox-api.matias-api.com`).** Al enviar un evento a través del sandbox, el sistema simulará el procesamiento exitoso en la DIAN y retornará un estado `ACCEPTED` instantáneo, garantizando un flujo limpio para pruebas de integración de recepciones, sin necesidad de consumir folios reales o exponer credenciales de producción.

## 🗂️ Actualización de la Colección Postman (43 Requests)

Con el fin de que puedas testear inmediatamente los flujos de RADIAN, hemos actualizado la **Colección Oficial de Postman**.

*   Agregamos una nueva carpeta **"11. Sandbox — Eventos RADIAN"** que contiene 7 solicitudes pre-configuradas para importar facturas, listar recepciones, enviar eventos de acuse (030), consultar estados y más.
*   Con esta actualización, la colección ahora totaliza **43 solicitudes** abarcando *Happy Paths* y los **32 Magic Values** de simulación de errores.

Descarga la colección actualizada directamente desde la [sección del Sandbox en nuestra documentación](/docs/sandbox/postman).

## ✨ Rediseño Visual de la Documentación (Eventos)

Además del soporte lógico, hemos rediseñado íntegramente la página de referencia de [Eventos RADIAN](/docs/endpoints/events-radian). 
Con un enfoque en la escaneabilidad rápida (UX), agrupamos los 8 endpoints en 4 bloques interactivos (acordeones) acompañados de insignias visuales (badges) de color según el verbo HTTP (`POST`, `GET`, `DELETE`), y ocultamos las inmensas trazas JSON de ejemplo para que la información tabular destaque al primer golpe de vista.

## Resumen de Cambios
- **Add:** Soporte de intercepción y simulación para Eventos RADIAN en entorno Sandbox (Auto-Accepted).
- **Add:** 7 Nuevas peticiones de RADIAN en la Colección Postman (Total: 43).
- **Mod:** Reestructuración UI/UX de la documentación de endpoints de Eventos (`docs/endpoints/07-events-radian.md`).

Seguimos iterando para hacer que integrar facturación electrónica sea la experiencia más amigable del mercado. ¡Felices pruebas!
