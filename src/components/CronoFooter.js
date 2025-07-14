import React from 'react';
import Link from '@docusaurus/Link';
import '@site/src/css/crono-footer.css';

export default function CronoFooter() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="crono-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Productos</h4>
            <ul>
              <li><Link to="/analysis">Crono Analysis</Link></li>
              <li><Link to="/etl">Crono ETL</Link></li>
              <li><Link to="/metadata">Crono Metadata</Link></li>
              <li><Link to="/sql">Crono SQL</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Recursos</h4>
            <ul>
              <li><Link to="/dwh">Cómo construir un DWH</Link></li>
              <li><a href="https://github.com/crono-bi" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li><a href="https://www.businessintelligence.es/" target="_blank" rel="noopener noreferrer">Sitio Web</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Soporte</h4>
            <ul>
              <li><a href="mailto:soporte@crono.bi">soporte@crono.bi</a></li>
              <li><a href="https://crono.bi/contacto" target="_blank" rel="noopener noreferrer">Contacto</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-logo">
            <img src="/images/logo-crono-black.png" alt="Crono Logo" width="120" height="40" />
          </div>
          <div className="copyright">
            © {currentYear} Crono BI. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
}
