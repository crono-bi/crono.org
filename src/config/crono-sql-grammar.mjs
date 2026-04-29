// Crono SQL Grammar
// Extends the built-in SQL grammar with Crono-specific keywords and functions.
// Uses { include: 'source.sql' } so EC/Shiki loads SQL natively (no version mismatch).
// embeddedLangsLazy tells Expressive Code to load SQL before this grammar.
import { CRONO_FUNCTIONS } from './crono-language-data.mjs';

// Crono-specific functions, longest first to avoid partial matches
const allFunctions = [
  ...CRONO_FUNCTIONS.aggregation,
  ...CRONO_FUNCTIONS.conversion,
  ...CRONO_FUNCTIONS.dates,
  ...CRONO_FUNCTIONS.informational,
  ...CRONO_FUNCTIONS.nullsAndConditions,
  ...CRONO_FUNCTIONS.numeric,
  ...CRONO_FUNCTIONS.text,
].sort((a, b) => b.length - a.length);

const functionsPattern = allFunctions.join('|');

// Crono-specific keywords that standard SQL doesn't highlight
const keywordsPattern = [
  'CHECK\\s+SNOWFLAKE',
  'DELETE\\s+AND\\s+INSERT',
  'MERGE\\s+CLONE',
  'MERGE\\s+HISTORY',
  'MERGE\\s+UPSERT',
  'SEMI\\s+JOIN',
  'ANTI\\s+JOIN',
  'MATERIALIZE',
  'CALCULATE',
  'ASSERT',
  'FILTER',
  'SNOWFLAKE',
  'UPSERT',
  'CLONE',
  'HISTORY',
  'VIRTUAL',
  'NONUNIQUE',
].join('|');

export default {
  name: 'crono-sql',
  scopeName: 'source.crono-sql',
  aliases: ['cronosql'],
  // Tell EC to load SQL first so source.sql is available for our include
  embeddedLangsLazy: ['sql'],
  patterns: [
    // Crono-specific keywords — checked BEFORE SQL patterns
    { name: 'keyword.other.crono-sql', match: `(?i)\\b(${keywordsPattern})\\b` },
    // Crono-specific functions (when followed by parenthesis)
    { name: 'support.function.crono-sql', match: `(?i)\\b(${functionsPattern})\\s*(?=\\()` },
    // All standard SQL highlighting
    { include: 'source.sql' },
  ],
};
