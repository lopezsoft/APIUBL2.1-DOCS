import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.badges}>
          <span className={styles.badge}>✅ 100% Conforme DIAN</span>
          <span className={styles.badge}>🚀 v1.4.2</span>
          <span className={styles.badge}>📄 Factura v1.9</span>
        </div>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            📖 Inicia con la integración
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            to="/docs/jsons-billing/invoice"
            style={{marginLeft: '1rem'}}>
            📝 Ver ejemplos
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            to="/docs/regulatory-framework/factura-electronica/intro"
            style={{marginLeft: '1rem'}}>
            📋 Marco Regulatorio
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`FACTURACIÓN ELECTRÓNICA ${siteConfig.title}`}
      description="API para facturacion electrónica en COLOMBIA">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
