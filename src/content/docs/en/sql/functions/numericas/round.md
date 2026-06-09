---
title: "round"
---

La función `round` redondea un número al número de decimales especificado. Si no se especifica el segundo parámetro, redondea al entero más cercano.

## Ejemplos

```crono-sql
select round(10.222222, 2) resultado;
```

> 10.22

```crono-sql
select round(10.5) resultado;
```

> 11
