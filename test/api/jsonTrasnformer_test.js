/**
 * mocha test/api/jsonTrasnformer_test.js
 */ 
const expect = require('chai').expect;
const jsonConverter = require('../../api/jsonTrasnformer.js');
const WAREHOUSE_3SHELF = require('../data/warehouse3Shelfs.json');
const WAREHOUSE_NESTED = require('../data/nested_warehouse.json');
const WAREHOUSE_MULTIPLE = require('../data/multiple_warehouses.json');
const users = require('../../data/users.json');

describe('Testing transformation of original WAREHOUSE_3SHELF to 2D map representation', () => {
    it('Should return 6 locations for a simple WAREHOUSE_3SHELF', () => {
        const result = jsonConverter.jsonConvert('WH', WAREHOUSE_3SHELF, users);
        const locations = result.filter(item => item.typeId === 6);
        expect(locations).to.have.lengthOf(6);
    });

    it('Should return 1 DOCK and 1 Buffer for a simple WAREHOUSE_3SHELF', () => {
        const result = jsonConverter.jsonConvert('WH', WAREHOUSE_3SHELF, users);
        const docks = result.filter(item => item.typeId === 8);
        expect(docks).to.have.lengthOf(1);

        const buffers = result.filter(item => item.typeId === 9);
        expect(buffers).to.have.lengthOf(1);
    });

    it('Must not return shelves as children of WH in WAREHOUSE_3SHELF', () => {
        const result = jsonConverter.jsonConvert('WH', WAREHOUSE_3SHELF, users);
        const shelves = result.filter(item => item.typeId === 5);
        expect(shelves.length).to.equal(0);
    });

    it('Should include only valid users in the result for WAREHOUSE_3SHELF', () => {
        const result = jsonConverter.jsonConvert('WH', WAREHOUSE_3SHELF, users);
        const userCodes = users.map(user => user.code);
        result.filter(item => item.typeId === 3).forEach(user => {
            expect(userCodes).to.include(user.code);
        });
    });

    it('Should have valid status for all places', () => {
        const warehouses = [WAREHOUSE_3SHELF];  // Assuming WAREHOUSE_3SHELF is an array of warehouse data
        warehouses.forEach(warehouse => {
            const result = jsonConverter.jsonConvert('WH', warehouse, users);
            result.forEach(item => {
                if (item.locations) {
                    item.locations.forEach(location => {
                        if (location.status) {
                            location.status.forEach(status => {
                                expect(status).to.have.property('id');
                            });
                        }
                    });
                }
            });
        });
    });

});

describe('Testing transformation of warehouses in WAREHOUSE_NESTED', () => {
    it('Must return WH2 as a child of WH in WAREHOUSE_NESTED', () => {
        const result = jsonConverter.jsonConvert('WH', WAREHOUSE_NESTED, users);

        const wh2 = result.find(item => item.code === 'WH2');
        expect(wh2).to.exist;

        if (wh2) {
            const warehouse = WAREHOUSE_NESTED.find(item => item.code === 'WH');
            expect(wh2.parentId).to.equal(warehouse.id);
        } else {
            assert.fail('WH2 not found in the result');
        }
    });

    it('Should not return any shelves as children of WH in WAREHOUSE_NESTED', () => {
        const result = jsonConverter.jsonConvert('WH', WAREHOUSE_NESTED, users);
        const shelves = result.filter(item => item.placeTypeCode === 'Shelf' && item.parentId === 1002);
        expect(shelves.length).to.equal(0);
    });

    it('Should return all locations with correct subtypeIds in WAREHOUSE_NESTED', () => {
        const result = jsonConverter.jsonConvert('WH', WAREHOUSE_NESTED, users);
        const locationGroups = result.filter(item => Array.isArray(item.locations));
        const allLocations = locationGroups.flatMap(group => group.locations);
        expect(allLocations.every(location => location.placeTypeCode === 'Location')).to.be.true;
        expect(allLocations.every(location => location.subtypeId !== 'NULL')).to.be.true;
    });

    it('Should return buffers and docks with correct coordinates in WAREHOUSE_NESTED', () => {
        const result = jsonConverter.jsonConvert('WH', WAREHOUSE_NESTED, users);
        const buffersAndDocks = result.filter(item => item.placeTypeCode === 'Buffer' || item.placeTypeCode === 'Dock');
        expect(buffersAndDocks.every(place => place.x !== 'NULL' && place.z !== 'NULL')).to.be.true;
    });


});

