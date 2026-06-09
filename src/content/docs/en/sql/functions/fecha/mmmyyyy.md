---
title: "mmmyyyy"
---

La función `mmmyyyy` devuelve el nombre abreviado del mes seguido del año de una fecha como una cadena de texto.

El idioma del resultado depende de la configuración del sistema de base de datos.

## Ejemplo

```crono-sql
select mmmyyyy('2025-06-15') resultado;
```

El resultado es:

> jun 2025
