---
title: "rank"
---

La función `rank` es una función de ventana que asigna un rango a cada fila según el orden especificado. Cuando dos o más filas tienen el mismo valor, reciben el mismo rango y el siguiente rango asignado salta los puestos correspondientes: si dos filas empatan en el puesto 2, la siguiente recibe el puesto 4.

Requiere la cláusula `ORDER BY`. Se puede usar tanto la sintaxis `OVER` estándar como la sintaxis compacta de Crono.

## Ejemplo

La siguiente consulta clasifica los productos por ventas totales dentro de cada categoría:

```crono-sql
select
  categories.category_name,
  products.product_name,
  sum(order_details.unit_price * order_details.quantity) ventas,
  rank(partition by categories.category_name order by ventas desc) posicion
from staging.order_details
inner join staging.products using product_id
inner join staging.categories using category_id
group by all;
```

## Comentarios

La diferencia entre `rank` y `dense_rank` está en el tratamiento de los empates. `rank` deja huecos en la numeración (1, 2, 2, 4…); `dense_rank` no los deja (1, 2, 2, 3…). Para una numeración sin empates, usar `row_number`.
