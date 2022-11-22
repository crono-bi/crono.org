DELETE FROM dwh.DimProducts;


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
  LEFT JOIN staging.ProductModel ON (Product.ProductModelID=ProductModel.ProductModelID)
)
INSERT dwh.DimProducts(ProductID,Product,ProductCategory,ProductSubCategory,ProductNumber,ProductModel,Color,ProductCost)
SELECT
  query.ProductID,
  query.Product,
  query.ProductCategory,
  query.ProductSubCategory,
  query.ProductNumber,
  query.ProductModel,
  query.Color,
  query.ProductCost
FROM query;