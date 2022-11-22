---
title: Sentencia SELECT
position: 1
---




# Sentencia SELECT

En esta sección se documenta el funcionamiento de la sentencia **SELECT** del lenguaje. La sintaxis **SELECT** de **Crono SQL** aporta algunas ventajas (algunas importantes) frente al SQL ISO. Sin embargo, el mayor beneficio del lenguaje se manifiesta en el resto de instrucciones DML (**INSERT**, **UPDATE**, **MERGE**, …), donde Crono SQL automatiza toda la lógica de carga. Por eso la sentencia **SELECT** es tan importante… ¡Es lo prácticamente lo único que tendrá que codificar el desarrollador de un proyecto  ETL/DWH!

A continuación se describen sistemáticamente todas las características soportadas en la sentencia **SELECT** del lenguaje **Crono SQL**.



## Basado en el lenguaje SQL 


**Proposición:** Cualquier sentencia **SELECT** válida en SQL es válida también en **Crono SQL**



Si ninguna tabla participa en la consulta, se debe terminar la sentencia con el carácter punto y coma ";". En cualquier otro caso, el punto y coma es opcional.



Se pueden incluir las cláusulas **JOIN**, **WHERE**, **GROUP BY**, **HAVING** y/o **ORDER BY**



Se pueden utilizar las funciones propias del motor de base de datos o funciones definidas por el usuario.


## Referencia a columnas existentes

A diferencia del SQL ISO, en **Crono SQL** se puede hacer referencia a otra columna de la sentencia SELECT mediante el Alias de la columna.


## Prescindiendo del GROUP BY

Se puede utilizar la cláusula **GROUP BY ALL** para indicar que se agrupe por todas las columnas que no sean funciones de agregación. 



Siempre se puede prescindir totalmente de la cláusula **GROUP BY**. **Crono SQL** incluirá las columnas necesarias en el SQL generado.



## USING

Se puede utilizar la cláusula **USING**  para simplificar la sintaxis de los JOIN equi-join.



La cláusula **USING** también puede utilizarse cuando los campos de la equi-join tienen distinto nombre.



Si no se especifica el nombre de la tabla izquierda en la cláusula **USING**, se asume que es la tabla del **FROM** es la que participa en la relación. 



Si la relación equi-join está formada por distintos campos, se pueden especificar en la cláusula **USING** separados por comas.



## CHECK SNOWFLAKE

La cláusula **CHECK SNOWFLAKE**, colocada justo después de todos los **JOINs**, verifica que las relaciones no pierden ni duplican ningún registro de la tabla del **FROM**. Se trata de una comprobación fundamental para validar que no estamos cometiendo ninguna equivocación al escribir la consulta y que los datos de origen son coherentes con lo esperado.



La cláusula **CHECK SNOWFLAKE** verifica que todas las ventas correspondan a un cliente y que ese cliente exista en la tabla de personas. Si no fuera así, la consulta no se ejecutaría y devolvería un error.

   


## Subconsultas

Se pueden incluir subconsultas.



## Subconsultas con FILTER y COLUMNS

Después del nombre de la tabla, se puede incluir la cláusula **FILTER** para seleccionar solo una parte de los registros de la tabla. El código SQL generado incluirá una subconsulta similar a la del Ejemplo anterior.



La cláusula **FILTER** es muy útil en combinación con la cláusula **CHECK SNOWFLAKE**. En el siguiente ejemplo, se verifica que cada persona tenga una única *HomeAddress* (o ninguna) y una única *ShippingAddress* (o ninguna). Si no fuera así, la consulta no duplicaría los registros  porque devolvería un error previo. 



Se puede utilizar la cláusula **COLUMNS** para seleccionar, renombrar, u operar sobre las columnas físicas de la tabla. El código SQL generado incluirá una subconsulta con esas columnas.
    
    


## ANTI JOIN

El lenguaje **Crono SQL** soporta todos los *joins* habituales:

- **INNER JOIN**
- **LEFT JOIN**
- **RIGHT JOIN**
- **FULL JOIN**
- **CROSS JOIN** (también **CROSS APPLY**)

Además, implementa el **ANTI JOIN**. Un **ANTI JOIN** devuelve todos los  registros de la izquierda que no aparecen en la parte derecha de la relación. Para ello, el SQL generado incluye un predicado **NOT EXISTS IN (…)**

