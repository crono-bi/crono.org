/*
  DELETE in Crono SQL: build a SELECT with the records
  to delete. The # character marks the deletion key.
*/

DELETE dwh.FactSalesOrderDetails
SELECT det.SalesOrderDetailSid #SalesOrderDetailSid, det.SalesOrderId
FROM dwh.FactSalesOrderDetails det
INNER JOIN dwh.FactSalesOrderHeader USING SalesOrderSid
INNER JOIN dwh.DimCustomers USING FactSalesOrderHeader(CustomerSid)
WHERE DimCustomers.Customer='Jada Morris'
