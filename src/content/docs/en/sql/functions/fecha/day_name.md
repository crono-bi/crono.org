---
title: "day_name"
---

La función `day_name` devuelve el nombre del día de la semana correspondiente a una fecha como una cadena de texto.

El idioma del resultado depende de la configuración del sistema de base de datos.

## Ejemplo

```crono-sql
select day_name('2025-01-01') resultado;
```

El resultado es:

> miércoles
