import React from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from '../../pages/index.module.css';
import Logo from './Logo';
import Subtitle from './Subtitle';
import Button from './Button';

type HeaderProps = {
  backgroundColor?: string;
  logoSrc?: string;
  logoAlt?: string;
  subtitleText?: string;
  subtitleColor?: string;
  buttonText?: string;
  buttonTo?: string;
  buttonColor?: string;
  buttonBgColor?: string;
};

export default function Header({
  backgroundColor = 'white',
  logoSrc = '/img/crono.webp',
  logoAlt = 'Crono Logo',
  subtitleText = 'hu',
  subtitleColor = '#007bcc',
  buttonText = 'Manual de Crono Analysis →',
  buttonTo = '/docs/analysis',
  buttonColor = 'white',
  buttonBgColor = '#007bcc',
}: HeaderProps): React.ReactElement {
  const { siteConfig } = useDocusaurusContext();
  
  // Use provided subtitle text or fall back to site tagline
  const displaySubtitle = subtitleText;

  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)} style={{ backgroundColor }}>
      <div className="container">
        <Logo src={logoSrc} alt={logoAlt} />
        <Subtitle text={displaySubtitle} color={subtitleColor} />
        <div className={styles.buttons}>
          <Button 
            text={buttonText} 
            to={buttonTo} 
            backgroundColor={buttonBgColor} 
            color={buttonColor} 
          />
        </div>
      </div>
    </header>
  );
}
