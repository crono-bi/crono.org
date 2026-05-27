---
title: "nullifzero"
---

La función `nullifzero` devuelve `NULL` si la expresión de entrada es `0`. En cualquier otro caso devuelve la propia expresión de entrada.

Es útil para evitar que los ceros distorsionen cálculos como mínimos o medias.

## Ejemplo

```crono-sql
select nullifzero(0) resultado;
```

El resultado es:

> NULL
