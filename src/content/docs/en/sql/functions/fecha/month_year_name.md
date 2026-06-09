---
title: "month_year_name"
---

La función `month_year_name` devuelve el nombre completo del mes seguido del año de una fecha como una cadena de texto.

El idioma del resultado depende de la configuración del sistema de base de datos.

## Ejemplo

```crono-sql
select month_year_name('2025-06-15') resultado;
```

El resultado es:

> junio 2025
