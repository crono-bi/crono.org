---
title: "Sentencia SELECT"
sidebar:
  order: 1
---

En esta sección se documenta el funcionamiento de la sentencia **SELECT** del lenguaje. **Crono SQL** extiende el SELECT estándar sin romper ninguna compatibilidad: cualquier consulta SQL existente funciona sin cambios. Las extensiones se añaden encima, como capas opcionales que el desarrollador adopta a su ritmo.

La sentencia **SELECT** es la pieza central del lenguaje porque todas las instrucciones de carga (**MERGE**, **INSERT**, **UPDATE**...) se construyen sobre ella. En la práctica, es casi lo único que el desarrollador de un proyecto ETL/DWH tiene que escribir.

A continuación se describen sistemáticamente todas las extensiones y características de la sentencia **SELECT** de **Crono SQL**.


## Basado en el lenguaje SQL

Todo el conocimiento SQL existente es válido en **Crono SQL**. Cualquier sentencia **SELECT** válida en SQL es también válida en **Crono SQL**, sin modificaciones.

```crono-sql
SELECT 'Hola mundo';
```

Si ninguna tabla participa en la consulta, se debe terminar la sentencia con el carácter punto y coma ";". En cualquier otro caso, el punto y coma es opcional.

```crono-sql
SELECT *
FROM staging.customers
```

Se pueden incluir las cláusulas **JOIN**, **WHERE**, **GROUP BY**, **HAVING** y/o **ORDER BY**.

```crono-sql
SELECT
  customers.customer_id,
  customers.company_name AS customer,
  sum(orders.freight) AS total_freight
FROM staging.orders
INNER JOIN staging.customers ON (orders.customer_id=customers.customer_id)
WHERE customers.country='Germany'
GROUP BY
  customers.customer_id,
  customers.company_name
HAVING sum(orders.freight) > 100
ORDER BY sum(orders.freight) DESC
```

Se pueden utilizar las funciones propias del motor de base de datos o funciones definidas por el usuario.

```crono-sql
SELECT
  year(orders.order_date) AS order_year,
  customers.customer_id,
  customers.company_name AS customer,
  customers.contact_name,
  sum(orders.freight) AS total_freight
FROM staging.orders
INNER JOIN staging.customers ON (orders.customer_id=customers.customer_id)
WHERE year(orders.order_date) = 2023
GROUP BY
  year(orders.order_date),
  customers.customer_id,
  customers.company_name,
  customers.contact_name
```


## Columnas inteligentes

En SQL ISO no está permitido hacer referencia a un alias definido en el mismo SELECT. Si una columna calculada se necesita en otra expresión, hay que repetir la expresión original o envolver la consulta en una subconsulta. **Crono SQL** elimina esa limitación: cualquier columna del SELECT puede referenciarse por su alias desde cualquier otra columna del mismo SELECT.

Esto aplica directamente el principio **sin repeticiones**: cada cálculo se escribe una sola vez. Si la lógica cambia, se actualiza en un único lugar y el resto de la consulta se ajusta automáticamente.

El siguiente ejemplo usa `order_year` en el WHERE sin repetir la expresión `year(orders.order_date)`, y `upper_customer` referencia el alias `customer` en lugar de duplicar `customers.company_name`.

```crono-sql
SELECT
  year(orders.order_date) AS order_year,
  customers.customer_id,
  customers.company_name AS customer,
  upper(customer) AS upper_customer,
  customers.contact_name,
  sum(orders.freight) AS total_freight
FROM staging.orders
INNER JOIN staging.customers ON orders.customer_id=customers.customer_id
WHERE order_year = 2023
```

La reutilización de alias es especialmente útil en columnas agregadas. En este ejemplo, `total_amount` y `total_discount` se calculan una sola vez y se reutilizan en `divide()` sin repetir las expresiones.

