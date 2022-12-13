
# CHECK SNOWFLAKE

La cláusula **CHECK SNOWFLAKE**, colocada justo después de todos los **JOINs**, verifica que las relaciones no pierden ni duplican ningún registro de la tabla del **FROM**. Se trata de una comprobación fundamental para validar que no estamos cometiendo ninguna equivocación al escribir la consulta y que los datos de origen son coherentes con lo esperado.

``` CronoSqlSample
SELECT
  year(sales.OrderDate) AS OrderYear,
  Customer.CustomerId AS CustomerId,
  concat(CustomerPerson.FirstName,' ',CustomerPerson.LastName) AS Customer,
  CustomerPerson.FirstName AS FirstName,
  CustomerPerson.LastName AS LastName,
  sum(sales.subtotal) AS Amount
FROM staging.SalesOrderHeader sales
INNER JOIN staging.customer USING CustomerId
INNER JOIN staging.Person CustomerPerson USING Customer(PersonID BusinessEntityId)
CHECK SNOWFLAKE
WHERE year(sales.OrderDate)=2012
```


La cláusula **CHECK SNOWFLAKE** verifica que todas las ventas correspondan a un cliente y que ese cliente exista en la tabla de personas. Si no fuera así, la consulta no se ejecutaría y devolvería un error.
