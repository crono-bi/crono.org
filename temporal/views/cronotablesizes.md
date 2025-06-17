
# Crono$TableSizes

Devuelve información sobre el temaño ocupado por las tablas de la base de datos actual.

La psuedovista tiene estas colunnas:


- **object_id**: Identificador de la tabla
- **DatabaseName**: Nombre de la base de datos
- **SchemaName**: Esquema de la tabla
- **TableName**: Nombre de la tabla
- **RowCount**: Número de filas de la tabla
- **DiskSpaceKB**: Espacio ocupado en disco por la tabla
- **DataSpaceKB**: Espacio ocupado por los datos de la tabla
- **IndexSpaceKB**: Espacio ocupado por los índices de la tabla
- **UnusedSpaceKB**: Espacio reservado en disco, pero no utilizado por datos o índices


```
SELECT *
FROM Crono$TableSizes
```


La consulta SQL que se genera es:


```
SELECT *
FROM
  (SELECT
     p.object_id AS object_id,
     db_name(db_id()) AS DatabaseName,
     OBJECT_SCHEMA_NAME(p.object_id,db_id()) AS SchemaName,
     object_name(p.object_id,db_id()) AS TableName,
     sum(CASE WHEN p.index_id<2 THEN p.row_count END) AS [RowCount],
     8*SUM(p.reserved_page_count) AS DiskSpaceKB,
     8*sum(CASE WHEN p.index_id<2 THEN p.used_page_count END) AS DataSpaceKB,
     8*sum(CASE WHEN p.index_id>=2 THEN p.used_page_count END) AS IndexSpaceKB,
     8*sum(CASE WHEN coalesce(p.reserved_page_count,p.used_page_count) IS NOT NULL THEN coalesce(p.reserved_page_count,0)-coalesce(p.used_page_count,0) END) AS UnusedSpaceKB
   FROM sys.dm_db_partition_stats p
   GROUP BY
     p.object_id,
     OBJECT_SCHEMA_NAME(p.object_id,db_id()),
     object_name(p.object_id,db_id())) [Crono$TableSizes]
```