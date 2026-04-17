/*
  PARTITION allows updating only part of the target table.
  Combined with UPDATE or MERGE for partial reloads
  based on a condition.
*/

UPDATE dwh.DimProducts PARTITION (ProductCategory='Bikes')
SELECT
  ProductID #ProductID,
  Product.Name Product,
  ProductCategory.name ProductCategory,
  ProductSubCategory.name ProductSubCategory
FROM staging.Product
LEFT JOIN staging.ProductSubCategory USING ProductSubcategoryID
LEFT JOIN staging.ProductCategory USING ProductSubCategory(ProductCategoryId)
WHERE ProductCategory='Bikes'
