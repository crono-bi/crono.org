---
sidebarDepth: 2
---

# Sentencia INSERT

**Crono SQL** soporta la sintaxis estándar de la sentencia **INSERT**:

``` CronoSqlSample
INSERT INTO dwh.DimProducts(
  ProductID,
  Product,
  ProductCategory,
  ProductSubCategory,
  ProductNumber,
  ProductModel,
  Color,
  StandardCost,
  ListPrice,
  ProductSize,
  SizeUnitMeasureCode,
  Weight,
  WeightUnitMeasureCode)
select 
  ProductID,
  Product.Name,
  ProductCategory.name,
  ProductSubCategory.name,
  ProductNumber,
  ProductModel.name,
  Product.Color,
  Product.StandardCost,
  Product.ListPrice,
  Product.Size,
  Product.SizeUnitMeasureCode,
  Product.Weight,
  Product.WeightUnitMeasureCode
FROM staging.Product
LEFT JOIN staging.ProductSubCategory using Product(ProductSubcategoryID)
LEFT JOIN staging.ProductCategory using ProductSubCategory(ProductCategoryId)
LEFT JOIN staging.ProductModel using Product(ProductModelID)
```


Sin embargo, especialmente cuando la tabla tiene muchas columnas, esta sintaxis es repetitiva e incómoda de mantener.  Por ello, **Crono SQL** prescinde de la cláusula **VALUES** y asume que el nombre de los campos coincide con el *alias* de las columnas de la consulta de origen:

``` CronoSqlSample
INSERT INTO dwh.DimProducts
select 
  ProductID,
  Product.Name Product,
  ProductCategory.name ProductCategory,
  ProductSubCategory.name ProductSubCategory,
  ProductNumber,
  ProductModel.name ProductModel,
  Product.Color,
  Product.StandardCost ProductCost,
  Product.ListPrice,
  Product.Size,
  Product.SizeUnitMeasureCode,
  Product.Weight,
  Product.WeightUnitMeasureCode
FROM staging.Product
LEFT JOIN staging.ProductSubCategory using Product(ProductSubcategoryID)
LEFT JOIN staging.ProductCategory using ProductSubCategory(ProductCategoryId)
LEFT JOIN staging.ProductModel using Product(ProductModelID)
```



