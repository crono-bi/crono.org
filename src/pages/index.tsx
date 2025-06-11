import type {ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomeTheme from '@site/src/components/HomeTheme';


export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hola desde ${siteConfig.title}`}
      description="Documentación de Crono Analysis, Metadata, ETL y SQL"
    >
      <HomeTheme 
        backgroundColor="white"
        logoSrc="/img/crono.webp"
        logoAlt="Crono Home Logo"
        subtitleText="Una solución Business Intelligence fácil de usar"
        subtitleColor="#3579c6"
        buttonText="Manual de Crono Analysis →"
        buttonTo="/docs/analysis"
        buttonColor="white"
        buttonBgColor="#3579c6"
        footerBgColor="#3579c6"
        featuresJsonFile="/json/features/home.json"
      />
    </Layout>
  );
}
