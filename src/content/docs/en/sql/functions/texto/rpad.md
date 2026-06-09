---
title: "rpad"
---

La función `rpad` rellena una cadena de texto por la derecha con un carácter dado hasta alcanzar la longitud indicada. Si la cadena original ya tiene esa longitud o la supera, se devuelve truncada por la derecha. El tercer parámetro es opcional; si se omite, se usa el espacio en blanco como carácter de relleno.

## Ejemplos

```crono-sql
select rpad('42', 6, '0') resultado;
```

> 420000

```crono-sql
select rpad('Hello', 8, '.') resultado;
```

> Hello...

## Comentarios

Para rellenar por la izquierda, usar `lpad`.
