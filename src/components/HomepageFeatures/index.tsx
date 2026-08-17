import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Fácil Integración & Sandbox',
    Svg: require('@site/static/img/easy-api.svg').default,
    description: (
      <>
        Documentación interactiva con snippets en cURL, Axios y Guzzle. Prueba sin riesgos en nuestro <strong>Sandbox con 20 módulos</strong> y simula respuestas DIAN mediante <strong>Magic Values</strong>.
      </>
    ),
  },
  {
    title: 'Sector Salud & DIAN v3.6.0',
    Svg: require('@site/static/img/web-inteface.svg').default,
    description: (
      <>
        Soporte oficial de la <strong>Resolución 000948 de 2026</strong> (RIPS como soporte obligatorio de la FEV en salud), Documento Equivalente POS, Nómina Electrónica, Documento Soporte y RADIAN.
      </>
    ),
  },
  {
    title: 'Escalabilidad & Webhooks',
    Svg: require('@site/static/img/languages.svg').default,
    description: (
      <>
        Emisión asíncrona de alto volumen con la <strong>API Bulk</strong>, autenticación persistente mediante <strong>PAT (JWT)</strong> y notificaciones HTTP en tiempo real con <strong>Webhooks HMAC</strong>.
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
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
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
