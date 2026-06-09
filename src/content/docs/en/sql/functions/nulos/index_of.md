---
title: "index_of"
---

La función `index_of` devuelve la posición de una expresión dentro de una lista de valores. El índice comienza en 1. Si la expresión no se encuentra en la lista, devuelve `NULL`.

Es una forma compacta de traducir valores en su posición ordinal.

## Ejemplo

```crono-sql
select index_of('Medio', 'Alto', 'Medio', 'Bajo') resultado;
```

El resultado es:

> 2
