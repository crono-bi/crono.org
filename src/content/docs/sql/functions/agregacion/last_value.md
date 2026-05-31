---
title: "last_value"
---

La función `last_value` es una función de ventana que devuelve el valor de una expresión correspondiente a la última fila del rango.

Requiere la cláusula `ORDER BY`. Se puede usar tanto la sintaxis `OVER` estándar como la sintaxis compacta de Crono.

## Ejemplo

La siguiente consulta muestra, para cada pedido, cuál fue el pedido más reciente del mismo cliente en el momento de cada fila:

```crono-sql
select
  customers.company_name,
  orders.order_id,
  orders.order_date,
  last_value(orders.order_date partition by orders.customer_id order by orders.order_date) fecha_ultimo_pedido
from staging.orders
inner join staging.customers using customer_id;
```

## Comentarios

Para obtener un booleano que indique simplemente si la fila es la última del grupo, usar `is_last`. Para el valor de la fila siguiente (no la última del rango), usar `next_value`.