```crono-sql
SELECT
  customers.company_name,
  sum(order_details.unit_price * order_details.quantity) total_amount,
  sum(order_details.unit_price * order_details.quantity * order_details.discount) total_discount,
  divide(total_discount, total_amount) discount_pct
FROM staging.order_details
INNER JOIN staging.orders USING order_id
INNER JOIN staging.customers USING orders(customer_id)
```


## Prescindiendo del GROUP BY

En SQL ISO, el **GROUP BY** obliga a listar de nuevo todas las columnas no agregadas, duplicando información que ya está presente en el SELECT. **Crono SQL** elimina esa repetición: el compilador infiere automáticamente qué columnas deben agruparse.

Se puede utilizar la cláusula **GROUP BY ALL** para indicar explícitamente que se agrupe por todas las columnas que no sean funciones de agregación.

```crono-sql
SELECT
  year(orders.order_date) AS order_year,
  customers.customer_id,
  customers.company_name AS customer,
  customers.contact_name,
  sum(orders.freight) AS total_freight
FROM staging.orders
INNER JOIN staging.customers ON (orders.customer_id=customers.customer_id)
WHERE year(orders.order_date) = 2023
GROUP BY ALL
```

O prescindir completamente de la cláusula **GROUP BY**. **Crono SQL** incluirá las columnas necesarias en el SQL generado.

```crono-sql
SELECT
  year(orders.order_date) AS order_year,
  customers.customer_id,
  customers.company_name AS customer,
  customers.contact_name,
  sum(orders.freight) AS total_freight
FROM staging.orders
INNER JOIN staging.customers ON (orders.customer_id=customers.customer_id)
WHERE year(orders.order_date) = 2023
```


## USING

La cláusula **USING** simplifica la sintaxis de los JOINs. En lugar de escribir la condición completa `ON (tabla_a.campo = tabla_b.campo)`, basta con indicar el nombre del campo o la tabla de la que proviene la clave. El resultado es más conciso y más fácil de leer.

```crono-sql
SELECT
  year(orders.order_date) AS order_year,
  customers.customer_id,
  customers.company_name AS customer,
  customers.contact_name,
  sum(orders.freight) AS total_freight
FROM staging.orders
INNER JOIN staging.customers USING orders(customer_id)
WHERE year(orders.order_date) = 2023
```

**USING** también puede utilizarse cuando los campos de la equi-join tienen distinto nombre en cada tabla.

```crono-sql
SELECT
  year(orders.order_date) AS order_year,
  customers.customer_id,
  customers.company_name AS customer,
  shippers.company_name AS shipper,
  sum(orders.freight) AS total_freight
FROM staging.orders
INNER JOIN staging.customers USING orders(customer_id)
INNER JOIN staging.shippers USING orders(ship_via shipper_id)
WHERE year(orders.order_date) = 2023
```

Si no se especifica el nombre de la tabla izquierda, se asume que es la tabla del **FROM**.

```crono-sql
SELECT
  year(orders.order_date) AS order_year,
  customers.customer_id,
  customers.company_name AS customer,
  shippers.company_name AS shipper,
  sum(orders.freight) AS total_freight
FROM staging.orders
INNER JOIN staging.customers USING customer_id
INNER JOIN staging.shippers USING orders(ship_via shipper_id)
WHERE year(orders.order_date) = 2023
```

Si la relación equi-join está formada por distintos campos, se pueden especificar en la cláusula **USING** separados por comas.

```crono-sql
SELECT count(*)
FROM staging.orders
INNER JOIN staging.customers USING (customer_id)
INNER JOIN staging.employees USING orders(employee_id, ship_country region)
```


## CHECK SNOWFLAKE

La calidad del dato forma parte del lenguaje, no es un paso separado. La cláusula **CHECK SNOWFLAKE**, colocada justo después de los **JOINs**, verifica en tiempo de ejecución que las relaciones no pierden ni duplican ningún registro de la tabla del **FROM**. Si los datos de origen no cumplen la condición, la consulta no se ejecuta y devuelve un error inmediatamente, antes de que ningún dato incorrecto llegue al destino.

