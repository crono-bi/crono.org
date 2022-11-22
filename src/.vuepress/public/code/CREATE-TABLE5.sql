IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='dwh' AND TABLE_NAME='DimCustomer2' AND TABLE_TYPE='BASE TABLE')
DROP TABLE dwh.DimCustomer2


CREATE TABLE dwh.DimCustomer2(
  CustomerSid int IDENTITY(1,1),
  CustomerId int,
  Customer nvarchar(101),
  CustomerType varchar(6) NOT NULL,
  AccountNumber nvarchar(10) NOT NULL,
  FirstName nvarchar(50) NOT NULL,
  MiddleName nvarchar(50),
  LastName nvarchar(50),
  CustomerAddressCountry nvarchar(50),
  CustomerProvince nvarchar(50),
  Name nvarchar(50),
  CustomerCountry nvarchar(50),
  Store int,
  BirthDate date,
  Store nvarchar(50),
  StoreManager nvarchar(101),
  StoreCountry nvarchar(50),
  StoreProvince nvarchar(50),
  StoreCity nvarchar(30),
  CONSTRAINT constraint1 UNIQUE (FirstName,MiddleName,LastName),
  CONSTRAINT PK_DimCustomer2 PRIMARY KEY NONCLUSTERED (CustomerSid),
  CONSTRAINT BK_DimCustomer2 UNIQUE (CustomerId),
  CONSTRAINT FK_DimCustomer2_DimStore FOREIGN KEY (Store) REFERENCES dwh.DimStore(Store) ON DELETE CASCADE,
  CONSTRAINT FK_DimCustomer2_DimDates FOREIGN KEY (BirthDate) REFERENCES dwh.DimDates(CalendarDate),
  CONSTRAINT [UNIQUE DimCustomer2 Customer] UNIQUE (Customer)
)


ALTER TABLE dwh.DimCustomer2 ADD CONSTRAINT DF_DWH_DIMCUSTOMER2_CUSTOMERTYPE DEFAULT 'Unknown' FOR CustomerType


ALTER TABLE dwh.DimCustomer2 ADD CONSTRAINT DF_DWH_DIMCUSTOMER2_FIRSTNAME DEFAULT '' FOR FirstName


CREATE UNIQUE CLUSTERED INDEX [INDEX dwh.DimCustomer2 AccountNumber] ON dwh.DimCustomer2(AccountNumber)


CREATE INDEX [INDEX dwh.DimCustomer2 LastName] ON dwh.DimCustomer2(LastName) INCLUDE (Customer,AccountNumber)


CREATE INDEX [INDEX dwh.DimCustomer2 CustomerType] ON dwh.DimCustomer2(CustomerType)