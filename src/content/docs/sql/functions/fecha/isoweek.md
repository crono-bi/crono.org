---
title: "isoweek"
---

La función `isoweek` devuelve el número de semana ISO de una fecha determinada.

La norma ISO 8601 establece que la semana comienza el lunes y que la primera semana del año es aquella que contiene el primer jueves del año.

## Ejemplo

```crono-sql
select isoweek('2025-06-15') resultado;
```

El resultado es:

> 24

## Comentarios

El año de la semana ISO de una fecha no coincide necesariamente con el año natural de esa fecha. Por ejemplo, el 1 de enero de 2022 pertenece a la semana 52 del año 2021. Por este motivo, al agrupar o filtrar por semana ISO conviene usar `isoweekyear` junto con `isoweek`.
