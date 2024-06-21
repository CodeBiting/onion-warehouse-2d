-- Order totals: 
-- - Total number of existing commands, grouped by type, for example, with a pie
-- - Total number of orders in preparation, for example with a pie
select ot.code as typeCode, os.code as statusCode, count(*) numOrders
from `order` o inner join ordertype ot on ot.id = o.orderTypeId
               inner join orderstatus os on os.id = o.orderStatusId
group by ot.code, os.code
order by ot.code, os.code;

-- Task totals: Total number of pending moves, for example, with a pie diagram
select tt.code, tst.code, count(*) as numTasks
from taskmovement tm inner join tasktype tt on tt.id = tm.taskTypeId
                     inner join taskstatustype tst on tst.id = tm.taskStatusTypeId
group by tt.code, tst.code
order by tt.code, tst.code;

-- Task to finish an ordre, l'estimat es calcula abans de lliverar i l'altre un cop alliverat
-- es necessari tenir activat el JOB calculateGlobalTimePicking, sinó els camps següents no tenen valor
-- per calcular el temps estimat a partir de les tasques s'ha de multiplicar els moviments per la taula timeavgglobaltransfer.globalavgtime
-- - EstimatedprepareTime: temps mig de picking del magatzem en base a històric de tasques fetes
-- - CalculatedPrepareTime: temps mig de picking del magatzem en base a tasques pendents, als historics en les taules on es guarden els temps de pick
select sum(ifnull(o.estimatedPrepareTime, 0)) as totalEstimatedPrepareTime, 
	   sum(ifnull(o.calculatedPrepareTime, 0)) as totalCalculatedPrepareTime
from `order` o inner join taskmovement tm on tm.orderId = o.id;

-- Number of users picking, placing or restocking
select u.code, tt.code as taskTypeCode, count(1) as numTasks 
  from `user` u left join taskmovement tm on tm.userId = u.id
				left join tasktype tt on tt.id = tm.taskTypeId
group by u.code, tt.code;