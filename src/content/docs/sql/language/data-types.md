---
title: "Tipos de datos"
sidebar:
  order: 55
---

**Crono SQL** define un conjunto de tipos de datos estándar que funcionan en cualquier motor soportado. Al compilar, Crono traduce automáticamente cada tipo al equivalente correcto del motor de destino. Si se usa un nombre de tipo fuera de esta lista, Crono lo respeta y lo compila tal cual — pero el código deja de ser portable.

La recomendación es usar siempre los tipos estándar de Crono. De este modo, una misma definición de tabla o consulta funciona sin cambios en SQL Server, Snowflake, PostgreSQL, Redshift, BigQuery o Databricks.

Cada tipo acepta además los sinónimos más habituales de los distintos motores, de forma que el código SQL existente funciona sin necesidad de adaptarlo.


## Tipos soportados

| Tipo | Sinónimos | Descripción |
|------|-----------|-------------|
| 🅰️ `varchar` | `text`, `nvarchar`, `string`, `character varying` | Texto de longitud variable |
| 🅰️ `char` | `nchar`, `character` | Texto de longitud fija |
| 🔢 `integer` | `int`, `int4` | Entero de 32 bits |
| 🔢 `bigint` | `int8` | Entero de 64 bits |
| 🔢 `smallint` | `int2` | Entero de 16 bits |
| 🔢 `tinyint` | `byte` | Entero de 8 bits (0–255) |
| 🔢 `number` | `numeric`, `decimal` | Decimal de precisión fija |
| 🔢 `float` | `double precision`, `float8` | Coma flotante de 64 bits |
| 🔢 `real` | `float4` | Coma flotante de 32 bits |
| 🔢 `autoincrement` | `identity`, `serial` | Entero autoincremental |
| 📅 `date` | | Fecha (año, mes, día) |
| 📅 `datetime` | `timestamp_ntz` | Fecha y hora sin zona horaria |
| 📅 `timestamp` | `datetime_tz`, `datetimeoffset` | Fecha y hora con zona horaria |
| ✅ `boolean` | `bool`, `bit` | Valor lógico (verdadero o falso) |


### Tipos de fecha

Crono SQL define tres tipos de fecha que cubren los casos de uso más habituales en proyectos ETL/DWH:

- **`date`** — fecha (año, mes, día) sin información horaria.
- **`datetime`** — fecha y hora sin zona horaria.
- **`timestamp`** — fecha y hora con zona horaria.

Los tipos de fecha son el área donde existe mayor heterogeneidad entre motores. Las nomenclaturas son distintas e incluso un mismo nombre puede significar cosas distintas según el motor. El caso más llamativo es `timestamp`: en **PostgreSQL** y **Redshift** es un tipo *sin* zona horaria; en **BigQuery** y **Databricks** es un tipo *con* zona horaria; y en **Snowflake** directamente existen tres variantes — `TIMESTAMP_NTZ` (sin zona horaria), `TIMESTAMP_TZ` (con zona horaria) y `TIMESTAMP_LTZ` (zona horaria local). **SQL Server**, por su parte, ni siquiera tiene un tipo llamado `timestamp` con ese significado: usa `datetime2` para fecha y hora sin zona horaria, y `datetimeoffset` para fecha y hora con zona horaria.

Para definir el lenguaje Crono SQL fue necesario tomar una decisión y se optó por seguir los criterios de **BigQuery**, que son los más sencillos y semánticamente claros: `datetime` para fecha y hora sin zona horaria, y `timestamp` para fecha y hora con zona horaria. Esta nomenclatura es además coherente con las funciones `current_date`, `current_datetime` y `current_timestamp`, que devuelven respectivamente valores de tipo `date`, `datetime` y `timestamp`.

```crono-sql
CREATE TABLE dwh.fact_orders (
  order_id      int,
  customer_id   int,
  order_date    date,
  order_time    datetime,
  inserted_at   timestamp
)
```


### Tipos de texto

Crono SQL define dos tipos de texto:

- **`varchar`** — cadena de longitud variable.
- **`char`** — cadena de longitud fija.

