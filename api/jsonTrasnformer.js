// Places types that we might use
const PLACE_TYPE_BUFFER = 9;
const PLACE_TYPE_DOCK = 8;
const PLACE_TYPE_LOCATION = 6;
const PLACE_TYPE_USER = 3;
const PLACE_TYPE_SHELF = 5;

function jsonConvert (warehouseCode, whJson, usersJson) {
    let result = [];

    const wh = whJson.find(item => item.code === warehouseCode);
    const places = extractChilds(wh.id, whJson);
    const usersList = extractUsers(wh.id, usersJson, whJson);

    // Exlcude shelves before concatenating
    result = result.concat(places.filter(item => item.placeTypeCode !== 'Shelf'), usersList);

    const groupedLocations = groupLocations(result.filter(item => item.placeTypeCode === 'Location'));

    // Filter out 'Location' and 'Shelf' items before final concatenation
    result = result.filter(item => item.placeTypeCode !== 'Location' && item.placeTypeCode !== 'Shelf').concat(groupedLocations);

    return result;
}

// Determine if a place type should be shown on the map
function showInMap (typeId) {
    return typeId === PLACE_TYPE_BUFFER || typeId === PLACE_TYPE_DOCK ||
        typeId === PLACE_TYPE_LOCATION || typeId === PLACE_TYPE_USER || typeId === PLACE_TYPE_SHELF;
}

// Recursively extract child places of a given parent
function extractChilds (parentId, whJson) {
    const result = [];
    const childs = whJson.filter(item => item.parentId === parentId);

    result.push(...childs);

    // Recursively add children of children
    childs.forEach(child => {
        const childChildren = extractChilds(child.id, whJson);
        result.push(...childChildren);
    });

    return result;
}

// Extract users that are children of a given parent place
function extractUsers (parentId, whUsers, whJson){
    let result = [];

    const usersWithParent = whUsers.filter(user => user.parentId === parentId);
    result.push(...usersWithParent);
    const childPlaces = whJson.filter(place => place.parentId === parentId);
    childPlaces.forEach(child => {

        if (showInMap(child.typeId)) {
            const childUsers = extractUsers(child.id, whUsers, whJson);
            result.push(...childUsers);
        }
    });
    return result;
}

// Group locations that share the same coordinates X - Z and type
function groupLocations(locations) {
    const groupedLocations = [];

    locations.forEach(location => {
        const existingGroup = groupedLocations.find(group =>
            group.x === location.x &&
            group.z === location.z &&
            group.typeId === location.typeId
        );

        if (existingGroup) {
            existingGroup.locations.push(location);
            if (location.status) {
                existingGroup.status = existingGroup.status || [];
                location.status.forEach(status => {
                    if (!existingGroup.status.some(s => s.id === status.id)) {
                        existingGroup.status.push(status);
                    }
                });
            }
        } else {
            groupedLocations.push({
                status: location.status ? [...location.status] : undefined,
                x: location.x,
                z: location.z,
                typeId: location.typeId,
                locations: [location]
            });
        }
    });

    return groupedLocations;
}

module.exports = {
    jsonConvert
};
