---
pageClass: custom-page-analysis
sidebar: auto
title: Manual Crono Analysis
position: 1
---

<breadcrumb parents="Crono Analysis"/>

# Crono Analysis





## Introducción a Crono Analysis


### Estructura del documento

**Crono Analysis** es la herramienta de usuario para realizar consultas, informes y análisis libre. 

Un **documento** de Crono Analysis contiene múltiples **informes**. Cada informe está formado por una o varias **hojas** con **tablas y gráficos** con la información que se quiere representar.


![Estructura Documento](/images/analysis/EstructuraDocumento.png)

::: tip RECUERDA

Un documento de Crono contiene informes. Cada informe tienes una o varias hojas, y cada hoja tiene varias consultas que se visualizan como tablas o gráficos.

:::

Una carecterística importante de los documentos de **Crono** es que los paneles están relaiconados entre sí. Al seleccionar un valor en un panel, la selección se arrastrará al resto de paneles. Esta manera de consultar la información permite navegar por los datos de una manera sencilla, rápida y dinámica

![Propagación](/images/analysis/Propagacion.png)

De manera predeterminada, la selección se arrastra a los paneles situados a su izquierda y a los paneles inferiores. Este comportamiento se puede modificar definiendo el [modo de propagación](#modo-de-propagacion)

La generación de estos informes es sencilla gracias al **catálogo** que organiza la información disponible y facilita la creación de las consultas.

### Catálogo

El **catálogo** de Crono es el diccionario de atributos e indicadores que se pueden utilizar en los informes. 

- Cada documento de **Crono Analysis** utiliza un único catálogo.
- El **catálogo** lo crea habitualmente el departamento de IT, incluyendo la información que necesitan los usuarios de negocio.
- Una vez creado el **catálogo**, es sencillo crear consultas e informes, y el propio usuario de negocio puede crear los documentos si es preciso (y sin necesidad de conocimientos técnicos).
- Un **catálogo** está formado por indicadores, dimensiones y filtros organizados jerárquicamente mediante carpetas.


![Catálogo](/images/analysis/Catalogo.png)


### Consultas

::: tip RECUERDA

Un consulta se define simplemente a partir de sus **columnas** y sus **filtros**.

:::

- **Columnas**: Cada una de las "columnas" que devolverá la base de datos. Las columnas son dimensiones e indicadores del catálogo. También pueden definirse [columnas calculadas](#columnas-calculadas).
- **Filtros**: Limita o selecciona la información que se mostrará. Por ejemplo, podemos filtrar la consulta para que muestre solo las ventas del "Año 2020" o las ventas del "País ESPAÑA".

La siguiente imagen muestra una consulta con tres columnas y un filtro. En concreto, muestra las ventas en *Unidades* e *Importe* de cada *Tienda* durante el *Año 2011*

![Consulta](/images/analysis/Consulta.png)

A partir de esta consulta, **Crono** genera la sentencia SQL que ejecutará la base de datos, y sin necesidad de que el usuario de negocio conozca la estructura de la base de datos ni el propio lenguaje SQL.

## Cómo crear tu primer informe

Crear un informe es muy sencillo. Los pasos a seguir son:

- Hacer clic en "Nuevo informe" 
- Seleccionar el catálogo a utilizar
- Crear una consulta arrastrando las elementos del catálogo al panel del informe
- Añadir filtros arrastrando desde el catálogo al cuadro de "Filtros de informes"
- Crear nuevos paneles con el botón "Nueva consulta"
- Crear las nuevas consultas arrastrando elementos del catálogo a los distintos paneles
- Añadir columnas calculadas si es necesario
- Personalizar el aspecto cambiando la visualización
- Personalizar el aspecto añadiendo formatos condicionales
- Repetir los pasos anteriores hasta conseguir el aspecto deseado

![Primer informe](/images/analysis/primerinforme.gif)

En los siguientes apartados se describen con mayor detalle estas funcionalidades

## Crear una consulta


## Filtros

### Tipos de filtro

Los filtros son un elemento esencial de todas las consultas. Permiten seleccionar los datos de un año determindo o las ventas de unos determinados productos, por ejemplo.

Existen tres tipos de filtro:

- **Filtros de informe**: Se aplican en todos las consultas de las hojas seleccionadas. 
- **Filtros de consulta**: Se aplican solo en una consulta determinada y en todos sus consultas dependientes.
- **Filtros de columna**: Se aplica exclusivamente a una columna de una consulta en concreto.


![Tipos de filtro](/images/analysis/filtros.png)

La imagen previa muestra el efecto de cada tipo de filtro. 

- El filtro de "Año 2012" aplica a todas las hojas
- El filtro de "ESPAÑA" se aplica sobre la primera consulta, aunque afecta también a la segunda (el filtro se *arrastra*)
- El filtro de "ABACUS" se aplica solo sobre la segunda consulta
- La columna "Unidades ABACUS" de la primera consulta tiene un filtro de columna, por lo que esa columna muestra las ventas de dicha editorial.

### Crear un filtro

Los filtros se crean arrastrando una dimensión desde el catálogo o arrastrando un elemento de la lista de valores.

![Arrastrar filtros](/images/analysis/crearfiltro.png)

Las siguiente animación muestra cómo crear un filtro de informe y cómo crear un filtro de panel:


![Crear filtros](/images/analysis/crearfiltros.gif)

La siguiente animación muestra cómo se añade una nueva columna de "Unidades" y cómo
se añade un filtro sobre esa nueva columna:

![Filtro de columna](/images/analysis/crearfiltrocolumna.gif)

También se pueden crear fitros desde el menú contextual de las consultas. 
De este modo, podemos filtrar directamente algunos de los valores que se muestran en la consulta:

![Arrastrar filtros](/images/analysis/FiltrarDesdeConsulta.png)

### Modificar un filtro

Una vez creado el filtro se puede eliminar o modificar sus características desde el menú contextual:

![Arrastrar filtros](/images/analysis/MenuContextualFiltro.png)

En concreto, desde el menu contextual se puede:

- Establecer las hojas en que deben actuar los filtros de informe
- Abrir el panel de [Propiedades de filtro](#propiedades-de-filtro)
- Localizar el elemento del catálogo que se está filtrando
- Desactivar un filtro. Los filtros pueden estar activos o inactivos. Si están inactivo no afectan a ninguna consulta.
- Eliminar el filtro
- Modificar el elemento o los elementos filtrados


### Propiedades de filtro

Desde la ventana de "Propiedades de filtro" se puede crear o modificar un filtro. 
Existen cuatro modos o vistas para crear filtros:

- **Selección simple:** Para seleccionar un único valor de la lista de valores (por ej. "Tienda BERNABEU")
- **Selección múltiple:** Para seleccionar varios valores de la lista de valores (por ej. "Tienda BERNABEU o LYON")
- **Operadores avanzados** Para seleccionar valores mediante operadores avanzados (mayor que, menor que, distinto, empieza por, etc.)
- **Fórmula avanzada**: Permite definir el filtro mediante una expresión Crono SQL (se pueden utilizar cualquier función y operador soportado por el lenguaje o la base de datos)


::: tip RECUERDA
Aunque la ventana de filtros permite muchas opciones raramente se utilizan. Prácticamente siempre se debe utilizar el filtro simple o el filtro múltiple. El uso excesivo de filtros avanzados suele ser indicador de un diseño del catálogo deficiente.
:::



![Propiedades de filtro](/images/analysis/PropiedadesFiltro.png)

El modo de "Operadores avanzados" permite utilizar distintos tipos de operadores:

- Operadores de igualdad (Igual, Distinto, En la lista, Fuera de la lista)
- Operadores de orden (mayor que , menor que, mayor o igual que, etc.)
- Operadores de texto (contiene, comienza por, termina por, como el patrón, etc.)
- Operadores de nulidad (es nulo, no es nulo)
- Operadores de subconsulta (que, no que, en subconsulta, no en subconsulta)

La ventana de "Operadores avanzados" incluye también la posibilidad de introducir manualmente
los valores (o pegarlos desde el cortapapeles). Esta opción es útil cuando se necesita filtrar 
códigos largos y buscarlos en la lista de valores puede resultar complicado.

![Operadores avanzados](/images/analysis/OperadoresAvanzados.png)

Finalmente, se pueden definir filtros mediante el modo de "Fórmulas avanzadas". Este modo permite escribir 
el predicado mediante una expresión Crono SQL (utilizando funciones de base de datos, si es necesario).

![Filtro mediante fórmula](/images/analysis/FormulaAvanzada.png)

::: tip RECUERDA
El uso excesivo de filtros avanzados suele ser indicador de un diseño del catálogo deficiente.
:::


## Columnas calculadas

Además de las dimensiones e indicadores definidos en el catálogo se pueden crear **columnas calculadas**. Las columnas calculadas son expresiones a partir de las columnas de la consulta o la información del catálogo. Por ejemplo, se puede definir el "Precio" como el cociente entre el "Importe" y las "Unidades vendidas".

Los cálculos más habituales se pueden incluir desde el menú contextual de una columna. Así podemos, por ejemplo, añadir el porcentaje que representa cada registro respecto el total.

![Menú contextual de columnas calculadas](/images/analysis/ColumnasCalculadas1.png)

La siguiente imagen muestra el resultado de añadir una columna con el porcentaje respecto el total:


![Columna calculada](/images/analysis/ColumnasCalculadas2.png)

Desde el menú contextual de la columna calculada podemos acceder a sus propiedades y ver (o editar) el cálculo:


![Columna calculada](/images/analysis/ColumnasCalculadas3.png)

La expresión puede incluir todos los operadores habituales (`+`, `-`, `*`, `/`, ...). Tambien se pueden utilizar las funciones propias de Crono SQL (`addition`, `divide`, ...) y las de la base de datos (`substr`, `upper`, ...).

:::tip RECUERDA
El uso excesivo de columnas calculadas en el informe suele ser indicador de un diseño del catálogo deficiente. 

Las cálculos habituales deben estar definidos en el catálogo para facilitar su reutilización.
:::

## Exportación

### Copiar y pegar

Una vez tienes los datos en tu informe de Crono puedes exportarlos a otros formatos o aplicaciones. La manera más fácil es **copiar y pegar** los datos. Se puede copiar cualquier tabla o visualización. También se puede copiar una selección de celdas.

Los datos copiados en la aplicación de destino estarán formateados para tener una apariencia agradable. La siguiente animación muestra cómo se copia una tabla de Crono a un documento Word utilizando `Ctrol C` y `Ctrol V`:

![Copiar y pegar](/images/analysis/Exportacion1.gif)

Por supuesto, de la misma manera se pueden pegar los datos en un correo electrónico o en una hoja de cálculo *Microsoft Excel*.

Desde el menu contextual de una visualización también se pueden copiar los datos y se ofrecen opciones adicionales:

- Copiar como tabla: Copia los datos tabulares en formato HTML que se puede pegar en muchas aplicaciones (es el predeterminado)
- Copiar como texto:  Copia los datos en formato CSV
- Copiar como imagen: Copia una imagen PNG con la visualización  
- Copiar como servicio: Copia la URL que devuelve los datos de la consulta en formato JSON.

![Copiar y pegar](/images/analysis/Exportacion2.png)

### Exportar a PDF, Excel...

Además de la opción de copiar y pegar los datos, Crono ofrece la opción de exportar directamente un panel (o toda la hoja) a distintos formatos:

![Exportar](/images/analysis/Exportacion3.png)

El documento exportado incluye una copia de los datos de cada panel. Sin embargo, el aspecto y funcionalidad es muy limitado ya que carece del dinamismo propio de los informes de Crono.


::: tip RECUERDA
Las opciones de exportación son limitadas. La mejor manera de visualizazar y navegar por un informe de Crono es mediante Crono Analysis.
:::

### Crono Excel

Si el requerimiento es generar un informe en Excel muchas veces la mejor opción es utilizar **Crono Excel**. **Crono Excel** permite utilizar los catálogos de Crono para generar consultar y copiar el resultado en Excel.

Las consultas creadas con **Crono Excel** se pueden actualizar, por lo que es fácil mantener actualizados los datos de la hoja de cálculo con los datos de la base de datos (a diferencia de las opciones de "Copiar y pegar" y de "Exportar").


![Crono Excel](/images/analysis/Exportacion4.png)


## Bloquear el documento

El botón "Bloquear informe" de la cinta de opciones permite desactivar todas las opciones de edición.

Cuando el documento está bloqueado no se pueden crear o modificar informes, hojas ni consultas. 
Tampoco se puede cambiar el tipo de visualización ni modificar las propiedades del documento.


![Bloquear informe](/images/analysis/BloquearInforme.png)

En un documento bloqueado no se pueden crear filtros, pero si que es posible modificar los valores seleccionados de los filtros existentes.



![Bloquear informe](/images/analysis/InformeBloqueado.png)


::: tip RECUERDA
Un documento bloqueado permite visualizar los informes y modificar los filtros.
:::

## Modo de propagación

Al seleccionar un valor en Crono, la selección se arrastra automáticamente al resto de paneles. Esta funcionalidad es esencial en Crono y permite navegar por la información y analizar los datos de manera muy ágil. Gracias a esta funcionalidad es posible navegar por la información a distintos niveles de de agregación a partir de un informe trivial.

::: tip RECUERDA
Al seleccionar un valor se filtran automáticamente el resto de paneles.
:::

De manera predeterminada la selección en las consultas se arrastra a los paneles de izquierda a derecha y de arriba abajo. Este es el modo *natural* de arrastrar la selección y es el que se usa habitualmente.


En la imagen siguiente, al seleccionar una tienda de la primera consulta, la selección se arrastra a la segunda y tercera consulta. De este modo, se muestran las ventas por año de la tienda seleccionada y las ventas por editorial de esa tienda. Al seleccionar un año, la tercera consulta se actualiza automáticamente y muestra las ventas por editorial de la tienda seleccionada durante el año seleccionado.

![Modo propagación](/images/analysis/ModoPropagacion.png)

Este modo predeterminado se puede modificar seleccionando el modo de "Propagación a todos los paneles". De esta manera, al seleccionar una editorial, la selección se arrastra también al primer y segundo panel. Si luego se selecciona una tienda (con la tecla `Ctrol` presionada), el segundo panel se actualiza con las ventas por año de la editorial seleccionada y la tienda seleccionada.

En el modo de "Propagación a todos los paneles" la secuencia de selección determina el orden en que se arrastran los filtros.

![Modo propagación](/images/analysis/ModoPropagacion2.png)

En la imagen anterior primero se ha seleccionada la editorial "451 EDITORES" y luego se ha seleccionado la tienda "AV. PECHINA" (con la tecla `Ctrol` presionada).


En el modo de "Propagación a todos los paneles" resulta útil en ocasiones, pero puede resultar confuso porque la secuencia de selección puede no resultar evidente.


## Tipos de visualización

**Crono Analysis** permite represetar la información en tablas, gráficos y en distintos tipos de visualización. En concreto, los tipos de visualización soportados actualmente son:


- Tablas (simple, pivotada, dinámica o tarjeta)
- Gráficos de barra (apiladas, no apiladas, verticales, horizontales...)
- Gráficos de área  (apiladas, no apiladas, curvas, ...)
- Gráficos de línea (reactas, curvas, puntos...)
- Gráficos de circulares (tarta, donut, ...)
- Visualizaciones avanzadas (velocímetros, mapas, burbuja, ...)

Todos los tipos y subtipos de visualización disponibles se pueden ver desde la cinta de opciones:

![Modo propagación](/images/analysis/TiposVisualizacion.gif)

Para crear un gráfico (o cualquier otro tipo de visualización) primero hay que construir la consulta. Es recomendable generar la consulta en el modo tabla, y una vez se tienen los datos que se quieren representar cambiar al tipo de visualización deseada. La siguiente animación muestra lo sencillo que es crear un gráfico:

![Modo propagación](/images/analysis/TiposVisualizacion2.gif)

Si la consulta tiene varias dimensiones o varios indicadores, Crono generará varias series y utilizará la visualización adecuada en cada caso. 

En general, un gráfico debe tener un único indicador y una (o dos) dimensiones. 

![Gráfico de 1 indicador](/images/analysis/Grafico1.png)

Si la consulta tiene varios indicadores, entonces debe tener una única dimensión.

![Gráfico de varios indicadores](/images/analysis/Grafico2.png)

Crono genera la series en función del número de indicadores y dimensiones. Si el modo de visualización no permite representar la información de la consulta se muestra un mensaje de advertencia 

![Advertencia gráfico](/images/analysis/Grafico3.png)

Por ejemplo, el "velocímetro" solo permite representar un indicador:

![Gráfico velocímetro](/images/analysis/Grafico4.png)

### Opciones de gráfico

El botón opciones permite cambiar algunas opciones del gráfico:

- Si debe ser un gráfico animado
- Si se deben mostrar etiquetas con el valor de cada elemento
- Si se debe mostrar la leyenda
- Paleta de colores
- Si se debe permitir el zoom (útil cuando hay muchos valores)
- Si se debe mostrar las "líneas de posición"
- Si se debe mostrar siempre el 0 en el eje de ordenadas 

![Modo propagación](/images/analysis/Grafico5.png)

### Gráficos de 2 ejes

Es posible realizar gráficos de 2 ejes y con tipos de visualización diferentes:

![Gráfico de 2 ejes](/images/analysis/Grafico6.png)

Estas opciones se seleccionan desde el menú del indicador que se quiere modificar (el "Importe" en este ejemplo):

![Gráfico de 2 ejes](/images/analysis/Grafico7.png)


## Editor de consultas

El botón "Editar consulta" de la cinta de opciones abre la ventana "Editor de consultas". Esta ventana ofrece otra manera visual de crear o modificar consultas, además de otras opciones avanzadas.

El "Editor de consultas" tiene cuatro pestañas o vistas que permiten ver la consulta de distintas maneras.

### Vista "Diseño"

Desde el editor de consultas se puede crear o modificar una consulta arrastrando desde el catálogo sus columnas y filtros.

- **Filtros**: Para crear un filtro se debe arrastrar una dimensión (o un elemento de la lista de valores al área de filtros en la parte superior)
- **Columnas**: Las columnas se añaden arrastrando las dimensiones o indicadores del catálogo al editor de consultas.

Se puede acceder al menú contextual de los filtros y las columnas para modificar opciones adicionales.

![Vista Diseño](/images/analysis/EditorConsultaVistaDiseno.png)

Los botones del editor de consulta proporciona algunas opciones avanzadas:

- **Limitar resultado**: Permite limitar el número de registros que se mostrarán (para mostrar los 3 tiendas con más ventas, por ejemplo)
- **Ordenar resultado**: Permite definir la ordenación de los registros que devuelve la base de datos. Esta opción en general no es necesaria, pues es posible ordenar los datos que se muestran desde la propia tabla o gráfico.
- **Mostrar todas las filas**: Si se selecciona esta opción, la consulta devolverá todos los registros, incluso aquellos sin datos. Por ejemplo, si se hace una consulta de tienda y ventas, y se selecciona la opción de *Mostrar todas las filas*, se devolverán todas las tiendas, incluso aquellas que no tengan ninguna venta.

![Vista Diseño](/images/analysis/EditorConsultaBotones.png)

Finalmente, el editor de consultas también incluye botones para eliminar rápidamente todas las filas o columnas y para crear columnas calculadas o filtros avanzados.

### Vista "Crono SQL"

Internamente **Crono** utiliza el lenguage **Crono SQL** para crear consultas a partir del catálogo. Al utilizar la **vista Diseño** del **editor de consultas** (o al crear una consultas arrastrando el catálogo) el usuario está construyendo visualmente una consulta **Crono SQL**.

Desde esta vista se puede ver el código **Crono SQL** generado. Este código puede modificarse.

![Vista Crono SQL](/images/analysis/EditorConsultaVistaCronoSql.png)


### Vista "SQL"

La vista SQL muestra el código SQL que se ejecutará en base de datos. Esta consulta es de solo lectura y no se puede modificar.

:::tip RECUERDA
Cualquier consulta realizada con Crono se acaba convirtiendo en código SQL que se ejecutará en base de datos.
:::

![Vista SQL](/images/analysis/EditorConsultaVistaSql.png)


### Vista "Diagrama"

Esta vista permite ver las tablas y relaciones de la base de datos que utiliza la consulta SQL geneada.


![Vista Diagrama](/images/analysis/EditorConsultaVistaDiagrama.png)



### Vista "Tabla"

Esta vista permite crear o modificar la consulta viendo los datos en forma de tabla en todo momento. Se pueden arrastrar columnas o filtros desde el catálogo. 

![Vista Tabla](/images/analysis/EditorConsultaVistaTabla.png)

Esta vista es similar al que se usa normalmente para crear la consulta (fuera del **editor de consultas**)


## Propiedades de documento

Haciendo clic en el botón "Propiedades" de la cinta de botones se abre la ventana de "Propiedades de documento".

![Botón propiedades](/images/analysis/BotonPropiedades.png)

La ventana de propiedades tiene tres pestañas o vistas:

### Vista "General"

Desde la cista "general" se pueden configurar estas propiedades del documento:

- **Catálogo**: Es el catálogo del que se leerán los datos. Se puede cambiar el catálogo de un informe ya construído. El nuevo catálogo debe ser *compatible*, es decir, deben estar definidos los indicadores y dimensiones que se usan en el informe. Por ejemplo, se puede cambiar el catálogo para utilizar una versión del mismo catálogo que aún está en desarrollo o en pruebas. También se puede cambiar entre una versión en local del catálogo y una versión publicada en un servidor Crono.
- **Conexión**: Es la conexión a la base de datos donde se ejecutarán las consultas. De manera predeterminada se usa la conexión definida en el catálogo, pero se puede cambiar para conectarse a otra base de datos (una base de datos de desarrollo, por ejemplo). 
- **Paleta de colores de gráfico**: Es la paleta de colores que se utilizará de manera predeterminada en los gráficos del documento. Lo habitual es utilizar la misma paleta para todos los gráficos del documento, pero se puede cambiar la paleta de un gráfico determinado desde el botón "Opciones".
- **Fuente**: Es la fuente (tipo de letra, tamaño, color, estilo...) predeterminada que se usará en las tablas del documento. 
- **Admite data input**: Activa las opciones de introducción de datos en este documento (funcionalidad experimental).
- **Es documento de solo lectura**: Oculta las opciones de edición del documento. Es la misma funcionalidad que ofrece el botón "Bloquear informe".
- **Utilizar conexión de equipo**: Si se marca esta opción, y el catálogo utiliza una "conexión de equipo", y existe una conexión de equipo con el mismo nombre en el equipo de cliente, se utilizará la conexión definida localmente para realizar las consultas (en lugar de la conexión definica en el servidor).


![Vista general](/images/analysis/PropiedadesVistaGeneral.png)


### Vista "Parámetros"

Desde esta ventana se pueden configurar los "Parámetros de informes". 

![Vista Parámetros](/images/analysis/PropiedadesVistaParametros.png)


Los parámetros son variables que se pueden utilizar en las fórmulas de las columnas y que el usuario introduce al actualizar el informe.

Existen tres tipos de parámetros:

- **Parámetro de usuario**: Permite que el usuario establezca un valor al actualizar el informe. Por ejemplo, se puede configurar para que pregunte el valor de la variable `@año` y luego esa variable se puede utilizar en las fórmulas.
- **Parámetro calculado**: En este caso el usuario no introduce el valor, si no que se calcula a partir de una expresión. Por ejemplo, se puede definir el `@año` como `year(getdate())` y esa variable contendrá siempre el año en curso.
- **Elemento de negocio parametrizable**: En este caso el usuario selecciona un indicador (o una dimensión). Por ejemplo, se puede dejar al usuario escoger el `@kpi` entre una lista de indicadores. De este modo un mismo informe se puede actualizar con los valores de un indicador u otro.

### Vista "Informes"

Deste esta ventana se pueden ver todas los informes del documento. 

![Vista Informes](/images/analysis/PropiedadesVistaInformes.png)

Desde el menú contextual se pueden renombrar, eliminar o duplicar los informes. También se pueden reordenar mediante drag & drop.


![Vista Informes](/images/analysis/MenuContextualInforme.png)


## Propiedades de informe

Desde el menú contextual de un informe se puede acceder a su ventana de propiedades:

![Propiedades de informe](/images/analysis/PropiedadesInforme.png)

En esta ventana se especifica la siguiente información:

- **Nombre:** Es el nombre del informe que aparecerá en el *árbol de informes*.

::: tip RECUERDA
Un documento de Crono Analysis puede contener varios innformes. 
:::



Desde el menú contextual del informes se puede:

- Abrir la ventana de propiedades
- Duplicar un informe
- Eliminar un informe


![Árbol de informes](/images/analysis/ArbolInformes.png)


Se puede crear una carpeta de informes desde el menú contextual del árbol de informes (se abre haciendo clic con el botón derecho del ratón en el espacio vacio del árbol de informes). 


![Árbol de informes](/images/analysis/ArbolInformes2.png)



## Propiedades de hoja

Desde el menú contextual de una hoja se puede acceder a su ventana de propiedades:

![Propiedades de hoja](/images/analysis/hoja1.png)

En esta ventana se especifica la siguiente información:

- **Nombre:** Es el nombre de la hoja que aparece en la pestaña.

- **Modo de propagación:** Indica de que modo la selección en un panel se propaga al resto de paneles. Vea [Modo de propagación](#modo-de-propagacion).

- **Imagen**: Esta información no tiene ninguna utilidad en **Crono Analysis**.


## Propiedades de panel

Haciendo clic con el botón derecho en la parte superior de un panel (en la espacio reservado para el título) aparece el menú contextual del panel, y puede abrirse la ventana de propiedades.

![Propiedades de panel 1](/images/analysis/panel1.png)



Desde esta ventana pueden definirse las siguientes propiedades:

- **Nombre:** Es el nombre o título del panel. 
- **Fuente:** Es la fuente (tipo de letra, tamaño, color...) que tendrán las columnas de este panel. La fuente se puede establecer también a nivel de columna y a nivel de documento.
- **Propagar selección:** De manera predeterminada, al seleccionar un registro del panel, la selección se propaga al resto de paneles, actuando como un filtro. Este comportamiento se puede modificar desactivando esta opción. En este caso, la selección de un valor no tendrá ningún efecto en el resto de paneles de la hoja.
- **Mostrar todas las filas:** Si se selecciona esta opción, la consulta devolverá también los registros que no tengan información. Es útil para mostrar, por ejemplo, un listado de todas las "tiendas", tengan o no tengan "ventas" en el periodo seleccionado. También serviría para mostrar las fechas sin información, o los clientes sin pedidos, etc.



![Propiedades de panel 2](/images/analysis/panel2.png)

- **Permitir cambiar la ordenación de la tabla:** De manera predeterminada, al hacer clic en la cabecera de una columna se ordena la información de la tabla. Este comportamiento puede cambiarse desmarcando esta opción. De este modo, evitamos modificar inadvertidamente el orden de la tabla .

- **Permitir reordenar las columnas:** De manera predeterminada, se pueden reordenar las columnas mediante _drag & drop_. Este comportamiento puede cambiarse desmarcando esta opción.

- **Permitir filtrar el resultado de la consulta**: De manera  predeterminada, existe un pequeño menú que permite filtrar el resultado de la columna. Este menú puede desactivarse desmarcando esta opción.

  
![Propiedades de panel 3](/images/analysis/panel3.png)

  

- **Bloquear la consulta:** Si se selecciona esta opción, se impide que se puedan añadir o quitar columnas o filtros al panel. Desde propiedades de documento también se puede bloquear el documento entero.
- **Selección obligatoria**: Impide que se ejecuten las consultas dependientes a menos que haya algún registro seleccionado en este panel. Esta opción es útil para evitar la realización de consultas innecesarias (que presumiblemente serían costosas).

## Propiedades de columna

Desde el menú contextual de una columna se puede abrir la ventana de "Propiedades de columna". Tiene tres pestañas o vistas.

### Vista "Definición"

La primera vista permite definir los e

- **Nombre:** Nombre de la columna (que aparecerá en el título de la columna). De manera predeterminada, se respeta el nombre del indicador o dimensión del catálogo, pero se puede establecer otro nombre si es necesario.
- **Fórmula**: Es la expresión Crono SQL de la columna. Puede ser directamente el nombre de un indicador o dimensión del catálogo o alguna expresión más compleja (Ver "Columnas calculadas")
- **Fórmula a partir de las columnas existentes en la consulta**: Determina si la fórmula es un cálculo a partir de las columnas de la consulta o a partir de los elementos del catálogo.

![Propiedades de columna 1](/images/analysis/PropiedadesColumna1.png)


### Vista "Formato"

Desde la vista formato se define el formato del indicador o dimensión.

![Propiedades de columna 2](/images/analysis/PropiedadesColumna2.png)

Además de los formatos habituales (números con decimales, fechas, porcentaje, ...) existen algunos casos particulares:

- El formato **"hipervínculo"** muestra el texto de la expresión como un enlace web. La página destino del enlace se define desde la vista "Información adicional"
- El formato **"Duración"** convierte un número en un formato `d.h.min.seg`. El valor numérico corresponde a los segundos del intervalo.

### Vista "Avanzadas"

La vista de propiedades avanzadas incluye estas personalizaciones:

- **Color** del fondo de la celda
- **Fuente** a utilizar (para que se muestre en negrita, en cursiva, o con algún tamaño o tipo de letra especial...)
- **Mostrar texto en ventana independiente**: Si el texto de la columna puede ser largo (por ejemplo, si corresponde a alguna descripción o texto libre, esta opción permite leer el texto íntegro en una ventana independiente (lo que no podría hacerse en una celda normal de una tabla).
- **Filtrar esta columna en paneles dependientes**: De manera predeterminada, al seleccionar una fila de la tabla, se filtran automáticamente los paneles dependientes. Este filtro se calcula a partir de todas las dimensiones de la fila (o filas) seleccionada. Este comportamiento puede impedirse, evitando que alguna columna actúe como filtro.  

![Propiedades de columna 3](/images/analysis/PropiedadesColumna3.png)
