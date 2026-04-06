---
title: "Sentencia DELETE"
---


**Crono SQL** soporta la sintaxis estándar de la sentencia **DELETE** de SQL:

``` sql
DELETE FROM dwh.FactSalesOrderDetails WHERE SalesOrderId=43659
```

  

  <details>
<summary>Ver SQL compilado</summary>

``` sql
DELETE FROM dwh.FactSalesOrderDetails WHERE SalesOrderId=43659;
```

</details>


Si intervienen otras tablas, se puede definir el predicado utilizando las expresiones **IN()** o **EXISTS ()**. La siguiente sentencia elimina las líneas de venta de un cliente en concreto:

``` sql
DELETE 
FROM dwh.FactSalesOrderDetails
WHERE SalesOrderSid in (
  SELECT SalesOrderSid
  FROM dwh.FactSalesOrderHeader
  INNER JOIN dwh.DimCustomers using FactSalesOrderHeader(CustomerSid)
  WHERE DimCustomers.Customer='Oscar Simmons')
```

  

  <details>
<summary>Ver SQL compilado</summary>

``` sql
DELETE FROM dwh.FactSalesOrderDetails WHERE EXISTS (SELECT 1 FROM (
    SELECT SalesOrderSid
    FROM dwh.FactSalesOrderHeader
    INNER JOIN dwh.DimCustomers ON (FactSalesOrderHeader.CustomerSid=DimCustomers.CustomerSid)
    WHERE DimCustomers.Customer='Oscar Simmons'
) subquery WHERE SalesOrderSid=subquery.SalesOrderSid);

```

</details>


De modo similar, la siguiente sentencia elimina las líneas de venta de otro cliente:

``` sql
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

  

  <details>
<summary>Ver SQL compilado</summary>

``` sql
DELETE FROM dwh.FactSalesOrderDetails WHERE EXISTS (SELECT *
FROM dwh.FactSalesOrderHeader cab
INNER JOIN dwh.DimCustomers ON (cab.CustomerSid=DimCustomers.CustomerSid)
WHERE
  DimCustomers.Customer='Oscar Simmons'
  AND FactSalesOrderDetails.SalesOrderSid=cab.SalesOrderSid
);

```

</details>


**Crono SQL** propone otra sintaxis de la sentencia **DELETE** (idéntica a la sintaxis de **INSERT**, **UPDATE**, y **MERGE**). La idea subyacente es que se ha  de construir el **SELECT** de los datos que se quieren borrar. Solo el **SELECT**. Y **Crono SQL** eliminará precisamente esos registros:

``` sql
DELETE dwh.FactSalesOrderDetails
select det.SalesOrderDetailSid #SalesOrderDetailSid, det.SalesOrderId, det.SalesOrderDetailsId
from dwh.FactSalesOrderDetails det
inner join dwh.FactSalesOrderHeader using SalesOrderSid
inner join dwh.DimCustomers using FactSalesOrderHeader(CustomerSid)
WHERE DimCustomers.Customer='Jada Morris'
```

  

  <details>
<summary>Ver SQL compilado</summary>

``` sql
;WITH
query AS (
  SELECT
    det.SalesOrderDetailSid AS SalesOrderDetailSid,
    det.SalesOrderId AS SalesOrderId,
    det.SalesOrderDetailsId AS SalesOrderDetailsId
  FROM dwh.FactSalesOrderDetails det
  INNER JOIN dwh.FactSalesOrderHeader ON (det.SalesOrderSid=FactSalesOrderHeader.SalesOrderSid)
  INNER JOIN dwh.DimCustomers ON (FactSalesOrderHeader.CustomerSid=DimCustomers.CustomerSid)
  WHERE DimCustomers.Customer='Jada Morris'
)
DELETE FROM dwh.FactSalesOrderDetails
WHERE
  EXISTS (SELECT 1 FROM query WHERE FactSalesOrderDetails.SalesOrderDetailSid=query.SalesOrderDetailSid);

```

</details>


De hecho, no es necesario que la consulta tenga ninguna referencia a la tabla de la que se quieren eliminar registros. El ejemplo anterior se puede simplificar de la siguiente manera:

``` sql
DELETE dwh.FactSalesOrderDetails 	
SELECT #SalesOrderSid 
FROM dwh.FactSalesOrderHeader 
INNER JOIN dwh.DimCustomers using CustomerSid
WHERE
  DimCustomers.Customer='Katherine Turner'
```

  

  <details>
<summary>Ver SQL compilado</summary>

``` sql
;WITH
query AS (
  SELECT SalesOrderSid
  FROM dwh.FactSalesOrderHeader
  INNER JOIN dwh.DimCustomers ON (FactSalesOrderHeader.CustomerSid=DimCustomers.CustomerSid)
  WHERE DimCustomers.Customer='Katherine Turner'
)
DELETE FROM dwh.FactSalesOrderDetails
WHERE
  EXISTS (SELECT 1 FROM query WHERE FactSalesOrderDetails.SalesOrderSid=query.SalesOrderSid);

```

</details>


En todos los casos, lo que marca los registros que se deben eliminar es la *"clave de eliminación"* (marcada con el **carácter #**).

La consulta del **DELETE** también puede utilizar todas las características del **SELECT** de **Crono SQL**. La siguiente sentencia elimina los clientes sin ninguna venta:

``` sql
DELETE dwh.DimCustomers
SELECT #customerSid
FROM dwh.DimCustomers
ANTI JOIN dwh.FactSalesOrderHeader USING CustomerSid
```

  

  <details>
<summary>Ver SQL compilado</summary>

``` sql
;WITH
query AS (
  SELECT customerSid
  FROM dwh.DimCustomers
  WHERE NOT EXISTS (SELECT 1 FROM dwh.FactSalesOrderHeader WHERE DimCustomers.CustomerSid=FactSalesOrderHeader.CustomerSid)
)
DELETE FROM dwh.DimCustomers
WHERE
  EXISTS (SELECT 1 FROM query WHERE DimCustomers.customerSid=query.customerSid);

```

</details>
