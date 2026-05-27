/*
  Smart Columns: in Crono SQL, a calculated column can be referenced
  by any other column in the same SELECT — no need to repeat the expression.

  In standard SQL, using an alias within the same SELECT is not allowed.
  You would have to duplicate the expression or wrap everything in a subquery.
  Crono eliminates that duplication entirely.

  This follows the DRY principle (Don't Repeat Yourself): each calculation
  is written once, in one place. If the logic changes, you update it once —
  the rest of the query adjusts automatically. This makes queries easier
  to write, read, and maintain.

  This example also uses divide(), a portable Crono function that compiles
  to a safe CASE WHEN expression, handling division by zero automatically
  across all supported database engines.
*/

SELECT
  customers.company_name,
  sum(order_details.unit_price * order_details.quantity) total_amount,
  sum(order_details.unit_price * order_details.quantity * order_details.discount) total_discount,
  divide(total_discount, total_amount) discount_pct
FROM staging.order_details
INNER JOIN staging.orders USING order_id
INNER JOIN staging.customers USING orders(customer_id)
