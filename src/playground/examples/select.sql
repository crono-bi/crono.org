/*
  Crono SQL simplifies JOINs with the USING clause.
  No need to specify the full table name for each column —
  Crono resolves it automatically.
*/

SELECT
  Product.Name Product,
  ProductCategory.name ProductCategory,
  ProductSubCategory.name ProductSubCategory,
  ProductNumber,
  ProductModel.name ProductModel,
  Product.Color,
  Product.StandardCost ProductCost
FROM staging.Product
LEFT JOIN staging.ProductSubCategory USING ProductSubcategoryID
LEFT JOIN staging.ProductCategory USING ProductSubCategory(ProductCategoryId)
LEFT JOIN staging.ProductModel USING ProductModelID
