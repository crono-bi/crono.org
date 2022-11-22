-- Materialized query: Sales
SELECT *
INTO #Sales__39872
FROM
  (SELECT *
   FROM staging.SalesOrderDetail
   WHERE year(ModifiedDate)=2014) a



SELECT
  SalesOrderHeader.OrderDate AS OrderDate,
  Product.Name AS Product,
  Product.ProductNumber AS ProductNumber,
  sum(Sales.LineTotal) AS Sales
FROM #Sales__39872 Sales
INNER JOIN staging.SalesOrderHeader ON (Sales.SalesOrderId=SalesOrderHeader.SalesOrderId)
INNER JOIN staging.Product ON (Sales.ProductId=Product.ProductId)
GROUP BY
  SalesOrderHeader.OrderDate,
  Product.Name,
  Product.ProductNumber