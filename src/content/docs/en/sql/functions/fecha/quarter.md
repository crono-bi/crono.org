---
title: "quarter"
---

La función `quarter` devuelve un número entero entre 1 y 4 que representa el trimestre de una fecha.

## Ejemplo

```crono-sql
select quarter('2025-06-15') resultado;
```

El resultado es:

> 2

## Comentarios

Para obtener el mes o el año de una fecha, usar `month` o `year`.
