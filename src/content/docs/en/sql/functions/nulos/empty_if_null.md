---
title: "empty_if_null"
---

La función `empty_if_null` devuelve una cadena vacía si la expresión de entrada es `NULL`. En cualquier otro caso devuelve la propia expresión de entrada.

## Ejemplo

```crono-sql
select customers.customer_id,
  empty_if_null(customers.region) region
from staging.customers;
```
