---
id: release-3-5-0-endpoints-restructure
title: Documentación de Release v3.5.0 - Estandarización de Endpoints
description: Resumen técnico y arquitectónico de la reestructuración de la referencia de endpoints, normalización en inglés y mejoras de DX.
---

# 🚀 Release v3.5.0 - Estandarización de Endpoints y Mejoras de DX

**Fecha de Creación:** 2026-08-16 21:50:00  
**Versión:** 3.5.0  

---

## 1. Resumen Ejecutivo

La versión 3.5.0 consolida una refactorización integral de la capa documental de la API UBL 2.1 de MATIAS, orientada a desarrolladores e integradores de software contable y ERP.

### Objetivos Cumplidos
1. **Nombres de archivo en inglés:** Normalización de todos los archivos en `docs/endpoints/` bajo estándar `kebab-case` en inglés (`11-company.md`, `12-profile.md`, `13-dian-resolutions.md`, etc.).
2. **Secuencia correlativa:** Eliminación de colisiones de números de archivo (`15-` y `16-` duplicados), estableciendo una secuencia limpia del `01` al `20`.
3. **Identificación visual en Sidebar:** Inclusión de iconos semánticos en el frontmatter `sidebar_label` de cada uno de los 20 módulos y en la categoría principal `🔌 Endpoints`.
4. **Consolidación de utilidades públicas:** Integración de los endpoints de conversión a letras y cálculo de dígito de verificación en `docs/endpoints/02-public-dian.md` como recursos libres de autenticación Bearer y sin parámetro `client_uuid`.
5. **Eliminación de URLs quemadas:** Estandarización de la variable dinámica `{{url}}` en todos los ejemplos y snippets de código.
6. **Depuración de dependencias obsoletas:** Remoción completa del módulo `payments-wompi` y limpieza de archivos desfasados.

---

## 2. Mapa Arquitectónico de Endpoints (20 Módulos)

| Pos | Archivo | Etiqueta en Sidebar | Tipo de Autenticación |
|:---:|---|---|:---:|
| 01 | `01-intro-auth.md` | 🔐 Autenticación | Bearer / Public Login |
| 02 | `02-public-dian.md` | 🟢 Tablas y Catálogos | ❌ Pública |
| 03 | `03-invoices-pos.md` | 🧾 Facturación y POS | ✅ Requerida |
| 04 | `04-support-documents.md` | 📑 Documento Soporte | ✅ Requerida |
| 05 | `05-payroll.md` | 💼 Nómina Electrónica | ✅ Requerida |
| 06 | `06-queries-status.md` | 🔍 Consultas y Estados | ✅ Requerida |
| 07 | `07-events-radian.md` | ⚡ Eventos RADIAN | ✅ Requerida |
| 08 | `08-autoincrement.md` | 🔢 Numeración Automática | ✅ Requerida |
| 09 | `09-memberships-health.md` | 🏥 Membresías y Salud | ✅ Requerida |
| 10 | `10-webhooks.md` | 🪝 Webhooks | ✅ Requerida |
| 11 | `11-company.md` | 🏢 Empresa | ✅ Requerida |
| 12 | `12-profile.md` | 👤 Perfil | ✅ Requerida |
| 13 | `13-dian-resolutions.md` | 📄 Resoluciones DIAN | ✅ Requerida |
| 14 | `14-dian-software.md` | 💻 Software DIAN | ✅ Requerida |
| 15 | `15-digital-certificate.md` | 🔐 Certificado Digital | ✅ Requerida |
| 16 | `16-company-templates.md` | 🎨 Company Templates | ✅ Requerida |
| 17 | `17-currencies.md` | 💰 Monedas | ✅ Requerida |
| 18 | `18-report-settings.md` | 📊 Configuración de Reportes | ✅ Requerida |
| 19 | `19-email-logs.md` | 📧 Registros de Email | ✅ Requerida |
| 20 | `20-bulk-documents.md` | 📦 Envío Masivo (Bulk) | ✅ Requerida |

---

## 3. Protocolos de Verificación

* **Validación de Enlaces:** Verificación estática con motor Docusaurus (`npm run build`).
* **Cobertura de Postman:** Cotejo de endpoints y parámetros contra la colección oficial `MATIAS API UBL2.1.postman_collection.json`.
