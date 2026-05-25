/*
  MERGE SOFT DELETE inserts and updates records from the source,
  and marks as deleted (delete_date) those that no longer exist.
  Records are never physically deleted, preserving the full history.
*/

MERGE SOFT DELETE dwh.dim_customers KEY (customer_id)
SELECT
  customers.customer_id,
  customers.company_name,
  customers.country
FROM staging.customers