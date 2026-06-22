// Crono SQL language data — keywords and functions.
//
// SINGLE SOURCE OF TRUTH: this file mirrors
//   crono.org/src/config/crono-language-data.mjs
// Regenerate it with `npm run sync` to avoid divergence.
// Do NOT hand-edit the lists below; edit the source and re-sync.

export type FunctionCategory =
  | 'aggregation'
  | 'conversion'
  | 'dates'
  | 'metadata'
  | 'nullsAndConditions'
  | 'numeric'
  | 'text';

export const CRONO_KEYWORDS: string[] = [
  // Core SELECT
  'SELECT', 'FILTER', 'MATERIALIZE', 'CALCULATE', 'ASSERT',
  'CHECK', 'SNOWFLAKE', 'TOP', 'OVER', 'SEMI', 'JOIN', 'ANTI',
  // ETL statements
  'DELETE', 'INSERT', 'UPDATE', 'MERGE', 'TRUNCATE',
  'CLONE', 'HISTORY', 'UPSERT',
  // Modifiers
  'ALL', 'AND',
  // DDL
  'CREATE', 'ALTER', 'DROP', 'TABLE', 'VIEW', 'FUNCTION', 'PROCEDURE',
  'COLUMN', 'REPLACE', 'VIRTUAL',
  // Standard SQL
  'FROM', 'WHERE', 'GROUP', 'BY', 'ORDER', 'HAVING', 'LIMIT',
  'LEFT', 'RIGHT', 'INNER', 'OUTER', 'FULL', 'CROSS',
  'ON', 'USING', 'AS', 'WITH', 'UNION', 'EXCEPT', 'INTERSECT',
  'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
  'IN', 'NOT', 'IS', 'NULL', 'LIKE', 'BETWEEN', 'EXISTS',
  'DISTINCT', 'ASC', 'DESC', 'NULLS', 'FIRST', 'LAST',
  'PRIMARY', 'FOREIGN', 'KEY', 'UNIQUE', 'NONUNIQUE',
  'IF', 'INTO', 'VALUES', 'SET',
];

// Keywords that Crono adds on top of standard SQL (used for richer hovers).
export const CRONO_SPECIFIC_KEYWORDS: string[] = [
  'FILTER', 'MATERIALIZE', 'CALCULATE', 'ASSERT', 'SNOWFLAKE',
  'SEMI', 'ANTI', 'CLONE', 'HISTORY', 'UPSERT', 'VIRTUAL', 'NONUNIQUE',
];

export const CRONO_FUNCTIONS: Record<FunctionCategory, string[]> = {
  aggregation: [
    'avg', 'count', 'countdistinct', 'decile', 'end_date', 'end_datetime',
    'is_first', 'is_last', 'max', 'min', 'next_value', 'pct', 'pctrank',
    'percentile', 'previous_value', 'quantile', 'quartile',
    'runningpct', 'runningsum', 'sum',
  ],
  conversion: [
    'bigint', 'bit', 'date', 'datetime', 'datetimeoffset',
    'float', 'int', 'real', 'smallint', 'time', 'tinyint', 'varchar',
  ],
  dates: [
    'adddays', 'addmonths', 'current_date', 'current_datetime', 'current_time',
    'current_timestamp', 'current_year', 'daysago', 'daysdiff',
    'fromjuliandate', 'fromunixdate', 'hour',
    'isodate', 'isomonth', 'isoweek', 'isoweekyear', 'juliandate',
    'mmmm', 'mmmmyyyy', 'mmmyyyy', 'month',
    'previousday', 'today', 'tomorrow', 'weekday', 'weekdaynumber',
    'year', 'yesterday', 'yyyy', 'yyyymm', 'yyyymmdd',
  ],
  metadata: [
    'current_catalog', 'current_user', 'session_user', 'system_user',
  ],
  nullsAndConditions: [
    'coalesce', 'elementat', 'emptyifnull', 'if', 'indexof',
    'nullifempty', 'nullifzero', 'switch', 'zeroifnull',
  ],
  numeric: [
    'addition', 'average', 'countvalues', 'divide',
    'margin', 'markup', 'maximum', 'minimum', 'mod',
    'pctvariance', 'round', 'substraction',
  ],
  text: [
    'abc', 'char', 'concat', 'hash', 'hex', 'left', 'right',
    'slice', 'slugify', 'split', 'trim',
  ],
};

// Human-readable category labels (Spanish), aligned with the docs.
export const CATEGORY_LABELS: Record<FunctionCategory, string> = {
  aggregation: 'Agregación',
  conversion: 'Conversión de tipos',
  dates: 'Fechas',
  metadata: 'Metadata',
  nullsAndConditions: 'Nulos y condiciones',
  numeric: 'Numéricas',
  text: 'Texto',
};

// Flat list of every function name.
export const CRONO_ALL_FUNCTIONS: string[] = Object.values(CRONO_FUNCTIONS).flat();

// Reverse lookup: function name -> category.
export const FUNCTION_CATEGORY: Record<string, FunctionCategory> = (() => {
  const map: Record<string, FunctionCategory> = {};
  (Object.keys(CRONO_FUNCTIONS) as FunctionCategory[]).forEach((cat) => {
    for (const fn of CRONO_FUNCTIONS[cat]) {
      map[fn] = cat;
    }
  });
  return map;
})();
