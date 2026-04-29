---
title: "mod"
---


La función `mod` devuelve el resto al dividir un número entre otro.

## Ejemplo

```crono-sql
select mod(10,4) AS modulus;
```

El código generado para SQL Server es:

```crono-sql
SELECT (10 % 4) AS modulus
```

El resultado es:

> 2

## Comentario

La función `mod` forma parte del ANSI estándar, aunque no todas los gestores de base de datos usan la misma sintaxis.




