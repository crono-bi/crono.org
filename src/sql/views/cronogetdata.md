
# Crono$GetData

La pseudovista `Crono$GetData` permite ejecutar una consulta en una base de datos distinta de la actual. 

La presudovista tiene estas propiedades:

- **Connection**: Nombre de la conexión remota (definido en la venta "Orígenes de datos" de las propiedades del proyecto **Crono ETL**)
- **Query**: Consulta **Crono SQL** a ejecutar.


Si no se establece `Connection` se usa la conexión actual.

**Sintaxis:**

```
Crono$GetData(
    [Connection]='nombre de la conexión',
    [Query]=(SELECT ...)
)
```

## Ejemplo


Es posible usar el resto de funcionalidades de **Crono SQL** para operar con el resultado o unirno con tablas "locales".

```
SELECT 
    Tiendas.CodTienda,
    Tiendas.NombreTienda,
    remoto.Manager Responsable
FROM dbo.TIENDAS
LEFT JOIN Crono$GetData(
    [Connection]='PostgeDB',
    [Query]=(SELECT StoreCode,Manager FROM Stores)
) remoto USING (CodTienda StoreCode)
```


## Comentarios

- La pseudovista `Crono$GetData` construye una sentencia que une mediante `UNION ALL` todos los registros obtenidos
- Este no es el mejor modo de traerse datos remotos, especialmente si el resultado tiene muchos registros.
- La vista `Crono$GetSchema` permite obtener la estructura del resultado sin obtener los datos

