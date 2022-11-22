;WITH
query AS (
  SELECT
    SalesOrderId,
    Amount-TaxAmt AS NetAmount
  FROM dwh.FactSalesOrderHeader
  WHERE year(OrderDate)=2017
)
MERGE dwh.FactSalesOrderHeader AS FactSalesOrderHeader
USING query ON query.SalesOrderId=FactSalesOrderHeader.SalesOrderId
WHEN MATCHED AND ((FactSalesOrderHeader.NetAmount<>query.NetAmount OR (FactSalesOrderHeader.NetAmount IS NULL AND query.NetAmount IS NOT NULL) OR  (FactSalesOrderHeader.NetAmount IS NOT NULL AND query.NetAmount IS NULL))) THEN
  UPDATE SET
    NetAmount=query.NetAmount;