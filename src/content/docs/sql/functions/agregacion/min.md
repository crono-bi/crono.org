---
title: "min"
---

La función `min` devuelve el valor mínimo de los valores de un grupo, ignorando los valores `NULL`.

## Ejemplo

```crono-sql
select min(orders.freight) porte_minimo
from staging.orders;
```
