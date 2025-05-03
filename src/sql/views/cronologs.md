
# Crono$Logs

La pseudovista `Crono$Logs` ofrece una vista unificada de los registros en la tabla de logs.

Típicamente, cada proyecto de **Crono ETL** tiene una *tabla de logs* donde se registra el inicio y final de cada proceso de carga. Sea como sea esa tabla de logs, `Crono$Logs` muestra los datos con estas columnas:

- Id
- ParentId
- RootId
- StartDate
- EndDate
- DurationMinutes
- Description
- RowsCount
- MessageError
- User
- Spid

**Crono ETL** usa esta vista para generar el Diagrama de Gannt.
