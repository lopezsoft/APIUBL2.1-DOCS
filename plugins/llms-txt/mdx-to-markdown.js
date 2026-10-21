'use strict';

/**
 * Convierte el fuente MDX de una página de Docusaurus en Markdown plano
 * para agentes de IA, sin dependencias externas.
 *
 * - Los bloques de código (``` y ~~~) se copian intactos.
 * - En la prosa se eliminan import/export, comentarios y expresiones JSX, y
 *   los elementos HTML/JSX se traducen a su equivalente Markdown (Tabs,
 *   details/summary, enlaces, negritas, tablas HTML...).
 * - Los enlaces internos se vuelven absolutos (ctx.absolutize).
 */

// Se admite cualquier sangría: en este sitio hay bloques de código dentro de
// listas y de <details> sangrados.
const FENCE_RE = /^([ \t]*)(`{3,}|~{3,})/;

const DROP_WITH_CONTENT = new Set(['button', 'script', 'style', 'iframe', 'svg']);
const BLOCK_TAGS = new Set(['div', 'p', 'details', 'section', 'center', 'ul', 'ol']);
const BOLD_TAGS = new Set(['strong', 'b', 'summary']);

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

function decodeEntities(text) {
  return text.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (all, code) => {
    if (code[0] === '#') {
      const n = code[1] === 'x' || code[1] === 'X' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : all;
    }
    return ENTITIES[code.toLowerCase()] ?? all;
  });
}

function splitFences(source) {
  const segments = [];
  const lines = source.split(/\r?\n/);
  let prose = [];
  let code = null;
  let fence = null;
  let indent = 0;
  // El bloque sale sin la sangría de su apertura.
  const dedent = (line) => line.replace(new RegExp(`^[ \\t]{0,${indent}}`), '');

  for (const line of lines) {
    if (code) {
      const close = line.match(FENCE_RE);
      if (close && close[2][0] === fence[0] && close[2].length >= fence.length && line.trim() === close[2]) {
        code.push(close[2]);
        segments.push({ type: 'code', text: code.join('\n') });
        code = null;
      } else {
        code.push(dedent(line));
      }
      continue;
    }
    const open = line.match(FENCE_RE);
    if (open) {
      segments.push({ type: 'prose', text: prose.join('\n') });
      prose = [];
      indent = open[1].length;
      fence = open[2];
      code = [line.trimStart()];
      continue;
    }
    prose.push(line);
  }
  if (code) segments.push({ type: 'code', text: code.join('\n') });
  segments.push({ type: 'prose', text: prose.join('\n') });
  return segments;
}

/** Lee una etiqueta desde `<` respetando comillas y llaves (style={{...}}, onClick={() => ...}). */
function readTag(text, start) {
  let i = start + 1;
  let depth = 0;
  let quote = null;
  while (i < text.length) {
    const ch = text[i];
    if (quote) {
      if (ch === quote) quote = null;
    } else if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch;
    } else if (ch === '{') {
      depth++;
    } else if (ch === '}') {
      depth--;
    } else if (ch === '>' && depth <= 0) {
      return i;
    }
    i++;
  }
  return -1;
}

function parseTag(raw) {
  const m = raw.match(/^<\s*(\/)?\s*([A-Za-z][\w.:-]*)/);
  if (!m) return null;
  return {
    closing: Boolean(m[1]),
    name: m[2],
    lower: m[2].toLowerCase(),
    selfClosing: /\/\s*>$/.test(raw),
    attr(name) {
      const a = raw.match(new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|\\{\\s*["'\`]([^"'\`]*)["'\`]\\s*\\})`));
      return a ? (a[1] ?? a[2] ?? a[3]) : null;
    },
  };
}

