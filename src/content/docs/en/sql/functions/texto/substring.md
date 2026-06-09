---
title: "substring"
---

La función `substring` devuelve una subcadena a partir de una posición de inicio y una longitud opcional. Los índices son base 1: el primer carácter de la cadena tiene posición 1.

**Sinónimos:** `substr`

## Ejemplos

```crono-sql
select substring('Hello World!', 7) resultado;
```

> World!

```crono-sql
select substring('Hello World!', 7, 5) resultado;
```

> World

## Comentarios

`substring` y `slice` son similares, pero tienen diferencias que conviene conocer. `substring` recibe la posición de inicio y la longitud de la subcadena a extraer. `slice`, en cambio, recibe la posición de inicio y la posición de fin. Además, `slice` admite valores negativos en cualquiera de sus argumentos, que indican posiciones contadas desde el final de la cadena. Cuando solo importa la posición de inicio y la longitud, `substring` es la opción más directa.
