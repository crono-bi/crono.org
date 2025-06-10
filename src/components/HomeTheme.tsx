import React from 'react';
import { Header } from '@site/src/components/UI';
import HomepageFeatures, { AnalysisFeatureList } from '@site/src/components/HomepageFeatures';
import styles from '@site/src/pages/index.module.css';

interface HomeThemeProps {
  backgroundColor?: string;
  logoSrc?: string;
  logoAlt?: string;
  subtitleText?: string;
  subtitleColor?: string;
  buttonText?: string;
  buttonTo?: string;
  buttonColor?: string;
  buttonBgColor?: string;
  features?: any[];
}

export default function HomeTheme({
  backgroundColor = "#2e8555",
  logoSrc = "/img/analysis.webp",
  logoAlt = "Crono Analysis Logo",
  subtitleText = "Crono Analysis es una aplicación de Business Intelligence fácil de usar ❤️",
  subtitleColor = "white",
  buttonText = "Acceder al manual →",
  buttonTo = "/docs/analysis/intro",
  buttonColor = "black",
  buttonBgColor = "white",
  features = AnalysisFeatureList
}: HomeThemeProps): React.ReactElement {
  return (
    <>
      <Header 
        backgroundColor={backgroundColor}
        logoSrc={logoSrc}
        logoAlt={logoAlt}
        subtitleText={subtitleText}
        subtitleColor={subtitleColor}
        buttonText={buttonText}
        buttonTo={buttonTo}
        buttonColor={buttonColor}
        buttonBgColor={buttonBgColor}
      />
      <main>
        <HomepageFeatures features={features} />
      </main>
      <footer className={styles.footer}>
        <div className="container">
          <div className="text--center">
            Made by Crono with ❤️
          </div>
        </div>
      </footer>
    </>
  );
}
