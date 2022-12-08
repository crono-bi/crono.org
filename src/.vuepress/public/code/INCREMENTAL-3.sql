BEGIN

  DECLARE @last timestamp=(SELECT max(InsertTimestamp) AS expr1
  FROM FactSalesOrderHeader
  );
  
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
      SalesOrderHeader.TaxAmt AS TaxAmt,
      SalesOrderHeader.InsertTimestamp AS InsertTimestamp
    FROM staging.SalesOrderHeader
    INNER JOIN staging.customer ON (SalesOrderHeader.customerId=customer.customerId)
    WHERE SalesOrderHeader.InsertTimestamp>@last
  )
  INSERT dwh.FactSalesOrderHeader(SalesOrderId,CustomerId,OrderDate,SalesOrderNumber,DueDate,ShipDate,OnlineOrderFlag,PurchaseOrderNumber,AccountNumber,Freight,CreditCardApprovalCode,Amount,TaxAmt,InsertTimestamp,InsertDate)
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
    query.InsertTimestamp,
    getdate()
  FROM query;
END
