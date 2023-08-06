---
SidebarGroup: "index-math-functions"
---

# markup ❇️


Esta función calcula el *markup* de venta a partir del *coste de venta* y el *importe de venta*. 

El markup de ventas es una medida que se utiliza habitualmente para calcular el precio de venta de un producto o servicio. Se calcula añadiendo un porcentaje adicional al costo del producto o servicio para cubrir los gastos operativos y obtener ganancias. El markup de ventas se expresa como un porcentaje del costo del producto o servicio.

Por ejemplo, si una empresa tiene un costo de 100 € para fabricar un producto y quiere obtener una ganancia del 20%, entonces el markup de ventas es del 20%.

A partir del coste de venta y del precio se puede calcular dividiendo el margen absoluto entre el coste.

![Markup de ventas](/images/markup.png)


**Crono SQL** verifica que el denominador no sea cero para evitar el error que generaría la división entre cero.

## Ejemplos

La siguiente consulta calcula el markup a partir del coste y el importe de venta.

``` ShowSql
select markup(ventas, coste) [markup];
```


La siguiente consulta calcula el *margen* y el *markup* de cada producto durante un periodo determinado:

``` CronoSqlSample
SELECT
  LB_LIBROS.TITULO AS [Título],
  sum(LB_VENTAS.PVP) AS Importe,
  sum(LB_VENTAS.COSTE) AS Coste,
  substraction(Coste,importe) Margen,
  margin(importe,coste) MargenPct,
  Markup(importe,coste) [Markup]
FROM dbo.LB_VENTAS LB_VENTAS
INNER JOIN dbo.LB_TIEMPO LB_TIEMPO ON (LB_VENTAS.FECHA=LB_TIEMPO.FECHA)
INNER JOIN dbo.LB_LIBROS LB_LIBROS ON (LB_VENTAS.ID_LIBRO=LB_LIBROS.ID_LIBRO)
WHERE LB_TIEMPO.ANYO =2022
GROUP BY LB_LIBROS.TITULO
```


## Comentario

El *markup* se calcula dividiendo el margen absoluto entre el coste y no se debe confundir con el *margen de venta** que se calcula dividiéndolo entre el importe de venta.









