# Crono SQL for VS Code

Soporte de lenguaje **100% offline** para [Crono SQL](https://crono.org/sql/), el superconjunto de SQL para proyectos ETL/DWH.

No requiere conexión a internet, cuenta ni servidor: toda la inteligencia se ejecuta localmente.

## Características

- **Resaltado de sintaxis** — keywords y funciones específicas de Crono (`MATERIALIZE`, `MERGE CLONE`, `running_sum`, ...) sobre la base de SQL estándar.
- **Autocompletado** — todas las keywords y funciones, con firma y categoría.
- **Documentación al pasar el cursor** — descripción y sintaxis de funciones y keywords, con enlace a la documentación oficial.
- **Snippets** — los patrones de carga (`MERGE CLONE`, `MERGE UPSERT`, `MERGE HISTORY`, `DELETE AND INSERT`...) y plantillas habituales.
- **Configuración de lenguaje** — comentarios (`--`, `/* */`), cierre de brackets, plegado e indentación.

## Extensiones de archivo

`.sql`

## Ejemplo

```sql
-- Carga de una dimensión de productos.
CREATE OR REPLACE PROCEDURE
MERGE CLONE dwh.dim_products KEY (product_id)
SELECT
  products.product_id,
  products.product_name,
  categories.category_name,
  suppliers.company_name supplier
FROM staging.products
INNER JOIN staging.categories USING category_id
INNER JOIN staging.suppliers USING supplier_id;

-- Pipeline con funciones de ventana y agregación.
SELECT
  year(orders.order_date) anyo,
  month(orders.order_date) mes,
  sum(order_details.unit_price * order_details.quantity) ventas,
  running_sum(ventas order by anyo, mes) ventas_acumuladas,
  pct(ventas) pct_total
FROM staging.order_details
INNER JOIN staging.orders USING order_id
GROUP BY ALL;

-- Validaciones declarativas.
CHECK SNOWFLAKE dwh.fact_sales;
ASSERT sum(ventas) > 0;
```

## Desarrollo

```bash
npm install      # instala dependencias
npm run build    # compila TypeScript a dist/
npm run watch    # compila en modo watch
F5               # lanza una ventana de Extension Host para probar
```

### Empaquetado

```bash
npm run package  # genera el .vsix con vsce
```

### Fuentes de verdad

- **Keywords**: `src/language-data.ts` refleja la lista de
  `crono.org/src/config/crono-language-data.mjs` (sincronización manual).
- **Funciones**: los nombres, descripciones y ejemplos se derivan de los docs
  oficiales en `crono.org/src/content/docs/sql/functions/**` y se generan en
  `src/generated/function-docs.ts`. Tras modificar los docs, ejecuta:

```bash
npm run sync   # regenera src/generated/function-docs.ts desde los docs oficiales
```

> No edites `src/generated/function-docs.ts` a mano: lo sobrescribe el script.
> La gramática TextMate (`syntaxes/crono-sql.tmLanguage.json`) se mantiene
> manualmente.

El hover de funciones resuelve la descripción con esta prioridad:
**doc oficial generado → texto manual (`src/hover-docs.ts`) → genérico por categoría**.

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
