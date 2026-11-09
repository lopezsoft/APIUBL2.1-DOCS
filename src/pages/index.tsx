import React, { useState, useCallback, type ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import { openGlobalSearch } from '@site/src/theme/SearchBar';
import {
  FaArrowRight,
  FaCircleCheck,
  FaFileInvoice,
  FaFileInvoiceDollar,
  FaReceipt,
  FaFileMedical,
  FaBriefcase,
  FaFileContract,
  FaBolt,
  FaLayerGroup,
  FaMagnifyingGlass,
  FaRobot,
  FaDownload,
  FaRegCopy,
  FaCheck,
  FaShieldHalved,
  FaCalculator,
  FaBuildingUser,
  FaKey,
  FaWrench,
  FaBookOpen,
  FaCode,
} from 'react-icons/fa6';

import styles from './index.module.css';

/* ───── Hero con Buscador Instantáneo y Accesos Rápidos ───── */
const QUICK_SEARCH_CHIPS = [
  { label: '🔐 Login responde 404', query: '404 login' },
  { label: '🏢 Casa de Software (?client_uuid)', query: 'client_uuid' },
  { label: '🚦 Error 409 / Regla 90 DIAN', query: 'regla 90' },
  { label: '🏥 Sector Salud RIPS', query: 'salud rips' },
  { label: '🧮 Calcular DV / Totales', query: 'calculadora totales' },
  { label: '🤖 Descargar Skill IA', query: 'skill ia' },
];

function HomepageHero() {
  const { siteConfig } = useDocusaurusContext();
  const version = String(siteConfig.customFields?.version ?? '3.9.2');

  return (
    <header className={styles.hero}>
      <div className={styles.heroOrb1} aria-hidden="true" />
      <div className={styles.heroOrb2} aria-hidden="true" />
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <FaCircleCheck aria-hidden="true" />
            <span>
              100% Conforme DIAN UBL 2.1 · v{version} · Sector Salud Res. 000948 · AI-Ready (Skills + llms.txt)
            </span>
          </div>

          <Heading as="h1" className={styles.heroTitle}>
            Centro de Desarrolladores <span>{siteConfig.title}</span>
          </Heading>

          <p className={styles.heroSubtitle}>
            Integra <strong>Facturación Electrónica</strong>, POS, Nómina, Documento Soporte,{' '}
            <strong>Sector Salud (RIPS)</strong> y Eventos RADIAN en minutos. Documentación diseñada para humanos y agentes de IA.
          </p>

          {/* Barra de búsqueda prominente en el Hero */}
          <div className={styles.heroSearchBox}>
            <button
              type="button"
              className={styles.heroSearchTrigger}
              onClick={() => openGlobalSearch('')}
              aria-label="Abrir buscador instantáneo de documentación (Ctrl+K)"
            >
              <FaMagnifyingGlass className={styles.heroSearchIcon} aria-hidden="true" />
              <span className={styles.heroSearchText}>
                Buscar endpoints, errores DIAN (404, 409, Regla 90), campos JSON, RIPS...
              </span>
              <kbd className={styles.heroSearchKbd}>Ctrl K</kbd>
            </button>

            <div className={styles.heroChips} aria-label="Consultas frecuentes">
              <span className={styles.heroChipsLabel}>Búsquedas rápidas:</span>
              {QUICK_SEARCH_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  className={styles.heroChip}
                  onClick={() => openGlobalSearch(chip.query)}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.heroCtas}>
            <Link className={clsx('button button--lg', styles.ctaPrimary)} to="/docs/intro">
              Iniciar integración paso a paso
              <FaArrowRight aria-hidden="true" />
            </Link>
            <Link className={clsx('button button--lg', styles.ctaSecondary)} to="/docs/sandbox/quickstart">
              Probar Sandbox gratis
            </Link>
            <Link className={clsx('button button--lg', styles.ctaAi)} to="/docs/ai-ready">
              <FaRobot aria-hidden="true" />
              Descargar Skill & Kit IA
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ───── Stats Strip ───── */
function StatsStrip() {
  const { siteConfig } = useDocusaurusContext();
  const version = String(siteConfig.customFields?.version ?? '3.9.2');

  const stats = [
    { value: '21', label: 'Módulos de Endpoints' },
    { value: '6 Packs', label: 'Skills & Contexto IA' },
    { value: 'UBL 2.1', label: 'Normativa DIAN Vigente' },
    { value: `v${version}`, label: 'Versión Actual' },
  ];

  return (
    <div className={styles.statsStrip}>
      <div className="container">
        <ul className={styles.statsGrid}>
          {stats.map(({ value, label }) => (
            <li key={label} className={styles.statItem}>
              <span className={styles.statNumber}>{value}</span>
              <span className={styles.statLabel}>{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ───── Ruta de Integración en 4 Pasos ───── */
const ROADMAP_STEPS = [
  {
    step: 'Paso 1',
    title: 'Entornos y Registro',
    desc: 'Comprende la separación entre tu cuenta de Sandbox (pruebas gratuitas) y Producción. Registra tu cuenta y verifica tu correo.',
    link: '/docs/intro#cuentas-separadas-prod-sandbox',
    cta: 'Ver guía de entornos',
  },
  {
    step: 'Paso 2',
    title: 'Autenticación (PAT / OAuth2)',
    desc: 'Obtén tu token Bearer con POST /auth/login o crea un Personal Access Token (PAT). Si eres Casa de Software, usa ?client_uuid.',
    link: '/docs/endpoints/intro-auth',
    cta: 'Configurar autenticación',
  },
  {
    step: 'Paso 3',
    title: 'Arma y Valida tu JSON',
    desc: 'Toma un payload real de ejemplo y verifica tus sumatorias de impuestos y dígito verificador NIT con las calculadoras integradas.',
    link: '/docs/interactive-tools',
    cta: 'Abrir validadores en vivo',
  },
  {
    step: 'Paso 4',
    title: 'Emite, Consulta y Escala',
    desc: 'Envía documentos con uuid anti-duplicados, maneja estados DIAN (Regla 90 / 409) y recibe notificaciones en tiempo real vía Webhooks.',
    link: '/docs/response-json',
    cta: 'Ver respuestas y estados',
  },
];

function IntegrationRoadmapSection() {
  return (
    <section className={styles.roadmapSection}>
      <div className="container">
        <header className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>Ruta del Desarrollador</span>
          <Heading as="h2">Integra MATIAS API en 4 pasos claros</Heading>
          <p>Sigue este orden recomendado para pasar de cero a producción sin contratiempos ni rechazos DIAN</p>
        </header>
        <div className={styles.roadmapGrid}>
          {ROADMAP_STEPS.map((item) => (
            <Link key={item.step} to={item.link} className={styles.roadmapCard}>
              <span className={styles.roadmapBadge}>{item.step}</span>
              <Heading as="h3" className={styles.roadmapTitle}>
                {item.title}
              </Heading>
              <p className={styles.roadmapDesc}>{item.desc}</p>
              <span className={styles.roadmapLink}>
                {item.cta} <FaArrowRight aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───── Catálogo de Documentos Emisibles (100% Accionables) ───── */
const CAPABILITIES = [
  {
    Icon: FaFileInvoice,
    label: 'Factura Electrónica (FEV)',
    desc: 'Nacional, Exportación, AIU, Mandato, Consorcios y Contingencia',
    endpointUrl: '/docs/endpoints/invoices-pos',
    jsonUrl: '/docs/jsons-billing/invoice',
  },
  {
    Icon: FaFileInvoiceDollar,
    label: 'Notas Crédito y Débito',
    desc: 'Con referencia a factura, sin referencia y ajustes contables',
    endpointUrl: '/docs/endpoints/invoices-pos#notas-credito-debito',
    jsonUrl: '/docs/jsons-billing/credit-note',
  },
  {
    Icon: FaReceipt,
    label: 'POS Electrónico',
    desc: 'Documento Equivalente P.O.S., notas de ajuste POS y consumidor final',
    endpointUrl: '/docs/endpoints/invoices-pos#documentos-equivalentes',
    jsonUrl: '/docs/jsons-pos/pos',
  },
  {
    Icon: FaFileMedical,
    label: 'Sector Salud (RIPS)',
    desc: 'Resolución 000948 de 2026 · Objeto health, modalidades de pago y FEV salud',
    endpointUrl: '/docs/billing-fields#health',
    jsonUrl: '/docs/jsons-billing/invoice-health-sector',
  },
  {
    Icon: FaBriefcase,
    label: 'Nómina Electrónica',
    desc: 'Nómina individual, notas de reemplazo y eliminación (CUNE)',
    endpointUrl: '/docs/endpoints/payroll',
    jsonUrl: '/docs/payroll/payroll-fields',
  },
  {
    Icon: FaFileContract,
    label: 'Documento Soporte',
    desc: 'Adquisiciones a no obligados (residentes, no residentes y notas)',
    endpointUrl: '/docs/endpoints/support-documents',
    jsonUrl: '/docs/jsons-support-document/support-document',
  },
  {
    Icon: FaBolt,
    label: 'Eventos RADIAN',
    desc: 'Acuse de recibo (030), recibo del bien (032), aceptación (033) y rechazo (031)',
    endpointUrl: '/docs/endpoints/events-radian',
    jsonUrl: '/docs/endpoints/events-radian',
  },
  {
    Icon: FaLayerGroup,
    label: 'Envíos Masivos (Bulk)',
    desc: 'Procesamiento por lotes asíncrono de alto volumen y Webhooks',
    endpointUrl: '/docs/endpoints/bulk-documents',
    jsonUrl: '/docs/bulk-documents',
  },
];

function CapabilitiesSection() {
  return (
    <section className={styles.capabilities}>
      <div className="container">
        <header className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>Documentación por Módulo</span>
          <Heading as="h2">¿Qué documento electrónico vas a emitir?</Heading>
          <p>Selecciona cualquier módulo para ir directamente a su contrato de Endpoint o a sus ejemplos JSON</p>
        </header>
        <div className={styles.capGrid}>
          {CAPABILITIES.map(({ Icon, label, desc, endpointUrl, jsonUrl }) => (
            <div key={label} className={styles.capCard}>
              <div className={styles.capCardTop}>
                <div className={styles.capIconWrap}>
                  <Icon className={styles.capIcon} aria-hidden="true" />
                </div>
                <div>
                  <Heading as="h3" className={styles.capTitle}>
                    <Link to={endpointUrl}>{label}</Link>
                  </Heading>
                  <p className={styles.capDesc}>{desc}</p>
                </div>
              </div>
              <div className={styles.capActions}>
                <Link to={endpointUrl} className={styles.capActionPrimary}>
                  <FaBookOpen aria-hidden="true" /> Endpoint API
                </Link>
                <Link to={jsonUrl} className={styles.capActionSecondary}>
                  <FaCode aria-hidden="true" /> Ver JSON
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───── Centro de Respuestas Rápidas (Top Soporte Técnico) ───── */
type SupportCategoryKey = 'auth' | 'dian' | 'math' | 'special';

const SUPPORT_TABS: Array<{
  key: SupportCategoryKey;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  items: Array<{
    badge: string;
    question: string;
    answer: string;
    codeHint?: string;
    link: string;
    linkLabel: string;
  }>;
}> = [
  {
    key: 'auth',
    label: '🔐 Autenticación y Entornos',
    Icon: FaKey,
    items: [
      {
        badge: 'HTTP 404 en Login',
        question: '¿Por qué POST /auth/login devuelve 404 si ya me registré?',
        answer:
          'Dos causas principales: 1) Después de POST /register debes abrir el enlace de verificación enviado a tu correo; sin verificar el email, el login responde HTTP 404. 2) Estás usando credenciales de Producción en la URL de Sandbox (o viceversa).',
        codeHint: 'POST {{url}}/email/verification-notification  // Reenviar correo de activación',
        link: '/docs/intro#obtener-el-token-de-acceso',
        linkLabel: 'Ver flujo de login y verificación',
      },
      {
        badge: 'Sandbox vs Producción',
        question: '¿Mis credenciales de Producción funcionan en el Sandbox?',
        answer:
          'No. Sandbox (https://sandbox-api.matias-api.com/api/ubl2.1) y Producción son plataformas completamente independientes. Debes crear una cuenta separada en https://sandbox-auth.matias-api.com/ para tus pruebas.',
        codeHint: 'Sandbox: https://sandbox-api.matias-api.com/api/ubl2.1',
        link: '/docs/intro#cuentas-separadas-prod-sandbox',
        linkLabel: 'Ver diferencias entre entornos',
      },
      {
        badge: 'Tokens de Larga Duración',
        question: '¿Cómo evito que mi integración falle por vencimiento de token?',
        answer:
          'Usa Personal Access Tokens (PAT) mediante POST /tokens. Permiten configurar una vigencia de 1 a 365 días, crear múltiples tokens por servidor y revocarlos selectivamente. Además, envía siempre el header Accept: application/json.',
        codeHint: 'Authorization: Bearer {pat_token} | Accept: application/json',
        link: '/docs/endpoints/intro-auth#personal-access-tokens',
        linkLabel: 'Guía de Personal Access Tokens',
      },
    ],
  },
  {
    key: 'dian',
    label: '🚦 Errores 409, 503 y Regla 90 DIAN',
    Icon: FaShieldHalved,
    items: [
      {
        badge: 'Regla de Oro DIAN',
        question: '¿Qué hago ante 409 DOCUMENT_IN_TRANSMISSION, 503 o DOCUMENT_POSSIBLY_SENT?',
        answer:
          '¡NUNCA reemitas el documento con otro consecutivo! Esos códigos indican que el número está en curso o pudo haber llegado a la DIAN. Consulta primero su estado con GET /documents/{uuid} o GET /status?prefix=...&number=...',
        codeHint: 'GET {{url}}/documents/{uuid}  // Verifica antes de reintentar',
        link: '/docs/use-cases/common-errors#errores-de-transmision-concurrente-validacion-pendiente-y-posible-envio',
        linkLabel: 'Ver matriz de concurrencia DIAN',
      },
      {
        badge: 'Regla 90 Conciliada',
        question: '¿Qué significa el warning ALREADY_AUTHORIZED_RECOVERED?',
        answer:
          'Cuando la DIAN informa "Regla 90: documento procesado anteriormente", MATIAS API concilia automáticamente el consecutivo. Si el contenido coincide, devuelve ALREADY_AUTHORIZED_RECOVERED y el documento es 100% válido.',
        codeHint: 'warnings[].code === "ALREADY_AUTHORIZED_RECOVERED" -> Documento válido',
        link: '/docs/use-cases/common-errors#avisos-de-regla-90-already_authorized_-already_processed_not_confirmed',
        linkLabel: 'Ver manejo de Regla 90',
      },
      {
        badge: 'Avisos PDF / Email',
        question: 'Recibí PDF_NOT_GENERATED o EMAIL_NOT_SENT, ¿debo enviar la factura otra vez?',
        answer:
          'No. La factura YA fue aceptada y validada por la DIAN. Solo falló un paso posterior no bloqueante. Regenera el PDF o reenvía el correo usando los endpoints dedicados.',
        codeHint: 'POST {{url}}/documents/pdf/{trackId}?regenerate=1',
        link: '/docs/response-json#warnings',
        linkLabel: 'Ver regeneración de PDF y correo',
      },
    ],
  },
  {
    key: 'math',
    label: '🧮 Cálculos UBL 2.1 y NIT',
    Icon: FaCalculator,
    items: [
      {
        badge: 'NIT y Dígito Verificador',
        question: '¿Cómo debo enviar el NIT (dni) y cómo se calcula el DV?',
        answer:
          'En los campos dni de empresa o cliente envía ÚNICAMENTE los dígitos del NIT, sin guiones, puntos ni dígito de verificación. Para validaciones en tu ERP usa nuestro Validador Módulo 11.',
        codeHint: '"dni": "900123456"  // Correcto (sin "-8" ni puntos)',
        link: '/docs/interactive-tools#validador-nit',
        linkLabel: 'Abrir Validador de NIT Módulo 11',
      },
      {
        badge: 'Cuadre de Totales',
        question: '¿Por qué recibo error en tax_inclusive_amount o payable_amount?',
        answer:
          'En UBL 2.1: tax_inclusive_amount = tax_exclusive_amount + suma(tax_totals[*].tax_amount). Las retenciones (with_holding_tax_total) son informativas y NO se restan de tax_inclusive_amount ni de payable_amount.',
        codeHint: 'tax_inclusive_amount = tax_exclusive_amount + Σ(tax_amount)',
        link: '/docs/interactive-tools#calculadora-totales',
        linkLabel: 'Probar Calculadora de Totales',
      },
      {
        badge: 'Facturas de Exportación',
        question: '¿Qué reglas cambian al emitir una factura de exportación (tipo 02 / id 8)?',
        answer:
          'Las facturas de exportación no pueden usar pesos colombianos (COP) ni incluir IVA. Usa la moneda extranjera (ej. currency_id: 272 para USD) y envía tax_totals: [].',
        codeHint: '"type_document_id": 8, "currency_id": 272, "tax_totals": []',
        link: '/docs/use-cases/export-scenarios',
        linkLabel: 'Ver guía de exportación',
      },
    ],
  },
  {
    key: 'special',
    label: '🏢 Casas de Software, Salud y Bulk',
    Icon: FaBuildingUser,
    items: [
      {
        badge: 'Multi-Tenant (?client_uuid)',
        question: 'Soy Casa de Software: ¿cómo creo clientes y emito facturas por ellos?',
        answer:
          'No uses POST /register para tus clientes (devolverá 422). Crea cada empresa cliente con POST /company/{tu_uuid}/customer usando tu token, y agrega ?client_uuid={uuid_cliente} al emitir o consultar documentos.',
        codeHint: 'POST {{url}}/invoice?client_uuid=dde72910-eb42-11ef-9b27-...',
        link: '/docs/endpoints/company#clientes-casa-software',
        linkLabel: 'Documentación para Casas de Software',
      },
      {
        badge: 'Sector Salud (Res. 000948)',
        question: '¿Cómo envío los campos RIPS y recaudos (copagos/cuotas moderadoras)?',
        answer:
          'Incluye el objeto health en tu JSON de factura o nota crédito con la información de prestador, modalidad de pago, cobertura, usuarios y recaudos según la Resolución 000948 de 2026.',
        codeHint: '"health": { "operation_type": "SS-CUFE", "provider_code": "...", "users": [...] }',
        link: '/docs/jsons-billing/invoice-health-sector',
        linkLabel: 'Ver JSON de Sector Salud RIPS',
      },
      {
        badge: 'Requisitos Previos DIAN',
        question: '¿Qué debo configurar antes de emitir mi primer documento en Producción?',
        answer:
          'Antes de invocar la API en producción debes haber registrado en el portal web o por API: 1) Certificado digital (.p12/.pfx), 2) Software ID/PIN de la DIAN y 3) Resolución de numeración vigente.',
        codeHint: 'Certificado + Software DIAN + Resolución de Facturación',
        link: '/docs/intro#nota-importante',
        linkLabel: 'Ver lista de requisitos previos',
      },
    ],
  },
];

function SupportCenterSection() {
  const [activeTab, setActiveTab] = useState<SupportCategoryKey>('auth');
  const currentCategory = SUPPORT_TABS.find((t) => t.key === activeTab) ?? SUPPORT_TABS[0];

  return (
    <section className={styles.supportSection} id="respuestas-rapidas">
      <div className="container">
        <header className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>
            <FaWrench aria-hidden="true" /> Centro de Solución Inmediata
          </span>
          <Heading as="h2">Respuestas a las dudas más frecuentes de soporte</Heading>
          <p>
            Resuelve en segundos los bloqueos más habituales de integración sin esperar un ticket de soporte
          </p>
        </header>

        <div className={styles.supportTabs} role="tablist" aria-label="Categorías de soporte frecuente">
          {SUPPORT_TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={activeTab === key}
              className={`${styles.supportTab} ${activeTab === key ? styles.supportTabActive : ''}`}
              onClick={() => setActiveTab(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className={styles.supportGrid} role="tabpanel">
          {currentCategory.items.map((item) => (
            <article key={item.question} className={styles.supportCard}>
              <span className={styles.supportBadge}>{item.badge}</span>
              <Heading as="h3" className={styles.supportQuestion}>
                {item.question}
              </Heading>
              <p className={styles.supportAnswer}>{item.answer}</p>
              {item.codeHint && (
                <pre className={styles.supportCode}>
                  <code>{item.codeHint}</code>
                </pre>
              )}
              <Link to={item.link} className={styles.supportLink}>
                {item.linkLabel} <FaArrowRight aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>

        <div className={styles.supportFooterBar}>
          <span>¿Buscas un código HTTP o mensaje específico de rechazo?</span>
          <div className={styles.supportFooterButtons}>
            <Link to="/docs/use-cases/common-errors" className={styles.supportBtnPrimary}>
              Ver Matriz Completa de Errores Comunes
            </Link>
            <Link to="/docs/interactive-tools" className={styles.supportBtnSecondary}>
              Validar NIT / JSON / Totales
            </Link>
            <Link to="/docs/glossary" className={styles.supportBtnSecondary}>
              Explorar Glosario DIAN (A-Z)
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───── Sección AI-Ready & Skills Descargables en el Home ───── */
function AiIntegrationSection() {
  const { siteConfig } = useDocusaurusContext();
  const siteUrl = siteConfig.url.replace(/\/+$/, '');
  const [copiedCmd, setCopiedCmd] = useState(false);

  const installCommand = `curl -fsSL ${siteUrl}/ai/install-skill.sh | bash`;

  const copyCommand = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(installCommand);
      setCopiedCmd(true);
      window.setTimeout(() => setCopiedCmd(false), 2400);
    } catch {
      // Fallback
    }
  }, [installCommand]);

  return (
    <section className={styles.aiSection}>
      <div className="container">
        <div className={styles.aiBanner}>
          <div className={styles.aiLeft}>
            <span className={styles.aiEyebrow}>
              <FaRobot aria-hidden="true" /> Documentación AI-Ready & Skills Oficiales
            </span>
            <Heading as="h2" className={styles.aiHeading}>
              Conecta tu IA a MATIAS API y programa tu integración 10x más rápido
            </Heading>
            <p className={styles.aiDescription}>
              Descarga nuestro <strong>Skill oficial (<code>SKILL.md</code>)</strong>, archivos de reglas (
              <code>AGENTS.md</code>, <code>.cursorrules</code>, <code>CLAUDE.md</code>) y paquetes de contexto modulares en Markdown para que{' '}
              <strong>Antigravity, Claude Code, Cursor, Copilot o ChatGPT</strong> conozcan cada campo UBL 2.1 sin alucinar.
            </p>

            <div className={styles.aiTerminalBox}>
              <div className={styles.aiTerminalLabel}>Instalar Skill + Referencias en tu proyecto (1 paso):</div>
              <div className={styles.aiTerminalRow}>
                <code>{installCommand}</code>
                <button type="button" className={styles.aiCopyBtn} onClick={copyCommand}>
                  {copiedCmd ? (
                    <>
                      <FaCheck aria-hidden="true" /> Copiado
                    </>
                  ) : (
                    <>
                      <FaRegCopy aria-hidden="true" /> Copiar
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className={styles.aiQuickDownloads}>
              <a
                href="/ai/matias-api-skill/SKILL.md"
                download="SKILL.md"
                className={styles.aiDownloadPill}
              >
                <FaDownload aria-hidden="true" /> SKILL.md
              </a>
              <a
                href="/ai/AGENTS.md"
                download="AGENTS.md"
                className={styles.aiDownloadPill}
              >
                <FaDownload aria-hidden="true" /> AGENTS.md
              </a>
              <a
                href="/ai/matias-api.cursorrules"
                download=".cursorrules"
                className={styles.aiDownloadPill}
              >
                <FaDownload aria-hidden="true" /> .cursorrules
              </a>
              <a
                href="/llms-full.txt"
                download="matias-api-llms-full.txt"
                className={styles.aiDownloadPill}
              >
                <FaDownload aria-hidden="true" /> llms-full.txt
              </a>
              <a
                href="/openapi.json"
                download="matias-api-openapi.json"
                className={styles.aiDownloadPill}
              >
                <FaDownload aria-hidden="true" /> openapi.json
              </a>
            </div>
          </div>

          <div className={styles.aiRight}>
            <div className={styles.aiPacksBox}>
              <Heading as="h3" className={styles.aiPacksTitle}>
                📦 Paquetes Modulares para IA
              </Heading>
              <p className={styles.aiPacksSub}>
                Descarga solo el contexto del módulo que estás integrando:
              </p>
              <ul className={styles.aiPacksList}>
                <li>
                  <a href="/ai/packs/quickstart-auth-sandbox.md" download>
                    <span>🚀 Inicio Rápido, Auth & Sandbox</span>
                    <FaDownload aria-hidden="true" />
                  </a>
                </li>
                <li>
                  <a href="/ai/packs/invoicing-pos-notes.md" download>
                    <span>🧾 Facturación, POS & Notas</span>
                    <FaDownload aria-hidden="true" />
                  </a>
                </li>
                <li>
                  <a href="/ai/packs/health-sector-rips.md" download>
                    <span>🏥 Sector Salud RIPS (Res. 000948)</span>
                    <FaDownload aria-hidden="true" />
                  </a>
                </li>
                <li>
                  <a href="/ai/packs/payroll-support-doc.md" download>
                    <span>💼 Nómina & Documento Soporte</span>
                    <FaDownload aria-hidden="true" />
                  </a>
                </li>
                <li>
                  <a href="/ai/packs/radian-bulk-webhooks.md" download>
                    <span>⚡ RADIAN, API Bulk & Webhooks</span>
                    <FaDownload aria-hidden="true" />
                  </a>
                </li>
                <li>
                  <a href="/ai/packs/troubleshooting-errors.md" download>
                    <span>🛠️ Errores DIAN, Regla 90 & Glosario</span>
                    <FaDownload aria-hidden="true" />
                  </a>
                </li>
              </ul>
              <Link to="/docs/ai-ready" className={styles.aiHubBtn}>
                Abrir AI Hub & Generador de Prompts <FaArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───── Bottom CTA ───── */
function CtaSection() {
  return (
    <section className={styles.ctaSection}>
      <div className="container">
        <div className={styles.ctaContent}>
          <Heading as="h2">¿Listo para emitir tu primer documento electrónico?</Heading>
          <p>
            Crea tu cuenta en el Sandbox gratuito en menos de 2 minutos y recibe 5.000 documentos de prueba por 1 año.
          </p>
          <div className={styles.ctaButtons}>
            <Link className={clsx('button button--lg', styles.ctaButtonPrimary)} to="/docs/intro">
              Comenzar integración
              <FaArrowRight aria-hidden="true" />
            </Link>
            <Link className={clsx('button button--lg', styles.ctaButtonOutline)} to="/docs/sandbox/quickstart">
              Probar Sandbox gratis
            </Link>
            <Link className={clsx('button button--lg', styles.ctaButtonOutline)} to="/docs/ai-ready">
              Descargar Skills IA
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───── Page ───── */
export default function Home(): ReactNode {
  return (
    <Layout
      title="Documentación Oficial y AI Hub — Facturación Electrónica DIAN"
      description="Centro de Desarrolladores de MATIAS API UBL 2.1: Facturación Electrónica, Sector Salud RIPS, POS, Nómina, Documento Soporte, Eventos RADIAN y Skills para IA.">
      <HomepageHero />
      <StatsStrip />
      <main>
        <IntegrationRoadmapSection />
        <CapabilitiesSection />
        <SupportCenterSection />
        <AiIntegrationSection />
        <HomepageFeatures />
        <CtaSection />
      </main>
    </Layout>
  );
}
