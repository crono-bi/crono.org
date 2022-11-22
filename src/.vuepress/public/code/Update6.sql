;WITH
query AS (
  SELECT
    code,
    description AS CodeDescription
  FROM table2
)
MERGE table1
USING query ON query.code=table1.code
WHEN MATCHED AND (table1.UPDATETYPE='blah'
                  AND (table1.CodeDescription<>query.CodeDescription OR (table1.CodeDescription IS NULL AND query.CodeDescription IS NOT NULL) OR  (table1.CodeDescription IS NOT NULL AND query.CodeDescription IS NULL))) THEN
  UPDATE SET
    CodeDescription=query.CodeDescription;