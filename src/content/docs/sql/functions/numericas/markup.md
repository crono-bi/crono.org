---
title: "markup"
---

La función `markup` calcula el markup de venta a partir del importe de venta y el coste. El resultado es un valor porcentual: el margen absoluto dividido entre el coste.

Si el coste es `0` devuelve `NULL`.

## Ejemplo

```crono-sql
select markup(100, 70) markup;
```

El resultado es:

> 0.4286

## Ejemplo con tabla

```crono-sql
SELECT
  products.product_name,
  sum(order_details.unit_price * order_details.quantity) ventas,
  sum(products.unit_price * order_details.quantity) coste,
  substraction(ventas, coste) margen_absoluto,
  margin(ventas, coste) margen_pct,
  markup(ventas, coste) markup_pct
FROM staging.order_details
INNER JOIN staging.products USING product_id
```

## Comentario

El markup se calcula dividiendo el margen absoluto entre el coste. No debe confundirse con el `margin`, que se calcula dividiendo entre las ventas.
