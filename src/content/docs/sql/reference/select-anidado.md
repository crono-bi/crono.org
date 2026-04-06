---
title: "SELECTs anidados"
---

# SELECTs anidados

Es posible incluir varios **SELECT** en una misma consulta. Esta sintaxis permite escribir rápidamente una consulta sobre el resultado de otra consulta.  Son consultas encadenadas.

Este consulta devuelve la media de las ventas anuales de cada producto.


``` sql
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

  

  <details>
<summary>Ver SQL compilado</summary>

``` sql
SELECT
  Product,
  ProductNumber,
  avg(Sales) AS AvgYearSales
FROM (
    SELECT
      Product.Name AS Product,
      Product.ProductNumber AS ProductNumber,
      year(OrderDate) AS OrderYear,
      sum(SalesOrderDetail.LineTotal) AS Sales
    FROM staging.SalesOrderDetail
    INNER JOIN staging.SalesOrderHeader ON (SalesOrderDetail.SalesOrderId=SalesOrderHeader.SalesOrderId)
    INNER JOIN staging.Product ON (SalesOrderDetail.ProductId=Product.ProductId)
    GROUP BY
      Product.Name,
      Product.ProductNumber,
      year(OrderDate)
  ) a
GROUP BY
  Product,
  ProductNumber

```

</details>



La cláusulas **SELECT** encadenadas permiten, por ejemplo, contar el número de registros que devuelve una consulta previa. La siguiente consulta ejecuta un **count(\*)** sobre el resultado de la consulta inferior.


``` sql
SELECT count(*)
SELECT
  Product.Name Product,
  Product.ProductNumber,
  sum(SalesOrderDetail.LineTotal) Sales
FROM staging.SalesOrderDetail
INNER JOIN staging.Product USING ProductId
```

  

  <details>
<summary>Ver SQL compilado</summary>

``` sql
SELECT count(*) AS expr1
FROM (
    SELECT
      Product.Name AS Product,
      Product.ProductNumber AS ProductNumber,
      sum(SalesOrderDetail.LineTotal) AS Sales
    FROM staging.SalesOrderDetail
    INNER JOIN staging.Product ON (SalesOrderDetail.ProductId=Product.ProductId)
    GROUP BY
      Product.Name,
      Product.ProductNumber
  ) a

```

</details>
