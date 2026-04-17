/*
  CREATE OR REPLACE VIEW creates or replaces an existing view.
  Works like CREATE VIEW but doesn't fail if the view
  already exists.
*/

CREATE OR REPLACE VIEW dwh.vwProductSales AS
SELECT
  Product.Name Product,
  ProductCategory.name ProductCategory,
  sum(SalesOrderDetail.LineTotal) Sales
FROM staging.SalesOrderDetail
INNER JOIN staging.Product USING ProductId
LEFT JOIN staging.ProductSubCategory USING ProductSubcategoryID
LEFT JOIN staging.ProductCategory USING ProductSubCategory(ProductCategoryId)
