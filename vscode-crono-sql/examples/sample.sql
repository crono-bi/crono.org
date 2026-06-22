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

-- Validaciones declarativas.
CHECK SNOWFLAKE dwh.fact_sales;
ASSERT sum(ventas) > 0;
