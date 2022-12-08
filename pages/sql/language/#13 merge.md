---
sidebarDepth: 2
---

# Sentencias MERGE ❤️


La sentencia **MERGE** carga los datos en una **tabla destino** a partir del resultado de una **consulta de origen**.


Existen las siguientes variantes **MERGE**. Cada una de ella responde a una estrategia de carga en proyectos ETL/DWH:


| Nombre                | Descripción           |
|-----------------------|----------------------------------------------------------------------------------------------|
| **MERGE CLONE**           | Añade los registros nuevos, actualiza los existentes que hayan cambiado, y elimina los registros ausentes en el origen |
| **MERGE UPSERT** (o **MERGE**)| Añade los registros nuevos y actualiza los existentes (que hayan cambiado) |
| **MERGE ALL**             | Añade los registros nuevos y actualiza los existentes (hayan cambiado o no) |
| **MERGE UPDATE**          | Actualiza los existentes que hayan cambiado, sin añadir ninguno ni eliminar ninguno. Es igual que el **UPDATE** de **Crono SQL** |
| **MERGE SOFT DELETE**     | Añade los registros nuevos, actualiza los existentes que hayan cambiado, e informa la fecha de eliminación de los registros ausentes en el origen |
| **MERGE INCREMENTAL**     | Añade los registros nuevos, sin actualizar ni eliminar ninguno. Es igual que el **INSERT** de **Crono SQL** |
| **MERGE HISTORY**         | Añade los registros nuevos manteniendo la historia de los cambios en los campos "fecha inicio vigencia" y "fecha fin vigencia". Es una carga SCD2 |


Estas 7 estrategias, o un subconjunto de ellas, suelen ser suficientes para implementar cualquier proyecto ETL/DWH. Habitualmente, las estrategias **MERGE CLONE** y **MERGE UPSERT** se utilizan para cargar tablas de dimensión, y **MERGE CLONE** y **MERGE INCREMENTAL** se utilizan para cargar tablas de hechos. De todos modos, eso dependerá de las necesidades de cada tabla y de cada proyecto.

Todas las instrucciones **MERGE** crean la tabla de destino si es necesario, así como la clave de negocio, y los campos de auditoria. 

La sintaxis es muy sencilla. Simplemente hay que indicar la **consulta de origen** (especificando la "clave de actualización") y la **tabla de destino**. A continuación se incluyen ejemplos de uso de estas 7 estrategias.


## MERGE CLONE

La instrucción **MERGE CLONE** realiza una actualización completa de la tabla. Es decir: Añade, elimina o actualiza todos los registros de la tabla destino para que coincidan exactamente con el contenido de la consulta de origen. Convierte literalmente la tabla destino en un clon de la consulta de origen.

Se utiliza en tablas de hechos pequeñas o en aquellas tablas de dimensión en que sabemos que no se eliminan registros, o que es aceptable que se eliminen registros obsoletos. Se trata de la estrategia más común en cualquier proyecto DWH (en muchas ocasiones **MERGE CLONE** es la única instrucción necesaria).

La sintaxis es idéntica a la utilizada en la sintaxis **Crono SQL** de **UPDATE** o **INSERT**, tal y como muestra este ejemplo.

<view-sql-code fileName="MergeClone"/>

Es importante observar que el campo *ProductId* está precedido por el **carácter numeral #**. Esta marca sirve para identificar la **clave de actualización**. Habitualmente coincide con la clave de negocio (código único que identifica a cada registro).

El código generado realiza un **MERGE** e informa convenientemente los campos *FechaAlta*, *FechaBaja* y *FechaModificacion*.  


Si la tabla no existe en el momento de ejecución, la creará añadiéndole el campo *ProductSid* como una clave subrogada (un entero autonumérico **INDENTITY**). También creará un **UNIQUE CONSTRAINT** para el campo *ProductId* (que debe ser único).

Si en el futuro se modifica la consulta, añadiendo más campos a la dimensión, **Crono SQL** generará también el código necesario para crear esos nuevos campos en la tabla.

En este ejemplo, después de los **JOIN**, se ha incluido la clausula **CHECK SNOWFLAKE**. Por lo tanto, antes de realizar la carga, **Crono SQL** verificará que la consulta de origen no pierda ni duplique registros de *staging.Products*.


El código generado es óptimo y presenta un gran rendimiento, por lo que esta estrategia es adecuada también en tablas de hechos no excesivamente grandes:

<view-sql-code fileName="MergeClone2"/>

Incluso si la tabla de origen tuviese unos pocos millones de registros, la carga anterior se ejecutaría rápidamente (con el Hardware adecuado).

En cambio, si la tabla de origen tuviese varias decenas de millones de registros (o más) recomendaríamos utilizar alguna estrategia de carga incremental.




## MERGE UPSERT

