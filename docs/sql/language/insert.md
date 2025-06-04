---
sidebar_position: 4
---

# Sentencia INSERT

**Crono SQL** soporta la sintaxis estándar de la sentencia **INSERT**:

```sql
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

Sin embargo, especialmente cuando la tabla tiene muchas columnas, esta sintaxis es repetitiva e incómoda de mantener. Por ello, **Crono SQL** prescinde de la cláusula **VALUES** y asume que el nombre de los campos coincide con el *alias* de las columnas de la consulta de origen:

```sql
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

Por supuesto, para definir el origen de datos del **INSERT** se pueden utilizar todas las características de la sentencia **SELECT** de **Crono SQL**. En la siguiente consulta, por ejemplo, se verifica que las relaciones sean correctas antes de realizar la inserción. Es decir, si las relaciones pierden o duplican registros, no se ejecutará el **INSERT**.

```sql
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

La cláusula `CHECK SNOWFLAKE` verifica que las relaciones no pierdan ni dupliquen registros antes de ejecutar la inserción, lo que garantiza la integridad de los datos cargados.
