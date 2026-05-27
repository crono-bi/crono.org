---
title: "juliandate"
---

La función `juliandate` convierte una fecha del calendario gregoriano a su equivalente en número de fecha juliana.

El sistema de fecha juliana es un conteo continuo de días desde el 1 de enero del año 4713 a.C. Es la función inversa de `fromjuliandate`.

## Ejemplo

```crono-sql
select juliandate('2025-01-01') resultado;
```

El resultado es:

> 2460677
