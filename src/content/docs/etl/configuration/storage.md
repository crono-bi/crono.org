---
title: "Almacenamiento"
description: "Ubicaciones en las que Crono ETL lee y escribe ficheros: carpetas, buckets en la nube y repositorios."
---

Un almacenamiento es una ubicación en la que Crono ETL lee y escribe ficheros. Puede ser:

- Una carpeta local o de red.
- Un bucket de Amazon S3.
- Un bucket de Google Cloud Storage.
- Una carpeta de un repositorio de GitHub.

Cada almacenamiento se define en el entorno con un nombre, junto con las credenciales necesarias para acceder a él. Las acciones se refieren al almacenamiento solo por ese nombre, de modo que el código del proyecto no contiene rutas ni credenciales. Así, el mismo proyecto puede trabajar con una carpeta local en desarrollo y con un bucket de S3 en producción, si en los dos entornos el almacenamiento tiene el mismo nombre.

Los almacenamientos forman parte del entorno, junto con las [conexiones](/etl/configuration/connections/) y las [credenciales](/etl/configuration/credentials/).

## Dónde se definen

Los almacenamientos se guardan en el fichero de cada entorno, `.crono/environments/<entorno>.jsonc`, en la lista `file-stores`. Cada almacenamiento indica su tipo (`type`), su nombre (`name`) y las propiedades propias del tipo:

```jsonc
{
  "file-stores": [
    {
      "type": "google",
      "name": "backups",
      "bucket-name": "mi-bucket-backups",
      "credentials-name": "google-dwh"
    },
    {
      "type": "amazon",
      "name": "datalake",
      "location": "s3://mi-bucket/datalake",
      "credentials-name": "aws-datalake"
    }
  ]
}
```

Igual que las conexiones, pueden crearse y modificarse desde Crono ETL, en las propiedades del entorno; desde Crono CLI, con los comandos `crono file-store list`, `add <tipo>`, `edit <tipo>` y `remove`; o editando directamente el fichero.

## Uso de los almacenamientos

Las acciones que leen o escriben ficheros se refieren a un almacenamiento con la forma `filestore://<nombre>`, seguida opcionalmente de una subcarpeta y del nombre del fichero:

```
[export parquet](
	schema_name='sales',
	table_name='customers_data',
	target_location='filestore://datalake/exports/2026',
	filename='customers_data.parquet'
)
```

En este ejemplo, el fichero se escribe en la subcarpeta `exports/2026` del almacenamiento `datalake`, sea este una carpeta, un bucket o un repositorio.

Algunas recomendaciones:

- El nombre del almacenamiento no debe contener espacios.
- Usa nombres que describan el contenido, no la tecnología: `datalake` o `exports` en lugar de `s3-prod`.
- Usa los mismos nombres en todos los entornos del proyecto.

