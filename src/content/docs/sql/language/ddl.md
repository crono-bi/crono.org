---
title: "CREATE y DROP"
sidebar:
  order: 70
---

Las sentencias DDL (*Data Definition Language*) son las instrucciones SQL que crean, modifican y eliminan objetos de base de datos: tablas, vistas, procedimientos, funciones, índices y esquemas. A diferencia de las sentencias de manipulación de datos (SELECT, INSERT, MERGE…), las sentencias DDL actúan sobre la estructura de la base de datos, no sobre su contenido.

**Crono SQL** soporta las sentencias DDL habituales y las compila correctamente para cada motor. En la mayoría de proyectos ETL/DWH no es necesario escribir DDL explícito — los patrones de carga crean y mantienen las tablas automáticamente — pero en ocasiones es útil tener control directo sobre la estructura.

Las sentencias soportadas son:

- **CREATE PROCEDURE**
- **CREATE FUNCTION**
- **CREATE VIEW**
- **CREATE TABLE**
- **CREATE INDEX**
- **CREATE DATABASE**
- **CREATE SCHEMA**

Todas admiten las variantes:

-  **CREATE IF NOT EXISTS**
-  **CREATE OR REPLACE**
-  **DROP IF EXISTS**

## Literales SQL

Cuando se necesita ejecutar una sentencia que **Crono SQL** no soporta de forma nativa — una sintaxis específica de un motor, una opción avanzada de creación de tabla, un índice columnar — se puede usar un **literal SQL**. El contenido se escribe entre backticks precedidos de la palabra clave `SQL` y Crono SQL lo envía al motor tal cual, sin parsear ni transformar.

```crono-sql
SQL `CREATE CLUSTERED COLUMNSTORE INDEX cci_fact_orders ON dwh.fact_orders;`
```

Los literales SQL son un mecanismo de escape: permiten hacer cualquier cosa que admita el motor de destino, a cambio de perder la portabilidad entre motores y la validación del compilador.


## CREATE PROCEDURE

**Crono SQL** admite la sintaxis estándar de SQL para crear procedimientos almacenados. El siguiente ejemplo crea un procedimiento que carga la tabla `dwh.dim_products` usando un bloque **BEGIN ... END** con una sentencia de carga y un **PRINT**:

```crono-sql
CREATE PROCEDURE dwh.load_dim_products
BEGIN

  MERGE CLONE dwh.dim_products KEY (product_id)
  SELECT
    products.product_id,
    products.product_name,
    categories.category_name,
    suppliers.company_name AS supplier
  FROM staging.products
  INNER JOIN staging.categories USING category_id
  INNER JOIN staging.suppliers USING supplier_id
  CHECK SNOWFLAKE

  PRINT 'Se ha cargado dim_products';

END
```

El código SQL generado guarda automáticamente información de log sobre cada ejecución (fecha de inicio, duración, errores), por lo que el **PRINT** es innecesario. Si el procedimiento tiene una sola instrucción, tampoco hace falta el bloque **BEGIN ... END**. El siguiente código es equivalente:

```crono-sql
CREATE PROCEDURE dwh.load_dim_products
MERGE CLONE dwh.dim_products KEY (product_id)
SELECT
  products.product_id,
  products.product_name,
  categories.category_name,
  suppliers.company_name AS supplier
FROM staging.products
INNER JOIN staging.categories USING category_id
INNER JOIN staging.suppliers USING supplier_id
CHECK SNOWFLAKE
```

Se puede utilizar **CREATE OR REPLACE** para que el mismo código sirva tanto para crear el procedimiento inicialmente como para modificarlo si ya existe:

```crono-sql
CREATE OR REPLACE PROCEDURE dwh.load_dim_products
MERGE CLONE dwh.dim_products KEY (product_id)
SELECT
  products.product_id,
  products.product_name,
  categories.category_name,
  suppliers.company_name AS supplier
FROM staging.products
INNER JOIN staging.categories USING category_id
INNER JOIN staging.suppliers USING supplier_id
CHECK SNOWFLAKE
```

