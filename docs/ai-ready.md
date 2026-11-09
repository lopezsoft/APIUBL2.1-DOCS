---
sidebar_position: 2
sidebar_label: 🤖 AI Hub & Skills
title: AI Hub — Skills, Reglas IDE y Material Descargable para IA
description: Descarga el Skill oficial (SKILL.md), archivos de reglas para Cursor, Claude Code, Antigravity y Copilot, paquetes modulares de contexto y especificación OpenAPI 3 de MATIAS API.
---

import AiHub from '@site/src/components/AiHub';

# 🤖 AI Hub — Skills, Reglas IDE y Contexto para Agentes

Toda la documentación de **MATIAS API UBL 2.1** está diseñada para que puedas integrarla con tu propio asistente de IA (**Google Antigravity**, **Claude Code**, **Cursor**, **GitHub Copilot**, **OpenAI Codex**, **Windsurf**, **ChatGPT** o **Claude**).

Desde este centro puedes **instalar nuestro Skill oficial en 1 comando**, descargar las reglas para tu editor de código o bajar únicamente el paquete de contexto del módulo que estás desarrollando.

<AiHub />

---

## 📦 Índice Completo de Artefactos Descargables

Si estás consultando esta página desde un agente de IA o prefieres los enlaces directos a cada archivo estático:

### 1. Skills y Reglas para Editores de Código (IDEs)