Las acciones que admiten almacenamientos son, entre otras, [EXPORT PARQUET](/etl/data-movement/export-parquet/), [IMPORT PARQUET](/etl/data-movement/import-parquet/) y [COPY FILE](/etl/data-movement/copy-file/). Además, algunas conexiones usan un almacenamiento como almacenamiento intermedio para la carga masiva, como la de [Redshift](/etl/configuration/connections/#redshift).

## Tipos de almacenamiento

| Tipo | Ubicación | Credenciales |
| --- | --- | --- |
| [Carpeta](#carpeta) | Carpeta local o de red | No |
| [Amazon S3](#amazon-s3) | Carpeta de un bucket de S3 | Credenciales de AWS, del entorno o predeterminadas |
| [Google Cloud Storage](#google-cloud-storage) | Bucket de Google Cloud Storage | Cuenta de servicio de Google |
| [GitHub](#github) | Carpeta de un repositorio de GitHub | Token de GitHub, del entorno o predeterminado |

<!-- PENDIENTE: Azure Blob Storage / ADLS está previsto; añadirlo cuando exista. -->

### Carpeta

Una carpeta local o de red, accesible desde el equipo que ejecuta Crono ETL. En Crono ETL se configura con el formulario Generic:

![Formulario de un almacenamiento de tipo carpeta](/images/etl/configuration/storage/generic.png)

Estas son las propiedades del almacenamiento, con su nombre en el fichero del entorno y en Crono CLI:

| Nombre | Propiedad | Descripción |
| --- | --- | --- |
| Ubicación | `location` | Ruta de la carpeta: absoluta, local (`C:\datos\exports`) o de red (`\\servidor\ficheros`), o relativa a la carpeta del proyecto (`parquets/`). El botón junto al campo permite elegirla. |
| Descripción | `description` | Descripción del almacenamiento. Opcional. |

Una ruta relativa permite incluir la carpeta en el propio proyecto, por ejemplo con ficheros de prueba o de configuración, y que funcione en cualquier equipo donde se abra el proyecto, sin depender de una ruta absoluta.

Con Crono CLI:

```
crono file-store add generic --name exports --location D:\datos\exports
```

<!-- PENDIENTE: el usuario que ejecuta Crono ETL necesita permisos sobre la carpeta de red. -->

### Amazon S3

Una carpeta de un bucket de Amazon S3. Crono ETL accede con unas [credenciales](/etl/configuration/credentials/) de AWS del entorno. En Crono ETL se configura con el formulario Amazon:

![Formulario de un almacenamiento de Amazon S3](/images/etl/configuration/storage/amazon.png)

Estas son las propiedades del almacenamiento, con su nombre en el fichero del entorno y en Crono CLI:

| Nombre | Propiedad | Descripción |
| --- | --- | --- |
| Ubicación | `location` | Carpeta del bucket, con la forma `s3://bucket/ruta`. |
| Credenciales | `credentials-name` | Nombre de unas credenciales de tipo Amazon del entorno. Opcional: si no se informa, se usan las credenciales predeterminadas de Amazon (ver más abajo). |
| Descripción | `description` | Descripción del almacenamiento. Opcional. |

Si el almacenamiento no indica credenciales, Crono ETL usa las credenciales predeterminadas de Amazon, que se definen en **Ayuda > Opciones generales > Propiedades comunes**. Estas credenciales no forman parte del entorno, sino de la configuración de Crono ETL en cada equipo, así que deben definirse en todos los equipos que ejecuten el proyecto.

El usuario o el rol de las credenciales necesita los permisos de S3 que correspondan a lo que se haga con el almacenamiento: `s3:ListBucket` sobre el bucket y `s3:GetObject`, `s3:PutObject` o `s3:DeleteObject` sobre los objetos.

Con Crono CLI:

```
crono file-store add amazon --name datalake --location s3://mi-bucket/datalake --credentials-name aws-datalake
```

<!-- PENDIENTE: La CLI admite también s3://bucket.región/ruta: ¿para qué sirve la región en la ubicación si las credenciales ya tienen región? -->

### Google Cloud Storage

Un bucket de Google Cloud Storage. Crono ETL accede con una cuenta de servicio, definida como [credenciales](/etl/configuration/credentials/) de tipo Google en el entorno. En Crono ETL se configura con el formulario Google:

![Formulario de un almacenamiento de Google Cloud Storage](/images/etl/configuration/storage/google.png)

Estas son las propiedades del almacenamiento, con su nombre en el fichero del entorno y en Crono CLI:

| Nombre | Propiedad | Descripción |
| --- | --- | --- |
| Nombre del bucket | `bucket-name` | Nombre del bucket. |
| Credenciales | `credentials-name` | Nombre de unas credenciales de tipo Google del entorno. |
| Descripción | `description` | Descripción del almacenamiento. Opcional. |

Para que funcione:

- La cuenta de servicio necesita permiso sobre el bucket, por ejemplo con el rol "Usuario de objetos de Storage" concedido en el propio bucket.
- Se recomienda que el bucket use acceso uniforme a nivel de bucket, que es la opción por defecto en los buckets nuevos.

Con Crono CLI:

```
crono file-store add google --name datalake --bucket-name mi-bucket --credentials-name google-dwh
```

<!-- PENDIENTE: ¿Se admite una carpeta dentro del bucket en la definición del almacenamiento, o solo el bucket? -->

### GitHub

Una carpeta de un repositorio de GitHub, en una rama concreta. Crono ETL accede con un token de GitHub, definido como [credenciales](/etl/configuration/credentials/) de tipo GitHub en el entorno. En Crono ETL se configura con el formulario GitHub:

![Formulario de un almacenamiento de GitHub](/images/etl/configuration/storage/github.png)

Estas son las propiedades del almacenamiento, con su nombre en el fichero del entorno y en Crono CLI:

| Nombre | Propiedad | Descripción |
| --- | --- | --- |
| Ubicación | `location` | Carpeta o fichero del repositorio, con la URL que muestra el navegador en GitHub o con la forma compacta `github://propietario.repositorio.rama/ruta`. |
| Credenciales | `credentials-name` | Nombre de unas credenciales de tipo GitHub del entorno. Opcional: si no se informa, se usan las credenciales predeterminadas de GitHub (ver más abajo). |
| Descripción | `description` | Descripción del almacenamiento. Opcional. |

La ubicación puede indicarse de dos formas equivalentes:

- **La URL de GitHub**, copiada tal como aparece en el navegador al abrir la carpeta o el fichero: `https://github.com/mi-empresa/mi-repo/tree/main/csv` para una carpeta o `https://github.com/mi-empresa/mi-repo/blob/main/csv/clientes.csv` para un fichero.
- **La forma compacta** `github://propietario.repositorio.rama/ruta`: `github://mi-empresa.mi-repo.main/csv` o `github://mi-empresa.mi-repo.main/csv/clientes.csv`.

En ambos casos, Crono ETL lee el contenido de la carpeta o el fichero indicado.

Si el almacenamiento no indica credenciales, Crono ETL usa las credenciales predeterminadas de GitHub, que se definen en **Ayuda > Opciones generales > Propiedades comunes**. Estas credenciales no forman parte del entorno, sino de la configuración de Crono ETL en cada equipo, así que deben definirse en todos los equipos que ejecuten el proyecto.

El token necesita permiso de lectura sobre el contenido del repositorio y, si se escriben ficheros, también de escritura.

Con Crono CLI:

```
crono file-store add github --name config --location github://mi-empresa.mi-repo.main/config --credentials-name github-crono
```

<!-- PENDIENTE: ¿Para qué casos de uso está pensado (leer ficheros de configuración, publicar exportaciones...)? ¿Se admite escribir? Nombres con puntos en el propietario o el repositorio: con la forma github:// el punto es separador; con la URL de GitHub no hay ambigüedad. -->
