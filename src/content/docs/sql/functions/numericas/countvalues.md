---
title: "countvalues"
---

La función `countvalues` devuelve el número de valores no nulos de una lista de expresiones.

## Ejemplos

```crono-sql
select countvalues(1, 2, 3, 4, 6.5) resultado;
```

> 5

```crono-sql
select countvalues(1, null, 3) resultado;
```

> 2

## Comentario

La función `countvalues` opera sobre una lista de expresiones de un mismo registro, a diferencia de `count` que es una función de agregación que opera sobre los registros de una tabla.
