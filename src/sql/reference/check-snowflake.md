﻿---
title: CHECK SNOWFLAKE
Autogenerated: true
---

# CHECK SNOWFLAKE

La cláusula **CHECK SNOWFLAKE**, colocada justo después de todos los **JOINs**, verifica que las relaciones no pierden ni duplican ningún registro de la tabla del **FROM**. Se trata de una comprobación fundamental para validar que no estamos cometiendo ninguna equivocación al escribir la consulta y que los datos de origen son coherentes con lo esperado.

<div class="mt-1 mb-2 row">
  <div class="col-lg-12">

``` sql
SELECT
  year(sales.OrderDate) AS OrderYear,
  Customer.CustomerId AS CustomerId,
  concat(CustomerPerson.FirstName,' ',CustomerPerson.LastName) AS Customer,
  CustomerPerson.FirstName AS FirstName,
  CustomerPerson.LastName AS LastName,
  sum(sales.subtotal) AS Amount
FROM staging.SalesOrderHeader sales
INNER JOIN staging.customer USING CustomerId
INNER JOIN staging.Person CustomerPerson USING Customer(PersonID BusinessEntityId)
CHECK SNOWFLAKE
WHERE year(sales.OrderDate)=2012
```

  <b-button class="float-right btn" size="sm" v-b-modal.modal-1 style="background-color: #3eaf7c">Ver SQL compilado</b-button>

  <b-modal id="modal-1" size="lg" title="Ver SQL compilado" :hide-footer="true" > 
``` sql
IF EXISTS (
  SELECT count(*)
  FROM staging.SalesOrderHeader sales
  LEFT JOIN staging.customer ON (sales.CustomerId=customer.CustomerId)
  LEFT JOIN staging.Person CustomerPerson ON (Customer.PersonID=CustomerPerson.BusinessEntityId)
  HAVING count(CASE WHEN customer.CustomerId IS NOT NULL AND CustomerPerson.BusinessEntityId IS NOT NULL THEN 1 END) <> (SELECT count(*) FROM staging.SalesOrderHeader sales)
) THROW 50001,'Las relaciones de esta consulta pierden o duplican registros de sales.',1

SELECT
  year(sales.OrderDate) AS OrderYear,
  Customer.CustomerId AS CustomerId,
  concat(CustomerPerson.FirstName,' ',CustomerPerson.LastName) AS Customer,
  CustomerPerson.FirstName AS FirstName,
  CustomerPerson.LastName AS LastName,
  sum(sales.subtotal) AS Amount
FROM staging.SalesOrderHeader sales
INNER JOIN staging.customer ON (sales.CustomerId=customer.CustomerId)
INNER JOIN staging.Person CustomerPerson ON (Customer.PersonID=CustomerPerson.BusinessEntityId)
WHERE year(sales.OrderDate)=2012
GROUP BY
  year(sales.OrderDate),
  Customer.CustomerId,
  concat(CustomerPerson.FirstName,' ',CustomerPerson.LastName),
  CustomerPerson.FirstName,
  CustomerPerson.LastName

```
  </b-modal>

  </div>
</div>


La cláusula **CHECK SNOWFLAKE** verifica que todas las ventas correspondan a un cliente y que ese cliente exista en la tabla de personas. Si no fuera así, la consulta no se ejecutaría y devolvería un error.
