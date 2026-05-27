/*
  Crono SQL is a superset of SQL — all your SQL knowledge is valid here.
  This is a standard SQL query. It runs in Crono without any changes.
*/

SELECT
  customers.company_name,
  products.product_name,
  sum(order_details.unit_price * order_details.quantity) total_sales
FROM staging.order_details
INNER JOIN staging.orders ON order_details.order_id = orders.order_id
INNER JOIN staging.customers ON orders.customer_id = customers.customer_id
INNER JOIN staging.products ON order_details.product_id = products.product_id
WHERE customers.company_name IN ('Antonio Moreno Taquería', 'Around the Horn')
GROUP BY customers.company_name, products.product_name


/*
  Crono SQL extends standard SQL with two useful shortcuts.
  USING simplifies JOINs — no need to spell out the full ON condition.
  GROUP BY is optional — Crono infers it from non-aggregated columns.
*/

SELECT
  customers.company_name,
  products.product_name,
  sum(order_details.unit_price * order_details.quantity) total_sales
FROM staging.order_details
INNER JOIN staging.orders USING order_id
INNER JOIN staging.customers USING orders(customer_id)
INNER JOIN staging.products USING product_id
WHERE customers.company_name IN ('Antonio Moreno Taquería', 'Around the Horn')
