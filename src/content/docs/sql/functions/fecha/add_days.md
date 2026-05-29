---
title: "add_days"
---

La función `add_days` devuelve una nueva fecha que resulta de sumar un número determinado de días a una fecha dada. Si el número es negativo, se restan días.

## Ejemplo

```crono-sql
select add_days('2025-01-01', 10) resultado;
```

El resultado es:

> 2025-01-11
