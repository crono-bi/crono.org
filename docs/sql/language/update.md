---
sidebar_label: Sentencia UPDATE
sidebar_position: 3
---


# Sentencia UPDATE

**Crono SQL** soporta la sintaxis estándar de la sentencia **UPDATE**:

<SqlCodeBlock jsonPath="/json_sql/sql-FDB628.json" />


Sin embargo, este tipo de sentencia es fundamentalmente inútil en un proyecto ETL/DWH. Los datos que queremos actualizar habitualmente no están ni se pueden calcular a partir de la tabla de origen. Por ello, cada fabricante de base de datos ha resuelto esta limitación de distintas maneras. [Por ejemplo](http://stackoverflow.com/questions/2446764/update-statement-with-inner-join-on-oracle):

<SqlCodeBlock jsonPath="/json_sql/sql-2FEB57.json" />


**Crono SQL** soporta este tipo de sintaxis ISO, pero desaconseja claramente su uso.

En su lugar, el lenguaje **Crono SQL** propone una nueva sintaxis de **UPDATE** para actualizar una tabla en función del resultado de una consulta. Es una sintaxis similar a la del **INSERT** e igual al resto de instrucciones DML de **Crono SQL**. El código SQL generado corresponde a un **MERGE**.
 
<SqlCodeBlock jsonPath="/json_sql/sql-8861D3.json" />


De esta manera, seria trivial desnormalizar la información de productos en una única sentencia: 

<SqlCodeBlock jsonPath="/json_sql/sql-BDD28C.json" />

La anterior consulta actualiza los registros de *DimProducts* que hayan cambiado (y solo los que hayan cambiado). El **caracter #** sirve para indicar la clave de actualización, y suele coincidir con la "business key" de la consulta de origen.

Si se quieren actualizar todos los registros (hayan cambiado o no), se puede utilizar la sentencia **UPDATE ALL**, aunque raramente aportará ningún beneficio (¡Al contrario... penalizará el rendimiento por actualizar registros que no lo necesitan!).

<SqlCodeBlock jsonPath="/json_sql/sql-C04971.json" />

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

<SqlCodeBlock jsonPath="/json_sql/sql-B3080C.json" />

Aunque, evidentemente, en un escenario ETL/DWH es más habitual actualizar múltiples campos. La siguiente sentencia actualiza la información de las *Bikes* de **AdventureWorks**:

<SqlCodeBlock jsonPath="/json_sql/sql-9CA31D.json" />

También se podrían actualizar los datos de una tabla a partir de sus propios datos. La siguiente sentencia es equivalente al primer **UPDATE** de este apartado:

<SqlCodeBlock jsonPath="/json_sql/sql-715214.json" />
