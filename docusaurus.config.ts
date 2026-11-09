import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'MATIAS API',
  tagline: 'Facturación Electrónica DIAN UBL 2.1 — Documentación Oficial & AI Hub',
  favicon: 'img/favicon.ico',
  customFields: {
    version: '3.10.0',
  },

  // Set the production url of your site here
  url: 'https://docs.matias-api.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',
  // Con barra final, como las sirve Apache (DirectorySlash): las canónicas,
  // el sitemap y los enlaces dejan de pasar por un 301.
  trailingSlash: true,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'lopezsoft',
  projectName: 'docs-matias-api.github.io', // Usually your repo name.

  onBrokenLinks: 'warn',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'es',
    locales: ['es'],
  },

  // Descubrimiento de la documentación y Skills para agentes de IA (llms.txt / SKILL.md / OpenAPI).
  // La versión Markdown de cada página va como rel="alternate" (AiPageActions).
  headTags: [
    {
      tagName: 'link',
      attributes: { rel: 'describedby', type: 'text/plain', href: '/llms.txt', title: 'llms.txt' },
    },
    {
      tagName: 'link',
      attributes: { rel: 'service-desc', type: 'application/json', href: '/openapi.json', title: 'OpenAPI' },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'alternate',
        type: 'text/markdown',
        href: '/ai/matias-api-skill/SKILL.md',
        title: 'MATIAS API Official AI Skill (SKILL.md)',
      },
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Los informes técnicos de cada release (docs/AAAA-MM-DD-HHMM-*.md)
          // son internos: viven en docs/ pero no se publican. Se conservan
          // las exclusiones por defecto de Docusaurus.
          exclude: [
            '**/_*.{js,jsx,ts,tsx,md,mdx}',
            '**/_*/**',
            '**/*.test.{js,jsx,ts,tsx}',
            '**/__tests__/**',
            '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]-*.md',
          ],
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      './plugins/llms-txt',
      {
        sidebarId: 'tutorialSidebar',
        title: 'MATIAS API UBL 2.1',
        summary:
          'API REST de facturación electrónica para Colombia (DIAN, UBL 2.1): factura electrónica, POS electrónico, documento soporte, notas crédito/débito, nómina electrónica, eventos RADIAN y sector salud (Res. 000948 de 2026).',
        intro: [
          'Guía rápida para agentes de IA:',
          '',
          '- Base URL: en los ejemplos, `{{url}}` es la base URL de la API. Sandbox (gratuito, sin envío a la DIAN): `https://sandbox-api.matias-api.com/api/ubl2.1`. La de producción se entrega al contratar el servicio.',
          '- Cuentas separadas: Sandbox y Producción requieren cuentas y tokens independientes.',
          '- Autenticación: header `Authorization: Bearer {token}` (token OAuth2 o Personal Access Token), además de `Accept: application/json` y `Content-Type: application/json`.',
          '- Casas de Software: crean empresas clientes con `POST /company/{uuid}/customer` y agregan `?client_uuid={uuid}` para operar en su nombre.',
          '- Skill Oficial para agentes (Antigravity, Claude Code, Cursor, Codex): https://docs.matias-api.com/ai/matias-api-skill/SKILL.md',
          '- Cada página de este índice está en Markdown plano (`.md`). También se obtiene enviando `Accept: text/markdown` a la URL HTML.',
          '- Especificación OpenAPI 3 de los endpoints públicos: https://docs.matias-api.com/openapi.json',
        ].join('\n'),
        rootSectionTitle: 'Inicio',
        optional: [
          { title: 'Skill Oficial para Agentes (SKILL.md)', url: '/ai/matias-api-skill/SKILL.md', description: 'reglas de negocio UBL 2.1, cálculos y manejo de concurrencia DIAN' },
          { title: 'Estándar Universal AGENTS.md', url: '/ai/AGENTS.md', description: 'instrucciones para agentes de programación en repositorios' },
          { title: 'Reglas para Cursor IDE (.cursorrules)', url: '/ai/matias-api.cursorrules', description: 'reglas listas para Cursor' },
          { title: 'Manifiesto JSON de Recursos IA', url: '/ai/manifest.json', description: 'índice programático de skills y paquetes modulares' },
          { title: 'Documentación completa en un solo archivo', url: '/llms-full.txt', description: 'todas las páginas de este índice concatenadas' },
          { title: 'Especificación OpenAPI 3 (JSON)', url: '/openapi.json', description: 'endpoints públicos, parámetros y esquemas' },
          { title: 'Colección Postman Sandbox Quickstart (JSON)', url: '/sandbox-quickstart.postman_collection.json', description: 'flujo mínimo de integración contra el sandbox' },
          { title: 'Colección Postman completa (JSON)', url: '/postman_collection.json', description: 'todos los endpoints con ejemplos; archivo grande (más de 5 MB)' },
          { title: 'Notas de versión', url: '/blog', description: 'cambios de la API y de la documentación' },
        ],
      },
    ],
    [
      '@docusaurus/plugin-pwa',
      {
        debug: false,
        offlineModeActivationStrategies: [
          'appInstalled',
          'standalone',
          'queryString',
        ],
        pwaHead: [
          { tagName: 'link', rel: 'icon', href: '/img/icons/icon-192.png' },
          { tagName: 'link', rel: 'manifest', href: '/manifest.json' },
          { tagName: 'meta', name: 'theme-color', content: '#3c6ab2' },
          { tagName: 'meta', name: 'apple-mobile-web-app-capable', content: 'yes' },
          {
            tagName: 'meta',
            name: 'apple-mobile-web-app-status-bar-style',
            content: '#3c6ab2',
          },
          {
            tagName: 'link',
            rel: 'apple-touch-icon',
            href: '/img/icons/apple-touch-icon.png',
          },
          {
            tagName: 'meta',
            name: 'msapplication-TileImage',
            content: '/img/icons/icon-192.png',
          },
          { tagName: 'meta', name: 'msapplication-TileColor', content: '#3c6ab2' },
        ],
      },
    ],
  ],

  themeConfig: {
    image: 'img/matias-api-social-card.png',
    navbar: {
      title: 'MATIAS API',
      logo: {
        alt: 'MATIAS API Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          to: '/docs/intro',
          label: '🚀 Inicio Rápido',
          position: 'left',
        },
        {
          to: '/docs/endpoints',
          label: '🔌 Endpoints',
          position: 'left',
        },
        {
          to: '/docs/jsons-billing',
          label: '📦 Ejemplos JSON',
          position: 'left',
        },
        {
          to: '/docs/use-cases/common-errors',
          label: '🛠️ Errores Comunes',
          position: 'left',
        },
        {
          to: '/docs/sandbox/quickstart',
          label: '🧪 Sandbox',
          position: 'left',
        },
        {
          to: '/docs/interactive-tools',
          label: '🧮 Herramientas',
          position: 'left',
        },
        {
          to: '/docs/ai-ready',
          label: '🤖 AI Hub & Skills',
          position: 'left',
        },
        { to: '/blog', label: 'Novedades', position: 'left' },
        {
          type: 'search',
          position: 'right',
        },
        {
          href: 'https://github.com/lopezsoft',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Guías e Integración',
          items: [
            {
              label: 'Introducción y Entornos',
              to: '/docs/intro',
            },
            {
              label: 'Sandbox Gratuito',
              to: '/docs/sandbox/quickstart',
            },
            {
              label: 'Referencia de Endpoints',
              to: '/docs/endpoints',
            },
            {
              label: 'Campos del Documento (Salud RIPS)',
              to: '/docs/billing-fields',
            },
            {
              label: 'Envío Masivo (API Bulk)',
              to: '/docs/bulk-documents',
            },
          ],
        },
        {
          title: 'Soporte y Validadores',
          items: [
            {
              label: 'Errores Comunes y Soluciones',
              to: '/docs/use-cases/common-errors',
            },
            {
              label: 'Estructura de Respuestas DIAN',
              to: '/docs/response-json',
            },
            {
              label: 'Validador NIT, JSON y Totales',
              to: '/docs/interactive-tools',
            },
            {
              label: 'Glosario y Catálogos DIAN',
              to: '/docs/glossary',
            },
            {
              label: 'Ejemplos JSON Facturación',
              to: '/docs/jsons-billing/invoice',
            },
          ],
        },
        {
          title: 'AI Hub & Skills Descargables',
          items: [
            {
              label: 'Centro AI Hub & Generador Prompts',
              to: '/docs/ai-ready',
            },
            {
              label: 'Descargar SKILL.md Oficial',
              href: 'https://docs.matias-api.com/ai/matias-api-skill/SKILL.md',
            },
            {
              label: 'Descargar AGENTS.md',
              href: 'https://docs.matias-api.com/ai/AGENTS.md',
            },
            {
              label: 'Índice para Agentes (llms.txt)',
              href: 'https://docs.matias-api.com/llms.txt',
            },
            {
              label: 'Especificación OpenAPI 3 (JSON)',
              href: 'https://docs.matias-api.com/openapi.json',
            },
          ],
        },
        {
          title: 'Comunidad y Legal',
          items: [
            {
              label: 'Notas de Versión (Blog)',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/lopezsoft',
            },
            {
              label: 'YouTube',
              href: 'https://www.youtube.com/channel/UCOR7YVBcqQuuGN6-jnPgm0g',
            },
            {
              label: 'Términos y Condiciones',
              href: 'https://matias-api.com/terminos',
            },
            {
              label: 'Soporte Técnico',
              href: 'mailto:soporte@matias-api.com',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} LOPEZSOFT SAS - Todos los derechos reservados. | MATIAS API v3.10.0 🤖 AI Hub (SKILL.md + AGENTS.md + Context Packs + llms.txt + OpenAPI) · DIAN UBL 2.1`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
