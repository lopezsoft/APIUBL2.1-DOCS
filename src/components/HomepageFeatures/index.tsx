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
    title: 'Fácil de usar',
    Svg: require('@site/static/img/easy-api.svg').default,
    description: (
      <>
        Fácil de usar, con una documentación clara y sencilla. No te complicamos la vida.
      </>
    ),
  },
  {
    title: 'Autogestión Completa',
    Svg: require('@site/static/img/web-inteface.svg').default,
    description: (
      <>
        <strong>v3.0.0:</strong> Crea tus propios tokens de acceso, configura webhooks y gestiona límites sin contactar soporte.
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
