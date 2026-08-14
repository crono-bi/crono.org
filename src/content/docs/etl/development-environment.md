---
title: "El IDE"
---

import { Aside } from '@astrojs/starlight/components';

El IDE de Crono ETL sigue la misma línea visual del resto de la plataforma Crono: interfaz estilo Office, cinta de opciones y paneles laterales. La curva de aprendizaje es mínima para cualquier usuario familiarizado con herramientas de Microsoft.

## Panel ARCHIVO

Al arrancar la aplicación —o al cerrar el proyecto activo— aparece el panel **ARCHIVO**, que permite crear un proyecto nuevo, abrir uno existente o acceder a la configuración general de la aplicación (opciones, cuentas, información de versión).

*[Pantallazo: panel ARCHIVO con las opciones Nuevo, Abrir, Cerrar, Opciones, Soporte, Cuentas, Información]*

Un proyecto Crono ETL es una carpeta en disco que contiene todo el código necesario para crear un data warehouse desde uno o varios orígenes.

**Abrir un proyecto** — selecciona la carpeta donde reside el proyecto. Crono ETL la reconoce automáticamente y carga su contenido.

**Crear un proyecto nuevo** — solicita la carpeta donde se creará el proyecto, la conexión de base de datos inicial y el tipo de proyecto:

- *Proyecto en blanco* — genera la estructura de carpetas mínima, incluyendo la tabla de tiempo y la tabla de auditoría.
- *Proyecto de ejemplo* — genera además el código completo para crear y cargar un pequeño datamart comercial a partir de la base de datos **Northwind**. Es una buena opción para explorar el IDE y familiarizarse con la estructura de un proyecto real.

*[Pantallazo: diálogo de nuevo proyecto]*

<Aside type="note">
Los ejemplos de este manual utilizan la base de datos **Northwind**, un dataset de referencia ampliamente conocido que modela una empresa de distribución con pedidos, clientes, productos y proveedores. El proyecto de ejemplo que genera Crono ETL incluye el código necesario para cargarla.
</Aside>

<Aside type="tip">
Un proyecto Crono ETL es una carpeta de ficheros de texto: todo su contenido puede —y debería— mantenerse en un repositorio Git. Cualquier cliente Git es válido: GitHub Desktop, Sourcetree, la integración de VS Code o la línea de comandos. El control de versiones permite revisar cambios, colaborar en equipo y revertir a cualquier estado anterior del proyecto.
</Aside>

## La cinta de opciones

Una vez abierto un proyecto, aparece la cinta de opciones con tres grupos principales.

*[Pantallazo: cinta de opciones completa con los tres grupos resaltados]*

**Grupo Archivo** — operaciones sobre ficheros: abrir, crear, guardar y cerrar. Los mismos ficheros se pueden abrir también haciendo doble clic en el panel lateral de archivos.

**Grupo Proyecto** — acceso a las opciones del proyecto:

- **Conexión activa** — muestra el nombre de la conexión seleccionada en este momento. Permite cambiar rápidamente entre las conexiones de base de datos definidas en el entorno.
- **Desplegar** — compila y despliega todos los procedimientos del proyecto en la base de datos activa.
- **Propiedades de entorno** — configuración del entorno: conexiones, almacenamiento y credenciales.
- **Propiedades** — propiedades generales del proyecto.
- **Informes** — informes técnicos sobre el estado de la base de datos: volumetría de tablas, transacciones activas, etc. No tiene relación con los informes de usuario, que se gestionan desde Crono Analysis.

*[Pantallazo: grupo Proyecto resaltado]*

**Grupo Vista** — alterna entre las distintas vistas del proyecto (ver sección siguiente).

*[Pantallazo: grupo Vista resaltado]*

## Las vistas

El grupo **Vista** de la cinta permite cambiar el contenido del área principal. La vista habitual de trabajo es **Editor Crono SQL**; el resto son vistas de consulta e inspección del proyecto.

**Modelo de datos** — representación visual del modelo en estrella del proyecto: tablas de hechos, dimensiones y sus relaciones.

**Tablas** — listado de las tablas del data warehouse destino. Para cada tabla permite consultar el código Crono SQL que la define, los datos que contiene y el historial de cargas (fecha, duración, número de filas, errores).

**Archivos** — listado de los ficheros del proyecto con información de cada uno.

**Procesos** — listado de todos los procedimientos definidos en el proyecto. Permite consultar sus propiedades y abrir directamente el fichero donde está definido.

**Orígenes** — explorador de las bases de datos de origen: tablas, columnas y tipos disponibles en las conexiones configuradas.

**Trabajos** — listado de los ficheros `.job` del proyecto, con su tamaño, fecha de creación y última modificación. Al seleccionar un trabajo se muestra su código en el panel lateral derecho.

## El Editor Crono SQL

El Editor Crono SQL es la vista principal de trabajo. Muestra un editor de texto con syntax highlighting para Crono SQL y una pestaña por cada fichero abierto, tanto `.sql` como `.job`.

*[Pantallazo: Editor Crono SQL con varias pestañas abiertas]*

El panel lateral izquierdo, exclusivo de esta vista, tiene tres modos seleccionables desde los botones en la parte inferior:

**Archivos** — árbol de ficheros del proyecto. Permite navegar por las carpetas y abrir ficheros con doble clic.

**ETL** — árbol jerárquico de los trabajos del proyecto. Muestra los jobs y su estructura interna de workflows y acciones, lo que permite visualizar de un vistazo la organización completa de las cargas.

**Base de datos** — explorador de la base de datos activa. Permite navegar por los esquemas, tablas y columnas del destino sin salir del IDE.

*[Pantallazo: panel lateral con los tres modos señalados]*

### Menú contextual

En línea con el resto de la plataforma Crono, el IDE hace un uso extensivo del menú contextual. Prácticamente cualquier elemento es accionable con el botón derecho: los ítems del panel lateral, las pestañas de ficheros abiertos, las funciones y palabras reservadas del editor, las columnas de las vistas de datos...

El contenido del menú varía según el contexto. Algunas opciones habituales son ejecutar la carga de una tabla, ver su historial, navegar a la definición de un símbolo, consultar los valores de una columna o acceder a la documentación de una función concreta —tanto del manual de Crono SQL como de la documentación nativa del motor de base de datos.

*[Pantallazo: ejemplos de menú contextual en el editor y en el panel ETL]*
