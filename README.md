# MATIAS API (UBL 2.1) — Developer Hub & AI-Ready Documentation (v3.10.0)

Plataforma oficial de documentación técnica y Developer Hub para **MATIAS API v3.0.2 (Anexo Técnico DIAN 1.9 / UBL 2.1)**, optimizada para desarrolladores y agentes de Inteligencia Artificial (**Claude Code, Cursor, Antigravity, GitHub Copilot y Windsurf**).

---

## 🚀 Inicio Rápido

```bash
# Modo desarrollo (abre automáticamente en http://localhost:3080)
npm start

# Compilar para producción (genera artefactos AI, OpenAPI y sitio estático)
npm run build

# Servir el build de producción y abrir el navegador inmediatamente en http://localhost:3080
npm run serve
```

---

## ✨ Novedades v3.10.0

- **Developer Hub (Home Rediseñado):** Buscador instantáneo en el Hero, Ruta de Integración en 4 pasos, matriz de capacidades UBL 2.1 con enlaces directos a Endpoints + JSONs y Centro de Autogestión Top Soporte.
- **Buscador Global Instantáneo (`Ctrl+K` / `/`):** Modal nativo indexado por páginas y secciones H2/H3 con filtros por categoría y atajos a errores frecuentes DIAN (`404`, `409`, `422`, `503`, Regla `90`, `client_uuid`, Sector Salud).
- **AI & Skills Hub (`/docs/ai-ready`):**
  - **Skill Oficial (`SKILL.md`):** `/ai/matias-api-skill/SKILL.md` e instaladores CLI de 1 comando (`/ai/install-skill.sh`, `/ai/install-skill.ps1`).
  - **Reglas para IDEs:** `AGENTS.md`, `CLAUDE.md`, `.cursorrules` y `copilot-instructions.md`.
  - **6 Context Packs Modulares (`/ai/packs/*.md`):** Paquetes ligeros por módulo para no saturar la ventana de contexto del LLM.
  - **Generador Interactivo de Prompts:** Construye prompts listos para pegar según tu lenguaje (PHP/Laravel, Node.js/TypeScript, Python, C#/.NET, Java, Go) y módulo a integrar.
- **Sistema Visual Estilo Starlight / Mintlify:** Tipografía técnica optimizada, modo oscuro de alto contraste, pestañas tipo *Segmented Control* y herramientas interactivas compatibles con tema claro/oscuro.

---

## 📦 Scripts Disponibles

```bash
npm start                 # Servidor de desarrollo en http://localhost:3080 (abre navegador automáticamente)
npm run build             # Compila el sitio y autogenera llms.txt, SKILL.md, reglas IDE y packs IA
npm run serve             # Sirve el build compilado en http://localhost:3080 y abre el navegador de inmediato
npm run openapi:public    # Regenera static/openapi.json aplicando scripts/openapi-overrides.json
npm run typecheck         # Verifica tipos TypeScript (tsc)
npm run clear             # Limpia caché de Docusaurus (.docusaurus / build)
```

---

## 🎯 Estructura del Proyecto

```text
APIUBL2.1-DOCS/
├── docs/                       ← Documentación técnica Markdown/MDX
│   ├── endpoints/              ← 21 módulos de referencia de endpoints REST
│   ├── sandbox/                ← Guías de Quickstart, Valores Mágicos y Postman
│   ├── jsons-billing/          ← Ejemplos JSON de Facturación, Exportación, AIU, Salud y Consorciados
│   ├── jsons-pos/              ← Ejemplos JSON de POS Electrónico y Notas de Ajuste
│   ├── jsons-support-document/ ← Ejemplos JSON de Documento Soporte y Notas
│   ├── payroll/                ← Nómina Electrónica y Notas de Ajuste/Eliminación
│   └── use-cases/              ← Errores Comunes DIAN, Webhooks y Escenarios Especiales
├── plugins/
│   └── llms-txt/               ← Plugin generador de llms.txt, SKILL.md, reglas IDE, packs IA y searchIndex
├── src/
│   ├── components/
│   │   ├── AiHub/              ← Centro interactivo de descargas IA, CLI y Prompt Builder
│   │   ├── AiPageActions/      ← Barra "Usar con IA" en cada página (Copiar/Descargar .md y Skill)
│   │   ├── HomepageFeatures/   ← Tarjetas modulares del Developer Hub
│   │   └── Interactive/        ← Validador NIT (Módulo 11), Validador JSON UBL 2.1 y Calculadora
│   ├── css/
│   │   └── custom.css          ← Design System Starlight/Mintlify + Dark Mode
│   ├── pages/
│   │   └── index.tsx           ← Developer Hub (Home)
│   └── theme/
│       └── SearchBar/          ← Buscador instantáneo Ctrl+K con filtros y soporte rápido
├── static/
│   ├── ai/                     ← Artefactos IA autogenerados (SKILL.md, packs, reglas IDE, instaladores)
│   └── openapi.json            ← Contrato OpenAPI 3.0 público
├── docusaurus.config.ts
├── sidebars.ts
└── package.json
```

---

## 📝 Licencia

Todos los derechos reservados © 2026 LOPEZSOFT SAS - MATIAS API.
