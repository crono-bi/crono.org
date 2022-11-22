SELECT count(*) AS expr1
FROM (
    SELECT
      Product.Name AS Product,
      Product.ProductNumber AS ProductNumber,
      sum(SalesOrderDetail.LineTotal) AS Sales
    FROM staging.SalesOrderDetail
    INNER JOIN staging.Product ON (SalesOrderDetail.ProductId=Product.ProductId)
    GROUP BY
      Product.Name,
      Product.ProductNumber
  ) a