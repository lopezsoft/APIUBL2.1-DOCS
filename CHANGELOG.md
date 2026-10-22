# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y este proyecto se adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.9.1] - 2026-10-22

### Modificado
* **Cuotas de clientes (`09-memberships-health`):** `POST /memberships/quotas` identifica al cliente con `client_uuid` (body o query) y `DELETE /memberships/quotas/{client_uuid}` lo recibe en la ruta. La Casa de Software es siempre la empresa del token; un cliente ajeno o inexistente responde `404 El cliente no existe.`; pueden gestionar cuotas los usuarios Administrador y Desarrollador. La respuesta trae `client_uuid`. Se retiraron de la página los errores `403` y `422` que ya no ocurren.
* **Empresa (`11-company`):** el `uuid` del cliente es el identificador de las cuotas.
* **OpenAPI:** contrato nuevo de cuotas desde el Swagger del backend, con los parámetros `client_uuid` corregidos; se excluyen los callbacks de campañas (`/campaigns/*`).

### Obsoleto
* `client_company_id` en `POST /memberships/quotas` y el `id` numérico en la ruta del `DELETE`: siguen funcionando, pero se retirarán. Migra a `client_uuid`.

---

## [3.9.0] - 2026-10-21

### Añadido
* **Documentación para agentes de IA:** `/llms.txt` (índice), `/llms-full.txt` (documentación completa), cada página en Markdown (`/docs/<ruta>.md`), negociación con `Accept: text/markdown` y especificación pública OpenAPI 3 en `/openapi.json`. Se generan en cada build con el plugin local `plugins/llms-txt` a partir del sidebar, con las URL reales de cada página.
* **Barra «Usar con IA» en cada página:** Copiar Markdown, Ver .md, Abrir en ChatGPT y Abrir en Claude. Página nueva [Documentación para IA](/docs/ai-ready).
* **Recepción y RADIAN (`07-events-radian`):** requisito de plan de pago vigente (`403 RECEPTION_NOT_IN_PLAN`), eventos automáticos vs. manuales, `POST /events/send-bulk` (acuse 030 en bloque), secciones nuevas **Buzón de recepción** (`/events/mailbox`, `address`, `quota`, `{id}`, `{id}/retry`) y **Personas de recepción** (`/events/reception-people`).
* **Consultas:** `GET /documents/{uuid}` y `DELETE /documents/{id}`; parámetro `type_document_id` en `GET /status`.
* **Emisión:** campo raíz `uuid` anti-duplicados, catálogo de `warnings`, errores `409 DOCUMENT_IN_TRANSMISSION` / `DOCUMENT_IN_VALIDATION` y `500 DOCUMENT_POSSIBLY_SENT`, conciliación de la regla 90.
* **Membresías:** `GET /memberships/recharges`, `DELETE /memberships/quotas/{clientCompanyId}` y estadísticas de almacenamiento y correos (`/memberships/server-stats`, `/storage`, `/emails`).
* **Autenticación:** verificación de correo, recuperación de contraseña, `GET /profile/types`.
* **Webhooks:** `GET /webhooks/{id}` y `POST /webhooks/{id}/deliveries/{deliveryId}/retry`; evento `bulk.batch.completed`.
* **Marca blanca de correos (`21-email-branding`):** página nueva para `/settings/email-branding`.
* **Cupos de certificado MATICERTS** incluidos en los planes pagados (`15-digital-certificate`).

