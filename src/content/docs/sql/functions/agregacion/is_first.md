---
title: "is_first"
---

La función `is_first` es una función de ventana que devuelve `1` para la primera fila del rango y `0` para el resto.

Se puede usar tanto la sintaxis `OVER` estándar como la sintaxis compacta de Crono.

## Ejemplo

La siguiente consulta identifica el primer y el último pedido de cada cliente:

```crono-sql
select
  customers.company_name,
  orders.order_date,
  is_first(partition by orders.customer_id order by orders.order_date) primer_pedido,
  is_last(partition by orders.customer_id order by orders.order_date) ultimo_pedido
from staging.orders
inner join staging.customers using customer_id;
```
