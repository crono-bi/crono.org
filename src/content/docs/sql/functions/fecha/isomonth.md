---
title: "isomonth"
---

La función `isomonth` convierte una fecha en una cadena de texto con formato `YYYY-MM`.

Es útil para agrupar registros por mes de forma ordenable y sin ambigüedades.

## Ejemplo

```crono-sql
select isomonth('2025-06-15') resultado;
```

El resultado es:

> 2025-06
