SELECT count(*) AS expr1
FROM staging.SalesOrderHeader sales
INNER JOIN staging.customer ON (sales.CompanyId=customer.CompanyId AND sales.CustomerId=customer.CustomerId)
LEFT JOIN staging.Person CustomerPerson ON (customer.CompanyId=CustomerPerson.CompanyId AND customer.PersonID=CustomerPerson.BusinessEntityId)
WHERE year(sales.OrderDate)=2012