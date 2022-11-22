IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='dwh' AND TABLE_NAME='DimProducts')
CREATE TABLE dwh.DimProducts(
  ProductSid int IDENTITY(1,1) NOT NULL,
  CONSTRAINT PK_DimProducts PRIMARY KEY CLUSTERED (ProductSid)
)


IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='dwh' AND TABLE_NAME='DimProducts' AND COLUMN_NAME='ProductSid')
ALTER TABLE dwh.DimProducts ADD ProductSid int


IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='dwh' AND TABLE_NAME='DimProducts' AND COLUMN_NAME='ProductSid' AND IS_NULLABLE='YES')
ALTER TABLE dwh.DimProducts ALTER COLUMN ProductSid int NOT NULL


IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA='dwh' AND TABLE_NAME='DimProducts' AND CONSTRAINT_NAME='PK_DimProducts')
ALTER TABLE dwh.DimProducts ADD CONSTRAINT PK_DimProducts PRIMARY KEY CLUSTERED (ProductSid)


IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='dwh' AND TABLE_NAME='DimProducts' AND COLUMN_NAME='FechaAlta')
ALTER TABLE dwh.DimProducts ADD FechaAlta datetime;

ALTER TABLE dwh.DimProducts ALTER COLUMN FechaAlta datetime;

IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='dwh' AND TABLE_NAME='DimProducts' AND COLUMN_NAME='FechaModificacion')
ALTER TABLE dwh.DimProducts ADD FechaModificacion datetime;

ALTER TABLE dwh.DimProducts ALTER COLUMN FechaModificacion datetime;

IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='dwh' AND TABLE_NAME='DimProducts' AND COLUMN_NAME='FechaBaja')
ALTER TABLE dwh.DimProducts ADD FechaBaja datetime;

ALTER TABLE dwh.DimProducts ALTER COLUMN FechaBaja datetime;

CREATE PROCEDURE dbo.[cargar productos] AS
BEGIN

  IF EXISTS (
    SELECT count(*)
    FROM staging.Product
    LEFT JOIN staging.ProductSubCategory ON (Product.ProductSubcategoryID=ProductSubCategory.ProductSubcategoryID)
    LEFT JOIN staging.ProductCategory ON (ProductSubCategory.ProductCategoryId=ProductCategory.ProductCategoryId)
    LEFT JOIN staging.ProductModel ON (Product.ProductModelID=ProductModel.ProductModelID)
    HAVING count(*) <> (SELECT count(*) FROM staging.Product)
  ) THROW 50001,'Las relaciones de esta consulta pierden o duplican registros de Product.',1
  
  
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
  WHEN MATCHED AND ((DimProducts.Product<>query.Product OR (DimProducts.Product IS NULL AND query.Product IS NOT NULL) OR  (DimProducts.Product IS NOT NULL AND query.Product IS NULL)
                    OR DimProducts.ProductCategory<>query.ProductCategory OR (DimProducts.ProductCategory IS NULL AND query.ProductCategory IS NOT NULL) OR  (DimProducts.ProductCategory IS NOT NULL AND query.ProductCategory IS NULL)
                    OR DimProducts.ProductSubCategory<>query.ProductSubCategory OR (DimProducts.ProductSubCategory IS NULL AND query.ProductSubCategory IS NOT NULL) OR  (DimProducts.ProductSubCategory IS NOT NULL AND query.ProductSubCategory IS NULL)
                    OR DimProducts.ProductNumber<>query.ProductNumber OR (DimProducts.ProductNumber IS NULL AND query.ProductNumber IS NOT NULL) OR  (DimProducts.ProductNumber IS NOT NULL AND query.ProductNumber IS NULL)
                    OR DimProducts.ProductModel<>query.ProductModel OR (DimProducts.ProductModel IS NULL AND query.ProductModel IS NOT NULL) OR  (DimProducts.ProductModel IS NOT NULL AND query.ProductModel IS NULL)
                    OR DimProducts.Color<>query.Color OR (DimProducts.Color IS NULL AND query.Color IS NOT NULL) OR  (DimProducts.Color IS NOT NULL AND query.Color IS NULL)
                    OR DimProducts.StandardCost<>query.StandardCost OR (DimProducts.StandardCost IS NULL AND query.StandardCost IS NOT NULL) OR  (DimProducts.StandardCost IS NOT NULL AND query.StandardCost IS NULL)
                    OR DimProducts.ListPrice<>query.ListPrice OR (DimProducts.ListPrice IS NULL AND query.ListPrice IS NOT NULL) OR  (DimProducts.ListPrice IS NOT NULL AND query.ListPrice IS NULL)
                    OR DimProducts.Size<>query.Size OR (DimProducts.Size IS NULL AND query.Size IS NOT NULL) OR  (DimProducts.Size IS NOT NULL AND query.Size IS NULL)
                    OR DimProducts.SizeUnitMeasureCode<>query.SizeUnitMeasureCode OR (DimProducts.SizeUnitMeasureCode IS NULL AND query.SizeUnitMeasureCode IS NOT NULL) OR  (DimProducts.SizeUnitMeasureCode IS NOT NULL AND query.SizeUnitMeasureCode IS NULL)
                    OR DimProducts.Weight<>query.Weight OR (DimProducts.Weight IS NULL AND query.Weight IS NOT NULL) OR  (DimProducts.Weight IS NOT NULL AND query.Weight IS NULL)
                    OR (FechaBaja IS NOT NULL))) THEN
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
      FechaModificacion=getdate(),
      FechaBaja=null
  WHEN NOT MATCHED THEN
    INSERT (ProductID,Product,ProductCategory,ProductSubCategory,ProductNumber,ProductModel,Color,StandardCost,ListPrice,Size,SizeUnitMeasureCode,Weight,FechaAlta,FechaModificacion) VALUES (
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
      getdate(),
      getdate())
  WHEN NOT MATCHED BY SOURCE AND (FechaBaja IS NULL) THEN
    UPDATE SET
      FechaBaja=getdate(),
      FechaModificacion=getdate();
  PRINT 'Se ha cargado la tabla DimProducts';

END