Los tipos de texto son el área donde existe mayor consenso entre motores. Todos soportan `varchar` y `char` con comportamiento equivalente, y las diferencias son menores que en los tipos de fecha. La excepción histórica es **SQL Server**, que distingue entre `varchar` y `nvarchar` por razones de compatibilidad — algo que se trata en el apartado específico de ese motor.

`varchar` admite tres formas: `varchar`, `varchar(max)` y `varchar(n)`. Las dos primeras son equivalentes: indican longitud variable sin límite explícito. La tercera limita la cadena a `n` caracteres. `char(n)` siempre requiere longitud.

Uno de los objetivos de **Crono SQL** es minimizar la curva de aprendizaje para desarrolladores que vienen de otros motores. Por eso, además del nombre estándar, cada tipo acepta los sinónimos más habituales del ecosistema: quien esté acostumbrado a escribir `string` (Snowflake, BigQuery, Databricks), `text` (PostgreSQL) o `nvarchar` (SQL Server) puede seguir haciéndolo sin cambiar sus hábitos — Crono reconoce todos ellos y los trata como `varchar`. Lo mismo aplica a `char`: se aceptan `nchar` y `character`.

```crono-sql
CREATE TABLE dwh.dim_customers (
  customer_id    integer,
  customer_code  varchar(10),
  company_name   varchar(200),
  notes          varchar,
  country_code   char(2),
  region_code    char(3),
  country_name   varchar(100)
)
```


### Tipos numéricos

Crono SQL define ocho tipos numéricos:

- **`integer`** — entero de 32 bits (−2.147 M a 2.147 M).
- **`bigint`** — entero de 64 bits. Para identificadores o contadores que pueden superar los dos mil millones.
- **`smallint`** — entero de 16 bits (−32.768 a 32.767). Para columnas con rango reducido de valores.
- **`tinyint`** — entero de 8 bits (0–255). Para valores muy pequeños como indicadores de estado.
- **`number`** — decimal de precisión fija. El tipo adecuado para importes, precios y cualquier valor donde los decimales deben ser exactos.
- **`float`** — coma flotante de doble precisión (64 bits). Para valores continuos donde no se requiere exactitud decimal absoluta.
- **`real`** — coma flotante de precisión simple (32 bits). Similar a `float` pero con menor rango y precisión.
- **`autoincrement`** — entero que se incrementa automáticamente al insertar. Se usa en columnas de clave subrogada.

Al igual que con los tipos de texto, **Crono SQL** acepta los sinónimos más habituales de cada motor para reducir la fricción. Los usuarios de PostgreSQL pueden seguir usando `int`, `int4`, `int8` o `int2`; quienes vengan de Snowflake o SQL Server encontrarán que `numeric` y `decimal` funcionan igual que `number`; y `double precision` es equivalente a `float`. Para `autoincrement`, se aceptan `identity` (SQL Server) y `serial` (PostgreSQL).

`number` admite precisión y escala: `number(p, s)`, donde `p` es el número total de dígitos y `s` los decimales. Sin precisión explícita, el comportamiento depende del motor — se recomienda siempre declararla para tipos que representen importes o medidas.

```crono-sql
CREATE TABLE dwh.fact_order_details (
  order_id       integer,
  product_id     integer,
  quantity       smallint,
  unit_price     number(10, 2),
  discount       number(5, 4),
  line_total     number(12, 2)
)
```


### Tipos booleanos

Crono SQL define un único tipo booleano:

- **`boolean`** — valor lógico verdadero o falso.

El tipo booleano tiene buen soporte en la mayoría de motores modernos. La excepción es **SQL Server** y **Fabric**, que no tienen un tipo `boolean` nativo y usan `bit` en su lugar — donde `1` equivale a verdadero y `0` a falso. Crono gestiona esta traducción automáticamente.

Los sinónimos `bool` y `bit` son aceptados para reducir la fricción con usuarios que vienen de esos entornos.

En las condiciones del WHERE, Crono SQL permite comparar columnas booleanas usando `TRUE`/`FALSE`, `YES`/`NO` o `1`/`0`. En los motores que no tienen un tipo booleano nativo, como SQL Server o Fabric, Crono compila `TRUE` y `YES` como `1`, y `FALSE` y `NO` como `0`.

