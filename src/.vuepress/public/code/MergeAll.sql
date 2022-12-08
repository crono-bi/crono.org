IF EXISTS (
  SELECT count(*)
  FROM staging.Product
  LEFT JOIN staging.ProductSubCategory ON (Product.ProductSubcategoryID=ProductSubCategory.ProductSubcategoryID)
  LEFT JOIN staging.ProductCategory ON (ProductSubCategory.ProductCategoryId=ProductCategory.ProductCategoryId)
  LEFT JOIN staging.ProductModel ON (Product.ProductModelID=ProductModel.ProductModelID)
  HAVING count(*) <> (SELECT count(*) FROM staging.Product)
) THROW 50001,'Las relaciones de esta consulta pierden o duplican registros de Product.',1

GO

;WITH
query AS (
  SELECT
    ProductID,
    Product.Name AS Product,
    ProductCategory.name AS ProductCategory,
    ProductSubCategory.name AS ProductSubCategory,
    ProductNumber,
    ProductModel.name AS ProductModel,
    Color,
    StandardCost,
    ListPrice,
    Size,
    SizeUnitMeasureCode,
    Weight
  FROM staging.Product
  LEFT JOIN staging.ProductSubCategory ON (Product.ProductSubcategoryID=ProductSubCategory.ProductSubcategoryID)
  LEFT JOIN staging.ProductCategory ON (ProductSubCategory.ProductCategoryId=ProductCategory.ProductCategoryId)
  LEFT JOIN staging.ProductModel ON (Product.ProductModelID=ProductModel.ProductModelID)
)
MERGE dwh.DimProducts AS DimProducts
USING query ON query.ProductID=DimProducts.ProductID
WHEN MATCHED THEN
  UPDATE SET
    Product=query.Product,
    ProductCategory=query.ProductCategory,
    ProductSubCategory=query.ProductSubCategory,
    ProductNumber=query.ProductNumber,
    ProductModel=query.ProductModel,
    Color=query.Color,
    StandardCost=query.StandardCost,
    ListPrice=query.ListPrice,
    Size=query.Size,
    SizeUnitMeasureCode=query.SizeUnitMeasureCode,
    Weight=query.Weight,
    UpdateDate=getdate()
WHEN NOT MATCHED THEN
  INSERT (ProductID,Product,ProductCategory,ProductSubCategory,ProductNumber,ProductModel,Color,StandardCost,ListPrice,Size,SizeUnitMeasureCode,Weight,InsertDate) VALUES (
    query.ProductID,
    query.Product,
    query.ProductCategory,
    query.ProductSubCategory,
    query.ProductNumber,
    query.ProductModel,
    query.Color,
    query.StandardCost,
    query.ListPrice,
    query.Size,
    query.SizeUnitMeasureCode,
    query.Weight,
    getdate());