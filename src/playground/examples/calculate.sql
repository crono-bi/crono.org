/*
  CALCULATE allows computing aggregations over the entire result
  and using them alongside grouped columns. Ideal for calculating
  percentages over the total.
*/

SELECT
  Product.Name Product,
  sum(SalesOrderDetail.LineTotal) Sales,
  CALCULATE sum(SalesOrderDetail.LineTotal) TotalSales,
  divide(Sales, TotalSales) SalesPct
FROM staging.SalesOrderDetail
INNER JOIN staging.Product USING ProductId
