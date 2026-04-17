/*
  In Crono SQL you can chain multiple SELECTs.
  The result of the second SELECT is used as source
  for the first, creating subqueries naturally.
*/

SELECT
  Product,
  ProductNumber,
  avg(Sales) AvgYearSales
SELECT
  Product.Name Product,
  Product.ProductNumber,
  year(OrderDate) OrderYear,
  sum(SalesOrderDetail.LineTotal) Sales
FROM staging.SalesOrderDetail
INNER JOIN staging.SalesOrderHeader USING SalesOrderId
INNER JOIN staging.Product USING ProductId
