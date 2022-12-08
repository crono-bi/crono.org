---
sidebarDepth: 2
---

# Crear una consulta

## Cómo crear un informe

Para crear una consulta necesitamos en primer lugar crear un informe y seleccionar el catálogo que se utilizara.

Crear un informe es muy sencillo. Los pasos a seguir son:

- Hacer clic en "Nuevo informe" 
- Seleccionar el catálogo a utilizar
- **Crear una consulta arrastrando las elementos del catálogo al panel del informe**
- Añadir filtros arrastrando desde el catálogo al cuadro de "Filtros de informes"
- Crear nuevos paneles con el botón "Nueva consulta"
- Crear las nuevas consultas arrastrando elementos del catálogo a los distintos paneles
- Añadir columnas calculadas si es necesario
- Personalizar el aspecto cambiando la visualización
- Personalizar el aspecto añadiendo formatos condicionales
- Repetir los pasos anteriores hasta conseguir el aspecto deseado

![Primer informe](/images/analysis/primerinforme.gif)

A continuación se explica las diferentes maneras disponibles para añadir columnas a una consulta.

## Añadir columnas

Al crear un informe nuevo, se crea una hoja con un único panel. Este panel aparece en blanco porque no tiene aún la consulta definida. Para definir la consulta sencillamente se deben **arrastrar las dimensiones e indicadores** que queremos incluir desde el catálogo que aparece en el lateral izquierdo.

![Arrastrar columnas](/images/analysis/DragColumns.png)


## Ordenar el resultado

Haciendo clic en el título de una columna el resultado se ordena según los valores de la tabla. Si se vuelve a hacer clic en el título de la columna la tabla se ordenará de modo descendente. De este modo, es trivial ordenar las "tiendas" alfabéticamente, o según las "unidades vendidas".

![Ordenar resultados](/images/analysis/Orden1.png)

También se puede ordenar según el valor de varias columnas. Por ejemplo, nos puede interesar ordenar esta columna por "País" y luego en cada país ordenar según sus unidades vendidas (de más a menos). Para ello, se ha de ordenar primero por tienda, y luego con el **`CTROL` apretado** hacer clic en la columna "unidades" para ordenar según las "unidades vendidas".


![Ordenar resultados](/images/analysis/Orden2.png)

## Eliminar una columna

Se puede eliminar una columna de la consulta seleccionando la opción "Eliminar" del menú contextual. 


![Eliminar una columna](/images/analysis/DeleteColumn.png)

## Menú contextual de columna


El menú contextual de cada columna tiene opciones que nos permitirá configurar la apariencia de la columna. Además de eliminar una columna, se puede establecer el formato, ocultar la columna, entre otras opciones.

![Menu contextual](/images/analysis/ColumnContextMenu.png)


## Formato

La ventana de formato permite establecer los decimales que se mostrarán, el formato de fecha deseado, etc.

![Menu contextual](/images/analysis/ColumnFormat.png)

## Alineación

El menú de "Alineación" permite establecer la alineación de la columna. El modo "Automático" alinea los indicadores a la derecha  y las dimensiones a la izquierda. Este comportamiento automático se puede cambiar estableciendo la alineación a la izquierda, a la derecha o centrada.


![Alineación](/images/analysis/ColumnAlignment.png)


## Desactivar una columna

"Desactivar" una columna es similar a eliminarla, pues mostrará los resultados como si esa columna no existiese. Al "desactivar" una columna, **Crono Analysis" agrupará el resto de valores como si esa columna no existiera, y mostrará la columna desactivada con un color grisáceo.


![Desactivar columna](/images/analysis/DeactivateColumn.png)


La desactivación es temporal y podemos volver a "activar" la columna cuando sea necesario. Esta opción es útil durante el "análisis libre" para ver el resultado de una consulta de un modo más agrupado de manera muy rápida y reversible.

## Ocultar columna

Desde el menú contextual también se puede ocultar una columna. Una columna oculta mantiene su ordenación u otras propiedades que tenga establecida. 

![Ocultar columna](/images/analysis/HideColumn.png)

Desde el submenú "Columnas" se puede volver a mostrar la columna ocultada.

## Filtros y otras opciones

Una vez añadidas las columnas podemos definir filtros u otras personalizaciones. En el resto de apartados de este manual se describen en detalle.







