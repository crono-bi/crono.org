---
title: "sumif"
---

La función `sumif` devuelve la suma de una expresión solo para las filas que cumplen una condición. Las filas que no cumplen la condición se tratan como `NULL` y no contribuyen a la suma.

Es equivalente a `sum(CASE WHEN condición THEN expresión END)`, pero con una sintaxis más compacta y legible.

## Ejemplo

La siguiente consulta calcula, para cada producto, las ventas totales y las ventas exclusivamente al cliente `SUPRD`:

```crono-sql
SELECT
  products.product_name,
  sum(od.quantity * od.unit_price)                          amount,
  sumif(orders.customer_id = 'SUPRD', od.quantity * od.unit_price) amount_suprd
FROM staging.order_details od
INNER JOIN staging.orders USING order_id
INNER JOIN staging.products USING product_id
```

## Comentarios

Para contar filas según una condición, usar `countif`. Para obtener el máximo o mínimo condicional, usar `maxif` o `minif`.
