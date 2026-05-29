---
title: "count_distinct"
---

La función `count_distinct` devuelve el número de valores distintos y no nulos de una expresión en un grupo.

## Ejemplo

```crono-sql
select count_distinct(orders.customer_id) clientes_con_pedidos
from staging.orders;
```
