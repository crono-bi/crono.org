---
sidebarDepth: 2
---


# Introducción

Crono SQL es un lenguaje de programación para facilitar el desarrollo ágil de proyectos ETL/DWH. En esta página se muestra la sintaxis del lenguaje y todas las funciones admitidas.

## ¿Qué es Crono SQL?

**Crono SQL** es un lenguaje de programación creado por Pablo Urquizu (fundador de Crono BI) para facilitar el desarrollo ágil de proyectos ETL/DWH.

**Crono SQL** es un lenguaje que compila en SQL. Crono SQL y SQL tienen la misma relación, por ejemplo, que [TypeScript](https://es.wikipedia.org/wiki/TypeScript) y JavaScript, o [Markdown](https://daringfireball.net/projects/markdown/syntax) y HTML. 

**Crono SQL** extiende la sintaxis de SQL, por tanto cualquier sentencia **SELECT** existente funciona sin problemas. 

El lenguaje **Crono SQL** pretende simplificar la sintaxis del SQL evitando las repeticiones de código y automatizando la generación del código más farragoso y repetitivo. 

**Crono SQL** es un lenguaje mucho más imperativo, más fácil de escribir, de leer, y de mantener que el SQL ISO. 


## Principios

En la definición de la sintaxis y el desarrollo de las herramientas asociadas se han seguido estos principios:


| Principio              | Objetivo              | Justificación        |
|------------------------|--------------------------|----------------------|
| Principio SQL          | Similitud al **SQL ANSI** | El lenguaje SQL es un lenguaje conocido y ampliamente aceptado por el mercado. Es un lenguaje declarativo muy potente y adecuado para interactuar con los datos. **Crono SQL** trata de parecerse los más posible al SQL estándar. |
| Principio DRY          | Evitar repeticiones       | El código debe ser los más conciso posible y se debe evitar especialmente las repeticiones de código. Las repeticiones de código son fuente de errores y degradan la mantenibilidad del proyecto. |
| Principo KISS          | Buscar la simplicidad. | Mantener la simplicidad es importante en todos los proyectos, y eso incluye al lenguaje y a las herramientas de desarrollo. Siempre será preferible un código breve y sencillo que otro más farragoso o difícil de recordar.|
| Principo TEXT          | Mantener todo el código del proyecto y las configuraciones en ficheros de textos | El formato de texto es el más universal y el que mejor se puede gestionar desde un sistema de control de versiones como **GIT**. |


## Un resumen, por favor

Este manual tiene más de 300 páginas, por lo que probablemente querrás saber lo que puedes llegar a conseguir con Crono y si vale la pena seguir leyendo.

En menos de 100 palabras:

::: tip RESUMEN
Con **Crono SQL** puedes escribir un código sencillo que crea una tabla y crea el procedimiento que se encarga de su aprovisionamiento. 
Con unas pocas líneas de código se consigue al mismo tiempo crear el modelo de datos y construir la ETL. 
Además, el código generado es óptimo y el rendimiento es inigualable. Todo ello redunda en un código más mantenible, más escalable y con menos errores.
:::


El siguiente ejemplo muestra todo lo anterior con más detalle. Incluye prácticamente todo lo que vas a necesitar para construir un DWH y cargar prácticamente todas las dimensiones y el 90% o más de las tablas de hechos.

Este manual asume que se tienen al menos conocimientos básicos de SQL.

<view-sql-code fileName="ConceptDemo1"/>

Estas 21 líneas de código hacen todo lo siguiente:

- Si no existe, crean la tabla `dwh.FactSalesOrderDetails` con todos sus campos (con el tipo correcto).
- Si la tabla ya existe, añade los campos que le falten.
- También crea una restricción de unicidad `BK_FactSalesOrderDetails` que actuará como *business key* y asegurará que el campo `SalesOrderDetailID` no tiene repetidos.
- Crea las claves foráneas con las tablas `dwh.DimProducts` y `dwh.FactSalesOrderHeader`.
- Crea los índices `NONUNIQUE` sobre los campos que intervienen en las dos relaciones previas para optimizar el rendimiento.
- Crea un procedimiento en base de datos que carga la tabla `dwh.FactSalesOrderDetails` a partir de los datos de la consulta indicada. Esta carga se hará siguiendo una estrategia **MERGE CLONE**, es decir, añadirá o eliminará los nuevos registros que hagan falta para que la tabla del DWH tenga exactamente el mismo contenido que el ERP de origen. Si algún registro ha cambiado sus valores, también actualizará las modificaciones. Después de ejecutar la carga, la tabla del DWH será literalmente un "clon" de los datos de origen.
- Antes de actualizar los datos, sin embargo, se verifica que las relaciones sean correctas y que no se pierden ni duplican registros. La cláusula `CHECK SNOWFLAKE` asegura que se cargan exactamente todas las ventas de origen. Ni una más ni una menos. Esta comprobación es fundamental para asegurar la calidad de los datos. Si los datos de origen tienen algún error, no queremos cargarlos en el data warehouse.
- El procedimiento también guarda **información de auditoria**. Es decir, cada registro tendrá información de la fecha de alta y la fecha de la última modificación.
- También se informará en la tabla de auditoría `audit.logs` información sobre todas las ejecuciones del procedimiento. Sabremos cada vez que se ha ejecutando, cuando y quién lo ha hecho, sabremos cuántos registros se han actualizado, y el tiempo que ha tardado. Esta información de auditoria se configura una sola vez en cada proyecto.
- Finalmente, también se informan algunas propiedades extendidas sobre la estrategia de carga y otras características del código.

En resumen, esas 21 lineas de código se transforman en 282 líneas que hacen todo lo necesario para crear la tabla en el DWH y cargarla diariamente siguiendo las mejores prácticas.

En cierto modo, este código **Crono SQL** es una fusión inteligente entre una sentencia `CREATE TABLE` y una sentencia `CREATE PROCEDURE` que crea un procedimiento que ejecuta un `MERGE`. 

Aunque lo anterior ya es una gran ventaja respecto al código **SQL ANSI**, el mayor beneficio es la sintaxis simplificada de la sentencia **MERGE**. La sentencia **MERGE** es fundamental en los proyectos ETL/DWH, pero su sintaxis estándar es tan farragosa que su creación y mantenimiento se convierte en inviable. Con **Crono SQL** la sintaxis es tan sencilla que convierte innecesario utilizar cualquier otra herramienta ETL.

El siguiente código permite comparar la facilidad y legibilidad del código **Crono SQL** frente al código **SQL** estándar.


<view-sql-code fileName="ConceptDemo2"/>

Además, el código generado es óptimo. Es imposible cargar esta tabla de una manera más rápida o eficiente. Con ninguna otra herramienta es posible cargar estos mismos datos más rápidamente.


## Estructura del manual



Este manual documenta el funcionamiento de la sentencia **SELECT** del lenguaje y el resto de instrucciones. La sintaxis **SELECT** de **Crono SQL** aporta algunas ventajas (algunas importantes) frente al SQL ISO. Sin embargo, el mayor beneficio del lenguaje se manifiesta en el resto de instrucciones DML (**INSERT**, **UPDATE**, **MERGE**, …), donde Crono SQL automatiza toda la lógica de carga. 

El manual se organiza en estas secciones:

- **Lenguaje SQL**: Describe mediante ejemplos las instrucciones principales del lenguaje (**SELECT**, **MERGE**, y todas las demás).
- **Referencia lenguaje**: Amplia la información de la sección anterior completándola con sintaxis o funcionalidades más avanzadas.
- **Funciones**: Listado de todas las funciones del lenguaje agrupadas en 6 subsecciones: Funciones de asgregación, de conversión y lógicas, de fecha, de texto, matemáticas y funciones de sistema.
- **Vistas**: Listado de todas las "vistas" predefinidas que incluye el lenguaje.


<section-index />
