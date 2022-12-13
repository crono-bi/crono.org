---
sidebarDepth: 2
---

# Sentencias DDL

En artículos anteriores hemos descritos la sintaxis de la sentecia **SELECT** de **Crono SQL** y el resto de sentencias de manipulación de datos (DML):

En este artículo se describe, mediante ejemplos, la sintaxis de:

- **CREATE PROCEDURE**
- **CREATE FUNCTION**
- **CREATE VIEW**
- **CREATE TABLE**
- **CREATE INDEX**
- **CREATE DATABASE**
- **CREATE SCHEMA**

## CREATE PROCEDURE

**Crono SQL** admite la sintaxis estándar de SQL para crear procedimientos almacenados:

``` CronoSqlSample
CREATE PROCEDURE dbo.[cargar productos]
BEGIN
  
  MERGE CLONE dwh.DimProducts(ProductSid)
  SELECT
    #ProductID,
    Product.Name			Product,
    ProductCategory.name 	ProductCategory,
    ProductSubCategory.name ProductSubCategory,
    ProductNumber,
    ProductModel.name 		ProductModel,
    Color,
    StandardCost,
    ListPrice,
    Size,
    SizeUnitMeasureCode,
    Weight
  FROM staging.Product
  LEFT JOIN staging.ProductSubCategory using Product(ProductSubcategoryID)
  LEFT JOIN staging.ProductCategory using ProductSubCategory(ProductCategoryId)
  LEFT JOIN staging.ProductModel using Product(ProductModelID)
  CHECK SNOWFLAKE
  

  PRINT 'Se ha cargado la tabla DimProducts'; 

END
```


El código SQL generado, y sin que el programador tenga que escribir ni configurar nada, apunta en una tabla de log información sobre su ejecución (*fecha de inicio*, *duración*, etc.). De manera predeterminada, todos los procedimientos auditan el resultado de sus ejecuciones en una tabla de logs. **Crono SQL** promociona el uso de buenas prácticas y es una buena práctica mantener un log completo y fiable de todas las ejecuciones. La **estrategia de log** se puede configurar y personalizar a nivel de proyecto.

Por lo tanto, en el ejemplo anterior, la sentencia **PRINT** es innecesaria. De hecho, si el procedimiento tiene una sola instrucción, no es necesario tampoco crear el bloque **BEGIN ... END**. El siguiente código es equivalente    

``` CronoSqlSample
CREATE PROCEDURE dbo.[cargar productos]
MERGE CLONE dwh.DimProducts(ProductSid)
SELECT
  #ProductID,
  Product.Name			Product,
  ProductCategory.name 	ProductCategory,
  ProductSubCategory.name ProductSubCategory,
  ProductNumber,
  ProductModel.name 		ProductModel,
  Color,
  StandardCost,
  ListPrice,
  Size,
  SizeUnitMeasureCode,
  Weight
FROM staging.Product
LEFT JOIN staging.ProductSubCategory using Product(ProductSubcategoryID)
LEFT JOIN staging.ProductCategory using ProductSubCategory(ProductCategoryId)
LEFT JOIN staging.ProductModel using Product(ProductModelID)
CHECK SNOWFLAKE
```


Se puede utilizar la instrucción **CREATE OR REPLACE** (también se admite **CREATE OR ALTER**) para que el mismo código sirva para crear inicialmente el procedimiento o modificarlo si ya existe:

``` CronoSqlSample
CREATE OR ALTER PROCEDURE dbo.[cargar productos]
MERGE CLONE dwh.DimProducts(ProductSid) 
SELECT
  #ProductID,
  Product.Name			Product,
  ProductCategory.name 	ProductCategory,
  ProductSubCategory.name ProductSubCategory,
  ProductNumber,
  ProductModel.name 		ProductModel,
  Color,
  StandardCost,
  ListPrice,
  Size,
  SizeUnitMeasureCode,
  Weight
FROM staging.Product
LEFT JOIN staging.ProductSubCategory using Product(ProductSubcategoryID)
LEFT JOIN staging.ProductCategory using ProductSubCategory(ProductCategoryId)
LEFT JOIN staging.ProductModel using Product(ProductModelID)
CHECK SNOWFLAKE
```


