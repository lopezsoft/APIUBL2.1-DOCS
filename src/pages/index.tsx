import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
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
} from 'react-icons/fa6';

import styles from './index.module.css';

/* ───── Hero ───── */
function HomepageHero() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={styles.hero}>
      <div className={styles.heroOrb1} aria-hidden="true" />
      <div className={styles.heroOrb2} aria-hidden="true" />
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <FaCircleCheck aria-hidden="true" />
            <span>100% Conforme DIAN · v{siteConfig.customFields?.version ?? '3.6.0'} · Sector Salud Res. 000948</span>
          </div>
          <Heading as="h1" className={styles.heroTitle}>
            {siteConfig.title}
          </Heading>
          <p className={styles.heroSubtitle}>
            La API más completa para <strong>Facturación Electrónica</strong>, Nómina, POS,{' '}
            Documento Soporte y <strong>Sector Salud</strong> en Colombia.{' '}
            100% UBL 2.1 — certificada DIAN.
          </p>
          <div className={styles.heroCtas}>
            <Link
              className={clsx('button button--lg', styles.ctaPrimary)}
              to="/docs/intro">
              Iniciar integración
              <FaArrowRight aria-hidden="true" />
            </Link>
            <Link
              className={clsx('button button--lg', styles.ctaSecondary)}
              to="/docs/sandbox/quickstart">
              Probar Sandbox gratis
            </Link>
          </div>
          <nav className={styles.heroLinks} aria-label="Accesos rápidos">
            <Link to="/docs/endpoints">Endpoints API</Link>
            <span aria-hidden="true">·</span>
            <Link to="/docs/jsons-billing/invoices">Ejemplos JSON</Link>
            <span aria-hidden="true">·</span>
            <Link to="/blog">Novedades</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

/* ───── Stats strip ───── */
const STATS = [
  { value: '20', label: 'Módulos Sandbox' },
  { value: '100%', label: 'Conforme DIAN' },
  { value: 'UBL 2.1', label: 'Estándar Colombia' },
  { value: 'v3.6.0', label: 'Versión actual' },
];

function StatsStrip() {
  return (
    <div className={styles.statsStrip}>
      <div className="container">
        <ul className={styles.statsGrid}>
          {STATS.map(({ value, label }) => (
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

/* ───── Capabilities grid ───── */
const CAPABILITIES = [
  { Icon: FaFileInvoice, label: 'Factura Electrónica', desc: 'FEV · CUFE' },
  { Icon: FaFileInvoiceDollar, label: 'Notas Crédito/Débito', desc: 'Ajustes contables' },
  { Icon: FaReceipt, label: 'POS Electrónico', desc: 'Documento Equivalente' },
  { Icon: FaFileMedical, label: 'Sector Salud', desc: 'Res. 000948 · RIPS' },
  { Icon: FaBriefcase, label: 'Nómina Electrónica', desc: 'ISS · SS · CUNE' },
  { Icon: FaFileContract, label: 'Documento Soporte', desc: 'DS · DSC' },
  { Icon: FaBolt, label: 'Eventos RADIAN', desc: 'Endoso · Mandato' },
  { Icon: FaLayerGroup, label: 'Envíos Masivos', desc: 'API Bulk asíncrona' },
];

function CapabilitiesSection() {
  return (
    <section className={styles.capabilities}>
      <div className="container">
        <header className={styles.sectionHeader}>
          <Heading as="h2">¿Qué puedes emitir?</Heading>
          <p>Soporte completo para todos los documentos electrónicos exigidos por la DIAN</p>
        </header>
        <ul className={styles.capGrid}>
          {CAPABILITIES.map(({ Icon, label, desc }) => (
            <li key={label} className={styles.capItem}>
              <Icon className={styles.capIcon} aria-hidden="true" />
              <strong>{label}</strong>
              <span>{desc}</span>
            </li>
          ))}
        </ul>
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
          <Heading as="h2">¿Listo para integrar?</Heading>
          <p>Comienza en minutos con nuestro Sandbox gratuito. Sin tarjeta de crédito.</p>
          <div className={styles.ctaButtons}>
            <Link className={clsx('button button--lg', styles.ctaButtonPrimary)} to="/docs/intro">
              Ver documentación
              <FaArrowRight aria-hidden="true" />
            </Link>
            <Link className={clsx('button button--lg', styles.ctaButtonOutline)} to="/docs/sandbox/quickstart">
              Probar Sandbox
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───── Page ───── */
export default function Home(): JSX.Element {
  return (
    <Layout
      title="Facturación Electrónica DIAN Colombia"
      description="API RESTful para Facturación Electrónica, Sector Salud RIPS, POS, Nómina y Documento Soporte en Colombia. 100% UBL 2.1 DIAN.">
      <HomepageHero />
      <StatsStrip />
      <main>
        <HomepageFeatures />
        <CapabilitiesSection />
        <CtaSection />
      </main>
    </Layout>
  );
}

