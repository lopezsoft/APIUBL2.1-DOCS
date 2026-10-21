#!/usr/bin/env node
/**
 * Genera static/openapi.json: la especificación OpenAPI PÚBLICA de MATIAS API
 * a partir del Swagger que produce el backend (l5-swagger).
 *
 * Uso:
 *   node scripts/build-public-openapi.js <ruta/api-docs.json> [salida]
 *   npm run openapi:public -- ../apidian/backend/storage/api-docs/api-docs.json
 *
 * Qué quita (no es contrato del integrador):
 *   - Operaciones de administración, analíticas, cupones, pagos Wompi y CRUD
 *     genérico del panel (EXCLUDED_TAGS / EXCLUDED_PATHS).
 *   - Servidores locales o de desarrollo: quedan producción y sandbox.
 *   - Esquemas, respuestas y parámetros de components que ya nadie referencia.
 *   - Frases de las descripciones que revelan implementación (tablas, stack,
 *     configuración); si algo queda, el script falla sin escribir.
 *
 * Después aplica scripts/openapi-overrides.json (correcciones del contrato
 * pendientes de llevar a las anotaciones del backend).
 */

'use strict';

const fs = require('fs');
const path = require('path');

const EXCLUDED_TAGS = new Set([
  'Admin Companies',
  'Administración',
  'Coupons Admin',
  'Membership Analytics',
  'CRUD Dinámico',
  'Payments - Wompi',
]);

const EXCLUDED_PATHS = [
  /\/admin(\/|$)/,
  /\/analytics(\/|$)/,
  /\/sns-notifications$/,
  /\/webhooks\/wompi/,
  /\/internal(\/|$)/,
];

// La URL de producción no se publica: se entrega al contratar (ver docs/intro.md).
const PUBLIC_SERVERS = [
  { url: 'https://sandbox-api.matias-api.com', description: 'Sandbox (gratuito, certificados de prueba, no se envía nada a la DIAN)' },
  {
    url: '{productionUrl}',
    description: 'Producción: URL base entregada al contratar el servicio',
    variables: {
      productionUrl: {
        default: 'https://sandbox-api.matias-api.com',
        description: 'Reemplázala por la URL de producción de tu contrato',
      },
    },
  },
];

const HTTP_METHODS = new Set(['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace']);

/**
 * Detalles de implementación que no deben salir en la especificación
 * pública: nombres de tablas y columnas, variables de entorno, claves de
 * configuración, stack y almacenamiento. Si una frase de una descripción los
 * contiene, la frase se retira; si aun así queda alguno (en ejemplos,
 * títulos...), el script falla y no escribe el archivo.
 */
const FORBIDDEN = [
  /\b[a-z]+(?:_[a-z]+)+\.(?!(?:pdf|xml|zip|json|png|jpe?g|gif|p12|pfx|xlsx?|csv|txt)\b)[a-z]+(?:_[a-z]+)*\b/, // tabla.columna (file_managers.id)
  /\b(?:companies|users|file_managers|shipping_history|document_receptions|event_masters|subscriptions?)\.[a-z_]+\b/,
  /\btablas?\s+[a-z]+_[a-z_]+/i, // «tabla claim_concept»
  /\b(?:pivote|file_managers|file_manager_companies|subscription_consumptions|auxiliary_companies|document_reception_[a-z_]+|health_[a-z_]+)\b/,
  /\b(?:bulk|events|mailbox|memberships|notifications)\.[a-z]+_[a-z_]+\b/, // claves de config
  /\bLaravel\b|\bPassport\b|\bLengthAwarePaginator\b|\bEloquent\b/,
  /\bS3\b|disco p[úu]blico|almacenamiento local del servidor|storage\//i,
  /a[úu]n no tiene la columna|no captura excepciones|manejador global/i,
];