```crono-sql
SELECT
  year(orders.order_date) AS order_year,
  customers.customer_id,
  customers.company_name AS customer,
  employees.first_name,
  employees.last_name,
  sum(orders.freight) AS total_freight
FROM staging.orders
INNER JOIN staging.customers USING customer_id
INNER JOIN staging.employees USING employee_id
CHECK SNOWFLAKE
WHERE year(orders.order_date) = 2023
```

En este ejemplo, **CHECK SNOWFLAKE** verifica que todas las órdenes correspondan a exactamente un cliente y un empleado válidos. Si alguna orden quedara sin cliente o sin empleado, o si los JOINs produjeran duplicados, la carga fallaría antes de ejecutarse.


## Subconsultas

Se pueden incluir subconsultas en los JOINs de la misma forma que en SQL estándar.

```crono-sql
SELECT
  orders.order_id,
  orders.order_date,
  customers.company_name AS customer,
  bulk_items.product_id AS bulk_product,
  bulk_items.quantity,
  discounted.product_id AS discounted_product,
  discounted.discount
FROM staging.orders
INNER JOIN staging.customers USING customer_id
LEFT JOIN (
  SELECT * FROM staging.order_details
  WHERE quantity > 10) bulk_items USING order_id
LEFT JOIN (
  SELECT * FROM staging.order_details
  WHERE discount > 0) discounted USING order_id
```

También se puede usar una subconsulta en el FROM para operar sobre el resultado de otra consulta. Este ejemplo calcula la media de las ventas anuales por producto: la subconsulta interior obtiene el total por producto y año, y la consulta exterior agrega esos totales.

```crono-sql
SELECT
  product_name,
  product_id,
  avg(annual_revenue) AS avg_annual_revenue
FROM (
  SELECT
    products.product_name,
    products.product_id,
    year(orders.order_date) AS order_year,
    sum(order_details.unit_price * order_details.quantity) AS annual_revenue
  FROM staging.order_details
  INNER JOIN staging.orders USING order_id
  INNER JOIN staging.products USING product_id
) subquery
```

Las subconsultas en los JOINs —como las del primer ejemplo— son útiles y a veces necesarias: permiten filtrar o preparar una tabla antes de combinarla con el resto de la consulta, y su lugar en el código es exactamente el correcto, junto al JOIN que las usa.

Las subconsultas que envuelven un SELECT completo en el FROM son otra historia. Funcionan, pero presentan problemas de legibilidad y mantenimiento que se acumulan con la complejidad. La consulta exterior no puede referenciar directamente las columnas de la interior sin pasar por el alias de la subconsulta. Si la lógica cambia, hay que buscar dentro de los paréntesis para entender qué hace cada nivel. Con dos niveles de anidamiento el código ya resulta difícil de leer; con tres o más, prácticamente imposible de mantener.

**Crono SQL** resuelve este problema con los **SELECTs anidados**: en lugar de envolver la consulta interior entre paréntesis y darle un alias, se apila directamente encima como una capa separada. El resultado es el mismo SQL compilado, pero el código se lee de forma natural, de abajo a arriba, sin indentación creciente ni nombres de subconsulta artificiales como `subquery`, `a` o `inner_query`.


## SELECTs anidados

**Crono SQL** permite apilar varios **SELECT** en una misma consulta como alternativa a las subconsultas del ejemplo anterior. Los SELECTs apilados funcionan como un pipeline de transformaciones: cada operador actúa sobre el resultado del anterior, de abajo a arriba. La consulta se construye por capas, y cada capa expresa una única transformación con toda la potencia de SQL.

Esta idea no es nueva. Es la misma filosofía de composición que tienen los pipes de Unix (`|`), los DataFrames de Pandas o dplyr en R: encadenar operaciones simples para construir transformaciones complejas. La diferencia es que aquí no se abandona SQL en ningún momento — se siguen usando SELECT, WHERE, GROUP BY, ORDER BY, con la misma sintaxis y el mismo compilador. No hay un nuevo paradigma que aprender, solo una forma más expresiva de componer lo que ya se sabe.