/** Quita expresiones JSX sueltas: {' '}, {/* ... *\/}, {`texto`}. */
function stripExpressions(text) {
  return text
    .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, '')
    .replace(/\{\s*(["'`])((?:(?!\1).)*)\1\s*\}/g, '$2');
}

const collapse = (text) => text.replace(/\s+/g, ' ').trim();

/** Convierte una porción de prosa MDX a Markdown. */
function convertProse(text, ctx) {
  let input = text
    .replace(/<!--[\s\S]*?-->/g, '')
    .split('\n')
    .filter((line) => !/^\s*(import|export)\s.+$/.test(line))
    .join('\n');
  input = stripExpressions(input);

  let out = '';
  let i = 0;
  let dropDepth = 0;
  let dropName = null;
  let boldDepth = 0;
  const linkStack = [];
  let table = null; // { rows: number, row: string[]|null, cell: string|null }

  const emit = (s) => {
    if (dropDepth > 0) return;
    if (linkStack.length) linkStack[linkStack.length - 1].text += s;
    else if (table && table.cell !== null) table.cell += s;
    else if (table && table.row) {
      // Texto suelto entre celdas (sangría, saltos): se ignora.
    } else out += s;
  };

  while (i < input.length) {
    const ch = input[i];

    // Código en línea: se copia tal cual (puede contener <token>).
    if (ch === '`') {
      const run = input.slice(i).match(/^`+/)[0];
      const end = input.indexOf(run, i + run.length);
      if (end !== -1) {
        emit(input.slice(i, end + run.length));
        i = end + run.length;
        continue;
      }
    }

    if (ch === '<' && /[A-Za-z/]/.test(input[i + 1] || '')) {
      const end = readTag(input, i);
      const tag = end !== -1 ? parseTag(input.slice(i, end + 1)) : null;
      if (tag) {
        i = end + 1;
        handleTag(tag);
        continue;
      }
    }

    emit(ch);
    i++;
  }

  function handleTag(tag) {
    const { lower, name, closing, selfClosing } = tag;

    if (dropDepth > 0) {
      if (lower === dropName) {
        if (closing) dropDepth--;
        else if (!selfClosing) dropDepth++;
      }
      return;
    }
    if (DROP_WITH_CONTENT.has(lower)) {
      if (!closing && !selfClosing) {
        dropName = lower;
        dropDepth = 1;
      }
      return;
    }

    // Componentes de Docusaurus / propios (mayúscula inicial).
    if (/^[A-Z]/.test(name)) {
      if (name === 'Tabs') return;
      if (name === 'TabItem') {
        if (!closing) emit(`\n\n**${tag.attr('label') || tag.attr('value') || 'Opción'}**\n\n`);
        return;
      }
      if (!closing) {
        emit(`\n\n> _Herramienta interactiva «${name}»:_ disponible en la [versión web](${ctx.pageUrl}).\n\n`);
      }
      return;
    }

    // Negritas: summary/strong/b anidados producen un solo par de «**».
    if (BOLD_TAGS.has(lower)) {
      if (lower === 'summary') emit(closing ? '' : '\n\n');
      if (!closing) {
        if (boldDepth++ === 0) emit('**');
      } else if (boldDepth > 0 && --boldDepth === 0) {
        emit('**');
      }
      if (lower === 'summary' && closing) emit('\n\n');
      return;
    }

    switch (lower) {
      case 'em':
      case 'i':
        emit('_');
        return;
      case 'code':
        emit('`');
        return;
      case 'br':
        emit(table && table.cell !== null ? ' ' : '  \n');
        return;
      case 'hr':
        emit('\n\n---\n\n');
        return;
      case 'h1': case 'h2': case 'h3': case 'h4': case 'h5': case 'h6':
        emit(closing ? '\n\n' : `\n\n${'#'.repeat(Number(lower[1]))} `);
        return;
      case 'li':
        emit(closing ? '\n' : '\n- ');
        return;
      case 'table':
        if (closing) {
          table = null;
          out += '\n';
        } else {
          table = { rows: 0, row: null, cell: null };
          out += '\n\n';
        }
        return;
      case 'tr':
        if (!table) return;
        if (!closing) {
          table.row = [];
        } else if (table.row) {
          const cells = table.row.length ? table.row : [''];
          out += `| ${cells.join(' | ')} |\n`;
          if (table.rows === 0) out += `|${cells.map(() => '---').join('|')}|\n`;
          table.rows++;
          table.row = null;
        }
        return;
      case 'td':
      case 'th':
        if (!table || !table.row) return;
        if (!closing) table.cell = '';
        else {
          table.row.push(collapse(table.cell || '').replace(/\|/g, '\\|'));
          table.cell = null;
        }
        return;
      case 'img': {
        const src = tag.attr('src');
        if (src) emit(`![${tag.attr('alt') || ''}](${ctx.absolutize(src)})`);
        return;
      }
      case 'a':
        if (closing) {
          const link = linkStack.pop();
          if (link) emit(link.href ? `[${collapse(link.text)}](${ctx.absolutize(link.href)})` : link.text);
        } else if (!selfClosing) {
          linkStack.push({ href: tag.attr('href'), text: '' });
        }
        return;
      default:
        if (BLOCK_TAGS.has(lower)) emit('\n');
    }
  }

  while (linkStack.length) out += linkStack.shift().text;
  return decodeEntities(out);
}

// Texto del enlace: admite corchetes balanceados y código en línea ([`lines[].x`](...)).
const LINK_RE = /(!?\[(?:[^[\]`]|`[^`]*`|\[[^\]]*\])*\]\()([^)\s]+)(\s+"[^"]*")?\)/g;

function rewriteLinks(markdown, ctx) {
  return markdown.replace(LINK_RE, (all, head, url, title = '') => `${head}${ctx.absolutize(url)}${title})`);
}

/**
 * Limpia una porción de prosa: quita la sangría heredada de los bloques JSX
 * (con 4+ espacios Markdown la tomaría por código), espacios finales e ids
 * explícitos de encabezados. Respeta la sangría de las listas anidadas.
 */
function tidyProse(markdown) {
  return markdown
    .split('\n')
    .map((line) => {
      const isList = /^\s*(?:[-*+]|\d+[.)])\s/.test(line);
      let next = isList ? line : line.trimStart();
      next = next.replace(/[ \t]+$/, (ws) => (ws === '  ' && !isList ? ws : ''));
      return next.replace(/^(#{1,6} .*?)\s*\{#[\w-]+\}\s*$/, '$1');
    })
    .map((line) => (line.trim() === '' ? '' : line))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n');
}

/**
 * @param {string} source  Contenido del archivo .md/.mdx (sin front matter).
 * @param {{pageUrl: string, absolutize: (url: string) => string}} ctx
 */
function mdxToMarkdown(source, ctx) {
  return splitFences(source)
    .map((seg) => (seg.type === 'code' ? seg.text : tidyProse(rewriteLinks(convertProse(seg.text, ctx), ctx)).trim()))
    .filter(Boolean)
    .join('\n\n')
    .trim();
}

function stripFrontMatter(raw) {
  return raw.replace(/^﻿?---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');
}

module.exports = { mdxToMarkdown, stripFrontMatter };
