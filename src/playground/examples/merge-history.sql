/*
  MERGE HISTORY maintains a change history (SCD Type 2).
  When a record changes, the previous one is closed and a new
  one is created, preserving the complete history.
*/

MERGE HISTORY dwh.DimProducts
SELECT
  ProductID #ProductID,
  Product.Name Product,
  ProductCategory.name ProductCategory,
  ProductSubCategory.name ProductSubCategory
FROM staging.Product
LEFT JOIN staging.ProductSubCategory USING ProductSubcategoryID
LEFT JOIN staging.ProductCategory USING ProductSubCategory(ProductCategoryId)
