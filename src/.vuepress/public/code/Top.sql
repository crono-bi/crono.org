SELECT TOP 5
  SalesTerritory.Name AS Territory,
  Customer.CustomerId AS CustomerId,
  CustomerPerson.FirstName AS FirstName,
  CustomerPerson.LastName AS LastName,
  sum(sales.subtotal) AS Amount
FROM staging.SalesOrderHeader sales
INNER JOIN staging.customer ON (sales.customerId=customer.customerId)
INNER JOIN staging.SalesTerritory ON (sales.TerritoryId=SalesTerritory.TerritoryId)
LEFT JOIN staging.Person CustomerPerson ON (Customer.PersonID=CustomerPerson.BusinessEntityId)
GROUP BY
  SalesTerritory.Name,
  Customer.CustomerId,
  CustomerPerson.FirstName,
  CustomerPerson.LastName
ORDER BY sum(sales.subtotal) DESC