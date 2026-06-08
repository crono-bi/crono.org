---
title: "abc"
---

La función `abc` traduce los números del 1 al 26 en las letras del abecedario, de la A a la Z. Es decir, convierte el 1 en una A, el 2 en una B, etc.

Si el valor de entrada es superior al número 26 la función devuelve `NULL`.

## Ejemplo

```crono-sql
select abc(11) letra;
```

El resultado es:

> K

## Comentario

La función `abc` combinada con `quantile` permite crear fácilmente rankings ABC: `abc(quantile(3) order by unidades desc)`.