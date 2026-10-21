---
title: "Ejecución programada"
description: "Ejecución de las cargas con Crono CLI y el programador de tareas de Windows."
---

Para ejecutar una carga basta con un comando de Crono CLI:

```
crono run "DWH Load.job"
```

El fichero es habitualmente el [workflow](/etl/orchestration/workflow/) que orquesta la carga completa. Para que la carga se ejecute sola cada día, se programa este comando con el programador de tareas de Windows. No hace falta ningún otro servicio ni orquestador.

## El comando `crono run`

`crono run` ejecuta un fichero `.job` con la configuración del proyecto y del entorno activo, igual que si se ejecutara desde Crono ETL.

El fichero puede indicarse de dos formas:

- **Una ruta local**, absoluta o relativa a la carpeta desde la que se ejecuta el comando.
- **La URL del fichero en un repositorio de GitHub**, tal como aparece en el navegador.

```
crono run "D:\Projects\DWH\jobs\DWH Load.job"
crono run "https://github.com/my-company/dwh/blob/main/jobs/DWH Load.job"
```

Si el job es una [ejecución auditada](/etl/orchestration/audited-execution/), queda registrado en el log, se publica en Calendas y envía el correo de fin de carga, como en cualquier otra ejecución.

## Ejecución desde GitHub

Ejecutar el workflow directamente desde GitHub evita mantener una copia del proyecto en el servidor. Crono descarga el fichero del repositorio, y las rutas relativas que contiene, como las de los ficheros `.job` o `.sql` que ejecuta el workflow, se resuelven en el mismo repositorio.

Así, la versión que se ejecuta es siempre la de la rama indicada en la URL. Para pasar un cambio a producción basta con subirlo (*push*) a esa rama.

Para leer el repositorio, Crono necesita un token de GitHub, que puede obtenerse con la conexión con GitHub.com (OAuth) o ser un token de acceso personal (PAT). Es la cuenta de GitHub del usuario de Windows, la misma que usa Crono ETL, así que debe configurarse con el usuario que ejecutará la tarea programada. Puede configurarse en Crono ETL, en **Ayuda > Cuenta GitHub**, o con Crono CLI:

```
crono account github login --oauth
crono account github login --token-stdin < token.txt
```

Con `--oauth` se abre el navegador para iniciar sesión en GitHub y autorizar a Crono. Con `--token-stdin` se lee un token de acceso personal de la entrada estándar. En los dos casos, el token se comprueba antes de guardarlo. Los dos tipos de token se explican en [Credenciales](/etl/configuration/credentials/#github).

<!-- PENDIENTE: ¿De dónde se toman la configuración y el entorno del proyecto en este caso (.crono del repositorio + configuración local del equipo)? -->

## Programación con el programador de tareas de Windows

En el programador de tareas de Windows, se crea una tarea básica con estos datos:

| Campo | Valor |
| --- | --- |
| Desencadenador | La periodicidad de la carga, por ejemplo cada día a las 6:00. |
| Acción | Iniciar un programa. |
| Programa | La ruta completa de Crono CLI, normalmente `C:\Users\<usuario>\.dotnet\tools\crono.exe`. |
| Argumentos | `run "DWH Load.job"` |
| Iniciar en | La carpeta del proyecto, si el fichero se indica con una ruta relativa. |

Crono CLI se instala como herramienta de .NET, en la carpeta `.dotnet\tools` del usuario que la instala. El programador de tareas no suele encontrarla solo por el nombre, así que conviene indicar siempre la ruta completa del ejecutable.

En las propiedades de la tarea conviene marcar **Ejecutar tanto si el usuario inició sesión como si no**, para que la carga no dependa de que haya alguien conectado al servidor. El usuario con el que se ejecuta la tarea debe tener acceso a la carpeta del proyecto y a las bases de datos y almacenamientos que usa la carga.

<!-- PENDIENTE: enlazar la instalación de Crono CLI cuando tenga su documentación. Si la tarea se ejecuta con otro usuario, ¿tiene acceso al crono.exe instalado en el perfil de quien lo instaló? ¿crono run devuelve un código de salida distinto de 0 si la carga falla (para que el programador de tareas lo refleje)? ¿Se puede elegir el entorno en el propio comando, o siempre se usa el activo (crono environment set-current)? -->
