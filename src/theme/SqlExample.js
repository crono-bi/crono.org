import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

// Este componente es un wrapper para usar SqlCodeBlock en archivos MDX
export default function SqlExample(props) {
  // Usamos BrowserOnly porque Prism.js requiere acceso al DOM
  return (
    <BrowserOnly fallback={<div>Cargando ejemplo SQL...</div>}>
      {() => {
        // Importamos SqlCodeBlock dinámicamente solo en el navegador
        const SqlCodeBlock = require('../components/SqlCodeBlock').default;
        return <SqlCodeBlock {...props} />;
      }}
    </BrowserOnly>
  );
}
