---
title: "nullifzero"
---


La función `nullifzero` devuelve `NULL` si la expresión de entrada es un `0`. En cualquier otro caso devuelve la propia expresión de entrada.

## Ejemplo

```crono-sql
SELECT min(nullifzero(myTable.Value)) MinValue
FROM dbo.myTable
```

El código SQL generado utiliza el operador `CASE`:

```crono-sql
SELECT min(CASE WHEN myTable.[Value]<>0 THEN myTable.[Value] END) AS MinValue
FROM dbo.myTable
```
