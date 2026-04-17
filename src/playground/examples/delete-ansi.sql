/*
  Crono SQL also supports standard ANSI syntax
  for DELETE with subqueries. The USING clause simplifies
  JOINs within the subquery.
*/

DELETE
FROM dwh.FactSalesOrderDetails
WHERE SalesOrderSid IN (
  SELECT SalesOrderSid
  FROM dwh.FactSalesOrderHeader
  INNER JOIN dwh.DimCustomers USING FactSalesOrderHeader(CustomerSid)
  WHERE DimCustomers.Customer='Oscar Simmons')
