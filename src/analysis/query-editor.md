---
title: "Editor de consultas"
position: 8
sidebarDepth: 2
---



# Editor de consultas

El botón "Editar consulta" de la cinta de opciones abre la ventana "Editor de consultas". Esta ventana ofrece otra manera visual de crear o modificar consultas, además de otras opciones avanzadas.

El "Editor de consultas" tiene cuatro pestañas o vistas que permiten ver la consulta de distintas maneras.

## Vista "Diseño"

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

## Vista "Crono SQL"

Internamente **Crono** utiliza el lenguage **Crono SQL** para crear consultas a partir del catálogo. Al utilizar la **vista Diseño** del **editor de consultas** (o al crear una consultas arrastrando el catálogo) el usuario está construyendo visualmente una consulta **Crono SQL**.

Desde esta vista se puede ver el código **Crono SQL** generado. Este código puede modificarse.

![Vista Crono SQL](/images/analysis/EditorConsultaVistaCronoSql.png)


## Vista "SQL"

La vista SQL muestra el código SQL que se ejecutará en base de datos. Esta consulta es de solo lectura y no se puede modificar.

:::tip RECUERDA
Cualquier consulta realizada con Crono se acaba convirtiendo en código SQL que se ejecutará en base de datos.
:::

![Vista SQL](/images/analysis/EditorConsultaVistaSql.png)


## Vista "Diagrama"

Esta vista permite ver las tablas y relaciones de la base de datos que utiliza la consulta SQL geneada.


![Vista Diagrama](/images/analysis/EditorConsultaVistaDiagrama.png)



## Vista "Tabla"

Esta vista permite crear o modificar la consulta viendo los datos en forma de tabla en todo momento. Se pueden arrastrar columnas o filtros desde el catálogo. 

![Vista Tabla](/images/analysis/EditorConsultaVistaTabla.png)

Esta vista es similar al que se usa normalmente para crear la consulta (fuera del **editor de consultas**)

