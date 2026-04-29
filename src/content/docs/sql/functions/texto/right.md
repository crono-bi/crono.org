---
title: "right"
---


La función `right` devuelve el número especificado de caracteres finales de una cadena de texto.

## Ejemplo

```crono-sql
select right('Hello World!',6)  as result;
```

El código generado es:

```crono-sql
SELECT substring('Hello World!',len('Hello World!')-6+1,6) AS result
```

El resultado es:

> World!
