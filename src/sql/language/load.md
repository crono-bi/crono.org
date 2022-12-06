---
title: Sentencia LOAD
position: 7
sidebarDepth: 2
---







# Sentencia LOAD


En apartados anteriores mostrábamos mediante ejemplos la sentencia [SELECT](#sentencia-select) y las sentencias INSERT, UPDATE, MERGE, DELETE y TRUNCATE para manipular datos.  En este artículo se describe la sentencia **LOAD** del lenguaje **Crono SQL**.

La sentencia **LOAD** carga los datos en una **tabla destino**, siguiendo  una **estrategia de carga**, a partir de una **consulta de origen**.

La sintaxis es muy sencilla. Por ejemplo, la siguiente sentencia carga tabla dimensión de *DimProducts*, creando su clave subrogada, a partir de una consulta de los datos fuente:

<view-sql-code fileName="SCD1-3"/>

La lógica de carga está definida en la "estrategia de carga" (en el ejemplo, **SCD1**). En concreto, la estrategia de carga determina:

- El  modo de creación de los  campos de la tabla destino (si no existe la tabla o no contiene todos  los campos necesarios).
- El nombre y el modo de actualización de los campos de auditoria (*fecha de alta*, *fecha de baja*, *fecha de actualización*, etc).
- La sentencia DML que se utilizará para ejecutar la carga (INSERT, MERGE, UPDATE, etc...)



## Estrategias de carga

Un proyecto nuevo de Crono ETL ya incluye las estrategias de carga habituales. En concreto, al crear un proyecto ETL la siguientes estrategias ya están creadas y listas para ser utilizadas:

- **SCD1:** Dimensión lentamente cambiante tipo 1 
- **SCD2:** Dimensión lentamente cambiante tipo 2
- **SNAPSHOT:** Actualización completa
- **INCREMENTAL:** Carga incremental
- **DELETE AND INSERT:** Recarga parcial

Estas 5 estrategias, o un subconjunto de ellas,  suelen ser suficientes para implementar cualquier proyecto ETL/DWH. Habitualmente, las estrategias **SCD1** y **SCD2** se utilizan para cargar tablas de dimensión, y **SNAPSHOT**, **DELETE AND INSERT** e **INCREMENTAL** se utilizan para cargar tablas de hechos. De todos  modos, eso dependerá de las necesidades de cada tabla y de cada proyecto.

Las 5 estrategias predefinidas crean la tabla de destino si es necesario, así como la clave de negocio, y los campos de auditoria. Si es necesario, es posible definir nuevas estrategias o modificar las  existentes fácilmente (la sintaxis para ello es  muy compacta y se describirá en un artículo independiente).

A continuación se incluyen ejemplos de uso de estas 5 estrategias.

## Estrategia SCD1

La estrategia **SCD1** es una carga de **dimensión lentamente cambiante tipo 1**. Esta estrategia de carga actualiza los registros que se han modificado desde la última carga y añade los nuevos, pero nunca elimina los registros existentes.

Se utiliza habitualmente para cargar tablas de dimensión, ya que se requiere mantener los registros antiguos para respetar la integridad (no queremos borrar un producto o un cliente que tal vez tienen ventas u otras transacciones asociadas).

<view-sql-code fileName="SCD1-1"/>

Es importante observar que el campo *ProductId* está precedido por el **carácter numeral #**. Esta marca es importante ya que sirve para identificar la **clave de actualización**. Habitualmente coincide con la clave de negocio (código único que identifica a cada registro)

El código generado realiza un **MERGE** para actualizar o insertar cada registro. También informa convenientemente los campos *FechaAlta*, *FechaBaja* y *FechaModificacion*.  

Si la tabla no existe en el momento de ejecución, la creará añadiendole el campo *ProductSid* como una clave subrogada (un entero autonumérico). También creará un **UNIQUE CONSTRAINT** para el campo *ProductId* (que debe ser único).

Si en el futuro se modifica la consulta, añadiendo más campos a la dimensión, **Crono SQL** generará también el código necesario para crear esos nuevos campos en la tabla.

En lugar de *int IDENTITY(1,1)* se puede utilizar el sinónimo *increment*, produciendo exactamente el mismo resultado:

<view-sql-code fileName="SCD1-2"/>

Observad que en estos dos ejemplos, después de los **JOIN**, se ha incluido la clausula **CHECK SNOWFLAKE**. Por lo tanto, antes de realizar la carga, **Crono SQL** verificará que la consulta de origen no pierda ni duplique registros de *staging.Products*.



## Estrategia SCD2

La estrategia **SCD2** es una carga de **dimensión lentamente cambiante tipo 2**. Esta estrategia guarda la historia completa de los cambios utilizando los campos de *fecha de inicio y fecha de fin vigencia*. De esta manera, es posible conocer que contenido que tenía cualquier registro en una fecha dada. En esta estrategia de carga, no se eliminan ni actualizan registros, únicamente se añaden los registros que han cambiado desde la última carga (y se actualizan los campos de vigencia que correspondan).

Se utiliza para cargar tablas de dimensión en las que es necesario guardar la historia de cambios.

El código es exactamente igual que el de las cargas **SCD1**, únicamente es necesario cambiar el nombre de la estrategia a utilizar: **SCD2** 

<view-sql-code fileName="SCD2-1"/>

El código generado realiza un **MERGE** para actualizar las fechas de fin vigencia, y un **INSERT** para añadir los registros que han cambiado y los nuevos registros.

También en este caso, **Crono SQL** genera automáticamente al código repetitivo:

- Creación de la tabla y los campos necesarios
- Creación de la clave subrogada
- Creación y carga de los campos de auditoria
- Comprobación de la corrección de los **JOIN** (ya que aparece la cláusula **CHECK SNOWFLAKE**).

Es interesante observar que la elección entre **SCD1** y **SCD2** depende únicamente  de las necesidades de negocio. Técnicamente, utilizando **Crono SQL**, cuesta exactamente lo mismo programar una carga SCD  de tipo 1 o de tipo 2.

## Estrategia SNAPSHOT

La estrategia **SNAPSHOT** realiza una actualización completa de la tabla. Es decir, añade, elimina o actualiza todos los registros de la tabla destino para que coincidan exactamente con el contenido de la consulta de origen.

Se utiliza en tablas de hechos pequeñas o en aquellas tablas de dimensión en que sabemos que no se eliminan registros, o que es aceptable que se eliminen registros obsoletos.

La sintaxis es idéntica a los casos anteriores. Únicamente es necesario cambiar el nombre de la estrategia de carga:

<view-sql-code fileName="SNAPSHOT-1"/>

El ejemplo anterior, además de crear la tabla, e informar los campos de auditoria, actualizará el contenido de la tabla de *DimProducts* con los valores vigentes en el origen, eliminando los registros que se hayan eliminado en el origen.

El código generado es óptimo y presenta un gran rendimiento, por lo que esta estrategia es adecuada también en tablas de hechos no excesivamente grandes:

<view-sql-code fileName="SNAPSHOT-2"/>

Incluso si la tabla de origen tuviese unos pocos millones de registros, la carga anterior se ejecutaría rápidamente (con el Hardware adecuado).

En cambio, si la tabla de origen tuviese varias decenas de millones de registros (o más) recomendaríamos utilizar alguna estrategia de carga incremental.

## Estrategia INCREMENTAL


La estrategia **INCREMENTAL** realiza una carga incremental de la la tabla. En general, las cargas incrementales son problemáticas. La mayor dificultad de las cargas incrementales es determinar los registros que se deben añadir. Es necesario identificar en origen los registros nuevos desde la última carga (mediante un *timestamp*, habitualmente). Otro riesgo de las cargas incrementales es que modificaciones extraordinarias en el origen pueden no reflejarse en en DWH (no siempre los responsables del ERP puede asegurar que ningún proceso o incidencia pueda modificar algún día registros antiguos). Por estos motivos, si el tiempo de ejecución es aceptable, es preferible utilizar **SNAPSHOT** siempre que sea posible, aunque el tiempo de ejecución sea algo mayor.

Las cargas incrementales son adecuadas para tablas de hechos con muchos millones de registros.

<view-sql-code fileName="INCREMENTAL-1"/>

La anterior sentencia cargará las ventas del día anterior (y solo las del día anterior). Evidentemente, esta estrategia es débil y propensa a errores. Dejará de cargar registros si algún día no se ejecuta la carga, o podría duplicarlos si se ejecutase dos veces un mismo día. También fallaría si algún proceso del ERP se retrasase varios días en insertar los datos de alguna tienda... La siguiente estrategia resuelve parcialmente el problema: 

 <view-sql-code fileName="INCREMENTAL-2"/>

En el caso anterior, se cargarían las ventas de los últimos 30 días que no se hayan cargado previamente. La marca **#** especifica la **clave de inserción**, es decir, que no se insertarán *SalesOrderId* que ya existan en la tabla de destino. Esta estrategia es recomendable si tenemos la seguridad de que ninguna venta tarda más de 30 días en cargarse en el sistema.

Otra opción sería añadir incrementalmente aquellos registros añadidos en el ERP desde la última carga (requiere un campo "*timestamp*" en el origen).

<view-sql-code fileName="INCREMENTAL-3"/>

Observad como en este caso se ha declarado la variable *@last* con la fecha del último registro insertado. 


En resumen, las cargas incrementales son adecuadas para aquellas situaciones en las que el origen tiene muchos millones de registros y solo se producen inserciones.


## Estrategia DELETE AND INSERT

La estrategia **DELETE AND INSERT** aplica una recarga total o parcial de la tabla destino. Es decir, elimina los registros existentes y los vuelve a cargar en función de los valores de la consulta de origen.


Es una buena alternativa a la carga **INCREMENTAL** en aquellos casos en que el ERP pueda aplicar cambios en registros "recientes" (en función del *mes cerrado*, por ejemplo).

El código **Crono SQL** se convierte en un **DELETE** seguido de un **INSERT**. 

En este ejemplo, se elimina todo el contenido de la tabla y se recarga:

<view-sql-code fileName="DELETE-AND-INSERT-1"/>

Evidentemente, esta estrategia seria muy ineficiente, sin embargo, en función del volumen de la tabla, podría ser aceptable eliminar y recargar el último mes o el último año. Por ejemplo, el siguiente ejemplo  recarga las ventas del año en curso.

<view-sql-code fileName="DELETE-AND-INSERT-2"/>

Se observa la clausula **PARTITION** que determina la porción de la tabla que se recargará.




## Resumen

La sentencia **LOAD** permite cargar una tabla aplicando alguna de las estrategias de carga predefinidas en el proyecto. Las estrategias predeterminadas son:

- **SCD1:** Dimensión lentamente cambiante tipo 1 
- **SCD2:** Dimensión lentamente cambiante tipo 2
- **SNAPSHOT:** Actualización completa
- **INCREMENTAL:** Carga incremental
- **DELETE AND INSERT:** Recarga parcial

El uso de un conjunto cerrado y reducido de estrategias aporta muchos beneficios:

- El uso de estrategias asegura un código homogéneo y fácil de mantener, y permite que el desarrollador se centre en aquellas actividades que realmente aportan valor. 
- Una característica importante del lenguaje es que al programador le costará exactamente lo mismo aplicar cualquier estrategia de carga. Es decir, la decisión de utilizar una u otra <u>no</u> se verá influenciada por la dificultad de programarlo, por lo que la decisión se tomará en función de las necesidades del negocio.
- Además, el código SQL generado está altamente optimizado para obtener siempre el máximo rendimiento. **Crono SQL** no actua como una caja negra sino que delega totalmente el trabajo a quien mejor sabe hacerlo (el motor de la base de datos).
- **Crono SQL** genera automáticamente todo el código repetitivo (según la configuración de cada estrategia). No hemos de preocuparnos ni de crear la tabla. Todas las tablas tendrán campos de auditoría correctamente informados. Ni siquiera hemos de escribir el farragoso código necesario para ejecutar un **MERGE**, un **UPDATE**, o un **INSERT**.

Finalmente, recordar que es posible modificar o crear nuestras estrategias en función de nuestras necesidades particulares pero, en cualquier caso, será una tarea que deberá realizarse una vez al comenzar el proyecto, y se reutilizará a lo largo de todo el ciclo de vida del data warehouse.






























