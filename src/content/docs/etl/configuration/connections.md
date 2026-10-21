---
title: "Conexiones"
description: "Bases de datos de origen y destino con las que trabaja Crono ETL."
---

Una conexión define cómo acceder a una base de datos: el motor, el servidor, la base de datos y las credenciales. Se identifica por un nombre, y las acciones y las sentencias Crono SQL se refieren a ella solo por ese nombre, de modo que el código del proyecto no contiene cadenas de conexión ni contraseñas.

Las conexiones forman parte del entorno, junto con los [almacenamientos](/etl/configuration/storage/) y las [credenciales](/etl/configuration/credentials/). El mismo proyecto puede ejecutarse contra bases de datos distintas, por ejemplo en desarrollo y en producción, si cada entorno define las conexiones con los mismos nombres.

## Dónde se definen

La configuración de cada entorno se guarda en un fichero del proyecto, uno por entorno:

```
.crono/environments/<entorno>.jsonc
```

El fichero contiene las conexiones del entorno, junto con sus almacenamientos y credenciales. Cada conexión indica su tipo (`type`), su nombre (`name`) y las propiedades propias del motor:

```jsonc
{
  "name": "Default",
  "default-connection": "DWH",
  "Connections": [
    {
      "type": "sqlserver",
      "name": "ERP_SOURCE",
      "server": "SRV01\\ERP",
      "database-name": "ERP"
    },
    {
      "type": "postgresql",
      "name": "DWH",
      "host": "localhost",
      "port": 5432,
      "database": "dwh",
      "username": "crono",
      "password": "[ENCRYPTED TEXT]..."
    }
  ]
}
```

Las contraseñas y los tokens se guardan cifrados, con el prefijo `[ENCRYPTED TEXT]`.

Las conexiones pueden crearse y modificarse de tres formas, que modifican el mismo fichero y pueden combinarse:

- **Desde Crono ETL**, en las propiedades del entorno, con un formulario específico para cada motor.
- **Desde Crono CLI**, con los comandos `crono connection`:

  | Comando | Acción |
  | --- | --- |
  | `crono connection list` | Lista las conexiones del entorno. |
  | `crono connection add <tipo>` | Añade una conexión del tipo indicado (`sqlserver`, `postgresql`, `snowflake`...). |
  | `crono connection edit <tipo>` | Modifica una conexión. |
  | `crono connection remove` | Elimina una conexión. |
  | `crono connection test` | Prueba las conexiones del entorno. |

  Las opciones de cada comando tienen los mismos nombres que las propiedades del fichero, y `--help` las describe. Las contraseñas nunca se pasan como argumento: se leen de la entrada estándar con `--password-stdin`.
- **Editando directamente el fichero**, que es JSON con comentarios.

## Uso de las conexiones

Las acciones y las sentencias Crono SQL se refieren a las conexiones solo por su nombre. Cada entorno tiene además una **conexión predeterminada** (`default-connection` en el fichero), sobre la que se ejecuta todo lo que no indica una conexión. En Crono ETL, la conexión en uso se muestra en la barra de herramientas y puede cambiarse desde allí; en Crono CLI, `crono connection current` la muestra.

Las acciones que trabajan con más de una base de datos indican las conexiones con las propiedades `source_connection_name` (origen) y `target_connection_name` (destino). Si no se informan, se utiliza la conexión predeterminada. Por ejemplo, esta acción copia una tabla de la conexión `ERP_SOURCE` a la conexión `DWH`:

```
[bulk table](
	source_connection_name='ERP_SOURCE',
	target_connection_name='DWH',
	schema_name='sales',
	table_name='customers_data'
)
```

Como el código solo contiene nombres, conviene elegirlos bien:

- Usa nombres que describan el papel de la base de datos, no el servidor: `ERP_SOURCE` o `DWH` en lugar de `SRV-SQL-03`.
- Usa los mismos nombres en todos los entornos del proyecto. Cada entorno apunta a su propio servidor, y el código funciona en todos sin cambios.

<!-- PENDIENTE: confirmar si el nombre distingue mayúsculas y minúsculas, y qué caracteres admite (espacios, guiones...). Terminología: el IDE habla de "conexión activa", la CLI de "conexión predeterminada" / "conexión actual", y las páginas de acciones (bulk-table, import-parquet...) dicen "conexión activa"; unificar. ¿Puede un job cambiar la conexión en uso? -->

