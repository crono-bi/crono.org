﻿---
SidebarGroup: "index-system-functions"
Autogenerated: true
---

# openrowset

Incluye toda la información de conexión necesaria para acceder a datos remotos desde un origen de datos OLE DB. Este método es una alternativa al acceso a tablas en un servidor vinculado y es un método ad hoc único para conectarse y acceder a datos remotos mediante OLE DB. Para referencias más frecuentes a orígenes de datos OLE DB, utilice servidores vinculados en su lugar. Para obtener más información, consulte [Servidores vinculados &#40;Motor de base de datos&#41;](../../relational-databases/linked-servers/linked-servers-database-engine.md). Se puede hacer referencia a la función `OPENROWSET` en la cláusula FROM de una consulta como si fuera el nombre de una tabla. También se puede hacer referencia a la función `OPENROWSET` como la tabla de destino de una instrucción `INSERT`, `UPDATE` o `DELETE`, sujeto a las capacidades del proveedor OLE DB. Aunque la consulta puede devolver varios conjuntos de resultados, `OPENROWSET` solo devuelve el primero.

## Comentarios 

`openrowset` es una función de SQL estándar. Consulte la documentación completa de la función [`openrowset`](https://learn.microsoft.com/es-es/sql/t-sql/functions/openrowset-transact-sql) para mayor información.
