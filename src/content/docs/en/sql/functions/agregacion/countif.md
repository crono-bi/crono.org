---
title: "countif"
---

La función `countif` cuenta las filas que cumplen una condición, ignorando las que no la cumplen.

Es equivalente a `count(CASE WHEN condición THEN 1 END)`, pero con una sintaxis más compacta y legible.

## Ejemplo

La siguiente consulta calcula, para cada producto, el número total de pedidos y el número de pedidos del cliente `SUPRD`:

```crono-sql
SELECT
  products.product_name,
  count(od.order_id)                              total_orders,
  countif(orders.customer_id = 'SUPRD', od.order_id) orders_suprd
FROM staging.order_details od
INNER JOIN staging.orders USING order_id
INNER JOIN staging.products USING product_id
```

## Comentarios

Para sumar valores según una condición, usar `sumif`. Para obtener el máximo o mínimo condicional, usar `maxif` o `minif`.
