// Tests de la gramática TextMate generada.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const grammar = JSON.parse(readFileSync(join(ROOT, 'syntaxes', 'crono-sql.tmLanguage.json'), 'utf8'));

function repo(name) {
  const r = grammar.repository[name];
  assert.ok(r, `falta repository.${name}`);
  return r;
}

function firstMatch(name, idx = 0) {
  const p = repo(name).patterns[idx];
  assert.ok(p, `falta pattern ${idx} en ${name}`);
  return p;
}

test('la gramática es JSON válido con scopeName', () => {
  assert.equal(grammar.scopeName, 'source.crono-sql');
  assert.equal(grammar.name, 'Crono SQL');
});

test('los patrones incluidos existen en repository', () => {
  for (const p of grammar.patterns) {
    if (p.include?.startsWith('#')) {
      assert.ok(grammar.repository[p.include.slice(1)], `falta ${p.include}`);
    }
  }
});

test('acciones ETL con cuerpo de propiedades (begin/end)', () => {
  const p = firstMatch('crono-etl-action');
  assert.match(p.begin, /BULK TABLE/);
  assert.match(p.begin, /EXPORT PARQUET/);
  assert.match(p.begin, /IMPORT PARQUET/);
  assert.match(p.begin, /COPY FILE/);
  assert.equal(p.end, '\\)');
  // las propiedades solo dentro del cuerpo de la acción
  const inner = repo('crono-action-inner').patterns.map((x) => x.include);
  assert.ok(inner.includes('#crono-etl-properties'));
  assert.ok(inner.includes('#crono-nested-parens'));
  // y NO a nivel global
  const top = grammar.patterns.map((x) => x.include);
  assert.ok(!top.includes('#crono-etl-properties'));
});

test('propiedades ETL: snake_case, PascalCase y [data]', () => {
  const m = firstMatch('crono-etl-properties').match;
  const rei = new RegExp(m.slice(4), 'i');
  assert.match('source_connection_name=', rei);
  assert.match('SourceConnectionName=', rei);
  assert.match('[data]=', rei);
  assert.doesNotMatch('source_connection_name ', rei); // sin '=' no colorea
});

test('workflow: bloques con pasos PROCEDURE/FILE y paréntesis anidados', () => {
  const p = firstMatch('crono-workflow');
  assert.match(p.begin, /WORKFLOW/);
  assert.match(p.begin, /PARALLEL/);
  assert.match(p.begin, /ASYNC/);
  const inner = p.patterns.map((x) => x.include ?? x.match);
  assert.ok(inner.some((x) => x === '#crono-workflow'), 'recursión de bloques');
  assert.ok(inner.some((x) => typeof x === 'string' && x.includes('PROCEDURE')));
  assert.ok(inner.some((x) => x === '#crono-nested-parens'));
});

test('cabecera YAML solo al inicio del documento', () => {
  const p = firstMatch('crono-yaml-header');
  assert.match(p.begin, /\\A/);
  assert.equal(p.end, '^---\\s*$');
});

test('patrones de carga documentados y sin DELETE AND INSERT', () => {
  const m = firstMatch('crono-load-patterns').match;
  for (const pat of [
    'MERGE\\\\s\\+CLONE', 'MERGE\\\\s\\+UPSERT', 'MERGE\\\\s\\+HISTORY',
    'MERGE\\\\s\\+SOFT\\\\s\\+DELETE', 'INSERT\\\\s\\+IF\\\\s\\+NEW',
    'INSERT\\\\s\\+RAW', 'INSERT\\\\s\\+OVERWRITE', 'CHECK\\\\s\\+SNOWFLAKE',
    'CALCULATE\\\\s\\+JOIN', 'ADD\\\\s\\+COLUMNS', 'NO_ALTER', 'NO_AUDIT',
    'SEMI\\\\s\\+JOIN', 'ANTI\\\\s\\+JOIN',
  ]) {
    assert.match(m, new RegExp(pat), `falta ${pat}`);
  }
  assert.doesNotMatch(m, /DELETE\\\\s\\+AND/);
});

test('keywords y funciones generadas', () => {
  const kw = firstMatch('crono-keywords').match;
  for (const k of ['SELECT', 'ASSERT', 'COMBINE', 'UNPIVOT', 'QUALIFY', 'NO_AUDIT']) {
    assert.match(kw, new RegExp(`\\b${k}\\b`), `falta keyword ${k}`);
  }
  const fn = firstMatch('crono-functions').match;
  for (const f of ['running_sum', 'coalesce', 'pct']) {
    assert.match(fn, new RegExp(`\\b${f}\\b`), `falta función ${f}`);
  }
});
