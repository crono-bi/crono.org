---
title: "FILE"
---

# FILE

Con el operador **FILE**, se puede leer un fichero plano (CSV) del sistema de archivos (o desde una URL) para generar una subconsulta. Se puede utilizar, por ejemplo, para generar un maestro que no existe en la base de datos. El fichero solo se lee en tiempo de compilación. El SQL generado es estático. 


``` sql
SELECT 
  Person.BusinessEntityID, 
  Person.PersonType,
  PersonType.PersonTypeDescription,
  Person.FirstName,
  Person.MiddleName,
FROM staging.Person
LEFT JOIN FILE WITH COLUMN NAMES 'http://bit.ly/2pcuiEe' PersonType USING PersonType
```

  

  <details>
<summary>Ver SQL compilado</summary>

``` sql
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

```

</details>
