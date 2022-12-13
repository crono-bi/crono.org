
# SELECTs anidados

Es posible incluir varios **SELECT** en una misma consulta. Esta sintaxis permite escribir rápidamente una consulta sobre el resultado de otra consulta.  Son consultas encadenadas.

Este consulta devuelve la media de las ventas anuales de cada producto.


``` CronoSqlSample
select
  Product,
  ProductNumber,
  avg(Sales) AvgYearSales
select 
  Product.Name Product,
  Product.ProductNumber,
  year(OrderDate) OrderYear,
  sum(SalesOrderDetail.LineTotal) Sales
from staging.SalesOrderDetail
inner join staging.SalesOrderHeader using SalesOrderId
inner join staging.Product  using ProductId
```



La cláusulas **SELECT** encadenadas permiten, por ejemplo, contar el número de registros que devuelve una consulta previa. La siguiente consulta ejecuta un **count(\*)** sobre el resultado de la consulta inferior.


``` CronoSqlSample
SELECT count(*)
SELECT
  Product.Name Product,
  Product.ProductNumber,
  sum(SalesOrderDetail.LineTotal) Sales
FROM staging.SalesOrderDetail
INNER JOIN staging.Product USING ProductId
```

