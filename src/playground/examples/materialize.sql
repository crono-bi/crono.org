/*
  MATERIALIZE creates a temporary table from a subquery before the main
  query executes. The result is computed once and reused, which can
  significantly improve performance on complex or repeated subqueries.

  Beyond performance, MATERIALIZE eliminates the need to create temporary
  tables manually or rely on CTEs. No matter how complex the transformation,
  the entire load can be expressed in a single SELECT — keeping the logic
  together and the code readable.

  In this example, the main query calculates total sales per customer.
  The materialized subquery computes each customer's top-selling product
  using TOP OVER. Both results are then joined together in one step.
*/

SELECT
  customers.company_name customer,
  sum(order_details.unit_price * order_details.quantity) total_sales,
  main_product_by_customer.product_name product_name,
  main_product_by_customer.total_sales main_product_sales
FROM staging.order_details
INNER JOIN staging.orders USING order_id
INNER JOIN staging.customers USING orders(customer_id)
LEFT JOIN (
  SELECT TOP 1 OVER (PARTITION BY customer_id ORDER BY total_sales DESC)
    customers.customer_id,
    products.product_name,
    sum(order_details.unit_price * order_details.quantity) total_sales
  FROM staging.order_details
  INNER JOIN staging.orders USING order_id
  INNER JOIN staging.customers USING orders(customer_id)
  INNER JOIN staging.products USING product_id
) MATERIALIZE main_product_by_customer USING customers(customer_id)
