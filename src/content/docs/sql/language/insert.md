---
title: "INSERT"
sidebar:
  order: 25
---

**Crono SQL** define tres patrones de carga basados en INSERT:

- **INSERT RAW** — inserta todos los registros sin clave; el único patrón de carga sin KEY
- **INSERT IF NEW** — inserta solo los registros que aún no existen en la tabla destino
- **INSERT OVERWRITE** — recarga completa o parcial de la tabla destino; el único patrón donde la KEY es opcional

Los tres mantienen la auditoría automáticamente. El resto de sentencias de carga también, a excepción de las formas ANSI descritas al final de esta página.


## INSERT RAW

**INSERT RAW** inserta todos los registros devueltos por la consulta en la tabla destino, sin ninguna comprobación de duplicados. Es el único patrón de carga que no admite KEY: cada ejecución añade filas nuevas independientemente de lo que ya exista en destino.

Es útil para tablas de log, registros de eventos o cualquier escenario donde se quiere acumular datos sin gestionar claves.

```crono-sql
INSERT RAW dwh.fact_order_details
SELECT
  order_details.order_id,
  order_details.product_id,
  order_details.unit_price,
  order_details.quantity,
  order_details.discount
FROM staging.order_details
```

El `INTO` es opcional: `INSERT RAW INTO dwh.fact_order_details` es equivalente.


## INSERT IF NEW

**INSERT IF NEW** inserta únicamente los registros que aún no existen en la tabla destino, identificados por la clave de carga. Los registros ya existentes se ignoran — no se actualizan.

Es útil cuando la tabla destino se carga incrementalmente y los registros históricos no deben modificarse.

```crono-sql
INSERT IF NEW dwh.dim_products KEY (product_id)
SELECT
  products.product_id,
  products.product_name,
  categories.category_name,
  suppliers.company_name AS supplier
FROM staging.products
INNER JOIN staging.categories USING category_id
INNER JOIN staging.suppliers USING supplier_id
```

El `INTO` es opcional: `INSERT IF NEW INTO dwh.dim_products KEY (product_id)` es equivalente.


## INSERT OVERWRITE

**INSERT OVERWRITE** elimina primero el contenido de la tabla destino y luego inserta los registros de la consulta. Es el patrón de recarga completa.

```crono-sql
INSERT OVERWRITE dwh.dim_products
SELECT
  products.product_id,
  products.product_name,
  categories.category_name,
  suppliers.company_name AS supplier
FROM staging.products
INNER JOIN staging.categories USING category_id
INNER JOIN staging.suppliers USING supplier_id
CHECK SNOWFLAKE
```

Cuando se especifica una KEY, **INSERT OVERWRITE** elimina solo los registros que coincidan con los valores de clave devueltos por la consulta y los recarga. Esto permite recargar un subconjunto de datos —por ejemplo, el mes actual— sin tocar el histórico.

```crono-sql
INSERT OVERWRITE dwh.fact_orders KEY (order_id)
SELECT
  orders.order_id,
  orders.customer_id,
  orders.employee_id,
  orders.order_date,
  orders.freight
FROM staging.orders
WHERE year(orders.order_date) = 2024 AND month(orders.order_date) = 1
```

El `INTO` es opcional en ambas formas.


## Compatibilidad ANSI

Por compatibilidad, **Crono SQL** también soporta las formas estándar de la sentencia INSERT:

```crono-sql
INSERT INTO dwh.dim_products (product_id, product_name)
SELECT products.product_id, products.product_name
FROM staging.products

INSERT INTO dwh.dim_products
SELECT products.product_id, products.product_name
FROM staging.products
```

Estas formas ANSI no mantienen auditoría. En un proyecto **Crono SQL** se recomienda utilizar siempre uno de los tres patrones anteriores.
