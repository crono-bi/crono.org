---
title: "ROWS y COLUMNS"
sidebar:
  order: 90
---


Se puede utilizar **ROWS** para generar fácilmente una subconsulta con resultados estáticos. Se puede utilizar, por ejemplo, para generar un maestro que no existe en la base de datos. También existen los  operadores **ROW** y **COLUMN** para generar una única fila o columna.


```crono-sql
SELECT 
  Person.BusinessEntityID, 
  Person.PersonType,
  PersonType.PersonTypeDescription,
  Person.FirstName,
  Person.MiddleName,
FROM staging.Person
LEFT JOIN ROWS (
  ('SC' PersonType, 'Store Contact' PersonTypeDescription)
  ('IN','Individual (retail) customer') 
  ('SP', 'Sales person')
  ('EM', 'Employee (non-sales)')
  ('VC', 'Vendor contact')
  ('GC', 'General contact')
) PersonType USING PersonType
```

  
