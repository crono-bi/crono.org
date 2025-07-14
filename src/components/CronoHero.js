import React from 'react';

export default function CronoHero() {
  return (
    <div style={{
      backgroundColor: '#f6f8fa',
      width: '100%',
      padding: '3rem 0',
      marginBottom: '1.5rem',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      <div className="container-xl px-xl-6" style={{maxWidth: '1320px', margin: '0 auto'}}>
        <div style={{width: '100%', overflow: 'hidden'}}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 280" aria-hidden="true" style={{width: '100%', height: 'auto', display: 'block'}}>
            {/* Fondo y elementos decorativos */}
            <g data-name="Background">
              <ellipse cx="120" cy="346" rx="87" ry="8" fill="rgba(0,0,0,.15)"></ellipse>
              <ellipse cx="320" cy="346" rx="38" ry="8" fill="rgba(0,0,0,.15)"></ellipse>
              <ellipse cx="550" cy="342" rx="100" ry="16" fill="rgba(0,0,0,.15)"></ellipse>
              <path d="M1160 292l-198-4-20-61a142 142 0 0017-8c11-6 12-22 7-33-3-1-12-1-12-1a48 48 0 01.8 14c-.6 5-12 11-19 14l-24-71c3-2 40-43 40-43h16l69 78 23-12z" fill="rgba(0,0,0,.1)"></path>
              <path d="M970 185s10 28-12 36-94 32-82 43c26 24 127 27 127 27s-7-42-12-61z" fill="rgba(0,0,0,.15)"></path>
            </g>
            
            {/* Montañas de datos y gráficos */}
            <g data-name="Data Mountains">
              <path d="M44 269l28-41 2 20 20-34 5 13 9-23 11 32 17-48 12 40 18-24s-19 7-19 5 25-34 25-34-23 9-23 7 20-20 26-30 19-50 19-50 20 48 30 53c3-8 14-30 14-30l-21 9s32-64 36-78 3-10 10 3c4 10 10 45 28 65 17 15-12 4-12 4l26 48 23-43 14 33-10-63-23 16s20-29 25-52 10-58 10-58l28 52s28-72 29-82c3 35 47 118 47 118s17-35 18-48c5 13 74 223 74 223s-194 12-270 12-220 1-234-6-25-29-25-29z" fill="rgba(0,0,0,.1)"></path>
              <path d="M572 291s110-10 124-19" fill="none" stroke="rgba(0,0,0,.1)" strokeMiterlimit="10" strokeWidth="2"></path>
            </g>
            
            {/* Iconos de análisis de datos */}
            <g data-name="Data Analysis">
              <circle cx="800" cy="120" r="40" fill="#0366d6" opacity="0.2"></circle>
              <path d="M780 120l15 15 25-25" stroke="#0366d6" strokeWidth="4" fill="none"></path>
              
              <rect x="700" y="180" width="120" height="80" rx="5" fill="#0366d6" opacity="0.1"></rect>
              <path d="M710 200h100M710 220h80M710 240h60" stroke="#0366d6" strokeWidth="2"></path>
              
              <circle cx="900" cy="200" r="30" fill="#f9c513" opacity="0.2"></circle>
              <path d="M885 200h30M900 185v30" stroke="#f9c513" strokeWidth="3"></path>
            </g>
            
            {/* Gráficos de datos */}
            <g data-name="Data Charts">
              <path d="M550 150v100h150" stroke="#0366d6" strokeWidth="2" fill="none"></path>
              <path d="M560 220l20-30 25 15 30-40 25 20 30-50" stroke="#0366d6" strokeWidth="3" fill="none"></path>
              <circle cx="560" cy="220" r="4" fill="#0366d6"></circle>
              <circle cx="580" cy="190" r="4" fill="#0366d6"></circle>
              <circle cx="605" cy="205" r="4" fill="#0366d6"></circle>
              <circle cx="635" cy="165" r="4" fill="#0366d6"></circle>
              <circle cx="660" cy="185" r="4" fill="#0366d6"></circle>
              <circle cx="690" cy="135" r="4" fill="#0366d6"></circle>
            </g>
            
            {/* Logo de Crono estilizado */}
            <g data-name="Crono Logo">
              <circle cx="400" cy="150" r="60" fill="#f9c513" opacity="0.7"></circle>
              <path d="M400 100v50l35 35" stroke="#fff" strokeWidth="4" strokeLinecap="round"></path>
              <circle cx="400" cy="150" r="5" fill="#fff"></circle>
              <path d="M370 130a40 40 0 1060 35" stroke="#fff" strokeWidth="3" fill="none"></path>
            </g>
            
            {/* Elementos de código y metadata */}
            <g data-name="Code Elements">
              <rect x="300" y="230" width="140" height="80" rx="5" fill="#0366d6" opacity="0.1"></rect>
              <path d="M320 250l-10 10 10 10M340 260h60M320 280l-10 10 10 10M340 290h40" stroke="#0366d6" strokeWidth="2"></path>
              
              <rect x="900" y="250" width="120" height="60" rx="5" fill="#f9c513" opacity="0.2"></rect>
              <path d="M920 265h80M920 280h60M920 295h40" stroke="#f9c513" strokeWidth="2"></path>
            </g>
            
            {/* Conexiones */}
            <g data-name="Connections">
              <path d="M460 150l60 30M460 170l100 50M340 200l-40 30M500 250l100-20M700 220l50-40" stroke="#0366d6" strokeWidth="1" strokeDasharray="5,5"></path>
            </g>
            {/* Texto superpuesto */}
            <text x="50" y="80" fontFamily="Arial, sans-serif" fontSize="48" fontWeight="bold" fill="#24292f">Crono</text>
            <text x="50" y="130" fontFamily="Arial, sans-serif" fontSize="32" fill="#57606a">Documentación</text>
          </svg>
        </div>
      </div>
    </div>
  );
}
