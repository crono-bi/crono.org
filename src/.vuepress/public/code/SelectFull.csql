SELECT
  Customer.CustomerId AS CustomerId,
  Person.FirstName AS FirstName,
  Person.LastName AS LastName,
  sum(Sales.subtotal) AS Amount
FROM staging.SalesOrderHeader Sales
INNER JOIN staging.Customer ON (Sales.customerId=Customer.customerId)
LEFT JOIN staging.Person ON (Customer.PersonID=Person.BusinessEntityId)
WHERE Person.FirstName='Fernando'
GROUP BY
  Customer.CustomerId,
  Person.FirstName,
  Person.LastName
HAVING sum(Sales.subtotal)&gt;3000
ORDER BY sum(Sales.subtotal) DESC