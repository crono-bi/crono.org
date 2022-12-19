---
sidebarDepth: 2
---


# JOIN 

**JOIN** es un operador SQL que se utiliza para combinar filas de dos o más tablas en una única tabla resultante. Los JOIN se basan en una relación que existe entre las tablas involucradas. Por ejemplo, si tienes una tabla de clientes y otra tabla de pedidos, puedes usar un JOIN para obtener información sobre los pedidos realizados por cada cliente.

**Crono SQL** soporta todos los JOIN con la sintaxis estándar de SQL:

``` sql
SELECT *
FROM clients
INNER JOIN orders ON clients.client_id = orders.client_id
```

## Clausula USING

EL estándar ANSI también define la cláusula **USING** para relacionar dos tablas, aunque los motores actuales de BBDD aún no la incorporan plenamente. **Crono SQL** permite usar esta sintaxis ANSI:

``` CronoSqlSample
SELECT *
FROM orders 
INNER JOIN clients USING (client_id)
```

La cláusla **USING** permite relacionar dos tablas cuando su relación es un equi-join, es decir, cuando la relación se basa en la igualdad de dos o más campos. Se puede usar **USING** cuando la relación la forman más 2 o más campos, incluso cuando no se llaman igual.

``` CronoSqlSample
SELECT *
FROM orders 
INNER JOIN clients USING (company_id, order_client_id client_id)
INNER JOIN countries USING clients(country_id)
```

En el ejemplo anterior la tabla `countries` se relaciona con la tabla `clients`. Si se omite el nombre de la tabla de la izquierda se asume que la relación se realiza contra la tabla del **FROM** (`orders` en este caso), generando un SQL diferente.

``` CronoSqlSample
SELECT *
FROM orders 
INNER JOIN clients USING (company_id, order_client_id client_id)
INNER JOIN countries USING (country_id)
```


Existen diferentes tipos de JOINs, que se diferencian en función de la forma en que combinan las filas de las tablas. **Crono SQL** soporta todos los tipos de JOIN de SQL y aporta algunos nuevos. A continuación se describen los distintos tipos de **JOIN** y se  incluyen ejemplos.

## INNER JOIN

Un **INNER JOIN** es un tipo de JOIN en SQL que devuelve solo las filas que cumplen la condición del JOIN en ambas tablas. 

``` CronoSqlSample
SELECT *
FROM clients 
INNER JOIN countries USING (country_id)
```

