/*
  Query stacking is one of Crono SQL's most powerful features.
  Instead of writing subqueries, you stack multiple SELECTs —
  each layer operates on the result of the one below.

  This improves readability: the query flows naturally top to bottom,
  with each layer expressing a single, clear transformation step.
  It also helps avoid code duplication, since results from lower layers
  are directly available in upper ones.

  This example is equivalent to the Smart Columns example, but using
  two stacked SELECTs instead. The lower SELECT computes the row-level
  amounts; the upper SELECT aggregates and calculates the discount ratio.
*/

SELECT
  company_name,
  sum(total_amount) total_amount,
  sum(total_discount) total_discount,
  divide(total_discount, total_amount) discount_pct
SELECT
  customers.company_name,
  order_details.unit_price * order_details.quantity total_amount,
  total_amount * order_details.discount total_discount
FROM staging.order_details
INNER JOIN staging.orders USING order_id
INNER JOIN staging.customers USING orders(customer_id)


/*
  Stacking is not limited to SELECT clauses.
  WHERE and ORDER BY layers also operate on the result of the layers below,
  making it easy to filter or sort on aggregated values
  without subqueries or CTEs.
*/

SELECT ORDER BY total_amount DESC
SELECT WHERE total_amount > 10000
SELECT
  customers.company_name,
  sum(order_details.unit_price * order_details.quantity) total_amount
FROM staging.order_details
INNER JOIN staging.orders USING order_id
INNER JOIN staging.customers USING orders(customer_id)
