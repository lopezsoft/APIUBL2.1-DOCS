'use strict';

/**
 * Plugin local: documentación legible por agentes de IA (estándar llms.txt).
 *
 * En el build genera, a partir de las páginas del sidebar:
 *   /llms.txt         índice en Markdown con enlace a cada página
 *   /llms-full.txt    toda la documentación consolidada en un solo archivo
 *   /docs/<ruta>.md   cada página en Markdown plano (p.ej. /docs/intro.md)
 *
 * Solo entran las páginas del sidebar: los informes internos de release que
 * viven en docs/ y no están en el menú no se publican para agentes.
 */

const fs = require('fs/promises');
const path = require('path');
const { mdxToMarkdown, stripFrontMatter } = require('./mdx-to-markdown');

const PLUGIN_NAME = 'docusaurus-plugin-llms-txt';

/** Quita emojis y símbolos decorativos de las etiquetas del sidebar. */
function cleanLabel(label) {
  return String(label || '')
    .replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
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
        // Un doc de primer nivel después de una categoría abre una sección
        // nueva, para que el índice conserve el orden del sidebar.
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
 * párrafo de prosa de la página ya convertida (la que Docusaurus deriva sola
 * arrastra restos como «introduccion-autenticacion}»).
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

  // Primero la prosa fuera de avisos (:::tip, :::warning...); si la página
  // no tiene, el primer aviso.
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

module.exports = function llmsTxtPlugin(context, options = {}) {
  const { siteConfig, siteDir } = context;
  const siteUrl = `${siteConfig.url.replace(/\/+$/, '')}${siteConfig.baseUrl.replace(/\/+$/, '')}`;
  const {
    sidebarId,
    title = siteConfig.title,
    summary = siteConfig.tagline,
    intro = '',
    rootSectionTitle = 'Documentación',
    // Títulos para los docs de primer nivel que siguen a una categoría.
    continuationTitles = ['Referencia', 'Recursos'],
    optional = [],
  } = options;

  let pages = [];
  let sections = [];

  return {
    name: PLUGIN_NAME,

    allContentLoaded({ allContent, actions }) {
      const docsPlugin = allContent['docusaurus-plugin-content-docs'];
      const version = docsPlugin && docsPlugin.default && docsPlugin.default.loadedVersions[0];
      if (!version) {
        throw new Error(`[${PLUGIN_NAME}] no se encontró el contenido del plugin de docs.`);
      }

      const docsById = new Map(
        version.docs.filter((d) => !d.unlisted && !d.draft).map((d) => [d.id, d]),
      );
      const sidebarKey = sidebarId || Object.keys(version.sidebars)[0];
      const sidebar = version.sidebars[sidebarKey];
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
          pages.push({
            id: doc.id,
            title: doc.title,
            frontMatterDescription: (doc.frontMatter && doc.frontMatter.description) || '',
            description: '',
            permalink: doc.permalink,
            source: doc.source,
            markdownPath: markdownPathFor(doc.permalink),
          });
        }
      }

      // La barra «Usar con IA» de cada página solo aparece si la página tiene
      // versión Markdown. Los .md se escriben en postBuild, que no corre en
      // `docusaurus start`: en desarrollo la barra no se muestra.
      const isBuild = process.env.NODE_ENV === 'production';
      actions.setGlobalData({
        markdownPaths: isBuild ? Object.fromEntries(pages.map((p) => [p.permalink, p.markdownPath])) : {},
      });
    },

    async postBuild({ outDir }) {
      const sourceFile = (page) => path.normalize(page.source.replace(/^@site/, siteDir));
      const byPermalink = new Map(pages.map((p) => [p.permalink.replace(/\/+$/, ''), p]));
      const bySource = new Map(pages.map((p) => [sourceFile(p), p]));

      // Enlaces internos → URL absoluta. Sin ancla, a la versión .md de la
      // página destino; con ancla, a la página HTML, que es donde existen los
      // ids (en llms-full.txt un «#ancla» suelto sería ambiguo). Acepta rutas
      // del sitio (/docs/x), relativas (../x), a archivo (./x.md) y «#ancla».
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

          const header = [
            `<!-- Fuente: ${pageUrl} -->`,
            '',
          ].join('\n');
          const markdown = `${header}${body}\n`;
          rendered.set(page.id, { page, body });

          const target = path.join(outDir, page.markdownPath);
          await fs.mkdir(path.dirname(target), { recursive: true });
          await fs.writeFile(target, markdown, 'utf8');
        }),
      );

      // llms.txt — https://llmstxt.org
      const index = [`# ${title}`, '', `> ${summary}`, ''];
      if (intro) index.push(intro.trim(), '');
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

      // llms-full.txt — todas las páginas en el orden del sidebar.
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
