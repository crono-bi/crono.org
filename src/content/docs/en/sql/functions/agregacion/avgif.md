---
title: "avgif"
---

La función `avgif` devuelve la media aritmética de una expresión solo para las filas que cumplen una condición. Las filas que no cumplen la condición se ignoran en el cálculo.

Es equivalente a `avg(CASE WHEN condición THEN expresión END)`, pero con una sintaxis más compacta y legible.

## Ejemplo

La siguiente consulta calcula, para cada producto, el precio medio de venta general y el precio medio de venta al cliente `SUPRD`:

```crono-sql
SELECT
  products.product_name,
  avg(od.unit_price)                              avg_price,
  avgif(orders.customer_id = 'SUPRD', od.unit_price) avg_price_suprd
FROM staging.order_details od
INNER JOIN staging.orders USING order_id
INNER JOIN staging.products USING product_id
```

## Comentarios

Para sumar, contar o calcular el máximo o mínimo según una condición, usar `sumif`, `countif`, `maxif` o `minif`.
