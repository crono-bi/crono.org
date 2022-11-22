;WITH
query AS (
  SELECT customerSid
  FROM dwh.DimCustomers
  WHERE NOT EXISTS (SELECT 1 FROM dwh.FactSalesOrderHeader WHERE DimCustomers.CustomerSid=FactSalesOrderHeader.CustomerSid)
)
DELETE FROM dwh.DimCustomers
WHERE
  EXISTS (SELECT 1 FROM query WHERE DimCustomers.customerSid=query.customerSid);