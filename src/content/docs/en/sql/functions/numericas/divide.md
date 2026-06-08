---
title: "divide"
---

La función `divide` devuelve el cociente de dos números. Si el divisor es `0` devuelve `NULL`.

## Ejemplo

```crono-sql
select divide(3, 2) resultado1;
select divide(3, 0) resultado2;
```

Resultados:

> 1.5
>
> NULL

## Comentario

Esta función evita el error `Divide by zero` que se produciría al usar el operador `/` estándar cuando el denominador es cero.