### Modificado
* **Envío masivo:** `bulk-documents.mdx` es la guía completa y `20-bulk-documents` la referencia, ya coherentes. Cada documento va en `{kind, payload}`, la respuesta es `201`, nuevo estado `POSSIBLY_SENT`, catálogo de `error_code`, idempotencia y retención real (purga a los 7 días).
  * **Cambios incompatibles del contrato bulk (revise su integración; detalle en [Cambios y compatibilidad](/docs/bulk-documents/#cambios-y-compatibilidad)):**
    * `items[].response` ya no trae `raw` (XML, AttachedDocument, QR y PDF en base64): solo el [resumen](/docs/bulk-documents/#campo-response). Descargue XML y PDF con el `document_uuid` en los endpoints del documento.
    * `response.status_code` es el código HTTP (entero, p. ej. `200`); el código DIAN pasó a `dian_status_code`.
    * `items[].document_uuid` es el uuid del **envío** que identifica el documento y, en general, no coincide con el `documents[].uuid` que usted envió. Guarde el que devuelve la API ([campos de cada item](/docs/bulk-documents/#campos-item)).
    * `documents[].uuid` es [anti-duplicados](/docs/bulk-documents/#uuid-anti-duplicados) y no se puede reutilizar: el item termina `FAILED` con `error_code` `DUPLICATE_DOCUMENT_UUID`.
    * `SUCCESS` / `REJECTED_BY_DIAN` se decide por la respuesta de la DIAN, no por el código HTTP ([cómo se decide](/docs/bulk-documents/#decision-resultado)).
    * Nuevos `429` con `Retry-After` (documentos en proceso por empresa y lote en admisión): respete `Retry-After` y reintente con el mismo `Idempotency-Key` ([códigos de error](/docs/bulk-documents/#errores)).
* **Especificación OpenAPI (`/openapi.json`):** incluye `p_type`, `p_year` y `_dni` en `GET /documents/consume`, `validation_state` y `type_document_id` en `GET /status`, y los errores `409 DOCUMENT_IN_TRANSMISSION` / `DOCUMENT_IN_VALIDATION` y `503 DIAN_STATUS_UNAVAILABLE` de la emisión. Corrige las cuotas de membresía (sin `client_uuid`, `400` para tokens que no son de Casa de Software, `402`/`403`/`409`/`422` reales), la forma real de `GET /memberships/summary` (envuelta en `data`, con `search` y `page`), `POST /resolutions` (`200` con `record`, no `201`) y `PUT /resolutions/{id}` (no es parcial; `200` con solo `success`) y `POST /events/send/mail/{trackId}` (id numérico del evento, `400` al superar 4 correos).
* **Respuestas de emisión:** el rechazo de la DIAN llega con HTTP 200 y `IsValid: "false"`; el 422 queda para errores de validación del JSON. Documento duplicado: HTTP 400. Nueva sección «Formato de los errores» en `response-json`.
* **Autenticación:** el login rechazado responde 404 con el mensaje real; PAT de 1 a 365 días (90 por defecto), token en `dataRecords.data.token`.
* **Empresa y clientes:** contrato real de sub-cuentas (`/register` vs. `POST /company/{uuid}/customer`), listado paginado, habilitar/deshabilitar, estadísticas e imágenes con `imgname`.
* **Resoluciones y Software DIAN:** valores correctos de `type_document_id` (7 factura, 11 documento soporte, 20 POS...), `environment_id` (1 producción, 2 pruebas) y `type_id`.
* **Webhooks:** rutas sin el `/ubl2.1` duplicado, catálogo real (18 eventos), sobre `{id, type, created_at, api_version, data}`, headers y verificación HMAC, política de reintentos.
* **Certificado digital:** propiedad `records.data`, `PUT /certificate/{id}`.
* **Sincronización con la documentación del backend:** contrastadas punto por punto `docs/api` (envío masivo, clientes, cuotas, datos adicionales), `CHANGELOG_API` (entradas del 2026-08-01 al 2026-10-21) y las guías de marca blanca, buzón, MATICERTS y regla 90 contra el código; se publicó lo que faltaba (p. ej. datos adicionales solo en Preprinted y su posición real, `GET /documents/consume` con 422 y alias `p_dni`) y se descartó lo que el código contradice.
* **OpenAPI:** las correcciones del contrato que aún no están en las anotaciones del backend viven en `scripts/openapi-overrides.json` (JSON Merge Patch) y se aplican al regenerar con `npm run openapi:public`.
* **Robots y servidor:** `robots.txt` permite de forma explícita a los agentes de IA; el `.htaccess` (ahora en `static/`, viaja en el build) devuelve 404 reales en vez de 500.
* Ejemplos con datos ficticios en lugar de datos reales de empresas y personas.

### Eliminado
* **Analíticas de membresías** (`/memberships/analytics/*`) de la documentación pública: son del panel interno.
* **Detalles internos** (variables de entorno, tablas, comandos, colas y bloqueos) de las páginas de envío masivo y eventos.
* **Informes técnicos de release** (`docs/AAAA-MM-DD-HHMM-*.md`): siguen en el repositorio pero ya no se publican.
* **Script `scripts/generate-llms-txt.js` y `static/llms*.txt`:** reemplazados por el plugin, que usa las URL reales (el script enlazaba `/docs/endpoints/01-intro-auth`, que respondía 500) y limpia el JSX.

---

## [3.8.0] - 2026-08-22

### Añadido
* **Campo `additional_data` en documentos:** Nuevo campo de primer nivel para incluir información personalizada en el PDF (centro de costo, afiliados, órdenes de servicio) sin enviarla a la DIAN. Soporta secciones con campos tipados (`TEXT`, `NUMBER`, `DATE`, `CURRENCY`) y alineación configurable. Límites: 10 secciones, 20 campos/sección, title 60 chars, value 500 chars.
* **Documentación Datos Adicionales en Plantillas (`docs/endpoints/company-templates`):** Nueva sección "Datos Adicionales en el PDF" que explica cómo `additional_data`, `customer.extra_data` y `lines[].extra_data` alimentan la representación gráfica, incluyendo el comportamiento de secciones fijas en la plantilla **Preprinted**.
* **Cancelación de Eventos RADIAN (`POST /events/{id}/cancel`):** Endpoint para cancelar eventos encolados en estado `PENDING` antes de su transmisión automática por el cron `ProcessEventsMasterJob`, con bloqueo pesimista `lockForUpdate()` para prevenir condiciones de carrera.
* **Estandarización de Componentes de Código:** Incorporación de pestañas de código interactivas (`<Tabs>` / `<TabItem>`) con snippets listos para copiar en **cURL**, **JavaScript (Axios)**, **PHP (Guzzle/cURL)**, **Python** y **C#/.NET** en todos los módulos de endpoints principales.
* **Respuestas JSON Completas y Estados DIAN:** Adición de respuestas estructuradas reales en todas las rutas de la API, incluyendo respuestas de aprobación DIAN, errores 401/422 y estados de procesamiento asíncrono (202 y StatusCode 98).
* **Navegación e Índice A-Z en Glosario:** Implementación de navegación alfabética interactiva con anclas explícitas (`#a` hasta `#z`) y más de 150 términos técnicos, regulatorios y normativos.

### Modificado
* **Refactorización UI/UX Global (26 archivos):** Reestructuración integral de toda la suite de documentación en 3 oleadas operativas:
  * Encapsulamiento de endpoints en acordeones colapsables (`<details>`) con insignias semánticas de método HTTP (`badge--info`, `badge--success`, `badge--warning`, `badge--danger`).
  * Eliminación de títulos y encabezados H2/H3 duplicados para una barra lateral y tabla de contenidos (TOC) limpia y scannable.
  * Consolidación de tablas repetitivas del parámetro multi-tenant `client_uuid` en avisos `:::info` centralizados por documento.
* **Compatibilidad Plena con Modo Oscuro:** Reemplazo de bloques `<div>` con colores fijos por componentes y *admonitions* nativos (`:::info`, `:::tip`, `:::warning`, `:::danger`) y variables CSS dinámicas del tema (`var(--ifm-color-...)`).
* **Optimización de Páginas de Soporte:** Actualización de `docs/response-json.md`, `docs/interactive-tools.md` y suite Sandbox (`docs/sandbox/postman.md`, `magic-values.md`, `quickstart.md`, `test-cert.md`).

---

## [3.7.0] - 2026-08-17

### Añadido
* **Glosario Integral DIAN & Salud (`docs/glossary.md`):** Más de 140 definiciones técnicas, tributarias y normativas actualizadas con base en la Resolución 000948 de 2026 (RIPS, CUCON, REPS, copagos, cuotas moderadoras, anticipos, pagos compartidos, CUNE, RADIAN, POS y PAT).
* **Limpieza y Unificación de la Suite Sandbox (`docs/sandbox/`):** Corrección y alineación de la guía Quickstart para establecer el modelo de cuentas y credenciales independientes (100% gratuito y sin contrato en Sandbox), soporte completo de POS y Sector Salud, y eliminación de bloques redundantes en Magic Values y Test Cert.
* **Modernización de la Landing Page (`/`):** Actualización de la página de inicio (`src/pages/index.tsx` y `HomepageFeatures`) con insignias interactivas, accesos directos al Sandbox, Endpoints API y Sector Salud (v3.7.0).

### Modificado
* **Configuración del Sitio y Footer:** Actualizada la referencia del copyright a `v3.7.0` y optimizada la barra de navegación lateral y enlaces de pie de página en `docusaurus.config.ts`.
* **Consistencia de Enlaces Internos:** Actualizados todos los enlaces cruzados en `docs/intro.md`, `docs/use-cases/` y artículos de blog.

### Eliminado
* **Sección Marco Regulatorio (`docs/regulatory-framework/`):** Removidos 28 archivos redundantes y obsoletos para simplificar la navegación y concentrar el contenido en las especificaciones técnicas activas de la API.

---

## [3.6.0] - 2026-08-16

### Añadido
* **Soporte Oficial Resolución 000948 de 2026 (MinSalud):** Actualización regulatoria completa para el Sector Salud con base en la Resolución 000948 del 14 de mayo de 2026 (que deroga las Resoluciones 2275 de 2023, 558 y 1884 de 2024) y el **Documento Técnico 2 Versión 001** (Julio 1 de 2026) del MinSalud / DIAN.
* **Ejemplo JSON Factura Sector Salud (`invoice-health-sector.md`):** Publicada la documentación y el payload integral para Factura Electrónica de Venta en salud con nodo `health`, periodos de facturación, códigos REPS y catálogos SISPRO (`modalidadPago`, `coberturaPlan`, `facturaSinContrato`).
* **Ejemplo JSON Nota Crédito Sector Salud (`credit-note-health-sector.md`):** Documentado el payload de Nota Crédito en salud con `operation_type: "SS-CUDE"`, concepto de discrepancia y referencia obligatoria CUFE a la factura original.
* **Especificación Técnica Completa del Objeto `health` (`docs/billing-fields.md`):** Tablas exhaustivas de modalidades de pago (01 a 04), coberturas y planes de beneficios (01 a 16), causales de facturación sin contrato, y reglas de sincronización de copagos, cuotas moderadoras, pagos compartidos y anticipos con el RIPS.

---

## [3.5.0] - 2026-08-16

### Añadido
* **Estandarización de Nomenclatura en Inglés:** Renombrados todos los archivos de endpoints en `docs/endpoints/` siguiendo la convención en inglés (`kebab-case`) con numeración correlativa del `01` al `20`.
* **Iconos Semánticos en el Sidebar:** Integración de emojis / iconos representativos en la etiqueta `sidebar_label` de cada uno de los 20 módulos de endpoints y en la categoría principal `🔌 Endpoints` para una navegación visual más rápida e intuitiva.
* **Integración de Funciones Auxiliares Públicas:** Consolidación de utilidades (`/numbers-to-letters`, `/numbersToLetters/{numero}`, `/digit-verification`, `/dv/{nit}`) dentro de `docs/endpoints/02-public-dian.md` como servicios públicos libres de autenticación y sin requisito de `client_uuid`.
* **Ejemplos Reales de Respuesta DIAN:** Incorporación de respuestas JSON reales tomadas de la colección Postman oficial para Facturación Electrónica, POS, Documento Soporte, Nómina Electrónica, Autoincremento, Autenticación y Perfil.

### Modificado
* **Estandarización de Variables de Entorno en Ejemplos:** Reemplazadas todas las URLs fijas o quemadas en snippets de código por la variable dinámica `{{url}}` (`${url}` en JS, `{$url}` en PHP, `f"{url}"` en Python) adaptable a cualquier entorno.
* **Mejora de UX en Referencia de Campos:** Reestructuración de `docs/billing-fields.md` organizando los campos en acordeones colapsables (`<details>`) con tablas descriptivas y ejemplos JSON interactivos.

### Eliminado
* **Módulo Payments - Wompi:** Removida la sección `docs/endpoints/payments-wompi` y todas sus referencias asociadas.
* **Archivos Redundantes:** Eliminados los archivos desfasados en español y colisiones de prefijos numéricos.

---

## [3.4.0] - 2026-06-29

### Añadido
* **Nuevos Endpoints Modulares:** Se documentaron exhaustivamente 10 nuevas categorías modulares de endpoints en formato Markdown:
  * Empresa, Perfil de Usuario, Resoluciones DIAN, Software DIAN, Plantillas, Configuración de Reportes, Funciones Auxiliares, Pagos Wompi, Registros de Email y Envío Masivo (Bulk).

### Modificado
* **Redirecciones Base URL:** Se estandarizó el uso de las variables `{{url}}` y `{{SANDBOX_URL}}` en todas las nuevas rutas.

---

## [3.3.0] - 2026-06-04

### Añadido
* **Simulación RADIAN en Sandbox:** Implementación del patrón `SandboxResponseFactory` para simular las respuestas SOAP de la DIAN en eventos RADIAN (`SendEvent`, `GetStatusEvents`, `GetXmlByDocumentKey`). Ahora el sandbox retorna `ACCEPTED` de forma automática, permitiendo probar la recepción de documentos y envío de acuses sin exponer credenciales de producción.
* **Colección Postman Actualizada:** Se agregó una nueva carpeta con 7 endpoints exclusivos de RADIAN a la colección oficial del sandbox, incrementando el total de peticiones pre-configuradas a 43.
* **Rediseño UX Eventos:** Reestructuración completa de la documentación de [Eventos RADIAN](/docs/endpoints/events-radian) incorporando insignias de métodos HTTP (`badges`), acordeones interactivos (`details`) y separación lógica de recursos.

---

## [3.2.0] - 2026-06-02

### Añadido
* **Endpoint de Envío Masivo (Bulk):** Integración oficial de la documentación para el procesamiento asíncrono de grandes volúmenes de documentos (`POST /api/ubl2.1/bulk/documents`).
  * **Soporte Universal:** Compatible con facturas, notas crédito/débito, documentos soporte, notas de ajuste y documentos POS utilizando los mismos payloads unitarios.
  * **Modos de Envío:** Inclusión de modos `auto-increment` y `manual`.
  * **Gestión de Lotes:** Endpoints para consultar estados generales y listado paginado de items (`GET /bulk/documents/{batch_id}` y `/items`).
  * **Idempotencia:** Capacidad de prevenir procesamientos duplicados con el header `Idempotency-Key`.
* **Portal Frontend del Sandbox:** Oficialización de la URL del panel de administración visual del ambiente de pruebas (`https://sandbox-auth.matias-api.com/`).
* **UX Documentation:** Reestructuración de la guía de referencias y campos del Payload (`docs/billing-fields.md`) empleando jerarquías colapsables (accordions) para una navegación más rápida.

### Modificado
* **Políticas de Retención:** Clarificación agresiva de la purga de datos temporales para el endpoint Bulk, limitando la disponibilidad de los estados a 2 días.

---

## [3.1.0] - 2026-06-01

### Añadido
* **Expansión Masiva del Sandbox:** Cobertura total de tipos de documentos y simulaciones avanzadas.
  * **32 Magic Values:** Ampliación del motor de simulación para cubrir 32 escenarios específicos (antes 8), abarcando errores matemáticos, criptográficos (CUFE/CUDE/CUNE), validaciones de esquema, control de certificados y caídas de servicio.
  * **Compatibilidad POS y No Residentes:** Integración de pruebas y endpoints auto-incrementables para Documentos Equivalentes POS Electrónicos y Documentos Soporte para No Residentes.
  * **Payloads de Ejemplo (`docs/sandbox/jsons/`):** Nueva sección documental con payloads listos para testear todos los escenarios (facturación, nómina, documentos soporte y POS).
  * **Colección Postman Extendida (`docs/sandbox/postman.md`):** La suite oficial de pruebas se incrementó a **36 peticiones** organizadas en 10 carpetas secuenciales, cubriendo todos los nuevos módulos.

---

## [3.0.7] - 2026-05-30

### Añadido
* **Categoría Sandbox de Integración:** Lanzamiento oficial y documentación detallada del ambiente de pruebas (sandbox).
  * **Quickstart (`docs/sandbox/quickstart.md`):** Guía de inicio rápido para conectar y testear la integración en 5 minutos usando credenciales unificadas.
  * **Magic Values (`docs/sandbox/magic-values.md`):** Documentación técnica de las 8 cabeceras de simulación HTTP (`X-Sandbox-Force-Status`) para probar feliz camino (happy path), 6 errores DIAN y 2 estados preventivos de certificados.
  * **Test Certificate (`docs/sandbox/test-cert.md`):** Especificaciones detalladas del certificado de firma digital PKCS#12 (`.p12`) autogenerado para pruebas y del guardián preventivo de producción (`CertificateFingerprintGuard`).
  * **Colección Postman (`docs/sandbox/postman.md`):** Publicada la suite de 14 requests de Postman listas para descargar e importar.
* **Actualización de Onboarding (`docs/intro.md`):** Eliminados disclaimers obsoletos de sandbox inexistente y agregados enlaces formales de redirección a las guías de sandbox.

---

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
