CREATE TABLE dwh.FactSalesOrderDetails(
  SalesOrderDetailSid int IDENTITY(1,1) NOT NULL,
  SalesOrderDetailID int NULL,
  ProductSid int NOT NULL,
  SalesOrderSid int NOT NULL,
  CarrierTrackingNumber nvarchar(25) NULL,
  OrderQty smallint NULL,
  UnitPrice decimal(18,10) NULL,
  UnitPriceDiscount decimal(18,10) NULL,
  LineTotal decimal(18,10) NULL,
  SpecialOffer nvarchar(255) NULL,
  SpecialOfferType nvarchar(50) NULL,
  SpecialOfferCategory nvarchar(50) NULL,
  InsertDate datetime NOT NULL,
  UpdateDate datetime NULL,
  CONSTRAINT BK_FactSalesOrderDetails UNIQUE (SalesOrderDetailID),
  CONSTRAINT PK_FactSalesOrderDetails PRIMARY KEY CLUSTERED (SalesOrderDetailSid)
)

GO

ALTER TABLE dwh.FactSalesOrderDetails ADD CONSTRAINT [FK dwh.FactSalesOrderDetails(ProductSid) dwh.DimProducts] FOREIGN KEY (ProductSid) REFERENCES dwh.DimProducts(ProductSid)
GO

ALTER TABLE dwh.FactSalesOrderDetails ADD CONSTRAINT [FK dwh.FactSalesOrderDetails(SalesOrderSid) dwh.FactSalesOrderHeader] FOREIGN KEY (SalesOrderSid) REFERENCES dwh.FactSalesOrderHeader(SalesOrderSid)
GO

CREATE INDEX [INDEX dwh.FactSalesOrderDetails ProductSid] ON dwh.FactSalesOrderDetails(ProductSid)

GO

CREATE INDEX [INDEX dwh.FactSalesOrderDetails SalesOrderSid] ON dwh.FactSalesOrderDetails(SalesOrderSid)

GO

IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_NAME='LOAD dwh.FactSalesOrderDetails' AND ROUTINE_TYPE='PROCEDURE')
DROP PROCEDURE [LOAD dwh.FactSalesOrderDetails];
GO

