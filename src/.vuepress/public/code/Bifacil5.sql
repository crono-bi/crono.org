SELECT
  coalesce(isales1.CalendarYear,sales1.CalendarYear) CalendarYear,
  isales1.ventasInternet ventasInternet,
  sales1.ventasReseller ventasReseller
FROM 
    (SELECT
      DimDate.CalendarYear AS CalendarYear,
      sum(isales.SalesAmount) AS ventasInternet
    FROM FactInternetSales isales
    INNER JOIN DimDate ON (isales.OrderDateKey=DimDate.DateKey)
    INNER JOIN DimCustomer ON (isales.CustomerKey=DimCustomer.CustomerKey)
    INNER JOIN DimGeography ON (DimCustomer.GeographyKey=DimGeography.GeographyKey)
    WHERE DimGeography.SpanishCountryRegionName='Francia'
    GROUP BY DimDate.CalendarYear) isales1
FULL JOIN 
    (SELECT
      DimDate.CalendarYear AS CalendarYear,
      sum(sales.SalesAmount) AS ventasReseller
    FROM FactResellerSales sales
    INNER JOIN DimReseller ON (sales.ResellerKey=DimReseller.ResellerKey)
    INNER JOIN DimGeography ON (DimReseller.GeographyKey=DimGeography.GeographyKey)
    INNER JOIN DimDate ON (sales.OrderDateKey=DimDate.DateKey)
    WHERE DimGeography.SpanishCountryRegionName='Francia'
    GROUP BY DimDate.CalendarYear) AS sales1 ON (isales1.CalendarYear=sales1.CalendarYear)