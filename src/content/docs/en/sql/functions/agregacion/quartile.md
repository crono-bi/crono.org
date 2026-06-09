---
title: "quartile"
---

La función `quartile` es una función de ventana que clasifica cada fila en uno de los 4 grupos de igual tamaño según el valor de la expresión de ordenación. El grupo 1 contiene los valores más bajos y el 4 los más altos.

Requiere la cláusula `ORDER BY`. Se puede usar tanto la sintaxis `OVER` estándar como la sintaxis compacta de Crono.

## Ejemplo

La siguiente consulta devuelve el cuartil de ventas de cada producto. Los productos del cuartil 4 están entre el 25% más vendido:

```crono-sql
select
  products.product_name,
  sum(order_details.unit_price * order_details.quantity) ventas,
  quartile(order by ventas) cuartil
from staging.order_details
inner join staging.products using product_id
group by all;
```

## Comentarios

Esta función es similar a `percentile`, `decile` y `quantile`. La función `rank` devuelve la posición ordinal, mientras que estas funciones clasifican los registros en grupos de distinto tamaño (100, 10, 4 o *n*).
