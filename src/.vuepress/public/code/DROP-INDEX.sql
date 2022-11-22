IF EXISTS (select name from sysindexes where upper(name)='IDX_SALESHEADER_CUSTOMERSID')
DROP INDEX IDX_SalesHeader_CustomerSid ON dwh.FactSalesOrderHeader