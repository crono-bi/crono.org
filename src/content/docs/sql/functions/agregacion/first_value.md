---
title: "first_value"
---

La función `first_value` es una función de ventana que devuelve el valor de una expresión correspondiente a la primera fila del rango.

Requiere la cláusula `ORDER BY`. Se puede usar tanto la sintaxis `OVER` estándar como la sintaxis compacta de Crono.

## Ejemplo

La siguiente consulta muestra, para cada pedido, cuál fue el primer pedido del mismo cliente:

```crono-sql
select
  customers.company_name,
  orders.order_id,
  orders.order_date,
  first_value(orders.order_date partition by orders.customer_id order by orders.order_date) fecha_primer_pedido
from staging.orders
inner join staging.customers using customer_id;
```

## Comentarios

Esta función es equivalente a obtener el valor del registro con `row_number = 1` dentro del grupo. Para un booleano que indique simplemente si la fila es la primera del grupo, usar `is_first`.
