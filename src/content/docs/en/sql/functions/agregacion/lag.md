---
title: "lag"
---

La función `lag` es una función de ventana estándar que devuelve el valor de una expresión en una fila anterior dentro de la partición. Requiere la cláusula `ORDER BY`.

El segundo parámetro, opcional, indica cuántas filas hacia atrás se desplaza la ventana. Si se omite, el valor por defecto es 1 (la fila inmediatamente anterior). El tercer parámetro, también opcional, es el valor que se devuelve cuando no existe fila a esa distancia (por ejemplo, en la primera fila de la partición).

## Ejemplo

La siguiente consulta devuelve las ventas de cada mes junto con las ventas de dos meses atrás:

```crono-sql
SELECT
  year(orders.order_date)                                    order_year,
  month(orders.order_date)                                   order_month,
  sum(order_details.unit_price * order_details.quantity)     amount,
  lag(amount, 2) OVER (ORDER BY order_year, order_month)     amount_2_months_ago
FROM staging.order_details
INNER JOIN staging.orders USING order_id
```

## Comentarios

`lag` y `previous_value` son similares pero no idénticas. `previous_value` devuelve siempre el valor de la fila inmediatamente anterior y usa la sintaxis compacta de Crono SQL. `lag` es la función estándar SQL y admite un desplazamiento configurable: `lag(expr, 2)` retrocede dos filas, `lag(expr, 3)` tres, y así sucesivamente. Cuando solo se necesita la fila anterior, ambas son equivalentes; cuando se necesita retroceder más de una fila, usar `lag`.
