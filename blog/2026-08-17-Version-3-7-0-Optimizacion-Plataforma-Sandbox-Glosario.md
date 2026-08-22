---
slug: version-3-7-0-optimizacion-plataforma-sandbox-glosario
title: "Versión 3.7.0: Optimización de Plataforma, Sandbox Aislado y Glosario Integral"
authors: [lewis]
tags: [release, v3-7-0, sandbox, glosario, rips, dian]
---

¡Presentamos la versión **3.7.0** de MATIAS API! Esta entrega consolida importantes mejoras en la arquitectura documental, la experiencia del desarrollador en el **Sandbox**, la unificación del **Glosario Técnico** y la modernización integral de la plataforma.

<!--truncate-->

### 🚀 Novedades Destacadas de la Versión 3.7.0

#### 1. 📚 Glosario Técnico Integral con más de 140 Definiciones
Se rediseñó exhaustivamente el [Glosario Técnico](/docs/glossary) incorporando:
* **Términos del Sector Salud (Resolución 000948 de 2026):** RIPS, CUCON, REPS, Copagos, Cuotas Moderadoras, Anticipos, Pagos Compartidos y catálogos SISPRO de modalidades de pago y cobertura.
* **Criptografía e Identificadores DIAN:** Definición de algoritmos y uso de CUFE, CUDE, CUNE, y eventos RADIAN (030 a 034).
* **Documentos Equivalentes y Soporte:** POS Electrónico (`DEEAD01`) y Documento Soporte (`DSAJ25b`).
* **Tabla de Correspondencia de IDs:** Tabla de referencia rápida reforzando la regla crítica: en las peticiones API siempre se usa el `ID` de base de datos numérico (`type_document_id`), nunca el código alfanumérico DIAN.

---

#### 2. 🧪 Aislamiento y Aprovisionamiento del Sandbox
Se sincronizó la [Guía Quickstart del Sandbox](/docs/sandbox/quickstart) con la arquitectura de cuentas independientes:
* **100% Gratuito y Sin Contrato:** El ambiente Sandbox es de libre acceso para desarrolladores, con registro directo desde el portal web o vía API.
* **Cuentas Aisladas:** Clarificación de que las credenciales de Producción y Sandbox son independientes.
* **Soporte Multidocumento:** Ejemplos verificados para Facturas estándar, Sector Salud, POS, Documento Soporte, Nómina Electrónica y Eventos RADIAN.

---

#### 3. 🧹 Limpieza Arquitectónica y Depuración Documental
* **Eliminación de Secciones Obsoletas:** Se removió el directorio `regulatory-framework` antiguo para enfocar la documentación en especificaciones técnicas activas de la API, campos y payloads.
* **Landing Page Renovada:** Página de inicio modernizada con insignias interactivas, métricas de cumplimiento DIAN y enlaces directos a las herramientas clave.

---

#### 4. 🔗 Enlaces Rápidos
* [Sandbox Quickstart](/docs/sandbox/quickstart)
* [Campos del Documento](/docs/billing-fields)
* [Glosario Técnico](/docs/glossary)
* [Ejemplos de Facturación](/docs/jsons-billing/invoices)
