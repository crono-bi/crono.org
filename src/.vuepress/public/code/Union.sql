SELECT
  CustomerPerson.LastName AS LastName,
  sum(sales.subtotal) AS Amount2012,
  null AS Amount2013
FROM staging.SalesOrderHeader sales
INNER JOIN staging.customer ON (sales.customerId=customer.customerId)
LEFT JOIN staging.Person CustomerPerson ON (Customer.PersonID=CustomerPerson.BusinessEntityId)
WHERE year(sales.OrderDate)=2012
GROUP BY CustomerPerson.LastName
UNION
SELECT
  CustomerPerson.LastName AS LastName,
  null AS Amount2012,
  sum(sales.subtotal) AS Amount2013
FROM staging.SalesOrderHeader sales
INNER JOIN staging.customer ON (sales.customerId=customer.customerId)
LEFT JOIN staging.Person CustomerPerson ON (Customer.PersonID=CustomerPerson.BusinessEntityId)
WHERE year(sales.OrderDate)=2013
GROUP BY CustomerPerson.LastName