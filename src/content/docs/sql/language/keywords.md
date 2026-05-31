---
title: "Palabras reservadas"
sidebar:
  order: 110
---


En la lista siguiente se incluyen todas las palabras reservadas por el generador de consultas de **Crono SQL**. 

Estas palabras clave se pueden utilizar como identificadores o nombres de objetos de base de datos, pero para ello se deben escribir entre corchetes.

|Keyword1             |Keyword2         |Keyword3         |Keyword4              |Keyword5       |
|---------------------|-----------------|-----------------|----------------------|---------------|
|ACTION               |ADD              |ALL              |ALTER                 |AND            |
|ANTI                 |APPLY            |ARRAY            |AS                    |ASC            |
|ASSERT               |ASYNC            |AUTHORIZATION    |AUTO_INCREMENT        |AVGIF          |
|BEGIN                |BETWEEN          |BREAK            |BUNDLE                |BY             |
|CALCULATE            |CASCADE          |CASE             |CAST                  |CATCH          |
|CHECK                |CLONE            |CLUSTERED        |CMD                   |COLLATE        |
|COLLECTION           |COLUMN           |COLUMNS          |COMBINE               |COMMIT         |
|COMPARE              |COMPUTED         |CONSTRAINT       |CONTAINS              |CONVERT        |
|COUNTIF              |CREATE           |CROSS            |CSV                   |CURRENT        |
|DATABASE             |DATASET          |DECLARE          |DEFAULT               |DEFAULT-VALUE  |
|DELETE               |DESC             |DICTIONARY       |DIFFERENCES           |DIRECTORY      |
|DISTINCT             |DROP             |DUPLICATES       |DYNAMIC               |EACH           |
|ELSE                 |END              |ENDS             |EVALUATE              |EXCEL          |
|EXCL                 |EXCLUSIVE        |EXEC             |EXECUTE               |EXISTS         |
|EXPORT               |EXPRESSION       |EXPRESSION_LIST  |EXTENDED              |FACT           |
|FILE                 |FILE_CONTENT     |FILTER           |FINALIZATION          |FOLLOWING      |
|FOR                  |FOREIGN          |FROM             |FULL                  |FULLSCAN       |
|FUNCTION             |GET              |GROUP            |HAVING                |HISTORY        |
|IDENTITY             |IF               |IIF              |IMMEDIATE             |IN             |
|INCL                 |INCLUDE          |INCLUSIVE        |INCREMENTAL           |INDEX          |
|INFO                 |INFORMATION      |INITIALIZATION   |INNER                 |INSERT         |
|INTEGERS             |INTO             |IS               |JOIN                  |KEY            |
|KILL                 |LEFT             |LIKE             |LIMIT                 |LINKED         |
|LIST                 |LOAD             |LOGGER           |LOGIN                 |LOOKUP         |
|MAIN                 |MATCHED          |MATERIALIZE      |MAXIF                 |MEMBER         |
|MERGE                |MINIF            |MTD              |MULTI                 |NAMES          |
|NEXT                 |NO               |NO-MERGE         |NO_ALTER              |NO_AUDIT       |
|NO_BK                |NO_GROUP         |NO_MERGE         |NO_WAIT               |NOCHECK        |
|NONCLUSTERED         |NONE             |NONUNIQUE        |NOT                   |NULL           |
|OBJECT               |OBJECT_TYPE      |OFF              |ON                    |ONLY           |
|OPTION               |OR               |ORDER            |OUT                   |OUTER          |
|OUTPUT               |OVER             |OVERWRITE        |PARALLEL              |PARAMETER_LIST |
|PARTITION            |PERCENT          |PRECEDING        |PREVIOUS              |PRIMARY        |
|PRINT                |PROCEDURE        |PROPERTY         |QTD                   |QUALIFY        |
|RAISE                |RAISERROR        |RANGE            |REFERENCES            |REMOTE         |
|REMOVE               |REPLACE          |RETURN           |RETURNS               |RIGHT          |
|ROLE                 |ROLLBACK         |ROUTINES         |ROW                   |ROWS           |
|RUN                  |SCHEMA           |SELECT           |SELECT_ALL            |SEMI           |
|SEPARATOR            |SERVER           |SET              |SET_PROPERTY_NAME_EQUAL|SKIP          |
|SNOWFLAKE            |SOFT             |SOURCE           |SQL                   |START          |
|STARTS               |STATEMENT        |STATEMENTS       |STATISTICS            |STRING_AGG     |
|SUMIF                |TABLE            |TABLES           |TD                    |THAT           |
|THEN                 |THROW            |TO               |TOP                   |TRANSACTION    |
|TRUNCATE             |TRY              |UNBOUNDED        |UNDEFINED             |UNION          |
|UNIQUE               |UNPIVOT          |UPDATE           |UPSERT                |URI            |
|USE                  |USER             |USING            |VALUE                 |VALUES         |
|VIEW                 |VIRTUAL          |WHEN             |WHERE                 |WHILE          |
|WITH                 |WITHIN           |WITHOUT          |WORKFLOW              |YES            |
|YTD                  |                 |                 |                      |               |


El propio lenguaje **Crono SQL** permite consultar las palabras reservadas con la vista **crono.keywords**.

El anterior listado se puede obtener con esta consulta:


```crono-sql
SELECT
  maxif(col=0, name) keyword1,
  maxif(col=1, name) keyword2,
  maxif(col=2, name) keyword3,
  maxif(col=3, name) keyword4,
  maxif(col=4, name) keyword5
FROM (
  SELECT
    rank(ORDER BY name) - 1  [rank],
    floor([rank] / 5.0)      [row],
    mod([rank], 5)           col,
    name
  FROM crono.Keywords
  WHERE NOT name STARTS WITH 'CRONO'
) a
GROUP BY [row]
ORDER BY [row]
```
