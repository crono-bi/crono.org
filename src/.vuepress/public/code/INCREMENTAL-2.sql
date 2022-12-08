;WITH
query AS (
  SELECT
    SalesOrderHeader.SalesOrderId AS SalesOrderId,
    Customer.CustomerId AS CustomerId,
    CAST(SalesOrderHeader.OrderDate AS date) AS OrderDate,
    SalesOrderHeader.SalesOrderNumber AS SalesOrderNumber,
    CAST(SalesOrderHeader.DueDate AS date) AS DueDate,
    CAST(SalesOrderHeader.ShipDate AS date) AS ShipDate,
    SalesOrderHeader.OnlineOrderFlag AS OnlineOrderFlag,
    SalesOrderHeader.PurchaseOrderNumber AS PurchaseOrderNumber,
    SalesOrderHeader.AccountNumber AS AccountNumber,
    SalesOrderHeader.Freight AS Freight,
    SalesOrderHeader.CreditCardApprovalCode AS CreditCardApprovalCode,
    SalesOrderHeader.SubTotal AS Amount,
    SalesOrderHeader.TaxAmt AS TaxAmt
  FROM staging.SalesOrderHeader
  INNER JOIN staging.customer ON (SalesOrderHeader.customerId=customer.customerId)
  WHERE CAST(SalesOrderHeader.OrderDate AS date)<=getdate()-30
)
INSERT dwh.FactSalesOrderHeader(SalesOrderId,CustomerId,OrderDate,SalesOrderNumber,DueDate,ShipDate,OnlineOrderFlag,PurchaseOrderNumber,AccountNumber,Freight,CreditCardApprovalCode,Amount,TaxAmt,InsertDate)
SELECT
  query.SalesOrderId,
  query.CustomerId,
  query.OrderDate,
  query.SalesOrderNumber,
  query.DueDate,
  query.ShipDate,
  query.OnlineOrderFlag,
  query.PurchaseOrderNumber,
  query.AccountNumber,
  query.Freight,
  query.CreditCardApprovalCode,
  query.Amount,
  query.TaxAmt,
  getdate()
FROM query
LEFT JOIN dwh.FactSalesOrderHeader ON (FactSalesOrderHeader.SalesOrderId=query.SalesOrderId)
WHERE FactSalesOrderHeader.SalesOrderId IS NULL;