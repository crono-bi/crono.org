-- Materialized query: sales
SELECT
  Product.Name AS Product,
  Product.ProductNumber AS ProductNumber,
  sum(PurchaseOrderDetail.LineTotal) AS Purchases
INTO #sales__14C85
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
INTO #purchases__9D591
FROM staging.SalesOrderDetail
INNER JOIN staging.Product ON (SalesOrderDetail.ProductId=Product.ProductId)
GROUP BY
  Product.Name,
  Product.ProductNumber



IF EXISTS (
  SELECT count(*)
  FROM staging.PurchaseOrderDetail
  LEFT JOIN staging.Product ON (PurchaseOrderDetail.ProductId=Product.ProductId)
  HAVING count(CASE WHEN Product.ProductId IS NOT NULL THEN 1 END) <> (SELECT count(*) FROM staging.PurchaseOrderDetail)
) THROW 50001,'Las relaciones de esta consulta pierden o duplican registros de PurchaseOrderDetail.',1


IF EXISTS (
  SELECT count(*)
  FROM staging.SalesOrderDetail
  LEFT JOIN staging.Product ON (SalesOrderDetail.ProductId=Product.ProductId)
  HAVING count(CASE WHEN Product.ProductId IS NOT NULL THEN 1 END) <> (SELECT count(*) FROM staging.SalesOrderDetail)
) THROW 50001,'Las relaciones de esta consulta pierden o duplican registros de SalesOrderDetail.',1


;WITH
query AS (
  SELECT
    coalesce(sales.Product,purchases.Product) Product,
    coalesce(sales.ProductNumber,purchases.ProductNumber) ProductNumber,
    sales.Purchases Purchases,
    purchases.Sales Sales
  FROM #sales__14C85 sales
  FULL JOIN #purchases__9D591 purchases ON (sales.Product=purchases.Product AND sales.ProductNumber=purchases.ProductNumber)
)
INSERT dwh.VentasVsCompras(Product,ProductNumber,Purchases,Sales)
SELECT
  query.Product,
  query.ProductNumber,
  query.Purchases,
  query.Sales
FROM query;