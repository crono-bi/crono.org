---
title: "crono.data_types"
---

La vista `crono.data_types` devuelve los tipos de datos del lenguaje Crono SQL y su equivalencia en cada motor de base de datos soportado.

```crono-sql
select *
from crono.data_types
```

## Columnas

| Columna | Descripción |
|---|---|
| `category` | Categoría del tipo de dato |
| `data_type_name` | Nombre del tipo de dato en Crono SQL |
| `synonyms` | Sinónimos aceptados para el tipo de dato |
| `sqlserver_equivalent` | Equivalente en SQL Server |
| `sqlserver_synonyms` | Sinónimos en SQL Server |
| `sqlserver_fallback` | Tipo alternativo en SQL Server si el equivalente no existe |
| `postgres_equivalent` | Equivalente en PostgreSQL |
| `postgres_synonyms` | Sinónimos en PostgreSQL |
| `postgres_fallback` | Tipo alternativo en PostgreSQL |
| `redshift_equivalent` | Equivalente en Redshift |
| `redshift_synonyms` | Sinónimos en Redshift |
| `redshift_fallback` | Tipo alternativo en Redshift |
| `snowflake_equivalent` | Equivalente en Snowflake |
| `snowflake_synonyms` | Sinónimos en Snowflake |
| `snowflake_fallback` | Tipo alternativo en Snowflake |
| `bigquery_equivalent` | Equivalente en BigQuery |
| `bigquery_synonyms` | Sinónimos en BigQuery |
| `bigquery_fallback` | Tipo alternativo en BigQuery |
| `databricks_equivalent` | Equivalente en Databricks |
| `databricks_synonyms` | Sinónimos en Databricks |
| `databricks_fallback` | Tipo alternativo en Databricks |
| `fabric_equivalent` | Equivalente en Microsoft Fabric |
| `fabric_synonyms` | Sinónimos en Microsoft Fabric |
| `fabric_fallback` | Tipo alternativo en Microsoft Fabric |
| `duckdb_equivalent` | Equivalente en DuckDB |
| `duckdb_synonyms` | Sinónimos en DuckDB |
| `duckdb_fallback` | Tipo alternativo en DuckDB |
