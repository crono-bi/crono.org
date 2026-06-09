---
title: "iso_date"
---

La función `iso_date` convierte una fecha en una cadena de texto con formato ISO 8601: `YYYY-MM-DD`.

Este formato es estándar, ordenable alfabéticamente y ampliamente utilizado para representar fechas de forma clara y sin ambigüedades.

## Ejemplo

```crono-sql
select iso_date('20250101') resultado;
```

El resultado es:

> 2025-01-01
