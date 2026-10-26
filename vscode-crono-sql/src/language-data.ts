// Crono SQL keywords.
//
// La lista canónica de palabras reservadas se genera desde la documentación
// oficial (crono.org/src/content/docs/sql/language/keywords.md) en
// `src/generated/keywords.ts` mediante `npm run sync`.
//
// NOTE: function names are NOT defined here. They are derived from the
// official docs and live in `src/generated/function-docs.ts`
// (regenerate with `npm run sync`). Completion and hover consume that
// generated list exclusively.

import { CRONO_RESERVED_WORDS } from './generated/keywords';

export const CRONO_KEYWORDS: string[] = CRONO_RESERVED_WORDS;

// Keywords that Crono adds on top of standard SQL (used for richer hovers
// and the "Keyword Crono SQL" completion detail).
export const CRONO_SPECIFIC_KEYWORDS: string[] = [
  'FILTER', 'MATERIALIZE', 'CALCULATE', 'ASSERT', 'SNOWFLAKE',
  'SEMI', 'ANTI', 'CLONE', 'HISTORY', 'UPSERT', 'VIRTUAL', 'NONUNIQUE',
  'COLUMNS', 'COMBINE', 'UNPIVOT', 'QUALIFY', 'MATERIALIZE',
  'NO_ALTER', 'NO_AUDIT', 'OVERWRITE', 'RAISE', 'RAISERROR',
];
