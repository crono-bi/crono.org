import React from 'react';
import Link from '@docusaurus/Link';
import config from '@site/docusaurus.json';
import '@site/src/css/navigation-cards.css';

export default function NavigationCards() {
  // Extraer información de las barras laterales
  const sidebars = config.sidebars;
  const navbarItems = config.navbar.items;

  // Función para obtener la URL del primer documento de una categoría
  const getFirstDocUrl = (sidebarId) => {
    const sidebar = sidebars[sidebarId];
    if (!sidebar || !sidebar.length) return '/';
    
    const firstCategory = sidebar[0];
    if (firstCategory.link && firstCategory.link.type === 'doc') {
      // Convertir el ID del documento a una ruta URL
      return '/' + firstCategory.link.id.replace(/\/README$/, '');
    }
    
    if (firstCategory.items && firstCategory.items.length > 0) {
      const firstItem = firstCategory.items[0];
      if (firstItem.type === 'doc') {
        // Convertir el ID del documento a una ruta URL
        return '/' + firstItem.id.replace(/\/README$/, '');
      }
    }
    
    // Mapeo de sidebarId a rutas base
    const sidebarToPath = {
      'sidebar1': '/analysis',
      'sidebar2': '/etl',
      'sidebar3': '/metadata',
      'sidebar4': '/sql'
    };
    
    return sidebarToPath[sidebarId] || '/';
  };

  // Función para obtener un icono basado en el nombre de la sección
  const getIconForSection = (label) => {
    const iconMap = {
      'Crono Analysis': '📊',
      'Crono ETL': '🔄',
      'Crono Metadata': '📋',
      'Crono SQL': '💾',
      'default': '📄'
    };
    
    return iconMap[label] || iconMap.default;
  };

  // Función para obtener una descripción corta basada en el nombre de la sección
  const getDescriptionForSection = (label) => {
    const descMap = {
      'Crono Analysis': 'Herramienta de análisis y visualización de datos',
      'Crono ETL': 'Extracción, transformación y carga de datos',
      'Crono Metadata': 'Gestión de metadatos y catálogos',
      'Crono SQL': 'Lenguaje SQL extendido para análisis de datos',
      'default': 'Documentación de Crono'
    };
    
    return descMap[label] || descMap.default;
  };

  // Filtrar solo los elementos de tipo docSidebar
  const sidebarNavItems = navbarItems.filter(item => item.type === 'docSidebar');

  return (
    <div className="navigation-cards-container">
      <div className="navigation-cards-grid">
        {sidebarNavItems.map((item, index) => {
          const docUrl = getFirstDocUrl(item.sidebarId);
          const icon = getIconForSection(item.label);
          const description = getDescriptionForSection(item.label);
          
          return (
            <Link
              key={index}
              to={docUrl}
              className="navigation-card"
            >
              <div className="navigation-card-content">
                <div className="navigation-card-icon">{icon}</div>
                <h3 className="navigation-card-title">{item.label}</h3>
                <p className="navigation-card-description">{description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
