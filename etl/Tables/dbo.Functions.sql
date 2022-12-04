
CREATE OR REPLACE PROCEDURE
DELETE AND INSERT dbo.Functions(idFunction)
select  top 1 over (partition by FunctionName order by FunctionType)
	f.Name FunctionName,
	functions.Description,
	concat(FunctionName  , if(FunctionType='Crono',N' ❇️') , if(IsFavorite=YES,N' ❤️ ') , if(Body IS NuLL,' ' + NCHAR(0xD83D) + NCHAR(0xDEA7))) NameEmoji,
--	concat(FunctionName  , if(FunctionType='Crono',N' ❇️') , if(IsFavorite=YES,N' ❤️ ') , if(Body IS NuLL,N' ⛔' )) NameEmoji,
	concat('index-',coalesce(lower(functions.FunctionGroup),'misc'),'-functions') FunctionGroup,
	coalesce(functions.IsFavorite,NO) IsFavorite,
	f.FunctionType, 
	CASE 
		WHEN issues.BodyMarkdown IS NOT NULL THEN issues.BodyMarkdown
		WHEN nullifempty(functions.Description) IS NOT NULL THEN $'{functions.Description}¬ ¬ ## Comentarios ¬ ¬ `{f.Name}` es una función de SQL estándar. Consulte la documentación completa de la función [`{f.Name}`](https://learn.microsoft.com/es-es/sql/t-sql/functions/{f.Name}-transact-sql) para mayor información.'
	END Body 
	
from Crono$Functions f
left join @@github.Issues filter (repositoryname='cronosql.io') using (name title)
left join excel.functions using (name functionName)
where 
 f.name not starts with 'Crono$'

