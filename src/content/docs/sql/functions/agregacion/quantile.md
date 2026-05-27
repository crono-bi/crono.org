---
title: "quantile"
---

La función `quantile` es una función de ventana que clasifica cada fila en uno de los *n* grupos de igual tamaño según el valor de la expresión de ordenación.

Requiere la cláusula `ORDER BY`. Se puede usar tanto la sintaxis `OVER` estándar como la sintaxis compacta de Crono.

## Ejemplo

La siguiente consulta divide los productos en 5 grupos según sus ventas:

```crono-sql
select
  products.product_name,
  sum(order_details.unit_price * order_details.quantity) ventas,
  quantile(5, order by ventas) grupo
from staging.order_details
inner join staging.products using product_id
group by all;
```

## Comentarios

Esta función es similar a `percentile`, `decile` y `quartile`, pero permite definir el número de grupos libremente.
