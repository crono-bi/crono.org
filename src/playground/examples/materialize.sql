/*
  MATERIALIZE creates a temporary table with the subquery before
  executing the main SELECT, improving performance
  in complex queries.
*/

SELECT
  SalesOrderHeader.OrderDate,
  Product.Name Product,
  Product.ProductNumber,
  sum(Sales.LineTotal) Sales
FROM staging.SalesOrderDetail FILTER (year(ModifiedDate)=2014) MATERIALIZE Sales
INNER JOIN staging.SalesOrderHeader USING SalesOrderId
INNER JOIN staging.Product USING ProductId
