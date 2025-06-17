
# Crono$Union

Las vistas `Crono$Union` y `Crono$UnionAll` permiten unir múltiples tablas (o vistas) en un único resultado.


Se compartan igual que las funciones de Crono `Union()` y `UnionAll()`, pero las tablas a concatenar se obtienen mediante una consulta.

**Sintaxis:**

```
Crono$Union(
    [Tables]=(SELECT... )
)
```

La vista `Crono$Union` usa el operador `UNION` para unir las tablas.

## Ejemplo

Imaginemos que tenemos 3 bases de datos con las mismas tablas. el lenguaje **Crono SQL** permite unir una de las tablas de esas bases de datos con las de este modo:

```
SELECT *
FROM Union(empresa1.TIENDAS,empresa2.TIENDAS,empresa3.TIENDAS)
```

Este método podría resultar farragoso si hay muchas "bases de datos" o estas varian con el tiempo. Para estos casos, existe la vista `Crono$Union` que permite determinar las tablas a unir a partir de una sentencia.

```
SELECT *
FROM Crono$Union(
    Tables=(
        SELECT concat(SchemaName,'.TIENDAS')
        FROM dbo.empresas
    )
)
```

## Comentarios

-- Las tablas a concatenar no necesitan tener exactamente los mismos campos. Crono verificará los campos existentes para completar con `NULLs` las columnas ausentes en alguna de las tablas.
-- **Crono** añade las columnas `UnionAll$Source` y `UnionAll$Position` para identificar adecuadamente el origen de registro del resultado 
-- Las vistas `Crono$Union` y `Crono$UnionAll` se comportan igual, pero mientras la primera usa el operador `UNION` la segunda usa `UNION ALL`.  




