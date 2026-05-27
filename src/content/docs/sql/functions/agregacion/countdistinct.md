---
title: "countdistinct"
---

La función `countdistinct` devuelve el número de valores distintos y no nulos de una expresión en un grupo.

## Ejemplo

```crono-sql
select countdistinct(orders.customer_id) clientes_con_pedidos
from staging.orders;
```
