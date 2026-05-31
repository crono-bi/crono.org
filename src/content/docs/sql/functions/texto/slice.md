---
title: "slice"
---

La función `slice` devuelve una subcadena a partir de una posición de inicio y, opcionalmente, una posición de fin. Se comporta como el método `slice` de JavaScript: los índices son base 0 y los valores negativos cuentan desde el final de la cadena.

## Ejemplos

```crono-sql
select slice('Hello World!', 6) resultado;
```

> World!

```crono-sql
select slice('Hello World!', 0, 5) resultado;
```

> Hello

```crono-sql
select slice('Hello World!', -6) resultado;
```

> World!

## Comentarios

`slice` y `substring` son similares, pero tienen diferencias que conviene conocer. `slice` recibe la posición de inicio y la posición de fin, y admite valores negativos en cualquiera de sus argumentos: un valor negativo indica una posición contada desde el final de la cadena, lo que resulta útil para extraer sufijos sin conocer la longitud total. `substring`, en cambio, recibe la posición de inicio y la longitud de la subcadena a extraer, lo que es más directo cuando se conoce cuántos caracteres se quieren obtener.
