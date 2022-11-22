SELECT
  Person.BusinessEntityID AS BusinessEntityID,
  Person.PersonType AS PersonType,
  PersonType.PersonTypeDescription AS PersonTypeDescription,
  Person.FirstName AS FirstName,
  Person.MiddleName AS MiddleName
FROM staging.Person
LEFT JOIN (SELECT 'SC' AS PersonType,'Store Contact' AS PersonTypeDescription
           UNION SELECT 'IN','Individual (retail) customer'
           UNION SELECT 'SP','Sales person'
           UNION SELECT 'EM','Employee (non-sales)'
           UNION SELECT 'VC','Vendor contact'
           UNION SELECT 'GC','General contact') PersonType ON Person.PersonType=PersonType.PersonType