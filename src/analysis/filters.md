---
title: "Filtros"
position: 3
sidebarDepth: 2
---



# Filtros

## Tipos de filtro

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


## Crear un filtro

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

## Modificar un filtro

Una vez creado el filtro se puede eliminar o modificar sus características desde el menú contextual:

![Arrastrar filtros](/images/analysis/MenuContextualFiltro.png)

En concreto, desde el menu contextual se puede:

- Establecer las hojas en que deben actuar los filtros de informe
- Abrir el panel de [Propiedades de filtro](#propiedades-de-filtro)
- Localizar el elemento del catálogo que se está filtrando
- Desactivar un filtro. Los filtros pueden estar activos o inactivos. Si están inactivo no afectan a ninguna consulta.
- Eliminar el filtro
- Modificar el elemento o los elementos filtrados


## Propiedades de filtro

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

