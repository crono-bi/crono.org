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