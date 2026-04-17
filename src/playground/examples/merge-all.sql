/*
  MERGE ALL is like MERGE UPSERT but updates ALL
  records, whether they changed or not. Useful when changes
  cannot be easily detected.
*/

MERGE ALL dwh.DimProducts
SELECT
  ProductID #ProductID,
  Product.Name Product,
  ProductCategory.name ProductCategory
FROM staging.Product
LEFT JOIN staging.ProductSubCategory USING ProductSubcategoryID
LEFT JOIN staging.ProductCategory USING ProductSubCategory(ProductCategoryId)
