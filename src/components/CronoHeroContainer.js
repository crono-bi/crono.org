import React from 'react';
import CronoHero from './CronoHero';

export default function CronoHeroContainer() {
  return (
    <div style={{
      backgroundColor: '#ffcdd2',
      width: '100vw',
      position: 'relative',
      left: '50%',
      right: '50%',
      marginLeft: '-50vw',
      marginRight: '-50vw',
      paddingTop: '1rem',
      paddingBottom: '1rem'
    }}>
      <CronoHero />
    </div>
  );
}
