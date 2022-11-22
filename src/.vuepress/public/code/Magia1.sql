SELECT
  DimProduct.EnglishProductName AS Producto,
  sum(sales.OrderQuantity) AS Unidades,
  sum(sales.SalesAmount) AS Importe,
  sum(sales.SalesAmount)/sum(sales.OrderQuantity) AS [Precio Medio]
FROM FactResellerSales sales
INNER JOIN DimProduct ON (sales.ProductKey=DimProduct.ProductKey)
INNER JOIN DimProductSubCategory ON (DimProduct.ProductSubcategoryKey=DimProductSubCategory.ProductSubcategoryKey)
INNER JOIN DimProductCategory ON (DimProductSubCategory.ProductCategoryKey=DimProductCategory.ProductCategoryKey)
INNER JOIN DimDate ON (sales.OrderDateKey=DimDate.DateKey)
WHERE
  DimProductCategory.SpanishProductCategoryName='Bicicleta'
  AND DimDate.SpanishMonthName='Enero'
  AND DimDate.CalendarYear=2008
GROUP BY DimProduct.EnglishProductName
ORDER BY [Precio Medio] DESC