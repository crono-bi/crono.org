import React from 'react';
import Layout from '@theme/Layout';
import HomepageFeatures, { AnalysisFeatureList } from '@site/src/components/HomepageFeatures';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './index.module.css';

function AnalysisHeader() {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <img 
          src="/img/analysis.webp" 
          alt="Crono Analysis Logo" 
          className={styles.heroLogo} 
        />
        <Heading as="h1" className="hero__title">
          Crono Analysis
        </Heading>
        <p className="hero__subtitle">Una aplicación de Business Intelligence fácil de usar ❤️</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/analysis">
            Acceder al manual →
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Analysis(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Crono Analysis"
      description="Una aplicación de Business Intelligence fácil de usar">
      <AnalysisHeader />
      <main>
        <HomepageFeatures features={AnalysisFeatureList} />
      </main>
      <footer className={styles.footer}>
        <div className="container">
          <div className="text--center">
            Made by Crono with ❤️
          </div>
        </div>
      </footer>
    </Layout>
  );
}
