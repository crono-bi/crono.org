/**
 * Configuración centralizada de productos Crono
 * Iconos y colores estandarizados para uso en toda la aplicación
 */

export interface ProductConfig {
  id: string
  name: string
  color: string
  rgb: string
  icon: string
}

// Iconos SVG inline (24x24 viewBox, stroke-width 2)
const ICONS = {
  // Crono ETL: Base de datos (extracción/carga)
  etl: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3"/>
    <path d="M3 5V19A9 3 0 0 0 21 19V5"/>
    <path d="M3 12A9 3 0 0 0 21 12"/>
  </svg>`,

  // Crono SQL: Terminal SQL
  sql: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2"/>
    <path d="M6 8h.01"/>
    <path d="M6 12h.01"/>
    <path d="M6 16h.01"/>
    <path d="M8 12h8"/>
    <path d="M8 8h4"/>
    <path d="M8 16h6"/>
  </svg>`,

  // Crono Metadata: Bombilla (inteligencia/semántica)
  metadata: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/>
    <path d="M9 21h6"/>
  </svg>`,

  // Crono Analysis: Gráfico de barras
  analysis: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M18 20V10"/>
    <path d="M12 20V4"/>
    <path d="M6 20v-6"/>
  </svg>`,
}

// Configuración de productos
export const PRODUCTS: Record<string, ProductConfig> = {
  sql: {
    id: 'sql',
    name: 'Crono SQL',
    color: '#10B981',
    rgb: '16,185,129',
    icon: ICONS.sql,
  },
  etl: {
    id: 'etl',
    name: 'Crono ETL',
    color: '#1B8AC7',
    rgb: '27,138,199',
    icon: ICONS.etl,
  },
  metadata: {
    id: 'metadata',
    name: 'Crono Metadata',
    color: '#5B2C7D',
    rgb: '91,44,125',
    icon: ICONS.metadata,
  },
  analysis: {
    id: 'analysis',
    name: 'Crono Analysis',
    color: '#C85A47',
    rgb: '200,90,71',
    icon: ICONS.analysis,
  },
}

// Helpers para usar en componentes
export const getProduct = (id: string): ProductConfig | undefined => PRODUCTS[id]

export const getProductIcon = (id: string): string => PRODUCTS[id]?.icon || ''

export const getProductColor = (id: string): string => PRODUCTS[id]?.color || '#666'

// Lista de productos como array
export const PRODUCT_LIST = Object.values(PRODUCTS)
