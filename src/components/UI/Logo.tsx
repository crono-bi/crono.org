import React from 'react';
import styles from '../../pages/index.module.css';

type LogoProps = {
  src: string;
  alt: string;
  className?: string;
};

export default function Logo({ 
  src = '/img/crono.webp', 
  alt = 'Crono Logo',
  className = styles.heroLogo
}: LogoProps): React.ReactElement {
  return (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
    />
  );
}
