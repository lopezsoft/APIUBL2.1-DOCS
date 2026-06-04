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
    title: 'Fácil Integración',
    Svg: require('@site/static/img/easy-api.svg').default,
    description: (
      <>
        Documentación clara y estructurada. Prueba todo sin riesgos en nuestro <strong>Entorno Sandbox</strong> antes de ir a producción.
      </>
    ),
  },
  {
    title: 'Autogestión y Masivos',
    Svg: require('@site/static/img/web-inteface.svg').default,
    description: (
      <>
        <strong>v3.3.0:</strong> Procesa grandes volúmenes con la API Bulk, gestiona eventos RADIAN en el Sandbox y administra tokens y membresías tú mismo.
      </>
    ),
  },
  {
    title: 'Notificaciones en Tiempo Real',
    Svg: require('@site/static/img/languages.svg').default,
    description: (
      <>
        <strong>Webhooks:</strong> Recibe notificaciones HTTP instantáneas de 26 eventos (documentos, emails, pagos, membresías).
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
