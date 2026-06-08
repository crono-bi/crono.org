---
title: "crono.csv"
---

`crono.csv` es una pseudovista con parámetros que permite leer un archivo CSV.

Admite los siguientes parámetros:

- **FileName**: Nombre del archivo con el CSV. Puede ser una URL o una ubicación de Github. Es el parámetro predeterminado.
- **Limit**: Número de líneas a leer (por defecto se lee el fichero completo).
- **Separator**: Establece el separador de columnas del fichero. Si no se indica, Crono intenta identificar el separador adecuado en función del contenido del archivo.
- **WithColumnNames**: Indica si la primera línea del archivo contiene el nombre de las columnas (por defecto, `TRUE`).
- **IndexColumnName**: Si se establece, se añade una columna con un valor autonumérico.
- **ParentIndexColumnName**
- **Data**: En lugar del `FileName` se puede establecer el contenido del CSV como un literal de texto.

El compilador de **Crono SQL** analiza el contenido del archivo para determinar correctamente el tipo de dato de cada columna.

## Ejemplos

Lectura de un CSV remoto:

```crono-sql
SELECT *
FROM crono.csv(
    FileName='https://github.com/crono-bi/crono.org/blob/master/src/.vuepress/public/stores.csv',
    Separator=','
)
```

El parámetro `Separator` es opcional y `FileName` es la propiedad predeterminada, por lo que la consulta anterior es equivalente a:

```crono-sql
SELECT *
FROM crono.csv('https://github.com/crono-bi/crono.org/blob/master/src/.vuepress/public/stores.csv')
```

Como en cualquier otra vista, es compatible con el resto de elementos del lenguaje **Crono SQL**. Es posible filtrar, agrupar o unir con otras tablas:

```crono-sql
SELECT city Ciudad, count(*) NumTiendas
FROM crono.csv('https://github.com/crono-bi/crono.org/blob/master/src/.vuepress/public/stores.csv')
WHERE state = 'Pichincha'
```

También es posible ejecutar una consulta sobre un literal CSV con el parámetro `Data`:

```crono-sql
SELECT *
FROM crono.csv(
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

## Materialización

`crono.csv` genera SQL con múltiples `SELECT` unidas mediante `UNION ALL`. Este comportamiento no supone ningún problema en ficheros con unos pocos miles de líneas, pero es ineficiente en ficheros muy grandes.

En estos casos, es posible materializar el CSV en una tabla temporal antes de ejecutar la consulta, usando `MATERIALIZE INTO`:

```crono-sql
SELECT city Ciudad, count(*) NumTiendas
FROM crono.csv('https://github.com/crono-bi/crono.org/blob/master/src/.vuepress/public/stores.csv') MATERIALIZE INTO tmp stores
WHERE state = 'Pichincha'
```

De este modo es posible trabajar sobre CSV de varios millones de registros sin necesidad de herramientas adicionales.
