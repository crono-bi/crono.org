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