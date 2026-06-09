---
title: "dense_rank"
---

La función `dense_rank` es una función de ventana que asigna un rango a cada fila según el orden especificado. Cuando dos o más filas tienen el mismo valor, reciben el mismo rango, pero el siguiente rango asignado es consecutivo: no hay huecos en la numeración.

Requiere la cláusula `ORDER BY`. Se puede usar tanto la sintaxis `OVER` estándar como la sintaxis compacta de Crono.

## Ejemplo

La siguiente consulta clasifica a los empleados por número de pedidos gestionados, agrupando en el mismo puesto a quienes tengan el mismo resultado:

```crono-sql
select
  employees.first_name,
  employees.last_name,
  count(orders.order_id) num_pedidos,
  dense_rank(order by num_pedidos desc) posicion
from staging.orders
inner join staging.employees using employee_id
group by all;
```

## Comentarios

La diferencia entre `dense_rank` y `rank` está en el tratamiento de los empates. `dense_rank` produce una secuencia sin huecos (1, 2, 2, 3…); `rank` deja huecos (1, 2, 2, 4…). Para una numeración sin empates, usar `row_number`.