## Credenciales

Según el motor, el secreto con el que Crono ETL se autentica se guarda en la propia conexión, cifrado, o en una entidad de [credenciales](/etl/configuration/credentials/) a la que la conexión hace referencia por su nombre (`credentials-name`):

- **En la conexión:** SQL Server, PostgreSQL, Snowflake, Fabric y Databricks (usuario y contraseña, token o secreto de cliente).
- **En unas credenciales:** Redshift (credenciales de AWS) y BigQuery (cuenta de servicio de Google). Las mismas credenciales pueden compartirse entre varias conexiones y almacenamientos.

<!-- PENDIENTE: Databricks guarda el token en la conexión y no usa la entidad Credentials. La conexión genérica guarda la cadena de conexión sin cifrar. -->

## Verificar la conexión

El formulario de cada conexión incluye el botón **Verificar conexión**, que intenta conectar con los datos introducidos e informa del resultado, y el botón **Ver tablas**, que muestra las tablas a las que tiene acceso la conexión. En Crono CLI, `crono connection test` prueba las conexiones del entorno.

## Motores admitidos

<!-- PENDIENTE: las capturas de los formularios se toman con la interfaz en inglés (criterio general). Rehacer las de esta página en inglés. La columna "Nombre" de las tablas usa nombres en español, independientes del idioma de la interfaz. -->

En el entorno se define como conexión tanto la base de datos del DWH como cada una de las bases de datos de origen. Unas y otras tienen requisitos distintos:

