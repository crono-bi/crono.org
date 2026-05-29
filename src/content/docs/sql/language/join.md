---
title: "Operador JOIN"
sidebar:
  order: 13
---

**Crono SQL** soporta todos los operadores JOIN estándar de SQL y añade tres operadores propios que expresan patrones habituales en ETL/DWH con una sintaxis más legible.

Los operadores estándar soportados son:

- **INNER JOIN**
- **LEFT JOIN**
- **CROSS JOIN**
- **CROSS APPLY**
- **FULL JOIN**
- **RIGHT JOIN**

Todos ellos funcionan exactamente igual que en SQL estándar y pueden usarse con la cláusula **USING** para simplificar la condición de unión (ver [SELECT](/sql/language/select/#using)).

Los operadores propios de **Crono SQL** son:

- **ANTI JOIN**
- **SEMI JOIN**
- **CROSS APPLY ROW**

A continuación se muestran algún ejemplos de uso de cada uno de ellos.


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

## CROSS JOIN

Produce el producto cartesiano de ambas tablas: cada fila de la izquierda se combina con cada fila de la derecha.

```crono-sql
SELECT
  products.product_name,
  categories.category_name
FROM staging.products
CROSS JOIN staging.categories
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


## CROSS APPLY ROW

**ADD COLUMNS** añade columnas calculadas sobre una sola tabla, antes de los JOINs. Cuando el cálculo necesita combinar columnas de varias tablas —por ejemplo, cruzar un valor del cliente con uno del pedido—, **ADD COLUMNS** ya no es suficiente porque sus expresiones se evalúan antes de que los JOINs se hayan resuelto.

**CROSS APPLY ROW** resuelve ese caso: define un conjunto de columnas calculadas que se evalúan después de todos los JOINs, con acceso a cualquier columna de cualquier tabla participante. Se comporta como un JOIN con una tabla de una única fila de columnas calculadas. Las expresiones dentro de **ROW** pueden referenciarse entre sí, igual que las columnas inteligentes del SELECT.

El siguiente ejemplo combina **ADD COLUMNS** y **CROSS APPLY ROW**. Primero, **ADD COLUMNS** sobre `orders` define `days_to_ship` e `is_late` a partir de columnas de esa tabla. Después, **CROSS APPLY ROW** calcula `late_fee` usando `is_late` (ya disponible tras el ADD COLUMNS), junto con `customers.country` y `employees.country`, que pertenecen a tablas distintas:

```crono-sql
SELECT
  orders.order_id,
  orders.order_date,
  customers.company_name AS customer,
  employees.last_name AS employee,
  orders.days_to_ship,
  orders.is_late,
  shipping.late_fee
FROM staging.orders ADD COLUMNS (daysdiff(order_date, shipped_date) days_to_ship, if(shipped_date > required_date) is_late)
INNER JOIN staging.customers USING customer_id
INNER JOIN staging.employees USING employee_id
CROSS APPLY ROW (
  if(orders.is_late=YES AND customers.country <> employees.country, freight * 0.15, 0) late_fee
) shipping
WHERE orders.is_late = 1
```

El alias del bloque (`shipping`) sirve para referenciar sus columnas en el SELECT. Cuando solo hay un **CROSS APPLY ROW**, las columnas también son accesibles sin prefijo.




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
