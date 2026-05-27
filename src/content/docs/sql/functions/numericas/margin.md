---
title: "margin"
---

La función `margin` calcula el margen de venta a partir del importe de venta y el coste. El resultado es un valor porcentual: el margen absoluto dividido entre las ventas.

Si el importe de venta es `0` devuelve `NULL`.

## Ejemplo

```crono-sql
select margin(100, 70) margen;
```

El resultado es:

> 0.30

## Ejemplo con tabla

```crono-sql
SELECT
  products.product_name,
  sum(order_details.unit_price * order_details.quantity) ventas,
  sum(products.unit_price * order_details.quantity) coste,
  substraction(ventas, coste) margen_absoluto,
  margin(ventas, coste) margen_pct
FROM staging.order_details
INNER JOIN staging.products USING product_id
```

## Comentario

El margen se calcula dividiendo el margen absoluto entre las ventas. No debe confundirse con el `markup`, que se calcula dividiendo entre el coste.
