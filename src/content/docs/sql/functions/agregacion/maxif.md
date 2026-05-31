---
title: "maxif"
---

La función `maxif` devuelve el valor máximo de una expresión solo para las filas que cumplen una condición. Las filas que no cumplen la condición se ignoran.

Es equivalente a `max(CASE WHEN condición THEN expresión END)`, pero con una sintaxis más compacta y legible.

## Ejemplo

La siguiente consulta calcula, para cada producto, el precio máximo de venta general y el precio máximo de venta al cliente `SUPRD`:

```crono-sql
SELECT
  products.product_name,
  max(od.unit_price)                              max_price,
  maxif(orders.customer_id = 'SUPRD', od.unit_price) max_price_suprd
FROM staging.order_details od
INNER JOIN staging.orders USING order_id
INNER JOIN staging.products USING product_id
```

## Comentarios

Para obtener el mínimo condicional, usar `minif`. Para sumar o contar según una condición, usar `sumif` o `countif`.
