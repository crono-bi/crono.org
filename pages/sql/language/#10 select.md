---
sidebarDepth: 2
---




# Sentencia SELECT ❤️

En esta sección se documenta el funcionamiento de la sentencia **SELECT** del lenguaje. La sintaxis **SELECT** de **Crono SQL** aporta algunas ventajas (algunas importantes) frente al SQL ISO. Sin embargo, el mayor beneficio del lenguaje se manifiesta en el resto de instrucciones DML (**INSERT**, **UPDATE**, **MERGE**, …), donde Crono SQL automatiza toda la lógica de carga. Por eso la sentencia **SELECT** es tan importante… ¡Es prácticamente lo único que tendrá que codificar el desarrollador de un proyecto  ETL/DWH!

A continuación se describen sistemáticamente todas las características soportadas en la sentencia **SELECT** del lenguaje **Crono SQL**.



## Basado en el lenguaje SQL 


**Proposición:** Cuualquier sentencia **SELECT** válida en SQL es válida también en **Crono SQL**


``` CronoSqlSample
SELECT 'Hola mundo';
```


Si ninguna tabla participa en la consulta, se debe terminar la sentencia con el carácter punto y coma ";". En cualquier otro caso, el punto y coma es opcional.

``` CronoSqlSample
select *
from staging.Customer
```



Se pueden incluir las cláusulas **JOIN**, **WHERE**, **GROUP BY**, **HAVING** y/o **ORDER BY**

``` CronoSqlSample
SELECT
  Customer.CustomerId AS CustomerId,
  Person.FirstName AS FirstName,
  Person.LastName AS LastName,
  sum(Sales.subtotal) AS Amount
FROM staging.SalesOrderHeader Sales
INNER JOIN staging.Customer ON (Sales.customerId=Customer.customerId)
LEFT JOIN staging.Person ON (Customer.PersonID=Person.BusinessEntityId)
WHERE Person.FirstName='Fernando'
GROUP BY
  Customer.CustomerId,
  Person.FirstName,
  Person.LastName
HAVING sum(Sales.subtotal)>3000
ORDER BY sum(Sales.subtotal) DESC
```



Se pueden utilizar las funciones propias del motor de base de datos o funciones definidas por el usuario.


``` CronoSqlSample
SELECT
  year(sales.OrderDate) AS OrderYear,
  Customer.CustomerId AS CustomerId,
  concat(CustomerPerson.FirstName,' ',CustomerPerson.LastName) AS Customer,
  CustomerPerson.FirstName AS FirstName,
  CustomerPerson.LastName AS LastName,
  sum(sales.subtotal) AS Amount
FROM staging.SalesOrderHeader sales
INNER JOIN staging.customer ON (sales.customerId=customer.customerId)
LEFT JOIN staging.Person CustomerPerson ON (Customer.PersonID=CustomerPerson.BusinessEntityId)
WHERE year(sales.OrderDate)=2012
GROUP BY
  year(sales.OrderDate),
  Customer.CustomerId,
  concat(CustomerPerson.FirstName,' ',CustomerPerson.LastName),
  CustomerPerson.FirstName,
  CustomerPerson.LastName
```


## Referencia a columnas existentes

A diferencia del SQL ISO, en **Crono SQL** se puede hacer referencia a otra columna de la sentencia SELECT mediante el Alias de la columna.



``` CronoSqlSample
SELECT
  year(sales.OrderDate) AS OrderYear,
  Customer.CustomerId AS CustomerId,
  concat(CustomerPerson.FirstName,' ',CustomerPerson.LastName) AS Customer,
  upper(customer) UpperCustomer,
  CustomerPerson.FirstName AS FirstName,
  CustomerPerson.LastName AS LastName,
  sum(sales.subtotal) AS Amount
FROM staging.SalesOrderHeader sales
INNER JOIN staging.customer ON sales.CustomerId=customer.CustomerId
LEFT JOIN staging.Person CustomerPerson ON Customer.PersonID=CustomerPerson.BusinessEntityId
WHERE OrderYear=2012
```


## Prescindiendo del GROUP BY

