---
title: "SELECT"
sidebar:
  order: 10
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

**Crono SQL** soporta todos los operadores JOIN estándar —**INNER JOIN**, **LEFT JOIN**, **RIGHT JOIN**, **FULL JOIN**, **CROSS JOIN**— y añade operadores propios como **ANTI JOIN** y **SEMI JOIN**. Puedes consultar todos ellos con ejemplos en la página [JOINs](/sql/language/join/).

La cláusula **USING** simplifica la sintaxis de cualquiera de esos JOINs. En lugar de escribir la condición completa `ON (tabla_a.campo = tabla_b.campo)`, basta con indicar el nombre del campo o la tabla de la que proviene la clave. El resultado es más conciso y más fácil de leer.

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


## COLUMNS

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


## SELECT DISTINCT

Se puede utilizar la palabra clave **DISTINCT** para obtener los valores distintos.

```crono-sql
SELECT DISTINCT country
FROM staging.customers
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


## Funciones de ventana

**Crono SQL** soporta la sintaxis estándar `OVER (PARTITION BY … ORDER BY …)` para funciones de ventana. Gracias a las columnas inteligentes, los alias del SELECT pueden usarse directamente dentro del `OVER` sin repetir la expresión original.

Además, **Crono SQL** añade funciones analíticas propias (`running_sum`, `running_pct`, `pct`, `percentile`, `is_first`, `is_last`…) y extensiones de sintaxis como **TOP OVER** —top N por grupo sin `ROW_NUMBER()` explícito— y **DUPLICATES OVER** —detección de duplicados integrada en la consulta.

Este ejemplo calcula el acumulado de ventas desde el inicio de cada año (YTD), referenciando los alias `amount` y `order_year` directamente dentro del `OVER`:

```crono-sql
SELECT
  year(orders.order_date)                           order_year,
  month(orders.order_date)                          order_month,
  sum(od.quantity * od.unit_price)                  amount,
  sum(amount) OVER (PARTITION BY order_year ORDER BY order_month)  amount_ytd
FROM staging.order_details od
INNER JOIN staging.orders USING order_id
```

Todo ello está documentado en detalle en [Funciones de ventana](/sql/language/window-functions/).


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

Para subconsultas que envuelven un SELECT completo en el FROM, **Crono SQL** ofrece los **SQL Pipelines** como alternativa más legible: los SELECTs se apilan como capas en lugar de anidarse entre paréntesis. La consulta anterior se escribe así:

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

Ver [SQL Pipelines](/sql/language/select-pipelines/).


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


## Tablas en línea

**Crono SQL** permite usar valores literales directamente en el `FROM`, sin necesidad de crear una tabla física. Hay tres formas disponibles.

`VALUES` define una tabla con múltiples filas. Los nombres de columna se declaran en la primera fila:

```crono-sql
SELECT *
FROM VALUES (
  (1 category_id, 'Beverages'   category_name, 'Soft drinks, coffees and teas' description),
  (2,             'Condiments',                 'Sweet and savory sauces'),
  (3,             'Confections',                'Desserts, candies and sweet breads')
)
```

`ROW` define una tabla de una única fila:

```crono-sql
SELECT *
FROM ROW (1 category_id, 'Beverages' category_name, 'Soft drinks, coffees and teas' description)
```

`COLUMN` define una tabla de una única columna con varios valores:

```crono-sql
SELECT *
FROM COLUMN ('Beverages' category_name, 'Condiments', 'Confections')
```

Las tres formas pueden usarse como cualquier otra fuente en el `FROM`, combinándose con JOINs o SQL Pipelines.


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


## Resumen

En resumen, si se conoce SQL, ya se conoce la parte más importante de **Crono SQL**. Las extensiones del SELECT están diseñadas para eliminar repeticiones, mejorar la legibilidad y expresar con más claridad la intención del código. Destacamos:

- **Columnas inteligentes** — referencia a alias dentro del mismo SELECT, sin repetir expresiones
- **GROUP BY automático** — el compilador infiere las columnas de agrupación
- **USING** — JOINs más concisos sin repetir los campos de la condición
- **FILTER, COLUMNS, ADD COLUMNS** — modificadores de tabla que evitan subconsultas explícitas
- **TOP OVER**, **DUPLICATES OVER** — ver [Funciones de ventana](/sql/language/window-functions/)
- **COMBINE** — combinación de consultas más expresiva que **UNION**
- **MATERIALIZE** — tablas temporales declarativas dentro de una única sentencia
- **SQL Pipelines** — transformaciones encadenadas sin subconsultas, ver [SQL Pipelines](/sql/language/select-pipelines/)
- **ANTI JOIN**, **SEMI JOIN** — ver [JOINs](/sql/language/join/)
