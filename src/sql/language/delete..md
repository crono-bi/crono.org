---
title: Sentencia DELETE
position: 5
sidebarDepth: 2
---

# Sentencia DELETE

**Crono SQL** soporta la sintaxis estándar de la sentencia **DELETE** de SQL:

<view-sql-code fileName="Delete1"/>

Si intervienen otras tablas, se puede definir el predicado utilizando las expresiones **IN()** o **EXISTS ()**. La sigiuente sentencia elimina las líneas de venta de un cliente en concreto:

<view-sql-code fileName="Delete2"/>

De modo similar, la siguiente sentencia elimina las líneas de venta de otro cliente:

<view-sql-code fileName="Delete3"/>

**Crono SQL** propone otra sintaxis de la sentencia **DELETE** (idéntica a la sintaxis de **INSERT**, **UPDATE**, y **MERGE**). La idea subyacente es que se ha  de construir el **SELECT** de los datos que se quieren borrar. Solo el **SELECT**. Y **Crono SQL** eliminará precisamente esos registros:

<view-sql-code fileName="Delete4"/>

De hecho, no es necesario que la consulta tenga ninguna referencia a la tabla de la que se quieren eliminar registros. El ejemplo anterior se puede simplificar de la siguiente manera:

<view-sql-code fileName="Delete5"/>

En todos los casos, lo que marca los registros que se deben eliminar es la *"clave de eliminación"* (marcada con el **carácter #**).

La consulta del **DELETE** también puede utilizar todas las características del **SELECT** de **Crono SQL**. La siguiente sentencia elimina los clientes sin ninguna venta:

<view-sql-code fileName="Delete6"/>

