
# Crono$Csv

`Crono$Csv` es una pseudovista con parámetros que permite leer un archivo CSV.

Admite los siguientes parámtros

- **FileName**: Nombre del archivo con el CSV. Puede ser una URL o una ubicación de Github. Es el parámetro predeterminado.
- **Limit**: Número de líneas a leer (por defecto se lee el fichero completo).
- **Separator**: Establece el separador de columnas del fichero. Si no se indica, Crono intena identificar identifica el separador adecuado en función del contenido del archivo. 
- **WithColumnNames**: Indica si la primera linea del archivo contiene el nombre de las columnas (por efecto, **YES**)
- **IndexColumnName**: si se establece, se añade una columna con un valor autonumérico.
- **ParentIndexColumnName**
- **Data**: En lugar del `FileName` se puede establecer el contenido del CSV como un literal de texto.


El generador de **Crono** analizar el contenido del arcihvo para tratar de determinar correctamente el tipo de dato de cada columna.



## Ejemplos

Esta pseudovista permite leer un CSV de este modo:

```
select *
from crono$Csv(
    Filename='https://github.com/crono-bi/crono.org/blob/master/src/.vuepress/public/stores.csv',
    [Separator]=','
)
```

**Crono SQL** lee el CSv y los convierte múltiples `SELECTs`individuales concatenadas mediante `UNION ALL`. El código resultante será similar a:


```
SELECT *
FROM (
    SELECT *
    FROM
      (SELECT 1 AS store_nbr, 'Quito' AS city, 'Pichincha' AS state, 'D' AS type, 13 AS cluster
       UNION ALL SELECT 4 AS store_nbr, 'Quito' AS city, 'Pichincha' AS state, 'D' AS type, 9 AS cluster
       UNION ALL SELECT 5 AS store_nbr, 'Santo Domingo' AS city, 'Santo Domingo de los Tsachilas' AS state, 'D' AS type, 4 AS cluster
       UNION ALL SELECT 6 AS store_nbr, 'Quito' AS city, 'Pichincha' AS state, 'D' AS type, 13 AS cluster
       UNION ALL SELECT 9 AS store_nbr, 'Quito' AS city, 'Pichincha' AS state, 'B' AS type, 6 AS cluster
       UNION ALL SELECT 10 AS store_nbr, 'Quito' AS city, 'Pichincha' AS state, 'C' AS type, 15 AS cluster
       UNION ALL SELECT 11 AS store_nbr, 'Cayambe' AS city, 'Pichincha' AS state, 'B' AS type, 6 AS cluster
       UNION ALL SELECT 12 AS store_nbr, 'Latacunga' AS city, 'Cotopaxi' AS state, 'C' AS type, 15 AS cluster
       UNION ALL SELECT 13 AS store_nbr, 'Latacunga' AS city, 'Cotopaxi' AS state, 'C' AS type, 15 AS cluster) [crono$Csv]
  ) a
```




El mismo resultado se obtener con esta sentencia, pues `[Separator]` es opcional y `[filename]` es la propiedad predeterminada. 

```
select *
from crono$Csv(
    Filename='https://github.com/crono-bi/crono.org/blob/master/src/.vuepress/public/stores.csv',
    [Separator]=','
)
```

Como en cualquier otra es compatible con el resto de elementos del lenguaje **Crono SQL**. Es posible filtrar, agrupar, o unir con otras tablas el CSV.


```
select city Ciudad,count(*) NumTiendas
from crono$Csv('https://github.com/crono-bi/crono.org/blob/master/src/.vuepress/public/stores.csv')
where state='Pichincha'
```

Es posible ejecutar una consulta sobre un literal CSV, tal y como muestra el siguiente ejemplo:

```
select *
from Crono$Csv(
	IndexColumnName='IdTienda',
	Data='
		store_nbr,city,state,type,cluster
		1,Quito,Pichincha,D,13
		4,Quito,Pichincha,D,9
		5,Santo Domingo,Santo Domingo de los Tsachilas,D,4
		6,Quito,Pichincha,D,13
		9,Quito,Pichincha,B,6
		10,Quito,Pichincha,C,15'
)
```

Como se ha informado el paràmetro `IndexColumnName`, el código resultante ha añadido una columna autonumérica que se puede usar como identificador del registro:

```
SELECT *
FROM
  (SELECT 0 AS IdTienda, 1 AS store_nbr, 'Quito' AS city, 'Pichincha' AS state, 'D' AS type, 13 AS cluster
   UNION ALL SELECT 1 AS IdTienda, 4 AS store_nbr, 'Quito' AS city, 'Pichincha' AS state, 'D' AS type, 9 AS cluster
   UNION ALL SELECT 2 AS IdTienda, 5 AS store_nbr, 'Santo Domingo' AS city, 'Santo Domingo de los Tsachilas' AS state, 'D' AS type, 4 AS cluster
   UNION ALL SELECT 3 AS IdTienda, 6 AS store_nbr, 'Quito' AS city, 'Pichincha' AS state, 'D' AS type, 13 AS cluster
   UNION ALL SELECT 4 AS IdTienda, 9 AS store_nbr, 'Quito' AS city, 'Pichincha' AS state, 'B' AS type, 6 AS cluster
   UNION ALL SELECT 5 AS IdTienda, 10 AS store_nbr, 'Quito' AS city, 'Pichincha' AS state, 'C' AS type, 15 AS cluster) [Crono$Csv]
```



## Materilización


`Crono$Csv` genera SQLs con múltiples `SELECTs` unidas mediante `UNIOAN ALL`. Este comportamiento no supone ningún problema en ficheros con unos pocos miles de línea, pero es ineficiente y problemático en ficheros realmente grandes (requiere excesiva memoria para generar y parsear la sentencia generada y la base de datos no es capaz de resolverla).

En estos casos, es preciso materializar la tabla en base de datos antes de preparar la consulta. Lo que hace el generador de Crono es leer el CSV y hacer directamente un BULK de los datos en una tabla temporal. Una vez realizado el BULK, se ejecuta la consulta usando lsa tabla temporal recién creada.

La sintaxis para conseguir este comportamiento es la siguiente:

```
select city Ciudad,count(*) NumTiendas
from crono$Csv('https://github.com/crono-bi/crono.org/blob/master/src/.vuepress/public/stores.csv') materialize into tmp stores
where state='Pichincha'
```

En este caso, la consulta generada es la siguiente:

```
IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='dbo' AND TABLE_NAME='tmp')
CREATE TABLE dbo.tmp(
  store_nbr float,
  city nvarchar(max),
  state nvarchar(max),
  type nvarchar(max),
  cluster float
)

--- En este momento se hace el BULK --

SELECT TOP 100002 *
FROM (
    SELECT
      city AS Ciudad,
      count(*) AS NumTiendas
    FROM tmp stores
    WHERE state='Pichincha'
    GROUP BY city
  ) a

```

De este modo es posible utiliza **Crono SQL** para trabajar sobre CSV de unos pocos millones de registros sin necesidad de utilizar herramientas adicionales. 
