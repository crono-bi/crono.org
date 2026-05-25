/*
  MERGE UPSERT inserts new records and updates existing ones that have
  changed. Unlike MERGE CLONE, it does not delete records that are no
  longer in the source. Use it when the target table may contain records
  from multiple sources.
  This example inserts or updates only products from supplier
  'Carnarvon Tigers', leaving all other products untouched.
*/

MERGE UPSERT dwh.dim_products KEY (product_id)
SELECT
  products.product_id,
  products.product_name,
  categories.category_name,
  suppliers.company_name supplier
FROM staging.products
INNER JOIN staging.categories USING category_id
INNER JOIN staging.suppliers USING supplier_id
WHERE suppliers.company_name = 'Carnarvon Tigers'