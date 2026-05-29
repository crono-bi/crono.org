---
title: "Funciones de ventana"
sidebar:
  order: 12
---

Las funciones de ventana (o funciones analíticas) permiten realizar cálculos sobre un conjunto de filas relacionadas con la fila actual sin agrupar ni perder el detalle de los registros. A diferencia de `GROUP BY`, que devuelve una fila por grupo, las funciones de ventana mantienen todas las filas originales y añaden información calculada sobre ellas.

En proyectos ETL/DWH son fundamentales porque permiten resolver de forma eficiente patrones muy habituales: totales acumulados, medias móviles, rankings, porcentajes sobre el total, detección de duplicados o comparación con períodos anteriores — todo ello sin subconsultas ni self-joins.

**Crono SQL** soporta la sintaxis estándar de `OVER (...)` y la extiende con una sintaxis simplificada y un conjunto de funciones analíticas propias que reducen significativamente el código necesario para los casos más frecuentes.


## OVER (...)

La sintaxis estándar coloca la cláusula `OVER (...)` a continuación de la función de agregación, definiendo la partición y el orden de la ventana.

Gracias a las **columnas inteligentes** de Crono SQL, los alias definidos en el `SELECT` pueden usarse directamente dentro del `OVER`, sin repetir la expresión original.

El siguiente ejemplo calcula el acumulado de ventas desde el inicio de cada año (YTD):

```crono-sql
SELECT
  year(orders.order_date)                           order_year,
  month(orders.order_date)                          order_month,
  sum(od.quantity * od.unit_price)                  amount,
  sum(amount) OVER (PARTITION BY order_year ORDER BY order_month)  amount_ytd
FROM staging.order_details od
INNER JOIN staging.orders USING order_id
```

Nótese que `amount_ytd` referencia el alias `amount` y `order_year` — sin repetir `sum(od.quantity * od.unit_price)` ni `year(orders.order_date)`. El compilador genera el SQL expandido necesario para cada motor.

Las cláusulas `ROWS` y `RANGE` están soportadas para definir el marco de la ventana. El siguiente ejemplo calcula una media móvil de 3 meses y la media histórica acumulada:

```crono-sql
SELECT
  year(orders.order_date)                           order_year,
  month(orders.order_date)                          order_month,
  sum(od.quantity * od.unit_price)                  amount,
  avg(amount) OVER (PARTITION BY order_year ORDER BY order_month
                    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)       moving_avg_3m,
  avg(amount) OVER (PARTITION BY order_year ORDER BY order_month
                    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) historical_avg
FROM staging.order_details od
INNER JOIN staging.orders USING order_id
```


## Sintaxis simplificada

**Crono SQL** permite una sintaxis alternativa donde la partición y el orden se declaran directamente dentro de la función, sin la palabra clave `OVER`. Es equivalente a la forma estándar pero más compacta.

El siguiente ejemplo calcula el porcentaje que representa cada mes sobre el total del año. `year_total` se define como `sum(amount PARTITION BY order_year)` — sin `OVER`, sin subconsulta — y se reutiliza directamente en `divide()`:

```crono-sql
SELECT
  year(orders.order_date)                     order_year,
  month(orders.order_date)                    order_month,
  sum(od.quantity * od.unit_price)            amount,
  sum(amount PARTITION BY order_year)         year_total,
  divide(amount, year_total)                  percentage
FROM staging.order_details od
INNER JOIN staging.orders USING order_id
```


## Funciones analíticas propias

Además de las funciones de agregación estándar (`sum`, `avg`, `min`, `max`, `count`), **Crono SQL** proporciona un conjunto de funciones analíticas propias que expresan en una sola llamada patrones que en SQL estándar requieren expresiones `OVER` complejas o subconsultas.

**`pct(expr)`** — porcentaje de cada fila sobre el total general (o sobre la partición si se especifica).

**`runningsum(expr ORDER BY ...)`** — suma acumulada ordenada.

**`runningpct(expr ORDER BY ...)`** — porcentaje acumulado ordenado. Muy útil para análisis de Pareto.

**`percentile(ORDER BY ...)`** — percentil de cada fila dentro de su partición.

**`rank(ORDER BY ...)`** — posición ordinal de cada fila dentro de su partición.

**`isFirst`** / **`isLast`** — indica si la fila es la primera o la última dentro de su partición.

**`nextValue(expr)`** / **`previousValue(expr)`** — valor de la expresión en la fila siguiente o anterior (equivalente a `LEAD`/`LAG`).

El siguiente ejemplo muestra el desglose de ventas por producto con su porcentaje sobre el total, suma acumulada y porcentaje acumulado:

```crono-sql
SELECT
  products.product_name,
  sum(od.quantity * od.unit_price)              amount,
  pct(amount)                                   percentage,
  runningsum(amount ORDER BY amount DESC)        running_amount,
  runningpct(amount ORDER BY amount DESC)        running_pct
FROM staging.order_details od
INNER JOIN staging.orders USING order_id
INNER JOIN staging.products USING product_id
```

Combinado con SELECTs apilados, `runningpct` permite hacer análisis de Pareto de forma muy directa. Este ejemplo devuelve los productos que representan el primer 20% de la venta total:

