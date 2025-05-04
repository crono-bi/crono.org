
# Crono$ExcelRange

La pseudo vista `Crono$ExcelRange` lee un rango (o varios) de una hoja de Excel.

- **Location**: Ubicación del libro Excel. Puede ser una ruta local, una URL de internet o la dirección de una ubicación en Github.
- **WorksheetName**: Nombre de la hoja de Excel.
- **Range**: Nombre del rango de la hoja a leer. Puede ser una rango con nombre o sus coordenadas.  
- **ColumnNames**: Nombre de las columnas. Si no se especifica se toman los propios nombres de la tabla de Excel.
- **RowCode**: Código opcional que se añadirá en cada registro del resultado. 
- **Data**: Sentencia permite establecer valores variables en las propiedades de esta accíon. Esta propiedad permite leer múltiples rangos a la vez y obtener un único resultado.


# Ejemplos

El libro Excel *sample.xlsx* contiene las ventas de 4 locales a lo largo de un año. Contiene 12 hojas (una para cada mes). Cada mes tiene una tabla con una columna para cada local y las ventas día a día.

Los datos de Enero se pueden leer con esta sentencia:

```
SELECT *
from Crono$ExcelRange(
	Location='https://github.com/crono-bi/crono.org/tree/master/src/.vuepress/public/sample.xlsx',
	WorksheetName='Enero',
	[Range]='A:E',
	RowCode='1'
)
```

En el ejemplo anterior, se ha utilizado la propiedad `RowCode` para identificar al número de mes de cada registro.

La **propiedad Data** permite leer las 12 tablas del libro Excel en una sola sentencia. Para ello, se ha de construir un sentencia con 12 filas correspondientes al nombre de las 12 hojas. En ese ejemplo, se utiliza la función `Crono$Dates` para obtener el nombre de las hojas a cargar.

```
select 
	MonthNumber RowCode varchar(2),
	Month	WorksheetName
from Crono$Dates
where year=2024 and day=1
order by MonthNumber
```

El resultado de esta consulta es:

|RowCode |WorksheetName |
|--------|--------------|
|1       |Enero         |
|2       |Febrero       |
|3       |Marzo         |
|4       |Abril         |
|5       |Mayo          |
|6       |Junio         |
|7       |Julio         |
|8       |Agosto        |
|9       |Septiembre    |
|10      |Octubre       |
|11      |Noviembre     |
|12      |Diciembre     |

El nombre de las columnas debe coincidir con el nombre de las propiedades de `Crono$ExcelRange` que se substituirán durante la ejecución.

De este modo, utilizando las **propiedad Data**, se pueden leer todas las ventas de todos los meses en una única sentencia:



```
SELECT *
from Crono$ExcelRange(
	Location='https://github.com/crono-bi/crono.org/tree/master/src/.vuepress/public/sample.xlsx',
	[Range]='A:E',
	Data=(
		select 
			MonthNumber RowCode varchar(2),
			Month	WorksheetName
		from Crono$Dates
		where year=2024 and day=1
		order by MonthNumber	
	)
)
```

Como cualquier otra pseudovista, `Crono$ExcelRange` se puede combinar con cualquier otro elemento del lenguaje **Crono SQL**. La siguiente sentencia utiza `CREATE OR REPLACE TABLE` para copiar los datos del Excel en una tabla `stg.Ventas`.


```
CREATE OR REPLACE TABLE stg.Ventas
SELECT 
	date(cast(2024*10000+int(RowCode)*100+Dia as varchar(8))) Fecha,
	[Local A] LocalA,
	[Local B] LocalB,
	[Local C] LocalC,
	[Local D] LocalD,
from Crono$ExcelRange(
	Location='https://github.com/crono-bi/crono.org/tree/master/src/.vuepress/public/sample.xlsx',
	[Range]='A:E',
	Data=(
		select 
			MonthNumber RowCode varchar(2),
			Month	WorksheetName
		from Crono$Dates
		where year=2024 and day=1
		order by MonthNumber	
	)
)
```