La consulta anterior —media de ventas anuales por producto— se escribe en **Crono SQL** apilando dos SELECT:

```crono-sql
SELECT
  product_name,
  product_id,
  avg(annual_revenue) AS avg_annual_revenue
SELECT
  products.product_name,
  products.product_id,
  year(orders.order_date) AS order_year,
  sum(order_details.unit_price * order_details.quantity) AS annual_revenue
FROM staging.order_details
INNER JOIN staging.orders USING order_id
INNER JOIN staging.products USING product_id
```

Las capas apiladas no se limitan a la cláusula **SELECT**. También se pueden apilar **WHERE** y **ORDER BY** como capas independientes que operan sobre el resultado de las capas inferiores. Esto permite filtrar o ordenar sobre valores agregados sin necesidad de subconsultas ni CTEs.

La siguiente consulta devuelve los clientes con más de 10.000 en ventas, ordenados de mayor a menor.

```crono-sql
SELECT ORDER BY total_sales DESC
SELECT WHERE total_sales > 10000
SELECT
  customers.company_name,
  sum(order_details.unit_price * order_details.quantity) AS total_sales
FROM staging.order_details
INNER JOIN staging.orders USING order_id
INNER JOIN staging.customers USING orders(customer_id)
```

Las cláusulas apiladas permiten también contar el número de registros que devuelve una consulta previa.

```crono-sql
SELECT count(*)
SELECT
  products.product_name,
  products.product_id,
  sum(order_details.unit_price * order_details.quantity) AS revenue
FROM staging.order_details
INNER JOIN staging.products USING product_id
```

Esta capacidad es especialmente valiosa durante el desarrollo. Cuando se está construyendo o depurando una consulta compleja, es habitual querer inspeccionarla: contar cuántos registros devuelve, agrupar los resultados de una forma distinta, filtrar por un valor concreto para verificar que el dato es correcto. Con los SELECTs apilados, esa inspección se añade encima de la consulta original sin tocarla. Cuando ya no se necesita, se elimina la capa superior y la consulta queda exactamente como estaba.


## FILTER

**FILTER** es un modificador de tabla que aplica una condición sobre los registros de la tabla antes de que se ejecute el JOIN. El compilador genera una subconsulta equivalente a la del ejemplo anterior, pero la sintaxis es más legible: el filtro se declara junto a la tabla a la que pertenece, no en un WHERE alejado de su contexto.

```crono-sql
SELECT
  orders.order_id,
  orders.order_date,
  customers.company_name AS customer,
  bulk_items.product_id AS bulk_product,
  bulk_items.quantity,
  discounted.product_id AS discounted_product,
  discounted.discount
FROM staging.orders
INNER JOIN staging.customers USING customer_id
LEFT JOIN staging.order_details FILTER (quantity > 10) bulk_items USING order_id
LEFT JOIN staging.order_details FILTER (discount > 0) discounted USING order_id
```

**FILTER** es especialmente útil en combinación con **CHECK SNOWFLAKE**. El siguiente ejemplo verifica que cada orden corresponda exactamente a un cliente alemán y a un empleado. Si no fuera así, la consulta fallaría antes de ejecutarse.

```crono-sql
SELECT
  orders.order_id,
  orders.order_date,
  customers.company_name AS customer,
  customers.country,
  employees.first_name,
  employees.last_name
FROM staging.orders
INNER JOIN staging.customers FILTER (country='Germany') german_customers USING customer_id
INNER JOIN staging.employees USING employee_id
CHECK SNOWFLAKE
```


## COLUMNS y ADD COLUMNS

**COLUMNS** y **ADD COLUMNS** son modificadores de tabla que, al igual que **FILTER**, generan una subconsulta sobre la tabla. La diferencia está en qué hacen con las columnas.