```crono-sql
SELECT WHERE running_pct < 0.20
SELECT
  products.product_name,
  sum(od.quantity * od.unit_price)              amount,
  pct(amount)                                   percentage,
  runningpct(amount ORDER BY amount DESC)        running_pct
FROM staging.order_details od
INNER JOIN staging.orders USING order_id
INNER JOIN staging.products USING product_id
```

Y este devuelve la larga cola — los muchos productos que en conjunto no llegan al 20% de la venta:

```crono-sql
SELECT WHERE running_pct < 0.20
SELECT
  products.product_name,
  sum(od.quantity * od.unit_price)              amount,
  pct(amount)                                   percentage,
  runningpct(amount ORDER BY amount ASC)         running_pct
FROM staging.order_details od
INNER JOIN staging.orders USING order_id
INNER JOIN staging.products USING product_id
```

El filtro `running_pct < 0.20` excluye el producto que cruza el umbral — es decir, el primero cuyo acumulado supera el 20%. Para incluirlo, se puede filtrar sobre el valor anterior del acumulado usando `previousValue`. Si el acumulado anterior era inferior al 20%, el registro se incluye aunque el acumulado actual ya lo supere:

```crono-sql
SELECT WHERE prev_running_pct < 0.20
SELECT
  product_name,
  amount,
  running_pct,
  previousValue(running_pct ORDER BY amount DESC)   prev_running_pct
SELECT
  products.product_name,
  sum(od.quantity * od.unit_price)              amount,
  runningpct(amount ORDER BY amount DESC)        running_pct
FROM staging.order_details od
INNER JOIN staging.orders USING order_id
INNER JOIN staging.products USING product_id
```

El siguiente ejemplo usa `percentile` para identificar los clientes en el percentil 10 superior por volumen de compra:

```crono-sql
SELECT WHERE percentile <= 10
SELECT
  customers.company_name,
  sum(od.quantity * od.unit_price)              amount,
  pct(amount)                                   percentage,
  percentile(ORDER BY amount DESC)              percentile
FROM staging.order_details od
INNER JOIN staging.orders USING od(order_id)
INNER JOIN staging.customers USING orders(customer_id)
```


## TOP OVER ()

La cláusula `TOP n OVER (PARTITION BY ... ORDER BY ...)` devuelve los N primeros registros por grupo. El compilador genera internamente la subconsulta con `ROW_NUMBER()` necesaria para cada motor, sin que el desarrollador tenga que escribirla.

Los tres clientes con mayor volumen de compra en cada país:

```crono-sql
SELECT TOP 3 OVER (PARTITION BY country ORDER BY total_freight DESC)
  customers.country,
  customers.customer_id,
  customers.company_name AS customer,
  sum(orders.freight) AS total_freight
FROM staging.orders
INNER JOIN staging.customers USING customer_id
```

El mejor cliente de cada producto:

```crono-sql
SELECT TOP 1 OVER (PARTITION BY product_name ORDER BY amount DESC)
  products.product_name,
  customers.company_name AS top_customer,
  sum(od.quantity * od.unit_price) AS amount
FROM staging.order_details od
INNER JOIN staging.products USING product_id
INNER JOIN staging.orders USING order_id
INNER JOIN staging.customers USING orders(customer_id)
```

El producto más vendido a cada cliente:

```crono-sql
SELECT TOP 1 OVER (PARTITION BY customer ORDER BY amount DESC)
  customers.company_name AS customer,
  products.product_name AS top_product,
  sum(od.quantity * od.unit_price) AS amount
FROM staging.order_details od
INNER JOIN staging.products USING product_id
INNER JOIN staging.orders USING order_id
INNER JOIN staging.customers USING orders(customer_id)
```

`TOP OVER` también es la forma natural de obtener el registro más reciente por entidad — por ejemplo, la última orden de cada cliente:

```crono-sql
SELECT TOP 1 OVER (PARTITION BY customer_id ORDER BY order_date DESC)
  customers.customer_id,
  customers.company_name AS customer,
  orders.order_date,
  orders.freight
FROM staging.orders
INNER JOIN staging.customers USING customer_id
```


## DUPLICATES OVER ()

`SELECT DUPLICATES OVER (PARTITION BY ...)` devuelve únicamente los registros para los que existe más de una fila con la misma combinación de campos en la partición. El compilador genera internamente la expresión `COUNT(*) OVER (PARTITION BY ...)` necesaria.

Su uso más habitual es la detección de problemas de calidad en los datos de origen: si la consulta devuelve algún registro, hay duplicados que deben resolverse antes de la carga.

```crono-sql
SELECT DUPLICATES OVER (PARTITION BY customer_id)
  customer_id,
  company_name,
  contact_name,
  contact_title,
  address
FROM staging.customers
```

Se puede combinar con SELECTs apilados para aplicarlo sobre cualquier consulta previa:

```crono-sql
SELECT DUPLICATES OVER (PARTITION BY customer_id)
SELECT *
FROM staging.customers
```

También es útil para detectar duplicados lógicos según reglas de negocio. Este ejemplo encuentra pedidos en los que el mismo cliente realizó más de una orden el mismo día:

```crono-sql
SELECT DUPLICATES OVER (PARTITION BY customer_id, order_date)
SELECT *
FROM staging.orders
```
