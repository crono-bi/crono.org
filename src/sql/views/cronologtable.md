
# Crono$LogTable

La pseudovista `Crono$LogTable` devuelve información sobre la configuración de la tabla de logs.

Típicamente, cada proyecto de **Crono ETL** tiene una *tabla de logs* donde se registra el inicio y final de cada proceso de carga.

Si está configurada la tabla de logs, esta vista devuelve un registro con estas columnas:

- **SchemaName**: Esquema donde esta la tabla de logs
- **TableName**: Nombre de la tabla de logs
- **AuditIdColumn** 
- **AuditParentIdColumn** 
- **AuditRootIdColumn**
- **AuditStartDateColumn**
- **AuditEndDateColumn**
- **AuditDescriptionColumn**
- **AuditRowsCountColumn**
- **AuditMessageErrorColumn**
- **AuditUserColumn**
- **AuditSpidColumn**

**Crono ETL** utiliza esta información para añadir automáticamente información en la tabla de logs.


Esta información está guardada en las propiedades extendidas de la base de datos y en las propiedades extendidas de las propias columnas de la tabla de logs.

Esta es la configuración predeterminada:

```
CREATE OR ALTER TABLE audit.Logs (
  IdLog 			int IDENTITY(1,1) PRIMARY KEY,
  IdLogPadre 		int,
  IdLogCarga		int,
  FechaInicio		datetime,
  FechaFin			datetime,
  Procedimiento 		varchar(100),
  NumRegistros		int,
  DuracionSegundos	int,
  MensajeError		varchar(max),
  Usuario			varchar(50),
  Nivel				int,
  EsPadre			bit,
  Spid				varchar(5),
  Hash				varchar(100)
)


CREATE OR REPLACE EXTENDED PROPERTY AuditSchema ON DATABASE AS 'audit'
CREATE OR REPLACE EXTENDED PROPERTY AuditTable ON DATABASE AS 'Logs'


CREATE OR REPLACE EXTENDED PROPERTY AuditIdColumn 				ON COLUMN audit.Logs(IdLog) 
CREATE OR REPLACE EXTENDED PROPERTY AuditParentIdColumn 		ON COLUMN audit.Logs(IdLogPadre) 
CREATE OR REPLACE EXTENDED PROPERTY AuditRootIdColumn 			ON COLUMN audit.Logs(IdLogCarga) 
CREATE OR REPLACE EXTENDED PROPERTY AuditStartDateColumn 		ON COLUMN audit.Logs(FechaInicio) 
CREATE OR REPLACE EXTENDED PROPERTY AuditEndDateColumn 			ON COLUMN audit.Logs(FechaFin) 
CREATE OR REPLACE EXTENDED PROPERTY AuditDescriptionColumn 		ON COLUMN audit.Logs(Procedimiento) 
CREATE OR REPLACE EXTENDED PROPERTY AuditRowsCountColumn 		ON COLUMN audit.Logs(NumRegistros)
CREATE OR REPLACE EXTENDED PROPERTY AuditMessageErrorColumn 	ON COLUMN audit.Logs(MensajeError)
CREATE OR REPLACE EXTENDED PROPERTY AuditUserColumn 			ON COLUMN audit.Logs(Usuario) 
CREATE OR REPLACE EXTENDED PROPERTY AuditSpidColumn 			ON COLUMN audit.Logs(Spid)

```


## Comentarios

- Esta información la utiliza también la psuedovista `Crono$Logs` 