```crono-sql
CREATE TABLE dwh.dim_products (
  product_id      integer,
  product_name    varchar(200),
  discontinued    boolean,
  requires_cold   boolean
)
```

Las columnas booleanas se pueden filtrar con `TRUE` o `FALSE`:

```crono-sql
SELECT *
FROM dwh.dim_products
WHERE discontinued = TRUE
  AND requires_cold = FALSE
```


## Dialectos de bases de datos

Cada motor de base de datos tiene sus propias convenciones para nombrar los tipos. En los apartados siguientes se documenta la equivalencia exacta entre los tipos de **Crono SQL** y los de cada motor, junto con las particularidades que conviene conocer.


### SQL Server

| Tipo Crono | Tipos SQL Server | Resultado compilación |
|------------|------------------|-----------------------|
| `date` | `date` | `date` |
| `datetime`, `timestamp_ntz` | `datetime2` | `datetime2` |
| `timestamp`, `datetime_tz`, `datetimeoffset` | `datetimeoffset` | `datetimeoffset` |
| `integer`, `int` | `int`, `integer` | `int` |
| `bigint` | `bigint` | `bigint` |
| `smallint` | `smallint` | `smallint` |
| `tinyint`, `byte` | `tinyint` | `tinyint` |
| `number`, `numeric`, `decimal` | `numeric`, `decimal` | `numeric` |
| `float` | `float` | `float` |
| `real` | `real` | `real` |
| `boolean`, `bool`, `bit` | `bit` | `bit` |
| `varchar`, `text`, `nvarchar`, `string` | `varchar`, `nvarchar` | `nvarchar / varchar` |
| `char` | `char`, `nchar` | `char` |

**Tipos de fecha.** En SQL Server existen dos tipos para fecha con hora sin zona horaria — el antiguo `datetime` y el moderno `datetime2` — y ambos se llaman de forma similar, lo que puede generar confusión. El tipo `datetime` de SQL Server tiene menor precisión (milisegundos redondeados) y su uso se desaconseja en proyectos nuevos. En **Crono SQL**, `datetime` compila siempre a `datetime2`, garantizando la mayor precisión disponible.

Algo similar ocurre con `timestamp`: SQL Server tiene un tipo histórico llamado `timestamp` que no tiene nada que ver con fechas — es un contador de versión de fila, equivalente al moderno `rowversion`. En **Crono SQL**, `timestamp` compila a `datetimeoffset`, que es el tipo correcto para fecha y hora con zona horaria.

**VARCHAR y NVARCHAR.** SQL Server distingue entre `varchar` (ASCII) y `nvarchar` (Unicode). Crono respeta el tipo que aparezca en el código fuente: si el desarrollador escribe `varchar`, se compila como `varchar`; si escribe `nvarchar` o cualquier otro sinónimo Unicode, se compila como `nvarchar`. En proyectos nuevos se recomienda usar siempre `nvarchar` para evitar problemas con caracteres no ASCII.


### PostgreSQL

| Tipo Crono | Tipos PostgreSQL | Resultado compilación |
|------------|------------------|-----------------------|
| `date` | `date` | `date` |
| `datetime`, `timestamp_ntz` | `timestamp`, `timestamp without time zone` | `timestamp` |
| `timestamp`, `datetime_tz`, `datetimeoffset` | `timestamptz`, `timestamp with time zone` | `timestamptz` |
| `integer`, `int` | `int`, `integer`, `int4` | `int` |
| `bigint` | `bigint`, `int8` | `bigint` |
| `smallint` | `smallint`, `int2` | `smallint` |
| `tinyint`, `byte` | ❌ | `smallint` ⚠️ |
| `number`, `numeric`, `decimal` | `numeric`, `decimal` | `numeric` |
| `float` | `float`, `double precision`, `float8` | `float` |
| `real` | `real`, `float4` | `real` |
| `boolean`, `bool`, `bit` | `boolean`, `bool` | `boolean` |
| `varchar`, `text`, `nvarchar`, `string` | `varchar`, `text`, `character varying` | `varchar` |
| `char` | `char`, `character` | `char` |

