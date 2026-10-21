import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'MATIAS API',
  tagline: 'Integración fácil y rápida',
  favicon: 'img/favicon.ico',
  customFields: {
    version: '3.9.0',
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

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'es',
    locales: ['es'],
  },

  // Descubrimiento de la documentación para agentes de IA (llms.txt / OpenAPI).
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
  ],

  // Scripts que se cargan ANTES del bundle (para inyectar configuración)
  scripts: [
    {
      src: '/config.js',
      async: false,
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
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
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
          '- Autenticación: header `Authorization: Bearer {token}` (token de acceso personal), además de `Accept: application/json` y `Content-Type: application/json`.',
          '- Casas de Software: agregan `?client_uuid={uuid}` para operar en nombre de una empresa cliente.',
          '- Cada página de este índice está en Markdown plano (`.md`). También se obtiene enviando `Accept: text/markdown` a la URL HTML.',
          '- Especificación OpenAPI 3 de los endpoints públicos: https://docs.matias-api.com/openapi.json',
        ].join('\n'),
        rootSectionTitle: 'Inicio',
        optional: [
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
        // El SW instala y precachea el sitio para uso offline; se activa
        // solo cuando el usuario instala/usa la app como PWA.
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
    // Replace with your project's social card
    image: 'img/matias-api-social-card.png',
    navbar: {
      title: 'Inicio',
      logo: {
        alt: 'MATIAS API Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Integración',
        },
        { to: '/blog', label: 'Blog', position: 'left' },
        { to: '/docs/ai-ready', label: '🤖 Para IA', position: 'left' },
        {
          href: 'https://github.com/lopezsoft',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://www.youtube.com/channel/UCOR7YVBcqQuuGN6-jnPgm0g',
          label: 'YouTube',
          position: 'right',
        },
        {
          href: 'https://www.facebook.com/MatiasERP',
          label: 'Facebook',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentación',
          items: [
            {
              label: 'Introducción',
              to: '/docs/intro',
            },
            {
              label: 'Guías de Uso',
              to: '/docs/use-cases/simple-invoice',
            },
            {
              label: 'Endpoints API',
              to: '/docs/endpoints',
            },
            {
              label: 'Campos del Documento',
              to: '/docs/billing-fields',
            },
          ],
        },
        {
          title: 'Recursos',
          items: [
            {
              label: 'Ejemplos de Facturación',
              to: '/docs/jsons-billing/invoice',
            },
            {
              label: 'Nómina Electrónica',
              to: '/docs/payroll/payroll-fields',
            },
            {
              label: 'Glosario',
              to: '/docs/glossary',
            },
            {
              label: 'Documentación para IA (llms.txt)',
              to: '/docs/ai-ready',
            },
            {
              label: 'OpenAPI 3 (JSON)',
              href: 'https://docs.matias-api.com/openapi.json',
            },
            {
              label: 'Blog',
              to: '/blog',
            },
          ],
        },
        {
          title: 'Comunidad',
          items: [
            {
              label: 'Facebook',
              href: 'https://www.facebook.com/MatiasAppi',
            },
            {
              label: 'YouTube',
              href: 'https://www.youtube.com/channel/UCOR7YVBcqQuuGN6-jnPgm0g',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/lopezsoft',
            },
          ],
        },
        {
          title: 'Legal',
          items: [
            {
              label: 'Términos y Condiciones',
              href: 'https://matias-api.com/terminos',
            },
            {
              label: 'Política de Privacidad',
              href: 'https://matias-api.com/privacidad',
            },
            {
              label: 'Soporte',
              href: 'mailto:soporte@matias-api.com',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} LOPEZSOFT SAS - Todos los derechos reservados. | MATIAS API v3.9.0 🤖 Documentación para IA (llms.txt + OpenAPI) + Recepción RADIAN + Sector Salud (Res. 000948 de 2026) + Bulk`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
