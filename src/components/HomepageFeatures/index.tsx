import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

export type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

// Características predeterminadas para la página principal
export const DefaultFeatureList: FeatureItem[] = [
  {
    title: 'Business Intelligence fácil',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        La característica principal de Crono es la facilidad de uso. Así de simple. 💧
      </>
    ),
  },
  {
    title: 'Solución completa',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Cubre las necesidades, desde la extracción de los datos, la construcción del DWH, 
        y la visualización y análisis de los datos. ⭐
      </>
    ),
  },
  {
    title: 'Mejores prácticas',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Crono sigue y fomenta las buenas prácticas en el proyecto BI. Hacemos las cosas bien. 🥇
      </>
    ),
  },
];

// Características para la sección de Analysis
export const AnalysisFeatureList: FeatureItem[] = [
  {
    title: 'Business Intelligence fácil',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        La característica principal de Crono es la facilidad de uso. Así de simple. 💧
      </>
    ),
  },
  {
    title: 'Análisis libre',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Es la mejor herramienta para realizar análisis libre. El propio usuario puede construirse sus informes y análisis. 📊
      </>
    ),
  },
  {
    title: 'Potente',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Con toda la potencia y funcionalidades de las mejores herramientas de BI. 🛠️
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
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

type HomepageFeaturesProps = {
  features?: FeatureItem[];
};

export default function HomepageFeatures({features = DefaultFeatureList}: HomepageFeaturesProps): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {features.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
