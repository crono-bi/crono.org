/*
  INSERT OVERWRITE deletes and reinserts records matching the KEY.
  Unlike MERGE UPSERT, it supports non-unique keys, making it ideal
  for reloading all records belonging to a partition (e.g. all orders
  of a customer, all rows of a month).
*/

INSERT OVERWRITE dwh.fact_order_details KEY (order_year)
SELECT
  od.order_id,
  od.product_id,
  products.product_name,
  od.unit_price,
  od.quantity,
  od.discount,
  year(orders.order_date) order_year
FROM staging.order_details od
INNER JOIN staging.orders USING order_id
INNER JOIN staging.products USING product_id
WHERE year(orders.order_date) = current_year()