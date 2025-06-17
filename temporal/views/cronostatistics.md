
# Crono$Statistics

La pseudovista `Crono$Statistics` devuelve estadísticas sobre el contenido de cada uno de los campos de una consulta.

La psuedovistas tiene un único argumento:

- **Query**: Consulta que se ejecutará para obtener estadísticas del resultado.

**Sintaxis:**

```
Crono$Statistics(
    query=(SELECT...)
)
```

La vista devuelve tantos registros como columnas tenga la consulta. Sobre cada columna se informa:

- **Position**: Posición de la columna en la tabla
- **ColumnName**: Nombre de la columna 
- **DataType**: Tipo de dato de la columna
- **RowsCount**: Número de registros no nulos
- **IsUnique**: Indica si todos los valores de la columna son distintos
- **Nullable**: Indica si la columna es nulable
- **NullValues**: Indica cuantos registros nulos existen
- **NotNullValues**: Indica cuantos registros no nulos existen
- **PctNotNullValues**: Indica el porcentaje de registros no nulos existen
- **DistinctValues**: Indica cuantos vaolores distintos existen


## Ejemplo

La siugiente consulta devuelve estadísticas sobre el contenido de la tabla `Articulos`

```
select *
from Crono$Statistics(Query=(SELECT * FROM dwh.Articulos))
```

## Comentarios

- Crono ETL utiliza esta vista en su ventana de *Estadísticas*.

