-- Get the users JSON from places of type 3 (User)
-- Get the last known location of the user
select p.id, 
       u.code, 
       u.name, 
       u.surname, 
       p.typeId, 
       pt.code as placeTypeCode, 
       ifnull(p2.x, p.x) as x, 
       ifnull(p2.y, p.y) as y, 
       ifnull(p2.z, p.z) as z, 
       p.subtypeId, 
       p.allowStock, 
       p.parentId, 
       taut.avgTotalTime as avgPickingSeconds
from place p inner join placetype pt on pt.id = p.typeId
             inner join `user` u on u.placeId = p.id
             left join place p2 on p2.id = u.lastKnownLocation
             left join timeavgusertask taut on taut.userId = u.id
where p.typeId = 3 and u.isActive = 1;

-- Stocks in a user
select p.id, p.code, s.quantity
from stock s inner join place p on p.id = s.placeId
			 inner join product p on p.id = s.productId
where p.typeId = 3;

-- Places in a user
select p.id, p2.code, p.weight
from place p inner join place p2 on p2.parentId = p.id
where p.typeId = 3;

-- Tasks and orders attached to a user
SELECT p.id, o.code, count(1) as taskmovements
FROM place p inner join `user` u on p.id = u.placeId
             inner join taskmovement tm on tm.userId = u.id
             inner join taskuser tu on tm.pathNumber = tu.pathNumber
             left join `order` o on tm.orderId = o.id
WHERE p.typeId = 3
GROUP BY p.id, tm.userId, o.code;