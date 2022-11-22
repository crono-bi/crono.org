SELECT
  Territory,
  CustomerId,
  FirstName,
  LastName,
  Amount
FROM (
    SELECT
      Territory,
      CustomerId,
      FirstName,
      LastName,
      Amount,
      ROW_NUMBER() OVER (PARTITION BY Territory ORDER BY Amount DESC) rownumber
    FROM (
        SELECT
          SalesTerritory.Name AS Territory,
          Customer.CustomerId AS CustomerId,
          CustomerPerson.FirstName AS FirstName,
          CustomerPerson.LastName AS LastName,
          sum(sales.subtotal) AS Amount
        FROM staging.SalesOrderHeader sales
        INNER JOIN staging.customer ON (sales.customerId=customer.customerId)
        INNER JOIN staging.SalesTerritory ON (sales.TerritoryId=SalesTerritory.TerritoryId)
        INNER JOIN staging.Person CustomerPerson ON (Customer.PersonID=CustomerPerson.BusinessEntityId)
        GROUP BY
          SalesTerritory.Name,
          Customer.CustomerId,
          CustomerPerson.FirstName,
          CustomerPerson.LastName
      ) allRows
  ) allRowsNumbered
WHERE rownumber<=3