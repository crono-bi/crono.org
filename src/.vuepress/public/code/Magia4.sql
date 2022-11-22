;WITH
sales1 AS (
  SELECT
    DimProduct.EnglishProductName AS EnglishProductName,
    sum(sales.OrderQuantity) AS [Ventas 2008]
  FROM FactResellerSales sales
  INNER JOIN DimProduct ON (sales.ProductKey=DimProduct.ProductKey)
  INNER JOIN DimProductSubCategory ON (DimProduct.ProductSubcategoryKey=DimProductSubCategory.ProductSubcategoryKey)
  INNER JOIN DimProductCategory ON (DimProductSubCategory.ProductCategoryKey=DimProductCategory.ProductCategoryKey)
  INNER JOIN DimDate ON (sales.OrderDateKey=DimDate.DateKey)
  WHERE
    DimDate.CalendarYear=2008
    AND DimProductCategory.SpanishProductCategoryName='Bicicleta'
    AND DimDate.SpanishMonthName='Enero'
  GROUP BY DimProduct.EnglishProductName
),
sales2 AS (
  SELECT
    DimProduct.EnglishProductName AS EnglishProductName,
    sum(sales.OrderQuantity) AS [Ventas 2007]
  FROM FactResellerSales sales
  INNER JOIN DimProduct ON (sales.ProductKey=DimProduct.ProductKey)
  INNER JOIN DimProductSubCategory ON (DimProduct.ProductSubcategoryKey=DimProductSubCategory.ProductSubcategoryKey)
  INNER JOIN DimProductCategory ON (DimProductSubCategory.ProductCategoryKey=DimProductCategory.ProductCategoryKey)
  INNER JOIN DimDate ON (sales.OrderDateKey=DimDate.DateKey)
  WHERE
    DimDate.CalendarYear=2007
    AND DimProductCategory.SpanishProductCategoryName='Bicicleta'
    AND DimDate.SpanishMonthName='Enero'
  GROUP BY DimProduct.EnglishProductName
)
SELECT
  coalesce(sales1.EnglishProductName,sales2.EnglishProductName) AS EnglishProductName,
  sales1.[Ventas 2008] AS [Ventas 2008],
  sales2.[Ventas 2007] AS [Ventas 2007],
  sales1.[Ventas 2008]-sales2.[Ventas 2007] AS Diferencia
FROM sales1
FULL JOIN sales2 ON (sales2.EnglishProductName=sales1.EnglishProductName OR (sales2.EnglishProductName IS NULL AND sales1.EnglishProductName IS NULL))