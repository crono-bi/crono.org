SELECT
  coalesce(sales2012.firstname,sales2013.firstname) firstname,
  coalesce(sales2012.LastName,sales2013.LastName) LastName,
  sales2012.Amount2012 Amount2012,
  sales2013.Amount2013 Amount2013
FROM 
    (SELECT
      Person.FirstName AS FirstName,
      Person.LastName AS LastName,
      sum(sales.subtotal) AS Amount2012
    FROM staging.SalesOrderHeader sales
    INNER JOIN staging.customer ON (sales.customerId=customer.customerId)
    LEFT JOIN staging.Person ON (Customer.PersonID=Person.BusinessEntityId)
    WHERE year(sales.OrderDate)=2012
    GROUP BY
      Person.FirstName,
      Person.LastName) sales2012
FULL JOIN 
    (SELECT
      Person.FirstName AS FirstName,
      Person.LastName AS LastName,
      sum(sales.subtotal) AS Amount2013
    FROM staging.SalesOrderHeader sales
    INNER JOIN staging.customer ON (sales.customerId=customer.customerId)
    LEFT JOIN staging.Person ON (Customer.PersonID=Person.BusinessEntityId)
    WHERE year(sales.OrderDate)=2013
    GROUP BY
      Person.FirstName,
      Person.LastName) AS sales2013 ON (sales2012.firstname=sales2013.firstname AND sales2012.LastName=sales2013.LastName)