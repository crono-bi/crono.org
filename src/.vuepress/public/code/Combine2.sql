SELECT
  coalesce(sales.Product,purchases.Product) Product,
  coalesce(sales.ProductNumber,purchases.ProductNumber) ProductNumber,
  sales.Purchases Purchases,
  purchases.Sales Sales
FROM 
    (SELECT
      Product.Name AS Product,
      Product.ProductNumber AS ProductNumber,
      sum(PurchaseOrderDetail.LineTotal) AS Purchases
    FROM staging.PurchaseOrderDetail
    INNER JOIN staging.Product ON (PurchaseOrderDetail.ProductId=Product.ProductId)
    GROUP BY
      Product.Name,
      Product.ProductNumber) sales
FULL JOIN 
    (SELECT
      Product.Name AS Product,
      Product.ProductNumber AS ProductNumber,
      sum(SalesOrderDetail.LineTotal) AS Sales
    FROM staging.SalesOrderDetail
    INNER JOIN staging.Product ON (SalesOrderDetail.ProductId=Product.ProductId)
    GROUP BY
      Product.Name,
      Product.ProductNumber) AS purchases ON (sales.Product=purchases.Product AND sales.ProductNumber=purchases.ProductNumber)