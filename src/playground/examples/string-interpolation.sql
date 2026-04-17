/*
  Crono SQL supports string interpolation using
  backticks and braces: `text {column}`.
  The expression is converted to CONCAT in the generated SQL.
*/

SELECT
  ProductId,
  Product.Name Product,
  `El producto {Product} tiene el código {ProductNumber}` Description
FROM staging.Product
