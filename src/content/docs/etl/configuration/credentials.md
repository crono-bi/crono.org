---
title: "Credenciales"
description: "Claves y tokens con los que Crono ETL accede a servicios de AWS, Google Cloud y GitHub."
---

Las credenciales permiten identificar a Crono ETL ante un servicio en la nube y contienen los secretos necesarios para acceder a él: claves de acceso, una clave privada o un token. Hay tres tipos:

- **Amazon**, para Redshift y Amazon S3.
- **Google**, para BigQuery y Google Cloud Storage.
- **GitHub**, para los repositorios de GitHub.

Las acciones no hacen referencia a las credenciales: son las conexiones y los almacenamientos los que indican, por su nombre, qué credenciales utilizan. De este modo cada secreto se define una sola vez y puede compartirse; por ejemplo, una conexión de BigQuery y un almacenamiento de Google Cloud Storage pueden usar las mismas credenciales.

Las credenciales forman parte del entorno, junto con las [conexiones](/etl/configuration/connections/) y los [almacenamientos](/etl/configuration/storage/).

## Dónde se definen

Las credenciales se guardan en la lista `credentials` del fichero de cada entorno, `.crono/environments/<entorno>.jsonc`. Cada una indica su tipo (`type`), su nombre (`name`) y las propiedades propias del tipo, con los secretos cifrados:

```jsonc
{
  "credentials": [
    {
      "type": "amazon",
      "name": "aws-dwh",
      "mode": "IamUser",
      "access-key": "AKIAIOSFODNN7EXAMPLE",
      "secret-key": "[ENCRYPTED TEXT]",
      "region": "eu-west-1"
    },
    {
      "type": "google",
      "name": "google-dwh",
      "client-email": "crono@mi-proyecto.iam.gserviceaccount.com",
      "private-key": "[ENCRYPTED TEXT]"
    }
  ]
}
```

Igual que las conexiones y los almacenamientos, pueden crearse y modificarse desde Crono ETL, en las propiedades del entorno; desde Crono CLI, con los comandos `crono credential list`, `add <tipo>`, `edit <tipo>` y `remove`; o editando directamente el fichero. En Crono CLI los secretos no se escriben en la línea de comandos, sino que se leen de la entrada estándar con la opción `--secret-stdin <propiedad>`.

## Uso de las credenciales

Las conexiones y los almacenamientos indican las credenciales que usan con la propiedad `credentials-name`:

