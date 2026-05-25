
/*
  UPDATE modifies records in the target table whose KEY matches
  the SELECT result, but only if the data has changed.
  Supports complex filtering and aggregations as the update source.
  This example flags customers as 'Occasional' when their total
  purchases are below 1000.
*/

UPDATE dwh.dim_customers KEY (customer_id)
SELECT
  customer_id,
  'Occasional' customer_type
SELECT WHERE total_amount < 1000
SELECT
  orders.customer_id,
  sum(od.unit_price * od.quantity) total_amount
FROM staging.order_details od
INNER JOIN staging.orders USING order_id