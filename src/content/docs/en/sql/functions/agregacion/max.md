---
title: "max"
---

La función `max` devuelve el valor máximo de los valores de un grupo, ignorando los valores `NULL`.

## Ejemplo

```crono-sql
select max(orders.freight) porte_maximo
from staging.orders;
```
