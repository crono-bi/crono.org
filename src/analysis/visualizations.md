---
title: "Tipos de visualización"
position: 7
---



# Tipos de visualización

**Crono Analysis** permite represetar la información en tablas, gráficos y en distintos tipos de visualización. En concreto, los tipos de visualización soportados actualmente son:


- Tablas (simple, pivotada, dinámica o tarjeta)
- Gráficos de barra (apiladas, no apiladas, verticales, horizontales...)
- Gráficos de área  (apiladas, no apiladas, curvas, ...)
- Gráficos de línea (reactas, curvas, puntos...)
- Gráficos de circulares (tarta, donut, ...)
- Visualizaciones avanzadas (velocímetros, mapas, burbuja, ...)

Todos los tipos y subtipos de visualización disponibles se pueden ver desde la cinta de opciones:

![Tipos Visualización](/images/analysis/TiposVisualizacion.gif)

Para crear un gráfico (o cualquier otro tipo de visualización) primero hay que construir la consulta. Es recomendable generar la consulta en el modo tabla, y una vez se tienen los datos que se quieren representar cambiar al tipo de visualización deseada. La siguiente animación muestra lo sencillo que es crear un gráfico:

![Tipos Visualización](/images/analysis/TiposVisualizacion2.gif)

Si la consulta tiene varias dimensiones o varios indicadores, Crono generará varias series y utilizará la visualización adecuada en cada caso. 

En general, un gráfico debe tener un único indicador y una (o dos) dimensiones. 

![Gráfico de 1 indicador](/images/analysis/Grafico1.png)

Si la consulta tiene varios indicadores, entonces debe tener una única dimensión.

![Gráfico de varios indicadores](/images/analysis/Grafico2.png)

Crono genera la series en función del número de indicadores y dimensiones. Si el modo de visualización no permite representar la información de la consulta se muestra un mensaje de advertencia 

![Advertencia gráfico](/images/analysis/Grafico3.png)

Por ejemplo, el "velocímetro" solo permite representar un indicador:

![Gráfico velocímetro](/images/analysis/Grafico4.png)

## Opciones de gráfico

El botón opciones permite cambiar algunas opciones del gráfico:

- Si debe ser un gráfico animado
- Si se deben mostrar etiquetas con el valor de cada elemento
- Si se debe mostrar la leyenda
- Paleta de colores
- Si se debe permitir el zoom (útil cuando hay muchos valores)
- Si se debe mostrar las "líneas de posición"
- Si se debe mostrar siempre el 0 en el eje de ordenadas 

![Modo propagación](/images/analysis/Grafico5.png)

## Gráficos de 2 ejes

Es posible realizar gráficos de 2 ejes y con tipos de visualización diferentes:

![Gráfico de 2 ejes](/images/analysis/Grafico6.png)

Estas opciones se seleccionan desde el menú del indicador que se quiere modificar (el "Importe" en este ejemplo):

![Gráfico de 2 ejes](/images/analysis/Grafico7.png)

