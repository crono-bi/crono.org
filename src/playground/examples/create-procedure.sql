/*
  CREATE PROCEDURE generates a stored procedure
  that encapsulates one or more Crono SQL statements.
  Ideal for automated ETL processes.
*/

CREATE PROCEDURE dwh.spLoadProducts AS
MERGE UPSERT dwh.DimProducts
SELECT
  ProductID #ProductID,
  Product.Name Product,
  ProductCategory.name ProductCategory
FROM staging.Product
LEFT JOIN staging.ProductSubCategory USING ProductSubcategoryID
LEFT JOIN staging.ProductCategory USING ProductSubCategory(ProductCategoryId)
