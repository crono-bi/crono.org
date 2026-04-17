/*
  Crono SQL includes pseudo-views that generate subqueries.
  TIME_TABLE generates a time table with common fields.
  INTEGERS generates a series of consecutive integers.
*/

SELECT *
FROM TIME_TABLE
WHERE year BETWEEN 2000 AND year(getdate())

-- Other available pseudo-views:
-- INTEGERS BETWEEN a AND b
-- ROWS (...)
-- FILE 'path'
