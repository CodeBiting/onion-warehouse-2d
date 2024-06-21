-- Get the warehouse JSON from places of type:
-- 1: Organization
-- 2: Warehouse
-- 5: Shelf
-- 6: Location
-- 8: Dock
-- 9: Buffer
-- 10: Fabrication line
-- 12: Picking
select p.id, 
       p.code, 
       p.typeId, 
       pt.code as placeTypeCode, 
       p.x, 
       p.y, 
       p.z, 
       p.subtypeId, 
       p.allowStock, 
       p.parentId,
       sum(ifnull(tapt.times, 0)) as numPicking,
       sum(ifnull(tapt.avgTime, 0)) as avgPickingSeconds
from place p inner join placetype pt on pt.id = p.typeId
             left join timeavgplacetransfer tapt on tapt.destPlaceId = p.id
where p.typeId in (1, 2, 5, 6, 8, 9)
group by p.id, 
       p.code, 
       p.typeId, 
       pt.code, 
       p.x, 
       p.y, 
       p.z, 
       p.subtypeId, 
       p.allowStock, 
       p.parentId
order by p.typeId, p.code

-- Place status
select p.id, p.code, pst.code as statusCode
from place p inner join placechew pc on pc.childId = p.id
             inner join placestatus ps on ps.placeId = p.id
             inner join placestatustype pst on pst.id = ps.placeStatusTypeId
where p.typeId in (1, 2, 5, 6, 8, 9)
group by p.id, p.code, pst.code
order by p.code;

-- Place status type
SELECT * FROM cbwms.placestatustype;