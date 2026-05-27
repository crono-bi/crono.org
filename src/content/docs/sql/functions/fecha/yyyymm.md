---
title: "yyyymm"
---

La función `yyyymm` devuelve el año y el mes de una fecha como una cadena de texto de 6 caracteres en formato `YYYYMM`.

Es útil para generar claves temporales o agrupar registros por mes de forma compacta y ordenable.

## Ejemplo

```crono-sql
select yyyymm('2025-06-15') resultado;
```

El resultado es:

> 202506
