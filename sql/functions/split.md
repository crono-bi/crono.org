

# split

La función `split` divide una cadena de texto en partes usando un separador especificado y devuelve el elemento en la posición indicada por el índice (comenzando en 1).

Es útil para extraer componentes específicos de cadenas estructuradas, como nombres, rutas, o listas separadas por comas o espacios.

**Sintaxis:**

```
SPLIT(cadena, separador, índice)
```

## Ejemplo

```
SELECT SPLIT('hola mundo', ' ', 2);  -- Devuelve 'mundo'
```

El código generado es:

```
SELECT SUBSTRING('hola mundo',CHARINDEX(' ','hola mundo'+' ')+1,CHARINDEX(' ','hola mundo'+' ',CHARINDEX(' ','hola mundo'+' ')+1)-CHARINDEX(' ','hola mundo'+' ')-1) AS expr1
```