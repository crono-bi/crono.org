UPDATE table1 SET
  CodeDescription=(SELECT table2.CODE AS CODE
  FROM table2
  WHERE table1.CodeDescription=table2.description
  )
WHERE
  EXISTS (SELECT table2.CODE AS CODE
  FROM table2
  WHERE table1.CodeDescription=table2.description
  );