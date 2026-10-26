-- Ejemplo de Crono SQL: carga de una dimensión de productos.
CREATE OR REPLACE PROCEDURE
MERGE CLONE dwh.dim_products KEY (product_id)
SELECT
  products.product_id,
  products.product_name,
  categories.category_name,
  suppliers.company_name supplier
FROM staging.products
INNER JOIN staging.categories USING category_id
INNER JOIN staging.suppliers USING supplier_id;

-- Pipeline con funciones de ventana y agregación.
SELECT
  year(orders.order_date) anyo,
  month(orders.order_date) mes,
  sum(order_details.unit_price * order_details.quantity) ventas,
  running_sum(ventas order by anyo, mes) ventas_acumuladas,
  pct(ventas) pct_total
FROM staging.order_details
INNER JOIN staging.orders USING order_id
GROUP BY ALL;

-- CHECK SNOWFLAKE va tras los JOINs y valida en ejecución que no se
-- pierden ni duplican registros de la tabla del FROM.
SELECT
  year(orders.order_date) order_year,
  customers.company_name customer,
  sum(orders.freight) total_freight
FROM staging.orders
INNER JOIN staging.customers USING customer_id
INNER JOIN staging.employees USING employee_id
CHECK SNOWFLAKE
WHERE year(orders.order_date) = 2023;

-- ASSERT: la carga falla si la consulta devuelve algún registro.
ASSERT NOT EXISTS OR RAISE 'Líneas de detalle con producto o cantidad nulos'
SELECT *
FROM staging.order_details
WHERE quantity IS NULL
   OR product_id IS NULL;

-- ASSERT EXISTS: falla si la consulta no devuelve ningún registro.
ASSERT EXISTS OR RAISE 'Número de clientes fuera del rango esperado'
SELECT WHERE customer_count BETWEEN 90 AND 200
SELECT count(*) AS customer_count
FROM staging.customers;
