/*
  ASSERT EXISTS OR RAISE and ASSERT NOT EXISTS OR RAISE add data quality
  checks to the load process. If the condition is not met, execution stops
  and the error message is raised — preventing bad data from reaching
  the target table.

  Assertions can use the full power of Crono SQL: stacked SELECTs,
  FILTER, aggregations, and more.
*/


-- Checks that no customer has suspiciously high total sales.
ASSERT NOT EXISTS OR RAISE 'Sales too high. Possible data error'
SELECT WHERE total_sales > 1e6
SELECT
  customers.company_name customer,
  sum(order_details.unit_price * order_details.quantity) total_sales
FROM staging.order_details
INNER JOIN staging.orders USING order_id
INNER JOIN staging.customers USING orders(customer_id)


-- Checks that there are no order lines with missing product or quantity.
ASSERT NOT EXISTS OR RAISE 'Order details with missing product or quantity'
SELECT *
FROM staging.order_details
WHERE quantity IS NULL
   OR product_id IS NULL


-- Checks that the number of customers is within the expected range.
ASSERT EXISTS OR RAISE 'Unexpected customer count'
SELECT WHERE customer_count BETWEEN 90 AND 200
SELECT count(*) customer_count
FROM staging.customers
