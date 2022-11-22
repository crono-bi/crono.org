DELETE FROM dwh.FactSalesOrderDetails WHERE EXISTS (SELECT *
FROM dwh.FactSalesOrderHeader cab
INNER JOIN dwh.DimCustomers ON (cab.CustomerSid=DimCustomers.CustomerSid)
WHERE
  DimCustomers.Customer='Oscar Simmons'
  AND FactSalesOrderDetails.SalesOrderSid=cab.SalesOrderSid
);