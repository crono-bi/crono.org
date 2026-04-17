/*
  CHECK SNOWFLAKE verifies that JOINs don't lose or duplicate
  records from the FROM table. It's placed right after
  the JOINs and before WHERE.
*/

SELECT
  year(sales.OrderDate) AS OrderYear,
  Customer.CustomerId AS CustomerId,
  concat(CustomerPerson.FirstName,' ',CustomerPerson.LastName) AS Customer,
  CustomerPerson.FirstName AS FirstName,
  CustomerPerson.LastName AS LastName,
  sum(sales.subtotal) AS Amount
FROM staging.SalesOrderHeader sales
INNER JOIN staging.customer USING CustomerId
INNER JOIN staging.Person CustomerPerson USING Customer(PersonID BusinessEntityId)
CHECK SNOWFLAKE
WHERE year(sales.OrderDate)=2012
