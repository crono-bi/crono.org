---
title: "substraction"
---

La función `substraction` resta del primer argumento el resto de argumentos. Los valores nulos se tratan como cero. Si todos los parámetros son nulos devuelve `NULL`.

## Ejemplo

```crono-sql
select substraction(10, 3, null, 2) resultado;
```

El resultado es:

> 5

## Comentario

El operador estándar `-` devuelve `NULL` si cualquiera de los operandos es nulo. La función `substraction`, en cambio, trata los nulos como cero, igual que la resta de Excel.