La instrucción **MERGE UPSERT** es una carga de **dimensión lentamente cambiante tipo 1**. Esta estrategia de carga actualiza los registros que se han modificado desde la última carga y añade los nuevos, pero nunca elimina los registros existentes.

Se utiliza habitualmente para cargar tablas de dimensión, ya que se requiere mantener los registros antiguos para respetar la integridad (no queremos borrar un producto o un cliente que tal vez tiene ventas u otras transacciones asociadas).

<view-sql-code fileName="SCD1-1"/>

Es importante observar que el campo *ProductId* está precedido por el **carácter numeral #**. Esta marca es importante ya que sirve para identificar la **clave de actualización**. Habitualmente coincide con la clave de negocio (código único que identifica a cada registro)

El código generado realiza un **MERGE** para actualizar o insertar cada registro. También informa convenientemente los campos *FechaAlta*, *FechaBaja* y *FechaModificacion*.  

Al igual que en todas las instrucciones **MERGE** de **Crono SQL**, se creará la tabla si no existe. También se añadirán los campos, índices o restricciones que falten. 

Las estrategía **UPSERT** es la predeterminada del **MERGE**. Por este motivo, el siguiente ejemplo es exactamente equivalente a ejecutar **MERGE UPSERT**.

<view-sql-code fileName="SCD1-2"/>

## MERGE ALL

La instrucción **MERGE ALL** se comparta igual que **MERGE UPSERT**. La única diferencia es que **MERGE ALL** actualiza todos los registros (hayan cambiado o no). Esta diferencia raramente aportará ningún beneficio (¡Al contrario... penalizará el rendimiento por actualizar registros que no lo necesitan!), por lo que se prefiere usar **MERGE UPSERT**.

<view-sql-code fileName="MergeAll"/>


## MERGE UPDATE

La instrucción **MERGE UPDATE** actualiza los registros que aparecen en la consulta de origen y ya existen en la tabla de destino. No elimina ni inserta ningún registro.

<view-sql-code fileName="MergeUpdate"/>

La instrucción **MERGE UPDATE** es equivalente a la instrucción **UPDATE** de **Crono SQL**

## MERGE SOFT DELETE

La instrucción **MERGE SOFT DELETE** actualiza los registros que se han modificado desde la última carga, añade los nuevos y establece la *fecha de eliminación* de los registros eliminados en el origen. Es decir, en lugar de eliminar físicamente los registros, hace un borrado lógico.

Se utiliza habitualmente para cargar tablas de dimensión, ya que se requiere mantener los registros antiguos para respetar la integridad (no queremos borrar un producto o un cliente que tal vez tiene ventas u otras transacciones asociadas).

<view-sql-code fileName="SCD1-3"/>


## MERGE INCREMENTAL


La instrucción **MERGE INCREMENTAL** realiza una carga incremental de la tabla.

Las cargas incrementales son adecuadas para tablas de hechos con muchos millones de registros.

Frecuentemente las cargas incrementales son problemáticas:

- La mayor dificultad de las cargas incrementales es determinar los registros que se deben añadir. Es necesario identificar en origen los registros nuevos desde la última carga (mediante un *timestamp*, habitualmente). 
- Otro riesgo de las cargas incrementales es que modificaciones extraordinarias en el origen pueden no reflejarse en en DWH (no siempre los responsables del ERP puede asegurar que ningún proceso o incidencia pueda modificar algún día registros antiguos).

Por estos motivos, si el tiempo de ejecución es aceptable, es preferible utilizar **MERGE CLONE** siempre que sea posible, aunque el tiempo de ejecución sea algo mayor.


<view-sql-code fileName="INCREMENTAL-1"/>

La anterior sentencia cargará las ventas del día anterior (y solo las del día anterior). Evidentemente, esta estrategia es débil y propensa a errores. Dejará de cargar registros si algún día no se ejecuta la carga, o podría duplicarlos si se ejecutase dos veces un mismo día. También fallaría si algún proceso del ERP se retrasase varios días en insertar los datos de alguna tienda...

La siguiente estrategia resuelve parcialmente el problema: 

 <view-sql-code fileName="INCREMENTAL-2"/>

En el caso anterior se cargarían las ventas de los últimos 30 días que no se hayan cargado previamente. La marca **#** especifica la **clave de inserción**, es decir, que no se insertarán *SalesOrderId* que ya existan en la tabla de destino. Esta estrategia es recomendable si tenemos la seguridad de que:

1. Ninguna venta tarda más de 30 días en cargarse en el sistema 
2. Los registros de venta una vez insertados en el origen no cambian nunca.

Otra opción sería añadir incrementalmente aquellos registros añadidos en el ERP desde la última carga (requiere un campo "*timestamp*" en el origen).

<view-sql-code fileName="INCREMENTAL-3"/>

