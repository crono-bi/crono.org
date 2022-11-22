;WITH
query AS (
  SELECT
    det.SalesOrderDetailSid AS SalesOrderDetailSid,
    det.SalesOrderId AS SalesOrderId,
    det.SalesOrderDetailsId AS SalesOrderDetailsId
  FROM dwh.FactSalesOrderDetails det
  INNER JOIN dwh.FactSalesOrderHeader ON (det.SalesOrderSid=FactSalesOrderHeader.SalesOrderSid)
  INNER JOIN dwh.DimCustomers ON (FactSalesOrderHeader.CustomerSid=DimCustomers.CustomerSid)
  WHERE DimCustomers.Customer='Jada Morris'
)
DELETE FROM dwh.FactSalesOrderDetails
WHERE
  EXISTS (SELECT 1 FROM query WHERE FactSalesOrderDetails.SalesOrderDetailSid=query.SalesOrderDetailSid);