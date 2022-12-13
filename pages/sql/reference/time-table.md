# Tabla de tiempo

La subconsulta predefinida **TIME_TABLE** permite obtener algunos de los campos habituales de una tabla de tiempo.

``` CronoSqlSample
select *
from time_table
where 
   year between 2000 and year(getdate())
```


Se puede utilizar la subconsulta predefinida **TIME_TABLE** para construir la tabla de tiempo que sea necesaria en cada proyecto.
    
``` CronoSqlSample
select *
from time_table
where 
   year between 2000 and year(getdate())
```
