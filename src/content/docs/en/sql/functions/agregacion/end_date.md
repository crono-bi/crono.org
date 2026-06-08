---
title: "end_date"
---

La función `end_date` es una función de ventana que calcula la fecha de fin de un periodo a partir de la fecha de inicio. Es útil cuando la tabla solo almacena la fecha de inicio de cada periodo y la fecha de fin se infiere como el día anterior al siguiente inicio.

La función requiere la cláusula `PARTITION BY` para identificar los periodos de cada entidad.

## Ejemplo

```crono-sql
select
  product_prices.product_id,
  product_prices.unit_price,
  product_prices.valid_from,
  end_date(product_prices.valid_from partition by product_prices.product_id) valid_to
from staging.product_prices;
```

## Comentarios

La fecha de inicio debe ser de tipo `date`. Para fechas de tipo `datetime` se usa la función `end_datetime`.
