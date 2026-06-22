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
};

// ── Functions ─────────────────────────────────────────────────────────
// Detailed entries for the most relevant functions. Functions without an
// explicit entry fall back to a generic message built from their category.
export const FUNCTION_DOCS: Record<string, DocEntry> = {
  // Aggregation / window
  sum: { signature: 'sum(expr)', description: 'Suma de los valores del grupo.' },
  avg: { signature: 'avg(expr)', description: 'Media aritmética de los valores del grupo.' },
  count: { signature: 'count(expr)', description: 'Número de filas (o de valores no nulos de `expr`).' },
  countdistinct: { signature: 'countdistinct(expr)', description: 'Número de valores distintos no nulos.' },
  max: { signature: 'max(expr)', description: 'Valor máximo del grupo.' },
  min: { signature: 'min(expr)', description: 'Valor mínimo del grupo.' },
  pct: { signature: 'pct(expr)', description: 'Porcentaje que representa cada valor sobre el total del grupo.' },
  pctrank: { signature: 'pctrank(expr order by ...)', description: 'Rango percentil de cada fila dentro de la partición.' },
  percentile: { signature: 'percentile(expr, p)', description: 'Valor en el percentil `p` (0–1) del grupo.' },
  quantile: { signature: 'quantile(expr, q)', description: 'Cuantil `q` de la distribución del grupo.' },
  quartile: { signature: 'quartile(expr, n)', description: 'Cuartil `n` (1–4) del grupo.' },
  decile: { signature: 'decile(expr, n)', description: 'Decil `n` (1–10) del grupo.' },
  runningsum: {
    signature: 'runningsum(expr [partition by ...] order by ...)',
    description: 'Suma acumulada desde el inicio del rango hasta cada fila. Requiere `ORDER BY`.',
    docs: 'functions/agregacion/running_sum',
  },
  runningpct: {
    signature: 'runningpct(expr [partition by ...] order by ...)',
    description: 'Porcentaje acumulado sobre el total, fila a fila. Requiere `ORDER BY`.',
    docs: 'functions/agregacion/running_pct',
  },
  next_value: { signature: 'next_value(expr order by ...)', description: 'Valor de la fila siguiente dentro de la partición.' },
  previous_value: { signature: 'previous_value(expr order by ...)', description: 'Valor de la fila anterior dentro de la partición.' },
  is_first: { signature: 'is_first(order by ...)', description: 'Indica si la fila es la primera de su partición.' },
  is_last: { signature: 'is_last(order by ...)', description: 'Indica si la fila es la última de su partición.' },
  end_date: { signature: 'end_date(order by ...)', description: 'Fecha de fin de vigencia derivada de la fila siguiente (útil en SCD2).' },
  end_datetime: { signature: 'end_datetime(order by ...)', description: 'Marca de fin de vigencia (datetime) derivada de la fila siguiente.' },
  // Nulls & conditions
  coalesce: { signature: 'coalesce(a, b, ...)', description: 'Devuelve el primer argumento no nulo.' },
  switch: { signature: 'switch(valor, caso1, res1, ..., [default])', description: 'Selecciona un resultado según el valor de entrada. Alternativa concisa a `CASE`.' },
  if: { signature: 'if(condición, entonces, si_no)', description: 'Expresión condicional en línea.' },
  emptyifnull: { signature: 'emptyifnull(expr)', description: 'Devuelve cadena vacía si `expr` es NULL.' },
  nullifempty: { signature: 'nullifempty(expr)', description: 'Devuelve NULL si `expr` es cadena vacía.' },
  zeroifnull: { signature: 'zeroifnull(expr)', description: 'Devuelve 0 si `expr` es NULL.' },
  nullifzero: { signature: 'nullifzero(expr)', description: 'Devuelve NULL si `expr` es 0 (evita divisiones por cero).' },
  indexof: { signature: 'indexof(texto, sub)', description: 'Posición de la primera aparición de `sub` en `texto`.' },
  elementat: { signature: 'elementat(array, n)', description: 'Elemento en la posición `n` del array.' },
  // Dates
  year: { signature: 'year(fecha)', description: 'Año de la fecha.' },
  month: { signature: 'month(fecha)', description: 'Mes de la fecha (1–12).' },
  hour: { signature: 'hour(datetime)', description: 'Hora del datetime (0–23).' },
  adddays: { signature: 'adddays(fecha, n)', description: 'Suma `n` días a la fecha.' },
  addmonths: { signature: 'addmonths(fecha, n)', description: 'Suma `n` meses a la fecha.' },
  daysago: { signature: 'daysago(n)', description: 'Fecha de hace `n` días respecto a hoy.' },
  daysdiff: { signature: 'daysdiff(inicio, fin)', description: 'Número de días entre dos fechas.' },
  today: { signature: 'today()', description: 'Fecha actual (sin hora).' },
  yesterday: { signature: 'yesterday()', description: 'Fecha de ayer.' },
  tomorrow: { signature: 'tomorrow()', description: 'Fecha de mañana.' },
  weekday: { signature: 'weekday(fecha)', description: 'Nombre del día de la semana.' },
  weekdaynumber: { signature: 'weekdaynumber(fecha)', description: 'Número del día de la semana.' },
  yyyy: { signature: 'yyyy(fecha)', description: 'Año como texto `AAAA`.' },
  yyyymm: { signature: 'yyyymm(fecha)', description: 'Periodo como texto `AAAAMM`.' },
  yyyymmdd: { signature: 'yyyymmdd(fecha)', description: 'Fecha como texto `AAAAMMDD`.' },
  isoweek: { signature: 'isoweek(fecha)', description: 'Semana ISO 8601 de la fecha.' },
  isoweekyear: { signature: 'isoweekyear(fecha)', description: 'Año ISO 8601 asociado a la semana.' },
  // Text
  concat: { signature: 'concat(a, b, ...)', description: 'Concatena cadenas.' },
  trim: { signature: 'trim(texto)', description: 'Elimina espacios al inicio y al final.' },
  left: { signature: 'left(texto, n)', description: 'Primeros `n` caracteres.' },
  right: { signature: 'right(texto, n)', description: 'Últimos `n` caracteres.' },
  slice: { signature: 'slice(texto, inicio, fin)', description: 'Subcadena entre dos posiciones.' },
  split: { signature: 'split(texto, separador)', description: 'Divide el texto en un array según el separador.' },
  slugify: { signature: 'slugify(texto)', description: 'Convierte el texto en un slug seguro para URLs/identificadores.' },
  hash: { signature: 'hash(expr)', description: 'Valor hash de la expresión.' },
  // Numeric
  round: { signature: 'round(numero, [decimales])', description: 'Redondea al número de decimales indicado.' },
  divide: { signature: 'divide(a, b)', description: 'División segura (gestiona divisor cero).' },
  margin: { signature: 'margin(precio, coste)', description: 'Margen porcentual sobre el precio.' },
  markup: { signature: 'markup(precio, coste)', description: 'Markup porcentual sobre el coste.' },
  pctvariance: { signature: 'pctvariance(actual, previo)', description: 'Variación porcentual entre dos valores.' },
  mod: { signature: 'mod(a, b)', description: 'Resto de la división de `a` entre `b`.' },
  // Conversion (type casts)
  int: { signature: 'int(expr)', description: 'Convierte a entero.' },
  bigint: { signature: 'bigint(expr)', description: 'Convierte a entero de 64 bits.' },
  float: { signature: 'float(expr)', description: 'Convierte a coma flotante.' },
  varchar: { signature: 'varchar(expr)', description: 'Convierte a texto.' },
  date: { signature: 'date(expr)', description: 'Convierte a fecha.' },
  datetime: { signature: 'datetime(expr)', description: 'Convierte a fecha y hora.' },
  // Metadata
  current_user: { signature: 'current_user()', description: 'Usuario actual de la sesión.' },
  current_catalog: { signature: 'current_catalog()', description: 'Catálogo/base de datos actual.' },
};
