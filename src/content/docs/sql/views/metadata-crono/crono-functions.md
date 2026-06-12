---
title: "crono.functions"
---

La vista `crono.functions` devuelve el catálogo de funciones propias de Crono SQL, incluyendo sus sinónimos y la categoría a la que pertenecen. Para una descripción completa del sistema de funciones de Crono SQL, consulta el apartado [Funciones](/sql/functions/).

La vista devuelve el listado completo de funciones junto con su categoría y sus sinónimos:

```crono-sql
select *
from crono.functions
```

## Columnas

| Columna | Descripción |
|---|---|
| `function_name` | Nombre de la función |
| `category` | Categoría de la función |
| `synonyms` | Sinónimos o nombres alternativos de la función |

Las funciones están agrupadas en 7 categorías:

- [**Agregación**](/sql/functions/agregacion/) — funciones de agregación, ventana y análisis estadístico.
- [**Conversión de tipos**](/sql/functions/conversion/) — conversión entre tipos de datos.
- [**Numéricas**](/sql/functions/numericas/) — operaciones matemáticas y aritméticas.
- [**Fecha**](/sql/functions/fecha/) — manipulación de fechas y horas.
- [**Nulos y condiciones**](/sql/functions/nulos/) — manejo de valores nulos y expresiones condicionales.
- [**Texto**](/sql/functions/texto/) — manipulación de cadenas de texto.
- [**Metadata**](/sql/functions/metadata/) — funciones informativas del sistema.
