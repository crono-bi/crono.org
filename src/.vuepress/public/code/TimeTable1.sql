SELECT *
FROM
  (SELECT
   	[date]  [Date],
   	CONVERT(VARCHAR(50), [date], 100) USDate,
   	CONVERT(VARCHAR(50), [date], 103) EurDate,
   	CONVERT(VARCHAR(10), [date], 112) IsoDate,
   	CONVERT(VARCHAR(10), [date], 102) AnsiDate,
   	year([date]) [Year],
   	concat('Q',datepart(q,[date])) [Quarter],
   	concat(year([date]),'-Q',datepart(q,[date])) [YearQuarter],
   	month([date]) [MonthNumber],
   	100*year([date])+month([date]) yyyymm,
   	datename(mm,[date])	[Month],
   	concat(year([date]),'-M',format(datepart(m,[date]),'D2')) YearMonth,
   	day([date]) [Day],
   	datename(dw,[date])	WeekDay,
   	datepart(dy,[date])	DayOfYear,
   	datepart(isowk,[date]) IsoWeekNumber,
   	year([date])+case when month([date])=1 and datepart(isowk,[date])&gt;50 then -1 when month([date])=12 and datepart(isowk,[date])=1 then +1 else 0 end IsoWeekYear,
   	concat(year([date])+case when month([date])=1 and datepart(isowk,[date])&gt;50 then -1 when month([date])=12 and datepart(isowk,[date])=1 then +1 else 0 end,'-W',format(datepart(isowk,[date]),'D2')) IsoWeek
   FROM (
   	SELECT dateadd(d, u1.n+u2.n*10+u3.n*100+u4.n*1000+u5.n*10000, CAST('19000101' AS date)) [date]
   	FROM
   		(SELECT 0 n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) u1,
   		(SELECT 0 n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) u2,
   		(SELECT 0 n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) u3,
   		(SELECT 0 n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) u4,
   		(SELECT 0 n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7) u5) dates) a
WHERE year BETWEEN 2000 AND year(getdate())