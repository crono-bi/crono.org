---
title: "julian_date"
---

La función `julian_date` convierte una fecha del calendario gregoriano a su equivalente en número de fecha juliana.

El sistema de fecha juliana es un conteo continuo de días desde el 1 de enero del año 4713 a.C. Es la función inversa de `from_julian_date`.

## Ejemplo

```crono-sql
select julian_date('2025-01-01') resultado;
```

El resultado es:

> 2460677
