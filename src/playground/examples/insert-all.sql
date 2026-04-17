/*
  INSERT ALL inserts all records without checking
  if they already exist. No key (#) required.
  Ideal for fact tables without deduplication.
*/

INSERT ALL dwh.FactSales
SELECT
  SalesOrderId,
  SalesOrderDetailId,
  ProductId,
  OrderQty,
  LineTotal
FROM staging.SalesOrderDetail
