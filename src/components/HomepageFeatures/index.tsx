import type {ReactNode} from 'react';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import { useLocation } from '@docusaurus/router';

export type FeatureItem = {
  title: string;
  description: ReactNode;
};

export type JsonFeatureItem = {
  title: string;
  svgPath: string;
  description: string;
};

export type FeaturesJson = {
  features: JsonFeatureItem[];
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
  jsonFile?: string;
};

// Función para convertir JsonFeatureItem a FeatureItem
const convertJsonFeatureToFeatureItem = (jsonFeature: JsonFeatureItem): FeatureItem => {
  let SvgComponent;
  try {
    SvgComponent = require(`@site/static${jsonFeature.svgPath}`).default;
  } catch (error) {
    // Si no se puede cargar el SVG, usar uno predeterminado
    console.warn(`No se pudo cargar el SVG: ${jsonFeature.svgPath}`, error);
    SvgComponent = require('@site/static/img/undraw_docusaurus_mountain.svg').default;
  }

  return {
    title: jsonFeature.title,
    Svg: SvgComponent,
    description: jsonFeature.description
  };
};



// Importar los iconos SVG personalizados
import FeatureIcon1 from '@site/static/img/feature-icon-1.svg';
import FeatureIcon2 from '@site/static/img/feature-icon-2.svg';
import FeatureIcon3 from '@site/static/img/feature-icon-3.svg';

const featureIcons = [FeatureIcon1, FeatureIcon2, FeatureIcon3];

export default function HomepageFeatures({features = DefaultFeatureList, jsonFile}: HomepageFeaturesProps): ReactNode {
  const [dynamicFeatures, setDynamicFeatures] = useState<FeatureItem[]>(features);

  useEffect(() => {
    if (jsonFile) {
      const loadJsonFeatures = async () => {
        try {
          const response = await fetch(jsonFile);
          if (!response.ok) throw new Error(`Error al cargar el archivo JSON: ${response.statusText}`);
          const data = await response.json();
          if (data && data.features && Array.isArray(data.features)) {
            setDynamicFeatures(data.features);
          } else {
            setDynamicFeatures(features);
          }
        } catch (error) {
          setDynamicFeatures(features);
        }
      };
      loadJsonFeatures();
    } else {
      setDynamicFeatures(features);
    }
  }, [jsonFile, features]);

  function Feature({title, description, iconIdx}: FeatureItem & { iconIdx: number }) {
    const Svg = featureIcons[iconIdx % featureIcons.length];
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

  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {dynamicFeatures.map((props, idx) => (
            <Feature key={idx} {...props} iconIdx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

