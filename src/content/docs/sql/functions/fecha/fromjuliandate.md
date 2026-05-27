---
title: "fromjuliandate"
---

La función `fromjuliandate` convierte un número de fecha juliana a una fecha del calendario gregoriano.

El sistema de fecha juliana es un conteo continuo de días desde el 1 de enero del año 4713 a.C.

## Ejemplo

```crono-sql
select fromjuliandate(2460677) resultado;
```

El resultado es:

> 2025-01-01
