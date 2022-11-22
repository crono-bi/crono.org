IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_SCHEMA='dbo' AND ROUTINE_NAME='ProductSales' AND ROUTINE_TYPE='FUNCTION')
DROP FUNCTION dbo.ProductSales;

CREATE FUNCTION dbo.ProductSales(@ProductId int) RETURNS TABLE AS
RETURN (
  SELECT
    year(FactSalesOrderHeader.OrderDate) AS OrderYear,
    sum(FactSalesOrderDetails.LineTotal) AS Sales
  FROM dwh.FactSalesOrderDetails
  INNER JOIN dwh.FactSalesOrderHeader ON (FactSalesOrderDetails.SalesOrderId=FactSalesOrderHeader.SalesOrderId)
  INNER JOIN dwh.DimProducts ON (FactSalesOrderDetails.ProductSid=DimProducts.ProductSid)
  WHERE DimProducts.ProductId=@ProductId
  GROUP BY year(FactSalesOrderHeader.OrderDate)
)