**COLUMNS** selecciona y opcionalmente renombra un subconjunto de columnas, descartando el resto. Es útil para exponer solo los campos necesarios de una tabla con muchas columnas, o para renombrarlos antes de que entren en el JOIN. Se puede combinar con **FILTER**.

```crono-sql
SELECT
  orders.order_id,
  orders.order_date,
  customers.customer_name,
  customers.customer_country,
  employees.first_name,
  employees.last_name
FROM staging.orders
INNER JOIN staging.customers COLUMNS (customer_id, company_name customer_name, country customer_country) FILTER (country='Germany') USING customer_id
INNER JOIN staging.employees USING employee_id
```

**ADD COLUMNS** conserva todas las columnas físicas de la tabla y añade expresiones calculadas. Las expresiones se escriben sin prefijo de tabla y quedan disponibles como nuevas columnas en el resto de la consulta. Esto permite definir un cálculo una sola vez, junto a la tabla donde tiene sentido, y reutilizarlo después sin repetición.

El siguiente ejemplo define `total_amount` directamente sobre `order_details`. Al quedar disponible como columna de la subconsulta resultante, puede reutilizarse dos veces en el SELECT superior sin repetir la expresión.

```crono-sql
SELECT
  company_name,
  sum(total_amount) total_amount,
  sum(order_details.total_amount * order_details.discount) total_discount,
  divide(total_discount, total_amount) discount_pct
FROM staging.order_details ADD COLUMNS (unit_price * quantity total_amount)
INNER JOIN staging.orders USING order_id
INNER JOIN staging.customers USING orders(customer_id)
```

**ADD COLUMNS** y **FILTER** se pueden combinar. El siguiente ejemplo añade `total_amount` y al mismo tiempo restringe las líneas a las que tienen descuento aplicado.

```crono-sql
SELECT
  company_name,
  sum(total_amount) total_amount,
  sum(order_details.total_amount * order_details.discount) total_discount,
  divide(total_discount, total_amount) discount_pct
FROM staging.order_details ADD COLUMNS (unit_price * quantity total_amount) FILTER (discount > 0)
INNER JOIN staging.orders USING order_id
INNER JOIN staging.customers USING orders(customer_id)
```


## ANTI JOIN

El lenguaje **Crono SQL** soporta todos los *joins* habituales:

- **INNER JOIN**
- **LEFT JOIN**
- **RIGHT JOIN**
- **FULL JOIN**
- **CROSS JOIN** (también **CROSS APPLY**)

Además, implementa el **ANTI JOIN** y el **SEMI JOIN**. Ambos expresan en una sola cláusula patrones que en SQL estándar requieren un predicado `NOT EXISTS` o `EXISTS` con subconsulta — una construcción más verbosa y más difícil de leer.

Un **ANTI JOIN** devuelve todos los registros de la izquierda que no tienen ninguna correspondencia en la tabla derecha. La siguiente consulta devuelve todos los clientes que no tienen ninguna orden.

```crono-sql
SELECT *
FROM staging.customers
ANTI JOIN staging.orders USING customer_id
```

El **ANTI JOIN** se puede combinar con **FILTER** y el resto de características del lenguaje. Esta consulta devuelve todos los productos que no tienen ninguna línea de detalle con descuento.

```crono-sql
SELECT *
FROM staging.products
ANTI JOIN staging.order_details FILTER (discount > 0) disc_details USING product_id
```


## SEMI JOIN

Un **SEMI JOIN** devuelve todos los registros de la izquierda que tienen al menos una correspondencia en la tabla derecha. A diferencia del **INNER JOIN**, no duplica los registros del resultado aunque existan múltiples coincidencias.

Esta consulta devuelve todos los clientes que tienen al menos una orden, sin duplicados.

```crono-sql
SELECT *
FROM staging.customers
SEMI JOIN staging.orders USING customer_id
```


## UNPIVOT

Se puede utilizar el operador **UNPIVOT** para convertir columnas en filas.

