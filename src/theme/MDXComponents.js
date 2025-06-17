import React from 'react';
import MDXComponents from '@theme-original/MDXComponents';
import BrowserOnly from '@docusaurus/BrowserOnly';

// Componente SqlExample global para MDX
function SqlExample(props) {
  return (
    <BrowserOnly fallback={<div>Cargando ejemplo SQL...</div>}>
      {() => {
        const SqlCodeBlock = require('../components/SqlCodeBlock').default;
        return <SqlCodeBlock {...props} />;
      }}
    </BrowserOnly>
  );
}

export default {
  ...MDXComponents,
  SqlExample, // Registramos el componente para que esté disponible globalmente en MDX
};
