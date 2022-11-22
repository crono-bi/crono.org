---
title: Sentencias DDL
position: 8
---

# Sentencias DDL

En artículos anteriores hemos descritos la sintaxis de la sentecia **SELECT** de **Crono SQL** y el resto de sentencias de manipulación de datos (DML):

En este artículo se describe, mediante ejemplos, la sintaxis de:

- **CREATE PROCEDURE**
- **CREATE FUNCTION**
- **CREATE VIEW**
- **CREATE TABLE**
- **CREATE INDEX**
- **CREATE DATABASE**
- **CREATE SCHEMA**

## CREATE PROCEDURE

**Crono SQL** admite la sintaxis estándar de SQL para crear procedimientos almacenados:


El código SQL generado, y sin que el programador tenga que escribir ni configurar nada, apunta en una tabla de log información sobre su ejecución (*fecha de inicio*, *duración*, etc.). De manera predeterminada, todos los procedimientos auditan el resultado de sus ejecuciones en una tabla de logs. **Crono SQL** promociona el uso de buenas prácticas y es una buena práctica mantener un log completo y fiable de todas las ejecuciones. La **estrategia de log** se puede configurar y personalizar a nivel de proyecto.

Por lo tanto, en el ejemplo anterior, la sentencia **PRINT** es innecesaria. De hecho, si el procedimiento tiene una sola instrucción, no es necesario tampoco crear el bloque **BEGIN ... END**. El siguiente código es equivalente    



Se puede utilizar la instrucción **CREATE OR REPLACE** (también se admite **CREATE OR ALTER**) para que el mismo código sirva para crear inicialmente el procedimiento o modificarlo si ya existe:


Finalmente, si el procedimiento carga una única tabla (lo que recomendamos), se puede prescindir del nombre del procedimiento. **Crono SQL** escojerá un nombre apropiado sin que el desarollador tenga que elegir y memorizar uno.  



Todos los anteriores ejemplos crearán tanto el procedimiento como la tabla *DimProducts*.  Antes de cargar la tabla, se ejecutará la comprobación **CHECK SNOWFLAKE** para asegurar que las relaciones no pierden ni duplican registros. También se informarán los campos de auditoria durante la ejecución de la carga. 

La sintaxis utilizada en el último ejemplo no es excepcional. De hecho, es el caso más normal, el recomendado, y el que puede utilizarse en prácticamente todas las tablas de un Data Warehouse implementado con **Crono SQL**.

