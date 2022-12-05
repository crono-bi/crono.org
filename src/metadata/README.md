---
pageClass: custom-page-metadata
sidebar: auto
title: Manual Crono Metadata
position: 2
---

<breadcrumb parents="Crono Metadata"/>

# Crono Metadata

## Introducción


Crono Metadata es la herramienta que permite definir el catálogo. El "catálogo" es la capa semántica traduce las tablas, campos y relaciones de la base de datos en el lenguaje de negocio.

Mediante drag&drop, y con un mínimo conocimiento de SQL, se defienen las dimensiones e indicadores y se organizan en carpetas. Gracias a este catálogo, el usuario podrá realizar consultas sencillamente seleccionando la información que necesita en su informe.

## Cómo crear tu primer catálogo

### Crear un catálogo

Es sencillo crear un catálogo siguiendo estos pasos:

1. Crear la conexión
2. Crear los diagramas (uno o varios)
3. Crear la objetos de negocio
4. Validar el funcionamiento del catálogo

### Crear la conexión

Al hacer clic en "Crear nuevo catálogo" aparece el formulario de "Configurar conexión". 

Si la base de datos donde se encuentra tu información es **SQL Server**, simplemente completa la información de conexión (servidor, base de datos y usuario). Una vez completado el formulario pulsa el  botón "Verificar conexión" para confirmar que todos los datos con correctos.

![Conexión](/images/conexion.gif)