describe('Testing transformation of warehouses in WAREHOUSE_MULTIPLE', () => {
    it('Must return WH2 as a child of Organization in MULTIPLE_WAREHOUSE', () => {
        const organization = WAREHOUSE_NESTED.find(item => item.code === 'Organization', users);
        expect(organization).to.exist;
        if (organization) {
            const result = jsonConverter.jsonConvert(organization.code, WAREHOUSE_MULTIPLE, users);
            const wh2 = result.find(item => item.code === 'WH2');
            expect(wh2).to.exist;
        }
    });
    it('Should return the exact number of location of WH in WAREHOUSE_MULTIPLE', () => {
        const result = jsonConverter.jsonConvert('WH', WAREHOUSE_MULTIPLE, users);
        const locationObjects = result.filter(item => Array.isArray(item.locations));

        const locationCount = locationObjects.reduce((count, item) => {
            return count + item.locations.filter(location => location.placeTypeCode === 'Location').length;
        }, 0);

        expect(locationCount).to.equal(6);
    });

    it('Should return the exact number of location of WH2 in WAREHOUSE_MULTIPLE', () => {
        const result = jsonConverter.jsonConvert('WH2', WAREHOUSE_MULTIPLE, users);
        const locationObjects = result.filter(item => Array.isArray(item.locations));

        const locationCount = locationObjects.reduce((count, item) => {
            return count + item.locations.filter(location => location.placeTypeCode === 'Location').length;
        }, 0);

        expect(locationCount).to.equal(12);
    });

    it('Should return the exact children of warehouse WH2 in WAREHOUSE_MULTIPLE', () => {
        const result = jsonConverter.jsonConvert('WH2', WAREHOUSE_MULTIPLE, users);
        const expectedChildrenLength = 7;
        expect(result).to.have.lengthOf(expectedChildrenLength);
    });
});


describe('General tests for all warehouses', () => {
    it('Should have valid coordinates for all locations in all warehouses', () => {
        const warehouses = [
            { name: 'WAREHOUSE_3SHELF', data: WAREHOUSE_3SHELF, user: users },
            { name: 'WAREHOUSE_NESTED', data: WAREHOUSE_NESTED, user: users },
            { name: 'WAREHOUSE_MULTIPLE', data: WAREHOUSE_MULTIPLE, user: users }
        ];

        warehouses.forEach(warehouse => {
            const result = jsonConverter.jsonConvert('WH', warehouse.data, warehouse.user);
            const locationGroups = result.filter(item => Array.isArray(item.locations));
            locationGroups.forEach(group => {
                group.locations.forEach(location => {
                    expect(typeof location.x).to.equal('number');
                    expect(typeof location.y).to.equal('number');
                    expect(typeof location.z).to.equal('number');
                });
            });
        });
    });

    it('Transformed data of all warehouses should handle special cases properly', () => {
        const warehouses = [
            { name: 'WAREHOUSE_3SHELF', code: 'WH', data: WAREHOUSE_3SHELF, user: users },
            { name: 'WAREHOUSE_NESTED', code: 'WH', data: WAREHOUSE_NESTED, user: users },
            { name: 'WAREHOUSE_MULTIPLE', code: 'WH', data: WAREHOUSE_MULTIPLE, user: users },
            { name: 'WAREHOUSE_MULTIPLE', code: 'WH2', data: WAREHOUSE_MULTIPLE, user: users }
        ];

        warehouses.forEach(warehouse => {
            const result = jsonConverter.jsonConvert(warehouse.code, warehouse.data, warehouse.user);
            const locationGroups = result.filter(item => Array.isArray(item.locations));
            locationGroups.forEach(group => {
                expect(group.x).to.not.equal('NULL');
                expect(group.z).to.not.equal('NULL');
                group.locations.forEach(location => {
                    expect(location.y).to.not.equal('NULL');
                });
            });
        });
    });

    it('Should check that no duplicate location codes exist within the same warehouse', () => {
        const warehouses = [
            { name: 'WAREHOUSE_3SHELF', code: 'WH', data: WAREHOUSE_3SHELF, user: users },
            { name: 'WAREHOUSE_NESTED', code: 'WH', data: WAREHOUSE_NESTED, user: users },
            { name: 'WAREHOUSE_MULTIPLE', code: 'WH', data: WAREHOUSE_MULTIPLE, user: users },
            { name: 'WAREHOUSE_MULTIPLE', code: 'WH2', data: WAREHOUSE_MULTIPLE, user: users }
        ];

        warehouses.forEach(warehouse => {
            const result = jsonConverter.jsonConvert(warehouse.code, warehouse.data, warehouse.user);
            const locationGroups = result.filter(item => Array.isArray(item.locations));
            const allLocationCodes = locationGroups.flatMap(group => group.locations.map(location => location.code));
            const uniqueLocationCodes = new Set(allLocationCodes);
            expect(uniqueLocationCodes.size).to.equal(allLocationCodes.length);
        });
    });

    it('Should have valid placeTypeCode for all places', () => {
        const warehouses = [
            { name: 'WAREHOUSE_3SHELF', code: 'WH', data: WAREHOUSE_3SHELF, user: users },
            { name: 'WAREHOUSE_NESTED', code: 'WH', data: WAREHOUSE_NESTED, user: users },
            { name: 'WAREHOUSE_MULTIPLE', code: 'WH', data: WAREHOUSE_MULTIPLE, user: users },
            { name: 'WAREHOUSE_MULTIPLE', code: 'WH2', data: WAREHOUSE_MULTIPLE, user: users }
        ];

        warehouses.forEach(warehouse => {
            const result = jsonConverter.jsonConvert(warehouse.code, warehouse.data, warehouse.user);
            result.forEach(item => {
                if (item.locations) { // Check if locations array exists
                    item.locations.forEach(location => {
                        expect(location.placeTypeCode).to.be.oneOf(['Buffer', 'Dock', 'Location', 'User']);
                    });
                }
            });
        });
    });


    

});

