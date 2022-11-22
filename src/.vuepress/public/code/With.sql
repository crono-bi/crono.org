;WITH
addresses AS (
  SELECT
    bia.BusinessEntityID AS BusinessEntityID,
    bia.AddressTypeId AS AddressTypeId,
    CountryRegion.Name AS Region,
    Address.AddressLine1 AS AddressLine1,
    Address.City AS City
  FROM staging.BusinessEntityAddress bia
  INNER JOIN staging.Address ON (bia.AddressId=Address.AddressId)
  INNER JOIN staging.StateProvince ON (Address.StateProvinceId=StateProvince.StateProvinceId)
  INNER JOIN staging.CountryRegion ON (StateProvince.CountryRegionCode=CountryRegion.CountryRegionCode)
)
SELECT
  Person.FirstName AS FirstName,
  Person.LastName AS LastName,
  HomeAddress.AddressLine1 AS HomeAddressLine1,
  HomeAddress.City AS HomeCity,
  HomeAddress.Region AS HomeRegion,
  ShippingAddress.AddressLine1 AS ShippingAddressLine1,
  ShippingAddress.City AS ShippingCity,
  ShippingAddress.Region AS ShippingRegion
FROM staging.Person
LEFT JOIN (SELECT * FROM addresses WHERE AddressTypeId=2) HomeAddress ON (Person.BusinessEntityID=HomeAddress.BusinessEntityID)
LEFT JOIN (SELECT * FROM addresses WHERE AddressTypeId=5) ShippingAddress ON (Person.BusinessEntityID=ShippingAddress.BusinessEntityID)