En este ejemplo, las columnas `city` y `country` se convierten en filas diferenciadas, duplicándose los registros.

```crono-sql
SELECT
  customer_id,
  field_name,
  field_value
FROM staging.customers
UNPIVOT (field_value FOR field_name IN (city, country)) AS unpvt
```


## ORDER BY

Se puede utilizar la cláusula **ORDER BY** para forzar la ordenación del resultado. Gracias a las columnas inteligentes, se puede ordenar por alias sin repetir la expresión.

```crono-sql
SELECT
  year(orders.order_date) AS order_year,
  month(orders.order_date) AS order_month,
  sum(orders.freight) AS total_freight
FROM staging.orders
ORDER BY order_year, order_month
```

El **ORDER BY** también puede escribirse haciendo referencia a la posición de las columnas.

```crono-sql
SELECT
  year(orders.order_date) AS order_year,
  month(orders.order_date) AS order_month,
  sum(orders.freight) AS total_freight
FROM staging.orders
ORDER BY 1, 2
```


## SELECT DISTINCT

Se puede utilizar la palabra clave **DISTINCT** para obtener los valores distintos.

```crono-sql
SELECT DISTINCT country
FROM staging.customers
```


## SELECT TOP

Se puede utilizar la palabra clave **TOP** para limitar el número de registros del resultado. **Crono SQL** compila **TOP** a la sintaxis correcta de cada motor.

Esta consulta devuelve los 5 clientes con mayor importe de transporte acumulado.

```crono-sql
SELECT TOP 5
  customers.customer_id,
  customers.company_name AS customer,
  customers.country,
  sum(orders.freight) AS total_freight
FROM staging.orders
INNER JOIN staging.customers USING customer_id
ORDER BY total_freight DESC
```


## OVER ()

Las funciones de ventana **OVER (…)** también están soportadas. Las columnas inteligentes permiten referenciar columnas agregadas previas dentro de la propia función de ventana, lo que simplifica su escritura.

Esta consulta devuelve el acumulado de transporte desde el inicio de cada año.

```crono-sql
SELECT
  year(orders.order_date) AS order_year,
  month(orders.order_date) AS order_month,
  sum(orders.freight) AS monthly_freight,
  sum(monthly_freight) OVER (PARTITION BY order_year ORDER BY order_month) AS freight_ytd
FROM staging.orders
ORDER BY order_year, order_month
```


## TOP OVER ()

La combinación **TOP n OVER (PARTITION BY … ORDER BY …)** permite obtener los N primeros registros por grupo sin necesidad de CTEs ni de la función `ROW_NUMBER()` explícita. El compilador genera la subconsulta anidada necesaria para cada motor.

Esta consulta devuelve los tres clientes con mayor transporte acumulado en cada país.

```crono-sql
SELECT TOP 3 OVER (PARTITION BY country ORDER BY total_freight DESC)
  customers.country,
  customers.customer_id,
  customers.company_name AS customer,
  sum(orders.freight) AS total_freight
FROM staging.orders
INNER JOIN staging.customers USING customer_id
```

La siguiente consulta devuelve la última orden de cada cliente.

```crono-sql
SELECT TOP 1 OVER (PARTITION BY customer_id ORDER BY order_date DESC)
  customers.customer_id,
  customers.company_name AS customer,
  orders.order_date,
  orders.freight
FROM staging.orders
INNER JOIN staging.customers USING customer_id
```


## DUPLICATES OVER ()

La cláusula **DUPLICATES OVER (PARTITION BY …)** devuelve únicamente los registros para los que existe más de una fila con la misma combinación de campos en la partición. El compilador genera la subconsulta con `COUNT(*) OVER (PARTITION BY …)` necesaria para cada motor.

Su uso más habitual es la detección de duplicados en los datos de origen: si la consulta devuelve algún registro, hay un problema de calidad que debe resolverse antes de la carga.

