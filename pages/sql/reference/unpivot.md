# UNPIVOT

Se puede utilizar el operador **UNPIVOT** (según la [sintaxis de T-SQL](https://technet.microsoft.com/es-es/library/ms177410(v=sql.105).aspx)) para despivotar las columnas de una tabla.

En este ejemplo, las columna *“AddressLine1”*  y *“AddressLine2”* se han convertido en filas diferenciadas, duplicándose los registros.

``` CronoSqlSample
SELECT
  AddressId,
  AddressItem,
  content
FROM staging.Address
UNPIVOT (content FOR AddressItem in (AddressLine1,AddressLine2)) as unpvt
```
