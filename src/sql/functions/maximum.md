﻿---
SidebarGroup: "index-math-functions"
Autogenerated: true
---

# maximum ❇️

La función `maximum` devuelve el valor máximo entre el conjunto de expresiones de entrada.

Si todos los parámetros de entrada son nulos la función devuelve `NULL`

## Ejemplo

```
select maximum(1,5,3,2) AS maximumNumber;
```

El código SQL generado es el siguiente:

```SELECT
  CASE
    WHEN 1 IS NOT NULL AND (5 IS NULL OR 1>=5) AND (3 IS NULL OR 1>=3) AND (2 IS NULL OR 1>=2) THEN 1
    WHEN 5 IS NOT NULL AND (3 IS NULL OR 5>=3) AND (2 IS NULL OR 5>=2) THEN 5
    WHEN 3 IS NOT NULL AND (2 IS NULL OR 3>=2) THEN 3
    ELSE 2
  END AS maximumNumber
```

El resultado es:

> 5

## Comentarios

La función `maximum` a diferencia de `max` no es una función de agregación. La función `max` actúa sobre los registros de una tabla, mientras que `maximum` sirve para buscar el valor máximo entre las distintas columnas -o expresiones- de un mismo registro.








