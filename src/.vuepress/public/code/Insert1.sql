INSERT dwh.DimProducts(ProductID,Product,ProductCategory,ProductSubCategory,ProductNumber,ProductModel,Color,StandardCost,ListPrice,ProductSize,SizeUnitMeasureCode,Weight,WeightUnitMeasureCode)
SELECT
  ProductID,
  Product.Name AS Name,
  ProductCategory.name AS name,
  ProductSubCategory.name AS name,
  ProductNumber,
  ProductModel.name AS name,
  Product.Color AS Color,
  Product.StandardCost AS StandardCost,
  Product.ListPrice AS ListPrice,
  Product.Size AS Size,
  Product.SizeUnitMeasureCode AS SizeUnitMeasureCode,
  Product.Weight AS Weight,
  Product.WeightUnitMeasureCode AS WeightUnitMeasureCode
FROM staging.Product
LEFT JOIN staging.ProductSubCategory ON (Product.ProductSubcategoryID=ProductSubCategory.ProductSubcategoryID)
LEFT JOIN staging.ProductCategory ON (ProductSubCategory.ProductCategoryId=ProductCategory.ProductCategoryId)
LEFT JOIN staging.ProductModel ON (Product.ProductModelID=ProductModel.ProductModelID);