Se puede utilizar la cláusula **GROUP BY ALL** para indicar que se agrupe por todas las columnas que no sean funciones de agregación. 

``` CronoSqlSample
SELECT
  year(sales.OrderDate) AS OrderYear,
  Customer.CustomerId AS CustomerId,
  concat(CustomerPerson.FirstName,' ',CustomerPerson.LastName) AS Customer,
  CustomerPerson.FirstName AS FirstName,
  CustomerPerson.LastName AS LastName,
  sum(sales.subtotal) AS Amount
FROM staging.SalesOrderHeader sales
INNER JOIN staging.customer ON (sales.customerId=customer.customerId)
LEFT JOIN staging.Person CustomerPerson ON (Customer.PersonID=CustomerPerson.BusinessEntityId)
WHERE year(sales.OrderDate)=2012
GROUP BY ALL
```


Siempre se puede prescindir totalmente de la cláusula **GROUP BY**. **Crono SQL** incluirá las columnas necesarias en el SQL generado.

``` CronoSqlSample
SELECT
  year(sales.OrderDate) AS OrderYear,
  Customer.CustomerId AS CustomerId,
  concat(CustomerPerson.FirstName,' ',CustomerPerson.LastName) AS Customer,
  CustomerPerson.FirstName AS FirstName,
  CustomerPerson.LastName AS LastName,
  sum(sales.subtotal) AS Amount
FROM staging.SalesOrderHeader sales
INNER JOIN staging.customer ON (sales.customerId=customer.customerId)
LEFT JOIN staging.Person CustomerPerson ON (Customer.PersonID=CustomerPerson.BusinessEntityId)
WHERE year(sales.OrderDate)=2012
```


## USING

Se puede utilizar la cláusula **USING**  para simplificar la sintaxis de los JOIN equi-join.

``` CronoSqlSample
SELECT
  year(sales.OrderDate) AS OrderYear,
  Customer.CustomerId AS CustomerId,
  concat(CustomerPerson.FirstName,' ',CustomerPerson.LastName) AS Customer,
  CustomerPerson.FirstName AS FirstName,
  CustomerPerson.LastName AS LastName,
  sum(sales.subtotal) AS Amount
FROM staging.SalesOrderHeader sales
INNER JOIN staging.customer USING Sales(CustomerId)
LEFT JOIN staging.Person CustomerPerson ON (Customer.PersonID=CustomerPerson.BusinessEntityId)
WHERE year(sales.OrderDate)=2012
```


La cláusula **USING** también puede utilizarse cuando los campos de la equi-join tienen distinto nombre.

``` CronoSqlSample
SELECT
  year(sales.OrderDate) AS OrderYear,
  Customer.CustomerId AS CustomerId,
  concat(CustomerPerson.FirstName,' ',CustomerPerson.LastName) AS Customer,
  CustomerPerson.FirstName AS FirstName,
  CustomerPerson.LastName AS LastName,
  sum(sales.subtotal) AS Amount
FROM staging.SalesOrderHeader sales
INNER JOIN staging.customer USING Sales(CustomerId)
LEFT JOIN staging.Person CustomerPerson USING Customer(PersonID BusinessEntityId)
WHERE year(sales.OrderDate)=2012
```


Si no se especifica el nombre de la tabla izquierda en la cláusula **USING**, se asume que es la tabla del **FROM** es la que participa en la relación. 

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
LEFT JOIN staging.Person CustomerPerson USING Customer(PersonID BusinessEntityId)
WHERE year(sales.OrderDate)=2012
```


Si la relación equi-join está formada por distintos campos, se pueden especificar en la cláusula **USING** separados por comas.

``` CronoSqlSample
SELECT count(*)
FROM staging.SalesOrderHeader sales
INNER JOIN staging.customer USING (CompanyId,CustomerId)
LEFT JOIN staging.Person CustomerPerson USING customer(CompanyId,PersonID BusinessEntityId)
WHERE year(sales.OrderDate)=2012
```


## CHECK SNOWFLAKE

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

   

## Subconsultas

Se pueden incluir subconsultas.

``` CronoSqlSample
SELECT 
  Person.BusinessEntityId,
  Person.LastName,
  HomeAddress.AddressLine1 HomeAddressLine1,
  HomeAddress.AddressLine2 HomeAddressLine2,
  HomeAddress.City HomeCity,
  ShippingAddress.AddressLine1 ShippingAddressLine1,
  ShippingAddress.AddressLine2 ShippingAddressLine2,
  ShippingAddress.City ShippingCity
