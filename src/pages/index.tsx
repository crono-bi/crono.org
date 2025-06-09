import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)} style={{backgroundColor: 'white'}}>
      <div className="container">
        <img 
          src="/img/crono.webp" 
          alt="Crono Logo" 
          className={styles.heroLogo} 
        />
        <p className="hero__subtitle" style={{color: '#007bcc'}}>{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--lg"
            to="/docs/analysis"
            style={{backgroundColor: '#007bcc', color: 'white'}}>
            Manual de Crono Analysis →
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Una solución Business Intelligence fácil de usar">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
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
