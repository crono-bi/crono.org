-- Materialized query: sales
SELECT
  Product.Name AS Product,
  Product.ProductNumber AS ProductNumber,
  sum(PurchaseOrderDetail.LineTotal) AS Purchases
INTO #sales__D83E4
FROM staging.PurchaseOrderDetail
INNER JOIN staging.Product ON (PurchaseOrderDetail.ProductId=Product.ProductId)
GROUP BY
  Product.Name,
  Product.ProductNumber



-- Materialized query: purchases
SELECT
  Product.Name AS Product,
  Product.ProductNumber AS ProductNumber,
  sum(SalesOrderDetail.LineTotal) AS Sales
INTO #purchases__1CD26
FROM staging.SalesOrderDetail
INNER JOIN staging.Product ON (SalesOrderDetail.ProductId=Product.ProductId)
GROUP BY
  Product.Name,
  Product.ProductNumber



SELECT
  coalesce(sales.Product,purchases.Product) Product,
  coalesce(sales.productNumber,purchases.productNumber) productNumber,
  sales.Purchases Purchases,
  purchases.Sales Sales
FROM #sales__D83E4 sales
FULL JOIN #purchases__1CD26 purchases ON (sales.Product=purchases.Product AND sales.productNumber=purchases.productNumber)