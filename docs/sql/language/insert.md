---
sidebar_label: Sentencia INSERT
sidebar_position: 2
---


# Sentencia INSERT

**Crono SQL** soporta la sintaxis estándar de la sentencia **INSERT**:

<SqlCodeBlock jsonPath="/json_sql/sql-A1D689.json" />




Sin embargo, especialmente cuando la tabla tiene muchas columnas, esta sintaxis es repetitiva e incómoda de mantener.  Por ello, **Crono SQL** prescinde de la cláusula **VALUES** y asume que el nombre de los campos coincide con el *alias* de las columnas de la consulta de origen:

<SqlCodeBlock jsonPath="/json_sql/sql-564051.json" />





Por supuesto, para definir el  origen de datos del **INSERT** se pueden utilizar [todas las características de la sentencia **SELECT**](#sentencia-select) de **Crono SQL**. En la siguiente consulta, por ejemplo, se verifica que las relaciones sean correctas antes de realizar la inserción. Es decir, si las relaciones pierden o duplican registros,  no se ejecutará el **INSERT**.    

<SqlCodeBlock jsonPath="/json_sql/sql-18D4F3.json" />


También se puede utilizar, por ejemplo, la sentencia **COMBINE** o la funcionalidad de **MATERIALIZE**. En la siguiente consulta se verificará que todas las relaciones sean correctas, se crearán entonces las tablas temporales con la información de *ventas* y *compras*, y finalmente se unirán mediante un **FULL JOIN** en un único resultado a insertar.


<SqlCodeBlock jsonPath="/json_sql/sql-F71300.json" />


Una necesidad habitual en ETL/DWH es insertar únicamente los registros que no existan en la tabla destino. Para ello, es necesario especificar la "clave de inserción". La clave de inserción se define mediante el *carácter #* delante del  *alias* de cada campo. Como veremos a lo largo de este tutorial, las claves de todas las estrategias de carga se definen con el carácter **#**.

La siguiente consulta inserta los productos que no existan aún en la tabla *dwh.DimProducts*

<SqlCodeBlock jsonPath="/json_sql/sql-722BC8.json" />

Es es posible realizar una recarga completa mediante la sentencia **DELETE AND INSERT**. Esta sentencia elimina el contenido de la tabla y la recarga con los datos de la consulta de origen. 


<SqlCodeBlock jsonPath="/json_sql/sql-F88F21.json" />


También es posible realizar un **TRUNCATE AND INSERT**

<SqlCodeBlock jsonPath="/json_sql/sql-95F992.json" />


La opción **PARTITION** permite recargar solo una parte de la tabla. Por ejemplo, es habitual cargar solo los movimientos del mes en curso (si sabemos que los demás no han sido modificados). La siguiente sentencia recarga las ventas de los últimos 30 días:

<SqlCodeBlock jsonPath="/json_sql/sql-466799.json" />


Con el tipo de estrategias descritas en este apartado es posible conseguir que cada tabla se cargue desde una única sentencia, centralizando la lógica de negocio en un único punto, facilitando el desarrollo, y promocionando el seguimiento de buenas prácticas. Los mismos principios y métodos se utilizan en el resto de sentencias DML, como se muestra en los siguientes apartados.
