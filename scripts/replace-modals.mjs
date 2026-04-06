/**
 * Reemplaza los patrones Bootstrap-Vue en los archivos .md migrados:
 * 1. <b-button v-b-modal...> + <b-modal...>...</b-modal>  →  <details><summary>...</summary>...</details>
 * 2. <section-index ... />  →  (eliminar)
 * 3. Divs wrapper Bootstrap vacíos  →  (eliminar/simplificar)
 *
 * Opera sobre astro/src/content/docs/ (ya migrado)
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const docsDir = join(root, 'astro/src/content/docs');

let stats = { modals: 0, sectionIndex: 0, files: 0 };

function processFile(filePath) {
  let content = readFileSync(filePath, 'utf8');
  const original = content;

  // 1. Reemplazar <b-button v-b-modal...>...</b-button> + <b-modal...>...</b-modal>
  //    El patrón puede repetirse varias veces en el mismo archivo (modal-1, modal-2, etc.)
  //    Usamos un bucle porque puede haber múltiples modales
  let changed = true;
  while (changed) {
    changed = false;
    // Buscar b-button con v-b-modal
    const btnMatch = content.match(/<b-button[^>]+v-b-modal[^>]*>([^<]*)<\/b-button>/);
    if (!btnMatch) break;

    const btnText = btnMatch[1].trim(); // "Ver SQL compilado"
    const btnStart = content.indexOf(btnMatch[0]);

    // Extraer el id del modal del atributo v-b-modal.modal-N
    const idMatch = btnMatch[0].match(/v-b-modal\.(\S+)/);
    const modalId = idMatch ? idMatch[1] : null;

    // Buscar el b-modal correspondiente
    let modalPattern;
    if (modalId) {
      modalPattern = new RegExp(`<b-modal[^>]+id="${modalId}"[^>]*>([\\s\\S]*?)<\\/b-modal>`);
    } else {
      modalPattern = /<b-modal[^>]*>([\s\S]*?)<\/b-modal>/;
    }

    const modalMatch = content.match(modalPattern);
    if (!modalMatch) break;

    const modalContent = modalMatch[1].trim();
    const modalStart = content.indexOf(modalMatch[0]);

    // Construir reemplazo con <details>/<summary>
    const details = `<details>\n<summary>${btnText}</summary>\n\n${modalContent}\n\n</details>`;

    // Reemplazar el b-modal primero (para no afectar índices del botón)
    if (modalStart > btnStart) {
      content = content.slice(0, modalStart) + details + content.slice(modalStart + modalMatch[0].length);
      content = content.slice(0, btnStart) + content.slice(btnStart + btnMatch[0].length);
    } else {
      content = content.slice(0, btnStart) + content.slice(btnStart + btnMatch[0].length);
      const newModalStart = content.indexOf(modalMatch[0]);
      if (newModalStart !== -1) {
        content = content.slice(0, newModalStart) + details + content.slice(newModalStart + modalMatch[0].length);
      }
    }

    stats.modals++;
    changed = true;
  }

  // 2. Eliminar <section-index ... />
  const sectionIndexCount = (content.match(/<section-index[^/]*\/>/g) || []).length;
  if (sectionIndexCount > 0) {
    content = content.replace(/<section-index[^/]*\/>/g, '');
    stats.sectionIndex += sectionIndexCount;
  }

  // 3. Limpiar divs wrapper Bootstrap vacíos que quedaron sin contenido útil
  //    <div class="mt-1 mb-2 row"> y <div class="col-lg-12"> que solo envuelven código
  //    Los eliminamos si sólo contienen espacios/saltos o el details que acabamos de crear
  content = content.replace(/<div class="mt-1 mb-2 row">\s*<div class="col-lg-12">\s*([\s\S]*?)\s*<\/div>\s*<\/div>/g, '$1');

  if (content !== original) {
    writeFileSync(filePath, content, 'utf8');
    stats.files++;
  }
}

function processDir(dir) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (entry.endsWith('.md')) {
      processFile(fullPath);
    }
  }
}

console.log('Reemplazando componentes Vue...');
processDir(docsDir);

console.log('\n✅ Reemplazo completado');
console.log(`   Modales reemplazados: ${stats.modals}`);
console.log(`   <section-index> eliminados: ${stats.sectionIndex}`);
console.log(`   Archivos modificados: ${stats.files}`);
