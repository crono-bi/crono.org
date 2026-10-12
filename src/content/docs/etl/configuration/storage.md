---
title: "Almacenamiento"
description: "Ubicaciones de ficheros que utilizan los jobs: carpetas, buckets en la nube y repositorios."
---

Un almacenamiento es una referencia con nombre a una ubicación de ficheros: una carpeta local o de red, un bucket de Amazon S3 o de Google Cloud Storage, o una carpeta de un repositorio de GitHub. Incluye todo lo necesario para acceder a ella, incluidas las credenciales, de modo que los jobs solo necesitan conocer su nombre.

Los almacenamientos forman parte del entorno, junto con las [conexiones](/etl/configuration/connections/) y las [credenciales](/etl/configuration/credentials/). El mismo job puede leer y escribir en una carpeta local en desarrollo y en un bucket de S3 en producción si cada entorno define el almacenamiento con el mismo nombre.

## Dónde se definen

Los almacenamientos se guardan en el fichero de cada entorno, `.crono/environments/<entorno>.jsonc`, en la lista `file-stores`. Cada almacenamiento indica su tipo (`type`), su nombre (`name`) y las propiedades propias del tipo:

```jsonc
{
  "file-stores": [
    {
      "type": "generic",
      "name": "exports",
      "location": "\\\\servidor\\ficheros\\exports"
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

En este ejemplo, el fichero se escribe en la subcarpeta `exports/2026` del almacenamiento `datalake`, sea este una carpeta, un bucket o un repositorio. Cambiar el almacenamiento de una carpeta local a un bucket de S3 no requiere modificar el job.

Algunas recomendaciones:

- El nombre del almacenamiento no debe contener espacios.
- Usa nombres que describan el contenido, no la tecnología: `datalake` o `exports` en lugar de `s3-prod`.
- Usa los mismos nombres en todos los entornos del proyecto.

Las acciones que admiten almacenamientos son, entre otras, [EXPORT PARQUET](/etl/actions/import-export/export-parquet/), [IMPORT PARQUET](/etl/actions/import-export/import-parquet/) y [COPY FILE](/etl/actions/utilities/copy-file/). Además, algunas conexiones usan un almacenamiento como almacenamiento intermedio para la carga masiva, como la de [Redshift](/etl/configuration/connections/#redshift).

## Tipos de almacenamiento

| Tipo | Ubicación | Credenciales |
| --- | --- | --- |
| [Carpeta](#carpeta) | Carpeta local o de red | No |
| [Amazon S3](#amazon-s3) | Carpeta de un bucket de S3 | Credenciales de AWS |
| [Google Cloud Storage](#google-cloud-storage) | Bucket de Google Cloud Storage | Cuenta de servicio de Google |
| [GitHub](#github) | Carpeta de un repositorio de GitHub | Token de GitHub |

<!-- PENDIENTE: Azure Blob Storage / ADLS está previsto; añadirlo cuando exista. -->

### Carpeta

Una carpeta local o de red, accesible desde el equipo que ejecuta Crono ETL.

| Formulario | Propiedad | Descripción |
| --- | --- | --- |
| Ubicación | `location` | Ruta de la carpeta, local (`C:\datos\exports`) o de red (`\\servidor\ficheros`). |
| Descripción | `description` | Descripción del almacenamiento. Opcional. |

Con Crono CLI:

```
crono file-store add generic --name exports --location \\servidor\ficheros\exports
```

<!-- PENDIENTE: captura del formulario y etiquetas. ¿Se admiten rutas relativas a la carpeta del proyecto? (en el .jsonc de ejemplo hay "location": "parquets/"). El usuario que ejecuta Crono ETL necesita permisos sobre la carpeta de red. -->

### Amazon S3

Una carpeta de un bucket de Amazon S3. Crono ETL accede con unas [credenciales](/etl/configuration/credentials/) de AWS del entorno.

| Formulario | Propiedad | Descripción |
| --- | --- | --- |
| Ubicación | `location` | Carpeta del bucket, con la forma `s3://bucket/ruta`. |
| Credenciales | `credentials-name` | Nombre de unas credenciales de tipo Amazon del entorno. |
| Descripción | `description` | Descripción del almacenamiento. Opcional. |

El usuario o el rol de las credenciales necesita los permisos de S3 que correspondan a lo que se haga con el almacenamiento: `s3:ListBucket` sobre el bucket y `s3:GetObject`, `s3:PutObject` o `s3:DeleteObject` sobre los objetos.

Con Crono CLI:

```
crono file-store add amazon --name datalake --location s3://mi-bucket/datalake --credentials-name aws-datalake
```

<!-- PENDIENTE: captura del formulario. La CLI admite también s3://bucket.región/ruta: ¿para qué sirve la región en la ubicación si las credenciales ya tienen región? ¿Qué pasa si credentials-name está vacío (cadena de credenciales por defecto de AWS)? El formulario tenía los campos "Rol IAM" e "Integración Snowflake", que ya no se usan (el rol de Redshift está en la conexión): ¿siguen en el formulario? -->

### Google Cloud Storage

Un bucket de Google Cloud Storage. Crono ETL accede con una cuenta de servicio, definida como [credenciales](/etl/configuration/credentials/) de tipo Google en el entorno.

| Formulario | Propiedad | Descripción |
| --- | --- | --- |
| Bucket | `bucket-name` | Nombre del bucket. |
| Credenciales | `credentials-name` | Nombre de unas credenciales de tipo Google del entorno. |
| Descripción | `description` | Descripción del almacenamiento. Opcional. |

Para que funcione:

- La cuenta de servicio necesita permiso sobre el bucket, por ejemplo con el rol "Usuario de objetos de Storage" concedido en el propio bucket.
- Se recomienda que el bucket use acceso uniforme a nivel de bucket, que es la opción por defecto en los buckets nuevos.

Con Crono CLI:

```
crono file-store add google --name datalake --bucket-name mi-bucket --credentials-name google-dwh
```

<!-- PENDIENTE: captura del formulario. ¿Se admite una carpeta dentro del bucket en la definición del almacenamiento, o solo el bucket? -->

### GitHub

Una carpeta de un repositorio de GitHub, en una rama concreta. Crono ETL accede con un token de GitHub, definido como [credenciales](/etl/configuration/credentials/) de tipo GitHub en el entorno.

| Formulario | Propiedad | Descripción |
| --- | --- | --- |
| Ubicación | `location` | Carpeta del repositorio, con la forma `github://propietario.repositorio.rama/ruta`. |
| Credenciales | `credentials-name` | Nombre de unas credenciales de tipo GitHub del entorno. |
| Descripción | `description` | Descripción del almacenamiento. Opcional. |

El token necesita permiso de lectura sobre el contenido del repositorio y, si se escriben ficheros, también de escritura.

Con Crono CLI:

```
crono file-store add github --name config --location github://mi-empresa.mi-repo.main/config --credentials-name github-crono
```

<!-- PENDIENTE: captura del formulario. ¿Para qué casos de uso está pensado (leer ficheros de configuración, publicar exportaciones...)? ¿Se admite escribir? Nombres con puntos en el propietario o el repositorio (la ubicación usa el punto como separador). -->