**Tipos de fecha.** PostgreSQL es uno de los motores donde la nomenclatura de los tipos de fecha puede resultar más confusa para los usuarios de **Crono SQL**, y viceversa. En PostgreSQL, `timestamp` es un tipo *sin* zona horaria, mientras que en Crono SQL `timestamp` significa *con* zona horaria. Para evitar errores, conviene recordar que: `datetime` en Crono SQL compila a `timestamp` en PostgreSQL, y `timestamp` en Crono SQL compila a `timestamptz`.

**TINYINT.** PostgreSQL no tiene un tipo entero de 8 bits. Si se usa `tinyint` en el código, Crono lo compilará como `smallint` (16 bits), que es el tipo entero más pequeño disponible en PostgreSQL. No hay pérdida de datos, pero el tipo resultante ocupa más espacio.


### Redshift

Redshift está basado en PostgreSQL, por lo que la equivalencia de tipos es prácticamente idéntica. La misma confusión con los tipos de fecha aplica aquí: `datetime` compila a `timestamp` y `timestamp` compila a `timestamptz`. Redshift acepta las formas verbosas `timestamp without time zone` y `timestamp with time zone`, pero su uso está desaconsejado — deben usarse siempre las formas cortas.

| Tipo Crono | Tipos Redshift | Resultado compilación |
|------------|----------------|-----------------------|
| `date` | `date` | `date` |
| `datetime`, `timestamp_ntz` | `timestamp` | `timestamp` |
| `timestamp`, `datetime_tz`, `datetimeoffset` | `timestamptz` | `timestamptz` |
| `integer`, `int` | `int`, `integer`, `int4` | `int` |
| `bigint` | `bigint`, `int8` | `bigint` |
| `smallint` | `smallint`, `int2` | `smallint` |
| `tinyint`, `byte` | ❌ | `smallint` ⚠️ |
| `number`, `numeric`, `decimal` | `numeric`, `decimal` | `numeric` |
| `float` | `float`, `double precision`, `float8` | `float` |
| `real` | `real`, `float4` | `real` |
| `boolean`, `bool`, `bit` | `boolean`, `bool` | `boolean` |
| `varchar`, `text`, `nvarchar`, `string` | `varchar`, `text`, `character varying` | `varchar` |
| `char` | `char`, `character` | `char` |


### Snowflake

Snowflake es el motor donde la nomenclatura de los tipos de fecha está más alineada con **Crono SQL**: `TIMESTAMP_NTZ` para fecha y hora sin zona horaria y `TIMESTAMP_TZ` para fecha y hora con zona horaria hacen que la correspondencia sea directa y sin ambigüedades. Snowflake también dispone de `TIMESTAMP_LTZ` (zona horaria local del sistema), pero Crono lo compila como `TIMESTAMP_TZ` — ambos tipos identifican el mismo instante absoluto en el tiempo y son equivalentes a efectos prácticos.

La otra particularidad es que Snowflake no tiene un tipo `CHAR` nativo. Si se usa `char` en el código, Crono lo compilará como `VARCHAR`.

| Tipo Crono | Tipos Snowflake | Resultado compilación |
|------------|------------------|-----------------------|
| `date` | `DATE` | `DATE` |
| `datetime`, `timestamp_ntz` | `TIMESTAMP_NTZ`, `TIMESTAMP` | `TIMESTAMP_NTZ` |
| `timestamp`, `datetime_tz`, `datetimeoffset`, `timestamp_ltz` | `TIMESTAMP_TZ`, `TIMESTAMP_LTZ` | `TIMESTAMP_TZ` |
| `integer`, `int` | `INTEGER`, `INT` | `INTEGER` |
| `bigint` | `BIGINT` | `BIGINT` |
| `smallint` | `SMALLINT` | `SMALLINT` |
| `tinyint`, `byte` | `BYTEINT` | `BYTEINT` |
| `number`, `numeric`, `decimal` | `NUMBER`, `NUMERIC`, `DECIMAL` | `NUMBER` |
| `float` | `FLOAT`, `FLOAT4`, `FLOAT8`, `DOUBLE PRECISION` | `FLOAT` |
| `real` | `REAL` | `REAL` |
| `boolean`, `bool`, `bit` | `BOOLEAN` | `BOOLEAN` |
| `varchar`, `text`, `nvarchar`, `string` | `VARCHAR`, `STRING` | `VARCHAR` |
| `char` | ❌ | `VARCHAR` ⚠️ |


