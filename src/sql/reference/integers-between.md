﻿---
title: INTEGERS BETWEEN
Autogenerated: true
---

# INTEGERS BETWEEN

La subconsulta predefinida **INTEGERS BETWEEN a AND b** permite generar fácilmente una tabla de enteros consecutivos. 


<div class="mt-1 mb-2 row">
  <div class="col-lg-12">

``` sql
select *
from integers between 100 and 1500000
```

  <b-button class="float-right btn" size="sm" v-b-modal.modal-1 style="background-color: #3eaf7c">Ver SQL compilado</b-button>

  <b-modal id="modal-1" size="lg" title="Ver SQL compilado" :hide-footer="true" > 
``` sql
SELECT *
FROM
  (SELECT 100+u1.n+u2.n*10+u3.n*100+u4.n*1000+u5.n*10000+u6.n*100000+u7.n*1000000 num
   FROM
     (SELECT 0 n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) u1,
     (SELECT 0 n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) u2,
     (SELECT 0 n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) u3,
     (SELECT 0 n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) u4,
     (SELECT 0 n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) u5,
     (SELECT 0 n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) u6,
     (SELECT 0 n UNION SELECT 1) u7
   WHERE 100+u1.n+u2.n*10+u3.n*100+u4.n*1000+u5.n*10000+u6.n*100000+u7.n*1000000 BETWEEN 100 AND 1500000) a

```
  </b-modal>

  </div>
</div>