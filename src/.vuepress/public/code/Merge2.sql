;WITH
query AS (
  SELECT
    ProductID AS ProductId,
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
USING query ON query.ProductId=DimProducts.ProductId
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
    ProductCost=query.ProductCost
WHEN NOT MATCHED THEN
  INSERT (ProductId,Product,ProductCategory,ProductSubCategory,ProductNumber,ProductModel,Color,ProductCost) VALUES (
    query.ProductId,
    query.Product,
    query.ProductCategory,
    query.ProductSubCategory,
    query.ProductNumber,
    query.ProductModel,
    query.Color,
    query.ProductCost);