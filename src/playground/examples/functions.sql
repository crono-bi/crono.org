/*
  Crono SQL adds its own functions like margin(), markup(),
  substraction() and divide(). These functions generate safe
  SQL code that handles division by zero.
*/

SELECT
  LB_LIBROS.TITULO AS [Título],
  sum(LB_VENTAS.PVP) AS Importe,
  sum(LB_VENTAS.COSTE) AS Coste,
  substraction(Importe, Coste) Margen,
  margin(Importe, Coste) MargenPct,
  markup(Importe, Coste) MarkupPct,
  divide(Importe, Coste) Ratio
FROM dbo.LB_VENTAS
INNER JOIN dbo.LB_LIBROS ON (LB_VENTAS.ID_LIBRO=LB_LIBROS.ID_LIBRO)
GROUP BY LB_LIBROS.TITULO
