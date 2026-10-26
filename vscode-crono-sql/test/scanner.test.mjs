// Tests del scanner léxico (dist/scanner.js tras `npm run build`).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { contextAt, bracketedActionAt, yamlHeaderRange } from '../dist/scanner.js';

const JOB = `---
JobName: Carga DWH
SendLogTo: it@example.com
Condition:
	SELECT IF(COUNT(*)<>0)
	FROM audit.pending_loads
---

[bulk table](
	source_connection_name='ERP -- not a comment',
	clean_mode='Drop',
	[data]=(
		select schema_name, table_name
		from audit.source_tables
	)
)

WORKFLOW 'Ventas' (
	dwh.customers,
	PARALLEL 'x' (
		dwh.a,
		dwh.b
	),
	PROCEDURE dwh.close_period('2026-09', 1),
	FILE 'x.sql'
)

-- un comentario de línea
SELECT '-- falso comentario' FROM t;
`;

function at(doc, needle, extra = 0) {
  const i = doc.indexOf(needle);
  if (i === -1) throw new Error(`needle not found: ${needle}`);
  return i + extra;
}

test('yaml header detecta cabecera al inicio', () => {
  const ctx = contextAt(JOB, at(JOB, 'JobName'));
  assert.equal(ctx.inYamlHeader, true);
  const ctx2 = contextAt(JOB, at(JOB, 'SELECT IF'));
  assert.equal(ctx2.inYamlHeader, true);
});

test('yamlHeaderRange no detecta --- que no está al inicio', () => {
  assert.equal(yamlHeaderRange('SELECT 1\n---\n'), null);
  const r = yamlHeaderRange(JOB);
  assert.ok(r && r.start === 0 && r.end > 50);
});

test('comentarios de línea y de bloque', () => {
  assert.equal(contextAt(JOB, at(JOB, 'un comentario')).inComment, true);
  assert.equal(contextAt('a /* xx */ b', 6).inComment, true);
  assert.equal(contextAt('a /* xx */ b', 10).inComment, false);
});

test('cadenas con escape de comilla doble', () => {
  const doc = "select 'it''s ok' + x";
  assert.equal(contextAt(doc, doc.indexOf("s ok")).inString, true);
  assert.equal(contextAt(doc, doc.length - 1).inString, false);
});

test('cuerpo de acción [bulk table](...)', () => {
  const ctx = contextAt(JOB, at(JOB, 'source_connection_name'));
  assert.equal(ctx.block?.kind, 'action');
  assert.equal(ctx.block?.name, 'BULK TABLE');
});

test('paréntesis anidados en [data]=(SELECT...) siguen dentro de la acción', () => {
  const ctx = contextAt(JOB, at(JOB, 'schema_name, table_name'));
  assert.equal(ctx.block?.kind, 'action');
  assert.equal(ctx.block?.name, 'BULK TABLE');
});

test('string dentro de acción no se confunde con código', () => {
  const ctx = contextAt(JOB, at(JOB, '-- not a comment'));
  assert.equal(ctx.inString, true);
  assert.equal(ctx.inComment, false);
});

test('bloques de workflow, incluidos anidados y pasos con argumentos', () => {
  const ctx = contextAt(JOB, at(JOB, 'dwh.customers'));
  assert.equal(ctx.block?.kind, 'workflow');
  assert.equal(ctx.block?.name, 'WORKFLOW');

  const nested = contextAt(JOB, at(JOB, 'dwh.b'));
  assert.equal(nested.block?.name, 'PARALLEL');

  // Los paréntesis de PROCEDURE no cierran el workflow.
  const file = contextAt(JOB, at(JOB, 'FILE'));
  assert.equal(file.block?.kind, 'workflow');
  assert.equal(file.block?.name, 'WORKFLOW');
});

test('fuera de los bloques el contexto es código', () => {
  const ctx = contextAt(JOB, at(JOB, 'FROM t'));
  assert.equal(ctx.block, null);
  assert.equal(ctx.inComment, false);
  assert.equal(ctx.inString, false);
  assert.equal(ctx.inYamlHeader, false);
});

test('bracketedActionAt localiza el nombre de acción entre corchetes', () => {
  const a = bracketedActionAt(JOB, at(JOB, 'bulk table'));
  assert.equal(a?.name, 'BULK TABLE');
  assert.equal(bracketedActionAt(JOB, at(JOB, 'data]=(')), null);
});