// Ejemplos con datos personales reales → datos ficticios.
const EXAMPLE_REPLACEMENTS = [
  [/LOPEZ GOMEZ LEWIS OSWALDO|LEWIS LOPEZ GOMEZ/gi, 'CLIENTE EJEMPLO SAS'],
  [/\b1063279307\b/g, '900000000'],
  [/[\w.+-]+@(?:gmail|hotmail|outlook|yahoo)\.com/gi, 'cliente@ejemplo.com'],
  [/@matiasinbox\.com\.co\b/g, '@buzon.ejemplo.com'],
  [/\bmatiasinbox\.com\.co\b/g, 'buzon.ejemplo.com'],
];

// Solo en la prosa: en enums y ejemplos las MAYÚSCULAS son códigos públicos
// (POSSIBLY_SENT, RECEPTION_NOT_IN_PLAN).
const FORBIDDEN_IN_PROSE = [
  /\b[A-Z][A-Z0-9]{2,}_[A-Z0-9_]*(?:DOMAIN|URL|KEY|SECRET|TOKEN|ENABLED|PATH|HOST|PORT|DAYS|LIMIT|QUEUE|DRIVER)\b/, // variables de entorno
];

const isForbidden = (text, prose = false) =>
  FORBIDDEN.some((re) => re.test(text)) || (prose && FORBIDDEN_IN_PROSE.some((re) => re.test(text)));

/** Quita de una descripción las frases que revelan implementación. */
function sanitizeDescription(text) {
  const sentences = text.split(/(?<=[.;])\s+|\n+/);
  return sentences.filter((s) => !isForbidden(s, true)).join(' ').replace(/\s{2,}/g, ' ').trim();
}

/** Recorre la especificación saneando descripciones y ejemplos. */
function sanitize(node) {
  if (Array.isArray(node)) return node.map(sanitize);
  if (!node || typeof node !== 'object') {
    if (typeof node !== 'string') return node;
    return EXAMPLE_REPLACEMENTS.reduce((s, [re, value]) => s.replace(re, value), node);
  }
  const out = {};
  for (const [key, value] of Object.entries(node)) {
    let next = sanitize(value);
    if ((key === 'description' || key === 'summary') && typeof next === 'string') {
      next = sanitizeDescription(next);
      if (!next) continue;
    }
    out[key] = next;
  }
  return out;
}

/** Lista los textos que aún contienen un patrón prohibido. */
function findLeaks(node, where = '$', found = []) {
  if (typeof node === 'string') {
    const prose = /\.(?:description|summary)$/.test(where);
    if (isForbidden(node, prose)) found.push(`${where}: ${node.slice(0, 120)}`);
  } else if (node && typeof node === 'object') {
    for (const [key, value] of Object.entries(node)) {
      if (key === '$ref') continue;
      findLeaks(value, `${where}.${key}`, found);
    }
  }
  return found;
}

function fail(message) {
  process.stderr.write(`✖ ${message}\n`);
  process.exit(1);
}

function isExcluded(route, operation) {
  if (EXCLUDED_PATHS.some((re) => re.test(route))) return true;
  return (operation.tags || []).some((tag) => EXCLUDED_TAGS.has(tag));
}

/** Recoge todas las $ref alcanzables desde `node`, siguiendo components. */
function collectRefs(root, spec) {
  const used = new Set();
  const stack = [root];
  while (stack.length) {
    const node = stack.pop();
    if (!node || typeof node !== 'object') continue;
    if (Array.isArray(node)) {
      stack.push(...node);
      continue;
    }
    for (const [key, value] of Object.entries(node)) {
      if (key === '$ref' && typeof value === 'string' && value.startsWith('#/components/')) {
        if (used.has(value)) continue;
        used.add(value);
        const [, , section, name] = value.split('/');
        const target = spec.components && spec.components[section] && spec.components[section][name];
        if (target) stack.push(target);
      } else {
        stack.push(value);
      }
    }
  }
  return used;
}

