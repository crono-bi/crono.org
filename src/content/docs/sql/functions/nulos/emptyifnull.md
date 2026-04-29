---
title: "emptyifnull"
---


La función `emptyifnull` devuelve una cadena vacía si la expresión de entrada es `NULL`. En cualquier otro caso devuelve la propia cadena  de entrada.

## Ejemplo

```crono-sql
SELECT emptyifnull(myTable.Description) Description
FROM dbo.myTable
```

El código SQL generado utiliza la función `coalesce`:

```crono-sql
SELECT coalesce(myTable.Description,'') AS Description
FROM dbo.myTable
```
