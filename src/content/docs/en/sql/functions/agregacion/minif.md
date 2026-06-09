---
title: "minif"
---

La función `minif` devuelve el valor mínimo de una expresión solo para las filas que cumplen una condición. Las filas que no cumplen la condición se ignoran.

Es equivalente a `min(CASE WHEN condición THEN expresión END)`, pero con una sintaxis más compacta y legible.

## Ejemplo

La siguiente consulta calcula, para cada producto, el precio mínimo de venta general y el precio mínimo de venta al cliente `SUPRD`:

```crono-sql
SELECT
  products.product_name,
  min(od.unit_price)                              min_price,
  minif(orders.customer_id = 'SUPRD', od.unit_price) min_price_suprd
FROM staging.order_details od
INNER JOIN staging.orders USING order_id
INNER JOIN staging.products USING product_id
```

## Comentarios

Para obtener el máximo condicional, usar `maxif`. Para sumar o contar según una condición, usar `sumif` o `countif`.
