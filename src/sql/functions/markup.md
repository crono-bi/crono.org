﻿---
SidebarGroup: index-math-functions
title: markup ❇️
Autogenerated: true
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

<div>

``` sql
select markup(ventas, coste) [markup];
```

El código SQL generado es:

``` sql
SELECT CASE WHEN coste<>0 THEN 1.0*CASE WHEN ventas IS NOT NULL OR coste IS NOT NULL THEN coalesce(ventas,0)-coalesce(coste,0) END/coste END AS [markup]
```
</div>


La siguiente consulta calcula el *margen* y el *markup* de cada producto durante un periodo determinado:

<div class="mt-1 mb-2 row">
  <div class="col-lg-12">

``` sql
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

  <b-button class="float-right btn" size="sm" v-b-modal.modal-2 style="background-color: #3eaf7c">Ver SQL compilado</b-button>

  <b-modal id="modal-2" size="lg" title="Ver SQL compilado" :hide-footer="true" > 
``` sql
SELECT
  LB_LIBROS.TITULO AS [Título],
  sum(LB_VENTAS.PVP) AS Importe,
  sum(LB_VENTAS.COSTE) AS Coste,
  CASE WHEN sum(LB_VENTAS.COSTE) IS NOT NULL OR sum(LB_VENTAS.PVP) IS NOT NULL THEN coalesce(sum(LB_VENTAS.COSTE),0)-coalesce(sum(LB_VENTAS.PVP),0) END AS Margen,
  CASE WHEN sum(LB_VENTAS.PVP)<>0 THEN 1.0*CASE WHEN sum(LB_VENTAS.PVP) IS NOT NULL OR sum(LB_VENTAS.COSTE) IS NOT NULL THEN coalesce(sum(LB_VENTAS.PVP),0)-coalesce(sum(LB_VENTAS.COSTE),0) END/sum(LB_VENTAS.PVP) END AS MargenPct,
  CASE WHEN sum(LB_VENTAS.COSTE)<>0 THEN 1.0*CASE WHEN sum(LB_VENTAS.PVP) IS NOT NULL OR sum(LB_VENTAS.COSTE) IS NOT NULL THEN coalesce(sum(LB_VENTAS.PVP),0)-coalesce(sum(LB_VENTAS.COSTE),0) END/sum(LB_VENTAS.COSTE) END AS [Markup]
FROM dbo.LB_VENTAS
INNER JOIN dbo.LB_TIEMPO ON (LB_VENTAS.FECHA=LB_TIEMPO.FECHA)
INNER JOIN dbo.LB_LIBROS ON (LB_VENTAS.ID_LIBRO=LB_LIBROS.ID_LIBRO)
WHERE LB_TIEMPO.ANYO=2022
GROUP BY LB_LIBROS.TITULO

```
  </b-modal>

  </div>
</div>


## Comentario

El *markup* se calcula dividiendo el margen absoluto entre el coste y no se debe confundir con el *margen de venta** que se calcula dividiéndolo entre el importe de venta.