| Artefacto | Ruta Descargable | Destino en tu Proyecto | Propósito |
|---|---|---|---|
| **Skill Oficial (`SKILL.md`)** | [`/ai/matias-api-skill/SKILL.md`](https://docs.matias-api.com/ai/matias-api-skill/SKILL.md) | `.claude/skills/matias-api-ubl21/SKILL.md` o `.gemini/skills/matias-api-ubl21/SKILL.md` | Skill con reglas de negocio UBL 2.1, separación Sandbox/Prod, `?client_uuid` y manejo de concurrencia DIAN. |
| **Estándar `AGENTS.md`** | [`/ai/AGENTS.md`](https://docs.matias-api.com/ai/AGENTS.md) | `AGENTS.md` (raíz del repositorio) | Estándar universal leído automáticamente por agentes de código autónomos. |
| **Reglas Cursor (`.cursorrules`)** | [`/ai/matias-api.cursorrules`](https://docs.matias-api.com/ai/matias-api.cursorrules) | `.cursorrules` o `.cursor/rules/matias-api.mdc` | Contexto persistente para Cursor IDE. |
| **Contexto Claude Code (`CLAUDE.md`)** | [`/ai/CLAUDE.md`](https://docs.matias-api.com/ai/CLAUDE.md) | `CLAUDE.md` (raíz del repositorio) | Memoria técnica del proyecto para Claude Code CLI y Desktop. |
| **Instrucciones GitHub Copilot** | [`/ai/copilot-instructions.md`](https://docs.matias-api.com/ai/copilot-instructions.md) | `.github/copilot-instructions.md` | Reglas de generación de código para GitHub Copilot en VS Code / JetBrains. |
| **Instalador CLI (Bash)** | [`/ai/install-skill.sh`](https://docs.matias-api.com/ai/install-skill.sh) | Ejecutar en raíz del proyecto | Instala `SKILL.md`, reglas, `openapi.json` y los 6 paquetes modulares en 1 paso. |
| **Instalador CLI (PowerShell)** | [`/ai/install-skill.ps1`](https://docs.matias-api.com/ai/install-skill.ps1) | Ejecutar en raíz del proyecto | Instalador equivalente para Windows PowerShell. |

### 2. Paquetes Modulares de Contexto (`.md`)

Ideales para adjuntar en una ventana de chat sin agotar el límite de tokens:

| Paquete Modular | URL Directa | Contenido Consolidado |
|---|---|---|
| **Inicio Rápido, Auth y Sandbox** | [`/ai/packs/quickstart-auth-sandbox.md`](https://docs.matias-api.com/ai/packs/quickstart-auth-sandbox.md) | OAuth2, Personal Access Tokens (PAT), separación de cuentas Sandbox vs Producción y Magic Values. |
| **Facturación, POS y Notas** | [`/ai/packs/invoicing-pos-notes.md`](https://docs.matias-api.com/ai/packs/invoicing-pos-notes.md) | Emisión de Factura Electrónica (`POST /invoice`), POS (`POST /pos`), Notas Crédito/Débito, campos UBL 2.1 y todos sus JSONs. |
| **Sector Salud y RIPS (Res. 000948)** | [`/ai/packs/health-sector-rips.md`](https://docs.matias-api.com/ai/packs/health-sector-rips.md) | Objeto `health`, interoperabilidad RIPS 2026, copagos, cuotas moderadoras y ejemplos JSON de salud. |
| **Nómina y Documento Soporte** | [`/ai/packs/payroll-support-doc.md`](https://docs.matias-api.com/ai/packs/payroll-support-doc.md) | Nómina individual, notas de ajuste (reemplazo/eliminación) y Documento Soporte (residentes y no residentes). |
| **RADIAN, API Bulk y Webhooks** | [`/ai/packs/radian-bulk-webhooks.md`](https://docs.matias-api.com/ai/packs/radian-bulk-webhooks.md) | Eventos título valor RADIAN, envíos masivos asíncronos (`POST /documents/bulk`), Webhooks HMAC y consultas de estado. |
| **Errores, Concurrencia DIAN y Glosario** | [`/ai/packs/troubleshooting-errors.md`](https://docs.matias-api.com/ai/packs/troubleshooting-errors.md) | Errores 401/404/409/422/503, Regla 90 DIAN, `DOCUMENT_POSSIBLY_SENT`, Casas de Software (`?client_uuid`) y Glosario de catálogos. |

### 3. Índices Globales y Contratos de API

| Recurso | URL | Úsalo para |
|---|---|---|
| **Índice estándar `llms.txt`** | [`/llms.txt`](https://docs.matias-api.com/llms.txt) | Que el agente explore el mapa completo del sitio y abra solo las páginas que requiere. |
| **Documentación completa (`llms-full.txt`)** | [`/llms-full.txt`](https://docs.matias-api.com/llms-full.txt) | Cargar toda la documentación de MATIAS API en un solo archivo de texto plano. |
| **Manifiesto JSON de IA** | [`/ai/manifest.json`](https://docs.matias-api.com/ai/manifest.json) | Descubrimiento programático de todos los artefactos IA, paquetes y versiones. |
| **Especificación OpenAPI 3** | [`/openapi.json`](https://docs.matias-api.com/openapi.json) | Generar clientes HTTP tipados, validar esquemas o alimentar herramientas MCP/OpenAPI. |
| **Colección Postman Sandbox** | [`/sandbox-quickstart.postman_collection.json`](https://docs.matias-api.com/sandbox-quickstart.postman_collection.json) | Probar el flujo mínimo de extremo a extremo contra el Sandbox gratuito. |
| **Colección Postman Completa** | [`/postman_collection.json`](https://docs.matias-api.com/postman_collection.json) | Importar todos los endpoints en Postman (archivo de más de 5 MB; para IA prefiere los paquetes `.md`). |

---

## 💡 Negociación de Contenido HTTP (`Accept: text/markdown`)

Cualquier URL de la documentación devuelve automáticamente su versión en Markdown plano si el agente envía la cabecera `Accept: text/markdown` o si agregas `.md` al final de la ruta:

```bash
# Mediante negociación de contenido HTTP
curl -L -H "Accept: text/markdown" https://docs.matias-api.com/docs/intro/

# O accediendo directamente a la extensión .md
curl -L https://docs.matias-api.com/docs/intro.md
```

---

## 🛡️ Buenas Prácticas de Seguridad con IA

:::danger Nunca compartas credenciales reales ni certificados en un chat
No pegues tu token de producción (`Authorization: Bearer ...`), contraseñas ni archivos `.p12`/`.pfx` en asistentes de IA externos.
:::

1. **Desarrolla siempre primero contra el Sandbox:** Configura tu agente para apuntar a `https://sandbox-api.matias-api.com/api/ubl2.1` y utiliza los [Valores Mágicos](./sandbox/magic-values.md) para simular rechazos o aprobaciones de la DIAN.
2. **Indica tu arquitectura desde el inicio:** Si eres **Casa de Software**, especifica a tu agente que todas las peticiones en nombre de empresas clientes llevan el parámetro `?client_uuid={uuid}`.
3. **Exige idempotencia y respeto por los estados DIAN:** Asegúrate de que el código generado envíe un `uuid` único por documento y **nunca reemita con otro consecutivo** ante un error `409`, `500` o `503` sin consultar antes `GET /documents/{uuid}`.
