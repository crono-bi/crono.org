
CREATE OR REPLACE PROCEDURE
MERGE CLONE dbo.Functions(idFunction)
select  top 1 over (partition by FunctionName order by FunctionType)
	Name #FunctionName,
	expr2 FunctionType
from Crono$Functions

