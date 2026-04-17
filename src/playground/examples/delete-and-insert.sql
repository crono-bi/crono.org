/*
  DELETE AND INSERT: first deletes records matching
  the key (#) and then inserts new data.
  Useful for partial reloads.
*/

DELETE AND INSERT dwh.DimProducts
SELECT
  ProductID #ProductID,
  Product.Name Product,
  ProductCategory.name ProductCategory
FROM staging.Product
LEFT JOIN staging.ProductSubCategory USING ProductSubcategoryID
LEFT JOIN staging.ProductCategory USING ProductSubCategory(ProductCategoryId)
