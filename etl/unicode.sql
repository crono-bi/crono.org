
--select where CodePoint in ('U+2764','U+1F600')



SELECT
       if(c.[num] > 65535,NCHAR([HighSurrogateINT]) + NCHAR([LowSurrogateINT]), NCHAR(c.[num])) AS [Char],
       c.[num] AS [CdPntINT],
	   CONVERT(CHAR(6), CONVERT(BINARY(3), c.[num]), 2) bin,
	   if(num>65535,right(bin,5),right(bin,4)) [CodePointHex],
       cast(CASE WHEN c.[num] > 65535 THEN 55232 + (c.[num] / 1024) END as int) AS [HighSurrogateINT],
       cast(CASE WHEN c.[num] > 65535 THEN 56320 + (c.[num] % 1024)  END as int) AS [LowSurrogateINT],
	   'U+' + [CodePointHex] AS [CodePoint], 
       '0x' + [CodePointHex] AS [CdPntBIN],
       '&#x' + [CodePointHex] + ';' AS [HTML/XML],
       CASE 
			WHEN c.[num] > 65535 THEN 'NCHAR(' +  CONVERT(CHAR(6),  CONVERT(BINARY(2), [HighSurrogateINT]), 1) + ') + NCHAR(' + CONVERT(CHAR(6),CONVERT(BINARY(2), [LowSurrogateINT]), 1)+ ')'
            ELSE 'NCHAR(' + CONVERT(CHAR(6), CONVERT(BINARY(2), c.[num]), 1) + ')'
       END    AS [T-SQL]
 from integers between 0 and 1114110 c
 WHERE  
 	c.[num] BETWEEN 0x000000 AND 0x014700 -- filter out 925,455 
  	OR c.[num] BETWEEN 0x016800 AND 0x030000 -- unmapped code
  	OR c.[num] BETWEEN 0x0E0001 AND 0x0E01EF -- points
order by num