### BigQuery

BigQuery tiene un sistema de tipos notablemente más reducido que el resto de motores. La diferencia más llamativa es en los tipos enteros: BigQuery solo tiene un tipo entero, `INTEGER`, que es de 64 bits — equivalente a `bigint` en otros motores. Todos los tipos enteros de Crono SQL (`integer`, `smallint`, `tinyint`) compilan a `INTEGER`. BigQuery acepta `BIGINT`, `INT64`, `INT`, `SMALLINT`, `TINYINT` y `BYTEINT` como sinónimos, pero todos son el mismo tipo subyacente. Tampoco existen `CHAR` ni `REAL` — ambos caen en `STRING` y `FLOAT64` respectivamente.

Los tipos de fecha sí tienen buena correspondencia: `DATETIME` para fecha y hora sin zona horaria y `TIMESTAMP` para fecha y hora con zona horaria, en línea con los criterios de Crono SQL.

| Tipo Crono | Tipos BigQuery | Resultado compilación |
|------------|----------------|-----------------------|
| `date` | `DATE` | `DATE` |
| `datetime`, `timestamp_ntz` | `DATETIME` | `DATETIME` |
| `timestamp`, `datetime_tz`, `datetimeoffset` | `TIMESTAMP` | `TIMESTAMP` |
| `integer`, `int` | ❌ | `INTEGER` ⚠️ |
| `bigint` | `INTEGER`, `BIGINT`, `INT64`, `INT`, `SMALLINT`, `TINYINT`, `BYTEINT` | `INTEGER` |
| `smallint` | ❌ | `INTEGER` ⚠️ |
| `tinyint`, `byte` | ❌ | `INTEGER` ⚠️ |
| `number`, `numeric`, `decimal` | `NUMERIC`, `DECIMAL`, `BIGNUMERIC` | `NUMERIC` |
| `float` | `FLOAT64` | `FLOAT64` |
| `real` | ❌ | `FLOAT64` ⚠️ |
| `boolean`, `bool`, `bit` | `BOOLEAN`, `BOOL` | `BOOLEAN` |
| `varchar`, `text`, `nvarchar`, `string` | `STRING` | `STRING` |
| `char` | ❌ | `STRING` ⚠️ |


### Databricks

Databricks presenta dos particularidades que conviene conocer. La primera afecta a los tipos de coma flotante: en Databricks, `float` es un tipo de 32 bits (equivalente al `real` de Crono SQL) y `double` es de 64 bits (equivalente al `float` de Crono SQL). La nomenclatura es la inversa a la habitual, lo que puede llevar a confusión. En **Crono SQL**, `float` compila siempre a `double` en Databricks, garantizando la doble precisión. La segunda particularidad es que Databricks no tiene un tipo `CHAR` nativo — si se usa `char` en el código, Crono lo compilará como `string`.

En cuanto a los tipos de fecha, Databricks sigue el mismo criterio que BigQuery: `timestamp` es un tipo *con* zona horaria, y `timestamp_ntz` es el tipo *sin* zona horaria. La correspondencia con **Crono SQL** es directa.

| Tipo Crono | Tipos Databricks | Resultado compilación |
|------------|------------------|-----------------------|
| `date` | `date` | `date` |
| `datetime`, `timestamp_ntz` | `timestamp_ntz` | `timestamp_ntz` |
| `timestamp`, `datetime_tz`, `datetimeoffset` | `timestamp`, `timestamp_ltz` | `timestamp` |
| `integer`, `int` | `int`, `integer` | `int` |
| `bigint` | `bigint`, `long` | `bigint` |
| `smallint` | `smallint`, `short` | `smallint` |
| `tinyint`, `byte` | `tinyint`, `byte` | `tinyint` |
| `number`, `numeric`, `decimal` | `decimal`, `numeric`, `dec` | `decimal` |
| `float` | `double`, `double precision`, `float8` | `double` |
| `real` | `float`, `real`, `float4` | `float` |
| `boolean`, `bool`, `bit` | `boolean`, `bool` | `boolean` |
| `varchar`, `text`, `nvarchar`, `string` | `string`, `varchar`, `nvarchar`, `text`, `character varying` | `string` |
| `char` | ❌ | `string` ⚠️ |


