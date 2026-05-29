---
title: "timestamp"
---

La función `timestamp` convierte una expresión al tipo `timestamp`, que almacena fecha y hora junto con el desplazamiento de zona horaria.

## Ejemplo

```crono-sql
select timestamp('2025-06-15 14:30:00') resultado;
```

El resultado es:

> 2025-06-15 14:30:00 +00:00
