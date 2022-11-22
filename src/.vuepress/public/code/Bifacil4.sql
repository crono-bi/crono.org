SELECT
  coalesce(sales1.EnglishProductName,sales2.EnglishProductName) EnglishProductName,
  sales1.Quantity2007 Quantity2007,
  sales2.Quantity2008 Quantity2008
FROM 
    (SELECT
      DimProduct.EnglishProductName AS EnglishProductName,
      sum(sales.OrderQuantity) AS Quantity2007
    FROM FactResellerSales sales
    INNER JOIN DimProduct ON (sales.ProductKey=DimProduct.ProductKey)
    INNER JOIN DimProductSubCategory ON (DimProduct.ProductSubcategoryKey=DimProductSubCategory.ProductSubcategoryKey)
    INNER JOIN DimProductCategory ON (DimProductSubCategory.ProductCategoryKey=DimProductCategory.ProductCategoryKey)
    INNER JOIN DimDate ON (sales.OrderDateKey=DimDate.DateKey)
    WHERE
      DimDate.CalendarYear=2007
      AND DimProductCategory.SpanishProductCategoryName='Bicicleta'
      AND DimDate.SpanishMonthName='Enero'
    GROUP BY DimProduct.EnglishProductName) sales1
FULL JOIN 
    (SELECT
      DimProduct.EnglishProductName AS EnglishProductName,
      sum(sales.OrderQuantity) AS Quantity2008
    FROM FactResellerSales sales
    INNER JOIN DimProduct ON (sales.ProductKey=DimProduct.ProductKey)
    INNER JOIN DimProductSubCategory ON (DimProduct.ProductSubcategoryKey=DimProductSubCategory.ProductSubcategoryKey)
    INNER JOIN DimProductCategory ON (DimProductSubCategory.ProductCategoryKey=DimProductCategory.ProductCategoryKey)
    INNER JOIN DimDate ON (sales.OrderDateKey=DimDate.DateKey)
    WHERE
      DimDate.CalendarYear=2008
      AND DimProductCategory.SpanishProductCategoryName='Bicicleta'
      AND DimDate.SpanishMonthName='Enero'
    GROUP BY DimProduct.EnglishProductName) AS sales2 ON (sales1.EnglishProductName=sales2.EnglishProductName)