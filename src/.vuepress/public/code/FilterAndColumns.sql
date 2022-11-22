SELECT
  Person.BusinessEntityId AS BusinessEntityId,
  Person.PersonType AS PersonType,
  Person.PersonName AS PersonName,
  HomeAddress.AddressLine1 AS HomeAddressLine1,
  HomeAddress.AddressLine2 AS HomeAddressLine2,
  HomeAddress.City AS HomeCity,
  ShippingAddress.AddressLine1 AS ShippingAddressLine1,
  ShippingAddress.AddressLine2 AS ShippingAddressLine2,
  ShippingAddress.City AS ShippingCity
FROM (SELECT BusinessEntityId, PersonType, LastName AS PersonName FROM staging.Person WHERE PersonType='IN') Person
LEFT JOIN (SELECT * FROM staging.BusinessEntityAddress WHERE AddressTypeId=2) BEHomeAddress ON (Person.BusinessEntityId=BEHomeAddress.BusinessEntityId)
LEFT JOIN (SELECT * FROM staging.BusinessEntityAddress WHERE AddressTypeId=5) BEShippingAddress ON (Person.BusinessEntityId=BEShippingAddress.BusinessEntityId)
LEFT JOIN staging.Address HomeAddress ON (BEHomeAddress.AddressId=HomeAddress.AddressId)
LEFT JOIN staging.Address ShippingAddress ON (BEShippingAddress.AddressId=ShippingAddress.AddressId)