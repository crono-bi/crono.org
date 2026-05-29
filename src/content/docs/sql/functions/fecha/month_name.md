---
title: "month_name"
---

La función `month_name` devuelve el nombre completo del mes de una fecha como una cadena de texto.

El idioma del resultado depende de la configuración del sistema de base de datos.

## Ejemplo

```crono-sql
select month_name('2025-06-15') resultado;
```

El resultado es:

> junio