La  siguiente consulta devuelve todos los clientes que no tienen ninguna venta.  Puede ampliar la información sobre los **ANTI JOIN** en [el blog de SQL Server de Dale Burnett](http://daleburnett.com/2011/10/semi-joins-and-anti-joins/).

    

El **ANTI JOIN** se puede combinar con el resto de características del lenguaje.  

Esta consulta devuelve todos las personas que no tienen Home Address.



## SEMI JOIN

El lenguaje **Crono SQL** implementa también la relación **SEMI JOIN**. Un **SEMI JOIN** devuelve todos los registros de la izquierda que aparecen en la parte derecha de la relación. Para ello, el SQL generado incluye un predicado **EXISTS IN (…)**, por lo que a diferencia del **INNER JOIN** no duplica los registros en el resultado.

Esta consulta devuelve todos los clientes que tienen alguna venta (sin duplicados). Puede ampliar la información sobre los **SEMI JOIN** en [el blog de SQL Server de Dale Burnett](http://daleburnett.com/2011/10/semi-joins-and-anti-joins/).
     



## UNPIVOT

Se puede utilizar el operador **UNPIVOT** (según la [sintaxis de T-SQL](https://technet.microsoft.com/es-es/library/ms177410(v=sql.105).aspx)) para despivotar las columnas de una tabla.

En este ejemplo, las columna *“AddressLine1”*  y *“AddressLine2”* se han convertido en filas diferenciadas, duplicándose los registros.



## ORDER BY

Se puede utilizar la cláusula **ORDER BY** para forzar la ordenación del resultado.



    
    
El **ORDER BY** se puede escribir haciendo referencia a la posición de las columnas. 
    



## SELECT DISTINCT

Se puede utilizar la palabra clave **DISTINCT** para obtener los valores distintos
    
    



## SELECT TOP

Se puede utilizar la palabra clave **TOP** para limitar el número de registros del resultado.

Esta consulta devuelve los 5 clientes con mayores ventas. 




## OVER ()

Las funciones de ventana **OVER (…)** también están soportadas. 

Esta consulta devuelve las ventas acumuladas desde el principio de cada año. La funciones de ventana, también llamadas funciones analíticas, tienen mucha utilidad en entornos ETL/DWH y permiten simplificar el desarrollo de muchos escenarios ETL comunes.  Puede ampliar la información sobre las funciones de ventana en la documentación de la [cláusula **OVER** en T-SQL](https://msdn.microsoft.com/es-es/library/ms189461.aspx).




## TOP OVER ()

Se puede incluir la cláusula **OVER** junto a la palabra clave **TOP** para limitar el número de registros por grupos de registros.

Esta consulta devuelve los tres clientes con más ventas en cada territorio.




La combinación **TOP n OVER ()** tiene muchos usos en procesos ETL/DWH. La sentencia SQL generada es un consulta sobre una subconsulta de una subconsulta. La siguiente consulta devuelve la última venta de cada cliente.




## Subconsulta TIME_TABLE

La subconsulta predefinida **TIME_TABLE** permite obtener algunos de los campos habituales de una tabla de tiempo.



Se puede utilizar la subconsulta predefinida **TIME_TABLE** para construir la tabla de tiempo que sea necesaria en cada proyecto.
    


## Subconsulta INTEGERS BETWEEN

La subconsulta predefinida **INTEGERS BETWEEN a AND b** permite generar fácilmente una tabla de enteros consecutivos. 





## Subconsultas ROWS, COLUMNS y ROW

Se puede utilizar **ROWS** para generar fácilmente una subconsulta con resultados estáticos. Se puede utilizar, por ejemplo, para generar un maestro que no existe en la base de datos. También existen los  operadores **ROW** y **COLUMN** para generar una única fila o columna.





## Subconsulta FILE

Con el operador **FILE**, se puede leer un fichero plano (CSV) del sistema de archivos (o desde una URL) para generar una subconsulta. Se puede utilizar, por ejemplo, para generar un maestro que no existe en la base de datos. El fichero solo se lee en tiempo de compilación. El SQL generado es estático. 





## WITH

Las [sentencias CTE](https://msdn.microsoft.com/es-es/library/ms175972.aspx) con cláusula **WITH** están soportadas.




## UNION y UNION ALL

Se pueden utilizar los operadores **UNION** y **UNION ALL**

Este ejemplo tiene únicamente fines didácticos. Para combinar de este modo dos o más consultas es preferible el operador **COMBINE** que se muestra continuación.




## COMBINE


El operador **COMBINE BY** permite combinar dos o más consultas en un único resultado.

    
    

Se pueden utilizar tablas distintas en cada consulta del **COMBINE**. En este ejemplo, se comparan las ventas y las compras por producto. El SQL generado combinará los resultados utilizando un **FULL JOIN**.



## MATERIALIZE

La cláusula **MATERIALIZE** permite crear una tabla temporal con el contenido de una subconsulta. Es decir, antes de la ejecución de la consulta, se crean las tablas temporales necesarias y finalmente se ejecuta la consulta utilizando dichas tablas. Esta estrategia de carga simplifica el plan de ejecución del motor de base de datos y se pueden obtener mejoras de rendimiento muy significativas, sin penalizar o dificultar la escritura de la consulta.




Con la cláusula **MATERIALIZE**, también se pueden materializar las consultas de una sentencia **COMBINE**. En este ejemplo, primero se ejecutará la consulta con las ventas, luego se ejecutará una consulta con las compras, y finalmente se combinarán en un único resultado.




## CAST automático

Se puede forzar el tipo de datos resultante de una columna especificándolo justo después del alias de la columna. El SQL generado incluirá una llamada a la función **CAST**.



## SELECTs anidados

Es posible incluir varios **SELECT** en una misma consulta. Esta sintaxis permite escribir rápidamente una consulta sobre el resultado de otra consulta.  Son consultas encadenadas.

Este consulta devuelve la media de las ventas anuales de cada producto.





La cláusulas **SELECT** encadenadas permiten, por ejemplo, contar el número de registros que devuelve una consulta previa. La siguiente consulta ejecuta un **count(\*)** sobre el resultado de la consulta inferior.



## Resumen

En resumen, si se conoce SQL, ya se conoce la parte más importante de **Crono SQL**. **Crono SQL**, simplemente, facilita la escritura de SQL y aporta algunas extensiones para necesidades comunes en ETL/DWH. Destacamos:

- Posibilidad de referenciar a Alias de columnas de la consulta
- No es necesario el **GROUP BY**
- Sintaxis simplificada de los **JOIN**
- Sentencia **COMBINE**
- Cláusula **MATERIALIZE**
- Cláusula **CHECK SNOWFLAKE**
- Cláusulas **COLUMNS** y **FILTER** para reducir el número de subconsultas
- Cláusula **TOP OVER**
- Relaciones **ANTI JOIN** y **SEMI JOIN**
- Subconsultas predefinidas de **TIME_TABLE**, **INTEGERS**, **ROWS**
- Posibilidad de leer CSV desde la misma consulta mediante la extensión **FILE**
- **SELECTs** anidados
 
 



















