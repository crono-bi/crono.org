---
title: "yyyymmdd"
---

La función `yyyymmdd` devuelve una fecha como una cadena de texto de 8 caracteres en formato `YYYYMMDD`.

Es útil para generar claves temporales o exportar fechas en formato compacto.

## Ejemplo

```crono-sql
select yyyymmdd('2025-06-15') resultado;
```

El resultado es:

> 20250615
