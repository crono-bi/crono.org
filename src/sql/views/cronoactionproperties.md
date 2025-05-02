
# Crono$ActionProperties

La función `Crono$ActionProperties` devuelve las propiedades que admiten las acciones propias de Crono.


```
select *
from Crono$ActionProperties
```

La respuesta incluye estas columnas:


- **Name**: Nombre de la accion
- **TypeName**: Nombre interno identificativo de la acción
- **PropertyName**: Nombre de la propiedad
- **PropertyType**: Tipo de dato de la propiedad (numérico, texto, booleanos, etc.)
- **AlternativeName**: Nombre altternativo que puede usarse para referirse a la propiedad
