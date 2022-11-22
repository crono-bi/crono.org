IF NOT EXISTS (select name from sys.indexes where upper(name)='IDX_SALESHEADER_CUSTOMERSID')
CREATE INDEX IDX_SalesHeader_CustomerSid ON dwh.FactSalesOrderHeader(CustomerSid)