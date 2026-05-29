---
title: "add_months"
---

La función `add_months` devuelve una nueva fecha que resulta de sumar un número determinado de meses a una fecha dada. Si el número es negativo, se restan meses.

## Ejemplo

```crono-sql
select add_months('2025-01-31', 1) resultado;
```

El resultado es:

> 2025-02-28
