---
title: "lead"
---

La función `lead` es una función de ventana estándar que devuelve el valor de una expresión en una fila posterior dentro de la partición. Requiere la cláusula `ORDER BY`.

El segundo parámetro, opcional, indica cuántas filas hacia adelante se desplaza la ventana. Si se omite, el valor por defecto es 1 (la fila inmediatamente siguiente). El tercer parámetro, también opcional, es el valor que se devuelve cuando no existe fila a esa distancia (por ejemplo, en la última fila de la partición).

## Ejemplo

La siguiente consulta devuelve las ventas de cada mes junto con las ventas de dos meses adelante:

```crono-sql
SELECT
  year(orders.order_date)                                    order_year,
  month(orders.order_date)                                   order_month,
  sum(order_details.unit_price * order_details.quantity)     amount,
  lead(amount, 2) OVER (ORDER BY order_year, order_month)    amount_2_months_ahead
FROM staging.order_details
INNER JOIN staging.orders USING order_id
```

## Comentarios

`lead` y `next_value` son similares pero no idénticas. `next_value` devuelve siempre el valor de la fila inmediatamente siguiente y usa la sintaxis compacta de Crono SQL. `lead` es la función estándar SQL y admite un desplazamiento configurable: `lead(expr, 2)` avanza dos filas, `lead(expr, 3)` tres, y así sucesivamente. Cuando solo se necesita la fila siguiente, ambas son equivalentes; cuando se necesita avanzar más de una fila, usar `lead`.
