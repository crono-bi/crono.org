---
title: "split"
---

La función `split` divide una cadena de texto usando un separador y devuelve el elemento en la posición indicada. El índice comienza en 1.

## Ejemplo

```crono-sql
select split('hola mundo crono', ' ', 2) resultado;
```

El resultado es:

> mundo
