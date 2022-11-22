IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='dwh' AND TABLE_NAME='FactSalesOrderHeader')
CREATE TABLE dwh.FactSalesOrderHeader(
  SalesOrderSid int IDENTITY(1,1) NOT NULL,
  CONSTRAINT PK_FactSalesOrderHeader PRIMARY KEY CLUSTERED (SalesOrderSid)
)


IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='dwh' AND TABLE_NAME='FactSalesOrderHeader' AND COLUMN_NAME='SalesOrderSid')
ALTER TABLE dwh.FactSalesOrderHeader ADD SalesOrderSid int


IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='dwh' AND TABLE_NAME='FactSalesOrderHeader' AND COLUMN_NAME='SalesOrderSid' AND IS_NULLABLE='YES')
ALTER TABLE dwh.FactSalesOrderHeader ALTER COLUMN SalesOrderSid int NOT NULL


IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA='dwh' AND TABLE_NAME='FactSalesOrderHeader' AND CONSTRAINT_NAME='PK_FactSalesOrderHeader')
ALTER TABLE dwh.FactSalesOrderHeader ADD CONSTRAINT PK_FactSalesOrderHeader PRIMARY KEY CLUSTERED (SalesOrderSid)


DELETE FROM dwh.FactSalesOrderHeader;


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
)
INSERT dwh.FactSalesOrderHeader(SalesOrderId,CustomerId,OrderDate,SalesOrderNumber,DueDate,ShipDate,OnlineOrderFlag,PurchaseOrderNumber,AccountNumber,Freight,CreditCardApprovalCode,Amount,TaxAmt,FechaAlta,FechaModificacion)
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
  getdate(),
  getdate()
FROM query;