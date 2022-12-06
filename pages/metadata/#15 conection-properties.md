---
title: Propiedades de conexión
sidebarDepth: 2
---


# Propiedades de conexión

Desde las propiedades de conexión se configura la cadena de conexión para conectarse a la base de datos.

El formulario tiene cuatro tipos de conexión:

- SQL Server
- Genérica
- Crono Server
- Conexión de equipo

El botón "Verificar conexión" permite validar que los datos introducidos son correctos y que **Crono** puede conectarse con la base de datos.

![image-20200305023320405](/images/conexion6.png)

## SQL Server

Si la base de datos donde se encuentra tu información es **SQL Server**, simplemente complete la información de conexión (servidor, base de datos y usuario).

![Configurar conexión](/images/configurar-conexion.png)



## Genérica

Si el servidor no es SQL Server, se debe introducir la cadena de conexión propia de cada base de datos. Se puede escribir la cadena directamente o se puede utilizar el asistente.

![image-20200305020249865](/images/conexion2.png)

Pulsando el boton de edición se abre el asistente de Windows para configurar la cadena de conexión. Seleccione el "data source" adecuado y complete la información.

![image-20200305020702783](/images/conexion3.png)

Si configura un origen de datos ODBC tenga en cuenta que la arquitectura de **Crono** debe coincidir con la arquitectura del ODBC. 

Los productos **Crono** están disponibles tanto en arquitectura de 64 bits como de 32 bits.

## Crono Server

Esta vista no es relevante desde **Crono Metadata**

## Conexión de equipo

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