Finalmente, si el procedimiento carga una única tabla (lo que recomendamos), se puede prescindir del nombre del procedimiento. **Crono SQL** escogerá un nombre apropiado sin que el desarrollador tenga que elegir y memorizar uno.  

``` CronoSqlSample
CREATE OR REPLACE PROCEDURE
MERGE CLONE dwh.DimProducts(ProductSid)
SELECT
  #ProductID,
  Product.Name			Product,
  ProductCategory.name 	ProductCategory,
  ProductSubCategory.name ProductSubCategory,
  ProductNumber,
  ProductModel.name 		ProductModel,
  Color,
  StandardCost,
  ListPrice,
  Size,
  SizeUnitMeasureCode,
  Weight
FROM staging.Product
LEFT JOIN staging.ProductSubCategory using Product(ProductSubcategoryID)
LEFT JOIN staging.ProductCategory using ProductSubCategory(ProductCategoryId)
LEFT JOIN staging.ProductModel using Product(ProductModelID)
CHECK SNOWFLAKE
```


Todos los anteriores ejemplos crearán tanto el procedimiento como la tabla *DimProducts*.  Antes de cargar la tabla, se ejecutará la comprobación **CHECK SNOWFLAKE** para asegurar que las relaciones no pierden ni duplican registros. También se informarán los campos de auditoria durante la ejecución de la carga. 

La sintaxis utilizada en el último ejemplo no es excepcional. De hecho, es el caso más normal, el recomendado, y el que puede utilizarse en prácticamente todas las tablas de un Data Warehouse implementado con **Crono SQL**.

