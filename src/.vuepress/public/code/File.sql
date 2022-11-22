SELECT
  Person.BusinessEntityID AS BusinessEntityID,
  Person.PersonType AS PersonType,
  PersonType.PersonTypeDescription AS PersonTypeDescription,
  Person.FirstName AS FirstName,
  Person.MiddleName AS MiddleName
FROM staging.Person
LEFT JOIN (SELECT 'SC' PersonType,'Store Contact' PersonTypeDescription
           UNION ALL SELECT 'IN','Individual (retail) customer'
           UNION ALL SELECT 'SP','Sales person'
           UNION ALL SELECT 'EM','Employee (non-sales)'
           UNION ALL SELECT 'VC','Vendor contact'
           UNION ALL SELECT 'GC','General contact') PersonType ON Person.PersonType=PersonType.PersonType