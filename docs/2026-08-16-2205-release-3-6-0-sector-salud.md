---
id: release-3-6-0-sector-salud
title: Documentación de Release v3.6.0 - Sector Salud Resolución 000948 de 2026
description: Resumen técnico y normativo de la integración del sector salud bajo Resolución 000948 de 2026 y Documento Técnico 2 del MinSalud / DIAN.
---

# 🚀 Release v3.6.0 - Sector Salud (Resolución 000948 de 2026)

**Fecha de Creación:** 2026-08-16 22:05:00  
**Versión:** 3.6.0  

---

## 1. Resumen Ejecutivo

La versión **3.6.0** formaliza la implementación y documentación integral del **Sector Salud** para la emisión de Facturación Electrónica de Venta (FEV) y Notas de Ajuste (Crédito/Débito) en interoperabilidad con el Registro Individual de Prestación de Servicios de Salud (**RIPS**).

### Marco Legal
* **Resolución 000948 de 2026 (14 de mayo de 2026)** del Ministerio de Salud y Protección Social:
  * Reglamenta el RIPS como soporte obligatorio de la Factura Electrónica de Venta en salud.
  * **Deroga expresamente:** Resolución 2275 de 2023, Resolución 558 de 2024 y Resolución 1884 de 2024.
* **Documento Técnico 2 Versión 001 (Julio 1 de 2026)** (*Campos de datos del sector salud adicionales a la generación de la FEV*):
  * Especifica los campos UBLExtension, PrepaidPayment e InvoicePeriod requeridos en el XML / JSON.

---

## 2. Artefactos y Entregables Técnicos

1. **Ejemplo FEV Salud (`docs/jsons-billing/invoice-health-sector.md`):** Payload completo con `operation_type: "SS-CUFE"`, código REPS, modalidad de pago, cobertura, periodos de facturación, anexos y métodos de entrega.
2. **Ejemplo Nota Crédito Salud (`docs/jsons-billing/credit-note-health-sector.md`):** Payload con `operation_type: "SS-CUDE"`, concepto de discrepancia (`response_id`) y referencia CUFE a la factura original.
3. **Catálogos SISPRO en `docs/billing-fields.md`:**
   * Modalidades de Pago (`modalidadPago`: 01 a 04).
   * Coberturas y Planes de Beneficios (`coberturaPlan`: 01 a 16).
   * Facturas Sin Contrato (`facturaSinContrato`: 7 causales normativas).
   * Validaciones de Copagos, Cuotas Moderadoras, Pagos Compartidos y Anticipos.

---

## 3. Protocolos de Verificación

* **Compilación Estática:** `npm run build` ejecutado exitosamente con 0 errores y 0 enlaces rotos.
* **Snippets Verificados:** Ejemplos en cURL, JavaScript (Axios) y PHP (Guzzle) utilizando la variable dinámica `{{url}}`.
