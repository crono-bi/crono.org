/*
  MERGE SOFT DELETE marks as deleted the records
  that no longer exist in the source, without physically deleting them.
  Adds a logical deletion column.
*/

MERGE SOFT DELETE dwh.DimCustomers
SELECT
  CustomerId #CustomerId,
  CustomerName,
  Email
FROM staging.Customers
