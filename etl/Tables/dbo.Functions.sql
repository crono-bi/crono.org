
CREATE OR REPLACE PROCEDURE
MERGE CLONE dbo.Functions(idFunction)
select  top 1 over (partition by FunctionName order by FunctionType)
	f.Name #FunctionName,
	groups.FunctionGroup FunctionGroup,
	f.expr2 FunctionType, 
	coalesce(issues.BodyMarkdown,trim(msdn.spanish)) Body
from Crono$Functions f
left join @@github.Issues filter (repositoryname='cronosql.io') using (name title)
left join (
	select c1 Name, $'{c2}¬ ¬ ## Comentarios ¬ ¬ `{c1}` es una función de SQL estándar. Consulte la documentación completa de la función [`{c1}`](https://learn.microsoft.com/es-es/sql/t-sql/functions/{c1}-transact-sql) para mayor información.' spanish
	from FILE 'D:\GitHub\cronosql.io\etl\CSV\functions-es.csv'
) msdn using Name
left join (
	select c2 Name, c1 FunctionGroup
	from FILE 'D:\GitHub\cronosql.io\etl\CSV\grupos.csv'
) groups using Name
where not (FunctionType='SQL' and body is null)








