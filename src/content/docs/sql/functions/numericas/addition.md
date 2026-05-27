---
title: "addition"
---

La función `addition` devuelve la suma de varios valores, ignorando los nulos. Si todos los parámetros son nulos devuelve `NULL`.

## Ejemplo

```crono-sql
select addition(1, 2, null, 4) suma;
```

El resultado es:

> 7

## Comentario

El operador estándar `+` devuelve `NULL` si cualquiera de los sumandos es nulo. La función `addition`, en cambio, trata los nulos como cero, igual que la suma de Excel.
