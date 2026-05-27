/*
  FILTER applies a condition to a table before the JOIN is executed.
  This can improve performance by reducing the number of rows early,
  but above all it improves readability: the filter is declared right
  next to the table it belongs to, rather than buried in a WHERE clause
  far from its context.

  This example calculates the total discount only for order lines
  where a discount was actually applied (discount <> 0).
*/

SELECT
  discount,
  sum(order_details.quantity) quantity,
  sum(order_details.unit_price * order_details.quantity) total_amount,
  total_amount * quantity * discount total_discount
FROM staging.order_details FILTER (discount <> 0)
INNER JOIN staging.orders USING order_id
INNER JOIN staging.customers USING orders(customer_id)
