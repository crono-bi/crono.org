---
title: "bigint"
---

La función `bigint` convierte una expresión al tipo entero de 8 bytes. Admite valores entre -9.223.372.036.854.775.808 y 9.223.372.036.854.775.807.

## Ejemplo

```crono-sql
select bigint('9000000000') resultado;
```

El resultado es:

> 9000000000
