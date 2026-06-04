---
title: "crono.ExcelRange"
---

`crono.ExcelRange` lee un rango (o varios) de una hoja de Excel.

- **Location**: Ubicación del libro Excel. Puede ser una ruta local, una URL de internet o la dirección de una ubicación en Github.
- **WorksheetName**: Nombre de la hoja de Excel.
- **Range**: Nombre del rango a leer. Puede ser un rango con nombre o sus coordenadas.
- **ColumnNames**: Nombre de las columnas. Si no se especifica se toman los propios nombres de la tabla de Excel.
- **RowCode**: Código opcional que se añadirá en cada registro del resultado.
- **Data**: Permite establecer valores variables en las propiedades de esta acción, lo que posibilita leer múltiples rangos a la vez y obtener un único resultado.

## Ejemplos

El libro Excel *sample.xlsx* contiene las ventas de 4 locales a lo largo de un año, con 12 hojas (una por mes). Los datos de enero se pueden leer así:

```crono-sql
SELECT *
FROM crono.ExcelRange(
	Location='https://github.com/crono-bi/crono.org/tree/master/src/.vuepress/public/sample.xlsx',
	WorksheetName='Enero',
	Range='A:E',
	RowCode='1'
)
```

La propiedad `Data` permite leer las 12 hojas en una sola sentencia. Para ello se construye una consulta con el nombre de cada hoja — en este ejemplo, usando `crono.dates` para obtenerlos:

```crono-sql
SELECT
	MonthNumber RowCode varchar(2),
	month	WorksheetName
FROM crono.dates
WHERE year = 2024 AND day = 1
ORDER BY MonthNumber
```

El nombre de las columnas del resultado debe coincidir con las propiedades de `crono.ExcelRange` que se sustituirán durante la ejecución. De este modo se pueden leer todas las ventas del año en una única sentencia:

```crono-sql
SELECT *
FROM crono.ExcelRange(
	Location='https://github.com/crono-bi/crono.org/tree/master/src/.vuepress/public/sample.xlsx',
	Range='A:E',
	Data=(
		SELECT
			MonthNumber RowCode varchar(2),
			month	WorksheetName
		FROM crono.dates
		WHERE year = 2024 AND day = 1
		ORDER BY MonthNumber
	)
)
```

Como cualquier otra pseudovista, `crono.ExcelRange` se puede combinar con el resto del lenguaje **Crono SQL**. La siguiente sentencia copia los datos del Excel en la tabla `stg.Ventas`:

```crono-sql
CREATE OR REPLACE TABLE stg.Ventas
SELECT
	date(cast(2024*10000+int(RowCode)*100+Dia AS varchar(8))) Fecha,
	[Local A] LocalA,
	[Local B] LocalB,
	[Local C] LocalC,
	[Local D] LocalD
FROM crono.ExcelRange(
	Location='https://github.com/crono-bi/crono.org/tree/master/src/.vuepress/public/sample.xlsx',
	Range='A:E',
	Data=(
		SELECT
			MonthNumber RowCode varchar(2),
			month	WorksheetName
		FROM crono.dates
		WHERE year = 2024 AND day = 1
		ORDER BY MonthNumber
	)
)
```
