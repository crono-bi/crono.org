---
title: "emptyifnull"
---

La función `emptyifnull` devuelve una cadena vacía si la expresión de entrada es `NULL`. En cualquier otro caso devuelve la propia expresión de entrada.

## Ejemplo

```crono-sql
select customers.customer_id,
  emptyifnull(customers.region) region
from staging.customers;
```
