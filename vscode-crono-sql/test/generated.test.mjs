// Tests de los datos generados desde la documentación oficial.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { CRONO_RESERVED_WORDS } from '../dist/generated/keywords.js';
import {
  ETL_ACTION_DOCS,
  ETL_ACTION_PROPERTIES,
  ETL_PROPERTY_DOCS,
  AUDIT_HEADER_PROPERTIES,
} from '../dist/generated/etl-data.js';
import { CRONO_FUNCTION_NAMES } from '../dist/generated/function-docs.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = join(ROOT, '..', 'src', 'content', 'docs');

test('keywords generadas coinciden con keywords.md', () => {
  const md = readFileSync(join(DOCS, 'sql', 'language', 'keywords.md'), 'utf8');
  const docWords = new Set();
  for (const raw of md.split('\n')) {
    const line = raw.trim();
    if (!line.startsWith('|') || line.startsWith('|-') || line.startsWith('|Keyword')) continue;
    for (const cell of line.split('|').map((c) => c.trim()).filter(Boolean)) {
      docWords.add(cell);
    }
  }
  assert.deepEqual([...docWords].sort(), [...CRONO_RESERVED_WORDS].sort());
  assert.ok(CRONO_RESERVED_WORDS.length > 200);
});

test('acciones ETL generadas', () => {
  for (const a of ['BULK TABLE', 'EXPORT PARQUET', 'IMPORT PARQUET', 'COPY FILE', 'WORKFLOW']) {
    assert.ok(ETL_ACTION_DOCS[a], `falta acción ${a}`);
    assert.match(ETL_ACTION_DOCS[a].docs, /^etl\//);
  }
});

test('propiedades ETL por acción', () => {
  const bulk = ETL_ACTION_PROPERTIES['BULK TABLE'];
  assert.ok(bulk.includes('source_connection_name'));
  assert.ok(bulk.includes('data'));
  assert.ok(ETL_ACTION_PROPERTIES['EXPORT PARQUET'].includes('filename'));
  assert.ok(ETL_ACTION_PROPERTIES['COPY FILE'].includes('source_location'));
  assert.ok(ETL_PROPERTY_DOCS['data'].description.length > 0);
});

test('propiedades de la cabecera auditada', () => {
  for (const p of ['jobname', 'sendlogto', 'sendfailurelogto', 'logcontent', 'condition']) {
    assert.ok(AUDIT_HEADER_PROPERTIES[p], `falta ${p}`);
  }
});

test('funciones generadas existen y son consistentes', () => {
  assert.ok(CRONO_FUNCTION_NAMES.length >= 100);
  assert.ok(CRONO_FUNCTION_NAMES.includes('running_sum'));
  assert.ok(CRONO_FUNCTION_NAMES.includes('coalesce'));
});
