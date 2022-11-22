SELECT
  Product,
  ProductNumber,
  avg(Sales) AS AvgYearSales
FROM (
    SELECT
      Product.Name AS Product,
      Product.ProductNumber AS ProductNumber,
      year(OrderDate) AS OrderYear,
      sum(SalesOrderDetail.LineTotal) AS Sales
    FROM staging.SalesOrderDetail
    INNER JOIN staging.SalesOrderHeader ON (SalesOrderDetail.SalesOrderId=SalesOrderHeader.SalesOrderId)
    INNER JOIN staging.Product ON (SalesOrderDetail.ProductId=Product.ProductId)
    GROUP BY
      Product.Name,
      Product.ProductNumber,
      year(OrderDate)
  ) a
GROUP BY
  Product,
  ProductNumber