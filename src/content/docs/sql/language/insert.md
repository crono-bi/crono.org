---
title: "Sentencia INSERT"
sidebar:
  order: 2
---

**Crono SQL** define tres patrones de carga basados en INSERT. Los tres admiten toda la potencia del **SELECT** y mantienen la auditoría automáticamente.

- **INSERT RAW** — inserta todos los registros sin verificación de clave
- **INSERT IF NEW** — inserta solo los registros nuevos
- **INSERT OVERWRITE** — elimina y recarga la tabla, total o parcialmente


## INSERT RAW

**INSERT RAW** inserta todos los registros del SELECT en la tabla destino sin ninguna verificación de clave. Es el patrón más directo: lo que devuelve la consulta se añade a la tabla. Es el único patrón de carga que no admite **KEY**.

```crono-sql
INSERT RAW dwh.dim_products
SELECT
  products.product_id,
  products.product_name,
  categories.category_name,
  suppliers.company_name AS supplier
FROM staging.products
INNER JOIN staging.categories USING category_id
INNER JOIN staging.suppliers USING supplier_id
```


## INSERT IF NEW

**INSERT IF NEW** inserta únicamente los registros cuya clave no exista aún en la tabla destino. Los registros ya presentes se ignoran.

La clave de carga se declara con `KEY (col1, col2)` en la cabecera de la sentencia. Es obligatoria en este patrón.

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


## INSERT OVERWRITE

**INSERT OVERWRITE** elimina el contenido actual de la tabla y la recarga con los datos de la consulta. Es la estrategia más sencilla cuando se puede asumir que todos los datos de origen están disponibles y son correctos.

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

**INSERT OVERWRITE** es el único patrón de carga donde la **KEY** es opcional. Sin clave vacía toda la tabla; con clave elimina y recarga únicamente los registros cuya clave coincida con los datos de la consulta, sin afectar al resto de la tabla.

```crono-sql
INSERT OVERWRITE dwh.fact_orders KEY (order_id)
SELECT
  orders.order_id,
  orders.order_date,
  customers.company_name AS customer,
  employees.last_name AS employee,
  sum(order_details.unit_price * order_details.quantity) AS total_amount,
  orders.freight
FROM staging.orders
INNER JOIN staging.customers USING customer_id
INNER JOIN staging.employees USING employee_id
INNER JOIN staging.order_details USING order_id
WHERE year(orders.order_date) = 2024 AND month(orders.order_date) = 1
```

En este ejemplo solo se eliminan y reinsertan las órdenes de enero de 2024. El resto de registros de `dwh.fact_orders` no se modifica.


## Compatibilidad ANSI

Por compatibilidad, **Crono SQL** también soporta la sintaxis estándar con lista de columnas explícita, tanto con `VALUES` como con `SELECT`:

```crono-sql
INSERT INTO dwh.dim_products (product_id, product_name) VALUES (1, 'Chai')
```

También se puede usar `SELECT` en lugar de `VALUES`:

```crono-sql
INSERT INTO dwh.dim_products (product_id, product_name)
SELECT products.product_id, products.product_name
FROM staging.products
```

Estas formas ANSI no mantienen auditoría y raramente se necesitan en un proyecto ETL/DWH habitual.
