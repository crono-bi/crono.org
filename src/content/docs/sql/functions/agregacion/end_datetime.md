---
title: "end_datetime"
---

La función `end_datetime` es una función de ventana que calcula la fecha y hora de fin de un periodo a partir de la fecha y hora de inicio. Es útil cuando la tabla solo almacena el inicio de cada periodo y el fin se infiere a partir del siguiente registro.

La función requiere la cláusula `PARTITION BY` para identificar los periodos de cada entidad.

## Ejemplo

```crono-sql
select
  product_prices.product_id,
  product_prices.unit_price,
  product_prices.valid_from,
  end_datetime(product_prices.valid_from partition by product_prices.product_id) valid_to
from staging.product_prices;
```

## Comentarios

La fecha de inicio debe ser de tipo `datetime`. Para fechas de tipo `date` se usa la función `end_date`.