| Credenciales | Conexiones | Almacenamientos |
| --- | --- | --- |
| [Amazon](#amazon) | [Redshift](/etl/configuration/connections/#redshift) | [Amazon S3](/etl/configuration/storage/#amazon-s3) |
| [Google](#google) | [BigQuery](/etl/configuration/connections/#bigquery) | [Google Cloud Storage](/etl/configuration/storage/#google-cloud-storage) |
| [GitHub](#github) | — | [GitHub](/etl/configuration/storage/#github) |

Las demás conexiones guardan el usuario y la contraseña, o el token, en la propia conexión.

Si un almacenamiento de Amazon S3 o de GitHub no indica credenciales, Crono ETL usa las predeterminadas, definidas en **Ayuda > Opciones generales > Propiedades comunes**. Estas credenciales no forman parte del entorno, sino de la configuración de Crono ETL en cada equipo.

Algunas recomendaciones:

- Usa nombres que indiquen el servicio y el uso, como `aws-dwh` o `google-dwh`.
- Usa los mismos nombres en todos los entornos, aunque cada uno tenga sus propias claves; así no hay que cambiar nada más al pasar de un entorno a otro.
- Concede a cada credencial solo los permisos que necesite.

## Tipos de credenciales

### Amazon

Credenciales de AWS, para Redshift y Amazon S3. En Crono ETL se configuran con el formulario Amazon:

![Formulario de unas credenciales de Amazon](/images/etl/configuration/credentials/amazon.png)

Admiten dos modos de autenticación:

- **Usuario IAM** (`IamUser`), el modo por defecto: las claves de acceso de un usuario IAM y la región.
- **Perfil de Amazon** (`AwsProfile`): un perfil de la configuración de AWS del equipo (la carpeta `.aws` del usuario), que puede elegirse de la lista o crearse desde el formulario. Como el perfil está en el equipo y no en el entorno, debe existir en todos los equipos que ejecuten el proyecto.

Estas son las propiedades de las credenciales, con su nombre en el fichero del entorno y en Crono CLI:

| Nombre | Propiedad | Descripción |
| --- | --- | --- |
| Modo de autenticación | `mode` | `IamUser` (usuario IAM) o `AwsProfile` (perfil de Amazon). Por defecto, `IamUser`. |
| Clave de acceso | `access-key` | Identificador de la clave de acceso (access key ID). Solo con `IamUser`. |
| Clave secreta | `secret-key` | Clave de acceso secreta. Se guarda cifrada. Solo con `IamUser`. |
| Región | `region` | Región de AWS, por ejemplo `eu-west-1`. Solo con `IamUser`. |
| Perfil | `profile-name` | Nombre del perfil de AWS. Solo con `AwsProfile`. |

Con Crono CLI:

```
crono credential add amazon --name aws-dwh --mode IamUser --access-key AKIAIOSFODNN7EXAMPLE --region eu-west-1
crono credential edit amazon --name aws-dwh --secret-stdin secret-key < secret.txt
```

<!-- PENDIENTE: Con AwsProfile, la región se toma del perfil (el formulario no la muestra): confirmar. Confirmar la sintaxis de --secret-stdin en add (¿se puede crear con el secreto en un solo comando?). -->

### Google

Una cuenta de servicio de Google Cloud, para BigQuery y Google Cloud Storage. En Crono ETL se configuran con el formulario Google:

![Formulario de unas credenciales de Google](/images/etl/configuration/credentials/google.png)

Los datos se obtienen del fichero JSON de la clave de la cuenta de servicio, que se descarga desde la consola de Google Cloud. El botón **Load JSON file** lee ese fichero y rellena el correo y la clave privada.

Estas son las propiedades de las credenciales, con su nombre en el fichero del entorno y en Crono CLI:

| Nombre | Propiedad | Descripción |
| --- | --- | --- |
| Correo electrónico | `client-email` | Correo de la cuenta de servicio (`client_email` en el fichero JSON). |
| Clave privada | `private-key` | Clave privada de la cuenta de servicio (`private_key` en el fichero JSON). Se guarda cifrada. |

Los permisos se conceden a la cuenta de servicio en Google Cloud: en BigQuery, sobre el proyecto; en Google Cloud Storage, sobre el bucket.

Con Crono CLI:

```
crono credential add google --name google-dwh --client-email crono@mi-proyecto.iam.gserviceaccount.com
crono credential edit google --name google-dwh --secret-stdin private-key < private-key.pem
```

<!-- PENDIENTE: concretar los roles de BigQuery necesarios (BigQuery Data Editor + Job User). ¿La CLI admite cargar el fichero JSON de la clave? -->

### GitHub

Un token de acceso de GitHub, para los almacenamientos de GitHub. En Crono ETL se configuran con el formulario GitHub:

![Formulario de unas credenciales de GitHub](/images/etl/configuration/credentials/github.png)

El token puede obtenerse de dos formas:

- **OAuth** (`OAuth`): el botón del lápiz abre GitHub para autorizar a Crono ETL y obtener el token. Después, el formulario muestra el usuario de GitHub y los repositorios a los que da acceso.
- **Token de acceso personal** (`AccessToken`): el token se crea en GitHub, desde la página que abre el enlace **Generate new token**, y se pega en el formulario. Recomendamos un token *fine-grained* que dé acceso solo a los repositorios necesarios, con permiso de lectura sobre el contenido y, si se escriben ficheros, también de escritura.

Estas son las propiedades de las credenciales, con su nombre en el fichero del entorno y en Crono CLI:

| Nombre | Propiedad | Descripción |
| --- | --- | --- |
| Tipo de credencial | `token-type` | `OAuth` o `AccessToken`. Obligatorio. |
| Token | `token` | Token de acceso a GitHub. Se guarda cifrado. |

Con Crono CLI:

```
crono credential add github --name github-crono
crono credential edit github --name github-crono --secret-stdin token < token.txt
```

<!-- PENDIENTE: los valores de token-type (OAuth, AccessToken) no siguen la convención del resto del fichero; se prevé revisarlos. Si no se indica, el código toma OAuth (primer valor del enum), pero se documenta como obligatorio. Revisar la autenticación de GitHub desde Crono CLI: token-type no aparece en los recursos de la CLI y el ejemplo no lo indica. -->
