---
title: "Estructura de un documento"
sidebarDepth: 2
---

# Estructura de un documento de Crono Analysis

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

## Catálogo

El **catálogo** de Crono es el diccionario de atributos e indicadores que se pueden utilizar en los informes. 

- Cada documento de **Crono Analysis** utiliza un único catálogo.
- El **catálogo** lo crea habitualmente el departamento de IT, incluyendo la información que necesitan los usuarios de negocio.
- Una vez creado el **catálogo**, es sencillo crear consultas e informes, y el propio usuario de negocio puede crear los documentos si es preciso (y sin necesidad de conocimientos técnicos).
- Un **catálogo** está formado por indicadores, dimensiones y filtros organizados jerárquicamente mediante carpetas.


![Catálogo](/images/analysis/Catalogo.png)


## Consultas

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