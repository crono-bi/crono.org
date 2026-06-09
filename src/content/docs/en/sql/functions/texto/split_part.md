---
title: "split_part"
---

La función `split_part` divide una cadena de texto usando un separador y devuelve el elemento en la posición indicada. El índice comienza en 1.

## Ejemplo

```crono-sql
select split_part('hola mundo crono', ' ', 2) resultado;
```

El resultado es:

> mundo
