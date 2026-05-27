---
title: "nullifempty"
---

La función `nullifempty` devuelve `NULL` si la expresión de entrada es una cadena vacía. En cualquier otro caso devuelve la propia expresión de entrada.

Es la función inversa de `emptyifnull`.

## Ejemplo

```crono-sql
select nullifempty('') resultado;
```

El resultado es:

> NULL
