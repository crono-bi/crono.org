-- Materialized query: sales
SELECT
  Product.Name AS Product,
  Product.ProductNumber AS ProductNumber,
  sum(PurchaseOrderDetail.LineTotal) AS Purchases
INTO #sales__FBEE9
FROM staging.PurchaseOrderDetail
INNER JOIN staging.Product ON (PurchaseOrderDetail.ProductId=Product.ProductId)
GROUP BY
  Product.Name,
  Product.ProductNumber



CREATE UNIQUE INDEX unique_index_tmp_sales__FBEE9 ON #sales__FBEE9 (Product,ProductNumber)

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
  FROM #sales__FBEE9 sales
  FULL JOIN #purchases__9D591 purchases ON (sales.Product=purchases.Product AND sales.ProductNumber=purchases.ProductNumber)
)
MERGE dwh.VentasVsCompras AS VentasVsCompras
USING query ON query.Product=VentasVsCompras.Product AND query.ProductNumber=VentasVsCompras.ProductNumber
WHEN MATCHED AND ((VentasVsCompras.Purchases<>query.Purchases OR (VentasVsCompras.Purchases IS NULL AND query.Purchases IS NOT NULL) OR  (VentasVsCompras.Purchases IS NOT NULL AND query.Purchases IS NULL)
                  OR VentasVsCompras.Sales<>query.Sales OR (VentasVsCompras.Sales IS NULL AND query.Sales IS NOT NULL) OR  (VentasVsCompras.Sales IS NOT NULL AND query.Sales IS NULL))) THEN
  UPDATE SET
    Purchases=query.Purchases,
    Sales=query.Sales
WHEN NOT MATCHED THEN
  INSERT (Product,ProductNumber,Purchases,Sales) VALUES (
    query.Product,
    query.ProductNumber,
    query.Purchases,
    query.Sales);