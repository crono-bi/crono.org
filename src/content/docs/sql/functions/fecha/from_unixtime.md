---
title: "from_unixtime"
---

La función `from_unixtime` convierte un valor de marca de tiempo Unix (Unix timestamp) a una fecha y hora en formato `datetime`.

El tiempo Unix mide los segundos transcurridos desde el 1 de enero de 1970.

## Ejemplo

```crono-sql
select from_unixtime(1704067200) resultado;
```

El resultado es:

> 2024-01-01 00:00:00
