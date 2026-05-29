---
title: "SQL Pipelines"
sidebar:
  order: 11
---

Las subconsultas en los JOINs son útiles y a veces necesarias: permiten filtrar o preparar una tabla antes de combinarla con el resto de la consulta, y su lugar en el código es exactamente el correcto, junto al JOIN que las usa.

Las subconsultas que envuelven un SELECT completo en el FROM son otra historia. Funcionan, pero presentan problemas de legibilidad y mantenimiento que se acumulan con la complejidad. La consulta exterior no puede referenciar directamente las columnas de la interior sin pasar por el alias de la subconsulta. Si la lógica cambia, hay que buscar dentro de los paréntesis para entender qué hace cada nivel. Con dos niveles de anidamiento el código ya resulta difícil de leer; con tres o más, prácticamente imposible de mantener.

**Crono SQL** resuelve este problema con los **SQL Pipelines**: en lugar de envolver la consulta interior entre paréntesis y darle un alias, se apila directamente encima como una capa separada. El resultado es el mismo SQL compilado, pero el código se lee de forma natural, de abajo a arriba, sin indentación creciente ni nombres de subconsulta artificiales como `subquery`, `a` o `inner_query`.


## SELECTs apilados

**Crono SQL** permite apilar varios **SELECT** en una misma consulta como alternativa a las subconsultas. Los SELECTs apilados funcionan como un pipeline de transformaciones: cada operador actúa sobre el resultado del anterior, de abajo a arriba. La consulta se construye por capas, y cada capa expresa una única transformación con toda la potencia de SQL.

Esta idea no es nueva. Es la misma filosofía de composición que tienen los pipes de Unix (`|`), los DataFrames de Pandas o dplyr en R: encadenar operaciones simples para construir transformaciones complejas. La diferencia es que aquí no se abandona SQL en ningún momento — se siguen usando SELECT, WHERE, GROUP BY, ORDER BY, con la misma sintaxis y el mismo compilador. No hay un nuevo paradigma que aprender, solo una forma más expresiva de componer lo que ya se sabe.

Este ejemplo calcula la media de las ventas anuales por producto. En SQL estándar requiere una subconsulta en el FROM; con SQL Pipelines se apilan dos SELECT:

```crono-sql
SELECT
  product_name,
  product_id,
  avg(annual_revenue) AS avg_annual_revenue
SELECT
  products.product_name,
  products.product_id,
  year(orders.order_date) AS order_year,
  sum(order_details.unit_price * order_details.quantity) AS annual_revenue
FROM staging.order_details
INNER JOIN staging.orders USING order_id
INNER JOIN staging.products USING product_id
```


## WHERE y ORDER BY apilados

Las capas apiladas no se limitan a la cláusula **SELECT**. También se pueden apilar **WHERE** y **ORDER BY** como capas independientes que operan sobre el resultado de las capas inferiores. Esto permite filtrar u ordenar sobre valores agregados sin necesidad de subconsultas ni CTEs.

La siguiente consulta devuelve los clientes con más de 10.000 en ventas, ordenados de mayor a menor:

```crono-sql
SELECT ORDER BY total_sales DESC
SELECT WHERE total_sales > 10000
SELECT
  customers.company_name,
  sum(order_details.unit_price * order_details.quantity) AS total_sales
FROM staging.order_details
INNER JOIN staging.orders USING order_id
INNER JOIN staging.customers USING orders(customer_id)
```

Las cláusulas apiladas permiten también contar el número de registros que devuelve una consulta previa, sin modificarla:

```crono-sql
SELECT count(*)
SELECT
  products.product_name,
  products.product_id,
  sum(order_details.unit_price * order_details.quantity) AS revenue
FROM staging.order_details
INNER JOIN staging.products USING product_id
```


## Durante el desarrollo

Esta capacidad es especialmente valiosa durante el desarrollo. Cuando se está construyendo o depurando una consulta compleja, es habitual querer inspeccionarla: contar cuántos registros devuelve, agrupar los resultados de una forma distinta, filtrar por un valor concreto para verificar que el dato es correcto. Con los SQL Pipelines, esa inspección se añade encima de la consulta original sin tocarla. Cuando ya no se necesita, se elimina la capa superior y la consulta queda exactamente como estaba.


## Combinado con funciones de ventana

Los SQL Pipelines y las [funciones de ventana](/sql/language/window-functions/) se combinan de forma natural. El resultado de un SELECT que calcula un acumulado o un porcentaje puede filtrarse en la capa siguiente sin necesidad de CTEs.

Este ejemplo devuelve los productos que representan el primer 20% de la venta total, usando `running_pct` en la capa inferior y filtrando en la superior:

```crono-sql
SELECT WHERE running_pct < 0.20
SELECT
  products.product_name,
  sum(od.quantity * od.unit_price)              amount,
  pct(amount)                                   percentage,
  running_pct(amount ORDER BY amount DESC)       running_pct
FROM staging.order_details od
INNER JOIN staging.orders USING order_id
INNER JOIN staging.products USING product_id
```