FROM staging.Person
LEFT JOIN (
  select * from staging.BusinessEntityAddress 
  where AddressTypeId=2) BEHomeAddress using BusinessEntityId
LEFT JOIN (
  select * from staging.BusinessEntityAddress 
  where AddressTypeId=5) BEShippingAddress using BusinessEntityId
LEFT JOIN staging.Address HomeAddress using BEHomeAddress(AddressId)
LEFT JOIN staging.Address ShippingAddress using BEShippingAddress(AddressId)
```


## Subconsultas con FILTER y COLUMNS

Después del nombre de la tabla, se puede incluir la cláusula **FILTER** para seleccionar solo una parte de los registros de la tabla. El código SQL generado incluirá una subconsulta similar a la del Ejemplo anterior.

``` CronoSqlSample
SELECT 
  Person.BusinessEntityId,
  Person.PersonType,
  Person.LastName,
  HomeAddress.AddressLine1	HomeAddressLine1,
  HomeAddress.AddressLine2	HomeAddressLine2,
  HomeAddress.City		HomeCity,
  ShippingAddress.AddressLine1	ShippingAddressLine1,
  ShippingAddress.AddressLine2	ShippingAddressLine2,
  ShippingAddress.City		ShippingCity
FROM staging.Person
LEFT JOIN staging.BusinessEntityAddress FILTER (AddressTypeId=2) BEHomeAddress using BusinessEntityId
LEFT JOIN staging.BusinessEntityAddress FILTER (AddressTypeId=5) BEShippingAddress using BusinessEntityId
LEFT JOIN staging.Address HomeAddress using BEHomeAddress(AddressId)
LEFT JOIN staging.Address ShippingAddress using BEShippingAddress(AddressId)
```



La cláusula **FILTER** es muy útil en combinación con la cláusula **CHECK SNOWFLAKE**. En el siguiente ejemplo, se verifica que cada persona tenga una única *HomeAddress* (o ninguna) y una única *ShippingAddress* (o ninguna). Si no fuera así, la consulta no duplicaría los registros  porque devolvería previamente un error. 

``` CronoSqlSample
SELECT 
  Person.BusinessEntityId,
  Person.PersonType,
  Person.LastName,
  HomeAddress.AddressLine1	HomeAddressLine1,
  HomeAddress.AddressLine2	HomeAddressLine2,
  HomeAddress.City		HomeCity,
  ShippingAddress.AddressLine1	ShippingAddressLine1,
  ShippingAddress.AddressLine2	ShippingAddressLine2,
  ShippingAddress.City		ShippingCity
FROM staging.Person
LEFT JOIN staging.BusinessEntityAddress FILTER (AddressTypeId=2) BEHomeAddress using BusinessEntityId
LEFT JOIN staging.BusinessEntityAddress FILTER (AddressTypeId=5) BEShippingAddress using BusinessEntityId
LEFT JOIN staging.Address HomeAddress using BEHomeAddress(AddressId)
LEFT JOIN staging.Address ShippingAddress using BEShippingAddress(AddressId)
CHECK SNOWFLAKE
```



Se puede utilizar la cláusula **COLUMNS** para seleccionar, renombrar, u operar sobre las columnas físicas de la tabla. El código SQL generado incluirá una subconsulta con esas columnas.
    
``` CronoSqlSample
SELECT 
  Person.BusinessEntityId,
  Person.PersonType,
  Person.PersonName,
  HomeAddress.AddressLine1	HomeAddressLine1,
  HomeAddress.AddressLine2	HomeAddressLine2,
  HomeAddress.City			HomeCity,
  ShippingAddress.AddressLine1	ShippingAddressLine1,
  ShippingAddress.AddressLine2	ShippingAddressLine2,
  ShippingAddress.City			ShippingCity
