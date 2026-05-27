---
title: "pctrank"
---

La función `pctrank` es una función de ventana que devuelve la posición relativa de cada fila normalizada entre 0 y 1.

Requiere la cláusula `ORDER BY`. Se puede usar tanto la sintaxis `OVER` estándar como la sintaxis compacta de Crono.

## Ejemplo

La siguiente consulta devuelve los productos del 20% superior en ventas:

```crono-sql
select
  products.product_name,
  sum(order_details.unit_price * order_details.quantity) ventas,
  pctrank(order by ventas desc) ranking
from staging.order_details
inner join staging.products using product_id
group by all
qualify ranking < 0.2;
```

## Comentarios

Esta función es similar a `percentile`. La diferencia es que `pctrank` normaliza entre 0 y 1, mientras que `percentile` lo hace entre 1 y 100.
