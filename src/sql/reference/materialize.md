﻿---
title: MATERIALIZE
Autogenerated: true
---

# MATERIALIZE

La cláusula **MATERIALIZE** permite crear una tabla temporal con el contenido de una subconsulta. Es decir, antes de la ejecución de la consulta, se crean las tablas temporales necesarias y finalmente se ejecuta la consulta utilizando dichas tablas. Esta estrategia de carga simplifica el plan de ejecución del motor de base de datos y se pueden obtener mejoras de rendimiento muy significativas, sin penalizar o dificultar la escritura de la consulta.

<div class="mt-1 mb-2 row">
  <div class="col-lg-12">

``` sql
SELECT
  SalesOrderHeader.OrderDate,
  Product.Name Product,
  Product.ProductNumber,
  sum(Sales.LineTotal) Sales
FROM staging.SalesOrderDetail FILTER (year(ModifiedDate)=2014) MATERIALIZE Sales
INNER JOIN staging.SalesOrderHeader USING SalesOrderId
INNER JOIN staging.Product USING ProductId
```

  <b-button class="float-right btn" size="sm" v-b-modal.modal-1 style="background-color: #3eaf7c">Ver SQL compilado</b-button>

  <b-modal id="modal-1" size="lg" title="Ver SQL compilado" :hide-footer="true" > 
``` sql
-- Materialized query: Sales
SELECT *
INTO #Sales__39872
FROM (SELECT * FROM staging.SalesOrderDetail WHERE year(ModifiedDate)=2014) SalesOrderDetail

SELECT
  SalesOrderHeader.OrderDate AS OrderDate,
  Product.Name AS Product,
  Product.ProductNumber AS ProductNumber,
  sum(Sales.LineTotal) AS Sales
FROM #Sales__39872 Sales
INNER JOIN staging.SalesOrderHeader ON (Sales.SalesOrderId=SalesOrderHeader.SalesOrderId)
INNER JOIN staging.Product ON (Sales.ProductId=Product.ProductId)
GROUP BY
  SalesOrderHeader.OrderDate,
  Product.Name,
  Product.ProductNumber

```
  </b-modal>

  </div>
</div>



Con la cláusula **MATERIALIZE**, también se pueden materializar las consultas de una sentencia **COMBINE**. En este ejemplo, primero se ejecutará la consulta con las ventas, luego se ejecutará una consulta con las compras, y finalmente se combinarán en un único resultado.


<div class="mt-1 mb-2 row">
  <div class="col-lg-12">

``` sql
COMBINE bY Product,productNumber
  MATERIALIZE sales (
	select 
	  Product.Name Product,
	  Product.ProductNumber ProductNumber,
	  sum(PurchaseOrderDetail.LineTotal) Purchases
	from staging.PurchaseOrderDetail
	inner join staging.Product  using ProductId
  ),
  MATERIALIZE purchases (
	select 
	  Product.Name Product,
	  Product.ProductNumber ProductNumber,
	  sum(SalesOrderDetail.LineTotal) Sales
	from staging.SalesOrderDetail
	inner join staging.Product  using ProductId
  )
```

  <b-button class="float-right btn" size="sm" v-b-modal.modal-2 style="background-color: #3eaf7c">Ver SQL compilado</b-button>

  <b-modal id="modal-2" size="lg" title="Ver SQL compilado" :hide-footer="true" > 
``` sql
-- Materialized query: sales
SELECT
  Product.Name AS Product,
  Product.ProductNumber AS ProductNumber,
  sum(PurchaseOrderDetail.LineTotal) AS Purchases
INTO #sales__D83E4
FROM staging.PurchaseOrderDetail
INNER JOIN staging.Product ON (PurchaseOrderDetail.ProductId=Product.ProductId)
GROUP BY
  Product.Name,
  Product.ProductNumber

-- Materialized query: purchases
SELECT
  Product.Name AS Product,
  Product.ProductNumber AS ProductNumber,
  sum(SalesOrderDetail.LineTotal) AS Sales
INTO #purchases__1CD26
FROM staging.SalesOrderDetail
INNER JOIN staging.Product ON (SalesOrderDetail.ProductId=Product.ProductId)
GROUP BY
  Product.Name,
  Product.ProductNumber

SELECT
  coalesce(sales.Product,purchases.Product) AS Product,
  coalesce(sales.ProductNumber,purchases.ProductNumber) AS ProductNumber,
  sales.Purchases AS Purchases,
  purchases.Sales AS Sales
FROM #sales__D83E4 sales
FULL JOIN #purchases__1CD26 purchases ON (sales.Product=purchases.Product AND sales.ProductNumber=purchases.ProductNumber)

```
  </b-modal>

  </div>
</div>