FROM staging.Person COLUMNS (BusinessEntityId,PersonType,LastName PersonName) FILTER (PersonType='IN')
LEFT JOIN staging.BusinessEntityAddress FILTER (AddressTypeId=2) BEHomeAddress using BusinessEntityId
LEFT JOIN staging.BusinessEntityAddress FILTER (AddressTypeId=5) BEShippingAddress using BusinessEntityId
LEFT JOIN staging.Address HomeAddress using BEHomeAddress(AddressId)
LEFT JOIN staging.Address ShippingAddress using BEShippingAddress(AddressId)
```



## ANTI JOIN

El lenguaje **Crono SQL** soporta todos los *joins* habituales:

- **INNER JOIN**
- **LEFT JOIN**
- **RIGHT JOIN**
- **FULL JOIN**
- **CROSS JOIN** (también **CROSS APPLY**)

Además, implementa el **ANTI JOIN**. Un **ANTI JOIN** devuelve todos los registros de la izquierda que no aparecen en la parte derecha de la relación. Para ello, el SQL generado incluye un predicado **NOT EXISTS IN (…)**

La  siguiente consulta devuelve todos los clientes que no tienen ninguna venta.  Puede ampliar la información sobre los **ANTI JOIN** en [el blog de SQL Server de Dale Burnett](http://daleburnett.com/2011/10/semi-joins-and-anti-joins/).

``` CronoSqlSample
select *
FROM staging.customer 
ANTI JOIN staging.SalesOrderHeader sales using customerId
```
    

El **ANTI JOIN** se puede combinar con el resto de características del lenguaje.  

Esta consulta devuelve todos las personas que no tienen Home Address.

``` CronoSqlSample
select *
FROM staging.Person
ANTI JOIN staging.BusinessEntityAddress FILTER (AddressTypeId=2) BEHomeAddress using BusinessEntityId
```


## SEMI JOIN

El lenguaje **Crono SQL** implementa también la relación **SEMI JOIN**. Un **SEMI JOIN** devuelve todos los registros de la izquierda que aparecen en la parte derecha de la relación. Para ello, el SQL generado incluye un predicado **EXISTS IN (…)**, por lo que a diferencia del **INNER JOIN** no duplica los registros en el resultado.

Esta consulta devuelve todos los clientes que tienen alguna venta (sin duplicados). Puede ampliar la información sobre los **SEMI JOIN** en [el blog de SQL Server de Dale Burnett](http://daleburnett.com/2011/10/semi-joins-and-anti-joins/).
     

``` CronoSqlSample
select *
FROM staging.customer 
SEMI JOIN staging.SalesOrderHeader sales using customerId
```


## UNPIVOT

Se puede utilizar el operador **UNPIVOT** (según la [sintaxis de T-SQL](https://technet.microsoft.com/es-es/library/ms177410(v=sql.105).aspx)) para despivotar las columnas de una tabla.

En este ejemplo, las columna *“AddressLine1”*  y *“AddressLine2”* se han convertido en filas diferenciadas, duplicándose los registros.

``` CronoSqlSample
SELECT
  AddressId,
  AddressItem,
  content
FROM staging.Address
UNPIVOT (content FOR AddressItem in (AddressLine1,AddressLine2)) as unpvt
```


## ORDER BY

Se puede utilizar la cláusula **ORDER BY** para forzar la ordenación del resultado.


``` CronoSqlSample
SELECT
  year(sales.OrderDate) AS OrderYear,
  month(sales.OrderDate) as OrderMonth,
  sum(sales.subtotal) AS Amount
FROM staging.SalesOrderHeader sales
ORDER BY OrderYear, OrderMonth
```

    
    
El **ORDER BY** se puede escribir haciendo referencia a la posición de las columnas. 
    

``` CronoSqlSample
SELECT
  year(sales.OrderDate) AS OrderYear,
  month(sales.OrderDate) as OrderMonth,
  sum(sales.subtotal) AS Amount
