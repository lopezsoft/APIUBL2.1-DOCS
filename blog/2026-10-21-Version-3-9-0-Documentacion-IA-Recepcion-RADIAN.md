---
slug: version-3-9-0-documentacion-ia-recepcion-radian
title: Version 3.9.0 - Documentacion para IA, Recepcion RADIAN y contratos actualizados
authors: [lewis]
tags: [release, v3-9-0, ia, llms-txt, openapi, radian, recepcion, bulk]
---

La version **3.9.0** hace que la documentacion de MATIAS API se pueda leer directamente desde ChatGPT, Claude, Cursor, Copilot y cualquier agente de IA, y pone al dia todas las paginas con los ultimos cambios del API.

<!--truncate-->

### 1. Documentacion lista para IA

| Recurso | URL |
|---|---|
| Indice para agentes (estandar llms.txt) | [`/llms.txt`](https://docs.matias-api.com/llms.txt) |
| Documentacion completa en Markdown | [`/llms-full.txt`](https://docs.matias-api.com/llms-full.txt) |
| Cada pagina en Markdown | agrega `.md` a la URL, p. ej. [`/docs/intro.md`](https://docs.matias-api.com/docs/intro.md) |
| Especificacion OpenAPI 3 | [`/openapi.json`](https://docs.matias-api.com/openapi.json) |

Tambien puedes pedir cualquier pagina con `Accept: text/markdown`, y cada pagina trae los botones **Copiar Markdown**, **Ver .md**, **Abrir en ChatGPT** y **Abrir en Claude**. Corregimos ademas la configuracion que hacia que algunos asistentes interpretaran que no tenian permiso de lectura.

[Como usarla con tu asistente](/docs/ai-ready)

---

### 2. Recepcion de documentos y RADIAN

- El modulo `/events/*` requiere un **plan de pago vigente**: con plan FREE, vencido o sin suscripcion responde `403` con `error_code: RECEPTION_NOT_IN_PLAN`.
- **Buzon de recepcion:** consulta los correos recibidos, la direccion del buzon, el cupo y reintenta los fallidos.
- **Personas de recepcion:** varias por empresa, una por defecto, y el modo de eventos automatico o manual.
- **Acuse 030 en bloque:** `POST /events/send-bulk`, hasta 50 recepciones por solicitud.

[Ver Eventos RADIAN](/docs/endpoints/events-radian)

---

### 3. Emision, consultas y envio masivo

- Campo raiz `uuid` anti-duplicados y consulta por `GET /documents/{uuid}`.
- El rechazo de la DIAN llega con HTTP 200 e `IsValid: "false"`; el 422 queda para errores de validacion del JSON.
- Nuevos errores `409 DOCUMENT_IN_TRANSMISSION` y `DOCUMENT_IN_VALIDATION`, y estado `POSSIBLY_SENT` (no reenviar: consultar el estado).
- Envio masivo: cada documento va en `{kind, payload}`, la respuesta es `201` y la guia y la referencia ya describen el mismo contrato.

[Respuestas y errores](/docs/response-json) · [Envio masivo](/docs/bulk-documents)

---

### 4. Otras actualizaciones

- **Autenticacion:** verificacion de correo, recuperacion de contrasena y PAT de 1 a 365 dias.
- **Clientes y sub-cuentas:** contrato real de alta, listado, habilitacion y estadisticas.
- **Membresias:** `GET /memberships/recharges` (Mis recargas) y liberacion de cuotas de clientes.
- **Webhooks:** catalogo real de eventos, sobre del evento, headers y verificacion HMAC, reintentos.
- **Marca blanca de correos:** pagina nueva.
- **Resoluciones y Software DIAN:** valores correctos de `type_document_id`, `environment_id` y `type_id`.
