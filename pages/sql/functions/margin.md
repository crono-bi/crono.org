---
SidebarGroup: "index-math-functions"
---

# margin ❇️ 

Esta función calcula el margen de venta a partir del *coste de venta* y el *importe de venta*. El margen de venta es una medida de la rentabilidad de una empresa. Es un valor porcentual que se calcula dividiendo el margen absoluto entre las ventas totales.

![Margen de ventas](/images/margen.png)

**Crono SQL** verifica que el denominador no sea cero para evitar el error que generaría la división entre cero.

## Ejemplos

La siguiente consulta calcula el margen a partir del coste y el importe de venta.

``` ShowSql
select margin(ventas,coste) margen;
```


La siguiente consulta calcula el margen de cada producto durante un periodo determinado:

``` CronoSqlSample
SELECT
  LB_LIBROS.TITULO AS [Título],
  sum(LB_VENTAS.PVP) AS Importe,
  sum(LB_VENTAS.COSTE) AS Coste,
  substraction(importe,coste) Margen,
  margin(importe,coste) MargenPct
FROM dbo.LB_VENTAS LB_VENTAS
INNER JOIN dbo.LB_TIEMPO LB_TIEMPO ON (LB_VENTAS.FECHA=LB_TIEMPO.FECHA)
INNER JOIN dbo.LB_LIBROS LB_LIBROS ON (LB_VENTAS.ID_LIBRO=LB_LIBROS.ID_LIBRO)
WHERE LB_TIEMPO.ANYO =2022
GROUP BY LB_LIBROS.TITULO
```


## Comentario

El margen de venta se calcula dividiendo el margen absoluto entre las ventas. Es la medida de rentabilidad más habitual y no se debe confundir con el **markup** que se calcula dividiéndolo entre el coste.







