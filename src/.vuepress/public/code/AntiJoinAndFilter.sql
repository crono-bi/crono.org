SELECT *
FROM staging.Person
WHERE NOT EXISTS (SELECT 1 FROM (SELECT * FROM staging.BusinessEntityAddress WHERE AddressTypeId=2) BEHomeAddress WHERE Person.BusinessEntityId=BEHomeAddress.BusinessEntityId)