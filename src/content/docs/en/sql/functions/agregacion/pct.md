---
title: "pct"
---

La función `pct` es una función de ventana que devuelve el porcentaje de cada valor respecto a la suma total del rango.

Si no se especifica `PARTITION BY`, el denominador es la suma global. Se puede usar tanto la sintaxis `OVER` estándar como la sintaxis compacta de Crono.

## Ejemplo

La siguiente consulta muestra las ventas de cada categoría y su porcentaje sobre el total:

```crono-sql
select
  categories.category_name,
  sum(order_details.unit_price * order_details.quantity) ventas,
  pct(ventas) pct_sobre_total
from staging.order_details
inner join staging.products using product_id
inner join staging.categories using category_id
group by all;
```

También es posible usar `PARTITION BY` para calcular el porcentaje dentro de un grupo:

```crono-sql
select
  year(orders.order_date) anyo,
  month(orders.order_date) mes,
  sum(order_details.unit_price * order_details.quantity) ventas,
  pct(ventas partition by anyo) pct_sobre_anyo
from staging.order_details
inner join staging.orders using order_id
group by all;
```
