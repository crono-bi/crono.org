IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_SCHEMA='dwh' AND ROUTINE_NAME='cargar' AND ROUTINE_TYPE='PROCEDURE')
DROP PROCEDURE dwh.cargar;

CREATE PROCEDURE dwh.cargar AS
BEGIN

  EXECUTE [LOAD dwh.DimDates] @log;
  EXECUTE [LOAD dwh.DimEmployees] @log;
  EXECUTE [LOAD dwh.DimProducts] @log;
  EXECUTE [LOAD dwh.DimCustomers] @log;
  EXECUTE [LOAD dwh.FactSalesOrderHeader] @log;
  EXECUTE [LOAD dwh.FactSalesOrderDetails] @log;

END