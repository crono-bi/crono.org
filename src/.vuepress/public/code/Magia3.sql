SELECT
  DimGeography.SpanishCountryRegionName AS SpanishCountryRegionName,
  sum(sales.OrderQuantity) AS Unidades
FROM FactResellerSales sales
INNER JOIN DimDate ON (sales.OrderDateKey=DimDate.DateKey)
INNER JOIN DimReseller ON (sales.ResellerKey=DimReseller.ResellerKey)
INNER JOIN DimGeography ON (DimReseller.GeographyKey=DimGeography.GeographyKey)
WHERE DimDate.CalendarYear=2008
GROUP BY DimGeography.SpanishCountryRegionName