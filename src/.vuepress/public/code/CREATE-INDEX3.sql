IF EXISTS (select name from sysindexes where upper(name)='IDX_SALESHEADER_CUSTOMERSID2')
DROP INDEX IDX_SalesHeader_CustomerSid2 ON dwh.FactSalesOrderHeader


CREATE INDEX IDX_SalesHeader_CustomerSid2 ON dwh.FactSalesOrderHeader(CustomerSid) INCLUDE (SalesOrderId)