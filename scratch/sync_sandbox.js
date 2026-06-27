const fs = require('fs');

// 1. Process Magic Values MD
const newMagicValuesPath = 'sandbox/sandbox/MAGIC-VALUES.md';
let newContent = fs.readFileSync(newMagicValuesPath, 'utf8');

// Fix encoding issues
const replacements = {
  'Ã³': 'ó',
  'Ã­': 'í',
  'Ã©': 'é',
  'Ã¡': 'á',
  'Ãº': 'ú',
  'Ã±': 'ñ',
  'Ãš': 'Ú',
  'â€”': '—',
  'âœ…': '✅',
  'Ã“': 'Ó',
  'Ã ': 'Á',
  'Ã‰': 'É',
  'Ã…': 'Å',
  'Ã': 'í' // fallback for some weird Ã
};

for (const [bad, good] of Object.entries(replacements)) {
  newContent = newContent.split(bad).join(good);
}

// Convert JSON examples to <details> tags (optional but good for UX)
newContent = newContent.replace(/## Respuesta de Ejemplo — ([^\n]+)\n\n```json\n([\s\S]*?)```/g, '<details>\n<summary>📝 Respuesta de Ejemplo — $1</summary>\n\n```json\n$2```\n\n</details>');

// Re-add frontmatter and URL info
const frontmatter = `---
sidebar_position: 2
title: Magic Values
description: 32 valores de simulación para probar diferentes respuestas de la DIAN en el sandbox.
---

# Magic Values — MATIAS API Sandbox

---

:::info URL del Sandbox
Para todas las peticiones a este entorno de pruebas, debes reemplazar el parámetro \`{{SANDBOX_URL}}\` por la URL oficial del sandbox:
**\`https://sandbox-api.matias-api.com\`**
:::

---

El sandbox soporta **32 magic values** que permiten simular diferentes respuestas de la DIAN sin necesidad de endpoints especiales.
`;

// Remove everything before "## Uso" in new content to avoid duplicates
const usoIndex = newContent.indexOf('## Uso');
if (usoIndex !== -1) {
  newContent = newContent.substring(usoIndex);
}

fs.writeFileSync('docs/sandbox/magic-values.md', frontmatter + '\n' + newContent, 'utf8');

// 2. Sync Postman Collection
const postmanSource = 'sandbox/postman/sandbox-quickstart.postman_collection.json';
const postmanDest = 'static/sandbox-quickstart.postman_collection.json';

fs.copyFileSync(postmanSource, postmanDest);

console.log('Sync completed successfully.');
