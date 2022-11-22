IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='dwh' AND TABLE_NAME='FactSalesOrderHeader')
CREATE TABLE dwh.FactSalesOrderHeader(
  SalesOrderSid int IDENTITY(1,1) NOT NULL,
  CONSTRAINT PK_FactSalesOrderHeader PRIMARY KEY CLUSTERED (SalesOrderSid)
)


IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='dwh' AND TABLE_NAME='FactSalesOrderHeader' AND COLUMN_NAME='SalesOrderSid')
ALTER TABLE dwh.FactSalesOrderHeader ADD SalesOrderSid int


IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='dwh' AND TABLE_NAME='FactSalesOrderHeader' AND COLUMN_NAME='SalesOrderSid' AND IS_NULLABLE='YES')
ALTER TABLE dwh.FactSalesOrderHeader ALTER COLUMN SalesOrderSid int NOT NULL


IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA='dwh' AND TABLE_NAME='FactSalesOrderHeader' AND CONSTRAINT_NAME='PK_FactSalesOrderHeader')
ALTER TABLE dwh.FactSalesOrderHeader ADD CONSTRAINT PK_FactSalesOrderHeader PRIMARY KEY CLUSTERED (SalesOrderSid)


IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='dwh' AND TABLE_NAME='FactSalesOrderHeader' AND COLUMN_NAME='FechaAlta')
ALTER TABLE dwh.FactSalesOrderHeader ADD FechaAlta datetime;

ALTER TABLE dwh.FactSalesOrderHeader ALTER COLUMN FechaAlta datetime;

IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='dwh' AND TABLE_NAME='FactSalesOrderHeader' AND COLUMN_NAME='FechaModificacion')
ALTER TABLE dwh.FactSalesOrderHeader ADD FechaModificacion datetime;

ALTER TABLE dwh.FactSalesOrderHeader ALTER COLUMN FechaModificacion datetime;

IF EXISTS (
  SELECT count(*)
  FROM staging.SalesOrderHeader
  LEFT JOIN staging.Employee ON (SalesOrderHeader.SalesPersonId=Employee.BusinessEntityId)
  LEFT JOIN staging.Address BillToAddress ON (SalesOrderHeader.BilltoAddressID=BillToAddress.AddressId)
  LEFT JOIN staging.StateProvince BillToProvince ON (BillToAddress.StateProvinceId=BillToProvince.StateProvinceId)
  LEFT JOIN staging.CountryRegion BillToCountry ON (BillToProvince.CountryRegionCode=BillToCountry.CountryRegionCode)
  LEFT JOIN staging.Address ShipToAddress ON (SalesOrderHeader.ShiptoAddressID=ShipToAddress.AddressId)
  LEFT JOIN staging.StateProvince ShipToProvince ON (ShipToAddress.StateProvinceId=ShipToProvince.StateProvinceId)
  LEFT JOIN staging.CountryRegion ShipToCountry ON (ShipToProvince.CountryRegionCode=ShipToCountry.CountryRegionCode)
  LEFT JOIN staging.ShipMethod ON (SalesOrderHeader.ShipMethodId=ShipMethod.ShipMethodId)
  LEFT JOIN staging.person SalesPersonPerson ON (SalesOrderHeader.SalesPersonID=SalesPersonPerson.BusinessEntityID)
  LEFT JOIN staging.CurrencyRate ON (SalesOrderHeader.currencyRateID=CurrencyRate.currencyRateID)
  LEFT JOIN staging.Currency ON (CurrencyRate.ToCurrencycode=Currency.CurrencyCode)
  LEFT JOIN staging.CreditCard ON (SalesOrderHeader.CreditCardId=CreditCard.CreditCardId)
  LEFT JOIN staging.PersonCreditCard ON (CreditCard.CreditCardId=PersonCreditCard.CreditCardId)
  LEFT JOIN staging.person CreditCardPerson ON (PersonCreditCard.BusinessEntityID=CreditCardPerson.BusinessEntityID)
  LEFT JOIN staging.customer ON (SalesOrderHeader.customerId=customer.customerId)
  LEFT JOIN dwh.DimCustomers ON (Customer.CustomerId=DimCustomers.CustomerId)
  HAVING count(CASE WHEN BillToAddress.AddressId IS NOT NULL AND BillToProvince.StateProvinceId IS NOT NULL AND BillToCountry.CountryRegionCode IS NOT NULL AND ShipToAddress.AddressId IS NOT NULL AND ShipToProvince.StateProvinceId IS NOT NULL AND ShipToCountry.CountryRegionCode IS NOT NULL AND ShipMethod.ShipMethodId IS NOT NULL AND customer.customerId IS NOT NULL AND DimCustomers.CustomerId IS NOT NULL THEN 1 END) <> (SELECT count(*) FROM staging.SalesOrderHeader)
) THROW 50001,'Las relaciones de esta consulta pierden o duplican registros de SalesOrderHeader.',1


