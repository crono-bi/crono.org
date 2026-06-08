---
title: "running_pct"
---

La función `running_pct` es una función de ventana que devuelve el porcentaje acumulado de un indicador desde el inicio del rango hasta cada fila, respecto al total.

Requiere las cláusulas `PARTITION BY` y `ORDER BY`. Se puede usar tanto la sintaxis `OVER` estándar como la sintaxis compacta de Crono.

## Ejemplo

La siguiente consulta muestra el porcentaje de ventas acumulado por mes dentro de cada año:

```crono-sql
select
  year(orders.order_date) anyo,
  month(orders.order_date) mes,
  sum(order_details.unit_price * order_details.quantity) ventas,
  running_pct(ventas partition by anyo order by mes) pct_acumulado
from staging.order_details
inner join staging.orders using order_id
group by all;
```
