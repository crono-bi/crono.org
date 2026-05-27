---
title: "zeroifnull"
---

La función `zeroifnull` devuelve `0` si la expresión de entrada es `NULL`. En cualquier otro caso devuelve la propia expresión de entrada.

Es útil para tratar los nulos como ceros en cálculos numéricos.

## Ejemplo

```crono-sql
select zeroifnull(null) resultado;
```

El resultado es:

> 0
