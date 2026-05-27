---
title: "minimum"
---

La función `minimum` devuelve el valor mínimo entre una lista de expresiones de un mismo registro. Si todos los parámetros son nulos devuelve `NULL`.

## Ejemplo

```crono-sql
select minimum(1, 5, 3, 2) resultado;
```

El resultado es:

> 1

## Comentario

La función `minimum` opera sobre una lista de expresiones de un mismo registro, a diferencia de `min` que es una función de agregación que opera sobre los registros de una tabla.