FROM staging.SalesOrderHeader sales
ORDER BY 1,2
```


## SELECT DISTINCT

Se puede utilizar la palabra clave **DISTINCT** para obtener los valores distintos
    
    
``` CronoSqlSample
SELECT DISTINCT FirstName
FROM staging.Person
```



## SELECT TOP

Se puede utilizar la palabra clave **TOP** para limitar el número de registros del resultado.

Esta consulta devuelve los 5 clientes con mayores ventas. 

``` CronoSqlSample
SELECT TOP 5
  SalesTerritory.Name Territory,
  Customer.CustomerId,
  CustomerPerson.FirstName,
  CustomerPerson.LastName,
  sum(sales.subtotal) Amount			 
FROM staging.SalesOrderHeader sales
INNER JOIN staging.customer USING sales(customerId)
INNER JOIN staging.SalesTerritory USING TerritoryId
LEFT JOIN staging.Person CustomerPerson USING Customer(PersonID BusinessEntityId)
ORDER BY Amount DESC
```



## OVER ()

Las funciones de ventana **OVER (…)** también están soportadas. 

Esta consulta devuelve las ventas acumuladas desde el principio de cada año. La funciones de ventana, también llamadas funciones analíticas, tienen mucha utilidad en entornos ETL/DWH y permiten simplificar el desarrollo de muchos escenarios ETL comunes.  Puede ampliar la información sobre las funciones de ventana en la documentación de la [cláusula **OVER** en T-SQL](https://msdn.microsoft.com/es-es/library/ms189461.aspx).

``` CronoSqlSample
SELECT
  year(sales.OrderDate) AS OrderYear,
  month(sales.OrderDate) as OrderMonth,
  sum(sales.subtotal) AS Amount,
  sum(Amount) over (partition by OrderYear order by OrderMonth)  AmountYTD
FROM staging.SalesOrderHeader sales
ORDER BY OrderYear, OrderMonth
```



## TOP OVER ()

Se puede incluir la cláusula **OVER** junto a la palabra clave **TOP** para limitar el número de registros por grupos de registros.

Esta consulta devuelve los tres clientes con más ventas en cada territorio.


``` CronoSqlSample
SELECT TOP 3 OVER (PARTITION BY Territory ORDER BY Amount DESC)  
  SalesTerritory.Name Territory,
  Customer.CustomerId,
  CustomerPerson.FirstName,
  CustomerPerson.LastName,
  sum(sales.subtotal) Amount			 
FROM staging.SalesOrderHeader sales
INNER JOIN staging.customer USING sales(customerId)
INNER JOIN staging.SalesTerritory USING TerritoryId
INNER JOIN staging.Person CustomerPerson USING Customer(PersonID BusinessEntityId)
```


La combinación **TOP n OVER ()** tiene muchos usos en procesos ETL/DWH. La sentencia SQL generada es un consulta sobre una subconsulta de una subconsulta. La siguiente consulta devuelve la última venta de cada cliente.


``` CronoSqlSample
SELECT TOP 1 OVER (PARTITION BY customerId ORDER BY orderDate desc)
  Customer.CustomerId,
  CustomerPerson.FirstName,
  CustomerPerson.LastName,
  SalesOrderHeader.OrderDate,
  SalesOrderHeader.subtotal Amount
FROM staging.SalesOrderHeader 
INNER JOIN staging.Customer USING customerId
INNER JOIN staging.Person CustomerPerson USING Customer(PersonID BusinessEntityId)
```





## WITH

Las [sentencias CTE](https://msdn.microsoft.com/es-es/library/ms175972.aspx) con cláusula **WITH** están soportadas.

``` CronoSqlSample
WITH addresses AS (
  SELECT bia.BusinessEntityID,bia.AddressTypeId,CountryRegion.Name Region,Address.AddressLine1,Address.City
  FROM staging.BusinessEntityAddress bia
  INNER JOIN staging.Address using AddressId
  INNER JOIN staging.StateProvince USING Address(StateProvinceId)
  INNER JOIN staging.CountryRegion USING StateProvince(CountryRegionCode)
) 
SELECT 
  Person.FirstName,
  Person.LastName,
  HomeAddress.AddressLine1 HomeAddressLine1,
  HomeAddress.City HomeCity,
  HomeAddress.Region HomeRegion,
  ShippingAddress.AddressLine1 ShippingAddressLine1,
  ShippingAddress.City ShippingCity ,
  ShippingAddress.Region ShippingRegion ,
