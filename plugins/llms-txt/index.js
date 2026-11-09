'use strict';

/**
 * Plugin local: documentación legible por agentes de IA (estándar llms.txt),
 * generador de Skills/Reglas para IDEs, paquetes de contexto modulares y
 * motor de índice de búsqueda instantánea para la interfaz web.
 *
 * En el build (y sincronizado en static/ai para desarrollo) genera:
 *   /llms.txt                          índice en Markdown con enlace a cada página
 *   /llms-full.txt                     toda la documentación consolidada en un solo archivo
 *   /docs/<ruta>.md                    cada página en Markdown plano (p.ej. /docs/intro.md)
 *   /SKILL.md                          Skill oficial en raíz para descubrimiento directo
 *   /ai/matias-api-skill/SKILL.md      Skill estándar para Antigravity, Claude Code, Cursor y Codex
 *   /ai/AGENTS.md                      Instrucciones universales para agentes en repositorios
 *   /ai/CLAUDE.md                      Archivo de contexto para Claude Code
 *   /ai/matias-api.cursorrules         Reglas para Cursor IDE (.cursorrules)
 *   /ai/copilot-instructions.md        Instrucciones para GitHub Copilot (.github/copilot-instructions.md)
 *   /ai/packs/<pack-id>.md             Paquetes de contexto modulares por dominio funcional
 *   /ai/install-skill.sh               Instalador CLI en 1 paso (Bash / macOS / Linux / Git Bash)
 *   /ai/install-skill.ps1              Instalador CLI en 1 paso (PowerShell / Windows)
 *   /ai/manifest.json                  Manifiesto JSON de artefactos para IA
 */

const fs = require('fs/promises');
const fsSync = require('fs');
const path = require('path');
const { mdxToMarkdown, stripFrontMatter } = require('./mdx-to-markdown');

const PLUGIN_NAME = 'docusaurus-plugin-llms-txt';

/** Definición de paquetes modulares de contexto para IA. */
const AI_PACK_DEFINITIONS = [
  {
    id: 'quickstart-auth-sandbox',
    title: 'Inicio Rápido, Autenticación y Sandbox',
    shortTitle: 'Auth & Sandbox',
    category: 'Fundamentos',
    icon: 'rocket',
    description:
      'Flujos OAuth2 y Personal Access Tokens (PAT), separación de cuentas Sandbox vs Producción, verificación de correo y Magic Values.',
    docIds: [
      'intro',
      'endpoints/intro-auth',
      'sandbox/quickstart',
      'sandbox/magic-values',
      'sandbox/test-cert',
      'sandbox/postman',
    ],
  },
  {
    id: 'invoicing-pos-notes',
    title: 'Facturación Electrónica, POS y Notas Crédito/Débito',
    shortTitle: 'Facturación & POS',
    category: 'Emisión',
    icon: 'invoice',
    description:
      'Endpoints de emisión FEV, Documento Equivalente POS, Notas Crédito/Débito, diccionario completo de campos UBL 2.1 y payloads JSON.',
    docIds: [
      'endpoints/invoices-pos',
      'billing-fields',
      'response-json',
      'use-cases/simple-invoice',
      'use-cases/invoice-with-discounts',
      'use-cases/export-scenarios',
    ],
    dirPrefixes: ['jsons-billing/', 'jsons-pos/'],
  },
  {
    id: 'health-sector-rips',
    title: 'Sector Salud y RIPS (Resolución 000948 de 2026)',
    shortTitle: 'Sector Salud (RIPS)',
    category: 'Especializado',
    icon: 'health',
    description:
      'Campos obligatorios del Sector Salud, interoperabilidad RIPS, facturación de servicios médicos, copagos y notas crédito de salud.',
    docIds: [
      'billing-fields',
      'jsons-billing/invoice-health-sector',
      'jsons-billing/credit-note-health-sector',
      'endpoints/invoices-pos',
      'response-json',
    ],
  },
  {
    id: 'payroll-support-doc',
    title: 'Nómina Electrónica y Documento Soporte',
    shortTitle: 'Nómina & Doc. Soporte',
    category: 'Emisión',
    icon: 'payroll',
    description:
      'Nómina individual, notas de ajuste (reemplazo y eliminación), Documento Soporte en adquisiciones a no obligados (residentes y no residentes).',
    docIds: [
      'endpoints/payroll',
      'payroll/payroll-fields',
      'payroll/payroll-replace',
      'payroll/payroll-delete',
      'endpoints/support-documents',
      'jsons-support-document/support-document',
      'jsons-support-document/support-document-non-residents',
      'jsons-support-document/adjustment-note',
      'jsons-support-document/adjustment-note-non-residents',
    ],
  },
  {
    id: 'radian-bulk-webhooks',
    title: 'Eventos RADIAN, API Bulk y Webhooks',
    shortTitle: 'RADIAN, Bulk & Webhooks',
    category: 'Escala y Eventos',
    icon: 'bolt',
    description:
      'Acuse de recibo, recibo del bien, aceptación expresa/tácita, rechazo, envío masivo asíncrono (API Bulk), Webhooks HMAC y consultas DIAN.',
    docIds: [
      'endpoints/events-radian',
      'bulk-documents',
      'endpoints/bulk-documents',
      'endpoints/webhooks',
      'endpoints/queries-status',
      'endpoints/public-dian',
    ],
  },
  {
    id: 'troubleshooting-errors',
    title: 'Solución de Errores, Concurrencia DIAN y Catálogos',
    shortTitle: 'Errores & Glosario',
    category: 'Soporte Técnico',
    icon: 'shield',
    description:
      'Guía de errores 401/404/409/422/503, manejo de concurrencia (Regla 90, DOCUMENT_POSSIBLY_SENT), configuración DIAN, Casas de Software y Glosario.',
    docIds: [
      'use-cases/common-errors',
      'response-json',
      'glossary',
      'endpoints/company',
      'endpoints/memberships-health',
      'endpoints/dian-resolutions',
      'endpoints/dian-software',
      'endpoints/digital-certificate',
      'endpoints/autoincrement',
    ],
  },
];

