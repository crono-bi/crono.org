---
title: "JOINs"
sidebar:
  order: 13
---

**Crono SQL** soporta todos los JOINs estándar de SQL y añade dos propios que expresan patrones habituales en ETL/DWH con una sintaxis más legible.

Los operadores estándar soportados son:

- **INNER JOIN**
- **LEFT JOIN**
- **CROSS JOIN**
- **FULL JOIN**
- **CROSS APPLY**
- **OUTER APPLY**
- **RIGHT JOIN**

Todos ellos funcionan exactamente igual que en SQL estándar y pueden usarse con la cláusula **USING** para simplificar la condición de unión (ver [SELECT](/sql/language/select/#using)).

Los operadores propios de **Crono SQL** son:

- **ANTI JOIN**
- **SEMI JOIN**

A continuación se muestran algunos ejemplos de uso de cada uno de ellos.


## INNER JOIN

Devuelve solo los registros que tienen correspondencia en ambas tablas. Es el JOIN más habitual.

```crono-sql
SELECT
  orders.order_id,
  orders.order_date,
  customers.company_name AS customer,
  employees.last_name AS employee
FROM staging.orders
INNER JOIN staging.customers USING customer_id
INNER JOIN staging.employees USING employee_id
```


## LEFT JOIN

Devuelve todos los registros de la tabla izquierda y los datos coincidentes de la derecha. Si no hay coincidencia, las columnas de la derecha son `NULL`.

```crono-sql
SELECT
  customers.company_name AS customer,
  orders.order_id,
  orders.order_date
FROM staging.customers
LEFT JOIN staging.orders USING customer_id
```



## ANTI JOIN

Un **ANTI JOIN** devuelve todos los registros de la tabla izquierda que no tienen ninguna correspondencia en la tabla derecha. Expresa en una sola cláusula el patrón `NOT EXISTS` con subconsulta — una construcción más verbosa y más difícil de leer en SQL estándar.

La siguiente consulta devuelve todos los clientes que no tienen ninguna orden:

```crono-sql
SELECT *
FROM staging.customers
ANTI JOIN staging.orders USING customer_id
```

El **ANTI JOIN** se puede combinar con **FILTER** y el resto de características del lenguaje. Esta consulta devuelve todos los productos que no tienen ninguna línea de detalle con descuento:

```crono-sql
SELECT *
FROM staging.products
ANTI JOIN staging.order_details FILTER (discount > 0) disc_details USING product_id
```


## SEMI JOIN

Un **SEMI JOIN** devuelve todos los registros de la tabla izquierda que tienen al menos una correspondencia en la tabla derecha. A diferencia del **INNER JOIN**, no duplica los registros del resultado aunque existan múltiples coincidencias. Es el equivalente legible del patrón `EXISTS` con subconsulta.

Esta consulta devuelve todos los clientes que tienen al menos una orden, sin duplicados:

```crono-sql
SELECT *
FROM staging.customers
SEMI JOIN staging.orders USING customer_id
```


## CROSS JOIN

Produce el producto cartesiano de ambas tablas: cada fila de la izquierda se combina con cada fila de la derecha.

```crono-sql
SELECT
  products.product_name,
  categories.category_name
FROM staging.products
CROSS JOIN staging.categories
```


## FULL JOIN

Devuelve todos los registros de ambas tablas, con `NULL` en las columnas del lado que no tiene correspondencia. Útil para detectar registros huérfanos en ambos extremos.

```crono-sql
SELECT
  customers.company_name AS customer,
  orders.order_id,
  orders.order_date
FROM staging.customers
FULL JOIN staging.orders USING customer_id
```




## CROSS APPLY

**CROSS APPLY** es similar a **CROSS JOIN**, con una diferencia fundamental: la expresión de la derecha se evalúa una vez por cada fila de la izquierda y puede referenciar columnas de cualquier tabla ya presente en la consulta. Solo se devuelven las filas para las que la subconsulta devuelve al menos un resultado — comportamiento equivalente a un INNER JOIN.

Son operadores potentes, pero su sintaxis es densa y las consultas que los usan resultan difíciles de leer y mantener. En **Crono SQL**, casi siempre es posible expresar el mismo resultado de forma más clara con otras construcciones del lenguaje.

El caso de uso más habitual es el patrón **top N por grupo**: obtener, para cada elemento de la tabla izquierda, los N registros más recientes o más relevantes de la tabla derecha. Este ejemplo devuelve, para cada cliente, su pedido más reciente:

```crono-sql
SELECT
  customers.company_name,
  last_order.order_id,
  last_order.order_date,
  last_order.freight
FROM staging.customers
CROSS APPLY (
  SELECT TOP 1 order_id, order_date, freight
  FROM staging.orders
  WHERE orders.customer_id = customers.customer_id
  ORDER BY order_date DESC
) last_order
```

La misma consulta se puede expresar de forma mucho más legible con `TOP OVER()` — que **Crono SQL** compila correctamente en todos los motores:

```crono-sql
SELECT
  customers.company_name,
  last_order.order_id,
  last_order.order_date,
  last_order.freight
FROM staging.customers
INNER JOIN (
  SELECT TOP 1 OVER (PARTITION BY customer_id ORDER BY order_date DESC)
    customer_id,
    order_id,
    order_date,
    freight
  FROM staging.orders
) last_order USING customer_id
```

**CROSS APPLY** sigue siendo útil cuando la subconsulta depende de múltiples columnas del contexto o cuando se trabaja con funciones de tabla que reciben parámetros de la fila actual.


## OUTER APPLY

**OUTER APPLY** es la variante exterior de **CROSS APPLY**: conserva todas las filas de la tabla izquierda aunque la subconsulta de la derecha no devuelva ningún resultado, con `NULL` en las columnas de la derecha. Es el equivalente de un LEFT JOIN para subconsultas correlacionadas.

Al igual que **CROSS APPLY**, su uso directo produce consultas complejas. En la mayoría de casos, un **LEFT JOIN** con `TOP OVER()` o un simple **LEFT JOIN** expresan el mismo resultado de forma más clara y sin perder portabilidad entre motores.


La siguiente consulta devuelve el último pedido de cada cliente usando **OUTER APPLY**, incluyendo a los cliente que no tienen ningún pedido.

```crono-sql
SELECT
  customers.company_name,
  last_order.order_id,
  last_order.order_date,
  last_order.freight
FROM staging.customers
OUTER APPLY (
  SELECT TOP 1 order_id, order_date, freight
  FROM staging.orders
  WHERE orders.customer_id = customers.customer_id
  ORDER BY order_date DESC
) last_order
```

Al igual que en el caso anterior se puede reescribir de una manera más legible:

```crono-sql
SELECT
  customers.company_name,
  last_order.order_id,
  last_order.order_date,
  last_order.freight
FROM staging.customers
LEFT JOIN (
  SELECT TOP 1 OVER (PARTITION BY customer_id ORDER BY order_date DESC)
    customer_id,
    order_id,
    order_date,
    freight
  FROM staging.orders
) last_order USING customer_id
```


## RIGHT JOIN

Equivalente al LEFT JOIN pero conservando todos los registros de la tabla derecha.

```crono-sql
SELECT
  orders.order_id,
  customers.company_name AS customer
FROM staging.orders
RIGHT JOIN staging.customers USING customer_id
```

En la práctica, el **RIGHT JOIN** se usa muy poco. Cualquier RIGHT JOIN puede reescribirse como un LEFT JOIN intercambiando el orden de las tablas, que resulta más fácil de leer. Su aparición en una consulta suele ser señal de que el FROM está mal elegido o de que la lógica de la consulta tiene alguna anomalía que merece revisarse.
