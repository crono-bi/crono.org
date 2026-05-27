---
title: "average"
---

La función `average` calcula el promedio de una lista de valores. Los valores nulos se ignoran en el cálculo.

## Ejemplos

```crono-sql
select average(1, 2, 3, 4, 6.5) resultado;
```

> 3.3

```crono-sql
select average(1, null, 3) resultado;
```

> 2

## Comentario

La función `average` opera sobre una lista de expresiones de un mismo registro, a diferencia de `avg` que es una función de agregación que opera sobre los registros de una tabla.
