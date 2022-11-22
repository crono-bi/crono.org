SELECT
  CustomerId,
  FirstName,
  LastName,
  OrderDate,
  Amount
FROM (
    SELECT
      CustomerId,
      FirstName,
      LastName,
      OrderDate,
      Amount,
      ROW_NUMBER() OVER (PARTITION BY CustomerId ORDER BY OrderDate DESC) rownumber
    FROM (
        SELECT
          Customer.CustomerId AS CustomerId,
          CustomerPerson.FirstName AS FirstName,
          CustomerPerson.LastName AS LastName,
          SalesOrderHeader.OrderDate AS OrderDate,
          SalesOrderHeader.subtotal AS Amount
        FROM staging.SalesOrderHeader
        INNER JOIN staging.Customer ON (SalesOrderHeader.customerId=Customer.customerId)
        INNER JOIN staging.Person CustomerPerson ON (Customer.PersonID=CustomerPerson.BusinessEntityId)
      ) allRows
  ) allRowsNumbered
WHERE rownumber<=1