SELECT
  cast(year(sales.OrderDate) AS varchar(4)) AS OrderYear,
  Customer.CustomerId AS CustomerId,
  concat(CustomerPerson.FirstName,' ',CustomerPerson.LastName) AS Customer,
  Upper(concat(CustomerPerson.FirstName,' ',CustomerPerson.LastName)) AS UpperCustomer,
  CustomerPerson.FirstName AS FirstName,
  CustomerPerson.LastName AS LastName,
  sum(sales.subtotal) AS Amount,
  count(*) AS TicketsCount,
  cast(sum(sales.subtotal)/count(*) AS numeric(12,2)) AS AvgTicket
FROM staging.SalesOrderHeader sales
INNER JOIN staging.customer ON (sales.CustomerId=customer.CustomerId)
LEFT JOIN staging.Person CustomerPerson ON (Customer.PersonID=CustomerPerson.BusinessEntityId)
WHERE year(sales.OrderDate)=2012
GROUP BY
  year(sales.OrderDate),
  Customer.CustomerId,
  concat(CustomerPerson.FirstName,' ',CustomerPerson.LastName),
  Upper(concat(CustomerPerson.FirstName,' ',CustomerPerson.LastName)),
  CustomerPerson.FirstName,
  CustomerPerson.LastName