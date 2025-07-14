import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useThemeConfig} from '@docusaurus/theme-common';
import styles from './styles.module.css';

export default function Logo(props) {
  const {
    siteConfig: {title},
  } = useDocusaurusContext();
  const {
    navbar: {title: navbarTitle, logo = {}},
  } = useThemeConfig();

  const {imageClassName, titleClassName, ...propsRest} = props;
  const logoLink = useBaseUrl(logo.href || '/');

  return (
    <Link
      to={logoLink}
      {...propsRest}
      className={props.className}>
      <img 
        src="/images/logo-crono-black.png" 
        alt={logo.alt || title || navbarTitle} 
        className={styles.logoImage} 
        width="80" 
        height="30" 
      />
    </Link>
  );
}
