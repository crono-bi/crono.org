/*
  Date functions like year(), month() and day()
  are automatically translated to the native syntax
  of the selected database engine.
*/

SELECT
  SalesOrderId,
  OrderDate,
  year(OrderDate) OrderYear,
  month(OrderDate) OrderMonth,
  day(OrderDate) OrderDay
FROM staging.SalesOrderHeader
WHERE year(OrderDate) = 2014
