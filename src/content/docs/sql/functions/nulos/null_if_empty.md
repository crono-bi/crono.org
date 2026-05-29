---
title: "null_if_empty"
---

La función `null_if_empty` devuelve `NULL` si la expresión de entrada es una cadena vacía. En cualquier otro caso devuelve la propia expresión de entrada.

Es la función inversa de `empty_if_null`.

## Ejemplo

```crono-sql
select null_if_empty('') resultado;
```

El resultado es:

> NULL
