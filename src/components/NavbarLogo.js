import React from 'react';
import Link from '@docusaurus/Link';

export default function NavbarLogo() {
  return (
    <Link to="/" className="navbar-logo-link">
      <img 
        src="/images/logo.webp" 
        alt="Crono Logo" 
        className="navbar-logo" 
        width="80" 
        height="30" 
      />
    </Link>
  );
}
