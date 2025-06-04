---
sidebar_position: 2
---

# Sentencia SELECT

En esta sección se documenta el funcionamiento de la sentencia **SELECT** del lenguaje. La sintaxis **SELECT** de **Crono SQL** aporta algunas ventajas (algunas importantes) frente al SQL ISO. Sin embargo, el mayor beneficio del lenguaje se manifiesta en el resto de instrucciones DML (**INSERT**, **UPDATE**, **MERGE**, …), donde Crono SQL automatiza toda la lógica de carga. Por eso la sentencia **SELECT** es tan importante… ¡Es prácticamente lo único que tendrá que codificar el desarrollador de un proyecto ETL/DWH!

A continuación se describen sistemáticamente todas las características soportadas en la sentencia **SELECT** del lenguaje **Crono SQL**.

## Basado en el lenguaje SQL 

**Proposición:** Cualquier sentencia **SELECT** válida en SQL es válida también en **Crono SQL**

```sql
SELECT 'Hola mundo';
```

SQL compilado:
```sql
SELECT 'Hola mundo' AS expr1
```

Si ninguna tabla participa en la consulta, se debe terminar la sentencia con el carácter punto y coma ";". En cualquier otro caso, el punto y coma es opcional.

```sql
select *
from staging.Customer
```

SQL compilado:
```sql
SELECT *
FROM staging.Customer
```

Se pueden incluir las cláusulas **JOIN**, **WHERE**, **GROUP BY**, **HAVING** y/o **ORDER BY**

```sql
SELECT
  Customer.CustomerId AS CustomerId,
  Person.FirstName AS FirstName,
  Person.LastName AS LastName,
  sum(Sales.subtotal) AS Amount
FROM staging.SalesOrderHeader Sales
INNER JOIN staging.Customer ON (Sales.customerId=Customer.customerId)
LEFT JOIN staging.Person ON (Customer.PersonID=Person.BusinessEntityId)
WHERE Person.FirstName='Fernando'
GROUP BY
  Customer.CustomerId,
  Person.FirstName,
  Person.LastName
HAVING sum(Sales.subtotal)>3000
ORDER BY sum(Sales.subtotal) DESC
```

Se pueden utilizar las funciones propias del motor de base de datos o funciones definidas por el usuario.

```sql
SELECT
  year(sales.OrderDate) AS OrderYear,
  Customer.CustomerId AS CustomerId,
  concat(CustomerPerson.FirstName,' ',CustomerPerson.LastName) AS Customer,
  CustomerPerson.FirstName AS FirstName,
  CustomerPerson.LastName AS LastName,
  sum(sales.subtotal) AS Amount
FROM staging.SalesOrderHeader sales
INNER JOIN staging.customer ON (sales.customerId=customer.customerId)
LEFT JOIN staging.Person CustomerPerson ON (Customer.PersonID=CustomerPerson.BusinessEntityId)
WHERE year(sales.OrderDate)=2012
GROUP BY
  year(sales.OrderDate),
  Customer.CustomerId,
  concat(CustomerPerson.FirstName,' ',CustomerPerson.LastName),
  CustomerPerson.FirstName,
  CustomerPerson.LastName
```

## Referencia a columnas existentes

A diferencia del SQL ISO, en **Crono SQL** se puede hacer referencia a otra columna de la sentencia SELECT mediante el Alias de la columna.

```sql
SELECT
  year(sales.OrderDate) AS OrderYear,
  Customer.CustomerId AS CustomerId,
  concat(CustomerPerson.FirstName,' ',CustomerPerson.LastName) AS Customer,
  upper(customer) UpperCustomer,
  CustomerPerson.FirstName AS FirstName,
  CustomerPerson.LastName AS LastName,
  sum(sales.subtotal) AS Amount
FROM staging.SalesOrderHeader sales
INNER JOIN staging.customer ON sales.CustomerId=customer.CustomerId
LEFT JOIN staging.Person CustomerPerson ON Customer.PersonID=CustomerPerson.BusinessEntityId
WHERE OrderYear=2012
```

En este ejemplo, se puede observar que:
- Se define la columna `Customer` como la concatenación del nombre y apellido.
- Se usa la columna `Customer` para obtener la versión en mayúsculas `UpperCustomer`.
- Se usa la columna `OrderYear` en la cláusula WHERE.

Esto no sería posible en SQL estándar, donde no se puede hacer referencia a un alias de columna en la misma sentencia SELECT.
