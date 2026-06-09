---
title: "decile"
---

La función `decile` es una función de ventana que clasifica cada fila en uno de los 10 grupos de igual tamaño según el valor de la expresión de ordenación. El grupo 1 contiene los valores más bajos y el 10 los más altos.

Se puede usar tanto la sintaxis `OVER` estándar como la sintaxis compacta de Crono.

## Ejemplo

```crono-sql
select
  products.product_name,
  sum(order_details.unit_price * order_details.quantity) ventas,
  decile(order by ventas) decil
from staging.order_details
inner join staging.products using product_id
group by all;
```

Los productos del decil 10 corresponden al 10% de productos con mayores ventas.
