
:: ===========================================================================================================
::
:: Este script descarga los issues de Github, genera el sitio de Vuepress, y lo publica en firebase...
::
:: Llamada: `cronobot sites run publish`
::
:: ===========================================================================================================


cronobot github loaddb bifacil cronosql.io
cronobot db executeprocedure "cronosql.metadata" "dbo.[LOAD dbo.Functions]"
cronobot db executeprocedure "cronosql.metadata" "dbo.[LOAD dbo.Pseudoviews]"
cronobot sites updatevuepress
vuepress build src
firebase deploy
