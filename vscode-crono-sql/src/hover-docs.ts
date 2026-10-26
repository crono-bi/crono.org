// Hover documentation for Crono SQL keywords and phrases.
// Content is condensed from the official docs at crono.org.
// `docs` paths are relative to https://crono.org/ (e.g. sql/language/select,
// etl/data-movement/bulk-table).

export interface DocEntry {
  /** Short signature shown as a code block at the top of the hover. */
  signature: string;
  /** Markdown description of the keyword/function. */
  description: string;
  /** Optional docs path (relative to crono.org) for the "see more" link. */
  docs?: string;
}

// ── Crono-specific keywords ───────────────────────────────────────────
export const KEYWORD_DOCS: Record<string, DocEntry> = {
  MATERIALIZE: {
    signature: 'tabla MATERIALIZE alias',
    description: 'Crea una tabla temporal con el resultado de una subconsulta antes de que se ejecute la consulta principal. Simplifica el plan de ejecución y mejora el rendimiento en consultas complejas.',
    docs: 'sql/language/select',
  },
  CALCULATE: {
    signature: 'CALCULATE [JOIN] ( expresión alias, ... ) alias',
    description: 'Define un conjunto de columnas derivadas a partir de cualquier columna disponible en la consulta. Se compila como `CROSS JOIN LATERAL`; la palabra `JOIN` es opcional. No disponible en BigQuery ni Redshift.',
    docs: 'sql/language/join',
  },
  FILTER: {
    signature: 'tabla FILTER (condición) [alias]',
    description: 'Modificador de tabla que aplica una condición sobre los registros antes de que se ejecute el JOIN. Genera una subconsulta sobre la tabla; se declara junto a la tabla a la que pertenece.',
    docs: 'sql/language/select',
  },
  COLUMNS: {
    signature: 'tabla COLUMNS (col, otra alias, ...) [FILTER (cond)]',
    description: 'Modificador de tabla que selecciona y opcionalmente renombra un subconjunto de columnas, descartando el resto. Genera una subconsulta; se puede combinar con `FILTER`.',
    docs: 'sql/language/select',
  },
  ASSERT: {
    signature: "ASSERT [NOT] EXISTS OR RAISE 'mensaje' SELECT ...",
    description: 'Aserción que blinda la carga: `ASSERT NOT EXISTS OR RAISE` falla si la consulta devuelve registros; `ASSERT EXISTS OR RAISE` falla si no devuelve ninguno. La ejecución se detiene antes de escribir datos incorrectos.',
    docs: 'sql/language/assert',
  },
  CHECK: {
    signature: 'FROM ... JOIN ... CHECK SNOWFLAKE [WHERE ...]',
    description: 'Ver `CHECK SNOWFLAKE`.',
    docs: 'sql/language/select',
  },
  SNOWFLAKE: {
    signature: 'FROM ... JOIN ... CHECK SNOWFLAKE',
    description: 'Cláusula situada tras los JOINs que verifica en tiempo de ejecución que las relaciones no pierden ni duplican registros de la tabla del FROM. Si falla, la consulta devuelve un error antes de escribir en destino.',
    docs: 'sql/language/select',
  },
  COMBINE: {
    signature: 'COMBINE KEY col|(cols) consulta (SELECT...), consulta2 (SELECT...)',
    description: 'Combina dos o más consultas en un único resultado haciendo un FULL JOIN sobre las claves indicadas. Evita repetir los JOINs comunes de un UNION.',
    docs: 'sql/language/select',
  },
  UNPIVOT: {
    signature: 'UNPIVOT (valor FOR nombre IN (col1, col2)) AS alias',
    description: 'Convierte columnas en filas, multiplicando los registros. Es la operación inversa a PIVOT; Crono SQL soporta la sintaxis estándar y la compila a cada motor.',
    docs: 'sql/language/unpivot',
  },
  CLONE: {
    signature: 'MERGE CLONE destino KEY (...) SELECT ...',
    description: 'Patrón de carga (SCD tipo 1): inserta los registros nuevos, actualiza los que han cambiado y elimina los que ya no aparecen en el origen.',
    docs: 'sql/language/merge',
  },
  UPSERT: {
    signature: 'MERGE UPSERT destino KEY (...) SELECT ...',
    description: 'Patrón de carga incremental: inserta los registros nuevos y actualiza los que han cambiado, sin eliminar los ausentes en el origen.',
    docs: 'sql/language/merge',
  },
  HISTORY: {
    signature: 'MERGE HISTORY destino KEY (...) SELECT ...',
    description: 'Patrón de carga (SCD tipo 2): mantiene el historial completo de cambios; la versión anterior se cierra con `end_date` y se inserta una nueva con `start_date`.',
    docs: 'sql/language/merge',
  },
  VIRTUAL: {
    signature: 'DECLARE VIRTUAL VIEW esquema.nombre SELECT ...',
    description: 'Vista virtual: consulta con nombre que se declara una vez y puede usarse desde cualquier parte del proyecto. No se crea en la base de datos; se resuelve al compilar.',
    docs: 'etl/data-movement/export-parquet',
  },
  NONUNIQUE: {
    signature: 'INDEX NONUNIQUE (col) | restricción NONUNIQUE',
    description: 'Declara una restricción o índice no único en el DDL (puede ser CLUSTERED o NONCLUSTERED y admite INCLUDE).',
    docs: 'sql/language/ddl',
  },
  SEMI: {
    signature: 'tabla SEMI JOIN otra ON/USING ...',
    description: 'Devuelve solo las filas de la tabla izquierda que tienen correspondencia en la derecha, sin duplicar ni añadir columnas. Equivale a un `WHERE EXISTS`.',
    docs: 'sql/language/join',
  },
  ANTI: {
    signature: 'tabla ANTI JOIN otra ON/USING ...',
    description: 'Devuelve solo las filas de la tabla izquierda que NO tienen correspondencia en la derecha. Equivale a un `WHERE NOT EXISTS`.',
    docs: 'sql/language/join',
  },
  QUALIFY: {
    signature: 'SELECT ... QUALIFY condición',
    description: 'Filtra sobre el resultado de funciones de ventana, como `WHERE` lo hace sobre filas.',
    docs: 'sql/language/select',
  },
  KEY: {
    signature: 'KEY (col1, col2, ...)',
    description: 'Clave de carga declarada en la cabecera de los patrones de carga y de COMBINE. Identifica el registro y determina qué filas se insertan, actualizan o eliminan.',
    docs: 'sql/language/load-patterns',
  },
  DELETE: {
    signature: 'DELETE destino KEY (...) SELECT ...',
    description: 'Patrón de carga: elimina los registros de la tabla destino cuya clave coincida con los devueltos por la consulta. La `KEY` es obligatoria. También soporta la sintaxis ANSI `DELETE FROM ... WHERE ...`.',
    docs: 'sql/language/delete',
  },
  UPDATE: {
    signature: 'UPDATE destino KEY (...) SELECT ...',
    description: 'Patrón de carga: actualiza los registros existentes identificados por la clave de carga.',
    docs: 'sql/language/load-patterns',
  },
  WORKFLOW: {
    signature: "WORKFLOW ['nombre'] ( paso, paso, ... )",
    description: 'Acción ETL de orquestación: ejecuta sus pasos de uno en uno, en el orden escrito. Los pasos pueden ser tablas, `PROCEDURE`, `FILE` u otros bloques `WORKFLOW`/`PARALLEL`/`ASYNC`.',
    docs: 'etl/orchestration/workflow',
  },
  PARALLEL: {
    signature: "PARALLEL ['nombre'] ( paso, paso, ... )",
    description: 'Bloque de orquestación: inicia todos sus pasos a la vez y espera a que terminen todos antes de continuar con el paso siguiente.',
    docs: 'etl/orchestration/workflow',
  },
  ASYNC: {
    signature: "ASYNC ['nombre'] ( paso, paso, ... )",
    description: 'Bloque de orquestación: ejecuta sus pasos en segundo plano; el bloque que lo contiene continúa inmediatamente sin esperar a que terminen.',
    docs: 'etl/orchestration/workflow',
  },
  PROCEDURE: {
    signature: "PROCEDURE nombre[('param', ...)]",
    description: 'Paso de workflow: ejecuta un procedimiento concreto por su nombre, con parámetros posicionales si los necesita.',
    docs: 'etl/orchestration/workflow',
  },
  FILE: {
    signature: "FILE 'ruta/fichero.job' | FILE 'ruta/fichero.sql'",
    description: 'Paso de workflow: ejecuta un fichero `.job` (la acción que contiene) o un fichero `.sql` (código Crono SQL transpilado a la conexión activa).',
    docs: 'etl/orchestration/workflow',
  },
};

