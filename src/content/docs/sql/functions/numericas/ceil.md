---
title: "ceil"
---

La función `ceil` redondea un número hacia arriba al entero más cercano.

## Ejemplos

```crono-sql
select ceil(10.2) resultado;
```

> 11

```crono-sql
select ceil(10.9) resultado;
```

> 11

```crono-sql
select ceil(-10.2) resultado;
```

> -10
