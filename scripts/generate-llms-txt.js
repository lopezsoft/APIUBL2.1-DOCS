/**
 * Generador de static/llms.txt y static/llms-full.txt
 * Estándar https://llmstxt.org/ para lectura directa por agentes de IA (ChatGPT, Claude, Cursor, etc.).
 */
const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, '..', 'docs');
const STATIC_DIR = path.join(__dirname, '..', 'static');
const BASE_URL = 'https://docs.matias-api.com';

function getMarkdownFiles(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getMarkdownFiles(fullPath, fileList);
    } else if (
      (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) &&
      !entry.name.match(/^\d{4}-\d{2}-\d{2}/)
    ) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

function cleanFrontmatter(content) {
  return content.replace(/^---[\s\S]*?---\s*/, '').trim();
}

function extractTitle(content, fallbackName) {
  const titleMatch =
    content.match(/^#\s+(.+)$/m) || content.match(/title:\s*['"]?([^'"\n]+)['"]?/);
  const rawTitle = titleMatch ? titleMatch[1].trim() : fallbackName;
  return rawTitle.replace(/\s*\{#[^}]+\}\s*$/, '').trim();
}

function buildLlmsFiles() {
  const files = getMarkdownFiles(DOCS_DIR);
  const indexLines = [
    '# MATIAS API UBL 2.1 - Documentación Oficial para IA (LLMs)',
    '',
    '> API de Facturación Electrónica, POS Electrónico, Documento Soporte, Nómina Electrónica, Eventos RADIAN y Sector Salud (Res. 000948 de 2026) en Colombia (DIAN UBL 2.1).',
    '',
    '## Archivos Consolidados para IA',
    `- [Documentación Completa en un solo archivo Markdown (llms-full.txt)](${BASE_URL}/llms-full.txt)`,
    `- [Colección Postman Completa (JSON)](${BASE_URL}/postman_collection.json)`,
    `- [Colección Postman Sandbox Quickstart (JSON)](${BASE_URL}/sandbox-quickstart.postman_collection.json)`,
    '',
    '## Índice de Documentación',
  ];

  const fullParts = [
    '# MATIAS API UBL 2.1 - Documentación Técnica Completa',
    `URL Oficial: ${BASE_URL}`,
    '================================================================================\n',
  ];

  for (const filePath of files) {
    const raw = fs.readFileSync(filePath, 'utf8');
    const relPath = path.relative(DOCS_DIR, filePath).replace(/\\/g, '/');
    const docSlug = relPath.replace(/\.(mdx|md)$/, '');
    const docUrl = `${BASE_URL}/docs/${docSlug}`;
    const title = extractTitle(raw, docSlug);
    const cleaned = cleanFrontmatter(raw);

    indexLines.push(`- [${title}](${docUrl})`);
    fullParts.push(`\n\n---`);
    fullParts.push(`# DOCUMENTO: ${title}`);
    fullParts.push(`URL: ${docUrl}`);
    fullParts.push(`---\n`);
    fullParts.push(cleaned);
  }

  fs.writeFileSync(path.join(STATIC_DIR, 'llms.txt'), indexLines.join('\n'), 'utf8');
  fs.writeFileSync(path.join(STATIC_DIR, 'llms-full.txt'), fullParts.join('\n'), 'utf8');
  console.log(`✅ Generados static/llms.txt y static/llms-full.txt (${files.length} documentos).`);
}

buildLlmsFiles();
