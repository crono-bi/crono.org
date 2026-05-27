---
title: "avg"
---

La función `avg` devuelve la media aritmética de los valores de un grupo, ignorando los valores `NULL`.

## Ejemplo

```crono-sql
select avg(orders.freight) media_porte
from staging.orders;
```
