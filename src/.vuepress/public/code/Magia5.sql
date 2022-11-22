;WITH
isales1 AS (
  SELECT
    DimDate.CalendarYear AS CalendarYear,
    sum(isales.SalesAmount) AS ventasInternet
  FROM FactInternetSales isales
  INNER JOIN DimDate ON (isales.OrderDateKey=DimDate.DateKey)
  INNER JOIN DimCustomer ON (isales.CustomerKey=DimCustomer.CustomerKey)
  INNER JOIN DimGeography ON (DimCustomer.GeographyKey=DimGeography.GeographyKey)
  WHERE DimGeography.SpanishCountryRegionName='Francia'
  GROUP BY DimDate.CalendarYear
),
sales1 AS (
  SELECT
    DimDate.CalendarYear AS CalendarYear,
    sum(sales.SalesAmount) AS ventasReseller
  FROM FactResellerSales sales
  INNER JOIN DimDate ON (sales.OrderDateKey=DimDate.DateKey)
  INNER JOIN DimReseller ON (sales.ResellerKey=DimReseller.ResellerKey)
  INNER JOIN DimGeography ON (DimReseller.GeographyKey=DimGeography.GeographyKey)
  WHERE DimGeography.SpanishCountryRegionName='Francia'
  GROUP BY DimDate.CalendarYear
)
SELECT
  coalesce(isales1.CalendarYear,sales1.CalendarYear) AS CalendarYear,
  isales1.ventasInternet AS ventasInternet,
  sales1.ventasReseller AS ventasReseller,
  isales1.ventasInternet+sales1.ventasReseller AS VentasTotales
FROM isales1
FULL JOIN sales1 ON (sales1.CalendarYear=isales1.CalendarYear OR (sales1.CalendarYear IS NULL AND isales1.CalendarYear IS NULL))