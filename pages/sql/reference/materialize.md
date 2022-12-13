
# MATERIALIZE

La cláusula **MATERIALIZE** permite crear una tabla temporal con el contenido de una subconsulta. Es decir, antes de la ejecución de la consulta, se crean las tablas temporales necesarias y finalmente se ejecuta la consulta utilizando dichas tablas. Esta estrategia de carga simplifica el plan de ejecución del motor de base de datos y se pueden obtener mejoras de rendimiento muy significativas, sin penalizar o dificultar la escritura de la consulta.

``` CronoSqlSample
SELECT
  SalesOrderHeader.OrderDate,
  Product.Name Product,
  Product.ProductNumber,
  sum(Sales.LineTotal) Sales
FROM staging.SalesOrderDetail FILTER (year(ModifiedDate)=2014) MATERIALIZE Sales
INNER JOIN staging.SalesOrderHeader USING SalesOrderId
INNER JOIN staging.Product USING ProductId
```



Con la cláusula **MATERIALIZE**, también se pueden materializar las consultas de una sentencia **COMBINE**. En este ejemplo, primero se ejecutará la consulta con las ventas, luego se ejecutará una consulta con las compras, y finalmente se combinarán en un único resultado.


``` CronoSqlSample
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

