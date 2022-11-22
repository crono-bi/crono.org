DELETE FROM dwh.FactSalesOrderDetails WHERE SalesOrderSid IN (
       SELECT SalesOrderSid
       FROM dwh.FactSalesOrderHeader
       INNER JOIN dwh.DimCustomers ON (FactSalesOrderHeader.CustomerSid=DimCustomers.CustomerSid)
       WHERE DimCustomers.Customer='Oscar Simmons'
);