Si el procedimiento carga una única tabla —lo recomendado—, se puede prescindir del nombre. **Crono SQL** escogerá un nombre apropiado automáticamente. Esta es la forma canónica y la más habitual en un proyecto Crono SQL:

```crono-sql
CREATE OR REPLACE PROCEDURE
MERGE CLONE dwh.dim_products KEY (product_id)
SELECT
  products.product_id,
  products.product_name,
  categories.category_name,
  suppliers.company_name AS supplier
FROM staging.products
INNER JOIN staging.categories USING category_id
INNER JOIN staging.suppliers USING supplier_id
CHECK SNOWFLAKE
```

**Crono SQL** facilita y promueve el [principio de responsabilidad única (SRP)](https://es.wikipedia.org/wiki/Principio_de_responsabilidad_%C3%BAnica): cada procedimiento carga una única tabla, cada tabla se carga desde un único procedimiento, y cada procedimiento tiene una única instrucción de carga.

Para ejecutar un procedimiento se usa **EXECUTE** (o **EXEC**):

```crono-sql
EXECUTE dwh.load_dim_products
```

Para los procedimientos anónimos se usa **EXECUTE LOAD** (o **EXEC LOAD**):

```crono-sql
EXECUTE LOAD dwh.dim_products
```

El flujo de carga del DWH se puede orquestar desde un procedimiento que llame secuencialmente a todos los demás:

```crono-sql
CREATE OR REPLACE PROCEDURE dwh.load
BEGIN

  EXEC LOAD dwh.dim_dates
  EXEC LOAD dwh.dim_employees
  EXEC LOAD dwh.dim_products
  EXEC LOAD dwh.dim_customers
  EXEC LOAD dwh.fact_orders
  EXEC LOAD dwh.fact_order_details

END
```

Y la carga completa del DWH se lanzaría con:

```crono-sql
EXECUTE dwh.load
```

Para eliminar un procedimiento se usa **DROP PROCEDURE** o **DROP PROCEDURE IF EXISTS**:

```crono-sql
DROP PROCEDURE IF EXISTS dwh.load
```


## CREATE FUNCTION

Las funciones escalares en **Crono SQL** devuelven el resultado de una única expresión en el `RETURN`. No admiten bloques de código ni estructuras de flujo como `IF` o `WHILE`, lo que garantiza la compatibilidad con todos los motores soportados.

```crono-sql
CREATE OR REPLACE FUNCTION dwh.net_amount(@unit_price decimal, @quantity int, @discount decimal) RETURNS decimal
RETURN @unit_price * @quantity * (1 - @discount)
```

Los parámetros se declaran con el prefijo `@` tanto en la cabecera como en el cuerpo de la función. Al compilar, **Crono SQL** adapta automáticamente esta notación a las convenciones de cada motor: SQL Server mantiene el `@`, mientras que Snowflake, BigQuery, PostgreSQL y los demás usan su propia sintaxis para los argumentos.

También pueden crearse funciones que devuelven tablas. Este ejemplo devuelve el histórico de ventas de un producto:

```crono-sql
CREATE OR REPLACE FUNCTION dwh.product_sales(@product_id int) RETURNS TABLE
SELECT
  year(orders.order_date)                               order_year,
  sum(order_details.unit_price * order_details.quantity) sales
FROM staging.order_details
INNER JOIN staging.orders USING order_id
WHERE order_details.product_id = @product_id
```

Para eliminar una función se usa **DROP FUNCTION** o **DROP FUNCTION IF EXISTS**:

```crono-sql
DROP FUNCTION IF EXISTS dwh.product_sales
```


## CREATE VIEW

**Crono SQL** admite la sintaxis estándar para crear vistas:

```crono-sql
CREATE VIEW dwh.product_annual_sales AS
SELECT
  products.product_name,
  year(orders.order_date)                               order_year,
  sum(order_details.unit_price * order_details.quantity) sales
FROM staging.order_details
INNER JOIN staging.orders USING order_id
INNER JOIN staging.products USING product_id
```

Se puede utilizar **CREATE OR REPLACE VIEW** para actualizar la vista si ya existe:

```crono-sql
CREATE OR REPLACE VIEW dwh.product_annual_sales
SELECT
  products.product_name,
  year(orders.order_date)                               order_year,
  sum(order_details.unit_price * order_details.quantity) sales
FROM staging.order_details
INNER JOIN staging.orders USING order_id
INNER JOIN staging.products USING product_id
```

Para eliminar una vista se usa **DROP VIEW** o **DROP VIEW IF EXISTS**:

```crono-sql
DROP VIEW IF EXISTS dwh.product_annual_sales
```


## CREATE TABLE

En general, no es necesario escribir explícitamente el **CREATE TABLE** de las tablas de un data warehouse con **Crono SQL**: las sentencias de carga crean automáticamente las tablas y los campos necesarios.

De todos modos, pueden crearse tablas usando la sintaxis habitual:

```crono-sql
CREATE TABLE dwh.dim_customers (
  customer_sid   int IDENTITY,
  customer_id    varchar(10)   NOT NULL,
  company_name   varchar(100) NOT NULL,
  contact_name   varchar(100),
  country        varchar(50),
  city           varchar(50),
  CONSTRAINT PK_dim_customers PRIMARY KEY CLUSTERED (customer_sid),
  CONSTRAINT BK_dim_customers UNIQUE (customer_id)
)
```

Se puede utilizar **CREATE TABLE IF NOT EXISTS** para crearla únicamente si no existe. La sentencia **CREATE OR REPLACE TABLE** elimina la tabla si ya existe y la recrea.

La sintaxis admite las siguientes restricciones e índices:

- Restricciones **NULL** y **NOT NULL**
- Restricciones **IDENTITY**
- Restricciones **UNIQUE** y **NONUNIQUE** (que pueden ser **CLUSTERED** o **NONCLUSTERED**)
- Restricciones **FOREIGN KEY** / **REFERENCES** (con **ON CASCADE DELETE** o **ON CASCADE SET NULL**)
- Restricciones **DEFAULT**
- Índices **UNIQUE** y **NONUNIQUE** (con la opción **INCLUDE**)

El siguiente ejemplo es más completo e incluye `IDENTITY`, índices `CLUSTERED` y la cláusula `INCLUDE` — características propias de SQL Server:

```crono-sql
CREATE OR REPLACE TABLE dwh.dim_customers (
  customer_sid   int IDENTITY,
  customer_id    varchar(10),
  company_name   varchar(100) NOT NULL,
  contact_name   varchar(100),
  country        varchar(50)  NOT NULL DEFAULT 'Unknown',
  city           varchar(50),
  phone          varchar(30),
  region_sid     int REFERENCES dwh.dim_regions ON DELETE CASCADE,
  CONSTRAINT uq_company UNIQUE (company_name),
  INDEX UNIQUE CLUSTERED (customer_id),
  INDEX NONUNIQUE (country) INCLUDE (company_name, city)
)
```

Algunas características de esta sintaxis:

- Es posible definir restricciones **IDENTITY**, **NULL**, **UNIQUE**, **REFERENCES** y **DEFAULT** en línea con el campo.
- Es posible omitir el nombre de índices y restricciones — **Crono SQL** utilizará un criterio de nomenclatura predefinido.

Si se requiere alguna funcionalidad no soportada —como especificar el *file group*, el particionado o crear índices columnares—, pueden usarse **literales SQL**. El siguiente ejemplo usa sintaxis nativa de SQL Server:

```crono-sql
SQL `
CREATE TABLE [dwh].[dim_customers] (
  [customer_sid] [int] IDENTITY(1,1) NOT NULL,
  [customer_id]  [varchar](10) NOT NULL,
  [company_name] [varchar](100) NOT NULL,
  CONSTRAINT [PK_dim_customers] PRIMARY KEY NONCLUSTERED ([customer_sid] ASC)
    WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF) ON [PRIMARY]
) ON [PRIMARY]
`
```

