---
sidebarDepth: 2
---

# Sentencia DELETE

**Crono SQL** soporta la sintaxis estándar de la sentencia **DELETE** de SQL:

``` CronoSqlSample
DELETE FROM dwh.FactSalesOrderDetails WHERE SalesOrderId=43659
```


Si intervienen otras tablas, se puede definir el predicado utilizando las expresiones **IN()** o **EXISTS ()**. La siguiente sentencia elimina las líneas de venta de un cliente en concreto:

``` CronoSqlSample
DELETE 
FROM dwh.FactSalesOrderDetails
WHERE SalesOrderSid in (
  SELECT SalesOrderSid
  FROM dwh.FactSalesOrderHeader
  INNER JOIN dwh.DimCustomers using FactSalesOrderHeader(CustomerSid)
  WHERE DimCustomers.Customer='Oscar Simmons')
```


De modo similar, la siguiente sentencia elimina las líneas de venta de otro cliente:

``` CronoSqlSample
DELETE 
FROM dwh.FactSalesOrderDetails 
WHERE EXISTS (
  SELECT *  
  FROM dwh.FactSalesOrderHeader cab
  INNER JOIN dwh.DimCustomers using cab(CustomerSid)
  WHERE
    DimCustomers.Customer='Oscar Simmons'
    AND FactSalesOrderDetails.SalesOrderSid=cab.SalesOrderSid)
```


**Crono SQL** propone otra sintaxis de la sentencia **DELETE** (idéntica a la sintaxis de **INSERT**, **UPDATE**, y **MERGE**). La idea subyacente es que se ha  de construir el **SELECT** de los datos que se quieren borrar. Solo el **SELECT**. Y **Crono SQL** eliminará precisamente esos registros:

``` CronoSqlSample
DELETE dwh.FactSalesOrderDetails
select det.SalesOrderDetailSid #SalesOrderDetailSid, det.SalesOrderId, det.SalesOrderDetailsId
from dwh.FactSalesOrderDetails det
inner join dwh.FactSalesOrderHeader using SalesOrderSid
inner join dwh.DimCustomers using FactSalesOrderHeader(CustomerSid)
WHERE DimCustomers.Customer='Jada Morris'
```


De hecho, no es necesario que la consulta tenga ninguna referencia a la tabla de la que se quieren eliminar registros. El ejemplo anterior se puede simplificar de la siguiente manera:

``` CronoSqlSample
DELETE dwh.FactSalesOrderDetails 	
SELECT #SalesOrderSid 
FROM dwh.FactSalesOrderHeader 
INNER JOIN dwh.DimCustomers using CustomerSid
WHERE
  DimCustomers.Customer='Katherine Turner'
```


En todos los casos, lo que marca los registros que se deben eliminar es la *"clave de eliminación"* (marcada con el **carácter #**).

La consulta del **DELETE** también puede utilizar todas las características del **SELECT** de **Crono SQL**. La siguiente sentencia elimina los clientes sin ninguna venta:

``` CronoSqlSample
DELETE dwh.DimCustomers
SELECT #customerSid
FROM dwh.DimCustomers
ANTI JOIN dwh.FactSalesOrderHeader USING CustomerSid
```


