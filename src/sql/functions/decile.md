﻿---
SidebarGroup: "index-aggregation-functions"
Autogenerated: true
---

# decile ❇️

La función `decile` es una función de ventana que devuelve el ranking de cada fila normalizado entre 1 y 10. Es decir, divide el conjunto de registros en 10 grupos con el mismo número de registros cada uno y los numera de 1 a 10.

Requiere la cláusula ORDER BY en la partición OVER.

Se puede usar tanto la sintaxis `OVER` del SQL estándar como la sintaxis compacta propia de Crono.

## Ejemplo

La siguiente consulta devuelve el decil de ventas en que se encuentra cada libro. Los libros con un percentil de 9 o 10 están en el grupo del 20% de libros más vendidos.

```
select 
  lb_libros.titulo libro,
  sum(unidades) ventas,
  decile(order by ventas) percentil
from dbo.lb_ventas
inner join lb_libros using id_libro
group by all
```

La consulta SQL generada es:

```
SELECT
  lb_libros.titulo AS libro,
  sum(unidades) AS ventas,
  ceiling(10.0*rank() OVER (ORDER BY sum(unidades))/count(*) OVER ()) AS percentil
FROM dbo.lb_ventas
INNER JOIN lb_libros ON (lb_ventas.id_libro=lb_libros.id_libro)
GROUP BY lb_libros.titulo
```

## Comentarios

Esta función es similar a `rank`, `percentile`, `quartile` y `quantile`. La función `rank` devuelve la posición ordinal de cada registro, mientras que las otras funciones clasifican los registros en grupos de distintos tamaños (100, 10, 4 o *n*).


