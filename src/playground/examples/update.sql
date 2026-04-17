/*
  UPDATE in Crono SQL: updates the target table with data
  from the SELECT. The # character marks the update key.
  Only records that have changed are updated.
*/

UPDATE dwh.DimProducts
SELECT
  ProductID #ProductID,
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