También se puede crear una tabla directamente a partir del resultado de una consulta:

```crono-sql
CREATE OR REPLACE TABLE dwh.customer_sales_summary
SELECT
  customers.customer_id                                  customer_id PRIMARY KEY,
  customers.company_name,
  customers.country,
  count(orders.order_id)                                 order_count,
  sum(order_details.unit_price * order_details.quantity) total_sales
FROM staging.customers
INNER JOIN staging.orders USING customer_id
INNER JOIN staging.order_details USING order_id
```

Para eliminar una tabla se usa **DROP TABLE** o **DROP TABLE IF EXISTS**:

```crono-sql
DROP TABLE IF EXISTS dwh.dim_customers
```

### Soporte en motores columnares

Las restricciones e índices no tienen el mismo significado en todos los motores. En las bases de datos relacionales clásicas (SQL Server, PostgreSQL), las claves primarias, las claves foráneas y los índices son objetos reales que el motor crea y mantiene. En los motores columnares orientados a analítica, la situación es distinta:

- **Snowflake**: no tiene índices tradicionales. Las restricciones PRIMARY KEY, UNIQUE y FOREIGN KEY se pueden declarar, pero el motor no las valida: son puramente informativas.
- **BigQuery**: no tiene índices ni claves foráneas. Las restricciones PRIMARY KEY se pueden declarar en modo NOT ENFORCED y son solo informativas.
- **Redshift**: las restricciones PK y FK se declaran pero no se validan. En lugar de índices, Redshift utiliza claves de distribución (`DISTKEY`) y claves de ordenación (`SORTKEY`), que se configuran como literales SQL cuando son necesarias.
- **Databricks**: las restricciones PRIMARY KEY y FOREIGN KEY se admiten solo en tablas Unity Catalog y son informativas (NOT ENFORCED). No hay índices tradicionales.
- **DuckDB** y **PostgreSQL**: soportan restricciones e índices con validación completa, igual que SQL Server.

