IF EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_SCHEMA='dbo' AND ROUTINE_NAME='MaxValue' AND ROUTINE_TYPE='FUNCTION')
DROP FUNCTION dbo.MaxValue;

CREATE FUNCTION dbo.MaxValue(@a int,@b int,@c int) RETURNS int AS
BEGIN

  DECLARE @result int;
  
  IF (@a&gt;=@b AND @a&gt;=@b)
    SET @result=@a;
  ELSE
    BEGIN
      IF @b&gt;=@c
        SET @result=@b;
      ELSE
        SET @result=@c;
    END
  
  
  RETURN @result
  
  
END