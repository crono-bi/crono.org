IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='dwh' AND TABLE_NAME='CopiaDeCustomers' AND TABLE_TYPE='BASE TABLE')
DROP TABLE dwh.CopiaDeCustomers


SELECT
  Customer.CustomerId AS CustomerId,
  concat(CustomerPerson.FirstName,' ',CustomerPerson.LastName) AS Customer,
  customer.AccountNumber AS AccountNumber,
  CustomerPerson.FirstName AS FirstName,
  CustomerPerson.MiddleName AS MiddleName,
  CustomerPerson.LastName AS LastName,
  CustomerCountry.Name AS CustomerAddressCountry,
  CustomerProvince.Name AS CustomerProvince,
  CustomerTerritory.Name AS Name
INTO dwh.CopiaDeCustomers
FROM staging.customer
INNER JOIN staging.SalesTerritory CustomerTerritory ON (Customer.TerritoryId=CustomerTerritory.TerritoryId)
INNER JOIN staging.CountryRegion SalesCountry ON (CustomerTerritory.CountryRegionCode=SalesCountry.CountryRegionCode)
LEFT JOIN staging.Person CustomerPerson ON (Customer.PersonID=CustomerPerson.BusinessEntityId)
LEFT JOIN (SELECT * FROM staging.BusinessEntityAddress WHERE AddressTypeid=2) BusinessEntityAddress ON (Customer.PersonID=BusinessEntityAddress.BusinessEntityId)
LEFT JOIN staging.Address CustomerAddress ON (BusinessEntityAddress.AddressId=CustomerAddress.AddressId)
LEFT JOIN staging.StateProvince CustomerProvince ON (CustomerAddress.StateProvinceId=CustomerProvince.StateProvinceId)
LEFT JOIN staging.CountryRegion CustomerCountry ON (CustomerProvince.CountryRegionCode=CustomerCountry.CountryRegionCode)