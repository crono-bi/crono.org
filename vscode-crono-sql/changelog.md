# Changelog

Todas las novedades relevantes de la extensión Crono SQL.

## [Unreleased]

### Añadido

- Soporte de ficheros `.job` (acciones de Crono ETL): asociación de lenguaje, resaltado, hover y autocompletado.
- Resaltado de las acciones ETL (`[bulk table]`, `[export parquet]`, `[import parquet]`, `[copy file]`), de las propiedades dentro del cuerpo de la acción (snake_case y PascalCase, incluido `[data]=`), de los bloques `WORKFLOW`/`PARALLEL`/`ASYNC` con pasos `PROCEDURE`/`FILE`, y de la cabecera YAML de ejecución auditada.
- Lista completa de palabras reservadas generada desde `sql/language/keywords.md` (~240 keywords antes unas 70).
- Hover para `MERGE SOFT DELETE`, `INSERT IF NEW`, `INSERT RAW`, `INSERT OVERWRITE`, `DELETE ... KEY (...)`, `NO_ALTER`, `NO_AUDIT`, `COLUMNS`, `ADD COLUMNS`, `COMBINE`, `UNPIVOT`, `QUALIFY`, `DECLARE VIRTUAL VIEW` y las acciones/propiedades ETL.
- Snippets de todos los patrones de carga, modificadores de tabla, acciones ETL, workflow y cabecera auditada.
- Scanner propio que distingue comentarios, cadenas, cabecera YAML y cuerpos de acción para el hover y el autocompletado.
- Tests con `node:test` (`npm test`) sobre scanner, gramática y datos generados.
- Ejemplos `.job` en `examples/`.

### Corregido

- El hover ya no aparece dentro de comentarios ni cadenas; el autocompletado tampoco.
- Las propiedades ETL solo se sugieren/documentan dentro del cuerpo de una acción, no en cualquier `nombre = valor`.
- El hover de frases compuestas ya no falla en palabras en la columna 0 (el cálculo se hace por regex sobre la línea).
- Documentación y snippets corregidos según los docs oficiales: `ASSERT` (es `ASSERT [NOT] EXISTS OR RAISE`), `FILTER` (modificador de tabla), `CALCULATE` (`CALCULATE [JOIN] (...)`), `CHECK SNOWFLAKE` (cláusula tras los JOINs, en ejecución), `NONUNIQUE` (DDL), `VIRTUAL` (`DECLARE VIRTUAL VIEW`) y se elimina el patrón `DELETE AND INSERT`, no documentado.
- Los enlaces de las acciones ETL apuntan a `crono.org/etl/...` (antes todo iba a `/sql`).
- El autocompletado se calcula una sola vez y se cachea, en lugar de reconstruirse en cada pulsación.
- `@vscode/vsce` pasa a `devDependencies` fijado (antes `npx` sin versión).
- `examples/` y `test/` quedan fuera del `.vsix` (`.vscodeignore`).

### Cambiado

- `npm run sync` ahora regenera también keywords, datos ETL y la gramática TextMate, además de las funciones.
- `src/language-data.ts` consume la lista generada `src/generated/keywords.ts`.

## [0.1.0] - 2026-06-16

### Añadido

- Resaltado de sintaxis para Crono SQL (extiende SQL estándar con keywords y funciones de Crono).
- Autocompletado de keywords y funciones con firma y categoría.
- Documentación al pasar el cursor sobre funciones y keywords, incluyendo frases compuestas (`MERGE CLONE`, `SEMI JOIN`...).
- Descripciones y ejemplos de hover extraídos automáticamente de los docs oficiales (94/99 funciones) vía `npm run sync`.
- Snippets para los patrones de carga y plantillas habituales.
- Configuración de lenguaje: comentarios, brackets, plegado e indentación.
- Ajustes `cronoSql.completion.enabled` y `cronoSql.hover.enabled`.
- Script `sync` para mantener la fuente única de verdad con `crono.org`.
