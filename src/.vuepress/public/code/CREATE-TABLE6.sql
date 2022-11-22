CREATE TABLE [dwh].[DimCustomer](
  [CustomerSid] [int] IDENTITY(1,1) NOT NULL,
  [CustomerId] [int] NULL,
  [Customer] [nvarchar](101) NULL,
  [CustomerType] [varchar](6) NOT NULL,
  [AccountNumber] [nvarchar](10) NOT NULL,
  [FirstName] [nvarchar](50) NOT NULL,
  [MiddleName] [nvarchar](50) NULL,
  [LastName] [nvarchar](50) NULL,
  [CustomerAddressCountry] [nvarchar](50) NULL
  CONSTRAINT [PK_DimCustomer] PRIMARY KEY NONCLUSTERED ([CustomerSid] ASC) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF) ON [PRIMARY]
) ON [PRIMARY]