// Crono SQL language definition
// Keywords and functions for syntax highlighting and autocompletion

export const CRONO_KEYWORDS = [
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
] as const

export const CRONO_FUNCTIONS = {
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
  others: [],
} as const

// Flat list of all functions (for easy iteration)
export const CRONO_ALL_FUNCTIONS = Object.values(CRONO_FUNCTIONS).flat()

// Function names by category label (for display/docs)
export const CRONO_FUNCTION_CATEGORIES: Record<string, readonly string[]> = {
  'Agregación':           CRONO_FUNCTIONS.aggregation,
  'Conversión de tipos':  CRONO_FUNCTIONS.conversion,
  'Fechas':               CRONO_FUNCTIONS.dates,
  'Metadata':             CRONO_FUNCTIONS.metadata,
  'Nulos y condiciones':  CRONO_FUNCTIONS.nullsAndConditions,
  'Numéricas':            CRONO_FUNCTIONS.numeric,
  'Texto':                CRONO_FUNCTIONS.text,
  'Otras':                CRONO_FUNCTIONS.others,
}
