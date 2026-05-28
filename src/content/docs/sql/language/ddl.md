---
title: "DDL"
sidebar:
  order: 70
---

**Crono SQL** soporta las sentencias DDL habituales para definir y gestionar objetos de base de datos. En este artículo se describe su sintaxis mediante ejemplos.

- **CREATE PROCEDURE**
- **CREATE FUNCTION**
- **CREATE VIEW**
- **CREATE TABLE**
- **CREATE INDEX**
- **CREATE DATABASE**
- **CREATE SCHEMA**


## CREATE PROCEDURE

**Crono SQL** admite la sintaxis estándar de SQL para crear procedimientos almacenados:

```crono-sql
CREATE PROCEDURE dbo.[cargar productos]
BEGIN

  MERGE CLONE dwh.DimProducts(ProductSid)
  SELECT
    #ProductID,
    Product.Name          Product,
    ProductCategory.name  ProductCategory,
    ProductSubCategory.name ProductSubCategory,
    ProductNumber,
    ProductModel.name     ProductModel,
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

El código SQL generado, sin que el programador tenga que escribir ni configurar nada, guarda en una tabla de log información sobre cada ejecución (*fecha de inicio*, *duración*, etc.). Por lo tanto, la sentencia **PRINT** del ejemplo anterior es innecesaria. De hecho, si el procedimiento tiene una sola instrucción, tampoco hace falta el bloque **BEGIN ... END**. El siguiente código es equivalente:

```crono-sql
CREATE PROCEDURE dbo.[cargar productos]
MERGE CLONE dwh.DimProducts(ProductSid)
SELECT
  #ProductID,
  Product.Name          Product,
  ProductCategory.name  ProductCategory,
  ProductSubCategory.name ProductSubCategory,
  ProductNumber,
  ProductModel.name     ProductModel,
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

Se puede utilizar **CREATE OR REPLACE** (también **CREATE OR ALTER**) para que el mismo código sirva tanto para crear el procedimiento inicialmente como para modificarlo si ya existe:

```crono-sql
CREATE OR ALTER PROCEDURE dbo.[cargar productos]
MERGE CLONE dwh.DimProducts(ProductSid)
SELECT
  #ProductID,
  Product.Name          Product,
  ProductCategory.name  ProductCategory,
  ProductSubCategory.name ProductSubCategory,
  ProductNumber,
  ProductModel.name     ProductModel,
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

Finalmente, si el procedimiento carga una única tabla —lo recomendado—, se puede prescindir del nombre. **Crono SQL** escogerá un nombre apropiado automáticamente:

```crono-sql
CREATE OR REPLACE PROCEDURE
MERGE CLONE dwh.DimProducts(ProductSid)
SELECT
  #ProductID,
  Product.Name          Product,
  ProductCategory.name  ProductCategory,
  ProductSubCategory.name ProductSubCategory,
  ProductNumber,
  ProductModel.name     ProductModel,
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

Todos los ejemplos anteriores crean tanto el procedimiento como la tabla *DimProducts*. Antes de cargar la tabla se ejecuta la comprobación **CHECK SNOWFLAKE** para asegurar que las relaciones no pierden ni duplican registros. Los campos de auditoría se informan automáticamente durante la carga.

La sintaxis del último ejemplo no es excepcional: es el caso más habitual, el recomendado, y el que puede utilizarse en prácticamente todas las tablas de un Data Warehouse con **Crono SQL**.