/**
 * Correcciones de la especificación pública mientras no se corrigen las
 * anotaciones @OA del backend: JSON Merge Patch (RFC 7396) en
 * scripts/openapi-overrides.json. Un objeto se fusiona, un null borra la
 * clave y cualquier otro valor (arreglos incluidos) reemplaza.
 */
const OVERRIDES_FILE = path.join(__dirname, 'openapi-overrides.json');

function mergePatch(target, patch) {
  if (!patch || typeof patch !== 'object' || Array.isArray(patch)) return patch;
  const out = target && typeof target === 'object' && !Array.isArray(target) ? { ...target } : {};
  for (const [key, value] of Object.entries(patch)) {
    if (value === null) delete out[key];
    else out[key] = mergePatch(out[key], value);
  }
  return out;
}

function main() {
  const [input, output = path.join(__dirname, '..', 'static', 'openapi.json')] = process.argv.slice(2);
  if (!input) fail('Falta la ruta del Swagger del backend (storage/api-docs/api-docs.json).');
  if (!fs.existsSync(input)) fail(`No existe ${input}`);

  const spec = JSON.parse(fs.readFileSync(input, 'utf8'));
  if (!spec.openapi || !spec.paths) fail('El archivo no parece una especificación OpenAPI 3.');

  const removed = [];
  const paths = {};
  for (const [route, item] of Object.entries(spec.paths)) {
    const kept = {};
    for (const [key, value] of Object.entries(item)) {
      if (HTTP_METHODS.has(key) && isExcluded(route, value)) {
        removed.push(`${key.toUpperCase()} ${route}`);
        continue;
      }
      kept[key] = value;
    }
    if (Object.keys(kept).some((k) => HTTP_METHODS.has(k))) paths[route] = kept;
  }

  const usedTags = new Set();
  for (const item of Object.values(paths)) {
    for (const [key, op] of Object.entries(item)) {
      if (HTTP_METHODS.has(key)) (op.tags || []).forEach((t) => usedTags.add(t));
    }
  }

  const publicSpec = {
    ...spec,
    info: {
      ...spec.info,
      title: 'MATIAS API — Facturación Electrónica DIAN (UBL 2.1)',
      'x-docs': 'https://docs.matias-api.com/llms.txt',
    },
    servers: PUBLIC_SERVERS,
    tags: (spec.tags || []).filter((t) => usedTags.has(t.name)),
    paths,
  };

  // Poda de components que solo usaban las operaciones retiradas.
  if (spec.components) {
    const used = collectRefs({ paths, security: spec.security }, spec);
    const components = {};
    for (const [section, entries] of Object.entries(spec.components)) {
      if (section === 'securitySchemes') {
        components[section] = entries;
        continue;
      }
      const keptEntries = Object.fromEntries(
        Object.entries(entries).filter(([name]) => used.has(`#/components/${section}/${name}`)),
      );
      if (Object.keys(keptEntries).length) components[section] = keptEntries;
    }
    publicSpec.components = components;
  }

  let clean = sanitize(publicSpec);
  if (fs.existsSync(OVERRIDES_FILE)) {
    clean = mergePatch(clean, JSON.parse(fs.readFileSync(OVERRIDES_FILE, 'utf8')));
  }
  const leaks = findLeaks({ info: clean.info, tags: clean.tags, paths: clean.paths, components: clean.components });
  if (leaks.length) {
    fail(
      `La especificación conserva ${leaks.length} detalle(s) interno(s); corrige las anotaciones del backend o las reglas de saneamiento:\n  ${leaks.slice(0, 40).join('\n  ')}`,
    );
  }

  fs.writeFileSync(output, `${JSON.stringify(clean, null, 2)}\n`, 'utf8');

  const operations = Object.values(paths).reduce(
    (n, item) => n + Object.keys(item).filter((k) => HTTP_METHODS.has(k)).length,
    0,
  );
  process.stdout.write(
    `✔ ${path.relative(process.cwd(), output)}: ${operations} operaciones públicas, ${removed.length} internas retiradas.\n`,
  );
}

main();
