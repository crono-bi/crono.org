---
title: "crono.replacements"
---



Devuelve las "sustituciones" definidas en las propiedades del proyecto Crono ETL.

```crono-sql
SELECT *
FROM crono.replacements
```

## Columnas

| Columna | Descripción |
|---|---|
| Key | Clave de la sustitución |
| Value | Valor por el que se sustituye la clave |


Las sustituciones son pares clave-valor que se aplican antes de ejecutar el código Crono SQL. Son utiles para no incluir constantes o variables que pueden cambiar o dependen del entorno. 

Por ejemplo, podemos usuar la sustitución "@@erp" para apuntar a la base de datos y el esquema donde se encuentran las tablas.

De este modo, podríamos escribir `@@erp.Ventas` para referirnos a `dbprod01_sql2022.dbo.Ventas`...

