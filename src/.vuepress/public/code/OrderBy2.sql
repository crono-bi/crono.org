SELECT
  year(sales.OrderDate) AS OrderYear,
  month(sales.OrderDate) AS OrderMonth,
  sum(sales.subtotal) AS Amount
FROM staging.SalesOrderHeader sales
GROUP BY
  year(sales.OrderDate),
  month(sales.OrderDate)
ORDER BY
  1,
  2