En este ejemplo, se están uniendo las filas de `clients` y `countries` que tienen el mismo valor en la columna `country_id'.

Es importante tener en cuenta que un **INNER JOIN** solo incluye las filas que cumplen la condición de igualdad entre las columnas. Si hay filas en alguna de las tablas que no tienen una correspondencia en la otra tabla, no se incluyen en el resultado del INNER JOIN. Es decir, si existe un cliente que no tiene informado el *país* -o tiene un código que no aparece en el maestro- no se incluirá en el resultado de la consulta.

El INNER JOIN es el tipo de JOIN más común.

## LEFT JOIN

Un **LEFT JOIN** es un tipo de JOIN en SQL que devuelve todas las filas de la tabla a la izquierda del JOIN, junto con las filas de la tabla a la derecha que cumplen la condición del JOIN. Se le llama **LEFT JOIN** porque la tabla a la izquierda del JOIN es la que determina qué filas se incluyen en el resultado final.

Un **LEFT JOIN** se realiza de la siguiente manera:

``` CronoSqlSample
SELECT *
FROM clients 
LEFT JOIN countries USING (country_id)
```


En este ejemplo se devolverán todos los clientes, tengan o no informado el *país*. Cuando no exista correspondencia en la tabla de la derecha los campos se rellenan con valores **NULL**.

La siguiente consulta permite obtener el listado de clientes que no tienen el *país* informado:

``` CronoSqlSample
SELECT clients.*
FROM clients 
LEFT JOIN countries USING (country_id)
WHERE countries.country_id IS NULL
```

El **INNER JOIN** y el **LEFT JOIN** son con diferencia los tipos de JOINs más comunes. El resto de tipos realmente se usan muy poco en un proyecto ETL/DWH.


## RIGHT JOIN

El **RIGHT JOIN** es similar al **LEFT JOIN**, pero intercambia las tablas a la izquierda y a la derecha. Es decir, devuelve todas las filas de la tabla a la derecha del join, junto con las filas de la tabla a la izquierda que cumplen la condición del join.

Prácticamente en todos los casos se puede usar un **LEFT JOIN** y el código resulta más natural y comprensible. Se recomienda evitar el uso del **RIGHT JOIN** siempre que sea posible.

``` CronoSqlSample
SELECT clients.*, countries.Name
FROM countries  
RIGHT JOIN clients USING (country_id)
```

En este ejemplo se devolverán todos los clientes, tengan o no informado el *país*.

## FULL JOIN

Un **FULL JOIN** es un tipo de JOIN en SQL que devuelve todas las filas de ambas tablas, independientemente de si cumplen o no la condición del JOIN. Se le llama FULL JOIN porque incluye todas las filas de ambas tablas.

Un FULL JOIN se realiza de la siguiente manera:

``` CronoSqlSample
SELECT *
FROM customers1
FULL JOIN customers2 using(customer_id)
```

Este ejemplo devolverá todos los clientes de ambas tablas, aparezcan solo en la tabla de la izquierda, solo en la tabla de la derecha, o aparezcan en ambas.


Este tipo de JOIN tampoco es habitual en proyectos ETL/DWH, aunque puede ser necesario para requerimientos complejos o modelos de origen sub-óptimos.


Que no se use mucho en proyectos ETL no implica que no haya otros escenarios donde el **FULL JOIN** resulte muy conveniente y útil. **Crono Analysis** utiliza **FULL JOINs** cuando necesita mezclar información de dos tablas de hecho o comparar indicadores de periodos distintos.

``` sql
SELECT
  coalesce(LB_VENTAS1.Tienda,LB_VENTAS3.Tienda) AS Tienda,
  LB_VENTAS1.auxcol_2_ AS [Unidades 2011],
  LB_VENTAS3.auxcol_3_ AS [Unidades 2012]
FROM (
  SELECT
    LB_TIENDAS.NOMBRE AS Tienda,
    sum(LB_VENTAS2.UNIDADES) AS auxcol_2_
  FROM dbo.LB_VENTAS_DIARIAS LB_VENTAS2
  INNER JOIN dbo.LB_TIENDAS LB_TIENDAS ON (LB_VENTAS2.ID_TIENDA=LB_TIENDAS.ID_TIENDA)
  INNER JOIN dbo.LB_TIEMPO LB_TIEMPO ON (LB_VENTAS2.FECHA=LB_TIEMPO.FECHA)
  WHERE CAST(LB_TIEMPO.ANYO AS varchar(4))='2011'
  GROUP BY LB_TIENDAS.NOMBRE
) LB_VENTAS1
FULL JOIN (
  SELECT
    LB_TIENDAS.NOMBRE AS Tienda,
    sum(LB_VENTAS2.UNIDADES) AS auxcol_3_
  FROM dbo.LB_VENTAS_DIARIAS LB_VENTAS2
  INNER JOIN dbo.LB_TIENDAS LB_TIENDAS ON (LB_VENTAS2.ID_TIENDA=LB_TIENDAS.ID_TIENDA)
  INNER JOIN dbo.LB_TIEMPO LB_TIEMPO ON (LB_VENTAS2.FECHA=LB_TIEMPO.FECHA)
  WHERE CAST(LB_TIEMPO.ANYO AS varchar(4))='2012'
  GROUP BY LB_TIENDAS.NOMBRE
) LB_VENTAS3 ON (LB_VENTAS3.Tienda=LB_VENTAS1.Tienda OR (LB_VENTAS3.Tienda IS NULL AND LB_VENTAS1.Tienda IS NULL))
```

La consulta anterior es una consulta típica generada por **Crono SQL** que utiliza el **FULL JOIN** para comparar las ventas de 2 años.


## CROSS JOIN

Un **CROSS JOIN** es un tipo de JOIN en SQL que devuelve todas las combinaciones posibles de filas entre dos tablas. Se le llama CROSS JOIN porque cruza todos los registros de la primera tabla con todos los registros de la segunda tabla.

``` sql
SELECT 
  dates.date,
  stores.store