FROM staging.Person 
LEFT JOIN addresses FILTER (AddressTypeId=2) HomeAddress USING BusinessEntityID
LEFT JOIN addresses FILTER (AddressTypeId=5) ShippingAddress USING BusinessEntityID
```



## UNION y UNION ALL

Se pueden utilizar los operadores **UNION** y **UNION ALL**

Este ejemplo tiene únicamente fines didácticos. Para combinar de este modo dos o más consultas es preferible el operador **COMBINE** que se muestra continuación.


``` CronoSqlSample
SELECT
  CustomerPerson.LastName AS LastName,
  sum(sales.subtotal) AS Amount2012,
  null Amount2013
FROM staging.SalesOrderHeader sales
INNER JOIN staging.customer ON (sales.customerId=customer.customerId)
LEFT JOIN staging.Person CustomerPerson ON (Customer.PersonID=CustomerPerson.BusinessEntityId)
WHERE year(sales.OrderDate)=2012
UNION 
  SELECT
    CustomerPerson.LastName AS LastName,
    null Amount2012,
    sum(sales.subtotal) AS Amount2013
  FROM staging.SalesOrderHeader sales
  INNER JOIN staging.customer ON (sales.customerId=customer.customerId)
  LEFT JOIN staging.Person CustomerPerson ON (Customer.PersonID=CustomerPerson.BusinessEntityId)
  WHERE year(sales.OrderDate)=2013
```


## COMBINE


El operador **COMBINE BY** permite combinar dos o más consultas en un único resultado.

    
``` CronoSqlSample
COMBINE BY firstname,LastName
  sales2012 AS (
    SELECT
      Person.FirstName AS FirstName,
      Person.LastName AS LastName,
      sum(sales.subtotal) AS Amount2012
    FROM staging.SalesOrderHeader sales
    INNER JOIN staging.customer USING customerId
    LEFT JOIN staging.Person USING Customer(PersonID BusinessEntityId)
    WHERE year(sales.OrderDate)=2012),
  sales2013 AS ( 
    SELECT
      Person.FirstName AS FirstName,
      Person.LastName AS LastName,
      sum(sales.subtotal) AS Amount2013
    FROM staging.SalesOrderHeader sales
    INNER JOIN staging.customer USING customerId
    LEFT JOIN staging.Person USING Customer(PersonID BusinessEntityId)
    WHERE year(sales.OrderDate)=2013)
```
    

Se pueden utilizar tablas distintas en cada consulta del **COMBINE**. En este ejemplo, se comparan las ventas y las compras por producto. El SQL generado combinará los resultados utilizando un **FULL JOIN**.

``` CronoSqlSample
COMBINE BY Product,ProductNumber
  sales (
	select 
	  Product.Name Product,
	  Product.ProductNumber ProductNumber,
	  sum(PurchaseOrderDetail.LineTotal) Purchases
	from staging.PurchaseOrderDetail
	inner join staging.Product  using ProductId
  ),
  purchases (
	select 
	  Product.Name #Product,
	  Product.ProductNumber #ProductNumber,
	  sum(SalesOrderDetail.LineTotal) Sales
	from staging.SalesOrderDetail
	inner join staging.Product  using ProductId
  )
```


## MATERIALIZE

La cláusula **MATERIALIZE** permite crear una tabla temporal con el contenido de una subconsulta. Es decir, antes de la ejecución de la consulta, se crean las tablas temporales necesarias y finalmente se ejecuta la consulta utilizando dichas tablas. Esta estrategia de carga simplifica el plan de ejecución del motor de base de datos y se pueden obtener mejoras de rendimiento muy significativas, sin penalizar o dificultar la escritura de la consulta.

``` CronoSqlSample
SELECT
  SalesOrderHeader.OrderDate,
  Product.Name Product,
  Product.ProductNumber,
  sum(Sales.LineTotal) Sales
