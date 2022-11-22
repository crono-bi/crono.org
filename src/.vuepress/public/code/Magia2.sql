SELECT
  DimProduct.EnglishProductName AS EnglishProductName,
  sum(sales.OrderQuantity) AS Unidades
FROM FactResellerSales sales
INNER JOIN DimProduct ON (sales.ProductKey=DimProduct.ProductKey)
INNER JOIN DimProductSubCategory ON (DimProduct.ProductSubcategoryKey=DimProductSubCategory.ProductSubcategoryKey)
INNER JOIN DimProductCategory ON (DimProductSubCategory.ProductCategoryKey=DimProductCategory.ProductCategoryKey)
INNER JOIN DimDate ON (sales.OrderDateKey=DimDate.DateKey)
INNER JOIN DimReseller ON (sales.ResellerKey=DimReseller.ResellerKey)
INNER JOIN DimGeography ON (DimReseller.GeographyKey=DimGeography.GeographyKey)
WHERE
  DimGeography.SpanishCountryRegionName='Alemania'
  AND DimProductCategory.SpanishProductCategoryName='Bicicleta'
  AND DimDate.CalendarYear=2008
GROUP BY DimProduct.EnglishProductName