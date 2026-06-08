---
title: "switch"
---

La función `switch` evalúa una expresión y devuelve el resultado asociado al primer valor que coincida. Es una forma compacta de escribir una expresión `CASE`.

El último argumento, si el número total de argumentos es par, actúa como valor por defecto.

## Ejemplo

```crono-sql
select switch(2, 1, 'Alto', 2, 'Medio', 3, 'Bajo', 'Desconocido') resultado;
```

El resultado es:

> Medio