;WITH
query AS (
  SELECT
    SalesOrderHeader.SalesOrderId AS SalesOrderId,
    DimCustomers.CustomerSid AS CustomerSid,
    CAST(SalesOrderHeader.OrderDate AS date) AS OrderDate,
    SalesOrderHeader.SalesOrderNumber AS SalesOrderNumber,
    CAST(SalesOrderHeader.DueDate AS date) AS DueDate,
    CAST(SalesOrderHeader.ShipDate AS date) AS ShipDate,
    SalesOrderHeader.OnlineOrderFlag AS OnlineOrderFlag,
    SalesOrderHeader.PurchaseOrderNumber AS PurchaseOrderNumber,
    SalesOrderHeader.AccountNumber AS AccountNumber,
    SalesOrderHeader.Freight AS Freight,
    SalesOrderHeader.CreditCardApprovalCode AS CreditCardApprovalCode,
    ShipMethod.Name AS ShippingMethod,
    concat(SalesPersonPerson.FirstName,' ',SalesPersonPerson.LastName) AS SalesPerson,
    Currency.Name AS OriginalCurrency,
    BillToCountry.Name AS BillCountry,
    BillToProvince.Name AS BillProvince,
    BillToAddress.City AS BillCity,
    BillToAddress.AddressLine1 AS BillAdressLine1,
    BillToAddress.AddressLine2 AS BillAddressLine2,
    BillToAddress.PostalCode AS BillPostalCode,
    ShipToCountry.Name AS ShipCountry,
    ShipToProvince.Name AS ShipProvince,
    ShipToAddress.City AS ShipCity,
    ShipToAddress.AddressLine1 AS ShipAdressLine1,
    ShipToAddress.AddressLine2 AS ShipAddressLine2,
    ShipToAddress.PostalCode AS ShipPostalCode,
    concat(CreditCardPerson.FirstName,' ',CreditCardPerson.LastName) AS CreditCardPerson,
    CreditCard.CardType AS CardType,
    CreditCard.CardNumber AS CardNumber,
    SalesOrderHeader.TaxAmt AS TaxAmt
  FROM staging.SalesOrderHeader
  LEFT JOIN staging.Employee ON (SalesOrderHeader.SalesPersonId=Employee.BusinessEntityId)
  INNER JOIN staging.Address BillToAddress ON (SalesOrderHeader.BilltoAddressID=BillToAddress.AddressId)
  INNER JOIN staging.StateProvince BillToProvince ON (BillToAddress.StateProvinceId=BillToProvince.StateProvinceId)
  INNER JOIN staging.CountryRegion BillToCountry ON (BillToProvince.CountryRegionCode=BillToCountry.CountryRegionCode)
  INNER JOIN staging.Address ShipToAddress ON (SalesOrderHeader.ShiptoAddressID=ShipToAddress.AddressId)
  INNER JOIN staging.StateProvince ShipToProvince ON (ShipToAddress.StateProvinceId=ShipToProvince.StateProvinceId)
  INNER JOIN staging.CountryRegion ShipToCountry ON (ShipToProvince.CountryRegionCode=ShipToCountry.CountryRegionCode)
  INNER JOIN staging.ShipMethod ON (SalesOrderHeader.ShipMethodId=ShipMethod.ShipMethodId)
  LEFT JOIN staging.person SalesPersonPerson ON (SalesOrderHeader.SalesPersonID=SalesPersonPerson.BusinessEntityID)
  LEFT JOIN staging.CurrencyRate ON (SalesOrderHeader.currencyRateID=CurrencyRate.currencyRateID)
  LEFT JOIN staging.Currency ON (CurrencyRate.ToCurrencycode=Currency.CurrencyCode)
  LEFT JOIN staging.CreditCard ON (SalesOrderHeader.CreditCardId=CreditCard.CreditCardId)
  LEFT JOIN staging.PersonCreditCard ON (CreditCard.CreditCardId=PersonCreditCard.CreditCardId)
  LEFT JOIN staging.person CreditCardPerson ON (PersonCreditCard.BusinessEntityID=CreditCardPerson.BusinessEntityID)
  INNER JOIN staging.customer ON (SalesOrderHeader.customerId=customer.customerId)
  INNER JOIN dwh.DimCustomers ON (Customer.CustomerId=DimCustomers.CustomerId)
)
MERGE dwh.FactSalesOrderHeader AS FactSalesOrderHeader
USING query ON query.SalesOrderId=FactSalesOrderHeader.SalesOrderId
WHEN MATCHED AND ((FactSalesOrderHeader.CustomerSid<>query.CustomerSid OR (FactSalesOrderHeader.CustomerSid IS NULL AND query.CustomerSid IS NOT NULL) OR  (FactSalesOrderHeader.CustomerSid IS NOT NULL AND query.CustomerSid IS NULL)
                  OR FactSalesOrderHeader.OrderDate<>query.OrderDate OR (FactSalesOrderHeader.OrderDate IS NULL AND query.OrderDate IS NOT NULL) OR  (FactSalesOrderHeader.OrderDate IS NOT NULL AND query.OrderDate IS NULL)
                  OR FactSalesOrderHeader.SalesOrderNumber<>query.SalesOrderNumber OR (FactSalesOrderHeader.SalesOrderNumber IS NULL AND query.SalesOrderNumber IS NOT NULL) OR  (FactSalesOrderHeader.SalesOrderNumber IS NOT NULL AND query.SalesOrderNumber IS NULL)
                  OR FactSalesOrderHeader.DueDate<>query.DueDate OR (FactSalesOrderHeader.DueDate IS NULL AND query.DueDate IS NOT NULL) OR  (FactSalesOrderHeader.DueDate IS NOT NULL AND query.DueDate IS NULL)
                  OR FactSalesOrderHeader.ShipDate<>query.ShipDate OR (FactSalesOrderHeader.ShipDate IS NULL AND query.ShipDate IS NOT NULL) OR  (FactSalesOrderHeader.ShipDate IS NOT NULL AND query.ShipDate IS NULL)
                  OR FactSalesOrderHeader.OnlineOrderFlag<>query.OnlineOrderFlag OR (FactSalesOrderHeader.OnlineOrderFlag IS NULL AND query.OnlineOrderFlag IS NOT NULL) OR  (FactSalesOrderHeader.OnlineOrderFlag IS NOT NULL AND query.OnlineOrderFlag IS NULL)
                  OR FactSalesOrderHeader.PurchaseOrderNumber<>query.PurchaseOrderNumber OR (FactSalesOrderHeader.PurchaseOrderNumber IS NULL AND query.PurchaseOrderNumber IS NOT NULL) OR  (FactSalesOrderHeader.PurchaseOrderNumber IS NOT NULL AND query.PurchaseOrderNumber IS NULL)
                  OR FactSalesOrderHeader.AccountNumber<>query.AccountNumber OR (FactSalesOrderHeader.AccountNumber IS NULL AND query.AccountNumber IS NOT NULL) OR  (FactSalesOrderHeader.AccountNumber IS NOT NULL AND query.AccountNumber IS NULL)
                  OR FactSalesOrderHeader.Freight<>query.Freight OR (FactSalesOrderHeader.Freight IS NULL AND query.Freight IS NOT NULL) OR  (FactSalesOrderHeader.Freight IS NOT NULL AND query.Freight IS NULL)
                  OR FactSalesOrderHeader.CreditCardApprovalCode<>query.CreditCardApprovalCode OR (FactSalesOrderHeader.CreditCardApprovalCode IS NULL AND query.CreditCardApprovalCode IS NOT NULL) OR  (FactSalesOrderHeader.CreditCardApprovalCode IS NOT NULL AND query.CreditCardApprovalCode IS NULL)
                  OR FactSalesOrderHeader.ShippingMethod<>query.ShippingMethod OR (FactSalesOrderHeader.ShippingMethod IS NULL AND query.ShippingMethod IS NOT NULL) OR  (FactSalesOrderHeader.ShippingMethod IS NOT NULL AND query.ShippingMethod IS NULL)
                  OR FactSalesOrderHeader.SalesPerson<>query.SalesPerson OR (FactSalesOrderHeader.SalesPerson IS NULL AND query.SalesPerson IS NOT NULL) OR  (FactSalesOrderHeader.SalesPerson IS NOT NULL AND query.SalesPerson IS NULL)
                  OR FactSalesOrderHeader.OriginalCurrency<>query.OriginalCurrency OR (FactSalesOrderHeader.OriginalCurrency IS NULL AND query.OriginalCurrency IS NOT NULL) OR  (FactSalesOrderHeader.OriginalCurrency IS NOT NULL AND query.OriginalCurrency IS NULL)
                  OR FactSalesOrderHeader.BillCountry<>query.BillCountry OR (FactSalesOrderHeader.BillCountry IS NULL AND query.BillCountry IS NOT NULL) OR  (FactSalesOrderHeader.BillCountry IS NOT NULL AND query.BillCountry IS NULL)
                  OR FactSalesOrderHeader.BillProvince<>query.BillProvince OR (FactSalesOrderHeader.BillProvince IS NULL AND query.BillProvince IS NOT NULL) OR  (FactSalesOrderHeader.BillProvince IS NOT NULL AND query.BillProvince IS NULL)
                  OR FactSalesOrderHeader.BillCity<>query.BillCity OR (FactSalesOrderHeader.BillCity IS NULL AND query.BillCity IS NOT NULL) OR  (FactSalesOrderHeader.BillCity IS NOT NULL AND query.BillCity IS NULL)
                  OR FactSalesOrderHeader.BillAdressLine1<>query.BillAdressLine1 OR (FactSalesOrderHeader.BillAdressLine1 IS NULL AND query.BillAdressLine1 IS NOT NULL) OR  (FactSalesOrderHeader.BillAdressLine1 IS NOT NULL AND query.BillAdressLine1 IS NULL)
                  OR FactSalesOrderHeader.BillAddressLine2<>query.BillAddressLine2 OR (FactSalesOrderHeader.BillAddressLine2 IS NULL AND query.BillAddressLine2 IS NOT NULL) OR  (FactSalesOrderHeader.BillAddressLine2 IS NOT NULL AND query.BillAddressLine2 IS NULL)
                  OR FactSalesOrderHeader.BillPostalCode<>query.BillPostalCode OR (FactSalesOrderHeader.BillPostalCode IS NULL AND query.BillPostalCode IS NOT NULL) OR  (FactSalesOrderHeader.BillPostalCode IS NOT NULL AND query.BillPostalCode IS NULL)
                  OR FactSalesOrderHeader.ShipCountry<>query.ShipCountry OR (FactSalesOrderHeader.ShipCountry IS NULL AND query.ShipCountry IS NOT NULL) OR  (FactSalesOrderHeader.ShipCountry IS NOT NULL AND query.ShipCountry IS NULL)
                  OR FactSalesOrderHeader.ShipProvince<>query.ShipProvince OR (FactSalesOrderHeader.ShipProvince IS NULL AND query.ShipProvince IS NOT NULL) OR  (FactSalesOrderHeader.ShipProvince IS NOT NULL AND query.ShipProvince IS NULL)
                  OR FactSalesOrderHeader.ShipCity<>query.ShipCity OR (FactSalesOrderHeader.ShipCity IS NULL AND query.ShipCity IS NOT NULL) OR  (FactSalesOrderHeader.ShipCity IS NOT NULL AND query.ShipCity IS NULL)
                  OR FactSalesOrderHeader.ShipAdressLine1<>query.ShipAdressLine1 OR (FactSalesOrderHeader.ShipAdressLine1 IS NULL AND query.ShipAdressLine1 IS NOT NULL) OR  (FactSalesOrderHeader.ShipAdressLine1 IS NOT NULL AND query.ShipAdressLine1 IS NULL)
                  OR FactSalesOrderHeader.ShipAddressLine2<>query.ShipAddressLine2 OR (FactSalesOrderHeader.ShipAddressLine2 IS NULL AND query.ShipAddressLine2 IS NOT NULL) OR  (FactSalesOrderHeader.ShipAddressLine2 IS NOT NULL AND query.ShipAddressLine2 IS NULL)
                  OR FactSalesOrderHeader.ShipPostalCode<>query.ShipPostalCode OR (FactSalesOrderHeader.ShipPostalCode IS NULL AND query.ShipPostalCode IS NOT NULL) OR  (FactSalesOrderHeader.ShipPostalCode IS NOT NULL AND query.ShipPostalCode IS NULL)
                  OR FactSalesOrderHeader.CreditCardPerson<>query.CreditCardPerson OR (FactSalesOrderHeader.CreditCardPerson IS NULL AND query.CreditCardPerson IS NOT NULL) OR  (FactSalesOrderHeader.CreditCardPerson IS NOT NULL AND query.CreditCardPerson IS NULL)
                  OR FactSalesOrderHeader.CardType<>query.CardType OR (FactSalesOrderHeader.CardType IS NULL AND query.CardType IS NOT NULL) OR  (FactSalesOrderHeader.CardType IS NOT NULL AND query.CardType IS NULL)
                  OR FactSalesOrderHeader.CardNumber<>query.CardNumber OR (FactSalesOrderHeader.CardNumber IS NULL AND query.CardNumber IS NOT NULL) OR  (FactSalesOrderHeader.CardNumber IS NOT NULL AND query.CardNumber IS NULL)
                  OR FactSalesOrderHeader.TaxAmt<>query.TaxAmt OR (FactSalesOrderHeader.TaxAmt IS NULL AND query.TaxAmt IS NOT NULL) OR  (FactSalesOrderHeader.TaxAmt IS NOT NULL AND query.TaxAmt IS NULL))) THEN
  UPDATE SET
    CustomerSid=query.CustomerSid,
    OrderDate=query.OrderDate,
    SalesOrderNumber=query.SalesOrderNumber,
    DueDate=query.DueDate,
    ShipDate=query.ShipDate,
    OnlineOrderFlag=query.OnlineOrderFlag,
    PurchaseOrderNumber=query.PurchaseOrderNumber,
    AccountNumber=query.AccountNumber,
    Freight=query.Freight,
    CreditCardApprovalCode=query.CreditCardApprovalCode,
    ShippingMethod=query.ShippingMethod,
    SalesPerson=query.SalesPerson,
    OriginalCurrency=query.OriginalCurrency,
    BillCountry=query.BillCountry,
    BillProvince=query.BillProvince,
    BillCity=query.BillCity,
    BillAdressLine1=query.BillAdressLine1,
    BillAddressLine2=query.BillAddressLine2,
    BillPostalCode=query.BillPostalCode,
    ShipCountry=query.ShipCountry,
    ShipProvince=query.ShipProvince,
    ShipCity=query.ShipCity,
    ShipAdressLine1=query.ShipAdressLine1,
    ShipAddressLine2=query.ShipAddressLine2,
    ShipPostalCode=query.ShipPostalCode,
    CreditCardPerson=query.CreditCardPerson,
    CardType=query.CardType,
    CardNumber=query.CardNumber,
    TaxAmt=query.TaxAmt,
    FechaModificacion=getdate()
