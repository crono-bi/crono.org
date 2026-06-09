---
title: "crono.TablesInfo"
---


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


La vista `crono.TablesInfo` amplia la información ofrecida por `crono.tables`

## Ejemplo

```crono-sql
SELECT *
FROM crono.TablesInfo
```
