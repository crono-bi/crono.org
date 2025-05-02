

# Crono$NamedDirectories

Devuelve las "carpetas con nombre" definidas en las opciones generales de Crono.

Estas propiedades pueden definirse desde cualquiera de las aplicaciones Crono desde "Ayuda/Opciones generales/Propiedades comunes/Carpetas con nombre"

```
SELECT *
FROM Crono$NamedDirectories
```

La pseudoconsulta tiene estas columnas:

- Key
- Value

Las carpeta con nombre sirven para referirse a los archivos de esa carpeta sin incluir rutas absolutas (que pueden cambiar entre entornos).

Por ejemplo, si la carpeta `{Mi Proyecto}` apunta a la carpeta raiz de un proyecto, podremos referirnos a un archivo de este modo: `{Mi Proyecto}\csv\sampleData.csv` y no necesitaremos conocer la ruta absoluta donde está el archivo.




