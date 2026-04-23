---
title: "Sentencia UPDATE"
sidebar:
  order: 3
---


**Crono SQL** soporta la sintaxis estándar de la sentencia **UPDATE**:

```sql
UPDATE dwh.FactSalesOrderHeader 
SET NetAmount=Amount-TaxAmt
WHERE year(OrderDate)=2017
```

  

  <details>
<summary>Ver SQL compilado</summary>

```sql
UPDATE dwh.FactSalesOrderHeader SET
  NetAmount=Amount-TaxAmt
WHERE
  year(OrderDate)=2017;

```

</details>


Sin embargo, este tipo de sentencia es fundamentalmente inútil en un proyecto ETL/DWH. Los datos que queremos actualizar habitualmente no están ni se pueden calcular a partir de la tabla de origen. Por ello, cada fabricante de base de datos ha resuelto esta limitación de distintas maneras. [Por ejemplo](http://stackoverflow.com/questions/2446764/update-statement-with-inner-join-on-oracle):

```sql
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

  

  <details>
<summary>Ver SQL compilado</summary>

```sql
UPDATE table1 SET
  CodeDescription=(SELECT table2.CODE AS CODE
  FROM table2
  WHERE table1.CodeDescription=table2.description
  )
WHERE
  EXISTS (SELECT table2.CODE AS CODE
  FROM table2
  WHERE table1.CodeDescription=table2.description
  );

```

</details>


**Crono SQL** soporta este tipo de sintaxis ISO, pero desaconseja claramente su uso.

En su lugar, el lenguaje **Crono SQL** propone una nueva sintaxis de **UPDATE** para actualizar una tabla en función del resultado de una consulta. Es una sintaxis similar a la del **INSERT** e igual al resto de instrucciones DML de **Crono SQL**. El código SQL generado corresponde a un **MERGE**.
 
```sql
UPDATE table1
SELECT 
  #code,
  description CodeDescription
from table2
```

  

  <details>
<summary>Ver SQL compilado</summary>

```sql
;WITH
query AS (
  SELECT
    code,
    description AS CodeDescription
  FROM table2
)
MERGE table1
USING query ON query.code=table1.code
WHEN MATCHED AND ((table1.CodeDescription<>query.CodeDescription OR (table1.CodeDescription IS NULL AND query.CodeDescription IS NOT NULL) OR  (table1.CodeDescription IS NOT NULL AND query.CodeDescription IS NULL))) THEN
  UPDATE SET
    CodeDescription=query.CodeDescription;

```

</details>


De esta manera, seria trivial desnormalizar la información de productos en una única sentencia: 

```sql
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

  

  <details>
<summary>Ver SQL compilado</summary>

```sql
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
WHEN MATCHED AND ((DimProducts.Product<>query.Product OR (DimProducts.Product IS NULL AND query.Product IS NOT NULL) OR  (DimProducts.Product IS NOT NULL AND query.Product IS NULL)
                  OR DimProducts.ProductCategory<>query.ProductCategory OR (DimProducts.ProductCategory IS NULL AND query.ProductCategory IS NOT NULL) OR  (DimProducts.ProductCategory IS NOT NULL AND query.ProductCategory IS NULL)
                  OR DimProducts.ProductSubCategory<>query.ProductSubCategory OR (DimProducts.ProductSubCategory IS NULL AND query.ProductSubCategory IS NOT NULL) OR  (DimProducts.ProductSubCategory IS NOT NULL AND query.ProductSubCategory IS NULL)
                  OR DimProducts.ProductNumber<>query.ProductNumber OR (DimProducts.ProductNumber IS NULL AND query.ProductNumber IS NOT NULL) OR  (DimProducts.ProductNumber IS NOT NULL AND query.ProductNumber IS NULL)
                  OR DimProducts.ProductModel<>query.ProductModel OR (DimProducts.ProductModel IS NULL AND query.ProductModel IS NOT NULL) OR  (DimProducts.ProductModel IS NOT NULL AND query.ProductModel IS NULL)
                  OR DimProducts.Color<>query.Color OR (DimProducts.Color IS NULL AND query.Color IS NOT NULL) OR  (DimProducts.Color IS NOT NULL AND query.Color IS NULL)
                  OR DimProducts.ProductCost<>query.ProductCost OR (DimProducts.ProductCost IS NULL AND query.ProductCost IS NOT NULL) OR  (DimProducts.ProductCost IS NOT NULL AND query.ProductCost IS NULL))) THEN
  UPDATE SET
    Product=query.Product,
    ProductCategory=query.ProductCategory,
    ProductSubCategory=query.ProductSubCategory,
    ProductNumber=query.ProductNumber,
    ProductModel=query.ProductModel,
    Color=query.Color,
    ProductCost=query.ProductCost;

```

</details>


La anterior consulta actualiza los registros de *DimProducts* que hayan cambiado (y solo los que hayan cambiado). El **caracter #** sirve para indicar la clave de actualización, y suele coincidir con la "business key" de la consulta de origen.

Si se quieren actualizar todos los registros (hayan cambiado o no), se puede utilizar la sentencia **UPDATE ALL**, aunque raramente aportará ningún beneficio (¡Al contrario... penalizará el rendimiento por actualizar registros que no lo necesitan!).

```sql
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

  

  <details>
<summary>Ver SQL compilado</summary>

```sql
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

</details>


Se puede utilizar la opción **PARTITION** para actualizar solo una parte de la tabla:

```sql
UPDATE table1 PARTITION (table1.UPDATETYPE='blah')
SELECT 
  #code,
  description CodeDescription
from table2
```

  

  <details>
<summary>Ver SQL compilado</summary>

```sql
;WITH
query AS (
  SELECT
    code,
    description AS CodeDescription
  FROM table2
)
MERGE table1
USING query ON query.code=table1.code
WHEN MATCHED AND (table1.UPDATETYPE='blah'
                  AND (table1.CodeDescription<>query.CodeDescription OR (table1.CodeDescription IS NULL AND query.CodeDescription IS NOT NULL) OR  (table1.CodeDescription IS NOT NULL AND query.CodeDescription IS NULL))) THEN
  UPDATE SET
    CodeDescription=query.CodeDescription;

```

</details>


Aunque, evidentemente, en un escenario ETL/DWH es más habitual actualizar múltiples campos. La siguiente sentencia actualiza la información de las *Bikes* de **AdventureWorks**:

```sql
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

  

  <details>
<summary>Ver SQL compilado</summary>

```sql
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
  WHERE ProductCategory.name='Bikes'
)
MERGE dwh.DimProducts AS DimProducts
USING query ON query.ProductID=DimProducts.ProductID
WHEN MATCHED AND (DimProducts.ProductCategory='Bikes'
                  AND (DimProducts.Product<>query.Product OR (DimProducts.Product IS NULL AND query.Product IS NOT NULL) OR  (DimProducts.Product IS NOT NULL AND query.Product IS NULL)
                  OR DimProducts.ProductCategory<>query.ProductCategory OR (DimProducts.ProductCategory IS NULL AND query.ProductCategory IS NOT NULL) OR  (DimProducts.ProductCategory IS NOT NULL AND query.ProductCategory IS NULL)
                  OR DimProducts.ProductSubCategory<>query.ProductSubCategory OR (DimProducts.ProductSubCategory IS NULL AND query.ProductSubCategory IS NOT NULL) OR  (DimProducts.ProductSubCategory IS NOT NULL AND query.ProductSubCategory IS NULL)
                  OR DimProducts.ProductNumber<>query.ProductNumber OR (DimProducts.ProductNumber IS NULL AND query.ProductNumber IS NOT NULL) OR  (DimProducts.ProductNumber IS NOT NULL AND query.ProductNumber IS NULL)
                  OR DimProducts.ProductModel<>query.ProductModel OR (DimProducts.ProductModel IS NULL AND query.ProductModel IS NOT NULL) OR  (DimProducts.ProductModel IS NOT NULL AND query.ProductModel IS NULL)
                  OR DimProducts.Color<>query.Color OR (DimProducts.Color IS NULL AND query.Color IS NOT NULL) OR  (DimProducts.Color IS NOT NULL AND query.Color IS NULL)
                  OR DimProducts.ProductCost<>query.ProductCost OR (DimProducts.ProductCost IS NULL AND query.ProductCost IS NOT NULL) OR  (DimProducts.ProductCost IS NOT NULL AND query.ProductCost IS NULL))) THEN
  UPDATE SET
    Product=query.Product,
    ProductCategory=query.ProductCategory,
    ProductSubCategory=query.ProductSubCategory,
    ProductNumber=query.ProductNumber,
    ProductModel=query.ProductModel,
    Color=query.Color,
    ProductCost=query.ProductCost;

```

</details>


También se podrían actualizar los datos de una tabla a partir de sus propios datos. La siguiente sentencia es equivalente al primer **UPDATE** de este apartado:

```sql
UPDATE dwh.FactSalesOrderHeader
SELECT 
  #SalesOrderId,
  Amount-TaxAmt NetAmount
FROM dwh.FactSalesOrderHeader
WHERE year(OrderDate)=2017
```

  

  <details>
<summary>Ver SQL compilado</summary>

```sql
;WITH
query AS (
  SELECT
    SalesOrderId,
    Amount-TaxAmt AS NetAmount
  FROM dwh.FactSalesOrderHeader
  WHERE year(OrderDate)=2017
)
MERGE dwh.FactSalesOrderHeader AS FactSalesOrderHeader
USING query ON query.SalesOrderId=FactSalesOrderHeader.SalesOrderId
WHEN MATCHED AND ((FactSalesOrderHeader.NetAmount<>query.NetAmount OR (FactSalesOrderHeader.NetAmount IS NULL AND query.NetAmount IS NOT NULL) OR  (FactSalesOrderHeader.NetAmount IS NOT NULL AND query.NetAmount IS NULL))) THEN
  UPDATE SET
    NetAmount=query.NetAmount;

```

</details>
