

# Modo de propagación

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

