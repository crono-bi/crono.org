;WITH
query AS (
  SELECT SalesOrderSid
  FROM dwh.FactSalesOrderHeader
  INNER JOIN dwh.DimCustomers ON (FactSalesOrderHeader.CustomerSid=DimCustomers.CustomerSid)
  WHERE DimCustomers.Customer='Katherine Turner'
)
DELETE FROM dwh.FactSalesOrderDetails
WHERE
  EXISTS (SELECT 1 FROM query WHERE FactSalesOrderDetails.SalesOrderSid=query.SalesOrderSid);