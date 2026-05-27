---
title: "pctvariance"
---

La función `pctvariance` calcula la variación porcentual entre un valor base y un valor de comparación. El resultado es `(comparacion - base) / base`. Si el valor base es `0` devuelve `NULL`.

## Ejemplo

```crono-sql
select pctvariance(10, 7) resultado;
```

El resultado es:

> -0.3

## Comentario

Esta función es útil para calcular variaciones interanuales o cualquier comparación relativa entre dos valores. Un resultado positivo indica crecimiento; negativo, decrecimiento.
