/*
  SEMI JOIN returns records from the left table that have AT LEAST ONE
  match in the right table. It is equivalent to EXISTS in standard SQL,
  but far more readable and concise.

  SEMI JOIN can be combined with subqueries, FILTER, and other Crono
  features to express complex logic cleanly.

  This example calculates total quantity sold to customers who have
  received at least one discount greater than 10%.
*/

SELECT
  customers.customer_id,
  customers.company_name,
  sum(order_details.quantity) quantity
FROM staging.order_details
INNER JOIN staging.orders USING order_id
INNER JOIN staging.customers USING orders(customer_id)
SEMI JOIN (
  -- customers who have received a discount greater than 10%
  SELECT orders.customer_id
  FROM staging.order_details FILTER (discount > 0.1)
  INNER JOIN staging.orders USING order_id
) USING customers(customer_id)