Observad como en este caso se ha declarado la variable *@last* con la fecha del último registro insertado. 


En resumen, las cargas incrementales son adecuadas para aquellas situaciones en las que el origen tiene muchos millones de registros y solo se producen inserciones.

La instrucción **MERGE INCREMENTAL** es equivalente a la instrucción **INSERT** de **Crono SQL**.


## MERGE HISTORY

La instrucción **MERGE HISTORY** es una carga de **dimensión lentamente cambiante tipo 2**. Esta estrategia guarda la historia completa de los cambios utilizando los campos de *fecha de inicio* y *fecha de fin vigencia*. De esta manera, es posible conocer el contenido que tenía cualquier registro en una fecha dada. En esta estrategia de carga no se eliminan ni actualizan registros nunca. La instrucción **MERGE HISTORY** únicamente añade los registros que han cambiado desde la última carga (y actualiza los campos de vigencia que correspondan).

Se utiliza para cargar tablas de dimensión en las que es necesario guardar la historia de cambios.

La sintaxis es la misma que en los casos anteriores (y la mismas que la del **INSERT** o **UPDATE**....).Únicamente es necesario cambiar el nombre de la estrategia a utilizar: **MERGE HISTORY** 

<view-sql-code fileName="SCD2-1"/>

El código generado realiza un **MERGE** para actualizar las fechas de fin vigencia, y un **INSERT** para añadir los registros que han cambiado y los nuevos registros.

También en este caso, **Crono SQL** genera automáticamente al código repetitivo:

- Creación de la tabla y los campos necesarios
- Creación de la clave subrogada
- Creación y carga de los campos de auditoria
- Comprobación de la corrección de los **JOIN** (ya que aparece la cláusula **CHECK SNOWFLAKE**).

::: tip RECUERDA
Es interesante observar que la elección entre **MERGE CLONE**, **MERGE UPSERT** y **MERGE HISTORY** depende únicamente de las necesidades de negocio. Con **Crono SQL** cuesta exactamente lo mismo programar una carga SCD de tipo 1 o de tipo 2.
:::


## Sintaxis MERGE estándar


El lenguaje **Crono SQL** admite también la sintaxis SQL estándar de la sentencia **MERGE**:

<view-sql-code fileName="Merge1"/>

La sentencia **MERGE**, en función de una serie de condiciones definidas, ejecutará un **UPDATE** de los registros que hayan cambiado y un **INSERT** de los registros de la consulta origen que no existan en la tabla destino. Por este motivo se le conoce como **UPSERT** (**UPDATE**+**INSERT**).

Debería ser la "sentencia estrella" de cualquier proyecto ETL/DWH, porque en estos proyectos lo que en definitiva se necesita es replicar los datos del origen en la tabla destino (¡exactamente lo que promete hacer el **MERGE**!). Lamentablemente, la sintaxis ISO es compleja, está llena de repeticiones, y es muy difícil escribir correctamente. Por este motivo, muchos desarrolladores la desconocen, o no la usan, y buscan métodos alternativos para realizar el trabajo (con mucho peor rendimiento, habitualmente).

En un proyecto **Crono SQL** nunca es necesario utilizar la sintaxis estándar, y se proponer utilizar siempre la sintaxis compacta de **MERGE CLONE**, **MERGE UPSERT**, etc.


## Resumen

La sentencia **MERGE** permite cargar una tabla aplicando alguna de las estrategias de carga disponibles. Las más habituales son:

- **MERGE CLONE**: Actualización completa
- **MERGE UPSERT** (o simplemente **MERGE**): Dimensión lentamente cambiante tipo 1 
- **MERGE INCREMENTAL**: Carga incremental
- **MERGE HISTORY**: Dimensión lentamente cambiante tipo 2

El uso de un conjunto cerrado y reducido de estrategias aporta muchos beneficios:

- El uso de estrategias asegura un código homogéneo y fácil de mantener, y permite que el desarrollador se centre en aquellas actividades que realmente aportan valor. 
- Una característica importante del lenguaje es que al programador le costará exactamente lo mismo aplicar cualquier estrategia de carga. Es decir, la decisión de utilizar una u otra <u>no</u> se verá influenciada por la dificultad de programarlo, por lo que la decisión se tomará en función de las necesidades del negocio.
- Además, el código SQL generado está altamente optimizado para obtener siempre el máximo rendimiento. **Crono SQL** no actua como una caja negra sino que delega totalmente el trabajo a quien mejor sabe hacerlo (el motor de la base de datos).
- **Crono SQL** genera automáticamente todo el código repetitivo. No hemos de preocuparnos ni de crear la tabla. Todas las tablas tendrán campos de auditoría correctamente informados. Ni siquiera hemos de escribir el farragoso código necesario para ejecutar un **MERGE**, un **UPDATE**, o un **INSERT**.






























