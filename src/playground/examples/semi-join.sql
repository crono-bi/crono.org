/*
  SEMI JOIN returns records from the left table
  that have at least one match in the right table.
  Equivalent to EXISTS in standard SQL.
*/

SELECT
  Customer.CustomerId,
  Customer.CustomerName
FROM dwh.DimCustomers Customer
SEMI JOIN dwh.FactSalesOrderHeader USING CustomerSid
