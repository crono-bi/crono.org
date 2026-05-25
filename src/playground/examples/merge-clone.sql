/*
  MERGE CLONE fully synchronizes the target table with the SELECT result.
  Records are inserted, updated or deleted to match the source exactly.
  This is the most common ETL pattern for dimension tables (SCD1).
*/

MERGE CLONE dwh.dim_products KEY (product_id)
SELECT
  products.product_id,
  products.product_name,
  categories.category_name,
  suppliers.company_name supplier
FROM staging.products
INNER JOIN staging.categories USING category_id
INNER JOIN staging.suppliers USING supplier_id