/** Quita emojis y símbolos decorativos de las etiquetas del sidebar. */
function cleanLabel(label) {
  return String(label || '')
    .replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Genera un slug compatible con Docusaurus cuando un encabezado no tiene {#id}. */
function slugifyHeading(text) {
  return cleanLabel(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

/** Extrae encabezados H2 y H3 del fuente Markdown para el buscador instantáneo. */
function extractHeadings(rawSource) {
  const withoutFm = stripFrontMatter(rawSource);
  const headings = [];
  let inFence = false;

  for (const line of withoutFm.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (/^(`{3,}|~{3,})/.test(trimmed)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = trimmed.match(/^(#{2,3})\s+(.+?)(?:\s*\{#([\w-]+)\})?\s*$/);
    if (match) {
      const level = match[1].length;
      const rawTitle = match[2]
        .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/[*_`~]/g, '')
        .trim();
      const title = cleanLabel(rawTitle);
      const id = match[3] || slugifyHeading(rawTitle);
      if (title && id) {
        headings.push({ level, title, id });
      }
    }
  }
  return headings;
}

/** Recorre el sidebar en orden y agrupa las páginas por categoría. */
function collectSections(items, docsById, rootTitle, continuationTitles) {
  const sections = [];
  let continuations = 0;
  const continuationTitle = () => {
    const title = continuationTitles[Math.min(continuations, continuationTitles.length - 1)];
    continuations++;
    return title;
  };
  let root = { title: rootTitle, docs: [] };
  sections.push(root);

  const walk = (list, section, prefix) => {
    for (const item of list) {
      if (item.type === 'doc' || item.type === 'ref') {
        const doc = docsById.get(item.id);
        if (doc && section === root && sections[sections.length - 1] !== root) {
          root = { title: continuationTitle(), docs: [] };
          sections.push(root);
          section = root;
        }
        if (doc && !section.docs.includes(doc)) section.docs.push(doc);
      } else if (item.type === 'category') {
        const title = [prefix, cleanLabel(item.label)].filter(Boolean).join(' — ');
        const child = { title, docs: [] };
        sections.push(child);
        if (item.link && item.link.type === 'doc') {
          const doc = docsById.get(item.link.id);
          if (doc) child.docs.push(doc);
        }
        walk(item.items || [], child, title);
      }
    }
  };

  walk(items, root, '');
  return sections.filter((s) => s.docs.length > 0);
}

/**
 * Descripción para el índice: la del front matter; si no hay, el primer
 * párrafo de prosa de la página ya convertida.
 */
function describe(frontMatterDescription, markdown) {
  const clean = (text) =>
    cleanLabel(
      String(text)
        .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/[*_`>#|]/g, '')
        .replace(/\s+/g, ' '),
    );
  if (frontMatterDescription) return clean(frontMatterDescription);

  const firstParagraph = (allowAdmonitions) => {
    let inFence = false;
    let inAdmonition = false;
    for (const line of markdown.split('\n')) {
      const t = line.trim();
      if (/^(`{3,}|~{3,})/.test(t)) {
        inFence = !inFence;
        continue;
      }
      if (inFence) continue;
      if (/^:::\s*\w/.test(t)) {
        inAdmonition = true;
        continue;
      }
      if (/^:::\s*$/.test(t)) {
        inAdmonition = false;
        continue;
      }
      if (inAdmonition && !allowAdmonitions) continue;
      if (!t || /^(#|>|\||-|\*\s|\d+\.|<!--|---|\*\*[^*]+\*\*:?$)/.test(t) || /:$/.test(t)) continue;
      const text = clean(t);
      if (text.length < 40) continue;
      return text.length > 220 ? `${text.slice(0, 217).replace(/\s+\S*$/, '')}…` : text;
    }
    return '';
  };
  return firstParagraph(false) || firstParagraph(true);
}

function markdownPathFor(permalink) {
  const clean = permalink.replace(/\/+$/, '') || '/index';
  return `${clean}.md`;
}

/** Construye el contenido del SKILL.md oficial y archivos de reglas para IDEs. */
function buildCoreInstructions(siteUrl, version) {
  return `## Arquitectura y Entornos de MATIAS API (v${version})

- **Sandbox (Pruebas gratuitas, sin envío real a la DIAN):**
  - Base URL API: \`https://sandbox-api.matias-api.com/api/ubl2.1\`
  - Portal Web Sandbox: \`https://sandbox-auth.matias-api.com/\`
- **Producción (Requiere contrato activo, certificado digital y resoluciones DIAN):**
  - Base URL API: entregada al contratar el servicio (representada como \`{{url}}\` o \`{{URL}}\`).
- **Regla Crítica de Cuentas Separadas:** Las credenciales de Producción **NO** funcionan en Sandbox y viceversa. Cada entorno requiere su propio registro y verificación de correo electrónico.

## Autenticación y Cabeceras Obligatorias

Todas las peticiones HTTP hacia endpoints protegidos deben enviar:

\`\`\`http
Authorization: Bearer {access_token_o_pat}
Content-Type: application/json
Accept: application/json
\`\`\`

- **Importante sobre \`Accept: application/json\`:** Si se omite esta cabecera, los errores de validación (HTTP 422) o no autenticado (HTTP 401) pueden responder con redirección HTML (HTTP 302) en lugar de JSON.
- **Importante sobre \`POST /auth/login\` y HTTP 404:** Después de \`POST /register\`, el usuario **debe abrir el enlace de verificación enviado a su correo**. Mientras el correo no esté verificado (o si las credenciales son incorrectas), \`POST /auth/login\` responde **HTTP 404** (\`"El correo electrónico no ha sido verificado..."\` o \`"Credenciales inválidas."\`), **no** HTTP 401.
- **Personal Access Tokens (PAT):** Recomendados para integraciones servidor a servidor. Se crean con \`POST /tokens\` (\`name\`, \`expires_in_days\` de 1 a 365 días, por defecto 90).

## Operación para Casas de Software (Multi-Tenant)

- **No usar \`POST /register\` para crear sub-clientes:** \`POST /register\` solo crea cuentas principales de desarrollador (enviar \`company_id\` allí devuelve HTTP 422).
- **Crear empresa cliente:** Usar \`POST {{url}}/company/{uuid_desarrollador}/customer\` autenticándose con el token de la Casa de Software.
- **Emitir o consultar en nombre de un cliente:** Agregar el query param \`?client_uuid={uuid_cliente}\` a los endpoints de emisión, consulta, resoluciones, certificados o consumo (ej. \`POST {{url}}/invoice?client_uuid={uuid_cliente}\`).

## Reglas Matemáticas y Validación UBL 2.1 (DIAN Colombia)

1. **NIT y Dígito de Verificación (Algoritmo Módulo 11):**
   - El campo \`dni\` de empresa y cliente lleva **solo dígitos**, sin puntos, guiones ni dígito de verificación.
   - Pesos de derecha a izquierda: \`[3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71]\`.
   - Residuo \`r = suma % 11\`. Si \`r === 0\` o \`r === 1\`, \`dv = r\`; de lo contrario \`dv = 11 - r\`.
2. **Cuadre de Totales (\`legal_monetary_totals\`):**
   - \`line_extension_amount\` (por línea) = \`(invoiced_quantity * price_amount) - descuentos_linea + cargos_linea\`.
   - \`legal_monetary_totals.line_extension_amount\` = suma de \`line_extension_amount\` de todas las líneas.
   - \`legal_monetary_totals.tax_exclusive_amount\` = base imponible total (suma de \`taxable_amount\` o \`line_extension_amount\` menos descuentos globales).
   - \`legal_monetary_totals.tax_inclusive_amount\` = \`tax_exclusive_amount + suma(tax_totals[*].tax_amount)\` (no incluye retenciones \`with_holding_tax_total\`).
   - \`legal_monetary_totals.payable_amount\` = \`tax_inclusive_amount - AllowanceTotalAmount + ChargeTotalAmount - PrepaidAmount\`.
3. **Exportaciones (\`type_document_id: 8\` o moneda extranjera):**
   - No deben incluir IVA (\`tax_totals: []\`) y requieren moneda distinta de COP (ej. \`currency_id: 272\` para USD) con su tasa de cambio si aplica.
4. **Sector Salud (Resolución 000948 de 2026 — RIPS):**
   - Usa el objeto \`health\` (\`operation_type\`, \`provider_code\`, \`payment_modality\`, \`coverage\`, \`users\`, etc.) dentro del payload de factura (\`POST /invoice\`) o nota crédito (\`POST /notes/credit\`).

## Concurrencia, Idempotencia y Errores DIAN (Regla de Oro)

> **REGLA DE ORO:** Ante un timeout, error 409, 500 o 503 durante la emisión, **NUNCA reemitas el documento cambiando el \`document_number\`** sin antes consultar su estado con \`GET /documents/{uuid}\` o \`GET /status?prefix=...&number=...\`.

- Envía siempre un \`uuid\` (UUID v4) único por documento en el body para activar la protección anti-duplicados.
- **\`409 DOCUMENT_IN_TRANSMISSION\`**: Otra petición está transmitiendo ese mismo consecutivo en paralelo. Espera unos segundos y consulta el estado.
- **\`409 DOCUMENT_IN_VALIDATION\`**: El envío anterior quedó en \`StatusCode 98\` en la DIAN. Consulta con \`POST /status/document/{trackId}\`.
- **\`503 DIAN_STATUS_UNAVAILABLE\`**: No se pudo confirmar el envío previo en la DIAN; la API no retransmitió para evitar duplicados. Reintenta luego con el mismo número.
- **\`500 DOCUMENT_POSSIBLY_SENT\`**: El fallo ocurrió después de transmitir a la DIAN. **No reemitas**; consulta \`GET /documents/{uuid}\`.
- **Avisos Regla 90 (\`warnings[].code\`):**
  - \`ALREADY_AUTHORIZED_RECOVERED\`: La DIAN ya había autorizado ese documento con el mismo contenido; se recupera y es 100% válido.
  - \`ALREADY_AUTHORIZED_OTHER_CONTENT\`: Ese consecutivo ya fue autorizado en la DIAN con otro contenido distinto.
- **Avisos Post-Aceptación (\`PDF_NOT_GENERATED\`, \`EMAIL_NOT_SENT\`, \`ATTACHED_DOCUMENT_NOT_GENERATED\`):**
  - El documento **YA FUE VALIDADO POR LA DIAN**. No lo reenvíes. Usa \`POST /documents/pdf/{trackId}?regenerate=1\` o \`POST /documents/sendmail/{trackId}\`.

## Endpoints Principales

| Operación | Método y Ruta |
|---|---|
| Registro cuenta desarrollador | \`POST /register\` |
| Login (obtener token) | \`POST /auth/login\` |
| Crear Personal Access Token (PAT) | \`POST /tokens\` |
| Emitir Factura Electrónica (FEV / Exportación / Contingencia / Salud) | \`POST /invoice\` |
| Emitir Documento Equivalente POS | \`POST /pos\` |
| Emitir Nota Crédito / Nota Débito | \`POST /notes/credit\` · \`POST /notes/debit\` |
| Emitir Documento Soporte / Nota de Ajuste DS | \`POST /ds/document\` · \`POST /ds/adjustment-note\` |
| Emitir Nómina Individual / Reemplazo / Eliminación | \`POST /payroll\` · \`POST /payroll/replace\` · \`POST /payroll/destroy\` |
| Envío Masivo Asíncrono (API Bulk) | \`POST /documents/bulk\` · \`GET /documents/bulk/{batch_id}\` |
| Eventos RADIAN (Acuse, Recibo, Aceptación, Rechazo) | \`POST /events/{event_code}\` · \`POST /events/ resend\` |
| Consultar estado de documento | \`GET /documents/{uuid}\` · \`GET /status?prefix={p}&number={n}\` · \`POST /status/document/{trackId}\` |
| Descargar/Regenerar PDF o XML | \`POST /documents/pdf/{trackId}\` · \`POST /documents/xml/{trackId}\` |
| Consultar saldo y consumo de membresía | \`GET /memberships/summary\` |

## Recursos de Contexto para Agentes de IA

- **Índice general (\`llms.txt\`):** ${siteUrl}/llms.txt
- **Documentación completa (\`llms-full.txt\`):** ${siteUrl}/llms-full.txt
- **Contrato OpenAPI 3.0 (\`openapi.json\`):** ${siteUrl}/openapi.json
- **Paquetes modulares por dominio:**
${AI_PACK_DEFINITIONS.map((p) => `  - **${p.title}:** ${siteUrl}/ai/packs/${p.id}.md`).join('\n')}
`;
}

function buildSkillMd(siteUrl, version) {
  return `---
name: matias-api-ubl21
description: Experto en integración con MATIAS API UBL 2.1 para Facturación Electrónica DIAN en Colombia (Factura Electrónica, POS, Notas Crédito/Débito, Sector Salud RIPS Res. 000948 de 2026, Nómina Electrónica, Documento Soporte, Eventos RADIAN, API Bulk y Webhooks). Úsalo siempre que el usuario escriba código, valide payloads JSON, configure autenticación PAT/OAuth2 o depure errores de facturación electrónica con MATIAS API.
---

# MATIAS API UBL 2.1 — Official Developer Skill

Este Skill dota a tu agente de IA del conocimiento técnico, reglas de negocio DIAN (UBL 2.1) y contratos oficiales de **MATIAS API**.

${buildCoreInstructions(siteUrl, version)}
`;
}

function buildAgentsMd(siteUrl, version) {
  return `# AGENTS.md — Guía de Integración MATIAS API UBL 2.1 (DIAN Colombia)

Este archivo define las reglas arquitectónicas, contratos HTTP y validaciones de negocio que cualquier agente de programación (Antigravity, Claude Code, OpenAI Codex, Cursor, GitHub Copilot, Windsurf) debe seguir al implementar o mantener la integración con **MATIAS API**.

${buildCoreInstructions(siteUrl, version)}
`;
}

function buildInstallSh(siteUrl) {
  return `#!/usr/bin/env bash
# Instalador en 1 paso del Skill y Contexto Oficial de MATIAS API UBL 2.1
# Compatible con Antigravity (.gemini/skills), Claude Code (.claude/skills), Cursor (.cursor/rules) y AGENTS.md

set -e

BASE_URL="${siteUrl}"
SKILL_DIR=".claude/skills/matias-api-ubl21"
AGY_SKILL_DIR=".gemini/skills/matias-api-ubl21"
CURSOR_DIR=".cursor/rules"

echo "🚀 Instalando Skill y Contexto de MATIAS API UBL 2.1..."

mkdir -p "$SKILL_DIR/references" "$AGY_SKILL_DIR" "$CURSOR_DIR"

curl -fsSL "$BASE_URL/ai/matias-api-skill/SKILL.md" -o "$SKILL_DIR/SKILL.md"
cp "$SKILL_DIR/SKILL.md" "$AGY_SKILL_DIR/SKILL.md"
curl -fsSL "$BASE_URL/ai/matias-api.cursorrules" -o "$CURSOR_DIR/matias-api.mdc"
curl -fsSL "$BASE_URL/ai/AGENTS.md" -o "$SKILL_DIR/references/AGENTS.md"
curl -fsSL "$BASE_URL/openapi.json" -o "$SKILL_DIR/references/openapi.json"

for pack in quickstart-auth-sandbox invoicing-pos-notes health-sector-rips payroll-support-doc radian-bulk-webhooks troubleshooting-errors; do
  curl -fsSL "$BASE_URL/ai/packs/$pack.md" -o "$SKILL_DIR/references/$pack.md"
done

echo "✅ Instalación completada:"
echo "   - Claude Code Skill: $SKILL_DIR/SKILL.md (+ paquetes en references/)"
echo "   - Antigravity Skill: $AGY_SKILL_DIR/SKILL.md"
echo "   - Cursor Rule:       $CURSOR_DIR/matias-api.mdc"
`;
}

function buildInstallPs1(siteUrl) {
  return `# Instalador en 1 paso del Skill y Contexto Oficial de MATIAS API UBL 2.1 (PowerShell)
# Compatible con Antigravity (.gemini/skills), Claude Code (.claude/skills) y Cursor (.cursor/rules)

$ErrorActionPreference = "Stop"
$BaseUrl = "${siteUrl}"
$SkillDir = ".claude/skills/matias-api-ubl21"
$AgySkillDir = ".gemini/skills/matias-api-ubl21"
$CursorDir = ".cursor/rules"

Write-Host "🚀 Instalando Skill y Contexto de MATIAS API UBL 2.1..." -ForegroundColor Cyan

New-Item -ItemType Directory -Force -Path "$SkillDir/references", $AgySkillDir, $CursorDir | Out-Null

Invoke-WebRequest -Uri "$BaseUrl/ai/matias-api-skill/SKILL.md" -OutFile "$SkillDir/SKILL.md" -UseBasicParsing
Copy-Item "$SkillDir/SKILL.md" "$AgySkillDir/SKILL.md" -Force
Invoke-WebRequest -Uri "$BaseUrl/ai/matias-api.cursorrules" -OutFile "$CursorDir/matias-api.mdc" -UseBasicParsing
Invoke-WebRequest -Uri "$BaseUrl/ai/AGENTS.md" -OutFile "$SkillDir/references/AGENTS.md" -UseBasicParsing
Invoke-WebRequest -Uri "$BaseUrl/openapi.json" -OutFile "$SkillDir/references/openapi.json" -UseBasicParsing

$Packs = @(
  "quickstart-auth-sandbox",
  "invoicing-pos-notes",
  "health-sector-rips",
  "payroll-support-doc",
  "radian-bulk-webhooks",
  "troubleshooting-errors"
)

foreach ($Pack in $Packs) {
  Invoke-WebRequest -Uri "$BaseUrl/ai/packs/$Pack.md" -OutFile "$SkillDir/references/$Pack.md" -UseBasicParsing
}

Write-Host "✅ Instalación completada con éxito:" -ForegroundColor Green
Write-Host "   - Claude Code Skill: $SkillDir/SKILL.md (+ referencias)"
Write-Host "   - Antigravity Skill: $AgySkillDir/SKILL.md"
Write-Host "   - Cursor Rule:       $CursorDir/matias-api.mdc"
`;
}

module.exports = function llmsTxtPlugin(context, options = {}) {
  const { siteConfig, siteDir } = context;
  const siteUrl = `${siteConfig.url.replace(/\/+$/, '')}${siteConfig.baseUrl.replace(/\/+$/, '')}`;
  const version = (siteConfig.customFields && siteConfig.customFields.version) || '3.9.2';
  const {
    sidebarId,
    title = siteConfig.title,
    summary = siteConfig.tagline,
    intro = '',
    rootSectionTitle = 'Documentación',
    continuationTitles = ['Referencia', 'Recursos'],
    optional = [],
  } = options;

  let pages = [];
  let sections = [];

  return {
    name: PLUGIN_NAME,

    async allContentLoaded({ allContent, actions }) {
      const docsPlugin = allContent['docusaurus-plugin-content-docs'];
      const loadedVersion = docsPlugin && docsPlugin.default && docsPlugin.default.loadedVersions[0];
      if (!loadedVersion) {
        throw new Error(`[${PLUGIN_NAME}] no se encontró el contenido del plugin de docs.`);
      }

      const docsById = new Map(
        loadedVersion.docs.filter((d) => !d.unlisted && !d.draft).map((d) => [d.id, d]),
      );
      const sidebarKey = sidebarId || Object.keys(loadedVersion.sidebars)[0];
      const sidebar = loadedVersion.sidebars[sidebarKey];
      if (!sidebar) {
        throw new Error(`[${PLUGIN_NAME}] no existe el sidebar «${sidebarKey}».`);
      }

      sections = collectSections(sidebar, docsById, rootSectionTitle, continuationTitles);
      const seen = new Set();
      pages = [];

      for (const section of sections) {
        for (const doc of section.docs) {
          if (seen.has(doc.id)) continue;
          seen.add(doc.id);

          const sourceFile = path.normalize(doc.source.replace(/^@site/, siteDir));
          let raw = '';
          try {
            raw = fsSync.readFileSync(sourceFile, 'utf8');
          } catch {
            raw = '';
          }
          const headings = raw ? extractHeadings(raw) : [];
          const cleanTitle = cleanLabel(doc.title);
          const fmDesc = (doc.frontMatter && doc.frontMatter.description) || '';

          pages.push({
            id: doc.id,
            title: doc.title,
            cleanTitle,
            section: section.title,
            frontMatterDescription: fmDesc,
            description: fmDesc ? cleanLabel(fmDesc) : '',
            permalink: doc.permalink,
            source: doc.source,
            markdownPath: markdownPathFor(doc.permalink),
            headings,
          });
        }
      }

      const searchIndex = pages.map((p) => ({
        id: p.id,
        title: p.cleanTitle || p.title,
        section: p.section,
        description: p.description,
        permalink: p.permalink,
        markdownPath: p.markdownPath,
        headings: p.headings.slice(0, 25),
      }));

      const aiPacks = AI_PACK_DEFINITIONS.map((pack) => {
        const matchedIds = pages
          .filter(
            (p) =>
              pack.docIds.includes(p.id) ||
              (pack.dirPrefixes && pack.dirPrefixes.some((prefix) => p.id.startsWith(prefix))),
          )
          .map((p) => p.id);
        return {
          id: pack.id,
          title: pack.title,
          shortTitle: pack.shortTitle,
          category: pack.category,
          icon: pack.icon,
          description: pack.description,
          url: `/ai/packs/${pack.id}.md`,
          docCount: matchedIds.length,
        };
      });

      // Disponible tanto en desarrollo (`docusaurus start`) como en producción (`docusaurus build`).
      actions.setGlobalData({
        markdownPaths: Object.fromEntries(pages.map((p) => [p.permalink, p.markdownPath])),
        searchIndex,
        aiPacks,
      });
    },

    async postBuild({ outDir }) {
      const sourceFile = (page) => path.normalize(page.source.replace(/^@site/, siteDir));
      const byPermalink = new Map(pages.map((p) => [p.permalink.replace(/\/+$/, ''), p]));
      const bySource = new Map(pages.map((p) => [sourceFile(p), p]));

      const makeAbsolutize = (page) => (url) => {
        if (!url || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(url)) return url;
        const [rawPath, hash = ''] = url.split('#');
        let linked = null;
        let resolved = null;
        if (!rawPath) {
          linked = page;
        } else if (/\.mdx?$/.test(rawPath) && !rawPath.startsWith('/')) {
          linked = bySource.get(path.normalize(path.join(path.dirname(sourceFile(page)), rawPath))) || null;
        }
        if (!linked && rawPath) {
          resolved = rawPath.startsWith('/')
            ? rawPath
            : new URL(rawPath, `https://docs.invalid${page.permalink}`).pathname;
          linked = byPermalink.get(resolved.replace(/\/+$/, '')) || null;
        }
        if (!linked) return `${siteUrl}${resolved}${hash ? `#${hash}` : ''}`;
        return hash ? `${siteUrl}${linked.permalink}#${hash}` : `${siteUrl}${linked.markdownPath}`;
      };

      const rendered = new Map();
      await Promise.all(
        pages.map(async (page) => {
          const raw = await fs.readFile(sourceFile(page), 'utf8');
          const pageUrl = `${siteUrl}${page.permalink}`;
          const absolutize = makeAbsolutize(page);
          let body = mdxToMarkdown(stripFrontMatter(raw), { pageUrl, absolutize });
          if (!/^#\s/.test(body)) body = `# ${page.title}\n\n${body}`;
          page.description = describe(page.frontMatterDescription, body);

          const header = [`<!-- Fuente: ${pageUrl} -->`, ''].join('\n');
          const markdown = `${header}${body}\n`;
          rendered.set(page.id, { page, body });

          const target = path.join(outDir, page.markdownPath);
          await fs.mkdir(path.dirname(target), { recursive: true });
          await fs.writeFile(target, markdown, 'utf8');
        }),
      );

      // 1. Generar paquetes modulares (/ai/packs/<id>.md)
      const packsOutDir = path.join(outDir, 'ai', 'packs');
      const staticPacksDir = path.join(siteDir, 'static', 'ai', 'packs');
      await fs.mkdir(packsOutDir, { recursive: true });
      await fs.mkdir(staticPacksDir, { recursive: true });

      const packManifestItems = [];
      for (const pack of AI_PACK_DEFINITIONS) {
        const packPages = pages.filter(
          (p) =>
            pack.docIds.includes(p.id) ||
            (pack.dirPrefixes && pack.dirPrefixes.some((prefix) => p.id.startsWith(prefix))),
        );
        const packLines = [
          `# ${title} — Paquete de Contexto IA: ${pack.title}`,
          '',
          `> ${pack.description}`,
          '',
          `- **Versión API:** v${version}`,
          `- **URL del paquete:** ${siteUrl}/ai/packs/${pack.id}.md`,
          `- **Índice general IA:** ${siteUrl}/llms.txt`,
          `- **Especificación OpenAPI 3:** ${siteUrl}/openapi.json`,
          '',
          '## Páginas incluidas en este paquete',
          '',
          ...packPages.map((p) => `- [${cleanLabel(p.title)}](${siteUrl}${p.markdownPath})`),
          '',
        ];

        for (const p of packPages) {
          const item = rendered.get(p.id);
          if (!item) continue;
          packLines.push('---', '', `<!-- Fuente: ${siteUrl}${p.permalink} -->`, '', item.body, '');
        }

        const packContent = `${packLines.join('\n').trim()}\n`;
        await fs.writeFile(path.join(packsOutDir, `${pack.id}.md`), packContent, 'utf8');
        await fs.writeFile(path.join(staticPacksDir, `${pack.id}.md`), packContent, 'utf8');

        packManifestItems.push({
          id: pack.id,
          title: pack.title,
          category: pack.category,
          description: pack.description,
          url: `${siteUrl}/ai/packs/${pack.id}.md`,
          docCount: packPages.length,
        });
      }

      // 2. Generar SKILL.md, AGENTS.md, CLAUDE.md, .cursorrules, copilot-instructions e instaladores CLI
      const skillContent = buildSkillMd(siteUrl, version);
      const agentsContent = buildAgentsMd(siteUrl, version);
      const installShContent = buildInstallSh(siteUrl);
      const installPs1Content = buildInstallPs1(siteUrl);

      const aiFiles = [
        { rel: path.join('SKILL.md'), content: skillContent, syncStatic: false },
        { rel: path.join('ai', 'matias-api-skill', 'SKILL.md'), content: skillContent, syncStatic: true },
        { rel: path.join('ai', 'AGENTS.md'), content: agentsContent, syncStatic: true },
        { rel: path.join('ai', 'CLAUDE.md'), content: agentsContent, syncStatic: true },
        { rel: path.join('ai', 'matias-api.cursorrules'), content: agentsContent, syncStatic: true },
        { rel: path.join('ai', 'copilot-instructions.md'), content: agentsContent, syncStatic: true },
        { rel: path.join('ai', 'install-skill.sh'), content: installShContent, syncStatic: true },
        { rel: path.join('ai', 'install-skill.ps1'), content: installPs1Content, syncStatic: true },
      ];

      for (const file of aiFiles) {
        const outTarget = path.join(outDir, file.rel);
        await fs.mkdir(path.dirname(outTarget), { recursive: true });
        await fs.writeFile(outTarget, file.content, 'utf8');

        if (file.syncStatic) {
          const staticTarget = path.join(siteDir, 'static', file.rel);
          await fs.mkdir(path.dirname(staticTarget), { recursive: true });
          await fs.writeFile(staticTarget, file.content, 'utf8');
        }
      }

      // 3. Manifiesto JSON de recursos IA (/ai/manifest.json)
      const manifest = {
        name: 'MATIAS API UBL 2.1 — AI & Developer Context Kit',
        version,
        generatedAt: new Date().toISOString(),
        resources: {
          llmsIndex: `${siteUrl}/llms.txt`,
          llmsFull: `${siteUrl}/llms-full.txt`,
          openApiSpec: `${siteUrl}/openapi.json`,
          officialSkill: `${siteUrl}/ai/matias-api-skill/SKILL.md`,
          agentsMd: `${siteUrl}/ai/AGENTS.md`,
          claudeMd: `${siteUrl}/ai/CLAUDE.md`,
          cursorRules: `${siteUrl}/ai/matias-api.cursorrules`,
          copilotInstructions: `${siteUrl}/ai/copilot-instructions.md`,
          installBash: `${siteUrl}/ai/install-skill.sh`,
          installPowerShell: `${siteUrl}/ai/install-skill.ps1`,
        },
        packs: packManifestItems,
      };
      const manifestJson = `${JSON.stringify(manifest, null, 2)}\n`;
      await fs.writeFile(path.join(outDir, 'ai', 'manifest.json'), manifestJson, 'utf8');
      await fs.writeFile(path.join(siteDir, 'static', 'ai', 'manifest.json'), manifestJson, 'utf8');

      // 4. llms.txt — https://llmstxt.org
      const index = [`# ${title}`, '', `> ${summary}`, ''];
      if (intro) index.push(intro.trim(), '');

      index.push('## AI Skills, Reglas para IDEs y Paquetes de Contexto', '');
      index.push(
        `- [Skill Oficial para Agentes (SKILL.md)](${siteUrl}/ai/matias-api-skill/SKILL.md): Skill compatible con Antigravity, Claude Code, Cursor y Codex`,
      );
      index.push(
        `- [Reglas Universales para Agentes (AGENTS.md)](${siteUrl}/ai/AGENTS.md): instrucciones de arquitectura, cálculos UBL 2.1 y manejo de errores DIAN`,
      );
      for (const pack of packManifestItems) {
        index.push(`- [Pack IA — ${pack.title}](${pack.url}): ${pack.description}`);
      }
      index.push('');

      for (const section of sections) {
        index.push(`## ${section.title}`, '');
        for (const doc of section.docs) {
          const page = pages.find((p) => p.id === doc.id);
          const desc = page.description ? `: ${page.description}` : '';
          index.push(`- [${cleanLabel(page.title)}](${siteUrl}${page.markdownPath})${desc}`);
        }
        index.push('');
      }
      if (optional.length) {
        index.push('## Optional', '');
        for (const link of optional) {
          const url = link.url.startsWith('/') ? `${siteUrl}${link.url}` : link.url;
          index.push(`- [${link.title}](${url})${link.description ? `: ${link.description}` : ''}`);
        }
        index.push('');
      }
      await fs.writeFile(path.join(outDir, 'llms.txt'), `${index.join('\n').trim()}\n`, 'utf8');

      // 5. llms-full.txt — todas las páginas en el orden del sidebar.
      const full = [`# ${title}`, '', `> ${summary}`, ''];
      if (intro) full.push(intro.trim(), '');
      for (const page of pages) {
        const { body } = rendered.get(page.id);
        full.push('---', '', `<!-- Fuente: ${siteUrl}${page.permalink} -->`, '', body, '');
      }
      await fs.writeFile(path.join(outDir, 'llms-full.txt'), `${full.join('\n').trim()}\n`, 'utf8');
    },
  };
};
