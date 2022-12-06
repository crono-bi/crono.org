---
title: Sentencia UPDATE
position: 3
sidebarDepth: 2
---

# Sentencia UPDATE

**Crono SQL** soporta la sintaxis estándar de la sentencia **UPDATE**:

<view-sql-code fileName="Update1"/>

Sin embargo, este tipo de sentencia es fundamentalmente inútil en un proyecto ETL/DWH. Los datos que queremos actualizar habitualmente no están ni se pueden calcular a partir de la tabla de origen. Por ello, cada fabricante de base de datos ha resuelto esta limitación de distintas maneras. [Por ejemplo](http://stackoverflow.com/questions/2446764/update-statement-with-inner-join-on-oracle):

<view-sql-code fileName="Update2"/>

**Crono SQL** soporta este tipo de sintaxis ISO, pero desaconseja claramente su uso.

En su lugar, el lenguaje **Crono SQL** propone una nueva sintaxis de **UPDATE** para actualizar una tabla en función del resultado de una consulta. Es una sintaxis similar a la del **INSERT** e igual al resto de instrucciones DML de **Crono SQL**. El codigo SQL generado corresponde a un **MERGE**.
 
<view-sql-code fileName="Update3"/>

De esta manera, seria trivial desnormalizar la información de productos en una única sentencia: 

<view-sql-code fileName="Update4"/>

La anterior consulta actualiza los registros de *DimProducts* que hayan cambiado (y solo los que hayan cambiado). El **caracter #** sirve para indicar la clave de actualización, y suele coincidir con la "business key" de la consulta de origen.

Si se quieren actualizar todos los registros (hayan cambiado o no), se puede utilizar la sentencia **UPDATE ALL**, aunque raramente aportará ningún beneficio (¡Al contrario... penalizará el rendimiento por actualizar registros que no lo necesitan!).

<view-sql-code fileName="Update5"/>

Se puede utilizar la opción **PARTITION** para actualizar solo una parte de la tabla:

<view-sql-code fileName="Update6"/>

Aunque, evidentemente, en un escenario ETL/DWH es más habitual actualizar múltiples campos. La siguiente sentencia actualiza la información de las *Bikes* de **AdventureWorks**:

<view-sql-code fileName="Update7"/>

También se podrían actualizar los datos de una tabla a partir de sus propios datos. La siguiente sentencia es equivalente al primer **UPDATE** de este apartado:

<view-sql-code fileName="Update8"/>