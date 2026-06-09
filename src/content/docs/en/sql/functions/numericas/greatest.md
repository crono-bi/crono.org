---
title: "greatest"
---

La función `greatest` devuelve el valor máximo entre una lista de expresiones de un mismo registro. Si todos los parámetros son nulos devuelve `NULL`.

## Ejemplo

```crono-sql
select greatest(1, 5, 3, 2) resultado;
```

El resultado es:

> 5

## Comentario

La función `greatest` opera sobre una lista de expresiones de un mismo registro, a diferencia de `max` que es una función de agregación que opera sobre los registros de una tabla.