WHEN NOT MATCHED THEN
  INSERT (SalesOrderId,CustomerSid,OrderDate,SalesOrderNumber,DueDate,ShipDate,OnlineOrderFlag,PurchaseOrderNumber,AccountNumber,Freight,CreditCardApprovalCode,ShippingMethod,SalesPerson,OriginalCurrency,BillCountry,BillProvince,BillCity,BillAdressLine1,BillAddressLine2,BillPostalCode,ShipCountry,ShipProvince,ShipCity,ShipAdressLine1,ShipAddressLine2,ShipPostalCode,CreditCardPerson,CardType,CardNumber,TaxAmt,FechaAlta,FechaModificacion) VALUES (
    query.SalesOrderId,
    query.CustomerSid,
    query.OrderDate,
    query.SalesOrderNumber,
    query.DueDate,
    query.ShipDate,
    query.OnlineOrderFlag,
    query.PurchaseOrderNumber,
    query.AccountNumber,
    query.Freight,
    query.CreditCardApprovalCode,
    query.ShippingMethod,
    query.SalesPerson,
    query.OriginalCurrency,
    query.BillCountry,
    query.BillProvince,
    query.BillCity,
    query.BillAdressLine1,
    query.BillAddressLine2,
    query.BillPostalCode,
    query.ShipCountry,
    query.ShipProvince,
    query.ShipCity,
    query.ShipAdressLine1,
    query.ShipAddressLine2,
    query.ShipPostalCode,
    query.CreditCardPerson,
    query.CardType,
    query.CardNumber,
    query.TaxAmt,
    getdate(),
    getdate())
WHEN NOT MATCHED BY SOURCE THEN
  DELETE;