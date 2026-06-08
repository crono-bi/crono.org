---
title: "percentile"
---

La función `percentile` es una función de ventana que devuelve la posición relativa de cada fila como un valor entero entre 1 y 100.

Requiere la cláusula `ORDER BY`. Se puede usar tanto la sintaxis `OVER` estándar como la sintaxis compacta de Crono.

## Ejemplo

La siguiente consulta devuelve el percentil de ventas de cada producto. Los productos con percentil 95 o superior están entre el 5% más vendido:

```crono-sql
select
  products.product_name,
  sum(order_details.unit_price * order_details.quantity) ventas,
  percentile(order by ventas) percentil
from staging.order_details
inner join staging.products using product_id
group by all;
```

## Comentarios

Esta función es similar a `decile`, `quartile` y `quantile`. La función `rank` devuelve la posición ordinal, mientras que estas funciones clasifican los registros en grupos de distinto tamaño (100, 10, 4 o *n*).
