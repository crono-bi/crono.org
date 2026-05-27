---
title: "sum"
---

La función `sum` devuelve la suma de los valores de un grupo, ignorando los valores `NULL`.

## Ejemplo

```crono-sql
select
  products.product_name,
  sum(order_details.unit_price * order_details.quantity) total_ventas
from staging.order_details
inner join staging.products using product_id
group by all;
```
