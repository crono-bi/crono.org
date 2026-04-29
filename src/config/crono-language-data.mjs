// Crono SQL language data — plain ESM, no TypeScript.
// Source of truth for the grammar and any build-time tooling that
// cannot import TypeScript files (e.g. astro.config.mjs loaded by esbuild).
// The TypeScript version (crono-language.ts) re-exports these values with types.

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
];

export const CRONO_FUNCTIONS = {
  aggregation: [
    'count', 'countdistinct', 'decile', 'end_date', 'end_datetime',
    'is_first', 'is_last', 'next_value', 'pct', 'pctrank',
    'percentile', 'previous_value', 'quantile', 'quartile',
    'runningpct', 'runningsum', 'single', 'total',
  ],
  conversion: [
    'bigint', 'bit', 'date', 'datetime', 'datetimeoffset',
    'float', 'int', 'time', 'varchar',
  ],
  dates: [
    'adddays', 'addmonths', 'current_date', 'current_time',
    'current_timestamp', 'current_year', 'datediff', 'datename',
    'datepart', 'daysago', 'daysdiff', 'fromjuliandate', 'fromunixdate',
    'hour', 'isodate', 'isomonth', 'isoweek', 'isoweekcode',
    'isoweekshortcode', 'isoweekyear', 'juliandate',
    'mmmm', 'mmmmyyyy', 'mmmyyyy', 'month',
    'previousday', 'today', 'tomorrow', 'weekday', 'weekdaynumber',
    'year', 'yesterday', 'yyyy', 'yyyymm', 'yyyymmdd',
  ],
  informational: [
    'current_catalog', 'current_user', 'currentusername',
    'databaseextendedproperty', 'session_user', 'system_user',
  ],
  nullsAndConditions: [
    'coalesce', 'elementat', 'emptyifnull', 'indexof',
    'nullifempty', 'nullifzero', 'switch', 'zeroifnull',
  ],
  numeric: [
    'addition', 'average', 'countvalues', 'divide', 'hash',
    'margin', 'markup', 'maximum', 'minimum', 'mod',
    'pctvariance', 'round', 'substraction',
  ],
  text: [
    'abc', 'bighex', 'char', 'hex', 'left', 'right',
    'slice', 'slugify', 'smallhex', 'split', 'tinyhex', 'trim', 'uchar',
  ],
  obsolete: [
    'nvarchar', 'smallint', 'tinyint',
  ],
};
