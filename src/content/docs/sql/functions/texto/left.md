---
title: "left ❇️"
---


La función `left` devuelve el número especificado de caracteres iniciales de una cadena de texto.

## Ejemplo

```sql
select left('Hello World!',5)  as result;
```

El código generado es:

```sql
SELECT substring('Hello World!',1,5) AS result
```

El resultado es:

> 5