Vea el artículo sobre [Propiedades de conexión](#propiedades-de-conexion) para mayor información.

### Crear los diagramas 

Los diagramas -o copos de nieve- son una pieza fundamental del catálogo. **Crono** generará las consultas SQL a la base de datos en función de los diagramas definidos.

Cada diagrama esta formado por una tabla central -o tablas de hechos- y un conjunto de dimensiones. Las tablas están conectadas entre sí a través de las **relaciones**. 

Se debe crear un diagrama para cada _tabla de hechos_ del modelo.  

Para crear un diagrama siga los siguientes pasos:

1. Pulse el botón "Nuevo copo de nieve" y seleccione la tabla de hechos.
2. Arrastre una tabla de dimensión desde la vista "Base de datos" encima de la tabla de hechos.
3. Aparecerá el formulario de "Configurar relación" y deberá seleccionar los campos que definen la relación entre los dos campos. También debe especificar el tipo de relación (**INNER JOIN** o **LEFT JOIN**) 
4. Del mismo modo, repita los pasos 2 y 3 para cada una de las tablas que forman el diagrama.

![Cómo crear un diagrama](/images/diagrama.gif)

En el artículo sobre [cómo crear un diagrama](#como-crear-un-diagrama) se muestra paso a paso con imágenes explicativas.

### Crear los objetos de negocio

Los objetos de negocio son las dimensiones, indicadores y filtros que forman el catálogo y que podrá utilizar el usuario para generar sus consultas e informes.

Se pueden crear fácilmente arrastrando las tablas o los campos a la vista catálogo.

![image-20200302130450547](/images/catalogo6.png)

En el artículo sobre [cómo crear elementos de negocio](#crear-elementos-de-negocio) se muestra paso a paso con imágenes explicativas.


### Validar el funcionamiento del catálogo

Una vez terminada la primera versión del catálogo, y antes de entregárselo al usuario, conviene verificar el correcto funcionamiento del mismo. Existen tres herramientas para validar el catálogo:

1. Probar catálogo desde **Crono Metadata**
2. Herramientas de verificación
3. Probar catálogo desde **Crono Analysis**

![Probar catálogo](/images/probar.gif)

En el artículo ["Validar catálogo"](#validar-catalogo) se muestran estas herramientas con imágenes explicativas.



## Cómo crear un diagrama

Para crear un diagrama siga los siguientes pasos:

1. Pulse el botón "Nuevo copo de nieve" y seleccione la tabla de hechos.
2. Arrastre una tabla de dimensión desde la vista "Base de datos" encima de la tabla de hechos.
3. Aparecerá el formulario de "Configurar relación" y deberá seleccionar los campos que definen la relación entre los dos campos. También debe especificar el tipo de relación (**INNER JOIN** o **LEFT JOIN**) 
4. Del mismo modo, repita los pasos 2 y 3 para cada una de las tablas que forman el diagrama.

![Cómo crear un diagrama](/images/diagrama.gif)

Las siguientes imágenes muestran este proceso. En primer lugar hacemos clic en "Nuevo copo de nieve".

![image-20200301224203461](/images/catalogo1.png)



La tabla se añadirá en el centro del diagrama:



![image-20200301224537356](/images/catalogo2.png)



Para añadir las relaciones hemos de arrastrar una tabla de dimensión sobre la tabla de hechos:

![image-20200301224944204](/images/catalogo3.png)



Al aceptar el formulario de propiedades de la relación se añadirá la tabla en el diagrama:



![image-20200301225543277](/images/catalogo4.png)

 Del mismo modo, tendremos que añadir el resto de dimensiones en este diagrama:

![image-20200301230107906](/images/catalogo5.png)


## Crear elementos de negocio

Los objetos de negocio son las dimensiones, indicadores y filtros que forman el catálogo y que podrá utilizar el usuario para generar sus consultas e informes.

![image-20200302130450547](/images/catalogo6.png)

Los pasos para crear los objetos de negocio son:

1. Ir a la _vista catálogo_ pulsando el botón "Catálogo" en la esquina inferior izquierda.
2. Arrastrando una tabla desde el diagrama a la _vista catálogo_ se crea una carpeta con una dimensión para cada uno de los campos de la tabla.
3. Si hay columnas que no quieres que aparezcan en el catálogo puedes eliminarlas desde el menú contextual (por ejemplo, campos _ID_ o campos de auditoría que sean irrelevantes al usuario). 
4. También se puede arrastrar una columna desde el _panel de columnas_ a la vista catálogo
5. Finalmente, puedes crear una carpeta o un objeto de negocio desde el menú contextual de la _vista catálogo_.
6. Desde el menú contextual puedes **Convertir en indicador** las columnas numéricas como "Ventas", "Unidades", "Cantidad", etc.
7. Desde el menú contextual puedes abrir las **Propiedades de objeto de negocio** para establecer el formato adecuado, las [listas de valores](#listas-de-valores) y otras propiedades de cada objeto de negocio.
8. Finalmente, puedes organizar los objetos del catálogo mediante _Drag & Drop_.

Es importante que los objetos tengan nombres reconocible por el usuario de negocio. También deben estar correctamente ordenados para facilitar su uso.

![image-20200302131304907](/images/catalogo7.png)



## Listas de valores

Las listas de valores son los valores posibles que puede tener una dimensión. Las listas de valores son útiles porque facilitan la creación de filtros a los usuarios y les permite reconocer el significado exacto de cada dimensión.

En **Crono Analysis** las listas de valores se muestran al seleccionar una dimensión del catálogo:

(/images/

![image-20200302172120282](/images/lov0.png)



Desde **Crono Metadata** p(/images/er la configuración de la lista de valores desde las propiedades de cada dimensión (el panel de propiedades se abre desde el menú contextual de los elementos del catálogo).

![image-20200302172820981](/images/lov1.png)

### Ordenación de los meses

De manera predeterminada, la lista de valores aparece ordenada alfabéticamente. Este comportamiento es el adecuado en la mayoría de ocasiones, pero hay casos donde es preferible otra ordenación. Por ejemplo, los **meses** no se ordenan alfabéticamente.

Para ordenar correctamente los meses se debe especificar el "campo de ordenación":



(/images/

![image-20200302173308536](/images/lov.gif)

### Deshabilitar lista de valores

Es posible deshabilitar la(/images/e valores de algún elemento. Esto es útil cuando la lista de valores es muy grande (superior a varios millones de registros) o donde la lista no es relevante para el usuario (por ejemplo, una lista de PVP de libros es irrelevante).

![image-20200302174105823](/images/lov3.png) 

### Listas de valores filtradas

Es posible limitar los registros que se mostrarán en la lista de valores. 

Esto es útil para mostrar valores relevantes a los usuarios. Por ejemplo, se puede desear no mostrar clientes o productos antiguos que ya no son relevantes para el negocio.

Para ello, hemos de establ(/images/filtro desde el panel de propiedades:

![image-20200302174541300](/images/lov4.png)



Es importante señalar que ese filtro afecta únicamente a la lista de valores. Los informes seguirán mostrando todos los valores existentes, salvo que se incluya algún filtro que los excluya. 

## Campos calculados

La mayoría de elementos del catálogo serán campos existentes en las tablas de la base de datos, y por lo tanto podremos crearlos arrastrándolos directamente desde el diagrama a la _vista catálogo_. Sin embargo, en ocasiones necesitamos hacer algún cálculo o transformación adicional.

Desde las propiedades de un elemento de negocio (dimensión, indicador o filtro) podemos establecer la definición **Crono SQL** de dicho elemento. Podemos utilizar cualquier código SQL que admita la base de datos (incluyendo las funciones **Crono SQL** propias de Crono).

Por ejemplo, si se quiere que el nombre del *responsable comercial* se muestre siempre en mayúsculas (independientemente de cómo esté guardado en la base de datos) podemos utilizar la función **upper**:

![image-20200302181754134](/images/calculos01.png)



Crono detectará automáticamente el tipo de datos y si la fórmula corresponde a una dimensión, un indicador, o un filtro.

![image-20200302182217992](/images/calculos02.png)

Se pueden crear indicadores que utilicen distintas columnas (incluso si esas columnas están en diferentes tablas). Por ejemplo, podemos crear el "Importe €" multiplicando el precio unitario por las unidades vendidas:



![image-20200302183229972](/images/calculos03.png)



Tal como se muestra en la imagen anterior, hemos de utilizar el identificador completo de la columna: _[nombre de la tabla].[nombre del campo]_. **Crono** utilizará esta información para detectar las tablas necesarias y generar la consulta correspondiente.

Es posible definir elementos calculados a partir de los elementos existentes en el catálogo. Por ejemplo, podemos crear el indicador **Precio medio** a partir de los indicadores existentes **Importe €** y **Unidades vendidas**.



![image-20200302183927161](/images/calculos04.png)



En este ejemplo, se ha utilizado la función Crono SQL `divide`. Esta función realiza el cociente de los dos valores cuando el denominador no es cero. Es decir, evita el problema de la "división entre cero".

El usuario podrá utilizar todos estos indicadores del mismo modo que utiliza el resto de elementos del catálogo. **Crono** detectará las tablas necesarias y generará la consulta correspondiente.

![image-20200302184402723](/images/calculos05.png)



## Filtros predefinidos

Además de dimensiones e indicadores en el catálogo se pueden definir **filtros predefinidos**. Se trata de filtros habituales que el usuario puede reutilizar fácilmente. Por ejemplo, se pueden crear filtros para el _"Año actual"_, _"Tiendas de España"_, o _"Clientes morosos"_. Cualquier predicado SQL puede ser un **filtro predefinido**.

En el catálogo los filtros se muestran con un icono característico:

![image-20200302205150807](/images/calculos06.png)



Los filtros predefinidos son un elemento de negocio igual que las dimensiones o indicadores. La única diferencia es que su definición SQL corresponde a un predicado SQL.

![image-20200302210802520](/images/calculos07.png)



Crono detectará automáticamente que se trata de un filtro y utilizará el icono correspondiente.

Al ser simples expresiones SQL, se puede utilizar cualquier fórmula que reconozca el motor de base de datos. Podemos, por ejemplo, definir este filtro para seleccionar datos del año actual:

![image-20200302211044646](/images/calculos08.png)

En la definición de los filtros se puede utilizar cualquier expresión **Crono SQL** válida. En el ejemplo anterior se han utilizado las funciones `year`y `getdate`. También se hace referencia a la dimensión `Año`definida en el catálogo.  


## Tablas agregadas

Ejecutar una consulta contra una tabla de hechos con decenas de millones de registros puede ser costoso. Para resolver esta problemática es habitual crear **tablas agregadas** que contengan la misma información pero más agrupada (por ejemplo, además de tener las ventas tickets a ticket, podemos tener una tabla con las ventas diarias, o por producto...).

**Crono** es capaz de aprovechar la existencia de **tablas agregadas** escogiendo en cada ocasión la tabla más conveniente según la consulta del usuario.

Una misma tabla de hechos puede tener varias tablas agregadas (por ejemplo, podríamos tener un resumen diario y un resumen mensual...)

Definir una tabla agregada en **Crono Metadata** es muy sencillo:

1. Se tiene que definir el diagrama de la tabla de hechos agregada
2. Se tiene que indicar cuál es la tabla de hechos detallada.



### Diagrama de la tabla agregada

El diagrama de la tabla agregada se crea exactamente igual que el diagrama de cualquier otra tabla de hecho (ver [Cómo crear un diagrama](#como-crear-un-diagrama)).

El ejemplo de *LA BIBLIO* tiene una tabla `dbo.LB_VENTAS_DIARIAS`que contiene un resumen de las ventas día a día de cada tienda (sin el detalle de producto). La siguiente imagen muestra el diagrama de la tabla detallada (`dbo.LB_VENTAS`) y el de la tabla agregada (`dbo.LB_VENTAS_DIARIAS`).

![image-20200303005454326](/images/catalogo19.png)

Los dos diagramas comparten las tablas de dimensión, exceptuando la dimensión `dbo.LB_LIBROS`que solo aparece en primer diagrama. **Crono** utilizará esta información para utilizar la tabla detallada solamente cuando se pida información de los libros. En cualquier otro caso, será preferible utilizar la tabla agregada.

### Propiedades de la tabla agregada

Para que **Crono** utilice la tabla agregada se debe indicar cual es su tabla de detalle desde la ventana de propiedades:

![image-20200303010911577](/images/catalogo20.png)

Desde _"Propiedades de tabla"_ podemos especificar también el número de registros aproximado de cada tabla. Esta información solo es relevante cuando existen varias tablas agregadas. En ese caso, **Crono** utilizará la tabla más pequeña entre todas las posibles.

Es importante que los campos de la tabla de hechos se llamen igual que los campos de la tabla agregada. En nuestro ejemplo, los campos de ventas son `UNIDADES`y `PVP`y se lllaman igual en ambas tablas.



### Uso de las talas agregadas

El uso de las tablas agregadas es transparente para el usuario. El usuario realizará la consulta arrastrando las dimensiones e indicadores del catálogo y **Crono** generará la mejor consulta posible.

Por ejemplo, si no existiese la tabla agregada, y el usuario pidiese las ventas mensuales del año 2012, Crono generaría la siguiente consulta:



```sql
SELECT
  LB_MESES.ANYO AS [Año],
  LB_MESES.NOMBRE_MES AS Mes,
  sum(LB_VENTAS.UNIDADES) AS [Unidades vendidas]
FROM dbo.LB_VENTAS LB_VENTAS
INNER JOIN dbo.LB_TIEMPO LB_TIEMPO ON (LB_VENTAS.FECHA=LB_TIEMPO.FECHA)
INNER JOIN dbo.LB_MESES LB_MESES ON (LB_TIEMPO.ANYO=LB_MESES.ANYO AND LB_TIEMPO.MES=LB_MESES.MES)
WHERE LB_MESES.ANYO=2012
GROUP BY
  LB_MESES.ANYO,
  LB_MESES.NOMBRE_MES
```

En cambio, con la tabla agregada correctamente definida la misma consulta del usuario generará este código SQL:

```sql
SELECT
  LB_MESES.NOMBRE_MES AS Mes,
  sum(LB_VENTAS_DIARIAS.UNIDADES) AS [Unidades vendidas]
FROM dbo.LB_VENTAS_DIARIAS LB_VENTAS_DIARIAS
INNER JOIN dbo.LB_TIEMPO LB_TIEMPO ON (LB_VENTAS_DIARIAS.FECHA=LB_TIEMPO.FECHA)
INNER JOIN dbo.LB_MESES LB_MESES ON (LB_TIEMPO.ANYO=LB_MESES.ANYO AND LB_TIEMPO.MES=LB_MESES.MES)
WHERE LB_MESES.ANYO=2012
GROUP BY LB_MESES.NOMBRE_MES
```



En ambos casos el resultado será el mismo (siempre y cuando la tabla agregada esté correctamente cargada).


## Validar catálogo

Existen tres herramientas principales para validar la correcta definición del catálogo:

1. Probar catálogo desde **Crono Metadata**
2. Herramientas de verificación
3. Probar catálogo desde **Crono Analysis**



### Probar catálogo desde Crono Metadata

Sin salir de **Crono Metadata** podemos validar el catálogo haciendo clic en **"Probar catálogo"**. 

![image-20200302163939334](/images/catalogo11.png)

Se nos abrirá el **editor de consultas** y podremos comprobar que el catálogo devuelve información y que genera correctamente las consultas.

Para ello, desde la **vista diseño** podemos arrastrar algunas columnas e incluir algún filtro:

![Probar catálogo](/images/probar.gif)

![image-20200302163049724](/images/catalogo8.png)

Desde la **vista SQL**  podemos ver el código SQL generado por Crono:

![image-20200302163446400](/images/catalogo9.png)

Desde la **vista tabla** podemos ver los datos devueltos por la base de datos:

![image-20200302163734757](/images/catalogo10.png)



### Herramienta de verificación de catálogo

**Crono Metadata** incluye una herramienta para validar la estructura del catálogo.

![image-20200302212259847](/images/catalogo17.png)



Al hacer clic en el botón **Verificaciones** se abre la siguiente ventana:



![image-20200302223932860](/images/catalogo18.png)



Además de poder consultar los elementos del catálogo, el panel de verificaciones nos permite verificar:

- **Tablas:** Verifica que la estructura de las tablas coincide con la estructura física de la base de datos. Esto nos permite detectar nuevos campos, claves, o detectar tablas o campos que ya no existen.
- **Catálogo:** Verifica que los elementos de negocio están bien definidos. Es decir, que no incluyen errores de sintaxis y que todos los campos referenciados existen realmente en el modelo de datos.
- **Relaciones.** Que la las relaciones entre las tablas no pierden ni duplican registros.



### Probar catálogo desde Crono Analysis

Además de verificar el catálogo desde **Crono Metadata**, podemos probarlo también desde **Crono Analysis**. Para ello, los pasos a seguir son:

- Desde **Crono Metadata** guardamos el catálogo en una ubicación conocida (se generará un archivo con la extensión *.metadata*)

- Abrimos Crono Analysis, y hacemos clic en **Archivo**, **Nuevo documento**.

- Nos aparecerá la ventana **"Seleccionar catálogo"** y seleccionaremos el fichero .metadata desde la **vista "Catálogo local"**.

  

Al seleccionar el catálogo, se abrirá la ventana principal de Crono Analysis con un informe en blanco.

![image-20200302165950154](/images/catalogo12.png)

A modo de ejemplo, para probar el correcto funcionamiento del catálogo arrastraremos "Tienda" y "Unidades vendidas" al informe. También arrastraremos el valor "2012" de la lista de valores de "Año" a la zona de filtros.

![image-20200302170643441](/images/catalogo13.png)

Ahora podemos crear más consultas, o nuevas hojas, gráficos, o cualquier otra funcionalidad de **Crono Analysis**.

Si modificamos el catálogo desde **Crono Metadata** tendremos que hacer clic en **Actualizar informe** para que se reflejen los cambios.

![image-20200302171056289](/images/catalogo14.png)


## Parámetros definidos en el catálogo


**Crono Metadata** permite definir parámetros variables que el usuario tendrá que establecer antes de utilizarlos.

### Ejemplo



En la definición de los elementos del catálogo podemos utilizar expresiones y fórmulas para filtrar, por ejemplo, el año actual, el año 2012, o cualquier otro.

Para filtrar el _"año actual"_ utilizaríamos la expresión `[Año]=year(getdate())`y para filtrar el año 2019 definiríamos el filtro como `[Año]=2019`, por ejemplo.





![image-20200304210605938](/images/parametros1.png)



**Crono Metadata** permite definir también filtros que dependen de un parámetro variable. Podríamos definir el filtro _"Año X"_ como `[Año]=@AñoX`. De este modo, el filtro es variable y **Crono Analysis** preguntará el año que quiere seleccionar cuando utilice este elemento del catálogo.

![Ejemplo uso parámetros](/images/parametros2.gif)



Para crear en el catálogo un elemento de negocio que utilice parámetros variables solo es necesario incluir una variable (precedida por el símbolo `@`) en la expresión SQL. Si la variable no se ha definido todavía, **Crono Metadata** nos permitirá crearla en ese mismo momento.

![Definir el filtro Año X](/images/parametros3.gif)



La variable así definida se puede reutilizar en otros elementos de negocio. Podríamos, por ejemplo, definir el indicador _"Importe año X €"_ con la expresión `[Importe €] where (Año=@AñoX)`.



Este tipo de parámetros son útiles, por ejemplo, cuando el usuario necesita comparar las ventas del año actual respecto la de los años anteriores, y donde el usuario quiere poder seleccionar el año respecto al que compararlo.

  

### Propiedades de catálogo

En la vista parámetros de las propiedades del catálogo podemos ver todos los parámetros definidos:

![image-20200304213238967](/images/parametros4.png)

También podemos modificar los parámetros definidos abriendo sus propiedades:

![image-20200304213347579](/images/parametros5.png)

Podemos introducir o modificar la siguiente información:

- **Parámetro:** Es el nombre del parámetro. Debe ser un identificador válidos precedido por el símbolo `@`.

- **Texto:** Es el texto que se le mostrará al usuario cuando tenga que establecer el valor de este parámetro.

- **Tipo de dato:** Es importante establecer el tipo de dato correcto (numérico, texto, fecha o booleano)

- **Lista de valores:** Opcionalmente, se puede indicar una lista de valores que se le mostrará al usuario. De este modo, podrá establecer el valor más fácilmente.

- **Valor por defecto:** Es el valor predeterminado que tendrá el parámetro. 

  

### Tipos de parámetros variables

Existen tres tipos de parámetros variables:

- **Parámetros de usuario:** El usuario podrá establecer el valor del parámetro
- **Parámetros calculados:** El valor se establece a partir de una expresión. No se le preguntará al usuario.
- **Elementos de negocio parametrizables:** El usuario podrá escoger entre una lista de indicadores existentes.



#### Parámetros de usuario

Son los más habituales.

![image-20200304213347579](/images/parametros5.png)

#### Parámetros calculados

En este caso, el usuario no podrá establecer el valor del parámetro, ya que lo calculará la base de datos a partir de una expresión SQL preestablecida.

![image-20200304214619210](/images/parametros6.png)

#### Elementos de negocio parametrizables

En lugar de establecer un valor el usuario tendrá que escoger un elementos de negocio de una lista. 

![image-20200304215755945](/images/parametros7.png)



De este modo, el usuario podrá crear un informe para un indicador genérico, y actualizarlo para cualquiera de los indicadores disponibles, sin necesidad de rehacer el informe múltiples veces.



![image-20200304220024511](/images/parametros8.png)

## Catálogos multidioma

**Crono Metadata** permite traducir los elementos de negocio a distintos idiomas. De este modo, el usuario podrá realizar o consultar los informes con su propio idioma, y todas las delegaciones del mundo pueden compartir un mismo catálogo y una misma terminología.

### Propiedades de catálogo

Desde la vista general de las propiedades de catálogo se puede definir el idioma principal (y predeterminado) del catálogo y el listado de idiomas secundarios en los que estará disponible.

![image-20200304223013481](/images/multidioma1.png)



### Propiedades de elementos de negocio

Desde las propiedades de cada elemento de negocio podemos proporcionar cada una de las traducciones.

![image-20200304223222731](/images/multidioma2.png)

Actualmente es necesario introducir manualmente cada una de las traducciones para cada uno de los elementos.

### Crono Analysis

El usuario de negocio puede escoger su idioma predilecto desde la barra de estado:

![image-20200304223524522](/images/multidioma3.png)



## Dimensiones geográficas 

**Crono** puede representar sobre un mapa la información del catálogo. Por ejemplo, es posible representar un mapa con un círculo en cada una de las _"Tiendas"_, y el tamaño de ese círculo dependerá del indicador que se está analizando. 

Desde la ventana de propiedades de la dimensión, en la vista "Dimensión geográfica", se debe indicar los campos que contienen la longitud y latitud de cada lugar.

![image-20200304193251992](/images/geo1.png)


También se pueden utilizar mapas personalizados con formas (shapes) predefinidas. Si se dispone de estos mapas, **Crono** permite colorear cada región en función del indicador.



### Longitudes y latitudes

La longitud y la latitud de cada elemento de la dimensión geográfica debe estar almacenada en la base de datos. Para facilitar este trabajo **Crono** facilita [ficheros CSV](https://github.com/bifacil/CronoSupport/tree/master/Resources/CSV) con las coordenadas de:

- Países
- Municipios, provincias y comunidades de España



**Crono ETL** incluye también vistas predefinidas con esta información:

![image-20200304194131547](/images/geo2.png)

Estas vistas se llaman: `Crono$Countries`, `Crono$SpanishCities`,`Crono$SpanishProvinces`y `Crono$SpanishRegions.`

Para más información, consulte el artículo de **Crono ETL** sobre vistas predefinidas .

## Seguridad y permisos de acceso

La seguridad y los permisos de acceso son aspectos importantes que deben valorarse en cualquier proyecto *Business Intelligence*.

En particular, existen varias consideraciones sobre seguridad y accesos que deben tenerse en cuenta al diseñar un catálogo con **Crono Metadata**:

- Distribución del catálogo
- Cadena de conexión
- Seguridad a nivel de fila
- Seguridad a nivel de campo
- Seguridad a nivel de catálogo

**Crono** tiene todas las funcionalidades necesarias para implementar un entorno BI seguro y controlado.

### Distribución del catálogo

El catálogo es un archivo con extensión **.metadata** que contiene información sobre la conexión y la estructura de la base de datos.

El usuario de negocio necesita acceso al catálogo para realizar los informes. Para ello, existen tres modos de distribuirlo:

- **Local:** El archivo se comparte con el usuario mediante una copia en su equipo o depositándolo en una carpeta compartida. En este caso, no se necesita servidor, y es el ordenador del usuario el que realiza directamente las consultas a la base de datos.
- **Nube:** El archivo se comparte a través de un servicio en la nube. Actualmente **Crono** permite leer y escribir el catálogo en los servicios de **Amazon S3** y **Github**. En este caso, tampoco se necesita servidor **Crono**, y es también el ordenador del usuario el que realiza directamente las consultas a la base de datos.
- **Servidor Crono:** El archivo está únicamente en el servidor Crono. Los usuarios se conectan al servidor para leer la estructura del catálogo, pero es el servidor **Crono** el que finalmente ejecuta las consultas. Los usuarios no tienen acceso a la cadena de conexión ni ésta se transmite por la red.

Las instalaciones en "local" y en la "nube" tienen la ventaja de la facilidad de instalación, pero no permiten el control de usuario, ni la seguridad a nivel de campo.

La instalación en un servidor **Crono** permite un control total sobre la información a la que puede acceder cada usuario.

Vea la documentación de **Crono Server** para mayor información.

### Cadena de conexión

El catálogo contiene la información de conexión (servidor, base de datos, usuario y password), salvo que se utilice una conexión de equipo.

Alguien con acceso a esta información podría conectarse a la base de datos desde un terminal. Por este motivo, se recomienda utilizar siempre que sea posible **autentificación Windows**, y utilizar un usuario que tenga acceso de **solo lectura**, y solo a las tablas estrictamente necesarias, y a ninguna con información confidencial. Es decir, se recomienda controlar desde la base de datos el acceso a los datos en función del usuario conectado. De este modo, los datos están protegidos, independientemente del cliente de acceso que utilicen (**Crono** u otro).

Todo lo anterior es especialmente importante en instalaciones en local (o en la nube), ya que en este caso la información de conexión está en el equipo del usuario. En una instalación de servidor la conexión está solo en el servidor, y no se envía a los usuarios, por lo que es más sencillo mantenerla segura.

En resumen: Las consideraciones de seguridad sobre la conexión son las mismas que se harían con cualquier otra herramienta de consulta, y deben seguirse las directrices que cada organización tenga establecidas. 

Para mayor información, vea la documentación sobre [Propiedades de conexión](#propiedades-de-conexion)

### Seguridad a nivel de fila

**Crono** permite controlar los registros que puede consultar cada usuario. Por ejemplo, puede limitarse para que cada director de zona vea solo los datos de su zona, o que los responsables comerciales vean solo la información de sus respectivos clientes. Al mismo tiempo, puede configurarse para que determinados perfiles tengan acceso completo a toda la información.

Para ello han que seguirse estos 3 pasos:

- Crear la *tabla de seguridad* 
- Incluir la *tabla de seguridad* en el diagrama y aplicarle una restricción WHERE
- Configurar la tabla con información confidencial para que consulte siempre la *tabla de seguridad*.

**1. Crear la tabla de seguridad**

La seguridad a nivel de fila se consigue a través de una "tabla de seguridad". En esta tabla se almacena la información que puede ver cada usuario. Esta es la estructura típica de una "tabla de seguridad":

![image-20200305002131034](/images/seguridad1.png)



Una vez configurado, el usuario "Admin" tendrá acceso a la información de las 4 tiendas, mientras que Juan solo podrá ver los datos de las tiendas 3 y 4, y el resto de usuarios solo podrán consultar los datos de una única tienda (cada uno la suya). 

Esta tabla debe estar en la base de datos. Habitualmente es un proceso ETL el encargado de poblar esta tabla en función de las necesidades.

**2. Incluir la tabla de seguridad en el diagrama**

La tabla de seguridad se añade normalmente al diagrama:

![image-20200305003032822](/images/seguridad2.png)



Después, se ha de configurar la "cláusula WHERE" en función del `@user`. Esta variable está siempre disponible y hacer referencia al usuario conectado.

![image-20200305003220335](/images/seguridad3.png)

De esta manera, siempre que una consulta incluya la tabla de seguridad se añadirá la restricción `LB_SEGURIDAD_TIENDAS.USUARIO_WINDOWS=@user`, donde `@user`es el nombre del usuario conectado.

**3. Configurar la tabla con información confidencial**

Finalmente, hay que indicar que siempre que se haga una consulta de *ventas* -que es la información que se quiere proteger en este ejemplo- se incluya la *tabla de seguridad* en la consulta.

Esto se hace desde las propiedades de la tabla de ventas:

![image-20200305003756485](/images/seguridad4.png)



De este modo, por ejemplo, si el usuario **MyORG\Juan** consulta las ventas por año, **Crono** generará esta consulta, y la base de datos solo devolverá la información de las tiendas de **MyORG\Juan**.

```sql
SELECT
  LB_MESES.ANYO AS [Año],
  sum(LB_VENTAS.UNIDADES) AS [Unidades vendidas]
FROM dbo.LB_VENTAS LB_VENTAS
INNER JOIN dbo.LB_TIEMPO LB_TIEMPO ON (LB_VENTAS.FECHA=LB_TIEMPO.FECHA)
INNER JOIN dbo.LB_MESES LB_MESES ON (LB_TIEMPO.ANYO=LB_MESES.ANYO AND LB_TIEMPO.MES=LB_MESES.MES)
INNER JOIN dbo.LB_TIENDAS LB_TIENDAS ON (LB_VENTAS.ID_TIENDA=LB_TIENDAS.ID_TIENDA)
INNER JOIN dbo.LB_SEGURIDAD_TIENDAS LB_SEGURIDAD_TIENDAS ON (LB_TIENDAS.ID_TIENDA=LB_SEGURIDAD_TIENDAS.ID_TIENDA)
WHERE LB_SEGURIDAD_TIENDAS.USUARIO_WINDOWS='MyORG\Juan'
GROUP BY LB_MESES.ANYO

```

La "seguridad de fila" se puede implementar tanto en las instalaciones de servidor como en las locales (o en la nube).



### Seguridad a nivel de campo

El usuario de **Crono Analysis** accede a las tablas a través de los elementos del catálogo y no directamente a un campo particular. Por ello, lo que debe controlarse son los accesos a los elementos de negocio. Esto se hace desde la ventana de propiedades, en la vista "Autorizaciones":

 

![image-20200305010730736](/images/seguridad5.png)

Desde esta pantalla se pueden conceder o denegar accesos a usuarios o grupos. Los permisos se evalúan secuenciamente. En caso de asignaciones contradictoria prevalece el último de la lista.

En este ejemplo, el departamento "Comercial" no puede acceder a este elemento de negocio, excepto "Pedro". El grupo de "Dirección" también puede acceder, incluso si comparte el rol de "Comercial".

Los permisos también pueden definirse a nivel de carpeta. Si se restringe el acceso a una carpeta a un usuario, dicho usuario no podrá acceder a ninguno de sus indicadores.

**IMPORTANTE:** Estas restricciones no aplican en una instalación en local o en nube. Solo el **servidor Crono** tiene en cuenta la configuración de permisos.



### Seguridad a nivel de catálogo

En propiedades de catálogo pueden configurarse los permisos de acceso al catálogo. Si alguien no tiene acceso al catálogo, no lo verá en su lista de catálogos, y no podrá acceder a ninguno de sus elementos.

 ![image-20200305011715511](/images/seguridad6.png)

**IMPORTANTE:** Estas restricciones no aplican en una instalación en local o en nube. Solo el **servidor Crono** tiene en cuenta la configuración de permisos.

## Propiedades de catálogo

El botón "Propiedades de catálogo" abre la ventana de propiedades:

![image-20200303131435279](/images/propiedades-catalogo.png)

### Vista "General"

![image-20200303131526683](/images/propiedades-catalogo2.png)



La vista general muestra la siguiente información:



- **Nombre:** Es el nombre del catálogo y coincide siempre con el nombre del archivo. Es el nombre que seleccionará el usuario para crear informes a partir de este catálogo.
- **Dialecto SQL:** Es el dialecto que empleará **Crono** para generar consultas. Es relevante porque no todos los motores de base de datos soportan las mismas funcionalidades ni utilizan los mismos caracteres para "encorcherar" identificadores.
- **Idioma principal**: Es el idioma en que se definen las dimensiones e indicadores del catálogo. **Crono** utiliza está información para acentuar automáticamente las palabras al arrastrar los campos de la base de datos al catálogo. También es relevante en los "Catálogos multidioma" .
- **Idiomas secundarios**: Ver [Catálogos multidioma](#catalogos-multidioma)

- **Filtro de tablas visibles**: Permite filtrar las tablas que se verán en la vista "Base de datos". Resulta útil cuando la base de datos tiene muchas tablas que no son relevantes a la hora de crear este catálogo. Se permite el uso de filtros con comodín (`dbo.dim_*`, `!*tmp*`, etc..)
- **Evitar incluir tablas...**: Esta opción no tiene ninguna funcionalidad actualmente.
- **Tipo de filtro de columna**: Indica el modificador que utilizará **Crono Analysis** para crear los filtros de columna. Esto es relevante para bases de datos que no soportan la sintaxis consultas CTE (sintaxis `WITH`)

### Vista "Parámetros"

Ver el artículo sobre [Parámetros definidos en el catálogo](#parametros-definidos-en-el-catalogo)

![image-20200303133230646](/images/propiedades-catalogo3.png)

### Vista "Autorizaciones"

Vea el artículo sobre configuración de seguridad.


## Propiedades de conexión

Desde las propiedades de conexión se configura la cadena de conexión para conectarse a la base de datos.

El formulario tiene cuatro tipos de conexión:

- SQL Server
- Genérica
- Crono Server
- Conexión de equipo

El botón "Verificar conexión" permite validar que los datos introducidos son correctos y que **Crono** puede conectarse con la base de datos.

![image-20200305023320405](/images/conexion6.png)

### SQL Server

Si la base de datos donde se encuentra tu información es **SQL Server**, simplemente complete la información de conexión (servidor, base de datos y usuario).

![Configurar conexión](/images/configurar-conexion.png)



### Genérica

Si el servidor no es SQL Server, se debe introducir la cadena de conexión propia de cada base de datos. Se puede escribir la cadena directamente o se puede utilizar el asistente.

![image-20200305020249865](/images/conexion2.png)

Pulsando el boton de edición se abre el asistente de Windows para configurar la cadena de conexión. Seleccione el "data source" adecuado y complete la información.

![image-20200305020702783](/images/conexion3.png)

Si configura un origen de datos ODBC tenga en cuenta que la arquitectura de **Crono** debe coincidir con la arquitectura del ODBC. 

Los productos **Crono** están disponibles tanto en arquitectura de 64 bits como de 32 bits.

### Crono Server

Esta vista no es relevante desde **Crono Metadata**

### Conexión de equipo

Existe la posibilidad de guardar la conexión en una carpeta del equipo. 

En este caso, la conexión no está en el fichero `.metadata`, si no que se guarda junto al resto de la configuración de **Crono** (por defecto en: `C:\Users\[USUARIO]\AppData\Roaming\Crono\common.userdata`)





![image-20200305021451935](/images/conexion4.png)



Pulsando el botón "Nueva conexión" puede añadir conexiones a la lista. El formulario es idéntico aunque en este caso se ha de introducir el **"Nombre de la conexión"**.



![image-20200305021639871](/images/conexion5.png)



Las conexiones de equipo tienen varias utilidades:

- Permiten reutilizar una misma conexión entre distintos catálogos
- Permiten que un mismo catálogo se conecte a bases de datos diferentes en función del equipo desde donde se usa. Por ejemplo, para que los desarrolladores se conecten a una base de datos de pruebas, mientras el servidor se conecta a la base de datos de producción.
- El catálogo no tiene la conexión, por lo que puede enviarse o compartirse sin comprometer la seguridad de la información.

La principal desventaja de las conexiones de equipo es que debe definirse la conexión en el equipo de cada uno de los usuarios. (salvo que los usuarios se conectan a través de un **Crono Server**).

## Propiedades de elemento de negocio

Desde el menú contextual de un elemento de negocio (indicador, dimensión o filtro) se puede acceder a sus propiedades.

![image-20200303173955817](/images/propiedades-elemento1.png)

### Vista "Definición"

Se pueden definir las siguientes propiedades:

- **Nombre:** Es el nombre de la dimensión, indicador, o filtro. Es el nombre que verá el usuario para identificar la información. Es importante que sea un término de negocio reconocible.
- **Expresión SQL:** Es la definición SQL de este elementos de negocio. **Crono** analizará la expresión para determinar si se trata de una dimensión, de un indicador o de un filtro. La expresión puede ser un campo de la base de datos, o cualquier expresión SQL válida. Para más información vea el artículo [Campos calculados](#campos-calculados)
- **Tipo de dato:** Crono analizará la expresión para determinar si el resultado es una cadena de texto, un número, una fecha o un booleano.

El botón **"Verificar"** comprueba que no exista ningún error de sintaxis. También verifica que los campos referenciados existen realmente en el modelo de datos.

### Vista "Formato"

Desde la vista formato se define el formato predeterminado de cualquier indicador o dimensión. 

![image-20200303175303897](/images/propiedades-elemento2.png)

Además de los formatos habituales (números con decimales, fechas, porcentaje, ...) existen algunos casos particulares:

- El formato **"hipervínculo"** muestra el texto de la expresión como un enlace web. La página destino del enlace se define desde la vista "Información adicional"
- El formato **"Duración"** convierte un número en un formato `d.h.min.seg`. El valor numérico corresponde a los _segundos_ del intervalo.

## Vista "Avanzadas"

Permite configurar el color predeterminado de la celda y la fuente.



![image-20200303180056137](/images/propiedades-elemento3.png)

Desde este panel también se puede definir un formato condicional para el indicador (por ejemplo, que se muestre rojo si es negativo, etc.)

![image-20200303180316954](/images/propiedades-elemento4.png)



Esta vista también muestra una opción para "mostrar texto en ventana independiente al hacer doble clic". Esto es útil para que el usuario pueda leer el texto completo de aquellos textos lagos que no caben en una celda.

### Vista "Lista de valores"

Vea [Listas de valores](#listas-de-valores).

![image-20200303180741817](/images/propiedades-elemento5.png)

 ### Vista "Dimensión geográfica"

Vea [Dimensiones geográficas](#dimensiones-geograficas)

![image-20200303180933031](/images/propiedades-elemento6.png)

### Vista "Información adicional"

Permite configurar la siguiente información:

- **Tipo de elemento:** De manera predeterminada, **Crono** representa las dimensiones como una bola azul y los indicadores como una bola roja. Desde aquí se puede cambiar este icono para un elemento en particular. Se trata solo de una ayuda visual y no afecta a las consultas generadas ni al tipo de dato. Puede servir, por ejemplo, para identificar las fechas con un icono característico.
- **Documentación URL:** Puede asociar cada elemento con una dirección web (por ejemplo, con una aplicación MDM). Los usuarios podrán acceder a esta documentación desde el menú contextual del elemento.
- **Descripción:** Se puede asociar una pequeña descripción a cada elemento. El usuario verá esta información en forma de _tooltip_. Esta opción debe usarse para aclarar el significado de la dimensión, indicador o filtro, o para especificar particularidades relevantes para el negocio. 
- **Hipervínculo:** Es el campo que contiene la dirección web donde se redirigirá el usuario al hacer clic en el enlace (esta propiedad solo es relevante si el formato del elemento es "hipervínculo").
- **Modo hipervínculo**: Si el formato del elemento es "hipervínculo", aquí se especifica la acción web que se realizará al hacer clic en el enlace. 
- **Agregación predeterminada**: Indica la agregación en los subtotales de **Crono Analysis** de este indicador. Se utiliza sobre todo para evitar que se sumen indicadores que no son sumables.

![image-20200303181049398](/images/propiedades-elemento7.png)

### Vista "Idioma"

Vea el artículo sobre [Catálogos multidioma](#catalogos-multidioma)

## Propiedades de tabla

Desde el menú contextual de una tabla del diagrama podemos acceder a las **Propiedades de tabla**

![image-20200303102535320](/images/propiedades-tabla1.png)

### Vista "Propiedades"

En la vista propiedades se puede configurar:

- El **alias** de la tabla. Se trata de un nombre alternativo para la tabla. Sirve para poder utilizar varias veces la misma tabla para entidades diferentes. Por ejemplo, una cosa es el *"País del cliente"* y otra es el *"País de la tienda"*.
-  **Tablas adicionales**. Sirve para forzar que el SQL generado incluya alguna tabla adicional cuando se haga referencia a algún campo de la tabla. Se usa por ejemplo para forzar la inclusión de la **tabla de seguridad** que filtre la información en función del usuario conectado.
- **Cláusula WHERE**. Si se define una cláusula WHERE en la tabla, se incluirá siempre en las consultas que hagan referencia a esta tabla.
- **Tabla de detalle** (ver [Uso de tablas agregadas](#tablas-agregadas))
- **Número de registros** (ver [Uso de tablas agregadas](#tablas-agregadas))

![image-20200303103757808](/images/propiedades-tabla2.png)

### Vista "Tabla de tiempo"

Prácticamente todos los catálogos de **Crono Metadata** incluyen una tabla de tiempo. La tabla de tiempo es un maestro de fechas que incluye información como el nombre del mes, el trimestre, etc.

Desde esta vista se configuran los campos *Año*, *Trimestre* y *Mes*. Esta información se usa exclusivamente en las consultas que emplean las funciones de tiempo `TD`, `YTD`, `QTD` y `MTD`. 

![image-20200303104015471](/images/propiedades-tabla3.png)



### Vista "Referencias"

Esta vista es meramente informativa. Muestra los diagramas donde aparece esta tabla y los elementos de negocio que incluyen referencias a la tabla seleccionada.

![image-20200303104757121](/images/propiedades-tabla4.png)



Esta información también se muestra en el diagrama:

![image-20200303105038466](/images/propiedades-tabla5.png)

### Vista "Campos"

 Muestra los campos y las claves externas de la tabla.

![image-20200303105327814](/images/propiedades-tabla8.png)

En esta vista, los campos que se utilizan en el catálogo se resaltan con color verde.

### Vista "Ver valores"

Esta vista permite ver los valores de la tabla.

![image-20200303105646799](/images/propiedades-tabla6.png)



### Vista "Copos de nieve"

Esta vista es informativa. Muestra el listado de diagramas donde aparece esta tabla.

![image-20200303105843909](/images/propiedades-tabla7.png)


## Propiedades de relación

Desde el menú contextual de una relación del diagrama podemos acceder a sus propiedades:

![image-20200303115203654](/images/propiedades-relacion1.png)



Las relaciones (o `JOINs`) sirven para combinar las filas entre dos tablas. Existen dos tipos principales:

- **INNER JOIN**: Devuelve las filas de la izquierda que tienen correspondencia en la tabla derecha
- **LEFT JOIN**: Devuelve todas las filas de la izquierda, tengan o no tengan correspondencia en la tabla derecha.

Definir correctamente las relaciones del diagrama es fundamental para el correcto funcionamiento del catálogo. Por ello es recomendable seguir estas prácticas siempre que sea posible:

- Las relaciones deben ser entre la clave primaria de una tabla (PK) y la clave foránea de la otra (FK). Es decir, las relaciones (constraints) deben estar definidas en la base de datos.
- Utilizar una relación **LEFT JOIN** si los campos clave de la tabla de detalle admiten nulo. 

Si se siguen estas dos recomendaciones la relación nunca perderá ni duplicará registros. Es decir, por ejemplo, cada venta tendrá asociada una fecha (y solo una), una tienda (y solo una) y un libro (y solo uno).

Por lo tanto:

- Si cada venta debe estar asociada a una tienda, el campo `ID_TIENDA`no debe admitir nulos (debe ser `NOT NULL`) y se debe emplear la relación `**INNER JOIN**.`
- Si, en cambio, el modelo de negocio admitiera ventas sin libros, entonces el campo `ID_LIBRO` debe ser nulable y se debe emplear un `**LEFT JOIN**`.

Si el modelo definido en **Crono Metadata** coincide con el modelo físico de la base de datos evitaremos que el usuario de negocio termine obteniendo información errónea.

De todos modos, conviene destacar que **Crono Metadata** no exige la existencia de las restricciones `NULL` o `NOT NULL`. Tampoco exige que las tablas tengan claves primarias y/o claves foráneas. Se trata, simplemente, de recomendaciones y buenas prácticas que deberían seguirse al diseñar el modelo de datos.

![image-20200303122224651](/images/propiedades-relacion2.png)



### Verificar relaciones

La ventana de propiedades de relación tiene un botón para validar la relación. Esta funcionalidad permite comprobar si se pierden o duplican registros.

### Diagrama

El color y la forma de la relaciona del diagrama muestra algunas características importantes de la relación.

- Las relaciones **LEFT JOIN** se muestran con líneas discontinuas
- Las relaciones que no están verificadas se muestran de color negro 
- Las relaciones que están verificadas se muestran de color verde
- Las relaciones que tienen restricciones PK-FK son gruesas (y son siempre de color verde)
- Las relaciones **INNER JOIN**, con PK-FK, pero que admiten nulos se señalan de color verde oscuro (como advertencia que pueden perderse registros)



![image-20200303123212270](/images/propiedades-relacion3.png)



## Propiedades de columna

Desde el menú contextual de una columnase puede acceder a sus propiedades:

![image-20200303125239130](/images/propiedades-columna1.png)



### Vista "Elementos de negocio"

Muestra los elementos del catálogo que hacen referencia a esta columna.

![image-20200303125404628](/images/propiedades-columna2.png)

### Vista "Campos equivalente"

Esta vista permite identificar campos que tienen el mismo significado o contenido. Actualmente esta funcionalidad es meramente informativa (no tiene ninguna utilidad).

![image-20200303125612227](/images/propiedades-columna3.png)

### Vista "Ver valores"

Muestra los distintos valores que tiene la columna. También muestra el número de registros de cada valor.

![image-20200303125916447](/images/propiedades-columna4.png)