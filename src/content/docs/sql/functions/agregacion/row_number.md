---
title: "row_number"
---

La función `row_number` es una función de ventana que asigna un número secuencial único a cada fila del rango, comenzando por 1. A diferencia de `rank` y `dense_rank`, no produce empates: si dos filas tienen el mismo valor de ordenación, el número asignado es arbitrario pero siempre distinto.

Requiere la cláusula `ORDER BY`. Se puede usar tanto la sintaxis `OVER` estándar como la sintaxis compacta de Crono.

## Ejemplo

La siguiente consulta numera los pedidos de cada cliente por orden cronológico:

```crono-sql
select
  customers.company_name,
  orders.order_id,
  orders.order_date,
  row_number(partition by orders.customer_id order by orders.order_date) num_pedido
from staging.orders
inner join staging.customers using customer_id;
```

Un uso habitual es quedarse con el primer o el último registro de cada grupo usando `qualify`:

```crono-sql
select
  customers.company_name,
  orders.order_id,
  orders.order_date
from staging.orders
inner join staging.customers using customer_id
qualify row_number(partition by orders.customer_id order by orders.order_date desc) = 1;
```

## Comentarios

Para obtener el primer o el último valor de cada grupo se puede usar también `is_first` o `is_last`, que son equivalentes más expresivos.
