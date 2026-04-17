/*
  TRUNCATE AND INSERT empties the target table completely
  and then inserts all records from the SELECT.
  Useful for full reloads.
*/

TRUNCATE AND INSERT dwh.DimProducts
SELECT
  ProductID #ProductID,
  Product.Name Product,
  ProductCategory.name ProductCategory
FROM staging.Product
LEFT JOIN staging.ProductSubCategory USING ProductSubcategoryID
LEFT JOIN staging.ProductCategory USING ProductSubCategory(ProductCategoryId)
