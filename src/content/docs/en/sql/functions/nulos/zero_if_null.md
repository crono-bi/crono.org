---
title: "zero_if_null"
---

La función `zero_if_null` devuelve `0` si la expresión de entrada es `NULL`. En cualquier otro caso devuelve la propia expresión de entrada.

Es útil para tratar los nulos como ceros en cálculos numéricos.

## Ejemplo

```crono-sql
select zero_if_null(null) resultado;
```

El resultado es:

> 0