**Crono SQL** facilita y promociona el [principio de responsabilidad única (SRP)](https://es.wikipedia.org/wiki/Principio_de_responsabilidad_%C3%BAnica): cada procedimiento carga una única tabla, cada tabla se carga desde un único procedimiento, y cada procedimiento tiene una única instrucción de carga.

Para ejecutar un procedimiento se usa **EXECUTE** (o **EXEC**):

```crono-sql
EXECUTE dbo.[cargar productos]
```

Para los procedimientos anónimos se usa **EXECUTE LOAD** (o **EXEC LOAD**):

```crono-sql
EXECUTE LOAD dwh.DimProducts
```

El flujo de carga del DWH se puede orquestar desde un procedimiento que llame secuencialmente a todos los demás:

```crono-sql
CREATE OR REPLACE PROCEDURE dwh.cargar
BEGIN

  EXEC LOAD dwh.DimDates @log
  EXEC LOAD dwh.DimEmployees @log
  EXEC LOAD dwh.DimProducts @log
  EXEC LOAD dwh.DimCustomers @log
  EXEC LOAD dwh.FactSalesOrderHeader @log
  EXEC LOAD dwh.FactSalesOrderDetails @log

END
```

Y la carga completa del DWH se lanzaría con:

```crono-sql
EXECUTE dwh.cargar
```

Para eliminar un procedimiento se usa **DROP PROCEDURE** o **DROP PROCEDURE IF EXISTS**:

```crono-sql
DROP PROCEDURE IF EXISTS dwh.cargar
```

## CREATE FUNCTION

La sintaxis para crear una función escalar es la siguiente:

```crono-sql
CREATE OR REPLACE FUNCTION dbo.MaxValue(@a int, @b int, @c int) RETURNS int
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

También pueden crearse funciones que devuelven tablas:

```crono-sql
CREATE OR REPLACE FUNCTION dbo.ProductSales(@ProductId int) RETURNS TABLE
SELECT
  year(FactSalesOrderHeader.OrderDate) OrderYear,
  sum(FactSalesOrderDetails.LineTotal) Sales
FROM dwh.FactSalesOrderDetails
INNER JOIN dwh.FactSalesOrderHeader USING SalesOrderId
INNER JOIN dwh.DimProducts USING ProductSid
WHERE DimProducts.ProductId=@ProductId
```

Para eliminar una función se usa **DROP FUNCTION** o **DROP FUNCTION IF EXISTS**:

```crono-sql
DROP FUNCTION IF EXISTS dbo.ProductSales
```

## CREATE VIEW

**Crono SQL** admite la sintaxis estándar para crear vistas:

```crono-sql
CREATE VIEW dwh.ProductsAnnualSales AS
SELECT
  DimProducts.Product,
  year(FactSalesOrderHeader.OrderDate) OrderYear,
  sum(FactSalesOrderDetails.LineTotal) Sales
FROM dwh.FactSalesOrderDetails
INNER JOIN dwh.FactSalesOrderHeader USING SalesOrderId
INNER JOIN dwh.DimProducts USING ProductSid
```

Se puede utilizar **CREATE OR ALTER VIEW** o **CREATE OR REPLACE VIEW** para actualizar la vista si ya existe:

```crono-sql
CREATE OR REPLACE VIEW dwh.ProductsAnnualSales
SELECT
  DimProducts.Product,
  year(FactSalesOrderHeader.OrderDate) OrderYear,
  sum(FactSalesOrderDetails.LineTotal) Sales
FROM dwh.FactSalesOrderDetails
INNER JOIN dwh.FactSalesOrderHeader USING SalesOrderId
INNER JOIN dwh.DimProducts USING ProductSid
```

Para eliminar una vista se usa **DROP VIEW** o **DROP VIEW IF EXISTS**:

```crono-sql
DROP VIEW IF EXISTS dbo.ProductSales
```

## CREATE TABLE

En general, no es necesario escribir explícitamente el **CREATE TABLE** de las tablas de un data warehouse con **Crono SQL**: las sentencias de carga crean automáticamente las tablas y los campos necesarios.

De todos modos, pueden crearse tablas usando la sintaxis habitual:

```crono-sql
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

Se puede utilizar **CREATE TABLE IF NOT EXISTS** para crearla únicamente si no existe. La sentencia **CREATE OR REPLACE TABLE** elimina la tabla si ya existe y la recrea. **CREATE OR ALTER TABLE** añade nuevos campos, restricciones o índices a una tabla existente sin eliminarla.

La sintaxis admite las siguientes restricciones e índices:

- Restricciones **NULL** y **NOT NULL**
- Restricciones **IDENTITY**
- Restricciones **UNIQUE** y **NONUNIQUE** (que pueden ser **CLUSTERED** o **NONCLUSTERED**)
- Restricciones **FOREIGN KEY**/**REFERENCES** (con **ON CASCADE DELETE** o **ON CASCADE SET NULL**)
- Restricciones **DEFAULT**
- Índices **UNIQUE** y **NONUNIQUE** (que pueden ser **CLUSTERED** o **NONCLUSTERED**, con la opción **INCLUDE**)

```crono-sql
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
  BirthDate date REFERENCES dwh.DimDates(CalendarDate),
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
- Es posible omitir el nombre de índices y restricciones. **Crono SQL** utilizará un criterio de nomenclatura predefinido.

Si se requiere alguna funcionalidad no soportada por la sintaxis de **Crono SQL** —como especificar el *file group*, el particionado o crear índices columnares—, pueden usarse **literales SQL**:

```crono-sql
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
  CONSTRAINT [PK_DimCustomer] PRIMARY KEY NONCLUSTERED ([CustomerSid] ASC)
    WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF) ON [PRIMARY]
) ON [PRIMARY]
`
```

También se puede crear una tabla directamente a partir del resultado de una consulta:

```crono-sql
CREATE OR REPLACE TABLE dwh.CopiaDeCustomers
SELECT
  Customer.CustomerId                                              #CustomerId,
  concat(CustomerPerson.FirstName,' ',CustomerPerson.LastName)    Customer,
  customer.AccountNumber,
  CustomerPerson.FirstName,
  CustomerPerson.MiddleName,
  CustomerPerson.LastName,
  CustomerCountry.Name    CustomerAddressCountry,
  CustomerProvince.Name   CustomerProvince,
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

Para eliminar una tabla se usa **DROP TABLE** o **DROP TABLE IF EXISTS**:

```crono-sql
DROP TABLE IF EXISTS dwh.DimCustomer
```

## CREATE INDEX

Los índices se pueden definir dentro del **CREATE TABLE** o a posteriori mediante **CREATE INDEX**:

```crono-sql
CREATE INDEX IDX_Customer1 ON dwh.DimCustomers(LastName)
```

Se puede utilizar **CREATE INDEX IF NOT EXISTS** para crear un índice solo si aún no existe, y **CREATE OR REPLACE INDEX** para crearlo o recrearlo si ya existe. El siguiente ejemplo muestra también la cláusula **INCLUDE**:

```crono-sql
CREATE OR REPLACE INDEX IDX_SalesHeader_CustomerSid ON dwh.FactSalesOrderHeader(CustomerSid) INCLUDE (SalesOrderId)
```

Se pueden crear índices **UNIQUE**, **CLUSTERED** y **NONCLUSTERED**:

```crono-sql
CREATE UNIQUE NONCLUSTERED INDEX IDX_Customer1 ON dwh.DimCustomers(Customer)
```

Mediante **literales SQL** se puede crear cualquier otro índice que admita la base de datos, como índices columnares:

```crono-sql
SQL `CREATE CLUSTERED COLUMNSTORE INDEX MyCCI ON MyFactTable;`
```

Para eliminar un índice se usa **DROP INDEX** o **DROP INDEX IF EXISTS**:

```crono-sql
DROP INDEX IF EXISTS IDX_SalesHeader_CustomerSid ON dwh.FactSalesOrderHeader
```

## CREATE DATABASE

La sentencia **CREATE DATABASE** permite crear una base de datos con las opciones predeterminadas:

```crono-sql
CREATE DATABASE IF NOT EXISTS CRONO_EJEMPLO
```

También se puede especificar la intercalación:

```crono-sql
CREATE DATABASE IF NOT EXISTS CRONO_EJEMPLO COLLATE Traditional_Spanish_ci_ai
```

## CREATE SCHEMA

Se puede crear un esquema con **CREATE SCHEMA** o **CREATE SCHEMA IF NOT EXISTS**:

```crono-sql
CREATE SCHEMA IF NOT EXISTS dwh
```

Es posible establecer el propietario del esquema:

```crono-sql
CREATE SCHEMA IF NOT EXISTS dwh AUTHORIZATION crono
```
