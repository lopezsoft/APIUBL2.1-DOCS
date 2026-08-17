import clsx from 'clsx';
import type { IconType } from 'react-icons';
import { FaPlug, FaHeartPulse, FaBolt } from 'react-icons/fa6';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Icon: IconType;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Fácil Integración & Sandbox',
    Icon: FaPlug,
    description: (
      <>
        Documentación interactiva con snippets en cURL, Axios y Guzzle. Prueba sin riesgos en nuestro <strong>Sandbox con 20 módulos</strong> y simula respuestas DIAN mediante <strong>Magic Values</strong>.
      </>
    ),
  },
  {
    title: 'Sector Salud & DIAN v3.6.0',
    Icon: FaHeartPulse,
    description: (
      <>
        Soporte oficial de la <strong>Resolución 000948 de 2026</strong> (RIPS como soporte obligatorio de la FEV en salud), Documento Equivalente POS, Nómina Electrónica, Documento Soporte y RADIAN.
      </>
    ),
  },
  {
    title: 'Escalabilidad & Webhooks',
    Icon: FaBolt,
    description: (
      <>
        Emisión asíncrona de alto volumen con la <strong>API Bulk</strong>, autenticación persistente mediante <strong>PAT (JWT)</strong> y notificaciones HTTP en tiempo real con <strong>Webhooks HMAC</strong>.
      </>
    ),
  },
];

function Feature({ title, Icon, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className={styles.featureCard}>
        <div className={styles.iconWrapper}>
          <Icon className={styles.featureIcon} aria-hidden="true" />
        </div>
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <header className={styles.sectionHeader}>
          <Heading as="h2">Por qué elegir MATIAS API</Heading>
          <p>Diseñada para desarrolladores — desde la integración hasta la escala</p>
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