// Multi-word phrases (matched by the hover provider over a line window).
export const PHRASE_DOCS: Record<string, DocEntry> = {
  'CHECK SNOWFLAKE': KEYWORD_DOCS.SNOWFLAKE,
  'MERGE CLONE': KEYWORD_DOCS.CLONE,
  'MERGE UPSERT': KEYWORD_DOCS.UPSERT,
  'MERGE HISTORY': KEYWORD_DOCS.HISTORY,
  'MERGE SOFT DELETE': {
    signature: 'MERGE SOFT DELETE destino KEY (...) SELECT ...',
    description: 'Patrón de carga: como `MERGE UPSERT`, pero los registros ausentes en el origen se marcan con `delete_date` en lugar de ignorarse o eliminarse.',
    docs: 'sql/language/merge',
  },
  'INSERT RAW': {
    signature: 'INSERT RAW INTO destino SELECT ...',
    description: 'Patrón de carga: inserta todos los registros de la consulta sin comprobación de duplicados. Es el único patrón que no admite `KEY`.',
    docs: 'sql/language/insert',
  },
  'INSERT IF NEW': {
    signature: 'INSERT IF NEW INTO destino KEY (...) SELECT ...',
    description: 'Patrón de carga: inserta únicamente los registros que aún no existen en destino (por clave); los existentes se ignoran, no se actualizan.',
    docs: 'sql/language/insert',
  },
  'INSERT OVERWRITE': {
    signature: 'INSERT OVERWRITE [INTO] destino [KEY (...)] SELECT ...',
    description: 'Patrón de recarga: elimina el contenido de la tabla destino y lo recarga. Con `KEY`, elimina solo las filas cuya clave devuelve la consulta. Es el único patrón donde la `KEY` es opcional.',
    docs: 'sql/language/insert',
  },
  'ASSERT NOT EXISTS OR RAISE': {
    signature: "ASSERT NOT EXISTS OR RAISE 'mensaje' SELECT ...",
    description: 'Falla si la consulta devuelve algún registro. Se escribe la consulta que devuelve los registros problemáticos y, si aparece alguno, la carga se detiene.',
    docs: 'sql/language/assert',
  },
  'ASSERT EXISTS OR RAISE': {
    signature: "ASSERT EXISTS OR RAISE 'mensaje' SELECT ...",
    description: 'Falla si la consulta no devuelve ningún registro. Se usa para verificar que una condición esperada se cumple (p. ej., volumen de datos dentro de rango).',
    docs: 'sql/language/assert',
  },
  'CALCULATE JOIN': KEYWORD_DOCS.CALCULATE,
  'ADD COLUMNS': {
    signature: 'tabla ADD COLUMNS (expr alias, ...) [FILTER (cond)]',
    description: 'Modificador de tabla que conserva todas las columnas físicas y añade expresiones calculadas, disponibles como columnas nuevas en el resto de la consulta.',
    docs: 'sql/language/select',
  },
  'NO_ALTER': {
    signature: '<patrón de carga> ... NO_ALTER',
    description: 'Desactiva el mantenimiento automático de la tabla: Crono SQL asume que ya existe con el esquema correcto y no realiza comprobaciones ni DDL antes de la carga.',
    docs: 'sql/language/load-patterns',
  },
  'NO_AUDIT': {
    signature: '<patrón de carga> ... NO_AUDIT',
    description: 'Desactiva la auditoría automática para la sentencia: no se añaden ni gestionan los campos de auditoría (`insert_date`, `update_date`...). Combinable con `NO_ALTER`.',
    docs: 'sql/language/load-patterns',
  },
  'DECLARE VIRTUAL VIEW': KEYWORD_DOCS.VIRTUAL,
  'SEMI JOIN': KEYWORD_DOCS.SEMI,
  'ANTI JOIN': KEYWORD_DOCS.ANTI,
  'LEFT JOIN': {
    signature: 'FROM tabla LEFT JOIN otra ON/USING ...',
    description: 'Devuelve todas las filas de la tabla izquierda y las coincidentes de la derecha, completando con `NULL` cuando no hay correspondencia.',
    docs: 'sql/language/join',
  },
  'RIGHT JOIN': {
    signature: 'FROM tabla RIGHT JOIN otra ON/USING ...',
    description: 'Devuelve todas las filas de la tabla derecha y las coincidentes de la izquierda, completando con `NULL` cuando no hay correspondencia.',
    docs: 'sql/language/join',
  },
  'INNER JOIN': {
    signature: 'FROM tabla INNER JOIN otra ON/USING ...',
    description: 'Devuelve solo las filas que tienen correspondencia en ambas tablas.',
    docs: 'sql/language/join',
  },
  'FULL JOIN': {
    signature: 'FROM tabla FULL JOIN otra ON/USING ...',
    description: 'Devuelve todas las filas de ambas tablas, completando con `NULL` las no coincidentes.',
    docs: 'sql/language/join',
  },
  'CROSS JOIN': {
    signature: 'FROM tabla CROSS JOIN otra',
    description: 'Producto cartesiano: cada fila de la izquierda se combina con cada fila de la derecha.',
    docs: 'sql/language/join',
  },
  'PRIMARY KEY': {
    signature: 'expresión alias tipo PRIMARY KEY',
    description: 'Declara la clave primaria de la tabla en la especificación de columnas del SELECT. Con varios campos `PRIMARY KEY` se crea una PK compuesta.',
    docs: 'sql/language/load-patterns',
  },
};

