CREATE VIEW dwh.ProductsAnnualSales AS
SELECT
  DimProducts.Product AS Product,
  year(FactSalesOrderHeader.OrderDate) AS OrderYear,
  sum(FactSalesOrderDetails.LineTotal) AS Sales
FROM dwh.FactSalesOrderDetails
INNER JOIN dwh.FactSalesOrderHeader ON (FactSalesOrderDetails.SalesOrderId=FactSalesOrderHeader.SalesOrderId)
INNER JOIN dwh.DimProducts ON (FactSalesOrderDetails.ProductSid=DimProducts.ProductSid)
GROUP BY
  DimProducts.Product,
  year(FactSalesOrderHeader.OrderDate)