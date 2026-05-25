/*
  MERGE HISTORY maintains a full change history (SCD Type 2).
  When a record changes, the current version is closed and a new
  version is created. Deleted records are also closed automatically.
  Use start_date and end_date to query point-in-time snapshots.
*/

MERGE HISTORY dwh.dim_products KEY (product_id)
SELECT
  products.product_id,
  products.product_name,
  categories.category_name,
  suppliers.company_name supplier
FROM staging.products
INNER JOIN staging.categories USING category_id
INNER JOIN staging.suppliers USING supplier_id
