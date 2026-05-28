---
title: "Sentencia UPDATE"
sidebar:
  order: 3
---

El patrón **UPDATE** de **Crono SQL** actualiza los registros de la tabla destino a partir del resultado de una consulta **SELECT**. En un proyecto ETL/DWH los datos que se quieren actualizar habitualmente provienen de otras tablas, lo que convierte el UPDATE estándar en una construcción verbosa y difícil de mantener. Con **Crono SQL** basta con escribir el SELECT con los datos nuevos.


## UPDATE

**UPDATE** actualiza los registros de la tabla destino que hayan cambiado respecto a los datos de la consulta. Los registros que ya tienen los valores correctos no se tocan, lo que mejora el rendimiento y simplifica la auditoría.

La clave de actualización se declara con `KEY (col1, col2)` en la cabecera. Es obligatoria.

```crono-sql
UPDATE dwh.dim_products KEY (product_id)
SELECT
  products.product_id,
  products.product_name,
  categories.category_name,
  suppliers.company_name AS supplier
FROM staging.products
INNER JOIN staging.categories USING category_id
INNER JOIN staging.suppliers USING supplier_id
```

También se pueden actualizar registros a partir de datos de la propia tabla destino. El siguiente ejemplo recalcula `net_amount` a partir de columnas ya existentes:

```crono-sql
UPDATE dwh.fact_orders KEY (order_id)
SELECT
  order_id,
  total_amount - tax_amount AS net_amount
FROM dwh.fact_orders
WHERE year(order_date) = 2023
```


## Compatibilidad ANSI

Por compatibilidad, **Crono SQL** también soporta la sintaxis estándar del UPDATE:

```crono-sql
UPDATE dwh.fact_orders
SET freight = freight * 1.1
WHERE year(order_date) = 2023
```

Esta forma es útil para modificaciones puntuales sobre la propia tabla, pero no permite actualizar datos desde otras tablas de forma legible.
