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
  FROM @@erp.SalesOrderDetail
  INNER JOIN @@erp.SalesOrderHeader ON (SalesOrderDetail.SalesOrderID=SalesOrderHeader.SalesOrderID)
  INNER JOIN @@erp.SpecialOffer ON (SalesOrderDetail.SpecialOfferID=SpecialOffer.SpecialOfferID)
  INNER JOIN @@erp.Product ON (SalesOrderDetail.ProductID=Product.ProductID)
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