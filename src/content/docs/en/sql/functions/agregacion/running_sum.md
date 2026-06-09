---
title: "running_sum"
---

La función `running_sum` es una función de ventana que devuelve la suma acumulada de un indicador desde el inicio del rango hasta cada fila.

Requiere la cláusula `ORDER BY`. Se puede usar tanto la sintaxis `OVER` estándar como la sintaxis compacta de Crono.

## Ejemplo

La siguiente consulta muestra las ventas de cada mes y el acumulado histórico:

```crono-sql
select
  year(orders.order_date) anyo,
  month(orders.order_date) mes,
  sum(order_details.unit_price * order_details.quantity) ventas,
  running_sum(ventas order by anyo, mes) ventas_acumuladas
from staging.order_details
inner join staging.orders using order_id
group by all;
```

También se puede incluir `PARTITION BY` para reiniciar el acumulado en cada grupo:

```crono-sql
select
  year(orders.order_date) anyo,
  month(orders.order_date) mes,
  sum(order_details.unit_price * order_details.quantity) ventas,
  running_sum(ventas partition by anyo order by mes) ventas_acumuladas_anyo
from staging.order_details
inner join staging.orders using order_id
group by all;
```