from stores
cross join dates
where year(dates.date)=2022
```

La consulta anterior hará un producto cartesiano entre todas las tiendas y todas las fechas del 2022.

En función del número de registros de las tablas involucradas el resultado puede ser enorme, por lo que conviene usarlo correctamente.



## CROSS APPLY

**CROSS APPLY** es una cláusula de SQL que se utiliza para unir dos tablas mediante una función que devuelve un conjunto de filas como resultado.

``` sql
SELECT *
FROM tabla1
CROSS APPLY función_de_tabla_valor(tabla1.columna)
```

Un **CROSS APPLY** es similar a un **CROSS JOIN** pero permite referenciar a las columnas de la tabla izquierda desde la subconsulta derecha.


``` sql
SELECT *
FROM stores
CROSS APPLY (
	select 
		sales.store_id,
		sum(sales.quantity) TotalQuantity 
	from sales
	where  sales.store_id=stores.store_id
	GROUP BY sales.store_id
) ventas
```

Normalmente no es necesario usar `CROSS APPLY` y existen forman alternativas para formular la misma consulta. La consulta anterior se puede escribir de la siguiente manera:

``` CronoSqlSample
SELECT stores.name,sales.TotalQuantity
FROM stores
LEFT JOIN (
	select 
		sales.store_id,
		sum(sales.quantity) TotalQuantity 
	from sales
) ventas using store_id
```

## ANTI JOIN

Un ANTI JOIN es un tipo de JOIN en SQL que devuelve las filas de una tabla que no tienen correspondencia en la otra tabla. Se le llama ANTI JOIN porque es el opuesto de un JOIN normal, que devuelve las filas que tienen correspondencia en ambas tablas.

**Crono SQL** tiene una sintaxis propia para realizar este tipo de consultas:

``` CronoSqlSample
SELECT clients.*
FROM clients 
ANTI JOIN countries USING (country_id)
```



EL **ANTI JOIN** se usa mucho durante la construcción de la ETL para detectar los registros que se pierden indebidamente en alguna relación. Por ejemplo, la consulta anterior serviría para encontrar los clientes que no tienen el *país* informado.

El código SQL resultante añade un predicado **NOT EXISTS**, por lo que no hay riesgo de duplicar registros. La siguiente consulta devuelve todos los clientes sin ventas en un periodo especificado:

``` CronoSqlSample
SELECT clients.*
FROM clients 
ANTI JOIN (select * from sales where year(date)=2022) sales2020  USING (client_id)
```

La consulta anterior es equivalente a esta otra que usa la clausula **FILTER**

``` CronoSqlSample
SELECT clients.*
FROM clients 
ANTI JOIN  sales FILTER (year(date)=2022) sales2020  USING (client_id)
```

## SEMI JOIN

Un **SEMI JOIN** es un tipo de JOIN en SQL que devuelve las filas de una tabla que tienen correspondencia en la otra tabla. Se le llama **SEMI JOIN** porque solo incluye las filas de la tabla izquierda que tienen una correspondencia en la tabla derecha. Es decir, a diferencia del **INNER JOIN**, no devuelve la información de la tabla derecha.

La siguiente consulta devuelve los clientes que tienen ventas.

``` CronoSqlSample
SELECT *
FROM clients 
SEMI JOIN sales USING (client_id)
```

El código SQL resultante añade un predicado **EXISTS**, por lo que no hay riesgo de duplicar registros.