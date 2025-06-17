import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

export default function SqlRender(props) {
  return (
    <BrowserOnly fallback={<div>Cargando ejemplo SQL...</div>}>
      {() => {
        const SqlCodeBlock = require('../components/SqlCodeBlock').default;
        return <SqlCodeBlock {...props} />;
      }}
    </BrowserOnly>
  );
}
