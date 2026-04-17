/*
  Identifiers can be delimited with brackets [].
  This is necessary when the name matches a
  Crono SQL reserved word.
*/

SELECT
  [Product].Name [Product Name],
  [Product].[ProductNumber] [Product Number],
  [Product].[Color]
FROM staging.[Product]