CREATE PROCEDURE [LOAD dwh.FactSalesOrderDetails](@logPadre int=NULL) AS
BEGIN

  DECLARE @procedure_name varchar(100)='[LOAD dwh.FactSalesOrderDetails]'
  
  DECLARE @procedure_hash varchar(100)='D3B7FDA0D66B341F12BE2E5226A5E1FC'
  
  
  /* ---------------------------------------------------------------------------------------------------------------------
     Este procedimiento se ha creado automáticamente con una herramienta.
    
     Crono ETL automatiza la generación de código SQL en entornos Data Warehouse, incluyendo 
     la modelización del DWH, la optimización de cargas completas e incrementales, y la generación de logs y documentación. 
    
     Modifique este procedimiento solo con CRONO ETL.
   -----------------------------------------------------------------------------------------------------------------------*/
  
  
  DECLARE @statementId int;
  
  DECLARE @rowcount int;
  
  SET NOCOUNT ON;
  
  PRINT 'Ejecutando '+@procedure_name;
  
  ;WITH
  query AS (
    SELECT @logPadre AS IdLogPadre, @procedure_name AS procedimiento, getdate() AS FechaInicio, CAST(@@spid AS varchar(5)) AS spid, SUSER_NAME() AS usuario, @procedure_hash AS hash
  )
  INSERT audit.Logs(IdLogPadre,procedimiento,FechaInicio,spid,usuario,hash)
  SELECT
    query.IdLogPadre,
    query.procedimiento,
    query.FechaInicio,
    query.spid,
    query.usuario,
    query.hash
  FROM query;
  
  DECLARE @log int=@@identity;
  
  DECLARE @logCarga int=(SELECT IdLogCarga
  FROM audit.Logs
  WHERE IdLog=@logPadre
  );
  
  DECLARE @nivel int=(SELECT nivel
  FROM audit.Logs
  WHERE IdLog=@logPadre
  );
  
  UPDATE audit.Logs SET
    IdLogCarga=coalesce(@logCarga,@log),
    nivel=coalesce(@nivel+1,0)
  WHERE
    IdLog=@log;
  
  DECLARE @Continuar bit=0;
  
     BEGIN TRY 	
  
  
  /* ---------------------------------------------------------------
    A continuación comienza la parte principal del procedimiento
  ------------------------------------------------------------------*/
  
  DECLARE @cronostatement_hash varchar(100)
  DECLARE @statement_count int
  DECLARE @statement_hash varchar(100)
  SET @cronostatement_hash='4CE99A8DC4F078079ECA6E962184312C'
  SET @statement_count=1
  SET @statement_hash='2F9876FB980BDFB04CC82F91A14DA1F4'
  ;WITH query AS (SELECT @log AS IdLog, getdate() AS FechaInicio, @procedure_name AS Procedimiento, @statement_count AS NumeroSentencia, @cronostatement_hash AS CronoHash, @statement_hash AS Hash) INSERT audit.Logstatements(IdLog,FechaInicio,Procedimiento,NumeroSentencia,CronoHash,Hash) SELECT query.IdLog, query.FechaInicio, query.Procedimiento, query.NumeroSentencia, query.CronoHash, query.Hash FROM query;
  SET @statementId=@@identity;
  
  IF EXISTS (
    SELECT count(*)
    FROM [yz8r786vwe.database.windows.net].AdventureWorks2016.staging.SalesOrderDetail
    LEFT JOIN [yz8r786vwe.database.windows.net].AdventureWorks2016.staging.SalesOrderHeader ON (SalesOrderDetail.SalesOrderID=SalesOrderHeader.SalesOrderID)
    LEFT JOIN [yz8r786vwe.database.windows.net].AdventureWorks2016.staging.SpecialOffer ON (SalesOrderDetail.SpecialOfferID=SpecialOffer.SpecialOfferID)
    LEFT JOIN [yz8r786vwe.database.windows.net].AdventureWorks2016.staging.Product ON (SalesOrderDetail.ProductID=Product.ProductID)
    LEFT JOIN dwh.DimProducts ON (Product.ProductID=DimProducts.ProductID)
    LEFT JOIN dwh.FactSalesOrderHeader ON (SalesOrderHeader.SalesOrderID=FactSalesOrderHeader.SalesOrderID)
    HAVING count(CASE WHEN SalesOrderHeader.SalesOrderID IS NOT NULL AND SpecialOffer.SpecialOfferID IS NOT NULL AND Product.ProductID IS NOT NULL AND DimProducts.ProductID IS NOT NULL AND FactSalesOrderHeader.SalesOrderID IS NOT NULL THEN 1 END) <> (SELECT count(*) FROM [yz8r786vwe.database.windows.net].AdventureWorks2016.staging.SalesOrderDetail)
  ) THROW 50001,'Las relaciones de esta consulta pierden o duplican registros de SalesOrderDetail.',1
  
  SET @rowcount=@@ROWCOUNT;
  UPDATE audit.Logstatements SET FechaFin=getdate(), DuracionSegundos=datediff(second,FechaInicio,getdate()), NumeroRegistros=@rowcount WHERE IdStatement=@statementId;
  
  SET @statement_count=2
  SET @statement_hash='4473AFB9914869CC576E69173353EA1D'
  ;WITH query AS (SELECT @log AS IdLog, getdate() AS FechaInicio, @procedure_name AS Procedimiento, @statement_count AS NumeroSentencia, @cronostatement_hash AS CronoHash, @statement_hash AS Hash) INSERT audit.Logstatements(IdLog,FechaInicio,Procedimiento,NumeroSentencia,CronoHash,Hash) SELECT query.IdLog, query.FechaInicio, query.Procedimiento, query.NumeroSentencia, query.CronoHash, query.Hash FROM query;
  SET @statementId=@@identity;
  
  ;WITH
  query AS (
    SELECT
      SalesOrderDetail.SalesOrderDetailID AS SalesOrderDetailID,
      DimProducts.ProductSid AS ProductSid,
      FactSalesOrderHeader.SalesOrderSid AS SalesOrderSid,
      SalesOrderDetail.CarrierTrackingNumber AS CarrierTrackingNumber,
      SalesOrderDetail.OrderQty AS OrderQty,
      SalesOrderDetail.UnitPrice AS UnitPrice,
      SalesOrderDetail.UnitPriceDiscount AS UnitPriceDiscount,
      SalesOrderDetail.LineTotal AS LineTotal,
      SpecialOffer.Description AS SpecialOffer,
      SpecialOffer.Type AS SpecialOfferType,
      SpecialOffer.Category AS SpecialOfferCategory
    FROM [yz8r786vwe.database.windows.net].AdventureWorks2016.staging.SalesOrderDetail
    INNER JOIN [yz8r786vwe.database.windows.net].AdventureWorks2016.staging.SalesOrderHeader ON (SalesOrderDetail.SalesOrderID=SalesOrderHeader.SalesOrderID)
    INNER JOIN [yz8r786vwe.database.windows.net].AdventureWorks2016.staging.SpecialOffer ON (SalesOrderDetail.SpecialOfferID=SpecialOffer.SpecialOfferID)
    INNER JOIN [yz8r786vwe.database.windows.net].AdventureWorks2016.staging.Product ON (SalesOrderDetail.ProductID=Product.ProductID)
    INNER JOIN dwh.DimProducts ON (Product.ProductID=DimProducts.ProductID)
    INNER JOIN dwh.FactSalesOrderHeader ON (SalesOrderHeader.SalesOrderID=FactSalesOrderHeader.SalesOrderID)
  )
  MERGE dwh.FactSalesOrderDetails AS FactSalesOrderDetails
  USING query ON query.SalesOrderDetailID=FactSalesOrderDetails.SalesOrderDetailID
  WHEN MATCHED AND ((FactSalesOrderDetails.ProductSid<>query.ProductSid OR (FactSalesOrderDetails.ProductSid IS NULL AND query.ProductSid IS NOT NULL) OR  (FactSalesOrderDetails.ProductSid IS NOT NULL AND query.ProductSid IS NULL)
                    OR FactSalesOrderDetails.SalesOrderSid<>query.SalesOrderSid OR (FactSalesOrderDetails.SalesOrderSid IS NULL AND query.SalesOrderSid IS NOT NULL) OR  (FactSalesOrderDetails.SalesOrderSid IS NOT NULL AND query.SalesOrderSid IS NULL)
                    OR FactSalesOrderDetails.CarrierTrackingNumber<>query.CarrierTrackingNumber OR (FactSalesOrderDetails.CarrierTrackingNumber IS NULL AND query.CarrierTrackingNumber IS NOT NULL) OR  (FactSalesOrderDetails.CarrierTrackingNumber IS NOT NULL AND query.CarrierTrackingNumber IS NULL)
                    OR FactSalesOrderDetails.OrderQty<>query.OrderQty OR (FactSalesOrderDetails.OrderQty IS NULL AND query.OrderQty IS NOT NULL) OR  (FactSalesOrderDetails.OrderQty IS NOT NULL AND query.OrderQty IS NULL)
                    OR FactSalesOrderDetails.UnitPrice<>query.UnitPrice OR (FactSalesOrderDetails.UnitPrice IS NULL AND query.UnitPrice IS NOT NULL) OR  (FactSalesOrderDetails.UnitPrice IS NOT NULL AND query.UnitPrice IS NULL)
                    OR FactSalesOrderDetails.UnitPriceDiscount<>query.UnitPriceDiscount OR (FactSalesOrderDetails.UnitPriceDiscount IS NULL AND query.UnitPriceDiscount IS NOT NULL) OR  (FactSalesOrderDetails.UnitPriceDiscount IS NOT NULL AND query.UnitPriceDiscount IS NULL)
                    OR FactSalesOrderDetails.LineTotal<>query.LineTotal OR (FactSalesOrderDetails.LineTotal IS NULL AND query.LineTotal IS NOT NULL) OR  (FactSalesOrderDetails.LineTotal IS NOT NULL AND query.LineTotal IS NULL)
                    OR FactSalesOrderDetails.SpecialOffer<>query.SpecialOffer OR (FactSalesOrderDetails.SpecialOffer IS NULL AND query.SpecialOffer IS NOT NULL) OR  (FactSalesOrderDetails.SpecialOffer IS NOT NULL AND query.SpecialOffer IS NULL)
                    OR FactSalesOrderDetails.SpecialOfferType<>query.SpecialOfferType OR (FactSalesOrderDetails.SpecialOfferType IS NULL AND query.SpecialOfferType IS NOT NULL) OR  (FactSalesOrderDetails.SpecialOfferType IS NOT NULL AND query.SpecialOfferType IS NULL)
                    OR FactSalesOrderDetails.SpecialOfferCategory<>query.SpecialOfferCategory OR (FactSalesOrderDetails.SpecialOfferCategory IS NULL AND query.SpecialOfferCategory IS NOT NULL) OR  (FactSalesOrderDetails.SpecialOfferCategory IS NOT NULL AND query.SpecialOfferCategory IS NULL))) THEN
    UPDATE SET
      ProductSid=query.ProductSid,
      SalesOrderSid=query.SalesOrderSid,
      CarrierTrackingNumber=query.CarrierTrackingNumber,
      OrderQty=query.OrderQty,
      UnitPrice=query.UnitPrice,
      UnitPriceDiscount=query.UnitPriceDiscount,
      LineTotal=query.LineTotal,
      SpecialOffer=query.SpecialOffer,
      SpecialOfferType=query.SpecialOfferType,
      SpecialOfferCategory=query.SpecialOfferCategory,
      UpdateDate=getdate()
  WHEN NOT MATCHED THEN
    INSERT (SalesOrderDetailID,ProductSid,SalesOrderSid,CarrierTrackingNumber,OrderQty,UnitPrice,UnitPriceDiscount,LineTotal,SpecialOffer,SpecialOfferType,SpecialOfferCategory,InsertDate) VALUES (
      query.SalesOrderDetailID,
      query.ProductSid,
      query.SalesOrderSid,
      query.CarrierTrackingNumber,
      query.OrderQty,
      query.UnitPrice,
      query.UnitPriceDiscount,
      query.LineTotal,
      query.SpecialOffer,
      query.SpecialOfferType,
      query.SpecialOfferCategory,
      getdate())
  WHEN NOT MATCHED BY SOURCE THEN
    DELETE;
  
  SET @rowcount=@@ROWCOUNT;
  UPDATE audit.Logstatements SET FechaFin=getdate(), DuracionSegundos=datediff(second,FechaInicio,getdate()), NumeroRegistros=@rowcount WHERE IdStatement=@statementId;
  
  
  /* ---------------------------------------------------------------
    El procedimiento termina con el registro de logs y la gestión de errores.
  ------------------------------------------------------------------*/
  
  
  UPDATE audit.Logs SET
    NumRegistros=@@ROWCOUNT,
    DuracionSegundos=datediff(second,FechaInicio,getdate()),
    FechaFin=getdate()
  WHERE
    IdLog=@log;
  
  ;WITH
  query AS (
    SELECT
      @log AS IdLog,
      CASE WHEN count(*)=0 THEN 0 ELSE 1 END AS EsPadre
    FROM audit.Logs
    WHERE logs.IdLogPadre=@log
  )
  MERGE audit.Logs AS Logs
  USING query ON query.IdLog=Logs.IdLog
  WHEN MATCHED AND ((Logs.EsPadre<>query.EsPadre OR (Logs.EsPadre IS NULL AND query.EsPadre IS NOT NULL) OR  (Logs.EsPadre IS NOT NULL AND query.EsPadre IS NULL))) THEN
    UPDATE SET
      EsPadre=query.EsPadre;
  
   END TRY
  
   BEGIN CATCH
  
  UPDATE audit.Logs SET
    FechaFin=getdate(),
    MensajeError=ERROR_MESSAGE()
  WHERE
    IdLog=@log;
  
  ;WITH
  query AS (
    SELECT
      @log AS IdLog,
      CASE WHEN count(*)=0 THEN 0 ELSE 1 END AS EsPadre
    FROM audit.Logs
    WHERE logs.IdLogPadre=@log
  )
  MERGE audit.Logs AS Logs
  USING query ON query.IdLog=Logs.IdLog
  WHEN MATCHED AND ((Logs.EsPadre<>query.EsPadre OR (Logs.EsPadre IS NULL AND query.EsPadre IS NOT NULL) OR  (Logs.EsPadre IS NOT NULL AND query.EsPadre IS NULL))) THEN
    UPDATE SET
      EsPadre=query.EsPadre;
  
  IF @Continuar=0 THROW
  
  	END CATCH
  
  DECLARE @LastExecutedDate datetime=getdate();
  
  IF EXISTS (SELECT p.Name AS Name FROM sys.extended_properties p INNER JOIN sys.all_objects sp ON (p.major_id=sp.object_id) WHERE p.minor_id=0 AND p.class=1 AND SCHEMA_NAME(sp.schema_id)='dbo' AND sp.name='LOAD dwh.FactSalesOrderDetails' AND p.Name='LastExecutedDate')
  EXEC sys.sp_dropextendedproperty @level0type = 'SCHEMA',  @level0name = 'dbo',    @level1type = 'PROCEDURE', @level1name = 'LOAD dwh.FactSalesOrderDetails', @name = 'LastExecutedDate'
  
  EXEC sys.sp_addextendedproperty @level0type = 'SCHEMA',  @level0name = 'dbo',    @level1type = 'PROCEDURE', @level1name = 'LOAD dwh.FactSalesOrderDetails', @name = 'LastExecutedDate', @value=@LastExecutedDate
  

