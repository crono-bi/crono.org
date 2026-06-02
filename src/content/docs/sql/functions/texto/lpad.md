---
title: "lpad"
---

La función `lpad` rellena una cadena de texto por la izquierda con un carácter dado hasta alcanzar la longitud indicada. Si la cadena original ya tiene esa longitud o la supera, se devuelve truncada por la derecha. El tercer parámetro es opcional; si se omite, se usa el espacio en blanco como carácter de relleno.

## Ejemplos

```crono-sql
select lpad('42', 6, '0') resultado;
```

> 000042

```crono-sql
select lpad('Hello', 8, '*') resultado;
```

> ***Hello

## Comentarios

Para rellenar por la derecha, usar `rpad`.
