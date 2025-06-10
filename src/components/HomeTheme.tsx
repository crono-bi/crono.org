import React from 'react';
import { useEffect, useState } from 'react';
import { Header } from '@site/src/components/UI';
import HomepageFeatures, { AnalysisFeatureList } from '@site/src/components/HomepageFeatures';
import styles from '@site/src/pages/index.module.css';

interface HomeThemeProps {
  backgroundColor?: string;
  logoSrc?: string;
  logoAlt?: string;
  subtitleText?: string;
  subtitleColor?: string;
  buttonText?: string;
  buttonTo?: string;
  buttonColor?: string;
  buttonBgColor?: string;
  features?: any[];
  hideFooter?: boolean;
  footerBgColor?: string;
  footerTextColor?: string;
}

// Función para determinar si un color es oscuro o claro
function isColorDark(color: string): boolean {
  // Si es transparente, asumimos que el fondo es claro
  if (color === 'transparent') return false;
  
  // Convertir color a RGB
  let r, g, b;
  
  // Formato hex #RRGGBB o #RGB
  if (color.startsWith('#')) {
    const hex = color.substring(1);
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else {
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    }
  } 
  // Formato rgb(r, g, b)
  else if (color.startsWith('rgb')) {
    const match = color.match(/\d+/g);
    if (match && match.length >= 3) {
      r = parseInt(match[0], 10);
      g = parseInt(match[1], 10);
      b = parseInt(match[2], 10);
    } else {
      return false; // Color no válido, asumimos claro
    }
  } 
  // Nombres de colores comunes
  else {
    const colorMap: Record<string, [number, number, number]> = {
      'white': [255, 255, 255],
      'black': [0, 0, 0],
      'red': [255, 0, 0],
      'green': [0, 128, 0],
      'blue': [0, 0, 255],
      'yellow': [255, 255, 0],
      'purple': [128, 0, 128],
      'gray': [128, 128, 128],
      'grey': [128, 128, 128]
    };
    
    const rgb = colorMap[color.toLowerCase()];
    if (rgb) {
      [r, g, b] = rgb;
    } else {
      return false; // Color no reconocido, asumimos claro
    }
  }
  
  // Calcular luminancia relativa
  // Fórmula: 0.299*R + 0.587*G + 0.114*B
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Si la luminancia es menor a 0.5, el color es oscuro
  return luminance < 0.5;
}

export default function HomeTheme({
  backgroundColor = "#2e8555",
  logoSrc = "/img/analysis.webp",
  logoAlt = "Crono Analysis Logo",
  subtitleText = "Crono Analysis es una aplicación de Business Intelligence fácil de usar ❤️",
  subtitleColor = "white",
  buttonText = "Acceder al manual →",
  buttonTo = "/docs/analysis/intro",
  buttonColor = "black",
  buttonBgColor = "white",
  features = AnalysisFeatureList,
  hideFooter = false,
  footerBgColor = 'transparent',
  footerTextColor
}: HomeThemeProps): React.ReactElement {
  return (
    <>
      <Header 
        backgroundColor={backgroundColor}
        logoSrc={logoSrc}
        logoAlt={logoAlt}
        subtitleText={subtitleText}
        subtitleColor={subtitleColor}
        buttonText={buttonText}
        buttonTo={buttonTo}
        buttonColor={buttonColor}
        buttonBgColor={buttonBgColor}
      />
      <main>
        <HomepageFeatures features={features} />
      </main>
      {!hideFooter && (
        <footer className={styles.footer} style={{ backgroundColor: footerBgColor }}>
          <div className="container">
            <div className="text--center" style={{ 
              color: footerTextColor || (isColorDark(footerBgColor) ? 'white' : 'black') 
            }}>
              Made by Crono with ❤️
            </div>
          </div>
        </footer>
      )}
    </>
  );
}