END

GO

EXEC sys.sp_addextendedproperty @level0type = 'SCHEMA',  @level0name = 'dbo',    @level1type = 'PROCEDURE', @level1name = 'LOAD dwh.FactSalesOrderDetails', @name = 'Hash', @value='D3B7FDA0D66B341F12BE2E5226A5E1FC' 
GO

EXEC sys.sp_addextendedproperty @level0type = 'SCHEMA',  @level0name = 'dbo',    @level1type = 'PROCEDURE', @level1name = 'LOAD dwh.FactSalesOrderDetails', @name = 'UserName', @value='SELVA\pauur' 
GO

EXEC sys.sp_addextendedproperty @level0type = 'SCHEMA',  @level0name = 'dbo',    @level1type = 'PROCEDURE', @level1name = 'LOAD dwh.FactSalesOrderDetails', @name = 'CronoVersion', @value='Crono ETL 22.49' 
GO

EXEC sys.sp_addextendedproperty @level0type = 'SCHEMA',  @level0name = 'dbo',    @level1type = 'PROCEDURE', @level1name = 'LOAD dwh.FactSalesOrderDetails', @name = 'LoadType', @value='Clone' 
GO

EXEC sys.sp_addextendedproperty @level0type = 'SCHEMA',  @level0name = 'dbo',    @level1type = 'PROCEDURE', @level1name = 'LOAD dwh.FactSalesOrderDetails', @name = 'TableName', @value='FactSalesOrderDetails' 
GO

EXEC sys.sp_addextendedproperty @level0type = 'SCHEMA',  @level0name = 'dbo',    @level1type = 'PROCEDURE', @level1name = 'LOAD dwh.FactSalesOrderDetails', @name = 'SchemaTableName', @value='dwh' 