Por supuesto, para definir el  origen de datos del **INSERT** se pueden utilizar [todas las características de la sentencia **SELECT**](#sentencia-select) de **Crono SQL**. En la siguiente consulta, por ejemplo, se verifica que las relaciones sean correctas antes de realizar la inserción. Es decir, si las relaciones pierden o duplican registros,  no se ejecutará el **INSERT**.    

``` CronoSqlSample
INSERT INTO dwh.DimProducts
select 
  ProductID,
  Product.Name Product,
  ProductCategory.name ProductCategory,
  ProductSubCategory.name ProductSubCategory,
  ProductNumber,
  ProductModel.name ProductModel,
  Product.Color,
  Product.StandardCost ProductCost,
  Product.ListPrice,
  Product.Size,
  Product.SizeUnitMeasureCode,
  Product.Weight,
  Product.WeightUnitMeasureCode
FROM staging.Product
LEFT JOIN staging.ProductSubCategory using Product(ProductSubcategoryID)
LEFT JOIN staging.ProductCategory using ProductSubCategory(ProductCategoryId)
LEFT JOIN staging.ProductModel using Product(ProductModelID)
CHECK SNOWFLAKE
```



También se puede utilizar, por ejemplo, la sentencia **COMBINE** o la funcionalidad de **MATERIALIZE**. En la siguiente consulta se verificará que todas las relaciones sean correctas, se crearán entonces las tablas temporales con la información de *ventas* y *compras*, y finalmente se unirán mediante un **FULL JOIN** en un único resultado a insertar.

``` CronoSqlSample
INSERT INTO dwh.VentasVsCompras
COMBINE BY Product,ProductNumber
  MATERIALIZE sales (
    select 
      Product.Name Product,
      Product.ProductNumber ProductNumber,
      sum(PurchaseOrderDetail.LineTotal) Purchases
    from staging.PurchaseOrderDetail
    inner join staging.Product  using ProductId
    CHECK SNOWFLAKE),
  MATERIALIZE purchases (
    select 
      Product.Name Product,
      Product.ProductNumber ProductNumber,
      sum(SalesOrderDetail.LineTotal) Sales
    from staging.SalesOrderDetail
    inner join staging.Product  using ProductId
    CHECK SNOWFLAKE)
```


Una necesidad habitual en ETL/DWH es insertar únicamente los registros que no existan en la tabla destino. Para ello, es necesario especificar la "clave de inserción". La clave de inserción se define mediante el *carácter #* delante del  *alias* de cada campo. Como veremos a lo largo de este tutorial, las claves de todas las estrategias de carga se definen con el carácter **#**.

La siguiente consulta inserta los productos que no existan aún en la tabla *dwh.DimProducts*

``` CronoSqlSample
INSERT INTO dwh.DimProducts
select 
  ProductID #ProductID,
  Product.Name Product,
  ProductCategory.name ProductCategory,
  ProductSubCategory.name ProductSubCategory,
  ProductNumber,
  ProductModel.name ProductModel,
  Product.Color,
  Product.StandardCost ProductCost,
  Product.ListPrice,
  Product.Size,
  Product.SizeUnitMeasureCode,
  Product.Weight,
  Product.WeightUnitMeasureCode
FROM staging.Product
LEFT JOIN staging.ProductSubCategory using Product(ProductSubcategoryID)
LEFT JOIN staging.ProductCategory using ProductSubCategory(ProductCategoryId)
LEFT JOIN staging.ProductModel using Product(ProductModelID)
```



Es es posible realizar una recarga completa mediante la sentencia **DELETE AND INSERT**. Esta sentencia elimina el contenido de la tabla y la recarga con los datos de la consulta de origen. 


``` CronoSqlSample
DELETE AND INSERT INTO dwh.DimProducts 
select 
  ProductID,
  Product.Name Product,
  ProductCategory.name ProductCategory,
  ProductSubCategory.name ProductSubCategory,
  ProductNumber,
  ProductModel.name ProductModel,
  Product.Color,
  Product.StandardCost ProductCost
FROM staging.Product
LEFT JOIN staging.ProductSubCategory using Product(ProductSubcategoryID)
LEFT JOIN staging.ProductModel using Product(ProductModelID)
```


También es posible realizar un **TRUNCATE AND INSERT**

``` CronoSqlSample
TRUNCATE AND INSERT INTO dwh.DimProducts 
select 
  ProductID,
  Product.Name Product,
  ProductCategory.name ProductCategory,
  ProductSubCategory.name ProductSubCategory,
  ProductNumber,
  ProductModel.name ProductModel,
  Product.Color,
  Product.StandardCost ProductCost
FROM staging.Product
LEFT JOIN staging.ProductSubCategory using Product(ProductSubcategoryID)
LEFT JOIN staging.ProductModel using Product(ProductModelID)
```


La opción **PARTITION** permite recargar solo una parte de la tabla. Por ejemplo, es habitual cargar solo los movimientos del mes en curso (si sabemos que los demás no han sido modificados). La siguiente sentencia recarga las ventas de los últimos 30 días:

``` CronoSqlSample
DELETE AND INSERT INTO dwh.FactSalesOrderHeader PARTITION (OrderDate>=getdate()-30)
SELECT 
  SalesOrderHeader.SalesOrderId,
  Customer.CustomerId,
  cast(SalesOrderHeader.OrderDate as date) OrderDate,
  SalesOrderHeader.SalesOrderNumber,
  cast(SalesOrderHeader.DueDate as date) DueDate,
  cast(SalesOrderHeader.ShipDate as date) ShipDate,
  SalesOrderHeader.OnlineOrderFlag,
  SalesOrderHeader.PurchaseOrderNumber,
  SalesOrderHeader.AccountNumber,
  SalesOrderHeader.Freight,
  SalesOrderHeader.CreditCardApprovalCode,
  SalesOrderHeader.SubTotal Amount,
  SalesOrderHeader.TaxAmt
FROM staging.SalesOrderHeader
INNER JOIN staging.customer using SalesOrderHeader(customerId)
where OrderDate>=getdate()-30
```


Con el tipo de estrategias descritas en este apartado es posible conseguir que cada tabla se cargue desde una única sentencia, centralizando la lógica de negocio en un único punto, facilitando el desarrollo, y promocionando el seguimiento de buenas prácticas. Los mismos principios y métodos se utilizan en el resto de sentencias DML, como se muestra en los siguientes apartados.
