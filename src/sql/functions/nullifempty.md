﻿---
SidebarGroup: "index-conversion-functions"
Autogenerated: true
---

# nullifempty ❇️

La función `nullifempty` devuelve `NULL` si la expresión de entrada es una cadena vacia. En cualquier otro caso devuelve la propia cadena  de entrada.

## Ejemplo

```
SELECT nullifempty(myTable.Description) Description
FROM dbo.myTable
```

El código SQL generado utiliza el operador `CASE`:

```
SELECT CASE WHEN myTable.Description<>'' THEN myTable.Description END AS Description
FROM dbo.myTable
```
