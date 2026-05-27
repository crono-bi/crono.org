/*
  ANTI JOIN returns records from the left table that have NO match
  in the right table. It is equivalent to NOT EXISTS in standard SQL,
  but far more readable and concise.

  This first example returns customers who have never placed an order.
*/

SELECT
  customers.customer_id,
  customers.company_name
FROM staging.customers
ANTI JOIN staging.orders USING customer_id


/*
  All Crono SQL features can be combined to express complex logic
  without losing readability or maintainability.

  This example calculates total quantity sold to customers who have
  never received a discount greater than 10%. It combines ANTI JOIN
  with a subquery that uses FILTER — each feature doing one thing,
  all of them composing naturally.
*/

SELECT
  customers.customer_id,
  customers.company_name,
  sum(order_details.quantity) quantity
FROM staging.order_details
INNER JOIN staging.orders USING order_id
INNER JOIN staging.customers USING orders(customer_id)
ANTI JOIN (
  -- customers who have received a discount greater than 10%
  SELECT orders.customer_id
  FROM staging.order_details FILTER (discount > 0.1)
  INNER JOIN staging.orders USING order_id
) USING customers(customer_id)
