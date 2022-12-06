---
title: Dimensiones geográficas
---


# Dimensiones geográficas 

**Crono** puede representar sobre un mapa la información del catálogo. Por ejemplo, es posible representar un mapa con un círculo en cada una de las _"Tiendas"_, y el tamaño de ese círculo dependerá del indicador que se está analizando. 

Desde la ventana de propiedades de la dimensión, en la vista "Dimensión geográfica", se debe indicar los campos que contienen la longitud y latitud de cada lugar.

![image-20200304193251992](/images/geo1.png)


También se pueden utilizar mapas personalizados con formas (shapes) predefinidas. Si se dispone de estos mapas, **Crono** permite colorear cada región en función del indicador.



## Longitudes y latitudes

La longitud y la latitud de cada elemento de la dimensión geográfica debe estar almacenada en la base de datos. Para facilitar este trabajo **Crono** facilita [ficheros CSV](https://github.com/bifacil/CronoSupport/tree/master/Resources/CSV) con las coordenadas de:

- Países
- Municipios, provincias y comunidades de España


**Crono ETL** incluye también vistas predefinidas con esta información:

![image-20200304194131547](/images/geo2.png)

Estas vistas se llaman: `Crono$Countries`, `Crono$SpanishCities`,`Crono$SpanishProvinces`y `Crono$SpanishRegions.`

Para más información, consulte el artículo de **Crono SQL** sobre vistas predefinidas.
