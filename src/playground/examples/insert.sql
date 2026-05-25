/*
  INSERT appends all records from the SELECT into the target table,
  without checking for duplicates. Unlike ANSI INSERT, Crono
  automatically maintains audit columns (insert_date).
  This statement does not support KEY. Use INSERT IF NEW to skip
  existing records, or INSERT OVERWRITE to replace them.
*/

INSERT dwh.fact_orders
SELECT
  orders.order_id,
  orders.customer_id,
  orders.order_date,
  shippers.company_name shipper,
  orders.freight
FROM staging.orders
INNER JOIN staging.shippers USING ship_via