FROM staging.SalesOrderDetail FILTER (year(ModifiedDate)=2014) MATERIALIZE Sales
INNER JOIN staging.SalesOrderHeader USING SalesOrderId
INNER JOIN staging.Product USING ProductId
```



Con la cláusula **MATERIALIZE**, también se pueden materializar las consultas de una sentencia **COMBINE**. En este ejemplo, primero se ejecutará la consulta con las ventas, luego se ejecutará una consulta con las compras, y finalmente se combinarán en un único resultado.


``` CronoSqlSample
COMBINE bY Product,productNumber
  MATERIALIZE sales (
	select 
	  Product.Name Product,
	  Product.ProductNumber ProductNumber,
	  sum(PurchaseOrderDetail.LineTotal) Purchases
	from staging.PurchaseOrderDetail
	inner join staging.Product  using ProductId
  ),
  MATERIALIZE purchases (
	select 
	  Product.Name Product,
	  Product.ProductNumber ProductNumber,
	  sum(SalesOrderDetail.LineTotal) Sales
	from staging.SalesOrderDetail
	inner join staging.Product  using ProductId
  )
```


## CAST automático

Se puede forzar el tipo de datos resultante de una columna especificándolo justo después del alias de la columna. El SQL generado incluirá una llamada a la función **CAST**.

``` CronoSqlSample
SELECT
   year(sales.OrderDate)	OrderYear varchar(4),
  Customer.CustomerId,
  concat(CustomerPerson.FirstName,' ',CustomerPerson.LastName) AS Customer,
  Upper(customer) UpperCustomer,
  CustomerPerson.FirstName,
  CustomerPerson.LastName,
  sum(sales.subtotal) AS Amount,
  count(*)		TicketsCount,
  Amount/TicketsCount AvgTicket numeric(12,2)
FROM staging.SalesOrderHeader sales
INNER JOIN staging.customer USING CustomerId
LEFT JOIN staging.Person CustomerPerson USING Customer(PersonID BusinessEntityId)
WHERE OrderYear=2012
```


## SELECTs anidados

Es posible incluir varios **SELECT** en una misma consulta. Esta sintaxis permite escribir rápidamente una consulta sobre el resultado de otra consulta.  Son consultas encadenadas.

Este consulta devuelve la media de las ventas anuales de cada producto.


``` CronoSqlSample
select
  Product,
  ProductNumber,
  avg(Sales) AvgYearSales
select 
  Product.Name Product,
  Product.ProductNumber,
  year(OrderDate) OrderYear,
  sum(SalesOrderDetail.LineTotal) Sales
from staging.SalesOrderDetail
inner join staging.SalesOrderHeader using SalesOrderId
inner join staging.Product  using ProductId
```



La cláusulas **SELECT** encadenadas permiten, por ejemplo, contar el número de registros que devuelve una consulta previa. La siguiente consulta ejecuta un **count(\*)** sobre el resultado de la consulta inferior.


``` CronoSqlSample
SELECT count(*)
SELECT
  Product.Name Product,
  Product.ProductNumber,
  sum(SalesOrderDetail.LineTotal) Sales
FROM staging.SalesOrderDetail
INNER JOIN staging.Product USING ProductId
```


## Resumen

En resumen, si se conoce SQL, ya se conoce la parte más importante de **Crono SQL**. **Crono SQL**, simplemente, facilita la escritura de SQL y aporta algunas extensiones para necesidades comunes en ETL/DWH. Destacamos:

- Posibilidad de referenciar a Alias de columnas de la consulta
- No es necesario el **GROUP BY**
- Sintaxis simplificada de los **JOIN**
- Sentencia **COMBINE**
- Cláusula **MATERIALIZE**
- Cláusula **CHECK SNOWFLAKE**
- Cláusulas **COLUMNS** y **FILTER** para reducir el número de subconsultas
- Cláusula **TOP OVER**
- Relaciones **ANTI JOIN** y **SEMI JOIN**
- **SELECTs** anidados
 
 




















