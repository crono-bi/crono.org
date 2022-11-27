
CREATE OR REPLACE PROCEDURE
MERGE CLONE dbo.Pseudoviews(IdPseudoViews)
select 
	v.CronoViewName #CronoViewName,
	groups.ViewGroup
from Crono$CronoViews v
left join (
	select c2 CronoViewName, c1 ViewGroup
	from FILE 'D:\GitHub\cronosql.io\etl\CSV\grupos-views.csv'
) groups using CronoViewName 