**Crono SQL** facilita y promociona el [principio de responsabilidad única (SRP)](https://es.wikipedia.org/wiki/Principio_de_responsabilidad_%C3%BAnica). Por lo tanto, consideramos una buena práctica que cada procedimiento cargue una única tabla. Y que cada tabla se cargue desde un único procedimiento. Y que cada procedimiento tenga una única instrucción, y que esa instrucción sea un **MERGE**. Idealmente, todas las tablas se deberían cargar de este modo.

Para ejecutar un procedimiento, se puede utilizar la sentencia **EXECUTE** (o el sinónimo **EXEC**):

``` CronoSqlSample
EXECUTE dbo.[cargar productos]
```


En el caso de los procedimientos "anónimos" se debe utilizar **EXECUTE LOAD** (o **EXEC LOAD**):

``` CronoSqlSample
EXECUTE LOAD dwh.DimProducts
```


El flujo normal de ejecución de la carga del DWH, se puede crear mediante un procedimiento que llame secuencialmente a la carga de todas las tablas:

``` CronoSqlSample
CREATE OR REPLACE PROCEDURE dwh.cargar
BEGIN

  EXEC LOAD dwh.DimDates @log
  EXEC LOAD dwh.DimEmployees  @log
  EXEC LOAD dwh.DimProducts @log
  EXEC LOAD dwh.DimCustomers @log
  EXEC LOAD dwh.FactSalesOrderHeader @log 
  EXEC LOAD dwh.FactSalesOrderDetails @log

END
```


Y, de este modo, la carga del DWH se ejecutaría llamando a este procedimiento desde el programador de tareas de Windows o mediante el programador propio de la base de datos:

``` CronoSqlSample
EXECUTE dwh.cargar
```


Se puede utilizar **DROP PROCEDURE** para eliminar un procedimiento existente. También se puede utilizar **DROP PROCEDURE IF EXISTS** para eliminar un procedimiento en el caso de que efectivamente exista.

``` CronoSqlSample
DROP PROCEDURE IF EXISTS dwh.cargar
```


## CREATE FUNCTION

La sintaxis para crear una función escalar es la siguiente:

``` CronoSqlSample
CREATE OR REPLACE FUNCTION dbo.MaxValue(@a int,@b int,@c int) RETURNS int
BEGIN

 DECLARE @result int
 
 IF (@a>=@b AND @a>=@b) 
   SET @result=@a
 ELSE BEGIN
   IF @b>=@c
     SET @result=@b
   ELSE
     SET @result=@c
 END
 
 RETURN @result

END
```


También pueden crearse funciones que devuelven tablas de este modo simplificado:

``` CronoSqlSample
CREATE OR REPLACE FUNCTION dbo.ProductSales(@ProductId int) RETURNS TABLE
SELECT 
  year(FactSalesOrderHeader.OrderDate) OrderYear,
  sum(FactSalesOrderDetails.LineTotal) Sales
FROM dwh.FactSalesOrderDetails
INNER JOIN dwh.FactSalesOrderHeader USING SalesOrderId
INNER JOIN dwh.DimProducts USING ProductSid
WHERE DimProducts.ProductId=@ProductId
```


Se puede utilizar **DROP FUNCTION** o **DROP FUNCTION IF EXISTS** para eliminar una función. 

``` CronoSqlSample
DROP FUNCTION IF EXISTS dbo.ProductSales
```


## CREATE VIEW

**Crono SQL** admite la sintaxis estándar para crear vistas:

``` CronoSqlSample
CREATE VIEW dwh.ProductsAnnualSales AS
SELECT  
  DimProducts.Product,
  year(FactSalesOrderHeader.OrderDate) OrderYear,
  sum(FactSalesOrderDetails.LineTotal) Sales
FROM dwh.FactSalesOrderDetails
INNER JOIN dwh.FactSalesOrderHeader USING SalesOrderId
INNER JOIN dwh.DimProducts USING ProductSid
```


Se puede utilizar **CREATE OR ALTER VIEW** o **CREATE OR REPLACE VIEW** para actualizar la vista en el  caso de que ya exista.


``` CronoSqlSample
CREATE OR REPLACE VIEW dwh.ProductsAnnualSales
SELECT  
  DimProducts.Product,
  year(FactSalesOrderHeader.OrderDate) OrderYear,
  sum(FactSalesOrderDetails.LineTotal) Sales
FROM dwh.FactSalesOrderDetails
INNER JOIN dwh.FactSalesOrderHeader USING SalesOrderId
INNER JOIN dwh.DimProducts USING ProductSid
```


Para eliminar una vista existente se puede utilizar **DROP VIEW** o **DROP VIEW IF EXISTS**

``` CronoSqlSample
DROP VIEW IF EXISTS dbo.ProductSales
```


## CREATE TABLE

En general, <u>no es necesario</u> escribir explícitamente el **CREATE TABLE** de las tablas de un data warehouse desarrollado con **Crono SQL**. Las estrategias de carga ya crean implícitamente las tablas y los campos necesarios.

De todos modos, si se prefiere, pueden crearse las tablas utilizando la sintaxis habitual de **CREATE TABLE**.

``` CronoSqlSample
CREATE TABLE dwh.DimCustomers(
  CustomerSid int IDENTITY(1,1),
  CustomerId int NOT NULL,
  Customer nvarchar(101) NOT NULL,
  CustomerType varchar(6) NOT NULL,
  AccountNumber nvarchar(10),
  FirstName nvarchar(50),
  MiddleName nvarchar(50),
  LastName nvarchar(50),
  CustomerAddressCountry nvarchar(50),
  CustomerProvince nvarchar(50),
  Name nvarchar(50),
  CustomerCountry nvarchar(50),
  CONSTRAINT PK_DimCustomers PRIMARY KEY CLUSTERED (CustomerSid),
  CONSTRAINT BK_DimCustomers UNIQUE (CustomerId)
)
```


Se puede utilizar **CREATE TABLE IF NOT EXISTS** para crearla únicamente si no existe aún. 

La sentencia **CREATE OR REPLACE TABLE** elimina la tabla si ya existe (**DROP TABLE**) y posteriormente la recrea.


``` CronoSqlSample
CREATE OR REPLACE TABLE dwh.DimCustomers(
  CustomerSid int IDENTITY(1,1),
  CustomerId int NOT NULL,
  Customer nvarchar(101) NOT NULL,
  CustomerType varchar(6) NOT NULL,
  AccountNumber nvarchar(10),
  FirstName nvarchar(50),
  MiddleName nvarchar(50),
  LastName nvarchar(50),
  CustomerAddressCountry nvarchar(50),
  CustomerProvince nvarchar(50),
  Name nvarchar(50),
  CustomerCountry nvarchar(50),
  CONSTRAINT PK_DimCustomers PRIMARY KEY CLUSTERED (CustomerSid),
  CONSTRAINT BK_DimCustomers UNIQUE (CustomerId)
)
```


También puede utilizarse **CREATE OR ALTER TABLE** para añadir nuevos campos, restricciones o índices a una tabla existente.

``` CronoSqlSample
CREATE OR ALTER TABLE dwh.DimCustomers(
  CustomerSid int IDENTITY(1,1),
  CustomerId int NOT NULL,
  Customer nvarchar(101) NOT NULL,
  CustomerType varchar(6) NOT NULL,
  AccountNumber nvarchar(10),
  FirstName nvarchar(50),
  MiddleName nvarchar(50),
  LastName nvarchar(50),
  CustomerAddressCountry nvarchar(50),
  CustomerProvince nvarchar(50),
  Name nvarchar(50),
  CustomerCountry nvarchar(50),
  CONSTRAINT PK_DimCustomers PRIMARY KEY CLUSTERED (CustomerSid),
  CONSTRAINT BK_DimCustomers UNIQUE (CustomerId)
)
```


Además de los campos de la tabla, la sintaxis de **Crono SQL** admite las siguientes restricciones y índices:

- Restricciones **NULL** y **NOT NULL** 
- Restricciones **IDENTITY**
- Restricciones **UNIQUE** y **NONUNIQUE** (que pueden ser **CLUSTERED** o **NONCLUSTERED**)
- Restricciones **FOREIGN KEY**/**REFERENCES**  (con la opción de **ON CASCADE DELETE** o **ON CASCADE SET NULL**)
- Restricciones **DEFAULT**
- Indices **UNIQUE** y **NONUNIQUE** (que pueden ser **CLUSTERED** o **NONCLUSTERED**, y con la opción **INCLUDE**)

``` CronoSqlSample
CREATE OR REPLACE TABLE dwh.DimCustomer2(
  #CustomerSid int IDENTITY(1,1),
  ##CustomerId int,
  Customer nvarchar(101) UNIQUE,
  CustomerType varchar(6) NOT NULL DEFAULT 'Unknown',
  AccountNumber nvarchar(10) NOT NULL,
  FirstName nvarchar(50) NOT NULL DEFAULT '',
  MiddleName nvarchar(50),
  LastName nvarchar(50),
  CustomerAddressCountry nvarchar(50),
  CustomerProvince nvarchar(50),
  Name nvarchar(50),
  CustomerCountry nvarchar(50),
  Store int REFERENCES dwh.DimStore ON DELETE CASCADE,
  BirthDate	date REFERENCES dwh.DimDates(CalendarDate),
  Store nvarchar(50),
  StoreManager nvarchar(101),
  StoreCountry nvarchar(50),
  StoreProvince nvarchar(50),
  StoreCity nvarchar(30),
  CONSTRAINT constraint1 UNIQUE (FirstName, MiddleName, LastName),
  INDEX UNIQUE CLUSTERED (AccountNumber),
  INDEX NONUNIQUE (LastName) INCLUDE (Customer, AccountNumber),
  INDEX NONUNIQUE (CustomerType)
)
```


Algunas características de esta sintaxis:

- Es posible definir restricciones **IDENTITY**, **NULL**, **UNIQUE**, **REFERENCES** y **DEFAULT** en línea con el campo.
- Es posible omitir el nombre de indices y restricciones. **Crono SQL** utilizará un criterio de nomenclatura predefinido.

Si se requiere alguna funcionalidad de la base de datos que no está soportada por la sintaxis de **Crono SQL**, se pueden utilizar los literales SQL. Por ejemplo, puede utilizarse un literal SQL para especificar el *file group* donde debe crearse un indice, o para definir el particionado, o crear indices columnares (**Crono SQL** no parseará ni traducirá el literal SQL).

``` CronoSqlSample
SQL `
CREATE TABLE [dwh].[DimCustomer](
  [CustomerSid] [int] IDENTITY(1,1) NOT NULL,
  [CustomerId] [int] NULL,
  [Customer] [nvarchar](101) NULL,
  [CustomerType] [varchar](6) NOT NULL,
  [AccountNumber] [nvarchar](10) NOT NULL,
  [FirstName] [nvarchar](50) NOT NULL,
  [MiddleName] [nvarchar](50) NULL,
  [LastName] [nvarchar](50) NULL,
  [CustomerAddressCountry] [nvarchar](50) NULL
  CONSTRAINT [PK_DimCustomer] PRIMARY KEY NONCLUSTERED ([CustomerSid] ASC) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF) ON [PRIMARY]
) ON [PRIMARY]
`
```


También se puede crear una tabla directamente a partir del resultado de una consulta.

``` CronoSqlSample
CREATE OR REPLACE TABLE dwh.CopiaDeCustomers
SELECT 
  Customer.CustomerId				#CustomerId,
  concat(CustomerPerson.FirstName,' ',CustomerPerson.LastName)		Customer,
  customer.AccountNumber,
  CustomerPerson.FirstName,
  CustomerPerson.MiddleName,
  CustomerPerson.LastName,
  CustomerCountry.Name 			CustomerAddressCountry,
  CustomerProvince.Name 			CustomerProvince,
  CustomerTerritory.Name,
FROM staging.customer
INNER JOIN staging.SalesTerritory CustomerTerritory using Customer(TerritoryId)
INNER JOIN staging.CountryRegion SalesCountry using CustomerTerritory(CountryRegionCode)
LEFT JOIN staging.Person CustomerPerson using Customer(PersonID BusinessEntityId)
LEFT JOIN staging.BusinessEntityAddress filter (AddressTypeid=2) using Customer(PersonID BusinessEntityId)
LEFT JOIN staging.Address CustomerAddress using BusinessEntityAddress(AddressId)
LEFT JOIN staging.StateProvince CustomerProvince using CustomerAddress(StateProvinceId)
LEFT JOIN staging.CountryRegion CustomerCountry using CustomerProvince(CountryRegionCode)
```


Para eliminar una tabla, **Crono SQL** proporciona las sentencias **DROP TABLE** y **DROP TABLE IF EXISTS**.

``` CronoSqlSample
DROP TABLE IF EXISTS dwh.DimCustomer
```


## CREATE INDEX

Los índices se pueden crear desde la misma sentencia **CREATE TABLE** pero también pueden definirse a postereri mediante las sentencias **CREATE INDEX**.

``` CronoSqlSample
CREATE INDEX IDX_Customer1 ON dwh.DimCustomers(LastName)
```


Se puede utilizar la instrucción **CREATE INDEX IF NOT EXISTS** para crear un índice si aún no existe.

``` CronoSqlSample
CREATE INDEX IF NOT EXISTS IDX_SalesHeader_CustomerSid ON dwh.FactSalesOrderHeader(CustomerSid)
```


También se puede utilizar **CREATE OR REPLACE INDEX** para crear un índice o recrearlo si ya existe. El siguiente ejemplo muestra, además, la posibilidad de utilizar la cláusula **INCLUDE** para añadir columnas adicionales al indice:

``` CronoSqlSample
CREATE OR REPLACE INDEX IDX_SalesHeader_CustomerSid2 ON dwh.FactSalesOrderHeader(CustomerSid) INCLUDE  (SalesOrderId)
```


Se puede crear índices **UNIQUE**, **CLUSTERED** y **NONCLUSTERED**.

``` CronoSqlSample
CREATE UNIQUE NONCLUSTERED INDEX IDX_Customer1 ON dwh.DimCustomers(Customer)
```


Mediante **literales SQL** se puede crear cualquier otro índice que admita la base de datos.

``` CronoSqlSample
SQL `CREATE CLUSTERED COLUMNSTORE INDEX MyCCI ON MyFactTable;  `
```


La instrucción **DROP INDEX** permite eliminar un índice.

``` CronoSqlSample
DROP INDEX IF EXISTS IDX_SalesHeader_CustomerSid ON dwh.FactSalesOrderHeader
```





## CREATE DATABASE

La sentencia **CREATE DATABASE** permite crear una base de datos con las opciones predeterminadas.

``` CronoSqlSample
CREATE DATABASE IF NOT EXISTS CRONO_EJEMPLO
```


También se puede especificar la intercalación:

``` CronoSqlSample
CREATE DATABASE IF NOT EXISTS CRONO_EJEMPLO COLLATE Traditional_Spanish_ci_ai
```


## CREATE SCHEMA

Se puede crear un esquema con las instrucciones **CREATE SCHEMA** y **CREATE SCHEMA IF NOT EXISTS**

``` CronoSqlSample
CREATE SCHEMA IF NOT EXISTS dwh
```


Es posible establecer el propietario del esquema.


``` CronoSqlSample
CREATE SCHEMA IF NOT EXISTS dwh AUTHORIZATION crono
```








