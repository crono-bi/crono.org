IF EXISTS (
  SELECT count(*)
  FROM staging.Product
  LEFT JOIN staging.ProductSubCategory ON (Product.ProductSubcategoryID=ProductSubCategory.ProductSubcategoryID)
  LEFT JOIN staging.ProductCategory ON (ProductSubCategory.ProductCategoryId=ProductCategory.ProductCategoryId)
  LEFT JOIN staging.ProductModel ON (Product.ProductModelID=ProductModel.ProductModelID)
  HAVING count(*) <> (SELECT count(*) FROM staging.Product)
) THROW 50001,'Las relaciones de esta consulta pierden o duplican registros de Product.',1


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
    Product.StandardCost AS ProductCost,
    Product.ListPrice AS ListPrice,
    Product.Size AS Size,
    Product.SizeUnitMeasureCode AS SizeUnitMeasureCode,
    Product.Weight AS Weight,
    Product.WeightUnitMeasureCode AS WeightUnitMeasureCode
  FROM staging.Product
  LEFT JOIN staging.ProductSubCategory ON (Product.ProductSubcategoryID=ProductSubCategory.ProductSubcategoryID)
  LEFT JOIN staging.ProductCategory ON (ProductSubCategory.ProductCategoryId=ProductCategory.ProductCategoryId)
  LEFT JOIN staging.ProductModel ON (Product.ProductModelID=ProductModel.ProductModelID)
)
INSERT dwh.DimProducts(ProductID,Product,ProductCategory,ProductSubCategory,ProductNumber,ProductModel,Color,ProductCost,ListPrice,Size,SizeUnitMeasureCode,Weight,WeightUnitMeasureCode)
SELECT
  query.ProductID,
  query.Product,
  query.ProductCategory,
  query.ProductSubCategory,
  query.ProductNumber,
  query.ProductModel,
  query.Color,
  query.ProductCost,
  query.ListPrice,
  query.Size,
  query.SizeUnitMeasureCode,
  query.Weight,
  query.WeightUnitMeasureCode
FROM query;