/*
  INSERT IF NEW inserts only records whose KEY does not yet exist
  in the target table. Existing records are never updated or deleted.
  Ideal for append-only tables where records never change once inserted,
  such as transactional fact tables or event logs.
*/

INSERT IF NEW dwh.fact_order_details KEY (order_id, product_id)
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