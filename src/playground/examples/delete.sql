/*
  DELETE removes records from the target table whose KEY matches
  the SELECT result. Supports complex filtering and aggregations
  that cannot be expressed in a simple ANSI WHERE clause.
  This example deletes orders where the average discount
  exceeds 50% of the total amount.
*/

DELETE dwh.fact_order_details KEY (order_id)
SELECT WHERE total_discount > 0.5
SELECT
  od.order_id,
  sum(od.discount * od.quantity * od.unit_price) discount,
  sum(od.unit_price * od.quantity) total,
  divide(discount, total) total_discount
FROM staging.order_details od
GROUP BY od.order_id