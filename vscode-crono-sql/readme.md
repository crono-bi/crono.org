# Crono SQL for VS Code

Soporte de lenguaje **100% offline** para [Crono SQL](https://crono.org/sql/), el superconjunto de SQL para proyectos ETL/DWH, y para los ficheros `.job` de Crono ETL.

No requiere conexión a internet, cuenta ni servidor: toda la inteligencia se ejecuta localmente.

## Características

- **Resaltado de sintaxis** — keywords y funciones específicas de Crono (`MERGE CLONE`, `CALCULATE JOIN`, `running_sum`, ...) sobre la base de SQL estándar, más la sintaxis de acciones ETL (`[bulk table](...)`, `WORKFLOW (...)`), sus propiedades y la cabecera YAML de ejecución auditada.
- **Autocompletado consciente del contexto** — keywords y funciones en código SQL; propiedades dentro del cuerpo de una acción; bloques y pasos dentro de un workflow; propiedades de auditoría en la cabecera YAML. No se ofrece nada dentro de comentarios ni cadenas.
- **Documentación al pasar el cursor** — descripción y sintaxis de funciones, keywords, frases compuestas (`MERGE SOFT DELETE`, `INSERT IF NEW`, `ASSERT NOT EXISTS OR RAISE`...), acciones ETL y propiedades, con enlace a la documentación oficial.
- **Snippets** — los patrones de carga (`MERGE CLONE`, `MERGE UPSERT`, `MERGE SOFT DELETE`, `MERGE HISTORY`, `INSERT RAW`, `INSERT IF NEW`, `INSERT OVERWRITE`, `DELETE`), modificadores de tabla (`FILTER`, `COLUMNS`, `ADD COLUMNS`), `CALCULATE JOIN`, `COMBINE`, `UNPIVOT`, aserciones y las acciones ETL.
- **Configuración de lenguaje** — comentarios (`--`, `/* */`), cierre de brackets, plegado e indentación.

## Extensiones de archivo

`.sql`, `.job`

## Ejemplo

```sql
-- Carga de una dimensión de productos (patrón SCD1).
MERGE CLONE dwh.dim_products KEY (product_id)
SELECT
  products.product_id,
  products.product_name,
  categories.category_name,
  suppliers.company_name supplier
FROM staging.products
INNER JOIN staging.categories USING category_id
INNER JOIN staging.suppliers USING supplier_id
CHECK SNOWFLAKE;

-- Aserción: la carga falla si aparece algún registro problemático.
ASSERT NOT EXISTS OR RAISE 'Líneas con producto o cantidad nulos'
SELECT *
FROM staging.order_details
WHERE quantity IS NULL
   OR product_id IS NULL;
```

Un `.job` de Crono ETL:

```
---
JobName: Carga DWH
SendFailureLogTo: soporte@example.com
---

WORKFLOW 'Carga DWH' (
  FILE 'Bulk ERP.job',
  PARALLEL 'Maestros' (
    dwh.customers,
    dwh.products
  ),
  dwh.fact_orders
)
```

## Desarrollo

```bash
npm install      # instala dependencias
npm run build    # compila TypeScript a dist/
npm run watch    # compila en modo watch
npm test         # compila y ejecuta los tests (node:test)
F5               # lanza una ventana de Extension Host para probar
```

### Empaquetado

```bash
npm run package  # genera el .vsix con @vscode/vsce
```

### Fuentes de verdad

Los datos del lenguaje se generan desde la documentación oficial del repo
`crono.org`. Tras modificar los docs, ejecuta:

```bash
npm run sync
```

que ejecuta dos scripts:

- `scripts/sync-function-docs.mjs` — genera `src/generated/function-docs.ts`
  desde `src/content/docs/sql/functions/**`.
- `scripts/sync-language-data.mjs` — genera `src/generated/keywords.ts`
  (desde `sql/language/keywords.md`), `src/generated/etl-data.ts`
  (acciones, propiedades y cabecera auditada desde `src/content/docs/etl/**`)
  y reescribe la gramática `syntaxes/crono-sql.tmLanguage.json`.

> No edites los archivos de `src/generated/` ni la gramática a mano:
> los sobrescriben los scripts.

## Configuración

| Ajuste | Defecto | Descripción |
|--------|---------|-------------|
| `cronoSql.completion.enabled` | `true` | Activa el autocompletado. |
| `cronoSql.hover.enabled` | `true` | Activa la documentación al pasar el cursor. |

## Roadmap

- **Fase 1 (actual)** — resaltado, autocompletado, snippets y hover (offline).
- **Fase 2** — diagnósticos y compilación a SQL nativo (opt-in).
- **Fase 3** — Language Server con compilador local (offline completo).

## Licencia

MIT
