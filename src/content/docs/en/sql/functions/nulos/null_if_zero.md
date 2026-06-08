---
title: "null_if_zero"
---

La función `null_if_zero` devuelve `NULL` si la expresión de entrada es `0`. En cualquier otro caso devuelve la propia expresión de entrada.

Es útil para evitar que los ceros distorsionen cálculos como mínimos o medias.

## Ejemplo

```crono-sql
select null_if_zero(0) resultado;
```

El resultado es:

> NULL
