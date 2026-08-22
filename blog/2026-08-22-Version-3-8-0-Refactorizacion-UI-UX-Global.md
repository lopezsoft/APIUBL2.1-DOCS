---
slug: version-3-8-0-refactorizacion-ui-ux-global
title: "Versión 3.8.0: Refactorización UI/UX Global, Acordeones y Snippets Multi-Lenguaje"
authors: [lewis]
tags: [release, v3-8-0, ux, ui, endpoints, tabs, dark-mode]
---

¡Lanzamos la versión **3.8.0** de MATIAS API! Esta actualización representa una de las mayores optimizaciones de experiencia de usuario (UX) y diseño de interfaz (UI) en toda la documentación técnica de la plataforma, cubriendo 26 páginas en 3 oleadas operativas.

<!--truncate-->

### 🚀 Novedades Destacadas de la Versión 3.8.0

#### 1. 🗂️ Reorganización con Acordeones Desplegables (`<details>`)
Todos los endpoints de la API están ahora encapsulados en acordeones individuales con badges visuales de método HTTP (`badge--info`, `badge--success`, `badge--warning`, `badge--danger`) y su ruta normalizada. Esto permite escanear de un vistazo el catálogo completo sin muros interminables de texto.

---

#### 2. 💻 Snippets Multi-Lenguaje Interactivos (`<Tabs>`)
Se añadieron pestañas interactivas de código en los endpoints clave de cada módulo, permitiendo a los desarrolladores copiar implementaciones listas para producción en:
* **cURL** (terminal / scripting)
* **JavaScript / Node.js** (Axios)
* **PHP** (Guzzle / cURL nativo)
* **Python** (Requests)
* **C# / .NET** (HttpClient)
* **Postman** (Pre-request scripts)

---

#### 3. 🌙 Compatibilidad Nativa con Modo Oscuro
Se eliminaron todos los contenedores con fondos de color fijos (`#fff`, `#e7f3ff`, etc.) que causaban problemas de contraste en temas oscuros, reemplazándolos por *admonitions* nativos (`:::info`, `:::tip`, `:::warning`, `:::danger`) y variables CSS dinámicas de Docusaurus (`var(--ifm-color-...)`).

---

#### 4. 📦 Respuestas JSON Reales y Diccionarios de Campos
Se enriquecieron todas las especificaciones de endpoints reemplazando objetos vacíos por respuestas JSON reales tomadas de la suite oficial de Postman, incluyendo:
* Aprobaciones estándar DIAN con CUFE/CUDE/CUNE
* Respuestas asíncronas (HTTP 202 Accepted) para lotes masivos
* Respuestas de advertencia y estado transitorio (StatusCode 98)
* Manejo estructurado de errores HTTP 401, 404 y 422

---

#### 5. 📚 Navegación Alfabética A-Z en el Glosario
El [Glosario Técnico](/docs/glossary) cuenta ahora con una barra de navegación alfabética interactiva con anclas explícitas (`#a` hasta `#z`) y más de 150 términos actualizados.
