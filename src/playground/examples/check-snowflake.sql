/*
  CHECK SNOWFLAKE, placed right after the JOINs, verifies that the
  relationships neither lose nor duplicate records from the FROM table.

  It runs before the query itself, so errors in the data or in the
  JOIN conditions are detected early — before any load or transformation
  is applied. This makes it a powerful tool for validating data quality
  and catching bugs during development.
*/

SELECT
  customers.company_name customer,
  sum(order_details.unit_price * order_details.quantity) total_sales
FROM staging.order_details
INNER JOIN staging.orders USING order_id
INNER JOIN staging.customers USING orders(customer_id)
CHECK SNOWFLAKE
ORDER BY total_sales DESC
