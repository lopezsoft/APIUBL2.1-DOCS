import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'MATIAS API',
  tagline: 'Integración fácil y rápida',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://docs.matias-api.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'lopezsoft',
  projectName: 'docs-matias-api.github.io', // Usually your repo name.

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'es',
    locales: ['es'],
  },

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
              label: 'Marco Regulatorio DIAN',
              to: '/docs/regulatory-framework/factura-electronica/intro',
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
      copyright: `Copyright © ${new Date().getFullYear()} LOPEZSOFT SAS - Todos los derechos reservados. | MATIAS API v3.0.0 🚀 PAT + Webhooks + Membresías`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
