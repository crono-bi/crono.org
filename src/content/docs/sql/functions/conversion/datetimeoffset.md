---
title: "datetimeoffset"
---

La función `datetimeoffset` convierte una expresión al tipo `datetimeoffset`, que almacena fecha y hora junto con el desplazamiento de zona horaria.

## Ejemplo

```crono-sql
select datetimeoffset('2025-06-15 14:30:00') resultado;
```

El resultado es:

> 2025-06-15 14:30:00 +00:00
