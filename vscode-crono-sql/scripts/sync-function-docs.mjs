// sync-function-docs.mjs
//
// Genera src/generated/function-docs.ts a partir de la documentación oficial
// de funciones en crono.org/src/content/docs/sql/functions/**.
//
// Uso: npm run sync
//
// Este script es la ÚNICA fuente que debe escribir function-docs.ts.
// No edites el archivo generado a mano.
//
// Algoritmo:
//   1. Lee cada doc de función (.md/.mdx) y extrae title, descripción y ejemplo.
//   2. CRONO_FUNCTION_NAMES = nombres de función documentados (ordenados).
//   3. CRONO_FUNCTION_CATEGORIES mapea cada nombre a su categoría (carpeta).
//
// Revisa siempre el diff tras un `npm run sync`: la documentación evoluciona.

import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const EXT_ROOT = resolve(__dirname, '..');
const REPO_ROOT = resolve(EXT_ROOT, '..');
// La extensión vive dentro del repo crono.org, los docs están en ../src/content/docs.
const DOCS_ROOT = resolve(REPO_ROOT, 'src', 'content', 'docs', 'sql', 'functions');
const OUT_FILE = join(EXT_ROOT, 'src', 'generated', 'function-docs.ts');

// Mapa carpeta (es) -> categoría (clave interna en inglés).
const FOLDER_TO_CATEGORY = {
  agregacion: 'aggregation',
  conversion: 'conversion',
  fecha: 'dates',
  metadata: 'metadata',
  nulos: 'nullsAndConditions',
  numericas: 'numeric',
  texto: 'text',
};

/** Devuelve todos los docs (.md/.mdx) dentro de un directorio (recursivo), sin index. */
function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...walk(full));
    } else if ((entry.endsWith('.md') || entry.endsWith('.mdx')) && !entry.startsWith('index.')) {
      out.push(full);
    }
  }
  return out;
}

/** Extrae el valor `title` del frontmatter YAML. */
function parseTitle(raw) {
  const fm = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) return null;
  const m = fm[1].match(/title:\s*"?([^"\n]+)"?/);
  return m ? m[1].trim() : null;
}

/** Primer párrafo de texto tras el frontmatter (descripción). */
function parseDescription(body) {
  for (const block of body.split(/\n\s*\n/)) {
    const t = block.trim();
    if (!t || t.startsWith('#') || t.startsWith('```')) continue;
    return t.replace(/\n/g, ' ').trim();
  }
  return '';
}

/** Primer bloque de código (crono-sql o sql) como ejemplo. */
function parseExample(body) {
  const m = body.match(/```(?:crono-sql|sql)\n([\s\S]*?)```/);
  return m ? m[1].replace(/\n+$/, '') : null;
}

async function main() {
  const files = walk(DOCS_ROOT).sort();

  const docs = {};
  const categories = {};

  for (const file of files) {
    const raw = readFileSync(file, 'utf8');
    const title = parseTitle(raw);
    if (!title) continue;

    const name = title.toLowerCase();
    const body = raw.replace(/^---\n[\s\S]*?\n---/, '');

    // slug = functions/<carpeta>/<archivo-sin-ext>, relativo a DOCS_ROOT.
    const rel = file.slice(DOCS_ROOT.length + 1).replace(/\.mdx?$/, '');
    const folder = rel.split('/')[0];
    const category = FOLDER_TO_CATEGORY[folder] ?? null;

    const entry = {
      description: parseDescription(body),
      slug: `functions/${rel}`,
    };
    const example = parseExample(body);
    if (example) entry.example = example;
    if (category) entry.category = category;

    docs[name] = entry;
    if (category) categories[name] = category;
  }

  // La documentación (src/content/docs/sql/functions) es la ÚNICA fuente
  // autoritativa. NOTA: src/config/crono-language-data.mjs está desactualizado
  // (usa nombres concatenados antiguos: adddays, split, weekday…) frente a los
  // nombres snake_case de los docs (add_days, split_part, day_name…), por lo que
  // NO se fusiona aquí para evitar inyectar duplicados obsoletos.
  const names = Object.keys(docs).sort();

  const header =
    '// AUTO-GENERADO por scripts/sync-function-docs.mjs — NO EDITAR A MANO.\n' +
    '// Fuente de verdad: crono.org/src/content/docs/sql/functions/**\n' +
    '// Regenerar con: npm run sync\n';

  const iface =
    'export interface GeneratedDoc {\n' +
    '  description: string;\n' +
    '  example?: string;\n' +
    '  slug: string;\n' +
    '  category?: string;\n' +
    '}\n';

  const out =
    header +
    iface +
    '\nexport const GENERATED_FUNCTION_DOCS: Record<string, GeneratedDoc> = ' +
    JSON.stringify(docs, null, 4) +
    ';\n' +
    '// Lista canónica y completa de nombres de función (superset docs + legacy).\n' +
    'export const CRONO_FUNCTION_NAMES: string[] = ' +
    JSON.stringify(names, null, 4) +
    ';\n' +
    'export const CRONO_FUNCTION_CATEGORIES: Record<string, string> = ' +
    JSON.stringify(categories, null, 4) +
    ';\n';

  mkdirSync(dirname(OUT_FILE), { recursive: true });
  writeFileSync(OUT_FILE, out);
  console.log(`Generado ${OUT_FILE}: ${names.length} nombres, ${Object.keys(docs).length} con doc, ${Object.keys(categories).length} categorías.`);
}

await main();
