import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">
          API RESTful de Facturación Electrónica DIAN y Sector Salud en Colombia (UBL 2.1)
        </p>
        <div className={styles.badges}>
          <span className={styles.badge}>✅ 100% Conforme DIAN</span>
          <span className={styles.badge}>🚀 v3.6.0</span>
          <span className={styles.badge}>🏥 Sector Salud (Res. 000948 de 2026)</span>
          <span className={styles.badge}>📄 Factura v1.9</span>
        </div>
        <div className={styles.badges} style={{ marginTop: '0.5rem' }}>
          <span className={styles.badge}>🧪 Sandbox (20 módulos)</span>
          <span className={styles.badge}>📦 Envíos Masivos (Bulk)</span>
          <span className={styles.badge}>🔑 Auth PAT (JWT)</span>
          <span className={styles.badge}>🔄 Eventos RADIAN</span>
          <span className={styles.badge}>🔔 Webhooks HMAC</span>
        </div>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            📖 Iniciar Integración
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            to="/docs/sandbox/quickstart"
            style={{ marginLeft: '0.5rem' }}>
            🧪 Entorno Sandbox
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            to="/docs/endpoints"
            style={{ marginLeft: '0.5rem' }}>
            🔌 Endpoints API
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            to="/docs/jsons-billing/invoices"
            style={{ marginLeft: '0.5rem' }}>
            📄 Ejemplos JSON
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`FACTURACIÓN ELECTRÓNICA & SECTOR SALUD - ${siteConfig.title}`}
      description="API RESTful de Facturación Electrónica DIAN, Sector Salud (Resolución 000948 de 2026), POS, Nómina y Documento Soporte en Colombia">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
