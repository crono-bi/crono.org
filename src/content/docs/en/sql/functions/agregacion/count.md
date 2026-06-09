---
title: "count"
---

La función `count` devuelve el número de filas de un grupo. `count(*)` cuenta todas las filas; `count(columna)` ignora los valores `NULL`.

## Ejemplo

```crono-sql
select customers.country, count(*) total_clientes
from staging.customers
group by customers.country;
```
