/*
  UPDATE with standard ANSI syntax. Crono SQL supports it
  directly without additional transformation.
*/

UPDATE dwh.FactSalesOrderHeader
SET NetAmount=Amount-TaxAmt
WHERE year(OrderDate)=2017
