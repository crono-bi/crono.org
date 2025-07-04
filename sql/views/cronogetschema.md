

# Crono$GetSchema

La pseudovista `Crono$GetSchema` permite obtener la estructura del resultado de una consulta, incluso si se trata de una consulta en una base de datos distinta de la actual. 

La presudovista tiene estas propiedades:

- **Connection**: Nombre de la conexión remota (definido en la venta "Orígenes de datos" de las propiedades del proyecto **Crono ETL**)
- **Query**: Consulta **Crono SQL** a ejecutar.
- **Name**: Si no se establece la *Query*, se puede especificar el nombre de la "colección" que quiere obtenerse (TABLES/COLUMNS). 


Si no se establece `Connection` se usa la conexión actual.

**Sintaxis:**

```
Crono$GetSchema(
    [Connection]='nombre de la conexión',
    [Query]=(SELECT ...)
)
```



```
Crono$GetSchema(
    [Connection]='nombre de la conexión',
    [Name]='collectionName' -- TABLE o COLUMNS
)
```

## Ejemplo

La siguiente sentencia informará sobre las 2 columnas de esta consulta:

```
SELECT *
FROM Crono$GetSchema(
    [Connection]='PostgeDB',
    [Query]=(SELECT StoreCode,Manager FROM Stores)
) remoto
```

La siguiente consulta devuelve un listado de las tablas disponibles, según el conector ODBC. 

```
SELECT *
FROM Crono$GetSchema(Name='TABLES')
```


La siguiente consulta devuelve un listado de los campos disponibles en todas tablas existentes, según el conector ODBC. 

```
SELECT *
FROM Crono$GetSchema(Name='COLUMNS')
```

Lo mismo se puede hacer de una base de datos distinta de la actual.


```
SELECT *
FROM Crono$GetSchema([Connection]='PostgeDB',Name='COLUMNS')
```

Si no se establece ninguna propiedad, se obtiene el listado de las tablas disponibles.

```
SELECT *
FROM Crono$GetSchema()
```


## Comentarios

- Esta función llama al proveedor ODBC. 
- Además de *TABLES* y *COLUMNS* algunos proveedores ODBC pueden disponer de otras "colecciones"
- La vista `Crono$GetData` permite obtener el resultado de una consulta ejecutada en una conexión remota

