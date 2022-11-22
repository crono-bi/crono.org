SELECT *
FROM staging.customer
WHERE EXISTS (SELECT 1 FROM staging.SalesOrderHeader sales WHERE customer.customerId=sales.customerId)