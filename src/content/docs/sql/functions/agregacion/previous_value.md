---
title: "previous_value"
---

La función `previous_value` es una función de ventana que devuelve el valor de la fila anterior del rango.

Requiere la cláusula `ORDER BY`. Se puede usar tanto la sintaxis `OVER` estándar como la sintaxis compacta de Crono.

## Ejemplo

La siguiente consulta devuelve las ventas de cada mes junto con las ventas del mes anterior:

```crono-sql
select
  year(orders.order_date) anyo,
  month(orders.order_date) mes,
  sum(order_details.unit_price * order_details.quantity) ventas,
  previous_value(ventas order by anyo, mes) ventas_mes_anterior
from staging.order_details
inner join staging.orders using order_id
group by all;
```

## Comentarios

`previous_value` devuelve siempre la fila inmediatamente anterior. Para retroceder más de una fila, usar la función estándar `lag`, que admite un segundo parámetro con el número de filas de desplazamiento.
