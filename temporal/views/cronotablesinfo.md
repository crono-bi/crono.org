
# Crono$TablesInfo

Devuelve información sobre las tablas de la base de datos

La psuedovista tiene estas colunnas:

- **DatabaseName**: Nombre de la base de datos
- **SchemaName**: Nombre del esquema
- **TableName**: Nombre de la tabla
- **PrimaryKeyConstraintName**: Nombre de la *constraint* correspondiente a la clave primaria de la tabla
- **RowCount**: Número de filas
- **DiskSpaceKB**: Espacio ocupado en disco por la tabla
- **CreationDate**: Fecha de creación de la tabla
- **ModifiedDate**: Fecha de modificación de la tabla
- **SchemaProcedureName**:  Esquema del procedimiento que carga esta tabla
- **ProcedureName**: Nombre del procedimiento que carga esta tabla (si existe)
- **LoadType**: Tipo de carga 
- **LastExecutedDate**: Última fecha de ejecución de la carga de la tabla 
- **ProcedureLastAltered**: Fecha de modificación del procedimiento de carga
- **BulkDate**: Fecha del `BULK` de carga de esta tabla (si existe)


La vista `Crono$TablesInfo` amplia la información ofrecida por `Crono$Tables`

## Ejemplo

```
SELECT *
FROM Crono$TablesInfo
```

La consulta generada es:

