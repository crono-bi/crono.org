/*
  FILTER allows filtering a FROM table before the JOIN.
  The alias is assigned to the filtered table for use in SELECT.
*/

SELECT
  SalesOrderHeader.OrderDate,
  Product.Name Product,
  Product.ProductNumber,
  sum(Sales.LineTotal) Sales
FROM staging.SalesOrderDetail FILTER (year(ModifiedDate)=2014) Sales
INNER JOIN staging.SalesOrderHeader USING SalesOrderId
INNER JOIN staging.Product USING ProductId
