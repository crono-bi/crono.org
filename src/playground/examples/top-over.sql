/*
  Crono SQL uses TOP instead of LIMIT to restrict the number of rows.
  TOP is placed at the start of the SELECT clause, next to the row limit.
  Crono compiles it to the correct syntax for each database engine.
*/

SELECT TOP 3
  customers.company_name best_customer,
  sum(order_details.unit_price * order_details.quantity) total_sales
FROM staging.order_details
INNER JOIN staging.orders USING order_id
INNER JOIN staging.customers USING orders(customer_id)
ORDER BY total_sales DESC


/*
  TOP also supports window functions with OVER (PARTITION BY ... ORDER BY ...).
  This makes it trivial to get the top N rows per group — no CTEs or
  row_number() tricks needed.

  This example returns the best customer for each product.
  Changing TOP 1 to TOP 3 would return the top 3 customers per product.
*/

SELECT TOP 1 OVER (PARTITION BY product_name ORDER BY total_sales DESC)
  products.product_name,
  customers.company_name best_customer,
  sum(order_details.unit_price * order_details.quantity) total_sales
FROM staging.order_details
INNER JOIN staging.orders USING order_id
INNER JOIN staging.customers USING orders(customer_id)
INNER JOIN staging.products USING product_id