### Fabric

Microsoft Fabric está basado en el mismo motor que SQL Server, por lo que la equivalencia de tipos es en gran medida idéntica. La diferencia más relevante es la ausencia de soporte para fecha y hora con zona horaria: Fabric no dispone de un tipo equivalente a `datetimeoffset`. Esta es una limitación importante, porque el tipo `timestamp` es el más adecuado para columnas de auditoría — por ejemplo, para registrar cuándo se insertó o modificó un registro. Crono compila `timestamp` como `datetime2` en Fabric y usa la función `SYSUTCDATETIME()` para capturar la hora actual en UTC, de forma que el valor almacenado sea siempre comparable entre sistemas aunque no lleve zona horaria explícita.

| Tipo Crono | Tipos Fabric | Resultado compilación |
|------------|-------------|-----------------------|
| `date` | `date` | `date` |
| `datetime`, `timestamp_ntz` | `datetime2` | `datetime2` |
| `timestamp`, `datetime_tz`, `datetimeoffset` | ❌ | `datetime2` ⚠️ |
| `integer`, `int` | `int`, `integer` | `int` |
| `bigint` | `bigint` | `bigint` |
| `smallint` | `smallint` | `smallint` |
| `tinyint`, `byte` | `tinyint` | `tinyint` |
| `number`, `numeric`, `decimal` | `numeric`, `decimal` | `numeric` |
| `float` | `float` | `float` |
| `real` | `real` | `real` |
| `boolean`, `bool`, `bit` | `bit` | `bit` |
| `varchar`, `text`, `nvarchar`, `string` | `varchar`, `nvarchar` | `varchar` |
| `char` | `char`, `nchar` | `char` |


### DuckDB

DuckDB sigue el mismo criterio de nomenclatura de fechas que PostgreSQL y Redshift: `timestamp` es un tipo *sin* zona horaria, y `timestamptz` es el tipo *con* zona horaria. La correspondencia con **Crono SQL** es por tanto la misma que con esos motores: `datetime` compila a `timestamp` y `timestamp` compila a `timestamptz`. Al igual que PostgreSQL, DuckDB no tiene un tipo entero de 8 bits — `tinyint` se compila como `smallint`. También coincide con Databricks en que `float` es de 32 bits y `double` es de 64 bits, por lo que `float` de Crono SQL compila a `double` en DuckDB.

| Tipo Crono | Tipos DuckDB | Resultado compilación |
|------------|-------------|-----------------------|
| `date` | `date` | `date` |
| `datetime`, `timestamp_ntz` | `timestamp`, `timestamp without time zone` | `timestamp` |
| `timestamp`, `datetime_tz`, `datetimeoffset` | `timestamptz`, `timestamp with time zone` | `timestamptz` |
| `integer`, `int` | `int`, `integer`, `int4` | `int` |
| `bigint` | `bigint`, `int8` | `bigint` |
| `smallint` | `smallint`, `int2` | `smallint` |
| `tinyint`, `byte` | ❌ | `smallint` ⚠️ |
| `number`, `numeric`, `decimal` | `numeric`, `decimal` | `numeric` |
| `float` | `double`, `double precision`, `float8` | `double` |
| `real` | `float4`, `real`, `float` | `float4` |
| `boolean`, `bool`, `bit` | `boolean`, `bool` | `boolean` |
| `varchar`, `text`, `nvarchar`, `string` | `varchar`, `text`, `character varying`, `string` | `varchar` |
| `char` | `char`, `character` | `char` |


## Resumen

**Crono SQL** define su propio conjunto de tipos de datos que se compilan automáticamente al tipo equivalente de cada motor. La conversión es directa en la gran mayoría de casos — texto, enteros, decimales y booleanos no presentan dificultades. El área que requiere más atención son los tipos de fecha: conviene recordar que Crono define tres tipos con nombres propios — `date`, `datetime` y `timestamp` — cuya correspondencia varía según el motor.

Toda la información de equivalencias está disponible en tiempo de ejecución a través de la pseudovista `crono.data_types`:

```crono-sql
SELECT * FROM crono.data_types
```