// ── ETL action properties ─────────────────────────────────────────────
// Descriptions come from the generated docs (src/generated/etl-data.ts);
// signatures are maintained here.
export const PROPERTY_SIGNATURES: Record<string, string> = {
  source_connection_name: "source_connection_name = '...'",
  target_connection_name: "target_connection_name = '...'",
  database_name: "database_name = '...'",
  schema_name: "schema_name = '...'",
  table_name: "table_name = '...'",
  target_schema_name: "target_schema_name = '...'",
  target_table_name: "target_table_name = '...'",
  source_location: "source_location = '...'",
  target_location: "target_location = '...'",
  filename: "filename = '...'",
  clean_mode: "clean_mode = 'Drop' | 'Delete' | 'Truncate'",
  create_if_not_exists: 'create_if_not_exists = YES | NO',
  collation: "collation = '...'",
  command_timeout: 'command_timeout = segundos',
  skip_empty_tables: 'skip_empty_tables = YES | NO',
  parallel_execution: 'parallel_execution = YES | NO',
  max_degree_of_parallelism: 'max_degree_of_parallelism = n',
  data: '[data] = ( SELECT ... )',
};

// ── Functions ─────────────────────────────────────────────────────────
// Function hover/completion docs are derived from the official docs via
// `npm run sync` and stored in `src/generated/function-docs.ts`.
// This file only provides keyword and multi-word-phrase documentation.
