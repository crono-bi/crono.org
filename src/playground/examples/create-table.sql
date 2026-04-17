/*
  CREATE TABLE in Crono SQL is identical to the ANSI standard.
  Native code is generated for the selected engine.
*/

CREATE TABLE dwh.DimProducts (
  ProductSid int identity(1,1),
  ProductID int,
  Product nvarchar(100),
  ProductCategory nvarchar(100),
  ProductSubCategory nvarchar(100),
  ProductNumber nvarchar(50)
)
