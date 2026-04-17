/*
  ALTER TABLE supports standard syntax for adding
  columns to an existing table.
*/

ALTER TABLE dwh.DimProducts
  ADD ProductModel nvarchar(100),
  ADD Color nvarchar(50)