```crono-sql
SELECT DUPLICATES OVER (PARTITION BY customer_id)
  customer_id,
  company_name,
  contact_name,
  contact_title,
  address
FROM staging.customers
```

Se puede combinar con SELECTs apilados. La cláusula **DUPLICATES** actúa sobre el resultado de la capa inferior, lo que permite aplicarla sobre cualquier consulta previa sin repetir código.

```crono-sql
SELECT DUPLICATES OVER (PARTITION BY customer_id)
SELECT *
FROM staging.customers
```

También es útil para consultas analíticas. La siguiente consulta devuelve todos los pedidos en los que el mismo cliente realizó más de una orden el mismo día.

```crono-sql
SELECT DUPLICATES OVER (PARTITION BY customer_id, order_date)
SELECT *
FROM staging.orders
```


## WITH

Las expresiones de tabla comunes (**CTE**) con cláusula **WITH** están soportadas. Se pueden combinar con **FILTER** para reutilizar la misma CTE con distintas condiciones sin duplicar código.

```crono-sql
WITH order_summary AS (
  SELECT
    orders.customer_id,
    year(orders.order_date) AS order_year,
    count(orders.order_id) AS order_count,
    sum(orders.freight) AS total_freight
  FROM staging.orders
  INNER JOIN staging.order_details USING order_id
)
SELECT
  customers.company_name AS customer,
  customers.country,
  summary_2022.total_freight AS freight_2022,
  summary_2023.total_freight AS freight_2023
FROM staging.customers
LEFT JOIN order_summary FILTER (order_year=2022) summary_2022 USING customer_id
LEFT JOIN order_summary FILTER (order_year=2023) summary_2023 USING customer_id
```

En **Crono SQL**, las CTEs raramente son necesarias y en general desaconsejamos su uso. Una subconsulta definida en el **WITH** queda físicamente separada del JOIN que la consume: el lector tiene que desplazarse hacia arriba para entender qué contiene, y luego volver abajo para ver cómo se usa. Esa separación dificulta la lectura.

La alternativa es incluir la subconsulta directamente junto al JOIN que la necesita, usando la sintaxis habitual de subconsulta en el FROM o la cláusula **FILTER**. La lógica queda así junto a su contexto, que es exactamente donde se necesita para entenderla. Para los casos en que el rendimiento importa, **MATERIALIZE** ofrece la misma reutilización que una CTE materializada, pero expresada de forma más explícita y sin alejar el código de donde se usa.


## UNION y UNION ALL

Se pueden utilizar los operadores **UNION** y **UNION ALL**. Para combinar consultas en la mayoría de escenarios ETL/DWH es preferible el operador **COMBINE** que se muestra a continuación, ya que evita repetir los JOINs y expresa la intención con más claridad.

```crono-sql
SELECT
  customers.company_name AS customer,
  sum(orders.freight) AS freight_2022,
  null AS freight_2023
FROM staging.orders
INNER JOIN staging.customers ON (orders.customer_id=customers.customer_id)
WHERE year(orders.order_date) = 2022
UNION
  SELECT
    customers.company_name AS customer,
    null AS freight_2022,
    sum(orders.freight) AS freight_2023
  FROM staging.orders
  INNER JOIN staging.customers ON (orders.customer_id=customers.customer_id)
  WHERE year(orders.order_date) = 2023
```


## COMBINE

El operador **COMBINE BY** combina dos o más consultas en un único resultado haciendo un **FULL JOIN** sobre las claves indicadas. Permite comparar conjuntos de datos de distintas fuentes o periodos sin duplicar los JOINs comunes ni recurrir a un **UNION** con columnas nulas.

```crono-sql
COMBINE BY customer
  sales_2022 AS (
    SELECT
      customers.company_name AS customer,
      sum(orders.freight) AS freight_2022
    FROM staging.orders
    INNER JOIN staging.customers USING customer_id
    WHERE year(orders.order_date) = 2022),
  sales_2023 AS (
    SELECT
      customers.company_name AS customer,
      sum(orders.freight) AS freight_2023
    FROM staging.orders
    INNER JOIN staging.customers USING customer_id
    WHERE year(orders.order_date) = 2023)
```