```
SELECT *
FROM
  (SELECT
     tabs.DatabaseName AS DatabaseName,
     tabs.SchemaName AS SchemaName,
     tabs.TableName AS TableName,
     tabs.PrimaryKeyConstraintName AS PrimaryKeyConstraintName,
     sizes.[RowCount] AS [RowCount],
     sizes.DiskSpaceKB AS DiskSpaceKB,
     [info].CreationDate AS CreationDate,
     [info].ModifiedDate AS ModifiedDate,
     procs.SchemaName AS SchemaProcedureName,
     procs.ProcedureName AS ProcedureName,
     procs.LoadType AS LoadType,
     procs.LastExecutedDate AS LastExecutedDate,
     procs.LastAltered AS ProcedureLastAltered,
     bulks.BulkDate AS BulkDate
   FROM (
          SELECT *
          FROM
            (SELECT
               t.TABLE_CATALOG AS DatabaseName,
               t.TABLE_SCHEMA AS SchemaName,
               t.TABLE_NAME AS TableName,
               t.TABLE_TYPE AS TableType,
               pks.CONSTRAINT_NAME AS PrimaryKeyConstraintName
             FROM INFORMATION_SCHEMA.[TABLES] t
             LEFT JOIN (SELECT * FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE CONSTRAINT_TYPE='PRIMARY KEY') pks ON (t.TABLE_CATALOG=pks.CONSTRAINT_CATALOG AND t.TABLE_SCHEMA=pks.TABLE_SCHEMA AND t.TABLE_NAME=pks.TABLE_NAME)) [Crono$Tables]
          WHERE TableType='BASE TABLE'
        ) tabs
   LEFT JOIN (SELECT
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
                object_name(p.object_id,db_id())) sizes ON (tabs.DatabaseName=sizes.DatabaseName AND tabs.SchemaName=sizes.SchemaName AND tabs.TableName=sizes.TableName)
   LEFT JOIN (SELECT
                DB_NAME(DB_ID()) AS DatabaseName,
                schemas.name AS SchemaName,
                [tables].name AS TableName,
                create_date AS CreationDate,
                modify_Date AS ModifiedDate
              FROM sys.[tables]
              INNER JOIN sys.schemas ON ([tables].schema_id=schemas.schema_id)) [info] ON tabs.DatabaseName=[info].DatabaseName AND tabs.SchemaName=[info].SchemaName AND tabs.TableName=[info].TableName
   LEFT JOIN (SELECT *
              FROM (
                  SELECT
                    DataBaseName,
                    SchemaTableName AS SchemaName,
                    TableName,
                    ProcedureName,
                    LastAltered,
                    LoadType,
                    LastExecutedDate,
                    count(*) OVER (PARTITION BY DataBaseName,SchemaTableName,TableName) AS Dups
                  FROM
                    (SELECT
                       r.DataBaseName AS DataBaseName,
                       r.SchemaName AS SchemaName,
                       r.RoutineName AS ProcedureName,
                       r.RoutineType AS ProcedureType,
                       r.LastAltered AS LastAltered,
                       cast(ep_hash.ExtendedPropertyValue AS varchar(50)) AS Hash,
                       cast(ep_load.ExtendedPropertyValue AS varchar(500)) AS LoadType,
                       cast(eh_schema.ExtendedPropertyValue AS varchar(50)) AS SchemaTableName,
                       cast(eh_table.ExtendedPropertyValue AS varchar(50)) AS TableName,
                       cast(ep_version.ExtendedPropertyValue AS varchar(500)) AS CronoVersion,
                       cast(ep_user.ExtendedPropertyValue AS varchar(500)) AS UserName,
                       cast(ep_executed.ExtendedPropertyValue AS datetime) AS LastExecutedDate
                     FROM (SELECT
                             ROUTINE_CATALOG AS DatabaseName,
                             ROUTINE_SCHEMA AS SchemaName,
                             ROUTINE_NAME AS RoutineName,
                             ROUTINE_TYPE AS RoutineType,
                             ROUTINE_DEFINITION AS RoutineDefinition,
                             LAST_ALTERED AS LastAltered
                           FROM INFORMATION_SCHEMA.[ROUTINES]) r
                     LEFT JOIN (
                                 SELECT *
                                 FROM
                                   (SELECT
                                      schemas.name AS SchemaName,
                                      sp.name AS ProcedureName,
                                      p.name AS ExtendedPropertyName,
                                      CAST(p.[value] AS sql_variant) AS ExtendedPropertyValue
                                    FROM (SELECT * FROM sys.all_objects WHERE type IN ('P','RF','PC')) sp
                                    INNER JOIN sys.schemas ON (sp.schema_id=schemas.schema_id)
                                    INNER JOIN (SELECT * FROM sys.extended_properties WHERE minor_id=0 AND class=1) p ON (sp.object_id=p.major_id)) [Crono$ProcedureExtendedProperties]
                                 WHERE ExtendedPropertyName='Hash'
                               ) ep_hash ON (r.SchemaName=ep_hash.SchemaName AND r.RoutineName=ep_hash.ProcedureName)
                     LEFT JOIN (
                                 SELECT *
                                 FROM
                                   (SELECT
                                      schemas.name AS SchemaName,
                                      sp.name AS ProcedureName,
                                      p.name AS ExtendedPropertyName,
                                      CAST(p.[value] AS sql_variant) AS ExtendedPropertyValue
                                    FROM (SELECT * FROM sys.all_objects WHERE type IN ('P','RF','PC')) sp
                                    INNER JOIN sys.schemas ON (sp.schema_id=schemas.schema_id)
                                    INNER JOIN (SELECT * FROM sys.extended_properties WHERE minor_id=0 AND class=1) p ON (sp.object_id=p.major_id)) [Crono$ProcedureExtendedProperties]
                                 WHERE ExtendedPropertyName='SchemaTableName'
                               ) eh_schema ON (r.SchemaName=eh_schema.SchemaName AND r.RoutineName=eh_schema.ProcedureName)
                     LEFT JOIN (
                                 SELECT *
                                 FROM
                                   (SELECT
                                      schemas.name AS SchemaName,
                                      sp.name AS ProcedureName,
                                      p.name AS ExtendedPropertyName,
                                      CAST(p.[value] AS sql_variant) AS ExtendedPropertyValue
                                    FROM (SELECT * FROM sys.all_objects WHERE type IN ('P','RF','PC')) sp
                                    INNER JOIN sys.schemas ON (sp.schema_id=schemas.schema_id)
                                    INNER JOIN (SELECT * FROM sys.extended_properties WHERE minor_id=0 AND class=1) p ON (sp.object_id=p.major_id)) [Crono$ProcedureExtendedProperties]
                                 WHERE ExtendedPropertyName='TableName'
                               ) eh_table ON (r.SchemaName=eh_table.SchemaName AND r.RoutineName=eh_table.ProcedureName)
                     LEFT JOIN (
                                 SELECT *
                                 FROM
                                   (SELECT
                                      schemas.name AS SchemaName,
                                      sp.name AS ProcedureName,
                                      p.name AS ExtendedPropertyName,
                                      CAST(p.[value] AS sql_variant) AS ExtendedPropertyValue
                                    FROM (SELECT * FROM sys.all_objects WHERE type IN ('P','RF','PC')) sp
                                    INNER JOIN sys.schemas ON (sp.schema_id=schemas.schema_id)
                                    INNER JOIN (SELECT * FROM sys.extended_properties WHERE minor_id=0 AND class=1) p ON (sp.object_id=p.major_id)) [Crono$ProcedureExtendedProperties]
                                 WHERE ExtendedPropertyName='LoadType'
                               ) ep_load ON (r.SchemaName=ep_load.SchemaName AND r.RoutineName=ep_load.ProcedureName)
                     LEFT JOIN (
                                 SELECT *
                                 FROM
                                   (SELECT
                                      schemas.name AS SchemaName,
                                      sp.name AS ProcedureName,
                                      p.name AS ExtendedPropertyName,
                                      CAST(p.[value] AS sql_variant) AS ExtendedPropertyValue
                                    FROM (SELECT * FROM sys.all_objects WHERE type IN ('P','RF','PC')) sp
                                    INNER JOIN sys.schemas ON (sp.schema_id=schemas.schema_id)
                                    INNER JOIN (SELECT * FROM sys.extended_properties WHERE minor_id=0 AND class=1) p ON (sp.object_id=p.major_id)) [Crono$ProcedureExtendedProperties]
                                 WHERE ExtendedPropertyName='FileName'
                               ) ep_file ON (r.SchemaName=ep_file.SchemaName AND r.RoutineName=ep_file.ProcedureName)
                     LEFT JOIN (
                                 SELECT *
                                 FROM
                                   (SELECT
                                      schemas.name AS SchemaName,
                                      sp.name AS ProcedureName,
                                      p.name AS ExtendedPropertyName,
                                      CAST(p.[value] AS sql_variant) AS ExtendedPropertyValue
                                    FROM (SELECT * FROM sys.all_objects WHERE type IN ('P','RF','PC')) sp
                                    INNER JOIN sys.schemas ON (sp.schema_id=schemas.schema_id)
                                    INNER JOIN (SELECT * FROM sys.extended_properties WHERE minor_id=0 AND class=1) p ON (sp.object_id=p.major_id)) [Crono$ProcedureExtendedProperties]
                                 WHERE ExtendedPropertyName='CronoVersion'
                               ) ep_version ON (r.SchemaName=ep_version.SchemaName AND r.RoutineName=ep_version.ProcedureName)
                     LEFT JOIN (
                                 SELECT *
                                 FROM
                                   (SELECT
                                      schemas.name AS SchemaName,
                                      sp.name AS ProcedureName,
                                      p.name AS ExtendedPropertyName,
                                      CAST(p.[value] AS sql_variant) AS ExtendedPropertyValue
                                    FROM (SELECT * FROM sys.all_objects WHERE type IN ('P','RF','PC')) sp
                                    INNER JOIN sys.schemas ON (sp.schema_id=schemas.schema_id)
                                    INNER JOIN (SELECT * FROM sys.extended_properties WHERE minor_id=0 AND class=1) p ON (sp.object_id=p.major_id)) [Crono$ProcedureExtendedProperties]
                                 WHERE ExtendedPropertyName='UserName'
                               ) ep_user ON (r.SchemaName=ep_user.SchemaName AND r.RoutineName=ep_user.ProcedureName)
                     LEFT JOIN (
                                 SELECT *
                                 FROM
                                   (SELECT
                                      schemas.name AS SchemaName,
                                      sp.name AS ProcedureName,
                                      p.name AS ExtendedPropertyName,
                                      CAST(p.[value] AS sql_variant) AS ExtendedPropertyValue
                                    FROM (SELECT * FROM sys.all_objects WHERE type IN ('P','RF','PC')) sp
                                    INNER JOIN sys.schemas ON (sp.schema_id=schemas.schema_id)
                                    INNER JOIN (SELECT * FROM sys.extended_properties WHERE minor_id=0 AND class=1) p ON (sp.object_id=p.major_id)) [Crono$ProcedureExtendedProperties]
                                 WHERE ExtendedPropertyName='LastExecutedDate'
                               ) ep_executed ON (r.SchemaName=ep_executed.SchemaName AND r.RoutineName=ep_executed.ProcedureName)) [Crono$Procedures]
                  WHERE TableName IS NOT NULL
                ) a
              WHERE dups=1) procs ON tabs.DatabaseName=procs.DatabaseName AND tabs.SchemaName=procs.SchemaName AND tabs.TableName=procs.TableName
   LEFT JOIN (SELECT
                db_name(DB_ID()) AS DatabaseName,
                SchemaName,
                TableName,
                CAST(ExtendedPropertyValue AS datetime) AS BulkDate
              FROM
                (
                  SELECT *
                  FROM
                    (SELECT
                       schemas.name AS SchemaName,
                       tbl.name AS TableName,
                       p.name AS ExtendedPropertyName,
                       CAST(p.[value] AS sql_variant) AS ExtendedPropertyValue
                     FROM sys.[tables] tbl
                     INNER JOIN sys.schemas ON (tbl.schema_id=schemas.schema_id)
                     INNER JOIN (SELECT * FROM sys.extended_properties WHERE minor_id=0 AND class=1) p ON (tbl.object_id=p.major_id)) [crono$tableextendedproperties]
                  WHERE ExtendedPropertyName='BulkDate'
                ) [crono$tableextendedproperties]) bulks ON tabs.DatabaseName=bulks.DatabaseName AND tabs.SchemaName=bulks.SchemaName AND tabs.TableName=bulks.TableName) [Crono$TablesInfo]
```