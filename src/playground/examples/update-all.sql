/*
  UPDATE ALL updates all records in the target table,
  whether they changed or not. Unlike UPDATE, it doesn't compare
  values before updating.
*/

UPDATE ALL dwh.DimProducts
SELECT
  ProductID #ProductID,
  Product.Name Product,
  ProductCategory.name ProductCategory
FROM staging.Product
LEFT JOIN staging.ProductSubCategory USING ProductSubcategoryID
LEFT JOIN staging.ProductCategory USING ProductSubCategory(ProductCategoryId)