**Crono SQL** genera la sintaxis correcta para cada motor según lo que admita. Si el motor de destino no soporta una restricción, el compilador la omite o la adapta. En cualquier caso, las restricciones informativas siguen siendo útiles: documentan la intención del modelo y las herramientas de BI y los optimizadores de algunos motores las aprovechan para mejorar los planes de ejecución.



## CREATE INDEX

Los índices se pueden definir dentro del **CREATE TABLE** o a posteriori mediante **CREATE INDEX**:

```crono-sql
CREATE INDEX idx_customers_country ON dwh.dim_customers (country)
```

Se puede utilizar **CREATE INDEX IF NOT EXISTS** para crear un índice solo si aún no existe, y **CREATE OR REPLACE INDEX** para crearlo o recrearlo si ya existe. El siguiente ejemplo muestra también la cláusula **INCLUDE**:

```crono-sql
CREATE OR REPLACE INDEX idx_orders_customer ON dwh.fact_orders (customer_sid) INCLUDE (order_id)
```

En SQL Server se pueden crear índices **UNIQUE**, **CLUSTERED** y **NONCLUSTERED**:

```crono-sql
CREATE UNIQUE NONCLUSTERED INDEX idx_customers_name ON dwh.dim_customers (company_name)
```

Mediante **literales SQL** se puede crear cualquier otro índice que admita el motor. El siguiente ejemplo crea un índice columnar en SQL Server:

```crono-sql
SQL `CREATE CLUSTERED COLUMNSTORE INDEX cci_fact_orders ON dwh.fact_orders;`
```

Para eliminar un índice se usa **DROP INDEX** o **DROP INDEX IF EXISTS**:

```crono-sql
DROP INDEX IF EXISTS idx_orders_customer ON dwh.fact_orders
```


## CREATE DATABASE

La sentencia **CREATE DATABASE** permite crear una base de datos con las opciones predeterminadas:

```crono-sql
CREATE DATABASE IF NOT EXISTS crono_northwind
```

En SQL Server también se puede especificar la intercalación con `COLLATE`:

```crono-sql
CREATE DATABASE IF NOT EXISTS crono_northwind COLLATE Traditional_Spanish_ci_ai
```


## CREATE SCHEMA

Se puede crear un esquema con **CREATE SCHEMA** o **CREATE SCHEMA IF NOT EXISTS**:

```crono-sql
CREATE SCHEMA IF NOT EXISTS dwh
```

Es posible establecer el propietario del esquema:

```crono-sql
CREATE SCHEMA IF NOT EXISTS dwh AUTHORIZATION crono
```
