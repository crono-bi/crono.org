---
title: Sentencia UPDATE
Position: 3
---

# Sentencia UPDATE

**Crono SQL** soporta la sintaxis estándar de la sentencia **UPDATE**:

```cronosql-with-button
UPDATE dwh.FactSalesOrderHeader 
SET NetAmount=Amount-TaxAmt
WHERE year(OrderDate)=2017
```


Sin embargo, este tipo de sentencia es fundamentalmente inútil en un proyecto ETL/DWH. Los datos que queremos actualizar habitualmente no están ni se pueden calcular a partir de la tabla de origen. Por ello, cada fabricante de base de datos ha resuelto esta limitación de distintas maneras. [Por ejemplo](http://stackoverflow.com/questions/2446764/update-statement-with-inner-join-on-oracle):

```cronosql-with-button
UPDATE table1 
SET CodeDescription =  (
  SELECT table2.CODE
  FROM table2 
  WHERE table1.CodeDescription = table2.description)
WHERE
  EXISTS (
    SELECT table2.CODE
    FROM table2 
    WHERE table1.CodeDescription = table2.description)
```


**Crono SQL** soporta este tipo de sintaxis ISO, pero desaconseja claramente su uso.

En su lugar, el lenguaje **Crono SQL** propone una nueva sintaxis de **UPDATE** para actualizar una tabla en función del resultado de una consulta. Es una sintaxis similar a la del **INSERT** e igual al resto de instrucciones DML de **Crono SQL**. El código SQL generado corresponde a un **MERGE**.
 
```cronosql-with-button
UPDATE table1
SELECT 
  #code,
  description CodeDescription
from table2
```


De esta manera, seria trivial desnormalizar la información de productos en una única sentencia: 

```cronosql-with-button
UPDATE dwh.DimProducts 
select 
  ProductID #ProductID,
  Product.Name Product,
  ProductCategory.name ProductCategory,
  ProductSubCategory.name ProductSubCategory,
  ProductNumber,
  ProductModel.name ProductModel,
  Product.Color,
  Product.StandardCost ProductCost
FROM staging.Product
LEFT JOIN staging.ProductSubCategory using ProductSubcategoryID
LEFT JOIN staging.ProductCategory using ProductSubCategory(ProductCategoryId)
LEFT JOIN staging.ProductModel using ProductModelID
```

La anterior consulta actualiza los registros de *DimProducts* que hayan cambiado (y solo los que hayan cambiado). El **caracter #** sirve para indicar la clave de actualización, y suele coincidir con la "business key" de la consulta de origen.

Si se quieren actualizar todos los registros (hayan cambiado o no), se puede utilizar la sentencia **UPDATE ALL**, aunque raramente aportará ningún beneficio (¡Al contrario... penalizará el rendimiento por actualizar registros que no lo necesitan!).

```cronosql-with-button
UPDATE ALL dwh.DimProducts 
select 
  ProductID #ProductID,
  Product.Name Product,
  ProductCategory.name ProductCategory,
  ProductSubCategory.name ProductSubCategory,
  ProductNumber,
  ProductModel.name ProductModel,
  Product.Color,
  Product.StandardCost ProductCost
FROM staging.Product
LEFT JOIN staging.ProductSubCategory using ProductSubcategoryID
LEFT JOIN staging.ProductCategory using ProductSubCategory(ProductCategoryId)
LEFT JOIN staging.ProductModel using ProductModelID
```

```
;WITH
query AS (
  SELECT
    ProductID,
    Product.Name AS Product,
    ProductCategory.name AS ProductCategory,
    ProductSubCategory.name AS ProductSubCategory,
    ProductNumber,
    ProductModel.name AS ProductModel,
    Product.Color AS Color,
    Product.StandardCost AS ProductCost
  FROM staging.Product
  LEFT JOIN staging.ProductSubCategory ON (Product.ProductSubcategoryID=ProductSubCategory.ProductSubcategoryID)
  LEFT JOIN staging.ProductCategory ON (ProductSubCategory.ProductCategoryId=ProductCategory.ProductCategoryId)
  LEFT JOIN staging.ProductModel ON (Product.ProductModelID=ProductModel.ProductModelID)
)
MERGE dwh.DimProducts AS DimProducts
USING query ON query.ProductID=DimProducts.ProductID
WHEN MATCHED THEN
  UPDATE SET
    Product=query.Product,
    ProductCategory=query.ProductCategory,
    ProductSubCategory=query.ProductSubCategory,
    ProductNumber=query.ProductNumber,
    ProductModel=query.ProductModel,
    Color=query.Color,
    ProductCost=query.ProductCost;

```


Se puede utilizar la opción **PARTITION** para actualizar solo una parte de la tabla:

```cronosql-with-button
UPDATE table1 PARTITION (table1.UPDATETYPE='blah')
SELECT 
  #code,
  description CodeDescription
from table2
```

Aunque, evidentemente, en un escenario ETL/DWH es más habitual actualizar múltiples campos. La siguiente sentencia actualiza la información de las *Bikes* de **AdventureWorks**:

```cronosql-with-button
UPDATE dwh.DimProducts PARTITION (ProductCategory='Bikes')  
select 
  ProductID #ProductID,
  Product.Name Product,
  ProductCategory.name ProductCategory,
  ProductSubCategory.name ProductSubCategory,
  ProductNumber,
  ProductModel.name ProductModel,
  Product.Color,
  Product.StandardCost ProductCost
FROM staging.Product
LEFT JOIN staging.ProductSubCategory using ProductSubcategoryID
LEFT JOIN staging.ProductCategory using ProductSubCategory(ProductCategoryId)
LEFT JOIN staging.ProductModel using ProductModelID
WHERE ProductCategory='Bikes'
```

También se podrían actualizar los datos de una tabla a partir de sus propios datos. La siguiente sentencia es equivalente al primer **UPDATE** de este apartado:

```cronosql-with-button
UPDATE dwh.FactSalesOrderHeader
SELECT 
  #SalesOrderId,
  Amount-TaxAmt NetAmount
FROM dwh.FactSalesOrderHeader
WHERE year(OrderDate)=2017
```
