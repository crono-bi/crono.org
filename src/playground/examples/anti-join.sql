/*
  ANTI JOIN returns records from the left table
  that have NO match in the right table.
  Equivalent to NOT EXISTS in standard SQL.
*/

SELECT
  Customer.CustomerId,
  Customer.CustomerName
FROM dwh.DimCustomers Customer
ANTI JOIN dwh.FactSalesOrderHeader USING CustomerSid
