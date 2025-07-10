---
title: Sentencia DELETE
Position: 5
---


# Sentencia DELETE

**Crono SQL** soporta la sintaxis estándar de la sentencia **DELETE** de SQL:

<SqlCodeBlock jsonPath="/json_sql/sql-F4A228.json" />


Si intervienen otras tablas, se puede definir el predicado utilizando las expresiones **IN()** o **EXISTS ()**. La siguiente sentencia elimina las líneas de venta de un cliente en concreto:

<SqlCodeBlock jsonPath="/json_sql/sql-687190.json" />


De modo similar, la siguiente sentencia elimina las líneas de venta de otro cliente:

<SqlCodeBlock jsonPath="/json_sql/sql-69D30A.json" />


**Crono SQL** propone otra sintaxis de la sentencia **DELETE** (idéntica a la sintaxis de **INSERT**, **UPDATE**, y **MERGE**). La idea subyacente es que se ha  de construir el **SELECT** de los datos que se quieren borrar. Solo el **SELECT**. Y **Crono SQL** eliminará precisamente esos registros:

<SqlCodeBlock jsonPath="/json_sql/sql-3B9AD9.json" />


De hecho, no es necesario que la consulta tenga ninguna referencia a la tabla de la que se quieren eliminar registros. El ejemplo anterior se puede simplificar de la siguiente manera:

<SqlCodeBlock jsonPath="/json_sql/sql-5AA943.json" />


En todos los casos, lo que marca los registros que se deben eliminar es la *"clave de eliminación"* (marcada con el **carácter #**).

La consulta del **DELETE** también puede utilizar todas las características del **SELECT** de **Crono SQL**. La siguiente sentencia elimina los clientes sin ninguna venta:

<SqlCodeBlock jsonPath="/json_sql/sql-1C328A.json" />
