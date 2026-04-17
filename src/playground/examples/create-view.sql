/*
  CREATE VIEW creates a view that encapsulates a
  Crono SQL query. The generated SQL is a native engine view.
*/

CREATE VIEW dwh.vwProductSales AS
SELECT
  Product.Name Product,
  ProductCategory.name ProductCategory,
  sum(SalesOrderDetail.LineTotal) Sales
FROM staging.SalesOrderDetail
INNER JOIN staging.Product USING ProductId
LEFT JOIN staging.ProductSubCategory USING ProductSubcategoryID
LEFT JOIN staging.ProductCategory USING ProductSubCategory(ProductCategoryId)
