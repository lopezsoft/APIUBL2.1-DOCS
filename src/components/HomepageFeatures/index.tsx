import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import type { IconType } from 'react-icons';
import { FaPlug, FaHeartPulse, FaBolt, FaArrowRight } from 'react-icons/fa6';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Icon: IconType;
  description: ReactNode;
  link: string;
  linkText: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Sandbox Gratuito & Magic Values',
    Icon: FaPlug,
    description: (
      <>
        Documentación interactiva con ejemplos en 7 lenguajes. Prueba sin riesgos en nuestro{' '}
        <strong>Sandbox con 5.000 documentos anuales</strong> y simula respuestas DIAN mediante{' '}
        <strong>Magic Values</strong>.
      </>
    ),
    link: '/docs/sandbox/quickstart',
    linkText: 'Probar Sandbox ahora',
  },
  {
    title: 'Sector Salud (Res. 000948) & DIAN UBL 2.1',
    Icon: FaHeartPulse,
    description: (
      <>
        Soporte oficial de la <strong>Resolución 000948 de 2026</strong> (RIPS como soporte obligatorio de la FEV en salud), Documento Equivalente POS, Nómina Electrónica, Documento Soporte y RADIAN.
      </>
    ),
    link: '/docs/jsons-billing/invoice-health-sector',
    linkText: 'Ver guía Sector Salud',
  },
  {
    title: 'Alto Volumen, PATs & Webhooks HMAC',
    Icon: FaBolt,
    description: (
      <>
        Emisión asíncrona por lotes con la <strong>API Bulk</strong>, autenticación persistente mediante{' '}
        <strong>Personal Access Tokens</strong> y notificaciones en tiempo real firmadas con{' '}
        <strong>HMAC-SHA256</strong>.
      </>
    ),
    link: '/docs/bulk-documents',
    linkText: 'Explorar API Bulk y Webhooks',
  },
];

function Feature({ title, Icon, description, link, linkText }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className={styles.featureCard}>
        <div className={styles.iconWrapper}>
          <Icon className={styles.featureIcon} aria-hidden="true" />
        </div>
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
        <Link to={link} className={styles.featureLink}>
          {linkText} <FaArrowRight aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <header className={styles.sectionHeader}>
          <Heading as="h2">Arquitectura pensada para Desarrolladores y Casas de Software</Heading>
          <p>Desde tu primera prueba en Sandbox hasta la operación multi-empresa a gran escala</p>
        </header>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
