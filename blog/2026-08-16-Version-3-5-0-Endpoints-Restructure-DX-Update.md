---
slug: version-3-5-0-endpoints-restructure-dx-update
title: "Versión 3.5.0: Estandarización de Endpoints, Mejoras de DX e Iconos en Sidebar"
authors: [lewis]
tags: [release, api, endpoints, dx, documentación]
---

¡Nos complace presentar la versión **3.5.0** de la documentación técnica de MATIAS API UBL 2.1! 

Esta versión introduce una reestructuración integral de la referencia de endpoints, diseñada para ofrecer una experiencia de desarrollo (DX) más clara, intuitiva y estandarizada en cualquier entorno de integración.

<!--truncate-->

### 🌟 Principales Novedades de la Versión 3.5.0

#### 1. 📂 Nomenclatura Estándar en Inglés y 20 Módulos Secuenciales
Todos los archivos y rutas de la sección de endpoints se han normalizado en inglés (`kebab-case`) con numeración correlativa (`01` al `20`), eliminando discrepancias lingüísticas y colisiones de rutas:

1. **🔐 Autenticación** (`01-intro-auth.md`)
2. **🟢 Tablas y Catálogos** (`02-public-dian.md`)
3. **🧾 Facturación y POS** (`03-invoices-pos.md`)
4. **📑 Documento Soporte** (`04-support-documents.md`)
5. **💼 Nómina Electrónica** (`05-payroll.md`)
6. **🔍 Consultas y Estados** (`06-queries-status.md`)
7. **⚡ Eventos RADIAN** (`07-events-radian.md`)
8. **🔢 Numeración Automática** (`08-autoincrement.md`)
9. **🏥 Membresías y Salud** (`09-memberships-health.md`)
10. **🪝 Webhooks** (`10-webhooks.md`)
11. **🏢 Empresa** (`11-company.md`)
12. **👤 Perfil** (`12-profile.md`)
13. **📄 Resoluciones DIAN** (`13-dian-resolutions.md`)
14. **💻 Software DIAN** (`14-dian-software.md`)
15. **🔐 Certificado Digital** (`15-digital-certificate.md`)
16. **🎨 Company Templates** (`16-company-templates.md`)
17. **💰 Monedas** (`17-currencies.md`)
18. **📊 Configuración de Reportes** (`18-report-settings.md`)
19. **📧 Registros de Email** (`19-email-logs.md`)
20. **📦 Envío Masivo (Bulk)** (`20-bulk-documents.md`)

---

#### 2. 🎨 Iconos Semánticos en el Sidebar
Se enriqueció la barra de navegación lateral asignando emojis e iconos representativos a cada módulo y a la categoría principal `🔌 Endpoints`, facilitando la identificación visual inmediata de cada recurso de la API.

---

#### 3. 🛠️ Consolidación de Funciones Auxiliares Públicas
Las funciones de **conversión de números a letras** (`/numbers-to-letters`, `/numbersToLetters/{numero}`) y **cálculo de dígito de verificación** (`/digit-verification`, `/dv/{nit}`) se unificaron dentro del módulo de **Endpoints Públicos y Tablas DIAN**, clarificando que no requieren autenticación Bearer ni el parámetro `client_uuid`.

---

#### 4. 🌐 Estandarización de Variables Dinámicas `{{url}}`
Se reemplazaron todas las URLs estáticas o quemadas en snippets de código (cURL, JavaScript, PHP, Python) por la variable `{{url}}`, permitiendo a los desarrolladores alternar sin fricción entre ambientes locales, sandbox y producción.

---

#### 5. 🧹 Limpieza y Optimización
* Removido el módulo de Pagos Wompi y dependencias obsoletas.
* Agregados ejemplos reales de respuesta DIAN validados contra la colección oficial de Postman.

¡Te invitamos a explorar la nueva estructura en `/docs/endpoints`!
