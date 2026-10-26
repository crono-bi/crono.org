// Hover documentation for Crono SQL keywords and functions.
// Content is condensed from the official docs at crono.org/sql.

export interface DocEntry {
  /** Short signature shown as a code block at the top of the hover. */
  signature: string;
  /** Markdown description of the keyword/function. */
  description: string;
  /** Optional docs path (relative to crono.org/sql) for the "see more" link. */
  docs?: string;
}

// ── Crono-specific keywords ───────────────────────────────────────────
export const KEYWORD_DOCS: Record<string, DocEntry> = {
  MATERIALIZE: {
    signature: 'SELECT ... MATERIALIZE',
    description: 'Fuerza la materialización de un paso intermedio del pipeline en una tabla temporal, en lugar de encadenarlo como subconsulta. Útil para reutilizar un resultado pesado o ayudar al optimizador.',
    docs: 'language/select-pipelines',
  },
  CALCULATE: {
    signature: 'CALCULATE columna = expresión',
    description: 'Añade o reescribe columnas calculadas reutilizando columnas definidas previamente en el mismo SELECT, sin repetir la expresión completa.',
    docs: 'language/select',
  },
  FILTER: {
    signature: 'SELECT ... FILTER condición',
    description: 'Filtra filas de un paso del pipeline. Equivalente a un `WHERE` aplicado sobre el resultado encadenado, con sintaxis más concisa.',
    docs: 'language/select-pipelines',
  },
  ASSERT: {
    signature: 'ASSERT condición',
    description: 'Declara una invariante que debe cumplirse en tiempo de carga. Si la condición falla, el proceso se detiene antes de escribir datos incorrectos en el DWH.',
    docs: 'language/assert',
  },
  SNOWFLAKE: {
    signature: 'CHECK SNOWFLAKE',
    description: 'Valida la integridad del modelo en estrella/copo de nieve (claves foráneas, cardinalidades) en tiempo de compilación.',
    docs: 'language/keywords',
  },
  CLONE: {
    signature: 'MERGE CLONE destino KEY (...)',
    description: 'Patrón de carga: sincronización completa (full sync). Inserta, actualiza y elimina para que el destino sea un reflejo exacto del origen.',
    docs: 'language/merge',
  },
  UPSERT: {
    signature: 'MERGE UPSERT destino KEY (...)',
    description: 'Patrón de carga incremental: inserta filas nuevas y actualiza las existentes por clave, sin eliminar las ausentes en el origen.',
    docs: 'language/merge',
  },
  HISTORY: {
    signature: 'MERGE HISTORY destino KEY (...)',
    description: 'Patrón de carga SCD2: mantiene el histórico de cambios versionando los registros con columnas de vigencia.',
    docs: 'language/merge',
  },
  VIRTUAL: {
    signature: 'CREATE VIRTUAL VIEW ...',
    description: 'Define una vista virtual: lógica reutilizable que se expande en compilación sin materializarse como objeto en la base de datos.',
    docs: 'views',
  },
  NONUNIQUE: {
    signature: 'KEY NONUNIQUE (...)',
    description: 'Declara una clave no única en un patrón de carga, permitiendo múltiples filas por valor de clave.',
    docs: 'language/keywords',
  },
  SEMI: {
    signature: 'tabla SEMI JOIN otra ON ...',
    description: 'Devuelve solo las filas de la tabla izquierda que tienen correspondencia en la derecha, sin duplicar ni añadir columnas. Equivale a un `WHERE EXISTS`.',
    docs: 'language/join',
  },
  ANTI: {
    signature: 'tabla ANTI JOIN otra ON ...',
    description: 'Devuelve solo las filas de la tabla izquierda que NO tienen correspondencia en la derecha. Equivale a un `WHERE NOT EXISTS`.',
    docs: 'language/join',
  },
};

// Multi-word phrases (matched separately by the hover provider).
export const PHRASE_DOCS: Record<string, DocEntry> = {
  'CHECK SNOWFLAKE': KEYWORD_DOCS.SNOWFLAKE,
  'MERGE CLONE': KEYWORD_DOCS.CLONE,
  'MERGE UPSERT': KEYWORD_DOCS.UPSERT,
  'MERGE HISTORY': KEYWORD_DOCS.HISTORY,
  'SEMI JOIN': KEYWORD_DOCS.SEMI,
  'ANTI JOIN': KEYWORD_DOCS.ANTI,
  'LEFT JOIN': {
    signature: 'FROM tabla LEFT JOIN otra ON ...',
    description: 'Devuelve todas las filas de la tabla izquierda y las coincidentes de la derecha, completando con `NULL` cuando no hay correspondencia.',
  },
  'RIGHT JOIN': {
    signature: 'FROM tabla RIGHT JOIN otra ON ...',
    description: 'Devuelve todas las filas de la tabla derecha y las coincidentes de la izquierda, completando con `NULL` cuando no hay correspondencia.',
  },
  'INNER JOIN': {
    signature: 'FROM tabla INNER JOIN otra ON ...',
    description: 'Devuelve solo las filas que tienen correspondencia en ambas tablas.',
  },
  'FULL JOIN': {
    signature: 'FROM tabla FULL JOIN otra ON ...',
    description: 'Devuelve todas las filas de ambas tablas, completando con `NULL` las no coincidentes.',
  },
  'CROSS JOIN': {
    signature: 'FROM tabla CROSS JOIN otra',
    description: 'Producto cartesiano: cada fila de la izquierda se combina con cada fila de la derecha.',
  },
  'DELETE AND': {
    signature: 'DELETE AND INSERT destino',
    description: 'Patrón de carga: elimina el contenido previo del destino y lo recarga con el resultado del SELECT.',
    docs: 'language/merge',
  },
  'AND INSERT': {
    signature: 'DELETE AND INSERT destino',
    description: 'Patrón de carga: elimina el contenido previo del destino y lo recarga con el resultado del SELECT.',
    docs: 'language/merge',
  },
};

// ── Functions ─────────────────────────────────────────────────────────
// Function hover/completion docs are now derived from the official docs via
// `npm run sync` and stored in `src/generated/function-docs.ts`.
// This file only provides keyword and multi-word-phrase documentation.
