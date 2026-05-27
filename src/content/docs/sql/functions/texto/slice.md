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
