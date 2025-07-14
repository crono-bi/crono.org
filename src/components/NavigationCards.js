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
    
    // Intenta obtener la URL del primer documento en la sidebar
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
    
    // Buscar el elemento de navbar correspondiente para obtener la ruta
    const navbarItem = navbarItems.find(item => item.sidebarId === sidebarId);
    if (navbarItem && navbarItem.label) {
      // Extraer la ruta del label (elimina 'Crono ' y convierte a minúsculas)
      const path = navbarItem.label.replace('Crono ', '').toLowerCase();
      return '/' + path;
    }
    
    // Si todo lo demás falla, extraer la ruta del sidebarId
    // Asume que el sidebarId tiene alguna relación con la ruta (ej: 'sidebarEtl' -> '/etl')
    const pathFromId = sidebarId.replace(/^sidebar/i, '').toLowerCase();
    return pathFromId ? '/' + pathFromId : '/';
  };

  // Función para obtener un icono basado en el nombre de la sección
  const getIconForSection = (label) => {
    // Extraer el nombre del componente sin el prefijo "Crono"
    const component = label.replace('Crono ', '').toLowerCase();
    
    // Asignar iconos basados en palabras clave en el nombre
    if (component.includes('analysis')) return '📊';
    if (component.includes('etl')) return '🔄';
    if (component.includes('metadata')) return '📋';
    if (component.includes('sql')) return '💾';
    if (component.includes('data')) return '📈';
    if (component.includes('report')) return '📑';
    
    // Icono predeterminado
    return '📄';
  };

  // Función para obtener una descripción corta basada en el nombre de la sección
  const getDescriptionForSection = (label) => {
    // Extraer el nombre del componente sin el prefijo "Crono"
    const component = label.replace('Crono ', '').toLowerCase();
    
    // Generar descripciones basadas en el nombre del componente
    if (component.includes('analysis')) {
      return 'Herramienta de análisis y visualización de datos';
    }
    if (component.includes('etl')) {
      return 'Extracción, transformación y carga de datos';
    }
    if (component.includes('metadata')) {
      return 'Gestión de metadatos y catálogos';
    }
    if (component.includes('sql')) {
      return 'Lenguaje SQL extendido para análisis de datos';
    }
    if (component.includes('data')) {
      return 'Gestión y procesamiento de datos';
    }
    if (component.includes('report')) {
      return 'Generación y gestión de informes';
    }
    
    // Descripción predeterminada
    return `Documentación de ${label}`;
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
