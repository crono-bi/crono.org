﻿---
SidebarGroup: "index-conversion-functions"
Autogenerated: true
---

# zeroifnull ❇️

La función `zeroifnull` devuelve `0` si la expresión de entrada es un `NULL`. En cualquier otro caso devuelve la propia expresión de entrada.

## Ejemplo

```
SELECT min(zeroifnull(myTable.Value)) MinValue
FROM dbo.myTable
```

El código SQL generado utiliza la función `coalesce`:

```
SELECT min(coalesce(myTable.[Value],0)) AS MinValue
FROM dbo.myTable
```
