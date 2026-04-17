/*
  INSERT in Crono SQL: inserts the SELECT results
  into the target table. The # character marks the key
  to avoid duplicates.
*/

INSERT dwh.DimProducts
SELECT
  ProductID #ProductID,
  Product.Name Product,
  ProductCategory.name ProductCategory,
  ProductSubCategory.name ProductSubCategory
FROM staging.Product
LEFT JOIN staging.ProductSubCategory USING ProductSubcategoryID
LEFT JOIN staging.ProductCategory USING ProductSubCategory(ProductCategoryId)
