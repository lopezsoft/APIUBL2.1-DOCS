---
slug: version-3-6-0-sector-salud-resolucion-000948
title: "Versión 3.6.0: Soporte Integral Sector Salud — Resolución 000948 de 2026 y RIPS"
authors: [lewis]
tags: [release, salud, resolucion-000948, rips, fev, endpoints]
---

¡Anunciamos el lanzamiento oficial de la versión **3.6.0** de la documentación técnica de MATIAS API UBL 2.1!

Esta versión introduce la especificación regulatoria y los ejemplos técnicos para la emisión de **Factura Electrónica de Venta (FEV) y Notas de Ajuste en el Sector Salud**, alineados con la **Resolución 000948 de 2026 (14 de mayo de 2026)** del Ministerio de Salud y Protección Social y el **Documento Técnico 2 Versión 001** (*Campos de datos del sector salud adicionales a la generación de la FEV*).

<!--truncate-->

### 🏥 Novedades Destacadas de la Versión 3.6.0

#### 1. 📋 Cumplimiento Normativo (Resolución 000948 de 2026)
Se actualizó toda la base documental conforme a la Resolución 000948 de 2026, la cual reglamenta el **RIPS como soporte obligatorio de la FEV en salud** y **deroga expresamente** las Resoluciones 2275 de 2023, 558 de 2024 y 1884 de 2024.

---

#### 2. 🧾 Nuevos Ejemplos de Payloads JSON
Se integraron páginas especializadas con payloads completos y snippets en **cURL**, **JavaScript** y **PHP**:

* **[Factura Sector Salud](/docs/jsons-billing/invoice-health-sector):** Ejemplo completo de FEV en salud con nodo `health` (`operation_type: "SS-CUFE"`), periodos de facturación, código de habilitación REPS, modalidad de pago, cobertura y anticipos.
* **[Nota Crédito Sector Salud](/docs/jsons-billing/credit-note-health-sector):** Ejemplo de Nota Crédito con `operation_type: "SS-CUDE"`, concepto de corrección / anulación y referencia CUFE obligatoria a la factura previa.

---

#### 3. 🔍 Especificación Técnica del Objeto `health`
En la guía de [Campos del Documento](/docs/billing-fields#health-) se añadieron tablas completas con los catálogos oficiales de SISPRO:
* **Modalidades de Pago (`payment_modality`):** Códigos `01` (Paquete/Canasta), `02` (Global Prospectivo), `03` (Capitación) y `04` (Evento).
* **Coberturas o Planes de Beneficios (`coverage`):** Códigos del `01` al `16` (UPC Contributiva, Presupuesto Máximo, SOAT, ARL, ADRES, Planes Voluntarios, UPC Subsidiada, etc.).
* **Causales de Factura Sin Contrato (`justification_without_contract`):** 7 causales normativas (urgencias, tutelas, portabilidad, trasplantes, etc.).
* **Reglas de Interoperabilidad con RIPS:** Validaciones de copagos, cuotas moderadoras, pagos compartidos y anticipos.

¡Explora los nuevos ejemplos y actualiza tus integraciones del sector salud!
