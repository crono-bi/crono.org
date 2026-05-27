---
title: "next_value"
---

La función `next_value` es una función de ventana que devuelve el valor de la siguiente fila del rango.

Requiere la cláusula `ORDER BY`. Se puede usar tanto la sintaxis `OVER` estándar como la sintaxis compacta de Crono.

## Ejemplo

La siguiente consulta devuelve las ventas de cada mes junto con las ventas del mes siguiente:

```crono-sql
select
  year(orders.order_date) anyo,
  month(orders.order_date) mes,
  sum(order_details.unit_price * order_details.quantity) ventas,
  next_value(ventas order by anyo, mes) ventas_mes_siguiente
from staging.order_details
inner join staging.orders using order_id
group by all;
```