- **La base de datos del DWH**, donde Crono SQL crea y carga las tablas, debe usar uno de los dialectos para los que Crono SQL genera código: SQL Server, PostgreSQL, Redshift, BigQuery, Snowflake, Databricks, Fabric o DuckDB.
- **Las bases de datos de origen** pueden usar cualquiera de esos motores o cualquier otro. Para los motores que no tienen formulario propio existe la [conexión genérica](#genérica).

:::note
Lo que determina si una conexión puede usarse como DWH es su dialecto SQL, no el tipo de conexión. Una conexión genérica con un dialecto admitido por Crono SQL (por ejemplo, SQL Server) puede usarse como DWH. Con cualquier otro dialecto (Oracle, MySQL, Access...) solo sirve para leer datos de origen.
:::

| Motor | Requisitos adicionales |
| --- | --- |
| [SQL Server](#sql-server) | — |
| [PostgreSQL](#postgresql) | — |
| [Redshift](#redshift) | Credenciales de AWS. Almacenamiento intermedio en S3 y rol IAM, para la carga masiva |
| [BigQuery](#bigquery) | Cuenta de servicio de Google, definida como credenciales |
| [Snowflake](#snowflake) | — |
| [Databricks](#databricks) | Driver ODBC de Databricks. Volumen intermedio de Unity Catalog, para la carga masiva |
| [Fabric](#fabric) | Entidad de servicio de Microsoft Entra ID |
| [DuckDB](#duckdb) | — |
| [Genérica](#genérica) | Driver ODBC u OLE DB del motor. Solo como origen, salvo con un dialecto admitido por Crono SQL |

### SQL Server

La conexión de SQL Server sirve tanto para un servidor local como para uno en red, con la seguridad integrada de Windows o con un usuario de SQL Server. En Crono ETL se configura con el formulario de SQL Server:

![Formulario de una conexión de SQL Server](/images/etl/configuration/connections/sqlserver.png)

Estas son las propiedades de la conexión, con su nombre en el fichero del entorno y en Crono CLI:

| Nombre | Propiedad | Descripción |
| --- | --- | --- |
| Servidor | `server` | Nombre o dirección del servidor, con la instancia si es necesario: `localhost`, `.` o `SRV01\INSTANCIA`. |
| Base de datos | `database-name` | Base de datos a la que se conecta. El botón junto al campo permite elegirla entre las del servidor. |
| Autenticación Windows | — | Conecta con la seguridad integrada de Windows, con el usuario que ejecuta Crono ETL. Es la opción por defecto. |
| Autenticación SQL | — | Conecta con un usuario de SQL Server. |
| Usuario | `username` | Usuario de SQL Server, con la autenticación SQL. En el fichero, si `username` no tiene valor (`null`), se usa la autenticación Windows. |
| Contraseña | `password` | Contraseña del usuario de SQL Server. Se guarda cifrada. |

Con Crono CLI:

```
crono connection add sqlserver --name ERP_SOURCE --server SRV01\ERP --database-name ERP
```

Sin `--username`, la conexión usa la seguridad integrada de Windows. Con usuario de SQL Server, la contraseña se lee de la entrada estándar:

```
crono connection add sqlserver --name DWH --server SRV02 --database-name DWH --username crono --password-stdin < password.txt
```

### PostgreSQL

La conexión de PostgreSQL se identifica por el servidor, el puerto y la base de datos, y se autentica con un usuario y una contraseña de PostgreSQL. En Crono ETL se configura con el formulario de PostgreSQL:

![Formulario de una conexión de PostgreSQL](/images/etl/configuration/connections/postgresql.png)

Estas son las propiedades de la conexión, con su nombre en el fichero del entorno y en Crono CLI:

| Nombre | Propiedad | Descripción |
| --- | --- | --- |
| Host | `host` | Nombre o dirección del servidor. |
| Base de datos | `database` | Base de datos a la que se conecta. El botón junto al campo permite elegirla entre las del servidor. |
| Puerto | `port` | Puerto del servidor. Por defecto, `5432`. |
| Usuario | `username` | Usuario de PostgreSQL. |
| Contraseña | `password` | Contraseña del usuario. Se guarda cifrada. |
| Modo SSL | `ssl-mode` | Uso de SSL en la conexión: `Disable`, `Allow`, `Prefer`, `Require`, `VerifyCA` o `VerifyFull`. Por defecto, `Prefer`: usa SSL si el servidor lo admite. |

Con Crono CLI:

```
crono connection add postgresql --name DWH --host localhost --database dwh --username crono --password-stdin < password.txt
```

### Redshift

La conexión de Redshift sirve tanto para un clúster aprovisionado como para un workgroup de Redshift Serverless. Crono ETL se autentica con unas [credenciales](/etl/configuration/credentials/) de AWS del entorno. En Crono ETL se configura con el formulario de Redshift:

![Formulario de una conexión de Redshift](/images/etl/configuration/connections/redshift.png)

Estas son las propiedades de la conexión, con su nombre en el fichero del entorno y en Crono CLI:

| Nombre | Propiedad | Descripción |
| --- | --- | --- |
| Host | `host` | Nombre del servidor (endpoint) del clúster o del workgroup de Redshift, sin el puerto ni la base de datos. |
| Base de datos | `database` | Base de datos a la que se conecta. El botón junto al campo permite elegirla entre las del servidor. |
| Puerto | `port` | Puerto del servidor. Por defecto, `5439`. |
| Credenciales | `credentials-name` | Nombre de unas credenciales de tipo Amazon del entorno, con las que Crono ETL se autentica en Redshift. |
| Modo SSL | `ssl-mode` | Uso de SSL en la conexión: `Disable`, `Allow`, `Prefer`, `Require`, `VerifyCA` o `VerifyFull`. Por defecto, `Prefer`. |
| Rol IAM | `iam-role` | ARN del rol IAM con el que Redshift lee los ficheros de S3 en la carga masiva, por ejemplo `arn:aws:iam::123456789012:role/MyRole`. Si se deja vacío, se usa el rol por defecto del clúster o del namespace. |
| Almacenamiento | `staging-file-store-name` | Almacenamiento intermedio: nombre de un [almacenamiento](/etl/configuration/storage/) de Amazon S3 del entorno, donde Crono ETL deja los ficheros Parquet antes de cargarlos si no están ya en S3. |

El rol IAM y el almacenamiento solo intervienen en la carga masiva desde ficheros Parquet. Sus requisitos (asociar el rol al clúster, permisos sobre el bucket, misma región) se explican en [IMPORT PARQUET](/etl/data-movement/import-parquet/#redshift).

Con Crono CLI:

```
crono connection add redshift --name DWH --host default-workgroup.123456789012.eu-west-1.redshift-serverless.amazonaws.com --database dwh --credentials-name aws-dwh --staging-file-store-name s3-staging
```

<!-- PENDIENTE: la CLI de Redshift ofrece --username y --password-stdin, que no están en el formulario. Parece un error de la CLI: la autenticación recomendada es con credenciales de AWS (como en S3), no con usuario y contraseña. Pau lo está comprobando. -->

### BigQuery

La conexión de BigQuery apunta a un proyecto de Google Cloud y se autentica con una cuenta de servicio, definida como [credenciales](/etl/configuration/credentials/) de tipo Google en el entorno. Los datasets del proyecto equivalen a los esquemas de los demás motores. En Crono ETL se configura con el formulario de BigQuery:

![Formulario de una conexión de BigQuery](/images/etl/configuration/connections/bigquery.png)

Estas son las propiedades de la conexión, con su nombre en el fichero del entorno y en Crono CLI:

| Nombre | Propiedad | Descripción |
| --- | --- | --- |
| ID de proyecto | `project-id` | Identificador del proyecto de Google Cloud, tal como aparece en la consola (no el nombre visible del proyecto). |
| Región | `region` | Ubicación predeterminada de BigQuery para los trabajos y los datasets que crea Crono ETL. El desplegable ofrece las multirregiones `EU` y `US`, pero admite cualquier ubicación de BigQuery, por ejemplo `europe-southwest1`. Debe coincidir con la ubicación de los datasets. |
| Credenciales | `credentials-name` | Nombre de unas credenciales de tipo Google del entorno, con la cuenta de servicio con la que Crono ETL accede al proyecto. |

La cuenta de servicio necesita permisos para ejecutar trabajos y para leer y escribir en los datasets del proyecto, por ejemplo con los roles "Usuario de trabajos de BigQuery" y "Editor de datos de BigQuery". Crono ETL no necesita crear datasets: si ya existen, puede crear en ellos tablas, vistas y procedimientos. Para crear datasets desde Crono ETL, la cuenta de servicio necesita además el permiso `bigquery.datasets.create` sobre el proyecto, que incluye por ejemplo el rol "Editor de datos de BigQuery" concedido a nivel de proyecto.

Con Crono CLI:

```
crono connection add bigquery --name DWH --project-id my-project-dwh --region EU --credentials-name google-dwh
```

### Snowflake

La conexión de Snowflake apunta a una cuenta de Snowflake y ejecuta las consultas en uno de sus warehouses. Se autentica con un usuario de Snowflake y su contraseña o un token de acceso programático. En Crono ETL se configura con el formulario de Snowflake:

![Formulario de una conexión de Snowflake](/images/etl/configuration/connections/snowflake.png)

Estas son las propiedades de la conexión, con su nombre en el fichero del entorno y en Crono CLI:

| Nombre | Propiedad | Descripción |
| --- | --- | --- |
| Cuenta | `account` | Identificador de la cuenta, en el formato `organizacion-cuenta` (por ejemplo, `myorg-myaccount`). Es la primera parte de la URL de la cuenta, antes de `.snowflakecomputing.com`. |
| Warehouse | `warehouse` | Warehouse en el que se ejecutan las consultas. El usuario necesita permiso de uso sobre él. |
| Base de datos | `database` | Base de datos a la que se conecta. El botón junto al campo permite elegirla entre las de la cuenta. |
| Esquema | `schema` | Esquema predeterminado de la sesión. Es opcional. |
| Usuario | `username` | Usuario de Snowflake. |
| Contraseña | `password` | Contraseña del usuario o, preferiblemente, un token de acceso programático (PAT) generado para él. Se guarda cifrado. |

Snowflake está restringiendo el acceso con solo usuario y contraseña, sobre todo para los usuarios con autenticación multifactor. Para una conexión que se ejecuta de forma desatendida, como la de Crono ETL, se recomienda usar un token de acceso programático.

Con Crono CLI:

```
crono connection add snowflake --name DWH --account myorg-myaccount --warehouse COMPUTE_WH --database DWH --username crono --password-stdin < token.txt
```

<!-- PENDIENTE: ¿se admitirá autenticación con par de claves (key-pair)? Hoy solo usuario y contraseña/PAT. -->

### Databricks

La conexión de Databricks se conecta a un SQL warehouse o a un clúster de un workspace de Databricks, mediante el driver ODBC de Databricks, que debe estar instalado en el equipo que ejecuta Crono ETL. Se autentica con un token de acceso personal (PAT). En Crono ETL se configura con el formulario de Databricks:

![Formulario de una conexión de Databricks](/images/etl/configuration/connections/databricks.png)

Estas son las propiedades de la conexión, con su nombre en el fichero del entorno y en Crono CLI:

| Nombre | Propiedad | Descripción |
| --- | --- | --- |
| Host | `host` | Nombre del servidor del workspace, por ejemplo `dbc-a1b2c3d4-e5f6.cloud.databricks.com`. |
| HTTP Path | `http-path` | Ruta HTTP del SQL warehouse o del clúster, por ejemplo `/sql/1.0/warehouses/a1b2c3d4e5f6a7b8`. Aparece en los detalles de conexión del warehouse. |
| Base de datos | `database` | Catálogo de Unity Catalog que se usa por defecto. Es opcional. El botón junto al campo permite elegirlo entre los del workspace. |
| Token | `token` | Token de acceso personal de Databricks. Se guarda cifrado. En Crono CLI se lee de la entrada estándar con `--password-stdin`. |
| Volumen intermedio | `staging-volume` | Ruta de un volumen de Unity Catalog, con la forma `/Volumes/catálogo/esquema/volumen` y, opcionalmente, una carpeta dentro del volumen. Crono ETL deja en él los ficheros Parquet de la carga masiva. Es opcional, pero sin él la conexión no admite IMPORT PARQUET. |

El volumen intermedio solo interviene en la carga masiva desde ficheros Parquet; sus requisitos se explican en [IMPORT PARQUET](/etl/data-movement/import-parquet/#databricks). El enlace **Crear volumen intermedio (si no existe)** del formulario crea el volumen indicado con `CREATE VOLUME IF NOT EXISTS`, si el usuario tiene permiso para ello. El enlace **Descargar ODBC Driver** lleva a la página de descarga del driver.

Con Crono CLI:

```
crono connection add databricks --name DWH --host dbc-a1b2c3d4-e5f6.cloud.databricks.com --http-path /sql/1.0/warehouses/a1b2c3d4e5f6a7b8 --database dwh --staging-volume /Volumes/dwh/staging/crono_staging --password-stdin < token.txt
```

<!-- PENDIENTE: el token se guarda en la conexión y no en la entidad Credentials. La etiqueta "Base de datos" corresponde al catálogo de Unity Catalog. -->

### Fabric

La conexión de Fabric se conecta al punto de conexión SQL de un warehouse o de un lakehouse de Microsoft Fabric. Se autentica con una entidad de servicio (service principal) de Microsoft Entra ID, que es el único modo de autenticación admitido. En Crono ETL se configura con el formulario de Fabric:

![Formulario de una conexión de Fabric](/images/etl/configuration/connections/fabric.png)

Estas son las propiedades de la conexión, con su nombre en el fichero del entorno y en Crono CLI:

| Nombre | Propiedad | Descripción |
| --- | --- | --- |
| Servidor | `server` | Punto de conexión SQL del warehouse o del lakehouse, por ejemplo `xxxxxxxx.datawarehouse.fabric.microsoft.com`. Aparece en la configuración del warehouse, como cadena de conexión SQL. |
| Base de datos | `database` | Nombre del warehouse o del lakehouse. Es opcional. El botón junto al campo permite elegirlo entre los disponibles. |
| Modo de autenticación | — | Siempre `Active Directory Service Principal`. No se puede modificar. |
| ID de usuario | `user-id` | Identificador de aplicación (cliente) de la entidad de servicio en Microsoft Entra ID. |
| Secreto de cliente | `password` | Secreto de cliente de la entidad de servicio. Se guarda cifrado. |

Para que la conexión funcione:

- La entidad de servicio debe tener acceso al área de trabajo de Fabric que contiene el warehouse, por ejemplo con el rol de colaborador.
- Según la configuración de la organización, puede ser necesario que un administrador de Fabric permita a las entidades de servicio usar las API de Fabric, en la configuración del inquilino del portal de administración.

Con Crono CLI:

```
crono connection add fabric --name DWH --server xxxxxxxx.datawarehouse.fabric.microsoft.com --database DWH --user-id 00000000-0000-0000-0000-000000000000 --password-stdin < secret.txt
```

<!-- PENDIENTE: la etiqueta "Password" del formulario contiene en realidad el secreto de cliente. -->

### DuckDB

La conexión de DuckDB abre un fichero de base de datos de DuckDB en el equipo que ejecuta Crono ETL. No necesita servidor ni credenciales. En Crono ETL se configura con el formulario de DuckDB:

![Formulario de una conexión de DuckDB](/images/etl/configuration/connections/duckdb.png)

Estas son las propiedades de la conexión, con su nombre en el fichero del entorno y en Crono CLI:

| Nombre | Propiedad | Descripción |
| --- | --- | --- |
| Archivo | `file` | Ruta del fichero de base de datos de DuckDB, por ejemplo `C:\dwh\dwh.duckdb`. El botón **+** crea una base de datos nueva y el botón del lápiz permite elegir un fichero existente. |

DuckDB solo permite que un proceso abra el fichero con permiso de escritura. Si el fichero está abierto en otra aplicación, por ejemplo en un cliente SQL, Crono ETL no podrá conectarse hasta que esa aplicación lo cierre.

Con Crono CLI:

```
crono connection add duckdb --name DWH --file C:\dwh\dwh.duckdb
```

<!-- PENDIENTE: parece que no se admiten rutas relativas a la carpeta del proyecto (no era el caso de uso previsto). Confirmar antes de documentarlo. -->

### Genérica

La conexión genérica se conecta a cualquier base de datos mediante una cadena de conexión: un DSN o una cadena de conexión ODBC, OLE DB o de SQL Server. Se usa sobre todo para leer datos de motores que no tienen formulario propio, como Oracle o MySQL. En Crono ETL se configura con el formulario de conexión genérica:

![Formulario de una conexión genérica](/images/etl/configuration/connections/generic.png)

Estas son las propiedades de la conexión, con su nombre en el fichero del entorno y en Crono CLI:

| Nombre | Propiedad | Descripción |
| --- | --- | --- |
| DSN o cadena de conexión | `connection-string` | Nombre de un origen de datos ODBC (`DSN=MySource`) o cadena de conexión completa. Crono ETL elige el proveedor según su contenido: OLE DB si incluye `Provider` y `OLEDB`, el cliente de SQL Server si incluye `Data Source` sin `DSN`, y ODBC en el resto de casos. |
| Dialecto SQL | `dialect` | Dialecto SQL de la base de datos: `SQLServer` (por defecto), `Postgres`, `Oracle`, `MySql`, `Access`, `Excel`, `Ansi92`, `Snowflake`, `Redshift`, `BigQuery`, `Databricks`, `Fabric`, `DuckDb` u `Other`. En el formulario aparecen con nombres descriptivos, como "ANSI (Postgres)" o "ANSI (Otro)". Determina si la conexión puede usarse como DWH (ver [Motores admitidos](#motores-admitidos)). |
| Usar vistas de INFORMATION_SCHEMA | `use-information-schema-metadata` | Obtiene la lista de tablas y columnas de las vistas `INFORMATION_SCHEMA` de la base de datos en lugar de pedirla al driver. Por defecto, `false`. Útil si el driver no devuelve esa información correctamente. |

Los enlaces **Ver información ODBC de tablas** y **Ver información ODBC de columnas** muestran lo que devuelve el driver, lo que ayuda a decidir si conviene activar la casilla anterior. Los enlaces **Orígenes de datos (32 bits)** y **Orígenes de datos (64 bits)** abren el administrador de orígenes de datos ODBC de Windows.

:::note
El driver ODBC debe tener la misma arquitectura (32 o 64 bits) que Crono ETL. El formulario indica la arquitectura con la que se está ejecutando.
:::

Una conexión genérica puede usarse en cualquier acción. Lo habitual es usarla como origen de [BULK TABLE](/etl/data-movement/bulk-table/) o [EXPORT PARQUET](/etl/data-movement/export-parquet/) para llevar los datos de bases de datos como dBase o Firebird al área de staging del DWH. Las sentencias Crono SQL que se ejecutan sobre una conexión con un dialecto no admitido por Crono SQL (Oracle, MySQL, `Ansi92`, `Other`...) se traducen a SQL estándar, por lo que su funcionamiento depende de lo fiel que sea la base de datos al estándar ANSI.

<!-- PENDIENTE: ejemplo con Crono CLI. La sinopsis de crono connection add generic no incluye --connection-string: ¿la cadena de conexión se lee con --password-stdin, como secreto? La cadena de conexión no se guarda cifrada en el .jsonc (ConnectionString no tiene JsonEncrypted) aunque puede contener contraseñas. Confirmar la descripción de use-information-schema-metadata (alternativa a las funciones de catálogo ODBC). La transpilación de Crono SQL a dialectos no admitidos no está probada. -->
