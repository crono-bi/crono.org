SELECT
  year(sales.OrderDate) AS OrderYear,
  month(sales.OrderDate) AS OrderMonth,
  sum(sales.subtotal) AS Amount,
  sum(sum(sales.subtotal)) OVER (PARTITION BY year(sales.OrderDate) ORDER BY month(sales.OrderDate)) AS AmountYTD
FROM staging.SalesOrderHeader sales
GROUP BY
  year(sales.OrderDate),
  month(sales.OrderDate)
ORDER BY
  year(sales.OrderDate),
  month(sales.OrderDate)