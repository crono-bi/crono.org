/**
 * Convierte src/.vuepress/public/sidebar.json al formato de sidebar de Starlight.
 * Genera la sección sidebar: [...] lista para pegar en astro.config.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// Leer sidebar.json (tiene BOM)
let raw = readFileSync(join(root, 'src/.vuepress/public/sidebar.json'), 'utf8');
if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
const sidebarJson = JSON.parse(raw);

// Títulos legibles para cada sección raíz
const sectionLabels = {
  '/analysis/': 'Crono Analysis',
  '/metadata/': 'Crono Metadata',
  '/etl/': 'Crono ETL',
  '/sql/': 'Crono SQL',
};

function convertPath(htmlPath) {
  // "/analysis/intro.html" -> "analysis/intro"
  return htmlPath.replace(/^\//, '').replace(/\.html$/, '');
}

function convertChildren(children) {
  return children.map(child => {
    if (child.children && child.children.length > 0) {
      // Es un grupo colapsable
      return {
        label: child.title,
        collapsed: true,
        items: convertChildren(child.children),
      };
    } else {
      return {
        label: child.title,
        link: convertPath(child.path),
      };
    }
  });
}

const sidebar = [];

for (const [sectionPath, groups] of Object.entries(sidebarJson)) {
  const label = sectionLabels[sectionPath] || sectionPath;
  const group = groups[0]; // Cada sección tiene un único grupo raíz

  const entry = {
    label,
    items: convertChildren(group.children || []),
  };
  sidebar.push(entry);
}

// Serializar como JS (no JSON) para el astro.config.mjs
function toJs(obj, indent = 1) {
  const tab = '\t'.repeat(indent);
  const tab0 = '\t'.repeat(indent - 1);

  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]';
    const items = obj.map(item => `${tab}${toJs(item, indent + 1)}`).join(',\n');
    return `[\n${items},\n${tab0}]`;
  }

  if (typeof obj === 'object' && obj !== null) {
    const entries = Object.entries(obj).map(([k, v]) => `${tab}${k}: ${toJs(v, indent + 1)}`);
    return `{\n${entries.join(',\n')},\n${tab0}}`;
  }

  return JSON.stringify(obj);
}

const output = `sidebar: ${toJs(sidebar)},`;
writeFileSync(join(root, 'scripts/sidebar-output.js'), output, 'utf8');
console.log('Sidebar generado en scripts/sidebar-output.js');
console.log(`Secciones: ${sidebar.map(s => s.label).join(', ')}`);
sidebar.forEach(s => console.log(`  ${s.label}: ${s.items.length} items`));
