

# FILE

Con el operador **FILE**, se puede leer un fichero plano (CSV) del sistema de archivos (o desde una URL) para generar una subconsulta. Se puede utilizar, por ejemplo, para generar un maestro que no existe en la base de datos. El fichero solo se lee en tiempo de compilación. El SQL generado es estático. 


``` CronoSqlSample
SELECT 
  Person.BusinessEntityID, 
  Person.PersonType,
  PersonType.PersonTypeDescription,
  Person.FirstName,
  Person.MiddleName,
FROM staging.Person
LEFT JOIN FILE WITH COLUMN NAMES 'http://bit.ly/2pcuiEe' PersonType USING PersonType
```
