---
title: "Release 3.7.0 — Sandbox Aislado, Glosario Integral y Limpieza Documental"
description: "Resumen técnico de la versión 3.7.0 de MATIAS API UBL 2.1"
date: "2026-08-17T11:50:00"
---

# 🚀 Release 3.7.0 — MATIAS API

**Fecha de Publicación:** 17 de Agosto de 2026  
**Versión:** `3.7.0`  
**Estado:** ✅ Producción  

---

## 📌 Resumen de Cambios

La versión **3.7.0** consolida una importante optimización arquitectónica y de experiencia de desarrollo (DX) en MATIAS API:

1. **Glosario Técnico Integral (`docs/glossary.md`):**
   - Incorporación de más de 140 definiciones normativas y técnicas.
   - Términos clave del Sector Salud (Resolución 000948 de 2026): RIPS, REPS, CUCON, copagos, cuotas moderadoras, anticipos, pagos compartidos, modalidades de contratación y causales sin contrato.
   - Criptografía e identificadores DIAN: CUNE, CUFE, CUDE y Eventos RADIAN (030 a 034).
   - Tabla de correspondencia de `type_document_id` numéricos vs códigos DIAN.

2. **Alineación del Sandbox (`docs/sandbox/quickstart.md`):**
   - Corrección conceptual del modelo de cuentas: las cuentas de Producción y Sandbox son **independientes y aisladas**.
   - El entorno Sandbox es 100% gratuito y no requiere contrato.
   - Sincronización de ejemplos en cURL, Axios y Guzzle para apuntar a `{{SANDBOX_URL}}/register` y `{{SANDBOX_URL}}/auth/login`.
   - Adición de ejemplos para Facturas en salud y Documento POS.

3. **Limpieza y Depuración de Secciones Obsoletas:**
   - Eliminación del directorio `docs/regulatory-framework/` (28 archivos redundantes).
   - Reestructuración de la barra de navegación lateral (`sidebars.ts`) y pie de página (`docusaurus.config.ts`).
   - Redirección de todos los enlaces internos a las secciones técnicas activas (`billing-fields`, `payroll`, `endpoints`, `glossary`).

4. **Modernización de la Página de Inicio (`/`):**
   - Insignias interactivas v3.7.0, Sector Salud Res. 000948, Sandbox 20 módulos y Webhooks HMAC.
   - Accesos directos optimizados a Inicio, Sandbox, Endpoints y Ejemplos JSON.

---

## 🔍 Verificación de Compilación

- **Compilador:** Docusaurus v3.10.2
- **Errores:** 0
- **Enlaces Rotos:** 0
- **Estado de Build:** ✅ Exitoso
