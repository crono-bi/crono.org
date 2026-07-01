// Crono SQL keywords.
//
// This file mirrors the keyword list of
//   crono.org/src/config/crono-language-data.mjs
// Keep it in sync manually when the source changes.
//
// NOTE: function names are NOT defined here. They are derived from the
// official docs and live in `src/generated/function-docs.ts`
// (regenerate with `npm run sync`). Completion and hover consume that
// generated list exclusively.

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