Se pueden utilizar tablas distintas en cada consulta del **COMBINE**. En este ejemplo, se comparan las unidades vendidas y el stock actual por producto.

```crono-sql
COMBINE BY product_name, product_id
  sold (
    SELECT
      products.product_name,
      products.product_id,
      sum(order_details.quantity) AS units_sold
    FROM staging.order_details
    INNER JOIN staging.products USING product_id
  ),
  stock (
    SELECT
      products.product_name,
      products.product_id,
      products.units_in_stock
    FROM staging.products
  )
```


## MATERIALIZE

**MATERIALIZE** crea una tabla temporal con el resultado de una subconsulta antes de que se ejecute la consulta principal. Esto simplifica el plan de ejecución del motor y puede mejorar el rendimiento de forma significativa en consultas complejas. Desde el punto de vista del código, permite mantener toda la lógica de carga en una única sentencia, sin necesidad de crear tablas temporales manualmente ni fragmentar la lógica en varios pasos.

```crono-sql
SELECT
  orders.order_date,
  products.product_name AS product,
  products.product_id,
  sum(details.quantity) AS units_sold
FROM staging.order_details FILTER (discount > 0) MATERIALIZE details
INNER JOIN staging.orders USING order_id
INNER JOIN staging.products USING product_id
```

Con **MATERIALIZE** también se pueden materializar las consultas de una sentencia **COMBINE**. En este ejemplo, primero se materializa la consulta de unidades vendidas, luego la del stock, y finalmente se combinan en un único resultado.

```crono-sql
COMBINE BY product_name, product_id
  MATERIALIZE sold (
    SELECT
      products.product_name,
      products.product_id,
      sum(order_details.quantity) AS units_sold
    FROM staging.order_details
    INNER JOIN staging.products USING product_id
  ),
  MATERIALIZE stock (
    SELECT
      products.product_name,
      products.product_id,
      products.units_in_stock
    FROM staging.products
  )
```


## CAST automático

Se puede forzar el tipo de datos de una columna especificándolo justo después del alias. El compilador generará la llamada a **CAST** correspondiente en el motor de destino.

```crono-sql
SELECT
  year(orders.order_date) AS order_year varchar(4),
  customers.customer_id,
  customers.company_name AS customer,
  upper(customer) AS upper_customer,
  customers.contact_name,
  sum(orders.freight) AS total_freight,
  count(*) AS order_count,
  total_freight / order_count AS avg_freight numeric(12,2)
FROM staging.orders
INNER JOIN staging.customers USING customer_id
WHERE order_year = '2023'
```


## Resumen

En resumen, si se conoce SQL, ya se conoce la parte más importante de **Crono SQL**. Las extensiones del SELECT están diseñadas para eliminar repeticiones, mejorar la legibilidad y expresar con más claridad la intención del código. Destacamos:

- **Columnas inteligentes** — referencia a alias dentro del mismo SELECT, sin repetir expresiones
- **GROUP BY automático** — el compilador infiere las columnas de agrupación
- **USING** — JOINs más concisos sin repetir los campos de la condición
- **FILTER, COLUMNS, ADD COLUMNS** — modificadores de tabla que evitan subconsultas explícitas
- **CHECK SNOWFLAKE** — validación de integridad de JOINs integrada en la consulta
- **ANTI JOIN** y **SEMI JOIN** — alternativas legibles a `NOT EXISTS` y `EXISTS`
- **TOP OVER** — top N por grupo sin CTEs ni `ROW_NUMBER()` explícito
- **COMBINE** — combinación de consultas más expresiva que **UNION**
- **MATERIALIZE** — tablas temporales declarativas dentro de una única sentencia
- **SELECTs anidados** — transformaciones encadenadas sin subconsultas