**Crono SQL** facilita y promociona el [principio de responsabilidad única (SRP)](https://es.wikipedia.org/wiki/Principio_de_responsabilidad_%C3%BAnica). Por lo tanto, consideramos una buena práctica que cada procedimiento cargue una única tabla. Y que cada tabla se cargue desde un único procedimiento. Y que cada procedimiento tenga una única instrucción, y que esa instrucción sea un **LOAD** que utiliza una única estrategia. Idealmente, todas las tablas se deberían cargar de este modo.

Para ejecutar un procedimiento, se puede utilizar la sentencia **EXECUTE** (o el sinónimo **EXEC**):


En el caso de los procedimientos "anónimos" se debe utilizar **EXECUTE LOAD** (o **EXEC LOAD**):


El flujo normal de ejecución de la carga del DWH, se puede crear mediante un procedimiento que llame secuencialmente a la carga de todas las tablas:



Y, de este modo, la carga del DWH se ejecutaría llamando a este procedimiento desde el programador de tareas de Windows o mediante el programador propio de la base de datos:


Se puede utilizar **DROP PROCEDURE** para eliminar un procedimiento existente. También se puede utilizar **DROP PROCEDURE IF EXISTS** para eliminar un procedimiento en el caso de que efectivamente exista.


## CREATE FUNCTION

La sintaxis para crear una función escalar es la siguiente:


También pueden crearse funciones que devuelven tablas de este modo simplificado:


Se puede utilizar **DROP FUNCTION** o **DROP FUNCTION IF EXISTS** para eliminar una función. 



## CREATE VIEW

**Crono SQL** admite la sintaxis estándar para crear vistas:


Se puede utilizar **CREATE OR ALTER VIEW** o **CREATE OR REPLACE VIEW** para actualizar la vista en el  caso de que ya exista.


Para eliminar una vista existente se puede utilizar **DROP VIEW** o **DROP VIEW IF EXISTS**


## CREATE TABLE

En general, <u>no es necesario</u> escribir explícitamente el **CREATE TABLE** de las tablas de un data warehouse desarrollado con **Crono SQL**. Las estrategias de carga ya crean implícitamente las tablas y los campos necesarios.

De todos modos, si se prefiere, pueden crearse las tablas utilizando la sintaxis habitual de **CREATE TABLE**.


Se puede utilizar **CREATE TABLE IF NOT EXISTS** para crearla únicamente si no existe aún. 

La sentencia **CREATE OR REPLACE TABLE** elimina la tabla si ya existe (**DROP TABLE**) y posteriormente la recrea.




También puede utilizarse **CREATE OR ALTER TABLE** para añadir nuevos campos, restricciones o índices a una tabla existente.



**Crono SQL** proporciona un método rápido de crear la clave primaria y la clave de negocio.  Para ello, se utiliza la **marca #** para identificar la **PRIMARY KEY** y la **marca ##** para identificar la clave de negocio, y **Crono SQL** creará un **UNIQUE CONSTRAINT**. Por puspuesto, la clave primaria puede estar formada por varios campos (aunque no sea recomendable en entornos DWH) y para ello debe ponerse la marca # delante de cada uno de los campos de la PK. También la clave de negocio puede estar formada por varios campos.




Además de los campos de la tabla, la sintaxis de **Crono SQL** admite las siguientes restricciones y indíces:

- Restricciones **NULL** y **NOT NULL** 
- Restricciones **IDENTITY**
- Restricciones **UNIQUE** y **NONUNIQUE** (que pueden ser **CLUSTERED** o **NONCLUSTERED**)
- Restricciones **FOREIGN KEY**/**REFERENCES**  (con la opción de **ON CASCADE DELETE**)
- Restricciones **DEFAULT**
- Indices **UNIQUE** y **NONUNIQUE** (que pueden ser **CLUSTERED** o **NONCLUSTERED**, y con la opción **INCLUDE**)



Algunas características de esta sintaxis:

- Es posible definir restricciones **IDENTITY**, **NULL**, **UNIQUE**, **REFERENCES** y **DEFAULT** en línea con el campo.
- Es posible omitir el nombre de indices y restricciones. **Crono SQL** utilizará un criterio de nomenclatura predefinido.

Si se requiere alguna funcionalidad de la base de datos que no está soportada por la sintaxis de **Crono SQL**, se pueden utilizar los literales SQL. Por ejemplo, puede utilizarse un literal SQL para especificar el *file group* donde debe crearse un indice, o para definir el particionado, o crear indices columnares (**Crono SQL** no parseará ni traducirá el literal SQL).



También se puede crear una tabla directamente a partir del resultado de una consulta.



Para eliminar una tabla, **Crono SQL** proporciona las sentencias **DROP TABLE** y **DROP TABLE IF EXISTS**.



## CREATE INDEX

Los índices se pueden crear desde la misma sentencia **CREATE TABLE** pero también pueden definirse a postereri mediante las sentencias **CREATE INDEX**.


Se puede utilizar la instrucción **CREATE INDEX IF NOT EXISTS** para crear un índice si aún no existe.


También se puede utilizar **CREATE OR REPLACE INDEX** para crear un ínidice o recrearlo si ya existe. El siguiente ejemplo muestra, además, la posibilidad de utilizar la cláusla **INCLUDE** para añadir columnas adicionales al indice:


Se puede crear índices **UNIQUE**, **CLUSTERED** y **NONCLUSTERED**.


Mediante **literales SQL** se puede crear cualquier otro índice que admita la base de datos.



La instrucción **DROP INDEX** permite eliminar un índice.








## CREATE DATABASE

La sentencia **CREATE DATABASE** permite crear una base de datos con las opciones predeterminadas.


También se puede especificar la intercalación:


## CREATE SCHEMA

Se puede crear un esquema con las instrucciones **CREATE SCHEMA** y **CREATE SCHEMA IF NOT EXISTS**


Es posible establecer el propietario del esquema.









