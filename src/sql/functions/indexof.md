﻿---
SidebarGroup: "index-conversion-functions"
Autogenerated: true
---

# indexof ❇️

La función `IndexOf` devuelve la posición de una expresión dentro de la lista.

Se trata de un modo compacto de utilizar la sintaxis simple de `CASE`.


# Ejemplo

```
select Id,IndexOf(Description, 'High', 'Medium', 'Low') Code
from MyTable
```

La sentencia SQL generada utiliza la expresión `CASE`:

```
SELECT
  Id,
  CASE Description WHEN 'High' THEN 1 WHEN 'Medium' THEN 2 WHEN 'Low' THEN 3 END AS Code
FROM MyTable
```

