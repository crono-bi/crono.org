---
title: Sentencia MERGE
position: 4
---

# Sentencia MERGE

El **lenguaje Crono SQL** admite la sintaxis SQL estándar de la sentencia **MERGE**:

<view-sql-code fileName="Merge1"/>

La sentencia **MERGE**, en función de una serie de condiciones definidas, ejecutará un **UPDATE** de los registros que hayan cambiado y un **INSERT** de los registros de la consulta origen que no existan en la tabla destino. Por este motivo se le conoce como **UPSERT** (**UPDATE**+**INSERT**).

Debería ser la "sentencia estrella" de cualquier proyecto ETL/DWH, porque en estos proyectos lo que en definitiva se necesita es replicar los datos del origen en la tabla destino (¡exactamente lo que promete hacer el **MERGE**!). Lamentablemente, la sintaxis ISO es compleja, está llena de repeticiones, y es muy difícil escribir correctamente. Por este motivo, muchos desarrolladores la desconocen, o no la usan, y buscan métodos alternativos para realizar el trabajo (con mucho peor rendimiento, habitualmente).

**Crono SQL** propone una nueva sintaxis del **MERGE** para solucionar estos problemas. Es una sintaxis idéntica a la del **INSERT** y el **UPDATE** anteriormente descritos.

<view-sql-code fileName="Merge2"/>

Esta instrucción ejecutará un **UPSERT** (**UPDATE**+**INSERT**). Sin embargo, en ocasiones se necesita ejecutar también un **DELETE** para eliminar los registros que hayan desaparecido de la consulta original. Esta funcionalidad la podemos conseguir mediante la opción **WHEN MISSING THEN DELETE**

<view-sql-code fileName="Merge3"/>

En ocasiones, para tratar las bajas, lo que se prefiere es realizar una baja lógica del registro. Es decir, marcar el registro como eliminado pero sin eliminarlo. Para cubrir este requerimiento tenemos la opción **WHEN MISSING THEN SET** 


De hecho, esta instrucción es exactamente lo que se conoce como una carga *"Slow Changing Dimension Type 1"*, tan habitual en proyectos ETL/DWH.  


Se puede utilizar la opción **PARTITION** para realizar un **MERGE** sobre una parte de la tabla. La siguiente consulta actualiza únicamente la información de las *Bikes*:

<view-sql-code fileName="Merge5"/>

En ocasiones, el optimizador de consultas del motor de base de datos realiza un mejor plan de ejecución si la consulta está materializada. En estos casos, podemos emplear la opción **MATERIALIZE**.

<view-sql-code fileName="Merge6"/>

Por supuesto, también podemos utilizar la opción **MATERIALIZE** en las tablas o subconsultas interiores, y podemos utilizar todas las características de la sentencia **SELECT** (**COMBINE**, **CHECK SNOWFLAKE**, **FILTER**, etc.).

<view-sql-code fileName="Merge7"/>