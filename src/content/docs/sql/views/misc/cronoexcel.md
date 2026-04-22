---
title: "Crono$Excel"
---


`Crono$Excel` lee el contenido de una tabla de un libro de Excel.

Tiene 2 propiedades:

- **Filename**: Ubicación del libro Excel. Puede ser una ruta local, una URL de internet o la dirección de una ubicación en Github.
- **TableName**: Debe ser el nombre de una **tabla** de Excel

## Ejemplo

La siguiente sentencia lee la tabla `TablaEjemplo` del fichero `Sample2.xlsx':

```
select *
from crono$Excel(
	Filename='https://github.com/crono-bi/crono.org/tree/master/src/.vuepress/public/Sample2.xlsx', 
	TableName='TablaEjemplo'
)
```



Como cualquier otra pseudovista, `Crono$Excel` se puede combinar con cualquier otro elemento del lenguaje **Crono SQL**. La siguiente sentencia utiliza `CREATE OR REPLACE TABLE` para copiar los datos del Excel en una tabla `stg.Ventas`

```
CREATE OR REPLACE TABLE stg.Ventas
select *
from crono$Excel(
	Filename='https://github.com/crono-bi/crono.org/tree/master/src/.vuepress/public/Sample2.xlsx', 
	TableName='TablaEjemplo'
)
```


## Comentarios

- Siempre que sea posible se recomienda usar la función `Crono$ExcelRange`, que es más flexible gracias a la **propiedad Data**.
- La función `Crono$Excel` lee una única tabla de Excel, mientras que `Crono$ExcelRange` puede leer múltiples rangos al mismo tiempo.