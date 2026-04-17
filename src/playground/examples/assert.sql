/*
  ASSERT adds validation at the end of the query.
  If the condition is not met, execution fails.
  Useful for verifying data integrity.
*/

SELECT
  Product.Name Product,
  sum(SalesOrderDetail.LineTotal) Sales
FROM staging.SalesOrderDetail
INNER JOIN staging.Product USING ProductId
ASSERT count(*) > 0
